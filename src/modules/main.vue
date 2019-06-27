<template>
  <div class="main-page">
    <header-component></header-component>
    <router-view></router-view>
  </div>
</template>

<script>
import headerComponent from '@components/headerComponent/headerComponent.vue';
export default {
  components: {
    headerComponent
  }
}
</script>

<style lang="less" scoped>
  .main-page {
    padding-top: @header-height;
  }
</style>