<template>
  <div class="tip-input-box">
    <p v-if="label" @click="clickPlaceholder" :class="textClass">
      <span v-text="label"></span>
    </p>
    <div class="input-container">
      <input v-on="inputListeners" :value="value" :title="value" :type="type" :class="{'unactive': !isFocused || (value ==='' && !required), 'active': isActive, 'success': isChecked && !isActive && !hasError, 'fail': isChecked && !isActive && hasError && !(value ==='' && !required)}" ref="input">
      <span v-show="value === '' && !isActive && required && isFocused">必填</span>
    </div>
    <tip-input-message v-show="(isChecked && hasError && !(value ==='' && !required)) || isActive" :value="value" :rules="rules" :is-focused="isFocused" :lazy-check="lazyCheck" @check-complete="onCheckComplete" @check-success="onCheckSuccess" @check-fail="onCheckFail"></tip-input-message>
  </div>
</template>

<script>
let timer = null;

export default {
  name: 'tip-input',
  props: {
    // 提示文本
    label: {
      type: String,
      default: ''
    },
    // 双向绑定值
    value: {},
    // 输入框类型
    type: {
      type: String,
      default: 'text'
    },
    // 是否允许必填
    required: {
      type: Boolean,
      default: false
    },
    // 校验规则列表
    // item: {
      // message: '提示文本',
      // rule: 正则或返回true/false的校验函数,如果是异步校验需要返回Promise
      // isAsync: Bealoon,是否为异步校验
    // }
    rules: {
      type: Array,
      default: Array
    },
    // 是否懒校验,传入具体数字设置输入的校验间隔,没有传参则失焦校验,没有该属性输入时立即校验
    lazyCheck: {},
    // 校验完成时执行的方法
    checkComplete: {
      type: Function
    },
    // 校验通过时执行的方法
    checkSuccess: {
      type: Function
    },
    // 校验完不通过执行的方法
    checkFail: {
      type: Function
    }
  },
  data () {
    return {
      textClass: 'placeholder',
      isActive: false,
      isFocused: false,
      hasError: false,
      isChecked: false
    }
  },
  methods: {
    clickPlaceholder () {
      this.textClass = 'tip';
      this.$refs.input.focus();
    },
    checkTextClass () {
      if (this.value) {
        this.textClass = 'tip';
      } else {
        this.textClass = 'placeholder';
      }
    },
    onCheckComplete (state, checkResult) {
      this.isChecked = true;
      this.$emit('check-complete', state, checkResult);
    },
    onCheckSuccess (checkResult) {
      this.hasError = false;
      this.$emit('check-complete', checkResult);
    },
    onCheckFail (checkResult) {
      this.hasError = true;
      this.$emit('check-fail', checkResult);
    },
    updateInputMessageComponent () {
      this.isFocused = true;
      this.isChecked = true;
      this.$children.filter(item => item.$options.name === 'tip-input-message')[0].checkRules();  //由于是独立组件，直接获取子组件的方法
    }
  },
  mounted () {
    this.checkTextClass();
  },
  computed: {
    inputListeners () {
      var vm = this;
      return Object.assign({}, this.$listeners, {
        input (event) {
          vm.$emit('input', event.target.value, event);
        },
        focus (event) {
          if (!vm.isFocused) vm.isFocused = true;
          vm.textClass = 'tip';
          vm.isActive = true;
          vm.$emit('focus');
        },
        blur (event) {
          vm.value ? null : vm.textClass = 'placeholder';
          vm.isActive = false;
          if (vm.lazyCheck === '') {
            vm.updateInputMessageComponent();  //当组件有lazy-check属性而没有赋值的时候在失焦时校验
          }
          vm.$emit('blur', event);
        },
      })
    }
  },
  watch: {
    value () {
      this.checkTextClass();
      this.inputListeners.change && this.inputListeners.change();  //防止js赋值给input时,没有触发change的问题
      this.isFocused = true;  //防止js赋值给input时,校验列表没有展开的问题

      // 当绑定值变化时，如果Input没有焦点，说明是js改变了值，直接校验,否则判断是否需要懒校验
      if (!this.isActive) {
        this.updateInputMessageComponent();
      } else {
        var timeout = Number(this.lazyCheck);
        if (timeout > 0) {
          if (timer) clearTimeout(timer);
          timer = setTimeout(() => {
            this.updateInputMessageComponent();
            timer = null;
          }, timeout);
        } else if (this.lazyCheck === undefined) {
          this.updateInputMessageComponent();
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .tip-input-box {
    width: 100%;
    padding-top: 20px;
    display: inline-block;
    position: relative;
    p {
      box-sizing: border-box;
      position: absolute;
      z-index: 2;
      transition: .2s;
      width: 100%;
      padding-right: 21px;
      span {
        display: inline-block;
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .input-container {
      border-radius: 5px;
      position: relative;
      overflow: hidden;
      input {
        box-sizing: border-box;
        width: 100%;
        height: 30px;
        line-height: 30px;
        border: 1px solid #ccc;
        border-radius: 5px;
        font-size: 16px;
        padding-left: 5px;
        outline: none;
        &.unactive {
          border-color: #ccc;
        }
        &.active {
          border-color: skyblue;
        }
        &.success {
          border-color: green;
        }
        &.fail {
          border-color: red;
        }
      }
      span {
        position: absolute;
        right: 0;
        top: 0;
        height: 100%;
        background-color: red;
        color: white;
        font-size: 12px;
        line-height: 14px;
        width: 15px;
        text-align: center;
        z-index: 3;
      }
    }
    .placeholder {
      left: 6px;
      top: 20px;
      line-height: 32px;
      color: #aaa;
    }
    .tip {
      left: 6px;
      top: 0;
      line-height: 20px;
      color: #000;
      font-size: 12px;
    }
  }
</style>