// WhatsApp helper functions
const WHATSAPP_NUMBER = '2348122815425'; // Format: country code + number without +

export const whatsappHelpers = {
  // Contact about a product
  contactAboutProduct: (productName: string, productPrice: number, productUrl: string, customerName?: string, customerPhone?: string) => {
    const message = `Hello Fifi Fashion Wears,

I am interested in this product:
📦 Product: ${productName}
💰 Price: ₦${productPrice.toLocaleString()}
🔗 Link: ${productUrl}

${customerName ? `My Name: ${customerName}` : ''}
${customerPhone ? `My Phone: ${customerPhone}` : ''}

Please assist me with more information.`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  },

  // Contact about an order
  contactAboutOrder: (orderNumber: string, customerName: string) => {
    const message = `Hello Fifi Fashion Wears,

I need help with my order:
📋 Order Number: ${orderNumber}
👤 Name: ${customerName}

Please assist me.`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  },

  // Bespoke inquiry
  bespokeInquiry: (customerName?: string) => {
    const message = `Hello Fifi Fashion Wears,

I am interested in a custom bespoke dress.
${customerName ? `My Name: ${customerName}` : ''}

I would like to discuss my requirements.`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  },

  // General inquiry
  generalInquiry: () => {
    const message = `Hello Fifi Fashion Wears,

I have a question about your products.`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  },

  // Payment confirmation
  paymentConfirmation: (orderNumber: string, amount: number, paymentRef: string) => {
    const message = `Hello Fifi Fashion Wears,

I have made payment for my order:
📋 Order Number: ${orderNumber}
💰 Amount: ₦${amount.toLocaleString()}
🔖 Payment Reference: ${paymentRef}

Please confirm my payment.`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  },
};
