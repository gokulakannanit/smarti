import { BaseComponent } from "../../baseComponent.js";
import { DOMUtils } from "../../dom-utils.js";
import { StringUtils } from "../../utils/string-util.js";

export class AppBadgeComponent extends BaseComponent {
  constructor() {
    super(import.meta.url);
  }
  afterRender() {
    const closeBtn = DOMUtils.shadowQuery(this, "#closeBtn");
    DOMUtils.addClass(this.box, "removing");    
    const showClose =
      this.hasAttribute("show-close") &&
      this.getAttribute("show-close") !== "false";

    // Manage close button visibility
    closeBtn.style.display = showClose ? "inline-block" : "none";
    showClose && DOMUtils.shadowQuery(this, "#closeBtn")
      .addEventListener("click", () => this.removeWithAnimation());
  }

  message(msg, type = "info") {
    const content = DOMUtils.shadowQuery(this, "#msgContent");

    // Rule: If message is null, empty string, or missing, trigger removal animation
    if (msg === null || msg.trim() === "") {
      this.removeWithAnimation();
      return;
    }

    // Update message text
    content.textContent = StringUtils.capitalizeSentence(msg);

    // Manage types/severities
    this.box.className = `app-badge ${type}`;
    DOMUtils.removeClass(this.box, "removing");
  }

  // Use this instead of connectedCallback()
  onInit() {
    this.box = DOMUtils.shadowQuery(this, "#appBadge");
    this.afterRender();
  }

  removeWithAnimation() {    
    if (!this.box || DOMUtils.hasClass(this.box, "removing")) return;
    DOMUtils.addClass(this.box, "removing");

    // Wait for the CSS shrinkOut animation to finish before destroying the DOM node
    this.box.addEventListener("animationend", (e) => {
      if (e.animationName === "shrinkOut") {
        //this.remove();
      }
    });
  }
}
DOMUtils.define(AppBadgeComponent);
