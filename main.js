import './src/styles/common/reset.css';
import './src/font/iconfont.css';
import './src/styles/common/common.less';
import './src/styles/common/layout.less';

import GLOBAL from './src/global.js';
import Vue from 'vue';

import App from './app.vue';
import router from './src/mainConfig/router.js';
import store from './src/mainConfig/store.js';
import axiosInstance from './src/mainConfig/request.js';
import methodsConstructor from './src/lib/easy.js';

Vue.prototype.$request = axiosInstance.axiosInstance; //普通请求
Vue.prototype.$tipRequest = axiosInstance.tipAxiosInstance; //带加载提示的请求

// 创建全局变量
global.GLOBAL = GLOBAL;
// 创建全局方法
global.__ = new methodsConstructor();

// 自动注册制定目录内全局基础组件和指令
autoRegisterBaseComponents();
autoRegisterBaseDirectives();

new Vue ({
  el: '#app',
  store,
  router,
  render: h => h(App)
});

// function
function autoRegisterBaseComponents () {
  const requireComponent = require.context('./src/baseComponents', true, /\.vue$/);
  requireComponent.keys().forEach(component => {
    const componentConfig = requireComponent(component);
    const controller = componentConfig.default || componentConfig;
    Vue.component(controller.name, controller);
  });
}

function autoRegisterBaseDirectives () {
  const requireDirective = require.context('./src/baseDirectives', true, /\.vue$/);
  requireDirective.keys().forEach(directive => {
    const directiveConfig = requireDirective(directive);
    const controller = directiveConfig.default || directiveConfig;
    Vue.directive(controller.name, controller);
  });
}