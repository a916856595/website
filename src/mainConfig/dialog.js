import store from './store.js';
import { isNumber } from 'util';

function push(dialogConfig) {
  store.commit('addDialogConfig', dialogConfig);
}

function clear() {
  store.commit('removeDialogConfig', { removeAll: true });
}

function showTip(content, secondParam, thirdParam) {
  let timeout,closeEvent,buttonParams;
  if (typeof(secondParam) === 'number') timeout = secondParam;
  if (typeof(secondParam) === 'function') closeEvent = secondParam;
  if (typeof(thirdParam) === 'function') closeEvent = thirdParam;
  if (closeEvent) {
    buttonParams = {
      text: '确认',
      class: 'button',
      event: closeEvent
    }
  }
  push({
    position: 'top',
    type: 'tip',
    title: '提示信息',
    content: content,
    timeout: timeout,
    timeoutEvent: 'maskEvent',
    buttons: [(buttonParams || 'close')],
    maskEvent: closeEvent || 'close'
  });
}

// dialog config 示例
// {
//   position: 'top',
//   type: 'tip',
//   title: '提示信息',
//   content: '操作已完成！',
//   timeout: 3,
//   timeoutEvent: 1,
//   buttons: ['close', {
//     text: '延迟关闭',
//     class: 'button',
//     event: {
//       click (closeDialog) {
//         console.log(name)
//         // setTimeout(function () {
//           closeDialog();
//         // }, 2000);
//       }
//     }
//   }],
//   maskEvent (closeDialog) {
//     console.log('mask' + name);
//     closeDialog();
//   }
// }


export default {
  push,
  clear,
  showTip
};