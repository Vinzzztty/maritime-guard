import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id_ship: string }> }
) {
  const params = await context.params;
  const { id_ship } = params;
  const limit = parseInt(req.nextUrl.searchParams.get('limit') || '200', 10);

  if (!id_ship) {
    return NextResponse.json({ error: 'Missing ship id' }, { status: 400 });
  }

  try {
    // Query logs for this ship using join (ship_device assumed, adjust if needed)
    const logs = await prisma.$queryRawUnsafe(
      `SELECT l.id, l.device_id, d.id_ship, l.timestamp, l.corroction_status, l.sensor1, l.sensor2, l.sensor3, l.sensor4
       FROM monitor_ship_log l
       JOIN ship_device d ON l.device_id = d.device_id
       WHERE d.id_ship = $1
       ORDER BY l.timestamp DESC
       LIMIT $2`,
      id_ship,
      limit
    );
    return NextResponse.json(Array.isArray(logs) ? logs : []);
  } catch (error) {
    console.error('DB query error:', error instanceof Error ? error.stack : error);
    return NextResponse.json({ error: 'DB query error', details: (error as Error).message, stack: error instanceof Error ? error.stack : undefined }, { status: 500 });
  }
} 