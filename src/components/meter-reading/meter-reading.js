import { BaseComponent } from "../../baseComponent.js";
import { URL_CONFIG } from "../../constants/url.constants.js";
import { DOMUtils } from "../../dom-utils.js";
import { DynamicIframeManager } from "../../services/iframe-manager.js";
import { PageWindowManager } from "../../services/page-window.js";
import { AppInputComponent } from "../app-input/app-input.js";
import { AppDateComponent } from "../app-date/app-date.js";
import { AppDigitInputComponent } from "../app-digit-input/app-digit-input.js";
import { ObjectUtils } from "../../utils/object-util.js";

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
  {
    id: "initialMtrNo",
    label: {
      placeholder: "Enter Last Meter Reading...",
      labelText: "Meter Reading Last",
    },
    value: { value: "", maxBoxes: 7, initialCount: 4 },
  },
  {
    id: "currentMtrNo",
    label: {
      placeholder: "Enter Now Meter Reading...",
      labelText: "Meter Reading Now",
    },
    value: { value: "" },
  },
  {
    id: "lastReadingDate",
    label: {
      placeholder: "Enter Last Meter Date...",
      labelText: "Previous Meter Date",
    },
    value: { value: "" },
  },
  {
    id: "currentReadingDate",
    label: {
      placeholder: "Enter Now Meter Date...",
      labelText: "Now Meter Date",
    },
    value: { value: "" },
  },
];

export class MeterReadingComponent extends BaseComponent {
  constructor() {
    super(import.meta.url);
  }
  
  setinitialMtrNo(targetEle, value) {
    const pairedEle = DOMUtils.shadowQuery(this, '#currentMtrNo');
    pairedEle.minValue = value;
    pairedEle.validate();
  }
  setcurrentMtrNo(targetEle, value) {
    const pairedEle = DOMUtils.shadowQuery(this, '#initialMtrNo');
    if(pairedEle.value === '') return '';
    const unitsConsumed = value - pairedEle.value;
    this.badge.message(`Consumed ${unitsConsumed} units for last 30 days`);
  }

  fillInputData({ id, label, value }) {
    const formEle = DOMUtils.shadowQuery(this, `#${id}`);
    if (formEle) {
      formEle.setAttribute("_label", JSON.stringify(label));
      formEle.setAttribute("data", JSON.stringify(value));
      formEle.onComplete = (targetEle, value) => {
        const callback = this[`set${targetEle.id}`].bind(this);
        callback && callback(targetEle, value);
      };
    }
  }
  // Use this instead of connectedCallback()
  onInit() {
    this.badge = DOMUtils.shadowQuery(this, '#badge');
    formInput.forEach((item) => this.fillInputData(item));
    const submitBtn = DOMUtils.shadowQuery(this, 'button[type="submit"]');
    submitBtn.addEventListener("click", this.submitMeterReading.bind(this));
  }
  validateAll() {
    let isError = false;
    this.formValue = {};
    formInput.forEach((item) => {
      const formEle = DOMUtils.shadowQuery(this, `#${item.id}`);      
      if(!formEle) return '';
      formEle.validate();
      isError = formEle.error ? true : isError;
      this.formValue[item.id] = formEle.value || formEle.inputElement?.value;
    });
  }
  submitMeterReading(e) {
    this.validateAll();
    this.getLastMeterReading();
  }

  feedInputFromExternal() {
    const _getInput = this._pageWindowManager.getElement;
    const { consumerNo: serviceno, mobileNo: mob } = this.formValue.value;
    const formData = { serviceno, mob };
    Object.entries(formData).forEach(([key, value]) => {
      _getInput(`#${key}`).value = value;
    });
  }

  getLastMeterReading() {
    this._pageWindowManager = new PageWindowManager();
    const { TNEB_CHECK_BILL_URL } = URL_CONFIG.EB_URL;
    this._pageWindowManager
      .loadUrl(TNEB_CHECK_BILL_URL)
      .then((currentDoc) => {
        this.pageWindow = currentDoc;
        this.feedInputFromExternal();
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
