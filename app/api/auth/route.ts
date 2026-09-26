import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const SECRET = process.env.ADMIN_SECRET_KEY || 'atelier2026';

// 1. GET: Check if the user is genuinely logged in
export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get('studio_session')?.value;

  if (session === SECRET) {
    return NextResponse.json({ authenticated: true });
  }
  return NextResponse.json({ authenticated: false }, { status: 401 });
}

// 2. POST: Log in and set the cookie
export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    if (password !== SECRET) {
      return NextResponse.json({ error: 'Invalid Passphrase' }, { status: 401 });
    }

    const cookieStore = await cookies();
    cookieStore.set('studio_session', SECRET, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Auth failed' }, { status: 500 });
  }
}

// 3. DELETE: Log out
export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete('studio_session');
  return NextResponse.json({ success: true });
}