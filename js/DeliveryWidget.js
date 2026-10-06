import { UIComponent } from './UIComponent.js';

export class DeliveryWidget extends UIComponent {
  constructor(config = {}) {
    super({ title: 'Доставка', id: 'delivery-widget', ...config });
    this.controller = null;
    this.lastResult = null;
    this.destination = 'Москва';
    this.service = 'cdek';
    this.services = {
      cdek: { name: 'СДЭК', base: 290, perKm: 0.28, minimum: 400, terms: ['1–2 дня', '2–4 дня', '4–6 дней'] },
      fivepost: { name: '5Post', base: 150, perKm: 0.32, terms: ['2–3 дня', '4–6 дней', '6–9 дней'] },
      post: { name: 'Почта России', base: 350, perKm: 0.25, terms: ['3–5 дней', '5–8 дней', '7–12 дней'] },
    };
  }

  render() {
    const element = this.createBase();
    const controls = document.createElement('form');
    controls.className = 'delivery-form';
    const label = document.createElement('label'); label.textContent = 'Город получателя';
    this.input = document.createElement('input'); this.input.value = this.destination; this.input.maxLength = 70; this.input.required = true;
    const serviceLabel = document.createElement('label'); serviceLabel.textContent = 'Служба доставки';
    this.serviceInput = document.createElement('select');
    this.serviceInput.setAttribute('aria-label', 'Служба доставки');
    Object.entries(this.services).forEach(([id, service]) => {
      const option = document.createElement('option'); option.value = id; option.textContent = service.name;
      this.serviceInput.append(option);
    });
    this.serviceInput.value = this.service;
    const submit = document.createElement('button'); submit.className = 'mini-link'; submit.type = 'submit'; submit.textContent = 'Рассчитать';
    label.append(this.input); serviceLabel.append(this.serviceInput); controls.append(label, serviceLabel, submit);
    this.body = document.createElement('div'); this.body.className = 'delivery-result';
    element.append(controls, this.body);
    this.on(controls, 'submit', (event) => { event.preventDefault(); this.destination = this.input.value.trim(); this.service = this.serviceInput.value; this.load(); });
    this.on(this.serviceInput, 'change', () => { this.service = this.serviceInput.value; this.load(); });
    this.load();
    return element;
  }

  message(text, retry = false) {
    this.body.replaceChildren();
    const message = document.createElement('p'); message.className = 'api-message'; message.textContent = text; this.body.append(message);
    if (retry) { const retryButton = document.createElement('button'); retryButton.className = 'mini-link'; retryButton.type = 'button'; retryButton.textContent = 'Повторить'; this.on(retryButton, 'click', () => this.load()); this.body.append(retryButton); }
  }

  renderResult(data, stale = false) {
    this.body.replaceChildren();
    const result = document.createElement('div'); result.className = 'delivery-summary';
    const km = document.createElement('strong'); km.textContent = `${data.distance.toLocaleString('ru-RU')} км`;
    const note = document.createElement('span'); note.textContent = `от Санкт-Петербурга до «${data.destination}»`;
    const timing = document.createElement('p'); timing.textContent = `Ориентир: ${data.estimate.term} после отправки.`;
    const estimateBox = document.createElement('div'); estimateBox.className = 'delivery-estimate';
    const estimateLabel = document.createElement('span'); estimateLabel.textContent = `${data.estimate.name} · примерная стоимость`;
    const estimatePrice = document.createElement('strong'); estimatePrice.textContent = `от ${data.estimate.price.toLocaleString('ru-RU')} ₽`;
    estimateBox.append(estimateLabel, estimatePrice);
    result.append(km, note);
    const prices = document.createElement('div'); prices.className = 'delivery-prices';
    const title = document.createElement('span'); title.textContent = 'Ориентиры по доставке';
    prices.append(title, ...Object.entries(this.services).map(([id, service]) => {
      const comparison = this.getEstimate(data.distance, id);
      const row = document.createElement('div');
      if (id === data.service) row.classList.add('selected');
      const serviceName = document.createElement('span'); serviceName.textContent = service.name;
      const servicePrice = document.createElement('strong'); servicePrice.textContent = `от ${comparison.price.toLocaleString('ru-RU')} ₽ · ${comparison.term}`;
      row.append(serviceName, servicePrice);
      return row;
    }));
    const meta = document.createElement('p'); meta.className = `api-meta${stale ? ' stale-data' : ''}`;
    meta.textContent = stale
      ? 'Источник города: Nominatim / OpenStreetMap · данные устарели, обновление не удалось'
      : `Источник города: Nominatim / OpenStreetMap · обновлено ${new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
    this.body.append(result, timing, estimateBox, prices, meta);
  }

  showStaleError() {
    this.renderResult(this.lastResult, true);
    const message = document.createElement('p'); message.className = 'api-message'; message.textContent = 'Не удалось обновить расстояние. Показаны последние успешные данные.';
    const button = document.createElement('button'); button.className = 'mini-link'; button.type = 'button'; button.textContent = 'Повторить';
    this.on(button, 'click', () => this.load());
    this.body.append(message, button);
  }

  async load() {
    if (!this.destination) { this.message('Введите город получателя.'); return; }
    this.controller?.abort(); this.controller = new AbortController(); this.message('Ищем город…');
    try {
      const query = encodeURIComponent(this.destination);
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&accept-language=ru&q=${query}`, { signal: this.controller.signal });
      if (!response.ok) throw new Error('geocoding request failed');
      const places = await response.json();
      const place = Array.isArray(places) ? places[0] : null;
      if (!place) { this.message('Город не найден. Уточните название.'); return; }
      const latitude = Number(place.lat); const longitude = Number(place.lon);
      const distance = Math.round(this.haversine(59.9386, 30.3141, latitude, longitude));
      const estimate = this.getEstimate(distance);
      this.lastResult = { distance, destination: this.destination, service: this.service, estimate };
      this.renderResult(this.lastResult);
    } catch (error) { if (error.name !== 'AbortError') { if (this.lastResult) this.showStaleError(); else this.message('Не удалось рассчитать расстояние. Данные временно недоступны.', true); } }
  }

  getEstimate(distance, serviceId = this.service) {
    const service = this.services[serviceId];
    const termIndex = distance < 250 ? 0 : distance < 900 ? 1 : 2;
    const rawPrice = Math.ceil((service.base + distance * service.perKm) / 10) * 10;
    return { name: service.name, term: service.terms[termIndex], price: Math.max(service.minimum || 0, rawPrice) };
  }

  haversine(lat1, lon1, lat2, lon2) { const rad = Math.PI / 180; const a = Math.sin((lat2 - lat1) * rad / 2) ** 2 + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin((lon2 - lon1) * rad / 2) ** 2; return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); }
  destroy() { this.controller?.abort(); super.destroy(); }
}
