import React, { useState } from 'react';

interface WhatsAppRedirectProps {
  phone: string; // digits only, e.g. 08122815425
  defaultMessage?: string;
  label?: string;
  className?: string;
  children?: React.ReactNode;
}

const formatPhoneForWa = (phone: string) => {
  // Normalize phone: remove non digits
  const digits = phone.replace(/[^0-9+]/g, '');
  // If starts with 0, convert to international +234 (Nigeria) as fallback
  if (/^0[0-9]+$/.test(digits)) {
    return `+234${digits.slice(1)}`;
  }
  return digits;
};

const WhatsAppRedirect: React.FC<WhatsAppRedirectProps> = ({ phone, defaultMessage = '', label = 'WhatsApp', className = '', children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(defaultMessage);

  const openEditor = (e?: React.MouseEvent) => {
    e?.preventDefault();
    setMessage(defaultMessage);
    setOpen(true);
  };

  const goToWhatsApp = () => {
    const formatted = formatPhoneForWa(phone);
    // Use web.whatsapp.com for desktop, wa.me works universally
    const encoded = encodeURIComponent(message || '');
    const url = `https://wa.me/${formatted.replace(/^\+/, '')}${encoded ? `?text=${encoded}` : ''}`;
    window.open(url, '_blank');
    setOpen(false);
  };

  return (
    <>
      {children ? (
        // If children is a valid React element, clone it and attach onClick to avoid nesting buttons
        React.isValidElement(children) ? (
          (() => {
            const childElement = children as React.ReactElement & {
              props: { onClick?: (e: React.MouseEvent) => void; className?: string };
            };
            return React.cloneElement(childElement, {
              onClick: (e: React.MouseEvent) => {
                if (childElement.props.onClick) childElement.props.onClick(e);
                openEditor(e);
              },
              className: `${childElement.props.className || ''} ${className}`.trim(),
            });
          })()
        ) : (
          <button onClick={openEditor} className={className}>
            {children}
          </button>
        )
      ) : (
        <button onClick={openEditor} className={`whatsapp-button ${className}`}>
          {label}
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="relative max-w-xl w-full bg-card rounded-lg p-4 shadow-lg">
            <h3 className="font-semibold mb-2">Send message on WhatsApp</h3>
            <p className="text-sm text-muted-foreground mb-3">You can edit the message before opening WhatsApp.</p>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full h-32 p-3 border rounded-md bg-transparent resize-none"
            />
            <div className="flex items-center justify-end gap-2 mt-3">
              <button className="px-4 py-2" onClick={() => setOpen(false)}>Cancel</button>
              <button className="px-4 py-2 bg-green-500 text-white rounded" onClick={goToWhatsApp}>Open WhatsApp</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WhatsAppRedirect;
