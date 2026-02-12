import SectionHeader from '@/components/ui/SectionHeader';

export default function PrivacyPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="max-w-[800px] mx-auto px-4">
        <SectionHeader sanskrit={"गोपनीयता"} title="Privacy Policy" description="How we handle your data" />

        <div className="glass-card p-8 space-y-6 text-text-muted text-sm leading-relaxed">
          <p><strong className="text-text-primary">Last updated:</strong> February 2026</p>

          <h3 className="font-heading text-lg text-sign-primary">Information We Collect</h3>
          <p>
            When you use Vedic_Astro, we may collect the following information:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Birth details (date, time, place) provided for chart generation</li>
            <li>Email address when subscribing to our newsletter</li>
            <li>Contact information when submitting inquiries</li>
            <li>Account information (name, email) when creating an account</li>
          </ul>

          <h3 className="font-heading text-lg text-sign-primary">How We Use Your Information</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>To generate personalized birth charts and horoscope readings</li>
            <li>To send newsletter updates if you have subscribed</li>
            <li>To respond to your inquiries and support requests</li>
            <li>To improve our services and user experience</li>
          </ul>

          <h3 className="font-heading text-lg text-sign-primary">Data Storage</h3>
          <p>
            Your data is stored securely on AWS infrastructure in the US East region.
            We use encryption in transit (HTTPS) and at rest for all stored data.
            Account data is stored locally in your browser and is not transmitted to
            external servers unless you explicitly submit a form.
          </p>

          <h3 className="font-heading text-lg text-sign-primary">Third-Party Services</h3>
          <p>
            We use Amazon Web Services (AWS) for hosting and data storage.
            We do not sell, trade, or share your personal information with third parties
            for marketing purposes.
          </p>

          <h3 className="font-heading text-lg text-sign-primary">Your Rights</h3>
          <p>
            You may request deletion of your data at any time by contacting us.
            You can unsubscribe from our newsletter using the link provided in each email.
          </p>

          <h3 className="font-heading text-lg text-sign-primary">Contact</h3>
          <p>
            For privacy-related inquiries, please visit our <a href="/contact" className="text-sign-primary animated-underline">Contact page</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
