import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const studentIdCookie = cookieStore.get('student_id');

    if (!studentIdCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const studentId = studentIdCookie.value;
    const { mobile, emergencyContact, email } = await request.json();

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        success: true,
        student: {
          id: 'mock_student_id_123456789012',
          username: 'student',
          name: 'Ahmad Malik (Mock Mode)',
          email: email || 'ahmad.malik@student.comsats.edu.pk',
          rollNumber: 'FA21-BCS-089',
          hostelName: 'Branch 11',
          roomNumber: 'B11-302',
          balanceDue: 11000.0,
          mobile: mobile || '+92 300 1234567',
          emergencyContact: emergencyContact || '+92 312 9876543',
        },
      });
    }

    const updatedStudent = await prisma.student.update({
      where: { id: studentId },
      data: {
        mobile,
        emergencyContact,
        email,
      },
    });

    return NextResponse.json({
      success: true,
      student: {
        id: updatedStudent.id,
        username: updatedStudent.username,
        name: updatedStudent.name,
        email: updatedStudent.email,
        rollNumber: updatedStudent.rollNumber,
        hostelName: updatedStudent.hostelName,
        roomNumber: updatedStudent.roomNumber,
        balanceDue: updatedStudent.balanceDue,
        mobile: updatedStudent.mobile,
        emergencyContact: updatedStudent.emergencyContact,
      },
    });
  } catch (e) {
    console.error('Update profile error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
