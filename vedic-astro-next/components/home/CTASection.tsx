import Link from 'next/link';
import ScrollReveal from '@/components/ui/ScrollReveal';
import SacredEmbers from '@/components/ui/SacredEmbers';
import TemplePillars from '@/components/ui/TemplePillars';
import LotusBloom from '@/components/ui/LotusBloom';
import SriYantra from '@/components/ui/SriYantra';
import SparkleWrap from '@/components/ui/SparkleWrap';
import PetalScatter from '@/components/ui/PetalScatter';

export default function CTASection() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(var(--sign-glow-rgb),0.06)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sign-primary">
        <SriYantra size={500} opacity={0.035} />
      </div>
      <SacredEmbers count={25} />
      <TemplePillars />
      <ScrollReveal>
        <div className="max-w-[800px] mx-auto px-4 text-center">
          <LotusBloom size={70} className="mb-4" />
          <h2 className="font-heading text-3xl md:text-4xl mb-4 temple-gradient drop-shadow-[0_0_20px_rgba(var(--sign-glow-rgb),0.3)]">
            ✨ Ready to Explore Your Cosmic Blueprint? ✨
          </h2>
          <p className="text-text-muted mb-8 text-lg">
            Get your free Vedic birth chart and discover what the stars have in store for you.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <PetalScatter count={12}>
              <Link href="/kundli" className="btn-premium bg-gradient-to-r from-sign-primary to-sign-dark text-cosmic-bg px-8 py-4 rounded-lg font-medium text-lg btn-glow">
                Generate Free Kundli
              </Link>
            </PetalScatter>
            <SparkleWrap count={6}>
              <Link href="/consultation" className="btn-premium border-2 border-sign-primary text-sign-primary px-8 py-4 rounded-lg font-medium text-lg hover:bg-sign-primary hover:text-cosmic-bg transition-all">
                Consult an Astrologer
              </Link>
            </SparkleWrap>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
