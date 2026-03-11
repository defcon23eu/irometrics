import type { QuestionDef } from '@/types';

// Block A: Sociodemographic (5 items)
const blockA: QuestionDef[] = [
  {
    id: 'a1_sector',
    block: 'A',
    text: '¿A qué subsector tecnológico pertenece tu empresa?',
    type: 'select',
    options: [
      { value: 'desarrollo_software', label: 'Desarrollo de software' },
      { value: 'consultoria_ti', label: 'Consultoría TI' },
      { value: 'diseno_ux', label: 'Diseño / UX' },
      { value: 'data_ia', label: 'Data / IA' },
      { value: 'ciberseguridad', label: 'Ciberseguridad' },
      { value: 'cloud_infra', label: 'Cloud / Infraestructura' },
      { value: 'marketing_digital', label: 'Marketing digital' },
      { value: 'otro', label: 'Otro subsector tech' },
    ],
    blockLabel: 'Contexto organizacional',
  },
  {
    id: 'a2_size',
    block: 'A',
    text: '¿Cuántas personas trabajan en tu empresa (incluyéndote)?',
    type: 'number',
    validation: { min: 1, max: 9 },
    blockLabel: 'Contexto organizacional',
  },
  {
    id: 'a3_role',
    block: 'A',
    text: '¿Cuál es tu rol principal en la organización?',
    type: 'select',
    options: [
      { value: 'ceo_fundador', label: 'CEO / Fundador/a' },
      { value: 'cto', label: 'CTO / Director/a técnico/a' },
      { value: 'team_lead', label: 'Team Lead / Responsable de equipo' },
      { value: 'developer', label: 'Desarrollador/a' },
      { value: 'designer', label: 'Diseñador/a' },
      { value: 'pm', label: 'Product / Project Manager' },
      { value: 'otro', label: 'Otro rol' },
    ],
    blockLabel: 'Contexto organizacional',
  },
  {
    id: 'a4_tenure_months',
    block: 'A',
    text: '¿Cuántos meses llevas trabajando en esta empresa?',
    type: 'number',
    validation: { min: 3, max: 600 },
    blockLabel: 'Contexto organizacional',
  },
  {
    id: 'a5_age',
    block: 'A',
    text: '¿Cuántos años tienes?',
    type: 'number',
    validation: { min: 18, max: 75 },
    blockLabel: 'Contexto organizacional',
  },
];

// Block B: IRO instrument (12 items, Likert 1-7)
const blockB: QuestionDef[] = [
  // δ (Density) subscale: b1-b3
  { id: 'b1', block: 'B', text: 'En mi empresa, las tareas de diferentes personas se solapan frecuentemente.', type: 'likert7', blockLabel: 'Dinámica organizacional' },
  { id: 'b2', block: 'B', text: 'Hay muchos procesos que dependen de pocas personas.', type: 'likert7', blockLabel: 'Dinámica organizacional' },
  { id: 'b3', block: 'B', text: 'Si una persona falta, varios proyectos se ven afectados.', type: 'likert7', blockLabel: 'Dinámica organizacional' },
  // v (Velocity) subscale: b4-b6
  { id: 'b4', block: 'B', text: 'Los cambios en la organización ocurren muy rápidamente.', type: 'likert7', blockLabel: 'Dinámica organizacional' },
  { id: 'b5', block: 'B', text: 'Apenas nos adaptamos a un cambio cuando ya llega otro.', type: 'likert7', blockLabel: 'Dinámica organizacional' },
  { id: 'b6', block: 'B', text: 'El ritmo de trabajo cambia de forma impredecible.', type: 'likert7', blockLabel: 'Dinámica organizacional' },
  // D (Dispersion) subscale: b7-b9
  { id: 'b7', block: 'B', text: 'Las decisiones importantes se toman de forma descoordinada.', type: 'likert7', blockLabel: 'Dinámica organizacional' },
  { id: 'b8', block: 'B', text: 'A menudo cada persona trabaja en una dirección diferente.', type: 'likert7', blockLabel: 'Dinámica organizacional' },
  { id: 'b9', block: 'B', text: 'Es difícil saber quién se encarga de qué.', type: 'likert7', blockLabel: 'Dinámica organizacional' },
  // μ (Resistance) subscale: b10-b12
  { id: 'b10', block: 'B', text: 'Nuestro equipo tiene procedimientos claros para resolver conflictos.', type: 'likert7', blockLabel: 'Dinámica organizacional' },
  { id: 'b11', block: 'B', text: 'Existen mecanismos estables de coordinación en el día a día.', type: 'likert7', blockLabel: 'Dinámica organizacional' },
  { id: 'b12', block: 'B', text: 'Cuando surge un problema, sabemos cómo abordarlo colectivamente.', type: 'likert7', blockLabel: 'Dinámica organizacional' },
];

