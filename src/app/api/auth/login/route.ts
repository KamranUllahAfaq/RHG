import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';
import { seedDatabaseIfNeeded } from '@/lib/seed-db';

export async function POST(request: Request) {
  try {
    // Auto-seed database if it is empty (e.g. on first run on Vercel)
    await seedDatabaseIfNeeded();

    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ success: false, error: 'Username and password are required' }, { status: 400 });
    }

    let student = null;
    // Try to find by username or email
    student = await prisma.student.findFirst({
      where: {
        OR: [
          { username: username },
          { email: username },
        ],
      },
      include: { roommates: true },
    });

    // Fallback: If not found and using default credentials, find the 'student' account specifically
    if (!student && username === 'student' && password === 'password') {
      student = await prisma.student.findFirst({
        where: { username: 'student' },
        include: { roommates: true },
      });
      // If no 'student' username exists, get any first student as last resort
      if (!student) {
        student = await prisma.student.findFirst({ include: { roommates: true } });
      }
    }

    if (!student || (student.password !== password && !(username === 'student' && password === 'password'))) {
      return NextResponse.json({ success: false, error: 'Invalid username or password' }, { status: 401 });
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
