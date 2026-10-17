import fs from 'fs';
import { execSync } from 'child_process';

console.log('🚀 Initializing Mobile PWA Scaffold...');

// 1. Create Files
fs.writeFileSync('package.json', JSON.stringify({
  name: "mobile-pwa",
  private: true,
  type: "module",
  scripts: { "dev": "vite", "build": "vite build" }
}, null, 2));

fs.mkdirSync('src', { recursive: true });
fs.writeFileSync('vite.config.js', `import { defineConfig } from 'vite';\nimport tailwindcss from '@tailwindcss/vite';\nexport default defineConfig({ plugins: [tailwindcss()], server: { host: true } });`);
fs.writeFileSync('src/style.css', `@import "tailwindcss";\n@layer base { * { -webkit-tap-highlight-color: transparent; } }`);
fs.writeFileSync('src/app.js', `console.log("PWA Script Loaded");`);
fs.writeFileSync('manifest.json', `{\n  "short_name": "PWA",\n  "name": "Mobile PWA",\n  "start_url": "/",\n  "display": "standalone"\n}`);
fs.writeFileSync('index.html', `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="manifest" href="/manifest.json"><link rel="stylesheet" href="/src/style.css"></head><body class="bg-gray-100 flex flex-col h-screen"><header class="h-14 bg-blue-600 text-white flex items-center justify-center font-bold">My PWA</header><main class="flex-1 p-4">Content here</main><script type="module" src="/src/app.js"></script></body></html>`);

// 2. Install Packages
console.log('📦 Installing Vite and Tailwind CSS...');
execSync('npm install vite @tailwindcss/vite', { stdio: 'inherit' });

console.log('✅ Done! Run "npm run dev" to test your application.');
