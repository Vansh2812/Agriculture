import React from 'react';
import { Card } from '@/components/ui/card';

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-[#FAF9F6] py-20" data-testid="terms-page">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <h1 className="text-5xl font-heading font-bold text-primary mb-8" data-testid="terms-title">Terms & Conditions</h1>
        
        <Card className="p-8 md:p-12 rounded-3xl">
          <div className="space-y-8 text-foreground/80">
            <section>
              <h2 className="text-2xl font-heading font-semibold text-primary mb-4">1. Acceptance of Terms</h2>
              <p className="leading-relaxed mb-4">
                By accessing and using AgriPortal, you accept and agree to be bound by these Terms and Conditions.
                If you do not agree to these terms, please do not use our platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-semibold text-primary mb-4">2. User Accounts</h2>
              <p className="leading-relaxed mb-4">
                You are responsible for maintaining the confidentiality of your account credentials and for all activities
                that occur under your account. You must notify us immediately of any unauthorized use of your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-semibold text-primary mb-4">3. Product Listings</h2>
              <p className="leading-relaxed mb-4">
                Farmers are responsible for the accuracy of their product listings, including descriptions, prices, and
                availability. All products must comply with applicable laws and regulations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-semibold text-primary mb-4">4. Orders and Payments</h2>
              <p className="leading-relaxed mb-4">
                All orders are subject to acceptance by the seller. Prices are as displayed at the time of order.
                Payment methods include Cash on Delivery (COD). Orders are final once confirmed.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-semibold text-primary mb-4">5. Delivery</h2>
              <p className="leading-relaxed mb-4">
                Delivery times are estimates and may vary. Farmers are responsible for ensuring timely delivery of products.
                Buyers must provide accurate delivery addresses.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-semibold text-primary mb-4">6. Returns and Refunds</h2>
              <p className="leading-relaxed mb-4">
                Returns and refunds are handled on a case-by-case basis. Buyers should contact the farmer directly for any
                issues with product quality or delivery.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-semibold text-primary mb-4">7. Prohibited Activities</h2>
              <p className="leading-relaxed mb-4">
                Users must not:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Post false or misleading information</li>
                <li>Engage in fraudulent activities</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Interfere with the proper functioning of the platform</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-semibold text-primary mb-4">8. Limitation of Liability</h2>
              <p className="leading-relaxed mb-4">
                AgriPortal acts as a platform connecting farmers and buyers. We are not responsible for the quality,
                safety, or legality of products listed, or the ability of users to complete transactions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-semibold text-primary mb-4">9. Changes to Terms</h2>
              <p className="leading-relaxed mb-4">
                We reserve the right to modify these terms at any time. Continued use of the platform after changes
                constitutes acceptance of the modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-semibold text-primary mb-4">10. Contact Information</h2>
              <p className="leading-relaxed">
                For questions about these Terms and Conditions, please contact us at legal@agriportal.com
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

export default TermsPage;