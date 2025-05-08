<template>
  <div class="system-logs">
    <div class="section-header">
      <h2>系统日志</h2>
      <div class="header-actions">
        <BaseButton
          variant="outline"
          size="small"
          @click="exportLogs"
        >
          导出日志
        </BaseButton>
        <BaseButton
          variant="outline"
          size="small"
          @click="refreshLogs"
          :loading="loading"
        >
          刷新
        </BaseButton>
      </div>
    </div>
    
    <div class="filters">
      <div class="search-box">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="搜索日志内容..." 
          class="search-input"
          @keyup.enter="fetchLogs"
        />
        <span class="search-icon">🔍</span>
        <BaseButton
          size="small"
          variant="primary"
          @click="fetchLogs"
          class="search-btn"
        >
          搜索
        </BaseButton>
      </div>
      
      <div class="filter-options">
        <div class="filter-group">
          <label>日志类型</label>
          <select v-model="filters.type" class="filter-select">
            <option value="">全部类型</option>
            <option value="error">错误</option>
            <option value="warning">警告</option>
            <option value="info">信息</option>
            <option value="system">系统</option>
            <option value="security">安全</option>
          </select>
        </div>
        <div class="filter-group">
          <label>操作用户</label>
          <select v-model="filters.user" class="filter-select">
            <option value="">全部用户</option>
            <option value="system">系统</option>
            <option value="admin">管理员</option>
            <option value="user1">用户1</option>
            <option value="designer1">设计师1</option>
          </select>
        </div>
        <div class="filter-group">
          <label>时间范围</label>
          <select v-model="filters.timeRange" class="filter-select">
            <option value="today">今天</option>
            <option value="yesterday">昨天</option>
            <option value="week">最近7天</option>
            <option value="month">最近30天</option>
            <option value="custom">自定义</option>
          </select>
        </div>
        <BaseButton
          variant="outline"
          size="small"
          @click="resetFilters"
          class="reset-btn"
        >
          重置筛选
        </BaseButton>
      </div>
      
      <div v-if="filters.timeRange === 'custom'" class="date-range">
        <div class="date-input">
          <label>开始日期</label>
          <input type="date" v-model="filters.startDate" />
        </div>
        <div class="date-input">
          <label>结束日期</label>
          <input type="date" v-model="filters.endDate" />
        </div>
      </div>
    </div>
    
    <div class="logs-container">
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>加载日志中...</p>
      </div>
      
      <div v-else-if="logs.length === 0" class="empty-state">
        <div class="empty-icon">📋</div>
        <p>没有找到符合条件的日志记录</p>
        <BaseButton @click="resetFilters" variant="outline" size="small">
          清除筛选条件
        </BaseButton>
      </div>
      
      <div v-else class="logs-list">
        <div 
          v-for="log in logs" 
          :key="log.id" 
          class="log-item"
          :class="[`log-${log.type}`]"
        >
          <div class="log-header">
            <div class="log-type" :class="log.type">
              {{ getLogTypeText(log.type) }}
            </div>
            <div class="log-time">
              {{ formatDate(log.timestamp) }}
            </div>
          </div>
          <div class="log-content">
            <div class="log-message">{{ log.message }}</div>
            <div class="log-details">
              <span class="detail-item">
                <strong>操作者:</strong> {{ log.user }}
              </span>
              <span class="detail-item">
                <strong>IP地址:</strong> {{ log.ip }}
              </span>
              <span class="detail-item">
                <strong>模块:</strong> {{ log.module }}
              </span>
            </div>
            <div v-if="log.details" class="log-extra">
              <button 
                class="toggle-details" 
                @click="log.showDetails = !log.showDetails"
              >
                {{ log.showDetails ? '收起详情' : '查看详情' }}
              </button>
              <pre v-if="log.showDetails" class="details-content">{{ formatDetails(log.details) }}</pre>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="logs.length > 0" class="pagination">
        <div class="page-info">
          共 {{ totalItems }} 条日志，当前显示 {{ (currentPage - 1) * pageSize + 1 }}-{{ Math.min(currentPage * pageSize, totalItems) }} 条
        </div>
        <div class="page-controls">
          <button 
            class="pagination-btn" 
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
          >
            上一页
          </button>
          
          <button 
            v-for="page in displayedPages" 
            :key="page"
            class="page-number" 
            :class="{ active: currentPage === page, disabled: page === '...' }"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
          
          <button 
            class="pagination-btn" 
            :disabled="currentPage === totalPages"
            @click="goToPage(currentPage + 1)"
          >
            下一页
          </button>
        </div>
        <div class="page-size-control">
          <select v-model="pageSize" @change="changePage()">
            <option value="10">10条/页</option>
            <option value="20">20条/页</option>
            <option value="50">50条/页</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import BaseButton from '../BaseButton.vue'

