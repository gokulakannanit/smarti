import { BaseComponent } from "../../baseComponent.js";
import { DOMUtils } from "../../dom-utils.js";
import { appBus, EventBus } from "../../services/event-bus.js";

// 1. Export a static object for the states
export const ActionCardStates = Object.freeze({
  ACTIVE: "active-state",
  LOCKED: "locked-state",
  SECONDARY: "secondary-state",
});

class ActionCardComponent extends BaseComponent {
  constructor() {
    super(import.meta.url);
  }

  onBeforeRender() {
    const model = JSON.parse(this.getAttribute("data")).model;
    this.conditionalClass = {
      model: model,
    };
  }
  // Use this instead of connectedCallback()

  onInit() {
    this.shadow.addEventListener("click", () => {
      appBus.emit(EventBus.Events.SET_METER_READING, {
        title: "Log Initial Meter Reading",
        content: "Form Component will loaded here",
      });
    });
  }
}
DOMUtils.define(ActionCardComponent);