// Block C: MBI-GS (16 items, scale 0-6)
const blockC: QuestionDef[] = [
  // Exhaustion subscale (EX): c1-c5
  { id: 'c1', block: 'C', text: 'Me siento emocionalmente agotado/a por mi trabajo.', type: 'mbi', blockLabel: 'Experiencia laboral' },
  { id: 'c2', block: 'C', text: 'Me siento agotado/a al final de la jornada laboral.', type: 'mbi', blockLabel: 'Experiencia laboral' },
  { id: 'c3', block: 'C', text: 'Me siento cansado/a cuando me levanto por la mañana y tengo que enfrentarme a otro día de trabajo.', type: 'mbi', blockLabel: 'Experiencia laboral' },
  { id: 'c4', block: 'C', text: 'Trabajar todo el día supone realmente un esfuerzo para mí.', type: 'mbi', blockLabel: 'Experiencia laboral' },
  { id: 'c5', block: 'C', text: 'Me siento quemado/a por mi trabajo.', type: 'mbi', blockLabel: 'Experiencia laboral' },
  // Cynicism subscale (CY): c6-c9
  { id: 'c6', block: 'C', text: 'He ido perdiendo el interés por mi trabajo desde que empecé en este puesto.', type: 'mbi', blockLabel: 'Experiencia laboral' },
  { id: 'c7', block: 'C', text: 'He ido perdiendo el entusiasmo por mi trabajo.', type: 'mbi', blockLabel: 'Experiencia laboral' },
  { id: 'c8', block: 'C', text: 'Solo quiero hacer mi trabajo y que no me molesten.', type: 'mbi', blockLabel: 'Experiencia laboral' },
  { id: 'c9', block: 'C', text: 'Me he vuelto más cínico/a respecto a si mi trabajo vale para algo.', type: 'mbi', blockLabel: 'Experiencia laboral' },
  // Professional Efficacy subscale (PE): c10-c15
  { id: 'c10', block: 'C', text: 'Puedo resolver eficazmente los problemas que surgen en mi trabajo.', type: 'mbi', blockLabel: 'Experiencia laboral' },
  { id: 'c11', block: 'C', text: 'Siento que estoy haciendo una contribución efectiva a mi organización.', type: 'mbi', blockLabel: 'Experiencia laboral' },
  { id: 'c12', block: 'C', text: 'En mi opinión, soy bueno/a en mi trabajo.', type: 'mbi', blockLabel: 'Experiencia laboral' },
  { id: 'c13', block: 'C', text: 'Me siento estimulado/a cuando alcanzo mis objetivos en el trabajo.', type: 'mbi', blockLabel: 'Experiencia laboral' },
  { id: 'c14', block: 'C', text: 'He conseguido muchas cosas valiosas en este puesto.', type: 'mbi', blockLabel: 'Experiencia laboral' },
  { id: 'c15', block: 'C', text: 'En mi trabajo, tengo la confianza de que soy eficaz y hago las cosas bien.', type: 'mbi', blockLabel: 'Experiencia laboral' },
  { id: 'c16', block: 'C', text: 'Dudo de la importancia de mi trabajo.', type: 'mbi', blockLabel: 'Experiencia laboral' },
];

