import { App } from "vue";
import keyBoard from "./index.vue";
type SFCWithInstall<T> = T & { install(app: App): void; }

keyBoard.install = (app: App): void => {
  app.component(keyBoard.name, keyBoard);
};

const _KeyBoard: SFCWithInstall<typeof keyBoard> = keyBoard;

export default _KeyBoard;
