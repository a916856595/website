<template>
  <div class="w">
    <tip-input label="请输入账号" @focus="focusAccount" v-model="a"></tip-input>
    <p>
      <tip-input label="请输入密码" v-model="a"></tip-input>
    </p>
  </div>
</template>

<script>
import { setInterval } from 'timers';
export default {
  data () {
    return {
      a: '1111'
    }
  },
  methods: {
    focusAccount () {
      console.log('点击了账号')
    },
    focuspwd () {
      console.log('聚焦密码')
    },
    blur (e) {

    },
    change (v, e) {
      console.log('change',v, e)
    }
  },
  mounted () {

  }
}
</script>

<style lang="less">

</style>

