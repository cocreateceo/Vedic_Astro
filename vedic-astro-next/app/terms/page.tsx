import SectionHeader from '@/components/ui/SectionHeader';

export default function TermsPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="max-w-[800px] mx-auto px-4">
        <SectionHeader sanskrit={"नियम"} title="Terms of Use" description="Terms governing use of Vedic_Astro" />

        <div className="glass-card p-8 space-y-6 text-text-muted text-sm leading-relaxed">
          <p><strong className="text-text-primary">Last updated:</strong> February 2026</p>

          <h3 className="font-heading text-lg text-sign-primary">Acceptance of Terms</h3>
          <p>
            By accessing and using Vedic_Astro, you agree to be bound by these Terms of Use.
            If you do not agree to these terms, please do not use our services.
          </p>

          <h3 className="font-heading text-lg text-sign-primary">Services</h3>
          <p>
            Vedic_Astro provides astrological tools and content including birth chart generation,
            horoscope readings, compatibility analysis, and educational articles. These services
            are provided for informational and entertainment purposes.
          </p>

          <h3 className="font-heading text-lg text-sign-primary">Disclaimer</h3>
          <p>
            Astrology is an ancient tradition and should be used for guidance and self-reflection.
            Vedic_Astro does not guarantee the accuracy of predictions or the outcome of any
            decisions made based on astrological readings. Major life decisions should always be
            made in consultation with qualified professionals.
          </p>

          <h3 className="font-heading text-lg text-sign-primary">User Accounts</h3>
          <p>
            You are responsible for maintaining the confidentiality of your account information.
            You agree to provide accurate and complete information when creating an account.
          </p>

          <h3 className="font-heading text-lg text-sign-primary">Intellectual Property</h3>
          <p>
            All content on Vedic_Astro, including text, graphics, logos, and software, is the
            property of Vedic_Astro and is protected by applicable intellectual property laws.
            You may not reproduce, distribute, or create derivative works without our permission.
          </p>

          <h3 className="font-heading text-lg text-sign-primary">Limitation of Liability</h3>
          <p>
            Vedic_Astro shall not be liable for any direct, indirect, incidental, or consequential
            damages arising from your use of our services. Our services are provided {'"'}as is{'"'} without
            warranties of any kind.
          </p>

          <h3 className="font-heading text-lg text-sign-primary">Changes to Terms</h3>
          <p>
            We reserve the right to modify these terms at any time. Continued use of the site
            after changes constitutes acceptance of the updated terms.
          </p>

          <h3 className="font-heading text-lg text-sign-primary">Contact</h3>
          <p>
            For questions about these terms, please visit our <a href="/contact" className="text-sign-primary animated-underline">Contact page</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
