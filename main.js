import './src/styles/common/reset.css';
import './src/font/iconfont.css';
import './src/styles/common/common.less';

import GLOBAL from './src/global.js';
import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import App from './app.vue';
import routers from './routers.js';
import methodsConstructor from './src/lib/easy.js';
import axios from 'axios';
import Qs from 'qs';

let serverBaseUrl = 'http://127.0.0.1:7000/api/';
let axiosInstance = createAxiosInstance();
let tipAxiosInstance = createAxiosInstance(configTipRquest);

Vue.prototype.$request = axiosInstance;
Vue.prototype.$tipRequest = tipAxiosInstance;

Vue.use(VueRouter);
Vue.use(Vuex);
// 创建全局变量
global.GLOBAL = GLOBAL;
// 创建全局方法
global.__ = new methodsConstructor();

// 自动注册全局基础组件和指令
autoRegisterBaseComponents();
autoRegisterBaseDirectives();

const router = new VueRouter({ routes: routers });
router.beforeEach((to, from, next) => {
  next();
});
router.beforeResolve((to, from, next) => {
  next();
});

const store = new Vuex.Store({
  state: {
    requestCount: 0  //请求数量计数器
  },
  mutations: {
    addRequestCount (state) {
      state.requestCount++;
    },
    reduceRequestCount (state) {
      state.requestCount--;
    }
  }
});

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

// 创建axios实例
function createAxiosInstance(callback) {
  let request = {};
  let instance = axios.create({
    baseURL: serverBaseUrl,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    transformRequest: [function (data) {
      data = Qs.stringify(data);
      return data;
    }]
  });

  callback && callback(instance);

  request.get = function (url, data) {
    return new Promise((resolve, reject) => {
      instance.get(url, { params: data}).then(response => {
        resolve(response.data.result);
      }).catch(function (msg) {
        reject(msg);
      });
    })
  };

  request.post = function (url, data) {
    return new Promise((resolve, reject) => {
      instance.post(url, data).then(response => {
        resolve(response.data.result);
      }).catch(function (msg) {
        reject(msg);
      });
    })
  };

  return request;
}

// TODO 对需要有提示的请求做配置，目前思路是在vuex配置一个count，发送请求后自增，完成请求自减，count不为零说明当前还有请求未完成，展示提示信息
function configTipRquest(instance) {
  instance.interceptors.request.use(config => {
    // 在发送请求之前做些什么
    store.commit('addRequestCount');
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

  instance.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    store.commit('reduceRequestCount');
    return response;
  }, function (error) {
    // 对响应错误做点什么
    store.commit('reduceRequestCount');
    return Promise.reject(error);
  });
}