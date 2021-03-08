import { IDictionary } from '../typings/index';
class EventEmitter {
  private listeners: IDictionary<
    undefined | null | ((...args: any[]) => void)[]
  >;

  constructor() {
    this.listeners = {};
  }

  on(type: string, cb: (...args: any[]) => void) {
    let cbs = this.listeners[type];
    if (!cbs) {
      cbs = [];
    }
    cbs.push(cb);
    this.listeners[type] = cbs;
    return () => {
      this.remove(type, cb);
    };
  }

  emit(type: string, ...args: any[]) {
    const cbs = this.listeners[type];
    if (Array.isArray(cbs)) {
      for (let i = 0; i < cbs.length; i++) {
        const cb = cbs[i];
        if (typeof cb === 'function') {
          cb(...args);
        }
      }
    }
  }

  remove(type: string, cb?: (...args: any[]) => void) {
    if (cb) {
      let cbs = this.listeners[type];
      if (!cbs) return;
      cbs = cbs.filter(eMap => eMap !== cb);
      this.listeners[type] = cbs;
    } else {
      this.listeners[type] = null;
      delete this.listeners[type];
    }
  }
}

export default new EventEmitter();
