// === Domain Types for IRO Metrics ===

// Block A: Sociodemographic questions
export interface BlockA {
  a1_sector: string;         // Tech subsector
  a2_size: number;           // Team size (1-9)
  a3_role: string;           // Role in organization
  a4_tenure_months: number;  // Months at company
  a5_age: number;            // Participant age
}

// Block B: IRO instrument (12 items, Likert 1-7)
export interface BlockB {
  b1: number; b2: number; b3: number; b4: number;
  b5: number; b6: number; b7: number; b8: number;
  b9: number; b10: number; b11: number; b12: number;
}

// Block C: MBI-GS (16 items, scale 0-6)
export interface BlockC {
  c1: number; c2: number; c3: number; c4: number;
  c5: number; c6: number; c7: number; c8: number;
  c9: number; c10: number; c11: number; c12: number;
  c13: number; c14: number; c15: number; c16: number;
}

// Block D: Oreg RTC (17 items, Likert 1-6)
export interface BlockD {
  d1: number; d2: number; d3: number; d4: number;
  d5: number; d6: number; d7: number; d8: number;
  d9: number; d10: number; d11: number; d12: number;
  d13: number; d14: number; d15: number; d16: number;
  d17: number;
}

// Complete survey response
export interface SurveyResponse extends BlockA, BlockB, BlockC, BlockD {
  session_id: string;
  consent_at: string;        // ISO timestamp
  started_at: string;        // ISO timestamp
  completed_at: string;      // ISO timestamp
  duration_seconds: number;
}

// IRO calculation result
export type IRORegime = 'laminar' | 'transicion' | 'turbulencia_incipiente' | 'turbulencia_severa';

export interface IROResult {
  re_org: number;
  re_org_log: number;  // log10(re_org + 1)
  regime: IRORegime;
  delta: number;   // Density index sum
  v: number;       // Change velocity sum
  D: number;       // Dispersion sum (uppercase D to match formula)
  mu: number;      // Structural resistance sum
}

// Survey state for useReducer
export interface SurveyState {
  currentItem: number;           // 0-49
  answers: Partial<SurveyResponse>;
  startTime: number;             // Date.now() on entry
  blockTransition: boolean;      // Animation between blocks
}

export type SurveyAction =
  | { type: 'SET_ANSWER'; key: string; value: string | number }
  | { type: 'NEXT_ITEM' }
  | { type: 'PREV_ITEM' }
  | { type: 'SET_BLOCK_TRANSITION'; active: boolean }
  | { type: 'RESTORE_STATE'; state: Partial<SurveyState> };

// Question definition
export interface QuestionDef {
  id: string;
  block: 'A' | 'B' | 'C' | 'D';
  text: string;
  type: 'likert7' | 'likert6' | 'mbi' | 'select' | 'number';
  options?: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
  };
  blockLabel: string;
  subscaleLabel?: string;
}
