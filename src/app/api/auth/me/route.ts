import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const studentIdCookie = cookieStore.get('student_id');

    if (!studentIdCookie) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const studentId = studentIdCookie.value;

    // Handle mock session bypass (e.g. no database URL configured)
    if (studentId === 'mock_student_id_123456789012' || !process.env.DATABASE_URL) {
      return NextResponse.json({
        authenticated: true,
        student: {
          id: 'mock_student_id_123456789012',
          username: 'student',
          name: 'Ahmad Malik (Mock Mode)',
          email: 'ahmad.malik@student.comsats.edu.pk',
          rollNumber: 'FA21-BCS-089',
          hostelName: 'Branch 11',
          roomNumber: 'B11-302',
          balanceDue: 11000.0,
          mobile: '+92 300 1234567',
          emergencyContact: '+92 312 9876543',
          roommates: [
            { id: 1, name: 'Zain Ali', rollNumber: 'FA21-BCS-102', mobile: '+92 301 2223334', email: 'zain.ali@gmail.com' },
            { id: 2, name: 'Hamza Khan', rollNumber: 'FA21-BCS-045', mobile: '+92 302 4445556', email: 'hamza.khan@gmail.com' },
            { id: 3, name: 'Usman Tariq', rollNumber: 'FA21-BCS-118', mobile: '+92 303 6667778', email: 'usman.tariq@gmail.com' }
          ],
        },
      });
    }

    // Validate that the cookie value is a valid 24-char MongoDB ObjectID hex
    // Old sessions from SQLite (numeric IDs like "12") will fail this check gracefully
    if (!/^[a-fA-F0-9]{24}$/.test(studentId)) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: { roommates: true },
    });

    if (!student) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      student: {
        id: student.id,
        username: student.username,
        name: student.name,
        email: student.email,
        rollNumber: student.rollNumber,
        hostelName: student.hostelName,
        roomNumber: student.roomNumber,
        balanceDue: student.balanceDue,
        mobile: student.mobile,
        emergencyContact: student.emergencyContact,
        roommates: student.roommates,
      },
    });
  } catch (e) {
    console.error('Session retrieval error:', e);
    return NextResponse.json({ authenticated: false, error: 'Internal server error' }, { status: 500 });
  }
}
