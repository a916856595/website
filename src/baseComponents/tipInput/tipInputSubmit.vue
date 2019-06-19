<template>
  <div @click="checkAllField">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'tip-input-submit',
  methods: {
    checkAllField () {
      if (this.$parent.$options.name === 'tip-input-box'){
         this.$parent.checkAllChildren();
      }
    }
  },
  mounted () {
    console.log(this.$parent)
  }
}
</script>

<style>

</style>

