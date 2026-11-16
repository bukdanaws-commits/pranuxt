#!/usr/bin/env python3
"""Generate SQL migrasi runnable untuk SEMUA 67 tabel dari dump Supabase.

Output: supabase/migrations/0001_full_schema.sql — siap dijalankan lewat
Supabase SQL Editor (dashboard) karena sandbox tidak punya akses TCP 5432.

Perbaikan dari dump konteks:
- Urut tabel topologis sesuai FK (tidak ada FK ke tabel yang belum ada)
- app_now() -> now() (fungsi custom tidak dibuat)
- CREATE TABLE IF NOT EXISTS agar idempotent
"""
import re, pathlib

DUMP = pathlib.Path('/home/z/my-project/upload/Pasted Content_1794816151157.txt')
OUT = pathlib.Path('/home/z/my-project/supabase/migrations/0001_full_schema.sql')
OUT.parent.mkdir(parents=True, exist_ok=True)

sql = DUMP.read_text()
blocks: dict[str, str] = {}
for m in re.finditer(r'CREATE TABLE public\.([a-z_]+) \(([\s\S]*?)\n\);', sql):
    blocks[m.group(1)] = m.group(0)

def deps(name: str, body: str) -> set[str]:
    refs = set(re.findall(r'REFERENCES public\.([a-z_]+)', body))
    refs.discard(name)
    return refs

# topological sort (Kahn)
placed: list[str] = []
pending = dict(blocks)
while pending:
    ready = [n for n, b in pending.items() if deps(n, b) <= set(placed)]
    if not ready:
        raise SystemExit(f'FK circular / missing di: {sorted(pending)}')
    for n in sorted(ready):
        placed.append(n)
        del pending[n]

lines = [
    '-- PEKERJA EVENT — skema lengkap 67 tabel (migrasi tunggal, idempotent).',
    '-- Sumber: dump skema produksi; ditata ulang topologis sesuai FK dan',
    '-- app_now() diganti now(). Jalankan di Supabase SQL Editor SEKALI.',
    '-- Lalu isi data: bun scripts/seed-supabase.ts',
    '',
]
for name in placed:
    body = blocks[name].replace('CREATE TABLE public.', 'CREATE TABLE IF NOT EXISTS public.')
    body = body.replace('app_now()', 'now()')
    lines.append(body)
    lines.append('')

# Catat migrasi ke tabel internal bila ada
lines += [
    "INSERT INTO public._pe_migrations (name) VALUES ('0001_full_schema') ON CONFLICT (name) DO NOTHING;",
    '',
]
OUT.write_text('\n'.join(lines))
print(f'OK — {len(placed)} tabel urut topologis -> {OUT}')
print('Urutan 10 pertama:', placed[:10])
