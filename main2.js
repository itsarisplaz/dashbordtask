import { Dashboard } from './js/Dashboard.js';

const root = document.querySelector('#view-container');
const dashboard = new Dashboard({ root });
const orders = [
  { id: '#105', client: 'София Коваль', product: 'Дымка', aroma: 'Дубовый мох и янтарь', wick: 'Хлопковый M · Ø 55–70 мм', status: 'Новый', due: '23 сент.' },
  { id: '#104', client: 'Мария Иванова', product: 'Золотой час', aroma: 'Кашмировое дерево', wick: 'Деревянный M · Ø 55–70 мм', status: 'В работе', due: '20 сент.' },
  { id: '#103', client: 'Екатерина Петрова', product: 'Большая ночь', aroma: 'Табак и бергамот', wick: 'Хлопковый L · Ø 70–85 мм', status: 'Готов', due: 'Сегодня' },
  { id: '#102', client: 'Анна Смирнова', product: 'Бантик', aroma: 'Ваниль бурбоновская', wick: 'Хлопковый S · Ø 45–55 мм', status: 'Упакован', due: 'Сегодня' },
  { id: '#101', client: 'Дарья Орлова', product: 'Зефир', aroma: 'Розовое шампанское', wick: 'Деревянный S · Ø 45–55 мм', status: 'Отправлен', due: '18 сент.' },
];

const inventoryGroups = {
  base: [
    ['Соевый воск', '4,5 кг', 'Достаточно', 'green'],
    ['Гипс', '8,2 кг', 'Достаточно', 'green'],
  ],
  aromas: [
    ['Дубовый мох и янтарь', '38 г'], ['Ваниль бурбоновская', '24 г'], ['Еловые шишки и хвоя', '31 г'], ['Кашмировое дерево', '42 г'],
    ['Манго и кокосовое молоко', '29 г'], ['Апельсин и корица', '36 г'], ['Пачули', '18 г'], ['Нероли', '27 г'],
    ['Грушевый бренди', '34 г'], ['Морская соль и орхидея', '21 г'], ['Сливы и кашемир', '39 г'], ['Манго и бергамот', '32 г'],
    ['Дух Рождества', '17 г'], ['Французская пекарня', '45 г'], ['Розовое шампанское', '23 г'], ['Табак и бергамот', '28 г'],
    ['Кокос и шоколад', '33 г'], ['Пряности', '19 г'], ['Жасмин', '26 г'], ['Грейпфрут и мангостин', '37 г'],
    ['Грейпфрут и мята', '22 г'], ['Тыквенное суфле', '16 г'], ['Абрикосовый конфитюр', '41 г'], ['Тыквенный карамельный хруст', '25 г'],
    ['Кокос и шоколад «Баунти»', '30 г'], ['Апельсин, жасмин, ваниль', '20 г'], ['Новогодняя ночь', '14 г'], ['Пряная тыква и молоко', '35 г'],
    ['Коньяк и трюфель', '12 г'], ['Цитрусовая магия', '43 г'], ['Можжевельник', '15 г'], ['Жвачка Love is', '40 г'],
  ],
  jars: [
    ['Банки 70 мл', '18 шт.', 'Критически мало', 'red'], ['Банки 100 мл', '26 шт.', 'Достаточно', 'green'], ['Банки 160 мл', '6 шт.', 'Критически мало', 'red'],
    ['Банки 200 мл', '14 шт.', 'Заканчивается', 'gold'], ['Банки 250 мл', '12 шт.', 'Заканчивается', 'gold'], ['Банки 300 мл', '9 шт.', 'Заканчивается', 'gold'],
  ],
  wicks: [
    ['Хлопковый · S', '35 шт. · Ø 45–55 мм'], ['Хлопковый · M', '42 шт. · Ø 55–70 мм'], ['Хлопковый · L', '24 шт. · Ø 70–85 мм'],
    ['Деревянный · S', '20 шт. · Ø 45–55 мм'], ['Деревянный · M', '18 шт. · Ø 55–70 мм'], ['Деревянный · L', '11 шт. · Ø 70–85 мм'],
  ],
  packaging: [
    ['Бумажный наполнитель', '12 пакетов', 'Заканчивается', 'gold', 'крафт'],
    ['Пупырчатая плёнка', '18 м', 'Достаточно', 'green', 'прозрачная'],
    ['Тишью', '24 листа', 'Достаточно', 'green', 'молочный'],
    ['Тишью', '18 листов', 'Заканчивается', 'gold', 'оливковый'],
    ['Наклейки «После Пяти»', '60 шт.', 'Достаточно', 'green', 'золотые'],
    ['Наклейки «Осторожно, хрупкое»', '30 шт.', 'Заканчивается', 'gold', 'чёрные'],
    ['Коробки S · 15 × 15 × 8 см', '18 шт.', 'Достаточно', 'green', 'для маленьких свечей'],
    ['Коробки M · 20 × 20 × 10 см', '12 шт.', 'Заканчивается', 'gold', 'для банок 160–200 мл'],
    ['Коробки L · 25 × 25 × 12 см', '8 шт.', 'Заканчивается', 'gold', 'для наборов и больших свечей'],
  ],
};

function toast(message) {
  const element = document.querySelector('#toast');
  element.textContent = message;
  element.classList.add('show');
  window.setTimeout(() => element.classList.remove('show'), 2400);
}

function setPage(content) {
  dashboard.clear();
  root.classList.remove('page-swap');
  root.innerHTML = `<div class="page">${content}</div>`;
  requestAnimationFrame(() => root.classList.add('page-swap'));
}

function bindViewLinks() {
  document.querySelectorAll('[data-view-link]').forEach((button) => button.addEventListener('click', () => setView(button.dataset.viewLink)));
}

