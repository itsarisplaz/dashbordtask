import { ToDoWidget } from './ToDoWidget.js';
import { WeatherWidget } from './WeatherWidget.js';
import { QuoteWidget } from './QuoteWidget.js';
import { DeliveryWidget } from './DeliveryWidget.js';

export class Dashboard {
  constructor({ root }) {
    this.root = root;
    this.widgets = new Map();
    this.widgetTypes = { todo: ToDoWidget, weather: WeatherWidget, quote: QuoteWidget, delivery: DeliveryWidget };
  }

  addWidget(type, slot) {
    const Widget = this.widgetTypes[type];
    if (!Widget) return null;
    const widget = new Widget({ id: `${type}-${Date.now()}-${this.widgets.size}` });
    widget.onClose = (id) => this.removeWidget(id);
    (slot || this.root).append(widget.render());
    this.widgets.set(widget.id, widget);
    return widget;
  }

  removeWidget(id) {
    const widget = this.widgets.get(id);
    if (!widget) return;
    widget.destroy();
    this.widgets.delete(id);
  }

  clear() {
    [...this.widgets.keys()].forEach((id) => this.removeWidget(id));
  }
}
