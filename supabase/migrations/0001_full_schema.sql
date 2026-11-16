-- PEKERJA EVENT — skema lengkap 67 tabel (migrasi tunggal, idempotent).
-- Sumber: dump skema produksi; ditata ulang topologis sesuai FK dan
-- app_now() diganti now(). Jalankan di Supabase SQL Editor SEKALI.
-- Lalu isi data: bun scripts/seed-supabase.ts

CREATE TABLE IF NOT EXISTS public._pe_migrations (
  name text NOT NULL,
  applied_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT _pe_migrations_pkey PRIMARY KEY (name)
);

CREATE TABLE IF NOT EXISTS public.bank_webhook_events (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  provider_key text NOT NULL DEFAULT 'DEMO'::text,
  event_type text NOT NULL CHECK (event_type = ANY (ARRAY['TRAINING_SETTLE'::text, 'EVENT_SETTLE'::text, 'FEE_SETTLE'::text, 'PAYOUT_SETTLE'::text])),
  raw_body text NOT NULL CHECK (char_length(raw_body) > 0),
  source_ip text,
  process_status text NOT NULL DEFAULT 'RECEIVED'::text CHECK (process_status = ANY (ARRAY['RECEIVED'::text, 'PROCESSED'::text, 'REJECTED'::text, 'DUPLICATE'::text])),
  related_id text,
  error_note text,
  processed_at timestamp with time zone,
  CONSTRAINT bank_webhook_events_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.cities (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  name text NOT NULL,
  province text NOT NULL,
  CONSTRAINT cities_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.competencies (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  CONSTRAINT competencies_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.ledger_accounts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  account_type text NOT NULL CHECK (account_type = ANY (ARRAY['ASSET'::text, 'LIABILITY'::text, 'REVENUE'::text])),
  is_active boolean NOT NULL DEFAULT true,
  CONSTRAINT ledger_accounts_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  phone text,
  photo_url text,
  status text NOT NULL DEFAULT 'ACTIVE'::text CHECK (status = ANY (ARRAY['ACTIVE'::text, 'SUSPENDED'::text])),
  auth_user_id uuid UNIQUE,
  kyc_status text NOT NULL DEFAULT 'NOT_SUBMITTED'::text CHECK (kyc_status = ANY (ARRAY['NOT_SUBMITTED'::text, 'PENDING'::text, 'UNDER_REVIEW'::text, 'APPROVED'::text, 'REJECTED'::text])),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS public.roles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  code text NOT NULL UNIQUE CHECK (code = ANY (ARRAY['worker'::text, 'eo'::text, 'instructor'::text, 'admin'::text, 'vendor'::text])),
  name text NOT NULL,
  CONSTRAINT roles_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.vendor_categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  CONSTRAINT vendor_categories_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  actor_id uuid,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  meta text,
  CONSTRAINT audit_logs_pkey PRIMARY KEY (id),
  CONSTRAINT audit_logs_actor_id_fkey FOREIGN KEY (actor_id) REFERENCES public.profiles(id)
);

CREATE TABLE IF NOT EXISTS public.competency_assessments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  worker_id uuid NOT NULL,
  competency_id uuid NOT NULL,
  requested_note text,
  method text CHECK (method = ANY (ARRAY['PRACTICAL'::text, 'PORTFOLIO'::text, 'INTERVIEW'::text, 'WRITTEN'::text])),
  status text NOT NULL DEFAULT 'PENDING'::text CHECK (status = ANY (ARRAY['PENDING'::text, 'PASSED'::text, 'FAILED'::text, 'CANCELLED'::text])),
  assessor_id uuid,
  score integer CHECK (score >= 0 AND score <= 100),
  result_note text,
  decided_at timestamp with time zone,
  CONSTRAINT competency_assessments_pkey PRIMARY KEY (id),
  CONSTRAINT competency_assessments_worker_id_fkey FOREIGN KEY (worker_id) REFERENCES public.profiles(id),
  CONSTRAINT competency_assessments_competency_id_fkey FOREIGN KEY (competency_id) REFERENCES public.competencies(id),
  CONSTRAINT competency_assessments_assessor_id_fkey FOREIGN KEY (assessor_id) REFERENCES public.profiles(id)
);

CREATE TABLE IF NOT EXISTS public.documents (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  owner_id uuid NOT NULL,
  type text NOT NULL,
  name text,
  url text NOT NULL,
  CONSTRAINT documents_pkey PRIMARY KEY (id),
  CONSTRAINT documents_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.profiles(id)
);

CREATE TABLE IF NOT EXISTS public.eo_profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id uuid NOT NULL UNIQUE,
  org_name text NOT NULL,
  description text,
  address text,
  is_verified boolean NOT NULL DEFAULT false,
  CONSTRAINT eo_profiles_pkey PRIMARY KEY (id),
  CONSTRAINT eo_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);

CREATE TABLE IF NOT EXISTS public.instructor_profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id uuid NOT NULL UNIQUE,
  institution_name text,
  expertise text,
  is_verified boolean NOT NULL DEFAULT false,
  CONSTRAINT instructor_profiles_pkey PRIMARY KEY (id),
  CONSTRAINT instructor_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);

CREATE TABLE IF NOT EXISTS public.job_posts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  eo_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  event_name text NOT NULL,
  event_date date NOT NULL,
  start_time time without time zone,
  end_time time without time zone,
  city_id uuid,
  location_name text,
  wage bigint NOT NULL DEFAULT 0 CHECK (wage >= 0),
  slot_count integer NOT NULL DEFAULT 1 CHECK (slot_count > 0),
  mechanism text NOT NULL DEFAULT 'APPLICATION'::text CHECK (mechanism = ANY (ARRAY['DIRECT'::text, 'APPLICATION'::text])),
  dress_code text,
  briefing_note text,
  requirements_note text,
  status text NOT NULL DEFAULT 'DRAFT'::text CHECK (status = ANY (ARRAY['DRAFT'::text, 'PENDING_REVIEW'::text, 'OPEN'::text, 'CLOSED'::text, 'CANCELLED'::text, 'TAKEN_DOWN'::text])),
  image_url text,
  duration_days integer NOT NULL DEFAULT 1 CHECK (duration_days >= 1 AND duration_days <= 30),
  category text NOT NULL DEFAULT 'LAINNYA'::text CHECK (category = ANY (ARRAY['FOTOGRAFER_VIDEO'::text, 'CREW_LOGISTIK'::text, 'MC_HOST'::text, 'TEKNISI_AV'::text, 'REGISTRASI'::text, 'FNB'::text, 'SECURITY'::text, 'LAINNYA'::text])),
  moderation_note text,
  moderated_at timestamp with time zone,
  moderated_by_id uuid,
  CONSTRAINT job_posts_pkey PRIMARY KEY (id),
  CONSTRAINT job_posts_eo_id_fkey FOREIGN KEY (eo_id) REFERENCES public.profiles(id),
  CONSTRAINT job_posts_city_id_fkey FOREIGN KEY (city_id) REFERENCES public.cities(id)
);

