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

<script>
import PaintBoard from "./paintBoard";
import KeyCodeButton from "@/components/keyCodeButtton/index";
export default {
  name: "PaintPart",
  inject: ["closeKeyBoard", "changeDefaultBoard"],
  data() {
    return {
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
    };
  },
  methods: {
    click({ data, type }) {
      switch (type) {
        //  关闭
        case "close":
          {
            this.closeKeyBoard();
          }
          break;
        //  回退
        case "back":
          {
            this.changeDefaultBoard();
            this.$EventBus?.$emit("resultReset");
            this.$EventBus?.$emit("keyBoardChange", this.isCn && "CN");
          }
          break;
        //   语言
        case "change2lang":
          {
            this.isCn = !this.isCn;
          }
          break;
        // 删除
        case "delete":
          {
            this.$emit("trigger", {
              data,
              type,
            });
          }
          break;
      }
    },
  },
  components: {
    PaintBoard,
    KeyCodeButton,
  },
};
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
