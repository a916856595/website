<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'tip-input-box',
  methods: {
    checkAllChildren () {
      this.$children.filter(item => item.$options.name === 'tip-input').forEach(item => item.updateInputMessageComponent());
    }
  }
}
</script>

<style>

</style>

