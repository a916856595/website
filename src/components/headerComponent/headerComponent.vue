<template>
  <div class="header-component">
    <div class="w">
      <div class="menu-list-box">
        <ul class="menu-list">
          <li class="fl hover-button">
            <span>首页</span>
          </li>
          <li class="fr pc hover-button">
            <span>注册</span>
          </li>
          <li class="fr pc hover-button">
            <span>登录</span>
          </li>
          <li class="fr mobile hover-button" @click="toggleSideMenu">
            <i class="icon iconfont iconmenu"></i>
          </li>
        </ul>
      </div>
    </div>
    <div :class="['menu-list-row-box', 'mobile', {'show-side-menu': isShowSideMenu}]">
      <ul class="menu-list-row">
        <li class="hover-button">
          <span>注册</span>
        </li>
        <li class="hover-button">
          <span>登录</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'header-component',
  data () {
    return {
      isShowSideMenu: false
    }
  },
  methods: {
    toggleSideMenu () {
      this.isShowSideMenu = !this.isShowSideMenu;
    }
  }
}
</script>

<style lang="less" scoped>
  .header-component {
    .menu-list-box {
      z-index: 99;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      background-color: #fff;
      color: #000;
      border-bottom: 1px solid @border-color;
    }
    .menu-list, .menu-list-row {
      li {
        padding: @header-padding @header-padding * 2;
        span, i {
          line-height: @header-line-height;
        }
      }
    }
    .menu-list-row-box {
      overflow: hidden;
      background-color: #fff;
      z-index: 98;
      padding-top: @header-height + 1px;
      position: fixed;
      left: 0;
      top: 0;
      width: 120px;
      height: 100%;
      border-right: @border;
      transform: translateX(-100%);
      transition: transform @transition-time;
      &.show-side-menu {
        transform: translateX(0);
      }
    }
    .menu-list-row {
      li {
        border-bottom: @border;
      }
    }
  }
</style>