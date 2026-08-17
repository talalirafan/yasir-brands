import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/client';
import ProductFormModal from '../../components/admin/ProductFormModal';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const load = () => api.get('/products').then((res) => setProducts(res.data)).catch(() => setProducts([]));

  useEffect(() => {
    load();
  }, []);

  const openAdd = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const onDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/products/${product._id}`);
      toast.success('Product deleted');
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete product');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Products</h1>
        <button onClick={openAdd} className="bg-black text-white px-4 py-2 rounded text-sm">
          + Add Product
        </button>
      </div>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b text-sm text-black/60">
            <th className="py-2">Name</th><th>Category</th><th>Price</th><th>Stock</th><th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id} className="border-b">
              <td className="py-2">{p.name}</td>
              <td>{p.gender}</td>
              <td>Rs. {p.price?.toLocaleString()}</td>
              <td>{p.stock}</td>
              <td className="space-x-2">
                <button onClick={() => openEdit(p)} className="text-sm underline">Edit</button>
                <button onClick={() => onDelete(p)} className="text-sm text-red-500 underline">Delete</button>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr><td colSpan={5} className="py-6 text-center text-black/50">No products yet.</td></tr>
          )}
        </tbody>
      </table>

      {modalOpen && (
        <ProductFormModal
          product={editingProduct}
          onClose={() => setModalOpen(false)}
          onSaved={load}
        />
      )}
    </div>
  );
}
