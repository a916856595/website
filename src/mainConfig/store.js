import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    requestCount: 0,  //请求数量计数器
    dialogConfigArray: [],  //保存弹出框配置的数组
    dialogId: 0,      //弹出框id池
    tempAccountInfo: {}
  },
  mutations: {
    addRequestCount (state) {
      state.requestCount++;
    },
    reduceRequestCount (state) {
      state.requestCount--;
    },
    addDialogConfig (state, dialogConfig) {
      dialogConfig.dialogId = state.dialogId++;
      state.dialogConfigArray.push(dialogConfig);
    },
    removeDialogConfig (state, config) {
      if (config.removeAll) {
        state.dialogConfigArray.splice(0, state.dialogConfigArray.length);
      } else {
        let indexToRemove = state.dialogConfigArray.findIndex( dialog => dialog.dialogId === config.dialogId );
        state.dialogConfigArray.splice(indexToRemove, 1);
      }
    },
    updataTempAccountInfo (state, data) {
      state.tempAccountInfo = data;
    }
  }
});

export default store;