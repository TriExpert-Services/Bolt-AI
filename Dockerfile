FROM node:20-alpine

# utilidades
RUN apk add --no-cache bash

WORKDIR /app
COPY package.json pnpm-lock.yaml* ./

# PNPM + deps
RUN corepack enable && corepack prepare pnpm@latest --activate && pnpm i

# copia código
COPY . .

# build de bolt
RUN pnpm build \
 && pnpm add -D wrangler \
 && chmod +x bindings.sh

# puerto para EasyPanel
ENV PORT=3000

# EntryPoint hace: genera bindings y arranca wrangler pages dev
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3000
CMD ["/entrypoint.sh"]