function addSlots(grid, definitions) {
  definitions.forEach(({ type, span }) => {
    const slot = document.createElement('div');
    slot.className = `${span} dashboard-slot`;
    slot.dataset.widgetType = type;
    grid.append(slot);
    dashboard.addWidget(type, slot);
  });
}

function setupWidgetMenu() {
  const trigger = document.querySelector('#add-widget');
  const menu = document.querySelector('#widget-menu');
  trigger.addEventListener('click', () => menu.classList.toggle('open'));
  menu.querySelectorAll('[data-widget]').forEach((button) => button.addEventListener('click', () => {
    const slot = document.createElement('div');
    slot.className = 'span-6 dashboard-slot';
    slot.dataset.widgetType = `${button.dataset.widget}-${Date.now()}`;
    document.querySelector('#dashboard-grid').append(slot);
    dashboard.addWidget(button.dataset.widget, slot);
    decorateDashboardItem(slot);
    menu.classList.remove('open');
    toast('Виджет добавлен на рабочий стол');
  }));
}

function persistDashboardOrder() {
  const grid = document.querySelector('#dashboard-grid');
  if (!grid) return;
  const ids = [...grid.children].filter((item) => item.classList.contains('dashboard-item')).map((item) => item.dataset.dashboardItem);
  window.localStorage.setItem('after-five-dashboard-order', JSON.stringify(ids));
}

function moveDashboardItem(item, direction) {
  const grid = document.querySelector('#dashboard-grid');
  const items = [...grid.children].filter((entry) => entry.classList.contains('dashboard-item'));
  const index = items.indexOf(item);
  const target = direction === 'up' ? items[index - 1] : items[index + 1];
  if (!target) return;
  if (direction === 'up') target.before(item);
  else target.after(item);
  persistDashboardOrder();
}

function decorateDashboardItem(item) {
  if (item.classList.contains('dashboard-item')) return;
  item.classList.add('dashboard-item');
  item.dataset.dashboardItem = item.dataset.dashboardItem || `dashboard-${item.dataset.widgetType || [...document.querySelectorAll('.dashboard-item')].length}`;
  const actions = document.createElement('div');
  actions.className = 'layout-actions';
  actions.innerHTML = '<button type="button" data-layout-move="up" aria-label="Переместить виджет выше">↑</button><button type="button" data-layout-move="down" aria-label="Переместить виджет ниже">↓</button>';
  actions.querySelector('[data-layout-move="up"]').addEventListener('click', () => moveDashboardItem(item, 'up'));
  actions.querySelector('[data-layout-move="down"]').addEventListener('click', () => moveDashboardItem(item, 'down'));
  item.prepend(actions);
  item.addEventListener('dragstart', () => { item.classList.add('is-dragging'); });
  item.addEventListener('dragend', () => { item.classList.remove('is-dragging'); });
  item.addEventListener('dragover', (event) => { if (document.querySelector('#dashboard-grid').classList.contains('layout-editing')) event.preventDefault(); });
  item.addEventListener('drop', (event) => {
    event.preventDefault();
    const dragged = document.querySelector('.dashboard-item.is-dragging');
    if (!dragged || dragged === item) return;
    const rect = item.getBoundingClientRect();
    if (event.clientY < rect.top + rect.height / 2) item.before(dragged);
    else item.after(dragged);
    persistDashboardOrder();
  });
}

function setupDashboardLayout() {
  const grid = document.querySelector('#dashboard-grid');
  const staticNames = ['dashboard-work', 'dashboard-orders', 'dashboard-stock', 'dashboard-calendar', 'dashboard-stats'];
  [...grid.children].filter((item) => item.classList.contains('widget')).forEach((item, index) => { item.dataset.dashboardItem = staticNames[index]; });
  [...grid.children].filter((item) => item.classList.contains('dashboard-slot')).forEach((item) => { item.dataset.dashboardItem = `dashboard-${item.dataset.widgetType}`; });
  [...grid.children].filter((item) => item.classList.contains('widget') || item.classList.contains('dashboard-slot')).forEach(decorateDashboardItem);
  const savedOrder = JSON.parse(window.localStorage.getItem('after-five-dashboard-order') || '[]');
  const itemsById = new Map([...grid.children].filter((item) => item.classList.contains('dashboard-item')).map((item) => [item.dataset.dashboardItem, item]));
  savedOrder.forEach((id) => { if (itemsById.has(id)) grid.append(itemsById.get(id)); });
  const toggle = document.querySelector('#toggle-layout');
  toggle.addEventListener('click', () => {
    const editing = grid.classList.toggle('layout-editing');
    grid.querySelectorAll('.dashboard-item').forEach((item) => { item.draggable = editing; });
    toggle.textContent = editing ? '✓ Готово' : '↕ Настроить порядок';
    toggle.classList.toggle('is-active', editing);
    toast(editing ? 'Перетаскивайте карточки или используйте стрелки' : 'Порядок виджетов сохранён');
  });
}

function today() {
  const currentDate = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Moscow' }).format(new Date());
  setPage(`<div class="page-heading"><div><p class="eyebrow">Учебный дашборд</p><h1>Добрый день, <em>Арина</em></h1><p class="date-line">${currentDate} · Санкт-Петербург</p></div><div class="widget-action"><button class="secondary-button" id="toggle-layout">↕ Настроить порядок</button><button class="primary-button" id="add-widget">＋ Добавить виджет</button><div id="widget-menu" class="widget-menu"><button data-widget="todo">Задачи</button><button data-widget="weather">Погода</button><button data-widget="quote">Мысль на сегодня</button><button data-widget="delivery">Расчёт доставки</button></div></div></div><div class="day-progress"><div><span>Ритм дня</span><strong>4 из 6 задач</strong></div><div class="day-progress-bar"><i style="width:67%"></i></div><small>Четыре виджета помогают быстро спланировать день в мастерской.</small></div><div class="dashboard-grid" id="dashboard-grid"><div id="extra-widgets" class="extra-widgets"></div></div>`);
  const grid = document.querySelector('#dashboard-grid');
  addSlots(grid, [{ type: 'weather', span: 'span-6' }, { type: 'todo', span: 'span-6' }, { type: 'quote', span: 'span-6' }, { type: 'delivery', span: 'span-6' }]);
  setupDashboardLayout();
  setupWidgetMenu();
  bindViewLinks();
}

