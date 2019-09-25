import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/account',
      name: 'account',
      component: () => import(/* webpackChunkName: "foo" */ './views/Account.vue')
    },
    {
      path: '/contract',
      name: 'contract',
      component: () => import(/* webpackChunkName: "foo" */ './views/Contract.vue')
    },
    {
      path: '/transaction',
      name: 'contract',
      component: () => import(/* webpackChunkName: "foo" */ './views/Transaction.vue')
    },
    {
      path: '/block',
      name: 'contract',
      component: () => import(/* webpackChunkName: "foo" */ './views/Block.vue')
    },
    {
      path: '/eventlog',
      name: 'eventlog',
      component: () => import(/* webpackChunkName: "foo" */ './views/Log.vue')
    },
    {
      path: '/proxy',
      name: 'proxy',
      component: () => import(/* webpackChunkName: "foo" */ './views/Proxy.vue')
    },
    {
      path: '/token',
      name: 'token',
      component: () => import(/* webpackChunkName: "foo" */ './views/Token.vue')
    },
    {
      path: '/stats',
      name: 'stats',
      component: () => import(/* webpackChunkName: "foo" */ './views/Stats.vue')
    }
  ]
})
