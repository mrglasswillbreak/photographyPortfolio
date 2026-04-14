'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { Upload, RotateCcw, Check, Loader2, Aperture, Sun, Moon, Monitor, Save, Link2, Mail, Shield, Type } from 'lucide-react';
import { SOCIAL_PLATFORMS } from '@/components/ui/SocialIcons';
import SiteNameWordmark from '@/components/ui/SiteNameWordmark';
import {
  FONT_WEIGHT_OPTIONS,
  LETTER_SPACING_OPTIONS,
  getTypographyCssVariables,
  parseTypographySettings,
  toStyleContentMap,
  typographySettingsToContentMap,
  TYPOGRAPHY_UPDATED_EVENT,
} from '@/lib/typography';
import type { FontWeightOption, LetterSpacingOption } from '@/lib/typography';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 4 * 1024 * 1024;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_ADMIN_PASSWORD_LENGTH = 8;

const SOCIAL_PLACEHOLDERS: Record<string, string> = {
  instagram: 'https://instagram.com/yourprofile',
  facebook: 'https://facebook.com/yourpage',
  twitter: 'https://x.com/yourhandle',
  tiktok: 'https://tiktok.com/@yourhandle',
  snapchat: 'https://snapchat.com/add/yourusername',
  youtube: 'https://youtube.com/@yourchannel',
  linkedin: 'https://linkedin.com/in/yourprofile',
};

const FONT_WEIGHT_LABELS: Record<FontWeightOption, string> = {
  light: 'Light',
  normal: 'Normal',
  medium: 'Medium',
  semibold: 'Semibold',
  bold: 'Bold',
};

const LETTER_SPACING_LABELS: Record<LetterSpacingOption, string> = {
  normal: 'Normal',
  tight: 'Tight',
  wide: 'Wide',
  wider: 'Wider',
};

