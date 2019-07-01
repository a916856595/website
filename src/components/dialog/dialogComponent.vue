<!--

-->
<script>
let children = null;
export default {
  name: 'dialog-component',
  props: {

  },
  render (createElement) {
    return createElement('div', {
      attrs: {
        class: 'dialog-component '+ this.dialogClass
      }
    }, this.createChildren(createElement));
  },
  methods: {
    createChildren (createElement) {
      if (this.dialogArray && this.dialogArray.length) {

      } else {
        return null;
      }
    }
  },
  computed: {
    dialogArray () {
      this.$store.state.dialogArray;
    },
    dialogClass () {
      let length = this.$store.state.dialogArray.length;
      console.log(length)
      if (length) return 'show-dialog';
      else return 'hide-dialog';
    }
  },
  watch: {
    dialogArray (dialogArray) {

    }
  }
}

function loopDialogArrayToCreateChildren() {

}

function parseTipConfigReturnElement(createElement, config) {

  return createElement('div', );
}
</script>

<style lang="scss">
  @mixin fullScreenPosition {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
  .dialog-component {
    &.show-dialog {
      position: fixed;
      z-index: 100;
      @include fullScreenPosition;
      .mask {
        position: absolute;
        @include fullScreenPosition;
      }
    }
    &.hide-dialog {
      display: none;
    }
  }
</style>