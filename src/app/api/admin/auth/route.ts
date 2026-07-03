import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { seedDatabaseIfNeeded } from '@/lib/seed-db';

export async function POST(request: Request) {
  try {
    // Auto-seed database if it is empty (e.g. on first run on Vercel)
    await seedDatabaseIfNeeded();

    const { username, password } = await request.json();

    if (username === 'admin' && password === 'password') {
      const cookieStore = await cookies();
      cookieStore.set('admin_logged_in', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24, // 1 day
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Invalid admin credentials' }, { status: 401 });
  } catch (e: any) {
    console.error('Admin login error:', e);
    return NextResponse.json({ 
      success: false, 
      error: `Internal server error: ${e.message || e || 'Unknown error'}` 
    }, { status: 500 });
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.get('admin_logged_in');

  if (isLoggedIn && isLoggedIn.value === 'true') {
    return NextResponse.json({ authenticated: true });
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_logged_in');
  return NextResponse.json({ success: true });
}
