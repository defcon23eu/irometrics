import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

function loadEnv(filePath = '.env.local') {
  const content = readFileSync(filePath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

const { data: tableProbe, error: tableErr } = await supabase
  .from('responses')
  .select('id')
  .limit(1);

if (tableErr) {
  console.error('❌ TABLE CHECK FAILED:', tableErr.message);
  if (/relation .*responses.* does not exist/i.test(tableErr.message)) {
    console.log('→ Ejecuta supabase/migrations/001_responses.sql en Supabase SQL Editor');
  }
  process.exit(1);
}

const testId = crypto.randomUUID();
const now = new Date();
const started = new Date(now.getTime() - 8 * 60 * 1000);

const payload = {
  session_id: testId,
  consent_at: now.toISOString(),
  started_at: started.toISOString(),
  completed_at: now.toISOString(),
  duration_seconds: 480,
  ip_hash: 'test-ip-hash',
  a1_sector: 'desarrollo_software',
  a2_size: 5,
  a3_role: 'developer',
  a4_tenure_months: 24,
  a5_age: 32,
  b1: 5, b2: 6, b3: 5,
  b4: 6, b5: 5, b6: 6,
  b7: 4, b8: 5, b9: 4,
  b10: 3, b11: 3, b12: 4,
  c1: 4, c2: 5, c3: 3, c4: 4, c5: 5,
  c6: 3, c7: 4, c8: 3, c9: 4, c10: 5,
  c11: 6, c12: 5, c13: 6, c14: 5, c15: 4, c16: 3,
  d1: 3, d2: 4, d3: 3, d4: 4, d5: 3,
  d6: 4, d7: 3, d8: 4, d9: 3,
  d10: 4, d11: 3, d12: 4, d13: 3,
  d14: 3, d15: 4, d16: 3, d17: 4,
  re_org: 333.33,
  regime: 'transicion',
};

const { error: insertErr } = await supabase.from('responses').insert(payload);
if (insertErr) {
  console.error('❌ INSERT FAILED:', insertErr.message);
  process.exit(1);
}

const { data: spssRow, error: spssErr } = await supabase
  .from('export_spss')
  .select('*')
  .eq('session_id', testId)
  .single();

if (spssErr || !spssRow) {
  console.error('❌ VISTA export_spss FAILED:', spssErr?.message ?? 'row missing');
  process.exit(1);
}

const checks = {
  'oreg_rutina === 17': spssRow.oreg_rutina === 17,
  'oreg_total === 59': spssRow.oreg_total === 59,
  'mbi_agotamiento === 21': spssRow.mbi_agotamiento === 21,
  'delta_sum === 16': spssRow.delta_sum === 16,
};

const failed = Object.entries(checks).filter(([, ok]) => !ok);
if (failed.length > 0) {
  console.error('❌ SCHEMA/VIEW CHECK FAILED:', failed.map(([k]) => k).join(', '));
  process.exit(1);
}

await supabase.from('responses').delete().eq('session_id', testId);

console.log('✅ Supabase OK — tabla, insert y vista export_spss verificados');
console.log('   Proyecto:', supabaseUrl);
console.log('   Subescalas:', JSON.stringify({
  oreg_rutina: spssRow.oreg_rutina,
  oreg_total: spssRow.oreg_total,
  delta_sum: spssRow.delta_sum,
}));
