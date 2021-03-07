import { provide, inject } from "vue";
import { IKeyboardProvide } from "../typings";

export const KEYBOARD_CONTEXT = Symbol("KEYBOARD_CONTEXT");

export const getProvide = (parmas: IKeyboardProvide) => {
  provide<IKeyboardProvide>(KEYBOARD_CONTEXT, parmas);
};

export const getInject = (): IKeyboardProvide => {
  return inject<IKeyboardProvide>(KEYBOARD_CONTEXT);
};
