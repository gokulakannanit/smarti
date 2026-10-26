export class DOMUtils {
    static innerHTML(element, html) {
        element.innerHTML = html;
    }
    
    static addClass(element, className) {
        element.classList.add(className);
    }

    static toggleClass(element, className) {
        element.classList.toggle(className);
    }
    static toggleClassList(targetList) {
        targetList.forEach(({ element, className }) => {
            element.classList.toggle(className);
        });
    }
    static removeClass(element, className) {
        element.classList.remove(className);
    }
    static removeClassList(targetList) {
        targetList.forEach(({ element, className }) => {
            this.removeClass(element, className);
        });
    }
    static define(componentClass) {
        const tagName = DOMUtils.toTagName(componentClass.name);
        // Register your custom element tag
        customElements.define(tagName, componentClass);
    }
    static getFileName(className, moduleUrl) {
        // 1. Convert the current module URL into a native URL object
        const currentUrl = new URL(moduleUrl);

        // 2. Navigate one level up to the parent directory path
        const parentFolderUrl = new URL('./', currentUrl).href;

        //3. Find the file name based on the class name
        const fileName = DOMUtils.toWords(className.replace(/Component$/i, '')).join('-').toLowerCase();

        return `${parentFolderUrl}${fileName}.html`;
    }
    // 1. Split capital letters/camelCase into spaces (e.g., "AppComponent" -> "App Component")
    static toWords(str) {
        if (!str) return [];
        // 1. Put spaces before capital letters
        // 2. Trim edge spaces
        // 3. Split by the spaces into a real Array
        return str.replace(/([a-z0-9])([A-Z])|([A-Z])([A-Z][a-z])/g, '$1$3 $2$4')
            .trim()
            .split(/\s+/); // Splits by one or more spaces
    }

    // 2. Convert a class name to a valid custom element tag (e.g., "AppComponent" -> "app-component")
    static toTagName(str) {
        if (!str) return '';
        return this.toWords(str)
            .join('-')
            .toLowerCase();
    }

    // 3. Clean helper to generate standard Virtual DOM node configurations
    static velement(type, props, ...children) {
        return { type, props: props || {}, children: children.flat() };
    }

    // 4. Safely pull a parent class name from an instance context
    static getParentName(instance) {
        const parentProto = Object.getPrototypeOf(Object.getPrototypeOf(instance));
        return parentProto ? parentProto.constructor.name : '';
    }
}
