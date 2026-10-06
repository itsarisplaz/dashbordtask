import { UIComponent } from './UIComponent.js';

export class ToDoWidget extends UIComponent {
  constructor(config = {}) {
    super({ title: 'Задачи на сегодня', id: 'todo-widget', ...config });
    this.tasks = [
      { id: crypto.randomUUID(), text: 'Проверить заказ «Золотой час»', done: false },
      { id: crypto.randomUUID(), text: 'Заказать банки 160 мл', done: false },
      { id: crypto.randomUUID(), text: 'Упаковать заказ #103', done: true },
    ];
  }

  render() {
    const element = this.createBase();
    element.querySelector('.widget-head div').insertAdjacentHTML('beforeend', '<div class="widget-kicker">На сегодня</div>');
    const form = document.createElement('form');
    form.className = 'todo-form';
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Новая задача';
    input.maxLength = 120;
    input.setAttribute('aria-label', 'Текст новой задачи');
    const add = document.createElement('button');
    add.className = 'mini-link';
    add.type = 'submit';
    add.textContent = '＋ Добавить';
    form.append(input, add);
    this.list = document.createElement('div');
    this.list.className = 'task-list';
    element.append(form, this.list);
    this.on(form, 'submit', (event) => {
      event.preventDefault();
      this.addTask(input.value);
      input.value = '';
      input.focus();
    });
    this.on(this.list, 'change', (event) => {
      const check = event.target.closest('[data-task-check]');
      if (!check) return;
      const task = this.tasks.find((item) => item.id === check.dataset.taskCheck);
      if (task) { task.done = check.checked; check.closest('.task-row')?.classList.toggle('done', task.done); }
    });
    this.on(this.list, 'click', (event) => {
      const remove = event.target.closest('[data-task-remove]');
      if (!remove) return;
      this.tasks = this.tasks.filter((item) => item.id !== remove.dataset.taskRemove);
      this.draw();
    });
    this.draw();
    return element;
  }

  draw() {
    this.list.replaceChildren(...this.tasks.map((task) => {
      const row = document.createElement('div');
      row.className = `task-row ${task.done ? 'done' : ''}`;
      const check = document.createElement('input');
      check.type = 'checkbox';
      check.checked = task.done;
      check.dataset.taskCheck = task.id;
      check.setAttribute('aria-label', `Отметить задачу «${task.text}»`);
      const text = document.createElement('span');
      text.textContent = task.text;
      const remove = document.createElement('button');
      remove.className = 'task-remove';
      remove.type = 'button';
      remove.dataset.taskRemove = task.id;
      remove.textContent = '×';
      remove.setAttribute('aria-label', `Удалить задачу «${task.text}»`);
      row.append(check, text, remove);
      return row;
    }));
  }

  addTask(value) {
    const text = value?.trim();
    if (!text?.trim()) return;
    this.tasks.unshift({ id: crypto.randomUUID(), text, done: false });
    this.draw();
  }
}
