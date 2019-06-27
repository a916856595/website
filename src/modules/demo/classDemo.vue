<template>
  <div>
    <ul class="demo-list">
      <li>
        <p class="class-title">按钮类</p>
        <ul class="class-list">
          <li>
            <div class="introction">
              <p>标准按钮</p>
              <p>
                <span>类名:</span>
                <span>button</span>
              </p>
            </div>
            <div class="mb10">
              <p>
                <span>示例:</span>
                <button class="button">实心按钮</button>
              </p>
            </div>
            <div class="characteristic">
              <span>特征：</span>
              <p>1.鼠标悬浮后，变为空心按钮</p>
            </div>
          </li>
          <li>
            <div class="introction">
              <p>标准空心按钮</p>
              <p  class="mb10">
                <span>类名:</span>
                <span>button-empty</span>
              </p>
            </div>
            <div class="mb10">
              <p>
                <span>示例:</span>
                <button class="button-empty">空心按钮</button>
              </p>
            </div>
            <div class="characteristic">
              <span>特征：</span>
              <p>1.鼠标悬浮后，变为实心按钮</p>
            </div>
          </li>
          <li>
            <div class="introction">
              <p>鼠标悬停按钮</p>
              <p  class="mb10">
                <span>类名:</span>
                <span>hover-button</span>
              </p>
            </div>
            <div class="mb10">
              <p>
                <span>示例:</span>
                <button class="hover-button">悬浮按钮</button>
              </p>
            </div>
            <div class="characteristic">
              <span>特征：</span>
              <p>1.鼠标悬浮后，字体变为主题色，元素底部出现横线</p>
              <p class="important">2.设置元素背景为白色，且无边框（非!important）</p>
              <p>3.不会设置元素高度</p>
            </div>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
  .demo-list {
    &>li {
      padding-left: 20px;
      p.class-title {
        line-height: 30px;
        font-weight: 700;
      }
      .class-list {
        &>li {
          border-bottom: 1px solid #999;
          padding: 20px;
          .introction {
            p {
              margin-bottom: 10px;
            }
          }
          .characteristic {
            p {
              font-size: 12px;
              text-indent: 10px;
              margin-top: 5px;
              &.important {
                color: red;
              }
            }
          }
        }
      }
    }
  }
</style>

