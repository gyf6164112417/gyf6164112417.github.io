<template>
  <div class="user-management">
    <div class="section-header">
      <h2>用户管理</h2>
      <BaseButton @click="showAddUserModal = true" size="small">
        <template #icon>➕</template>
        添加用户
      </BaseButton>
    </div>

    <div class="filters">
      <div class="search-box">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="搜索用户名或邮箱..." 
          class="search-input"
        />
        <span class="search-icon">🔍</span>
      </div>
      
      <div class="filter-options">
        <select v-model="roleFilter" class="filter-select">
          <option value="">所有角色</option>
          <option value="admin">管理员</option>
          <option value="designer">设计师</option>
          <option value="user">普通用户</option>
        </select>
        
        <select v-model="statusFilter" class="filter-select">
          <option value="">所有状态</option>
          <option value="active">激活</option>
          <option value="inactive">未激活</option>
          <option value="locked">已锁定</option>
        </select>
      </div>
    </div>

    <div class="user-table-container">
      <table class="user-table">
        <thead>
          <tr>
            <th>用户头像</th>
            <th @click="sortBy('username')">
              用户名
              <span v-if="sortKey === 'username'" class="sort-icon">
                {{ sortOrder === 'asc' ? '▲' : '▼' }}
              </span>
            </th>
            <th @click="sortBy('email')">
              邮箱
              <span v-if="sortKey === 'email'" class="sort-icon">
                {{ sortOrder === 'asc' ? '▲' : '▼' }}
              </span>
            </th>
            <th @click="sortBy('role')">
              角色
              <span v-if="sortKey === 'role'" class="sort-icon">
                {{ sortOrder === 'asc' ? '▲' : '▼' }}
              </span>
            </th>
            <th @click="sortBy('lastLogin')">
              最后登录
              <span v-if="sortKey === 'lastLogin'" class="sort-icon">
                {{ sortOrder === 'asc' ? '▲' : '▼' }}
              </span>
            </th>
            <th @click="sortBy('status')">
              状态
              <span v-if="sortKey === 'status'" class="sort-icon">
                {{ sortOrder === 'asc' ? '▲' : '▼' }}
              </span>
            </th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading" class="loading-row">
            <td colspan="7" class="text-center">
              <div class="loading-spinner"></div>
              <p>加载中...</p>
            </td>
          </tr>
          <tr v-else-if="filteredUsers.length === 0" class="empty-row">
            <td colspan="7" class="text-center">
              没有找到符合条件的用户
            </td>
          </tr>
          <tr v-for="user in paginatedUsers" :key="user.id">
            <td>
              <div class="user-avatar">
                <img :src="user.avatar" alt="用户头像">
              </div>
            </td>
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>
              <span :class="'role-badge ' + user.role">
                {{ getRoleName(user.role) }}
              </span>
            </td>
            <td>{{ formatDate(user.lastLogin) }}</td>
            <td>
              <span :class="'status-badge ' + user.status">
                {{ getStatusText(user.status) }}
              </span>
            </td>
            <td>
              <div class="action-buttons">
                <button 
                  class="action-btn edit" 
                  title="编辑用户"
                  @click="editUser(user)"
                >
                  ✏️
                </button>
                <button 
                  class="action-btn" 
                  :class="user.status === 'locked' ? 'unlock' : 'lock'"
                  :title="user.status === 'locked' ? '解锁用户' : '锁定用户'"
                  @click="toggleUserLock(user)"
                >
                  {{ user.status === 'locked' ? '🔓' : '🔒' }}
                </button>
                <button 
                  class="action-btn delete" 
                  title="删除用户"
                  @click="confirmDelete(user)"
                >
                  🗑️
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination">
      <button 
        class="pagination-btn" 
        :disabled="currentPage === 1"
        @click="currentPage--"
      >
        上一页
      </button>
      
      <div class="page-numbers">
        <button 
          v-for="page in displayedPages" 
          :key="page"
          class="page-number" 
          :class="{ active: currentPage === page }"
          @click="currentPage = page"
        >
          {{ page }}
        </button>
      </div>
      
      <button 
        class="pagination-btn" 
        :disabled="currentPage === totalPages"
        @click="currentPage++"
      >
        下一页
      </button>
      
      <div class="page-size">
        <select v-model="pageSize">
          <option value="10">10条/页</option>
          <option value="20">20条/页</option>
          <option value="50">50条/页</option>
        </select>
      </div>
    </div>

    <!-- 添加用户模态框 -->
    <BaseModal 
      v-if="showAddUserModal" 
      title="添加新用户" 
      @close="showAddUserModal = false"
    >
      <UserForm 
        :user="newUser" 
        @submit="addUser"
        @cancel="showAddUserModal = false" 
      />
    </BaseModal>
    
    <!-- 编辑用户模态框 -->
    <BaseModal 
      v-if="showEditUserModal" 
      title="编辑用户信息" 
      @close="showEditUserModal = false"
    >
      <UserForm 
        :user="selectedUser" 
        :is-edit="true"
        @submit="updateUser"
        @cancel="showEditUserModal = false" 
      />
    </BaseModal>
    
    <!-- 确认删除模态框 -->
    <BaseModal 
      v-if="showDeleteModal" 
      title="确认删除" 
      @close="showDeleteModal = false"
    >
      <div class="delete-confirm">
        <p>您确定要删除用户 <strong>{{ selectedUser.username }}</strong> 吗？</p>
        <p class="warning">此操作不可逆，删除后数据无法恢复！</p>
        <div class="confirm-actions">
          <BaseButton 
            @click="showDeleteModal = false" 
            variant="outline"
          >
            取消
          </BaseButton>
          <BaseButton 
            @click="deleteUser" 
            variant="danger"
          >
            确认删除
          </BaseButton>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import BaseButton from '../BaseButton.vue'
