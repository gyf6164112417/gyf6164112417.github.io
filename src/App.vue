<template>
  <div class="app-container">
    <!-- 移除粒子背景效果 -->
    
    <!-- 简化背景渐变效果 -->
    <div class="animated-background"></div>
    
    <!-- 移除网格装饰图形 -->
    
    <div class="sidebar">
      <div class="logo">
        <h2>智能换装</h2>
        <div class="logo-underline"></div>
      </div>
      <div class="menu">
        <router-link to="/" class="menu-item" v-slot="{ isActive }">
          <div class="menu-item-inner" :class="{ 'active': isActive }">
            <span class="menu-icon">🏠</span>
            <span>首页</span>
          </div>
        </router-link>
        
        <!-- 模型训练带下拉子菜单 -->
        <div class="menu-item has-submenu" :class="{ 'expanded': isModelTrainingExpanded }">
          <div class="menu-item-content" @click="toggleModelTraining">
            <span class="menu-icon">🧠</span>
            <span>模型训练</span>
            <span class="submenu-arrow" :class="{ 'expanded': isModelTrainingExpanded }">▼</span>
          </div>
          <div class="submenu" v-show="isModelTrainingExpanded" 
               :class="{'submenu-enter-active': isModelTrainingExpanded}">
            <router-link to="/model-training/material" class="submenu-item" v-slot="{ isActive }">
              <div :class="{ 'active': isActive }">
                <span class="submenu-icon">📁</span>
                <span>素材库</span>
              </div>
            </router-link>
            <router-link to="/model-training/settings" class="submenu-item" v-slot="{ isActive }">
              <div :class="{ 'active': isActive }">
                <span class="submenu-icon">⚙️</span>
                <span>模型设置</span>
              </div>
            </router-link>
          </div>
        </div>
        
        <router-link to="/smart-design" class="menu-item" v-slot="{ isActive }">
          <div class="menu-item-inner" :class="{ 'active': isActive }">
            <span class="menu-icon">✨</span>
            <span>智能设计</span>
          </div>
        </router-link>
        
        <router-link to="/propaganda" class="menu-item" v-slot="{ isActive }">
          <div class="menu-item-inner" :class="{ 'active': isActive }">
            <span class="menu-icon">💬</span>
            <span>宣传话术生成</span>
          </div>
        </router-link>
        
        <router-link to="/model-conversion" class="menu-item" v-slot="{ isActive }">
          <div class="menu-item-inner" :class="{ 'active': isActive }">
            <span class="menu-icon">👗</span>
            <span>模特换装</span>
          </div>
        </router-link>
        
        <router-link to="/animation" class="menu-item" v-slot="{ isActive }">
          <div class="menu-item-inner" :class="{ 'active': isActive }">
            <span class="menu-icon">🎞️</span>
            <span>动图生成</span>
          </div>
        </router-link>
        
        <router-link to="/video" class="menu-item" v-slot="{ isActive }">
          <div class="menu-item-inner" :class="{ 'active': isActive }">
            <span class="menu-icon">🎬</span>
            <span>视频生成</span>
          </div>
        </router-link>
        
        <router-link to="/system" class="menu-item" v-slot="{ isActive }">
          <div class="menu-item-inner" :class="{ 'active': isActive }">
            <span class="menu-icon">⚙️</span>
            <span>系统管理</span>
          </div>
        </router-link>
      </div>
    </div>
    
    <div class="main-content">
      <!-- 用户头像和信息栏 -->
      <div class="user-profile-bar">
        <div class="user-info-container">
          <div class="user-profile">
            <div class="user-avatar">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=智能换装用户" alt="用户头像" />
            </div>
            <div class="user-info">
              <span class="user-name">智能换装用户</span>
              <span class="user-role">高级设计师</span>
            </div>
          </div>
        </div>
        <div class="user-actions">
          <button class="action-btn notification">
            <span class="icon">🔔</span>
            <span class="badge">3</span>
          </button>
          <button class="action-btn messages">
            <span class="icon">✉️</span>
          </button>
          <button class="action-btn settings">
            <span class="icon">⚙️</span>
          </button>
        </div>
      </div>
      
      <div class="page-container">
        <transition name="fade-slide" mode="out-in">
          <router-view />
        </transition>
      </div>
    </div>
  </div>
  <div ref="rippleContainer" class="ripple-container"></div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { throttle, enableHardwareAcceleration } from './utils/performance'

