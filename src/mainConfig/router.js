import Vue from 'vue';
import VueRouter from 'vue-router';
// 这里暂时不使用动态加载模块了，原因是在 .vue 文件中使用自动加载全局less 配合动态加载会导致less没有被加载
import main from '../modules/main.vue';
import home from '../modules/home/home.vue';
import login from '../modules/home/login.vue';
import register from '../modules/home/register.vue';
import classDemo from '../modules/demo/classDemo.vue';

Vue.use(VueRouter);

const routers = [{
  path: '/main',
  // name: 'main',  此路由有默认子路由，建议不设置name属性
  component: main,
  children: [
    {
      path: 'login',
      name: 'login',
      component: login
    },{
      path: 'register',
      name: 'register',
      component: register
    },{
      path: 'classDemo',
      name: 'classDemo',
      component: classDemo
    },{
      path: '',
      name: 'home',
      component: home
    }
  ]},{
    path: '*',
    redirect: '/main'
  }];

const router = new VueRouter({ routes: routers });
  router.beforeEach((to, from, next) => {
    next();
  });
  router.beforeResolve((to, from, next) => {
    next();
  });

export default router;