function statusClass(status) {
  if (status === 'Новый') return 'pill';
  if (status === 'В работе' || status === 'Упакован') return 'gold';
  if (status === 'Готов' || status === 'Отправлен') return 'green';
  return '';
}

function filteredOrders(filter) {
  const groups = {
    all: () => true,
    new: (order) => order.status === 'Новый',
    working: (order) => order.status === 'В работе',
    ready: (order) => order.status === 'Готов',
    packed: (order) => order.status === 'Упакован',
    sent: (order) => order.status === 'Отправлен',
  };
  return orders.filter(groups[filter] || groups.all);
}

function renderOrderRows(filter) {
  const body = document.querySelector('#orders-body');
  const visibleOrders = filteredOrders(filter);
  body.innerHTML = visibleOrders.length
    ? visibleOrders.map((order) => `<tr><td><strong>${order.id}</strong></td><td>${order.client}</td><td><strong>${order.product}</strong><small class="table-note">${order.aroma}</small></td><td><span class="table-note">${order.wick}</span></td><td>${order.due}</td><td><span class="pill ${statusClass(order.status)}">${order.status}</span></td></tr>`).join('')
    : '<tr><td colspan="6" class="empty-cell">В этой категории пока нет заказов.</td></tr>';
}

function ordersView() {
  setPage(`<div class="page-heading"><div><p class="eyebrow">Мастерская</p><h1>Заказы</h1><p class="date-line">Все текущие заказы бренда «После Пяти» · состав свечи указан в каждой строке</p></div><button class="primary-button" id="new-order">＋ Новый заказ</button></div><div class="widget"><div class="filter-row" aria-label="Фильтр заказов"><button class="filter active" data-filter="all">Все заказы</button><button class="filter" data-filter="new">Новые</button><button class="filter" data-filter="working">В работе</button><button class="filter" data-filter="ready">Готовы</button><button class="filter" data-filter="packed">Упакованы</button><button class="filter" data-filter="sent">Отправлены</button></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Заказ</th><th>Клиент</th><th>Свеча и аромат</th><th>Фитиль</th><th>Срок</th><th>Статус</th></tr></thead><tbody id="orders-body"></tbody></table></div></div>`);
  renderOrderRows('all');
  document.querySelector('#new-order').addEventListener('click', () => toast('Создание заказа добавим следующим шагом.'));
  document.querySelectorAll('[data-filter]').forEach((button) => button.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    renderOrderRows(button.dataset.filter);
  }));
}

function productionView() {
  const shippedSample = { id: '#099', client: 'Полина Белова', product: 'Капля', aroma: 'Еловые шишки и хвоя', wick: 'Деревянный S · Ø 45–55 мм', status: 'Отправлен', due: '18 сент.' };
  const lanes = [
    { title: 'Новые', status: 'Новый', orders: [orders[0]] },
    { title: 'В работе', status: 'В работе', orders: [orders[1]] },
    { title: 'Готовы', status: 'Готов', orders: [orders[2]] },
    { title: 'Упакованы', status: 'Упакован', orders: [orders[3]] },
    { title: 'Отправлены', status: 'Отправлен', orders: [orders[4], shippedSample] },
  ];
  const progress = [20, 48, 72, 88, 100];
  setPage(`<div class="page-heading"><div><p class="eyebrow">Процесс</p><h1>Производство</h1><p class="date-line">Путь заказа от новой заявки до отправки клиенту</p></div><span class="pill gold">12 изделий в процессе</span></div><div class="production-summary"><div><span>На изготовлении</span><strong>2</strong><small>нужно залить и выдержать</small></div><div><span>Готовы к упаковке</span><strong>1</strong><small>можно передавать дальше</small></div><div><span>На отправке</span><strong>2</strong><small>заказы готовы клиентам</small></div></div><div class="production-board-note"><strong>Как читать производство</strong><span>Каждая колонка — отдельный этап. В карточке видно, какую свечу делать, с каким ароматом и фитилём, чтобы не сверяться с несколькими списками.</span></div><div class="kanban production-kanban">${lanes.map((lane, laneIndex) => `<section class="kanban-col production-lane lane-${laneIndex}"><div class="lane-heading"><h3>${lane.title}</h3><span>${lane.orders.length}</span></div><div class="lane-caption">${lane.status === 'Новый' ? 'ждут запуска' : lane.status === 'В работе' ? 'изготавливаются' : lane.status === 'Готов' ? 'проверка качества' : lane.status === 'Упакован' ? 'готовы к отправке' : 'уже в пути'}</div>${lane.orders.map((order) => `<article class="kanban-card production-card"><div class="production-card-top"><strong>${order.id}</strong><span class="pill ${statusClass(order.status)}">${order.status}</span></div><h4>${order.product}</h4><p class="production-client">${order.client}</p><div class="production-detail"><span>Аромат</span><strong>${order.aroma}</strong></div><div class="production-detail"><span>Фитиль</span><strong>${order.wick}</strong></div><div class="production-due"><span>Срок</span><strong>${order.due}</strong></div><div class="production-progress"><i style="width:${progress[laneIndex]}%"></i></div></article>`).join('')}</section>`).join('')}</div>`);
}

