import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './stores'
import directives from './utils/directives'
import 'animate.css'
import './styles/theme.css'
import './custom-styles.css'

const app = createApp(App)

// Register custom directives
Object.entries(directives).forEach(([name, directive]) => {
  app.directive(name, directive)
})

app.use(router)
app.use(store)
app.mount('#app')
