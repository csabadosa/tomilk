import { NextResponse } from 'next/server';
import { z } from 'zod';

const bookingSchema = z.object({
  message: z.string().trim().min(20).max(5000),
  language: z.enum(['hu', 'ro']),
});

const requests = new Map<string, number[]>();

export async function POST(req: Request) {
  const forwarded = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const now = Date.now();
  const recent = (requests.get(forwarded) ?? []).filter(time => now - time < 60_000);
  if (recent.length >= 5) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }
  recent.push(now);
  requests.set(forwarded, recent);

  const apiKey = process.env.RESEND_API_KEY;
  const sender = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !sender) {
    return NextResponse.json({ error: 'email_not_configured' }, { status: 503 });
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  }

  const parsed = bookingSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  }

  const subject = parsed.data.language === 'hu'
    ? 'Tomilk Prod — különjárat foglalási kérelem'
    : 'Tomilk Prod — cerere de rezervare transport privat';

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: sender,
        to: ['temese38@gmail.com'],
        subject,
        text: parsed.data.message,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'email_delivery_failed' }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'email_delivery_failed' }, { status: 502 });
  }
}
