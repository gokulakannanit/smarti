import { BaseComponent } from "../../baseComponent.js";
import { URL_CONFIG } from "../../constants/url.constants.js";
import { DOMUtils } from "../../dom-utils.js";
import { DynamicIframeManager } from "../../services/iframe-manager.js";
import { PageWindowManager } from "../../services/page-window.js";
import { AppInputComponent } from "../app-input/app-input.js";

const formInput = [
  {
    id: "mobileNo",
    label: {
      placeholder: "Enter Mobile No...",
      labelText: "Mobile Number",
    },
    value: { value: "" },
  },
  {
    id: "consumerNo",
    label: {
      placeholder: "Enter Eb Customer No...",
      labelText: "EB Consumer No",
    },
    value: { value: "" },
  },
];

export class MeterReadingComponent extends BaseComponent {
  constructor() {
    super(import.meta.url);
  }
  fillInputDate({ id, label, value }) {
    const formEle = this.shadow.querySelector(`#${id}`);
    formEle.setAttribute("_label", JSON.stringify(label));
    formEle.setAttribute("data", JSON.stringify(value));
  }
  // Use this instead of connectedCallback()
  onInit() {
    formInput.forEach((item) => this.fillInputDate(item));
    const submitBtn = this.shadow.querySelector('button[type="submit"]');
    submitBtn.addEventListener("click", this.submitMeterReading.bind(this));
  }
  validateAll() {
    const formValue = {};
    formInput.forEach((item) => {
      const formEle = this.shadow.querySelector(`#${item.id}`);
      formEle.validate();
      formValue[item.id] = formEle.inputElement.value;
    });
    return formValue;
  }
  submitMeterReading(e) {
    const formValue = this.validateAll();
    console.log('here in submit button clicked...', formValue);
    this.getLastMeterReading();
  }

  getLastMeterReading() {
    const _pageWindowManager = new PageWindowManager();
    const { TNEB_CHECK_BILL_URL } = URL_CONFIG.EB_URL;
    _pageWindowManager
      .loadUrl(TNEB_CHECK_BILL_URL)
      .then((currentDoc) => {
        // 🟢 PROMISE RESOLVED: Executed when resolve() is called inside the class
        console.log("Success! Iframe DOM context obtained.",currentDoc);
        //const button = currentDoc.querySelector("#my-btn");
        //button.click();
      })
      .catch((error) => {
        // 🔴 PROMISE REJECTED: Executed when reject() is called inside the class
        console.error("Failed to load or access the iframe:", error.message);
      });
  }

  onSubmit() {
    getLastMeterReading();
  }
}
DOMUtils.define(MeterReadingComponent);
