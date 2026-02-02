# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source
COPY . .

# Build
RUN npm run build

# Production stage
FROM node:22-alpine

WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm ci --only=production

# Copy built files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/db/migrations ./dist/db/migrations
COPY --from=builder /app/templates ./templates

# Create non-root user
RUN addgroup -g 1001 -S ifa && \
    adduser -S ifa -u 1001 -G ifa

# Create directories
RUN mkdir -p /root/.openclaw/workspaces && \
    chown -R ifa:ifa /app

USER ifa

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health/live || exit 1

# Start
CMD ["node", "dist/index.js"]
