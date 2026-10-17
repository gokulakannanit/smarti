import { DOMUtils } from './dom-utils.js';
export class BaseComponent extends HTMLElement {
    constructor(moduleUrl) {
        super();
        // Create an isolated Shadow DOM
        this.shadow = this.attachShadow({ mode: 'open' });
        this.rawTemplateText = '';
        this.name = DOMUtils.getFileName(this.constructor.name, moduleUrl);
    }

    // Automatically runs when the tag loads in the browser
    async connectedCallback() {
        if (this.name) {
            try {
                // 1. Fetch the HTML content from your app.html file
                const response = await fetch(this.name);
                this.rawTemplateText = await response.text();
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
        return ['data'];
    }


    // 2. This runs automatically whenever the HTML 'data' attribute changes
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'data' && newValue) {
            try {
                // Parse the incoming JSON string string back into a real JS Array/Object
                this._data = JSON.parse(newValue);
                this.render();
            } catch (e) {
                console.error("Invalid JSON data string passed", e);
            }
        }
    }

    replaceLoop(processedHTML) {
        // 2. Ask the child subclass for its generated array loops text
    const listHTML = this.getDynamicContent ? this.getDynamicContent() : '';

    // 3. Perform string-token replacements at the parent level centrally
    return processedHTML.replace('{{_REPLACE_LOOP_}}', listHTML);

    }

    replaceData(processedHTML) {
        // Loop through each key in your data object dynamically
        this._data && Object.keys(this._data).forEach(key => {
            // Creates a dynamic regular expression, e.g., /{{_data\.icon}}/g
            const token = new RegExp(`{{_data\\.${key}}}`, 'g');

            // Replace all matching tokens in the template string with the object values
            processedHTML = processedHTML.replace(token, this._data[key]);
        });
        return processedHTML;
    }

    render() {
        // Safety check to ensure the external text payload has fully downloaded
        if (!this.rawTemplateText) return;

        // Clone the pristine text string to execute search-and-replace processes
        let processedHTML = this.rawTemplateText;

        processedHTML = this.replaceLoop(processedHTML);

        processedHTML = this.replaceData(processedHTML);

        // Push the fully converted markup into your Shadow DOM node
        this.shadow.innerHTML = processedHTML;
    }
}