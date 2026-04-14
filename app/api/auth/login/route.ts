import { NextResponse } from 'next/server';
import { checkCredentials, createSession, COOKIE_NAME, SESSION_DURATION } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, username, password } = await request.json();
    const loginEmail = typeof email === 'string' ? email : username;

    if (typeof loginEmail !== 'string' || typeof password !== 'string' || !loginEmail.trim() || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    if (!(await checkCredentials(loginEmail, password))) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = await createSession();
    const response = NextResponse.json({ success: true });

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_DURATION,
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