function renderInventorySection(group) {
  const section = document.querySelector('#inventory-content');
  const titles = { base: 'Основа', aromas: 'Ароматизаторы', jars: 'Банки по объёму', wicks: 'Фитили по типу и диаметру свечи', packaging: 'Упаковка по видам, цветам и размерам' };
  const groups = group === 'all' ? ['base', 'aromas', 'jars', 'wicks', 'packaging'] : [group];
  section.innerHTML = groups.map((name) => {
    const cards = inventoryGroups[name].map((item, index) => {
      const state = item[2] || (Number.parseInt(item[1], 10) < 15 ? 'Заканчивается' : 'Достаточно');
      const stateClass = item[3] || (state === 'Заканчивается' ? 'gold' : 'green');
      const progress = name === 'aromas' ? Math.min(95, Number.parseInt(item[1], 10) * 2) : stateClass === 'red' ? 18 : stateClass === 'gold' ? 42 : 72;
      const [amount, diameter] = item[1].split('·').map((part) => part.trim());
      const note = item[4] || diameter || '';
      return `<article class="inventory-item"><div class="inventory-top"><div><strong>${item[0]}</strong><small>${name === 'aromas' ? 'ароматизатор' : name === 'jars' ? 'тара' : name === 'wicks' ? 'расходник' : name === 'packaging' ? 'упаковка' : 'материал'}</small></div><span class="pill ${stateClass}">${state}</span></div><div class="inventory-qty">${name === 'wicks' ? amount : item[1]}</div>${name === 'wicks' || name === 'packaging' ? `<p class="inventory-note">${note}</p>` : ''}<div class="bar"><i style="width:${progress}%"></i></div></article>`;
    }).join('');
    return `<section class="inventory-section"><div class="inventory-section-title"><h2>${titles[name]}</h2>${name === 'aromas' ? '<span>Все остатки — до 50 г</span>' : ''}</div><div class="inventory-grid">${cards}</div></section>`;
  }).join('');
}

function inventoryView() {
  setPage(`<div class="page-heading"><div><p class="eyebrow">Фактические остатки</p><h1>Склад</h1><p class="date-line">То, что уже есть в мастерской: материалы, тара и упаковка</p></div><span class="pill green">Данные обновлены сегодня</span></div><div class="inventory-purpose"><span>▤</span><div><strong>Здесь не оформляют закупки.</strong> Склад помогает увидеть реальное наличие и понять, чего хватит для ближайших заказов. План пополнения находится в разделе «Закупки».</div></div><div class="inventory-overview"><article><span>Позиций на складе</span><strong>53</strong><small>материала и расходника</small></article><article class="inventory-alert"><span>Критично мало</span><strong>2</strong><small>нужно заказать в первую очередь</small></article><article class="inventory-warning"><span>Заканчивается</span><strong>12</strong><small>проверить в плане закупок</small></article><article><span>Упаковка</span><strong>9</strong><small>видов по цветам и размерам</small></article></div><div class="widget inventory-widget"><div class="inventory-toolbar"><div><h2>Все материалы</h2><p>Фактические остатки мастерской, не будущие закупки</p></div><div class="filter-row" aria-label="Категории склада"><button class="filter active" data-inventory="all">Все</button><button class="filter" data-inventory="aromas">Ароматы</button><button class="filter" data-inventory="jars">Банки</button><button class="filter" data-inventory="wicks">Фитили</button><button class="filter" data-inventory="packaging">Упаковка</button><button class="filter" data-inventory="base">Основа</button></div></div><div id="inventory-content"></div></div>`);
  renderInventorySection('all');
  document.querySelectorAll('[data-inventory]').forEach((button) => button.addEventListener('click', () => {
    document.querySelectorAll('[data-inventory]').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    renderInventorySection(button.dataset.inventory);
  }));
}

const purchaseItems = [
  { id: 'wax', material: 'Соевый воск', category: 'Основа', amount: '10 кг', purpose: 'для партии осенней коллекции', priority: 'Высокий', delivery: 'до 20 сент.', ordered: false },
  { id: 'jars-160', material: 'Банки 160 мл', category: 'Тара', amount: '24 шт.', purpose: 'остаток ниже минимального', priority: 'Высокий', delivery: 'до 20 сент.', ordered: false },
  { id: 'wicks-m', material: 'Хлопковые фитили M', category: 'Фитили', amount: '50 шт.', purpose: 'под банки Ø 55–70 мм', priority: 'Средний', delivery: 'до 22 сент.', ordered: true },
  { id: 'aromas', material: 'Ароматизаторы', category: 'Ароматы', amount: '500 мл', purpose: 'пополнить ходовые позиции', priority: 'Средний', delivery: 'до 25 сент.', ordered: false },
  { id: 'boxes', material: 'Коробки и наполнитель', category: 'Упаковка', amount: '30 комплектов', purpose: 'для заказов и отправок', priority: 'Низкий', delivery: 'до 28 сент.', ordered: true },
];