export default {
  name: 'App',
  data() {
    return {
      isModelTrainingExpanded: false,
      forceLoadTimeout: null
    }
  },
  computed: {
    ...mapState({
      userData: state => state.userData,
      notifications: state => state.notifications
    })
  },
  watch: {
    $route(to) {
      // 当路由包含model-training时自动展开子菜单，否则收起
      if (to.path.includes('model-training')) {
        this.isModelTrainingExpanded = true;
      } else {
        this.isModelTrainingExpanded = false;
      }
    }
  },
  mounted() {
    // 根据当前路由初始化子菜单状态
    if (this.$route.path.includes('model-training')) {
      this.isModelTrainingExpanded = true;
    }
    
    // 立即显示内容
    document.body.classList.add('page-loaded');
    
    // 缩短超时时间
    setTimeout(() => {
      // 移除加载指示器
      const initialLoader = document.getElementById('initial-loader');
      if (initialLoader && initialLoader.parentNode) {
        initialLoader.style.opacity = '0';
        setTimeout(() => {
          if (initialLoader.parentNode) {
            initialLoader.parentNode.removeChild(initialLoader);
          }
        }, 100);
      }
      
      // 如果还有加载问题，强制刷新页面
      if (document.getElementById('app') && document.getElementById('app').children.length === 0) {
        console.error('Application failed to render properly, forcing refresh');
        window.location.reload();
      }
    }, 1000); // 缩短到1秒
    
    this.$nextTick(() => {
      // 添加点击波纹效果，使用节流函数优化性能
      document.addEventListener('click', this.throttledRipple());
      
      // 启用硬件加速
      enableHardwareAcceleration();
      
      // 获取用户数据
      this.fetchUserData();
    });
  },
  methods: {
    ...mapActions([
      'fetchUserData',
      'fetchNotifications'
    ]),
    toggleModelTraining() {
      this.isModelTrainingExpanded = !this.isModelTrainingExpanded;
    },
    // 使用节流函数包装波纹效果
    throttledRipple() {
      return throttle((e) => {
        if (!this.$refs.rippleContainer) return;
        
        const ripple = document.createElement('span');
        ripple.classList.add('ripple-effect');
        
        const rect = this.$refs.rippleContainer.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
        
        this.$refs.rippleContainer.appendChild(ripple);
        
        setTimeout(() => {
          if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
          }
        }, 600);
      }, 100);
    }
  },
  beforeUnmount() {
    // 清理事件监听器
    document.removeEventListener('click', this.throttledRipple());
    
    // 清理定时器
    if (this.forceLoadTimeout) {
      clearTimeout(this.forceLoadTimeout);
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700&display=swap');

:root {
  /* 主色调 */
  --primary-color: #4361ee;
  --primary-light: #4895ef;
  --primary-dark: #3f37c9;
  --accent-color: #f72585;
  --accent-light: #ff78a7;
  --primary-rgb: 67, 97, 238;
  
  /* 背景与内容区域 */
  --bg-color: #f8fafc;
  --bg-sidebar: #ffffff;
  --bg-card: #ffffff;
  
  /* 文本颜色 */
  --text-color: #1e293b;
  --text-secondary: #64748b;
  --text-light: #94a3b8;
  
  /* 边框与阴影 */
  --border-color: #e2e8f0;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  
  /* 圆角 */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-full: 9999px;
  
  /* 动画时间 */
  --transition-fast: 0.2s;
  --transition-normal: 0.3s;
  --transition-slow: 0.5s;
  
  /* 内边距 */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Noto Sans SC', 'Microsoft YaHei', sans-serif;
  background-color: var(--bg-color);
  color: var(--text-color);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow: hidden;
  transition: background-color 0.3s ease;
}

/* 简化页面加载动画 */
body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--bg-sidebar);
  z-index: 9999;
  opacity: 1;
  transition: opacity 0.3s ease;
}

