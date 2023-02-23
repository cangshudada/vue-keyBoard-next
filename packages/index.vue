<template>
  <transition :name="animateClass || 'move-bottom-to-top'">
    <div class="key-board" v-if="visible" @mousedown.prevent>
      <!-- 键盘主体 -->
      <div class="key-board-container">
        <!-- 结果展示 -->
        <Result :data="resultVal" @change="change" />
        <div class="key-board-area">
          <!-- 默认键盘 -->
          <DefaultBoard ref="defaultBoardRef" v-if="showMode === 'default'" @trigger="trigger" @change="change"
            @translate="translate" />
          <!-- 手写键盘 -->
          <HandBoard v-if="showMode === 'handwrite'" @trigger="trigger" @change="change" />
        </div>
      </div>
      <!-- 拖拽句柄 -->
      <div v-if="showHandleBar" class="key-board-drag-handle" :style="{ color }" v-handleDrag>
        <span>{{ dargHandleText || "将键盘拖到您喜欢的位置" }}</span>
        <svg-icon icon-class="drag" />
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import "@/libs/flexible.js";
import "@/assets/css/keyBoard.less";
import type { PropType } from "vue";
import handleDrag from "@/directive/drag";
import Result from "@/components/result/index.vue";
import { axiosConfig } from "./helper/axiosConfig";
import useEventEmitter from "@/hooks/useEventEmitter";
import SvgIcon from "@/components/svgIcon/svgIcon.vue";
import { getProvide } from "@/context/keyboardContext";
import HandBoard from "@/components/handBoards/index.vue";
import DefaultBoard from "@/components/default/index.vue";
import { pinYinNote } from "@/constants/pinyin_dict_note";
import { IKeyboardData, IKeyCode, IKeyBoard } from "./typings";
import {
  ref,
  toRefs,
  reactive,
  nextTick,
  onMounted,
  onUnmounted,
  defineComponent,
} from "vue";

// icon 引入
const requireContext = require.context("./icons", false, /\.svg$/);
const importAll = (r) => r.keys().map(r);
importAll(requireContext);