function purchasesView() {
  setPage(`<div class="page-heading"><div><p class="eyebrow">Будущие пополнения</p><h1>Закупки</h1><p class="date-line">Что нужно заказать, у кого и к какой дате, чтобы производство не остановилось</p></div><span class="pill gold">План на октябрь</span></div><div class="procurement-purpose"><span>↗</span><div><strong>Это не текущий остаток.</strong> Здесь только позиции, которые нужно купить или уже заказали. После получения они появятся в разделе «Склад».</div></div><div class="difference-note"><div><strong>Склад</strong><span>что уже есть в мастерской</span></div><b>→</b><div><strong>Закупки</strong><span>что нужно пополнить</span></div><b>→</b><div><strong>Производство</strong><span>что сейчас изготавливаем</span></div></div><div class="procurement-summary"><article><span>Позиций в плане</span><strong id="purchase-total">5</strong></article><article><span>Нужно заказать срочно</span><strong class="danger-number" id="purchase-urgent">2</strong></article><article><span>Уже заказано</span><strong id="purchase-ordered">2</strong></article></div><section class="widget procurement-widget"><div class="filter-row" aria-label="Фильтр закупок"><button class="filter active" data-purchase-filter="all">Все позиции</button><button class="filter" data-purchase-filter="urgent">Срочные</button><button class="filter" data-purchase-filter="pending">Не заказано</button><button class="filter" data-purchase-filter="ordered">Заказано</button></div><div class="procurement-list" id="procurement-list"></div></section>`);
  const renderPurchases = (filter = 'all') => {
    const list = document.querySelector('#procurement-list');
    const visible = purchaseItems.filter((item) => filter === 'all' || (filter === 'urgent' && item.priority === 'Высокий') || (filter === 'pending' && !item.ordered) || (filter === 'ordered' && item.ordered));
    list.innerHTML = visible.map((item) => `<article class="procurement-item"><div class="procurement-material"><strong>${item.material}</strong><span>${item.category}</span></div><div><span class="procurement-label">Заказать</span><strong>${item.amount}</strong></div><div><span class="procurement-label">Зачем</span><span>${item.purpose}</span></div><div><span class="procurement-label">Срок</span><span>${item.delivery}</span></div><span class="pill ${item.priority === 'Высокий' ? 'red' : item.priority === 'Средний' ? 'gold' : 'green'}">${item.priority}</span><button class="purchase-status ${item.ordered ? 'is-ordered' : ''}" data-purchase-id="${item.id}">${item.ordered ? '✓ Заказано' : 'Отметить как заказанную'}</button></article>`).join('') || '<p class="empty-cell">В этом списке пока нет позиций.</p>';
    document.querySelector('#purchase-total').textContent = purchaseItems.length;
    document.querySelector('#purchase-urgent').textContent = purchaseItems.filter((item) => !item.ordered && item.priority === 'Высокий').length;
    document.querySelector('#purchase-ordered').textContent = purchaseItems.filter((item) => item.ordered).length;
    document.querySelectorAll('[data-purchase-id]').forEach((button) => button.addEventListener('click', () => { const item = purchaseItems.find((entry) => entry.id === button.dataset.purchaseId); item.ordered = !item.ordered; renderPurchases(document.querySelector('[data-purchase-filter].active').dataset.purchaseFilter); toast(item.ordered ? 'Позиция отмечена как заказанная' : 'Позиция возвращена в план'); }));
  };
  document.querySelectorAll('[data-purchase-filter]').forEach((button) => button.addEventListener('click', () => { document.querySelectorAll('[data-purchase-filter]').forEach((item) => item.classList.remove('active')); button.classList.add('active'); renderPurchases(button.dataset.purchaseFilter); }));
  renderPurchases();
}

const calendarEvents = {
  '2026-09-18': [{ type: 'Задача', title: 'Проверить заказ «Золотой час»' }, { type: 'Производство', title: 'Заливка свечей в стекле' }],
  '2026-09-20': [{ type: 'Поставка', title: 'Получение партии банок 160 мл' }],
  '2026-09-22': [{ type: 'Закупки', title: 'Заказать хлопковые фитили M' }],
  '2026-09-24': [{ type: 'Съёмка', title: 'Съёмка новой коллекции' }],
  '2026-09-26': [{ type: 'Публикация', title: 'Публикация осенней коллекции' }],
  '2026-09-29': [{ type: 'Запуск', title: 'Старт продаж коллекции «Тихий вечер»' }],
  '2026-10-01': [{ type: 'Отправка', title: 'Отправить заказы недели' }],
  '2026-10-03': [{ type: 'Съёмка', title: 'Предметная съёмка свечей в гипсе' }],
  '2026-10-06': [{ type: 'Закупки', title: 'Заказать ароматизаторы и воск' }],
  '2026-10-10': [{ type: 'Публикация', title: 'Публикация подборки «Тёплый дом»' }],
  '2026-10-14': [{ type: 'Производство', title: 'Заливка партии свечей в банках 200 мл' }],
  '2026-10-17': [{ type: 'Контент', title: 'Подготовить письма для рассылки' }],
  '2026-10-20': [{ type: 'Поставка', title: 'Получение партии упаковки' }],
  '2026-10-24': [{ type: 'Съёмка', title: 'Съёмка зимней коллекции' }],
  '2026-10-27': [{ type: 'Склад', title: 'Проверить остатки перед запуском' }],
  '2026-10-30': [{ type: 'Планирование', title: 'Собрать план ноября' }],
};

function calendarKey(date) {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
}

