# ❗ Cambiamos de alpine -> debian (glibc)
FROM node:20-bookworm-slim

# Paquetes necesarios para wrangler/workerd
RUN apt-get update && apt-get install -y --no-install-recommends \
    bash ca-certificates libc++1 \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiamos sólo manifest para cache de deps
COPY package.json pnpm-lock.yaml* ./

# PNPM + deps (usa Corepack)
RUN corepack enable \
 && corepack prepare pnpm@latest --activate \
 && pnpm install --frozen-lockfile

# Copiamos el resto del código
COPY . .

# Build del proyecto
RUN chmod +x bindings.sh \
 && pnpm build

# Wrangler como devDependency (por si no quedó en el lock)
RUN pnpm add -D wrangler

# Puerto interno
ENV PORT=3000
# Evita telemetry de wrangler en contenedor
ENV WRANGLER_SEND_METRICS=false

# Entrypoint
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3000
CMD ["/entrypoint.sh"]
