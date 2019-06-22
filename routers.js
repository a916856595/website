const routers = [{
  path: '/home',
  component: (resolve) => require(['./src/modules/home/home.vue'], resolve)
},{
  path: '/login',
  component: (resolve) => require(['./src/modules/home/login.vue'], resolve)
},{
  path: '/register',
  component: (resolve) => require(['./src/modules/home/register.vue'], resolve)
},{
  path: '/classDemo',
  component: (resolve) => require(['./src/modules/demo/classDemo.vue'], resolve)
},{
  path: '*',
  redirect: '/home'
}];

export default routers;