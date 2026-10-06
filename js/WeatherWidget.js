import { UIComponent } from './UIComponent.js';

export class WeatherWidget extends UIComponent {
  constructor(config = {}) { super({ title: 'Погода', id: 'weather-widget', ...config }); this.controller = null; this.lastData = null; }

  render() {
    const element = this.createBase();
    element.classList.add('weather-card');
    const refresh = document.createElement('button');
    refresh.className = 'icon-action';
    refresh.type = 'button';
    refresh.textContent = '↻';
    refresh.setAttribute('aria-label', 'Обновить погоду');
    element.querySelector('.widget-head').insertBefore(refresh, element.querySelector('.widget-close'));
    this.body = document.createElement('div');
    this.body.className = 'weather-body';
    element.append(this.body);
    this.on(refresh, 'click', () => this.load());
    this.load();
    return element;
  }

  setMessage(message, retry = false) {
    this.body.replaceChildren();
    const text = document.createElement('p');
    text.className = 'api-message';
    text.textContent = message;
    this.body.append(text);
    if (retry) {
      const button = document.createElement('button');
      button.className = 'mini-link';
      button.type = 'button';
      button.textContent = 'Повторить';
      this.on(button, 'click', () => this.load());
      this.body.append(button);
    }
  }

  renderWeather(current, stale = false) {
    this.body.replaceChildren();
    const main = document.createElement('div');
    main.className = 'weather-main';
    const values = document.createElement('div');
    const temp = document.createElement('div'); temp.className = 'temperature'; temp.textContent = `${Math.round(current.temperature_2m)}°`;
    const feels = document.createElement('div'); feels.textContent = `ощущается как ${Math.round(current.apparent_temperature)}°`;
    values.append(temp, feels);
    const icon = document.createElement('div'); icon.className = 'weather-icon'; icon.textContent = '☼';
    main.append(values, icon);
    const details = document.createElement('div'); details.className = 'weather-details';
    const wind = document.createElement('span'); wind.textContent = `Ветер ${Math.round(current.wind_speed_10m)} км/ч`;
    const rain = document.createElement('span'); rain.textContent = `Осадки ${current.precipitation} мм`;
    details.append(wind, rain);
    const meta = document.createElement('p');
    meta.className = `api-meta${stale ? ' stale-data' : ''}`;
    meta.textContent = stale
      ? 'Источник: Open-Meteo · данные устарели, обновление не удалось'
      : `Источник: Open-Meteo · обновлено ${new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
    this.body.append(main, details, meta);
  }

  showStaleError() {
    this.renderWeather(this.lastData, true);
    const message = document.createElement('p'); message.className = 'api-message'; message.textContent = 'Не удалось обновить погоду. Показаны последние успешные данные.';
    const button = document.createElement('button'); button.className = 'mini-link'; button.type = 'button'; button.textContent = 'Повторить';
    this.on(button, 'click', () => this.load());
    this.body.append(message, button);
  }

  async load() {
    this.controller?.abort();
    this.controller = new AbortController();
    this.setMessage('Обновляем данные…');
    try {
      const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=59.9386&longitude=30.3141&current=temperature_2m,apparent_temperature,precipitation,wind_speed_10m&timezone=Europe%2FMoscow', { signal: this.controller.signal });
      if (!response.ok) throw new Error('weather request failed');
      const data = await response.json();
      const current = data?.current;
      const fields = ['temperature_2m', 'apparent_temperature', 'precipitation', 'wind_speed_10m'];
      if (!current || fields.some((field) => typeof current[field] !== 'number')) { this.setMessage('Для Санкт-Петербурга нет полного актуального ответа.'); return; }
      this.lastData = current;
      this.renderWeather(current);
    } catch (error) { if (error.name !== 'AbortError') { if (this.lastData) this.showStaleError(); else this.setMessage('Не удалось загрузить погоду. Данные временно недоступны.', true); } }
  }

  destroy() { this.controller?.abort(); super.destroy(); }
}