// 注册键盘绑定的input列表
const inputList: (HTMLInputElement | HTMLTextAreaElement)[] = [];
// 当前触发的input
let currentInput: HTMLInputElement | HTMLTextAreaElement | null = null;

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
    modelValue: String,
    // 手写识别接口  如果不存在则不会显示手写面板
    handApi: String,
    // 动画的className
    animateClass: String,
    // 拖拽句柄文字
    dargHandleText: String,
  },
  emits: ["keyChange", "update:modelValue", "change", "closed", "modalClick"],
  directives: { handleDrag },
  components: {
    Result,
    SvgIcon,
    HandBoard,
    DefaultBoard,
  },
  setup(props: IKeyBoard, { emit }) {
    // 基础数据
    const keyboardData = reactive<IKeyboardData>({
      // 展示模式
      showMode: "default",
      // 显隐
      visible: false,
      // 显示字符
      resultVal: {},
    });

    // 默认键盘ref
    const defaultBoardRef = ref<typeof DefaultBoard | null>(null);

    /**
     * @description 设置初始化键盘模式
     */
    function setDefaultKeyBoardMode(mode: string) {
      // 默认设置为中文
      nextTick(() => {
        useEventEmitter.emit("keyBoardChange", "CN");
      });
      switch (mode) {
        // 英文键盘
        case "en":
          keyboardData.showMode = "default";
          nextTick(() => {
            defaultBoardRef.value?.click({
              data: "",
              type: "change2lang",
            });
          });
          break;
        // 数字键盘
        case "number":
          keyboardData.showMode = "default";
          nextTick(() => {
            defaultBoardRef.value?.click({
              data: ".?123",
              type: "change2num",
            });
          });
          break;
        // 手写键盘
        case "handwrite":
          if (
            props.modeList?.find((mode) => mode === "handwrite") &&
            props.handApi
          ) {
            keyboardData.showMode = "handwrite";
            nextTick(() => {
              useEventEmitter.emit("keyBoardChange", "handwrite");
            });
          } else {
            keyboardData.showMode = "default";
          }
          break;
        // 标点键盘
        case "symbol":
          keyboardData.showMode = "default";
          // 如果存在标点键盘才允许切换
          if (props.modeList?.find((mode) => mode === "symbol")) {
            nextTick(() => {
              defaultBoardRef.value?.click({
                data: ".?123",
                type: "change2num",
              });
              defaultBoardRef.value?.click({
                data: "#+=",
                type: "#+=",
              });
            });
          }
          break;
        // 默认
        default:
          keyboardData.showMode = "default";
          break;
      }
    }

    /**
     * @description 显示键盘
     */
    function showKeyBoard(event: Event) {
      // 显示键盘
      keyboardData.visible = true;

      // 赋值当前事件触发的input
      currentInput = event.target as HTMLInputElement | HTMLTextAreaElement;

      // 设置默认的键盘显示模式
      setDefaultKeyBoardMode(currentInput.getAttribute("data-mode") as string);

      // 显示遮罩层
      if (document.querySelector(".key-board-modal")) {
        const keyBoardModal = document.querySelector(
          ".key-board-modal"
        ) as HTMLElement;
        keyBoardModal.style.display = "block";
      }
    }

    /**
     * @description 关闭键盘
     */
    function hideKeyBoard() {
      // 输入框触发blur
      currentInput && currentInput.blur();
      currentInput = null;
      keyboardData.visible = false;

      // 如果存在关闭钩子函数则触发
      emit("closed");

      // 重置显示mode
      keyboardData.showMode = "default";

      // 重置中文模式下显示字符
      keyboardData.resultVal = {};

      // 隐藏遮罩层
      if (document.querySelector(".key-board-modal")) {
        const keyBoardModal = document.querySelector(
          ".key-board-modal"
        ) as HTMLElement;
        keyBoardModal.style.display = "none";
      }
    }

    /**
     * @description 点击遮罩层
     */
    function modalTrigger() {
      // 如果点击遮罩层允许关闭则触发键盘隐藏事件
      props.closeOnClickModal && hideKeyBoard();
      emit("modalClick");
    }

    /**
     * @description 新增modal
     */
    function addMoDal() {
      // 如果modal存在的话继续绑定事件 - 此处解决多路由页面切换时造成的bug
      if (document.querySelector(".key-board-modal")) {
        document
          .querySelector(".key-board-modal")
          ?.addEventListener("click", modalTrigger);
        return;
      }

      // 如果不存在modal则创建一个modal遮罩层
      const modalDom = document.createElement("div");
      modalDom.className = "key-board-modal";
      modalDom.style.display = "none";
      document.querySelector("body")?.appendChild(modalDom);
      modalDom.addEventListener("click", modalTrigger);
    }

    /**
     * @description 注册键盘
     */
    function signUpKeyboard() {
      // 设置baseUrl
      props.handApi && axiosConfig(props.handApi);
      // 给键盘绑定相应input
      [...document.querySelectorAll("input"),
      ...document.querySelectorAll('textarea')
      ].forEach((input) => {
        // 存在data-mode属性的可以注册为键盘input
        if (input.getAttribute("data-mode") !== null) {
          inputList.push(input);
          input.addEventListener("focus", showKeyBoard);
          props.blurHide && input.addEventListener("blur", hideKeyBoard);
        }
      });
    }

    /**
    * @description 删除文字
    * @param curVal
    */
    function deleteText(curVal: string) {
      if (!currentInput) return ''
      const input = currentInput
      const startPos = input.selectionStart;
      const endPos = input.selectionEnd;
      if (!startPos || !endPos) return ''
      const result = curVal.substring(0, startPos - 1) + curVal.substring(endPos)
      input.value = result;
      input.focus();
      input.selectionStart = startPos - 1;
      input.selectionEnd = startPos - 1;
      return result
    }
    /**
     * @description 模式切换
     * @param {IKeyCode} {type}
     */
    function trigger({ type }: IKeyCode) {

      switch (type) {
        case "handwrite":
          {
            keyboardData.showMode = "handwrite";
          }
          break;
        case "delete":
          {
            if (!currentInput) return
            let changeValue: string;
            // v-model exist
            if (props.modelValue) {
              changeValue = deleteText(props.modelValue + '')
              emit("update:modelValue", changeValue);
            } else {
              changeValue = deleteText(currentInput.value)
              currentInput.value = changeValue;
            }
            emit(
              "change",
              changeValue,
              currentInput.getAttribute("data-prop") || currentInput
            );
          }
          break;
      }


    }
    /**
     * @description 插入新文字
     * @param curVal
     * @param insertTxt
     */
    function inputText(curVal: string, insertTxt: string) {
      if (!currentInput) return ''
      const input = currentInput
      const startPos = input.selectionStart || 0;
      const endPos = input.selectionEnd || 0;

      const result = curVal.substring(0, startPos) + insertTxt + curVal.substring(endPos)
      input.value = result;
      input.focus();
      input.selectionStart = startPos + insertTxt.length;
      input.selectionEnd = startPos + insertTxt.length;
      return result;
    }
    /**
     * @description 文字改变
     * @param {string} value
     */
    function change(value: string) {
      if (!currentInput) return
      let changeValue: string;
      if (props.modelValue) {
        changeValue = inputText(props.modelValue + '', value)
        emit("update:modelValue", changeValue);
      } else {
        changeValue = inputText(currentInput.value, value)
        currentInput.value = changeValue;
      }
      emit(
        "change",
        changeValue,
        currentInput.getAttribute("data-prop") || currentInput
      );
      emit(
        "keyChange",
        value,
        currentInput.getAttribute("data-prop") || currentInput
      );
    }



    /**
     * @description 拼音转中文
     * @param {string} value
     */
    function translate(value: string) {
      const reg = new RegExp(`^${value}\\w*`);
      const keys = Object.keys(pinYinNote)
        .filter((key) => reg.test(key))
        .sort();
      keyboardData.resultVal = {
        code: value,
        value: value
          ? keys.length > 1
            ? keys.reduce((a, b) => a + pinYinNote[b], "")
            : pinYinNote[keys[0]]
          : "",
      };
      currentInput && emit(
        "keyChange",
        value,
        currentInput.getAttribute("data-prop") || currentInput
      );
    }

    /**
     * @description 重新注册键盘
     */
    function reSignUp() {
      signUpKeyboard();
    }

    /**
     * @description 获取当前聚焦的输入框
     */
    function getCurrentInput() {
      return currentInput;
    }

    onMounted(() => {
      // 如果需要遮罩添加遮罩层
      props.modal && addMoDal();

      // 注册键盘
      signUpKeyboard();

      useEventEmitter.on("resultReset", () => {
        keyboardData.resultVal = {};
      });
    });

    // 卸载时事件清除
    onUnmounted(() => {
      document
        .querySelector(".key-board-modal")
        ?.removeEventListener("click", modalTrigger);
      inputList.forEach((input) => {
        input.removeEventListener("focus", showKeyBoard);
        input.removeEventListener("blur", hideKeyBoard);
      });
    });

    // 注入到子组件
    getProvide(
      reactive({
        color: props.color,
        modeList: props.modeList,
        handApi: props.handApi,
        closeKeyBoard: () => {
          hideKeyBoard();
        },
        changeDefaultBoard: () => {
          keyboardData.showMode = "default";
        },
      })
    );

    return {
      ...toRefs(keyboardData),
      defaultBoardRef,
      getCurrentInput,
      translate,
      reSignUp,
      trigger,
      change,
    };
  },
});
</script>
