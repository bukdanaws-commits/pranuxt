-- PEKERJA EVENT — 0002: aktifkan Row Level Security di seluruh tabel aplikasi.
--
-- Standar data terkunci §4 aturan 2: publishable key aman untuk client KARENA
-- RLS yang mengunci akses. Tanpa RLS + policy, siapa pun yang memegang key
-- publik bisa baca/tulis semua tabel lewat PostgREST. Server aplikasi memakai
-- service key (bypass RLS), sehingga UI tidak terpengaruh.
--
-- Idempotent: IF EXISTS. Tanpa policy → PostgREST (anon/authenticated) DENY
-- semua sampai policy ditulis per modul (fase berikutnya).

DO $$
DECLARE
  r record;
BEGIN
  FOR r IN
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
      AND tablename <> '_pe_migrations'
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', r.tablename);
    RAISE NOTICE 'RLS enabled: %', r.tablename;
  END LOOP;
END $$;

INSERT INTO public._pe_migrations (name) VALUES ('0002_enable_rls') ON CONFLICT (name) DO NOTHING;
