# Production image for the Opus signup app (Next.js 15, React 19).
# Build:  docker build -t opus-signup .
# Run:    docker run --rm -p 3000:5000 opus-signup   → http://localhost:3000

FROM node:22-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

FROM node:22-bookworm-slim AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Dev packages stay installed: `next start` needs TypeScript to read next.config.ts.
RUN npm run build

FROM node:22-bookworm-slim AS run
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=5000
COPY --from=build --chown=node:node /app/package.json /app/next.config.ts ./
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/public ./public
COPY --from=build --chown=node:node /app/.next ./.next
USER node
EXPOSE 5000
CMD ["npx", "next", "start", "-p", "5000", "-H", "0.0.0.0"]
