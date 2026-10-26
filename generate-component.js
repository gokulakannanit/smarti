import fs from 'node:fs';
import path from 'node:path';

// Extract arguments from command line execution profile
const args = process.argv.slice(2);
let type = 'comp'; // fallback default target rule
let nameArg = '';

// Parse parameters (e.g., --page dashboard or simply dashboard)
args.forEach((arg) => {
    if (arg === '--page') {
        type = 'page';
    } else if (arg !== '--comp') {
        nameArg = arg;
    }
});

if (!nameArg) {
    console.error('❌ Please provide a name! Example:\n   npm run create-comp my-widget\n   npm run create-page dashboard');
    process.exit(1);
}

// Convert spinal-case (dashboard-view) to PascalCase (DashboardViewComponent/DashboardViewPage)
const cleanName = nameArg.replace(/-(page|component)\$/i, '');
const formattedName = cleanName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
const pascalClassName = type === 'page' ? `${formattedName}Page` : `${formattedName}Component`;

// Map target routing folder configurations using modern ES Modules directory paths
const baseFolder = type === 'page' ? 'src/pages' : 'src/components';
const targetDir = path.join(
    import.meta.dirname, baseFolder, cleanName);

// 1. Create the structural directory path securely
fs.mkdirSync(targetDir, { recursive: true });

// 2. Blueprint templates configured directly from reference architectures
const templates = {
        js: type === 'page' ?
            `import { BaseComponent } from "../../baseComponent.js";\nimport { DOMUtils } from "../../dom-utils.js";\n\nexport class ${pascalClassName} extends BaseComponent {\n    constructor() {\n        super(import.meta.url);\n    }\n    // Use this instead of connectedCallback()\n    onInit() {\n    }\n}\n\n(!customElements.get('${cleanName}-page')) && DOMUtils.define(${pascalClassName});\n` : `import { BaseComponent } from "../../baseComponent.js";\nimport { DOMUtils } from "../../dom-utils.js";\n\nexport class ${pascalClassName} extends BaseComponent {\n    constructor() {\n        super(import.meta.url);\n    }\n    // Use this instead of connectedCallback()\n    onInit() {\n    }\n}\nDOMUtils.define(${pascalClassName});\n`,

        html: type === 'page' ?
            `<!-- Layout shell for ${cleanName} page context view -->\n<link rel="stylesheet" href="${path.join(baseFolder, `${cleanName}\${cleanName}.css`).replace(/\\/g, '/')}">\n<div class="${cleanName}-page">\n  <h2 class="section-title">${formattedName} Screen Layout</h2>\n</div>\n` : `<!-- Layout template container configuration for ${cleanName} component -->\n<link rel="stylesheet" href="${path.join(baseFolder, `${cleanName}\${cleanName}.css`).replace(/\\/g, '/')}">\n<div class="${cleanName}">\n  <p>${cleanName} content placeholder</p>\n</div>\n`,

    css: type === 'page' ?
        `/* Page structural viewport layout rules for ${cleanName}-page */\n.${cleanName}-page {\n    width: 100%;\n    box-sizing: border-box;\n}\n\n.section-title {\n    font-size: 1.1rem;\n    font-weight: 700;\n    color: #1a2530;\n}\n` : `/* Local scoped stylesheet rules mapping to ${cleanName} component layout */\n.${cleanName} {\n    display: block;\n    box-sizing: border-box;\n}\n`
};

// 3. Output files into designated file nodes synchronously
fs.writeFileSync(path.join(targetDir, `${cleanName}.js`), templates.js);
fs.writeFileSync(path.join(targetDir, `${cleanName}.html`), templates.html);
fs.writeFileSync(path.join(targetDir, `${cleanName}.css`), templates.css);

console.log(`\n🚀 Scaffold Complete: New ${type.toUpperCase()} created successfully!`);
console.log(`📂 Location: ${baseFolder}/${cleanName}/`);
console.log(`📄 Generated: ${cleanName}.js, ${cleanName}.html, ${cleanName}.css\n`);