CREATE TABLE IF NOT EXISTS public.kyc_documents (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id uuid NOT NULL,
  document_type text NOT NULL CHECK (document_type = ANY (ARRAY['KTP_PHOTO'::text, 'SELFIE_KTP'::text])),
  storage_path text NOT NULL,
  mime_type text,
  size_bytes bigint CHECK (size_bytes IS NULL OR size_bytes >= 0),
  verification_status text NOT NULL DEFAULT 'PENDING'::text CHECK (verification_status = ANY (ARRAY['PENDING'::text, 'VERIFIED'::text, 'REJECTED'::text])),
  ocr_meta text,
  reviewed_by_id uuid,
  reviewed_at timestamp with time zone,
  CONSTRAINT kyc_documents_pkey PRIMARY KEY (id),
  CONSTRAINT kyc_documents_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  CONSTRAINT kyc_documents_reviewed_by_id_fkey FOREIGN KEY (reviewed_by_id) REFERENCES public.profiles(id)
);

CREATE TABLE IF NOT EXISTS public.kyc_profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id uuid NOT NULL UNIQUE,
  full_name text NOT NULL CHECK (char_length(TRIM(BOTH FROM full_name)) >= 2),
  nik_cipher text NOT NULL,
  nik_hash text NOT NULL UNIQUE CHECK (nik_hash ~ '^[0-9a-f]{64}$'::text),
  place_of_birth text,
  date_of_birth date,
  address text,
  consent_version text NOT NULL DEFAULT 'V1'::text,
  consent_at timestamp with time zone NOT NULL DEFAULT now(),
  submitted_at timestamp with time zone,
  reviewed_at timestamp with time zone,
  reviewed_by_id uuid,
  rejection_reason text,
  CONSTRAINT kyc_profiles_pkey PRIMARY KEY (id),
  CONSTRAINT kyc_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  CONSTRAINT kyc_profiles_reviewed_by_id_fkey FOREIGN KEY (reviewed_by_id) REFERENCES public.profiles(id)
);

CREATE TABLE IF NOT EXISTS public.kyc_reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id uuid NOT NULL,
  reviewer_id uuid NOT NULL,
  decision text NOT NULL CHECK (decision = ANY (ARRAY['APPROVED'::text, 'REJECTED'::text])),
  notes text,
  CONSTRAINT kyc_reviews_pkey PRIMARY KEY (id),
  CONSTRAINT kyc_reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  CONSTRAINT kyc_reviews_reviewer_id_fkey FOREIGN KEY (reviewer_id) REFERENCES public.profiles(id)
);

CREATE TABLE IF NOT EXISTS public.kyc_social_accounts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id uuid NOT NULL,
  platform text NOT NULL CHECK (platform = ANY (ARRAY['INSTAGRAM'::text, 'FACEBOOK'::text])),
  username text NOT NULL,
  profile_url text,
  verification_status text NOT NULL DEFAULT 'SUBMITTED'::text CHECK (verification_status = ANY (ARRAY['SUBMITTED'::text, 'VERIFIED'::text, 'REJECTED'::text])),
  CONSTRAINT kyc_social_accounts_pkey PRIMARY KEY (id),
  CONSTRAINT kyc_social_accounts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);

CREATE TABLE IF NOT EXISTS public.ledger_entries (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  context_type text NOT NULL CHECK (context_type = ANY (ARRAY['COURSE_PAID'::text, 'COURSE_REFUND'::text, 'WITHDRAWAL_APPROVED'::text, 'WITHDRAWAL_REJECTED_REVERSAL'::text, 'WITHDRAWAL_TRANSFERRED'::text])),
  context_id uuid NOT NULL,
  account_id uuid NOT NULL,
  side text NOT NULL CHECK (side = ANY (ARRAY['DEBIT'::text, 'KREDIT'::text])),
  amount bigint NOT NULL CHECK (amount > 0),
  memo text,
  CONSTRAINT ledger_entries_pkey PRIMARY KEY (id),
  CONSTRAINT ledger_entries_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.ledger_accounts(id)
);

CREATE TABLE IF NOT EXISTS public.moderation_actions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  admin_id uuid NOT NULL,
  action text NOT NULL CHECK (action = ANY (ARRAY['APPROVE'::text, 'REJECT'::text, 'TAKE_DOWN'::text, 'RESTORE'::text])),
  target_type text NOT NULL,
  target_id uuid NOT NULL,
  reason text NOT NULL,
  CONSTRAINT moderation_actions_pkey PRIMARY KEY (id),
  CONSTRAINT moderation_actions_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.profiles(id)
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id uuid NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  body text,
  link text,
  is_read boolean NOT NULL DEFAULT false,
  channels text NOT NULL DEFAULT '["IN_APP"]'::text CHECK (jsonb_typeof(channels::jsonb) = 'array'::text),
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);

CREATE TABLE IF NOT EXISTS public.payment_approvals (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  context_type text NOT NULL CHECK (context_type = ANY (ARRAY['WITHDRAWAL'::text, 'PAYOUT_BATCH'::text])),
  context_id uuid NOT NULL,
  maker_id uuid NOT NULL,
  maker_note text,
  checker_id uuid,
  checker_note text,
  amount bigint NOT NULL CHECK (amount > 0),
  status text NOT NULL DEFAULT 'PENDING'::text CHECK (status = ANY (ARRAY['PENDING'::text, 'APPROVED'::text, 'VOIDED'::text])),
  decided_at timestamp with time zone,
  CONSTRAINT payment_approvals_pkey PRIMARY KEY (id),
  CONSTRAINT payment_approvals_maker_id_fkey FOREIGN KEY (maker_id) REFERENCES public.profiles(id),
  CONSTRAINT payment_approvals_checker_id_fkey FOREIGN KEY (checker_id) REFERENCES public.profiles(id)
);

CREATE TABLE IF NOT EXISTS public.payment_profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id uuid NOT NULL UNIQUE,
  bank_code text NOT NULL,
  bank_name text NOT NULL,
  account_holder_name text NOT NULL CHECK (char_length(TRIM(BOTH FROM account_holder_name)) >= 2),
  account_number text NOT NULL CHECK (account_number ~ '^[0-9]{8,20}$'::text),
  bank_book_photo_url text,
  qris_photo_url text,
  qris_merchant_name text,
  verification_status text NOT NULL DEFAULT 'PENDING'::text CHECK (verification_status = ANY (ARRAY['PENDING'::text, 'VERIFIED'::text, 'REJECTED'::text])),
  verified_by_id uuid,
  verified_at timestamp with time zone,
  verification_note text,
  qris_payload text,
  qris_nmid text,
  qris_acquirer text,
  CONSTRAINT payment_profiles_pkey PRIMARY KEY (id),
  CONSTRAINT payment_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  CONSTRAINT payment_profiles_verified_by_id_fkey FOREIGN KEY (verified_by_id) REFERENCES public.profiles(id)
);

