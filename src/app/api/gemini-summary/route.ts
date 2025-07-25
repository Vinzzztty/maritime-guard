import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const apiKey = process.env.GEMINI_API_KEY;
  console.log('GEMINI_API_KEY:', apiKey ? 'set' : 'not set');
  if (!apiKey) {
    return NextResponse.json({ error: 'GEMINI_API_KEY not set' }, { status: 500 });
  }

  let ships = body.ships;

  // If no ships or id_ship provided, fetch all ships and their statuses
  if (!ships && !body.id_ship) {
    const allShips = await prisma.ship.findMany({
      select: { IMO_NUMBER: true, shipName: true }
    });
    ships = await Promise.all(
      allShips.map(async (ship: any) => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/ship_monitor/${ship.IMO_NUMBER}`);
          if (res.status === 404) {
            return {
              shipName: ship.shipName || ship.IMO_NUMBER,
              status: 'Unknown',
            };
          }
          const data = await res.json();
          const status = data && !data.error
            ? [data.device1, data.device2, data.device3, data.device4].filter(Boolean).join(', ')
            : 'Unknown';
          return {
            shipName: ship.shipName || ship.IMO_NUMBER,
            status
          };
        } catch {
          return {
            shipName: ship.shipName || ship.IMO_NUMBER,
            status: 'Unknown',
          };
        }
      })
    );
  }

  if (body.id_ship) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/ship_monitor/${body.id_ship}`);
      if (res.status === 404) {
        ships = [{
          shipName: body.id_ship,
          status: 'Unknown',
        }];
      } else {
        const data = await res.json();
        ships = [{
          shipName: data.id_ship,
          status: [data.device1, data.device2, data.device3, data.device4].filter(Boolean).join(', ')
        }];
      }
    } catch (err) {
      ships = [{
        shipName: body.id_ship,
        status: 'Unknown',
      }];
    }
  }

  if (!ships || !Array.isArray(ships) || ships.length === 0) {
    return NextResponse.json({ error: 'No ships data provided' }, { status: 400 });
  }

  // Improved prompt for Gemini
  const prompt = `
Ringkasan Status Armada Kapal:

Terdapat ${ships.length} kapal dalam armada. Hitung dan sebutkan berapa kapal dengan status perangkat diketahui dan berapa yang status perangkatnya Unknown (tidak diketahui).

Tampilkan daftar kapal berikut dengan format bullet list:
* Nama Kapal: Status perangkat: [daftar status perangkat, atau Unknown jika tidak diketahui]

Contoh format:
* TEST SHIP 1: Status perangkat: Medium, Low, High, Low
* TEST SHIP 2: Status perangkat: High, Medium, High, Low
* TEST SHIP 3: Status perangkat: Unknown (Tidak Aktif)

Data kapal:
${ships.map((ship, i) => `* ${ship.shipName}: Status perangkat: ${ship.status}`).join('\n')}

Buatkan ringkasan status armada kapal ini dalam bahasa English, singkat, terstruktur, dan mudah dipahami. Jangan tambahkan penjelasan lain di luar format di atas. Dalam satu paragraf and make it english`;
  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      return NextResponse.json({ error: 'Failed to fetch summary from Gemini', details: errorText }, { status: 500 });
    }

    const data = await response.json();
    console.log('Gemini API response:', data.candidates);
    const summary = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Tidak ada ringkasan.';

    return NextResponse.json({ summary });
  } catch (err) {
    console.error('API route error:', err);
    return NextResponse.json({ error: 'Internal server error', details: String(err) }, { status: 500 });
  }
}
