import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id_ship: string }> }
) {
  const params = await context.params;
  const { id_ship } = params;
  const limit = req.nextUrl.searchParams.get('limit') || '10000';
  const backendUrl = `http://localhost:8000/monitor_ship_log/${id_ship}?limit=${limit}`;

  try {
    const res = await fetch(backendUrl, { headers: { 'accept': 'application/json' } });
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch from backend' }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Proxy error', details: (error as Error).message }, { status: 500 });
  }
} 