CREATE TABLE IF NOT EXISTS public.payout_batches (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  batch_number text NOT NULL UNIQUE,
  created_by_id uuid NOT NULL,
  item_count integer NOT NULL CHECK (item_count > 0),
  total_amount bigint NOT NULL CHECK (total_amount > 0),
  status text NOT NULL DEFAULT 'PENDING_APPROVAL'::text CHECK (status = ANY (ARRAY['PENDING_APPROVAL'::text, 'APPROVED'::text, 'REJECTED'::text, 'CANCELLED'::text])),
  needs_checker boolean NOT NULL DEFAULT true,
  approved_by_id uuid,
  approved_at timestamp with time zone,
  note text,
  CONSTRAINT payout_batches_pkey PRIMARY KEY (id),
  CONSTRAINT payout_batches_created_by_id_fkey FOREIGN KEY (created_by_id) REFERENCES public.profiles(id),
  CONSTRAINT payout_batches_approved_by_id_fkey FOREIGN KEY (approved_by_id) REFERENCES public.profiles(id)
);

CREATE TABLE IF NOT EXISTS public.platform_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  key text NOT NULL UNIQUE,
  value text NOT NULL,
  updated_by_id uuid,
  CONSTRAINT platform_settings_pkey PRIMARY KEY (id),
  CONSTRAINT platform_settings_updated_by_id_fkey FOREIGN KEY (updated_by_id) REFERENCES public.profiles(id)
);

CREATE TABLE IF NOT EXISTS public.reports (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  reporter_id uuid NOT NULL,
  target_type text NOT NULL,
  target_id uuid,
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'OPEN'::text CHECK (status = ANY (ARRAY['OPEN'::text, 'REVIEWING'::text, 'RESOLVED'::text, 'DISMISSED'::text])),
  handled_by_id uuid,
  resolution_note text,
  CONSTRAINT reports_pkey PRIMARY KEY (id),
  CONSTRAINT reports_reporter_id_fkey FOREIGN KEY (reporter_id) REFERENCES public.profiles(id),
  CONSTRAINT reports_handled_by_id_fkey FOREIGN KEY (handled_by_id) REFERENCES public.profiles(id)
);

CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  reviewer_id uuid NOT NULL,
  reviewee_id uuid NOT NULL,
  context_type text NOT NULL CHECK (context_type = ANY (ARRAY['ASSIGNMENT'::text, 'TRAINING'::text])),
  context_id uuid NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  CONSTRAINT reviews_pkey PRIMARY KEY (id),
  CONSTRAINT reviews_reviewer_id_fkey FOREIGN KEY (reviewer_id) REFERENCES public.profiles(id),
  CONSTRAINT reviews_reviewee_id_fkey FOREIGN KEY (reviewee_id) REFERENCES public.profiles(id)
);

CREATE TABLE IF NOT EXISTS public.rfqs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  rfq_number text NOT NULL UNIQUE,
  eo_id uuid NOT NULL,
  event_name text NOT NULL,
  event_date date,
  location_name text,
  city_id uuid,
  notes text,
  reply_deadline timestamp with time zone,
  status text NOT NULL DEFAULT 'DRAFT'::text CHECK (status = ANY (ARRAY['DRAFT'::text, 'SENT'::text, 'CLOSED'::text, 'CANCELLED'::text])),
  CONSTRAINT rfqs_pkey PRIMARY KEY (id),
  CONSTRAINT rfqs_eo_id_fkey FOREIGN KEY (eo_id) REFERENCES public.profiles(id),
  CONSTRAINT rfqs_city_id_fkey FOREIGN KEY (city_id) REFERENCES public.cities(id)
);

CREATE TABLE IF NOT EXISTS public.trainings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  owner_id uuid NOT NULL,
  competency_id uuid,
  title text NOT NULL,
  description text,
  format text NOT NULL DEFAULT 'OFFLINE'::text CHECK (format = ANY (ARRAY['ONLINE'::text, 'OFFLINE'::text, 'HYBRID'::text])),
  location_name text,
  city_id uuid,
  start_date date,
  end_date date,
  quota integer CHECK (quota > 0),
  price bigint NOT NULL DEFAULT 0 CHECK (price >= 0),
  is_free boolean NOT NULL DEFAULT false,
  passing_criteria text,
  status text NOT NULL DEFAULT 'DRAFT'::text CHECK (status = ANY (ARRAY['DRAFT'::text, 'PENDING_REVIEW'::text, 'PUBLISHED'::text, 'CLOSED'::text, 'TAKEN_DOWN'::text])),
  image_url text,
  moderation_note text,
  moderated_at timestamp with time zone,
  moderated_by_id uuid,
  CONSTRAINT trainings_pkey PRIMARY KEY (id),
  CONSTRAINT trainings_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.profiles(id),
  CONSTRAINT trainings_competency_id_fkey FOREIGN KEY (competency_id) REFERENCES public.competencies(id),
  CONSTRAINT trainings_city_id_fkey FOREIGN KEY (city_id) REFERENCES public.cities(id)
);

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id uuid NOT NULL,
  role_id uuid NOT NULL,
  CONSTRAINT user_roles_pkey PRIMARY KEY (id),
  CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id)
);

CREATE TABLE IF NOT EXISTS public.vendor_profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  owner_id uuid NOT NULL,
  org_name text NOT NULL,
  description text,
  address text,
  is_verified boolean NOT NULL DEFAULT false,
  CONSTRAINT vendor_profiles_pkey PRIMARY KEY (id),
  CONSTRAINT vendor_profiles_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.profiles(id)
);

CREATE TABLE IF NOT EXISTS public.verification_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id uuid NOT NULL,
  type text NOT NULL CHECK (type = ANY (ARRAY['IDENTITY'::text, 'ORGANIZATION'::text, 'INSTRUCTOR'::text, 'VENDOR'::text])),
  document_url text NOT NULL,
  note text,
  status text NOT NULL DEFAULT 'PENDING'::text CHECK (status = ANY (ARRAY['PENDING'::text, 'APPROVED'::text, 'REJECTED'::text])),
  reviewed_by_id uuid,
  review_note text,
  reviewed_at timestamp with time zone,
  CONSTRAINT verification_requests_pkey PRIMARY KEY (id),
  CONSTRAINT verification_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  CONSTRAINT verification_requests_reviewed_by_id_fkey FOREIGN KEY (reviewed_by_id) REFERENCES public.profiles(id)
);

