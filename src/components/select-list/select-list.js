import { BaseComponent } from "../../baseComponent.js";
import { DOMUtils } from "../../dom-utils.js";

class SelectListComponent extends BaseComponent {
    constructor() {
        super(import.meta.url);
        this._items = [];
        this._selectedIndex = 0;
    }

    set listData(arrayData) {
        if (!Array.isArray(arrayData)) return;
        this._items = arrayData;
        this._selectedIndex = 0;
        this.render();
    }
    get listData() { return this._items; }

    // Use this instead of connectedCallback()
    onInit() {
    }

    /**
   * Overrides or hooks into the BaseComponent's lifecycle system.
   * This handles ONLY the JavaScript loop part.
   * @returns {string} Plain HTML string snippet
   */
    getDynamicContent() {
        const isSelectMode = this.classList.contains('mode-select');
        // Return just the loop strings inside JS literals
        return this._items.map((item, index) => {
            const isActive = index === this._selectedIndex;
            return `
        <li class="list-item ${isSelectMode && isActive ? 'active-option' : ''}" data-value="${item.value}">
          <div class="item-left-block">
            <span class="material-symbols-outlined item-icon ${item.iconColor}">${item.icon}</span>
            <div class="item-text-stack">
              <span class="text-title">${item.title}</span>
              <span class="text-subtitle">${item.subtitle}</span>
            </div>
          </div>
          <span class="material-symbols-outlined action-indicator">
            ${isSelectMode ? 'check' : 'chevron_right'}
          </span>
        </li>
      `;
        }).join('');
    }
}
DOMUtils.define(SelectListComponent);
