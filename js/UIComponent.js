export class UIComponent {
  constructor({ title, id }) {
    this.title = title;
    this.id = id;
    this.element = null;
    this.listeners = [];
    this.onClose = null;
  }

  on(target, event, handler) {
    target.addEventListener(event, handler);
    this.listeners.push({ target, event, handler });
  }

  createBase({ closable = true } = {}) {
    const element = document.createElement('section');
    element.className = 'widget';
    element.id = this.id;
    const header = document.createElement('div');
    header.className = 'widget-head';
    const titleWrap = document.createElement('div');
    const title = document.createElement('h2');
    title.className = 'widget-title';
    title.textContent = this.title;
    titleWrap.append(title);
    header.append(titleWrap);
    const minimize = document.createElement('button');
    minimize.className = 'icon-action';
    minimize.type = 'button';
    minimize.setAttribute('aria-label', `Свернуть виджет «${this.title}»`);
    minimize.textContent = '−';
    this.on(minimize, 'click', () => this.minimize(minimize));
    header.append(minimize);
    if (closable) {
      const close = document.createElement('button');
      close.className = 'widget-close';
      close.type = 'button';
      close.setAttribute('aria-label', `Закрыть виджет «${this.title}»`);
      close.textContent = '×';
      this.on(close, 'click', () => this.onClose?.(this.id));
      header.append(close);
    }
    element.append(header);
    this.element = element;
    return element;
  }

  render() { return this.createBase(); }

  minimize(button) {
    const minimized = this.element.classList.toggle('is-minimized');
    button.textContent = minimized ? '+' : '−';
    button.setAttribute('aria-label', `${minimized ? 'Развернуть' : 'Свернуть'} виджет «${this.title}»`);
  }

  destroy() {
    this.listeners.forEach(({ target, event, handler }) => target.removeEventListener(event, handler));
    this.listeners = [];
    this.element?.remove();
    this.element = null;
  }
}
