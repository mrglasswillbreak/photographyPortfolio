import { NextResponse } from 'next/server';
import { Resend } from 'resend';
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

    const resendKey = process.env.RESEND_API_KEY;
    const configuredFromEmail = process.env.FROM_EMAIL;
    const fallbackFromEmail = 'Portfolio Contact <onboarding@resend.dev>';
    const fromEmail = configuredFromEmail || fallbackFromEmail;

    if (!configuredFromEmail) {
      console.warn(
        'Email misconfiguration: FROM_EMAIL not set, using fallback sender "Portfolio Contact <onboarding@resend.dev>"'
      );
    }

    // Prefer the DB-stored recipient email; fall back to the env var.
    const dbRecipientEmail = await getContent('contact', 'recipient_email').catch(() => '');
    const contactEmail = dbRecipientEmail.trim() || process.env.CONTACT_EMAIL;

    if (!resendKey || !contactEmail) {
      console.error('Email not configured: RESEND_API_KEY or recipient email missing');
      return NextResponse.json(
        { error: 'Contact form is not configured. Please try again later.' },
        { status: 503 }
      );
    }

    const resend = new Resend(resendKey);

    const { error: sendError } = await resend.emails.send({
      from: fromEmail,
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

    if (sendError) {
      console.error('Resend error:', sendError);
      return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
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
