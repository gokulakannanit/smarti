export class EventBus {
  // 1. Centralised dictionary of application events to eliminate hardcoded string typos
  static Events = {
    ROUTE_CHANGE: 'app-route-change',
    STATE_CHANGE: 'state-change',
    SERVICE_CALLED: 'service-called',
    OPEN_POPUP: 'open-global-popup',
    SET_METER_READING: 'set_meter_reading',
  };

  constructor() {
    // Uses an internal DOM node as a robust, native event target pipeline
    this.bus = new Comment('event-bus');
  }

  /**
   * Listen for an event
   * @param {string} eventName - Use EventBus.Events constants
   * @param {Function} callback 
   */
  on(eventName, callback) {
    this.bus.addEventListener(eventName, callback);
  }

  /**
   * Stop listening for an event
   * @param {string} eventName 
   * @param {Function} callback 
   */
  off(eventName, callback) {
    this.bus.removeEventListener(eventName, callback);
  }

  /**
   * Dispatch an event out to all listeners with payload data
   * @param {string} eventName - Use EventBus.Events constants
   * @param {Object} detail - The data payload to pass down
   */
  emit(eventName, detail = {}) {
    console.log(eventName, ' : ', detail);
    const customEvent = new CustomEvent(eventName, { 
      detail,
      bubbles: false,
      composed: false 
    });
    this.bus.dispatchEvent(customEvent);
  }
}

// Instantiate a single global instance for your app
export const appBus = new EventBus();