import { BaseComponent } from "../../baseComponent.js";
import { DOMUtils } from "../../dom-utils.js";

export class AppDigitInputComponent extends BaseComponent {
  constructor() {
    super(import.meta.url);
  }
  // Use this instead of connectedCallback()
  onInit() {
    const { maxBoxes, initialCount } = JSON.parse(this.getAttribute("data"));
    this.initializeFields(initialCount, maxBoxes);
    this.refreshInputCache();
    this.initEvents();
  }

  initializeFields(initialCount, maxBoxes) {
    this.container = DOMUtils.shadowQuery(this, "#digitContainer");
    this.errorWrapper = DOMUtils.shadowQuery(this, "#errorContainer");
    this.errorText = DOMUtils.shadowQuery(this, "#errorText");

    this.initialCount = initialCount || 4;
    this.maxBoxes = maxBoxes || 7;
    this.minValue = 0;
  }

  refreshInputCache() {
    const digitInput = DOMUtils.shadowQuery(this, ".digit-input", true);
    this.inputs = [...digitInput];
  }

  initEvents() {
    this.container.addEventListener("input", (e) => this.handleInput(e));
    this.container.addEventListener("keydown", (e) => this.handleKeyDown(e));
    this.container.addEventListener("paste", (e) => this.handlePaste(e));
  }

  handleInput(e) {
    const input = e.target;
    this.setError('');

    input.value = input.value.replace(/[^0-9]/g, "");
    const index = this.inputs.indexOf(input);

    if (input.value) {
      if (
        index === this.inputs.length - 1 &&
        this.inputs.length < this.maxBoxes
      ) {
        this.expandOneMoreBox();
      }

      if (index < this.inputs.length - 1) {
        this.inputs[index + 1].focus();
      }
    }

    this.validate();
  }

  handleKeyDown(e) {
    const input = e.target;
    const index = this.inputs.indexOf(input);

    if (e.key === "Backspace" && !input.value) {
      if (index === 4 && this.inputs.length === this.maxBoxes) {
        this.collapseExtraBox();
        this.inputs[this.inputs.length - 1].focus();
      } else if (index > 0) {
        this.inputs[index - 1].focus();
      }
    }
  }

  handlePaste(e) {
    e.preventDefault();
    this.setError('');
    
    const pasteData = (e.clipboardData || window.clipboardData).getData("text");
    const digits = pasteData.replace(/[^0-9]/g, "").split("");

    if (
      digits.length >= this.initialCount &&
      this.inputs.length < this.maxBoxes
    ) {
      this.expandOneMoreBox();
    }

    digits.slice(0, this.maxBoxes).forEach((digit, idx) => {
      if (this.inputs[idx]) this.inputs[idx].value = digit;
    });

    const focusTarget = Math.min(digits.length, this.inputs.length - 1);
    if (this.inputs[focusTarget]) this.inputs[focusTarget].focus();

    this.validate();
  }

  expandOneMoreBox() {
    if (this.inputs.length >= this.maxBoxes) return;

    const newBox = document.createElement("input");
    newBox.type = "text";
    newBox.className = "digit-input";
    newBox.maxLength = 1;
    newBox.setAttribute("inputmode", "numeric");

    this.container.appendChild(newBox);
    this.container.classList.add("expanded");
    this.refreshInputCache();
  }

  collapseExtraBox() {
    if (this.inputs.length <= this.initialCount) return;

    const lastBox = this.container.lastElementChild;
    this.container.removeChild(lastBox);
    this.container.classList.remove("expanded");
    this.refreshInputCache();
  }

  get value() {
    return this.inputs.map((input) => input.value).join("");
  }

  setError(message) {
    const elementListErrorClass = [
      { element: this.errorWrapper, className: "show-error" },
      { element: this.container, className: "has-error" },
    ]
    DOMUtils.removeClassList(elementListErrorClass);

    this.errorText.innerText = (this.error) ? message : '';
    if(this.error) DOMUtils.addClassList(elementListErrorClass);
  }

  validate() {
    this.error = false;
    let errorMsg = '';
    if (this.value.length >= this.initialCount) {
      const currentStringValue = this.value;
      if(currentStringValue <= this.minValue) {
        this.error = true;
        errorMsg = `Minimum Value should be more than ${this.minValue}`;
      }            
      this.onComplete && this.onComplete(this, currentStringValue);
    }
    this.setError(errorMsg);
  }
}
DOMUtils.define(AppDigitInputComponent);
