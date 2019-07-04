<template>
  <div class="main-page">
    <loading-animation-component></loading-animation-component>
    <header-component></header-component>
    <dialog-component></dialog-component>
    <router-view></router-view>
    <div style="padding-top: 200px;">
      <button class="button" @click="addDialog('A')">点击增加弹出层A</button>
      <button class="button" @click="addDialog('B')">点击增加弹出层B</button>
      <button class="button" @click="addDialog('C')">点击增加弹出层C</button>
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
  data () {
    return {
      number: 1
    }
  },
  methods: {
    addDialog (name) {
      let vm = this;
      this.$store.commit('addDialogConfig', {
        position: 'bottom',
        type: 'tip',
        title: '提示信息',
        content: '操作已完成！',
        timeout: 3,
        timeoutEvent: 1,
        buttons: ['close', {
          text: '延迟关闭',
          class: 'button',
          event: {
            click (closeDialog) {
              console.log(name)
              // setTimeout(function () {
                closeDialog();
              // }, 2000);
            }
          }
        }],
        maskEvent (closeDialog) {
          console.log('mask' + name);
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