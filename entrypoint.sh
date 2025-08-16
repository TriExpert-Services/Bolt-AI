#!/usr/bin/env bash
set -euo pipefail

# .env.local requerido por bindings.sh
# Opción recomendada: MONTARLO desde EasyPanel (Config/Secret) en /app/.env.local
if [ ! -f /app/.env.local ]; then
  echo "⚠️  /app/.env.local no existe. Creándolo con variables de entorno presentes..."
  # Solo crea si tienes variables exportadas; añade/quita líneas según uses:
  {
    [ -n "${OPENAI_API_KEY:-}" ] && echo "OPENAI_API_KEY=${OPENAI_API_KEY}"
    [ -n "${ANTHROPIC_API_KEY:-}" ] && echo "ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}"
    [ -n "${GEMINI_API_KEY:-}" ] && echo "GEMINI_API_KEY=${GEMINI_API_KEY}"
    [ -n "${SUPABASE_URL:-}" ] && echo "SUPABASE_URL=${SUPABASE_URL}"
    [ -n "${SUPABASE_ANON_KEY:-}" ] && echo "SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}"
  } > /app/.env.local
fi

cd /app

# genera los bindings y arranca en 0.0.0.0:${PORT}
bindings="$(bash ./bindings.sh)"
echo "➡️  Iniciando Wrangler Pages Dev en 0.0.0.0:${PORT}"
exec ./node_modules/.bin/wrangler pages dev ./build/client ${bindings} --ip 0.0.0.0 --port "${PORT}"
