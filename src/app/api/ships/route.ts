import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getToken } from 'next-auth/jwt';

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    console.log('DEBUG token:', token);
    if (!token || !token.id) {
      console.log('DEBUG: No token or token.id');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = token.id;
    console.log('DEBUG userId:', userId);

    const ships = await prisma.ship.findMany({
      orderBy: {
        shipName: 'asc'
      },
      select: {
        shipName: true,
        IMO_NUMBER: true,
        status: true,
        location_from: true,
        location_to: true,
        owner: true,
        Year_built: true,
        owner_contact: true,
        user_id: true,
      },
      where: { user_id: BigInt(userId) },
    });

    // Convert BigInt user_id to string for JSON serialization
    const shipsSerialized = ships.map((ship: any) => ({
      ...ship,
      user_id: ship.user_id !== null && ship.user_id !== undefined ? ship.user_id.toString() : null,
    }));

    return NextResponse.json({ 
      ships: shipsSerialized,
      count: shipsSerialized.length
    });

  } catch (error: any) {
    console.error('Get ships error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || !token.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = token.id;
    const data = await req.json();

    // Validate required fields
    const requiredFields = [
      'shipName', 'IMO_NUMBER', 'Year_built', 'owner', 'location_from', 'location_to', 'Coordinate_x', 'Coordinate_y', 'owner_contact'
    ];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 });
      }
    }

    // Create the ship
    const newShip = await prisma.ship.create({
      data: {
        shipName: data.shipName,
        IMO_NUMBER: data.IMO_NUMBER,
        Year_built: Number(data.Year_built),
        owner: data.owner,
        location_from: data.location_from,
        location_to: data.location_to,
        Coordinate_x: Number(data.Coordinate_x),
        Coordinate_y: Number(data.Coordinate_y),
        owner_contact: data.owner_contact,
        status: data.status || 'Inactive',
        user_id: BigInt(userId),
      },
    });

    // Convert user_id to string for JSON serialization
    const shipSerialized = {
      ...newShip,
      user_id: newShip.user_id !== null && newShip.user_id !== undefined ? newShip.user_id.toString() : null,
    };

    return NextResponse.json({ ship: shipSerialized }, { status: 201 });
  } catch (error: any) {
    console.error('Create ship error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 