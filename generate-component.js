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
const cleanName = nameArg.replace(/-(page|component)$/i, '');
const formattedName = cleanName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
const pascalClassName = type === 'page' ? `${formattedName}Page` : `${formattedName}Component`;

// Map target routing folder configurations using modern ES Modules directory paths
const baseFolder = type === 'page' ? 'src/pages' : 'src/components';
const targetDir = path.join(import.meta.dirname, baseFolder, cleanName);

// 1. Create the structural directory path securely
fs.mkdirSync(targetDir, { recursive: true });

// Compute the clean web path for the CSS file link tag reference
const webCssPath = `${baseFolder}/${cleanName}/${cleanName}.css`;

// 2. Blueprint templates configured directly from reference architectures
const templates = {
    js: type === 'page' ?
`import { BaseComponent } from "../../baseComponent.js";
import { DOMUtils } from "../../dom-utils.js";

export class ${pascalClassName} extends BaseComponent {
    constructor() {
        super(import.meta.url);
    }
    // Use this instead of connectedCallback()
    onInit() {
    }
}

(!customElements.get('${cleanName}-page')) && DOMUtils.define(${pascalClassName});
` : 
`import { BaseComponent } from "../../baseComponent.js";
import { DOMUtils } from "../../dom-utils.js";

export class ${pascalClassName} extends BaseComponent {
    constructor() {
        super(import.meta.url);
    }
    // Use this instead of connectedCallback()
    onInit() {
    }
}
DOMUtils.define(${pascalClassName});
`,

    html: type === 'page' ?
`<!-- Layout shell for ${cleanName} page context view -->
<link rel="stylesheet" href="${webCssPath}">
<div class="${cleanName}-page">
  <h2 class="section-title">${formattedName} Screen Layout</h2>
</div>
` : 
`<!-- Layout template container configuration for ${cleanName} component -->
<link rel="stylesheet" href="${webCssPath}">
<div class="${cleanName}">
  <p>${cleanName} content placeholder</p>
</div>
`,

    css: type === 'page' ?
`/* Page structural viewport layout rules for ${cleanName}-page */
.${cleanName}-page {
    width: 100%;
    box-sizing: border-box;
}

.section-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: #1a2530;
}
` : 
`/* Local scoped stylesheet rules mapping to ${cleanName} component layout */
.${cleanName} {
    display: block;
    box-sizing: border-box;
}
`
};

// 3. Output files into designated file nodes synchronously
fs.writeFileSync(path.join(targetDir, `${cleanName}.js`), templates.js);
fs.writeFileSync(path.join(targetDir, `${cleanName}.html`), templates.html);
fs.writeFileSync(path.join(targetDir, `${cleanName}.css`), templates.css);

console.log(`\n🚀 Scaffold Complete: New ${type.toUpperCase()} created successfully!`);
console.log(`📂 Location: ${baseFolder}/${cleanName}/`);
console.log(`📄 Generated: ${cleanName}.js, ${cleanName}.html, ${cleanName}.css\n`);
