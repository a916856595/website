<template>
    <div class="w fpl fpr">
    <div class="col-mb-12 col-pd-6 col-pd-offset-3 col-pc-4 col-pc-offset-4">
      <div class="register-content mb-content">
        <tip-input-box>
          <tip-input label="请输入账号" v-model="accountInfo.account" :rules="accountRules" lazy-check="1000" required></tip-input>
          <tip-input type="password" label="请输入密码" v-model="accountInfo.password" lazy-check="1000" required></tip-input>

          <div class="clearfix mt10">
            <div class="w100 pr5 fl">
              <tip-input-submit tag="button" class="button w100" method="click" :submit="login">
                <span>登录</span>
              </tip-input-submit>
            </div>
            <div class="fr pt20">
              <router-link to="/register">没有账号?</router-link>
            </div>
          </div>
        </tip-input-box>
      </div>
    </div>
  </div>
</template>

<script>
import { setInterval } from 'timers';
export default {
  data () {
    return {
      accountInfo: {
        account: '',
        password: ''
      },
      accountRules: [{
        message: '账号的长度不能低于6',
        rule: /^[\s\S]{6,}$/
      }]
    }
  },
  methods: {
    login (checkEvent) {
      checkEvent().then((resultObj) => {
        this.requestLogin();
      }, (errorObj) => {

      });
    },
    requestLogin () {
      const data = {
        account: this.accountInfo.account,
        password: this.accountInfo.password
      };
      this.$tipRequest.post('user/login', data).then(result => {
        if (result.code === 0) {
          this.$dialog.showTip('成功', 1, close => {
            this.$store.commit('updataTempAccountInfo', {
              nickName: result.nickName,
              id: result.userId
            });
            this.$router.push('/home');
            close();
          });
        } else {
          this.$dialog.showTip('账号或密码不正确', 2);
        }
      }, err => {

      });
    }
  },
  mounted () {

  }
}
</script>

<style lang="scss">

</style>

