const scrollInterval = 100; //scroll事件的执行延迟
const marginToShowImage = 0; //可以开始加载图片的视窗距离
const ImageLoadFail = '/static/images/loadFail.png'; //加载失败显示的图片
const initLazyLoadImgElement = function (ele, bindings) {
  ele.timer = null;
  ele.isChanged = false;
  ele.direction = getLazyLoadDirection(bindings);
  ele.loadUrl = bindings.value;

  ele.__scrollEvent__ = () => {
    setTimer(ele);
  }

  ele.__loadEvent__ = () => {
    computeSpacing(ele);
    if (!ele.isChanged) addScrollListener(ele);
    ele.removeEventListener('load', ele.__loadEvent__);
  }

  ele.addLazyLoadEvent = () => {
    ele.addEventListener('load', ele.__loadEvent__);
  }

  ele.removeLazyLoadEvent = () => {
    removeScrollListener(ele);
  }

  ele.updateLazyLoadEvent = (bindings) => {
    clearTimeout(ele.timer);
    ele.timer = null;
    ele.isChanged = false;
    ele.direction = getLazyLoadDirection(bindings);
    ele.loadUrl = bindings.value;
    ele.__loadEvent__();
  }
  return ele;
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
  }, scrollInterval);
}

function addScrollListener(ele) {
  if (!ele.isChanged) document.addEventListener('scroll', ele.__scrollEvent__);
}

function removeScrollListener(ele) {
  document.removeEventListener('scroll', ele.__scrollEvent__);
}

function computeSpacing(ele) {
  let isCanShowImage = false;
  if (ele.direction === 'all') {
    if (computeXIsCanShow(ele) && computeYIsCanShow(ele)) isCanShowImage = true;
  } else if (ele.direction === 'x') {
    if (computeXIsCanShow(ele)) isCanShowImage = true;
  } else {
    if (computeYIsCanShow(ele)) isCanShowImage = true;
  }
  if (isCanShowImage) {
    ele.isChanged = true;
    changeImageSrc(ele);
    removeScrollListener(ele);
  }
}

function computeXIsCanShow(ele) {
  const clientWidth = document.documentElement.clientWidth;
  const ElementXToLeft = getElementXSpacing(ele);
  return ElementXToLeft - clientWidth <= marginToShowImage;
}

function computeYIsCanShow(ele) {
  const clientHeight = document.documentElement.clientHeight;
  const ElementYToTop = getElementYSpacing(ele);
  return ElementYToTop - clientHeight <= marginToShowImage;
}

function getElementXSpacing(ele) {
  if (ele.getBoundingClientRect) return ele.getBoundingClientRect().left;
  let totalWidth = ele.offsetLeft;
  let currentNode = ele.offsetParent;
  let documentScrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
  while (currentNode) {
    totalWidth += currentNode.offsetLeft;
    currentNode = currentNode.offsetParent;
  }
  return totalWidth - documentScrollLeft;
}

function getElementYSpacing(ele) {
  if (ele.getBoundingClientRect) return ele.getBoundingClientRect().top;  //dom.getBoundingClientRect存在兼容性问题(当前发现uc不支持)，通过元素到顶部的距离减去页面卷曲的高度获取当前元素的位置
  let totalHeight = ele.offsetTop;
  let currentNode = ele.offsetParent;
  let documentScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  while (currentNode) {
    totalHeight += currentNode.offsetTop;
    currentNode = currentNode.offsetParent;
  }
  return totalHeight - documentScrollTop;
}

function changeImageSrc(ele) {
  const imageToLoad = new Image();
  imageToLoad.addEventListener('load', () => {
    ele.src = imageToLoad.src;
  });
  imageToLoad.addEventListener('error', () => {
    ele.src = ImageLoadFail;
  });
  imageToLoad.src = ele.loadUrl;
}

function getLazyLoadDirection({ arg }) {
  const argStr = arg ? arg.toLowerCase() : 'xy';
  const isIncludeX = argStr.indexOf('x') > -1;
  const isIncludeY = argStr.indexOf('y') > -1;
  let direction = 'all';
  if (isIncludeX && !isIncludeY) {
    direction = 'x';
  } else if (!isIncludeX && isIncludeY) {
    direction = 'y';
  }
  return direction;
}

export default initLazyLoadImgElement;