<!--
  设计思路：
    1.通过监听store中dialogArray中的dialogConfig数量变化自动控制弹出层的增加和删除
    2.组件中只需要处理如何增加和移除对应的dialogConig选项
    3.新增dialogConfig时自动添加dialogId,便于后面移除指定的dialogConfig
-->
<script>
let vm = null;
let createElement = null;
let dialogComponentChildren = [];  //用于保存diaglog VNode节点
let dialogConfigArrayCache = [];   //用于缓存dialogConfig,在watch方法中进行比较
let timerArray = [];               //用于暂存定时器信息
let maskClickEventArray = [];      //用于暂存mask点击事件
let buttonClickEventArray = [];    //用于暂存按钮点击事件
const DEFAULT_TIP_HEAD_TEXT = '提示';
const DEFAULT_TIP_CONTENT_TEXT = '提示信息';
const DEFAULT_BUTTON_TEXT = '关闭';

export default {
  name: 'dialog-component',
  render,
  mounted () {
    vm = this; // 这里保存一下实例，方便后面的函数调用store
  },
  computed: {
    dialogConfigArray () {
      return this.$store.state.dialogConfigArray;
    },
    dialogClass () {
      let length = this.$store.state.dialogConfigArray.length;
      if (length) return 'show-dialog';
      else return 'hide-dialog';
    }
  },
  watch: { //watch中比较diaglogConfigArray的变化,并根据变化增加或删除对应的dialog VNode
    dialogConfigArray (newDialogConfigArray) {
      let changesObject = compareDialogConfigArrayChange(newDialogConfigArray, dialogConfigArrayCache);
      let configsOfAdd = changesObject.configsOfAdd;
      let configsOfRemove = changesObject.configsOfRemove;
      if (configsOfAdd.length)  addNewDialog(configsOfAdd);
      if (configsOfRemove.length) removeInvalidDialog(configsOfRemove);
      dialogConfigArrayCache = __.cloneDeep(newDialogConfigArray); //更新dialog配置副本
    }
  },
  updated () {
    timerArray.forEach(timerInfo => {
      if (!timerInfo.isRunning) {
        timerInfo.isRunning = true;
        timerInfo.event();
      }
    });
  }
}

function render(create) {
  if (!createElement) createElement = create;
  const dialogComponentConfig = {
    class: 'dialog-component '+ this.dialogClass
  };
  return createElement('div', dialogComponentConfig, dialogComponentChildren);
}

// 增加新的弹出层
function addNewDialog(configsOfAdd) {
  configsOfAdd.forEach(dialogConfig => {
    let child = createDialogChild(createElement, dialogConfig);
    dialogComponentChildren.push(child);
    createTimeoutOfAutoRun(dialogConfig);
  });
}

// 移除无效的弹出层
function removeInvalidDialog(configsOfRemove) {
  configsOfRemove.forEach(config => {
    var indexToRemove = dialogComponentChildren.findIndex(configOfSearch => configOfSearch.dialogId === config.dialogId);
    dialogComponentChildren.splice(indexToRemove, 1);
  });
}

// 创建弹出层元素,每个弹出层自带一个遮罩层
function createDialogChild(createElement, dialogConfig) {
  let eventObject = parseEventDataReturnConfigObject(dialogConfig.maskEvent, dialogConfig);
  let maskConfig = {
    class: 'mask',
    on: eventObject
  };
  saveClickEventToArray(eventObject.click, dialogConfig, maskClickEventArray); //保存遮罩层点击事件
  let child = parseTipConfigReturnElement(createElement, dialogConfig); 
  return createElement('div', maskConfig, [child]);
}

// 比较并返回新旧dialogConfigAarry的差异
function compareDialogConfigArrayChange(newConfigArray, oldConfigArray) {
  let newConfigLength = newConfigArray.length;
  let oldConfigLength = oldConfigArray.length;
  let configsOfAdd = [];
  let configsOfRemove = [];
  if (newConfigLength && !oldConfigLength) configsOfAdd = newConfigArray;
  else if (!newConfigLength && oldConfigLength) configsOfRemove = oldConfigArray;
  else {
    newConfigArray.forEach(newConfig => {
      let isAdd = true;
      oldConfigArray.forEach(oldConfig => {
        if (oldConfig.dialogId === newConfig.dialogId) {
          isAdd = false;
        }
      });
      if (isAdd) configsOfAdd.push(newConfig);
    });
    oldConfigArray.forEach(newConfig => {
      let isRemove = true;
      newConfigArray.forEach(oldConfig => {
        if (oldConfig.dialogId === newConfig.dialogId) {
          isRemove = false;
        }
      });
      if (isRemove) configsOfRemove.push(newConfig);
    });
  }
  return {
    configsOfAdd,
    configsOfRemove
  };
}

