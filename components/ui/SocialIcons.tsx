import { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { className?: string };

export function InstagramIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true" {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" stroke="none" />
    </svg>
  );
}

export function TwitterXIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" stroke="none" />
    </svg>
  );
}

export function TikTokIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true" {...props}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.3 6.3 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.95a8.21 8.21 0 0 0 4.8 1.53V7.04a4.85 4.85 0 0 1-1.03-.35z" stroke="none" />
    </svg>
  );
}

export function SnapchatIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true" {...props}>
      <path d="M12.166 2c.93 0 4.04.26 5.52 3.58.42.96.32 2.6.24 3.88l-.02.26c.24-.04.5-.1.74-.2a1.37 1.37 0 0 1 .54-.1c.24 0 .44.06.58.14.3.18.46.44.46.7 0 .46-.34.78-.9.94-.08.02-.18.04-.28.06-.44.1-1.1.24-1.38.82-.12.26-.12.52.02.84.4.92 1.52 2.58 3.54 2.9.16.02.26.16.22.32-.32 1.2-1.96 1.54-3.1 1.7-.04.14-.08.44-.1.62-.04.24-.2.36-.5.36h-.06c-.24-.02-.48-.08-.74-.16-.42-.12-.88-.24-1.58-.24-.66 0-1.02.1-1.38.2-.68.2-1.36.4-2.64.32-1.28.08-1.96-.12-2.64-.32-.36-.1-.72-.2-1.38-.2-.7 0-1.16.12-1.58.24-.26.08-.5.14-.74.16h-.06c-.3 0-.46-.12-.5-.36-.02-.18-.06-.48-.1-.62-1.14-.16-2.78-.5-3.1-1.7-.04-.16.06-.3.22-.32 2.02-.32 3.14-1.98 3.54-2.9.14-.32.14-.58.02-.84-.28-.58-.94-.72-1.38-.82-.1-.02-.2-.04-.28-.06-.62-.18-.94-.5-.94-.96 0-.26.16-.52.46-.7.14-.08.36-.14.6-.14.18 0 .36.04.52.1.26.1.52.16.74.2l-.02-.26c-.08-1.28-.18-2.92.24-3.88C8.126 2.26 11.236 2 12.166 2z" stroke="none" />
    </svg>
  );
}

export function YoutubeIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true" {...props}>
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" stroke="none" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" stroke="none" />
    </svg>
  );
}

export function LinkedinIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true" {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" stroke="none" />
      <rect x="2" y="9" width="4" height="12" stroke="none" />
      <circle cx="4" cy="4" r="2" stroke="none" />
    </svg>
  );
}

export type SocialPlatform = 'instagram' | 'facebook' | 'twitter' | 'tiktok' | 'snapchat' | 'youtube' | 'linkedin';

export const SOCIAL_PLATFORMS: { id: SocialPlatform; label: string; Icon: React.FC<IconProps> }[] = [
  { id: 'instagram', label: 'Instagram', Icon: InstagramIcon },
  { id: 'facebook', label: 'Facebook', Icon: FacebookIcon },
  { id: 'twitter', label: 'Twitter / X', Icon: TwitterXIcon },
  { id: 'tiktok', label: 'TikTok', Icon: TikTokIcon },
  { id: 'snapchat', label: 'Snapchat', Icon: SnapchatIcon },
  { id: 'youtube', label: 'YouTube', Icon: YoutubeIcon },
  { id: 'linkedin', label: 'LinkedIn', Icon: LinkedinIcon },
];
