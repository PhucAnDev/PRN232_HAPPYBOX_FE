import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState } from "react";
function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      image: "https://images.unsplash.com/photo-1728381031272-ba3f537feadd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBnaWZ0JTIwaGFtcGVyJTIwcmVkJTIwZ29sZHxlbnwxfHx8fDE3NjgwNjIxNjZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "H\u1ED9p Qu\xE0 T\u1EBFt Cao C\u1EA5p",
      subtitle: "B\u1ED9 s\u01B0u t\u1EADp Ph\xFAc L\u1ED9c Th\u1ECD 2026"
    },
    {
      image: "https://images.unsplash.com/photo-1634283715079-d91bbed0ece0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBnaWZ0JTIwYmFza2V0JTIwcmliYm9ufGVufDF8fHx8MTc2ODA2MjE2N3ww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "B\u1ED9 S\u01B0u T\u1EADp Qu\xE0 T\u1EB7ng Sang Tr\u1ECDng",
      subtitle: "Ho\xE0n h\u1EA3o cho Qu\xE0 T\u1EB7ng Doanh Nghi\u1EC7p"
    }
  ];
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };
  return <section className="relative h-[600px] bg-gradient-to-r from-[#B71C1C] to-[#8B0000] overflow-hidden">
      {
    /* Background Image */
  }
      <div className="absolute inset-0">
        <ImageWithFallback
    src={slides[currentSlide].image}
    alt="Hero Banner"
    className="w-full h-full object-cover opacity-40"
  />
        <div className="absolute inset-0 bg-gradient-to-r from-[#B71C1C]/80 to-transparent" />
      </div>

      {
    /* Content */
  }
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="max-w-2xl text-white">
          <div className="inline-block bg-[#D4AF37] text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
            TẾT 2026
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold mb-4 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            {slides[currentSlide].title}
          </h2>
          
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            {slides[currentSlide].subtitle}
          </p>
          
          <div className="flex items-center space-x-4">
            <Button
    size="lg"
    className="rounded-full text-lg px-8 py-6 font-semibold hover:scale-105 transition-transform"
    style={{ backgroundColor: "#D4AF37", color: "white" }}
  >
              Mua ngay
            </Button>
            <Button
    size="lg"
    variant="outline"
    className="rounded-full text-lg px-8 py-6 font-semibold border-2 border-white bg-white text-[#B71C1C] hover:bg-white/90 hover:text-[#B71C1C]"
  >
              Xem Bộ sưu tập
            </Button>
          </div>
        </div>
      </div>

      {
    /* Navigation Arrows */
  }
      <button
    onClick={prevSlide}
    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full p-3 transition-all"
  >
        <ChevronLeft className="h-6 w-6 text-white" />
      </button>
      <button
    onClick={nextSlide}
    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full p-3 transition-all"
  >
        <ChevronRight className="h-6 w-6 text-white" />
      </button>

      {
    /* Slide Indicators */
  }
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {slides.map((_, index) => <button
    key={index}
    onClick={() => setCurrentSlide(index)}
    className={`h-2 rounded-full transition-all ${index === currentSlide ? "w-8 bg-[#D4AF37]" : "w-2 bg-white/50"}`}
  />)}
      </div>
    </section>;
}
export {
  HeroSection
};
