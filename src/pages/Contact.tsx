import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartSidebar from "@/components/cart/CartSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MessageCircle, Instagram, MapPin } from "lucide-react";

const Contact = () => {
  const whatsappNumber = "08122815425";

  return (
    <div className="min-h-screen">
      <Header />
      <CartSidebar />
      <main className="pt-24 md:pt-28">
        {/* Hero */}
        <section className="bg-navy text-cream py-16 md:py-24">
          <div className="luxury-container text-center">
            <p className="luxury-subheading text-gold mb-3">Get In Touch</p>
            <h1 className="font-serif text-4xl md:text-6xl mb-4">Contact Us</h1>
            <p className="text-cream/80 max-w-2xl mx-auto">
              We'd love to hear from you. Whether you have a question about our products, 
              orders, or anything else, our team is ready to assist.
            </p>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-16 md:py-20">
          <div className="luxury-container">
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Contact Info */}
              <div>
                <h2 className="font-serif text-3xl mb-8">Reach Out</h2>
                
                <div className="space-y-6">
                  <a
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 p-4 rounded-lg border border-border hover:border-gold transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#25D366]/10 flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-5 h-5 text-[#25D366]" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1 group-hover:text-gold transition-colors">
                        WhatsApp
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Quick responses, usually within minutes
                      </p>
                      <p className="text-sm font-medium mt-1">0812 281 5425</p>
                    </div>
                  </a>

                  <a
                    href="tel:+2348122815425"
                    className="flex items-start gap-4 p-4 rounded-lg border border-border hover:border-gold transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1 group-hover:text-gold transition-colors">
                        Phone
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Call us during business hours
                      </p>
                      <p className="text-sm font-medium mt-1">0812 281 5425</p>
                    </div>
                  </a>

                  <a
                    href="mailto:fififashionwears@gmail.com"
                    className="flex items-start gap-4 p-4 rounded-lg border border-border hover:border-gold transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1 group-hover:text-gold transition-colors">
                        Email
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        For detailed inquiries
                      </p>
                      <p className="text-sm font-medium mt-1">fififashionwears@gmail.com</p>
                    </div>
                  </a>

                  <a
                    href="https://www.instagram.com/fifi_fashion_wears1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 p-4 rounded-lg border border-border hover:border-gold transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <Instagram className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1 group-hover:text-gold transition-colors">
                        Instagram
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Follow us for latest designs
                      </p>
                      <p className="text-sm font-medium mt-1">@fifi_fashion_wears1</p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <h2 className="font-serif text-3xl mb-8">Send a Message</h2>
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Name
                      </label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        className="h-12"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        className="h-12"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      placeholder="How can we help?"
                      className="h-12"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Tell us more..."
                      rows={5}
                    />
                  </div>
                  <Button type="submit" variant="luxury" size="xl" className="w-full">
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
