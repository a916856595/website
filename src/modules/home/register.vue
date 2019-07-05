<template>
  <div class="w fpl fpr">
    <div class="col-mb-12 col-pd-6 col-pd-offset-3 col-pc-4 col-pc-offset-4">
      <div class="register-content mb-content">
        <tip-input-box>
          <tip-input label="请输入账号" v-model="registerInfo.userName" :rules="userNameRules" lazy-check="1000" required></tip-input>
          <tip-input type="password" label="请输入密码" v-model="registerInfo.password" :rules="passwordRules" lazy-check="1000" required></tip-input>
          <tip-input type="password" label="请再次输入密码" v-model="registerInfo.passwordRepeat" :rules="passwordRepeatRules" lazy-check="1000" required></tip-input>
          <tip-input label="请输入昵称" v-model="registerInfo.nickName" lazy-check></tip-input>

          <div class="clearfix mt10">
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
  </div>
</template>

<script>
export default {
  data () {
    var vm = this;
    return {
      isFieldAllRight: false,
      registerInfo: {
        userName: '',
        password: '',
        passwordRepeat: '',
        nickName: ''
      },
      userNameRules: [{
        message: '账号的长度不能低于6',
        rule: /^[\s\S]{6,}$/
      }, {
        message: '账号的长度不能超过18',
        rule: /^[\s\S]{0,18}$/
      }, {
        message: '账号是否可用',
        rule: () => {
          return new Promise((resolve, reject) => {
            let userName = vm.registerInfo.userName;
            if (userName === '' || userName === undefined) return reject('请输入账号后进行重名校验');
            if (userName.length < 6 || userName.length > 18) return reject('请输入符合规则的账号后进行重名校验');
            this.checkAccountIsRepeat().then(result => {
              if (result.usable === 'usable') resolve('账号可用');
              reject('账号不可用');
            }, err => {
              reject('账号校验异常');
            })
          });
        },
        isAsync: true
      }],
      passwordRules: [{
        message: '密码的长度不能低于9',
        rule: /^[\s\S]{9,}$/
      }, {
        message: '密码的长度不能超过18',
        rule: /^[\s\S]{0,18}$/
      },],
      passwordRepeatRules: [{
        message: '密码的长度不能低于9',
        rule: /^[\s\S]{9,}$/
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
      checkEvent().then((resultObj) => {
        this.isFieldAllRight = true;
        this.register();
      }, (errorObj) => {
        console.log(errorObj)
        this.isFieldAllRight = false;
      });
    },
    checkAccountIsRepeat () {
      var vm = this;
      return new Promise((resolve, reject) => {
        vm.$request.get('user/checkUserName', { userName: vm.registerInfo.userName }).then(result => resolve(result), err => reject(err));
      });
    },
    register () {
      if (!this.isFieldAllRight) return alert('校验未通过');
      var vm = this;
      vm.$tipRequest.post('user/sign', vm.registerInfo).then(result => {
        if (result.code === 0) {
          let dialogConfig = {
            position: 'top',
            type: 'tip',
            title: '提示',
            content: '注册成功，即将返回主页！',
            timeout: 5,
            timeoutEvent: 'maskEvent',
            buttons: [],
            maskEvent (closeDialog) {
              closeDialog();
              vm.$router.push('/home');
            }
          };
          vm.$dialog.push(dialogConfig);
        } else {
          console.log('注册失败')
        }
      }, err => err);
    }
  },
  mounted () {

  }
}
</script>

<style lang="scss">

</style>

