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
