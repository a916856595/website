<!-- 
  校验信息组件
-->
<template>
  <transition name="fade">
      <ul class="tip-list" v-if="isFocused">
        <li v-for="(rule, index) in rules" :key="index">
          <i :class="['icon', 'iconfont', returnIconClass(index)]"></i>
          <span v-text="rule.message"></span>
        </li>
      </ul>
  </transition>
</template>

<script>
const infoCode = 0;
const successCode = 1;
const failCode = 2;
const loadingCode = 3;
const lazyCheckInterval = 200; //懒校验的时间间隔
var timer = null;

export default {
  name: 'tip-input-message',
  props: {
    value: {},
    isFocused: {},
    rules: {},
    lazyCheck: {},
    checkComplete: {
      type: Function
    },
    checkSuccess: {
      type: Function
    },
    checkFail: {
      type: Function
    }
  },
  data () {
    return {
      countOfCheckComplete: 0,
      isIncludeError: false,
      rulesResult: Array.apply(null, { length: this.rules.length }).map(() => infoCode)
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
        }
        return this.rulesResult[index] ? 'iconcheck-circle-fill' : 'iconclose-circle-fill';
      }
    },
    checkRules () {
      this.countOfCheckComplete = 0;
      this.isIncludeError = false;
      this.rulesResult = Array.apply(null, { length: this.rules.length }).map(() => infoCode);
      this.rules.forEach((rule, ruleIndex) => {
        if (rule.isAsync) {
          this.checkRuleAsync(rule, ruleIndex);
        } else {
          this.checkRuleSync(rule, ruleIndex);
        }
      });
    },
    checkRuleSync(rule, ruleIndex) {
      var result;
      if (__.isRegExp(rule.rule)) {
        result = rule.rule.test(this.value) ? successCode : failCode;
        if (result === failCode) this.isIncludeError = true;
        this.checkCompleteState();
      } else if (__.isFunction(rule.rule)) {
        result = rule.rule(this.value) ? successCode : failCode;
        if (result === failCode) this.isIncludeError = true;
        this.checkCompleteState();
      } else {
        throw new Error('rule字段应提供一个正则或返回true/false的校验函数');
      }
      this.rulesResult[ruleIndex] = result;
    },
    checkRuleAsync(rule, ruleIndex) {
      const vm = this;
      this.rulesResult.splice(ruleIndex, 1, loadingCode);
      var result;
      if (__.isFunction(rule.rule)) {
        rule.rule(this.value).then(function () {
          vm.rulesResult.splice(ruleIndex, 1, successCode);
          vm.checkCompleteState();
        }, function () {
          vm.rulesResult.splice(ruleIndex, 1, failCode);
          vm.isIncludeError = true;
          vm.checkCompleteState();
        });
      } else {
        throw new Error('异步rule字段应提供一个返回Promise校验函数');
      }
    },
    checkCompleteState () {
      this.countOfCheckComplete ++;
      if (this.countOfCheckComplete >= this.rulesResult.length) {
        const checkResult = this.rules.map((item, index) => {
          var itemResult = __.cloneDeep(item);
          itemResult.state = this.rulesResult[index] === successCode ? true : false;
          return itemResult;
        })
        if (this.isIncludeError) {
          this.$emit('check-fail', checkResult);
        } else {
          this.$emit('check-success', checkResult);
        }
        this.$emit('check-complete',!this.isIncludeError, checkResult);
      }
    }
  },
  mounted () {

  },
  watch: {
    value () {
      if (this.lazyCheck) {
        if (timer) clearTimeout(timer);
        timer = null;
        timer = setTimeout(() => {
          this.checkRules();
          timer = null;
        }, lazyCheckInterval);
      } else {
        this.checkRules();
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
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