import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    let student = null;
    if (username) {
      student = await prisma.student.findFirst({
        where: {
          OR: [
            { username: username },
            { email: username },
          ],
        },
        include: { roommates: true },
      });
    }

    // Fallback: If student is not found by username/email, get the first student
    if (!student) {
      student = await prisma.student.findFirst({
        include: { roommates: true },
      });
    }

    if (!student) {
      return NextResponse.json({ success: false, error: 'No student accounts found' }, { status: 404 });
    }

    // Set cookie session (simple mock cookie)
    const cookieStore = await cookies();
    cookieStore.set('student_id', student.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return NextResponse.json({
      success: true,
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
    console.error('Login error:', e);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
