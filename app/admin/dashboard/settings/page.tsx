'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, RotateCcw, Check, Loader2, Aperture } from 'lucide-react';

export default function SettingsPage() {
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [reset, setReset] = useState(false);
  const [error, setError] = useState('');
  const [previewKey, setPreviewKey] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/content')
      .then((r) => r.json())
      .then((data: Record<string, string>) => {
        setFaviconUrl(data['site_favicon_url'] || null);
      })
      .catch(() => setError('Failed to load settings'))
      .finally(() => setIsLoading(false));
  }, []);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      e.target.value = '';

      setError('');
      setIsUploading(true);

      try {
        const MAX_SIZE = 4 * 1024 * 1024;
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
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update favicon');
      } finally {
        setIsUploading(false);
        setIsSaving(false);
      }
    },
    []
  );

  const handleReset = useCallback(async () => {
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
      setReset(true);
      setTimeout(() => setReset(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset favicon');
    } finally {
      setIsResetting(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-64">
        <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
      </div>
    );
  }

  const isBusy = isUploading || isSaving || isResetting;

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
          Manage site-wide settings such as the favicon
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
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
                disabled={isBusy}
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
                  onClick={handleReset}
                  disabled={isBusy}
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

              {(saved || reset) && (
                <motion.span
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400"
                >
                  <Check className="w-4 h-4" />
                  {saved ? 'Favicon updated!' : 'Reset to default!'}
                </motion.span>
              )}
            </div>

            <p className="text-xs text-neutral-400 dark:text-neutral-500">
              JPEG, PNG or WebP · max 4 MB · displayed in browser tabs and bookmarks
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
