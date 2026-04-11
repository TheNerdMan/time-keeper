import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import './assets/main.css'

import TrackerView from './views/TrackerView.vue'
import SettingsView from './views/SettingsView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: TrackerView },
    { path: '/settings', component: SettingsView },
  ],
})

createApp(App).use(router).mount('#app')