CREATE TABLE IF NOT EXISTS public.worker_profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id uuid NOT NULL UNIQUE,
  city_id uuid,
  bio text,
  skills text,
  portfolio_url text,
  desired_positions text,
  expected_wage bigint CHECK (expected_wage >= 0),
  is_verified boolean NOT NULL DEFAULT false,
  CONSTRAINT worker_profiles_pkey PRIMARY KEY (id),
  CONSTRAINT worker_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  CONSTRAINT worker_profiles_city_id_fkey FOREIGN KEY (city_id) REFERENCES public.cities(id)
);

CREATE TABLE IF NOT EXISTS public.worker_skills (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  worker_id uuid NOT NULL,
  competency_id uuid NOT NULL,
  source text NOT NULL DEFAULT 'SELF'::text CHECK (source = ANY (ARRAY['SELF'::text, 'ASSESSMENT'::text, 'CERTIFICATE'::text])),
  status text NOT NULL DEFAULT 'CLAIMED'::text CHECK (status = ANY (ARRAY['CLAIMED'::text, 'VERIFIED'::text, 'REVOKED'::text])),
  verified_by uuid,
  verified_at timestamp with time zone,
  CONSTRAINT worker_skills_pkey PRIMARY KEY (id),
  CONSTRAINT worker_skills_worker_id_fkey FOREIGN KEY (worker_id) REFERENCES public.profiles(id),
  CONSTRAINT worker_skills_competency_id_fkey FOREIGN KEY (competency_id) REFERENCES public.competencies(id),
  CONSTRAINT worker_skills_verified_by_fkey FOREIGN KEY (verified_by) REFERENCES public.profiles(id)
);

CREATE TABLE IF NOT EXISTS public.event_payment_orders (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  invoice_number text NOT NULL UNIQUE,
  job_post_id uuid NOT NULL UNIQUE,
  eo_id uuid NOT NULL,
  gross_amount bigint NOT NULL CHECK (gross_amount > 0),
  paid_amount bigint NOT NULL DEFAULT 0 CHECK (paid_amount >= 0),
  invoice_status text NOT NULL DEFAULT 'ISSUED'::text CHECK (invoice_status = ANY (ARRAY['ISSUED'::text, 'PAID'::text, 'CANCELLED'::text])),
  issued_at timestamp with time zone NOT NULL DEFAULT now(),
  paid_at timestamp with time zone,
  notes text,
  settlement_mode text NOT NULL DEFAULT 'PLATFORM_QRIS'::text CHECK (settlement_mode = ANY (ARRAY['PLATFORM_QRIS'::text, 'EO_DIRECT'::text])),
  CONSTRAINT event_payment_orders_pkey PRIMARY KEY (id),
  CONSTRAINT event_payment_orders_job_post_id_fkey FOREIGN KEY (job_post_id) REFERENCES public.job_posts(id),
  CONSTRAINT event_payment_orders_eo_id_fkey FOREIGN KEY (eo_id) REFERENCES public.profiles(id)
);

CREATE TABLE IF NOT EXISTS public.instructor_withdrawals (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  withdrawal_number text NOT NULL UNIQUE,
  instructor_id uuid NOT NULL,
  training_id uuid,
  amount bigint NOT NULL CHECK (amount > 0),
  method text NOT NULL CHECK (method = ANY (ARRAY['QRIS'::text, 'TRANSFER'::text])),
  payment_profile_id uuid,
  bank_name text,
  account_number text,
  account_holder text,
  status text NOT NULL DEFAULT 'PENDING'::text CHECK (status = ANY (ARRAY['PENDING'::text, 'APPROVED'::text, 'TRANSFERRED'::text, 'CONFIRMED'::text, 'REJECTED'::text, 'CANCELLED'::text])),
  note text,
  processed_by_id uuid,
  processed_at timestamp with time zone,
  confirmed_at timestamp with time zone,
  payout_batch_id uuid,
  CONSTRAINT instructor_withdrawals_pkey PRIMARY KEY (id),
  CONSTRAINT instructor_withdrawals_instructor_id_fkey FOREIGN KEY (instructor_id) REFERENCES public.profiles(id),
  CONSTRAINT instructor_withdrawals_training_id_fkey FOREIGN KEY (training_id) REFERENCES public.trainings(id),
  CONSTRAINT instructor_withdrawals_payment_profile_id_fkey FOREIGN KEY (payment_profile_id) REFERENCES public.payment_profiles(id),
  CONSTRAINT instructor_withdrawals_processed_by_id_fkey FOREIGN KEY (processed_by_id) REFERENCES public.profiles(id),
  CONSTRAINT instructor_withdrawals_payout_batch_id_fkey FOREIGN KEY (payout_batch_id) REFERENCES public.payout_batches(id)
);

CREATE TABLE IF NOT EXISTS public.job_applications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  job_post_id uuid NOT NULL,
  worker_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'SUBMITTED'::text CHECK (status = ANY (ARRAY['SUBMITTED'::text, 'ACCEPTED'::text, 'REJECTED'::text, 'WITHDRAWN'::text])),
  note text,
  decided_at timestamp with time zone,
  CONSTRAINT job_applications_pkey PRIMARY KEY (id),
  CONSTRAINT job_applications_job_post_id_fkey FOREIGN KEY (job_post_id) REFERENCES public.job_posts(id),
  CONSTRAINT job_applications_worker_id_fkey FOREIGN KEY (worker_id) REFERENCES public.profiles(id)
);

CREATE TABLE IF NOT EXISTS public.job_assignments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  job_post_id uuid NOT NULL,
  worker_id uuid NOT NULL,
  status text NOT NULL CHECK (status = ANY (ARRAY['PENDING_CONFIRMATION'::text, 'CONFIRMED'::text, 'IN_PROGRESS'::text, 'COMPLETED'::text, 'CANCELLED'::text, 'NO_SHOW'::text])),
  applied_via text NOT NULL CHECK (applied_via = ANY (ARRAY['DIRECT'::text, 'APPLICATION'::text])),
  cancel_reason text,
  completed_at timestamp with time zone,
  checked_in_at timestamp with time zone,
  checked_out_at timestamp with time zone,
  CONSTRAINT job_assignments_pkey PRIMARY KEY (id),
  CONSTRAINT job_assignments_job_post_id_fkey FOREIGN KEY (job_post_id) REFERENCES public.job_posts(id),
  CONSTRAINT job_assignments_worker_id_fkey FOREIGN KEY (worker_id) REFERENCES public.profiles(id)
);

CREATE TABLE IF NOT EXISTS public.job_requirements (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  job_post_id uuid NOT NULL,
  competency_id uuid NOT NULL,
  is_required boolean NOT NULL DEFAULT true,
  CONSTRAINT job_requirements_pkey PRIMARY KEY (id),
  CONSTRAINT job_requirements_job_post_id_fkey FOREIGN KEY (job_post_id) REFERENCES public.job_posts(id),
  CONSTRAINT job_requirements_competency_id_fkey FOREIGN KEY (competency_id) REFERENCES public.competencies(id)
);

