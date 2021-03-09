import { mount } from "@vue/test-utils";
import KeyBoard from "../../packages/index.vue";

const _mount = (payload = {}) =>
  mount(
    {
      components: {
        KeyBoard,
      },
      setup() {
        return {
          value: "你好",
          ...payload,
        };
      },
      template: `
    <div>
      <input data-mode v-model="value" />
      <KeyBoard v-model="value" />
    </div>
  `,
    },
    {
      attachTo: document.querySelector("body"),
    }
  );

describe("keyBoard.vue", () => {
  it("create", async () => {
    const wrapper = mount(KeyBoard);
    expect(wrapper.vm.visible).toBe(false);
  });

  it("input trigger focus event set keyboard visible true", async () => {
    const wrapper = _mount();
    const keyBoardVM = wrapper.findComponent({
      name: "KeyBoard",
    }).vm as any;

    expect(keyBoardVM.visible).toBe(false);
    await wrapper.find("input").trigger("focus");
    expect(keyBoardVM.visible).toBe(true);
  });

  it("input trigger blur event set keyboard visible false", async () => {
    const wrapper = _mount();
    const keyBoardVM = wrapper.findComponent({
      name: "KeyBoard",
    }).vm as any;
    await wrapper.find("input").trigger("focus");
    expect(keyBoardVM.visible).toBe(true);
    await wrapper.find("input").trigger("blur");
    expect(keyBoardVM.visible).toBe(false);
  });

  it("Setting blurHide to false causes the input to not disappear even when the input box is blurred", async () => {
    const wrapper = mount(
      {
        components: {
          KeyBoard,
        },
        setup() {
          return {
            value: "你好",
          };
        },
        template: `
        <div>
          <input data-mode v-model="value" />
          <Key-Board v-model="value" :blurHide="false"/>
        </div>
      `,
      },
      {
        attachTo: document.querySelector("body"),
      }
    );

    const keyBoardVM = wrapper.findComponent({
      name: "KeyBoard",
    }).vm as any;
    await wrapper.find("input").trigger("focus");
    expect(keyBoardVM.visible).toBe(true);
    await wrapper.find("input").trigger("blur");
    expect(keyBoardVM.visible).toBe(true);
  });

  it("init color", async () => {
    const wrapper = _mount();
    const keyBoard = wrapper.findComponent({
      name: "KeyBoard",
    });
    await wrapper.find("input").trigger("focus");
    expect(keyBoard.find(".key-board-drag-handle").element.style.color).toBe(
      "rgb(234, 160, 80)"
    );
  });

  it("set color", async () => {
    const wrapper = mount(
      {
        components: {
          KeyBoard,
        },
        setup() {
          return {
            value: "你好",
          };
        },
        template: `
        <div>
          <input data-mode v-model="value" />
          <Key-Board v-model="value" color="#ff0000"/>
        </div>
      `,
      },
      {
        attachTo: document.querySelector("body"),
      }
    );
    await wrapper.find("input").trigger("focus");
    expect(wrapper.find(".key-board-drag-handle").element.style.color).toBe(
      "rgb(255, 0, 0)"
    );
  });

  it("set keyboard mode", async () => {
    const wrapper = mount(
      {
        components: {
          KeyBoard,
        },
        setup() {
          return {
            value: "你好",
          };
        },
        template: `
        <div>
          <input data-mode="handwrite" v-model="value" />
          <Key-Board v-model="value" handApi="https://xxx" />
        </div>
      `,
      },
      {
        attachTo: document.querySelector("body"),
      }
    );
    const keyBoardVM = wrapper.findComponent({
      name: "KeyBoard",
    }).vm as any;
    await wrapper.find("input").trigger("focus");
    expect(keyBoardVM.showMode).toBe("handwrite");
  });

  it("cannot show handwrite mode without handApi", async () => {
    const wrapper = mount(
      {
        components: {
          KeyBoard,
        },
        setup() {
          return {
            value: "你好",
          };
        },
        template: `
        <div>
          <input data-mode="handwrite" v-model="value" />
          <Key-Board v-model="value" />
        </div>
      `,
      },
      {
        attachTo: document.querySelector("body"),
      }
    );
    const keyBoardVM = wrapper.findComponent({
      name: "KeyBoard",
    }).vm as any;
    await wrapper.find("input").trigger("focus");
    expect(keyBoardVM.showMode).toBe("default");
  });

  it("set default modeList", async () => {
    const wrapper = mount(
      {
        components: {
          KeyBoard,
        },
        setup() {
          return {
            value: "你好",
          };
        },
        template: `
        <div>
          <input data-mode v-model="value" />
          <Key-Board />
        </div>
      `,
      },
      {
        attachTo: document.querySelector("body"),
      }
    );

    const keyBoardVM = wrapper.findComponent({
      name: "KeyBoard",
    }).vm as any;

    await wrapper.find("input").trigger("focus");
    expect(keyBoardVM.modeList).toStrictEqual(["handwrite", "symbol"]);
  });

  it("set default handwrite modeList", async () => {
    const wrapper = mount(
      {
        components: {
          KeyBoard,
        },
        setup() {
          return {
            value: "你好",
          };
        },
        template: `
        <div>
          <input data-mode v-model="value" />
          <Key-Board :modeList="['handwrite']"/>
        </div>
      `,
      },
      {
        attachTo: document.querySelector("body"),
      }
    );

    const keyBoardVM = wrapper.findComponent({
      name: "KeyBoard",
    }).vm as any;

    await wrapper.find("input").trigger("focus");
    expect(keyBoardVM.modeList).toStrictEqual(["handwrite"]);
  });

  it("set default symbol modeList", async () => {
    const wrapper = mount(
      {
        components: {
          KeyBoard,
        },
        setup() {
          return {
            value: "你好",
          };
        },
        template: `
        <div>
          <input data-mode v-model="value" />
          <Key-Board :modeList="['symbol']"/>
        </div>
      `,
      },
      {
        attachTo: document.querySelector("body"),
      }
    );

    const keyBoardVM = wrapper.findComponent({
      name: "KeyBoard",
    }).vm as any;

    await wrapper.find("input").trigger("focus");
    expect(keyBoardVM.modeList).toStrictEqual(["symbol"]);
  });

  it("dragHandleBar exist when showHandleBar is true", async () => {
    const wrapper = _mount();
    const keyBoard = wrapper.findComponent({
      name: "KeyBoard",
    });
    await wrapper.find("input").trigger("focus");
    expect(keyBoard.find(".key-board-drag-handle").exists()).toBe(true);
  });

  it("dragHandleBar does not exist when showHandleBar is false", async () => {
    const wrapper = mount(
      {
        components: {
          KeyBoard,
        },
        setup() {
          return {
            value: "你好",
          };
        },
        template: `
        <div>
          <input data-mode v-model="value" />
          <Key-Board :showHandleBar="false"/>
        </div>
      `,
      },
      {
        attachTo: document.querySelector("body"),
      }
    );
    const keyBoard = wrapper.findComponent({
      name: "KeyBoard",
    });
    await wrapper.find("input").trigger("focus");
    expect(keyBoard.find(".key-board-drag-handle").exists()).toBe(false);
  });

  it("dragHandleText can set dragHandle DOM innerText", async () => {
    const wrapper = mount(
      {
        components: {
          KeyBoard,
        },
        setup() {
          return {
            value: "你好",
          };
        },
        template: `
        <div>
          <input data-mode v-model="value" />
          <Key-Board dargHandleText="你好"/>
        </div>
      `,
      },
      {
        attachTo: document.querySelector("body"),
      }
    );
    const keyBoard = wrapper.findComponent({
      name: "KeyBoard",
    });
    await wrapper.find("input").trigger("focus");
    expect(keyBoard.find(".key-board-drag-handle").text()).toBe("你好");
  });

  it("modal wrapper will disappear when model set false and input focus", async () => {
    const wrapper = mount(
      {
        components: {
          KeyBoard,
        },
        setup() {
          return {
            value: "你好",
          };
        },
        template: `
        <div>
          <input data-mode v-model="value" />
          <Key-Board />
        </div>
      `,
      },
      {
        attachTo: document.querySelector("body"),
      }
    );
    wrapper.findComponent({
      name: "KeyBoard",
    });
    await wrapper.find("input").trigger("focus");
    expect(document.querySelector(".key-board-modal")).toBeNull();
  });

  it("modal wrapper will still exist when closeOnClickModal set false and modal wrapper click", async () => {
    const wrapper = mount(
      {
        components: {
          KeyBoard,
        },
        setup() {
          return {
            value: "你好",
          };
        },
        template: `
        <div>
          <input data-mode v-model="value" />
          <Key-Board modal :blurHide="false" :closeOnClickModal="false"/>
        </div>
      `,
      },
      {
        attachTo: document.querySelector("body"),
      }
    );
    wrapper.findComponent({
      name: "KeyBoard",
    });
    const modalWrapper = document.querySelector(".key-board-modal");
    await wrapper.find("input").trigger("focus");
    expect(modalWrapper).not.toBeNull();
    await modalWrapper.dispatchEvent(new Event("click"));
    expect(modalWrapper.getAttribute("style")).toBe("display: block;");
  });

  it("modal wrapper will exist when model set true and input focus", async () => {
    const wrapper = mount(
      {
        components: {
          KeyBoard,
        },
        setup() {
          return {
            value: "你好",
          };
        },
        template: `
        <div>
          <input data-mode v-model="value" />
          <Key-Board modal/>
        </div>
      `,
      },
      {
        attachTo: document.querySelector("body"),
      }
    );
    wrapper.findComponent({
      name: "KeyBoard",
    });
    await wrapper.find("input").trigger("focus");
    expect(document.querySelector(".key-board-modal")).not.toBeNull();
  });

  it("modal wrapper will disappear when closeOnClickModal set true and modal wrapper click", async () => {
    const wrapper = mount(
      {
        components: {
          KeyBoard,
        },
        setup() {
          return {
            value: "你好",
          };
        },
        template: `
        <div>
          <input data-mode v-model="value" />
          <Key-Board :blurHide="false" modal />
        </div>
      `,
      },
      {
        attachTo: document.querySelector("body"),
      }
    );
    wrapper.findComponent({
      name: "KeyBoard",
    });
    const modalWrapper = document.querySelector(".key-board-modal");
    await wrapper.find("input").trigger("focus");
    expect(modalWrapper).not.toBeNull();
    await modalWrapper.dispatchEvent(new Event("click"));
    expect(modalWrapper.getAttribute("style")).toBe("display: none;");
  });

  it("modalClick event will trigger when model set true and model click", async () => {
    const modalClickEvnet = jest.fn();
    const wrapper = mount(
      {
        components: {
          KeyBoard,
        },
        setup(){
          return {
            value: "你好",
            modalClick: modalClickEvnet
          };
        },
        template: `
        <div>
          <input data-mode v-model="value" />
          <Key-Board modal @modalClick="modalClick"/>
        </div>
      `,
      },
      {
        attachTo: document.querySelector("body"),
      }
    );
    wrapper.findComponent({
      name: "KeyBoard",
    });
    const modalWrapper = document.querySelector(".key-board-modal");
    await wrapper.find("input").trigger("focus");
    await modalWrapper.dispatchEvent(new Event("click"));
    expect(modalClickEvnet).toHaveBeenCalled();
  });
});
