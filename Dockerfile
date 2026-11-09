# Built in GitHub Actions. The container only runs migrations and starts (no build on the server).
FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat && corepack enable pnpm
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM deps AS build
COPY . .
# Placeholders: every page is rendered at request time, so the build never touches a database.
ENV NEXT_TELEMETRY_DISABLED=1 \
    DATABASE_URL=postgresql://build:build@127.0.0.1:1/build \
    PAYLOAD_SECRET=build-only \
    NEXT_PUBLIC_SERVER_URL=http://localhost
RUN pnpm build

FROM base AS run
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1
COPY --from=build /app /app
RUN mkdir -p /app/public/media /app/data /app/backups
EXPOSE 3000
CMD ["sh", "/app/docker/entrypoint.sh"]
