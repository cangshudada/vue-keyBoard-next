import { App } from "vue";
import keyBoard from "./index.vue";
import { SFCWithInstall } from "./typings";

keyBoard.install = (app: App): void => {
  app.component(keyBoard.name, keyBoard);
};

const _KeyBoard: SFCWithInstall<typeof keyBoard> = keyBoard;

export default _KeyBoard;
