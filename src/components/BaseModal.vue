<template>
  <Teleport to="body">
    <div class="modal-backdrop" @click="closeOnBackdrop && $emit('close')">
      <div class="modal" :class="{ 'modal-lg': size === 'large', 'modal-sm': size === 'small' }" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">{{ title }}</h3>
          <button class="close-button" @click="$emit('close')" aria-label="关闭">
            &times;
          </button>
        </div>
        <div class="modal-body">
          <slot></slot>
        </div>
        <div v-if="$slots.footer" class="modal-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script>
import { onMounted, onBeforeUnmount, nextTick } from 'vue'

export default {
  name: 'BaseModal',
  props: {
    title: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'medium',
      validator: (val) => ['small', 'medium', 'large'].includes(val)
    },
    closeOnBackdrop: {
      type: Boolean,
      default: true
    }
  },
  setup(props, { emit }) {
    // 处理ESC键关闭模态框
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        emit('close')
      }
    }
    
    // 添加滚动锁定，防止背景滚动
    const lockBodyScroll = () => {
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`
    }
    
    // 移除滚动锁定
    const unlockBodyScroll = () => {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
    
    onMounted(() => {
      // 模态框出现时，添加ESC监听和锁定背景滚动
      nextTick(() => {
        window.addEventListener('keydown', handleEscKey)
        lockBodyScroll()
      })
    })
    
    onBeforeUnmount(() => {
      // 模态框关闭时，移除ESC监听和解锁背景滚动
      window.removeEventListener('keydown', handleEscKey)
      unlockBodyScroll()
    })
    
    return {}
  }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.2s ease-out;
}

.modal {
  background-color: var(--bg-card);
  border-radius: 8px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-sm {
  max-width: 400px;
}

.modal-lg {
  max-width: 800px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
}

.modal-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
}

.close-button {
  background: none;
  border: none;
  font-size: 22px;
  line-height: 1;
  padding: 5px;
  cursor: pointer;
  color: var(--text-secondary);
  transition: color 0.2s;
}

.close-button:hover {
  color: var(--text-color);
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  padding: 16px 20px;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { 
    opacity: 0; 
    transform: translateY(-30px);
  }
  to { 
    opacity: 1; 
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .modal {
    width: 95%;
    max-height: 95vh;
  }
  
  .modal-header, .modal-body, .modal-footer {
    padding: 12px 16px;
  }
}
</style> 