#!/usr/bin/env node
/**
 * Script de verificación SQL para Supabase
 * Ejecuta las queries de verificación post-deploy y muestra resultados
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

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
console.log('║     VERIFICACIÓN SQL SUPABASE — IRO METRICS                   ║');
console.log('║     12 marzo 2026                                             ║');
console.log('╚═══════════════════════════════════════════════════════════════╝');
console.log('');

// Query 1: Verificar últimas 20 respuestas con re_org_log
console.log('📊 1. VERIFICACIÓN RE_ORG_LOG — Últimas 20 respuestas');
console.log('════════════════════════════════════════════════════════════════');

let okCount = 0;
let nullCount = 0;
let incorrectCount = 0;

const { data: responses, error: error1 } = await supabase
  .from('responses')
  .select('id, re_org, re_org_log, created_at')
  .order('created_at', { ascending: false })
  .limit(20);

if (error1) {
  console.error('❌ Error al consultar responses:', error1.message);
  process.exit(1);
}

if (!responses || responses.length === 0) {
  console.log('⚠️  No hay respuestas en la base de datos todavía');
} else {
  console.log(`Total de respuestas recientes: ${responses.length}\n`);
  
  console.log('ID        | re_org  | re_org_log | log10(re_org+1) | Estado');
  console.log('----------|---------|------------|-----------------|--------');
  
  responses.forEach(r => {
    const expected = Math.log10((r.re_org || 0) + 1);
    const diff = r.re_org_log ? Math.abs(r.re_org_log - expected) : null;
    
    let estado;
    if (r.re_org_log === null) {
      estado = '🔴 NULL';
      nullCount++;
    } else if (diff > 0.001) {
      estado = '🟡 INCORRECTO';
      incorrectCount++;
    } else {
      estado = '🟢 OK';
      okCount++;
    }
    
    const reOrg = r.re_org?.toFixed(2).padStart(7) || 'null   ';
    const reOrgLog = r.re_org_log?.toFixed(4).padStart(10) || 'null      ';
    const expectedStr = expected.toFixed(4).padStart(15);
    
    console.log(`${r.id} | ${reOrg} | ${reOrgLog} | ${expectedStr} | ${estado}`);
  });
  
  console.log('');
  console.log('Resumen:');
  console.log(`  🟢 OK:          ${okCount}`);
  console.log(`  🔴 NULL:        ${nullCount} ${nullCount > 0 ? '← BUG-03 activo' : ''}`);
  console.log(`  🟡 INCORRECTO:  ${incorrectCount}`);
}

console.log('');
console.log('📊 2. ESTADÍSTICAS GENERALES');
console.log('════════════════════════════════════════════════════════════════');

const { data: stats, error: error2 } = await supabase
  .from('responses')
  .select('re_org, re_org_log');

if (error2) {
  console.error('❌ Error al consultar estadísticas:', error2.message);
  process.exit(1);
}

if (!stats || stats.length === 0) {
  console.log('⚠️  No hay datos para calcular estadísticas');
} else {
  const total = stats.length;
  const conReOrgLog = stats.filter(s => s.re_org_log !== null).length;
  const faltantes = total - conReOrgLog;
  
  const avgReOrg = stats.reduce((sum, s) => sum + (s.re_org || 0), 0) / total;
  const avgReOrgLog = conReOrgLog > 0 
    ? stats.filter(s => s.re_org_log !== null)
           .reduce((sum, s) => sum + s.re_org_log, 0) / conReOrgLog
    : 0;
  
  console.log(`Total respuestas:        ${total}`);
  console.log(`Con re_org_log:          ${conReOrgLog}`);
  console.log(`Faltantes re_org_log:    ${faltantes} ${faltantes > 0 ? '← BUG-03 pre-fix' : ''}`);
  console.log(`Promedio re_org:         ${avgReOrg.toFixed(2)}`);
  console.log(`Promedio re_org_log:     ${avgReOrgLog.toFixed(4)}`);
}

console.log('');
console.log('╔═══════════════════════════════════════════════════════════════╗');
if (nullCount === 0 && incorrectCount === 0) {
  console.log('║                  ✅ VERIFICACIÓN EXITOSA                      ║');
  console.log('║          Todos los re_org_log calculados correctamente       ║');
} else if (nullCount > 0) {
  console.log('║            ⚠️  VERIFICACIÓN PARCIAL                           ║');
  console.log('║     Hay respuestas con re_org_log NULL (pre-fix legacy)      ║');
  console.log('║     Las nuevas respuestas deben mostrar 🟢 OK                ║');
} else {
  console.log('║                  🟡 ATENCIÓN REQUERIDA                        ║');
  console.log('║          Hay diferencias en cálculo de re_org_log            ║');
}
console.log('╚═══════════════════════════════════════════════════════════════╝');

process.exit(0);
