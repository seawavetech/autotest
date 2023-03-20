import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'
import * as http from '@/api/api'

import './assets/main.css'

const app = createApp(App)
app.provide('$http',http);

app.use(createPinia())
app.use(router)
app.use(ElementPlus)

app.mount('#app')


