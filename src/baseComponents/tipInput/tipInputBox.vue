<template>
  <div v-if="isReady">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'tip-input-box',
  data () {
    return {
      isReady: false
    }
  },
  methods: {
    checkAllChildren () {
      this.$children.filter(item => item.$options.name === 'tip-input').forEach(item => item.updateInputMessageComponent());
    }
  },
  mounted () {
    // 这里需要使用nextTick确保所有组件已经加载完成，避免点击校验而校验组件却没准备好
    this.$nextTick(() => {
      this.isReady = true;
    });
  }
}
</script>

<style>

</style>