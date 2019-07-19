<!--
  校验组件的提交按钮，利用slot内容的click冒泡触发tip-input-box的校验方法,当前写法只支持作为tip-input-box的直接子组件
  method of trigger check
  @prop method
  @type string

  submit function
  @prop submit
  @type function
  @params checkEvent used promise
-->
<script>
export default {
  name: 'tip-input-submit',
  props: {
    tag: {
      type: String,
      default: 'span'
    },
    submit: {
      type: Function,
      required: true
    },
    method: {
      type: String,
      default: 'click'
    }
  },
  render (createElement) {
    let eventObj = {};
    eventObj[this.method] = () => {
      this.submit(this.checkAllField);
    };
    return createElement(this.tag, { on: eventObj }, this.$slots.default);
  },
  methods: {
    checkAllField () {
      // TODO 这里应该做递归判断
      if (this.$parent.$options.name === 'tip-input-box'){
        return this.$parent.checkAllChildren();
      } else {
        throw new Error('tip-input-box must be tip-input-submit father component');
      }
    }
  }
}
</script>

<style lang="scss">

</style>