import BaseModal from '../BaseModal.vue'
import UserForm from './UserForm.vue'

export default {
  name: 'UserManagement',
  components: {
    BaseButton,
    BaseModal,
    UserForm
  },
  setup() {
    const users = ref([])
    const loading = ref(true)
    const searchQuery = ref('')
    const roleFilter = ref('')
    const statusFilter = ref('')
    const sortKey = ref('username')
    const sortOrder = ref('asc')
    const currentPage = ref(1)
    const pageSize = ref(10)
    
    const showAddUserModal = ref(false)
    const showEditUserModal = ref(false)
    const showDeleteModal = ref(false)
    const selectedUser = ref({})
    
    const newUser = {
      username: '',
      email: '',
      password: '',
      role: 'user',
      status: 'inactive'
    }

    // 模拟获取用户数据
    const fetchUsers = async () => {
      loading.value = true
      try {
        // 模拟API请求延迟
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // 模拟数据
        users.value = [
          {
            id: 1,
            username: '管理员',
            email: 'admin@example.com',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
            role: 'admin',
            lastLogin: new Date(2023, 9, 15, 8, 30),
            status: 'active'
          },
          {
            id: 2,
            username: '设计师小王',
            email: 'designer@example.com',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=designer',
            role: 'designer',
            lastLogin: new Date(2023, 9, 14, 16, 45),
            status: 'active'
          },
          {
            id: 3,
            username: '普通用户1',
            email: 'user1@example.com',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
            role: 'user',
            lastLogin: new Date(2023, 9, 10, 12, 20),
            status: 'active'
          },
          {
            id: 4,
            username: '测试账号',
            email: 'test@example.com',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test',
            role: 'user',
            lastLogin: new Date(2023, 8, 25, 9, 15),
            status: 'locked'
          },
          {
            id: 5,
            username: '新用户',
            email: 'newuser@example.com',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=newuser',
            role: 'user',
            lastLogin: null,
            status: 'inactive'
          }
        ]

        // 生成更多测试数据
        for (let i = 6; i <= 30; i++) {
          const roles = ['admin', 'designer', 'user']
          const statuses = ['active', 'inactive', 'locked']
          
          users.value.push({
            id: i,
            username: `用户${i}`,
            email: `user${i}@example.com`,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`,
            role: roles[Math.floor(Math.random() * roles.length)],
            lastLogin: Math.random() > 0.2 ? new Date(2023, Math.floor(Math.random() * 10), Math.floor(Math.random() * 28)) : null,
            status: statuses[Math.floor(Math.random() * statuses.length)]
          })
        }
      } catch (error) {
        console.error('获取用户数据失败', error)
      } finally {
        loading.value = false
      }
    }

    // 过滤和排序用户
    const filteredUsers = computed(() => {
      let result = [...users.value]
      
      // 搜索过滤
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(user => 
          user.username.toLowerCase().includes(query) || 
          user.email.toLowerCase().includes(query)
        )
      }
      
      // 角色过滤
      if (roleFilter.value) {
        result = result.filter(user => user.role === roleFilter.value)
      }
      
      // 状态过滤
      if (statusFilter.value) {
        result = result.filter(user => user.status === statusFilter.value)
      }
      
      // 排序
      result.sort((a, b) => {
        let valueA = a[sortKey.value]
        let valueB = b[sortKey.value]
        
        // 处理特殊情况，如最后登录时间可能为null
        if (sortKey.value === 'lastLogin') {
          valueA = valueA || new Date(0)
          valueB = valueB || new Date(0)
        }
        
        if (valueA < valueB) return sortOrder.value === 'asc' ? -1 : 1
        if (valueA > valueB) return sortOrder.value === 'asc' ? 1 : -1
        return 0
      })
      
      return result
    })
    
    // 分页
    const totalPages = computed(() => Math.ceil(filteredUsers.value.length / pageSize.value))
    
    const paginatedUsers = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value
      const end = start + pageSize.value
      return filteredUsers.value.slice(start, end)
    })
    
    // 显示哪些页码按钮
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
    
    // 监听过滤和分页变化
    watch([searchQuery, roleFilter, statusFilter], () => {
      currentPage.value = 1
    })
    
    // 排序方法
    const sortBy = (key) => {
      if (sortKey.value === key) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
      } else {
        sortKey.value = key
        sortOrder.value = 'asc'
      }
    }
    
    // 获取角色名称
    const getRoleName = (role) => {
      const roleMap = {
        'admin': '管理员',
        'designer': '设计师',
        'user': '普通用户'
      }
      return roleMap[role] || role
    }
    
    // 获取状态文本
    const getStatusText = (status) => {
      const statusMap = {
        'active': '已激活',
        'inactive': '未激活',
        'locked': '已锁定'
      }
      return statusMap[status] || status
    }
    
    // 格式化日期
    const formatDate = (date) => {
      if (!date) return '从未登录'
      
      if (typeof date === 'string') {
        date = new Date(date)
      }
      
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    
    // 用户操作方法
    const editUser = (user) => {
      selectedUser.value = { ...user }
      showEditUserModal.value = true
    }
    
    const confirmDelete = (user) => {
      selectedUser.value = user
      showDeleteModal.value = true
    }
    
    const toggleUserLock = (user) => {
      const userIndex = users.value.findIndex(u => u.id === user.id)
      if (userIndex !== -1) {
        const updatedUser = { ...users.value[userIndex] }
        updatedUser.status = updatedUser.status === 'locked' ? 'active' : 'locked'
        users.value[userIndex] = updatedUser
      }
    }
    
    const addUser = (userData) => {
      const newId = Math.max(...users.value.map(u => u.id), 0) + 1
      const newUserData = {
        ...userData,
        id: newId,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`,
        lastLogin: null
      }
      
      users.value.push(newUserData)
      showAddUserModal.value = false
    }
    
    const updateUser = (userData) => {
      const userIndex = users.value.findIndex(u => u.id === userData.id)
      if (userIndex !== -1) {
        users.value[userIndex] = {
          ...users.value[userIndex],
          ...userData
        }
      }
      showEditUserModal.value = false
    }
    
    const deleteUser = () => {
      users.value = users.value.filter(u => u.id !== selectedUser.value.id)
      showDeleteModal.value = false
    }
    
    onMounted(() => {
      fetchUsers()
    })
    
    return {
      users,
      loading,
      searchQuery,
      roleFilter,
      statusFilter,
      sortKey,
      sortOrder,
      currentPage,
      pageSize,
      filteredUsers,
      paginatedUsers,
      totalPages,
      displayedPages,
      showAddUserModal,
      showEditUserModal,
      showDeleteModal,
      selectedUser,
      newUser,
      sortBy,
      getRoleName,
      getStatusText,
      formatDate,
      editUser,
      confirmDelete,
      toggleUserLock,
      addUser,
      updateUser,
      deleteUser
    }
  }
}
</script>

<style scoped>
.user-management {
  width: 100%;
  height: 100%;
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

.filters {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 200px;
  max-width: 400px;
}

.search-input {
  width: 100%;
  padding: 10px 36px 10px 12px;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  font-size: 14px;
  transition: all 0.3s;
  background-color: var(--bg-color);
  color: var(--text-color);
}

.search-input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.2);
  outline: none;
}

.search-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
}

.filter-options {
  display: flex;
  gap: 12px;
}

.filter-select {
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  background-color: var(--bg-color);
  color: var(--text-color);
  font-size: 14px;
  cursor: pointer;
  min-width: 120px;
}

.user-table-container {
  overflow-x: auto;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  margin-bottom: 24px;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.user-table th {
  background-color: rgba(0, 0, 0, 0.03);
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-color);
  cursor: pointer;
}

.user-table th:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.sort-icon {
  margin-left: 4px;
}

.user-table td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-color);
}

