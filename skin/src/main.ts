import { createApp } from 'vue'
import { createPinia } from 'pinia'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import config from './config';

import App from './App.vue'
import router from './router'
import * as http from '@/api/api'

import './assets/main.css'
const app = createApp(App)
app.provide('$config',config);
app.provide('$http',http);

app.use(createPinia())
app.use(router)
app.use(ElementPlus)

app.mount('#app')


