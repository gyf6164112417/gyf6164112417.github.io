<template>
  <form class="user-form" @submit.prevent="handleSubmit">
    <div class="form-group">
      <label for="username">用户名<span class="required">*</span></label>
      <input 
        type="text" 
        id="username" 
        v-model="formData.username"
        :class="{ 'error': errors.username }"
        required
      />
      <p v-if="errors.username" class="error-message">{{ errors.username }}</p>
    </div>
    
    <div class="form-group">
      <label for="email">邮箱<span class="required">*</span></label>
      <input 
        type="email" 
        id="email" 
        v-model="formData.email"
        :class="{ 'error': errors.email }"
        required
      />
      <p v-if="errors.email" class="error-message">{{ errors.email }}</p>
    </div>
    
    <div class="form-group" v-if="!isEdit">
      <label for="password">密码<span class="required">*</span></label>
      <div class="password-input">
        <input 
          :type="showPassword ? 'text' : 'password'" 
          id="password" 
          v-model="formData.password"
          :class="{ 'error': errors.password }"
          required
        />
        <button 
          type="button" 
          class="toggle-password" 
          @click="showPassword = !showPassword"
        >
          {{ showPassword ? '👁️' : '👁️‍🗨️' }}
        </button>
      </div>
      <p v-if="errors.password" class="error-message">{{ errors.password }}</p>
    </div>
    
    <div class="form-group" v-if="isEdit">
      <label for="newPassword">新密码 (留空表示不修改)</label>
      <div class="password-input">
        <input 
          :type="showPassword ? 'text' : 'password'" 
          id="newPassword" 
          v-model="formData.newPassword"
        />
        <button 
          type="button" 
          class="toggle-password" 
          @click="showPassword = !showPassword"
        >
          {{ showPassword ? '👁️' : '👁️‍🗨️' }}
        </button>
      </div>
    </div>
    
    <div class="form-group">
      <label for="role">角色<span class="required">*</span></label>
      <select 
        id="role" 
        v-model="formData.role"
        required
      >
        <option value="admin">管理员</option>
        <option value="designer">设计师</option>
        <option value="user">普通用户</option>
      </select>
    </div>
    
    <div class="form-group">
      <label for="status">状态<span class="required">*</span></label>
      <select 
        id="status" 
        v-model="formData.status"
        required
      >
        <option value="active">已激活</option>
        <option value="inactive">未激活</option>
        <option value="locked">已锁定</option>
      </select>
    </div>
    
    <div class="form-actions">
      <BaseButton 
        type="button" 
        variant="outline" 
        @click="$emit('cancel')"
      >
        取消
      </BaseButton>
      <BaseButton 
        type="submit" 
        variant="primary"
        :loading="submitting"
      >
        {{ isEdit ? '保存修改' : '添加用户' }}
      </BaseButton>
    </div>
  </form>
</template>

<script>
import { ref, reactive, watch } from 'vue'
import BaseButton from '../BaseButton.vue'

export default {
  name: 'UserForm',
  components: {
    BaseButton
  },
  props: {
    user: {
      type: Object,
      required: true
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const formData = reactive({
      id: props.user.id || null,
      username: props.user.username || '',
      email: props.user.email || '',
      password: props.user.password || '',
      newPassword: '',
      role: props.user.role || 'user',
      status: props.user.status || 'active'
    })
    
    const errors = reactive({
      username: '',
      email: '',
      password: ''
    })
    
    const showPassword = ref(false)
    const submitting = ref(false)
    
    // 当props更新时同步更新表单
    watch(() => props.user, (newVal) => {
      Object.keys(newVal).forEach(key => {
        if (key in formData && key !== 'password') {
          formData[key] = newVal[key]
        }
      })
    }, { deep: true })
    
    // 验证表单
    const validate = () => {
      let valid = true
      
      // 清除之前的错误
      Object.keys(errors).forEach(key => {
        errors[key] = ''
      })
      
      // 用户名验证
      if (!formData.username.trim()) {
        errors.username = '用户名不能为空'
        valid = false
      } else if (formData.username.length < 2) {
        errors.username = '用户名至少需要2个字符'
        valid = false
      }
      
      // 邮箱验证
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!formData.email.trim()) {
        errors.email = '邮箱不能为空'
        valid = false
      } else if (!emailRegex.test(formData.email)) {
        errors.email = '请输入有效的邮箱地址'
        valid = false
      }
      
      // 密码验证（仅创建新用户时）
      if (!props.isEdit) {
        if (!formData.password) {
          errors.password = '密码不能为空'
          valid = false
        } else if (formData.password.length < 6) {
          errors.password = '密码至少需要6个字符'
          valid = false
        }
      }
      
      return valid
    }
    
    const handleSubmit = async () => {
      if (!validate()) {
        return
      }
      
      submitting.value = true
      
      try {
        // 模拟API请求延迟
        await new Promise(resolve => setTimeout(resolve, 600))
        
        // 准备提交的数据
        const userData = { ...formData }
        
        // 如果是编辑模式并且有新密码，则使用新密码
        if (props.isEdit) {
          if (userData.newPassword) {
            userData.password = userData.newPassword
          }
          delete userData.newPassword
        }
        
        // 提交数据
        emit('submit', userData)
      } catch (error) {
        console.error('提交表单失败', error)
      } finally {
        submitting.value = false
      }
    }
    
    return {
      formData,
      errors,
      showPassword,
      submitting,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.user-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 500px;
  margin: 0 auto;
  padding: 20px 0;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-size: 14px;
  margin-bottom: 6px;
  color: var(--text-color);
  font-weight: 500;
}

.required {
  color: #ef4444;
  margin-left: 4px;
}

input, select {
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  font-size: 14px;
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: all 0.3s;
}

input:focus, select:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.2);
  outline: none;
}

input.error, select.error {
  border-color: #ef4444;
}

.error-message {
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
}

.password-input {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-secondary);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
}

@media (max-width: 768px) {
  .user-form {
    padding: 16px 0;
  }
  
  .form-actions {
    flex-direction: column-reverse;
  }
  
  .form-actions button {
    width: 100%;
  }
}
</style> 