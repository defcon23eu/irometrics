#!/usr/bin/env node
/**
 * Test de inserción de datos de prueba para verificar BUG-03
 * Inserta una respuesta de prueba y verifica que re_org_log se calcule correctamente
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { randomUUID } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env vars
const envPath = join(__dirname, '..', '.env.local');
const envContent = readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length) {
    env[key.trim()] = valueParts.join('=').trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false }
});

console.log('╔═══════════════════════════════════════════════════════════════╗');
console.log('║     TEST BUG-03 — Inserción con re_org_log                   ║');
console.log('╚═══════════════════════════════════════════════════════════════╝');
console.log('');

// Generar datos de prueba que resulten en Re_org ≈ 450 (régimen transición)
const testData = {
  session_id: randomUUID(),
  consent_at: new Date().toISOString(),
  started_at: new Date().toISOString(),
  completed_at: new Date().toISOString(),
  duration_seconds: 300,
  // Block A
  a1_sector: 'desarrollo_software',
  a2_size: 5,
  a3_role: 'developer',
  a4_tenure_months: 12,
  a5_age: 30,
  // Block B - IRO: δ=12, v=12, D=12, μ=9 → Re_org = (12*12*12)/9 = 192
  b1: 4, b2: 4, b3: 4,  // δ = 12
  b4: 4, b5: 4, b6: 4,  // v = 12
  b7: 4, b8: 4, b9: 4,  // D = 12
  b10: 3, b11: 3, b12: 3, // μ = 9
  // Block C - MBI
  c1: 3, c2: 3, c3: 3, c4: 3, c5: 3,
  c6: 2, c7: 2, c8: 2, c9: 2, c16: 2,
  c10: 4, c11: 4, c12: 4, c13: 4, c14: 4, c15: 4,
  // Block D - RTC
  d1: 3, d2: 3, d3: 3, d4: 4, d5: 3,
  d6: 3, d7: 3, d8: 3, d9: 3,
  d10: 3, d11: 3, d12: 3, d13: 4,
  d14: 3, d15: 3, d16: 3, d17: 3,
};

// Calcular Re_org esperado
const delta = testData.b1 + testData.b2 + testData.b3;
const v = testData.b4 + testData.b5 + testData.b6;
const D = testData.b7 + testData.b8 + testData.b9;
const mu = testData.b10 + testData.b11 + testData.b12;
const safeMu = Math.max(mu, 3);
const re_org_esperado = Math.round((delta * v * D) / safeMu);
const re_org_log_esperado = Math.log10(re_org_esperado + 1);

console.log('📝 Datos de prueba:');
console.log(`   δ = ${delta}, v = ${v}, D = ${D}, μ = ${mu}`);
console.log(`   Re_org esperado: ${re_org_esperado}`);
console.log(`   Re_org_log esperado: ${re_org_log_esperado.toFixed(4)}`);
console.log('');

// Insertar solo con re_org (re_org_log es GENERATED ALWAYS AS en Supabase)
const dataWithCalcs = {
  ...testData,
  re_org: re_org_esperado,
  regime: re_org_esperado < 100 ? 'laminar' : 
          re_org_esperado < 800 ? 'transicion' : 
          re_org_esperado < 1200 ? 'turbulencia_incipiente' : 
          'turbulencia_severa',
};

console.log('💾 Insertando respuesta de prueba (re_org_log se calcula automáticamente)...');
const { data: inserted, error: insertError } = await supabase
  .from('responses')
  .insert(dataWithCalcs)
  .select()
  .single();

if (insertError) {
  console.error('❌ Error al insertar:', insertError.message);
  process.exit(1);
}

console.log('✅ Respuesta insertada con ID:', inserted.id);
console.log('');

// Verificar que se insertó correctamente
console.log('🔍 Verificando valores almacenados...');
const { data: verificacion, error: verifyError } = await supabase
  .from('responses')
  .select('id, re_org, re_org_log, created_at')
  .eq('id', inserted.id)
  .single();

if (verifyError) {
  console.error('❌ Error al verificar:', verifyError.message);
  process.exit(1);
}

const diferencia = Math.abs(verificacion.re_org_log - re_org_log_esperado);
const estado = verificacion.re_org_log === null ? '🔴 NULL (BUG-03 activo)' :
               diferencia > 0.001 ? '🟡 INCORRECTO' :
               '🟢 OK';

console.log('');
console.log('┌─────────────────────────────────────────────────────────────┐');
console.log('│ RESULTADO DE VERIFICACIÓN                                   │');
console.log('├─────────────────────────────────────────────────────────────┤');
console.log(`│ ID:              ${verificacion.id}                │`);
console.log(`│ Re_org:          ${verificacion.re_org.toFixed(2).padEnd(43)} │`);
console.log(`│ Re_org_log:      ${(verificacion.re_org_log || 0).toFixed(4).padEnd(43)} │`);
console.log(`│ Esperado:        ${re_org_log_esperado.toFixed(4).padEnd(43)} │`);
console.log(`│ Diferencia:      ${diferencia.toFixed(6).padEnd(43)} │`);
console.log(`│ Estado:          ${estado.padEnd(43)} │`);
console.log('└─────────────────────────────────────────────────────────────┘');
console.log('');

if (verificacion.re_org_log === null) {
  console.log('❌ BUG-03 TODAVÍA ACTIVO: re_org_log no se está persistiendo');
  console.log('   Verificar que el código en src/app/api/submit/route.ts incluye:');
  console.log('   re_org_log: iroResult.re_org_log');
  process.exit(1);
} else if (diferencia > 0.001) {
  console.log('🟡 ADVERTENCIA: re_org_log se persiste pero con diferencia');
  console.log(`   Diferencia: ${diferencia}`);
  process.exit(1);
} else {
  console.log('✅ BUG-03 RESUELTO: re_org_log se calcula y persiste correctamente');
  console.log('');
  console.log('🧹 Limpiando...');
  
  // Eliminar el registro de prueba
  const { error: deleteError } = await supabase
    .from('responses')
    .delete()
    .eq('id', inserted.id);
  
  if (deleteError) {
    console.log(`⚠️  No se pudo eliminar el registro de prueba (ID: ${inserted.id})`);
  } else {
    console.log('✅ Registro de prueba eliminado');
  }
}

console.log('');
console.log('╔═══════════════════════════════════════════════════════════════╗');
console.log('║              TEST BUG-03: ✅ EXITOSO                          ║');
console.log('╚═══════════════════════════════════════════════════════════════╝');

process.exit(0);
