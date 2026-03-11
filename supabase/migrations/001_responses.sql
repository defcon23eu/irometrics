-- ============================================================
-- IRO Metrics · Supabase Migration 001
-- Tabla principal + RLS + Vista export SPSS
-- Ejecutar en: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. Tabla de respuestas
CREATE TABLE IF NOT EXISTS responses (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      timestamptz NOT NULL DEFAULT now(),

  -- Metadatos de sesión
  session_id      uuid        NOT NULL UNIQUE,
  consent_at      timestamptz NOT NULL,
  started_at      timestamptz NOT NULL,
  completed_at    timestamptz NOT NULL,
  duration_seconds integer    NOT NULL CHECK (duration_seconds > 0),
  ip_hash         text,  -- SHA-256 de primeros 3 octetos (RGPD)

  -- Bloque A: Sociodemográficos
  a1_sector         text     NOT NULL,
  a2_size           smallint NOT NULL CHECK (a2_size BETWEEN 1 AND 9),
  a3_role           text     NOT NULL,
  a4_tenure_months  integer  NOT NULL CHECK (a4_tenure_months BETWEEN 3 AND 600),
  a5_age            smallint NOT NULL CHECK (a5_age BETWEEN 18 AND 75),

  -- Bloque B: IRO (Likert 1-7) — 12 ítems
  -- δ (Densidad): b1-b3 | v (Velocidad): b4-b6 | D (Dispersión): b7-b9 | μ (Resistencia): b10-b12
  b1  smallint NOT NULL CHECK (b1  BETWEEN 1 AND 7),
  b2  smallint NOT NULL CHECK (b2  BETWEEN 1 AND 7),
  b3  smallint NOT NULL CHECK (b3  BETWEEN 1 AND 7),
  b4  smallint NOT NULL CHECK (b4  BETWEEN 1 AND 7),
  b5  smallint NOT NULL CHECK (b5  BETWEEN 1 AND 7),
  b6  smallint NOT NULL CHECK (b6  BETWEEN 1 AND 7),
  b7  smallint NOT NULL CHECK (b7  BETWEEN 1 AND 7),
  b8  smallint NOT NULL CHECK (b8  BETWEEN 1 AND 7),
  b9  smallint NOT NULL CHECK (b9  BETWEEN 1 AND 7),
  b10 smallint NOT NULL CHECK (b10 BETWEEN 1 AND 7),
  b11 smallint NOT NULL CHECK (b11 BETWEEN 1 AND 7),
  b12 smallint NOT NULL CHECK (b12 BETWEEN 1 AND 7),

  -- Bloque C: MBI-GS (escala 0-6) — 16 ítems
  -- EX (Agotamiento): c1-c5 | CY (Cinismo): c6-c9 | PE (Eficacia): c10-c15 | c16 extra cinismo
  c1  smallint NOT NULL CHECK (c1  BETWEEN 0 AND 6),
  c2  smallint NOT NULL CHECK (c2  BETWEEN 0 AND 6),
  c3  smallint NOT NULL CHECK (c3  BETWEEN 0 AND 6),
  c4  smallint NOT NULL CHECK (c4  BETWEEN 0 AND 6),
  c5  smallint NOT NULL CHECK (c5  BETWEEN 0 AND 6),
  c6  smallint NOT NULL CHECK (c6  BETWEEN 0 AND 6),
  c7  smallint NOT NULL CHECK (c7  BETWEEN 0 AND 6),
  c8  smallint NOT NULL CHECK (c8  BETWEEN 0 AND 6),
  c9  smallint NOT NULL CHECK (c9  BETWEEN 0 AND 6),
  c10 smallint NOT NULL CHECK (c10 BETWEEN 0 AND 6),
  c11 smallint NOT NULL CHECK (c11 BETWEEN 0 AND 6),
  c12 smallint NOT NULL CHECK (c12 BETWEEN 0 AND 6),
  c13 smallint NOT NULL CHECK (c13 BETWEEN 0 AND 6),
  c14 smallint NOT NULL CHECK (c14 BETWEEN 0 AND 6),
  c15 smallint NOT NULL CHECK (c15 BETWEEN 0 AND 6),
  c16 smallint NOT NULL CHECK (c16 BETWEEN 0 AND 6),

  -- Bloque D: Oreg RTC (Likert 1-6) — 17 ítems
  d1  smallint NOT NULL CHECK (d1  BETWEEN 1 AND 6),
  d2  smallint NOT NULL CHECK (d2  BETWEEN 1 AND 6),
  d3  smallint NOT NULL CHECK (d3  BETWEEN 1 AND 6),
  d4  smallint NOT NULL CHECK (d4  BETWEEN 1 AND 6),
  d5  smallint NOT NULL CHECK (d5  BETWEEN 1 AND 6),
  d6  smallint NOT NULL CHECK (d6  BETWEEN 1 AND 6),
  d7  smallint NOT NULL CHECK (d7  BETWEEN 1 AND 6),
  d8  smallint NOT NULL CHECK (d8  BETWEEN 1 AND 6),
  d9  smallint NOT NULL CHECK (d9  BETWEEN 1 AND 6),
  d10 smallint NOT NULL CHECK (d10 BETWEEN 1 AND 6),
  d11 smallint NOT NULL CHECK (d11 BETWEEN 1 AND 6),
  d12 smallint NOT NULL CHECK (d12 BETWEEN 1 AND 6),
  d13 smallint NOT NULL CHECK (d13 BETWEEN 1 AND 6),
  d14 smallint NOT NULL CHECK (d14 BETWEEN 1 AND 6),
  d15 smallint NOT NULL CHECK (d15 BETWEEN 1 AND 6),
  d16 smallint NOT NULL CHECK (d16 BETWEEN 1 AND 6),
  d17 smallint NOT NULL CHECK (d17 BETWEEN 1 AND 6),

  -- Resultado calculado
  re_org   numeric(10,2)  NOT NULL,
  regime   text           NOT NULL CHECK (regime IN ('laminar','transicion','turbulencia_incipiente','turbulencia_severa')),

  -- Columnas derivadas
  re_org_log numeric(8,4) GENERATED ALWAYS AS (log(GREATEST(re_org, 0.01) + 1)) STORED
);

