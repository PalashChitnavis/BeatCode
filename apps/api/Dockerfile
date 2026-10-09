# Build from the repository root: docker build -f apps/api/Dockerfile .
FROM node:22-alpine AS base
RUN apk add --no-cache openssl
WORKDIR /app
COPY package.json package-lock.json ./
COPY packages/shared/package.json packages/shared/
COPY apps/api/package.json apps/api/
COPY apps/runner/package.json apps/runner/
COPY apps/web/package.json apps/web/

FROM base AS build
RUN npm ci --workspace @beatcode/api --include-workspace-root --ignore-scripts
COPY tsconfig.base.json ./
COPY packages/shared packages/shared
COPY apps/api apps/api
RUN npm run build --workspace @beatcode/api

FROM base AS deps
RUN npm ci --workspace @beatcode/api --omit=dev --ignore-scripts
COPY apps/api/prisma apps/api/prisma
RUN cd apps/api && npx prisma generate --schema prisma/schema.prisma

FROM node:22-alpine
RUN apk add --no-cache openssl
ENV NODE_ENV=production
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY apps/api/package.json apps/api/prisma.config.ts ./apps/api/
COPY apps/api/prisma ./apps/api/prisma
WORKDIR /app/apps/api
USER node
EXPOSE 4000
HEALTHCHECK --interval=15s --timeout=3s CMD wget -qO- http://127.0.0.1:4000/healthz || exit 1
# Apply pending migrations, then start the server.
CMD ["sh", "-c", "/app/node_modules/.bin/prisma migrate deploy && exec node dist/server.js"]
