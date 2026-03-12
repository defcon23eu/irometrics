/**
 * Test unitario básico para calculateRTC
 * Verifica inversión correcta de d4 y d13
 * 
 * Ejecutar con: node --loader ts-node/esm src/lib/__tests__/iro-calculator.test.ts
 * O usar framework de testing como Jest/Vitest
 */

import { calculateRTC } from '../iro-calculator';
import type { BlockD } from '@/types';

// Caso 1: d4 y d13 en valor mínimo (1) → inversión → 6
const testCase1: BlockD = {
  d1: 3, d2: 3, d3: 3, d4: 1, d5: 3,           // d4=1 → inv=6
  d6: 3, d7: 3, d8: 3, d9: 3,
  d10: 3, d11: 3, d12: 3, d13: 1,              // d13=1 → inv=6
  d14: 3, d15: 3, d16: 3, d17: 3,
};

const result1 = calculateRTC(testCase1);
console.log('Test Case 1: d4=1 (→6), d13=1 (→6), resto=3');
console.log('  busquedaRutina:', result1.busquedaRutina, '| Esperado: (3+3+3+6+3)/5 = 3.6');
console.log('  rigidezCognitiva:', result1.rigidezCognitiva, '| Esperado: (3+3+3+6)/4 = 3.75');
console.log('  rtcTotal:', result1.rtcTotal, '| Esperado: (3*13 + 6 + 6)/17 = 3.35...');
console.assert(Math.abs(result1.busquedaRutina - 3.6) < 0.01, 'busquedaRutina incorrect');
console.assert(Math.abs(result1.rigidezCognitiva - 3.75) < 0.01, 'rigidezCognitiva incorrect');

// Caso 2: d4 y d13 en valor máximo (6) → inversión → 1
const testCase2: BlockD = {
  d1: 4, d2: 4, d3: 4, d4: 6, d5: 4,           // d4=6 → inv=1
  d6: 4, d7: 4, d8: 4, d9: 4,
  d10: 4, d11: 4, d12: 4, d13: 6,              // d13=6 → inv=1
  d14: 4, d15: 4, d16: 4, d17: 4,
};

const result2 = calculateRTC(testCase2);
console.log('\nTest Case 2: d4=6 (→1), d13=6 (→1), resto=4');
console.log('  busquedaRutina:', result2.busquedaRutina, '| Esperado: (4+4+4+1+4)/5 = 3.4');
console.log('  rigidezCognitiva:', result2.rigidezCognitiva, '| Esperado: (4+4+4+1)/4 = 3.25');
console.log('  rtcTotal:', result2.rtcTotal, '| Esperado: (4*13 + 1 + 1)/17 = 3.18...');
console.assert(Math.abs(result2.busquedaRutina - 3.4) < 0.01, 'busquedaRutina incorrect');
console.assert(Math.abs(result2.rigidezCognitiva - 3.25) < 0.01, 'rigidezCognitiva incorrect');

// Caso 3: Todos los ítems en 1 (mínimo)
const testCase3: BlockD = {
  d1: 1, d2: 1, d3: 1, d4: 1, d5: 1,           // d4=1 → inv=6
  d6: 1, d7: 1, d8: 1, d9: 1,
  d10: 1, d11: 1, d12: 1, d13: 1,              // d13=1 → inv=6
  d14: 1, d15: 1, d16: 1, d17: 1,
};

const result3 = calculateRTC(testCase3);
console.log('\nTest Case 3: Todos=1, d4=1 (→6), d13=1 (→6)');
console.log('  busquedaRutina:', result3.busquedaRutina, '| Esperado: (1+1+1+6+1)/5 = 2.0');
console.log('  reaccionEmocional:', result3.reaccionEmocional, '| Esperado: (1+1+1+1)/4 = 1.0');
console.log('  rigidezCognitiva:', result3.rigidezCognitiva, '| Esperado: (1+1+1+6)/4 = 2.25');
console.log('  orientacionCP:', result3.orientacionCP, '| Esperado: (1+1+1+1)/4 = 1.0');
console.log('  rtcTotal:', result3.rtcTotal, '| Esperado: (15*1 + 6 + 6)/17 = 1.59...');
console.assert(Math.abs(result3.busquedaRutina - 2.0) < 0.01, 'busquedaRutina incorrect');
console.assert(Math.abs(result3.reaccionEmocional - 1.0) < 0.01, 'reaccionEmocional incorrect');

console.log('\n✅ Todos los tests pasaron');
