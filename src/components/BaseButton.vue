<template>
  <button 
    :class="[
      'base-button', 
      `size-${size}`, 
      `variant-${variant}`,
      { 'is-loading': loading, 'is-block': block, 'is-disabled': disabled }
    ]"
    :disabled="disabled || loading"
    @click="onClick"
  >
    <div v-if="loading" class="spinner"></div>
    <span v-else-if="$slots.icon" class="button-icon">
      <slot name="icon"></slot>
    </span>
    <span class="button-content" :class="{ 'with-icon': $slots.icon }">
      <slot></slot>
    </span>
  </button>
</template>

<script>
export default {
  name: 'BaseButton',
  props: {
    variant: {
      type: String,
      default: 'primary',
      validator: (val) => ['primary', 'secondary', 'outline', 'danger', 'text'].includes(val)
    },
    size: {
      type: String,
      default: 'medium',
      validator: (val) => ['small', 'medium', 'large'].includes(val)
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    block: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onClick(event) {
      if (!this.disabled && !this.loading) {
        this.$emit('click', event)
      }
    }
  }
}
</script>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.base-button::after {
  content: '';
  position: absolute;
  background: rgba(255, 255, 255, 0.2);
  width: 5px;
  height: 5px;
  border-radius: 100%;
  transform: scale(0);
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s ease;
}

.base-button:active::after {
  transform: scale(20);
  opacity: 0;
  transition: 0s;
}

.is-disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.is-loading {
  cursor: wait;
}

.is-block {
  display: flex;
  width: 100%;
}

/* Sizes */
.size-small {
  height: 32px;
  padding: 0 12px;
  font-size: 14px;
}

.size-medium {
  height: 40px;
  padding: 0 16px;
  font-size: 16px;
}

.size-large {
  height: 48px;
  padding: 0 24px;
  font-size: 16px;
}

/* Variants */
.variant-primary {
  background: var(--primary);
  color: white;
}

.variant-primary:hover:not(.is-disabled):not(.is-loading) {
  background: var(--primary-dark);
  box-shadow: 0 4px 10px rgba(67, 97, 238, 0.3);
}

.variant-secondary {
  background: var(--secondary-color, #3f37c9);
  color: white;
}

.variant-secondary:hover:not(.is-disabled):not(.is-loading) {
  background: var(--secondary-color-dark, #362ec2);
  box-shadow: 0 4px 10px rgba(63, 55, 201, 0.3);
}

.variant-outline {
  background: transparent;
  color: var(--primary);
  border: 1px solid var(--primary);
}

.variant-outline:hover:not(.is-disabled):not(.is-loading) {
  background: var(--hover-bg);
}

.variant-danger {
  background: var(--danger-color, #ef233c);
  color: white;
}

.variant-danger:hover:not(.is-disabled):not(.is-loading) {
  background: var(--danger-color-dark, #d81e36);
  box-shadow: 0 4px 10px rgba(239, 35, 60, 0.3);
}

.variant-text {
  background: transparent;
  color: var(--primary);
  padding: 0 8px;
}

.variant-text:hover:not(.is-disabled):not(.is-loading) {
  background: var(--hover-bg);
}

/* Loading spinner */
.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Icon styling */
.button-icon {
  margin-right: 8px;
  display: flex;
  align-items: center;
}

.with-icon {
  padding-left: 4px;
}

/* Dark theme adjustments */
[data-theme='dark'] .variant-outline {
  border-color: var(--primary);
  color: var(--primary-light);
}

[data-theme='dark'] .variant-text {
  color: var(--primary-light);
}
</style> 