function calendarView() {
  setPage(`<div class="page-heading"><div><p class="eyebrow">Планы мастерской</p><h1>Календарь</h1><p class="date-line">Производство, поставки, съёмки и запуски коллекций</p></div><button class="primary-button" id="calendar-today">Сегодня</button></div><div class="calendar-layout"><section class="widget calendar-widget"><div class="calendar-toolbar"><button class="calendar-arrow" id="calendar-prev" aria-label="Предыдущий месяц">←</button><h2 id="calendar-month">Сентябрь 2026</h2><button class="calendar-arrow" id="calendar-next" aria-label="Следующий месяц">→</button></div><div class="calendar-weekdays"><span>Пн</span><span>Вт</span><span>Ср</span><span>Чт</span><span>Пт</span><span>Сб</span><span>Вс</span></div><div class="calendar-grid" id="calendar-grid"></div><div class="calendar-legend"><span><i class="legend-dot gold"></i>производство и задачи</span><span><i class="legend-dot green"></i>события и запуски</span></div></section><aside class="widget selected-day"><div class="widget-head"><div><p class="eyebrow">Выбранный день</p><h2 class="widget-title" id="selected-day-title">Сегодня</h2></div><div class="selected-day-actions"><span class="pill gold" id="selected-day-count">2 события</span><button class="mini-link" id="add-calendar-task" type="button">＋ Добавить задачу</button></div></div><div id="selected-day-content"></div><form class="calendar-task-form" id="calendar-task-form" hidden><label for="calendar-task-input">Новая задача<input id="calendar-task-input" name="task" placeholder="Например: проверить упаковку" autocomplete="off"></label><button class="primary-button" type="submit">Сохранить</button></form></aside></div>`);
  let viewDate = new Date(2026, 8, 1);
  let selectedKey = '2026-09-18';

  const renderSelectedDay = () => {
    const date = new Date(`${selectedKey}T12:00:00`);
    const events = calendarEvents[selectedKey] || [];
    document.querySelector('#selected-day-title').textContent = date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
    document.querySelector('#selected-day-count').textContent = events.length ? `${events.length} ${events.length === 1 ? 'событие' : 'события'}` : 'свободный день';
    const content = document.querySelector('#selected-day-content');
    content.innerHTML = '';
    if (!events.length) {
      const empty = document.createElement('p');
      empty.className = 'calendar-empty';
      empty.textContent = 'На этот день пока ничего не запланировано.';
      content.append(empty);
      return;
    }
    events.forEach((event) => {
      const item = document.createElement('div');
      item.className = 'selected-event';
      const type = document.createElement('span');
      type.className = 'pill green';
      type.textContent = event.type;
      const title = document.createElement('strong');
      title.textContent = event.title;
      item.append(type, title);
      content.append(item);
    });
    const hint = document.createElement('p');
    hint.className = 'calendar-hint';
    hint.textContent = 'Нажмите на другую дату, чтобы посмотреть её план.';
    content.append(hint);
  };

  const renderCalendar = () => {
    const monthName = viewDate.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
    document.querySelector('#calendar-month').textContent = monthName.charAt(0).toUpperCase() + monthName.slice(1);
    const grid = document.querySelector('#calendar-grid');
    grid.innerHTML = '';
    const firstDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
    const offset = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
    for (let index = 0; index < offset + daysInMonth; index += 1) {
      if (index < offset) {
        const blank = document.createElement('div');
        blank.className = 'calendar-cell calendar-blank';
        grid.append(blank);
        continue;
      }
      const day = index - offset + 1;
      const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
      const key = calendarKey(date);
      const events = calendarEvents[key] || [];
      const cell = document.createElement('button');
      cell.className = `calendar-cell${key === selectedKey ? ' selected' : ''}${key === '2026-09-18' ? ' today' : ''}`;
      cell.type = 'button';
      cell.setAttribute('aria-label', `${day} ${monthName}${events.length ? `, событий: ${events.length}` : ''}`);
      const number = document.createElement('strong');
      number.textContent = day;
      cell.append(number);
      events.slice(0, 2).forEach((event) => {
        const eventLabel = document.createElement('span');
        eventLabel.className = `calendar-event ${event.type === 'Задача' || event.type === 'Производство' || event.type === 'Закупки' ? 'gold' : 'green'}`;
        eventLabel.textContent = event.title;
        cell.append(eventLabel);
      });
      cell.addEventListener('click', () => { selectedKey = key; renderCalendar(); renderSelectedDay(); });
      grid.append(cell);
    }
  };

  document.querySelector('#calendar-prev').addEventListener('click', () => { viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1); renderCalendar(); });
  document.querySelector('#calendar-next').addEventListener('click', () => { viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1); renderCalendar(); });
  document.querySelector('#calendar-today').addEventListener('click', () => { viewDate = new Date(2026, 8, 1); selectedKey = '2026-09-18'; renderCalendar(); renderSelectedDay(); });
  const taskForm = document.querySelector('#calendar-task-form');
  const taskInput = document.querySelector('#calendar-task-input');
  document.querySelector('#add-calendar-task').addEventListener('click', () => { taskForm.hidden = !taskForm.hidden; if (!taskForm.hidden) taskInput.focus(); });
  taskForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const task = taskInput.value.trim();
    if (!task) return;
    calendarEvents[selectedKey] = [...(calendarEvents[selectedKey] || []), { type: 'Задача', title: task }];
    taskForm.hidden = true;
    taskForm.reset();
    renderCalendar();
    renderSelectedDay();
    toast('Задача добавлена в календарь');
  });
  renderCalendar();
  renderSelectedDay();
}

const statsPeriods = {
  7: { label: '7 дней', orders: '6', completed: '4', production: '12', revenue: '14 900 ₽', visitors: '286', views: '498', requests: '9', conversion: '3,1%', today: '2 просмотра · 2 посетителя', history: '1 915 посещений', deltaVisitors: '+18,4%', deltaViews: '+11,2%', deltaRequests: '+28,6%' },
  30: { label: '30 дней', orders: '18', completed: '14', production: '12', revenue: '42 800 ₽', visitors: '1 104', views: '1 822', requests: '38', conversion: '3,4%', today: '2 просмотра · 2 посетителя', history: '1 915 посещений', deltaVisitors: '+43,1%', deltaViews: '+18,5%', deltaRequests: '+35,7%' },
  90: { label: '90 дней', orders: '47', completed: '39', production: '12', revenue: '116 400 ₽', visitors: '2 968', views: '5 214', requests: '96', conversion: '3,2%', today: '18 просмотров · 11 посетителей', history: '1 915 посещений', deltaVisitors: '+62,7%', deltaViews: '+41,8%', deltaRequests: '+48,3%' },
};

