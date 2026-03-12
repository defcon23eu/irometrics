-- ============================================================
-- IRO Metrics · SQL Verification Query (post-deploy)
-- Ejecutar en Supabase SQL Editor para verificar BUG-03
-- ============================================================

-- Verifica que re_org_log esté correctamente almacenado y calculado
SELECT
  id,
  re_org,
  re_org_log,
  LOG(10, re_org + 1)                                      AS re_org_log_correcto,
  ABS(re_org_log - LOG(10, re_org + 1))                   AS diferencia,
  CASE
    WHEN re_org_log IS NULL THEN '🔴 NULL — BUG-03 activo'
    WHEN ABS(re_org_log - LOG(10, re_org + 1)) > 0.001 THEN '🟡 INCORRECTO'
    ELSE '🟢 OK'
  END AS estado
FROM responses
ORDER BY created_at DESC
LIMIT 20;

-- Estadísticas generales
SELECT
  COUNT(*) AS total_respuestas,
  COUNT(re_org_log) AS con_re_org_log,
  COUNT(*) - COUNT(re_org_log) AS faltantes_re_org_log,
  ROUND(AVG(re_org), 2) AS avg_re_org,
  ROUND(AVG(re_org_log), 4) AS avg_re_org_log
FROM responses;
