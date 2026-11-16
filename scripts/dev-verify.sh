#!/usr/bin/env bash
# dev-verify.sh — jalankan dev server + warm-up semua rute worker + screenshot.
# Dipakai dalam SATU sesi tool-call karena sandbox mengakhiri proses latar
# saat panggilan berakhir (lihat catatan Preview Panel di README percakapan).
set -u
cd /home/z/my-project

PORT=3000
BASE="http://localhost:$PORT"

echo "== 1. Matikan dev server lama =="
pkill -f "nuxt dev" 2>/dev/null && sleep 2 || true

echo "== 2. Bersihkan cache bila ada sisa korup =="
rm -rf .nuxt/node_modules 2>/dev/null || true

echo "== 3. Start dev server =="
setsid nohup bun run dev > dev.log 2>&1 < /dev/null &
echo "dev server PID: $!"

echo "== 4. Tunggu /worker/dashboard 200 (maks 150 iterasi) =="
OK=""
for i in $(seq 1 150); do
  CODE=$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 "$BASE/worker/dashboard" 2>/dev/null || echo 000)
  if [ "$CODE" = "200" ]; then OK=yes; echo "iterasi $i: 200 OK"; break; fi
  if [ $((i % 10)) -eq 0 ]; then echo "iterasi $i: $CODE (menunggu compile...)"; fi
  sleep 2
done
if [ -z "$OK" ]; then
  echo "!! DEV SERVER GAGAL — 50 baris terakhir dev.log:"
  tail -50 dev.log
  exit 1
fi

echo "== 5. Warm-up semua rute =="
ROUTES="/ /worker/dashboard /worker/lowongan /worker/lamaran /worker/profil /worker/penugasan /worker/notifikasi /worker/upah /worker/rekening /worker/paspor-kompetensi /worker/sertifikat /worker/pelatihan /worker/verifikasi /worker/pengaduan"
FAIL=""
for r in $ROUTES; do
  CODE=$(curl -s -o /dev/null -w '%{http_code}' --max-time 30 "$BASE$r")
  echo "$CODE $r"
  [ "$CODE" != "200" ] && FAIL="$FAIL $r($CODE)"
done
if [ -n "$FAIL" ]; then
  echo "!! RUTE GAGAL:$FAIL"
  tail -30 dev.log
  exit 1
fi

echo "== 6. Screenshot agent-browser =="
rm -rf /tmp/render && mkdir -p /tmp/render
agent-browser set viewport 1440 900 >/dev/null 2>&1
agent-browser open "$BASE/worker/dashboard" >/dev/null 2>&1
agent-browser wait --load networkidle >/dev/null 2>&1
sleep 2
agent-browser screenshot /tmp/render/dashboard-full.png --full
agent-browser screenshot /tmp/render/dashboard-top.png
agent-browser scroll down 900
sleep 1
agent-browser screenshot /tmp/render/dashboard-mid.png
agent-browser scroll down 900
sleep 1
agent-browser screenshot /tmp/render/dashboard-bottom.png
agent-browser open "$BASE/worker/penugasan" >/dev/null 2>&1
agent-browser wait --load networkidle >/dev/null 2>&1
sleep 1
agent-browser screenshot /tmp/render/penugasan.png --full
agent-browser open "$BASE/worker/notifikasi" >/dev/null 2>&1
agent-browser wait --load networkidle >/dev/null 2>&1
sleep 1
agent-browser screenshot /tmp/render/notifikasi.png --full
agent-browser close >/dev/null 2>&1
echo "== SELESAI — screenshot di /tmp/render =="
ls -la /tmp/render
