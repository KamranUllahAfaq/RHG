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
        complaints: [
          { id: 'comp_1', title: 'WiFi Not Working', category: 'IT Services', description: 'The internet connection is extremely slow and disconnects frequently in Room B11-302.', status: 'Resolved', date: '28-06-2026', roomNumber: 'B11-302', studentId: 'mock_student_id_123456789012' },
          { id: 'comp_2', title: 'AC Leakage', category: 'Room Issue', description: 'Water is leaking from the split AC unit inside Room B11-302.', status: 'In Progress', date: '01-07-2026', roomNumber: 'B11-302', studentId: 'mock_student_id_123456789012' }
        ]
      });
    }

    const complaints = await prisma.complaint.findMany({
      where: { studentId },
      orderBy: { id: 'desc' },
    });

    return NextResponse.json({ success: true, complaints });
  } catch (e) {
    console.error('Fetch complaints error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const studentIdCookie = cookieStore.get('student_id');

    if (!studentIdCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const studentId = studentIdCookie.value;
    const { title, category, description } = await request.json();

    if (!process.env.DATABASE_URL) {
      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const year = today.getFullYear();
      const dateStr = `${day}-${month}-${year}`;

      return NextResponse.json({
        success: true,
        complaint: {
          id: 'comp_' + Math.floor(Math.random() * 1000),
          title,
          category,
          description,
          status: 'Open',
          date: dateStr,
          roomNumber: 'B11-302',
          studentId: 'mock_student_id_123456789012'
        }
      });
    }

    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Format current date as DD-MM-YYYY
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const dateStr = `${day}-${month}-${year}`;

    const newComplaint = await prisma.complaint.create({
      data: {
        title,
        category,
        description,
        status: 'Open',
        date: dateStr,
        roomNumber: student.roomNumber,
        studentId,
      },
    });

    return NextResponse.json({ success: true, complaint: newComplaint });
  } catch (e) {
    console.error('Submit complaint error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
