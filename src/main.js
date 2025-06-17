import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
// import { createPinia } from 'pinia'
import {setupStore} from "@/store";


const app = createApp(App)

app.use(ElementPlus, { size: 'small', locale: zhCn })
// const pinia = createPinia()
// app.use(pinia)

setupStore(app);
app.mount('#app')

