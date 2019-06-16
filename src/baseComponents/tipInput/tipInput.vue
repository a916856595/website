<template>
  <div class="tip-input-box">
    <p v-if="label" v-text="label" @click="clickPlaceholder" :class="textClass"></p>
    <input v-on="inputListeners" :value="value" :title="value" :type="type" ref="input">
    <tip-input-message :value="value" :rules="rules" :is-focused="isFocused"></tip-input-message>
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
    }
  },
  data () {
    return {
      textClass: 'placeholder',
      isActive: false,
      isFocused: false
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
      &.active {
        border-color: skyblue;
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