import { BaseComponent } from "../../baseComponent.js";
import { DOMUtils } from "../../dom-utils.js";

export class AppDateComponent extends BaseComponent {
  constructor() {
    super(import.meta.url);
  }
  // Use this instead of connectedCallback()
  onInit() {
    const wrapper = DOMUtils.shadowQuery(this, "#picker-wrapper");
    const nativeEngine = DOMUtils.shadowQuery(this, "#native-date-engine");
    const textDisplay = DOMUtils.shadowQuery(this, "#date-text-view");

    // Trigger internal OS/Browser calendar modal panel interface
    wrapper.addEventListener("click", () => {
      if (typeof nativeEngine.showPicker === "function") {
        nativeEngine.showPicker();
      }
    });

    // Formatting listener callback to map value structure to DD-MM-YYYY
    nativeEngine.addEventListener("change", (e) => {
      const dateObj = new Date(e.target.value);
      if (isNaN(dateObj.getTime())) return;

      const dd = String(dateObj.getDate()).padStart(2, "0");
      const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
      const yyyy = dateObj.getFullYear();

      textDisplay.value = `${dd}-${mm}-${yyyy}`;
    });
  }
}
DOMUtils.define(AppDateComponent);
