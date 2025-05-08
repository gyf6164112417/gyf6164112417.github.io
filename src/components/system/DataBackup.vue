<template>
  <div class="data-backup">
    <div class="section-header">
      <h2>数据备份</h2>
      <div class="header-actions">
        <BaseButton 
          variant="primary" 
          size="small"
          @click="createBackup"
          :loading="creating"
        >
          创建备份
        </BaseButton>
      </div>
    </div>
    
    <div class="backup-container">
      <div class="backup-options">
        <BaseCard class="options-card">
          <template #header>
            <div class="card-header-title">
              <span class="header-icon">💾</span>
              <h3>备份选项</h3>
            </div>
          </template>
          
          <div class="backup-form">
            <div class="form-group">
              <label>备份内容</label>
              <div class="checkbox-group">
                <div class="checkbox-item">
                  <input type="checkbox" id="backupDb" v-model="backupOptions.database" />
                  <label for="backupDb">数据库</label>
                </div>
                <div class="checkbox-item">
                  <input type="checkbox" id="backupFiles" v-model="backupOptions.files" />
                  <label for="backupFiles">上传文件</label>
                </div>
                <div class="checkbox-item">
                  <input type="checkbox" id="backupSettings" v-model="backupOptions.settings" />
                  <label for="backupSettings">系统设置</label>
                </div>
                <div class="checkbox-item">
                  <input type="checkbox" id="backupLogs" v-model="backupOptions.logs" />
                  <label for="backupLogs">系统日志</label>
                </div>
              </div>
            </div>
            
            <div class="form-group">
              <label for="backupName">备份名称</label>
              <input
                type="text"
                id="backupName"
                v-model="backupOptions.name"
                placeholder="备份名称（可选）"
              />
            </div>
            
            <div class="form-group">
              <label for="backupDesc">备份描述</label>
              <textarea
                id="backupDesc"
                v-model="backupOptions.description"
                placeholder="备份描述（可选）"
                rows="3"
              ></textarea>
            </div>
            
            <div class="form-group">
              <div class="toggle-switch">
                <input
                  type="checkbox"
                  id="compressBackup"
                  v-model="backupOptions.compress"
                />
                <label for="compressBackup" class="toggle-label"></label>
                <span class="toggle-text">压缩备份文件</span>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
      
      <div class="backup-history">
        <BaseCard>
          <template #header>
            <div class="card-header-title">
              <span class="header-icon">📋</span>
              <h3>备份历史</h3>
            </div>
          </template>
          
          <div v-if="loading" class="loading-state">
            <div class="loading-spinner"></div>
            <p>加载备份历史中...</p>
          </div>
          
          <div v-else-if="backups.length === 0" class="empty-state">
            <div class="empty-icon">💾</div>
            <p>暂无备份记录</p>
            <p class="empty-hint">点击"创建备份"按钮创建您的第一个备份</p>
          </div>
          
          <div v-else class="backup-list">
            <div
              v-for="backup in backups"
              :key="backup.id"
              class="backup-item"
            >
              <div class="backup-info">
                <div class="backup-name">
                  {{ backup.name || `备份-${formatDate(backup.createdAt, 'short')}` }}
                </div>
                <div class="backup-meta">
                  <span class="backup-date">{{ formatDate(backup.createdAt) }}</span>
                  <span class="backup-size">{{ formatSize(backup.size) }}</span>
                </div>
                <div v-if="backup.description" class="backup-desc">
                  {{ backup.description }}
                </div>
                <div class="backup-content">
                  <span 
                    v-for="(included, type) in backup.content" 
                    :key="type"
                    v-show="included"
                    class="content-tag"
                  >
                    {{ getContentLabel(type) }}
                  </span>
                </div>
              </div>
              
              <div class="backup-actions">
                <button 
                  class="action-btn restore" 
                  title="恢复备份"
                  @click="confirmRestore(backup)"
                >
                  🔄
                </button>
                <button 
                  class="action-btn download" 
                  title="下载备份"
                  @click="downloadBackup(backup)"
                >
                  ⬇️
                </button>
                <button 
                  class="action-btn delete" 
                  title="删除备份"
                  @click="confirmDelete(backup)"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
    
    <!-- 恢复确认模态框 -->
    <BaseModal
      v-if="showRestoreModal"
      title="恢复备份"
      @close="showRestoreModal = false"
    >
      <div class="confirm-modal">
        <p>您确定要恢复此备份吗？</p>
        <p class="warning">恢复备份将覆盖当前数据，此操作不可逆！</p>
        
        <div class="checkbox-item warning-check">
          <input type="checkbox" id="confirmRestore" v-model="restoreConfirmed" />
          <label for="confirmRestore">我已了解恢复备份的风险，并已做好准备</label>
        </div>
        
        <div class="modal-actions">
          <BaseButton
            variant="outline"
            @click="showRestoreModal = false"
          >
            取消
          </BaseButton>
          <BaseButton
            variant="danger"
            :disabled="!restoreConfirmed"
            :loading="restoring"
            @click="restoreBackup"
          >
            恢复备份
          </BaseButton>
        </div>
      </div>
    </BaseModal>
    
    <!-- 删除确认模态框 -->
    <BaseModal
      v-if="showDeleteModal"
      title="删除备份"
      @close="showDeleteModal = false"
    >
      <div class="confirm-modal">
        <p>您确定要删除此备份吗？</p>
        <p class="warning">删除后将无法恢复！</p>
        
        <div class="modal-actions">
          <BaseButton
            variant="outline"
            @click="showDeleteModal = false"
          >
            取消
          </BaseButton>
          <BaseButton
            variant="danger"
            :loading="deleting"
            @click="deleteBackup"
          >
            删除备份
          </BaseButton>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import BaseButton from '../BaseButton.vue'
