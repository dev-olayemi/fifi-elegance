import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Menu, X, Search } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import logo from "@/assets/logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartItems, setIsCartOpen } = useCart();

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "LE LUXE", path: "/shop" },
    { name: "Bespoke", path: "/bespoke" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="luxury-container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 -ml-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img 
              src={logo} 
              alt="Fifi Fashion Wears" 
              className="h-12 md:h-14 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors tracking-wide uppercase"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button className="p-2 hidden md:block" aria-label="Search">
              <Search className="w-5 h-5" />
            </button>
            <button
              className="p-2 relative"
              onClick={() => setIsCartOpen(true)}
              aria-label="Shopping cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-gold text-navy text-xs font-medium flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors tracking-wide uppercase py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
