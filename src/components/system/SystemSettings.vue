<template>
  <div class="system-settings">
    <div class="section-header">
      <h2>系统设置</h2>
      <BaseButton
        size="small"
        variant="primary"
        :loading="saving"
        @click="saveSettings"
      >
        保存设置
      </BaseButton>
    </div>
    
    <div class="settings-container">
      <BaseCard class="settings-card">
        <template #header>
          <div class="card-header-title">
            <span class="header-icon">🔧</span>
            <h3>基本设置</h3>
          </div>
        </template>
        
        <div class="settings-form">
          <div class="form-group">
            <label for="siteName">系统名称</label>
            <input 
              type="text" 
              id="siteName" 
              v-model="settings.basic.siteName"
            />
            <p class="form-hint">显示在浏览器标签和登录页上的系统名称</p>
          </div>
          
          <div class="form-group">
            <label for="logoUrl">系统Logo</label>
            <div class="logo-upload">
              <img 
                v-if="settings.basic.logoUrl" 
                :src="settings.basic.logoUrl" 
                alt="系统Logo" 
                class="preview-logo"
              />
              <div v-else class="no-logo">无Logo</div>
              <BaseButton 
                variant="outline" 
                size="small" 
                @click="triggerLogoUpload"
              >
                上传Logo
              </BaseButton>
              <input 
                type="file" 
                ref="logoInput" 
                style="display: none" 
                accept="image/*"
                @change="handleLogoUpload"
              />
            </div>
          </div>
          
          <div class="form-group">
            <label for="defaultTheme">默认主题</label>
            <div class="theme-selector">
              <div 
                class="theme-option"
                :class="{ active: settings.basic.defaultTheme === 'light' }"
                @click="selectTheme('light')"
              >
                <div class="theme-preview light-theme"></div>
                <span>亮色主题</span>
              </div>
              <div 
                class="theme-option"
                :class="{ active: settings.basic.defaultTheme === 'dark' }"
                @click="selectTheme('dark')"
              >
                <div class="theme-preview dark-theme"></div>
                <span>暗色主题</span>
              </div>
            </div>
          </div>
        </div>
      </BaseCard>
      
      <BaseCard class="settings-card">
        <template #header>
          <div class="card-header-title">
            <span class="header-icon">🛡️</span>
            <h3>安全设置</h3>
          </div>
        </template>
        
        <div class="settings-form">
          <div class="form-group">
            <label>双因素认证</label>
            <div class="toggle-switch">
              <input
                type="checkbox"
                id="twoFactorAuth"
                v-model="settings.security.twoFactorAuth"
              />
              <label for="twoFactorAuth" class="toggle-label"></label>
              <span class="toggle-text">{{ settings.security.twoFactorAuth ? '已启用' : '已禁用' }}</span>
            </div>
            <p class="form-hint">启用后，用户登录需要额外的验证码或其他安全验证</p>
          </div>
          
          <div class="form-group">
            <label for="sessionTimeout">会话超时时间(分钟)</label>
            <input 
              type="number" 
              id="sessionTimeout" 
              v-model.number="settings.security.sessionTimeout"
              min="5"
              max="1440"
            />
            <p class="form-hint">用户无操作时自动退出登录的时间，建议30-120分钟</p>
          </div>
          
          <div class="form-group">
            <label for="passwordPolicy">密码策略</label>
            <select id="passwordPolicy" v-model="settings.security.passwordPolicy">
              <option value="low">低强度 (6位以上，无限制)</option>
              <option value="medium">中强度 (8位以上，需包含字母和数字)</option>
              <option value="high">高强度 (10位以上，需包含大小写字母、数字和特殊符号)</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>登录失败锁定</label>
            <div class="toggle-switch">
              <input
                type="checkbox"
                id="loginLockEnabled"
                v-model="settings.security.loginLock.enabled"
              />
              <label for="loginLockEnabled" class="toggle-label"></label>
              <span class="toggle-text">{{ settings.security.loginLock.enabled ? '已启用' : '已禁用' }}</span>
            </div>
            <div v-if="settings.security.loginLock.enabled" class="lock-settings">
              <div class="form-row">
                <label for="maxAttempts">连续失败次数:</label>
                <input 
                  type="number" 
                  id="maxAttempts" 
                  v-model.number="settings.security.loginLock.maxAttempts"
                  min="3"
                  max="10"
                />
              </div>
              <div class="form-row">
                <label for="lockDuration">锁定时长(分钟):</label>
                <input 
                  type="number" 
                  id="lockDuration" 
                  v-model.number="settings.security.loginLock.lockDuration"
                  min="5"
                  max="1440"
                />
              </div>
            </div>
          </div>
        </div>
      </BaseCard>
      
      <BaseCard class="settings-card">
        <template #header>
          <div class="card-header-title">
            <span class="header-icon">🤖</span>
            <h3>AI设置</h3>
          </div>
        </template>
        
        <div class="settings-form">
          <div class="form-group">
            <label for="apiProvider">AI API提供商</label>
            <select id="apiProvider" v-model="settings.ai.apiProvider">
              <option value="openai">OpenAI</option>
              <option value="azure">Azure OpenAI</option>
              <option value="other">其他提供商</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="apiKey">API密钥</label>
            <div class="api-key-input">
              <input 
                type="password" 
                id="apiKey" 
                v-model="settings.ai.apiKey"
                placeholder="输入API密钥"
              />
              <button 
                type="button" 
                class="view-key-btn" 
                @click="showApiKey = !showApiKey"
              >
                {{ showApiKey ? '隐藏' : '查看' }}
              </button>
            </div>
            <p class="form-hint">请保护好您的API密钥，不要泄露给他人</p>
          </div>
          
          <div class="form-group">
            <label for="defaultModel">默认模型</label>
            <select id="defaultModel" v-model="settings.ai.defaultModel">
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              <option value="gpt-4">GPT-4</option>
              <option value="gpt-4-turbo">GPT-4 Turbo</option>
              <option value="claude-3">Claude 3</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>启用AI功能</label>
            <div class="ai-features">
              <div class="feature-item">
                <input
                  type="checkbox"
                  id="featureDesign"
                  v-model="settings.ai.enabledFeatures.design"
                />
                <label for="featureDesign">智能设计</label>
              </div>
              <div class="feature-item">
                <input
                  type="checkbox"
                  id="featurePropaganda"
                  v-model="settings.ai.enabledFeatures.propaganda"
                />
                <label for="featurePropaganda">宣传话术生成</label>
              </div>
              <div class="feature-item">
                <input
                  type="checkbox"
                  id="featureConversion"
                  v-model="settings.ai.enabledFeatures.modelConversion"
                />
                <label for="featureConversion">模特换装</label>
              </div>
              <div class="feature-item">
                <input
                  type="checkbox"
                  id="featureAnimation"
                  v-model="settings.ai.enabledFeatures.animation"
                />
                <label for="featureAnimation">动图生成</label>
              </div>
              <div class="feature-item">
                <input
                  type="checkbox"
                  id="featureVideo"
                  v-model="settings.ai.enabledFeatures.video"
                />
                <label for="featureVideo">视频生成</label>
              </div>
            </div>
          </div>
        </div>
      </BaseCard>
      
      <BaseCard class="settings-card">
        <template #header>
          <div class="card-header-title">
            <span class="header-icon">📨</span>
            <h3>通知设置</h3>
          </div>
        </template>
        
        <div class="settings-form">
          <div class="form-group">
            <label for="emailService">邮件服务配置</label>
            <select id="emailService" v-model="settings.notification.emailService">
              <option value="smtp">SMTP</option>
              <option value="sendgrid">SendGrid</option>
              <option value="aliyun">阿里云邮件</option>
            </select>
          </div>
          
          <div class="form-group" v-if="settings.notification.emailService === 'smtp'">
            <label for="smtpServer">SMTP服务器</label>
            <input 
              type="text" 
              id="smtpServer" 
              v-model="settings.notification.smtp.server"
              placeholder="smtp.example.com"
            />
          </div>
          
          <div class="form-group" v-if="settings.notification.emailService === 'smtp'">
            <label for="smtpPort">SMTP端口</label>
            <input 
              type="number" 
              id="smtpPort" 
              v-model.number="settings.notification.smtp.port"
              placeholder="587"
            />
          </div>
          
          <div class="form-group">
            <label>通知类型</label>
            <div class="notification-types">
              <div class="notification-item">
                <input
                  type="checkbox"
                  id="notifyLogin"
                  v-model="settings.notification.types.login"
                />
                <label for="notifyLogin">登录通知</label>
              </div>
              <div class="notification-item">
                <input
                  type="checkbox"
                  id="notifyTask"
                  v-model="settings.notification.types.task"
                />
                <label for="notifyTask">任务完成通知</label>
              </div>
              <div class="notification-item">
                <input
                  type="checkbox"
                  id="notifySystem"
                  v-model="settings.notification.types.system"
                />
                <label for="notifySystem">系统通知</label>
              </div>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>
    
    <div class="actions-bar">
      <BaseButton
        variant="outline"
        @click="resetSettings"
      >
        重置默认
      </BaseButton>
      <BaseButton
        variant="primary"
        :loading="saving"
        @click="saveSettings"
      >
        保存设置
      </BaseButton>
    </div>
    
    <!-- 重置确认模态框 -->
    <BaseModal
      v-if="showResetModal"
      title="确认重置"
      @close="showResetModal = false"
    >
      <div class="reset-confirm">
        <p>您确定要将所有设置重置为默认值吗？</p>
        <p class="warning">此操作不可逆，所有自定义设置将会丢失！</p>
        <div class="modal-actions">
          <BaseButton
            variant="outline"
            @click="showResetModal = false"
          >
            取消
          </BaseButton>
          <BaseButton
            variant="danger"
            @click="confirmReset"
          >
            确认重置
          </BaseButton>
        </div>
      </div>
    </BaseModal>
    
    <!-- 成功通知 -->
    <div v-if="showSuccessNotification" class="success-notification">
      <div class="notification-content">
        <span class="notification-icon">✅</span>
        <span class="notification-text">设置保存成功！</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, watch, onMounted } from 'vue'
