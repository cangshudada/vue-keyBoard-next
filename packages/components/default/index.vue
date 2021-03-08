<template>
  <!-- 默认键盘 -->
  <div class="default-key-board">
    <div
      :class="['line', `line${index + 1}`]"
      v-for="(line, index) in lineList"
      :key="index"
    >
      <KeyCodeButton
        :isUpper="isUpper"
        v-for="key in line"
        :key="key"
        :type="key"
        :data="key"
        :isSymbol="isSymbol"
        @click="click"
      />
    </div>
    <div class="line line4">
      <KeyCodeButton
        v-for="key in line4"
        :key="key.type"
        :type="key.type"
        :data="key.data"
        :isCn="isCn"
        :isNum="isNum"
        @click="click"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { getInject } from "@/context/keyboardContext";
import useEventEmitter from "@/hooks/useEventEmitter";
import { IDefaultKeyBoardData, IKeyCode } from "@/typings";
import KeyCodeButton from "@/components/keyCodeButtton/index.vue";
import { defineComponent, reactive, toRefs, onMounted } from "vue";
import { DEFAULT_CODE, NUMBER_CODE, SYMBOL_CODE } from "@/constants/key_code";
// 默认第四行键码
const defaultLineList: IKeyCode[] = [
  {
    data: ".?123",
    type: "change2num",
  },
  {
    data: "",
    type: "change2lang",
  },
  {
    data: " ",
    type: "space",
  },
  {
    data: "",
    type: "close",
  },
];
export default defineComponent({
  name: "DefaultKeyBoard",
  components: {
    KeyCodeButton,
  },
  emits: ["translate", "trigger", "change"],
  setup(props, { emit }) {
    const injectData = getInject();
    const defaultKeyBoardData = reactive<IDefaultKeyBoardData>({
      // 前三行不变的键码list
      lineList: [DEFAULT_CODE.line1, DEFAULT_CODE.line2, DEFAULT_CODE.line3],
      // 第四行变动的键码
      line4: [],
      // 是否大写
      isUpper: false,
      //  中英文模式
      isCn: true,
      // 是否显示数字键盘
      isNum: false,
      // 是否显示符号键盘
      isSymbol: false,
      // 上一次存的val值
      oldVal: "",
    });

    /**
     * @description 计算第四行code
     */
    function getLine4Code() {
      defaultKeyBoardData.line4 = JSON.parse(JSON.stringify(defaultLineList));
      // 判定是否存在手写
      if (injectData?.modeList?.find((mode) => mode === "handwrite") && injectData?.handApi) {
        defaultKeyBoardData.line4.splice(2, 0, {
          data: "",
          type: "handwrite",
        });
      }
    }

    /**
     * @description 按钮点击事件
     */
    function click({ data, type }: IKeyCode) {
      switch (type) {
        //  关闭
        case "close":
          {
            defaultKeyBoardData.oldVal = "";
            injectData?.closeKeyBoard();
          }
          break;
        //  大小写
        case "upper":
          {
            defaultKeyBoardData.oldVal = "";
            defaultKeyBoardData.isUpper = !defaultKeyBoardData.isUpper;
          }
          break;
        //   语言
        case "change2lang":
          {
            defaultKeyBoardData.isCn = !defaultKeyBoardData.isCn;
            // 默认键盘状态下
            if (!defaultKeyBoardData.isNum && !defaultKeyBoardData.isSymbol) {
              useEventEmitter.emit(
                "keyBoardChange",
                defaultKeyBoardData.isCn ? "CN" : "EN"
              );
            }
          }
          break;
        //  数字键盘
        case "change2num":
          {
            defaultKeyBoardData.isNum = !defaultKeyBoardData.isNum;
            defaultKeyBoardData.isSymbol = false;
            if (defaultKeyBoardData.isNum) {
              useEventEmitter.emit("keyBoardChange", "number");
              const numberCodeLine3List = JSON.parse(
                JSON.stringify(NUMBER_CODE.line3)
              );
              if (!injectData?.modeList?.find((mode) => mode === "symbol")) {
                numberCodeLine3List.shift();
                numberCodeLine3List.unshift("+");
              }
              defaultKeyBoardData.lineList = [
                NUMBER_CODE.line1,
                NUMBER_CODE.line2,
                numberCodeLine3List,
              ];
            } else {
              useEventEmitter.emit("keyBoardChange", defaultKeyBoardData.isCn ? "CN" : "EN");
              defaultKeyBoardData.lineList = [
                DEFAULT_CODE.line1,
                DEFAULT_CODE.line2,
                DEFAULT_CODE.line3,
              ];
            }
          }
          break;
        // 切换符号显示
        case "#+=":
          {
            defaultKeyBoardData.isSymbol = !defaultKeyBoardData.isSymbol;
            if (defaultKeyBoardData.isSymbol) {
              useEventEmitter.emit("keyBoardChange", "symbol");
              defaultKeyBoardData.lineList = [
                SYMBOL_CODE.line1,
                SYMBOL_CODE.line2,
                SYMBOL_CODE.line3,
              ];
            } else {
              useEventEmitter.emit("keyBoardChange", "number");
              defaultKeyBoardData.lineList = [
                NUMBER_CODE.line1,
                NUMBER_CODE.line2,
                NUMBER_CODE.line3,
              ];
            }
          }
          break;
        // 切换手写板以及删除
        case "handwrite":
        case "delete":
          {
            // 如果是中文模式只删存好的字段
            if (
              defaultKeyBoardData.isCn &&
              type === "delete" &&
              defaultKeyBoardData.oldVal
            ) {
              defaultKeyBoardData.oldVal = defaultKeyBoardData.oldVal.substr(
                0,
                defaultKeyBoardData.oldVal.length - 1
              );
              emit("translate", defaultKeyBoardData.oldVal);
            } else {
              if (type === "handwrite") {
                useEventEmitter.emit("keyBoardChange", "handwrite");
              }
              emit("trigger", {
                data,
                type,
              });
            }
          }
          break;
        default:
          {
            // 中文需要转
            if (
              defaultKeyBoardData.isCn &&
              !defaultKeyBoardData.isNum &&
              !defaultKeyBoardData.isSymbol
            ) {
              emit("translate", defaultKeyBoardData.oldVal + data);
              defaultKeyBoardData.oldVal = defaultKeyBoardData.oldVal + data;
            } else {
              // 英文直接输出
              emit("change", data);
            }
          }
          break;
      }
    }

    // created
    getLine4Code();

    onMounted(() => {
      useEventEmitter.on("resultReset", () => {
        defaultKeyBoardData.oldVal = "";
      });
    });

    return {
      ...toRefs(defaultKeyBoardData),
      click,
    };
  },
});
</script>

<style scoped lang='less'>
.default-key-board {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  .line {
    height: 90px;
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 1350px;

    &.line1 {
      margin-top: 50px;
    }
    &.line2 {
      width: 1210px;
    }
    &.line4 {
      margin-top: 40px;

      .key-board-button {
        & + .key-board-button {
          margin-left: 40px;
        }
      }
    }
  }
}
</style>
