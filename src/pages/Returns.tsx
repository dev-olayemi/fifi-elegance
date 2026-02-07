import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppRedirect from "@/components/WhatsApp/WhatsAppRedirect";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

const Returns = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="luxury-container">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">Returns & Exchanges</h1>
            <div className="mb-2">
              <WhatsAppRedirect phone={"08122815425"} defaultMessage={"Hi, I need help with a return for my recent order."}>
                <a className="text-gold hover:underline" href="#" onClick={(e) => e.preventDefault()}>
                  Start a return
                </a>
              </WhatsAppRedirect>
            </div>
            <p className="text-sm text-muted-foreground">On ready-to-wear items</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-secondary/50 border border-border rounded-xl p-6 text-center">
              <AlertCircle className="w-10 h-10 text-gold mx-auto mb-3" />
              <h3 className="font-serif text-lg font-semibold text-primary mb-2">Free Alterations</h3>
              <p className="text-sm text-muted-foreground">One round on bespoke orders</p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <XCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
              <h3 className="font-serif text-lg font-semibold text-primary mb-2">No Refunds</h3>
              <p className="text-sm text-muted-foreground">On bespoke/custom orders</p>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-8 space-y-6">
            <section>
              <h2 className="font-serif text-xl font-semibold text-primary mb-4">Ready-to-Wear Returns</h2>
              <div className="text-muted-foreground space-y-3">
                <p>
                  You may return ready-to-wear items within <strong>7 days</strong> of delivery for a refund or exchange, provided:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>The item is unworn and unwashed</li>
                  <li>All original tags are attached</li>
                  <li>The item is in its original condition</li>
                  <li>You have proof of purchase</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-primary mb-4">Bespoke/Custom Orders</h2>
              <div className="text-muted-foreground space-y-3">
                <p>
                  Due to the personalized nature of bespoke orders, they are <strong>non-refundable</strong> once production has begun.
                </p>
                <p>However, we offer:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>One round of minor alterations free of charge within 7 days of delivery</li>
                  <li>Additional alterations at cost price</li>
                  <li>Thorough quality checks before dispatch</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-primary mb-4">Non-Returnable Items</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Bespoke/custom-made items</li>
                <li>Sale or discounted items</li>
                <li>Items worn, washed, or altered</li>
                <li>Items without original tags</li>
                <li>Accessories (unless defective)</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-primary mb-4">How to Return</h2>
              <ol className="list-decimal list-inside text-muted-foreground space-y-3 ml-4">
                <li>Contact us via WhatsApp within 7 days of receiving your order</li>
                <li>Provide your order number and reason for return</li>
                <li>Wait for return authorization and instructions</li>
                <li>Package the item securely with all tags attached</li>
                <li>Ship to the address provided (customer pays return shipping)</li>
                <li>Refund processed within 5-7 business days of receiving the item</li>
              </ol>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-primary mb-4">Defective Items</h2>
              <p className="text-muted-foreground">
                If you receive a defective or damaged item, please contact us immediately with photos. We will arrange for a replacement or full refund including shipping costs.
              </p>
            </section>
          </div>

          <div className="text-center bg-secondary/30 rounded-xl p-8 mt-8">
            <h2 className="font-serif text-xl font-semibold text-primary mb-3">Need to make a return?</h2>
            <p className="text-muted-foreground mb-6">Contact us on WhatsApp to initiate your return.</p>
            <a
              onClick={(e) => {
                e.preventDefault();
                const defaultMsg = 'Hello Fifi Fashion Wears, I would like to request a return.';
                const phone = '08122815425';
                const encoded = encodeURIComponent(defaultMsg);
                window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
              }}
              className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition-colors"
            >
              Start Return Request
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Returns;
