'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Trash2, Edit2, Check, X, Plus, Star, Loader2 } from 'lucide-react';
import { upload } from '@vercel/blob/client';
import type { GalleryImage } from '@/lib/types';

const CATEGORIES = ['Landscape', 'Wedding', 'Portrait', 'Nature', 'Commercial', 'Event', 'Other'];

interface ImageActionButtonsProps {
  image: GalleryImage;
  onEdit: (image: GalleryImage) => void;
  onToggleFeatured: (image: GalleryImage) => void;
  onDelete: (id: number) => void;
  variant: 'overlay' | 'inline';
}

function ImageActionButtons({ image, onEdit, onToggleFeatured, onDelete, variant }: ImageActionButtonsProps) {
  if (variant === 'overlay') {
    return (
      <>
        <button onClick={() => onEdit(image)} className="p-2 bg-white rounded-lg text-neutral-900 hover:bg-neutral-100 transition-colors" aria-label="Edit image"><Edit2 className="w-4 h-4" /></button>
        <button onClick={() => onToggleFeatured(image)} className={`p-2 rounded-lg transition-colors ${image.featured ? 'bg-amber-400 text-amber-900 hover:bg-amber-300' : 'bg-white text-neutral-900 hover:bg-neutral-100'}`} aria-label={image.featured ? 'Unfeature' : 'Feature'}><Star className="w-4 h-4" /></button>
        <button onClick={() => onDelete(image.id)} className="p-2 bg-red-500 rounded-lg text-white hover:bg-red-600 transition-colors" aria-label="Delete image"><Trash2 className="w-4 h-4" /></button>
      </>
    );
  }
  return (
    <>
      <button onClick={() => onEdit(image)} className="inline-flex min-w-[44px] min-h-[44px] items-center justify-center bg-neutral-100 dark:bg-neutral-800 rounded text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors" aria-label="Edit image"><Edit2 className="w-3 h-3" /></button>
      <button onClick={() => onToggleFeatured(image)} className={`inline-flex min-w-[44px] min-h-[44px] items-center justify-center rounded transition-colors ${image.featured ? 'bg-amber-400 text-amber-900 hover:bg-amber-300' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'}`} aria-label={image.featured ? 'Unfeature' : 'Feature'}><Star className="w-3 h-3" /></button>
      <button onClick={() => onDelete(image.id)} className="inline-flex min-w-[44px] min-h-[44px] items-center justify-center bg-red-100 dark:bg-red-900/30 rounded text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors" aria-label="Delete image"><Trash2 className="w-3 h-3" /></button>
    </>
  );
}

