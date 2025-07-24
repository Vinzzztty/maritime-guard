import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

function getHourStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), 0, 0, 0);
}

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const imo = params.id;
  if (!imo) {
    return NextResponse.json({ error: 'Missing ship id' }, { status: 400 });
  }

  // Fetch ship
  const ship = await prisma.ship.findUnique({
    where: { IMO_NUMBER: imo },
  });

  if (!ship) {
    return NextResponse.json({ error: 'Ship not found' }, { status: 404 });
  }

  // Fetch the latest monitor log for this ship
  const latestLog = await prisma.monitor_ship_log.findFirst({
    where: { id_ship: imo },
    orderBy: { timestamp: 'desc' },
  });

  // Fetch sensor history for the last 24 hours, grouped by hour
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const logs = await prisma.monitor_ship_log.findMany({
    where: {
      id_ship: imo,
      timestamp: {
        gte: oneDayAgo,
        lte: now,
      },
    },
    orderBy: { timestamp: 'asc' },
  });

  // Group logs by hour
  const hourMap = new Map();
  for (const log of logs) {
    const hour = getHourStart(log.timestamp ?? new Date()).toISOString();
    if (!hourMap.has(hour)) {
      hourMap.set(hour, {
        timestamp: hour,
        sensor1: log.sensor1 ? parseFloat(log.sensor1) : null,
        sensor2: log.sensor2 ? parseFloat(log.sensor2) : null,
        sensor3: log.sensor3 ? parseFloat(log.sensor3) : null,
        sensor4: log.sensor4 ? parseFloat(log.sensor4) : null,
        corroction_status: log.corroction_status,
      });
    }
    // Optionally, you could average values if multiple logs per hour
  }
  const sensorHistory = Array.from(hourMap.values());

  let sensors: any[] = [];
  if (latestLog) {
    const status = latestLog.corroction_status || 'Unknown';
    const color = status === 'High' ? 'red' : status === 'Medium' ? 'yellow' : 'green';
    sensors = [
      {
        id: 1,
        name: 'Hull Sensor A',
        status,
        color,
        data: [],
        value: latestLog.sensor1 ? parseFloat(latestLog.sensor1) : null,
        unit: 'mm/year',
      },
      {
        id: 2,
        name: 'Hull Sensor B',
        status,
        color,
        data: [],
        value: latestLog.sensor2 ? parseFloat(latestLog.sensor2) : null,
        unit: 'mm/year',
      },
      {
        id: 3,
        name: 'Hull Sensor C',
        status,
        color,
        data: [],
        value: latestLog.sensor3 ? parseFloat(latestLog.sensor3) : null,
        unit: 'mm/year',
      },
    ];
    // Add sensor4 if present
    if (latestLog.sensor4 !== undefined && latestLog.sensor4 !== null) {
      sensors.push({
        id: 4,
        name: 'Hull Sensor D',
        status,
        color,
        data: [],
        value: latestLog.sensor4 ? parseFloat(latestLog.sensor4) : null,
        unit: 'mm/year',
      });
    }
  }

  // Compose response
  return NextResponse.json({
    name: ship.shipName,
    imo: ship.IMO_NUMBER,
    status: ship.status === 'Active' ? 'Active' : 'Inactive',
    location: `${ship.location_from} → ${ship.location_to}`,
    owner: ship.owner,
    yearBuilt: ship.Year_built,
    sensors,
    timestamp: latestLog?.timestamp,
    corroction_status: latestLog?.corroction_status,
    sensorHistory,
  });
}

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const imo = params.id;
  if (!imo) {
    return NextResponse.json({ error: 'Missing ship id' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { status } = body;

    // Validate status
    if (!status || !['Active', 'Inactive'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status. Must be "Active" or "Inactive"' }, { status: 400 });
    }

    // Update ship status in database
    const updatedShip = await prisma.ship.update({
      where: { IMO_NUMBER: imo },
      data: { status },
    });

    return NextResponse.json({ 
      success: true, 
      message: `Ship status updated to ${status}`,
      ship: {
        name: updatedShip.shipName,
        imo: updatedShip.IMO_NUMBER,
        status: updatedShip.status === 'Active' ? 'Active' : 'Inactive',
        location: `${updatedShip.location_from} → ${updatedShip.location_to}`,
        owner: updatedShip.owner,
        yearBuilt: updatedShip.Year_built,
      }
    });

  } catch (error: any) {
    console.error('Update ship status error:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Ship not found' }, { status: 404 });
    }
    
    return NextResponse.json({ error: 'Failed to update ship status' }, { status: 500 });
  }
} 