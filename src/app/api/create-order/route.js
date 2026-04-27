import { NextResponse } from 'next/server';

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

// Handle OPTIONS preflight (same-origin, so browser never sends it — but just in case)
export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function POST(request) {
  try {
    const body = await request.json();

    const upstream = await fetch(`${BACKEND}/api/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch (err) {
    console.error('❌ Proxy /api/create-order error:', err);
    return NextResponse.json(
      { success: false, message: 'Proxy error — could not reach payment server.' },
      { status: 502 }
    );
  }
}
