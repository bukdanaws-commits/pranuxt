#!/usr/bin/env bash
# Verifikasi browser PEKERJA EVENT (W4) — dev server + agent-browser.
# Teknik klik yang terbukti andal:
#   - tombol dengan teks ambigu/duplikat  -> agent-browser eval click (teks eksak)
#   - tombol unik                          -> find role button --name
set -u
cd /home/z/my-project

(test -f dev.pid && kill "$(cat dev.pid)" 2>/dev/null; rm -f dev.pid)
nohup bun run dev > dev.log 2>&1 &
echo $! > dev.pid
for i in $(seq 1 60); do
  code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/worker/dashboard || true)
  [ "$code" = "200" ] && break
  sleep 1
done
echo "SERVER_READY=$code"

S=/tmp/pe-screens
mkdir -p $S
agent-browser set viewport 1440 900 >/dev/null 2>&1

# ===== Dashboard Worker =====
agent-browser open http://localhost:3000/worker/dashboard >/dev/null 2>&1
sleep 5
agent-browser screenshot $S/01-dashboard.png >/dev/null
agent-browser eval "[...document.querySelectorAll('button')].find(b => b.textContent?.trim() === 'Lihat Detail')?.click()" >/dev/null
sleep 2
agent-browser screenshot $S/02-detail-modal.png >/dev/null
agent-browser eval "[...document.querySelectorAll('button')].find(b => b.textContent?.trim() === 'Tutup')?.click()" >/dev/null
sleep 1
agent-browser eval "[...document.querySelectorAll('button')].find(b => b.textContent?.trim() === 'Lamar')?.click()" >/dev/null
sleep 2
agent-browser screenshot $S/03-apply-modal.png >/dev/null
agent-browser eval "[...document.querySelectorAll('button')].find(b => b.textContent?.trim() === 'Ya, Kirim Lamaran')?.click()" >/dev/null
sleep 1.5
agent-browser screenshot $S/04-apply-toast.png >/dev/null

# ===== Lowongan: filter + detail =====
agent-browser open http://localhost:3000/worker/lowongan >/dev/null 2>&1
sleep 5
agent-browser screenshot $S/05-lowongan.png >/dev/null
agent-browser find first "input" fill "konser" >/dev/null 2>&1
sleep 1.5
agent-browser screenshot $S/06-lowongan-filter.png >/dev/null
agent-browser eval "[...document.querySelectorAll('button')].find(b => b.textContent?.trim() === 'Reset Filter')?.click()" >/dev/null
sleep 1
agent-browser eval "[...document.querySelectorAll('button')].find(b => b.textContent?.trim() === 'Lihat Detail')?.click()" >/dev/null
sleep 2
agent-browser screenshot $S/07-lowongan-detail.png >/dev/null

# ===== Lamaran: tarik lamaran (guard transisi) =====
agent-browser open http://localhost:3000/worker/lamaran >/dev/null 2>&1
sleep 5
agent-browser screenshot $S/08-lamaran.png >/dev/null
agent-browser eval "[...document.querySelectorAll('button')].find(b => b.textContent?.trim() === 'Tarik')?.click()" >/dev/null
sleep 2
agent-browser screenshot $S/09-withdraw-modal.png >/dev/null
agent-browser eval "[...document.querySelectorAll('button')].find(b => b.textContent?.trim() === 'Ya, Tarik Lamaran')?.click()" >/dev/null
sleep 1.5
agent-browser screenshot $S/10-withdraw-result.png >/dev/null

# ===== Profil: simpan perubahan =====
agent-browser open http://localhost:3000/worker/profil >/dev/null 2>&1
sleep 5
agent-browser screenshot $S/11-profil.png >/dev/null
agent-browser find role button click --name "Simpan Perubahan" >/dev/null 2>&1
sleep 2
agent-browser screenshot $S/12-profil-simpan.png >/dev/null

# ===== Dashboard lain (placeholder) + role-switcher =====
agent-browser open http://localhost:3000/eo/dashboard >/dev/null 2>&1
sleep 4
agent-browser screenshot $S/13-eo-dashboard.png >/dev/null
agent-browser open http://localhost:3000/admin/kyc >/dev/null 2>&1
sleep 3
agent-browser screenshot $S/14-admin-kyc.png >/dev/null
agent-browser open http://localhost:3000/worker/dashboard >/dev/null 2>&1
sleep 3
agent-browser find text "Rina Maulida" click >/dev/null 2>&1
sleep 1.5
agent-browser screenshot $S/16-user-menu.png >/dev/null
agent-browser find text "Masuk sebagai EO" click >/dev/null 2>&1
sleep 4
echo "SWITCH_URL=$(agent-browser get url)"
agent-browser screenshot $S/17-switch-eo.png >/dev/null

echo "===PAGE ERRORS==="
agent-browser errors 2>&1 | head -10
echo "===DEV LOG ERRORS==="
rg -i "ERROR" dev.log | head -5 || echo "dev.log bersih"
echo "SELESAI — screenshot di $S"
