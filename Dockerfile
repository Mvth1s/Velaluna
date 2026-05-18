# ── Stage 1: Build frontend ───────────────────────────────────────────────────
FROM node:20-alpine AS frontend-build
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# ── Stage 2: Build backend + seed DB ─────────────────────────────────────────
FROM node:20-alpine AS backend-build
RUN apk add --no-cache python3 make g++
WORKDIR /backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/ ./
COPY content/ /content/
RUN npm run build
ENV CONTENT_PATH=/content
RUN node dist/db/seed.js

# ── Stage 3: Production image ─────────────────────────────────────────────────
FROM node:20-alpine
RUN apk add --no-cache libstdc++
WORKDIR /app
COPY --from=backend-build /backend/dist ./dist
COPY --from=backend-build /backend/node_modules ./node_modules
COPY --from=backend-build /backend/data ./data
COPY --from=frontend-build /frontend/dist ./public
EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "dist/app.js"]
