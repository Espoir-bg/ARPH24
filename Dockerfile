FROM node:22-bookworm-slim

ENV PNPM_HOME="/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"

RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

RUN corepack enable \
    && corepack prepare pnpm@10.15.1 --activate

WORKDIR /app

COPY . .

RUN pnpm install --no-frozen-lockfile \
    && pnpm --filter @arph24/api prisma:generate \
    && pnpm --filter @arph24/api build

ENV NODE_ENV=production
ENV API_HOST=0.0.0.0

EXPOSE 3000

CMD ["sh", "-c", "pnpm --filter @arph24/api prisma:deploy && node apps/api/dist/main.js"]
