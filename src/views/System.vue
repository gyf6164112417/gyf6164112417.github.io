<template>
  <div class="system-page">
    <h1 class="page-title">系统管理</h1>
    
    <div class="system-tabs">
      <div 
        v-for="tab in tabs" 
        :key="tab.id"
        class="tab" 
        :class="{ 'active': activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        <span class="tab-icon">{{ tab.icon }}</span>
        <span class="tab-text">{{ tab.name }}</span>
      </div>
    </div>
    
    <div class="tab-content">
      <!-- 用户管理 -->
      <UserManagement v-if="activeTab === 'users'" />
      
      <!-- 系统设置 -->
      <SystemSettings v-else-if="activeTab === 'settings'" />
      
      <!-- 权限管理 -->
      <RolePermissions v-else-if="activeTab === 'permissions'" />
      
      <!-- 系统日志 -->
      <SystemLogs v-else-if="activeTab === 'logs'" />
      
      <!-- 数据备份 -->
      <DataBackup v-else-if="activeTab === 'backup'" />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import UserManagement from '@/components/system/UserManagement.vue'
import SystemSettings from '@/components/system/SystemSettings.vue'
import RolePermissions from '@/components/system/RolePermissions.vue'
import SystemLogs from '@/components/system/SystemLogs.vue'
import DataBackup from '@/components/system/DataBackup.vue'

export default {
  name: 'SystemView',
  components: {
    UserManagement,
    SystemSettings,
    RolePermissions,
    SystemLogs,
    DataBackup
  },
  setup() {
    const activeTab = ref('users')
    
    const tabs = [
      { id: 'users', name: '用户管理', icon: '👥' },
      { id: 'settings', name: '系统设置', icon: '⚙️' },
      { id: 'permissions', name: '权限管理', icon: '🔐' },
      { id: 'logs', name: '系统日志', icon: '📋' },
      { id: 'backup', name: '数据备份', icon: '💾' }
    ]
    
    return {
      activeTab,
      tabs
    }
  }
}
</script>

<style scoped>
.system-page {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 16px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
  color: var(--text-color);
}

.system-tabs {
  display: flex;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 24px;
  overflow-x: auto;
  scrollbar-width: none; /* Firefox */
}

.system-tabs::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Edge */
}

.tab {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
  white-space: nowrap;
  color: var(--text-secondary);
}

.tab:hover {
  color: var(--text-color);
  background-color: rgba(0, 0, 0, 0.02);
}

.tab.active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
}

.tab-icon {
  margin-right: 8px;
}

.tab-content {
  padding: 16px 0;
}

@media (max-width: 768px) {
  .system-tabs {
    justify-content: flex-start;
  }
  
  .tab {
    padding: 12px 16px;
  }
}
</style>