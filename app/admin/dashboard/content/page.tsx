'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Save, Loader2, Check, ChevronDown, ChevronRight, Upload, X } from 'lucide-react';
import { SOCIAL_PLATFORMS } from '@/components/ui/SocialIcons';

interface Section {
  id: string;
  label: string;
  fields: { key: string; label: string; multiline?: boolean; type?: 'text' | 'image' | 'url' }[];
}

const SECTIONS: Section[] = [
  {
    id: 'hero',
    label: 'Hero Section',
    fields: [
      { key: 'tagline', label: 'Tagline (small text above title)' },
      { key: 'title', label: 'Hero Title' },
      { key: 'title_highlight', label: 'Hero Title Highlight (italic bold)' },
      { key: 'subtitle', label: 'Hero Subtitle', multiline: true },
      { key: 'primary_button', label: 'Primary Button Text' },
      { key: 'secondary_button', label: 'Secondary Button Text' },
    ],
  },
  {
    id: 'gallery',
    label: 'Gallery Section',
    fields: [
      { key: 'title', label: 'Gallery Title' },
      { key: 'subtitle', label: 'Gallery Subtitle', multiline: true },
    ],
  },
  {
    id: 'about',
    label: 'About Section',
    fields: [
      { key: 'image', label: 'About Me Photo', type: 'image' },
      { key: 'section_title', label: 'Section Title' },
      { key: 'bio_1', label: 'Bio Paragraph 1', multiline: true },
      { key: 'bio_2', label: 'Bio Paragraph 2', multiline: true },
      { key: 'bio_3', label: 'Bio Paragraph 3', multiline: true },
      { key: 'stat_1_number', label: 'Stat 1 — Number' },
      { key: 'stat_1_label', label: 'Stat 1 — Label' },
      { key: 'stat_2_number', label: 'Stat 2 — Number' },
      { key: 'stat_2_label', label: 'Stat 2 — Label' },
      { key: 'stat_3_number', label: 'Stat 3 — Number' },
      { key: 'stat_3_label', label: 'Stat 3 — Label' },
    ],
  },
  {
    id: 'contact',
    label: 'Contact Section',
    fields: [
      { key: 'section_title', label: 'Section Title' },
      { key: 'section_subtitle', label: 'Section Subtitle', multiline: true },
      { key: 'email', label: 'Email Address' },
      { key: 'phone', label: 'Phone Number' },
      { key: 'location', label: 'Location' },
    ],
  },
  {
    id: 'site',
    label: 'Site Settings',
    fields: [
      { key: 'name', label: 'Site Name' },
      { key: 'footer_text', label: 'Footer Text' },
    ],
  },
];

const SOCIAL_PLACEHOLDERS: Record<string, string> = {
  instagram: 'https://instagram.com/yourprofile',
  facebook: 'https://facebook.com/yourpage',
  twitter: 'https://x.com/yourhandle',
  tiktok: 'https://tiktok.com/@yourhandle',
  snapchat: 'https://snapchat.com/add/yourusername',
  youtube: 'https://youtube.com/@yourchannel',
  linkedin: 'https://linkedin.com/in/yourprofile',
};

const FOOTER_SECTION_ID = 'footer';

