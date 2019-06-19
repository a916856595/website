<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'tip-input-box',
  created () {
    console.log(this.$children.filter(item => item.$options.name === 'tip-input'))
  }
}
</script>

<style>

</style>

