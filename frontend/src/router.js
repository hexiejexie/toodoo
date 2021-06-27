import Vue from 'vue'
import Router from 'vue-router'
import Board from './views/Board.vue'
import Task from './views/Task.vue'
import Login from './views/Login.vue'
import Register from './views/Register.vue'

Vue.use(Router)

const ifAuthenticated = (to, from, next) => {
  if (localStorage.getItem('token')) {
    next()
    return
  }
  next({
    name: 'login',
    params: {
      returnTo: to.path,
      query: to.query
    }
  })
}

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/board',
      name: 'board',
      component: Board,
      beforeEnter: ifAuthenticated,
      children: [
        {
          path: 'task/:id',
          name: 'task',
          component: Task
        }
      ]
    },
    {
      path: '*',
      name: 'home',
      component: Login
    }
  ]
})
