<template>
  <div class="w">
    <div class="register-content">
      <tip-input label="请输入账号" v-model="registerInfo.account" @change="change" :rules="accountRules"></tip-input>
      <tip-input type="password" label="请输入密码" v-model="registerInfo.password"></tip-input>
      <tip-input type="password" label="请再次输入密码" v-model="registerInfo.passwordRepeat"></tip-input>
    </div>
  </div>
</template>

<script>
import { setInterval } from 'timers';
export default {
  data () {
    return {
      registerInfo: {
        account: '',
        password: '',
        passwordRepeat: ''
      },
      accountRules: [{
        message: '不能包含1',
        rule: function (value) {
          if (value.indexOf('1') > -1) return false;
          return true;
        }
      },
      {
        message: '不能包含2',
        rule: function (value) {
          if (value.indexOf('2') > -1) return false;
          return true;
        }
      }]
    }
  },
  methods: {
    change () {
      console.log(this.registerInfo.account)
    }
  },
  mounted () {

  }
}
</script>

<style lang="less">
  .register-content {
    max-width: 300px;
    margin: 0 auto;
  }
</style>

