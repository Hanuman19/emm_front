import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import store from '../store/index.js'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [   
  {
    path: '/login',
    name: 'Login',
    component: Login
  }, 
  {
    path: '/',
    name: 'Home',
    component: Home
  },        
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn) {
      next()
      return
    }
    next('/login') 
  } else {
    next() 
  }
})

export default router
