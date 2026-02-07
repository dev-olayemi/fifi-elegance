import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import WhatsAppRedirect from "@/components/WhatsApp/WhatsAppRedirect";
import Footer from "@/components/layout/Footer";
import CartSidebar from "@/components/cart/CartSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/hooks/useCart";
import { activityLogger } from "@/utils/activityLogger";
import { ArrowLeft, Copy, MessageCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";
const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    whatsapp: "",
    address: "",
    city: "",
    state: "",
  });

  const [step, setStep] = useState<"details" | "payment" | "confirmation">("details");
  const [orderRef, setOrderRef] = useState("");

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(price);

  const generateOrderRef = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `FFW-${timestamp}-${random}`;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitDetails = (e: React.FormEvent) => {
    e.preventDefault();
    const ref = generateOrderRef();
    setOrderRef(ref);
    setStep("payment");
    toast.success("Order details saved!");
  };

  const handlePaymentConfirmed = () => {
    setStep("confirmation");
    // Log the checkout action
    activityLogger.logCheckout(
      orderRef,
      getCartTotal(),
      cartItems.length,
      formData.fullName
    );
    clearCart();
    toast.success("Payment confirmation received!");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const whatsappNumber = "08122815425";
  const orderSummary = cartItems
    .map((item) => `${item.name} (${item.size}) x${item.quantity} - ${formatPrice(item.price * item.quantity)}`)
    .join("\n");
  const whatsappMessage = encodeURIComponent(
    `Hello Fifi Fashion Wears,\n\nI have completed my payment.\n\nOrder Reference: ${orderRef}\n\nOrder Details:\n${orderSummary}\n\nTotal: ${formatPrice(getCartTotal())}\n\nCustomer: ${formData.fullName}\nPhone: ${formData.phone}\n\nPlease confirm my order.`
  );

  if (cartItems.length === 0 && step !== "confirmation") {
    return (
      <div className="min-h-screen">
        <Header />
        <CartSidebar />
        <main className="pt-32 pb-20">
          <div className="luxury-container text-center">
            <h1 className="font-serif text-3xl mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">
              Add some items to your cart before checking out.
            </p>
            <Button variant="luxury" asChild>
              <Link to="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <CartSidebar />
      <main className="pt-24 md:pt-28">
        <div className="luxury-container py-8 md:py-12">
          {/* Back link */}
          {step === "details" && (
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-xs md:text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 md:mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
          )}

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 md:gap-4 mb-8 md:mb-12">
            {["details", "payment", "confirmation"].map((s, index) => (
              <div key={s} className="flex items-center gap-2 md:gap-4">
                <div
                  className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-medium ${
                    step === s || (step === "payment" && s === "details") || step === "confirmation"
                      ? "bg-gold text-navy"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {index + 1}
                </div>
                <span
                  className={`hidden sm:block text-xs md:text-sm ${
                    step === s ? "font-medium" : "text-muted-foreground"
                  }`}
                >
                  {s === "details" ? "Your Details" : s === "payment" ? "Payment" : "Done"}
                </span>
                {index < 2 && (
                  <div className="w-6 md:w-12 h-px bg-border" />
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {step === "details" && (
                <form onSubmit={handleSubmitDetails} className="space-y-4 md:space-y-6">
                  <h2 className="font-serif text-xl md:text-2xl mb-4 md:mb-6">Shipping Details</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label htmlFor="fullName" className="block text-xs md:text-sm font-medium mb-2">
                        Full Name *
                      </label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        placeholder="Your full name"
                        className="h-10 md:h-12 text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-xs md:text-sm font-medium mb-2">
                        Email Address *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="your@email.com"
                        className="h-10 md:h-12 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-xs md:text-sm font-medium mb-2">
                        Phone Number *
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        placeholder="080XXXXXXXX"
                        className="h-10 md:h-12 text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="whatsapp" className="block text-xs md:text-sm font-medium mb-2">
                        WhatsApp Number
                      </label>
                      <Input
                        id="whatsapp"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleInputChange}
                        placeholder="Same as phone if applicable"
                        className="h-10 md:h-12 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-xs md:text-sm font-medium mb-2">
                      Delivery Address *
                    </label>
                    <Textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your full delivery address"
                      rows={3}
                      className="text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label htmlFor="city" className="block text-xs md:text-sm font-medium mb-2">
                        City *
                      </label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        placeholder="Lagos"
                        className="h-10 md:h-12 text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="state" className="block text-xs md:text-sm font-medium mb-2">
                        State *
                      </label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        placeholder="Lagos State"
                        className="h-10 md:h-12 text-sm"
                      />
                    </div>
                  </div>

                  <Button type="submit" variant="luxury" size="xl" className="w-full">
                    Continue to Payment
                  </Button>
                </form>
              )}

              {step === "payment" && (
                <div className="space-y-6 md:space-y-8">
                  <h2 className="font-serif text-xl md:text-2xl">Payment Instructions</h2>
                  
                  <div className="bg-muted p-4 md:p-6 rounded-lg space-y-3 md:space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs md:text-sm text-muted-foreground">Order Reference</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm md:text-lg break-all">{orderRef}</span>
                        <button
                          onClick={() => copyToClipboard(orderRef)}
                          className="p-1.5 hover:bg-background rounded transition-colors flex-shrink-0"
                          aria-label="Copy reference"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs md:text-sm text-muted-foreground">Total Amount</span>
                      <span className="font-serif text-lg md:text-2xl font-bold text-gold">
                        {formatPrice(getCartTotal())}
                      </span>
                    </div>
                  </div>

                  <div className="border border-border rounded-lg p-4 md:p-6 space-y-3 md:space-y-4">
                    <h3 className="font-medium text-sm md:text-base">Bank Transfer Details</h3>
                    <div className="space-y-2 md:space-y-3">
                      <div className="flex justify-between py-2 border-b border-border text-xs md:text-sm">
                        <span className="text-muted-foreground">Bank Name</span>
                        <span className="font-medium">First Bank of Nigeria</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-border text-xs md:text-sm">
                        <span className="text-muted-foreground">Account Name</span>
                        <span className="font-medium">Fifi Fashion Wears</span>
                      </div>
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center py-2 border-b border-border gap-2">
                        <span className="text-xs md:text-sm text-muted-foreground">Account Number</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-medium text-xs md:text-sm">3012345678</span>
                          <button
                            onClick={() => copyToClipboard("3012345678")}
                            className="p-1 hover:bg-muted rounded transition-colors flex-shrink-0"
                            aria-label="Copy account number"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gold/10 border border-gold/30 rounded-lg p-4 md:p-6">
                    <p className="text-xs md:text-sm mb-3 md:mb-4">
                      <strong>Important:</strong> Please use your order reference <strong>{orderRef}</strong> as 
                      the payment description/narration when making the transfer. This helps us identify 
                      your payment quickly.
                    </p>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      After making payment, click the button below to notify us. We will confirm 
                      your payment within 1-2 business hours and update your order status.
                    </p>
                  </div>

                  <div className="space-y-2 md:space-y-3">
                    <Button
                      variant="luxury"
                      size="lg"
                      className="w-full"
                      onClick={handlePaymentConfirmed}
                    >
                      I Have Made Payment
                    </Button>
                    <Button
                      variant="whatsapp"
                      size="lg"
                      className="w-full"
                      asChild
                    >
                      <a
                        href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                        Notify via WhatsApp
                      </a>
                    </Button>
                  </div>
                </div>
              )}

              {step === "confirmation" && (
                <div className="text-center py-8 md:py-12">
                  <div className="w-16 md:w-20 h-16 md:h-20 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4 md:mb-6">
                    <CheckCircle className="w-8 md:w-10 h-8 md:h-10 text-gold" />
                  </div>
                  <h2 className="font-serif text-xl md:text-3xl mb-3 md:mb-4">Payment Pending Confirmation</h2>
                  <p className="text-xs md:text-sm text-muted-foreground mb-4 md:mb-4 max-w-md mx-auto">
                    Thank you for your order! We're reviewing your payment and will 
                    contact you shortly to confirm.
                  </p>
                  <div className="bg-muted p-3 md:p-4 rounded-lg inline-block mb-6 md:mb-8">
                    <span className="text-xs md:text-sm text-muted-foreground block">Your Order Reference:</span>
                    <p className="font-mono font-bold text-sm md:text-lg break-all">{orderRef}</p>
                  </div>
                  <div className="flex flex-col gap-2 md:gap-3 justify-center">
                    <Button variant="whatsapp" size="lg" asChild>
                      <a
                        href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hello, I just placed order ${orderRef}. Please confirm when ready.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Track via WhatsApp
                      </a>
                    </Button>
                    <Button variant="luxuryOutline" size="lg" asChild>
                      <Link to="/shop">Continue Shopping</Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            {step !== "confirmation" && (
              <div className="lg:col-span-1">
                <div className="bg-muted rounded-lg p-4 md:p-6 sticky top-24 md:top-28">
                  <h3 className="font-serif text-lg md:text-xl mb-4 md:mb-6">Order Summary</h3>
                  <div className="space-y-3 md:space-y-4 mb-4 md:mb-6 max-h-64 overflow-y-auto">
                    {cartItems.map((item) => (
                      <div key={`${item.id}-${item.size}`} className="flex gap-3">
                        <div className="w-12 h-16 md:w-16 md:h-20 bg-background rounded overflow-hidden flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-xs md:text-sm truncate">{item.name}</h4>
                          <p className="text-xs text-muted-foreground leading-tight">
                            Size: {item.size} | Qty: {item.quantity}
                          </p>
                          <p className="text-xs md:text-sm font-medium mt-1">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-border pt-3 md:pt-4 space-y-2">
                    <div className="flex justify-between text-xs md:text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">{formatPrice(getCartTotal())}</span>
                    </div>
                    <div className="flex justify-between text-xs md:text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-xs text-muted-foreground">Calculated later</span>
                    </div>
                    <div className="flex justify-between font-serif text-base md:text-lg pt-2 border-t border-border">
                      <span>Total</span>
                      <span className="text-gold font-bold">{formatPrice(getCartTotal())}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
