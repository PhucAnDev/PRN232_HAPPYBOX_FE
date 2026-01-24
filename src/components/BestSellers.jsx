import { ShoppingCart, Star } from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
function BestSellers({ onAddToCart }) {
  const products = [
    {
      id: 1,
      name: "H\u1ED9p Qu\xE0 Ph\xFAc L\u1ED9c Th\u1ECD Cao C\u1EA5p",
      price: "2,500,000",
      rating: 5,
      reviews: 124,
      image: "https://images.unsplash.com/photo-1728381031272-ba3f537feadd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBnaWZ0JTIwaGFtcGVyJTIwcmVkJTIwZ29sZHxlbnwxfHx8fDE3NjgwNjIxNjZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      id: 2,
      name: "H\u1ED9p Qu\xE0 R\u01B0\u1EE3u Vang Ho\xE0ng Gia",
      price: "1,800,000",
      rating: 5,
      reviews: 98,
      image: "https://images.unsplash.com/photo-1601573506977-3eb0799f624b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwd2luZSUyMGdpZnQlMjBib3h8ZW58MXx8fHwxNzY4MDYyMTY3fDA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      id: 3,
      name: "B\u1ED9 S\u01B0u T\u1EADp \u0110\u1EB7c S\u1EA3n Cao C\u1EA5p",
      price: "3,200,000",
      rating: 5,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1761079989144-7ff17e97ef11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwZ2lmdCUyMGhhbXBlcnxlbnwxfHx8fDE3NjgwNjIxNjd8MA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      id: 4,
      name: "Gi\u1ECF Qu\xE0 Sang Tr\u1ECDng",
      price: "2,100,000",
      rating: 4,
      reviews: 87,
      image: "https://images.unsplash.com/photo-1634283715079-d91bbed0ece0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBnaWZ0JTIwYmFza2V0JTIwcmliYm9ufGVufDF8fHx8MTc2ODA2MjE2N3ww&ixlib=rb-4.1.0&q=80&w=1080"
    }
  ];
  return <section className="py-20 bg-[#FFFDF5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Sản Phẩm Bán Chạy
          </h2>
          <p className="text-xl text-gray-600">
            Những món quà được yêu thích nhất
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => <div
    key={product.id}
    className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col"
  >
              {
    /* Product Image */
  }
              <div className="relative aspect-square overflow-hidden">
                <ImageWithFallback
    src={product.image}
    alt={product.name}
    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
  />
                
                {
    /* Quick View Overlay */
  }
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button
    variant="outline"
    className="bg-white text-gray-900 hover:bg-gray-100"
  >
                    Xem nhanh
                  </Button>
                </div>

                {
    /* Badge */
  }
                <div className="absolute top-3 right-3 bg-[#B71C1C] text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Bán chạy
                </div>
              </div>

              {
    /* Product Info */
  }
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
                  {product.name}
                </h3>

                {
    /* Rating */
  }
                <div className="flex items-center mb-3">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => <Star
    key={i}
    className={`h-4 w-4 ${i < product.rating ? "fill-[#D4AF37] text-[#D4AF37]" : "fill-gray-200 text-gray-200"}`}
  />)}
                  </div>
                  <span className="text-sm text-gray-500 ml-2">
                    ({product.reviews})
                  </span>
                </div>

                {
    /* Price */
  }
                <div className="text-2xl font-bold text-[#B71C1C] mb-4">
                  {product.price} ₫
                </div>

                {
    /* Add to Cart Button */
  }
                <Button
    onClick={onAddToCart}
    className="w-full rounded-full font-semibold hover:scale-105 transition-transform mt-auto"
    style={{ backgroundColor: "#D4AF37", color: "white" }}
  >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Thêm vào giỏ
                </Button>
              </div>
            </div>)}
        </div>

        {
    /* View All Button */
  }
        <div className="text-center mt-12">
          <Button
    variant="outline"
    size="lg"
    className="rounded-full px-8 py-6 border-2 border-[#B71C1C] text-[#B71C1C] hover:bg-[#B71C1C] hover:text-white font-semibold"
  >
            Xem Tất Cả Sản Phẩm
          </Button>
        </div>
      </div>
    </section>;
}
export {
  BestSellers
};
