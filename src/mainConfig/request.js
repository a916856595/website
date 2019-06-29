import store from './store.js';
import axios from 'axios';
import Qs from 'qs';

const serverBaseUrl = 'http://127.0.0.1:7000/api/';
let axiosInstance = createAxiosInstance();
let tipAxiosInstance = createAxiosInstance(configTipRquest);



// 创建axios实例
function createAxiosInstance(callback) {
  let request = {};
  let instance = axios.create({
    baseURL: serverBaseUrl,
    timeout: 5000,
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

export default {
  axiosInstance,
  tipAxiosInstance
};