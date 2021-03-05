import "./_BASE_.less";
import App from "./app.vue";
import { createApp } from "vue";
import keyBoard from "../packages";

createApp(App)
  .use(keyBoard)
  .mount("#app");
