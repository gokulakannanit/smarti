import { BaseComponent } from './baseComponent.js';
import { DOMUtils } from './dom-utils.js';

class AppComponent extends BaseComponent {
    constructor() {
        super(import.meta.url);
    }
    loadDeviceList() {
        // Define your array matching your data model contract
        const dashboardItems = [
        {
            title: "Energy Telemetry",
            subtitle: "Real-time consumption tracking",
            icon: "bolt",
            iconColor: "blue",
            value: "energy"
        },
        {
            title: "Smart Appliances",
            subtitle: "Manage 12 connected devices",
            icon: "devices",
            iconColor: "green",
            value: "appliances"
        }
        ];

        // Find the element and feed the array straight into the custom setter property
        const deviceMenu = this.shadow.getElementById('deviceMenu');
        console.log('deviceMenu', deviceMenu);
        deviceMenu && (deviceMenu.listData = dashboardItems);
    }
    // Use this instead of connectedCallback()
    onInit() {
        this.loadDeviceList();
    }
}
DOMUtils.define(AppComponent);