CREATE TABLE IF NOT EXISTS public.notification_deliveries (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  notification_id uuid NOT NULL,
  channel text NOT NULL CHECK (channel = ANY (ARRAY['IN_APP'::text, 'EMAIL'::text, 'WHATSAPP'::text])),
  status text NOT NULL DEFAULT 'PENDING'::text CHECK (status = ANY (ARRAY['PENDING'::text, 'SENT'::text, 'FAILED'::text, 'SKIPPED'::text])),
  detail text,
  CONSTRAINT notification_deliveries_pkey PRIMARY KEY (id),
  CONSTRAINT notification_deliveries_notification_id_fkey FOREIGN KEY (notification_id) REFERENCES public.notifications(id)
);

CREATE TABLE IF NOT EXISTS public.quotations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  quotation_number text NOT NULL UNIQUE,
  rfq_id uuid NOT NULL,
  vendor_profile_id uuid NOT NULL,
  total_amount bigint NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
  notes text,
  status text NOT NULL DEFAULT 'DRAFT'::text CHECK (status = ANY (ARRAY['DRAFT'::text, 'SUBMITTED'::text, 'ACCEPTED'::text, 'REJECTED'::text, 'EXPIRED'::text, 'WITHDRAWN'::text])),
  submitted_at timestamp with time zone,
  decided_at timestamp with time zone,
  CONSTRAINT quotations_pkey PRIMARY KEY (id),
  CONSTRAINT quotations_rfq_id_fkey FOREIGN KEY (rfq_id) REFERENCES public.rfqs(id),
  CONSTRAINT quotations_vendor_profile_id_fkey FOREIGN KEY (vendor_profile_id) REFERENCES public.vendor_profiles(id)
);

CREATE TABLE IF NOT EXISTS public.rfq_invitations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  rfq_id uuid NOT NULL,
  vendor_profile_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'INVITED'::text CHECK (status = ANY (ARRAY['INVITED'::text, 'RESPONDED'::text, 'DECLINED'::text])),
  invited_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT rfq_invitations_pkey PRIMARY KEY (id),
  CONSTRAINT rfq_invitations_rfq_id_fkey FOREIGN KEY (rfq_id) REFERENCES public.rfqs(id),
  CONSTRAINT rfq_invitations_vendor_profile_id_fkey FOREIGN KEY (vendor_profile_id) REFERENCES public.vendor_profiles(id)
);

CREATE TABLE IF NOT EXISTS public.training_registrations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  training_id uuid NOT NULL,
  worker_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'REGISTERED'::text CHECK (status = ANY (ARRAY['REGISTERED'::text, 'ATTENDING'::text, 'PASSED'::text, 'FAILED'::text, 'CANCELLED'::text])),
  payment_status text NOT NULL DEFAULT 'UNPAID'::text CHECK (payment_status = ANY (ARRAY['UNPAID'::text, 'PENDING'::text, 'PAID'::text, 'REFUNDED'::text])),
  payment_method text CHECK (payment_method IS NULL OR (payment_method = ANY (ARRAY['TRANSFER_BANK'::text, 'QRIS'::text, 'E_WALLET'::text]))),
  payment_reference text,
  payment_proof_url text,
  paid_at timestamp with time zone,
  payment_payload text,
  payment_expires_at timestamp with time zone,
  fee_rate numeric,
  fee_amount bigint,
  net_amount bigint,
  CONSTRAINT training_registrations_pkey PRIMARY KEY (id),
  CONSTRAINT training_registrations_training_id_fkey FOREIGN KEY (training_id) REFERENCES public.trainings(id),
  CONSTRAINT training_registrations_worker_id_fkey FOREIGN KEY (worker_id) REFERENCES public.profiles(id)
);

CREATE TABLE IF NOT EXISTS public.training_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  training_id uuid NOT NULL,
  date date NOT NULL,
  start_time time without time zone,
  end_time time without time zone,
  topic text,
  meeting_url text,
  CONSTRAINT training_sessions_pkey PRIMARY KEY (id),
  CONSTRAINT training_sessions_training_id_fkey FOREIGN KEY (training_id) REFERENCES public.trainings(id)
);

CREATE TABLE IF NOT EXISTS public.vendor_catalog_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  vendor_profile_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  unit text,
  base_price bigint NOT NULL DEFAULT 0 CHECK (base_price >= 0),
  is_active boolean NOT NULL DEFAULT true,
  CONSTRAINT vendor_catalog_items_pkey PRIMARY KEY (id),
  CONSTRAINT vendor_catalog_items_vendor_profile_id_fkey FOREIGN KEY (vendor_profile_id) REFERENCES public.vendor_profiles(id)
);

CREATE TABLE IF NOT EXISTS public.vendor_category_map (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  vendor_profile_id uuid NOT NULL,
  vendor_category_id uuid NOT NULL,
  CONSTRAINT vendor_category_map_pkey PRIMARY KEY (id),
  CONSTRAINT vendor_category_map_vendor_profile_id_fkey FOREIGN KEY (vendor_profile_id) REFERENCES public.vendor_profiles(id),
  CONSTRAINT vendor_category_map_vendor_category_id_fkey FOREIGN KEY (vendor_category_id) REFERENCES public.vendor_categories(id)
);

CREATE TABLE IF NOT EXISTS public.vendor_members (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  vendor_profile_id uuid NOT NULL,
  user_id uuid NOT NULL,
  role_in_vendor text NOT NULL DEFAULT 'PIC'::text CHECK (role_in_vendor = ANY (ARRAY['OWNER'::text, 'PIC'::text])),
  is_primary_contact boolean NOT NULL DEFAULT false,
  CONSTRAINT vendor_members_pkey PRIMARY KEY (id),
  CONSTRAINT vendor_members_vendor_profile_id_fkey FOREIGN KEY (vendor_profile_id) REFERENCES public.vendor_profiles(id),
  CONSTRAINT vendor_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);

CREATE TABLE IF NOT EXISTS public.assignment_payout_exceptions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  assignment_id uuid NOT NULL UNIQUE,
  resolution_status text NOT NULL DEFAULT 'PENDING'::text CHECK (resolution_status = ANY (ARRAY['PENDING'::text, 'CLOSED_NO_PAYOUT'::text])),
  resolution_note text,
  resolved_by_id uuid,
  resolved_at timestamp with time zone,
  CONSTRAINT assignment_payout_exceptions_pkey PRIMARY KEY (id),
  CONSTRAINT assignment_payout_exceptions_assignment_id_fkey FOREIGN KEY (assignment_id) REFERENCES public.job_assignments(id),
  CONSTRAINT assignment_payout_exceptions_resolved_by_id_fkey FOREIGN KEY (resolved_by_id) REFERENCES public.profiles(id)
);