.user-table tr:last-child td {
  border-bottom: none;
}

.user-table tbody tr:hover {
  background-color: rgba(67, 97, 238, 0.05);
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.role-badge, .status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.role-badge.admin {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.role-badge.designer {
  background-color: rgba(79, 70, 229, 0.1);
  color: #4f46e5;
}

.role-badge.user {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.status-badge.active {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.status-badge.inactive {
  background-color: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.status-badge.locked {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.action-buttons {
  display: flex;
  gap: 8px;
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

.action-btn.edit:hover {
  color: #4f46e5;
}

.action-btn.lock:hover, .action-btn.unlock:hover {
  color: #f59e0b;
}

.action-btn.delete:hover {
  color: #ef4444;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.pagination-btn {
  padding: 8px 16px;
  border: 1px solid var(--border-color);
  background-color: var(--bg-color);
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.pagination-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.page-numbers {
  display: flex;
  gap: 4px;
}

.page-number {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-color);
  background-color: var(--bg-color);
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.page-number:hover:not(.active) {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.page-number.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.page-size select {
  padding: 8px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--bg-color);
  font-size: 14px;
}

.loading-row td {
  padding: 40px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: var(--primary-color);
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

.text-center {
  text-align: center;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.delete-confirm {
  padding: 16px;
  text-align: center;
}

.warning {
  color: #ef4444;
  margin: 16px 0;
  font-weight: 500;
}

.confirm-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
  }
  
  .search-box {
    max-width: 100%;
  }
  
  .filter-options {
    width: 100%;
  }
  
  .user-table th, .user-table td {
    padding: 10px;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 4px;
  }
  
  .pagination {
    flex-wrap: wrap;
    gap: 10px;
  }
}
</style>