import type { BlockB, BlockC, BlockD, IRORegime, IROResult } from '@/types';

// IRO Formula: Re_org = (Σδ · Σv · ΣD) / Σμ
// Each subscale: 3 items × Likert 1-7 → range [3, 21]
// Thresholds: <100 laminar · 100-800 transition · 800-1200 incipient turb. · >1200 severe

// Subscale item mappings (1-indexed item numbers within Block B)
const DELTA_ITEMS: (keyof BlockB)[] = ['b1', 'b2', 'b3'];     // Density (δ)
const V_ITEMS: (keyof BlockB)[] = ['b4', 'b5', 'b6'];         // Velocity (v)
const D_ITEMS: (keyof BlockB)[] = ['b7', 'b8', 'b9'];         // Dispersion (D)
const MU_ITEMS: (keyof BlockB)[] = ['b10', 'b11', 'b12'];     // Resistance (μ)

function sumItems(data: BlockB, keys: (keyof BlockB)[]): number {
  return keys.reduce((acc, key) => acc + (data[key] ?? 0), 0);
}

export function calculateIRO(blockB: BlockB): IROResult {
  const delta = sumItems(blockB, DELTA_ITEMS);
  const v = sumItems(blockB, V_ITEMS);
  const D = sumItems(blockB, D_ITEMS);
  const mu = sumItems(blockB, MU_ITEMS);

  // Prevent division by zero — mu minimum is 3 (three items × Likert min 1)
  const safeMu = Math.max(mu, 3);
  const re_org = (delta * v * D) / safeMu;

  const reOrgRounded = Math.round(re_org * 100) / 100;

  return {
    re_org: reOrgRounded,
    re_org_log: parseFloat(Math.log10(Math.max(reOrgRounded, 0) + 1).toFixed(4)),
    regime: getRegime(re_org),
    delta,
    v,
    D,
    mu,
  };
}

export function getRegime(re_org: number): IRORegime {
  if (re_org < 100) return 'laminar';
  if (re_org < 800) return 'transicion';
  if (re_org < 1200) return 'turbulencia_incipiente';
  return 'turbulencia_severa';
}

// Regime display metadata
export const REGIME_MAP: Record<IRORegime, {
  label: string;
  color: string;
  description: string;
  implications: string[];
}> = {
  laminar: {
    label: 'Régimen laminar',
    color: 'var(--color-regime-laminar)',
    description:
      'Tu organización presenta una dinámica estable y predecible. Los procesos fluyen de forma ordenada y el equipo opera con baja fricción interna.',
    implications: [
      'Los cambios organizacionales se absorben con facilidad',
      'El equipo muestra cohesión y rutinas funcionales',
      'Bajo riesgo de desgaste estructural a corto plazo',
    ],
  },
  transicion: {
    label: 'Régimen de transición',
    color: 'var(--color-regime-transicion)',
    description:
      'Tu organización se encuentra en una zona intermedia. Existen señales de tensión que, si no se gestionan, podrían escalar hacia dinámicas más turbulentas.',
    implications: [
      'Algunos procesos muestran variabilidad o fricción',
      'Es buen momento para intervenciones preventivas',
      'Monitorizar indicadores clave durante los próximos meses',
    ],
  },
  turbulencia_incipiente: {
    label: 'Turbulencia incipiente',
    color: 'var(--color-regime-incipiente)',
    description:
      'Se detectan patrones de turbulencia organizacional emergente. La dinámica del equipo presenta inestabilidad que puede afectar al rendimiento y bienestar.',
    implications: [
      'Fricción interna visible en procesos y comunicación',
      'Riesgo de desgaste profesional moderado-alto',
      'Recomendable revisar cargas de trabajo y canales de comunicación',
    ],
  },
  turbulencia_severa: {
    label: 'Turbulencia severa',
    color: 'var(--color-regime-severo)',
    description:
      'La organización muestra una dinámica altamente turbulenta. Los niveles de tensión estructural son elevados y requieren atención inmediata.',
    implications: [
      'Alta probabilidad de desgaste profesional activo',
      'Procesos y comunicación severamente afectados',
      'Intervención organizacional prioritaria recomendada',
    ],
  },
};

