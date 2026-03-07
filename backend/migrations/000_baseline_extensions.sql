-- ===========================================================================
-- Migration: 000_baseline_extensions
-- Description: Installs required PostgreSQL extensions before any other
--              migrations run. Must be the first migration executed.
--
-- Requires: superuser or rds_superuser / pg_extension_owner role on the
--           target database (alwaysdata.net grants this by default).
--
-- Safe to run multiple times: uses IF NOT EXISTS.
-- ===========================================================================

-- pgcrypto: provides gen_random_uuid(), crypt(), gen_salt() etc.
-- Required by migrations that use gen_random_uuid() for UUID primary keys.
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- uuid-ossp: provides uuid_generate_v4() (alternative UUID function).
-- Included here so both UUID generation strategies are available.
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================================================
-- Rollback (run manually if you need to undo this migration):
--
--   DROP EXTENSION IF EXISTS "uuid-ossp";
--   DROP EXTENSION IF EXISTS "pgcrypto";
--
-- WARNING: Only drop these extensions if NO tables use gen_random_uuid() or
--          uuid_generate_v4() as column defaults, otherwise dropping will
--          fail with a dependency error.
-- ===========================================================================