export default {
  name: 'SystemLogs',
  components: {
    BaseButton
  },
  setup() {
    const logs = ref([])
    const loading = ref(false)
    const searchQuery = ref('')
    const totalItems = ref(0)
    const currentPage = ref(1)
    const pageSize = ref(20)
    const totalPages = ref(1)
    
    // 筛选条件
    const filters = reactive({
      type: '',
      user: '',
      timeRange: 'month',
      startDate: '',
      endDate: ''
    })
    
    // 设置默认日期范围
    const setupDefaultDates = () => {
      const now = new Date()
      const lastMonth = new Date(now)
      lastMonth.setDate(now.getDate() - 30)
      
      filters.startDate = formatDateForInput(lastMonth)
      filters.endDate = formatDateForInput(now)
    }
    
    // 格式化日期为input日期格式
    const formatDateForInput = (date) => {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }
    
    // 初始化
    onMounted(() => {
      setupDefaultDates()
      fetchLogs()
    })
    
    // 监听筛选条件变化
    watch([filters.type, filters.user, filters.timeRange, filters.startDate, filters.endDate], () => {
      if (filters.timeRange !== 'custom') {
        updateDateRangeFromPreset()
      }
      currentPage.value = 1
    })
    
    // 根据预设更新日期范围
    const updateDateRangeFromPreset = () => {
      const now = new Date()
      let startDate = new Date(now)
      
      switch (filters.timeRange) {
        case 'today':
          startDate.setHours(0, 0, 0, 0)
          break
        case 'yesterday':
          startDate.setDate(now.getDate() - 1)
          startDate.setHours(0, 0, 0, 0)
          break
        case 'week':
          startDate.setDate(now.getDate() - 7)
          break
        case 'month':
          startDate.setDate(now.getDate() - 30)
          break
        default:
          break
      }
      
      filters.startDate = formatDateForInput(startDate)
      filters.endDate = formatDateForInput(now)
    }
    
    // 显示的页码
    const displayedPages = computed(() => {
      const total = totalPages.value
      const current = currentPage.value
      
      if (total <= 7) {
        return Array.from({ length: total }, (_, i) => i + 1)
      }
      
      if (current <= 3) {
        return [1, 2, 3, 4, '...', total]
      }
      
      if (current >= total - 2) {
        return [1, '...', total - 3, total - 2, total - 1, total]
      }
      
      return [1, '...', current - 1, current, current + 1, '...', total]
    })
    
    // 分页跳转
    const goToPage = (page) => {
      if (page === '...' || page < 1 || page > totalPages.value) return
      
      currentPage.value = page
      fetchLogs()
    }
    
    // 加载日志数据
    const fetchLogs = async () => {
      loading.value = true
      
      try {
        // 模拟API请求延迟
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 生成日志数据
        generateMockLogs()
      } catch (error) {
        console.error('获取日志数据失败', error)
      } finally {
        loading.value = false
      }
    }
    
    // 导出日志
    const exportLogs = () => {
      alert('日志导出功能将在实际场景中实现，可导出为CSV、Excel等格式')
    }
    
    // 重置筛选条件
    const resetFilters = () => {
      filters.type = ''
      filters.user = ''
      filters.timeRange = 'month'
      updateDateRangeFromPreset()
      currentPage.value = 1
      fetchLogs()
    }
    
    // 刷新日志
    const refreshLogs = () => {
      fetchLogs()
    }
    
    // 改变每页显示数量
    const changePage = () => {
      currentPage.value = 1
      fetchLogs()
    }
    
    // 获取日志类型文本
    const getLogTypeText = (type) => {
      const typeMap = {
        'error': '错误',
        'warning': '警告',
        'info': '信息',
        'system': '系统',
        'security': '安全'
      }
      return typeMap[type] || type
    }
    
    // 格式化日期
    const formatDate = (timestamp) => {
      const date = new Date(timestamp)
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    }
    
    // 格式化详情数据
    const formatDetails = (details) => {
      if (typeof details === 'object') {
        return JSON.stringify(details, null, 2)
      }
      return details
    }
    
    // 生成模拟日志数据
    const generateMockLogs = () => {
      // 实际应用中，这里会从API获取数据
      // 这里生成模拟数据
      const types = ['error', 'warning', 'info', 'system', 'security']
      const users = ['系统', '管理员', '用户1', '设计师1']
      const modules = ['用户管理', '系统设置', 'AI设置', '模型训练', '认证', '权限']
      const messages = [
        '用户登录成功',
        '权限不足，操作被拒绝',
        '系统设置已更新',
        '模型训练任务已完成',
        '用户密码修改成功',
        '系统备份已完成',
        '连续多次登录失败，账号已锁定',
        'API密钥已更新',
        '新用户注册',
        '文件上传失败'
      ]
      
      // 模拟根据筛选条件过滤
      const mockTotalSize = 135 // 模拟总记录数
      const pageStart = (currentPage.value - 1) * pageSize.value
      
      totalItems.value = mockTotalSize
      totalPages.value = Math.ceil(mockTotalSize / pageSize.value)
      
      // 生成当前页的日志数据
      const mockLogs = []
      for (let i = 0; i < Math.min(pageSize.value, mockTotalSize - pageStart); i++) {
        const randomType = types[Math.floor(Math.random() * types.length)]
        
        // 应用筛选条件
        if (filters.type && filters.type !== randomType) continue
        
        const randomUser = users[Math.floor(Math.random() * users.length)]
        if (filters.user && filters.user !== randomUser) continue
        
        // 生成随机日期
        const now = new Date()
        const randomDaysAgo = Math.floor(Math.random() * 60) // 最多60天内的日志
        const randomDate = new Date(now)
        randomDate.setDate(now.getDate() - randomDaysAgo)
        
        // 检查日期范围
        const startDate = filters.startDate ? new Date(filters.startDate) : null
        const endDate = filters.endDate ? new Date(filters.endDate) : null
        
        if (startDate && randomDate < startDate) continue
        if (endDate) {
          const endDateLimit = new Date(endDate)
          endDateLimit.setHours(23, 59, 59, 999)
          if (randomDate > endDateLimit) continue
        }
        
        // 生成日志项
        mockLogs.push({
          id: `log-${Date.now()}-${i}`,
          type: randomType,
          timestamp: randomDate.getTime(),
          message: messages[Math.floor(Math.random() * messages.length)],
          user: randomUser,
          ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          module: modules[Math.floor(Math.random() * modules.length)],
          details: randomType === 'error' || Math.random() > 0.7 ? {
            requestData: { param1: 'value1', param2: 'value2' },
            additionalInfo: 'Some additional information about this log entry'
          } : null,
          showDetails: false
        })
      }
      
      // 应用搜索过滤
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        logs.value = mockLogs.filter(log => 
          log.message.toLowerCase().includes(query) || 
          log.user.toLowerCase().includes(query) ||
          log.module.toLowerCase().includes(query)
        )
      } else {
        logs.value = mockLogs
      }
      
      // 如果没有数据，可能是因为过滤条件过于严格
      if (logs.value.length === 0 && mockLogs.length === 0) {
        // 实际应用中，这里应当重新请求更多数据或提示用户放宽过滤条件
        totalItems.value = 0
        totalPages.value = 1
      }
    }
    
    return {
      logs,
      loading,
      searchQuery,
      filters,
      totalItems,
      currentPage,
      pageSize,
      totalPages,
      displayedPages,
      goToPage,
      fetchLogs,
      exportLogs,
      resetFilters,
      refreshLogs,
      changePage,
      getLogTypeText,
      formatDate,
      formatDetails
    }
  }
}
</script>

