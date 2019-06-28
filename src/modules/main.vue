<template>
  <div class="main-page">
    <loading-animation-component></loading-animation-component>
    <header-component></header-component>
    <router-view></router-view>
  </div>
</template>

<script>
import headerComponent from '@components/headerComponent/headerComponent.vue';
import loadingAnimationComponent from '@components/loadingAnimationComponent/loadingAnimationComponent.vue';
export default {
  components: {
    headerComponent,
    loadingAnimationComponent
  }
}
</script>

<style lang="less" scoped>
  .main-page {
    padding-top: @header-height;
  }
</style>