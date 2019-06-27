// 这里暂时不使用动态加载模块了，原因是在 .vue 文件中使用自动加载全局less 配合动态加载会导致less没有被加载
import main from './src/modules/main.vue';
import home from './src/modules/home/home.vue';
import login from './src/modules/home/login.vue';
import register from './src/modules/home/register.vue';
import classDemo from './src/modules/demo/classDemo.vue';

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

export default routers;