# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build 2>/dev/null || npm run build:static

# Production stage
FROM node:18-alpine

WORKDIR /app

RUN npm install -g http-server

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/index.html ./dist/ || true
COPY --from=builder /app/css ./dist/css || true
COPY --from=builder /app/js ./dist/js || true

EXPOSE 3000

CMD ["http-server", "./dist", "-p", "3000"]
