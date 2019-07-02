<template>
  <div class="main-page">
    <loading-animation-component></loading-animation-component>
    <header-component></header-component>
    <dialog-component></dialog-component>
    <router-view></router-view>
    <div>
      <button class="button" @click="addDialog">点击增加弹出层</button>
    </div>
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
  },
  methods: {
    addDialog () {
      this.$store.commit('addDialogConfig', {
        type: 'tip',
        title: '提示信息',
        content: '操作已完成！',
        buttons: ['close', {
          text: '延迟关闭',
          class: 'button',
          events: {
            click (closeDialog) {
              setTimeout(closeDialog, 2000);
            }
          }
        }],
        maskEvents (closeDialog) {
          closeDialog();
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .main-page {
    padding-top: $header-height;
  }
</style>