<style scoped>
.system-logs {
  width: 100%;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--text-color);
}

.header-actions {
  display: flex;
  gap: 12px;
}

.filters {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
  padding: 16px;
  background-color: var(--bg-card);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.search-input {
  flex: 1;
  padding: 10px 12px 10px 36px;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  font-size: 14px;
  background-color: var(--bg-color);
  color: var(--text-color);
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.1);
}

.search-icon {
  position: absolute;
  margin-left: 12px;
  color: var(--text-secondary);
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filter-group label {
  font-size: 13px;
  color: var(--text-secondary);
}

.filter-select {
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  background-color: var(--bg-color);
  color: var(--text-color);
  font-size: 14px;
  min-width: 120px;
}

.reset-btn {
  align-self: flex-end;
}

.date-range {
  display: flex;
  gap: 16px;
}

.date-input {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.date-input label {
  font-size: 13px;
  color: var(--text-secondary);
}

.date-input input {
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  background-color: var(--bg-color);
  color: var(--text-color);
  font-size: 14px;
}

.logs-container {
  background-color: var(--bg-card);
  border-radius: 8px;
  border: 1px solid var(--border-color);
  overflow: hidden;
}

.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  color: var(--text-secondary);
}

.loading-spinner {
  width: 36px;
  height: 36px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: var(--primary-color);
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.logs-list {
  display: flex;
  flex-direction: column;
}

.log-item {
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
  transition: background-color 0.2s;
}

.log-item:last-child {
  border-bottom: none;
}

.log-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.log-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  align-items: center;
}

.log-type {
  display: inline-block;
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 4px;
  font-weight: 500;
}

.log-type.error {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.log-type.warning {
  background-color: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.log-type.info {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.log-type.system {
  background-color: rgba(79, 70, 229, 0.1);
  color: #4f46e5;
}

.log-type.security {
  background-color: rgba(6, 182, 212, 0.1);
  color: #06b6d4;
}

.log-time {
  font-size: 13px;
  color: var(--text-secondary);
}

.log-message {
  margin-bottom: 8px;
  font-weight: 500;
}

.log-details {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 13px;
  color: var(--text-secondary);
}

.log-extra {
  margin-top: 12px;
}

.toggle-details {
  background: none;
  border: none;
  font-size: 13px;
  color: var(--primary-color);
  cursor: pointer;
  padding: 0;
}

.details-content {
  margin-top: 8px;
  padding: 12px;
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: 6px;
  font-size: 13px;
  overflow-x: auto;
  max-height: 200px;
  white-space: pre-wrap;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-top: 1px solid var(--border-color);
  font-size: 14px;
}

.page-info {
  color: var(--text-secondary);
}

.page-controls {
  display: flex;
  gap: 4px;
}

.pagination-btn, .page-number {
  min-width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  border: 1px solid var(--border-color);
  background-color: var(--bg-color);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled),
.page-number:hover:not(.active):not(.disabled) {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.page-number.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.pagination-btn:disabled,
.page-number.disabled {
  cursor: default;
  opacity: 0.5;
}

.page-size-control select {
  padding: 6px 8px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--bg-color);
  font-size: 14px;
}

.log-error {
  border-left: 3px solid #ef4444;
}

.log-warning {
  border-left: 3px solid #f59e0b;
}

.log-info {
  border-left: 3px solid #10b981;
}

.log-system {
  border-left: 3px solid #4f46e5;
}

.log-security {
  border-left: 3px solid #06b6d4;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .header-actions, .search-box, .filter-options, .date-range {
    flex-direction: column;
    width: 100%;
  }
  
  .search-btn {
    align-self: stretch;
  }
  
  .filter-group, .date-input {
    width: 100%;
  }
  
  .filter-select, .date-input input {
    width: 100%;
  }
  
  .pagination {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .page-controls {
    order: 1;
    justify-content: center;
  }
  
  .page-info {
    order: 3;
    text-align: center;
  }
  
  .page-size-control {
    order: 2;
    text-align: center;
  }
  
  .page-size-control select {
    width: 100%;
    max-width: 200px;
  }
}
</style>