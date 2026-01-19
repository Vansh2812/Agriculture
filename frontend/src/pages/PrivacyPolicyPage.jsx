import React from 'react';
import { Card } from '@/components/ui/card';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-[#FAF9F6] py-20" data-testid="privacy-policy-page">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <h1 className="text-5xl font-heading font-bold text-primary mb-8" data-testid="privacy-title">Privacy Policy</h1>
        
        <Card className="p-8 md:p-12 rounded-3xl">
          <div className="space-y-8 text-foreground/80">
            <section>
              <h2 className="text-2xl font-heading font-semibold text-primary mb-4">1. Information We Collect</h2>
              <p className="leading-relaxed mb-4">
                We collect information that you provide directly to us when you register for an account, create a profile,
                list products, place orders, or communicate with us. This may include your name, email address, phone number,
                location, and payment information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-semibold text-primary mb-4">2. How We Use Your Information</h2>
              <p className="leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send you technical notices and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Protect against fraudulent or illegal activity</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-semibold text-primary mb-4">3. Information Sharing</h2>
              <p className="leading-relaxed mb-4">
                We do not sell your personal information. We may share your information with:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Other users (farmers and buyers) as necessary to complete transactions</li>
                <li>Service providers who perform services on our behalf</li>
                <li>Law enforcement when required by law</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-semibold text-primary mb-4">4. Data Security</h2>
              <p className="leading-relaxed mb-4">
                We take reasonable measures to protect your information from unauthorized access, use, or disclosure.
                However, no internet transmission is completely secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-semibold text-primary mb-4">5. Your Rights</h2>
              <p className="leading-relaxed mb-4">
                You have the right to access, update, or delete your personal information at any time through your account
                settings. You may also contact us to request deletion of your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-semibold text-primary mb-4">6. Contact Us</h2>
              <p className="leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at privacy@agriportal.com
              </p>
            </section>

            <p className="text-sm text-foreground/60 mt-8">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;