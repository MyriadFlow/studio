# Install dependencies only when needed
FROM node:18-alpine AS deps

# Install global dependencies
RUN npm install -g node-gyp node-gyp-build pnpm@8.15.1

WORKDIR /app

# Set environment variables for native builds
ENV PYTHON=/usr/bin/python3
ENV NODE_GYP=/usr/local/lib/node_modules/node-gyp/bin/node-gyp.js
ENV PATH="/usr/local/lib/node_modules/node-gyp-build/bin:${PATH}"

# Copy package configs
COPY package.json pnpm-lock.yaml ./

# Create .npmrc with necessary config
RUN echo "node-linker=hoisted" > .npmrc && \
    echo "shamefully-hoist=true" >> .npmrc && \
    echo "strict-peer-dependencies=false" >> .npmrc && \
    echo "node-gyp=/usr/local/lib/node_modules/node-gyp/bin/node-gyp.js" >> .npmrc && \
    echo "python=/usr/bin/python3" >> .npmrc

# Install dependencies
# RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
#     pnpm install --no-frozen-lockfile \
#     --unsafe-perm \
#     --shamefully-hoist \
#     --network-timeout 300000

# Rebuild the source code only when needed
FROM node:18-alpine AS builder
WORKDIR /app

RUN npm install -g pnpm@8.15.1

# Copy all files
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

# Install build dependencies
RUN pnpm install

# Build the application
RUN pnpm run build

# Production image
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

RUN chmod -R 777 ./public

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]