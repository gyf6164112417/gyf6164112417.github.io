import { createStore } from 'vuex'

export default createStore({
  state: {
    userData: {
      name: '智能换装用户',
      role: '高级设计师',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=智能换装用户'
    },
    notifications: 3,
    modelLibrary: {
      materials: [],
      settings: {}
    },
    designSettings: {}
  },
  getters: {
    getUserData: state => state.userData,
    getNotifications: state => state.notifications
  },
  mutations: {
    setUserData(state, userData) {
      state.userData = { ...state.userData, ...userData }
    },
    setNotifications(state, count) {
      state.notifications = count
    },
    updateModelLibrary(state, data) {
      state.modelLibrary = { ...state.modelLibrary, ...data }
    },
    updateDesignSettings(state, settings) {
      state.designSettings = { ...state.designSettings, ...settings }
    }
  },
  actions: {
    fetchUserData({ commit }) {
      // Simulate API call
      setTimeout(() => {
        commit('setUserData', {
          name: '智能换装用户',
          role: '高级设计师',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=智能换装用户'
        })
      }, 300)
    }
  },
  modules: {}
}) 