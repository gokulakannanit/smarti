import { BaseComponent } from "../../baseComponent.js";
import { DOMUtils } from "../../dom-utils.js";
import { appBus, EventBus } from "../../services/event-bus.js";

class GlobalDialogComponent extends BaseComponent {
  constructor() {
    super(import.meta.url);
  }
  // Use this instead of connectedCallback()
  onInit() {
    this.dialog = this.shadowRoot.getElementById("popup-dialog");
    this.titleEl = this.shadowRoot.getElementById("popup-title");
    this.contentEl = this.shadowRoot.getElementById("popup-content");

    this.shadowRoot
      .getElementById("close-btn")
      .addEventListener("click", () => this.close());

    this.dialog.addEventListener("click", (e) => (e.target === this.dialog) && this.close()); // Close on backdrop click
    this._popupOpenHandler = (e) => this.open(e);
    appBus.on(EventBus.Events.OPEN_POPUP, this._popupOpenHandler);
  }

  open(payload) {
    const {title, content} = payload?.detail;
    
    appBus.off(EventBus.Events.OPEN_POPUP, this._popupOpenHandler);            
    
    if (title && title != '') {
      this.titleEl.textContent = title; // Use textContent for plain text safety
      DOMUtils.removeClass(this.dialog, 'no-title');
    } else {
      DOMUtils.addClass(this.dialog, 'no-title');
    }   
    // Accepts both a raw string or HTML elements/components
    if (typeof content === 'string') {
      this.contentEl.innerHTML = content;
    } else {
      this.contentEl.innerHTML = '';
      this.contentEl.appendChild(content);
    }
    this.dialog.showModal(); 
  }

  close() {
    this.dialog.close();
    appBus.on(EventBus.Events.OPEN_POPUP, this._popupOpenHandler);
  }
  disconnectedCallback() {
    appBus.off(EventBus.Events.OPEN_POPUP, this._popupOpenHandler);
  }
}
DOMUtils.define(GlobalDialogComponent);
