import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppRedirect from "@/components/WhatsApp/WhatsAppRedirect";
import { Ruler, Info } from "lucide-react";

const SizeGuide = () => {
  const sizeChart = [
    { size: "XS", bust: "32", waist: "24", hip: "34", uk: "6", us: "2" },
    { size: "S", bust: "34", waist: "26", hip: "36", uk: "8", us: "4" },
    { size: "M", bust: "36", waist: "28", hip: "38", uk: "10", us: "6" },
    { size: "L", bust: "38", waist: "30", hip: "40", uk: "12", us: "8" },
    { size: "XL", bust: "40", waist: "32", hip: "42", uk: "14", us: "10" },
  ];

  const measurements = [
    { name: "Bust", description: "Measure around the fullest part of your bust." },
    { name: "Waist", description: "Measure around your natural waistline." },
    { name: "Hip", description: "Measure around the fullest part of your hips." },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="luxury-container">
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">Size Guide</h1>
            <WhatsAppRedirect phone={"08122815425"} defaultMessage={"Hello, I need assistance with size selection for a product."}>
              <a href="#" onClick={(e) => e.preventDefault()} className="text-gold hover:underline">
                Need help choosing a size? Chat with us →
              </a>
            </WhatsAppRedirect>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th className="p-3">Size</th>
                    <th className="p-3">Bust (in)</th>
                    <th className="p-3">Waist (in)</th>
                    <th className="p-3">Hip (in)</th>
                  </tr>
                </thead>
                <tbody>
                  {sizeChart.map((row) => (
                    <tr key={row.size} className="border-t">
                      <td className="p-3 font-semibold">{row.size}</td>
                      <td className="p-3">{row.bust}</td>
                      <td className="p-3">{row.waist}</td>
                      <td className="p-3">{row.hip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <section className="mt-8">
            <h2 className="font-serif text-2xl font-semibold text-primary mb-4 flex items-center gap-2">
              <Ruler className="w-5 h-5 text-gold" /> How to Measure
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {measurements.map((m) => (
                <div key={m.name} className="bg-card p-4 rounded">
                  <h3 className="font-medium">{m.name}</h3>
                  <p className="text-sm text-muted-foreground">{m.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8 text-center">
            <h3 className="font-serif text-xl font-semibold mb-2">Need a Custom Fit?</h3>
            <p className="text-muted-foreground mb-4">Our bespoke service ensures a perfect fit tailored to your exact measurements.</p>
            <div className="flex gap-4 justify-center">
              <a href="/bespoke" className="px-6 py-3 bg-primary text-white rounded">Request Bespoke Order</a>
              <WhatsAppRedirect phone={"08122815425"} defaultMessage={"Hello Fifi Fashion Wears, I need help with my measurements."}>
                <a href="#" onClick={(e) => e.preventDefault()} className="px-6 py-3 bg-green-600 text-white rounded">Get Sizing Help</a>
              </WhatsAppRedirect>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SizeGuide;
