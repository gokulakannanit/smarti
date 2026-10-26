class ImageReader {
  constructor(options = {}) {
    this.language = options.language || "eng";
    this.onProgress = options.onProgress || (() => {});
    this.ocrEngine = null; // Stays empty until explicitly needed
  }

  /**
   * Dynamically resolves the Tesseract CDN directly inside the class context
   */
  async initEngine() {
    if (!this.ocrEngine) {
      // Imports Tesseract as an ES module directly from jsDelivr CDN
      const module = await import("https://jsdelivr.net");
      this.ocrEngine = module.default;
    }
  }

  /**
   * Orchestrates the OCR extraction sequence
   * @param {string} selector - CSS selector for the image tag
   */
  async extractNumbers(selector, callbackFun) {
    const imgNode = document.querySelector(selector);
    if (!imgNode) throw new Error("Image target not found.");

    // Step 1: Ensure the CDN engine is downloaded and mounted
    await this.initEngine();

    // Step 2: Run the recognition process
    try {
      const {
        data: { text },
      } = await this.ocrEngine.recognize(imgNode, this.language, {
        logger: (m) => {
          if (m.status === "recognizing text") {
            this.onProgress(Math.round(m.progress * 100));
          }
        },
      });

      const numbers = text.match(/\d+/g);
      callbackFun({ sucess: true, numbers: numbers ? numbers : [] });
    } catch (error) {
        callbackFun({ sucess: false, numbers: [] });
        throw new Error(`OCR Processing Failed: ${error.message}`);
    }
  }
}

export const ScopeImageReader = new ImageReader();
