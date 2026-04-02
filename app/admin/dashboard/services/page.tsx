'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Check, X, Edit2, Loader2, Camera } from 'lucide-react';
import type { Service } from '@/lib/types';

const ICONS = ['Heart', 'User', 'Mountain', 'Camera', 'Image', 'Video', 'Star', 'Award', 'Calendar', 'Users'];

const emptyService: Omit<Service, 'id' | 'updated_at'> = {
  title: '',
  description: '',
  icon: 'Camera',
  display_order: 0,
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | 'new' | null>(null);
  const [editData, setEditData] = useState<Partial<Service>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadServices = useCallback(async () => {
    try {
      const res = await fetch('/api/services');
      const data = await res.json();
      setServices(data);
    } catch {
      setError('Failed to load services');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadServices(); }, [loadServices]);

  const startEdit = useCallback((service: Service) => {
    setEditingId(service.id);
    setEditData({ title: service.title, description: service.description, icon: service.icon, display_order: service.display_order });
  }, []);

  const startNew = useCallback(() => {
    setEditingId('new');
    setEditData({ ...emptyService, display_order: services.length });
  }, [services.length]);

  const saveService = useCallback(async () => {
    if (!editData.title?.trim()) {
      setError('Title is required');
      return;
    }
    setSaving(true);
    setError('');
    try {
      if (editingId === 'new') {
        const res = await fetch('/api/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editData),
        });
        if (!res.ok) throw new Error('Failed to create');
        await loadServices();
      } else if (editingId) {
        const res = await fetch(`/api/services/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editData),
        });
        if (!res.ok) throw new Error('Failed to save');
        setServices((prev) => prev.map((s) => s.id === editingId ? { ...s, ...editData } as Service : s));
      }
      setEditingId(null);
    } catch {
      setError('Failed to save service');
    } finally {
      setSaving(false);
    }
  }, [editingId, editData, loadServices]);

  const deleteService = useCallback(async (id: number) => {
    if (!confirm('Delete this service?')) return;
    try {
      const res = await fetch(`/api/services/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch {
      setError('Failed to delete service');
    }
  }, []);

  const ServiceForm = () => (
    <div className="space-y-4 p-5 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700">
      <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">{editingId === 'new' ? 'Add New Service' : 'Edit Service'}</h3>
      <div>
        <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">Title *</label>
        <input type="text" value={editData.title ?? ''} onChange={(e) => setEditData((p) => ({ ...p, title: e.target.value }))} placeholder="e.g. Wedding Photography" className="w-full px-3 py-2 text-sm bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white/50 transition-all" />
      </div>
      <div>
        <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">Description</label>
        <textarea rows={3} value={editData.description ?? ''} onChange={(e) => setEditData((p) => ({ ...p, description: e.target.value }))} placeholder="Brief description of the service..." className="w-full px-3 py-2 text-sm bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white/50 transition-all resize-none" />
      </div>
      <div>
        <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">Icon</label>
        <select value={editData.icon ?? 'Camera'} onChange={(e) => setEditData((p) => ({ ...p, icon: e.target.value }))} className="w-full px-3 py-2 text-sm bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white/50 transition-all">
          {ICONS.map((icon) => <option key={icon}>{icon}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">Display Order</label>
        <input type="number" min={0} value={editData.display_order ?? 0} onChange={(e) => setEditData((p) => ({ ...p, display_order: Number(e.target.value) }))} className="w-full px-3 py-2 text-sm bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white/50 transition-all" />
      </div>
      <div className="flex gap-2 pt-1">
        <button onClick={saveService} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 disabled:opacity-50 transition-colors text-sm font-medium">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          {editingId === 'new' ? 'Add Service' : 'Save Changes'}
        </button>
        <button onClick={() => setEditingId(null)} className="flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors text-sm font-medium">
          <X className="w-4 h-4" /> Cancel
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">Services</h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{services.length} {services.length === 1 ? 'service' : 'services'}</p>
        </div>
        <button
          onClick={startNew}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400 flex items-center justify-between">
          {error}
          <button onClick={() => setError('')} className="ml-2 text-red-400 hover:text-red-600"><X className="w-4 h-4" /></button>
        </div>
      )}

      {editingId === 'new' && <div className="mb-6"><ServiceForm /></div>}

      {isLoading ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-neutral-400" /></div>
      ) : services.length === 0 && editingId !== 'new' ? (
        <div className="text-center py-12 text-neutral-400">
          <Camera className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No services yet. Add your first service above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {services.map((service) => (
              <motion.div
                key={service.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden"
              >
                {editingId === service.id ? (
                  <div className="p-5"><ServiceForm /></div>
                ) : (
                  <div className="flex items-start gap-4 p-5">
                    <div className="w-10 h-10 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-mono text-neutral-500">{service.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-neutral-900 dark:text-white">{service.title}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 line-clamp-2">{service.description}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button onClick={() => startEdit(service)} className="p-2 text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors" aria-label="Edit service"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => deleteService(service.id)} className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" aria-label="Delete service"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
