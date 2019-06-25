<template>
  <div>
    <div class="top-header">
      <p>顶部</p>
    </div>
    <router-link to="/login">登录页</router-link>
    <router-link to="/register">注册页</router-link>
    <router-link to="/classDemo">类名Class</router-link>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="less">
  .top-header {
    background-color: @main-color;
  }
</style>