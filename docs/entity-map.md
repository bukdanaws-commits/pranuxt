# Peta Entitas PEKERJA EVENT — 67 Tabel (snapshot DB Supabase production)

> Sumber: dump skema Supabase project `lvruibrtkwbyithkksug` (2026-11-16).
> Salinan ter-track di repo dari `skills/pekerja-event-data-standard/references/entity-map.md`
> (41 tabel terkunci) **+ 26 tabel baru** yang sudah diprovision di database.
> Kontrak TypeScript lengkap per tabel: `shared/data/contracts/schema.ts`.
>
> Penanda: kolom `uuid` di seed = `<uuid>`; status ⚠️ = draft modul baru.

## Bagian A — Modul Inti (25 tabel)

Identitas & akses: `profiles`¹, `roles`, `user_roles`, `worker_profiles`¹, `eo_profiles`¹,
`instructor_profiles`. Kompetensi & pelatihan: `cities`¹, `competencies`¹, `trainings`¹,
`training_sessions`, `training_registrations`¹, `training_attendances`, `training_assessments`.
Workforce: `job_posts`¹, `job_requirements`, `job_applications`¹, `job_assignments`¹.
Reviews & komunikasi: `notifications`¹, `reviews`, `reports`. Verifikasi: `verification_requests`,
`documents`. Audit & admin: `audit_logs`, `moderation_actions`, `platform_settings`.

¹ **Perkaya kolom vs peta 41 asli** (sudah ada di DB, ikut di kontrak TS):
- `profiles`: + `auth_user_id` (unique), + `kyc_status` (`NOT_SUBMITTED|PENDING|UNDER_REVIEW|APPROVED|REJECTED`), tanpa `updated_at`
- `worker_profiles`: + `portfolio_url`, `desired_positions`, `expected_wage`
- `eo_profiles`: + `description`, `address`
- `cities`: kolom `province` (bukan `province_name`)
- `competencies`: + `description`, tanpa `category`
- `trainings`: + `image_url`, status + `PENDING_REVIEW|TAKEN_DOWN`, + `moderation_note/moderated_at/moderated_by_id`
- `training_registrations`: + pembayaran (`payment_method`, `payment_reference`, `payment_proof_url`, `paid_at`, `payment_payload`, `payment_expires_at`, `fee_rate`, `fee_amount`, `net_amount`), `payment_status` + `REFUNDED`
- `job_posts`: + `image_url`, `location_name`, `dress_code`, `briefing_note`, `requirements_note`, `duration_days` (1–30), `category` (`FOTOGRAFER_VIDEO|CREW_LOGISTIK|MC_HOST|TEKNISI_AV|REGISTRASI|FNB|SECURITY|LAINNYA`), status + `PENDING_REVIEW|TAKEN_DOWN`, + `moderation_note/moderated_at/moderated_by_id`; **tanpa `filled_count`** (dihitung dari `job_assignments`)
- `job_applications`: + `note`, `decided_at`, tanpa `updated_at`
- `job_assignments`: + `applied_via` (NOT NULL), `cancel_reason`, `completed_at`, `checked_in_at`, `checked_out_at`
- `notifications`: + `link`, + `channels` (text jsonb, default `["IN_APP"]`)
- `moderation_actions`: `action` + `APPROVE|REJECT`

## Bagian B — Vendor & Procurement (16 tabel, keputusan D1/D6/D7)

`vendor_profiles`, `vendor_members`, `vendor_categories`, `vendor_category_map`,
`vendor_catalog_items`, `rfqs`, `rfq_invitations`, `quotations`, `quotation_items`,
`purchase_orders`, `purchase_order_items`, `contracts`, `deliveries`, `delivery_items`,
`vendor_payments`, `commission_invoices` — bentuk sesuai peta terkunci v1.0 (tanpa perubahan).

## Bagian C — 26 Tabel Baru (diprovision di Supabase, dicatat sesuai §6)

### C1. Kompetensi & pelatihan pelengkap (5)

