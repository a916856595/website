<template>
  <div class="w">
    <div class="register-content">
      <tip-input-box>
        <tip-input label="请输入账号" v-model="registerInfo.account" disabled @change="change" @check-complete="finish" :rules="accountRules" lazy-check not-empty></tip-input>
        <tip-input type="password" label="请输入密码" v-model="registerInfo.password" :rules="passwordRules" lazy-check></tip-input>
        <div>
          <p>
            <tip-input type="password" label="请再次输入密码" v-model="registerInfo.passwordRepeat" :rules="passwordRepeatRules" lazy-check></tip-input>
          </p>
        </div>
        
        <tip-input-submit>
          <button type="submit">点击校验</button>
        </tip-input-submit>
      </tip-input-box>
    </div>
  </div>
</template>

<script>
import { setInterval } from 'timers';
export default {
  data () {
    var vm = this;
    return {
      registerInfo: {
        account: '',
        password: '',
        passwordRepeat: ''
      },
      accountRules: [{
        message: '账号的长度不能低于6',
        rule: /^[\s\S]{6,}$/
      }, {
        message: '账号的长度不能超过18',
        rule: /^[\s\S]{0,18}$/
      }],
      passwordRules: [{
        message: '密码的长度不能低于9',
        rule: /^[\s\S]{6,}$/
      }, {
        message: '密码的长度不能超过18',
        rule: /^[\s\S]{0,18}$/
      }],
      passwordRepeatRules: [{
        message: '密码的长度不能低于9',
        rule: /^[\s\S]{6,}$/
      }, {
        message: '密码的长度不能超过18',
        rule: /^[\s\S]{0,18}$/
      }, {
        message: '两次密码输入必须一致',
        rule () {
          if (vm.registerInfo.password === vm.registerInfo.passwordRepeat) {
            return { result: true, message: '两次密码输入一致'};
          }
          return { result: false, message: '两次密码输入不一致'};
        }
      }]
    }
  },
  methods: {
    change ($event) {

    },
    finish (state, checkResult) {
      console.log('finish', state, checkResult);
    },
    success (checkResult) {
      console.log('success', checkResult);
    },
    fail (checkResult) {
      console.log('fail', checkResult);
    },
    input (event) {
      console.log('input outer')
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

