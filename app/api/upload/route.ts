import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { isAuthenticated } from '@/lib/auth';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE_BYTES = 4 * 1024 * 1024; // 4 MB

// Map validated MIME types to canonical extensions for consistent blob key naming.
const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

// Magic-byte signatures for each supported image format.
// We read the first 12 bytes of the file and check that the bytes match at least
// one of the expected signatures before uploading to storage.
const MAGIC_BYTES: Array<{ mime: string; offset: number; bytes: number[] }> = [
  { mime: 'image/jpeg', offset: 0, bytes: [0xff, 0xd8, 0xff] },
  { mime: 'image/png', offset: 0, bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
  { mime: 'image/gif', offset: 0, bytes: [0x47, 0x49, 0x46, 0x38] }, // GIF8
  { mime: 'image/webp', offset: 8, bytes: [0x57, 0x45, 0x42, 0x50] }, // RIFF????WEBP
];

async function matchesMagicBytes(file: File): Promise<boolean> {
  const header = await file.slice(0, 12).arrayBuffer();
  const bytes = new Uint8Array(header);
  return MAGIC_BYTES.some(({ mime, offset, bytes: sig }) =>
    file.type === mime && sig.every((b, i) => bytes[offset + i] === b)
  );
}

export async function POST(request: Request): Promise<Response> {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let file: File;
  try {
    const formData = await request.formData();
    const value = formData.get('file');

    if (value === null) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    if (!(value instanceof File)) {
      return NextResponse.json({ error: 'Invalid file field' }, { status: 400 });
    }
    file = value;
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: `File too large. Maximum size is ${MAX_SIZE_BYTES / 1024 / 1024} MB.` },
      { status: 400 }
    );
  }

  if (!(await matchesMagicBytes(file))) {
    return NextResponse.json(
      { error: 'File contents do not match the declared image type.' },
      { status: 400 }
    );
  }

  try {
    // Derive the extension from the validated MIME type (not the client-supplied
    // filename) so blob keys are always consistent and safe.
    const ext = MIME_TO_EXT[file.type] ?? 'jpg';
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const blob = await put(`uploads/${safeName}`, file, { access: 'public' });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error('Upload failed:', error);

    const message =
      process.env.NODE_ENV !== 'production' && error instanceof Error
        ? error.message
        : 'Upload failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
