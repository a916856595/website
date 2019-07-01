import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    requestCount: 0,  //请求数量计数器
    dialogArray: [{ type: 'tip', title: '标题', content: '内容' }] //保存弹出框配置的数组
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

export default store;