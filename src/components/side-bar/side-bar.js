import { BaseComponent } from "../../baseComponent.js";
import { DOMUtils } from "../../dom-utils.js";

class SideBarComponent extends BaseComponent {
    constructor() {
        super(import.meta.url);
    }
    // Use this instead of connectedCallback()
    onInit() {
        // 1. Set Menu Toggle Button Click Event
        this.setMenuToggleEvent();
    }

    meuToggleClickHandler() {
        const menuToggle = DOMUtils.shadowQuery(this, '.menu-toggle');
        const mobileSidebar = DOMUtils.shadowQuery(this, '.mobile-sidebar');
        const overlay = DOMUtils.shadowQuery(this, '.sidebar-overlay');
        DOMUtils.toggleClassList([
            { element: menuToggle, className: 'is-active' },
            { element: mobileSidebar, className: 'is-active' },
            { element: overlay, className: 'menu-open' }
        ]);
        overlay && overlay.removeEventListener('click', this.meuToggleClickHandler.bind(this));
        overlay && overlay.addEventListener('click', this.meuToggleClickHandler.bind(this));
        // Block background scroll when mobile sidebar is open
        document.body.style.overflow = mobileSidebar.classList.contains('is-active') ? 'hidden' : '';
    }

    setMenuToggleEvent() {
        // Now this will find your element perfectly!
        const menuToggle = DOMUtils.shadowQuery(this, '.menu-toggle');
        const mobileSidebar = DOMUtils.shadowQuery(this, '.mobile-sidebar');
        const navLinks = DOMUtils.shadowQuery(this, '.full-screen-nav a', true );

        menuToggle && menuToggle.addEventListener('click', this.meuToggleClickHandler.bind(this));

        navLinks && navLinks.forEach(link => {
            link.addEventListener('click', () => {
                const overlay = DOMUtils.shadowQuery(this, '.sidebar-overlay');
                DOMUtils.removeClassList([
                    { element: menuToggle, className: 'is-active' },
                    { element: mobileSidebar, className: 'is-active' },
                    { element: overlay, className: 'menu-open' }
                ]);
                document.body.style.overflow = '';
            });
        });
    }
}
DOMUtils.define(SideBarComponent);
