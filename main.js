import './src/styles/common/reset.css';
import './src/styles/common/common.less';

import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './app.vue';
import routers from './routers.js';
import commonComponents from './src/components/commonComponents.js';

Vue.use(VueRouter);
Vue.use(commonComponents);

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
});
