import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    requestCount: 0,  //请求数量计数器
    dialogArray: [],  //保存弹出框配置的数组
    dialogId: 0,      //弹出框id池
  },
  mutations: {
    addRequestCount (state) {
      state.requestCount++;
    },
    reduceRequestCount (state) {
      state.requestCount--;
    },
    addDialogConfig (state, dialogConfig) {
      dialogConfig.dialogId = state.dialogId;
      state.dialogArray.push(dialogConfig);
      state.dialogId ++;
    },
    removeDialogConfig (state, config) {
      if (config.removeAll) {
        state.dialogArray.splice(0, state.dialogArray.length);
      } else {
        let indexToRemove = state.dialogArray.findIndex( dialog => dialog.dialogId === config.dialogId );
        state.dialogArray.splice(indexToRemove, 1);
      }
    }
  }
});

export default store;