// ─── MBI-GS Subscales — Gil-Monte (2002) Spanish validation ───
// Agotamiento: c1-c5 | Cinismo: c6-c9, c16 | Eficacia: c10-c15
export const MBI_GS_SUBSCALES = {
  agotamiento: ['c1', 'c2', 'c3', 'c4', 'c5'],
  cinismo: ['c6', 'c7', 'c8', 'c9', 'c16'],
  eficacia: ['c10', 'c11', 'c12', 'c13', 'c14', 'c15'],
} as const;

/**
 * calculateMBIScores — para H1, H2, H3
 * Eficacia en DIRECCIÓN DIRECTA (a mayor puntuación, mayor eficacia percibida).
 * H3 predice: IRO↑ → eficacia↓ (correlación negativa con puntuación directa).
 * NO invertir aquí. Referencia: Schaufeli et al. (1996); Gil-Monte (2002).
 */
export function calculateMBIScores(blockC: BlockC) {
  const agotamiento = MBI_GS_SUBSCALES.agotamiento.reduce(
    (sum, id) => sum + (blockC[id as keyof BlockC] ?? 0), 0
  );
  const cinismo = MBI_GS_SUBSCALES.cinismo.reduce(
    (sum, id) => sum + (blockC[id as keyof BlockC] ?? 0), 0
  );
  // Eficacia SIN inversión para hipótesis directas H1-H3
  const eficacia = MBI_GS_SUBSCALES.eficacia.reduce(
    (sum, id) => sum + (blockC[id as keyof BlockC] ?? 0), 0
  );
  return { agotamiento, cinismo, eficacia };
}

/**
 * calculateMBIBurnoutIndex — SOLO si se construye índice global exploratorio
 * Invierte eficacia para que alto = más burnout en todas las dimensiones.
 * NO usar para H1–H3.
 */
export function calculateMBIBurnoutIndex(blockC: BlockC) {
  const { agotamiento, cinismo, eficacia } = calculateMBIScores(blockC);
  const eficaciaInv = (6 * 6) - eficacia; // máximo teórico 36, invertido
  const burnoutGlobal = agotamiento + cinismo + eficaciaInv;
  return { agotamiento, cinismo, eficaciaInv, burnoutGlobal };
}

/**
 * @deprecated Usar calculateMBIScores para H1-H3. Mantenido por compatibilidad.
 */
export function calculateMBI(blockC: BlockC) {
  return calculateMBIScores(blockC);
}

// ─── Oreg RTC — Oreg et al. (2008) cross-cultural validation ───

export const OREG_SUBSCALES = {
  busquedaRutina: ['d1', 'd2', 'd3', 'd4', 'd5'],
  reaccionEmocional: ['d6', 'd7', 'd8', 'd9'],
  rigidezCognitiva: ['d10', 'd11', 'd12', 'd13'],
  orientacionCP: ['d14', 'd15', 'd16', 'd17'],
} as const;

/**
 * Inversión escala Oreg (1–6): inv(v) = 7 − v
 * D4: "Siempre que mi vida se vuelve rutinaria, busco formas de cambiarla"
 * D13: "A menudo cambio de opinión"
 * Referencia: Oreg (2003, JAP); Oreg et al. (2008, JAP).
 */
export function calculateRTC(blockD: BlockD) {
  const inv = (v: number) => 7 - v;

  const busquedaRutina = (
    blockD.d1 + blockD.d2 + blockD.d3 + inv(blockD.d4) + blockD.d5
  ) / 5;

  const reaccionEmocional = (
    blockD.d6 + blockD.d7 + blockD.d8 + blockD.d9
  ) / 4;

  const rigidezCognitiva = (
    blockD.d10 + blockD.d11 + blockD.d12 + inv(blockD.d13)
  ) / 4;

  const orientacionCP = (
    blockD.d14 + blockD.d15 + blockD.d16 + blockD.d17
  ) / 4;

  // Puntuación total: media de los 17 ítems con inversión aplicada
  const rtcTotal = (
    blockD.d1 + blockD.d2 + blockD.d3 + inv(blockD.d4) + blockD.d5 +
    blockD.d6 + blockD.d7 + blockD.d8 + blockD.d9 +
    blockD.d10 + blockD.d11 + blockD.d12 + inv(blockD.d13) +
    blockD.d14 + blockD.d15 + blockD.d16 + blockD.d17
  ) / 17;

  return { busquedaRutina, reaccionEmocional, rigidezCognitiva, orientacionCP, rtcTotal };
}
