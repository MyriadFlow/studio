FROM node:18-alpine AS builder

# Install necessary build tools and Python dependencies
RUN apk add --no-cache \
    libc6-compat \
    python3 \
    python3-dev \
    py3-pip \
    make \
    g++ \
    build-base \
    linux-headers \
    libusb-dev \
    eudev-dev

# Install python3 distutils
RUN pip3 install setuptools --break-system-packages

# Install pnpm and node-gyp
RUN npm install -g pnpm@7 node-gyp

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Create .npmrc with configurations
RUN echo "node-linker=hoisted" > .npmrc && \
    echo "shamefully-hoist=true" >> .npmrc && \
    echo "strict-peer-dependencies=false" >> .npmrc && \
    echo "auto-install-peers=true" >> .npmrc

# Install dependencies
RUN pnpm install --no-frozen-lockfile --unsafe-perm

# Copy source code
COPY . .

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