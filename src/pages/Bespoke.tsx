import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartSidebar from "@/components/cart/CartSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Scissors, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { API_URL } from "@/lib/api/config";

const Bespoke = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    whatsapp: "",
    description: "",
    measurements: "",
    budget: "",
    deadline: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const requestData = {
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        customerWhatsapp: formData.whatsapp || formData.phone,
        description: formData.description,
        measurements: formData.measurements,
        budgetRange: formData.budget,
        deadline: formData.deadline || null,
        referenceImages: null, // Can be added later if needed
      };

      const response = await fetch(`${API_URL}/bespoke`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit request');
      }

      await response.json();
      setIsSubmitted(true);
      toast.success("Bespoke request submitted successfully!");
    } catch (error) {
      console.error('Error submitting bespoke request:', error);
      toast.error(error instanceof Error ? error.message : "Failed to submit request. Please try again.");
    }
  };

  const whatsappNumber = "08122815425";
  const whatsappMessage = encodeURIComponent(
    `Hello Fifi Fashion Wears,\n\nI would like to request a bespoke/custom order.\n\nName: ${formData.fullName}\nDescription: ${formData.description}\n\nPlease assist me.`
  );

  if (isSubmitted) {
    return (
      <div className="min-h-screen">
        <Header />
        <CartSidebar />
        <main className="pt-24 md:pt-28">
          <div className="luxury-container py-20">
            <div className="max-w-lg mx-auto text-center">
              <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-gold" />
              </div>
              <h1 className="font-serif text-3xl mb-4">Request Received!</h1>
              <p className="text-muted-foreground mb-8">
                Thank you for your bespoke request. Our team will review your requirements
                and contact you within 24-48 hours to discuss your dream piece.
              </p>
              <Button variant="whatsapp" size="xl" asChild>
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="w-5 h-5" />
                  Chat with Us on WhatsApp
                </a>
              </Button>
            </div>
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
        {/* Hero */}
        <section className="bg-navy text-cream py-16 md:py-24">
          <div className="luxury-container text-center">
            <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-6">
              <Scissors className="w-8 h-8 text-gold" />
            </div>
            <p className="luxury-subheading text-gold mb-3">Custom Made</p>
            <h1 className="font-serif text-4xl md:text-6xl mb-4">
              Bespoke Orders
            </h1>
            <p className="text-cream/80 max-w-2xl mx-auto">
              Create your dream outfit with our bespoke service. We'll work closely with you
              to design and craft a one-of-a-kind piece tailored to your exact specifications.
            </p>
          </div>
        </section>

        {/* Form */}
        <section className="py-16 md:py-20">
          <div className="luxury-container">
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
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
                  <label htmlFor="description" className="block text-sm font-medium mb-2">
                    Describe Your Dream Outfit *
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    placeholder="Tell us about the style, color, occasion, and any specific details you have in mind..."
                    rows={5}
                  />
                </div>

                <div>
                  <label htmlFor="measurements" className="block text-sm font-medium mb-2">
                    Your Measurements (if available)
                  </label>
                  <Textarea
                    id="measurements"
                    name="measurements"
                    value={formData.measurements}
                    onChange={handleInputChange}
                    placeholder="Bust, waist, hips, length, etc. Don't worry if you don't have them – we'll help you!"
                    rows={3}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="budget" className="block text-sm font-medium mb-2">
                      Budget Range
                    </label>
                    <select
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      className="w-full h-12 px-4 rounded-md border border-input bg-background"
                    >
                      <option value="">Select budget range</option>
                      <option value="50000-100000">₦50,000 - ₦100,000</option>
                      <option value="100000-200000">₦100,000 - ₦200,000</option>
                      <option value="200000-500000">₦200,000 - ₦500,000</option>
                      <option value="500000+">₦500,000+</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="deadline" className="block text-sm font-medium mb-2">
                      When Do You Need It?
                    </label>
                    <Input
                      id="deadline"
                      name="deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={handleInputChange}
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button type="submit" variant="luxury" size="xl" className="w-full">
                    Submit Bespoke Request
                  </Button>
                </div>
              </form>

              {/* Alternative CTA */}
              <div className="mt-10 p-6 bg-muted rounded-lg text-center">
                <p className="text-muted-foreground mb-4">
                  Prefer to discuss your ideas directly?
                </p>
                <Button variant="whatsapp" asChild>
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hello Fifi Fashion Wears, I'd like to discuss a bespoke order.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Chat on WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Bespoke;
