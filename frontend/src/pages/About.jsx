export default function About() {
  return (
    <div className="max-w-3xl mx-auto text-left">
      <h1 className="text-3xl font-semibold mb-6 text-center">About YSR Fragrances</h1>
      <p className="text-black/70 mb-6">
        YSR Fragrances was founded with one goal: to craft luxury scents that feel personal.
        Every bottle — from Shanu Noir to Bloom — is designed to leave a lasting impression,
        blending premium ingredients with modern, bold identity.
      </p>
      <div className="grid grid-cols-2 gap-6">
        <img src="/team/founder-1.jpg" alt="Founder" className="rounded-lg w-full object-cover aspect-square" />
        <img src="/team/founder-2.jpg" alt="Founder" className="rounded-lg w-full object-cover aspect-square" />
      </div>
    </div>
  );
}
