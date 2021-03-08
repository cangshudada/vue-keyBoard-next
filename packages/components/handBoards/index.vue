<template>
  <!-- 手写 -->
  <div class="hand-write-board">
    <!-- 手写板 -->
    <PaintBoard :lib="isCn ? 'CN' : 'EN'" />
    <!-- 操作按钮栏 -->
    <div class="hand-write-board-opers">
      <KeyCodeButton
        v-for="key in handBoardOperList"
        :key="key.type"
        :type="key.type"
        :data="key.data"
        :isCn="isCn"
        @click="click"
      />
    </div>
  </div>
</template>

<script lang="ts">
import PaintBoard from "./paintBoard.vue";
import { IKeyCode, IPaintPartData } from "@/typings";
import { getInject } from "@/context/keyboardContext";
import useEventEmitter from "@/hooks/useEventEmitter";
import { defineComponent, reactive, toRefs } from "vue";
import KeyCodeButton from "@/components/keyCodeButtton/index.vue";
export default defineComponent({
  name: "PaintPart",
  components: {
    PaintBoard,
    KeyCodeButton,
  },
  setup() {
    const injectData = getInject();
    const paintPartData = reactive<IPaintPartData>({
      // 手写板部分按钮列表
      handBoardOperList: [
        {
          data: "中/EN",
          type: "change2lang",
        },
        {
          data: "",
          type: "back",
        },
        {
          data: "",
          type: "delete",
        },
        {
          data: "",
          type: "close",
        },
      ],
      // 是否中文
      isCn: true,
    });

    /**
     * @description 按钮点击
     * @param {IKeyCode} parmas
     */
    function click({ data, type }: IKeyCode) {
      switch (type) {
        //  关闭
        case "close":
          {
            injectData?.closeKeyBoard();
          }
          break;
        //  回退
        case "back":
          {
            injectData?.changeDefaultBoard();
            useEventEmitter.emit("resultReset");
            useEventEmitter.emit("keyBoardChange", paintPartData.isCn && "CN");
          }
          break;
        //   语言
        case "change2lang":
          {
            paintPartData.isCn = !paintPartData.isCn;
          }
          break;
        // 删除
        case "delete":
          {
            useEventEmitter.emit("trigger", {
              data,
              type,
            });
          }
          break;
      }
    }

    return {
      click,
      ...toRefs(paintPartData),
    };
  },
});
</script>

<style scoped lang='less'>
.hand-write-board {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;

  .paint-board {
    margin: 0 35px;
    width: 1185px;
    height: 450px;
    background: #ededed;
    border-radius: 30px;

    canvas {
      width: 100%;
      height: 100%;
    }
  }

  .hand-write-board-opers {
    flex: 1;
    height: 450px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .key-board-button {
      width: 135px;
      height: 90px;
      border-radius: 45px;
    }
  }
}
</style>
