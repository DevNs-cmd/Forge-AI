# ---- Dependencies Stage ----
FROM node:20-alpine AS deps

WORKDIR /app

# Copy root workspace files
COPY package.json package-lock.json ./

# Copy the local package (validation) that web depends on
COPY packages/validation/package.json ./packages/validation/

# Copy web app package.json
COPY apps/web/package.json ./apps/web/

# Install all workspace dependencies
RUN npm ci

# ---- Builder Stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copy installed node_modules from deps stage (hoisted to root by npm workspaces)
COPY --from=deps /app/node_modules ./node_modules

# Copy source files needed for build
COPY packages/ ./packages/
COPY apps/web/ ./apps/web/
COPY package.json ./

# Build the Next.js app
WORKDIR /app/apps/web
RUN npm run build

# ---- Runtime Stage ----
FROM node:20-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy only the production output
COPY --from=builder /app/apps/web/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:3000/ || exit 1

CMD ["node", "server.js"]
