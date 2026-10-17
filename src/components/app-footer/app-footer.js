import { BaseComponent } from "../../baseComponent.js";
import { DOMUtils } from "../../dom-utils.js";

class AppFooterComponent extends BaseComponent {
    constructor() {
        super(import.meta.url);
    }
    // Use this instead of connectedCallback()
    onInit() {
    }
}
DOMUtils.define(AppFooterComponent);
