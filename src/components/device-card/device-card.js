import { BaseComponent } from "../../baseComponent.js";
import { DEVICE_ICONS } from "../../constants/device.constants.js";
import { DOMUtils } from "../../dom-utils.js";
import "../../interfaces/device.js";

class DeviceCardComponent extends BaseComponent {
    constructor() {
        super(import.meta.url);
        /** 
         * By adding this tag, VS Code treats this exactly like a TS interface!
         * @type {deviceData} 
         */
        // 2. Define internal storage for our data object
        //
        this._data = { name: 'Living Room AC 1', usage: '4 kWh', status: 'standby', icon: DEVICE_ICONS.FAN };

    }

    
    // Use this instead of connectedCallback()
    onInit() {
    }
}
DOMUtils.define(DeviceCardComponent);