// 保存事件在适当时调用
function saveClickEventToArray(event, dialogConfig, arrayToPush) {
  let eventInfo = {
    dialogId: dialogConfig.dialogId,
    event: event
  };
  arrayToPush.push(eventInfo);
}

function parseTipConfigReturnElement(createElement, dialogConfig) {
  let boxConfig = {
    class: 'tip-dialog col-mb-10 col-pd-6 col-pc-3 ' + parsePositionArguments(dialogConfig),
  };
  let tipChilren = [];
  if (dialogConfig.type === 'tip' && dialogConfig.timeout) tipChilren.push(createloadingElement(createElement, dialogConfig));
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

// 创建进度条
function createloadingElement(createElement, dialogConfig) {
  let timeout = parseAndReturnTimeoutValue(dialogConfig);
  const tipLoadingConfig = {
    class: 'tip-loading-box',
  };
  const loadingChildConfig = {
    class: 'tip-loading-fill fill-100',
    style: {
      'transition-duration': timeout - 0.02 + 's'
    },
    ref: 'loadingFill' + dialogConfig.dialogId
  };
  let loadingChild = createElement('div', loadingChildConfig);
  return createElement('div', tipLoadingConfig, [loadingChild]);
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
      buttons.forEach((buttonConfig, buttonIndex) => {
        switch (buttonConfig) {
          case 'close':
             buttonList.push(createButton(createElement, defaultButtonConfig, dialogConfig, buttonIndex));
             break;
          default:
            if (__.isObject(buttonConfig)) buttonList.push(createButton(createElement, buttonConfig, dialogConfig, buttonIndex)); 
        }
      });
    }
  } else {
    buttonList.push(createButton(createElement, defaultButtonConfig, dialogConfig, buttonIndex));
  }
  return buttonList;
}

// 创建按钮
function createButton(createElement, buttonData, dialogConfig, buttonIndex) {
  let buttonText = buttonData.text || DEFAULT_BUTTON_TEXT;
  let eventObject = parseEventDataReturnConfigObject(buttonData.event, dialogConfig);
  let buttonConfig = {
    class: buttonData.class || 'button',
    on: eventObject
  };
  // 保存click按钮事件，用于timeout调用
  if (checkButtonIndexIsValid(dialogConfig) && buttonIndex === dialogConfig.timeoutEvent) {
    saveClickEventToArray(eventObject.click, dialogConfig, buttonClickEventArray);
    dialogConfig.haveButtonClickEvent = true;
  };
  return createElement('button', buttonConfig, buttonText);
}

// 校验timeoutEvent参数是否是一个有效的按钮索引
function checkButtonIndexIsValid(dialogConfig) {
  let valueToCheck = dialogConfig.timeoutEvent;
  let isValid = true;
  if (!__.isNumber(valueToCheck) || valueToCheck < 0 || valueToCheck >= dialogConfig.buttons.length) {
    isValid = false;
  }
  return isValid;
}

// 解析事件并返回事件对象
function parseEventDataReturnConfigObject(eventData, dialogConfig) {
  let closeDialogEvent = () => {
    vm.$store.commit('removeDialogConfig', { dialogId: dialogConfig.dialogId });
    clearClosedDialogRelativeInfo(dialogConfig);
  };
  let eventObject = {};
  if (__.isObject(eventData)) {
    for (let key in eventData) {
      eventObject[key] = ($event) => {
        eventData[key](closeDialogEvent);
        $event && ($event.stopPropagation());
      };
    }
  } else if (__.isFunction(eventData)) {
    eventObject.click = ($event) => {
      eventData(closeDialogEvent);
      $event && ($event.stopPropagation());
    };
  } else if (eventData === 'close') {
    eventObject.click = ($event) => {
      closeDialogEvent();
      $event && ($event.stopPropagation());
    };
  }
  return eventObject;
}

