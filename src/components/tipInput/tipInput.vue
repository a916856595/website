<template>
  <div class="tip-input-box">
    <p v-text="label" :class="textClass"></p>
    <input type="text" @focus="textClass = 'tip'" @blur="textClass = 'placeholder'">
  </div>
</template>

<script>
export default {
  name: 'tip-input',
  props: {
    label: {}
  },
  data () {
    return {
      textClass: 'placeholder',
    }
  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
  .tip-input-box {
    padding-top: 16px;
    display: inline-block;
    position: relative;
    p {
      position: absolute;
      transition: .2s;
    }
    input {
      height: 30px;
      line-height: 30px;
      border: 1px solid #ccc;
      border-radius: 5px;
      font-size: 16px;
      padding-left: 5px;
      outline: none;
    }
    .placeholder {
      left: 6px;
      top: 16px;
      line-height: 32px;
      color: #aaa;
    }
    .tip {
      left: 6px;
      top: 0;
      line-height: 16px;
      color: #aaa;
      font-size: 8px;
    }
  }
</style>

