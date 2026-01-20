import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Truck, Clock, MapPin, Package } from "lucide-react";

const Shipping = () => {
  const shippingZones = [
    {
      zone: "Lagos (Mainland & Island)",
      time: "2-3 Business Days",
      cost: "₦3,000 - ₦5,000",
    },
    {
      zone: "South-West Nigeria",
      time: "3-5 Business Days",
      cost: "₦4,000 - ₦6,000",
    },
    {
      zone: "South-East & South-South Nigeria",
      time: "4-6 Business Days",
      cost: "₦5,000 - ₦8,000",
    },
    {
      zone: "Northern Nigeria",
      time: "5-7 Business Days",
      cost: "₦6,000 - ₦10,000",
    },
    {
      zone: "International (Contact Us)",
      time: "7-14 Business Days",
      cost: "Quote on Request",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="luxury-container">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">
              Shipping Information
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We deliver your orders with care to locations across Nigeria and internationally.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            {[
              {
                icon: Truck,
                title: "Nationwide Delivery",
                desc: "We ship to all 36 states",
              },
              {
                icon: Package,
                title: "Secure Packaging",
                desc: "Careful handling guaranteed",
              },
              {
                icon: Clock,
                title: "Fast Processing",
                desc: "Orders processed within 24hrs",
              },
              {
                icon: MapPin,
                title: "Order Tracking",
                desc: "Track your order status",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 bg-card rounded-xl border border-border"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-gold" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Shipping Zones Table */}
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-2xl font-semibold text-primary mb-6 text-center">
              Delivery Zones & Rates
            </h2>
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <table className="w-full">
                <thead className="bg-secondary">
                  <tr>
                    <th className="text-left p-4 font-serif text-primary">
                      Location
                    </th>
                    <th className="text-left p-4 font-serif text-primary">
                      Delivery Time
                    </th>
                    <th className="text-left p-4 font-serif text-primary">
                      Cost
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {shippingZones.map((zone, index) => (
                    <tr
                      key={index}
                      className="border-t border-border hover:bg-secondary/50 transition-colors"
                    >
                      <td className="p-4 text-foreground">{zone.zone}</td>
                      <td className="p-4 text-muted-foreground">{zone.time}</td>
                      <td className="p-4 text-gold font-semibold">{zone.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Notes */}
            <div className="mt-8 space-y-6">
              <div className="bg-secondary/30 rounded-xl p-6">
                <h3 className="font-serif text-lg font-semibold text-primary mb-3">
                  Important Notes
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Delivery times are estimates and may vary during peak periods</li>
                  <li>• Free shipping on orders above ₦150,000 within Lagos</li>
                  <li>• Shipping costs are calculated at checkout based on your location</li>
                  <li>• We partner with trusted courier services for safe delivery</li>
                  <li>• You will receive tracking information once your order ships</li>
                </ul>
              </div>

              <div className="bg-gold/10 rounded-xl p-6 border border-gold/20">
                <h3 className="font-serif text-lg font-semibold text-primary mb-3">
                  International Shipping
                </h3>
                <p className="text-muted-foreground mb-4">
                  We ship worldwide! For international orders, please contact us via WhatsApp for shipping quotes and estimated delivery times.
                </p>
                <a
                  href="https://wa.me/08122815425?text=Hello%20Fifi%20Fashion%20Wears,%20I%20would%20like%20to%20inquire%20about%20international%20shipping."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-gold hover:underline"
                >
                  Contact us for international shipping →
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Shipping;