// 解析timeout参数并创建定时器
function createTimeoutOfAutoRun(dialogConfig) {
  if (__.isNumber(dialogConfig.timeout)) {
    dialogConfig.haveTimeout = true;
    let timeout = parseAndReturnTimeoutValue(dialogConfig);
    let timerEvent = () => {
      // TODO 这里的20毫秒延迟是为了让transition能够生效，应想办法去掉
      setTimeout(() => {
        vm.$refs['loadingFill' + dialogConfig.dialogId].className = 'tip-loading-fill fill-0';
      }, 20);
      let timerId = setTimeout(() => {
        let timeoutEvent = parseTimeoutEvent(dialogConfig);
        clearClosedDialogRelativeInfo(dialogConfig);
        timeoutEvent && timeoutEvent();
      }, timeout * 1000);
      let indexOfChangeTimerId = timerArray.findIndex(timerInfo => timerInfo.dialogId === dialogConfig.dialogId);
      timerArray[indexOfChangeTimerId].timerId = timerId;
    };
    let timerInfo = {
      dialogId: dialogConfig.dialogId,
      timerId: null,
      isRunning: false,
      event: timerEvent
    };
    timerArray.push(timerInfo);
  }
}

// 解析并返回timeout事件
function parseTimeoutEvent(dialogConfig) {
  let closeDialogEvent = () => {
    vm.$store.commit('removeDialogConfig', { dialogId: dialogConfig.dialogId });
    clearClosedDialogRelativeInfo(dialogConfig);
  };
  let resultEvent = null;
  let timeoutEvent = dialogConfig.timeoutEvent;
  if (timeoutEvent === 'close') resultEvent = () => closeDialogEvent();
  else if (timeoutEvent === 'maskEvent') resultEvent = maskClickEventArray.find(eventInfo => eventInfo.dialogId === dialogConfig.dialogId).event;
  else if (__.isNumber(timeoutEvent)) resultEvent = buttonClickEventArray.find(eventInfo => eventInfo.dialogId === dialogConfig.dialogId).event;
  else if (__.isFunction(timeoutEvent)) resultEvent = () => timeoutEvent(closeDialogEvent);
  return resultEvent;
}

// 解析timeout的值为合法的值
function parseAndReturnTimeoutValue(dialogConfig) {
  let timeout = Math.ceil(Math.abs(dialogConfig.timeout));
  timeout = timeout > 1 ? timeout : 1;
  return timeout;
}

// 关闭弹出层时清除相关内容
function clearClosedDialogRelativeInfo(dialogConfig) {
  if (dialogConfig.haveTimeout) clearTimeoutOfAutoRun(dialogConfig);
  if (dialogConfig.haveButtonClickEvent) clearClosedDialogRelativeEvent(dialogConfig, buttonClickEventArray, () => dialogConfig.haveButtonClickEvent = false);
  clearClosedDialogRelativeEvent(dialogConfig, maskClickEventArray);
}

// 清除定时器
function clearTimeoutOfAutoRun(dialogConfig) {
  let indexToDelete = timerArray.findIndex(timerInfo => timerInfo.dialogId === dialogConfig.dialogId);
  if (indexToDelete > -1) {
    clearTimeout(timerArray[indexToDelete].timerId);
    dialogConfig.haveTimeout = false;
    timerArray.splice(indexToDelete, 1);
  }
}

function clearClosedDialogRelativeEvent(dialogConfig, arrayToSearch, callback) {
  let indexToDelete = arrayToSearch.findIndex(eventInfo => eventInfo.dialogId === dialogConfig.dialogId);
  if (indexToDelete > -1) {
    callback && callback();
    arrayToSearch.splice(indexToDelete, 1);
  }
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
          .tip-loading-box {
            position: absolute;
            width: 100%;
            height: 2px;
            top: 0;
            left: 0;
            .tip-loading-fill {
              position: absolute;
              left: 0;
              top: 0;
              height: 100%;
              background-color: $color-theme;
              transition: width 1s linear;
              &.fill-100 {
                width: 100%;
              }
              &.fill-0 {
                width: 0;
              }
            }
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