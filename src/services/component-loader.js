export class ComponentLoader {
    constructor() {}
  /**
   * Static loader that finds the tag name automatically from the imported module class.
   * @param {string} path - The path to the component file
   * @param {Function} [callback] - Optional callback
   */
  static async lazyLoad(path, callback) {
    try {
      // 1. Dynamic import fetches the module object
      const module = await import(path);

      // 2. Find the exported class inside the module object
      const ComponentClass = Object.values(module).find(
        (exported) => exported.prototype instanceof HTMLElement
      );

      if (!ComponentClass) {
        throw new Error(`No Custom Element class found exported in ${path}`);
      }

      // 3. Look up the registered tag name in the browser registry using the class
      // customElements.getName() is supported in modern browsers
      const tagName = customElements.getName(ComponentClass);
      
      if (!tagName) {
        throw new Error(`The class ${ComponentClass.name} is not registered in customElements.`);
      }

      if (typeof callback === 'function') callback(tagName);
      return tagName;

    } catch (error) {
      console.error(`Auto-load failed for ${path}:`, error);
      throw error;
    }
  }
}
