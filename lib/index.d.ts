import { App } from 'vue';
import KeyBoard from "./src/keyboard.vue";
type SFCWithInstall<T> = T & { install(app: App): void; }
declare const _KeyBoard: SFCWithInstall<typeof KeyBoard>;
export default _KeyBoard;
