import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const studentIdCookie = cookieStore.get('student_id');

    if (!studentIdCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const studentId = studentIdCookie.value;

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        success: true,
        notifications: [
          { id: 'notif_1', title: 'Welcome to Royal Portal', content: 'Hi, welcome to the student housing database ecosystem. Monitor your room, fees and bills here.', type: 'Info', date: '01-07-2026', studentId: 'mock_student_id_123456789012', read: false }
        ]
      });
    }

    const notifications = await prisma.notification.findMany({
      where: { studentId },
      orderBy: { id: 'desc' },
    });

    return NextResponse.json({ success: true, notifications });
  } catch (e) {
    console.error('Fetch notifications error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT() {
  try {
    const cookieStore = await cookies();
    const studentIdCookie = cookieStore.get('student_id');

    if (!studentIdCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const studentId = studentIdCookie.value;

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ success: true });
    }

    await prisma.notification.updateMany({
      where: { studentId, read: false },
      data: { read: true },
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Mark notifications read error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
