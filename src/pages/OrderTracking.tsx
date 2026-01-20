import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Package, Truck, CheckCircle, Clock } from "lucide-react";

const OrderTracking = () => {
  const [orderRef, setOrderRef] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderRef.trim()) {
      setIsSearching(true);
      // In a real app, this would query the database
      setTimeout(() => setIsSearching(false), 1500);
    }
  };

  const trackingSteps = [
    {
      icon: Clock,
      title: "Order Placed",
      description: "Your order has been received",
      status: "completed",
    },
    {
      icon: Package,
      title: "Payment Confirmed",
      description: "Payment verified successfully",
      status: "completed",
    },
    {
      icon: Truck,
      title: "Processing",
      description: "Your order is being prepared",
      status: "current",
    },
    {
      icon: CheckCircle,
      title: "Delivered",
      description: "Order delivered successfully",
      status: "pending",
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
              Track Your Order
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Enter your order reference number to check the status of your order.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            {/* Search Form */}
            <form onSubmit={handleSearch} className="mb-12">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Enter order reference (e.g., FF-2024-001234)"
                    value={orderRef}
                    onChange={(e) => setOrderRef(e.target.value)}
                    className="pl-12 h-14 text-lg"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="h-14 px-8"
                  disabled={isSearching}
                >
                  {isSearching ? "Searching..." : "Track"}
                </Button>
              </div>
            </form>

            {/* Demo Tracking Result */}
            <div className="bg-card rounded-xl border border-border p-8">
              <div className="text-center mb-8">
                <p className="text-sm text-muted-foreground mb-1">Order Reference</p>
                <p className="font-serif text-2xl font-semibold text-primary">
                  FF-2024-001234
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Placed on January 15, 2024
                </p>
              </div>

              {/* Tracking Steps */}
              <div className="relative">
                {trackingSteps.map((step, index) => (
                  <div key={index} className="flex gap-4 mb-6 last:mb-0">
                    {/* Icon */}
                    <div className="relative">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          step.status === "completed"
                            ? "bg-green-100 text-green-600"
                            : step.status === "current"
                            ? "bg-gold/20 text-gold"
                            : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        <step.icon className="w-5 h-5" />
                      </div>
                      {/* Connector Line */}
                      {index < trackingSteps.length - 1 && (
                        <div
                          className={`absolute left-1/2 -translate-x-1/2 top-12 w-0.5 h-12 ${
                            step.status === "completed"
                              ? "bg-green-300"
                              : "bg-border"
                          }`}
                        />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-2">
                      <h3
                        className={`font-semibold ${
                          step.status === "pending"
                            ? "text-muted-foreground"
                            : "text-primary"
                        }`}
                      >
                        {step.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {step.description}
                      </p>
                      {step.status === "current" && (
                        <span className="inline-block mt-2 px-3 py-1 bg-gold/20 text-gold text-xs rounded-full">
                          In Progress
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Help Section */}
            <div className="mt-8 text-center bg-secondary/30 rounded-xl p-6">
              <h3 className="font-serif text-lg font-semibold text-primary mb-2">
                Need Help?
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                If you have questions about your order, contact us directly.
              </p>
              <a
                href="https://wa.me/08122815425?text=Hello%20Fifi%20Fashion%20Wears,%20I%20need%20help%20tracking%20my%20order."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-gold hover:underline"
              >
                Chat with us on WhatsApp →
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderTracking;
