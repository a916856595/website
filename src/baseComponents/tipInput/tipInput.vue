<template>
  <div class="tip-input-box">
    <p v-if="label" v-text="label" @click="clickPlaceholder" :class="textClass"></p>
    <input v-on="inputListeners" :value="value" :title="value" :type="type" :class="{'unactive': !isFocused || !isChecked, 'active': isActive, 'success': isChecked && !isActive && !hasError, 'fail': isChecked && !isActive && hasError}" ref="input">
    <tip-input-message :value="value" :rules="rules" :is-focused="isFocused" :lazy-check="lazyCheck" @check-complete="onCheckComplete" @check-success="onCheckSuccess" @check-fail="onCheckFail"></tip-input-message>
  </div>
</template>

<script>
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
    // 校验规则列表
    rules: {
      type: Array,
      default: Array
    },
    // 是否懒校验
    lazyCheck: {
      type: Boolean
    },
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
          vm.$emit('blur', event);
        }
      })
    }
  },
  watch: {
    value () {
      this.checkTextClass();
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
      position: absolute;
      transition: .2s;
    }
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