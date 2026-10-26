export class DynamicIframeManager {
  /**
   * @param {string} containerSelector - The CSS selector of the parent element where the iframe will be appended.
   */
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    this.iframe = null;
    
    if (!this.container) {
      throw new Error(`Container element "${containerSelector}" not found.`);
    }
  }

  /**
   * Creates the iframe element and appends it to the DOM
   * @private
   */
  #createIframeElement() {
    // Clean up any previously created iframe instance first
    if (this.iframe) {
      this.iframe.remove();
    }

    this.iframe = document.createElement('iframe');
    this.iframe.style.width = '100%';
    this.iframe.style.height = '500px'; // Set your desired styling
    this.container.appendChild(this.iframe);
  }

  /**
   * Loads a dynamic URL into the iframe and returns a promise when loading completes.
   * @param {string} url - The URL to load inside the iframe.
   * @returns {Promise<Document>} The iframe's internal document context.
   */
  loadUrl(url) {
    this.#createIframeElement();

    return new Promise((resolve, reject) => {
      // Setup the event listener before setting the src to avoid missing the event
      this.iframe.onload = () => {
        try {
          // Get access to the internal document
          const iframeDoc = this.iframe.contentDocument || this.iframe.contentWindow.document;
          resolve(iframeDoc);
        } catch (error) {
          // Triggered if the dynamic URL violates the Same-Origin Policy
          reject(new Error("Security Error: Cannot access cross-origin iframe elements."));
        }
      };

      this.iframe.onerror = (err) => reject(err);
      
      // Inject the dynamic URL
      this.iframe.src = url;
    });
  }

  /**
   * Safe helper method to find an element inside the loaded iframe
   * @param {string} selector - The CSS selector of the target element inside the iframe.
   * @returns {Element|null} The target element or null.
   */
  getElement(selector) {
    if (!this.iframe) return null;
    try {
      const iframeDoc = this.iframe.contentDocument || this.iframe.contentWindow.document;
      return iframeDoc.querySelector(selector);
    } catch {
      return null;
    }
  }
}
