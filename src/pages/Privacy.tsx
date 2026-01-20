import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="luxury-container">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground">
              Last updated: January 2024
            </p>
          </div>

          {/* Content */}
          <div className="max-w-3xl mx-auto prose prose-lg">
            <div className="space-y-8 text-foreground">
              <section>
                <h2 className="font-serif text-2xl font-semibold text-primary mb-4">
                  Introduction
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Fifi Fashion Wears ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase from us.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-2xl font-semibold text-primary mb-4">
                  Information We Collect
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We collect information you provide directly to us, including:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Name, email address, phone number, and WhatsApp number</li>
                  <li>Shipping and billing address</li>
                  <li>Order history and preferences</li>
                  <li>Measurements (for bespoke orders)</li>
                  <li>Communication history with our team</li>
                  <li>Reference images (for custom orders)</li>
                </ul>
              </section>

              <section>
                <h2 className="font-serif text-2xl font-semibold text-primary mb-4">
                  How We Use Your Information
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Process and fulfill your orders</li>
                  <li>Communicate with you about your orders via WhatsApp, email, or phone</li>
                  <li>Create and deliver bespoke/custom garments</li>
                  <li>Send order updates and delivery notifications</li>
                  <li>Respond to your inquiries and provide customer support</li>
                  <li>Improve our products and services</li>
                  <li>Send promotional communications (with your consent)</li>
                </ul>
              </section>

              <section>
                <h2 className="font-serif text-2xl font-semibold text-primary mb-4">
                  Information Sharing
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We do not sell, trade, or rent your personal information to third parties. We may share your information only with trusted service providers who assist us in operating our business, such as delivery partners, and only to the extent necessary to provide our services to you.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-2xl font-semibold text-primary mb-4">
                  Data Security
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-2xl font-semibold text-primary mb-4">
                  Your Rights
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Access the personal information we hold about you</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your personal information</li>
                  <li>Opt-out of marketing communications</li>
                </ul>
              </section>

              <section>
                <h2 className="font-serif text-2xl font-semibold text-primary mb-4">
                  Contact Us
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about this Privacy Policy or our data practices, please contact us at:
                </p>
                <div className="mt-4 text-muted-foreground">
                  <p>Email: fififashionwears@gmail.com</p>
                  <p>WhatsApp: 0812 281 5425</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
