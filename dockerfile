# Install dependencies only when needed
FROM node:18-alpine AS deps

# Install build dependencies
RUN apk add --no-cache \
    libc6-compat \
    python3 \
    make \
    g++ \
    build-base

# Install pnpm globally with specific version
RUN npm install -g pnpm@8.15.1

WORKDIR /app

# Copy package configs
COPY package.json pnpm-lock.yaml .npmrc ./

# First, try to install dependencies with frozen lockfile
RUN pnpm install --frozen-lockfile --verbose || \
    # If that fails, try without frozen lockfile
    (rm -rf node_modules && pnpm install --no-frozen-lockfile --verbose)

# Rebuild the source code only when needed
FROM node:18-alpine AS builder
WORKDIR /app

# Install pnpm globally with specific version
RUN npm install -g pnpm@8.15.1

# Copy all files from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Optional: Disable Next.js telemetry during the build
ENV NEXT_TELEMETRY_DISABLED 1

# Build the Next.js application
RUN pnpm run build

# Production image, copy all the files and run Next.js
FROM node:18-alpine AS runner
WORKDIR /app

# Install pnpm globally with specific version
RUN npm install -g pnpm@8.15.1

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Ensure proper permissions
RUN chmod -R 777 ./public

USER nextjs

EXPOSE 3000
ENV PORT 3000

# Start the application
CMD ["node", "server.js"]