import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ArrowRight } from "lucide-react";
function CategoryGrid() {
  const categories = [
    {
      name: "H\u1ED9p Qu\xE0 T\u1EBFt",
      image: "https://images.unsplash.com/photo-1728381031272-ba3f537feadd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBnaWZ0JTIwaGFtcGVyJTIwcmVkJTIwZ29sZHxlbnwxfHx8fDE3NjgwNjIxNjZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      description: "H\u1ED9p qu\xE0 truy\u1EC1n th\u1ED1ng cho T\u1EBFt Nguy\xEAn \u0110\xE1n"
    },
    {
      name: "H\u1ED9p R\u01B0\u1EE3u Vang",
      image: "https://images.unsplash.com/photo-1601573506977-3eb0799f624b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwd2luZSUyMGdpZnQlMjBib3h8ZW58MXx8fHwxNzY4MDYyMTY3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      description: "R\u01B0\u1EE3u vang cao c\u1EA5p v\u1EDBi bao b\xEC sang tr\u1ECDng"
    },
    {
      name: "Qu\xE0 S\u1EE9c Kh\u1ECFe",
      image: "https://images.unsplash.com/photo-1610851296465-9c5a6f8752f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGglMjB3ZWxsbmVzcyUyMGdpZnR8ZW58MXx8fHwxNzY4MDYyMTY4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      description: "B\u1ED9 qu\xE0 t\u1EB7ng ch\u0103m s\xF3c s\u1EE9c kh\u1ECFe"
    }
  ];
  return <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Mua Theo Danh Mục
          </h2>
          <p className="text-xl text-gray-600">
            Khám phá bộ sưu tập quà tặng cao cấp được tuyển chọn
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, index) => <div
    key={index}
    className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
  >
              <div className="aspect-[4/3] overflow-hidden">
                <ImageWithFallback
    src={category.image}
    alt={category.name}
    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
  />
              </div>
              
              {
    /* Overlay */
  }
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-2xl font-serif font-bold text-white mb-2">
                  {category.name}
                </h3>
                <p className="text-white/90 mb-4">
                  {category.description}
                </p>
                <div className="flex items-center text-[#D4AF37] font-semibold group-hover:translate-x-2 transition-transform">
                  Khám phá <ArrowRight className="ml-2 h-5 w-5" />
                </div>
              </div>

              {
    /* Border accent */
  }
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#B71C1C] to-[#D4AF37] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </div>)}
        </div>
      </div>
    </section>;
}
export {
  CategoryGrid
};
