class GlobalPopup extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --popup-bg: #ffffff;
          --backdrop-bg: rgba(0, 0, 0, 0.5);
          --max-width-web: 500px;
          --border-radius: 12px;
        }

        dialog {
          border: none;
          background: var(--popup-bg);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          padding: 20px;
          width: 90%;
          box-sizing: border-box;
          outline: none;
        }

        dialog::backdrop {
          background: var(--backdrop-bg);
        }

        /* --- Responsive View Switch --- */
        /* Web View Layout (Centered modal) */
        @media (min-width: 768px) {
          dialog {
            max-width: var(--max-width-web);
            border-radius: var(--border-radius);
            margin: auto;
          }
        }

        /* Mobile View Layout (Bottom sheet drawer) */
        @media (max-width: 767px) {
          dialog {
            max-width: 100%;
            margin: auto bottom 0 bottom; /* Anchors it to the bottom */
            border-radius: var(--border-radius) var(--border-radius) 0 0;
            transform: translateY(100%);
            transition: transform 0.3s ease-out;
          }
          dialog[open] {
            transform: translateY(0);
          }
        }

        .popup-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0;
          line-height: 1;
        }
      </style>

      <dialog id="popup-dialog">
        <div class="popup-header">
          <h3 id="popup-title"></h3>
          <button class="close-btn" id="close-btn">&times;</button>
        </div>
        <div id="popup-content"></div>
      </dialog>
    `;

    this.dialog = this.shadowRoot.getElementById('popup-dialog');
    this.titleEl = this.shadowRoot.getElementById('popup-title');
    this.contentEl = this.shadowRoot.getElementById('popup-content');
    
    this.shadowRoot.getElementById('close-btn').addEventListener('click', () => this.close());
    this.dialog.addEventListener('click', (e) => {
      if (e.target === this.dialog) this.close(); // Close on backdrop click
    });
  }

  // API exposed globally to show the popup
  open({ title = '', content = '' }) {
    this.titleEl.textContent = title;
    
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
  }
}

// Define the custom element
customElements.define('global-popup', GlobalPopup);

// Global wrapper function for direct utility invocation
window.showGlobalPopup = function(options) {
  let popupInstance = document.querySelector('global-popup');
  
  // Lazily inject onto page if it doesn't already exist
  if (!popupInstance) {
    popupInstance = document.createElement('global-popup');
    document.body.appendChild(popupInstance);
  }
  
  popupInstance.open(options);
};
