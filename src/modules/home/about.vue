<template>
  <div class="about-page">
    <div class="w">
      <p style="margin-bottom: 1200px;">hello</p>
        <img src="../../../static/images/placeholder.png" style="width: 100%;" v-lazy-load="imgList[index]" alt="">
      <button @click="changeIndex">点击替换图片</button>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      imgList: ['http://n.sinaimg.cn/translate/200/w1080h720/20190217/QGgM-htacqww3111676.jpg', 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1563883237336&di=773e8c1256da88da3789e6f069320e56&imgtype=0&src=http%3A%2F%2Fb.zol-img.com.cn%2Fsoft%2F5%2F493%2FceNcIqcSrEEgE.jpg', 'http://img2.imgtn.bdimg.com/it/u=586906862,4105770180&fm=214&gp=0.jpg'],
      index: 0
    }
  },
  methods: {
    changeIndex () {
      this.index++;
      if (this.index >= this.imgList.length) this.index = 0;
    }
  }
}
</script>

<style lang="scss" scoped>

</style>