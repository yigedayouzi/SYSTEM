import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from './api/request'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import i18n from './lang'
import 'element-plus/theme-chalk/dark/css-vars.css'
createApp(App).config.globalProperties.$http = 'http'

createApp(App).use(store).use(ElementPlus).use(i18n).use(router).mount('#app')
