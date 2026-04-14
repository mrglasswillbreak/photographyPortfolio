import { NextResponse } from 'next/server';
import { getAdminLoginEmail, isAuthenticated, updateAdminCredentials, verifyAdminPassword } from '@/lib/auth';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

type CredentialUpdatePayload = {
  email?: unknown;
  currentPassword?: unknown;
  newPassword?: unknown;
};

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const email = await getAdminLoginEmail();

    if (!email) {
      return NextResponse.json({ error: 'Admin credentials are not configured' }, { status: 500 });
    }

    return NextResponse.json({ email });
  } catch {
    return NextResponse.json({ error: 'Failed to load admin credentials' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = (await request.json()) as CredentialUpdatePayload;
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const currentPassword = typeof body.currentPassword === 'string' ? body.currentPassword : '';
    const newPassword = typeof body.newPassword === 'string' ? body.newPassword : '';

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: 'Please provide a valid admin email address' }, { status: 400 });
    }

    if (!currentPassword) {
      return NextResponse.json({ error: 'Current password is required' }, { status: 400 });
    }

    if (newPassword && newPassword.length < MIN_PASSWORD_LENGTH) {
      return NextResponse.json(
        { error: `New password must be at least ${MIN_PASSWORD_LENGTH} characters long` },
        { status: 400 }
      );
    }

    const isCurrentPasswordValid = await verifyAdminPassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
    }

    await updateAdminCredentials(email, newPassword || currentPassword);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to update admin credentials' }, { status: 500 });
  }
}
