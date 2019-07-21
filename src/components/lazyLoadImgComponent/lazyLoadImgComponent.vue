<template>
  <div class="lazy-load-img-component">
    <div style="height: 1000px;"></div>
    <img ref="img" src="http://b-ssl.duitang.com/uploads/blog/201310/31/20131031193452_e5iVR.jpeg" alt="">
  </div>
</template>

<script>
let timer = null;
export default {
  name: 'lazy-load-img-component',
  data () {
    return {
      isChanged: false
    }
  },
  methods: {
    setTimer () {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      timer = setTimeout(() => {
        this.computedMargin();
        clearTimeout(timer);
        timer = null;
      }, 200);
    },
    computedMargin () {
      const clientHeight = document.documentElement.clientHeight;
      const elementHeightToTop = this.$refs.img.getBoundingClientRect().y;
      if (elementHeightToTop - clientHeight <= 0) {
        this.isChanged = true;
        this.removeScrollListener();
        this.changeImgContent();
      }
    },
    changeImgContent () {
      this.$refs.img.src = 'http://photocdn.sohu.com/20120302/Img336421159.jpg';
    },
    addScrollListener () {
      
      if (!this.isChanged) document.addEventListener('scroll', this.setTimer);
    },
    removeScrollListener () {
      document.removeEventListener('scroll', this.setTimer);
    }
  },
  mounted () {
    this.computedMargin();
    this.addScrollListener();
  }
}
</script>

<style lang="scss">
  // .lazy-load-img-component {

  // }
</style>