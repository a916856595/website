import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './app.vue';

Vue.use(VueRouter);

const routers = [{
  path: '/home',
  component: (resolve) => require(['./src/modules/home/home.vue'], resolve)
}, {
  path: '*',
  redirect: '/home'
}];
const router = new VueRouter({ routes: routers });
router.beforeEach((to, from, n) => {
  n();
});
router.beforeResolve((to, from, n) => {
  n();
});

new Vue ({
  el: '#app',
  router,
  render: h => h(App)
})