import BaseCard from '../BaseCard.vue'
import BaseModal from '../BaseModal.vue'

export default {
  name: 'DataBackup',
  components: {
    BaseButton,
    BaseCard,
    BaseModal
  },
  setup() {
    const backups = ref([])
    const loading = ref(true)
    const creating = ref(false)
    const restoring = ref(false)
    const deleting = ref(false)
    
    const restoreConfirmed = ref(false)
    const showRestoreModal = ref(false)
    const showDeleteModal = ref(false)
    const selectedBackup = ref(null)
    
    // 备份选项
    const backupOptions = reactive({
      database: true,
      files: true,
      settings: true,
      logs: false,
      name: '',
      description: '',
      compress: true
    })
    
    // 获取备份列表
    const fetchBackups = async () => {
      loading.value = true
      
      try {
        // 模拟API请求延迟
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 模拟备份数据
        backups.value = [
          {
            id: 'backup-1',
            name: '每周备份',
            description: '自动创建的每周备份',
            createdAt: new Date(2023, 9, 25, 3, 0),
            size: 15 * 1024 * 1024, // 15MB
            content: {
              database: true,
              files: true,
              settings: true,
              logs: false
            }
          },
          {
            id: 'backup-2',
            name: '更新前备份',
            description: '系统更新前手动创建的备份',
            createdAt: new Date(2023, 9, 20, 14, 30),
            size: 12.5 * 1024 * 1024, // 12.5MB
            content: {
              database: true,
              files: true,
              settings: true,
              logs: false
            }
          },
          {
            id: 'backup-3',
            name: '',
            description: '',
            createdAt: new Date(2023, 9, 15, 9, 0),
            size: 10.2 * 1024 * 1024, // 10.2MB
            content: {
              database: true,
              files: false,
              settings: true,
              logs: false
            }
          }
        ]
      } catch (error) {
        console.error('获取备份列表失败', error)
      } finally {
        loading.value = false
      }
    }
    
    // 创建新备份
    const createBackup = async () => {
      // 验证备份选项
      if (!backupOptions.database && !backupOptions.files && 
          !backupOptions.settings && !backupOptions.logs) {
        alert('请至少选择一项备份内容')
        return
      }
      
      creating.value = true
      
      try {
        // 模拟API请求延迟
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // 模拟新备份
        const newBackup = {
          id: `backup-${Date.now()}`,
          name: backupOptions.name,
          description: backupOptions.description,
          createdAt: new Date(),
          size: Math.random() * 10 * 1024 * 1024 + 5 * 1024 * 1024, // 5-15MB
          content: {
            database: backupOptions.database,
            files: backupOptions.files,
            settings: backupOptions.settings,
            logs: backupOptions.logs
          }
        }
        
        // 添加到备份列表
        backups.value.unshift(newBackup)
        
        // 清空表单
        backupOptions.name = ''
        backupOptions.description = ''
        
        // 显示成功通知
        alert('备份创建成功')
      } catch (error) {
        console.error('创建备份失败', error)
        // 显示错误通知
        alert('创建备份失败，请稍后重试')
      } finally {
        creating.value = false
      }
    }
    
    // 确认恢复备份
    const confirmRestore = (backup) => {
      selectedBackup.value = backup
      restoreConfirmed.value = false
      showRestoreModal.value = true
    }
    
    // 恢复备份
    const restoreBackup = async () => {
      if (!restoreConfirmed.value || !selectedBackup.value) {
        return
      }
      
      restoring.value = true
      
      try {
        // 模拟API请求延迟
        await new Promise(resolve => setTimeout(resolve, 3000))
        
        // 显示成功通知
        alert('备份恢复成功，系统将在3秒后刷新')
        
        // 模拟页面刷新
        setTimeout(() => {
          showRestoreModal.value = false
        }, 3000)
      } catch (error) {
        console.error('恢复备份失败', error)
        // 显示错误通知
        alert('恢复备份失败，请稍后重试')
      } finally {
        restoring.value = false
      }
    }
    
    // 下载备份
    const downloadBackup = (backup) => {
      alert(`模拟下载备份：${backup.name || '未命名备份'}`)
    }
    
    // 确认删除备份
    const confirmDelete = (backup) => {
      selectedBackup.value = backup
      showDeleteModal.value = true
    }
    
    // 删除备份
    const deleteBackup = async () => {
      if (!selectedBackup.value) return
      
      deleting.value = true
      
      try {
        // 模拟API请求延迟
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 从列表中移除
        backups.value = backups.value.filter(b => b.id !== selectedBackup.value.id)
        
        // 关闭模态框
        showDeleteModal.value = false
        
        // 显示成功通知
        alert('备份已删除')
      } catch (error) {
        console.error('删除备份失败', error)
        // 显示错误通知
        alert('删除备份失败，请稍后重试')
      } finally {
        deleting.value = false
      }
    }
    
    // 格式化日期
    const formatDate = (date, format = 'full') => {
      if (format === 'short') {
        return new Date(date).toLocaleDateString('zh-CN')
      }
      
      return new Date(date).toLocaleString('zh-CN')
    }
    
    // 格式化文件大小
    const formatSize = (bytes) => {
      if (bytes < 1024) {
        return bytes + ' B'
      } else if (bytes < 1024 * 1024) {
        return (bytes / 1024).toFixed(1) + ' KB'
      } else if (bytes < 1024 * 1024 * 1024) {
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
      } else {
        return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB'
      }
    }
    
    // 获取内容类型标签
    const getContentLabel = (type) => {
      const labels = {
        database: '数据库',
        files: '文件',
        settings: '设置',
        logs: '日志'
      }
      
      return labels[type] || type
    }
    
    onMounted(() => {
      fetchBackups()
    })
    
    return {
      backups,
      loading,
      creating,
      restoring,
      deleting,
      backupOptions,
      showRestoreModal,
      showDeleteModal,
      restoreConfirmed,
      selectedBackup,
      fetchBackups,
      createBackup,
      confirmRestore,
      restoreBackup,
      downloadBackup,
      confirmDelete,
      deleteBackup,
      formatDate,
      formatSize,
      getContentLabel
    }
  }
}
</script>

