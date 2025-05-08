<template>
  <div 
    class="base-card" 
    :class="[
      `shadow-${shadow}`, 
      `padding-${padding}`,
      { 'is-hoverable': hoverable }
    ]"
  >
    <div v-if="$slots.header" class="card-header">
      <slot name="header"></slot>
    </div>
    <div class="card-body">
      <slot></slot>
    </div>
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseCard',
  props: {
    shadow: {
      type: String,
      default: 'medium',
      validator: (val) => ['none', 'small', 'medium', 'large'].includes(val)
    },
    padding: {
      type: String,
      default: 'medium',
      validator: (val) => ['none', 'small', 'medium', 'large'].includes(val)
    },
    hoverable: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.base-card {
  background-color: var(--card-bg, #ffffff);
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  border: 1px solid var(--border-color, rgba(0, 0, 0, 0.1));
}

/* Shadow variations */
.shadow-none {
  box-shadow: none;
}

.shadow-small {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.shadow-medium {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.shadow-large {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

/* Padding variations */
.padding-none .card-body {
  padding: 0;
}

.padding-small .card-body {
  padding: 12px;
}

.padding-medium .card-body {
  padding: 20px;
}

.padding-large .card-body {
  padding: 28px;
}

/* Hover effect */
.is-hoverable:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

/* Card sections */
.card-header {
  border-bottom: 1px solid var(--border-color, rgba(0, 0, 0, 0.1));
  padding: 16px 20px;
}

.card-footer {
  border-top: 1px solid var(--border-color, rgba(0, 0, 0, 0.1));
  padding: 16px 20px;
}

/* Dark theme adjustments */
[data-theme='dark'] .base-card {
  background-color: var(--card-bg-dark, #2c2c2c);
  border-color: var(--border-color-dark, rgba(255, 255, 255, 0.1));
}

[data-theme='dark'] .card-header,
[data-theme='dark'] .card-footer {
  border-color: var(--border-color-dark, rgba(255, 255, 255, 0.1));
}

[data-theme='dark'] .shadow-small {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

[data-theme='dark'] .shadow-medium {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

[data-theme='dark'] .shadow-large {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}
</style> 