-- Índice por fecha para exportación cronológica
CREATE INDEX IF NOT EXISTS idx_responses_created ON responses (created_at DESC);


-- 2. Row Level Security
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

-- Política: rol anónimo puede insertar (participantes)
CREATE POLICY anon_insert ON responses
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Política: solo service_role puede leer (investigador via Dashboard/API)
CREATE POLICY admin_select ON responses
  FOR SELECT
  TO service_role
  USING (true);


-- 3. Vista de exportación SPSS
-- Calcula subescalas agregadas para análisis estadístico directo
CREATE OR REPLACE VIEW export_spss AS
SELECT
  session_id,
  created_at,
  duration_seconds                                    AS tiempo_seg,

  -- Sociodemográficos
  a1_sector                                           AS sector,
  a2_size                                             AS tamano,
  a3_role                                             AS rol,
  a4_tenure_months                                    AS meses_empresa,
  a5_age                                              AS edad,

  -- IRO subescalas
  (b1 + b2 + b3)                                      AS delta_sum,
  (b4 + b5 + b6)                                      AS v_sum,
  (b7 + b8 + b9)                                      AS D_sum,
  (b10 + b11 + b12)                                   AS mu_sum,
  re_org,
  re_org_log,
  regime,

  -- MBI-GS subescalas
  (c1 + c2 + c3 + c4 + c5)                            AS mbi_agotamiento,
  (c6 + c7 + c8 + c9 + c16)                           AS mbi_cinismo,
  (c10 + c11 + c12 + c13 + c14 + c15)                 AS mbi_eficacia,

  -- Oreg RTC subescalas (Oreg, 2003)
  -- Búsqueda de rutina: d1-d5
  (d1 + d2 + d3 + d4 + d5)                            AS oreg_rutina,
  -- Reacción emocional: d6-d9
  (d6 + d7 + d8 + d9)                                 AS oreg_emocional,
  -- Rigidez cognitiva: d10-d13
  (d10 + d11 + d12 + d13)                              AS oreg_cognitiva,
  -- Enfoque a corto plazo: d14-d17
  (d14 + d15 + d16 + d17)                              AS oreg_corto_plazo,
  -- Total Oreg
  (d1+d2+d3+d4+d5+d6+d7+d8+d9+d10+d11+d12+d13+d14+d15+d16+d17) AS oreg_total

FROM responses
ORDER BY created_at ASC;


-- 4. Verificación rápida
-- Ejecutar después de la migración:
-- SELECT schemaname, tablename, policyname, cmd FROM pg_policies WHERE tablename = 'responses';
-- Debe devolver: anon_insert (INSERT) + admin_select (SELECT)
