<template>
  <div class="main-page">
    <header-component></header-component>
    <router-view></router-view>
    <div class="mask" v-show="requestCount">
      <p>mask</p>
    </div>
  </div>
</template>

<script>
import headerComponent from '@components/headerComponent/headerComponent.vue';
export default {
  components: {
    headerComponent
  },
  computed: {
    requestCount () {
      console.log(this.$store.state.requestCount)
      return this.$store.state.requestCount;
    }
  }
}
</script>

<style lang="less" scoped>
  .main-page {
    padding-top: @header-height;
    .mask {
      position: fixed;
      z-index: 100;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background-color: #000;
    }
  }
</style>