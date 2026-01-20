import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="luxury-container">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">
              Terms & Conditions
            </h1>
            <p className="text-muted-foreground">
              Last updated: January 2024
            </p>
          </div>

          {/* Content */}
          <div className="max-w-3xl mx-auto">
            <div className="space-y-8 text-foreground">
              <section>
                <h2 className="font-serif text-2xl font-semibold text-primary mb-4">
                  1. General Terms
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing and placing an order with Fifi Fashion Wears, you confirm that you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our website or services.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-2xl font-semibold text-primary mb-4">
                  2. Products and Pricing
                </h2>
                <div className="text-muted-foreground leading-relaxed space-y-3">
                  <p>
                    All prices displayed on our website are in Nigerian Naira (₦) and are subject to change without notice.
                  </p>
                  <p>
                    We make every effort to display product colors and images accurately. However, actual colors may vary slightly due to monitor settings and photography.
                  </p>
                  <p>
                    Product availability is subject to stock levels. We reserve the right to limit quantities.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="font-serif text-2xl font-semibold text-primary mb-4">
                  3. Orders and Payment
                </h2>
                <div className="text-muted-foreground leading-relaxed space-y-3">
                  <p>
                    By placing an order, you agree to provide accurate and complete information.
                  </p>
                  <p>
                    We accept payment via bank transfer only. Orders are processed after payment confirmation.
                  </p>
                  <p>
                    A unique reference number will be provided for each order. Please include this reference when making payment.
                  </p>
                  <p>
                    We reserve the right to cancel orders if payment is not received within 48 hours.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="font-serif text-2xl font-semibold text-primary mb-4">
                  4. Bespoke Orders
                </h2>
                <div className="text-muted-foreground leading-relaxed space-y-3">
                  <p>
                    Bespoke (custom) orders are made specifically for you based on your measurements and design preferences.
                  </p>
                  <p>
                    A 50% deposit is required to commence work on bespoke orders. The remaining balance is due before delivery.
                  </p>
                  <p>
                    Bespoke orders are non-refundable once production has begun due to their personalized nature.
                  </p>
                  <p>
                    We offer one round of minor alterations free of charge within 7 days of delivery.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="font-serif text-2xl font-semibold text-primary mb-4">
                  5. Shipping and Delivery
                </h2>
                <div className="text-muted-foreground leading-relaxed space-y-3">
                  <p>
                    Delivery times are estimates and not guaranteed. We are not liable for delays beyond our control.
                  </p>
                  <p>
                    Risk of loss and title for items pass to you upon delivery.
                  </p>
                  <p>
                    Please inspect your order upon delivery and report any issues within 24 hours.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="font-serif text-2xl font-semibold text-primary mb-4">
                  6. Returns and Refunds
                </h2>
                <div className="text-muted-foreground leading-relaxed space-y-3">
                  <p>
                    Ready-to-wear items may be returned within 7 days of delivery if unworn, unwashed, and in original condition with all tags attached.
                  </p>
                  <p>
                    Bespoke/custom orders are non-refundable and non-exchangeable.
                  </p>
                  <p>
                    Sale items are final sale and cannot be returned or exchanged.
                  </p>
                  <p>
                    Return shipping costs are the responsibility of the customer unless the item is defective.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="font-serif text-2xl font-semibold text-primary mb-4">
                  7. Intellectual Property
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  All content on this website, including designs, images, logos, and text, is the property of Fifi Fashion Wears and protected by intellectual property laws. Unauthorized use is prohibited.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-2xl font-semibold text-primary mb-4">
                  8. Limitation of Liability
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Fifi Fashion Wears shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-2xl font-semibold text-primary mb-4">
                  9. Contact Information
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  For questions about these Terms & Conditions, please contact us:
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

export default Terms;
