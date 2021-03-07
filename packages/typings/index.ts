export interface IValue {
  code?: string;
  value?: string;
}

export interface IDictionary<T> {
  [key: string]: T;
}

export type IKeyCode = Record<"data" | "type", string>;

export interface IKeyBoard {
  /** v-model */
  value?: string;
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