body.page-loaded::before {
  opacity: 0;
  pointer-events: none;
}

.app-container {
  display: flex;
  height: 100vh;
  background-color: var(--bg-color);
  overflow: hidden;
  position: relative;
  animation: fadeIn 0.3s ease;
  transition: background-color 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 简化动态背景渐变 */
.animated-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 50% 50%, rgba(0, 212, 255, 0.05) 0%, rgba(0, 0, 0, 0) 70%);
  z-index: -1;
  pointer-events: none;
}

/* 侧边栏 */
.sidebar {
  width: 260px;
  min-width: 260px;
  background: linear-gradient(135deg, var(--primary-color), #560bad);
  color: white;
  display: flex;
  flex-direction: column;
  z-index: 10;
  position: relative;
}

/* Logo 样式 */
.logo {
  padding: 20px;
  text-align: center;
  position: relative;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  overflow: hidden;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo h2 {
  color: white;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 1px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  margin: 0;
}

.logo-underline {
  height: 2px;
  width: 60%;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(255, 255, 255, 0.8), 
    transparent);
  margin: 8px auto 0;
  position: relative;
}

/* 菜单样式修复 */
.menu {
  display: flex;
  flex-direction: column;
  padding: 10px 15px;
  flex: 1;
  overflow-y: auto;
}

.menu-item {
  margin: 4px 0;
  text-decoration: none;
  color: white;
  border-radius: var(--radius-md);
  position: relative;
  overflow: hidden;
}

.menu-item-inner {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  border-radius: var(--radius-md);
  transition: all 0.25s ease;
  font-weight: 500;
  position: relative;
  z-index: 1;
  overflow: hidden;
}

.menu-item-inner:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateX(6px);
}

.menu-item-inner.active {
  background-color: rgba(255, 255, 255, 0.2);
  font-weight: 600;
  box-shadow: var(--shadow-sm);
}

.menu-item.has-submenu {
  padding: 0;
  flex-direction: column;
  overflow: visible;
  position: relative;
}

.menu-item-content {
  display: flex;
  align-items: center;
  width: 100%;
  cursor: pointer;
  position: relative;
  padding: 14px 16px;
  border-radius: var(--radius-md);
  transition: all var(--transition-normal);
  overflow: hidden;
  color: white;
}

.menu-item-content:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateX(4px);
}

.submenu {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 0 0 var(--radius-md) var(--radius-md);
  overflow: hidden;
  transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out;
  max-height: 0;
  opacity: 0;
}

.submenu-enter-active {
  max-height: 300px;
  opacity: 1;
  padding: 5px 0;
}

.submenu-arrow {
  font-size: 10px;
  margin-left: auto;
  transition: transform var(--transition-normal);
}

.submenu-arrow.expanded {
  transform: rotate(180deg);
}

.submenu-item {
  text-decoration: none;
  color: white;
}

.submenu-item div {
  padding: 10px 10px 10px 45px;
  display: flex;
  align-items: center;
  transition: all var(--transition-normal);
  border-radius: var(--radius-sm);
  margin: 2px 8px;
}