| # | Tabel | Kolom kunci | Status/enum | Catatan |
|---|---|---|---|---|
| 42 | `worker_skills` | `worker_id` → profiles, `competency_id`, `verified_by?` | `source`: `SELF|ASSESSMENT|CERTIFICATE`; `status`: `CLAIMED|VERIFIED|REVOKED` | FK ke **profiles.id**, bukan worker_profiles — dasar pencocokan kelayakan lowongan (P10) |
| 43 | `competency_assessments` | `worker_id`, `competency_id`, `assessor_id?`, `score?` (0–100) | `method`: `PRACTICAL|PORTFOLIO|INTERVIEW|WRITTEN`; `status`: `PENDING|PASSED|FAILED|CANCELLED` | Pengajuan asesmen kompetensi |
| 44 | `certificates` | `certificate_number` uq, `worker_id`, `registration_id` uq, `training_id`, `competency_id?`, `issued_by_id` | `status`: `ACTIVE|REVOKED` + `revoked_*` | Sertifikat lahir dari registrasi pelatihan lulus |
| 45 | `training_materials` | `training_id`, `session_id?`, `title`, `sort_order` | `material_type`: `FILE|LINK|VIDEO|DOCUMENT` | Materi per sesi; url atau storage_path |
| 46 | `course_refunds` | `refund_number` uq, `registration_id` uq, `instructor_id`, `worker_id`, `requested_by_id` | `requester_role`: `WORKER|INSTRUCTOR|ADMIN`; `status`: `PENDING|APPROVED|TRANSFERRED|REJECTED|CANCELLED` | `fee_reversal` + `net_reversal` integer rupiah |

### C2. KYC (4)

| # | Tabel | Kolom kunci | Status/enum | Catatan |
|---|---|---|---|---|
| 47 | `kyc_profiles` | `user_id` uq, `full_name`, `nik_cipher`, `nik_hash` uq (sha256 hex), `consent_version/at` | — | NIK tidak pernah plaintext; reviewed oleh admin |
| 48 | `kyc_documents` | `user_id`, `document_type`: `KTP_PHOTO|SELFIE_KTP`, `storage_path` | `verification_status`: `PENDING|VERIFIED|REJECTED` | + `ocr_meta` |
| 49 | `kyc_social_accounts` | `user_id`, `platform`: `INSTAGRAM|FACEBOOK`, `username` | `verification_status`: `SUBMITTED|VERIFIED|REJECTED` | — |
| 50 | `kyc_reviews` | `user_id`, `reviewer_id` | `decision`: `APPROVED|REJECTED` | Keputusan akhir reviewer |

### C3. Pembayaran event & upah worker (9)

| # | Tabel | Kolom kunci | Status/enum | Catatan |
|---|---|---|---|---|
| 51 | `payment_profiles` | `user_id` uq, `bank_code`, `account_holder_name`, `account_number` (regex 8–20 digit) | `verification_status`: `PENDING|VERIFIED|REJECTED` | Rekening/QRIS tujuan payout; + `qris_payload/nmid/acquirer` |
| 52 | `event_payment_orders` | `invoice_number` uq, `job_post_id` uq, `eo_id`, `gross_amount`, `paid_amount` | `invoice_status`: `ISSUED|PAID|CANCELLED`; `settlement_mode`: `PLATFORM_QRIS|EO_DIRECT` | Satu invoice per lowongan |
| 53 | `payment_transactions` | `payment_order_id`, `provider_key` (default `DEMO`), `amount` | `transaction_status`: `PENDING|SUCCEEDED|FAILED|EXPIRED|CANCELLED` | + `qris_payload`, `expires_at` |
| 54 | `assignment_verifications` | `assignment_id` uq, `eo_verified_by_id`, `admin_approved_by_id` | `eo_status`/`admin_status`: `PENDING|APPROVED|REJECTED` | Gerbang dua lapis sebelum upah dilepas |
| 55 | `assignment_payout_exceptions` | `assignment_id` uq, `resolved_by_id` | `resolution_status`: `PENDING|CLOSED_NO_PAYOUT` | Pengecualian worker tidak hadir dll. |
| 56 | `worker_payment_allocations` | `payment_order_id`, `assignment_id` uq, `worker_id`, `gross_amount`, `platform_fee_rate` numeric(5,2) default 10.00, `platform_fee_amount`, `worker_net_amount` | `allocation_status`: `PENDING_VERIFICATION|READY_FOR_PAYOUT|IN_PAYOUT|PAID|ON_HOLD|CANCELLED` | Pecahan upah: gross − fee platform = net |
| 57 | `event_payout_releases` | `payment_order_id` uq, `total/approved/exception_assignments`, `approved_by_id` | `release_status`: `BLOCKED|READY|RELEASED` | Gate rilis dana per event |
| 58 | `worker_payouts` | `payment_order_id`, `allocation_id` uq, `worker_id`, `payment_profile_id?`, `payout_amount`, `transferred_by_id`, `confirmed_by_id` | `payout_status`: `PREPARED|TRANSFERRED|CONFIRMED|FAILED|CANCELLED`; `payer_role`: `PLATFORM|EO`; `payment_method`: `QRIS|TRANSFER` | Snapshot rekening beneficiary saat payout |
| 59 | `event_fee_invoices` | `fee_invoice_number` uq, `payment_order_id` uq, `eo_id`, `base_amount`, `rate` numeric(5,2) default 10.00 | `status`: `UNPAID|PAID|VOID` | Tagihan fee platform ke EO |

