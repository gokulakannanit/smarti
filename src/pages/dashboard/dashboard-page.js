import { BaseComponent } from "../../baseComponent.js";
import { DOMUtils } from "../../dom-utils.js";

export class DashboardPage extends BaseComponent {
    constructor() {
        super(import.meta.url);
    }
    // Use this instead of connectedCallback()
    onInit() {
    }
}

(!customElements.get('dashboard-page')) & DOMUtils.define(DashboardPage);