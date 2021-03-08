<template>
  <div
    class="key-board-result"
    :style="{ color }"
    v-if="status === 'CN' || status === 'handwrite'"
  >
    <div class="key-board-code-show" v-if="status === 'CN'">
      {{ data.code }}
    </div>
    <div class="key-board-result-show">
      <div class="key-board-result-show-container">
        <span
          v-for="(key, index) in showList[showIndex]"
          :key="index"
          @click="selectWord(key)"
          >{{ index + 1 }}.{{ key }}</span
        >
      </div>
      <div class="key-board-result-show-more" v-if="valueList.length > 11">
        <span :style="getStyle" @click="upper"></span>
        <span :style="getStyle" @click="lower"></span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { PropType } from "vue";
import { groupSplitArray } from "@/utils";
import { IResultData, IValue } from "@/typings";
import { getInject } from "@/context/keyboardContext";
import useEventEmitter from "@/hooks/useEventEmitter";
import {
  watch,
  toRefs,
  computed,
  reactive,
  onMounted,
  onUnmounted,
  defineComponent,
} from "vue";
export default defineComponent({
  props: {
    data: Object as PropType<IValue>,
  },
  emits: ["change"],
  setup(props: { data: IValue }, { emit }) {
    const injectData = getInject();
    const getStyle = computed(() => ({
      borderTopColor: injectData?.color,
    }));
    const resultData = reactive<IResultData>({
      status: "",
      valueList: [],
      showList: [],
      showIndex: 0,
    });

    /**
     * @description 上一页
     */
    function upper() {
      if (resultData.showIndex === 0) return;
      resultData.showIndex -= 1;
    }

    /**
     * @description 下一页
     */
    function lower() {
      if (resultData.showIndex === resultData.showList.length - 1) return;
      resultData.showIndex += 1;
    }

    /**
     * @description 重置
     */
    function reset() {
      resultData.showIndex = 0;
      resultData.showList = [];
      resultData.valueList = [];
      useEventEmitter.emit("resultReset");
    }

    /**
     * @description 上一页
     */
    function selectWord(word) {
      reset();
      emit("change", word);
    }

    // 监听data的变化
    watch(
      () => props.data,
      (newVal) => {
        resultData.showIndex = 0;
        resultData.valueList = newVal?.value?.split("") || [];
        if (resultData.valueList.length === 0) {
          resultData.showList = [];
          return;
        }
        resultData.showList = groupSplitArray(resultData.valueList, 11);
      },
      {
        immediate: true,
      }
    );

    onMounted(() => {
      useEventEmitter.on("keyBoardChange", (status: string) => {
        // 会引起高度变化 需要重新计算画板
        useEventEmitter.emit("updateBound");
        resultData.status = status;
        reset();
      });

      useEventEmitter.on("getWordsFromServer", (serverData: string) => {
        const _valueList = Array.from(
          new Set(serverData.replace(/\s+/g, "").split(""))
        );
        resultData.valueList = _valueList;
        resultData.showList = groupSplitArray(_valueList, 11);
      });
    });

    onUnmounted(() => {
      useEventEmitter.remove("keyBoardChange");
      useEventEmitter.remove("getWordsFromServer");
    });

    return {
      color: injectData?.color,
      upper,
      lower,
      getStyle,
      selectWord,
      ...toRefs(resultData),
    };
  },
});
</script>

<style scoped lang='less'>
.key-board-result {
  width: 1435px;
  height: 139px;
  border-bottom: 1px solid #707070;
  display: flex;
  flex-direction: column;
  align-items: center;

  .key-board-code-show {
    margin-top: 25px;
    width: 100%;
    height: 40px;
    background: #f5f5f5;
    border-radius: 25px;
    font-size: 32px;
    font-weight: 400;
    line-height: 40px;
    text-indent: 12px;
  }

  .key-board-result-show {
    width: 100%;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    flex: 1;

    .key-board-result-show-container {
      display: flex;
      align-items: center;
      height: 100%;
      width: 95%;
      max-width: 95%;
      overflow: hidden;
      span {
        white-space: nowrap;
        font-size: 40px;
        font-family: SimHei;
        font-weight: 400;
        line-height: 54px;
        & + span {
          margin-left: 40px;
        }
      }
    }

    .key-board-result-show-more {
      height: 45px;
      flex: 1;
      border-left: 1px solid #707070;
      display: flex;
      flex-direction: column;
      align-items: center;

      span {
        width: 0px;
        height: 0px;
        border: 16px solid;
        border-color: transparent;
        &:nth-child(1) {
          transform: translateY(-11px) rotate(180deg);
        }
        &:nth-child(2) {
          transform: translateY(-5px);
        }
      }
    }
  }
}
</style>