### C4. Penarikan instruktur & batch payout (3)

| # | Tabel | Kolom kunci | Status/enum | Catatan |
|---|---|---|---|---|
| 60 | `instructor_withdrawals` | `withdrawal_number` uq, `instructor_id`, `training_id?`, `payment_profile_id?` | `status`: `PENDING|APPROVED|TRANSFERRED|CONFIRMED|REJECTED|CANCELLED` | + `payout_batch_id?` |
| 61 | `payout_batches` | `batch_number` uq, `created_by_id`, `item_count`, `total_amount`, `needs_checker` | `status`: `PENDING_APPROVAL|APPROVED|REJECTED|CANCELLED` | Maker-checker: pembuat ≠ penyetuju |
| 62 | `payment_approvals` | `context_type`: `WITHDRAWAL|PAYOUT_BATCH`, `context_id`, `maker_id`, `checker_id?` | `status`: `PENDING|APPROVED|VOIDED` | Pola polymorphic (FK tak tertegakkan — validasi di kontrak TS) |

### C5. Ledger & webhook (3)

| # | Tabel | Kolom kunci | Status/enum | Catatan |
|---|---|---|---|---|
| 63 | `ledger_accounts` | `code` uq, `name` | `account_type`: `ASSET|LIABILITY|REVENUE` | Buku besar platform |
| 64 | `ledger_entries` | `context_type`: `COURSE_PAID|COURSE_REFUND|WITHDRAWAL_APPROVED|WITHDRAWAL_REJECTED_REVERSAL|WITHDRAWAL_TRANSFERRED`, `context_id`, `account_id` | `side`: `DEBIT|KREDIT` | Polymorphic; side `KREDIT` (bukan CREDIT) — kesepakatan penulisan |
| 65 | `bank_webhook_events` | `provider_key` (default `DEMO`), `event_type`: `TRAINING_SETTLE|EVENT_SETTLE|FEE_SETTLE|PAYOUT_SETTLE`, `raw_body` | `process_status`: `RECEIVED|PROCESSED|REJECTED|DUPLICATE` | Log webhook bank mentah + `related_id`, `error_note` |

### C6. Infrastruktur (2)

| # | Tabel | Kolom kunci | Catatan |
|---|---|---|---|
| 66 | `_pe_migrations` | `name` (PK), `applied_at` | Catatan migrasi milik platform (bukan supabase_migrations) |
| 67 | `notification_deliveries` | `notification_id`, `channel`: `IN_APP|EMAIL|WHATSAPP` | `status`: `PENDING|SENT|FAILED|SKIPPED` — jejak pengiriman multi-kanal |

## Aturan konsistensi lintas-tabel (tetap terkunci)

1. Setiap FK `*_id` bertipe `uuid` dan menunjuk `id` tabel yang disebut.
2. Semua tabel punya `created_at timestamptz default now()`; tabel mutable punya `updated_at` — **kecuali** yang di DB nyata tidak memilikinya (profiles, worker_profiles, eo_profiles, job_posts, job_applications, cities, competencies, dll. — kontrak TS mengikuti DB).
3. `worker_id`/`user_id` menunjuk `profiles.id`, bukan `worker_profiles.id`.
4. Status UPPERCASE + CHECK; TS union di `shared/constants/enums.ts` (domain lama) dan `shared/data/contracts/schema.ts` (domain baru) harus identik dengan CHECK.
5. Uang integer rupiah; rate `numeric(5,2)` persen.
