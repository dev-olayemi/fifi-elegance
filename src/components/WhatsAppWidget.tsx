import { MessageCircle } from "lucide-react";

const WhatsAppWidget = () => {
  const rawNumber = "08122815425"; // local-format number
  const defaultMessage = "Hello Fifi Fashion Wears, I need help with an order.";

  const normalizePhone = (num: string) => {
    // convert leading 0 to country code 234 if needed; otherwise use as-is
    if (num.startsWith("+")) return num.replace(/[+]/g, "");
    if (num.startsWith("0")) return `234${num.slice(1)}`;
    return num;
  };

  const openWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    const phone = normalizePhone(rawNumber);
    const encoded = encodeURIComponent(defaultMessage);
    const url = `https://wa.me/${phone}?text=${encoded}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      onClick={openWhatsApp}
      aria-label="Chat with us on WhatsApp"
      title="Chat with us on WhatsApp"
      className="fixed bottom-8 right-4 md:right-8 z-40 w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center animate-pulse hover:animate-none"
    >
      <MessageCircle className="w-6 h-6 md:w-7 md:h-7" />
    </button>
  );
};

export default WhatsAppWidget;
