<script>
export default {
  name: 'lazy-load',
  bind (ele, bindings) {
    ele.timer = null;
    ele.isChanged = false;
    ele.loadUrl = bindings.value;
    ele.__scrollEvent__ = () => {
      setTimer(ele);
    }
    ele.__loadEvent__ = () => {
      computeSpacing(ele);
      if (!ele.isChanged) addScrollListener(ele);
      ele.removeEventListener('load', ele.__loadEvent__);
    }
    ele.addEventListener('load', ele.__loadEvent__);
  },
  unbind(ele) {
    removeScrollListener(ele);
  }
}

function setTimer(ele) {
  if (ele.timer) {ele.removeEventListener('load', ele.__loadEvent__);
    clearTimeout(ele.timer);
    ele.timer = null;
  }
  ele.timer = setTimeout(() => {
    computeSpacing(ele);
    clearTimeout(ele.timer);
    ele.timer = null;
  }, 200);
}

function addScrollListener(ele) {
  if (!ele.isChanged) document.addEventListener('scroll', ele.__scrollEvent__);
}

function removeScrollListener(ele) {
  document.removeEventListener('scroll', ele.__scrollEvent__);
}

function computeSpacing(ele) {
  const clientHeight = document.documentElement.clientHeight;
  const elementHeightToTop = ele.getBoundingClientRect().y;
  if (elementHeightToTop - clientHeight <= 0) {
    ele.isChanged = true;
    changeImageSrc(ele);
    removeScrollListener(ele);
  }
}

function changeImageSrc(ele) {
  const imageToLoad = new Image();
  imageToLoad.addEventListener('load', () => {
    ele.src = imageToLoad.src;
  });
  imageToLoad.addEventListener('error', () => {
    ele.src = '/static/images/loadFail.png';
  });
  imageToLoad.src = ele.loadUrl;
}
</script>