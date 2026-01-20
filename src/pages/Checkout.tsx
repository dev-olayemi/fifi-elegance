import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartSidebar from "@/components/cart/CartSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/hooks/useCart";
import { ArrowLeft, Copy, MessageCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { bankApi } from "@/lib/api/banks";
import { API_URL } from "@/lib/api/config";

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState<"details" | "payment" | "confirmation">("details");
  const [orderNumber, setOrderNumber] = useState("");
  const [banks, setBanks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    whatsapp: "",
    address: "",
    city: "",
    state: "",
  });

  useEffect(() => {
    loadBanks();
  }, []);

  const loadBanks = async () => {
    try {
      const activeBanks = await bankApi.getActive();
      setBanks(activeBanks);
    } catch (error) {
      console.error('Error loading banks:', error);
      toast.error('Failed to load bank details');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create order in database - match backend expected format
      const orderData = {
        customerInfo: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          whatsapp: formData.whatsapp || formData.phone,
        },
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
        },
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          size: item.size,
          color: item.color || '',
          price: item.price,
        })),
        subtotal: getCartTotal(),
        shippingFee: 0, // Will be calculated by admin
        total: getCartTotal(),
        notes: '',
      };

      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create order');
      }

      const order = await response.json();
      setOrderNumber(order.orderNumber);
      setStep("payment");
      toast.success("Order created successfully!");
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error(error instanceof Error ? error.message : "Failed to create order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentConfirmed = async () => {
    try {
      // Find order by order number first
      const orderResponse = await fetch(`${API_URL}/orders/track/${orderNumber}`);
      if (!orderResponse.ok) throw new Error('Order not found');
      
      const order = await orderResponse.json();
      
      // Update order status to waiting_confirmation using order ID
      const updateResponse = await fetch(`${API_URL}/orders/${order.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'waiting_confirmation',
          paymentStatus: 'unpaid'
        }),
      });

      if (!updateResponse.ok) throw new Error('Failed to update order status');

      setStep("confirmation");
      clearCart();
      toast.success("Payment confirmation received!");
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error("Failed to update order status");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const whatsappNumber = "2348122815425";
  const orderSummary = cartItems
    .map((item) => `${item.name} (${item.size}) x${item.quantity} - ${formatPrice(item.price * item.quantity)}`)
    .join("\n");
  const whatsappMessage = encodeURIComponent(
    `Hello Fifi Fashion Wears,\n\nI have completed my payment.\n\nOrder Number: ${orderNumber}\n\nOrder Details:\n${orderSummary}\n\nTotal: ${formatPrice(getCartTotal())}\n\nCustomer: ${formData.fullName}\nPhone: ${formData.phone}\n\nPlease confirm my order.`
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
        <div className="luxury-container py-12">
          {/* Back link */}
          {step === "details" && (
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
          )}

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-12">
            {["details", "payment", "confirmation"].map((s, index) => (
              <div key={s} className="flex items-center gap-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === s || (step === "payment" && s === "details") || step === "confirmation"
                      ? "bg-gold text-navy"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {index + 1}
                </div>
                <span
                  className={`hidden sm:block text-sm ${
                    step === s ? "font-medium" : "text-muted-foreground"
                  }`}
                >
                  {s === "details" ? "Your Details" : s === "payment" ? "Payment" : "Done"}
                </span>
                {index < 2 && (
                  <div className="w-12 h-px bg-border" />
                )}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {step === "details" && (
                <form onSubmit={handleSubmitDetails} className="space-y-6">
                  <h2 className="font-serif text-2xl mb-6">Shipping Details</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium mb-2">
                        Full Name *
                      </label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        placeholder="Your full name"
                        className="h-12"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
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
                        className="h-12"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium mb-2">
                        Phone Number *
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        placeholder="080XXXXXXXX"
                        className="h-12"
                      />
                    </div>
                    <div>
                      <label htmlFor="whatsapp" className="block text-sm font-medium mb-2">
                        WhatsApp Number
                      </label>
                      <Input
                        id="whatsapp"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleInputChange}
                        placeholder="Same as phone if applicable"
                        className="h-12"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium mb-2">
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
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium mb-2">
                        City *
                      </label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        placeholder="Lagos"
                        className="h-12"
                      />
                    </div>
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium mb-2">
                        State *
                      </label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        placeholder="Lagos State"
                        className="h-12"
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    variant="luxury" 
                    size="xl" 
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? 'Creating Order...' : 'Continue to Payment'}
                  </Button>
                </form>
              )}

              {step === "payment" && (
                <div className="space-y-8">
                  <h2 className="font-serif text-2xl">Payment Instructions</h2>
                  
                  <div className="bg-muted p-6 rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Order Number</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-lg">{orderNumber}</span>
                        <button
                          onClick={() => copyToClipboard(orderNumber)}
                          className="p-1.5 hover:bg-background rounded transition-colors"
                          aria-label="Copy order number"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Amount</span>
                      <span className="font-serif text-2xl font-bold text-gold">
                        {formatPrice(getCartTotal())}
                      </span>
                    </div>
                  </div>

                  {/* Show all active banks */}
                  {banks.length > 0 ? (
                    <div className="space-y-4">
                      <h3 className="font-medium">Bank Transfer Details</h3>
                      {banks.map((bank) => (
                        <div key={bank.id} className="border border-border rounded-lg p-6 space-y-4">
                          <div className="space-y-3">
                            <div className="flex justify-between py-2 border-b border-border">
                              <span className="text-muted-foreground">Bank Name</span>
                              <span className="font-medium">{bank.bankName}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-border">
                              <span className="text-muted-foreground">Account Name</span>
                              <span className="font-medium">{bank.accountName}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-border">
                              <span className="text-muted-foreground">Account Number</span>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-medium">{bank.accountNumber}</span>
                                <button
                                  onClick={() => copyToClipboard(bank.accountNumber)}
                                  className="p-1 hover:bg-muted rounded transition-colors"
                                  aria-label="Copy account number"
                                >
                                  <Copy className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="border border-border rounded-lg p-6 text-center">
                      <p className="text-muted-foreground">Loading bank details...</p>
                    </div>
                  )}

                  <div className="bg-gold/10 border border-gold/30 rounded-lg p-6">
                    <p className="text-sm mb-4">
                      <strong>Important:</strong> Please use your order number <strong>{orderNumber}</strong> as 
                      the payment description/narration when making the transfer. This helps us identify 
                      your payment quickly.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      After making payment, click the button below to notify us. We will confirm 
                      your payment within 1-2 business hours and update your order status.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Button
                      variant="luxury"
                      size="xl"
                      className="w-full"
                      onClick={handlePaymentConfirmed}
                    >
                      I Have Made Payment
                    </Button>
                    <Button
                      variant="whatsapp"
                      size="xl"
                      className="w-full"
                      asChild
                    >
                      <a
                        href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="w-5 h-5" />
                        Notify via WhatsApp
                      </a>
                    </Button>
                  </div>
                </div>
              )}

              {step === "confirmation" && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-gold" />
                  </div>
                  <h2 className="font-serif text-3xl mb-4">Payment Pending Confirmation</h2>
                  <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                    Thank you for your order! We're reviewing your payment and will 
                    contact you shortly to confirm.
                  </p>
                  <div className="bg-muted p-4 rounded-lg inline-block mb-8">
                    <span className="text-sm text-muted-foreground">Your Order Number:</span>
                    <p className="font-mono font-bold text-xl">{orderNumber}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button variant="luxury" asChild>
                      <Link to="/order-tracking">Track Your Order</Link>
                    </Button>
                    <Button variant="whatsapp" asChild>
                      <a
                        href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hello, I just placed order ${orderNumber}. Please confirm when ready.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Contact via WhatsApp
                      </a>
                    </Button>
                    <Button variant="luxuryOutline" asChild>
                      <Link to="/shop">Continue Shopping</Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            {step !== "confirmation" && (
              <div className="lg:col-span-1">
                <div className="bg-muted rounded-lg p-6 sticky top-28">
                  <h3 className="font-serif text-xl mb-6">Order Summary</h3>
                  <div className="space-y-4 mb-6">
                    {cartItems.map((item) => (
                      <div key={`${item.id}-${item.size}`} className="flex gap-4">
                        <div className="w-16 h-20 bg-background rounded overflow-hidden flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{item.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            Size: {item.size} | Qty: {item.quantity}
                          </p>
                          <p className="text-sm font-medium mt-1">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-border pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatPrice(getCartTotal())}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>Calculated after payment</span>
                    </div>
                    <div className="flex justify-between font-serif text-lg pt-2 border-t border-border">
                      <span>Total</span>
                      <span className="text-gold">{formatPrice(getCartTotal())}</span>
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