export default function ContentPage() {
  const [content, setContent] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [savedSection, setSavedSection] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['hero']));
  const [error, setError] = useState('');
  const [uploadingImageKey, setUploadingImageKey] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingImageKey = useRef<string | null>(null);

  useEffect(() => {
    fetch('/api/content')
      .then((r) => r.json())
      .then(setContent)
      .catch(() => setError('Failed to load content'))
      .finally(() => setIsLoading(false));
  }, []);

  const handleChange = useCallback((sectionId: string, key: string, value: string) => {
    setContent((prev) => ({ ...prev, [`${sectionId}_${key}`]: value }));
  }, []);

  const handleImageUpload = useCallback(async (sectionId: string, key: string, file: File) => {
    const contentKey = `${sectionId}_${key}`;
    setUploadingImageKey(contentKey);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Upload failed');
      }
      const { url } = await res.json();
      setContent((prev) => ({ ...prev, [contentKey]: url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image upload failed');
    } finally {
      setUploadingImageKey(null);
    }
  }, []);

  const openFilePicker = useCallback((sectionId: string, key: string) => {
    pendingImageKey.current = `${sectionId}_${key}`;
    fileInputRef.current?.click();
  }, []);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !pendingImageKey.current) return;
      const [sectionId, ...keyParts] = pendingImageKey.current.split('_');
      const key = keyParts.join('_');
      handleImageUpload(sectionId, key, file);
      e.target.value = '';
    },
    [handleImageUpload]
  );

  const saveSection = useCallback(
    async (sectionId: string, fields: Section['fields']) => {
      setSavingSection(sectionId);
      setError('');
      try {
        const updates: Record<string, string> = {};
        for (const field of fields) {
          updates[field.key] = content[`${sectionId}_${field.key}`] ?? '';
        }

        const res = await fetch(`/api/content/${sectionId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });

        if (!res.ok) throw new Error('Failed to save');
        setSavedSection(sectionId);
        setTimeout(() => setSavedSection(null), 2000);
      } catch {
        setError(`Failed to save ${sectionId} section`);
      } finally {
        setSavingSection(null);
      }
    },
    [content]
  );

  const saveFooterLinks = useCallback(async () => {
    setSavingSection(FOOTER_SECTION_ID);
    setError('');
    try {
      const updates: Record<string, string> = {};
      for (const platform of SOCIAL_PLATFORMS) {
        updates[`${platform.id}_url`] = content[`${FOOTER_SECTION_ID}_${platform.id}_url`] ?? '';
      }

      const res = await fetch(`/api/content/${FOOTER_SECTION_ID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!res.ok) throw new Error('Failed to save');
      setSavedSection(FOOTER_SECTION_ID);
      setTimeout(() => setSavedSection(null), 2000);
    } catch {
      setError('Failed to save footer links');
    } finally {
      setSavingSection(null);
    }
  }, [content]);

  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      next.has(sectionId) ? next.delete(sectionId) : next.add(sectionId);
      return next;
    });
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-64">
        <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        onChange={handleFileInputChange}
      />
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">Content</h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Edit all text displayed on your portfolio</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {SECTIONS.map((section) => {
          const isExpanded = expandedSections.has(section.id);
          const isSaving = savingSection === section.id;
          const isSaved = savedSection === section.id;

          return (
            <motion.div
              key={section.id}
              layout
              className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-5 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
              >
                <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">{section.label}</h2>
                {isExpanded ? <ChevronDown className="w-4 h-4 text-neutral-400" /> : <ChevronRight className="w-4 h-4 text-neutral-400" />}
              </button>

              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="px-5 pb-5 space-y-4"
                >
                  {section.fields.map((field) => {
                    const contentKey = `${section.id}_${field.key}`;
                    const value = content[contentKey] ?? '';

                    if (field.type === 'image') {
                      const isUploading = uploadingImageKey === contentKey;
                      return (
                        <div key={field.key}>
                          <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                            {field.label}
                          </label>
                          <div className="flex items-start gap-4">
                            {value && (
                              <div className="relative flex-shrink-0">
                                <img
                                  src={value}
                                  alt="About me preview"
                                  className="w-24 h-24 object-cover rounded-lg border border-neutral-200 dark:border-neutral-700"
                                />
                                <button
                                  type="button"
                                  onClick={() => setContent((prev) => ({ ...prev, [contentKey]: '' }))}
                                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                                  aria-label="Remove image"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                            <div className="flex-1 space-y-2">
                              <button
                                type="button"
                                onClick={() => openFilePicker(section.id, field.key)}
                                disabled={isUploading}
                                className="flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                {isUploading ? (
                                  <><Loader2 className="w-4 h-4 animate-spin" /> Uploading…</>
                                ) : (
                                  <><Upload className="w-4 h-4" /> {value ? 'Replace Photo' : 'Upload Photo'}</>
                                )}
                              </button>
                              <p className="text-xs text-neutral-400 dark:text-neutral-500">JPEG, PNG or WebP · max 10 MB</p>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div key={field.key}>
                        <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                          {field.label}
                        </label>
                        {field.multiline ? (
                          <textarea
                            rows={3}
                            value={value}
                            onChange={(e) => handleChange(section.id, field.key, e.target.value)}
                            className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white/50 transition-all resize-none"
                          />
                        ) : (
                          <input
                            type="text"
                            value={value}
                            onChange={(e) => handleChange(section.id, field.key, e.target.value)}
                            className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white/50 transition-all"
                          />
                        )}
                      </div>
                    );
                  })}

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => saveSection(section.id, section.fields)}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                    >
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save Section
                    </button>
                    {isSaved && (
                      <motion.span initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                        <Check className="w-4 h-4" /> Saved!
                      </motion.span>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}

        {/* Footer Social Links */}
        <motion.div
          layout
          className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden"
        >
          <button
            onClick={() => toggleSection(FOOTER_SECTION_ID)}
            className="w-full flex items-center justify-between p-5 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
          >
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">Footer Social Links</h2>
            {expandedSections.has(FOOTER_SECTION_ID) ? (
              <ChevronDown className="w-4 h-4 text-neutral-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            )}
          </button>

          {expandedSections.has(FOOTER_SECTION_ID) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-5 pb-5 space-y-4"
            >
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Enter the full URL for each social platform you want to show. Leave blank to hide the icon.
              </p>
              {SOCIAL_PLATFORMS.map(({ id, label, Icon }) => {
                const contentKey = `${FOOTER_SECTION_ID}_${id}_url`;
                const value = content[contentKey] ?? '';
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
                        value={value}
                        placeholder={SOCIAL_PLACEHOLDERS[id] ?? `https://${id}.com/yourprofile`}
                        onChange={(e) => setContent((prev) => ({ ...prev, [contentKey]: e.target.value }))}
                        className="flex-1 px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white/50 transition-all"
                      />
                    </div>
                  </div>
                );
              })}

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={saveFooterLinks}
                  disabled={savingSection === FOOTER_SECTION_ID}
                  className="flex items-center gap-2 px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  {savingSection === FOOTER_SECTION_ID ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save Links
                </button>
                {savedSection === FOOTER_SECTION_ID && (
                  <motion.span initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                    <Check className="w-4 h-4" /> Saved!
                  </motion.span>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
