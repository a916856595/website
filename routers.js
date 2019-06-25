// 这里暂时不使用动态加载模块了，原因是在 .vue 文件中使用自动加载全局less 配合动态加载会导致less没有被加载
import home from './src/modules/home/home.vue';
import login from './src/modules/home/login.vue';
import register from './src/modules/home/register.vue';
import classDemo from './src/modules/demo/classDemo.vue';

const routers = [{
  path: '/home',
  name: 'home',
  component: home
},{
  path: '/login',
  name: 'login',
  component: login
},{
  path: '/register',
  component: register
},{
  path: '/classDemo',
  component: classDemo
},{
  path: '*',
  redirect: '/home'
}];

export default routers;