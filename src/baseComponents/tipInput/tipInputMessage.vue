<!-- 
  校验信息组件  TODO  这里的列表动画使用的动画库，期望不用动画库仅用transition完成动画
-->
<template>
  <transition-group tag="ul" class="tip-list" name="staggered-fade"
      v-bind:css="false"
      v-on:before-enter="beforeEnter"
      v-on:enter="enter"
      v-on:leave="leave">
    <li v-for="(rule, index) in rulesToShow" :key="rule.message" :data-index="index">
      <i :class="['icon', 'iconfont', returnIconClass(index)]"></i>
      <span v-text="rule.messageToShow"></span>
    </li>
  </transition-group>
</template>

<script>
import Velocity from 'velocity-animate'; // 动画库
const infoCode = 0;
const successCode = 1;
const failCode = 2;
const loadingCode = 3;

export default {
  name: 'tip-input-message',
  props: {
    value: {},
    isFocused: {},
    rules: {},
    required: {},
    checkComplete: {
      type: Function
    },
    checkSuccess: {
      type: Function
    },
    checkFail: {
      type: Function
    },
    isShow: {
      type: Boolean
    }
  },
  data () {
    return {
      countOfCheckComplete: 0,
      isIncludeError: false,
      rulesResult: []
    }
  },
  computed: {
    messageRules () {
      // 判断是否为必填项，是的话增加一个rule
      var result = __.cloneDeep(this.rules);
      if (this.required) result.unshift({
        message: '请填写此字段',
        rule: /^[\s\S]+$/
      })
      result.forEach(item => {
        item.messageToShow = item.message;
      });
      return result;
    },
    rulesToShow () {
      return this.isShow ? this.messageRules : [];
    }
  },
  methods: {
    returnIconClass (index) {
      if (this.value === '') {
        return 'iconinfo-circle-fill';
      } else {
        var result = this.rulesResult[index];
        if (result === infoCode) {
          return 'iconinfo-circle-fill';
        } else if (result === successCode) {
          return 'iconcheck-circle-fill';
        } else if (result === failCode) {
          return 'iconclose-circle-fill';
        } else if (result === loadingCode) {
          return 'iconsync';
        } else if (result === undefined) {
          return 'iconinfo-circle-fill';
        }
        return this.rulesResult[index] ? 'iconcheck-circle-fill' : 'iconclose-circle-fill';
      }
    },
    resetMessage () {
      __.forEach(this.messageRules, (item, index) => {
        item.messageToShow = item.message;
      });
    },
    checkRules () {
      return new Promise((resolve) => {
        if (!this.messageRules.length) return this.checkCompleteState(resolve);  //如果没有校验规则，直接完成校验
        this.countOfCheckComplete = 0;
        this.isIncludeError = false;
        this.rulesResult = Array.apply(null, { length: this.messageRules.length }).map(() => infoCode);
        this.resetMessage();
        this.messageRules.forEach((rule, ruleIndex) => {
          if (rule.isAsync) {
            this.checkRuleAsync(rule, ruleIndex, resolve);
          } else {
            this.checkRuleSync(rule, ruleIndex, resolve);
          }
        });
      });
    },
    checkRuleSync(rule, ruleIndex, resolve) {
      var result;
      if (__.isRegExp(rule.rule)) {
        result = rule.rule.test(this.value) ? successCode : failCode;
        if (result === failCode) this.isIncludeError = true;
        this.checkCompleteState(resolve);
      } else if (__.isFunction(rule.rule)) {
        var resultOfCheck = rule.rule(this.value);
        if (__.isObject(resultOfCheck)) {
          result = resultOfCheck.result ? successCode : failCode;
          rule.messageToShow = resultOfCheck.message;
          this.messageRules.splice(ruleIndex, 1, rule);
        } else {
          result = resultOfCheck ? successCode : failCode;
        }
        if (result === failCode) this.isIncludeError = true;
        this.checkCompleteState(resolve);
      } else {
        throw new Error('rule字段应提供一个正则或返回true/false的校验函数');
      }
      this.rulesResult[ruleIndex] = result;
    },
    checkRuleAsync(rule, ruleIndex, resolve) {
      const vm = this;
      this.rulesResult.splice(ruleIndex, 1, loadingCode);
      if (__.isFunction(rule.rule)) {
        rule.rule(this.value).then(function (message) {
          vm.rulesResult.splice(ruleIndex, 1, successCode);
          vm.checkCompleteState(resolve);
          if (message) rule.messageToShow = message;
        }, function (message) {
          vm.rulesResult.splice(ruleIndex, 1, failCode);
          vm.isIncludeError = true;
          vm.checkCompleteState(resolve);
          if (message) rule.messageToShow = message;
        });
      } else {
        throw new Error('异步rule字段应提供一个返回Promise校验函数');
      }
    },
    checkCompleteState (resolve) {
      this.countOfCheckComplete ++;
      if (this.countOfCheckComplete >= this.rulesResult.length) {
        const checkResult = this.messageRules.map((item, index) => {
          var itemResult = __.cloneDeep(item);
          itemResult.valid = this.rulesResult[index] === successCode ? true : false;
          return itemResult;
        });
        var isValid = !this.isIncludeError;
        if (this.isIncludeError) {
          this.$emit('check-fail', checkResult);
        } else {
          this.$emit('check-success', checkResult);
        }
        this.$emit('check-complete', isValid, checkResult);
        resolve(isValid);
      }
    },
    beforeEnter: function (el) {
      el.style.opacity = 0;
      el.style.height = 0;
    },
    enter: function (el, done) {
      var delay = el.dataset.index * 100
      setTimeout(function () {
        Velocity(
          el,
          { opacity: 1, height: '20px' },
          { complete: done }
        );
      }, delay);
    },
    leave: function (el, done) {
      var delay = el.dataset.index * 150
      setTimeout(function () {
        Velocity(
          el,
          { opacity: 0, height: 0 },
          { complete: done }
        );
      }, delay);
    }
  },
  created() {
    this.$nextTick(() => {
      var rulesLength = this.required ? this.rules.length + 1 : this.rules.length;
      this.rulesResult = Array.apply(null, { length: rulesLength }).map(() => infoCode);
    });
  },
  mounted () {

  }
}
</script>

<style lang="less" scoped>
  .tip-list {
    li {
      i,span {
        line-height: 20px;
        vertical-align: middle;
      }
      .iconcheck-circle-fill {
        color: green;
      }
      .iconinfo-circle-fill {
        color: skyblue;
      }
      .iconclose-circle-fill {
        color: red;
      }
      .iconsync {
        display: inline-block;
        animation: 2s linear infinite round;
        color: skyblue;
      }
      span {
        font-size: 12px;
      }
    }
  }
  @keyframes round {
    from {transform: rotate(0deg);}
    to {transform: rotate(360deg);}
  }
</style>