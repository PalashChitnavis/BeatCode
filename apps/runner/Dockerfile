# Build from the repository root: docker build -f apps/runner/Dockerfile .
FROM node:22-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./
COPY packages/shared/package.json packages/shared/
COPY apps/api/package.json apps/api/
COPY apps/runner/package.json apps/runner/
COPY apps/web/package.json apps/web/

FROM base AS build
RUN npm ci --workspace @beatcode/runner --include-workspace-root --ignore-scripts
COPY tsconfig.base.json ./
COPY packages/shared packages/shared
COPY apps/runner apps/runner
RUN npm run build --workspace @beatcode/runner

FROM base AS deps
RUN npm ci --workspace @beatcode/runner --omit=dev --ignore-scripts

FROM node:22-alpine
# The runner drives the host's Docker engine through the mounted socket to start sandboxes.
RUN apk add --no-cache docker-cli
ENV NODE_ENV=production
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/apps/runner/dist ./apps/runner/dist
COPY apps/runner/package.json ./apps/runner/
WORKDIR /app/apps/runner
CMD ["node", "dist/index.js"]