import BaseButton from '../BaseButton.vue'
import BaseCard from '../BaseCard.vue'
import BaseModal from '../BaseModal.vue'

export default {
  name: 'SystemSettings',
  components: {
    BaseButton,
    BaseCard,
    BaseModal
  },
  setup() {
    const showApiKey = ref(false)
    const saving = ref(false)
    const showResetModal = ref(false)
    const logoInput = ref(null)
    const showSuccessNotification = ref(false)
    
    // 初始化主题
    const initTheme = () => {
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme) {
        settings.basic.defaultTheme = savedTheme
        applyTheme(savedTheme)
      }
    }
    
    // 系统设置数据
    const settings = reactive({
      basic: {
        siteName: '智能换装系统',
        logoUrl: '',
        defaultTheme: 'light'
      },
      security: {
        twoFactorAuth: false,
        sessionTimeout: 60,
        passwordPolicy: 'medium',
        loginLock: {
          enabled: true,
          maxAttempts: 5,
          lockDuration: 30
        }
      },
      ai: {
        apiProvider: 'openai',
        apiKey: '',
        defaultModel: 'gpt-3.5-turbo',
        enabledFeatures: {
          design: true,
          propaganda: true,
          modelConversion: true,
          animation: true,
          video: true
        }
      },
      notification: {
        emailService: 'smtp',
        smtp: {
          server: '',
          port: 587,
          username: '',
          password: ''
        },
        types: {
          login: true,
          task: true,
          system: true
        }
      }
    })
    
    // 默认设置备份
    const defaultSettings = JSON.parse(JSON.stringify(settings))
    
    // 触发Logo上传
    const triggerLogoUpload = () => {
      if (logoInput.value) {
        logoInput.value.click()
      }
    }
    
    // 处理Logo上传
    const handleLogoUpload = (event) => {
      const file = event.target.files[0]
      if (!file) return
      
      if (!file.type.startsWith('image/')) {
        alert('请上传图片文件')
        return
      }
      
      const reader = new FileReader()
      reader.onload = (e) => {
        settings.basic.logoUrl = e.target.result
      }
      reader.readAsDataURL(file)
    }
    
    // 应用主题
    const applyTheme = (theme) => {
      document.documentElement.setAttribute('data-theme', theme)
      // 保存到localStorage
      localStorage.setItem('theme', theme)
    }
    
    // 监听主题变化
    watch(() => settings.basic.defaultTheme, (newTheme) => {
      applyTheme(newTheme)
    })
    
    // 选择主题
    const selectTheme = (theme) => {
      settings.basic.defaultTheme = theme
      applyTheme(theme)
    }
    
    // 保存设置
    const saveSettings = async () => {
      saving.value = true
      
      try {
        // 模拟API保存
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 应用主题
        applyTheme(settings.basic.defaultTheme)
        
        // 显示自定义成功通知
        showSuccessNotification.value = true
        setTimeout(() => {
          showSuccessNotification.value = false
        }, 3000)
      } catch (error) {
        console.error('保存设置失败', error)
        // 显示错误通知
        alert('保存设置失败，请稍后重试')
      } finally {
        saving.value = false
      }
    }
    
    // 重置设置
    const resetSettings = () => {
      showResetModal.value = true
    }
    
    // 确认重置
    const confirmReset = () => {
      // 重置所有设置为默认值
      Object.keys(defaultSettings).forEach(key => {
        settings[key] = JSON.parse(JSON.stringify(defaultSettings[key]))
      })
      
      showResetModal.value = false
      
      // 显示自定义成功通知
      showSuccessNotification.value = true
      setTimeout(() => {
        showSuccessNotification.value = false
      }, 3000)
    }
    
    // 组件挂载时初始化主题
    onMounted(() => {
      initTheme()
    })
    
    return {
      settings,
      showApiKey,
      saving,
      showResetModal,
      showSuccessNotification,
      logoInput,
      triggerLogoUpload,
      handleLogoUpload,
      selectTheme,
      saveSettings,
      resetSettings,
      confirmReset
    }
  }
}
</script>

