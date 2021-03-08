import { PropType } from "vue";
declare const _default: import("vue").DefineComponent<
  {
    color: {
      type: String;
      default: string;
    };
    modeList: {
      type: PropType<("handwrite" | "symbol")[]>;
      default: PropType<["handwrite", "symbol"]>;
    };
    blurHide: {
      type: Boolean;
      default: Boolean;
    };
    showHandleBar: {
      type: Boolean;
      default: Boolean;
    };
    closeOnClickModal: {
      type: Boolean;
      default: Boolean;
    };
    modal: BooleanConstructor;
    modelValue: String;
    handApi: String;
    animateClass: String;
    dargHandleText: String;
  },
  {},
  unknown,
  {},
  {},
  import("vue").ComponentOptionsMixin,
  import("vue").ComponentOptionsMixin,
  ("keyChange" | "update:modelValue" | "change" | "closed" | "modalClick")[],
  "keyChange" | "update:modelValue" | "change" | "closed" | "modalClick",
  import("vue").VNodeProps &
    import("vue").AllowedComponentProps &
    import("vue").ComponentCustomProps,
  Readonly<{
    color: string;
    modeList: ("handwrite" | "symbol")[];
    blurHide: boolean;
    showHandleBar: boolean;
    modal: boolean;
    closeOnClickModal: boolean;
    modelValue: string;
    handApi: string;
    animateClass: string;
    dargHandleText: string;
  }>,
  {
    color: string;
    modeList: ("handwrite" | "symbol")[];
    blurHide: boolean;
    showHandleBar: boolean;
    modal: boolean;
    closeOnClickModal: boolean;
    modelValue: string;
    handApi: string;
    animateClass: string;
    dargHandleText: string;
  }
>;
export default _default;
