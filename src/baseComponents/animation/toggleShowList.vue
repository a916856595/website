<!-- TODO 此组件目前无法更新slots的内容，暂存 -->
<script>
export default {
  name: 'toggle-show-list',
  props: {
    tag: {
      type: String,
      default: 'span'
    },
    isShow: {
      type: Boolean
    },
    interval: {  //动画执行间隔
      type: Number,
      default: 200
    }
  },
  data () {
    return {
      timerArray: [],
      subsetElements: []
    }
  },
  render (createElement) {
    return createElement(this.tag, this.subsetElements);
  },
  methods: {
    pushSubsetElements () {
      this.clearAllTimer();
      let subsetcollection = this.$slots.default;
      if (!subsetcollection) return;
      
      subsetcollection.forEach((item, index) => {
        let timer = null;
        timer = setTimeout(() => {
          this.subsetElements.push(item);
          let indexToDelete = this.timerArray.indexOf(timer); //定时器执行完毕后，在定时器列表中找到索引并删除
          clearTimeout(timer);
          timer = null;
          this.timerArray.splice(indexToDelete, 1);
        }, this.interval * (index + 1));
        this.timerArray.push(timer);
      });
    },
    popSubsetElements () {
      this.clearAllTimer();
      if (!this.subsetElements.length) return;
      // 在执行删除元素操作之前，应先停止所有未执行的添加元素操作
      
      this.subsetElements.forEach((item, index) => {
        var timer = null;
        timer = setTimeout(() => {
          this.subsetElements.pop();
          let indexToDelete = this.timerArray.indexOf(timer); //定时器执行完毕后，在定时器列表中找到索引并删除
          this.timerArray.splice(indexToDelete, 1);
        }, this.interval * (index + 1));
        this.timerArray.push(timer);
      });
    },
    clearAllTimer () {
      console.log(this.timerArray)
      this.timerArray.forEach(timer => {
        console.log(timer);
        clearTimeout(timer);
      } );
      this.timerArray = [];
    }
  },
  mounted () {
    if (this.isShow && this.$slots.default) {
      this.$slots.default.forEach(item => {
        this.subsetElements.push(item);
      })
    }
    setInterval(() => {
      console.log(this.$slots.default)
    }, 200)
  },
  watch: {
    isShow () {
      console.log(this.isShow)
      this.isShow ? this.pushSubsetElements() : this.popSubsetElements();
    }
  }
}
</script>

<style lang="less" scoped>

</style>