export default function GalleryManagerPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<GalleryImage>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadImages = useCallback(async () => {
    try {
      const res = await fetch('/api/gallery');
      if (!res.ok) throw new Error('Failed to load gallery');
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error('Invalid gallery data');
      setImages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load gallery');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadImages(); }, [loadImages]);

  const uploadFile = useCallback(async (file: File) => {
    if (!file) return;
    setUploading(true);
    setUploadProgress(0);
    setError('');

    // Abort after 90 seconds so the UI never hangs indefinitely.
    // The @vercel/blob/client library retries network errors up to 10 times
    // with exponential back-off; without a timeout this can stall for >15 min.
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90_000);

    try {
      const pathname = `gallery/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const blob = await upload(pathname, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
        abortSignal: controller.signal,
        onUploadProgress: ({ percentage }) => {
          setUploadProgress(Math.round(percentage));
        },
      });

      const name = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      const createRes = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: name, alt: name, category: 'Other', url: blob.url, featured: false, display_order: images.length }),
      });
      if (!createRes.ok) throw new Error('Failed to save image');
      await loadImages();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      if (msg.toLowerCase().includes('aborted')) {
        setError('Upload timed out. Try a smaller file or check your connection, then try again.');
      } else {
        setError(msg);
      }
    } finally {
      clearTimeout(timeoutId);
      setUploading(false);
      setUploadProgress(0);
    }
  }, [images.length, loadImages]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [uploadFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }, [uploadFile]);

  const startEdit = useCallback((image: GalleryImage) => {
    setEditingId(image.id);
    setEditData({ title: image.title, alt: image.alt, category: image.category, featured: image.featured });
  }, []);

  const saveEdit = useCallback(async () => {
    if (!editingId) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/gallery/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });
      if (!res.ok) throw new Error('Failed to save');
      setImages((prev) => prev.map((img) => img.id === editingId ? { ...img, ...editData } as GalleryImage : img));
      setEditingId(null);
    } catch {
      setError('Failed to save changes');
    } finally {
      setSaving(false);
    }
  }, [editingId, editData]);

  const deleteImage = useCallback(async (id: number) => {
    if (!confirm('Delete this image? This cannot be undone.')) return;
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setImages((prev) => prev.filter((img) => img.id !== id));
    } catch {
      setError('Failed to delete image');
    }
  }, []);

  const toggleFeatured = useCallback(async (image: GalleryImage) => {
    try {
      await fetch(`/api/gallery/${image.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !image.featured }),
      });
      setImages((prev) => prev.map((img) => img.id === image.id ? { ...img, featured: !img.featured } : img));
    } catch {
      setError('Failed to update image');
    }
  }, []);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">Gallery</h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{images.length} {images.length === 1 ? 'image' : 'images'}</p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          {uploading ? (uploadProgress > 0 ? `${uploadProgress}%` : 'Uploading…') : 'Upload Image'}
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      </div>

      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400 flex items-center justify-between">
          {error}
          <button onClick={() => setError('')} className="ml-2 text-red-400 hover:text-red-600"><X className="w-4 h-4" /></button>
        </motion.div>
      )}

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        className={`mb-8 border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
          dragOver ? 'border-neutral-900 dark:border-white bg-neutral-50 dark:bg-neutral-800' : 'border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600'
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-neutral-400 animate-spin" />
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {uploadProgress > 0 ? `Uploading… ${uploadProgress}%` : 'Preparing upload…'}
            </p>
            {uploadProgress > 0 && (
              <div className="w-40 h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-neutral-900 dark:bg-white rounded-full transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-8 h-8 text-neutral-400" />
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Drop an image here, or click to browse</p>
            <p className="text-xs text-neutral-400">JPEG, PNG, WebP or GIF — max 10MB</p>
          </div>
        )}
      </div>

      {/* Gallery Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square bg-neutral-200 dark:bg-neutral-800 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-16 text-neutral-400 dark:text-neutral-600">
          <Upload className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No images yet. Upload your first photo above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {images.map((image) => (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image.url} alt={image.alt} className="w-full aspect-square object-cover" loading="lazy" />

                {/* Featured badge */}
                {image.featured && (
                  <div className="absolute top-2 left-2 bg-amber-400 text-amber-900 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3" /> Featured
                  </div>
                )}

                {/* Actions overlay — visible on hover (desktop) */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity [@media(hover:none)]:hidden flex items-center justify-center gap-2">
                  <ImageActionButtons image={image} onEdit={startEdit} onToggleFeatured={toggleFeatured} onDelete={deleteImage} variant="overlay" />
                </div>

                {/* Info */}
                <div className="p-3">
                  {editingId === image.id ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editData.alt ?? ''}
                        onChange={(e) => setEditData((p) => ({ ...p, alt: e.target.value }))}
                        placeholder="Alt text"
                        className="w-full px-2 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-neutral-400"
                      />
                      <select
                        value={editData.category ?? 'Other'}
                        onChange={(e) => setEditData((p) => ({ ...p, category: e.target.value }))}
                        className="w-full px-2 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-neutral-400"
                      >
                        {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                      </select>
                      <div className="flex gap-1">
                        <button onClick={saveEdit} disabled={saving} className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded text-xs font-medium disabled:opacity-50">
                          {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />} Save
                        </button>
                        <button onClick={() => setEditingId(null)} className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded text-xs font-medium">
                          <X className="w-3 h-3" /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-xs font-medium text-neutral-900 dark:text-white truncate">{image.alt || image.title || 'Untitled'}</p>
                      <div className="flex items-center justify-between mt-0.5">
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">{image.category}</p>
                        {/* Action buttons — always visible on touch devices, hidden on hover-capable devices (handled by overlay above) */}
                        <div className="flex gap-1 [@media(hover:hover)]:hidden">
                          <ImageActionButtons image={image} onEdit={startEdit} onToggleFeatured={toggleFeatured} onDelete={deleteImage} variant="inline" />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
