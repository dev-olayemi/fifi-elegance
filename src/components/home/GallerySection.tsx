import { useState } from "react";
import { ChevronLeft, ChevronRight, X, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

const GallerySection = () => {
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const items = [
    { type: "image", src: "/img1.jpg", alt: "Gallery Image 1" },
    { type: "image", src: "/img2.jpg", alt: "Gallery Image 2" },
    { type: "image", src: "/img3.jpg", alt: "Gallery Image 3" },
    { type: "image", src: "/img4.jpg", alt: "Gallery Image 4" },
    { type: "image", src: "/img5.jpg", alt: "Gallery Image 5" },
    { type: "image", src: "/img6.jpg", alt: "Gallery Image 6" },
    { type: "video", src: "/vid1.mp4", alt: "Gallery Video 1" },
    { type: "video", src: "/fifi.mp4", alt: "Gallery Video - Fifi" },
  ];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  const openLightbox = (index: number) => {
    setSelectedItem(index);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedItem(null);
  };

  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="luxury-container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="luxury-subheading text-gold mb-3">Behind the Brand</p>
          <h2 className="font-serif text-4xl md:text-5xl mb-6">Gallery</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore the elegance and craftsmanship behind Fifi Fashion Wears' exquisite collections.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <div
              key={index}
              onClick={() => openLightbox(index)}
              className="relative group cursor-pointer aspect-square overflow-hidden rounded-lg bg-muted"
            >
              {item.type === "image" ? (
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <>
                  <video
                    src={item.src}
                    preload="metadata"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                    <Play className="w-12 h-12 text-white fill-white" />
                  </div>
                </>
              )}

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <p className="text-cream text-sm">
                  {item.type === "video" ? "Watch Video" : "View Full"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedItem !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Content */}
          <div
            className="relative w-full max-w-4xl aspect-square md:aspect-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {items[currentIndex].type === "image" ? (
              <img
                src={items[currentIndex].src}
                alt={items[currentIndex].alt}
                className="w-full h-full object-contain"
              />
            ) : (
              <video
                src={items[currentIndex].src}
                controls
                autoPlay
                muted
                preload="auto"
                className="w-full h-full object-contain"
              />
            )}

            {/* Navigation Buttons */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevious();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 rounded-full text-white text-sm">
              {currentIndex + 1} / {items.length}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default GallerySection;
