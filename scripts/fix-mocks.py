#!/usr/bin/env python3
"""Transform mock seed ke bentuk DB-true (mismatch repair P1)."""
import re, pathlib

B = pathlib.Path('/home/z/my-project/shared/mock')

# 1. cities: province_name -> province
p = B / 'cities.ts'
t = p.read_text().replace('province_name:', 'province:')
p.write_text(t)

# 2. notifications: tambah link + channels setelah type
p = B / 'notifications.ts'
t = p.read_text()
t = re.sub(r"(\n    type: '[A-Z_]+',)",
           r"\1\n    link: null,\n    channels: '[\"IN_APP\"]',", t)
p.write_text(t)

# 3. eo-profiles: tambah description/address, buang updated_at
p = B / 'eo-profiles.ts'
t = p.read_text()
t = re.sub(r"(    org_name: '[^']+',)",
           r"\1\n    description: null,\n    address: null,", t)
t = re.sub(r"\n    updated_at: '[^']+',", '', t)
p.write_text(t)

# 4. worker-skills: category -> description (deskripsi singkat); worker_profile_id -> worker_id + kolom baru
desc = {
    "'Hospitality'": "'Layanan tamu dan keramaan acara'",
    "'Keamanan'": "'Pengamanan arus pengunjung'",
    "'Operasional'": "'Operasional pelaksanaan acara'",
    "'Audio Visual'": "'Penanganan suara dan panggung'",
    "'Penjualan'": "'Penjualan merchandise acara'",
}
p = B / 'worker-skills.ts'
t = p.read_text()
for k, v in desc.items():
    t = t.replace(f'category: {k}', f'description: {v}')
t = t.replace("    worker_profile_id: WORKER,",
              "    worker_id: WORKER,\n    source: 'SELF',\n    verified_by: null,\n    verified_at: null,")
p.write_text(t)

# 5. job-posts: buang filled_count & updated_at, tambah kolom baru + kategori per lowongan
cat = {
    'f7a8b9c0-d1e2-4d5f-9f60-929ba3b4c5d6': 'LAINNYA',       # Event Usher
    '1a2b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d': 'REGISTRASI',    # Registration Desk Seminar
    '2b3c4d5e-6f7a-4b8c-9d0e-1f2a3b4c5d6e': 'SECURITY',      # Crowd Marshal
    '3c4d5e6f-7a8b-4c9d-8e1f-2a3b4c5d6e7f': 'TEKNISI_AV',    # Sound Operator
    '6a7b8c9d-0e1f-4a2b-8c3d-4e5f6a7b8c9d': 'REGISTRASI',    # Ticketing
    '7b8c9d0e-1f2a-4b3c-9d4e-5f6a7b8c9d0e': 'CREW_LOGISTIK', # Stage Crew Jogja
    '8c9d0e1f-2a3b-4c4d-8e5f-6a7b8c9d0e1f': 'LAINNYA',       # Liaison Officer
    '9d0e1f2a-3b4c-4d5e-9f6a-7b8c9d0e1f2a': 'REGISTRASI',    # Registration Desk Healthcare
    '4d5e6f7a-8b9c-4d1e-9f2a-3b4c5d6e7f8a': 'LAINNYA',       # Merchandise Seller
    '5e6f7a8b-9c0d-4e2f-8a3b-4c5d6e7f8a9b': 'LAINNYA',       # Usher Gala
    'a1b2c3d4-e5f6-4a7b-8c9d-1e2f3a4b5c6d': 'TEKNISI_AV',    # Krew Sound Operator
    'b2c3d4e5-f6a7-4b8c-9d0e-2f3a4b5c6d7e': 'REGISTRASI',    # Usher & Registrasi
    'c3d4e5f6-a7b8-4c9d-8e1f-3a4b5c6d7e8f': 'CREW_LOGISTIK', # Stage Crew Panggung
}
p = B / 'job-posts.ts'
t = p.read_text()
t = re.sub(r"\n    filled_count: \d+,", '', t)
t = re.sub(r"\n    updated_at: '[^']+',", '', t)

def add_cols(m):
    block = m.group(0)
    rid = re.search(r"id: '([a-f0-9-]{36})'", block).group(1)
    catv = cat.get(rid, 'LAINNYA')
    block = re.sub(r"(    mechanism: '[A-Z]+',)",
                   rf"\1\n    category: '{catv}',\n    image_url: null,\n    dress_code: null,\n    briefing_note: null,\n    requirements_note: null,\n    location_name: null,", block)
    return block

t = re.sub(r"\{\n    id: '[a-f0-9-]{36}',.*?\n  \},", add_cols, t, flags=re.S)
p.write_text(t)

# 6. job-applications: buang updated_at; lamaran + note/decided_at; penugasan + applied_via dll
p = B / 'job-applications.ts'
t = p.read_text()
# lamaran: simpan nilai updated_at sebagai decided_at untuk ACCEPTED/REJECTED
dec = {}
def capture(m):
    block = m.group(0)
    rid = re.search(r"id: '([a-f0-9-]{36})'", block).group(1)
    st = re.search(r"status: '([A-Z_]+)'", block).group(1)
    upd = re.search(r"updated_at: '([^']+)'", block)
    dec[rid] = (st, upd.group(1) if upd else None)
    return block
t = re.sub(r"\{\n    id: '6f7a8b9c.*?\n  \},", capture, t, flags=re.S)
# terapkan pada blok lamaran saja (6 blok pertama setelah jobApplicationRows)
def apps(m):
    block = m.group(0)
    rid = re.search(r"id: '([a-f0-9-]{36})'", block).group(1)
    st, upd = dec.get(rid, ('SUBMITTED', None))
    decided = f"decided_at: '{upd}'," if (st in ('ACCEPTED', 'REJECTED') and upd) else 'decided_at: null,'
    block = re.sub(r"\n    updated_at: '[^']+',", '', block)
    block = re.sub(r"(    status: '[A-Z_]+',)",
                   rf"\1\n    note: null,\n    {decided}", block)
    return block
t = re.sub(r"\{\n    id: '[a-f0-9-]{36}',.*?\n  \},", apps, t, flags=re.S)
# penugasan: dua blok COMPLETED di akhir
def assign(m):
    block = m.group(0)
    block = re.sub(r"\n    updated_at: '[^']+',", '', block)
    block = re.sub(r"(    status: 'COMPLETED',)",
                   r"\1\n    applied_via: 'APPLICATION',\n    cancel_reason: null,\n    completed_at: null,\n    checked_in_at: null,\n    checked_out_at: null,", block)
    return block
t = re.sub(r"\{\n    id: 'a0b1c2d3.*?\n  \},\n  \{\n    id: 'b1c2d3e4.*?\n  \},", assign, t, flags=re.S)
p.write_text(t)

print("OK — semua mock ditransform")
