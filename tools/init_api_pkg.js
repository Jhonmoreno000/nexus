const fs = require('fs');
const path = require('path');

function write(p, data) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, data.trim() + '\n', 'utf8');
}

// 1. apps/api/package.json
write('apps/api/package.json', JSON.stringify({
  "name": "@nexus/api",
  "version": "1.0.0",
  "main": "dist/server.js",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "node --test test/**/*.test.js"
  },
  "dependencies": {
    "fastify": "^4.28.1",
    "@fastify/cors": "^9.0.1",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "tsx": "^4.19.0",
    "typescript": "^5.5.4",
    "@types/node": "^20.14.9"
  }
}, null, 2));

// 2. apps/api/tsconfig.json
write('apps/api/tsconfig.json', JSON.stringify({
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "outDir": "dist"
  },
  "include": ["src/**/*"]
}, null, 2));

console.log('apps/api package and tsconfig written.');
