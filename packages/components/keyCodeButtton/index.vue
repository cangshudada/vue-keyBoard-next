<template>
  <button
    :class="[
      'key-board-button',
      `key-board-button-${type}`,
      {
        'key-board-button-active':
          (isUpper && type === 'upper') ||
          (isNum && type === 'change2num') ||
          (isSymbol && type === '#+='),
      },
    ]"
    :style="getStyle"
    @click="click"
    @mouseenter="isHoverStatus = true"
    @mouseleave="isHoverStatus = false"
  >
    <svg-icon
      v-if="
        type === 'upper' ||
        type === 'delete' ||
        type === 'handwrite' ||
        type === 'close' ||
        type === 'back'
      "
      :icon-class="type"
    />
    <span v-else v-html="getCode"></span>
  </button>
</template>

<script lang="ts">
import { getInject } from "@/context/keyboardContext";
import SvgIcon from "@/components/svgIcon/svgIcon.vue";
import { computed, defineComponent, ref } from "vue";
export default defineComponent({
  name: "KeyCodeButton",
  components: {
    SvgIcon,
  },
  props: {
    type: String,
    data: String,
    isCn: Boolean,
    isNum: Boolean,
    isUpper: Boolean,
    isSymbol: Boolean,
  },
  emits: ["click"],
  setup(props, { emit }) {
    const injectData = getInject();
    const isHoverStatus = ref<boolean>(false);

    // computed
    const getCode = computed(() => {
      if (props.type === "change2lang") {
        return props.isCn ? "<label>中</label>/EN" : "<label>EN</label>/中";
      }
      return props.isUpper ? props.data.toUpperCase() : props.data;
    });

    const getStyle = computed(() => {
      if (
        (props.isUpper && props.type === "upper") ||
        (props.isNum && props.type === "change2num") ||
        (props.isSymbol && props.type === "#+=") ||
        isHoverStatus.value
      ) {
        return {
          color: "#f5f5f5",
          background: injectData?.color,
        };
      } else {
        return {
          color: injectData?.color,
          background: "#f5f5f5",
        };
      }
    });

    /**
     * @description 按钮点击
     * @param {MouseEvent} event
     */
    function click(event: MouseEvent) {
      event.preventDefault();
      emit("click", {
        data: props.isUpper ? props.data.toUpperCase() : props.data,
        type: props.type,
      });
    }

    return {
      isHoverStatus,
      getStyle,
      getCode,
      click,
    };
  },
});
</script>

<style lang='less'>
.key-board-button {
  padding: 0;
  width: 90px;
  height: 90px;
  border-radius: 50%;
  font-size: 35px;
  text-align: center;
  font-weight: 400;
  line-height: 90px;
  outline: none;
  border: none;
  transition: all 0.35s;
  display: flex;
  justify-content: center;
  align-items: center;

  label {
    font-size: 35px !important;
  }

  svg {
    width: 30px;
    height: 30px;
  }

  &.key-board-button-close {
    svg {
      width: 50px;
      height: 50px;
    }
  }

  &:hover,
  &.key-board-button-active {
    svg {
      fill: none !important;
      stroke: #f5f5f5 !important;
    }
  }

  &.key-board-button-delete {
    width: 230px;
    height: 90px;
    border-radius: 45px;
    svg {
      width: 65px;
      height: 28px;
    }
  }

  &.key-board-button-back {
    svg {
      width: 45px;
      height: 45px;
    }
  }

  &.key-board-button-change2num,
  &.key-board-button-change2lang {
    width: 135px;
    height: 90px;
    border-radius: 45px;
  }

  &.key-board-button-space {
    flex: 1;
    height: 90px;
    border-radius: 45px;
  }

  &.key-board-button-change2num,
  &.key-board-button-change2lang {
    font-size: 30px;
  }
}
</style>
