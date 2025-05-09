import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Viewport_b.vue'

const routes = [{ path: '/', component: Home }]
export default createRouter({
  history: createWebHistory(),
  routes,
})