const TYPOGRAPHY_STYLE_FIELDS: string[] = [
  'heading_weight',
  'body_weight',
  'button_weight',
  'emphasis_weight',
  'emphasis_italic',
  'site_name_weight',
  'site_name_italic',
  'heading_letter_spacing',
  'site_name_letter_spacing',
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  // All content loaded from /api/content
  const [content, setContent] = useState<Record<string, string>>({});
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Favicon states
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [faviconSaved, setFaviconSaved] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);

  // Site settings / footer links save states
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [savedSection, setSavedSection] = useState<string | null>(null);
  const [adminEmail, setAdminEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const faviconSavedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sectionSavedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    async function loadSettings() {
      setIsLoading(true);

      try {
        const [contentRes, credentialsRes] = await Promise.all([
          fetch('/api/content'),
          fetch('/api/auth/credentials'),
        ]);

        if (!contentRes.ok) {
          throw new Error('Failed to load settings');
        }

        if (!credentialsRes.ok) {
          throw new Error('Failed to load admin login settings');
        }

        const contentData = (await contentRes.json()) as Record<string, string>;
        const credentialsData = (await credentialsRes.json()) as { email?: string };
        const normalizedContentData = {
          ...contentData,
          ...typographySettingsToContentMap(parseTypographySettings(contentData)),
        };

        setContent(normalizedContentData);
        setFaviconUrl(normalizedContentData['site_favicon_url'] || null);
        setAdminEmail(credentialsData.email ?? '');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load settings');
      } finally {
        setIsLoading(false);
      }
    }

    void loadSettings();
  }, []);

  // Clear any pending toast timers when the component unmounts.
  useEffect(() => {
    return () => {
      if (faviconSavedTimerRef.current) clearTimeout(faviconSavedTimerRef.current);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      if (sectionSavedTimerRef.current) clearTimeout(sectionSavedTimerRef.current);
    };
  }, []);

  // ── Favicon handlers ──────────────────────────────────────────────────────

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      e.target.value = '';

      setError('');
      setIsUploading(true);

      try {
        if (!ALLOWED_MIME_TYPES.includes(file.type)) {
          throw new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
        }
        if (file.size > MAX_SIZE) {
          throw new Error('File too large. Maximum size is 4 MB.');
        }

        const formData = new FormData();
        formData.append('file', file);
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
        if (!uploadRes.ok) {
          const data = await uploadRes.json();
          throw new Error(data.error || 'Upload failed');
        }
        const { url } = await uploadRes.json();

        setIsUploading(false);
        setIsSaving(true);

        const saveRes = await fetch('/api/content/site', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ favicon_url: url }),
        });
        if (!saveRes.ok) throw new Error('Failed to save favicon');

        setFaviconUrl(url);
        setPreviewKey((k) => k + 1);
        setFaviconSaved(true);
        if (faviconSavedTimerRef.current) clearTimeout(faviconSavedTimerRef.current);
        faviconSavedTimerRef.current = setTimeout(() => setFaviconSaved(false), 2500);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update favicon');
      } finally {
        setIsUploading(false);
        setIsSaving(false);
      }
    },
    []
  );

  const handleFaviconReset = useCallback(async () => {
    setError('');
    setIsResetting(true);
    try {
      const res = await fetch('/api/content/site', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ favicon_url: '' }),
      });
      if (!res.ok) throw new Error('Failed to reset favicon');
      setFaviconUrl(null);
      setPreviewKey((k) => k + 1);
      setResetSuccess(true);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      resetTimerRef.current = setTimeout(() => setResetSuccess(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset favicon');
    } finally {
      setIsResetting(false);
    }
  }, []);

  // ── Site settings + footer links handlers ────────────────────────────────

  const handleChange = useCallback((key: string, value: string) => {
    setContent((prev) => ({ ...prev, [key]: value }));
  }, []);

  const saveSection = useCallback(
    async (sectionId: string, fields: string[]) => {
      setSavingSection(sectionId);
      setError('');
      try {
        const updates: Record<string, string> = {};
        for (const key of fields) {
          updates[key] = content[`${sectionId}_${key}`] ?? '';
        }
        const res = await fetch(`/api/content/${sectionId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });
        if (!res.ok) throw new Error('Failed to save');
        if (sectionId === 'site') {
          window.dispatchEvent(new CustomEvent<{ siteName: string }>('site-name-updated', {
            detail: { siteName: updates.name ?? '' },
          }));
        }
        if (sectionId === 'style') {
          window.dispatchEvent(new CustomEvent<Record<string, string>>(TYPOGRAPHY_UPDATED_EVENT, {
            detail: toStyleContentMap(updates),
          }));
        }
        setSavedSection(sectionId);
        if (sectionSavedTimerRef.current) clearTimeout(sectionSavedTimerRef.current);
        sectionSavedTimerRef.current = setTimeout(() => setSavedSection(null), 2000);
      } catch {
        setError(`Failed to save ${sectionId} settings`);
      } finally {
        setSavingSection(null);
      }
    },
    [content]
  );

  const saveFooterLinks = useCallback(async () => {
    setSavingSection('footer');
    setError('');
    try {
      const updates: Record<string, string> = {};
      for (const platform of SOCIAL_PLATFORMS) {
        updates[`${platform.id}_url`] = content[`footer_${platform.id}_url`] ?? '';
      }
      const res = await fetch('/api/content/footer', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('Failed to save');
      setSavedSection('footer');
      if (sectionSavedTimerRef.current) clearTimeout(sectionSavedTimerRef.current);
      sectionSavedTimerRef.current = setTimeout(() => setSavedSection(null), 2000);
    } catch {
      setError('Failed to save footer links');
    } finally {
      setSavingSection(null);
    }
  }, [content]);

  const saveAdminCredentials = useCallback(async () => {
    const normalizedEmail = adminEmail.trim().toLowerCase();

    if (!normalizedEmail || !EMAIL_REGEX.test(normalizedEmail)) {
      setError('Please enter a valid admin email address');
      return;
    }

    if (!currentPassword) {
      setError('Current password is required to update admin login credentials');
      return;
    }

    if (newPassword && newPassword.length < MIN_ADMIN_PASSWORD_LENGTH) {
      setError(`New password must be at least ${MIN_ADMIN_PASSWORD_LENGTH} characters`);
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setError('New password and confirmation do not match');
      return;
    }

    setSavingSection('admin');
    setError('');

    try {
      const res = await fetch('/api/auth/credentials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: normalizedEmail,
          currentPassword,
          newPassword,
        }),
      });

      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update admin login credentials');
      }

      setAdminEmail(normalizedEmail);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSavedSection('admin');
      if (sectionSavedTimerRef.current) clearTimeout(sectionSavedTimerRef.current);
      sectionSavedTimerRef.current = setTimeout(() => setSavedSection(null), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update admin login credentials');
    } finally {
      setSavingSection(null);
    }
  }, [adminEmail, currentPassword, newPassword, confirmPassword]);

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-64">
        <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
      </div>
    );
  }

  const isFaviconBusy = isUploading || isSaving || isResetting;
  const typographySettings = parseTypographySettings(content);
  const typographyPreviewStyle = getTypographyCssVariables(typographySettings);
  const siteNamePreview = (content['site_name'] ?? '').trim() || 'LensCraft';

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">Settings</h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Manage site-wide settings
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* ── Appearance ───────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <Sun className="w-4 h-4 text-neutral-500" />
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">Appearance</h2>
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
            Choose the color scheme for your admin dashboard.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {([
              { value: 'light', label: 'Light', Icon: Sun },
              { value: 'system', label: 'System', Icon: Monitor },
              { value: 'dark', label: 'Dark', Icon: Moon },
            ] as const).map(({ value, label, Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setTheme(value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  theme === value
                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white'
                    : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Typography & Text Style ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <Type className="w-4 h-4 text-neutral-500" />
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">Typography &amp; Text Style</h2>
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
            Control font weights, italics, and spacing used across your portfolio and admin interface.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                Heading Weight
              </label>
              <select
                value={typographySettings.headingWeight}
                onChange={(e) => handleChange('style_heading_weight', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white/50 transition-all"
              >
                {FONT_WEIGHT_OPTIONS.map((value) => (
                  <option key={value} value={value}>{FONT_WEIGHT_LABELS[value]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                Heading Letter Spacing
              </label>
              <select
                value={typographySettings.headingLetterSpacing}
                onChange={(e) => handleChange('style_heading_letter_spacing', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white/50 transition-all"
              >
                {LETTER_SPACING_OPTIONS.map((value) => (
                  <option key={value} value={value}>{LETTER_SPACING_LABELS[value]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                Body Text Weight
              </label>
              <select
                value={typographySettings.bodyWeight}
                onChange={(e) => handleChange('style_body_weight', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white/50 transition-all"
              >
                {FONT_WEIGHT_OPTIONS.map((value) => (
                  <option key={value} value={value}>{FONT_WEIGHT_LABELS[value]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                Button Weight
              </label>
              <select
                value={typographySettings.buttonWeight}
                onChange={(e) => handleChange('style_button_weight', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white/50 transition-all"
              >
                {FONT_WEIGHT_OPTIONS.map((value) => (
                  <option key={value} value={value}>{FONT_WEIGHT_LABELS[value]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                Emphasis Weight
              </label>
              <select
                value={typographySettings.emphasisWeight}
                onChange={(e) => handleChange('style_emphasis_weight', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white/50 transition-all"
              >
                {FONT_WEIGHT_OPTIONS.map((value) => (
                  <option key={value} value={value}>{FONT_WEIGHT_LABELS[value]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                Site Name Weight
              </label>
              <select
                value={typographySettings.siteNameWeight}
                onChange={(e) => handleChange('style_site_name_weight', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white/50 transition-all"
              >
                {FONT_WEIGHT_OPTIONS.map((value) => (
                  <option key={value} value={value}>{FONT_WEIGHT_LABELS[value]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                Site Name Letter Spacing
              </label>
              <select
                value={typographySettings.siteNameLetterSpacing}
                onChange={(e) => handleChange('style_site_name_letter_spacing', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white/50 transition-all"
              >
                {LETTER_SPACING_OPTIONS.map((value) => (
                  <option key={value} value={value}>{LETTER_SPACING_LABELS[value]}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            <label className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
              <input
                type="checkbox"
                checked={typographySettings.emphasisItalic}
                onChange={(e) => handleChange('style_emphasis_italic', String(e.target.checked))}
                className="h-4 w-4 rounded border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-neutral-900 dark:focus:ring-white"
              />
              Italicize emphasis text
            </label>
            <label className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
              <input
                type="checkbox"
                checked={typographySettings.siteNameItalic}
                onChange={(e) => handleChange('style_site_name_italic', String(e.target.checked))}
                className="h-4 w-4 rounded border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-neutral-900 dark:focus:ring-white"
              />
              Italicize site name highlight
            </label>
          </div>

          <div
            className="mt-4 rounded-lg border border-neutral-200 dark:border-neutral-700 p-4 bg-neutral-50 dark:bg-neutral-800/50 typography-scope"
            style={typographyPreviewStyle}
          >
            <p className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">Live Preview</p>
            <h3 className="mt-2 text-xl text-neutral-900 dark:text-white">
              Sample Heading <span className="typography-emphasis">Accent</span>
            </h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Body text preview for checking readability and hierarchy.
            </p>
            <p className="mt-3 text-lg tracking-wider text-neutral-900 dark:text-white">
              <SiteNameWordmark siteName={siteNamePreview} />
            </p>
            <button
              type="button"
              className="typography-button mt-4 px-3 py-1.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md text-sm"
            >
              Sample Button
            </button>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              type="button"
              onClick={() => saveSection('style', TYPOGRAPHY_STYLE_FIELDS)}
              disabled={savingSection === 'style'}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              {savingSection === 'style' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Styles
            </button>
            {savedSection === 'style' && (
              <motion.span initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                <Check className="w-4 h-4" /> Saved!
              </motion.span>
            )}
          </div>
        </motion.div>

        {/* ── Site Settings ────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <Save className="w-4 h-4 text-neutral-500" />
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">Site Settings</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                Site Name
              </label>
              <input
                type="text"
                value={content['site_name'] ?? ''}
                onChange={(e) => handleChange('site_name', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white/50 transition-all"
              />
            </div>
            <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 p-3 bg-neutral-50 dark:bg-neutral-800/50 typography-scope" style={typographyPreviewStyle}>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">Site Name Preview</p>
              <p className="mt-1 text-lg tracking-wider text-neutral-900 dark:text-white">
                <SiteNameWordmark siteName={siteNamePreview} />
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                Footer Text
              </label>
              <input
                type="text"
                value={content['site_footer_text'] ?? ''}
                onChange={(e) => handleChange('site_footer_text', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white/50 transition-all"
              />
            </div>
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => saveSection('site', ['name', 'footer_text'])}
                disabled={savingSection === 'site'}
                className="flex items-center gap-2 px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                {savingSection === 'site' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save
              </button>
              {savedSection === 'site' && (
                <motion.span initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                  <Check className="w-4 h-4" /> Saved!
                </motion.span>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── Contact Settings ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <Mail className="w-4 h-4 text-neutral-500" />
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">Contact</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                Contact Form Recipient Email
              </label>
              <input
                type="email"
                value={content['contact_recipient_email'] ?? ''}
                onChange={(e) => handleChange('contact_recipient_email', e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white/50 transition-all"
              />
              <p className="mt-1.5 text-xs text-neutral-400 dark:text-neutral-500">
                Messages from the contact form will be sent to this address. Leave blank to use the{' '}
                <code className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">CONTACT_EMAIL</code>{' '}
                environment variable.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => saveSection('contact', ['recipient_email'])}
                disabled={savingSection === 'contact'}
                className="flex items-center gap-2 px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                {savingSection === 'contact' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save
              </button>
              {savedSection === 'contact' && (
                <motion.span initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                  <Check className="w-4 h-4" /> Saved!
                </motion.span>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── Admin Login ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <Shield className="w-4 h-4 text-neutral-500" />
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">Admin Login</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                Admin Email
              </label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                autoComplete="email"
                placeholder="admin@example.com"
                className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="Enter current password"
                className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                placeholder="Leave blank to keep current password"
                className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white/50 transition-all"
              />
              <p className="mt-1.5 text-xs text-neutral-400 dark:text-neutral-500">
                New passwords must be at least {MIN_ADMIN_PASSWORD_LENGTH} characters.
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                placeholder="Re-enter the new password"
                className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white/50 transition-all"
              />
            </div>
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={saveAdminCredentials}
                disabled={savingSection === 'admin'}
                className="flex items-center gap-2 px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                {savingSection === 'admin' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Login
              </button>
              {savedSection === 'admin' && (
                <motion.span initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                  <Check className="w-4 h-4" /> Saved!
                </motion.span>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── Footer Social Links ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <Link2 className="w-4 h-4 text-neutral-500" />
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">Footer Social Links</h2>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
            Enter the full URL for each social platform you want to show. Leave blank to hide the icon.
          </p>
          <div className="space-y-4">
            {SOCIAL_PLATFORMS.map(({ id, label, Icon }) => {
              const key = `footer_${id}_url`;
              return (
                <div key={id}>
                  <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                    {label} URL
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                      <Icon className="w-4 h-4" />
                    </span>
                    <input
                      type="url"
                      value={content[key] ?? ''}
                      placeholder={SOCIAL_PLACEHOLDERS[id] ?? `https://${id}.com/yourprofile`}
                      onChange={(e) => handleChange(key, e.target.value)}
                      className="flex-1 px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white/50 transition-all"
                    />
                  </div>
                </div>
              );
            })}
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={saveFooterLinks}
                disabled={savingSection === 'footer'}
                className="flex items-center gap-2 px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                {savingSection === 'footer' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Links
              </button>
              {savedSection === 'footer' && (
                <motion.span initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                  <Check className="w-4 h-4" /> Saved!
                </motion.span>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── Favicon ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <Aperture className="w-4 h-4 text-neutral-500" />
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">Favicon</h2>
          </div>

          <div className="flex items-start gap-6">
            {/* Preview */}
            <div className="flex-shrink-0 flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  key={previewKey}
                  src={`/api/favicon?v=${previewKey}`}
                  alt="Current favicon"
                  className="w-10 h-10 object-contain"
                />
              </div>
              <span className="text-xs text-neutral-400 dark:text-neutral-500">Current</span>
            </div>

            {/* Controls */}
            <div className="flex-1 space-y-3">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {faviconUrl
                  ? 'A custom favicon is active. Upload a new one to replace it, or reset to the default.'
                  : 'No custom favicon set. The default camera-aperture icon is being used.'}
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isFaviconBusy}
                  className="flex items-center gap-2 px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  {isUploading || isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  {isUploading ? 'Uploading…' : isSaving ? 'Saving…' : faviconUrl ? 'Replace Favicon' : 'Upload Favicon'}
                </button>

                {faviconUrl && (
                  <button
                    type="button"
                    onClick={handleFaviconReset}
                    disabled={isFaviconBusy}
                    className="flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                  >
                    {isResetting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RotateCcw className="w-4 h-4" />
                    )}
                    Reset to Default
                  </button>
                )}

                {(faviconSaved || resetSuccess) && (
                  <motion.span
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400"
                  >
                    <Check className="w-4 h-4" />
                    {faviconSaved ? 'Favicon updated!' : 'Reset to default!'}
                  </motion.span>
                )}
              </div>

              <p className="text-xs text-neutral-400 dark:text-neutral-500">
                JPEG, PNG or WebP · max 4 MB · displayed in browser tabs, bookmarks, and installed app icons
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