CREATE TABLE IF NOT EXISTS public.assignment_verifications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  assignment_id uuid NOT NULL UNIQUE,
  eo_status text NOT NULL DEFAULT 'PENDING'::text CHECK (eo_status = ANY (ARRAY['PENDING'::text, 'APPROVED'::text, 'REJECTED'::text])),
  eo_verified_by_id uuid,
  eo_verified_at timestamp with time zone,
  eo_note text,
  admin_status text NOT NULL DEFAULT 'PENDING'::text CHECK (admin_status = ANY (ARRAY['PENDING'::text, 'APPROVED'::text, 'REJECTED'::text])),
  admin_approved_by_id uuid,
  admin_approved_at timestamp with time zone,
  admin_note text,
  CONSTRAINT assignment_verifications_pkey PRIMARY KEY (id),
  CONSTRAINT assignment_verifications_assignment_id_fkey FOREIGN KEY (assignment_id) REFERENCES public.job_assignments(id),
  CONSTRAINT assignment_verifications_eo_verified_by_id_fkey FOREIGN KEY (eo_verified_by_id) REFERENCES public.profiles(id),
  CONSTRAINT assignment_verifications_admin_approved_by_id_fkey FOREIGN KEY (admin_approved_by_id) REFERENCES public.profiles(id)
);

CREATE TABLE IF NOT EXISTS public.certificates (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  certificate_number text NOT NULL UNIQUE,
  worker_id uuid NOT NULL,
  registration_id uuid NOT NULL UNIQUE,
  training_id uuid NOT NULL,
  competency_id uuid,
  title text NOT NULL,
  issued_by_id uuid NOT NULL,
  issued_at timestamp with time zone NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'ACTIVE'::text CHECK (status = ANY (ARRAY['ACTIVE'::text, 'REVOKED'::text])),
  revoked_by_id uuid,
  revoked_at timestamp with time zone,
  revoked_note text,
  CONSTRAINT certificates_pkey PRIMARY KEY (id),
  CONSTRAINT certificates_registration_id_fkey FOREIGN KEY (registration_id) REFERENCES public.training_registrations(id),
  CONSTRAINT certificates_training_id_fkey FOREIGN KEY (training_id) REFERENCES public.trainings(id),
  CONSTRAINT certificates_competency_id_fkey FOREIGN KEY (competency_id) REFERENCES public.competencies(id),
  CONSTRAINT certificates_issued_by_id_fkey FOREIGN KEY (issued_by_id) REFERENCES public.profiles(id),
  CONSTRAINT certificates_revoked_by_id_fkey FOREIGN KEY (revoked_by_id) REFERENCES public.profiles(id),
  CONSTRAINT certificates_worker_id_fkey FOREIGN KEY (worker_id) REFERENCES public.profiles(id)
);

CREATE TABLE IF NOT EXISTS public.course_refunds (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  refund_number text NOT NULL UNIQUE,
  registration_id uuid NOT NULL UNIQUE,
  training_id uuid NOT NULL,
  instructor_id uuid NOT NULL,
  worker_id uuid NOT NULL,
  requested_by_id uuid NOT NULL,
  requester_role text NOT NULL CHECK (requester_role = ANY (ARRAY['WORKER'::text, 'INSTRUCTOR'::text, 'ADMIN'::text])),
  amount bigint NOT NULL CHECK (amount > 0),
  fee_reversal bigint NOT NULL,
  net_reversal bigint NOT NULL,
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'PENDING'::text CHECK (status = ANY (ARRAY['PENDING'::text, 'APPROVED'::text, 'TRANSFERRED'::text, 'REJECTED'::text, 'CANCELLED'::text])),
  note text,
  processed_by_id uuid,
  processed_at timestamp with time zone,
  transfer_reference text,
  transferred_at timestamp with time zone,
  CONSTRAINT course_refunds_pkey PRIMARY KEY (id),
  CONSTRAINT course_refunds_registration_id_fkey FOREIGN KEY (registration_id) REFERENCES public.training_registrations(id),
  CONSTRAINT course_refunds_training_id_fkey FOREIGN KEY (training_id) REFERENCES public.trainings(id),
  CONSTRAINT course_refunds_instructor_id_fkey FOREIGN KEY (instructor_id) REFERENCES public.profiles(id),
  CONSTRAINT course_refunds_worker_id_fkey FOREIGN KEY (worker_id) REFERENCES public.profiles(id),
  CONSTRAINT course_refunds_requested_by_id_fkey FOREIGN KEY (requested_by_id) REFERENCES public.profiles(id),
  CONSTRAINT course_refunds_processed_by_id_fkey FOREIGN KEY (processed_by_id) REFERENCES public.profiles(id)
);

CREATE TABLE IF NOT EXISTS public.event_fee_invoices (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  fee_invoice_number text NOT NULL UNIQUE,
  payment_order_id uuid NOT NULL UNIQUE,
  eo_id uuid NOT NULL,
  base_amount bigint NOT NULL,
  rate numeric NOT NULL DEFAULT 10.00,
  amount bigint NOT NULL,
  status text NOT NULL DEFAULT 'UNPAID'::text CHECK (status = ANY (ARRAY['UNPAID'::text, 'PAID'::text, 'VOID'::text])),
  proof_path text,
  paid_via text,
  paid_at timestamp with time zone,
  resolved_by_id uuid,
  notes text,
  CONSTRAINT event_fee_invoices_pkey PRIMARY KEY (id),
  CONSTRAINT event_fee_invoices_payment_order_id_fkey FOREIGN KEY (payment_order_id) REFERENCES public.event_payment_orders(id),
  CONSTRAINT event_fee_invoices_eo_id_fkey FOREIGN KEY (eo_id) REFERENCES public.profiles(id),
  CONSTRAINT event_fee_invoices_resolved_by_id_fkey FOREIGN KEY (resolved_by_id) REFERENCES public.profiles(id)
);

CREATE TABLE IF NOT EXISTS public.event_payout_releases (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  payment_order_id uuid NOT NULL UNIQUE,
  release_status text NOT NULL DEFAULT 'BLOCKED'::text CHECK (release_status = ANY (ARRAY['BLOCKED'::text, 'READY'::text, 'RELEASED'::text])),
  total_assignments integer NOT NULL DEFAULT 0 CHECK (total_assignments >= 0),
  approved_assignments integer NOT NULL DEFAULT 0 CHECK (approved_assignments >= 0),
  exception_assignments integer NOT NULL DEFAULT 0 CHECK (exception_assignments >= 0),
  blocked_reasons text,
  approved_by_id uuid,
  approved_at timestamp with time zone,
  released_at timestamp with time zone,
  notes text,
  CONSTRAINT event_payout_releases_pkey PRIMARY KEY (id),
  CONSTRAINT event_payout_releases_payment_order_id_fkey FOREIGN KEY (payment_order_id) REFERENCES public.event_payment_orders(id),
  CONSTRAINT event_payout_releases_approved_by_id_fkey FOREIGN KEY (approved_by_id) REFERENCES public.profiles(id)
);

CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  payment_order_id uuid NOT NULL,
  provider_key text NOT NULL DEFAULT 'DEMO'::text,
  provider_transaction_id text,
  amount bigint NOT NULL CHECK (amount > 0),
  transaction_status text NOT NULL DEFAULT 'PENDING'::text CHECK (transaction_status = ANY (ARRAY['PENDING'::text, 'SUCCEEDED'::text, 'FAILED'::text, 'EXPIRED'::text, 'CANCELLED'::text])),
  qris_payload text,
  expires_at timestamp with time zone,
  paid_at timestamp with time zone,
  CONSTRAINT payment_transactions_pkey PRIMARY KEY (id),
  CONSTRAINT payment_transactions_payment_order_id_fkey FOREIGN KEY (payment_order_id) REFERENCES public.event_payment_orders(id)
);

CREATE TABLE IF NOT EXISTS public.purchase_orders (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  po_number text NOT NULL UNIQUE,
  quotation_id uuid NOT NULL,
  eo_id uuid NOT NULL,
  vendor_profile_id uuid NOT NULL,
  total_amount bigint NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
  status text NOT NULL DEFAULT 'ISSUED'::text CHECK (status = ANY (ARRAY['ISSUED'::text, 'CONFIRMED'::text, 'IN_DELIVERY'::text, 'COMPLETED'::text, 'CANCELLED'::text])),
  issued_at timestamp with time zone,
  CONSTRAINT purchase_orders_pkey PRIMARY KEY (id),
  CONSTRAINT purchase_orders_quotation_id_fkey FOREIGN KEY (quotation_id) REFERENCES public.quotations(id),
  CONSTRAINT purchase_orders_eo_id_fkey FOREIGN KEY (eo_id) REFERENCES public.profiles(id),
  CONSTRAINT purchase_orders_vendor_profile_id_fkey FOREIGN KEY (vendor_profile_id) REFERENCES public.vendor_profiles(id)
);

CREATE TABLE IF NOT EXISTS public.quotation_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  quotation_id uuid NOT NULL,
  catalog_item_id uuid,
  name text NOT NULL,
  qty integer NOT NULL CHECK (qty > 0),
  unit text,
  unit_price bigint NOT NULL DEFAULT 0 CHECK (unit_price >= 0),
  subtotal bigint NOT NULL DEFAULT 0 CHECK (subtotal >= 0),
  CONSTRAINT quotation_items_pkey PRIMARY KEY (id),
  CONSTRAINT quotation_items_quotation_id_fkey FOREIGN KEY (quotation_id) REFERENCES public.quotations(id),
  CONSTRAINT quotation_items_catalog_item_id_fkey FOREIGN KEY (catalog_item_id) REFERENCES public.vendor_catalog_items(id)
);

CREATE TABLE IF NOT EXISTS public.training_assessments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  registration_id uuid NOT NULL,
  score integer CHECK (score >= 0 AND score <= 100),
  result text NOT NULL CHECK (result = ANY (ARRAY['PASS'::text, 'FAIL'::text])),
  notes text,
  assessed_by_id uuid,
  assessed_at timestamp with time zone,
  CONSTRAINT training_assessments_pkey PRIMARY KEY (id),
  CONSTRAINT training_assessments_registration_id_fkey FOREIGN KEY (registration_id) REFERENCES public.training_registrations(id),
  CONSTRAINT training_assessments_assessed_by_id_fkey FOREIGN KEY (assessed_by_id) REFERENCES public.profiles(id)
);

CREATE TABLE IF NOT EXISTS public.training_attendances (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  session_id uuid NOT NULL,
  registration_id uuid NOT NULL,
  status text NOT NULL CHECK (status = ANY (ARRAY['PRESENT'::text, 'ABSENT'::text])),
  recorded_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT training_attendances_pkey PRIMARY KEY (id),
  CONSTRAINT training_attendances_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.training_sessions(id),
  CONSTRAINT training_attendances_registration_id_fkey FOREIGN KEY (registration_id) REFERENCES public.training_registrations(id)
);

CREATE TABLE IF NOT EXISTS public.training_materials (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  training_id uuid NOT NULL,
  session_id uuid,
  title text NOT NULL,
  material_type text NOT NULL CHECK (material_type = ANY (ARRAY['FILE'::text, 'LINK'::text, 'VIDEO'::text, 'DOCUMENT'::text])),
  url text,
  storage_path text,
  sort_order integer NOT NULL DEFAULT 0,
  is_downloadable boolean NOT NULL DEFAULT true,
  CONSTRAINT training_materials_pkey PRIMARY KEY (id),
  CONSTRAINT training_materials_training_id_fkey FOREIGN KEY (training_id) REFERENCES public.trainings(id),
  CONSTRAINT training_materials_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.training_sessions(id)
);

CREATE TABLE IF NOT EXISTS public.worker_payment_allocations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  payment_order_id uuid NOT NULL,
  assignment_id uuid NOT NULL UNIQUE,
  worker_id uuid NOT NULL,
  gross_amount bigint NOT NULL CHECK (gross_amount >= 0),
  platform_fee_rate numeric NOT NULL DEFAULT 10.00 CHECK (platform_fee_rate >= 0::numeric AND platform_fee_rate <= 100::numeric),
  platform_fee_amount bigint NOT NULL CHECK (platform_fee_amount >= 0),
  worker_net_amount bigint NOT NULL CHECK (worker_net_amount >= 0),
  allocation_status text NOT NULL DEFAULT 'PENDING_VERIFICATION'::text CHECK (allocation_status = ANY (ARRAY['PENDING_VERIFICATION'::text, 'READY_FOR_PAYOUT'::text, 'IN_PAYOUT'::text, 'PAID'::text, 'ON_HOLD'::text, 'CANCELLED'::text])),
  CONSTRAINT worker_payment_allocations_pkey PRIMARY KEY (id),
  CONSTRAINT worker_payment_allocations_payment_order_id_fkey FOREIGN KEY (payment_order_id) REFERENCES public.event_payment_orders(id),
  CONSTRAINT worker_payment_allocations_assignment_id_fkey FOREIGN KEY (assignment_id) REFERENCES public.job_assignments(id),
  CONSTRAINT worker_payment_allocations_worker_id_fkey FOREIGN KEY (worker_id) REFERENCES public.profiles(id)
);

