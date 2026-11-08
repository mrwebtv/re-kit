# Production image. The Next.js build runs when the container starts,
# because the template pre-renders pages from the database.
FROM node:22-alpine
RUN apk add --no-cache libc6-compat && corepack enable pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
EXPOSE 3000
CMD ["sh", "-c", "pnpm payload migrate && pnpm build && NODE_ENV=production pnpm start"]