<style scoped>
.data-backup {
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

.backup-container {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 24px;
}

.card-header-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-header-title h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.header-icon {
  font-size: 18px;
}

.backup-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 500;
  font-size: 14px;
  color: var(--text-color);
}

.checkbox-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.checkbox-item label {
  font-weight: normal;
  cursor: pointer;
}

input[type="text"],
textarea {
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  font-size: 14px;
  background-color: var(--bg-color);
  color: var(--text-color);
}

textarea {
  resize: vertical;
  min-height: 80px;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.1);
}

.toggle-switch {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toggle-switch input[type="checkbox"] {
  display: none;
}

.toggle-label {
  display: inline-block;
  width: 44px;
  height: 24px;
  background-color: var(--border-color);
  border-radius: 12px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s;
}

.toggle-label::after {
  content: '';
  position: absolute;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: white;
  top: 3px;
  left: 3px;
  transition: all 0.3s;
}

input[type="checkbox"]:checked + .toggle-label {
  background-color: var(--primary-color);
}

input[type="checkbox"]:checked + .toggle-label::after {
  left: 23px;
}

.toggle-text {
  font-size: 14px;
}

.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
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

.empty-hint {
  font-size: 14px;
  margin-top: 8px;
}

.backup-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.backup-item {
  display: flex;
  justify-content: space-between;
  padding: 16px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--bg-color);
}

.backup-info {
  flex: 1;
}

.backup-name {
  font-weight: 500;
  font-size: 16px;
  margin-bottom: 6px;
}

.backup-meta {
  display: flex;
  gap: 16px;
  color: var(--text-secondary);
  font-size: 13px;
  margin-bottom: 8px;
}

.backup-desc {
  font-size: 14px;
  margin-bottom: 8px;
  color: var(--text-color);
}

.backup-content {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.content-tag {
  display: inline-block;
  padding: 3px 8px;
  background-color: rgba(67, 97, 238, 0.1);
  color: var(--primary-color);
  border-radius: 4px;
  font-size: 12px;
}

.backup-actions {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.action-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.action-btn.restore:hover {
  color: #4f46e5;
}

.action-btn.download:hover {
  color: #10b981;
}

.action-btn.delete:hover {
  color: #ef4444;
}

.confirm-modal {
  padding: 16px;
  text-align: center;
}

.warning {
  color: #ef4444;
  margin: 16px 0;
  font-weight: 500;
}

.warning-check {
  margin: 24px 0;
  justify-content: center;
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .backup-container {
    grid-template-columns: 1fr;
  }
  
  .checkbox-group {
    grid-template-columns: 1fr;
  }
  
  .backup-item {
    flex-direction: column;
  }
  
  .backup-actions {
    margin-top: 16px;
    justify-content: flex-end;
  }
  
  .modal-actions {
    flex-direction: column-reverse;
    gap: 12px;
  }
}
</style>