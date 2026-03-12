import type { BlockB, BlockC, IRORegime, IROResult } from '@/types';

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
  const safeMu = Math.max(mu, 1);
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
// Agotamiento: c1-c5 | Cinismo: c6-c9, c16 | Eficacia: c10-c15 (INVERSA)
export const MBI_GS_SUBSCALES = {
  agotamiento: ['c1', 'c2', 'c3', 'c4', 'c5'],
  cinismo: ['c6', 'c7', 'c8', 'c9', 'c16'],
  eficacia: ['c10', 'c11', 'c12', 'c13', 'c14', 'c15'],
} as const;

export function calculateMBI(blockC: BlockC) {
  const agotamiento = MBI_GS_SUBSCALES.agotamiento.reduce(
    (sum, id) => sum + (blockC[id as keyof BlockC] ?? 0), 0
  );
  const cinismo = MBI_GS_SUBSCALES.cinismo.reduce(
    (sum, id) => sum + (blockC[id as keyof BlockC] ?? 0), 0
  );
  // Inverse scoring for Professional Efficacy (Gil-Monte, 2002):
  // item_score = 6 - response (MBI-GS scale 0–6)
  const eficacia = MBI_GS_SUBSCALES.eficacia.reduce(
    (sum, id) => sum + (6 - (blockC[id as keyof BlockC] ?? 0)), 0
  );
  return { agotamiento, cinismo, eficacia };
}
