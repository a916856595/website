<template>
  <div class="home-page">
    <header-component></header-component>
    <router-link to="/login">登录页</router-link>
    <router-link to="/register">注册页</router-link>
    <router-link to="/classDemo">类名Class</router-link>
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
  .home-page {
    padding-top: @header-height;
  }
</style>