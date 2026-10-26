import { BaseComponent } from "../../baseComponent.js";
import { DOMUtils } from "../../dom-utils.js";

export class AppInputComponent extends BaseComponent {
  constructor() {
    super(import.meta.url);
  }
  // Use this instead of connectedCallback()
  onInit() {
    this.inputElement = this.shadow.querySelector("input");
    this.errorElement = this.shadow.querySelector(".error-msg");

    // Bind operational event interactions
    this.inputElement.addEventListener("input", () => this.validate());
    this.inputElement.addEventListener("blur", () => this.validate());
  }

  getValidatorRule(type) {
    const inputValidators = {
      phone: { min: 10, max: 10, regex: /^(?:\+91[-\s]?)?[6789]\d{9}$/ },
      eb_consumer_no: { min: 9, max: 17, regex: /^\\d{9,12}$/ },
      default: { min: 1 },
    };
    const rules = inputValidators[type] || inputValidators.default;
    return rules;
  }
  /**
   * Evaluates constraints and updates the domestic paper-like interface states.
   * @returns {boolean} Element validation integrity status flag
   */
  validate() {
    const value = this.inputElement.value;
    const type = this.getAttribute("type");
    const {
      min: minAttr,
      max: maxAttr,
      regex: regexAttr,
    } = this.getValidatorRule(type);

    // Reset view matrix properties
    this.errorElement.textContent = "";

    DOMUtils.removeClassList([
      { element: this.inputElement, className: "invalid" },
      { element: this.errorElement, className: "visible" },
    ]);

    // 1. Minimum Length Validation
    if (minAttr && value.length < parseInt(minAttr, 10)) {
      this.invalidate(`Minimum character length required is ${minAttr}.`);
      return false;
    }

    // 2. Maximum Length Validation
    if (maxAttr && value.length > parseInt(maxAttr, 10)) {
      this.invalidate(`Maximum allowed character capacity is ${maxAttr}.`);
      return false;
    }

    // 3. Regular Expression Pattern Validation
    if (regexAttr) {
      try {
        const regex = new RegExp(regexAttr);
        if (!regex.test(value) && value.length > 0) {
          this.invalidate(
            this.getAttribute("error-message") ||
              "Invalid input formatting pattern.",
          );
          return false;
        }
      } catch (e) {
        console.error("Invalid regular expression string pattern defined:", e);
      }
    }

    return true;
  }

  invalidate(msg) {
    DOMUtils.addClass(this.inputElement, "invalid");
    this.errorElement.textContent = msg;
    DOMUtils.addClass(this.errorElement, "visible");
  }

  // Getter/Setter API options to interact directly over DOM attributes programmatically
  get value() {
    return this.inputElement ? this.inputElement.value : "";
  }
  set value(val) {
    if (this.inputElement) {
      this.inputElement.value = val;
      this.validate();
    }
  }
  get isValid() {
    return this.validate();
  }
}
DOMUtils.define(AppInputComponent);
