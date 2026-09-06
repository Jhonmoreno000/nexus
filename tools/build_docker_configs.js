const fs = require('fs');
const path = require('path');

function write(p, data) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, data.trim() + '\n', 'utf8');
}

// 1. .dockerignore
write('.dockerignore', `
node_modules
.git
.cache
dist
build
*.log
.env
.env.*
coverage
`);

// 2. apps/api/Dockerfile
write('apps/api/Dockerfile', `
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
RUN npm ci --workspace=@nexus/api

COPY apps/api ./apps/api
RUN npm run build --workspace=@nexus/api

# Stage 2: Production
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001

COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
RUN npm ci --omit=dev --workspace=@nexus/api

COPY --from=builder /app/apps/api/dist ./apps/api/dist

USER node
EXPOSE 3001

CMD ["node", "apps/api/dist/server.js"]
`);

// 3. apps/web/Dockerfile
write('apps/web/Dockerfile', `
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY apps/web/package*.json ./apps/web/
RUN npm ci --workspace=@nexus/web

COPY apps/web ./apps/web
RUN npm run build --workspace=@nexus/web

# Stage 2: Static Server
FROM nginx:alpine AS runner
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
`);

// 4. apps/web/nginx.conf
write('apps/web/nginx.conf', `
server {
    listen 80;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://api:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
`);

// 5. compose.yaml
write('compose.yaml', `
services:
  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
    ports:
      - "3000:80"
    depends_on:
      - api
    networks:
      - nexus-net

  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
    ports:
      - "3001:3001"
    environment:
      - PORT=3001
      - DATABASE_URL=postgres://nexus_user:nexus_password@postgres:5432/nexus_app
      - REDIS_URL=redis://redis:6379
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started
    networks:
      - nexus-net

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: nexus_app
      POSTGRES_USER: nexus_user
      POSTGRES_PASSWORD: nexus_password
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./infrastructure/docker/postgres/init-sandbox.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U nexus_user -d nexus_app"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - nexus-net

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redisdata:/data
    networks:
      - nexus-net

volumes:
  pgdata:
  redisdata:

networks:
  nexus-net:
    driver: bridge
`);

// 6. compose.dev.yaml
write('compose.dev.yaml', `
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: nexus_app
      POSTGRES_USER: nexus_user
      POSTGRES_PASSWORD: nexus_password
    ports:
      - "5432:5432"
    volumes:
      - pgdata_dev:/var/lib/postgresql/data
      - ./infrastructure/docker/postgres/init-sandbox.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - nexus-dev-net

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    networks:
      - nexus-dev-net

volumes:
  pgdata_dev:

networks:
  nexus-dev-net:
    driver: bridge
`);

// 7. infrastructure/docker/postgres/init-sandbox.sql
write('infrastructure/docker/postgres/init-sandbox.sql', `
-- Initial application database schema & seed for incident 1842
CREATE DATABASE nexus_sandbox;
\\c nexus_sandbox;

CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    status VARCHAR(50) NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id),
    amount NUMERIC(12, 2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    payment_id INTEGER NOT NULL REFERENCES payments(id),
    status VARCHAR(50) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE refunds (
    id SERIAL PRIMARY KEY,
    transaction_id INTEGER NOT NULL REFERENCES transactions(id),
    amount NUMERIC(12, 2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
`);

console.log('Docker and compose configuration files created.');
