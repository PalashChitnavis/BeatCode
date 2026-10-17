# Build from the repository root: docker build -f apps/web/Dockerfile .
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json tsconfig.base.json ./
COPY packages/shared/package.json packages/shared/
COPY apps/api/package.json apps/api/
COPY apps/runner/package.json apps/runner/
COPY apps/web/package.json apps/web/
RUN npm ci --workspace @beatcode/web --include-workspace-root --ignore-scripts
COPY packages/shared packages/shared
COPY apps/web apps/web
# Empty means same origin: nginx below proxies /api and /socket.io to the API.
ARG VITE_API_URL=""
ARG VITE_ICE_SERVERS=""
ENV VITE_API_URL=$VITE_API_URL VITE_ICE_SERVERS=$VITE_ICE_SERVERS
RUN npm run build --workspace @beatcode/web

FROM nginx:1.29-alpine
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/web/dist /usr/share/nginx/html
EXPOSE 80
