<!--
  校验组件的外壳，用于触发组件内tip-input校验方法，并传递结果给tip-input-submit组件
-->
<template>
  <div v-if="isReady">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'tip-input-box',
  props: {
    checkComplete: {
      type: Function
    }
  },
  data () {
    return {
      isReady: false,
      fieldIsAllRight: true
    }
  },
  methods: {
    checkAllChildren () {
      let vm = this;
      let promiseArray = [];
      this.fieldIsAllRight = true;
      this.$children
        .filter(item => item.$options.name === 'tip-input')
        .forEach(item => promiseArray.push(item.updateInputMessageComponent()));
      return new Promise((resolve, reject) => {
        Promise.all(promiseArray).then(validArray => {
          let isAllRight = true;
          validArray.forEach(item => {
            !item && (isAllRight = false);
          });
          let result = {
            isAllRight: isAllRight,
            resultArray: validArray
          };
          isAllRight ? resolve(result) : reject(result);
        });
      });
    }
  },
  mounted () {
    // 这里需要使用nextTick确保所有组件已经加载完成，避免校验时组件没准备好
    this.$nextTick(() => {
      this.isReady = true;
    });
  }
}
</script>

<style>

</style>