import { Link } from "react-router-dom";
import { Instagram, Mail, Phone, MessageCircle } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const whatsappNumber = "08122815425";
  const whatsappMessage = encodeURIComponent(
    "Hello Fifi Fashion Wears, I would like to make an inquiry."
  );

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="luxury-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-gold flex items-center justify-center">
                <span className="font-serif text-navy font-bold text-xl">FF</span>
              </div>
              <div>
                <h3 className="font-serif text-xl font-semibold">Fifi Fashion</h3>
                <p className="text-xs tracking-[0.2em] uppercase text-primary-foreground/70">
                  Wears
                </p>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Creating elegant, well-tailored outfits that highlight confidence and individuality.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: "Shop LE LUXE", path: "/shop" },
                { name: "Bespoke Orders", path: "/bespoke" },
                { name: "About Us", path: "/about" },
                { name: "Contact", path: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-primary-foreground/70 hover:text-gold transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-serif text-lg mb-6">Customer Service</h4>
            <ul className="space-y-3">
              {[
                { name: "FAQ", path: "/faq" },
                { name: "Shipping Info", path: "/shipping" },
                { name: "Returns", path: "/returns" },
                { name: "Size Guide", path: "/size-guide" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-primary-foreground/70 hover:text-gold transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg mb-6">Get In Touch</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-primary-foreground/70 hover:text-gold transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Us</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+2348122815425"
                  className="flex items-center gap-3 text-sm text-primary-foreground/70 hover:text-gold transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>0812 281 5425</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:fififashionwears@gmail.com"
                  className="flex items-center gap-3 text-sm text-primary-foreground/70 hover:text-gold transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>fififashionwears@gmail.com</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/fifi_fashion_wears1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-primary-foreground/70 hover:text-gold transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                  <span>@fifi_fashion_wears1</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-primary-foreground/50">
            © {currentYear} Fifi Fashion Wears. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              to="/privacy"
              className="text-xs text-primary-foreground/50 hover:text-gold transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-xs text-primary-foreground/50 hover:text-gold transition-colors"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
