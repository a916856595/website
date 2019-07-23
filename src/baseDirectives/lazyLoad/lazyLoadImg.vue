<script>
//<img src="../../../static/images/placeholder.png" v-lazy-load="imgList[index]" alt="">
// params x 只监听X轴 y 只监听Y轴 xy或无参 监听XY轴
import initLazyLoadImgElement from './lazyLoadImg.js'

export default {
  name: 'lazy-load',
  bind (ele, bindings) {
    ele = initLazyLoadImgElement(ele, bindings);
    ele.addLazyLoadEvent();
  },
  update (ele, bindings) {
    ele.removeLazyLoadEvent();
    ele.updateLazyLoadEvent(bindings);
  },
  unbind(ele) {
    ele.removeLazyLoadEvent();
  }
}
</script>