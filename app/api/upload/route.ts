import { NextResponse } from 'next/server';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { isAuthenticated } from '@/lib/auth';

const ALLOWED_CONTENT_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

export async function POST(request: Request): Promise<Response> {
  try {
    const body = (await request.json()) as HandleUploadBody;

    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!(await isAuthenticated())) {
          throw new Error('Unauthorized');
        }

        const ext = pathname.split('.').pop()?.toLowerCase() ?? '';
        const allowedExts = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
        if (!allowedExts.includes(ext)) {
          throw new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.');
        }

        return {
          allowedContentTypes: ALLOWED_CONTENT_TYPES,
          maximumSizeInBytes: MAX_SIZE,
        };
      },
      onUploadCompleted: async ({ blob }) => {
        console.log('Image uploaded to blob storage:', blob.url);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed';
    const isUnauthorized = message === 'Unauthorized';
    return NextResponse.json(
      { error: message },
      { status: isUnauthorized ? 401 : 400 }
    );
  }
}
