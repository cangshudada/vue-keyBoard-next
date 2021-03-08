<template>
  <svg
    class="svg-icon"
    :style="{
      stroke: color,
    }"
  >
    <use :xlink:href="iconName" />
  </svg>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { getInject } from "@/context/keyboardContext";
export default defineComponent({
  name: "SvgIcon",
  props: {
    iconClass: {
      type: String,
      required: true,
    },
    className: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const injectData = getInject();
    const iconName = computed(() => `#icon-${props.iconClass}`);

    return {
      color: injectData?.color,
      iconName,
    };
  },
});
</script>

<style lang='less'>
.svg-icon {
  fill: none !important;
}
</style>