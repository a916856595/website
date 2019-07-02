<!--
  设计思路：
    1.通过监听store中dialogArray中的dialogConfig数量变化自动控制弹出层的增加和删除
    2.组件中只需要处理如何增加和移除对应的dialogConig选项
    3.新增dialogConfig时自动添加dialogId,便于后面移除指定的dialogConfig
-->
<script>
let children = null;
let vm = null;
const DEFAULT_TIP_HEAD_TEXT = '提示';
const DEFAULT_TIP_HEAD_CONTENT = '提示信息';
const DEFAULT_BUTTON_TEXT = '关闭';

export default {
  name: 'dialog-component',
  render,
  props: {

  },
  data () {
    return {
      dialogConfigArray: [],
    }
  },
  methods: {
    
  },
  mounted () {
    vm = this; // 这里保存一下实例，方便后面的函数调用store
  },
  computed: {
    dialogArray () {
      return this.$store.state.dialogArray;
    },
    dialogClass () {
      let length = this.$store.state.dialogArray.length;
      if (length) return 'show-dialog';
      else return 'hide-dialog';
    }
  },
  watch: {
    dialogArray (newDialogArray) {
      this.dialogConfigArray = newDialogArray;
    }
  }
}

function render(createElement) {
  const dialogComponentConfig = {
    class: 'dialog-component '+ this.dialogClass
  };
  let dialogComponentChildren = loopDialogArrayToCreateChildren(createElement, this.dialogConfigArray);
  return createElement('div', dialogComponentConfig, dialogComponentChildren);
}
// 创建遮罩层
function createMaskElement(createElement, dialogConfig, children) {
  let EventObject = parseEventDataReturnConfigObject(dialogConfig.maskEvents, dialogConfig);
  let maskConfig = {
    class: 'mask',
    on: EventObject
  };
  return createElement('div', maskConfig, children)
}

function loopDialogArrayToCreateChildren(createElement, dialogConfigArray) {
  let children = dialogConfigArray.map(dialogConfig => {
    let child = null;
    switch (dialogConfig.type) {
      case 'tip': 
        child = parseTipConfigReturnElement(createElement, dialogConfig); 
        break;
    }
    return createMaskElement(createElement, dialogConfig, [child]);
  });
  return children;
}

function parseTipConfigReturnElement(createElement, dialogConfig) {
  let boxConfig = {
    class: 'tip-dialog col-mb-10 col-pd-6 col-pc-3 x-center',
  };
  let tipChilren = [];
  if (dialogConfig.title) tipChilren.push(createHeaderElement(createElement, dialogConfig));
  tipChilren.push(createBodyElement(createElement, dialogConfig));

  return createElement('div', boxConfig, tipChilren);
}
// 创建头部元素
function createHeaderElement(createElement, dialogConfig) {
  const tipHeaderConfig = {
    class: 'tip-header',
  };
  const dialogTitle = dialogConfig.title || DEFAULT_TIP_HEAD_TEXT;
  const tipHeaderContentArguments = ['div', { class: 'tip-header-content text-center' }, dialogTitle];
  return createElement('div', tipHeaderConfig, [createElement.apply(null, tipHeaderContentArguments)]);
}
// 创建内容元素
function createBodyElement(createElement, dialogConfig) {
  // 这里特殊处理一下，当没有内容且按钮列表为空时，展示一段默认文本
  if (!dialogConfig.content && __.isArray(dialogConfig.buttons) && dialogConfig.buttons.length === 0) dialogConfig.content = DEFAULT_TIP_HEAD_CONTENT;
  let dialogBody = [];
  let textContent = createElement('p', { class: 'text-conetnt' }, dialogConfig.content);
  dialogBody.push(textContent);
  let buttonList = createButtonChildren(createElement, dialogConfig);
  if (buttonList.length) {
    let buttonContent = createElement('div', { class: 'button-content' }, buttonList);
    dialogBody.push(buttonContent);
  }
  let tipBodyContent = createElement('div', { class: 'tip-body-content' }, dialogBody);
  return createElement('div', { class: 'tip-body' }, [tipBodyContent]);
}
// 创建按钮列表
function createButtonChildren(createElement, dialogConfig) { 
  // 按钮列表的处理逻辑：
  // 1.dialogConfig.buttons不是数组时间时显示关闭按钮
  // 2.dialogConfig.buttons为空数组时不展示任何按钮
  // 3.dialogConfig.buttons的item为'close'时替换为关闭按钮
  // 4.dialogConfig.buttons的item是对象时生成相应按钮
  let buttonList = [];
  let buttons = dialogConfig.buttons;
  let defaultButtonConfig = { text: DEFAULT_BUTTON_TEXT, class: 'button-empty', events: 'close' };
  if (__.isArray(buttons)) {
    if (buttons.length) {
      buttons.forEach(buttonConfig => {
        switch (buttonConfig) {
          case 'close':
             buttonList.push(createButton(createElement, defaultButtonConfig, dialogConfig));
             break;
          default:
            if (__.isObject(buttonConfig)) buttonList.push(createButton(createElement, buttonConfig, dialogConfig)); 
        }
      });
    }
  } else {
    buttonList.push(createButton(createElement, defaultButtonConfig, dialogConfig));
  }
  return buttonList;
}
// 创建按钮
function createButton(createElement, buttonData, dialogConfig) {
  let buttonText = buttonData.text || DEFAULT_BUTTON_TEXT;
  let eventObject = parseEventDataReturnConfigObject(buttonData.events, dialogConfig);
  let buttonConfig = {
    class: buttonData.class || 'button',
    on: eventObject
  };
  return createElement('button', buttonConfig, buttonText);
}
// 解析事件并返回事件对象
function parseEventDataReturnConfigObject(eventData, dialogConfig) {
  let closeEvent = () => {
    vm.$store.commit('removeDialogConfig', { dialogId: dialogConfig.dialogId });
  };
  let eventObject = {};
  if (__.isObject(eventData)) {
    for (let key in eventData) {
      eventObject[key] = () => {
        eventData[key](closeEvent);
      };
    }
  } else if (__.isFunction(eventData)) {
    eventObject.click = () => {
      eventData(closeEvent);
    };
  } else if (eventData === 'close') {
    eventObject.click = closeEvent;
  }
  return eventObject;
}
</script>

<style lang="scss">
  @mixin fullScreenPosition {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
  .dialog-component {
    &.show-dialog {
      position: fixed;
      z-index: 100;
      @include fullScreenPosition;
      .mask {
        position: absolute;
        background-color: rgba(0, 0, 0, .2);
        @include fullScreenPosition;
        .tip-dialog {
          top: 20%;
          background-color: #fff;
          box-shadow: 0 0 8px 1px rgba(0, 0, 0, .1);
          overflow: hidden;
          .tip-header {
            background-color: #f1f1f1;
            border-bottom: 1px solid #ccc;
            padding: $field-padding 0;
            .tip-header-content {
              padding: 0 20px;
            }
          }
          .tip-body {
            min-height: 50px;
            padding: $field-padding;
            .button-content {
              padding-top: 10px;
              text-align: center;
              button {
                margin-top: 5px;
                &:not(:first-child) {
                  margin-left: 5px;
                }
              }
            }
          }
        }
      }
    }
    &.hide-dialog {
      display: none;
    }
    .x-center {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
    .text-center {
      text-align: center;
    }
  }
</style>