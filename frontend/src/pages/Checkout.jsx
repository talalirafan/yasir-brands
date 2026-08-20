import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiShoppingBag, FiEdit2, FiCopy } from 'react-icons/fi';
import api from '../api/client';
import { useCartStore, useAuthStore } from '../store/cartStore';
import CheckoutStepper from '../components/CheckoutStepper';
import EmptyState from '../components/EmptyState';

const WALLET_NUMBER = '0312-1128987';

const paymentOptions = [
  { id: 'COD', label: 'Cash on Delivery', hint: 'Pay in cash when your order arrives' },
  { id: 'EasyPaisa', label: 'EasyPaisa', hint: `Pay now via EasyPaisa to ${WALLET_NUMBER}` },
  { id: 'JazzCash', label: 'JazzCash', hint: `Pay now via JazzCash to ${WALLET_NUMBER}` },
];

const inputClass = 'w-full border border-black/15 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[var(--color-gold)] transition-colors';

export default function Checkout() {
  const { items, clearCart } = useCartStore();
  const user = useAuthStore((s) => s.user);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const delivery = subtotal >= 5000 ? 0 : 250;
  const navigate = useNavigate();
  const [reviewing, setReviewing] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [form, setForm] = useState({
    fullName: '', phone: '', city: '', area: '', address: '', postalCode: '', notes: '',
    paymentMethod: 'COD', senderNumber: '', transactionId: '',
  });

  const total = subtotal + delivery;

  const [savedAddresses, setSavedAddresses] = useState([]);
  useEffect(() => {
    api.get('/addresses').then((res) => setSavedAddresses(res.data)).catch(() => {});
  }, []);

  // Default the delivery name/phone to the logged-in account so the order
  // (and its confirmation email) is unambiguously tied to whoever is
  // actually logged in — still editable for a different recipient.
  useEffect(() => {
    if (!user) return;
    setForm((f) => ({
      ...f,
      fullName: f.fullName || user.name || '',
      phone: f.phone || user.phone || '',
    }));
  }, [user]);

  const useSavedAddress = (a) => {
    setForm((f) => ({
      ...f,
      fullName: a.fullName,
      phone: a.phone,
      city: a.city,
      area: a.area,
      address: a.address,
      postalCode: a.postalCode || '',
    }));
    toast.success('Address filled in');
  };

  const addressComplete = ['fullName', 'phone', 'city', 'area', 'address'].every((k) => form[k].trim());
  const isWalletPayment = form.paymentMethod !== 'COD';
  const paymentComplete = !isWalletPayment || (form.senderNumber.trim() && form.transactionId.trim());
  const currentStep = placing ? 4 : reviewing ? 3 : addressComplete && paymentComplete ? 2 : 1;

  const copyWalletNumber = () => {
    navigator.clipboard?.writeText(WALLET_NUMBER.replace('-', ''));
    toast.success('Number copied');
  };

  const onReview = (e) => {
    e.preventDefault();
    setReviewing(true);
  };

  const onConfirm = async () => {
    setPlacing(true);
    try {
      const { data } = await api.post('/orders', {
        items: items.map((i) => ({ product: i._id, qty: i.qty, price: i.price })),
        subtotal, delivery, total, ...form,
      });
      clearCart();
      toast.success('Order placed!');
      navigate(`/order-confirmation/${data.orderNumber || data._id}`, { state: { order: data } });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to place order');
      setPlacing(false);
      setReviewing(false);
    }
  };

  if (items.length === 0) {
    return (
      <EmptyState
        icon={FiShoppingBag}
        title="Your cart is empty"
        message="Add products before checking out."
        actionLabel="Continue Shopping"
        actionTo="/shop"
      />
    );
  }

  const selectedPayment = paymentOptions.find((p) => p.id === form.paymentMethod);

  return (
    <div>
      <CheckoutStepper current={currentStep} />

      {reviewing ? (
        <div className="max-w-2xl mx-auto text-left">
          <div className="flex items-center justify-between mb-4">
            <h1 className="font-display text-2xl sm:text-3xl font-semibold">Review Your Order</h1>
            <button
              onClick={() => setReviewing(false)}
              className="flex items-center gap-1 text-sm text-black/60 hover:text-black"
            >
              <FiEdit2 size={14} /> Edit
            </button>
          </div>
          <p className="text-sm text-black/50 mb-6">Please check everything below before confirming.</p>

          <div className="border border-black/10 rounded-2xl p-5 mb-4 bg-white">
            <h2 className="font-medium mb-3">Items</h2>
            <div className="divide-y">
              {items.map((i) => (
                <div key={i._id} className="flex justify-between py-2 text-sm">
                  <span>{i.name} x{i.qty}</span>
                  <span>Rs. {(i.price * i.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t mt-2 pt-2 space-y-1 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>Rs. {subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Delivery</span><span>{delivery === 0 ? 'Free' : `Rs. ${delivery}`}</span></div>
              <div className="flex justify-between font-semibold text-base"><span>Total</span><span>Rs. {total.toLocaleString()}</span></div>
            </div>
          </div>

          <div className="border border-black/10 rounded-2xl p-5 mb-4 bg-white">
            <h2 className="font-medium mb-3">Delivery Address</h2>
            <p className="text-sm">{form.fullName} — {form.phone}</p>
            <p className="text-sm text-black/70">{form.address}, {form.area}, {form.city} {form.postalCode}</p>
            {form.notes && <p className="text-sm text-black/50 mt-1">Note: {form.notes}</p>}
          </div>

          <div className="border border-black/10 rounded-2xl p-5 mb-6 bg-white">
            <h2 className="font-medium mb-2">Payment Method</h2>
            <p className="text-sm">{selectedPayment.label}</p>
            {isWalletPayment && (
              <>
                <p className="text-sm text-black/60">Sender number: {form.senderNumber}</p>
                <p className="text-sm text-black/60">Transaction ID: {form.transactionId}</p>
                <p className="text-xs text-[var(--color-gold)] mt-1">
                  We'll verify this payment before confirming your order.
                </p>
              </>
            )}
          </div>

          <button
            onClick={onConfirm}
            disabled={placing}
            className="w-full bg-black text-white py-3.5 rounded-full uppercase text-sm tracking-wide font-medium hover:bg-[var(--color-black-soft)] transition-colors disabled:opacity-50"
          >
            {placing ? 'Placing order...' : 'Confirm & Place Order'}
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          <form onSubmit={onReview} className="md:col-span-2 space-y-4 text-left">
            <h1 className="font-display text-2xl sm:text-3xl font-semibold mb-4">Checkout</h1>

            {savedAddresses.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {savedAddresses.map((a) => (
                  <button
                    key={a._id}
                    type="button"
                    onClick={() => useSavedAddress(a)}
                    className="text-xs border rounded-full px-3 py-1.5 hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-colors"
                  >
                    Use: {a.fullName} — {a.city}
                  </button>
                ))}
              </div>
            )}

            <input required autoComplete="off" placeholder="Full name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className={inputClass} />
            <input required autoComplete="off" placeholder="Phone number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} />
            <div className="grid grid-cols-2 gap-4">
              <input required placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={inputClass} />
              <input required placeholder="Area" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} className={inputClass} />
            </div>
            <textarea required placeholder="Complete delivery address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={inputClass} rows={3} />
            <input placeholder="Postal code" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} className={inputClass} />
            <textarea placeholder="Order notes (optional)" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className={inputClass} rows={2} />

            <div className="border border-black/10 rounded-2xl p-4 space-y-2 bg-white">
              <p className="font-medium mb-1">Payment Method</p>
              {paymentOptions.map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-start gap-3 border rounded-xl p-3 cursor-pointer transition-colors ${
                    form.paymentMethod === opt.id ? 'border-[var(--color-gold)] bg-[var(--color-gold)]/5' : 'border-black/10'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={form.paymentMethod === opt.id}
                    onChange={() => setForm({ ...form, paymentMethod: opt.id })}
                    className="mt-1"
                  />
                  <div>
                    <p className="text-sm font-medium">{opt.label}</p>
                    <p className="text-xs text-black/50">{opt.hint}</p>
                  </div>
                </label>
              ))}

              {isWalletPayment && (
                <div className="pt-1 space-y-3">
                  <div className="bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/30 rounded-xl p-4">
                    <p className="text-sm font-medium mb-2">Pay Rs. {total.toLocaleString()} now to confirm your order</p>
                    <ol className="text-sm text-black/70 list-decimal list-inside space-y-1 mb-3">
                      <li>Open your {form.paymentMethod} app</li>
                      <li>
                        Send <strong>Rs. {total.toLocaleString()}</strong> to the number below
                      </li>
                      <li>Come back and enter your number + the transaction ID</li>
                    </ol>
                    <div className="flex items-center gap-2 bg-white border border-black/10 rounded-lg px-3 py-2">
                      <span className="font-semibold tracking-wide flex-1">{WALLET_NUMBER}</span>
                      <button
                        type="button"
                        onClick={copyWalletNumber}
                        className="flex items-center gap-1 text-xs text-black/60 hover:text-black"
                      >
                        <FiCopy size={13} /> Copy
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-black/60 mb-1">
                      Your {form.paymentMethod} number (the one you paid from)
                    </label>
                    <input
                      required
                      placeholder="03XX-XXXXXXX"
                      value={form.senderNumber}
                      onChange={(e) => setForm({ ...form, senderNumber: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-black/60 mb-1">
                      Transaction ID (from your {form.paymentMethod} receipt/SMS)
                    </label>
                    <input
                      required
                      placeholder="e.g. TID123456789"
                      value={form.transactionId}
                      onChange={(e) => setForm({ ...form, transactionId: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>
              )}
            </div>

            <button className="w-full bg-black text-white py-3.5 rounded-full uppercase text-sm tracking-wide font-medium hover:bg-[var(--color-black-soft)] transition-colors">
              Review Order
            </button>
          </form>

          <div className="border border-black/10 rounded-2xl p-6 h-fit text-left bg-white">
            <h2 className="font-display text-lg font-semibold mb-4">Order Summary</h2>
            {items.map((i) => (
              <div key={i._id} className="flex justify-between text-sm mb-2">
                <span>{i.name} x{i.qty}</span>
                <span>Rs. {(i.price * i.qty).toLocaleString()}</span>
              </div>
            ))}

            <div className="flex justify-between mb-2 text-sm border-t pt-2 mt-3"><span>Subtotal</span><span>Rs. {subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between mb-2 text-sm"><span>Delivery</span><span>{delivery === 0 ? 'Free' : `Rs. ${delivery}`}</span></div>
            <div className="flex justify-between font-semibold text-lg border-t pt-3"><span>Total</span><span>Rs. {total.toLocaleString()}</span></div>
          </div>
        </div>
      )}
    </div>
  );
}
