import { useEffect, useState } from "react";
import { ChevronRight, Check, X, Plus, ChevronLeft, Sparkles, Minus, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { APP_PAGES } from "@/constants/pages";
import useAuth from "@/hooks/useAuth";
import useCatalog from "@/hooks/useCatalog";
import { useProducts } from "@/hooks/useProduct";
import useCart from "@/hooks/useCart";
import { toast } from "sonner";
import { redirectToLogin } from "@/utils/authRedirect";

interface CustomGiftBuilderProps {
  onNavigate?: (page: string) => void;
}

interface PackagingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface SelectedItem {
  id: string;
  name: string;
  price: number;
  type: "packaging" | "product" | "card" | "accessory";
  quantity?: number;
}

const toPreviewPath = (url: string) => {
  try {
    return new URL(url).pathname;
  } catch {
    return url.startsWith("/") ? url : `/${url}`;
  }
};

export function CustomGiftBuilder({ onNavigate }: CustomGiftBuilderProps) {
  const { generateCustomBasketPreview, confirmCustomBasket } = useCatalog();
  const { isLoggedIn } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPackaging, setSelectedPackaging] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [productQuantities, setProductQuantities] = useState<Record<string, number>>({});
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [generatedGiftImage, setGeneratedGiftImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmedGiftBoxId, setConfirmedGiftBoxId] = useState<string | null>(null);
  const [showConfirmSuccess, setShowConfirmSuccess] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const { addItem } = useCart();
  const { products: apiProducts, loading: productsLoading } = useProducts();
  const api = {
    post: async <T,>(url: string, payload: unknown) => {
      if (url === "/custom-baskets/generate-image") {
        const data = await generateCustomBasketPreview(
          payload as Parameters<typeof generateCustomBasketPreview>[0],
        );
        return {
          data: {
            success: true,
            data,
          },
        } as T;
      }

      if (url === "/custom-baskets/confirm") {
        const data = await confirmCustomBasket(
          payload as Parameters<typeof confirmCustomBasket>[0],
        );
        return {
          data: {
            success: true,
            data,
          },
        } as T;
      }

      throw new Error(`Unsupported endpoint: ${url}`);
    },
  };

  const steps = [
    { number: 1, title: "Chọn Hộp/Giỏ", description: "Choose Packaging" },
    { number: 2, title: "Chọn Vật Phẩm", description: "Select Items" },
    { number: 3, title: "Hoàn Tất", description: "Complete" }
  ];

  const packagingOptions: PackagingOption[] = [
  {
    id: "basket-bich-thuy",
    name: "Giỏ Bích Thủy",
    description: "Azure Blossom Basket",
    price: 0,
    image: "https://res.cloudinary.com/drmpvrzvs/image/upload/v1773484915/gioquamauxanhbien_susk38.png"
  },
  {
    id: "basket-hong-nhung",
    name: "Giỏ Hồng Nhung",
    description: "Crimson Orchid Basket",
    price: 0,
    image: "https://res.cloudinary.com/drmpvrzvs/image/upload/v1773484915/anhgiomaudo_boyork.png"
  },
  {
    id: "basket-lam-ngoc",
    name: "Giỏ Lam Ngọc",
    description: "Royal Navy Basket",
    price: 0,
    image: "https://res.cloudinary.com/drmpvrzvs/image/upload/v1773484912/anhgiomauxanh_x90lbm.png"
  },
  {
    id: "basket-hoang-kim",
    name: "Giỏ Hoàng Kim",
    description: "Golden Elegance Basket",
    price: 0,
    image: "https://res.cloudinary.com/drmpvrzvs/image/upload/v1773476765/anhgiomauvang_jhtkhj.png"
  }
]

  const products: Product[] = apiProducts
    .filter((p) => p.isActive)
    .map((p) => ({
      id: p.id,
      name: p.name,
      price: Number(p.price),
      image:
        p.images?.find((img) => img.isMain)?.url ??
        p.images?.[0]?.url ??
        "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&h=400&fit=crop",
      category: p.categoryName ?? "Sản phẩm",
    }));

  const cards = [
    { id: "card-1", name: "Thiệp Phúc Lộc Thọ", price: 50000 },
    { id: "card-2", name: "Thiệp Tài Lộc", price: 50000 },
    { id: "card-3", name: "Thiệp Xuân An Khang", price: 50000 }
  ];

  const accessories = [
    { id: "acc-1", name: "Ribbon Lụa Đỏ Vàng", price: 30000 },
    { id: "acc-2", name: "Hoa Mai Vàng Trang Trí", price: 80000 },
    { id: "acc-3", name: "Phong Bao Lì Xì", price: 20000 }
  ];

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + ' VNĐ';
  };

  const getSelectedItems = (): SelectedItem[] => {
    const items: SelectedItem[] = [];
    
    if (selectedPackaging) {
      const packaging = packagingOptions.find(p => p.id === selectedPackaging);
      if (packaging) {
        items.push({ id: packaging.id, name: packaging.name, price: packaging.price, type: "packaging" });
      }
    }
    
    selectedProducts.forEach(productId => {
      const product = products.find(p => p.id === productId);
      if (product) {
        const quantity = productQuantities[productId] || 1;
        items.push({ id: product.id, name: product.name, price: product.price, type: "product", quantity });
      }
    });
    
    if (selectedCard) {
      const card = cards.find(c => c.id === selectedCard);
      if (card) {
        items.push({ id: card.id, name: card.name, price: card.price, type: "card" });
      }
    }
    
    selectedAccessories.forEach(accId => {
      const acc = accessories.find(a => a.id === accId);
      if (acc) {
        items.push({ id: acc.id, name: acc.name, price: acc.price, type: "accessory" });
      }
    });
    
    return items;
  };

  const getTotal = () => {
    return getSelectedItems().reduce((sum, item) => {
      const quantity = item.quantity || 1;
      return sum + (item.price * quantity);
    }, 0);
  };

  const handleNextStep = () => {
    if (currentStep === 2 && !isLoggedIn) {
      redirectToLogin(
        onNavigate,
        APP_PAGES.CUSTOM_BUILDER,
        "Vui lòng đăng nhập để tiếp tục sang bước hoàn tất.",
      );
      return;
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      
      // Generate image when entering step 3
      if (currentStep === 2) {
        generateGiftImage();
      }
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleProduct = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
      const newQuantities = { ...productQuantities };
      delete newQuantities[productId];
      setProductQuantities(newQuantities);
    } else {
      setSelectedProducts([...selectedProducts, productId]);
      setProductQuantities({ ...productQuantities, [productId]: 1 });
    }
  };

  const toggleAccessory = (accId: string) => {
    if (selectedAccessories.includes(accId)) {
      setSelectedAccessories(selectedAccessories.filter(id => id !== accId));
    } else {
      setSelectedAccessories([...selectedAccessories, accId]);
    }
  };

  const removeItem = (itemId: string) => {
    if (selectedPackaging === itemId) setSelectedPackaging(null);
    if (selectedProducts.includes(itemId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== itemId));
      const newQuantities = { ...productQuantities };
      delete newQuantities[itemId];
      setProductQuantities(newQuantities);
    }
    if (selectedCard === itemId) setSelectedCard(null);
    if (selectedAccessories.includes(itemId)) setSelectedAccessories(selectedAccessories.filter(id => id !== itemId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    const currentQty = productQuantities[productId] || 1;
    const newQty = Math.max(1, currentQty + delta);
    setProductQuantities({ ...productQuantities, [productId]: newQty });
  };

  const canProceedToNextStep = () => {
    if (currentStep === 1) return selectedPackaging !== null;
    if (currentStep === 2) return selectedProducts.length > 0;
    return true;
  };

  const handleAIAssistant = () => {
    setShowAIAssistant(!showAIAssistant);
  };

  useEffect(() => {
    if (!isLoggedIn && currentStep === 3) {
      setCurrentStep(2);
      setGeneratedGiftImage(null);
      setConfirmedGiftBoxId(null);
      setShowConfirmSuccess(false);
      setIsGeneratingImage(false);
      setIsConfirming(false);
      setIsAddingToCart(false);
    }
  }, [isLoggedIn, currentStep]);

  const generateGiftImage = async () => {
    setIsGeneratingImage(true);
    setGeneratedGiftImage(null);
    setConfirmedGiftBoxId(null);
    setShowConfirmSuccess(false);

    const packaging = packagingOptions.find((p) => p.id === selectedPackaging);
    if (!packaging) {
      setIsGeneratingImage(false);
      return;
    }

    const productItems = selectedProducts
      .map((productId) => {
        const product = products.find((p) => p.id === productId);
        if (!product?.image) return null;
        return {
          productId,
          quantity: productQuantities[productId] || 1,
          imageUrl: product.image,
        };
      })
      .filter(Boolean);

    try {
      const response = await api.post<{ success: boolean; data: string }>(
        "/custom-baskets/generate-image",
        {
          basketImageUrl: packaging.image,
          products: productItems,
        }
      );

      if (response.data.success && response.data.data) {
        setGeneratedGiftImage(response.data.data);
      }
    } catch {
      // generatedGiftImage stays null — UI shows nothing
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleConfirm = async () => {
    if (!generatedGiftImage) return;

    if (!isLoggedIn) {
      redirectToLogin(
        onNavigate,
        APP_PAGES.CUSTOM_BUILDER,
        "Vui lòng đăng nhập để xác nhận giỏ quà của bạn.",
      );
      return;
    }

    setIsConfirming(true);

    // BE validation requires path to start with /images/custom-baskets/temp/
    // So we need to strip the base URL
    const previewImageUrl = toPreviewPath(generatedGiftImage);

    const productItems = selectedProducts
      .map((productId) => {
        const product = products.find((p) => p.id === productId);
        if (!product?.image) return null;
        return {
          productId,
          quantity: productQuantities[productId] || 1,
          imageUrl: product.image,
        };
      })
      .filter(Boolean);

    try {
      const response = await api.post<{ success: boolean; data: string }>(
        "/custom-baskets/confirm",
        {
          previewImageUrl,
          products: productItems,
        }
      );

      if (response.data.success && response.data.data) {
        setConfirmedGiftBoxId(response.data.data);
        setShowConfirmSuccess(true);
      }
    } catch {
      // handle silently
    } finally {
      setIsConfirming(false);
    }
  };

  const handleAddToCart = async () => {
    if (!confirmedGiftBoxId) return;

    if (!isLoggedIn) {
      redirectToLogin(
        onNavigate,
        APP_PAGES.CUSTOM_BUILDER,
        "Vui lòng đăng nhập để thêm giỏ quà vào giỏ hàng.",
      );
      return;
    }

    setIsAddingToCart(true);
    try {
      const result = await addItem({ giftBoxId: confirmedGiftBoxId, quantity: 1 });
      if ((result as any)?.error == null) {
        toast.success("Đã thêm giỏ quà vào giỏ hàng!", {
          description: "Bạn có thể tiếp tục mua sắm hoặc vào giỏ hàng để thanh toán.",
          duration: 4000,
        });
      } else {
        toast.error("Không thể thêm vào giỏ hàng. Vui lòng thử lại!");
      }
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5]">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#B71C1C] to-[#8B1538] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ fontFamily: "'Playfair Display', 'Noto Serif', serif" }}
            >
              Tự Tay Thiết Kế Giỏ Quà Độc Bản
            </h1>
            <p className="text-xl text-white/90">
              Design Your Own Exclusive Gift Set
            </p>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <button onClick={() => onNavigate?.("home")} className="text-gray-600 hover:text-[#B71C1C] transition-colors">
              Trang chủ
            </button>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <button onClick={() => onNavigate?.("listing")} className="text-gray-600 hover:text-[#B71C1C] transition-colors">
              Quà Tết
            </button>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="text-[#B71C1C] font-semibold">Thiết kế giỏ quà</span>
          </nav>
        </div>
      </div>

      {/* Progress Stepper - Redesigned */}
      <div className="bg-white border-b border-gray-100 py-12 shadow-sm">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative flex items-center justify-between">
            {/* Background connector line */}
            <div className="absolute top-8 left-0 right-0 h-0.5 bg-gray-200 -z-10" 
                 style={{ left: '64px', right: '64px' }} />
            
            {/* Active progress line */}
            <div 
              className="absolute top-8 left-0 h-0.5 bg-gradient-to-r from-[#B71C1C] to-[#D4AF37] -z-10 transition-all duration-500"
              style={{ 
                left: '64px', 
                width: `calc(${((currentStep - 1) / (steps.length - 1)) * 100}% - 128px + ${(currentStep - 1) * 128 / (steps.length - 1)}px)`
              }} 
            />
            
            {steps.map((step, index) => {
              const isCompleted = currentStep > step.number;
              const isCurrent = currentStep === step.number;
              const isPending = currentStep < step.number;
              
              return (
                <div key={step.number} className="flex flex-col items-center relative z-10">
                  {/* Circle with icon/number */}
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl transition-all duration-300 ${
                      isCurrent
                        ? "bg-gradient-to-br from-[#D4AF37] to-[#B8941F] text-white shadow-xl shadow-[#D4AF37]/30 scale-110 ring-4 ring-[#D4AF37]/20"
                        : isCompleted
                        ? "bg-[#B71C1C] text-white shadow-lg"
                        : "bg-white border-2 border-gray-300 text-gray-400"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="h-8 w-8" strokeWidth={3} />
                    ) : (
                      <span className="text-2xl">{step.number}</span>
                    )}
                  </div>
                  
                  {/* Label */}
                  <div className="mt-4 text-center max-w-[140px]">
                    <div 
                      className={`font-bold text-base transition-colors ${
                        isCurrent ? "text-[#B71C1C]" : isCompleted ? "text-gray-700" : "text-gray-400"
                      }`}
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{step.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Selection Area (65%) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              {/* AI Assistant Button */}
              <div className="mb-6">
                <Button
                  onClick={handleAIAssistant}
                  variant="outline"
                  className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition-all"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Trợ lý AI gợi ý quà
                </Button>
              </div>

              {/* AI Assistant Panel */}
              {showAIAssistant && (
                <div className="mb-6 p-6 bg-gradient-to-br from-[#FFFDF5] to-white border-2 border-[#D4AF37] rounded-xl shadow-md">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8941F] flex items-center justify-center flex-shrink-0">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-[#B71C1C] mb-2">Trợ lý AI đề xuất</h3>
                      <p className="text-sm text-gray-700 mb-3">
                        Dựa trên xu hướng và sở thích khách hàng, chúng tôi gợi ý những combo quà tặng sau:
                      </p>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                          <span><strong>Combo Sang Trọng:</strong> Hộp Gỗ Sơn Mài + Rượu Vang Đỏ + Hạt Macca</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                          <span><strong>Combo Sức Khỏe:</strong> Giỏ Mây Tre + Mật Ong Rừng + Trà Oolong + Hạt Điều</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                          <span><strong>Combo Tinh Tế:</strong> Hộp Kim Loại Vàng + Trà Sen + Socola Lindt</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1: Choose Packaging */}
              {currentStep === 1 && (
                <div>
                  <h2 
                    className="text-3xl font-bold text-gray-900 mb-3"
                    style={{ fontFamily: "'Playfair Display', 'Noto Serif', serif" }}
                  >
                    Bước 1: Chọn mẫu hộp hoặc giỏ quà của bạn
                  </h2>
                  <p className="text-gray-600 mb-8">Lựa chọn bao bì sang trọng cho giỏ quà của bạn</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {packagingOptions.map((option) => (
                      <div
                        key={option.id}
                        onClick={() => setSelectedPackaging(option.id)}
                        className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 overflow-hidden group ${
                          selectedPackaging === option.id
                            ? "border-[#D4AF37] shadow-xl shadow-[#D4AF37]/20 bg-gradient-to-br from-[#FFFDF5] to-white scale-105"
                            : "border-gray-200 hover:border-[#D4AF37] hover:shadow-lg"
                        }`}
                      >
                        {/* Selected Badge */}
                        {selectedPackaging === option.id && (
                          <div className="absolute top-3 right-3 w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#B8941F] rounded-full flex items-center justify-center shadow-lg z-10">
                            <Check className="h-6 w-6 text-white" strokeWidth={3} />
                          </div>
                        )}
                        
                        {/* Image */}
                        <div className="aspect-square rounded-lg overflow-hidden mb-4 bg-gray-50">
                          <img
                            src={option.image}
                            alt={option.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>
                        
                        {/* Info */}
                        <h3 className="font-bold text-gray-900 mb-1 text-lg">{option.name}</h3>
                        <p className="text-xs text-gray-500 mb-3">{option.description}</p>
                        {option.price > 0 && (
                          <div className="text-xl font-bold text-[#D4AF37]">
                            {formatPrice(option.price)}
                          </div>
                        )}
                        {option.price === 0 && (
                          <Badge className="text-sm bg-green-100 text-green-700 hover:bg-green-100 border-0">
                            Miễn phí
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Choose Products */}
              {currentStep === 2 && (
                <div>
                  <h2 
                    className="text-3xl font-bold text-gray-900 mb-3"
                    style={{ fontFamily: "'Playfair Display', 'Noto Serif', serif" }}
                  >
                    Bước 2: Chọn vật phẩm cho giỏ quà
                  </h2>
                  <p className="text-gray-600 mb-8">Chọn nhiều sản phẩm bạn muốn bỏ vào giỏ quà</p>

                  {productsLoading ? (
                    <div className="flex items-center justify-center py-16">
                      <Loader2 className="h-10 w-10 animate-spin text-[#B71C1C]" />
                    </div>
                  ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => toggleProduct(product.id)}
                        className={`relative border-2 rounded-xl p-3 cursor-pointer transition-all duration-300 group ${
                          selectedProducts.includes(product.id)
                            ? "border-[#D4AF37] shadow-xl shadow-[#D4AF37]/20 bg-gradient-to-br from-[#FFFDF5] to-white"
                            : "border-gray-200 hover:border-[#D4AF37] hover:shadow-md"
                        }`}
                      >
                        {/* Selected Checkmark */}
                        {selectedProducts.includes(product.id) && (
                          <div className="absolute top-2 right-2 w-7 h-7 bg-gradient-to-br from-[#D4AF37] to-[#B8941F] rounded-full flex items-center justify-center z-10 shadow-lg">
                            <Check className="h-4 w-4 text-white" strokeWidth={3} />
                          </div>
                        )}
                        
                        {/* Image */}
                        <div className="aspect-square rounded-lg overflow-hidden mb-3 bg-gray-50">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>
                        
                        {/* Info */}
                        <Badge className="text-xs mb-2 bg-gradient-to-r from-[#B71C1C] to-[#8B1538] text-white hover:from-[#B71C1C] hover:to-[#8B1538] border-0">
                          {product.category}
                        </Badge>
                        <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
                        <div className="text-base font-bold text-[#D4AF37]">
                          {formatPrice(product.price)}
                        </div>
                      </div>
                    ))}
                  </div>
                  )}
                </div>
              )}

              {/* Step 3: Review & Complete */}
              {currentStep === 3 && (
                <div>
                  <h2 
                    className="text-3xl font-bold text-gray-900 mb-3"
                    style={{ fontFamily: "'Playfair Display', 'Noto Serif', serif" }}
                  >
                    Bước 3: Xác nhận giỏ quà của bạn
                  </h2>
                  <p className="text-gray-600 mb-8">Kiểm tra lại giỏ quà trước khi thêm vào giỏ hàng</p>
                  
                  {/* Generated Gift Image */}
                  {isGeneratingImage ? (
                    <div className="bg-gradient-to-br from-[#FFFDF5] to-white rounded-xl p-12 border-2 border-[#D4AF37] shadow-lg">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <Loader2 className="h-16 w-16 text-[#D4AF37] animate-spin" />
                        <div className="text-center">
                          <h3 className="text-xl font-bold text-[#B71C1C] mb-2">
                            Đang tạo ảnh giỏ quà của bạn...
                          </h3>
                          <p className="text-sm text-gray-600">
                            AI đang kết hợp các sản phẩm bạn đã chọn thành một giỏ quà hoàn chỉnh
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : generatedGiftImage ? (
                    <div className="bg-gradient-to-br from-[#FFFDF5] to-white rounded-xl p-6 border-2 border-[#D4AF37] shadow-lg">
                      <div className="mb-4 min-h-[420px] rounded-xl bg-white border border-[#D4AF37]/15 flex items-center justify-center p-4 sm:min-h-[520px]">
                        <img
                          src={generatedGiftImage}
                          alt="Giỏ quà của bạn"
                          className="max-h-[70vh] w-full object-contain"
                        />
                      </div>
                      <div className="text-center mb-6">
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0 mb-2">
                          ✓ Đã tạo ảnh thành công
                        </Badge>
                        <p className="text-sm text-gray-600">
                          Đây là hình ảnh preview giỏ quà độc bản của bạn
                        </p>
                      </div>
                      
                      {/* Total and Checkout */}
                      <div className="pt-6 mt-6 border-t-2 border-[#B71C1C]">
                        <div className="flex items-center justify-between mb-8">
                          <span 
                            className="text-2xl font-bold text-gray-900"
                            style={{ fontFamily: "'Playfair Display', 'Noto Serif', serif" }}
                          >
                            Tổng Cộng:
                          </span>
                          <span className="text-4xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#B8941F] bg-clip-text text-transparent">
                            {formatPrice(getTotal())}
                          </span>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="space-y-3">
                          <Button
                            className="w-full bg-gradient-to-r from-[#B71C1C] to-[#8B1538] hover:from-[#8B1538] hover:to-[#B71C1C] text-white font-bold py-6 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-60"
                            onClick={handleConfirm}
                            disabled={isConfirming || !!confirmedGiftBoxId}
                          >
                            {isConfirming ? (
                              <>
                                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                Đang xác nhận...
                              </>
                            ) : confirmedGiftBoxId ? (
                              <>
                                <Check className="h-5 w-5 mr-2" />
                                Đã xác nhận
                              </>
                            ) : (
                              "Xác nhận giỏ quà của bạn"
                            )}
                          </Button>
                          
                          <Button 
                            variant="outline"
                            className="w-full border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white font-bold py-6 text-lg transition-all duration-300"
                            onClick={generateGiftImage}
                            disabled={isGeneratingImage}
                          >
                            <RefreshCw className={`h-5 w-5 mr-2 ${isGeneratingImage ? 'animate-spin' : ''}`} />
                            Tạo lại
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={handlePrevStep}
                  disabled={currentStep === 1}
                  className="border-2 border-gray-300 hover:border-[#B71C1C] hover:text-[#B71C1C] hover:bg-[#FFFDF5] transition-all disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Quay lại
                </Button>
                
                {currentStep < 3 && (
                  <Button
                    onClick={handleNextStep}
                    disabled={!canProceedToNextStep()}
                    className="bg-gradient-to-r from-[#D4AF37] to-[#B8941F] hover:from-[#B8941F] hover:to-[#D4AF37] text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                  >
                    Tiếp theo: {steps[currentStep]?.title}
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Live Summary (35% - Sticky) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-xl p-6 sticky top-24 border border-gray-100">
              <h3 
                className="text-2xl font-bold text-[#B71C1C] mb-2 flex items-center"
                style={{ fontFamily: "'Playfair Display', 'Noto Serif', serif" }}
              >
                <span className="mr-2">🎁</span>
                Giỏ Quà Của Bạn
              </h3>
              <p className="text-xs text-gray-500 mb-6">Your Hamper</p>
              
              <div className="space-y-3 mb-6 max-h-[400px] overflow-y-auto">
                {getSelectedItems().length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                      <span className="text-4xl">🎁</span>
                    </div>
                    <p className="text-sm font-semibold">Chưa có sản phẩm nào</p>
                    <p className="text-xs mt-1">Hãy bắt đầu chọn hộp quà</p>
                  </div>
                ) : (
                  getSelectedItems().map((item) => (
                    <div key={item.id} className="py-3 px-3 border border-gray-100 rounded-lg hover:border-[#D4AF37] hover:bg-[#FFFDF5] transition-all">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 pr-2">
                          <h4 className="text-sm font-semibold text-gray-900 line-clamp-2">{item.name}</h4>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full p-1 transition-all flex-shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      
                      {/* Quantity controls for products only */}
                      {item.type === "product" && (
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-6 h-6 flex items-center justify-center bg-white rounded hover:bg-[#D4AF37] hover:text-white transition-all"
                              disabled={(item.quantity || 1) <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="text-sm font-semibold min-w-[20px] text-center">
                              {item.quantity || 1}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-6 h-6 flex items-center justify-center bg-white rounded hover:bg-[#D4AF37] hover:text-white transition-all"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <span className="text-sm font-bold text-[#D4AF37]">
                            {formatPrice(item.price * (item.quantity || 1))}
                          </span>
                        </div>
                      )}
                      
                      {/* Price for non-product items (packaging is free) */}
                      {item.type !== "product" && item.price > 0 && (
                        <div className="text-sm font-bold text-[#D4AF37] mt-2">
                          {formatPrice(item.price)}
                        </div>
                      )}
                      
                      {/* Free badge for packaging */}
                      {item.type === "packaging" && (
                        <div className="mt-2">
                          <Badge className="text-xs bg-green-100 text-green-700 hover:bg-green-100 border-0">
                            Miễn phí
                          </Badge>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Cost Calculator */}
              <div className="border-t-2 border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span className="font-semibold text-gray-900">{formatPrice(getTotal())}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <span className="text-lg font-bold text-gray-900">Tổng cộng:</span>
                  <span className="text-2xl font-bold text-[#D4AF37]">{formatPrice(getTotal())}</span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="mt-6">
                <Button
                  className="w-full bg-gradient-to-r from-[#B71C1C] to-[#8B1538] hover:from-[#8B1538] hover:to-[#B71C1C] text-white font-bold py-4 shadow-lg hover:shadow-xl transition-all"
                  disabled={currentStep !== 3 || !confirmedGiftBoxId || isAddingToCart}
                  onClick={handleAddToCart}
                >
                  {isAddingToCart ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin inline" />
                      Đang thêm...
                    </>
                  ) : (
                    "Thêm vào giỏ hàng"
                  )}
                </Button>
                {currentStep === 3 && !confirmedGiftBoxId && (
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Xác nhận giỏ quà trước khi thêm vào giỏ hàng
                  </p>
                )}
                {currentStep !== 3 && (
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Hoàn thành tất cả các bước để tiếp tục
                  </p>
                )}
              </div>

              {/* Progress Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Bước {currentStep}/3</span>
                  <span className="text-[#B71C1C] font-semibold">{Math.round((currentStep / 3) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-gradient-to-r from-[#B71C1C] via-[#D4AF37] to-[#D4AF37] h-2.5 rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${(currentStep / 3) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Success Toast */}
      {showConfirmSuccess && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl shadow-2xl p-5 flex items-start gap-4">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Check className="h-5 w-5 text-white" strokeWidth={3} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-base mb-1">Xác nhận thành công!</h4>
              <p className="text-sm text-white/90">Giỏ quà của bạn đã được tạo. Bạn có thể thêm vào giỏ hàng ngay bây giờ.</p>
            </div>
            <button
              onClick={() => setShowConfirmSuccess(false)}
              className="text-white/70 hover:text-white transition-colors flex-shrink-0 mt-0.5"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
