<template>
  <div class="paint-board">
    <canvas
      ref="canvasRef"
      :width="width"
      :height="height"
      @touchstart="down"
      @touchmove="move"
      @touchend="mouseup"
      @mousedown="down"
      @mousemove="move"
      @mouseup="mouseup"
      @mouseleave="mouseup"
    ></canvas>
  </div>
</template>

<script lang="ts">
import { IPaintBoardData } from "@/typings";
import { getWordFromHandWrite } from "@/server/index";
import { getInject } from "@/context/keyboardContext";
import useEventEmitter from "@/hooks/useEventEmitter";
import {
  ref,
  toRefs,
  nextTick,
  reactive,
  onMounted,
  onUnmounted,
  defineComponent,
} from "vue";

// canvas上下文
let ctx: CanvasRenderingContext2D;
// 定时器id
let timer: number;
export default defineComponent({
  name: "PaintBoard",
  props: {
    lib: String,
  },
  setup(props) {
    const injectData = getInject();
    const paintBoardData = reactive<IPaintBoardData>({
      // 宽
      width: 0,
      // 高
      height: 0,
      // 是否按下
      isMouseDown: false,
      // 当前canvas相距左上角x
      x: 0,
      // 当前canvas相距左上角y
      y: 0,
      // 旧x坐标
      oldX: 0,
      // 旧y坐标
      oldY: 0,
      //轨迹X
      clickX: [],
      //轨迹Y
      clickY: [],
      //轨迹标志位，为1则是终点
      clickC: [],
    });

    const canvasRef = ref<HTMLCanvasElement | null>(null);

    /**
     * @description 获取手写板书写文字
     */
    async function getWords() {
      const { data } = await getWordFromHandWrite(
        paintBoardData.clickX,
        paintBoardData.clickY,
        paintBoardData.clickC,
        props.lib
      );
      useEventEmitter.emit("getWordsFromServer", data?.v || "");
    }

    /**
     * @description canvas重置
     */
    function reload() {
      if (!canvasRef.value || !ctx) return;
      paintBoardData.clickX = [];
      paintBoardData.clickY = [];
      paintBoardData.clickC = [];
      ctx.clearRect(0, 0, paintBoardData.width, paintBoardData.height);
    }

    /**
     * @description 获取x坐标
     */
    function getCx(event: TouchEvent | MouseEvent): number {
      // mouse事件
      if (event.type.includes("mouse")) {
        const _event = event as MouseEvent;
        return Math.floor(_event.clientX - paintBoardData.x);
      } else if (event.type.includes("touch")) {
        // touch事件
        const _event = event as TouchEvent;
        return Math.floor(_event.targetTouches[0]?.clientX - paintBoardData.x);
      }
      return 0;
    }

    /**
     * @description 获取y坐标
     */
    function getCy(event: TouchEvent | MouseEvent): number {
      // mouse事件
      if (event.type.includes("mouse")) {
        const _event = event as MouseEvent;
        return Math.floor(_event.clientY - paintBoardData.y);
      } else if (event.type.includes("touch")) {
        // touch事件
        const _event = event as TouchEvent;
        return Math.floor(_event.targetTouches[0]?.clientY - paintBoardData.y);
      }
      return 0;
    }

    /**
     * @description 按下
     */
    function down(event: TouchEvent | MouseEvent) {
      if (!ctx) return;
      paintBoardData.isMouseDown = true;
      const cx = getCx(event);
      const cy = getCy(event);
      clearTimeout(timer);
      paintBoardData.oldX = cx;
      paintBoardData.oldY = cy;
      ctx.beginPath();
    }

    /**
     * @description 移动
     */
    function move(event: TouchEvent | MouseEvent) {
      if (!ctx) return;
      event.preventDefault();
      if (paintBoardData.isMouseDown) {
        const cx = getCx(event);
        const cy = getCy(event);
        paintBoardData.clickX.push(cx);
        paintBoardData.clickY.push(cy);
        paintBoardData.clickC.push(0);
        //画图
        ctx.strokeStyle = injectData?.color;
        ctx.fillStyle = injectData?.color;
        ctx.lineWidth = 4;
        ctx.lineCap = "round";
        ctx.moveTo(paintBoardData.oldX, paintBoardData.oldY);
        ctx.lineTo(cx, cy);
        ctx.stroke();
        paintBoardData.oldX = cx;
        paintBoardData.oldY = cy;
      }
    }

    /**
     * @description 松开
     */
    function mouseup() {
      if (paintBoardData.isMouseDown) {
        paintBoardData.isMouseDown = false;
        timer = setTimeout(() => {
          reload();
        }, 1500);
        //标记最后一点为终点
        paintBoardData.clickC.pop();
        paintBoardData.clickC.push(1);
        getWords();
      }
    }

    /**
     * @description 更新尺寸以及位置
     */
    function updateBound() {
      nextTick(() => {
        if (!document.querySelector(".paint-board")) return;
        const bound = document
          .querySelector(".paint-board")
          .getBoundingClientRect();
        paintBoardData.x = bound.x;
        paintBoardData.y = bound.y;
        paintBoardData.width = parseFloat(
          window.getComputedStyle(document.querySelector(".paint-board")).width
        );
        paintBoardData.height = parseFloat(
          window.getComputedStyle(document.querySelector(".paint-board")).height
        );
      });
    }

    /**
     * @description 画板初始化
     */
    function paintBoardInit() {
      ctx = canvasRef.value?.getContext("2d");
      reload();
      updateBound();
      window.addEventListener("animationend", updateBound);
      window.addEventListener("resize", updateBound);
      window.addEventListener("scroll", updateBound);
    }

    onMounted(() => {
      // 面板初始化
      paintBoardInit();
      // 拖动键盘需要
      useEventEmitter.on("updateBound", () => {
        updateBound();
      });
    });

    onUnmounted(() => {
      window.removeEventListener("animationend", updateBound);
      window.removeEventListener("resize", updateBound);
      window.removeEventListener("scroll", updateBound);
      useEventEmitter.remove("updateBound");
    });

    return {
      ...toRefs(paintBoardData),
      move,
      down,
      mouseup,
      canvasRef,
    };
  },
});
</script>