function statsView() {
    setPage(`<div class="page-heading stats-heading"><div><p class="eyebrow">Аналитика мастерской</p><h1>Статистика</h1><p class="date-line">Понимайте, что происходит с заказами, производством и сайтом</p></div><div class="period-switcher" aria-label="Период статистики"><button class="stat-period" data-period="7">7 дней</button><button class="stat-period active" data-period="30">30 дней</button><button class="stat-period" data-period="90">90 дней</button></div></div><div class="stats-section"><div class="section-heading"><div><p class="eyebrow">Мастерская</p><h2>Производственные показатели</h2></div><span class="section-caption">Помогают планировать загрузку и закупки</span></div><div class="stats-grid stats-grid-four"><article class="stat-card"><span>Заказов за период</span><strong id="stat-orders">18</strong><small class="stat-delta">+6 к прошлому периоду</small></article><article class="stat-card"><span>Готово</span><strong id="stat-completed">14</strong><small class="stat-delta">78% заказов завершены</small></article><article class="stat-card"><span>В производстве</span><strong id="stat-production">12</strong><small>свечей на разных этапах</small></article><article class="stat-card accent"><span>Условная выручка</span><strong id="stat-revenue">42 800 ₽</strong><small>ориентир по закрытым заказам</small></article></div><div class="stats-lower"><article class="widget"><div class="widget-head"><div><h3 class="widget-title">Ритм заказов</h3><div class="widget-kicker">Количество заказов по дням</div></div><span class="pill green">стабильный темп</span></div><div class="stats-chart"><i style="height:38%"><b>2</b><span>Пн</span></i><i style="height:54%"><b>3</b><span>Вт</span></i><i style="height:46%"><b>2</b><span>Ср</span></i><i style="height:72%"><b>4</b><span>Чт</span></i><i style="height:62%"><b>3</b><span>Пт</span></i><i style="height:88%"><b>5</b><span>Сб</span></i><i style="height:52%"><b>3</b><span>Вс</span></i></div></article><article class="widget"><div class="widget-head"><div><h3 class="widget-title">Что продаётся</h3><div class="widget-kicker">Заказы по товарам</div></div></div><div class="rank-list"><div><span>Свечи в стекле</span><strong>9</strong></div><div><span>Формовые свечи</span><strong>5</strong></div><div><span>Свечи в гипсе</span><strong>3</strong></div><div><span>Наборы и подписка</span><strong>1</strong></div></div></article></div></div><div class="stats-section"><div class="section-heading"><div><p class="eyebrow">После-пяти.рф</p><h2>Статистика сайта</h2><p class="section-description">Демонстрационные данные: они показывают интерес к сайту и помогают понять, откуда приходят будущие клиенты.</p></div><span class="pill gold">без подключения аналитики</span></div><div class="stats-grid stats-grid-four"><article class="stat-card website-primary"><span>Новые посетители · <em data-period-label>30 дней</em></span><strong id="site-visitors">1 104</strong><small class="stat-delta" id="site-visitors-delta">▲ +43,1% к прошлому периоду</small></article><article class="stat-card"><span>Просмотры страниц · <em data-period-label>30 дней</em></span><strong id="site-views">1 822</strong><small class="stat-delta" id="site-views-delta">▲ +18,5% к прошлому периоду</small></article><article class="stat-card"><span>Обращения с сайта · <em data-period-label>30 дней</em></span><strong id="site-requests">38</strong><small>телефон, почта, Telegram или карта</small></article><article class="stat-card"><span>Конверсия в обращение</span><strong id="site-conversion">3,4%</strong><small>доля посетителей, которые написали или позвонили</small></article></div><div class="stats-lower website-lower"><article class="widget"><div class="widget-head"><div><h3 class="widget-title">Откуда приходят посетители</h3><div class="widget-kicker">Доля трафика за выбранный период</div></div></div><div class="source-list"><div class="source-item"><div><span>Поиск</span><strong>42%</strong></div><div class="source-progress"><i style="width:42%"></i></div></div><div class="source-item"><div><span>VK</span><strong>24%</strong></div><div class="source-progress"><i style="width:24%"></i></div></div><div class="source-item"><div><span>Telegram</span><strong>18%</strong></div><div class="source-progress"><i style="width:18%"></i></div></div><div class="source-item"><div><span>Прямые переходы</span><strong>16%</strong></div><div class="source-progress"><i style="width:16%"></i></div></div></div></article><article class="widget"><div class="widget-head"><div><h3 class="widget-title">Что смотрят</h3><div class="widget-kicker">Самые посещаемые страницы</div></div></div><div class="rank-list page-rank"><div><span>Каталог свечей</span><strong>46%</strong></div><div><span>Свечи в стекле</span><strong>23%</strong></div><div><span>Подписка</span><strong>17%</strong></div><div><span>Контакты и доставка</span><strong>14%</strong></div></div></article></div><div class="website-summary"><div><span>Сегодня</span><strong id="site-today">2 просмотра · 2 посетителя</strong></div><div><span>За всю историю</span><strong id="site-history">1 915 посещений</strong></div><div><span>Обращения</span><strong id="site-requests-summary">38 за период</strong></div></div></div><div class="stats-note"><strong>Зачем это нужно?</strong><span>Статистика мастерской помогает вовремя закупать материалы и видеть загрузку. Статистика сайта показывает, какие страницы интересны посетителям и превращаются ли просмотры в обращения. Пока цифры учебные — позже сюда можно подключить Яндекс Метрику или другую аналитику.</span></div>`);
  const update = (period) => {
    const data = statsPeriods[period];
    document.querySelector('#stat-orders').textContent = data.orders;
    document.querySelector('#stat-completed').textContent = data.completed;
    document.querySelector('#stat-production').textContent = data.production;
    document.querySelector('#stat-revenue').textContent = data.revenue;
    document.querySelector('#site-visitors').textContent = data.visitors;
    document.querySelector('#site-views').textContent = data.views;
    document.querySelector('#site-requests').textContent = data.requests;
    document.querySelector('#site-conversion').textContent = data.conversion;
    document.querySelector('#site-visitors-delta').textContent = `▲ ${data.deltaVisitors} к прошлому периоду`;
    document.querySelector('#site-views-delta').textContent = `▲ ${data.deltaViews} к прошлому периоду`;
    document.querySelectorAll('[data-period-label]').forEach((element) => { element.textContent = data.label; });
    document.querySelector('#site-today').textContent = data.today;
    document.querySelector('#site-history').textContent = data.history;
    document.querySelector('#site-requests-summary').textContent = `${data.requests} за период`;
    document.querySelectorAll('[data-period]').forEach((button) => button.classList.toggle('active', button.dataset.period === String(period)));
  };
  document.querySelectorAll('[data-period]').forEach((button) => button.addEventListener('click', () => update(button.dataset.period)));
  update(30);
}

