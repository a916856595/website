<template>
  <div class="header-component">
    <div class="w">
      <span>首页</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'header-component'
}
</script>

<style lang="less" scoped>
  .header-component {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: @header-height;
    background-color: black;
    span {
      color: red;
    }
  }
</style>