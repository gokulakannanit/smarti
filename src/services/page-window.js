export class PageWindowManager {
  
  constructor() {
    this.openedWindow = null;
  }

  /**
   * Opens a dynamic URL in a new tab and attempts to return its document context upon loading.
   * @param {string} url - The URL to open.
   * @returns {Promise<Document|Window>} Resolves with the window document if same-origin, or the window reference if cross-origin.
   */
  loadUrl(url) {
    // 1. Clean up or close any previously opened window tracking instance
    if (this.openedWindow && !this.openedWindow.closed) {
      this.openedWindow.focus();
    }

    // 2. Fire the window open action using your target security flags
    this.openedWindow = window.open(url, '_blank', 'opener');

    return new Promise((resolve, reject) => {
      if (!this.openedWindow) {
        return reject(new Error("Popup Blocked: Please allow popups for this website."));
      }

      // 3. Set up an interval to poll the loading and connection status of the tab
      const pollTimer = setInterval(() => {
        // If the user manually closes the tab before completion, reject the promise safely
        if (this.openedWindow.closed) {
          clearInterval(pollTimer);
          return reject(new Error("Window Closed: The user closed the tab before it finished loading."));
        }

        try {
          // Check if the page has reached a ready or complete interactive DOM state
          const currentDoc = this.openedWindow.document;
          if (currentDoc && currentDoc.readyState === 'complete') {
            clearInterval(pollTimer);
            resolve(currentDoc);
          }
        } catch (error) {
          // IMPORTANT: If loading a cross-origin site like 'https://tnebltd.org', 
          // the browser will instantly block cross-tab document access here.
          clearInterval(pollTimer);
          
          // Instead of failing completely, we resolve with the window reference so your app can still track it.
          resolve(this.openedWindow);
        }
      }, 200); // Polls every 200ms
    });
  }

  /**
   * Safe helper method to find an element inside the opened window context (Same-Origin Only).
   * @param {string} selector - The CSS selector of the target element.
   * @returns {Element|null} The target element or null.
   */
  getElement(selector) {
    if (!this.openedWindow || this.openedWindow.closed) return null;
    try {
      return this.openedWindow.document.querySelector(selector);
    } catch {
      // Safely returns null if a security rule blocks reading the elements
      return null;
    }
  }
}
