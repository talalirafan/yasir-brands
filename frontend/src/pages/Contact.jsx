import { useState } from 'react';
import toast from 'react-hot-toast';
import { FiMail, FiPhone, FiMapPin, FiSend, FiMessageCircle } from 'react-icons/fi';
import api from '../api/client';

const inputClass =
  'w-full border border-black/15 rounded px-3 py-2.5 focus:outline-none focus:border-[var(--color-gold)]';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.post('/contact', form);
      toast.success("Message sent! We'll get back to you soon.");
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <section className="bg-black text-white rounded-lg px-8 py-14 text-center mb-10">
        <p className="uppercase tracking-[6px] text-[var(--color-gold)] text-sm mb-3">
          We'd Love to Hear From You
        </p>
        <h1 className="text-3xl md:text-4xl font-semibold mb-3">Get in Touch</h1>
        <p className="max-w-xl mx-auto text-white/70">
          Questions about an order, a fragrance, or just want to say hello? Reach out any time.
        </p>
      </section>

      <div className="grid md:grid-cols-5 gap-8">
        {/* Contact info */}
        <div className="md:col-span-2 space-y-4 text-left">
          <div className="border border-black/10 rounded-xl p-6 bg-white flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-black text-[var(--color-gold)] flex items-center justify-center shrink-0">
              <FiPhone />
            </div>
            <div>
              <p className="font-medium">Call / WhatsApp</p>
              <a href="https://wa.me/923188615506" className="text-black/60 text-sm hover:text-[var(--color-gold)]">
                +92 318 8615506
              </a>
            </div>
          </div>

          <div className="border border-black/10 rounded-xl p-6 bg-white flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-black text-[var(--color-gold)] flex items-center justify-center shrink-0">
              <FiMail />
            </div>
            <div>
              <p className="font-medium">Email</p>
              <a href="mailto:talalirfan987@gmail.com" className="text-black/60 text-sm hover:text-[var(--color-gold)]">
                talalirfan987@gmail.com
              </a>
            </div>
          </div>

          <div className="border border-black/10 rounded-xl p-6 bg-white flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-black text-[var(--color-gold)] flex items-center justify-center shrink-0">
              <FiMapPin />
            </div>
            <div>
              <p className="font-medium">Based in</p>
              <p className="text-black/60 text-sm">Pakistan — nationwide delivery</p>
            </div>
          </div>

          <a
            href="https://wa.me/923188615506"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 bg-[#25D366] text-white rounded-xl py-3 text-sm uppercase tracking-wide font-medium hover:opacity-90 transition-opacity"
          >
            <FiMessageCircle /> Chat on WhatsApp
          </a>
        </div>

        {/* Form */}
        <div className="md:col-span-3 border border-black/10 rounded-xl p-8 bg-white text-left">
          <h2 className="text-xl font-semibold mb-1">Send a Message</h2>
          <p className="text-sm text-black/50 mb-6">We usually reply within a few hours.</p>
          <form onSubmit={onSubmit} className="space-y-4">
            <input
              required
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass}
            />
            <input
              required
              type="email"
              placeholder="Your email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={inputClass}
            />
            <textarea
              required
              placeholder="How can we help?"
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className={inputClass}
            />
            <button
              disabled={sending}
              className="flex items-center justify-center gap-2 w-full bg-black text-white py-3 rounded uppercase text-sm tracking-wide hover:bg-black/85 transition-colors disabled:opacity-50"
            >
              <FiSend /> {sending ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
