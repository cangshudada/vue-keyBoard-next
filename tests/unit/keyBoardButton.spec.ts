import { mount } from "@vue/test-utils";
import KeyCodeButton from "../../packages/components/keyCodeButtton/index.vue";

describe("keyCodeButton.vue", () => {
  it("button click set value change", async () => {
    let _value = "";
    let _type = "";
    const wrapper = mount({
      components: {
        KeyCodeButton,
      },
      setup() {
        function trigger({ data, type }) {
          _value = data;
          _type = type;
        }

        return {
          trigger,
        };
      },
      template: `
            <KeyCodeButton type="hello" data="world" @click="trigger" />
          `,
    });
    expect(_value).toBe("");
    expect(_type).toBe("");
    const button = wrapper.findAll(".key-board-button")[0];
    await button.trigger("click");
    expect(_value).toBe("world");
    expect(_type).toBe("hello");
  });
});
