import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/client';

const emptyForm = {
  name: '',
  slug: '',
  description: '',
  gender: 'boys',
  price: '',
  stock: '',
  size: '100ml',
  notes: '',
  images: '',
};

function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function ProductFormModal({ product, onClose, onSaved }) {
  const isEdit = !!product;
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        slug: product.slug || '',
        description: product.description || '',
        gender: product.gender || 'boys',
        price: product.price ?? '',
        stock: product.stock ?? '',
        size: product.size || '100ml',
        notes: (product.notes || []).join(', '),
        images: (product.images || []).join(', '),
      });
    } else {
      setForm(emptyForm);
    }
  }, [product]);

  const onNameChange = (name) => {
    setForm((f) => ({ ...f, name, slug: isEdit ? f.slug : slugify(name) }));
  };

  const onPickImage = () => fileInputRef.current?.click();

  const onFileSelected = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploading(true);
    try {
      const body = new FormData();
      body.append('file', file);
      const { data } = await api.post('/upload', body);
      setForm((f) => ({ ...f, images: data.url }));
      toast.success('Image uploaded');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: form.name,
      slug: form.slug || slugify(form.name),
      description: form.description,
      gender: form.gender,
      price: Number(form.price),
      stock: Number(form.stock),
      size: form.size,
      notes: form.notes.split(',').map((n) => n.trim()).filter(Boolean),
      images: form.images.split(',').map((n) => n.trim()).filter(Boolean),
    };
    try {
      if (isEdit) {
        await api.patch(`/products/${product._id}`, payload);
        toast.success('Product updated');
      } else {
        await api.post('/products', payload);
        toast.success('Product added');
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    'w-full border border-black/15 rounded px-3 py-2 focus:outline-none focus:border-[var(--color-gold)]';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div
        className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">{isEdit ? 'Edit Product' : 'Add Product'}</h2>
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block text-sm text-black/60 mb-1">Name</label>
            <input required value={form.name} onChange={(e) => onNameChange(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm text-black/60 mb-1">Slug</label>
            <input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm text-black/60 mb-1">Description</label>
            <textarea required rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-black/60 mb-1">Gender</label>
              <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className={inputClass}>
                <option value="boys">Boys</option>
                <option value="girls">Girls</option>
                <option value="unisex">Unisex</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-black/60 mb-1">Size</label>
              <input value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-black/60 mb-1">Price (Rs.)</label>
              <input required type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm text-black/60 mb-1">Stock</label>
              <input required type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className={inputClass} />
            </div>
          </div>
          <div>
            <label className="block text-sm text-black/60 mb-1">Fragrance Notes (comma separated)</label>
            <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Oud, Amber, Musk" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm text-black/60 mb-1">Product Image</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onFileSelected}
              className="hidden"
            />
            <button
              type="button"
              onClick={onPickImage}
              disabled={uploading}
              className="w-full border border-dashed border-black/25 rounded-lg overflow-hidden hover:border-[var(--color-gold)] transition-colors disabled:opacity-50"
            >
              {form.images ? (
                <img src={form.images.split(',')[0].trim()} alt="Product" className="w-full h-40 object-cover" />
              ) : (
                <div className="h-40 flex flex-col items-center justify-center text-black/40 text-sm gap-1">
                  <span>{uploading ? 'Uploading...' : 'Click to choose an image from your computer'}</span>
                </div>
              )}
            </button>
            {form.images && (
              <p className="text-xs text-black/40 mt-1 truncate">{form.images}</p>
            )}
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-black/15 rounded py-2.5 text-sm uppercase tracking-wide">
              Cancel
            </button>
            <button disabled={saving} className="flex-1 bg-black text-white rounded py-2.5 text-sm uppercase tracking-wide disabled:opacity-50">
              {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
