-- ============================================================
-- IRO Metrics · Migration 002 — Fix re_org_log to base 10
-- Previous: log(x) = ln(x) (natural logarithm)
-- Correct:  log(10, x) = log₁₀(x) per TFG specification
-- ============================================================

-- Drop and recreate the generated column with correct base
ALTER TABLE responses DROP COLUMN IF EXISTS re_org_log;

ALTER TABLE responses
  ADD COLUMN re_org_log numeric(8,4)
  GENERATED ALWAYS AS (log(10, GREATEST(re_org, 0) + 1)) STORED;
