import { ComponentPublicInstance } from 'vue'

export type KeyBoardType = ComponentPublicInstance | HTMLElement

declare module '@vue/test-utils' {
  interface DOMWrapper<KeyBoardType> {
    style: CSSStyleDeclaration
  }

  interface VueWrapper<T extends ComponentPublicInstance> {
    style: CSSStyleDeclaration
  }
}