<style scoped>
.system-settings {
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

.settings-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
}

.settings-card {
  height: 100%;
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

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
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

.form-hint {
  font-size: 12px;
  color: var(--text-secondary);
  margin: 4px 0 0;
}

input[type="text"],
input[type="number"],
input[type="password"],
select {
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 14px;
  background-color: var(--bg-color);
  color: var(--text-color);
}

input:focus,
select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.1);
}

.logo-upload {
  display: flex;
  align-items: center;
  gap: 16px;
}

.preview-logo {
  width: 80px;
  height: 80px;
  object-fit: contain;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 8px;
}

.no-logo {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed var(--border-color);
  border-radius: 6px;
  color: var(--text-secondary);
  font-size: 12px;
}

.theme-selector {
  display: flex;
  gap: 20px;
}

.theme-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 10px;
  border-radius: 6px;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.theme-option:hover {
  background-color: rgba(0, 0, 0, 0.03);
  transform: translateY(-2px);
}

.theme-option.active {
  background-color: rgba(67, 97, 238, 0.08);
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(67, 97, 238, 0.15);
}

.theme-preview {
  width: 80px;
  height: 50px;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  overflow: hidden;
  transition: all 0.3s ease;
}

.light-theme {
  background: linear-gradient(to bottom right, #ffffff 50%, #f8fafc 50%);
}

.dark-theme {
  background: linear-gradient(to bottom right, #1e293b 50%, #0f172a 50%);
}

.theme-option.active .theme-preview {
  transform: scale(1.05);
  box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.2);
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

.lock-settings {
  margin-top: 8px;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.form-row label {
  font-size: 13px;
  flex-shrink: 0;
  width: 120px;
}

.form-row input {
  flex: 1;
}

.api-key-input {
  display: flex;
  gap: 8px;
}

.api-key-input input {
  flex: 1;
}

.view-key-btn {
  padding: 0 12px;
  border: 1px solid var(--border-color);
  background-color: var(--bg-color);
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: var(--text-secondary);
}

.view-key-btn:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

.ai-features,
.notification-types {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
}

.feature-item,
.notification-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.feature-item label,
.notification-item label {
  font-weight: normal;
  font-size: 14px;
  cursor: pointer;
}

.actions-bar {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 32px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

.reset-confirm {
  padding: 16px;
  text-align: center;
}

.warning {
  color: #ef4444;
  margin: 16px 0;
  font-weight: 500;
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
}

@media (max-width: 768px) {
  .settings-container {
    grid-template-columns: 1fr;
  }
  
  .theme-selector {
    flex-direction: column;
    gap: 12px;
  }
  
  .theme-option {
    flex-direction: row;
    width: 100%;
    justify-content: flex-start;
  }
  
  .ai-features,
  .notification-types {
    grid-template-columns: 1fr;
  }
  
  .actions-bar {
    flex-direction: column-reverse;
    gap: 12px;
  }
}

/* 成功通知样式 */
.success-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  animation: slideInRight 0.3s ease forwards;
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: #10b981;
  color: white;
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
}

.notification-icon {
  font-size: 18px;
}

.notification-text {
  font-weight: 500;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style> 