import { BaseComponent } from "../../baseComponent.js";
import { DOMUtils } from "../../dom-utils.js";
import { StringUtils } from "../../utils/string-util.js";

class TabListComponent extends BaseComponent {
    constructor() {
        super(import.meta.url);
        this._items = [
            { value: "dashboard" },
            { value: "devices" }
        ];
        this._activeTabValue = null;
    }

    addClickListener(link, tabItems) {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Stop native link anchor jumps

            const selectedValue = e.currentTarget.getAttribute('data-value');
            if (selectedValue === this._activeTabValue) return; // Skip if already selected

            // 1. Visually swap the active text class states across all nodes instantly
            tabItems.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // 2. Persist the updated internal state configuration property
            this._activeTabValue = selectedValue;
      });
    }

    initiateListener() {
        const tabItems = this.shadow.querySelectorAll('.menu-link');
        console.log('tabItems', tabItems);
        tabItems.forEach(link => this.addClickListener(link, tabItems));   
    }

     /**
   * Overrides or hooks into the BaseComponent's lifecycle system.
   * This handles ONLY the JavaScript loop part.
   * @returns {string} Plain HTML string snippet
   */
    getDynamicContent() {
        
        // Return just the loop strings inside JS literals
        return this._items.map((item, index) => {
            this._activeTabValue = this._activeTabValue || this._items[0].value; // Default to first item if not set
            const isActive = item.value === this._activeTabValue;
            return `
            <li>
                <a href="#${item.value}" 
                class="menu-link ${isActive ? 'active' : ''}" 
                data-value="${item.value}">
                ${StringUtils.capitalizeSentence(item.value)}
                </a>
            </li>`;
        }).join('');
    }

    // Use this instead of connectedCallback()
    onInit() {
        this.initiateListener()
    }
}
DOMUtils.define(TabListComponent);
