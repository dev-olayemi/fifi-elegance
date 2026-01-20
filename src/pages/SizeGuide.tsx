import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Ruler, Info } from "lucide-react";

const SizeGuide = () => {
  const sizeChart = [
    { size: "XS", bust: "32", waist: "24", hip: "34", uk: "6", us: "2" },
    { size: "S", bust: "34", waist: "26", hip: "36", uk: "8", us: "4" },
    { size: "M", bust: "36", waist: "28", hip: "38", uk: "10", us: "6" },
    { size: "L", bust: "38", waist: "30", hip: "40", uk: "12", us: "8" },
    { size: "XL", bust: "40", waist: "32", hip: "42", uk: "14", us: "10" },
    { size: "XXL", bust: "42", waist: "34", hip: "44", uk: "16", us: "12" },
  ];

  const measurements = [
    {
      name: "Bust",
      description: "Measure around the fullest part of your bust, keeping the tape horizontal.",
    },
    {
      name: "Waist",
      description: "Measure around your natural waistline, the narrowest part of your torso.",
    },
    {
      name: "Hip",
      description: "Measure around the fullest part of your hips, about 8 inches below your waist.",
    },
    {
      name: "Shoulder Width",
      description: "Measure from the edge of one shoulder to the other across your back.",
    },
    {
      name: "Arm Length",
      description: "Measure from your shoulder point to your wrist with arm slightly bent.",
    },
    {
      name: "Dress Length",
      description: "Measure from your shoulder to where you want the dress to end.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="luxury-container">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">
              Size Guide
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find your perfect fit with our detailed size chart and measurement guide.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-12">
            {/* Size Chart */}
            <section>
              <h2 className="font-serif text-2xl font-semibold text-primary mb-6 text-center">
                Size Chart (in inches)
              </h2>
              <div className="bg-card rounded-xl border border-border overflow-hidden overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead className="bg-secondary">
                    <tr>
                      <th className="p-4 text-left font-serif text-primary">Size</th>
                      <th className="p-4 text-left font-serif text-primary">Bust</th>
                      <th className="p-4 text-left font-serif text-primary">Waist</th>
                      <th className="p-4 text-left font-serif text-primary">Hip</th>
                      <th className="p-4 text-left font-serif text-primary">UK</th>
                      <th className="p-4 text-left font-serif text-primary">US</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizeChart.map((row, index) => (
                      <tr
                        key={index}
                        className="border-t border-border hover:bg-secondary/50 transition-colors"
                      >
                        <td className="p-4 font-semibold text-gold">{row.size}</td>
                        <td className="p-4 text-foreground">{row.bust}"</td>
                        <td className="p-4 text-foreground">{row.waist}"</td>
                        <td className="p-4 text-foreground">{row.hip}"</td>
                        <td className="p-4 text-muted-foreground">{row.uk}</td>
                        <td className="p-4 text-muted-foreground">{row.us}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* How to Measure */}
            <section>
              <h2 className="font-serif text-2xl font-semibold text-primary mb-6 text-center flex items-center justify-center gap-2">
                <Ruler className="w-6 h-6 text-gold" />
                How to Measure
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {measurements.map((item, index) => (
                  <div
                    key={index}
                    className="bg-card rounded-xl border border-border p-5 hover:border-gold/50 transition-colors"
                  >
                    <h3 className="font-serif text-lg font-semibold text-primary mb-2">
                      {item.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Tips */}
            <section className="bg-secondary/30 rounded-xl p-8">
              <h2 className="font-serif text-xl font-semibold text-primary mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-gold" />
                Measurement Tips
              </h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  Use a soft measuring tape for accurate measurements
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  Wear light, fitted clothing or underwear when measuring
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  Keep the tape snug but not tight
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  Have someone help you for more accurate measurements
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  Measure twice to confirm accuracy
                </li>
              </ul>
            </section>

            {/* Bespoke CTA */}
            <section className="text-center bg-gold/10 rounded-xl p-8 border border-gold/20">
              <h2 className="font-serif text-xl font-semibold text-primary mb-3">
                Need a Custom Fit?
              </h2>
              <p className="text-muted-foreground mb-6">
                Our bespoke service ensures a perfect fit tailored to your exact measurements.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/bespoke"
                  className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full hover:bg-primary/90 transition-colors"
                >
                  Request Bespoke Order
                </a>
                <a
                  href="https://wa.me/08122815425?text=Hello%20Fifi%20Fashion%20Wears,%20I%20need%20help%20with%20my%20measurements."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition-colors"
                >
                  Get Sizing Help
                </a>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SizeGuide;
