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
        const _dom = this.shadow;
        const menuToggle = _dom.querySelector('.menu-toggle');
        const mobileSidebar = _dom.querySelector('.mobile-sidebar');
        const overlay = _dom.querySelector('.sidebar-overlay');
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
        const _dom = this.shadow;
        const menuToggle = _dom.querySelector('.menu-toggle');
        const mobileSidebar = _dom.querySelector('.mobile-sidebar');
        const navLinks = _dom.querySelectorAll('.full-screen-nav a');

        menuToggle && menuToggle.addEventListener('click', this.meuToggleClickHandler.bind(this));

        navLinks && navLinks.forEach(link => {
            link.addEventListener('click', () => {
                const overlay = _dom.querySelector('.sidebar-overlay');
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
