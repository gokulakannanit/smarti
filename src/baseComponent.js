import { DOMUtils } from "./dom-utils.js";
import { StringUtils } from "./utils/string-util.js";
export class BaseComponent extends HTMLElement {
  constructor(moduleUrl) {
    super();
    // Create an isolated Shadow DOM
    this.shadow = this.attachShadow({ mode: "open" });
    this.rawTemplateText = "";
    this.name = DOMUtils.getFileName(this.constructor.name, moduleUrl);
  }

  // Automatically runs when the tag loads in the browser
  async connectedCallback() {
    if (this.name) {
      try {
        // 1. Fetch the HTML content from your app.html file
        const response = await fetch(this.name);
        this.rawTemplateText = await response.text();
        this.setupAttributeObserver();

        this.render();

        if (this.onInit) {
          this.onInit();
        }
      } catch (error) {
        console.error("Failed to load app.html template:", error);
      }
    }
  }

  // 1. Tell the browser to explicitly watch for changes on the 'data' attribute
  static get observedAttributes() {
    return ["data"];
  }

  // 2. This runs automatically whenever the HTML 'data' attribute changes
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "data" && newValue) {
      try {
        // Parse the incoming JSON string string back into a real JS Array/Object
        this._data = JSON.parse(newValue);
        this.render();
      } catch (e) {
        console.error("Invalid JSON data string passed", e);
      }
    }
  }

  setupAttributeObserver() {
    // Use MutationObserver to look for dynamic attribute modifications without writing static getters
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes") {
          this.render(); // Re-render instantly if a variable shifts state
        }
      });
    });

    observer.observe(this, { attributes: true });
  }

  replaceLoop(processedHTML) {
    // 2. Ask the child subclass for its generated array loops text
    const listHTML = this.getDynamicContent ? this.getDynamicContent() : "";

    // 3. Perform string-token replacements at the parent level centrally
    return processedHTML.replace("{{_REPLACE_LOOP_}}", listHTML);
  }

  iterateReplaceExp(processedHTML, obj, tokenRegex) {
    if (!obj) return processedHTML;
    obj &&
      Object.entries(obj).forEach(([key, value]) => {
        processedHTML = processedHTML.replace(
          tokenRegex(key),
          StringUtils.sanitizeString(value),
        );
      });
    return processedHTML;
  }

  replaceData(processedHTML) {
    const regex = (key) => new RegExp(`{{_data\\.${key}}}`, "g");
    return this.iterateReplaceExp(processedHTML, this._data, regex);
  }

  replaceConditonalClass(processedHTML) {
    const regex = (key) =>  new RegExp(`{{_class\\.${key}}}`, "g");
    console.log(regex);
    return this.iterateReplaceExp(processedHTML, this.conditionalClass, regex);
  }

  replaceLabel(processedHTML) {
    const myObject = this.attributes["_label"]
      ? JSON.parse(this.attributes["_label"].value)
      : null;

    const regex = (key) => new RegExp(`\\$\\{${key}\\}`, "g");

    // Loop through keys and values simultaneously
    return this.iterateReplaceExp(processedHTML, myObject, regex);
  }

  render() {
    // Safety check to ensure the external text payload has fully downloaded
    if (!this.rawTemplateText) return;

    this.onBeforeRender && this.onBeforeRender();

    // Clone the pristine text string to execute search-and-replace processes
    let processedHTML = this.rawTemplateText;


    // Push the fully converted markup into your Shadow DOM node
    this.shadow.innerHTML = this.replaceConditonalClass(this.replaceData(this.replaceLabel(this.replaceLoop(processedHTML))));
  }
}
