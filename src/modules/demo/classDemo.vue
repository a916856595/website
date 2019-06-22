<template>
  <div>
    <ul class="demo-list">
      <li>
        <p class="class-title">按钮类</p>
        <ul class="class-list">
          <li>
            <p class="introction">
              <span>标准按钮</span>
              <span>.button</span>
            </p>
            <div>
              <button class="button">button按钮</button>
            </div>
          </li>
          <li>
            <p class="introction">
              <span>标准空心按钮</span>
              <span>.button-empty</span>
            </p>
            <div>
              <button class="button-empty">button按钮</button>
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
            margin-bottom: 10px;
          }
        }
      }
    }
  }
</style>

