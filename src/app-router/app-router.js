import { BaseComponent } from "../baseComponent.js";
import { DOMUtils } from "../dom-utils.js";
import { appBus, EventBus } from "../services/event-bus.js";
import { StringUtils } from "../utils/string-util.js";

class AppRouter extends HTMLElement {
    constructor() {
        super();
        this.containerSelector = this.getAttribute('target') || '#main-content';
        this.currentPageInstance = null;

        // Map URL paths to your Custom Element tag names
        this.routes = {
            '/': 'dashboard-page',
            '/portfolio': 'dashboard-page',
            '/index.html': 'home-page',
            '/about': 'about-page',
            '/about.html': 'about-page',
            '/contact': 'contact-page',
            '/contact.html': 'contact-page'
        };
    }

    handleGlobalNavigation(event) {
        // 1. Get the full event path (works inside Shadow DOM trees)
        const path = event.composedPath();

        // 2. Scan the path to find if an anchor <a> tag was clicked
        const link = path.find(element => element.tagName === 'A');

        // 3. Robust guard conditions (Ignore external links, blank targets, or new tab modifiers)
        if (
            !link ||
            !link.href ||
            link.origin !== window.location.origin ||
            link.target === '_blank' ||
            link.hasAttribute('download') ||
            event.button !== 0 ||
            event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
        ) {
            return; // Pass through to standard browser handling
        }

        // 4. BLOCK THE REFRESH AT THE SOURCE
        event.preventDefault();

        // 5. Update the browser URL bar silently without server round-trip
        history.pushState(null, '', link.href);

        // 6. Emit using the standard event key configuration
        appBus.emit(EventBus.Events.ROUTE_CHANGE, { path: link.pathname });

    } // Using capture phase ensures we grab it before it bubbles up


    blockWindowNavigation() {
        // Listen for local links
        window.addEventListener('click', this.handleGlobalNavigation, { capture: true });

        // Listen for back/forward browser navigation
        window.addEventListener('popstate', () => {
            appBus.emit(EventBus.Events.ROUTE_CHANGE, { path: window.location.pathname });
        });
    }

    connectedCallback() {
        this.blockWindowNavigation();

        appBus.on(EventBus.Events.ROUTE_CHANGE, (e) => this.loadPage(e.detail.path));
        appBus.emit(EventBus.Events.ROUTE_CHANGE, { path: window.location.pathname });

    }

    async loadPage(path) {
        const targetContainer = this.querySelector(this.containerSelector);
        const innerHTML = DOMUtils.innerHTML;
        console.log(targetContainer, 'targetContainer');
        if (!targetContainer) return;

        // Get the element tag name for the route, fallback to home-page
        const elementTag = this.routes[path] || 'home-page';

        console.log(`Loading page for path: ${path}, using element: ${elementTag}`);

        // 3. Show a loading state inside the specified target container
        !this.currentPageInstance && innerHTML(targetContainer, `<div>Loading page...</div>`);

        // 4. Dynamically import the module for the page
        try {
            const url = `../pages/${elementTag.replace('-page', '')}/${elementTag}.js`;
            const exportName = StringUtils.kebabToPascal(elementTag) // Convert to PascalCase

            // 4. Dynamically import the ES module file
            const module = await import(url);
            const ComponentClass = module[exportName];

            if (!ComponentClass) {
                throw new Error(`Export "${exportName}" not found in file: ${url}`);
            }

            // 5. Instantiate the component class
            let element = new ComponentClass();

            if (!ComponentClass) {
                throw new Error(`Export "${exportName}" not found in ${url}`);
            }

            // 2. COMPARE: Check if the current instance is the exact same Class type
            if (this.currentPageInstance && this.currentPageInstance.constructor === ComponentClass) {
                console.log("Same component type already loaded. Skipping mount.");
                return;
            }

            // 3. CLEANUP: If a different page was loaded, run clean up hooks if they exist
            if (this.currentPageInstance) {
                if (typeof this.currentPageInstance.beforeDestroy === 'function') {
                    this.currentPageInstance.beforeDestroy();
                }
                // If it's a web component in the DOM, removing it triggers disconnectedCallback natively
            }

            if (typeof ComponentClass.prototype.connectedCallback === 'function' || ComponentClass.customElement) {
                const tagName = ComponentClass.customElement || ComponentClass.name.replace(/([a-z0-9])([A-Z])/g, '\$1-\$2').toLowerCase();
                element = document.createElement(tagName);
            }

            // 6. Clear out the target container and mount the new view
            innerHTML(targetContainer, '');
            this.currentPageInstance = element;
            targetContainer.appendChild(element);

        } catch (error) {
            innerHTML(targetContainer, `<div style="color: red;">Failed to load view: ${error.message}</div>`);
            console.error(error);
        }

        // Optional: Update document title based on standard patterns
        const pageName = elementTag.replace('-page', '');
        document.title = pageName.charAt(0).toUpperCase() + pageName.slice(1);
    }
}

customElements.define('app-router', AppRouter);
