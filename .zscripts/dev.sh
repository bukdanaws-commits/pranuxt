#!/usr/bin/env bash
# PEKERJA EVENT — skrip dev untuk sandbox (port 3000 via gateway preview).
# Dipakai oleh init-fullstack.sh dan dijalankan manual dengan nohup.
set -e
cd /home/z/my-project
exec >> /home/z/my-project/dev.log 2>&1
echo "[dev.sh] $(date '+%F %T') install dependencies (jika perlu)..."
bun install
echo "[dev.sh] $(date '+%F %T') menjalankan nuxt dev di port 3000..."
exec bun run dev