.menu-icon {
  margin-right: 12px;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

/* 主内容区域修复 */
.main-content {
  flex: 1;
  overflow-y: auto;
  background-color: var(--bg-color);
  position: relative;
  z-index: 1;
  transition: all var(--transition-normal);
  display: flex;
  flex-direction: column;
}

/* 用户资料栏修复 */
.user-info-container {
  display: flex;
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.user-profile-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: white;
  box-shadow: var(--shadow-sm);
  z-index: 5;
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid var(--border-color);
  min-height: 60px;
}

.user-profile {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  max-width: 100%;
}

.user-avatar {
  width: 40px;
  height: 40px;
  min-width: 40px;
  border-radius: var(--radius-full);
  overflow: hidden;
  border: 2px solid var(--primary-light);
  box-shadow: var(--shadow-md);
  position: relative;
  flex-shrink: 0;
  margin-right: 12px;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex-shrink: 1;
  max-width: calc(100% - 52px);
}

.user-name {
  font-weight: 600;
  font-size: 15px;
  color: var(--text-color);
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  line-height: 1.2;
}

.user-role {
  font-size: 13px;
  color: var(--text-secondary);
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  line-height: 1.2;
}

.user-actions {
  display: flex;
  gap: 10px;
  margin-left: 15px;
  flex-shrink: 0;
}

.action-btn {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  border: none;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.25s ease;
  position: relative;
  color: var(--text-secondary);
  overflow: hidden;
}

.action-btn:hover {
  background-color: rgba(67, 97, 238, 0.1);
  color: var(--primary-color);
  transform: translateY(-3px);
}

.action-btn .badge {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 18px;
  height: 18px;
  border-radius: var(--radius-full);
  background-color: var(--accent-color);
  color: white;
  font-size: 11px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 页面容器修复 */
.page-container {
  flex: 1;
  padding: 25px;
  margin: 0 auto;
  width: 100%;
  position: relative;
  max-width: 100%;
  background-color: var(--bg-color);
}

/* 简化路由过渡动画 */
.fade-slide-enter-active {
  animation: fadeSlideIn 0.3s ease-out forwards;
}

.fade-slide-leave-active {
  animation: fadeSlideOut 0.2s ease-in forwards;
}

@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeSlideOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-20px);
  }
}

/* 点击波纹容器 */
.ripple-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9990;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--bg-sidebar);
}

::-webkit-scrollbar-thumb {
  background-color: var(--text-secondary);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: var(--primary-color);
}

/* 响应式布局 */
@media (max-width: 900px) {
  .sidebar {
    width: 70px;
    min-width: 70px;
    padding: 0;
  }
  
  .logo h2, .logo-underline {
    display: none;
  }
  
  .menu-item span:not(.menu-icon), .submenu-arrow {
    display: none;
  }
  
  .menu-item-inner, .menu-item-content {
    justify-content: center;
    padding: 14px 0;
  }
  
  .menu-icon {
    margin-right: 0;
  }
  
  .submenu {
    position: absolute;
    left: 70px;
    top: 0;
    width: 200px;
    background-color: #560bad;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: var(--shadow-md);
    z-index: 100;
    padding: 10px 0;
    border-radius: var(--radius-md);
  }
  
  .submenu-enter-active {
    padding: 10px 0;
  }
  
  .user-profile-bar {
    padding: 12px 16px;
  }
  
  .user-role {
    display: none;
  }
}

@media (max-width: 600px) {
  .app-container {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100vw;
    height: 60px;
    flex-direction: row;
    position: fixed;
    left: 0; top: 0; right: 0;
    z-index: 100;
    border-right: none;
    border-bottom: 1px solid var(--border-color);
    box-shadow: var(--shadow-md);
  }
  
  .logo {
    padding: 10px;
    margin-bottom: 0;
    flex: 0 0 auto;
  }
  
  .logo h2 {
    font-size: 20px;
  }
  
  .menu {
    flex-direction: row;
    overflow-x: auto;
    padding: 0 10px;
  }
  
  .menu-item {
    margin: 0 5px;
  }
  
  .menu-item-inner, .menu-item-content {
    padding: 0 10px;
    height: 60px;
  }
  
  .main-content {
    margin-top: 60px;
  }
  
  .user-profile-bar {
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    z-index: 90;
  }
  
  .page-container {
    margin-top: 70px;
    padding: 15px;
  }
  
  .submenu {
    top: 60px;
    left: 0;
    width: 100%;
    position: fixed;
  }
}

.submenu-item div:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateX(4px);
}

.submenu-item div.active {
  background-color: rgba(255, 255, 255, 0.2);
  font-weight: 600;
}
</style>
