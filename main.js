import './src/styles/common/reset.css';
import './src/font/iconfont.css';
import './src/styles/common/common.less';

import GLOBAL from './src/global.js';
import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './app.vue';
import routers from './routers.js';

Vue.use(VueRouter);
// 创建全局变量
global.GLOBAL = GLOBAL;

// 自动注册全局基础组件
autoRegisterBaseComponents();

const router = new VueRouter({ routes: routers });
router.beforeEach((to, from, next) => {
  next();
});
router.beforeResolve((to, from, next) => {
  next();
});

new Vue ({
  el: '#app',
  router,
  render: h => h(App)
});

function autoRegisterBaseComponents () {
  const requireComponent = require.context('./src/baseComponents', true, /\.vue$/);
  requireComponent.keys().forEach(component => {
    const componentConfig = requireComponent(component);
    const controller = componentConfig.default || componentConfig;
    Vue.component(controller.name, controller);
  });
}