const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-playfair font-bold text-gold mb-6 tracking-wider">
            Privacy Policy
          </h1>
          <p className="text-secondary">Last updated: March 4, 2026</p>
        </div>

        {/* Content */}
        <div className="bg-card rounded-2xl p-8 md:p-12 border border-border space-y-8">
          <section>
            <h2 className="text-2xl font-playfair font-bold text-primary mb-4">
              1. Information We Collect
            </h2>
            <div className="text-secondary space-y-3 text-sm leading-relaxed">
              <p>
                We collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Name, email address, and contact information</li>
                <li>Shipping and billing addresses</li>
                <li>Payment information (processed securely through our payment provider)</li>
                <li>Account credentials and preferences</li>
                <li>Purchase history and wishlist items</li>
                <li>Communications with our customer service team</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-playfair font-bold text-primary mb-4">
              2. How We Use Your Information
            </h2>
            <div className="text-secondary space-y-3 text-sm leading-relaxed">
              <p>We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Process and fulfill your orders</li>
                <li>Communicate with you about your orders and account</li>
                <li>Provide customer support and respond to inquiries</li>
                <li>Send you marketing communications (with your consent)</li>
                <li>Improve our services and user experience</li>
                <li>Detect and prevent fraud and security issues</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-playfair font-bold text-primary mb-4">
              3. Information Sharing
            </h2>
            <div className="text-secondary space-y-3 text-sm leading-relaxed">
              <p>
                We do not sell your personal information. We may share your information with:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Vendors to fulfill your orders</li>
                <li>Payment processors to complete transactions</li>
                <li>Shipping carriers to deliver your orders</li>
                <li>Service providers who assist in our operations</li>
                <li>Law enforcement when required by law</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-playfair font-bold text-primary mb-4">
              4. Data Security
            </h2>
            <div className="text-secondary space-y-3 text-sm leading-relaxed">
              <p>
                We implement appropriate technical and organizational measures to protect your personal 
                information against unauthorized access, alteration, disclosure, or destruction. This includes:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Encryption of data in transit and at rest</li>
                <li>Secure payment processing through certified providers</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication measures</li>
                <li>Employee training on data protection</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-playfair font-bold text-primary mb-4">
              5. Your Rights
            </h2>
            <div className="text-secondary space-y-3 text-sm leading-relaxed">
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Opt-out of marketing communications</li>
                <li>Export your data</li>
                <li>Lodge a complaint with a supervisory authority</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-playfair font-bold text-primary mb-4">
              6. Cookies and Tracking
            </h2>
            <div className="text-secondary space-y-3 text-sm leading-relaxed">
              <p>
                We use cookies and similar tracking technologies to enhance your experience, analyze usage, 
                and deliver personalized content. You can control cookie preferences through your browser settings.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-playfair font-bold text-primary mb-4">
              7. Children's Privacy
            </h2>
            <div className="text-secondary space-y-3 text-sm leading-relaxed">
              <p>
                Our services are not intended for individuals under 18 years of age. We do not knowingly 
                collect personal information from children.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-playfair font-bold text-primary mb-4">
              8. Changes to This Policy
            </h2>
            <div className="text-secondary space-y-3 text-sm leading-relaxed">
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any material 
                changes by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-playfair font-bold text-primary mb-4">
              9. Contact Us
            </h2>
            <div className="text-secondary space-y-3 text-sm leading-relaxed">
              <p>
                If you have questions about this Privacy Policy or our data practices, please contact us at:
              </p>
              <div className="mt-4 space-y-1">
                <p>Email: privacy@verra.com</p>
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

export default PrivacyPolicy;
