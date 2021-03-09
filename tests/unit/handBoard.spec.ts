import { mount } from "@vue/test-utils";
import PaintBoard from "../../packages/components/handBoards/paintBoard.vue";

describe("paintPart", () => {
  it("create handPaint board", async () => {
    const wrapper = mount(PaintBoard);
    expect(wrapper.find("canvas").exists()).toBe(true);
  });

  it("trigger handPaint mouseDown mouseMove and mouseUp", async () => {
    const wrapper = mount(PaintBoard);
    const clickXList = wrapper.vm.clickX as number[];
    const paintBoardDom = wrapper.find("canvas");
    expect(wrapper.vm.isMouseDown).toBeFalsy();
    await paintBoardDom.trigger("mousedown");
    expect(wrapper.vm.isMouseDown).toBeTruthy();
    expect(clickXList.length).toBe(0);
    await paintBoardDom.trigger("mousemove");
    expect(clickXList.length).not.toBe(0);
    await paintBoardDom.trigger("mouseup");
    expect(wrapper.vm.isMouseDown).toBeFalsy();
  });

  it("trigger handPaint touchstart touchmove and touchend", async () => {
    const wrapper = mount(PaintBoard);
    const clickXList = wrapper.vm.clickX as number[];
    const paintBoardDom = wrapper.find("canvas");
    expect(wrapper.vm.isMouseDown).toBeFalsy();
    await paintBoardDom.trigger("touchstart");
    expect(wrapper.vm.isMouseDown).toBeTruthy();
    expect(clickXList.length).toBe(0);
    await paintBoardDom.trigger("touchmove");
    expect(clickXList.length).not.toBe(0);
    await paintBoardDom.trigger("touchend");
    expect(wrapper.vm.isMouseDown).toBeFalsy();
  });
});
