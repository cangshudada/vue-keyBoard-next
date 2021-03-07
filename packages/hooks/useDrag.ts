import useEventEmitter from './useEventEmitter';

/**
 * @description 句柄拖拽事件
 * @param {HTMLElement} target
 */
export default function handleDragEvent(target: HTMLElement) {
  const targetParent = target.parentNode as HTMLElement;
  // PC端
  target.onmousedown = (event: MouseEvent) => {
    //算出鼠标相对元素的位置
    const disX = event.clientX - targetParent.offsetLeft;
    const disY = event.clientY - targetParent.offsetTop;

    document.onmousemove = (evt: MouseEvent) => {
      //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
      const left = evt.clientX - disX;
      const top = evt.clientY - disY;

      //移动当前元素
      targetParent.style.left = left + 'px';
      targetParent.style.top = top + 'px';
    };
    document.onmouseup = () => {
      useEventEmitter.emit('updateBound');
      document.onmousemove = null;
      document.onmouseup = null;
    };
  };
  // 兼容移动端
  target.ontouchstart = (event: TouchEvent) => {
    //算出鼠标相对元素的位置
    const clientX = event.touches[0].pageX;
    const clientY = event.touches[0].pageY;
    const disX = clientX - targetParent.offsetLeft;
    const disY = clientY - targetParent.offsetTop;

    document.ontouchmove = (evt: TouchEvent) => {
      const clientX = evt.touches[0].pageX;
      const clientY = evt.touches[0].pageY;
      //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
      const left = clientX - disX;
      const top = clientY - disY;

      //移动当前元素
      targetParent.style.left = left + 'px';
      targetParent.style.top = top + 'px';
    };
    document.ontouchend = () => {
      useEventEmitter.emit('updateBound');
      document.ontouchmove = null;
      document.ontouchend = null;
    };
  };
}
