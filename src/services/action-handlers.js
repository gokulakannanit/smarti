import { appBus, EventBus } from "../services/event-bus.js";
import { ComponentLoader } from "../services/component-loader.js";

class ActionHandlers {
  constructor() {
    this._actionEvents = [EventBus.Events.SET_METER_READING];
    this.initializeActionsHandler();
  }
  initializeActionsHandler() {
    this._actionEvents.forEach((actionType) =>
      appBus.on(actionType, this.assignAction.bind(this)),
    );
  }
  showMeterReadingPopup(payload) {
    ComponentLoader.lazyLoad(
      "/src/components/meter-reading/meter-reading.js",
      (tagName) => {
        const _newPayload = {
          title: '',
          content: document.createElement(tagName),
        };
        console.log(`Found and loaded: ${tagName}`); // Output: meter-reading-component"
        appBus.emit(EventBus.Events.OPEN_POPUP, _newPayload);
      },
    );
  }
  assignAction(eventDetail) {
    console.log(eventDetail);
    const { type, detail } = eventDetail;
    switch (type) {
      case EventBus.Events.SET_METER_READING:
        this.showMeterReadingPopup(detail);
        break;
      default:
        break;
    }
  }
}

export const _appActionHandler = new ActionHandlers();
