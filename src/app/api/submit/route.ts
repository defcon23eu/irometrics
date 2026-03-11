import { NextResponse } from 'next/server';
import { surveySubmissionSchema } from '@/lib/validations';
import { calculateIRO } from '@/lib/iro-calculator';
import { getSupabase } from '@/lib/supabase';
import type { BlockB } from '@/types';

// Allowed origins — CORS
const ALLOWED_ORIGINS = [
  'https://irometrics.app',
  'http://localhost:3000',
];

// SHA-256 hash of first 3 octets of IP (RGPD-compliant anonymization)
async function hashIpPrefix(ip: string): Promise<string | null> {
  const parts = ip.split('.');
  if (parts.length < 3) return null;
  const prefix = parts.slice(0, 3).join('.');
  const data = new TextEncoder().encode(prefix);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function POST(request: Request) {
  // CORS check — allow same-origin requests (missing Origin header)
  const origin = request.headers.get('origin') ?? '';
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // Validate with Zod
  const parsed = surveySubmissionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const data = parsed.data;

  // Calculate IRO result
  const blockB: BlockB = {
    b1: data.b1, b2: data.b2, b3: data.b3, b4: data.b4,
    b5: data.b5, b6: data.b6, b7: data.b7, b8: data.b8,
    b9: data.b9, b10: data.b10, b11: data.b11, b12: data.b12,
  };
  const iroResult = calculateIRO(blockB);

  // Anonymized IP hash (RGPD: SHA-256 of first 3 octets only)
  const forwarded = request.headers.get('x-forwarded-for');
  const rawIp = forwarded ? forwarded.split(',')[0].trim() : null;
  const ipHash = rawIp ? await hashIpPrefix(rawIp) : null;

  // Insert into Supabase (fire-and-forget is fine; we already return result)
  const { error: dbError } = await getSupabase()
    .from('responses')
    .insert({
      session_id: data.session_id,
      consent_at: data.consent_at,
      started_at: data.started_at,
      completed_at: data.completed_at,
      duration_seconds: data.duration_seconds,
      ip_hash: ipHash,
      // Block A
      a1_sector: data.a1_sector,
      a2_size: data.a2_size,
      a3_role: data.a3_role,
      a4_tenure_months: data.a4_tenure_months,
      a5_age: data.a5_age,
      // Block B
      b1: data.b1, b2: data.b2, b3: data.b3, b4: data.b4,
      b5: data.b5, b6: data.b6, b7: data.b7, b8: data.b8,
      b9: data.b9, b10: data.b10, b11: data.b11, b12: data.b12,
      // Block C
      c1: data.c1, c2: data.c2, c3: data.c3, c4: data.c4,
      c5: data.c5, c6: data.c6, c7: data.c7, c8: data.c8,
      c9: data.c9, c10: data.c10, c11: data.c11, c12: data.c12,
      c13: data.c13, c14: data.c14, c15: data.c15, c16: data.c16,
      // Block D
      d1: data.d1, d2: data.d2, d3: data.d3, d4: data.d4,
      d5: data.d5, d6: data.d6, d7: data.d7, d8: data.d8,
      d9: data.d9, d10: data.d10, d11: data.d11, d12: data.d12,
      d13: data.d13, d14: data.d14, d15: data.d15, d16: data.d16,
      d17: data.d17,
      // Computed
      re_org: iroResult.re_org,
      regime: iroResult.regime,
    });

  if (dbError) {
    console.error('Supabase insert error:', dbError);
    // Still return the result to the user even if DB insert fails
  }

  const response = NextResponse.json({ result: iroResult }, { status: 200 });
  response.headers.set('Access-Control-Allow-Origin', origin);
  return response;
}

// CORS preflight
export async function OPTIONS(request: Request) {
  const origin = request.headers.get('origin') ?? '';
  if (!ALLOWED_ORIGINS.includes(origin)) {
    return new NextResponse(null, { status: 403 });
  }
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}
