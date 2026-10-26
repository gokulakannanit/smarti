import { BaseComponent } from "../../baseComponent.js";
import { ActionCardStates } from "../../components/action-card/action-card.js";
import { DOMUtils } from "../../dom-utils.js";

export class DashboardPage extends BaseComponent {
  constructor() {
    super(import.meta.url);
    this.model = this.intializeData();
  }
  loadDeviceList() {
    // Define your array matching your data model contract
    const dashboardItems = [
      {
        title: "Energy Telemetry",
        subtitle: "Real-time consumption tracking",
        icon: "bolt",
        iconColor: "blue",
        value: "energy",
      },
      {
        title: "Smart Appliances",
        subtitle: "Manage 12 connected devices",
        icon: "devices",
        iconColor: "green",
        value: "appliances",
      },
    ];

    // Find the element and feed the array straight into the custom setter property
    const deviceMenu = this.shadow.getElementById("deviceMenu");
    console.log("deviceMenu", deviceMenu);
    deviceMenu && (deviceMenu.listData = dashboardItems);
  }
  intializeData() {
    return [
      {
        data: { icon: "speed", model: ActionCardStates.ACTIVE },
        label: {
          cardTitle: "Log Initial Meter Reading",
          cardDesc: "Take your first reading now.",
          buttonLabel: "Set Reading",
        },
      },
      {
        data: { icon: "mode_fan", model: ActionCardStates.SECONDARY },
        label: {
          cardTitle: "Add Appliances",
          cardDesc: "Define your home\'s top consumers.",
          buttonLabel: "Add Appliance",
        },
      },
      {
        data: { icon: "pie_chart", model: ActionCardStates.LOCKED },
        label: {
          cardTitle: "Analyze Consumption",
          cardDesc: "Requires readings and appliances to display split",
        },
      },
    ];
  }
  loadActionCard() {
    const dashboardActionCard = this.shadowRoot.querySelector(
      ".dashboard-page .cards-row",
    );
    this.model.forEach((action) => {
      const actionCard = document.createElement("action-card-component");
      actionCard.setAttribute("data", JSON.stringify(action.data));
      actionCard.setAttribute("_label", JSON.stringify(action.label));
      dashboardActionCard.appendChild(actionCard);
    });
  }
  // Use this instead of connectedCallback()
  onInit() {
    this.loadDeviceList();
    this.loadActionCard();
  }
}

!customElements.get("dashboard-page") & DOMUtils.define(DashboardPage);
