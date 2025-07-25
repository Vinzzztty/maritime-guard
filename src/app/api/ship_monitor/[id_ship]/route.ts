import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export async function GET(request: Request, context: any) {
  const params = await context.params;
  const { id_ship } = params;
  try {
    const shipMonitor = await prisma.ship_monitor.findUnique({
      where: { id_ship: id_ship },
      select: {
        id_ship: true,
        device1: true,
        device2: true,
        device3: true,
        device4: true,
      },
    });
    if (!shipMonitor) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(shipMonitor);
  } catch (error) {
    let message = 'Unknown error';
    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
} 