#!/bin/bash
set -euo pipefail

# PEKERJA EVENT (Nuxt 4) — dev.sh versi proyek ini.
# Meniru pola template fullstack resmi: bun install → dev server di background →
# tunggu port 3000 → health check → disown + keluar (server hidup di tree boot).
# Catatan: tanpa langkah db:push — project memakai mock-first, bukan Prisma.

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$PROJECT_DIR"

if ! command -v bun >/dev/null 2>&1; then
  echo "ERROR: bun is not installed or not in PATH"
  exit 1
fi

echo "[$(date '+%Y-%m-%d %H:%M:%S')] bun install"
bun install

# Bersihkan proses dev lama bila ada (hindari bentrok port 3000)
pkill -f "nuxt dev" 2>/dev/null || true
sleep 1

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Starting Nuxt dev server (port 3000)"
bun run dev > "$PROJECT_DIR/dev.log" 2>&1 &
DEV_PID=$!

for i in $(seq 1 90); do
  if curl -s --connect-timeout 2 --max-time 5 http://localhost:3000 >/dev/null 2>&1; then
    break
  fi
  sleep 1
done

# Health check tahan flake: halaman pertama butuh cold compile (bisa >5 detik)
HEALTH_OK=0
for i in 1 2 3 4 5; do
  if curl -fsS --max-time 30 http://localhost:3000 >/dev/null 2>&1; then
    HEALTH_OK=1
    break
  fi
  sleep 2
done
if [ "$HEALTH_OK" = "1" ]; then
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] Health check OK — Nuxt dev server running (PID: $DEV_PID)"
else
  echo "WARN: health check belum lolos (cold compile mungkin masih jalan) — server tetap dibiarkan hidup"
fi

disown "$DEV_PID" 2>/dev/null || true
unset DEV_PID
