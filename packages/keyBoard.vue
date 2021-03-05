<template>
  <transition :name="animateClass || 'move-bottom-to-top'">
    <div class="key-board" v-if="visible" @mousedown.prevent>
      <!-- 键盘主体 -->
      <div class="key-board-container">
        <!-- 结果展示 -->
        <Result :data="resultVal" @change="change" />
        <div class="key-board-area">
          <!-- 默认键盘 -->
          <DefaultBoard
            ref="defaultBoardRef"
            v-if="showMode === 'default'"
            @trigger="trigger"
            @change="change"
            @translate="translate"
          />
          <!-- 手写键盘 -->
          <HandBoard
            v-if="showMode === 'handwrite'"
            @trigger="trigger"
            @change="change"
          />
        </div>
      </div>
      <!-- 拖拽句柄 -->
      <div
        v-if="showHandleBar"
        class="key-board-drag-handle"
        :style="{ color }"
        v-handleDrag
      >
        <span>{{ dargHandleText || "将键盘拖到您喜欢的位置" }}</span>
        <svg-icon icon-class="drag" />
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import "@/libs/flexible.js";
import type { PropType } from "vue";
import { defineComponent } from "vue";
import handleDrag from "@/directive/drag";
export default defineComponent({
  name: "KeyBoard",
  inheritAttrs: false,
  props: {
    // 主题色
    color: {
      type: String,
      default: "#eaa050",
    },
    // 显示的模式列表
    modeList: {
      type: Array as PropType<("handwrite" | "symbol")[]>,
      default: () => ["handwrite", "symbol"],
    },
    // 是否blur状态下自动隐藏
    blurHide: {
      type: Boolean,
      default: true,
    },
    // 是否显示拖拽句柄
    showHandleBar: {
      type: Boolean,
      default: true,
    },
    // 是否需要遮罩层
    modal: Boolean,
    // 是否可以通过点击modal关闭modal
    closeOnClickModal: {
      type: Boolean,
      default: true,
    },
    // v-model
    value: String,
    // 手写识别接口  如果不存在则不会显示手写面板
    handApi: String,
    // 动画的className
    animateClass: String,
    // 拖拽句柄文字
    dargHandleText: String,
  },
  provide() {
    return {
      color: this.color,
      modeList: this.modeList,
      handApi: this.handApi,
      closeKeyBoard: () => {
        this.hideKeyBoard();
      },
      changeDefaultBoard: () => {
        this.showMode = "default";
      },
    };
  },
  directives: { handleDrag },
  setup(props, ctx) {
    console.log('props', props)
    console.log('ctx', ctx)
  },
});
</script>

<style lang="less">
</style>
