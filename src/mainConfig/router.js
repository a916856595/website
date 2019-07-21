import Vue from 'vue';
import VueRouter from 'vue-router';
// 这里暂时不使用动态加载模块了，原因是在 .vue 文件中使用自动加载全局less 配合动态加载会导致less没有被加载
import homePage from '../modules/home/home.vue';
import loginPage from '../modules/home/login.vue';
import registerPage from '../modules/home/register.vue';
import aboutPage from '../modules/home/about.vue';
import classDemoPage from '../modules/demo/classDemo.vue';

Vue.use(VueRouter);

const routers = [{
  path: '/login',
  name: 'login',
  component: loginPage
},{
  path: '/register',
  name: 'register',
  component: registerPage
},{
  path: '/classDemo',
  name: 'classDemo',
  component: classDemoPage
},{
  path: '/home',
  name: 'home',
  component: homePage
},{
  path: '/about',
  name: 'about',
  component: aboutPage
},{
  path: '*',
  redirect: '/home'
}];

const router = new VueRouter({ routes: routers });
  router.beforeEach((to, from, next) => {
    next();
  });
  router.beforeResolve((to, from, next) => {
    next();
  });

export default router;