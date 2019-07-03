<!--
  设计思路：
    1.通过监听store中dialogArray中的dialogConfig数量变化自动控制弹出层的增加和删除
    2.组件中只需要处理如何增加和移除对应的dialogConig选项
    3.新增dialogConfig时自动添加dialogId,便于后面移除指定的dialogConfig
-->
<script>
let vm = null;
let timer = null;
let maskClickEvent = null;  //用于暂存mask点击事件
let buttonsClickEventArray = [];  //用于暂存按钮点击事件
const DEFAULT_TIP_HEAD_TEXT = '提示';
const DEFAULT_TIP_CONTENT_TEXT = '提示信息';
const DEFAULT_BUTTON_TEXT = '关闭';

export default {
  name: 'dialog-component',
  render,
  data () {
    return {
      dialogConfigArray: [],
    }
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
  let EventObject = parseEventDataReturnConfigObject(dialogConfig.maskEvent, dialogConfig);
  let maskConfig = {
    class: 'mask',
    on: EventObject,
    ref: 'mask'
  };
  maskClickEvent = EventObject.click; //保存mask点击事件
  createTimeout(dialogConfig);
  return createElement('div', maskConfig, children)
}
// 循环创建弹出层
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
    class: 'tip-dialog col-mb-10 col-pd-6 col-pc-3 ' + parsePositionArguments(dialogConfig),
  };
  let tipChilren = [];
  if (dialogConfig.title) tipChilren.push(createHeaderElement(createElement, dialogConfig));
  tipChilren.push(createBodyElement(createElement, dialogConfig));
  return createElement('div', boxConfig, tipChilren);
}
// 解析position参数
function parsePositionArguments(dialogConfig) {
  const positionData = dialogConfig.position;
  let className = '';
  let rowArguments = ['x-center', 'left', 'right'];
  let colArguments = ['y-center', 'top', 'bottom'];
  let defaultClassName = rowArguments[0] + ' ' + colArguments[0];
  if (__.isString(positionData)) {
    if (rowArguments.indexOf(positionData) > 0) className = positionData + ' ' + colArguments[0];
    else if (colArguments.indexOf(positionData) > 0) className = rowArguments[0] + ' ' + positionData;
    else className = defaultClassName;
  } else if (__.isObject(positionData)) {
    let xPositionString = rowArguments[0];
    let yPositionString = colArguments[0];
    if (rowArguments.indexOf(positionData.x) > 0) xPositionString = positionData.x;
    if (colArguments.indexOf(positionData.y) > 0) yPositionString = positionData.y;
    className = xPositionString + ' ' + yPositionString;
  } else {
    className = defaultClassName;
  }
  return className;
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
  if (!dialogConfig.content && __.isArray(dialogConfig.buttons) && dialogConfig.buttons.length === 0) dialogConfig.content = DEFAULT_TIP_CONTENT_TEXT;
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
  let defaultButtonConfig = { text: DEFAULT_BUTTON_TEXT, class: 'button-empty', event: 'close' };
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
  let eventObject = parseEventDataReturnConfigObject(buttonData.event, dialogConfig);
  let buttonConfig = {
    class: buttonData.class || 'button',
    on: eventObject
  };
  buttonsClickEventArray.push(eventObject.click); //保存按钮事件
  return createElement('button', buttonConfig, buttonText);
}
// 解析事件并返回事件对象
function parseEventDataReturnConfigObject(eventData, dialogConfig) {
  let closeDialogEvent = () => {
    vm.$store.commit('removeDialogConfig', { dialogId: dialogConfig.dialogId });
  };
  let eventObject = {};
  if (__.isObject(eventData)) {
    for (let key in eventData) {
      eventObject[key] = ($event) => {
        eventData[key](closeDialogEvent);
        $event && ($event.stopPropagation());
        clearTimer();
      };
    }
  } else if (__.isFunction(eventData)) {
    eventObject.click = ($event) => {
      eventData(closeDialogEvent);
      $event && ($event.stopPropagation());
      clearTimer();
    };
  } else if (eventData === 'close') {
    eventObject.click = ($event) => {
      closeDialogEvent();
      $event && ($event.stopPropagation());
      clearTimer();
    };
  }
  return eventObject;
}
// 解析timeout参数并创建定时器
function createTimeout(dialogConfig) {
  if (__.isNumber(dialogConfig.timeout)) {
    let timeout = Math.ceil(Math.abs(dialogConfig.timeout));
    timeout = timeout > 1 ? timeout : 1;
    timer = setTimeout(() => {
      let timeoutEvent = parseTimeoutEvent(dialogConfig);
      timeoutEvent && timeoutEvent();
    }, timeout * 1000);
  }
}
// 清除定时器
function clearTimer() {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
}
// 解析并返回timeout事件
function parseTimeoutEvent(dialogConfig) {
  let closeDialogEvent = () => {
    vm.$store.commit('removeDialogConfig', { dialogId: dialogConfig.dialogId });
  };
  let resultEvent = null;
  let timeoutEvent = dialogConfig.timeoutEvent;
  if (timeoutEvent === 'close') resultEvent = () => { closeDialogEvent(); clearTimer(); };
  else if (timeoutEvent === 'maskEvent') resultEvent = maskClickEvent;
  else if (__.isNumber(timeoutEvent) && timeoutEvent < buttonsClickEventArray.length && timeoutEvent > -1) resultEvent = buttonsClickEventArray[timeoutEvent];
  else if (__.isFunction(timeoutEvent)) resultEvent = () => { timeoutEvent(closeDialogEvent); clearTimer(); };
  return resultEvent;
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
          position: absolute;
          background-color: #fff;
          box-shadow: 0 0 8px 1px rgba(0, 0, 0, .1);
          transform: translate(-50%, -50%);
          overflow: hidden;
          &.top {
            top: 20%;
          }
          &.y-center {
            top: 50%;
          }
          &.bottom {
            top: 70%;
          }
          &.left {
            left: 20%;
          }
          &.x-center {
            left: 50%;
          }
          &.right {
            left: 70%;
          }
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
    .text-center {
      text-align: center;
    }
  }
</style>