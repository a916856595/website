<template>
  <div class="w">
    <div class="register-content">
      <tip-input label="请输入账号" v-model="registerInfo.account" disabled @change="change" @check-complete="finish" @check-success="success" @check-fail="fail" :rules="accountRules" lazy-check></tip-input>
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
          return new Promise(function (resolve, reject) {
            setTimeout(function () {
              if (value.indexOf('1') > -1) {
                reject();
              } else {
                resolve();
              }
            }, 2000)
          })
        },
        isAsync: true
      },
      {
        message: '必须包含2',
        rule: /2/
      }]
    }
  },
  methods: {
    change () {
      console.log(this.registerInfo.account)
    },
    finish (state, checkResult) {
      console.log('finish', state, checkResult);
    },
    success (checkResult) {
      console.log('success', checkResult);
    },
    fail (checkResult) {
      console.log('fail', checkResult);
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