CREATE TABLE IF NOT EXISTS public.commission_invoices (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  invoice_number text NOT NULL UNIQUE,
  purchase_order_id uuid NOT NULL,
  eo_id uuid NOT NULL,
  vendor_profile_id uuid NOT NULL,
  base_amount bigint NOT NULL DEFAULT 0 CHECK (base_amount >= 0),
  rate numeric NOT NULL DEFAULT 0 CHECK (rate >= 0::numeric AND rate <= 100::numeric),
  amount bigint NOT NULL DEFAULT 0 CHECK (amount >= 0),
  status text NOT NULL DEFAULT 'UNPAID'::text CHECK (status = ANY (ARRAY['UNPAID'::text, 'SENT'::text, 'PAID'::text, 'VOID'::text])),
  due_date date,
  paid_at timestamp with time zone,
  CONSTRAINT commission_invoices_pkey PRIMARY KEY (id),
  CONSTRAINT commission_invoices_purchase_order_id_fkey FOREIGN KEY (purchase_order_id) REFERENCES public.purchase_orders(id),
  CONSTRAINT commission_invoices_eo_id_fkey FOREIGN KEY (eo_id) REFERENCES public.profiles(id),
  CONSTRAINT commission_invoices_vendor_profile_id_fkey FOREIGN KEY (vendor_profile_id) REFERENCES public.vendor_profiles(id)
);

CREATE TABLE IF NOT EXISTS public.contracts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  contract_number text NOT NULL UNIQUE,
  purchase_order_id uuid NOT NULL,
  document_url text,
  status text NOT NULL DEFAULT 'DRAFT'::text CHECK (status = ANY (ARRAY['DRAFT'::text, 'SIGNED'::text, 'ACTIVE'::text, 'COMPLETED'::text, 'TERMINATED'::text])),
  signed_at timestamp with time zone,
  CONSTRAINT contracts_pkey PRIMARY KEY (id),
  CONSTRAINT contracts_purchase_order_id_fkey FOREIGN KEY (purchase_order_id) REFERENCES public.purchase_orders(id)
);

CREATE TABLE IF NOT EXISTS public.deliveries (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  purchase_order_id uuid NOT NULL,
  vendor_profile_id uuid NOT NULL,
  scheduled_date date,
  status text NOT NULL DEFAULT 'PENDING'::text CHECK (status = ANY (ARRAY['PENDING'::text, 'IN_TRANSIT'::text, 'DELIVERED'::text, 'VERIFIED'::text, 'FAILED'::text])),
  delivered_at timestamp with time zone,
  notes text,
  CONSTRAINT deliveries_pkey PRIMARY KEY (id),
  CONSTRAINT deliveries_purchase_order_id_fkey FOREIGN KEY (purchase_order_id) REFERENCES public.purchase_orders(id),
  CONSTRAINT deliveries_vendor_profile_id_fkey FOREIGN KEY (vendor_profile_id) REFERENCES public.vendor_profiles(id)
);

CREATE TABLE IF NOT EXISTS public.purchase_order_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  purchase_order_id uuid NOT NULL,
  name text NOT NULL,
  qty integer NOT NULL CHECK (qty > 0),
  unit_price bigint NOT NULL DEFAULT 0 CHECK (unit_price >= 0),
  subtotal bigint NOT NULL DEFAULT 0 CHECK (subtotal >= 0),
  CONSTRAINT purchase_order_items_pkey PRIMARY KEY (id),
  CONSTRAINT purchase_order_items_purchase_order_id_fkey FOREIGN KEY (purchase_order_id) REFERENCES public.purchase_orders(id)
);

CREATE TABLE IF NOT EXISTS public.vendor_payments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  purchase_order_id uuid NOT NULL,
  vendor_profile_id uuid NOT NULL,
  amount bigint NOT NULL DEFAULT 0 CHECK (amount >= 0),
  method text,
  proof_url text,
  paid_at timestamp with time zone,
  status text NOT NULL DEFAULT 'UNPAID'::text CHECK (status = ANY (ARRAY['UNPAID'::text, 'PROOF_SUBMITTED'::text, 'CONFIRMED'::text])),
  CONSTRAINT vendor_payments_pkey PRIMARY KEY (id),
  CONSTRAINT vendor_payments_purchase_order_id_fkey FOREIGN KEY (purchase_order_id) REFERENCES public.purchase_orders(id),
  CONSTRAINT vendor_payments_vendor_profile_id_fkey FOREIGN KEY (vendor_profile_id) REFERENCES public.vendor_profiles(id)
);

CREATE TABLE IF NOT EXISTS public.worker_payouts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  payment_order_id uuid NOT NULL,
  allocation_id uuid NOT NULL UNIQUE,
  worker_id uuid NOT NULL,
  payment_profile_id uuid,
  beneficiary_bank_code text NOT NULL,
  beneficiary_bank_name text NOT NULL,
  beneficiary_account_holder text NOT NULL,
  beneficiary_account_number text NOT NULL,
  payout_amount bigint NOT NULL CHECK (payout_amount > 0),
  payout_status text NOT NULL DEFAULT 'PREPARED'::text CHECK (payout_status = ANY (ARRAY['PREPARED'::text, 'TRANSFERRED'::text, 'CONFIRMED'::text, 'FAILED'::text, 'CANCELLED'::text])),
  transfer_reference text,
  transfer_proof_url text,
  transferred_by_id uuid,
  confirmed_by_id uuid,
  confirmed_at timestamp with time zone,
  failure_note text,
  notes text,
  payer_role text NOT NULL DEFAULT 'PLATFORM'::text CHECK (payer_role = ANY (ARRAY['PLATFORM'::text, 'EO'::text])),
  payment_method text CHECK (payment_method = ANY (ARRAY['QRIS'::text, 'TRANSFER'::text])),
  transferred_at timestamp with time zone,
  worker_confirmed_at timestamp with time zone,
  CONSTRAINT worker_payouts_pkey PRIMARY KEY (id),
  CONSTRAINT worker_payouts_payment_order_id_fkey FOREIGN KEY (payment_order_id) REFERENCES public.event_payment_orders(id),
  CONSTRAINT worker_payouts_allocation_id_fkey FOREIGN KEY (allocation_id) REFERENCES public.worker_payment_allocations(id),
  CONSTRAINT worker_payouts_worker_id_fkey FOREIGN KEY (worker_id) REFERENCES public.profiles(id),
  CONSTRAINT worker_payouts_payment_profile_id_fkey FOREIGN KEY (payment_profile_id) REFERENCES public.payment_profiles(id),
  CONSTRAINT worker_payouts_transferred_by_id_fkey FOREIGN KEY (transferred_by_id) REFERENCES public.profiles(id),
  CONSTRAINT worker_payouts_confirmed_by_id_fkey FOREIGN KEY (confirmed_by_id) REFERENCES public.profiles(id)
);

CREATE TABLE IF NOT EXISTS public.delivery_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  delivery_id uuid NOT NULL,
  name text NOT NULL,
  qty integer NOT NULL CHECK (qty > 0),
  condition text,
  CONSTRAINT delivery_items_pkey PRIMARY KEY (id),
  CONSTRAINT delivery_items_delivery_id_fkey FOREIGN KEY (delivery_id) REFERENCES public.deliveries(id)
);

INSERT INTO public._pe_migrations (name) VALUES ('0001_full_schema') ON CONFLICT (name) DO NOTHING;
