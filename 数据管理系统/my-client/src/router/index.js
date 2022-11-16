import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/LoginPage'

    },
    {
      path: '/IndexPage',
      name: 'IndexPage',
      component: () => import('../views/IndexPage.vue'),
      children: [
        {
          path: '',
          component: () => import('../components/HomePage.vue')
        },
        {
          path: '/HomePage',
          name: 'HomePage',
          component: () => import('../components/HomePage.vue')
        },
        {
          path: '/InfoShow',
          name: 'InfoShow',
          component: () => import('../components/InfoShow.vue')
        },
        {
          path: '/FoundList',
          name: 'FoundList',
          component: () => import('../components/FoundList.vue')
        },
        {
          path: '/EmployeePage',
          name: 'EmployeePage',
          component: () => import('../components/EmployeePage.vue')
        },
      ],
    },
    {
      path: '/RegisterPage',
      name: 'RegisterPage',
      component: () => import('../components/RegisterPage.vue')
    },
    {
      path: '/:pathMatch(.*)',
      name: 'NotFound',
      component: () => import('../components/NotFound.vue')
    },
    {
      path: '/LoginPage',
      name: 'LoginPage',
      component: () => import('../components/LoginPage.vue')
    },
    {
      path: '/ReFresh',
      name: 'ReFresh',
      component: () => import('../components/ReFresh.vue')
    },
  



  ]
})
//路由守卫
router.beforeEach((to, from, next) => {
  const isLogin = localStorage.eleToken ? true : false;
  if (to.path == "/LoginPage" || to.path == "/RegisterPage") {
    next();
  } else {
    isLogin ? next() : next("/LoginPage");
  }
});





export default router
