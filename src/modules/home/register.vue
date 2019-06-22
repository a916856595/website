<template>
  <div class="w">
    <div class="register-content">
      <tip-input-box>
        <tip-input label="请输入账号" v-model="registerInfo.account" :rules="accountRules" lazy-check required></tip-input>
        <tip-input type="password" label="请输入密码" v-model="registerInfo.password" :rules="passwordRules" lazy-check required></tip-input>
        <tip-input type="password" label="请再次输入密码" v-model="registerInfo.passwordRepeat" :rules="passwordRepeatRules" lazy-check required></tip-input>
        <tip-input label="请输入昵称" v-model="registerInfo.nickName" lazy-check></tip-input>

        <div class="clearfix">
          <div class="w50 pr5 fl">
            <tip-input-submit tag="button" class="button w100" method="click" :submit="startCheck">
              <span>注册</span>
            </tip-input-submit>
          </div>
          <div class="w50 pl5 fl">
            <button class="button-empty w100">取消</button>
          </div>
        </div>
      </tip-input-box>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    var vm = this;
    return {
      registerInfo: {
        account: '',
        password: '',
        passwordRepeat: '',
        nickName: ''
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
      },],
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
    startCheck (checkEvent) {
      console.log('start check')
      checkEvent().then((resultObj) => {
        console.log(resultObj)
      }, (errorObj) => {
        console.log(errorObj)
      });
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

