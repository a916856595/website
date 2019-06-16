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
export default {
  name: 'tip-input-message',
  props: {
    value: {},
    isFocused: {},
    rules: {}
  },
  data () {
    return {
      rulesResult: []
    }
  },
  methods: {
    returnIconClass (index) {
      if (this.value === '') {
        return 'iconinfo-circle-fill';
      } else {
        return this.rulesResult[index] ? 'iconcheck-circle-fill' : 'iconclose-circle-fill';
      }
    },
    checkRules () {
      var resultArr = [];
      this.rules.forEach((rule) => {
        var result;
        if (rule.rule) {
          result = rule.rule(this.value);
        } else if (rule.regExp) {
          result = rule.regExp.test(this.value);
        } else {
          throw new Error('must set rule or RegExp field in rules item');
        }
        resultArr.push(result);
      });
      this.rulesResult = resultArr;
    }
  },
  mounted () {

  },
  watch: {
    value () {
      this.checkRules();
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
      span {
        font-size: 12px;
      }
    }
  }
</style>