// Block D: Oreg RTC (17 items, Likert 1-6)
const blockD: QuestionDef[] = [
  { id: 'd1', block: 'D', text: 'Generalmente, considero que los cambios son negativos.', type: 'likert6', blockLabel: 'Cambio organizacional' },
  { id: 'd2', block: 'D', text: 'Prefiero un día rutinario a un día lleno de eventos inesperados.', type: 'likert6', blockLabel: 'Cambio organizacional' },
  { id: 'd3', block: 'D', text: 'Me gusta hacer las mismas cosas en vez de probar cosas nuevas y diferentes.', type: 'likert6', blockLabel: 'Cambio organizacional' },
  { id: 'd4', block: 'D', text: 'Siempre que mi vida se vuelve rutinaria, busco formas de cambiarla.', type: 'likert6', blockLabel: 'Cambio organizacional' },
  { id: 'd5', block: 'D', text: 'Prefiero el aburrimiento a la sorpresa.', type: 'likert6', blockLabel: 'Cambio organizacional' },
  { id: 'd6', block: 'D', text: 'Si me informan de un cambio significativo en el trabajo, me siento estresado/a.', type: 'likert6', blockLabel: 'Cambio organizacional' },
  { id: 'd7', block: 'D', text: 'Cuando me obligan a cambiar de planes, me siento tenso/a o estresado/a.', type: 'likert6', blockLabel: 'Cambio organizacional' },
  { id: 'd8', block: 'D', text: 'Cuando las cosas no van según lo planeado, me estreso.', type: 'likert6', blockLabel: 'Cambio organizacional' },
  { id: 'd9', block: 'D', text: 'Si mi jefe/a cambiara los criterios de evaluación, me sentiría incómodo/a.', type: 'likert6', blockLabel: 'Cambio organizacional' },
  { id: 'd10', block: 'D', text: 'No cambio de opinión fácilmente.', type: 'likert6', blockLabel: 'Cambio organizacional' },
  { id: 'd11', block: 'D', text: 'Una vez que he tomado una decisión, no la cambio.', type: 'likert6', blockLabel: 'Cambio organizacional' },
  { id: 'd12', block: 'D', text: 'Mis opiniones son muy consistentes a lo largo del tiempo.', type: 'likert6', blockLabel: 'Cambio organizacional' },
  { id: 'd13', block: 'D', text: 'A menudo cambio de opinión.', type: 'likert6', blockLabel: 'Cambio organizacional' },
  { id: 'd14', block: 'D', text: 'No suelo cambiar fácilmente la forma en que hago las cosas.', type: 'likert6', blockLabel: 'Cambio organizacional' },
  { id: 'd15', block: 'D', text: 'Cuando alguien me presiona para cambiar algo, tiendo a resistirme aunque creo que el cambio puede beneficiarme.', type: 'likert6', blockLabel: 'Cambio organizacional' },
  { id: 'd16', block: 'D', text: 'A veces evito las innovaciones porque me obligan a salir de mi zona de confort.', type: 'likert6', blockLabel: 'Cambio organizacional' },
  { id: 'd17', block: 'D', text: 'Me resulta difícil adaptarme a situaciones nuevas.', type: 'likert6', blockLabel: 'Cambio organizacional' },
];

export const ALL_QUESTIONS: QuestionDef[] = [
  ...blockA,
  ...blockB,
  ...blockC,
  ...blockD,
];

export const TOTAL_ITEMS = ALL_QUESTIONS.length; // 50

// Block boundaries (0-indexed)
export const BLOCK_RANGES = {
  A: { start: 0, end: 4 },   // 5 items
  B: { start: 5, end: 16 },  // 12 items
  C: { start: 17, end: 32 }, // 16 items
  D: { start: 33, end: 49 }, // 17 items
} as const;

// Block transition messages
export const BLOCK_TRANSITIONS: Record<string, string> = {
  'A_B': 'Ahora evaluaremos la dinámica de tu organización',
  'B_C': 'A continuación, sobre tu experiencia personal en el trabajo',
  'C_D': 'Por último, algunas preguntas sobre el cambio organizacional',
};
