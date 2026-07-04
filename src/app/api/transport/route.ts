import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        success: true,
        routes: [
          { id: 'route_1', routeNumber: 'R-1', destination: 'COMSATS Campus', departure: '07:30 AM / 08:30 AM', status: 'Active', driverName: 'Mohammad Irfan', contact: '+92 345 5551234' },
          { id: 'route_2', routeNumber: 'R-2', destination: 'IQRA Campus', departure: '01:30 PM / 02:30 PM', status: 'Active', driverName: 'Sajid Mahmood', contact: '+92 345 5554321' }
        ]
      });
    }

    const routes = await prisma.transportRoute.findMany({
      orderBy: { routeNumber: 'asc' },
    });

    return NextResponse.json({ success: true, routes });
  } catch (e) {
    console.error('Fetch transport error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
