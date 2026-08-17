import { useEffect, useState } from 'react';
import api from '../../api/client';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    api.get('/admin/customers').then((res) => setCustomers(res.data)).catch(() => setCustomers([]));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Customers</h1>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b text-sm text-black/60">
            <th className="py-2">Name</th><th>Email</th><th>Orders</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c._id} className="border-b">
              <td className="py-2">{c.name}</td>
              <td>{c.email}</td>
              <td>{c.orderCount ?? 0}</td>
            </tr>
          ))}
          {customers.length === 0 && (
            <tr><td colSpan={3} className="py-6 text-center text-black/50">No customers yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
