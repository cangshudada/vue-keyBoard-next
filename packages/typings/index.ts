import { App } from "vue";

export type SFCWithInstall<T> = T & { install(app: App): void; }

export type IValue = Partial<Record<"code" | "value", string>>;
export interface IDictionary<T> {
  [key: string]: T;
}

export type IKeyCode = Record<"data" | "type", string>;
export interface IKeyBoard {
  /** v-model */
  modelValue?: String;
  /** theme color - support rgb or hex - default("#eaa050") */
  color?: string;
  /** mode list - support symbol or handwrite keyboard - default(["handwrite", "symbol"]) */
  modeList?: ("handwrite" | "symbol")[];
  /** is blur status hide - default(true) */
  blurHide?: boolean;
  /** Whether to show the drag handle - default(true)  */
  showHandleBar?: boolean;
  /** handwrite interface */
  handApi?: string;
  /** transition className */
  animateClass?: string;
  /** darg Handle text */
  dargHandleText?: string;
  /** modal exist status */
  modal?: boolean;
  /** modal can hide when click modal */
  closeOnClickModal?: boolean;
}
export interface IKeyboardData {
  showMode: string;
  visible: boolean;
  resultVal: IValue;
}
export interface IKeyboardProvide {
  color: string;
  modeList: ("symbol" | "handwrite")[];
  handApi: string;
  closeKeyBoard: () => void;
  changeDefaultBoard: () => void;
}
export interface IDefaultKeyBoardData {
  lineList: string[][];
  line4: IKeyCode[];
  isUpper: boolean;
  isCn: boolean;
  isNum: boolean;
  isSymbol: boolean;
  oldVal: string;
}
export interface IPaintPartData {
  handBoardOperList: IKeyCode[];
  isCn: boolean;
}
export interface IPaintBoardData {
  width: number;
  height: number;
  isMouseDown: boolean;
  x: number;
  y: number;
  oldX: number;
  oldY: number;
  clickX: number[];
  clickY: number[];
  clickC: number[];
}
export interface IResultData {
  status: string;
  valueList: string[];
  showList: string[][];
  showIndex: number;
}
