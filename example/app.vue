<template>
  <div class="demo">
    <form>
      <div class="form-group">
        <label>默认</label>
        <input data-mode class="form-control" v-model="value" />
      </div>
      <div class="form-group">
        <label>英文键盘</label>
        <input data-mode="en" class="form-control" v-model="value" />
      </div>
      <div class="form-group">
        <label>数字键盘</label>
        <input data-mode="number" class="form-control" v-model="value" />
      </div>
      <div class="form-group">
        <label>标点键盘</label>
        <input data-mode="symbol" class="form-control" v-model="value" />
      </div>
      <div class="form-group">
        <label>手写键盘</label>
        <input data-mode="handwrite" class="form-control" v-model="value" />
      </div>
    </form>
    <KeyBoard modal />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
export default defineComponent({
  setup() {
    const value = ref<string>("");

    return {
      value
    };
  },
});
</script>

<style lang="less">
.demo {
  width: 100%;
  height: 100%;
  font-size: 30px;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  text-align: left;
  display: flex;
  justify-content: center;

  form {
    margin-top: 100px;
    width: 80%;
    height: 500px;

    .form-group {
      margin-bottom: 32px;

      label {
        display: inline-block;
        margin-bottom: 16px;
      }

      .form-control {
        display: block;
        width: 100%;
        height: 48px;
        padding: 12px 24px;
        font-size: 32px;
        font-weight: 400;
        line-height: 1.5;
        color: #495057;
        background-color: #fff;
        background-clip: padding-box;
        border: 1px solid #ced4da;
        border-radius: 8px;
        transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

        &:focus {
          color: #495057;
          background-color: #fff;
          border-color: #80bdff;
          outline: 0;
          box-shadow: 0 0 0 6px rgba(0, 123, 255, 0.25);
        }
      }
    }
  }
}
</style>