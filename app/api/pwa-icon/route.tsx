import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(): Promise<Response> {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#111111',
          width: '100%',
          height: '100%',
          display: 'flex',
          borderRadius: '96px',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          width="512"
          height="512"
        >
          <circle cx="16" cy="16" r="12" stroke="white" strokeWidth="1.5" fill="none" />
          <path d="M18.8 11.2 L25.7 23.1" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <path d="M13.2 11.2 L27 11.2" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <path d="M10.5 16 L17.3 4.1" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <path d="M13.2 20.8 L6.3 8.9" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <path d="M18.8 20.8 L5 20.8" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <path d="M21.5 16 L14.7 27.9" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </svg>
      </div>
    ),
    { width: 512, height: 512 },
  );
}
