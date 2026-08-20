import { Link } from 'react-router-dom';
import { FiFeather, FiAward, FiHeart } from 'react-icons/fi';

const values = [
  {
    icon: FiFeather,
    title: 'Crafted with Care',
    text: 'Every fragrance is blended in small batches, balancing premium notes for a scent that lasts.',
  },
  {
    icon: FiAward,
    title: 'Premium Ingredients',
    text: 'We source quality oud, amber, and florals to give each bottle a rich, long-lasting character.',
  },
  {
    icon: FiHeart,
    title: 'Made to Feel Personal',
    text: 'From Shanu Noir to Bloom, every scent is designed to become part of someone’s identity.',
  },
];

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section className="text-center mb-16 sm:mb-20 pt-4">
        <p className="uppercase tracking-[6px] text-[var(--color-gold)] text-xs sm:text-sm mb-4">Our Story</p>
        <h1 className="font-display text-4xl sm:text-6xl font-semibold mb-5 leading-tight">
          A House Built on
          <br className="hidden sm:block" /> Signature Scent
        </h1>
        <p className="max-w-xl mx-auto text-black/60 text-sm sm:text-base leading-relaxed">
          Yasir Fragrances was founded with one goal: to craft luxury scents that feel personal.
          Every bottle is designed to leave a lasting impression, blending premium ingredients
          with a modern, bold identity.
        </p>
      </section>

      {/* Founder editorial */}
      <section className="grid md:grid-cols-5 gap-0 mb-20 rounded-2xl overflow-hidden border border-black/10">
        <div className="md:col-span-2 relative aspect-[4/5] md:aspect-auto">
          <img
            src="/team/founder-2.jpg"
            alt="Yasir Zehri, Founder of Yasir Fragrances"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <div className="md:col-span-3 bg-black text-white p-8 sm:p-12 flex flex-col justify-center">
          <p className="uppercase tracking-[4px] text-[var(--color-gold)] text-xs mb-4">Meet the Founder</p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-5">Yasir Zehri</h2>
          <p className="font-display text-xl sm:text-2xl text-white/85 leading-snug mb-6 italic">
            “I didn't want to just sell perfume — I wanted to bottle a feeling people
            would recognize as unmistakably their own.”
          </p>
          <p className="text-white/55 text-sm leading-relaxed mb-8">
            What started as a personal obsession with fine fragrance grew into Yasir Fragrances —
            a brand built on the belief that a scent should say something about who you are before
            you say a word. Every formula is tested, refined, and finished by hand before it ever
            reaches a shelf.
          </p>
          <div className="flex items-center gap-3">
            <img
              src="/team/founder-1.jpg"
              alt="Yasir Zehri"
              className="w-11 h-11 rounded-full object-cover border-2 border-[var(--color-gold)]"
            />
            <div>
              <p className="text-sm font-medium">Yasir Zehri</p>
              <p className="text-xs text-white/40 tracking-wide uppercase">Founder, Yasir Fragrances</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mb-20">
        <div className="text-center mb-10">
          <p className="uppercase tracking-[4px] text-[var(--color-gold)] text-xs mb-1.5">What We Stand For</p>
          <h2 className="font-display text-3xl font-semibold">The Yasir Promise</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-5">
          {values.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="border border-black/10 rounded-2xl p-7 text-left bg-white hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-full bg-[var(--color-cream)] flex items-center justify-center text-[var(--color-gold)] mb-4">
                <Icon size={19} />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">{title}</h3>
              <p className="text-sm text-black/60 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden text-center bg-black text-white rounded-2xl px-6 py-14 sm:py-16">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(circle at 20% 20%, rgba(198,162,90,0.18), transparent 45%), radial-gradient(circle at 80% 80%, rgba(198,162,90,0.14), transparent 50%)',
          }}
        />
        <div className="relative">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold mb-3">Find Your Signature Scent</h2>
          <p className="text-white/60 max-w-md mx-auto mb-7 text-sm">
            Explore our collection and discover a fragrance that's uniquely yours.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-[var(--color-gold)] text-black px-8 py-3 rounded-full uppercase text-xs sm:text-sm tracking-wide font-medium hover:bg-[var(--color-gold-light)] transition-colors"
          >
            Shop the Collection
          </Link>
        </div>
      </section>
    </div>
  );
}
