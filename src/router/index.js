import { createRouter, createWebHistory } from 'vue-router'

// 页面组件导入
import Home from '../views/Home.vue'
import MaterialLibrary from '../views/MaterialLibrary.vue'
import ModelSettings from '../views/ModelSettings.vue'
import SmartDesign from '../views/SmartDesign.vue'
import Propaganda from '../views/Propaganda.vue'
import ModelConversion from '../views/ModelConversion.vue'
import Animation from '../views/Animation.vue'
import Video from '../views/Video.vue'
import System from '../views/System.vue'

// 路由配置
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/model-training',
    name: 'ModelTraining',
    redirect: '/model-training/material',
  },
  {
    path: '/model-training/material',
    name: 'MaterialLibrary',
    component: MaterialLibrary
  },
  {
    path: '/model-training/settings',
    name: 'ModelSettings',
    component: ModelSettings
  },
  {
    path: '/smart-design',
    name: 'SmartDesign',
    component: SmartDesign
  },
  {
    path: '/propaganda',
    name: 'Propaganda',
    component: Propaganda
  },
  {
    path: '/model-conversion',
    name: 'ModelConversion',
    component: ModelConversion
  },
  {
    path: '/animation',
    name: 'Animation',
    component: Animation
  },
  {
    path: '/video',
    name: 'Video',
    component: Video
  },
  {
    path: '/system',
    name: 'System',
    component: System
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router 