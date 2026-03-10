const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-playfair font-bold text-gold mb-6 tracking-wider">
            Terms of Service
          </h1>
          <p className="text-secondary">Last updated: March 4, 2026</p>
        </div>

        {/* Content */}
        <div className="bg-card rounded-2xl p-8 md:p-12 border border-border space-y-8">
          <section>
            <h2 className="text-2xl font-playfair font-bold text-primary mb-4">
              1. Acceptance of Terms
            </h2>
            <div className="text-secondary space-y-3 text-sm leading-relaxed">
              <p>
                By accessing and using VERRA's services, you accept and agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use our services.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-playfair font-bold text-primary mb-4">
              2. Account Registration
            </h2>
            <div className="text-secondary space-y-3 text-sm leading-relaxed">
              <p>To use certain features, you must register for an account. You agree to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Be responsible for all activities under your account</li>
                <li>Be at least 18 years of age</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-playfair font-bold text-primary mb-4">
              3. Purchases and Payments
            </h2>
            <div className="text-secondary space-y-3 text-sm leading-relaxed">
              <p>When making a purchase, you agree that:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>All prices are in USD unless otherwise stated</li>
                <li>Prices are subject to change without notice</li>
                <li>You will provide valid payment information</li>
                <li>You authorize us to charge your payment method</li>
                <li>All sales are final unless otherwise stated in our return policy</li>
                <li>Additional taxes and fees may apply based on your location</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-playfair font-bold text-primary mb-4">
              4. Product Listings and Availability
            </h2>
            <div className="text-secondary space-y-3 text-sm leading-relaxed">
              <p>
                We strive to provide accurate product descriptions and images. However:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Colors may vary due to display settings</li>
                <li>Product availability is not guaranteed</li>
                <li>We reserve the right to limit quantities</li>
                <li>We may discontinue products at any time</li>
                <li>Errors in pricing or descriptions may be corrected</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-playfair font-bold text-primary mb-4">
              5. Shipping and Delivery
            </h2>
            <div className="text-secondary space-y-3 text-sm leading-relaxed">
              <p>
                Shipping times are estimates and not guaranteed. We are not responsible for delays caused by 
                shipping carriers, customs, or circumstances beyond our control. Risk of loss passes to you 
                upon delivery to the carrier.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-playfair font-bold text-primary mb-4">
              6. Returns and Refunds
            </h2>
            <div className="text-secondary space-y-3 text-sm leading-relaxed">
              <p>
                Our return policy allows returns within 14 days of delivery for most items. Items must be in 
                original condition with all packaging and documentation. Some items may not be eligible for 
                return. Refunds are processed to the original payment method within 5-7 business days of 
                receiving the return.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-playfair font-bold text-primary mb-4">
              7. Authenticity Guarantee
            </h2>
            <div className="text-secondary space-y-3 text-sm leading-relaxed">
              <p>
                We guarantee the authenticity of all items sold on our platform. All vendors are verified, 
                and items undergo authentication processes. If you receive a counterfeit item, contact us 
                immediately for a full refund and investigation.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-playfair font-bold text-primary mb-4">
              8. Prohibited Activities
            </h2>
            <div className="text-secondary space-y-3 text-sm leading-relaxed">
              <p>You agree not to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Use our services for any illegal purpose</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with the proper functioning of our services</li>
                <li>Impersonate any person or entity</li>
                <li>Collect user information without consent</li>
                <li>Post false, misleading, or fraudulent content</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-playfair font-bold text-primary mb-4">
              9. Intellectual Property
            </h2>
            <div className="text-secondary space-y-3 text-sm leading-relaxed">
              <p>
                All content on VERRA, including text, graphics, logos, images, and software, is the property 
                of VERRA or its licensors and is protected by copyright, trademark, and other intellectual 
                property laws. You may not reproduce, distribute, or create derivative works without our 
                express written permission.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-playfair font-bold text-primary mb-4">
              10. Limitation of Liability
            </h2>
            <div className="text-secondary space-y-3 text-sm leading-relaxed">
              <p>
                To the maximum extent permitted by law, VERRA shall not be liable for any indirect, incidental, 
                special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred 
                directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-playfair font-bold text-primary mb-4">
              11. Dispute Resolution
            </h2>
            <div className="text-secondary space-y-3 text-sm leading-relaxed">
              <p>
                Any disputes arising from these terms or your use of our services shall be resolved through 
                binding arbitration in accordance with the rules of the American Arbitration Association. 
                You waive any right to participate in a class action lawsuit or class-wide arbitration.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-playfair font-bold text-primary mb-4">
              12. Changes to Terms
            </h2>
            <div className="text-secondary space-y-3 text-sm leading-relaxed">
              <p>
                We reserve the right to modify these Terms of Service at any time. Changes will be effective 
                immediately upon posting. Your continued use of our services after changes constitutes 
                acceptance of the modified terms.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-playfair font-bold text-primary mb-4">
              13. Contact Information
            </h2>
            <div className="text-secondary space-y-3 text-sm leading-relaxed">
              <p>
                For questions about these Terms of Service, please contact us at:
              </p>
              <div className="mt-4 space-y-1">
                <p>Email: legal@verra.com</p>
                <p>Phone: +1 (555) 123-4567</p>
                <p>Address: 123 Luxury Avenue, New York, NY 10001</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
