<template>
  <div class="role-permissions">
    <div class="section-header">
      <h2>权限管理</h2>
      <BaseButton
        variant="primary"
        size="small"
        @click="savePermissions"
        :loading="saving"
      >
        保存权限设置
      </BaseButton>
    </div>
    
    <div class="permissions-container">
      <div class="role-selector">
        <h3>选择角色</h3>
        <div class="role-options">
          <div 
            v-for="role in roles" 
            :key="role.id" 
            class="role-option"
            :class="{ active: selectedRole.id === role.id }"
            @click="selectRole(role)"
          >
            <div class="role-icon" :class="role.id">{{ role.icon }}</div>
            <div class="role-details">
              <div class="role-name">{{ role.name }}</div>
              <div class="role-desc">{{ role.description }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="permission-settings">
        <div class="selected-role-header">
          <h3>{{ selectedRole.name }} 权限设置</h3>
          <div class="header-actions">
            <button class="action-link" @click="selectAll">全选</button>
            <span class="divider">|</span>
            <button class="action-link" @click="deselectAll">取消全选</button>
          </div>
        </div>
        
        <div class="permission-groups">
          <BaseCard 
            v-for="(group, groupKey) in permissionGroups" 
            :key="groupKey"
            class="permission-group"
          >
            <template #header>
              <div class="group-header">
                <span class="group-icon">{{ group.icon }}</span>
                <h4>{{ group.name }}</h4>
                <div class="group-actions">
                  <label class="toggle-all">
                    <input 
                      type="checkbox" 
                      :checked="isGroupChecked(groupKey)"
                      @change="toggleGroup(groupKey, $event.target.checked)"
                    >
                    {{ isGroupChecked(groupKey) ? '取消所有' : '选择所有' }}
                  </label>
                </div>
              </div>
            </template>
            
            <div class="permissions-list">
              <div 
                v-for="permission in group.permissions" 
                :key="permission.id" 
                class="permission-item"
              >
                <div class="permission-checkbox">
                  <input 
                    type="checkbox" 
                    :id="permission.id" 
                    :checked="hasPermission(permission.id)"
                    @change="togglePermission(permission.id, $event.target.checked)"
                  >
                  <label :for="permission.id">{{ permission.name }}</label>
                </div>
                <div class="permission-desc">{{ permission.description }}</div>
              </div>
            </div>
          </BaseCard>
        </div>
      </div>
    </div>
    
    <div class="save-actions">
      <BaseButton
        variant="outline"
        @click="resetPermissions"
      >
        重置更改
      </BaseButton>
      <BaseButton
        variant="primary"
        @click="savePermissions"
        :loading="saving"
      >
        保存权限设置
      </BaseButton>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import BaseButton from '../BaseButton.vue'
import BaseCard from '../BaseCard.vue'

export default {
  name: 'RolePermissions',
  components: {
    BaseButton,
    BaseCard
  },
  setup() {
    const saving = ref(false)
    
    // 角色定义
    const roles = [
      {
        id: 'admin',
        name: '管理员',
        icon: '👑',
        description: '系统最高权限，可执行所有操作'
      },
      {
        id: 'designer',
        name: '设计师',
        icon: '🎨',
        description: '可以使用设计相关功能和管理模型'
      },
      {
        id: 'user',
        name: '普通用户',
        icon: '👤',
        description: '基础功能使用权限'
      },
      {
        id: 'guest',
        name: '访客',
        icon: '👓',
        description: '只读权限，无法进行操作'
      }
    ]
    
    // 权限组和权限
    const permissionGroups = {
      system: {
        name: '系统管理',
        icon: '⚙️',
        permissions: [
          { id: 'system:view', name: '查看系统设置', description: '可以查看系统设置页面' },
          { id: 'system:edit', name: '编辑系统设置', description: '可以修改系统基本设置' },
          { id: 'system:security', name: '安全设置', description: '可以配置系统安全相关设置' },
          { id: 'system:api', name: 'API设置', description: '可以配置API相关设置' },
          { id: 'system:logs', name: '查看日志', description: '可以查看系统日志' },
          { id: 'system:backup', name: '数据备份', description: '可以执行和恢复数据备份' }
        ]
      },
      user: {
        name: '用户管理',
        icon: '👥',
        permissions: [
          { id: 'user:view', name: '查看用户', description: '可以查看用户列表和详情' },
          { id: 'user:create', name: '创建用户', description: '可以创建新用户' },
          { id: 'user:edit', name: '编辑用户', description: '可以编辑用户信息' },
          { id: 'user:delete', name: '删除用户', description: '可以删除用户' },
          { id: 'user:lock', name: '锁定用户', description: '可以锁定/解锁用户账号' }
        ]
      },
      role: {
        name: '角色权限',
        icon: '🔐',
        permissions: [
          { id: 'role:view', name: '查看角色', description: '可以查看角色列表和权限' },
          { id: 'role:create', name: '创建角色', description: '可以创建新角色' },
          { id: 'role:edit', name: '编辑角色', description: '可以编辑角色信息和权限' },
          { id: 'role:delete', name: '删除角色', description: '可以删除角色' },
          { id: 'role:assign', name: '分配角色', description: '可以为用户分配角色' }
        ]
      },
      design: {
        name: '智能设计',
        icon: '✨',
        permissions: [
          { id: 'design:view', name: '查看设计', description: '可以查看设计项目' },
          { id: 'design:create', name: '创建设计', description: '可以创建新设计项目' },
          { id: 'design:edit', name: '编辑设计', description: '可以编辑设计项目' },
          { id: 'design:delete', name: '删除设计', description: '可以删除设计项目' },
          { id: 'design:share', name: '分享设计', description: '可以分享设计项目给其他用户' },
          { id: 'design:export', name: '导出设计', description: '可以导出设计项目' }
        ]
      },
      model: {
        name: '模型管理',
        icon: '👗',
        permissions: [
          { id: 'model:view', name: '查看模型', description: '可以查看服装模型' },
          { id: 'model:create', name: '创建模型', description: '可以创建新模型' },
          { id: 'model:edit', name: '编辑模型', description: '可以编辑模型信息' },
          { id: 'model:delete', name: '删除模型', description: '可以删除模型' },
          { id: 'model:train', name: '训练模型', description: '可以执行模型训练任务' },
        ]
      },
      content: {
        name: '内容生成',
        icon: '💬',
        permissions: [
          { id: 'content:propaganda', name: '宣传话术', description: '可以使用宣传话术生成功能' },
          { id: 'content:animation', name: '动图生成', description: '可以使用动图生成功能' },
          { id: 'content:video', name: '视频生成', description: '可以使用视频生成功能' },
          { id: 'content:export', name: '导出内容', description: '可以导出生成的内容' }
        ]
      }
    }
    
    // 默认角色权限配置
    const defaultRolePermissions = {
      admin: [
        'system:view', 'system:edit', 'system:security', 'system:api', 'system:logs', 'system:backup',
        'user:view', 'user:create', 'user:edit', 'user:delete', 'user:lock',
        'role:view', 'role:create', 'role:edit', 'role:delete', 'role:assign',
        'design:view', 'design:create', 'design:edit', 'design:delete', 'design:share', 'design:export',
        'model:view', 'model:create', 'model:edit', 'model:delete', 'model:train',
        'content:propaganda', 'content:animation', 'content:video', 'content:export'
      ],
      designer: [
        'system:view',
        'user:view',
        'role:view',
        'design:view', 'design:create', 'design:edit', 'design:share', 'design:export',
        'model:view', 'model:create', 'model:edit', 'model:train',
        'content:propaganda', 'content:animation', 'content:video', 'content:export'
      ],
      user: [
        'design:view', 'design:create', 'design:edit',
        'model:view',
        'content:propaganda', 'content:animation', 'content:video'
      ],
      guest: [
        'design:view',
        'model:view'
      ]
    }
    
    // 当前选择的角色
    const selectedRole = ref(roles[0])
    
    // 当前权限设置（克隆默认值以便能够重置）
    const rolePermissions = reactive(JSON.parse(JSON.stringify(defaultRolePermissions)))
    
    // 选择角色
    const selectRole = (role) => {
      selectedRole.value = role
    }
    
    // 检查是否有权限
    const hasPermission = (permissionId) => {
      return rolePermissions[selectedRole.value.id].includes(permissionId)
    }
    
    // 切换权限
    const togglePermission = (permissionId, checked) => {
      const currentPermissions = rolePermissions[selectedRole.value.id]
      
      if (checked && !currentPermissions.includes(permissionId)) {
        currentPermissions.push(permissionId)
      } else if (!checked && currentPermissions.includes(permissionId)) {
        const index = currentPermissions.indexOf(permissionId)
        currentPermissions.splice(index, 1)
      }
    }
    
    // 检查组是否被全选
    const isGroupChecked = (groupKey) => {
      const groupPermissions = permissionGroups[groupKey].permissions.map(p => p.id)
      const currentPermissions = rolePermissions[selectedRole.value.id]
      
      return groupPermissions.every(permId => currentPermissions.includes(permId))
    }
    
    // 切换组权限
    const toggleGroup = (groupKey, checked) => {
      const groupPermissions = permissionGroups[groupKey].permissions.map(p => p.id)
      const currentPermissions = rolePermissions[selectedRole.value.id]
      
      if (checked) {
        // 添加组内所有权限
        groupPermissions.forEach(permId => {
          if (!currentPermissions.includes(permId)) {
            currentPermissions.push(permId)
          }
        })
      } else {
        // 移除组内所有权限
        rolePermissions[selectedRole.value.id] = currentPermissions.filter(
          permId => !groupPermissions.includes(permId)
        )
      }
    }
    
    // 全选
    const selectAll = () => {
      const allPermissions = []
      
      Object.values(permissionGroups).forEach(group => {
        group.permissions.forEach(permission => {
          allPermissions.push(permission.id)
        })
      })
      
      rolePermissions[selectedRole.value.id] = [...allPermissions]
    }
    
    // 取消全选
    const deselectAll = () => {
      rolePermissions[selectedRole.value.id] = []
    }
    
    // 重置权限设置
    const resetPermissions = () => {
      Object.keys(defaultRolePermissions).forEach(roleId => {
        rolePermissions[roleId] = [...defaultRolePermissions[roleId]]
      })
    }
    
    // 保存权限设置
    const savePermissions = async () => {
      saving.value = true
      
      try {
        // 模拟API保存
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 显示成功通知
        alert('权限设置已保存')
      } catch (error) {
        console.error('保存权限失败', error)
        // 显示错误通知
        alert('保存权限失败，请稍后重试')
      } finally {
        saving.value = false
      }
    }
    
    return {
      roles,
      permissionGroups,
      selectedRole,
      saving,
      selectRole,
      hasPermission,
      togglePermission,
      isGroupChecked,
      toggleGroup,
      selectAll,
      deselectAll,
      resetPermissions,
      savePermissions
    }
  }
}
</script>

<style scoped>
.role-permissions {
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

.permissions-container {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

.role-selector {
  background-color: var(--bg-card);
  border-radius: 8px;
  padding: 20px;
  box-shadow: var(--shadow-sm);
  height: fit-content;
}

.role-selector h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
}

.role-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.role-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.role-option:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

.role-option.active {
  background-color: rgba(67, 97, 238, 0.05);
  border-color: var(--primary-color);
}

.role-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  border-radius: 50%;
  flex-shrink: 0;
}

.role-icon.admin {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.role-icon.designer {
  background-color: rgba(79, 70, 229, 0.1);
  color: #4f46e5;
}

.role-icon.user {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.role-icon.guest {
  background-color: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.role-details {
  overflow: hidden;
}

.role-name {
  font-weight: 500;
  margin-bottom: 4px;
}

.role-desc {
  font-size: 13px;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.permission-settings {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.selected-role-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.selected-role-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-link {
  background: none;
  border: none;
  color: var(--primary-color);
  font-size: 14px;
  cursor: pointer;
  padding: 0;
}

.action-link:hover {
  text-decoration: underline;
}

.divider {
  color: var(--border-color);
}

.permission-groups {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.permission-group {
  height: 100%;
}

.group-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.group-header h4 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  flex: 1;
}

.group-icon {
  font-size: 18px;
}

.toggle-all {
  font-size: 13px;
  color: var(--primary-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}

.permissions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.permission-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.permission-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
}

.permission-checkbox label {
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
}

.permission-desc {
  font-size: 13px;
  color: var(--text-secondary);
  margin-left: 24px;
}

.save-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

@media (max-width: 768px) {
  .permissions-container {
    grid-template-columns: 1fr;
  }
  
  .save-actions {
    flex-direction: column-reverse;
    gap: 12px;
  }
}
</style> 