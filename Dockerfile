FROM node:22-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g pnpm@9

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY rspress.config.ts tsconfig.json ./
COPY docs docs

FROM base AS builder
RUN pnpm run build

### App ###
FROM nginxinc/nginx-unprivileged:stable-alpine AS app

COPY --from=builder /app/doc_build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

USER root
RUN chown -R nginx:nginx /usr/share/nginx/html
USER nginx