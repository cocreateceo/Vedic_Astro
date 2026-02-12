import Link from 'next/link';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function CTASection() {
  return (
    <section className="py-16 md:py-24 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(var(--sign-glow-rgb),0.06)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute left-8 top-1/2 -translate-y-1/2 text-6xl text-sign-primary/10 hidden lg:block">&#10048;</div>
      <div className="absolute right-8 top-1/2 -translate-y-1/2 text-6xl text-sign-primary/10 hidden lg:block">&#10048;</div>
      <ScrollReveal>
        <div className="max-w-[800px] mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl md:text-4xl text-sign-primary mb-4">
            Ready to Explore Your Cosmic Blueprint?
          </h2>
          <p className="text-text-muted mb-8 text-lg">
            Get your free Vedic birth chart and discover what the stars have in store for you.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/kundli" className="btn-premium bg-gradient-to-r from-sign-primary to-sign-dark text-cosmic-bg px-8 py-4 rounded-lg font-medium text-lg btn-glow">
              Generate Free Kundli
            </Link>
            <Link href="/consultation" className="btn-premium border-2 border-sign-primary text-sign-primary px-8 py-4 rounded-lg font-medium text-lg hover:bg-sign-primary hover:text-cosmic-bg transition-all">
              Consult an Astrologer
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
