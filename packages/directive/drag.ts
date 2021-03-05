import type { ObjectDirective,DirectiveBinding,VNode } from 'vue';

const handleDrag: ObjectDirective<HTMLElement,VNode> = {
    mounted(target,binding:DirectiveBinding, vnode) {
        const targetParent = target.parentNode as HTMLElement;
        // PC端
        target.onmousedown = e => {
            //算出鼠标相对元素的位置
            const disX = e.clientX - targetParent.offsetLeft;
            const disY = e.clientY - targetParent.offsetTop;

            document.onmousemove = e => {
                //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
                const left = e.clientX - disX;
                const top = e.clientY - disY;

                //移动当前元素
                targetParent.style.left = left + 'px';
                targetParent.style.top = top + 'px';
            };
            document.onmouseup = () => {
                console.log('vnode', vnode)
                // vnode.context.$EventBus?.$emit("updateBound");
                document.onmousemove = null;
                document.onmouseup = null;
            };
        }
        // 兼容移动端
        target.ontouchstart = e => {
            //算出鼠标相对元素的位置
            const clientX = e.touches[0].pageX;
            const clientY = e.touches[0].pageY;
            const disX = clientX - targetParent.offsetLeft;
            const disY = clientY - targetParent.offsetTop;

            document.ontouchmove = e => {
                const clientX = e.touches[0].pageX;
                const clientY = e.touches[0].pageY;
                //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
                const left = clientX - disX;
                const top = clientY - disY;

                //移动当前元素
                targetParent.style.left = left + 'px';
                targetParent.style.top = top + 'px';
            };
            document.ontouchend = () => {
                console.log('vnode', vnode)
                // vnode.context.$EventBus?.$emit("updateBound");
                document.ontouchmove = null;
                document.ontouchend = null;
            };
        }
    }
}

export default handleDrag;