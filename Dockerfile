# ── Stage 1: Build frontend ───────────────────────────────────────────────────
FROM node:20-alpine AS frontend-build
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# ── Stage 2: Build backend ────────────────────────────────────────────────────
FROM node:20-alpine AS backend-build
WORKDIR /backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/ ./
RUN npm run build

# ── Stage 3: Production image ─────────────────────────────────────────────────
FROM node:20-alpine
WORKDIR /app
COPY --from=backend-build /backend/dist ./dist
COPY --from=backend-build /backend/node_modules ./node_modules
COPY --from=frontend-build /frontend/dist ./public
COPY content/ ./content/
EXPOSE 3000
ENV NODE_ENV=production
ENV CONTENT_PATH=/app/content
CMD ["node", "dist/app.js"]
