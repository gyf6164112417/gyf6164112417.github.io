<template>
  <div class="model-training-layout">
    <h1>模型训练</h1>
    
    <div class="sub-menu">
      <router-link to="/model-training/material" class="sub-menu-item">
        <span class="sub-menu-icon">📁</span>
        <span>素材库</span>
      </router-link>
      <router-link to="/model-training/settings" class="sub-menu-item">
        <span class="sub-menu-icon">⚙️</span>
        <span>模型设置</span>
      </router-link>
    </div>
    
    <div class="content-wrapper">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModelTrainingLayout'
}
</script>

<style scoped>
.model-training-layout {
  padding: 20px;
}

h1 {
  margin-bottom: 20px;
  font-size: 28px;
  color: var(--primary-color);
}

.sub-menu {
  display: flex;
  background-color: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 10px;
  margin-bottom: 25px;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  gap: 15px;
}

.sub-menu-item {
  padding: 12px 20px;
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--text-color);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
}

.sub-menu-item:hover {
  background-color: rgba(67, 97, 238, 0.05);
  color: var(--primary-color);
  transform: translateY(-2px);
}

.router-link-active.sub-menu-item {
  background-color: rgba(67, 97, 238, 0.1);
  color: var(--primary-color);
  font-weight: 600;
}

.sub-menu-icon {
  font-size: 18px;
}

.content-wrapper {
  background-color: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-color);
  overflow: hidden;
}
</style> 