<template>
  <div class="main-page">
    <loading-animation-component></loading-animation-component>
    <header-component></header-component>
    <dialog-component></dialog-component>
    <router-view></router-view>
  </div>
</template>

<script>
import headerComponent from '@components/headerComponent/headerComponent.vue';
import loadingAnimationComponent from '@components/loadingAnimationComponent/loadingAnimationComponent.vue';
import dialogComponent from '@components/dialog/dialogComponent.vue';
export default {
  components: {
    headerComponent,
    loadingAnimationComponent,
    dialogComponent
  }
}
</script>

<style lang="scss" scoped>
  .main-page {
    padding-top: $header-height;
  }
</style>