function socialView() {
  setPage(`<div class="page-heading"><div><p class="eyebrow">Контент и рост</p><h1>Продвижение</h1><p class="date-line">План публикаций и демонстрационная статистика социальных сетей</p></div><button class="primary-button" id="new-content-task">＋ Новая задача</button></div><div class="social-summary"><article><span>Охват за 30 дней</span><strong>18 420</strong><small class="stat-delta">▲ +22% к прошлому периоду</small></article><article><span>Переходы на сайт</span><strong>286</strong><small>из VK, Telegram и коротких видео</small></article><article><span>Заявки из соцсетей</span><strong>17</strong><small>вопросы, заказы и предзаказы</small></article><article class="social-accent"><span>Ближайшая цель</span><strong>2 поста</strong><small>и 1 короткое видео на этой неделе</small></article></div><div class="social-layout"><section class="widget"><div class="widget-head"><div><h2 class="widget-title">Контент-план</h2><div class="widget-kicker">Ближайшие публикации</div></div><span class="pill gold">Сентябрь</span></div><div class="content-plan"><article><time>19<br><small>сент.</small></time><div><strong>VK · пост о свече «Золотой час»</strong><span>Фото, история аромата и ссылка на каталог</span></div><button class="content-done" type="button">Запланировано</button></article><article><time>21<br><small>сент.</small></time><div><strong>Reels / короткое видео · процесс заливки</strong><span>15–20 секунд: воск, аромат, фитиль, готовая свеча</span></div><button class="content-done" type="button">Запланировано</button></article><article><time>23<br><small>сент.</small></time><div><strong>Telegram · подборка осенних ароматов</strong><span>Три свечи для вечера, дома и подарка</span></div><button class="content-done" type="button">Черновик</button></article></div></section><aside class="widget social-checklist"><div class="widget-head"><div><h2 class="widget-title">Сегодня в продвижении</h2><div class="widget-kicker">Небольшие задачи без перегруза</div></div></div><label><input type="checkbox"> Подготовить фото для поста VK</label><label><input type="checkbox"> Написать текст и добавить ссылку на сайт</label><label><input type="checkbox"> Снять 3 коротких фрагмента для видео</label><label><input type="checkbox"> Ответить на сообщения и комментарии</label><p class="social-note">Статистика учебная: позже её можно заменить данными VK, Telegram и рекламного кабинета.</p></aside></div><section class="widget social-performance"><div class="widget-head"><div><h2 class="widget-title">Что сработало за месяц</h2><div class="widget-kicker">Для понимания, какой контент продолжать</div></div></div><div class="social-bars"><div><span>Видео процесса</span><i style="width:88%"></i><strong>8 900 охват</strong></div><div><span>Свечи в интерьере</span><i style="width:66%"></i><strong>5 100 охват</strong></div><div><span>Отзывы клиентов</span><i style="width:48%"></i><strong>2 760 охват</strong></div><div><span>Анонсы коллекций</span><i style="width:39%"></i><strong>1 660 охват</strong></div></div></section>`);
  document.querySelector('#new-content-task').addEventListener('click', () => toast('Новую контент-задачу можно добавить в календарь мастерской.'));
  document.querySelectorAll('.content-done').forEach((button) => button.addEventListener('click', () => {
    button.textContent = button.textContent === 'Опубликовано' ? 'Запланировано' : 'Опубликовано';
    button.classList.toggle('is-done', button.textContent === 'Опубликовано');
    toast(button.textContent === 'Опубликовано' ? 'Публикация отмечена как выполненная' : 'Публикация возвращена в план');
  }));
}

function simpleView(title, eyebrow, content) { setPage(`<div class="page-heading"><div><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p class="date-line">Раздел мастерской</p></div></div><div class="widget">${content}</div>`); }

function setView(view) {
  document.querySelectorAll('.nav-item').forEach((item) => item.classList.toggle('active', item.dataset.view === view));
  const active = document.querySelector(`[data-view="${view}"]`);
  document.querySelector('#view-label').textContent = active?.textContent.trim() || view;
  const views = { today, orders: ordersView, production: productionView, inventory: inventoryView, purchases: purchasesView, calendar: calendarView, stats: statsView, social: socialView };
  views[view]();
}

const mobileMenu = document.querySelector('.mobile-menu');
const sidebar = document.querySelector('.sidebar');
const mobileOverlay = document.querySelector('.mobile-overlay');
const closeMobileMenu = () => { sidebar.classList.remove('open'); mobileOverlay.classList.remove('open'); mobileMenu.setAttribute('aria-expanded', 'false'); };
const toggleMobileMenu = () => { const open = sidebar.classList.toggle('open'); mobileOverlay.classList.toggle('open', open); mobileMenu.setAttribute('aria-expanded', String(open)); };
document.querySelectorAll('.nav-item').forEach((button) => button.addEventListener('click', () => { setView(button.dataset.view); closeMobileMenu(); }));
mobileMenu.addEventListener('click', toggleMobileMenu);
mobileOverlay.addEventListener('click', closeMobileMenu);
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMobileMenu(); });
setView('today');
