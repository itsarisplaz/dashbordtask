import { UIComponent } from './UIComponent.js';

export class QuoteWidget extends UIComponent {
  constructor(config = {}) {
    super({ title: 'Мысль на сегодня', id: 'quote-widget', ...config });
    this.quotes = [
      'Всё важное начинается после пяти.',
      'Ручная работа — это внимание к каждой детали.',
      'Уют складывается из маленьких ритуалов.',
      'Тишина тоже может быть частью хорошего дня.',
    ];
    this.index = 0;
  }

  render() {
    const element = this.createBase();
    const refresh = document.createElement('button');
    refresh.className = 'mini-link';
    refresh.type = 'button';
    refresh.textContent = 'Обновить';
    element.querySelector('.widget-head').insertBefore(refresh, element.querySelector('.widget-close'));
    this.text = document.createElement('p');
    this.text.className = 'quote-text';
    element.append(this.text);
    this.updateQuote();
    this.on(refresh, 'click', () => this.updateQuote());
    return element;
  }

  updateQuote() {
    let next = Math.floor(Math.random() * this.quotes.length);
    if (this.quotes.length > 1 && next === this.index) next = (next + 1) % this.quotes.length;
    this.index = next;
    this.text.textContent = `«${this.quotes[this.index]}»`;
  }
}
