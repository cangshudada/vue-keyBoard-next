<template>
  <div
    class="key-board-result"
    :style="{color}"
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
        <span :style="style" @click="upper"></span>
        <span :style="style" @click="lower"></span>
      </div>
    </div>
  </div>
</template>

<script>
import { groupSplitArray } from '@/utils';
export default {
  props: {
    data: Object,
  },
  inject: ["color"],
  computed: {
    style() {
      return {
        borderTopColor: this.color
      }
    }
  },
  data() {
    return {
      status: "",
      valueList: [],
      showList: [],
      showIndex: 0,
    };
  },
  created() {
    this.$EventBus.$on("keyBoardChange", status => {
      // 会引起高度变化 需要重新计算画板
      this.$EventBus?.$emit("updateBound");
      this.status = status;
      this.reset();
    });

    this.$EventBus?.$on("getWordsFromServer", data => {
      this.valueList = [...new Set(data.replace(/\s+/g, "").split(""))];
      this.showList = groupSplitArray(this.valueList, 11);
    });
  },
  watch: {
    data: {
      handler: function (newVal) {
        this.showIndex = 0;
        this.valueList = newVal?.value?.split("") || [];
        if (this.valueList.length === 0) {
          this.showList = [];
          return
        }

        this.showList = groupSplitArray(this.valueList, 11);
      },
      immediate: true
    }
  },
  methods: {
    // 重置
    reset() {
      this.showIndex = 0;
      this.showList = [];
      this.valueList = [];
      this.$EventBus?.$emit("resultReset");
    },
    // 上一页
    upper() {
      if (this.showIndex === 0) return;
      this.showIndex -= 1;
    },
    // 下一页
    lower() {
      if (this.showIndex === this.showList.length - 1) return;
      this.showIndex += 1;
    },
    // 选择某个词
    selectWord(word) {
      this.reset();
      this.$emit("change", word);
    }
  }
};
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
