import { BaseComponent } from "../../baseComponent.js";
import { DEVICE_ICONS } from "../../constants/device.constants.js";
import { DOMUtils } from "../../dom-utils.js";

class DeviceListComponent extends BaseComponent {
    constructor() {
        super(import.meta.url);
        this.devices = [
            { name: 'Living Room AC 1', usage: '4 kWh', status: 'standby', icon: DEVICE_ICONS.AC },
            { name: 'Living Room Fan', usage: '4 kWh', status: 'standby', icon: DEVICE_ICONS.FAN },
            { name: 'Living Room Fan', usage: '4 kWh', status: 'standby', icon: DEVICE_ICONS.FAN },
        ];
    }
    // Use this instead of connectedCallback()
    onInit() {
        const dashboardGrid = this.shadowRoot.querySelector('.dashboard-grid');
        this.devices.forEach(device => {
            const deviceCard = document.createElement('device-card-component');
            deviceCard.setAttribute('data', JSON.stringify(device));
            dashboardGrid.appendChild(deviceCard);
        });
        
    }
}
DOMUtils.define(DeviceListComponent);
