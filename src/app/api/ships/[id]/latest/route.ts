import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../../lib/prisma';
import type { Prisma } from '@prisma/client';

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const imo = params.id;
  if (!imo) {
    return NextResponse.json({ error: 'Missing ship id' }, { status: 400 });
  }

  // Fetch all device IDs for this ship from ship_device
  const devices: { device_id: string }[] = await (prisma as any).ship_device.findMany({
    where: { id_ship: imo },
    orderBy: { device_id: 'asc' }, // optional: keep order consistent
    take: 4, // only up to 4 devices
  });
  if (!devices.length) {
    return NextResponse.json({ devices: [] });
  }
  const deviceIds = devices.map((d: { device_id: string }) => d.device_id);

  // For each device, fetch the latest log
  const deviceLogs = await Promise.all(deviceIds.map(async (deviceId: string, idx: number) => {
    const log = await prisma.monitor_ship_log.findFirst({
      where: { device_id: deviceId },
      orderBy: { timestamp: 'desc' },
    });
    if (!log) return null;
    return {
      device: deviceId,
      id: idx + 1,
      name: `Device ${idx + 1}`,
      timestamp: log.timestamp,
      sensors: [
        { id: 1, value: log.sensor1 ? parseFloat(log.sensor1) : null },
        { id: 2, value: log.sensor2 ? parseFloat(log.sensor2) : null },
        { id: 3, value: log.sensor3 ? parseFloat(log.sensor3) : null },
        { id: 4, value: log.sensor4 ? parseFloat(log.sensor4) : null },
      ],
    };
  }));

  // Filter out any nulls (in case a device has no logs)
  const resultDevices = deviceLogs.filter(Boolean);

  return NextResponse.json({ devices: resultDevices });
} 