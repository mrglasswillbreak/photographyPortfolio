import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { getContent } from '@/lib/db';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validate required fields
    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Quick email format verification
    if (!EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
    }

    const gmailUser = process.env.GMAIL_USER;
    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

    // Prefer the DB-stored recipient email; fall back to the env var.
    const dbRecipientEmail = await getContent('contact', 'recipient_email').catch(() => '');
    const contactEmail = dbRecipientEmail.trim() || process.env.CONTACT_EMAIL;

    if (!gmailUser || !gmailAppPassword || !contactEmail) {
      console.error('Email not configured: GMAIL_USER, GMAIL_APP_PASSWORD, or recipient email missing');
      return NextResponse.json(
        { error: 'Contact form is not configured. Please try again later.' },
        { status: 503 }
      );
    }

    if (!EMAIL_REGEX.test(gmailUser) || !EMAIL_REGEX.test(contactEmail)) {
      console.error('Email misconfiguration: GMAIL_USER or recipient email is not a valid email address');
      return NextResponse.json(
        { error: 'Contact form is not configured. Please try again later.' },
        { status: 503 }
      );
    }

    // Google displays App Passwords with spaces (e.g. "xxxx xxxx xxxx xxxx").
    // Strip them so the credential works regardless of how it was copied.
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: gmailUser, pass: gmailAppPassword.replace(/\s+/g, '') },
    });

    const info = await transporter.sendMail({
      from: `"Portfolio Contact" <${gmailUser}>`,
      to: contactEmail,
      replyTo: email.trim(),
      subject: `[Portfolio Contact] ${subject.trim()}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #171717;">New Contact Form Submission</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #737373; width: 100px;"><strong>Name:</strong></td>
              <td style="padding: 8px 0;">${escapeHtml(name.trim())}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #737373;"><strong>Email:</strong></td>
              <td style="padding: 8px 0;"><a href="mailto:${escapeHtml(email.trim())}">${escapeHtml(email.trim())}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #737373;"><strong>Subject:</strong></td>
              <td style="padding: 8px 0;">${escapeHtml(subject.trim())}</td>
            </tr>
          </table>
          <div style="margin-top: 16px; padding: 16px; background: #f5f5f5; border-radius: 4px;">
            <p style="margin: 0; white-space: pre-wrap;">${escapeHtml(message.trim())}</p>
          </div>
        </div>
      `,
    });

    if (info.rejected.length > 0) {
      console.error('sendMail: recipient(s) rejected by SMTP server', { rejected: info.rejected });
      return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    // Gmail SMTP auth failure (535) — treat as misconfiguration, not a server error.
    if (message.includes('535') || message.toLowerCase().includes('username and password not accepted')) {
      console.error(
        'Gmail SMTP authentication failed. Ensure GMAIL_APP_PASSWORD is a valid App Password ' +
        '(Google Account → Security → 2-Step Verification → App Passwords) and that 2-Step Verification is enabled.',
        { route: 'app/api/contact/route.ts:POST' }
      );
      return NextResponse.json(
        { error: 'Contact form is not configured. Please try again later.' },
        { status: 503 }
      );
    }
    console.error('Unexpected contact form error', {
      route: 'app/api/contact/route.ts:POST',
      error: err instanceof Error ? { name: err.name, message: err.message } : err,
    });
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
