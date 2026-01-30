import { useState } from "react";
import { ChevronRight, Check, X, ChevronLeft } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
function CustomGiftBuilder({ onNavigate }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPackaging, setSelectedPackaging] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedAccessories, setSelectedAccessories] = useState([]);
  const steps = [
    { number: 1, title: "Ch\u1ECDn H\u1ED9p/Gi\u1ECF", description: "Choose Packaging" },
    { number: 2, title: "Ch\u1ECDn V\u1EADt Ph\u1EA9m", description: "Select Items" },
    { number: 3, title: "Thi\u1EC7p & Ph\u1EE5 Ki\u1EC7n", description: "Card & Accessories" },
    { number: 4, title: "Ho\xE0n T\u1EA5t", description: "Complete" }
  ];
  const packagingOptions = [
    {
      id: "leather-red",
      name: "H\u1ED9p Da Cao C\u1EA5p - M\xE0u \u0110\u1ECF",
      description: "Premium Leather Box",
      price: 3e5,
      image: "https://images.unsplash.com/photo-1621879675198-cbfcead7fe6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600"
    },
    {
      id: "wood-lacquer",
      name: "H\u1ED9p G\u1ED7 S\u01A1n M\xE0i",
      description: "Lacquer Wood Box",
      price: 45e4,
      image: "https://images.unsplash.com/photo-1752562454741-c38173658503?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600"
    },
    {
      id: "bamboo-basket",
      name: "Gi\u1ECF M\xE2y Tre \u0110an",
      description: "Bamboo Basket",
      price: 15e4,
      image: "https://images.unsplash.com/photo-1632465583802-8d805f9cc46c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600"
    },
    {
      id: "luxury-gold",
      name: "H\u1ED9p Kim Lo\u1EA1i V\xE0ng \u0110\u1ED3ng",
      description: "Gold Metal Box",
      price: 38e4,
      image: "https://images.unsplash.com/photo-1602177719868-98d27643bf99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600"
    }
  ];
  const products = [
    { id: "wine-1", name: "R\u01B0\u1EE3u Vang \u0110\u1ECF Cabernet", price: 85e4, image: "https://images.unsplash.com/photo-1610631787813-9eeb1a2386cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600", category: "R\u01B0\u1EE3u Vang" },
    { id: "nuts-1", name: "H\u1EA1t Macca \xDAc (500g)", price: 25e4, image: "https://images.unsplash.com/photo-1670941949362-4cd2b509158f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600", category: "H\u1EA1t" },
    { id: "tea-1", name: "Tr\xE0 Oolong Cao C\u1EA5p", price: 3e5, image: "https://images.unsplash.com/photo-1765153743376-6a87b3c3288b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600", category: "Tr\xE0" },
    { id: "chocolate-1", name: "Socola Lindt Excellence", price: 18e4, image: "https://images.unsplash.com/photo-1767510533183-425731f088a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600", category: "B\xE1nh K\u1EB9o" },
    { id: "wine-2", name: "R\u01B0\u1EE3u Vang Tr\u1EAFng Chardonnay", price: 92e4, image: "https://images.unsplash.com/photo-1534409385199-b60aa1bcffa0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600", category: "R\u01B0\u1EE3u Vang" },
    { id: "nuts-2", name: "H\u1EA1t \u0110i\u1EC1u Rang (500g)", price: 19e4, image: "https://images.unsplash.com/photo-1594900689460-fdad3599342c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600", category: "H\u1EA1t" },
    { id: "honey-1", name: "M\u1EADt Ong R\u1EEBng Organic", price: 28e4, image: "https://images.unsplash.com/photo-1645549826194-1956802d83c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600", category: "M\u1EE9t" },
    { id: "tea-2", name: "Tr\xE0 Sen H\u1ED3 T\xE2y", price: 38e4, image: "https://images.unsplash.com/photo-1765153743376-6a87b3c3288b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600", category: "Tr\xE0" }
  ];
  const cards = [
    { id: "card-1", name: "Thi\u1EC7p Ph\xFAc L\u1ED9c Th\u1ECD", price: 5e4 },
    { id: "card-2", name: "Thi\u1EC7p T\xE0i L\u1ED9c", price: 5e4 },
    { id: "card-3", name: "Thi\u1EC7p Xu\xE2n An Khang", price: 5e4 }
  ];
  const accessories = [
    { id: "acc-1", name: "Ribbon L\u1EE5a \u0110\u1ECF V\xE0ng", price: 3e4 },
    { id: "acc-2", name: "Hoa Mai V\xE0ng Trang Tr\xED", price: 8e4 },
    { id: "acc-3", name: "Phong Bao L\xEC X\xEC", price: 2e4 }
  ];
  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN") + " VN\u0110";
  };
  const getSelectedItems = () => {
    const items = [];
    if (selectedPackaging) {
      const packaging = packagingOptions.find((p) => p.id === selectedPackaging);
      if (packaging) {
        items.push({ id: packaging.id, name: packaging.name, price: packaging.price, type: "packaging" });
      }
    }
    selectedProducts.forEach((productId) => {
      const product = products.find((p) => p.id === productId);
      if (product) {
        items.push({ id: product.id, name: product.name, price: product.price, type: "product" });
      }
    });
    if (selectedCard) {
      const card = cards.find((c) => c.id === selectedCard);
      if (card) {
        items.push({ id: card.id, name: card.name, price: card.price, type: "card" });
      }
    }
    selectedAccessories.forEach((accId) => {
      const acc = accessories.find((a) => a.id === accId);
      if (acc) {
        items.push({ id: acc.id, name: acc.name, price: acc.price, type: "accessory" });
      }
    });
    return items;
  };
  const getTotal = () => {
    return getSelectedItems().reduce((sum, item) => sum + item.price, 0);
  };
  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const toggleProduct = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };
  const toggleAccessory = (accId) => {
    if (selectedAccessories.includes(accId)) {
      setSelectedAccessories(selectedAccessories.filter((id) => id !== accId));
    } else {
      setSelectedAccessories([...selectedAccessories, accId]);
    }
  };
  const removeItem = (itemId) => {
    if (selectedPackaging === itemId) setSelectedPackaging(null);
    if (selectedProducts.includes(itemId)) setSelectedProducts(selectedProducts.filter((id) => id !== itemId));
    if (selectedCard === itemId) setSelectedCard(null);
    if (selectedAccessories.includes(itemId)) setSelectedAccessories(selectedAccessories.filter((id) => id !== itemId));
  };
  const canProceedToNextStep = () => {
    if (currentStep === 1) return selectedPackaging !== null;
    if (currentStep === 2) return selectedProducts.length > 0;
    return true;
  };
  return <div className="min-h-screen bg-[#FFFDF5]">
      {
    /* Page Header */
  }
      <div className="bg-gradient-to-r from-[#B71C1C] to-[#8B1538] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1
    className="text-4xl md:text-5xl font-bold mb-4"
    style={{ fontFamily: "'Playfair Display', serif" }}
  >
              Tự Tay Thiết Kế Giỏ Quà Độc Bản
            </h1>
            <p className="text-xl text-white/90">
              Design Your Own Exclusive Gift Set
            </p>
          </div>
        </div>
      </div>

      {
    /* Breadcrumb */
  }
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

      {
    /* Progress Stepper */
  }
      <div className="bg-white border-b border-gray-200 py-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  {
    /* Circle */
  }
                  <div
    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${currentStep === step.number ? "bg-[#D4AF37] text-white shadow-lg scale-110" : currentStep > step.number ? "bg-[#B71C1C] text-white" : "bg-gray-300 text-gray-600"}`}
  >
                    {currentStep > step.number ? <Check className="h-6 w-6" /> : step.number}
                  </div>
                  {
    /* Label */
  }
                  <div className="mt-2 text-center">
                    <div className={`font-semibold text-sm ${currentStep === step.number ? "text-[#B71C1C]" : "text-gray-600"}`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">{step.description}</div>
                  </div>
                </div>
                {
    /* Connector Line */
  }
                {index < steps.length - 1 && <div className={`h-1 flex-1 mx-4 mt-[-50px] ${currentStep > step.number ? "bg-[#B71C1C]" : "bg-gray-300"}`} />}
              </div>)}
          </div>
        </div>
      </div>

      {
    /* Main Content */
  }
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {
    /* Left Column - Selection Area (65%) */
  }
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              {
    /* Step 1: Choose Packaging */
  }
              {currentStep === 1 && <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Bước 1: Chọn mẫu hộp hoặc giỏ quà của bạn
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {packagingOptions.map((option) => <div
    key={option.id}
    onClick={() => setSelectedPackaging(option.id)}
    className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${selectedPackaging === option.id ? "border-[#D4AF37] shadow-lg bg-[#FFFDF5]" : "border-gray-200 hover:border-[#B71C1C] hover:shadow-md"}`}
  >
                        {
    /* Selected Checkmark */
  }
                        {selectedPackaging === option.id && <div className="absolute top-2 right-2 w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center">
                            <Check className="h-5 w-5 text-white" />
                          </div>}
                        
                        {
    /* Image */
  }
                        <div className="aspect-square rounded-lg overflow-hidden mb-4 bg-gray-100">
                          <img
    src={option.image}
    alt={option.name}
    className="w-full h-full object-cover"
  />
                        </div>
                        
                        {
    /* Info */
  }
                        <h3 className="font-bold text-gray-900 mb-1">{option.name}</h3>
                        <p className="text-xs text-gray-500 mb-2">{option.description}</p>
                        <div className="text-xl font-bold text-[#D4AF37]">
                          {formatPrice(option.price)}
                        </div>
                      </div>)}
                  </div>
                </div>}

              {
    /* Step 2: Choose Products */
  }
              {currentStep === 2 && <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Bước 2: Chọn vật phẩm cho giỏ quà
                  </h2>
                  <p className="text-gray-600 mb-6">Chọn nhiều sản phẩm bạn muốn bỏ vào giỏ quà</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {products.map((product) => <div
    key={product.id}
    onClick={() => toggleProduct(product.id)}
    className={`relative border-2 rounded-lg p-3 cursor-pointer transition-all ${selectedProducts.includes(product.id) ? "border-[#D4AF37] shadow-lg bg-[#FFFDF5]" : "border-gray-200 hover:border-[#B71C1C] hover:shadow-md"}`}
  >
                        {
    /* Selected Checkmark */
  }
                        {selectedProducts.includes(product.id) && <div className="absolute top-2 right-2 w-6 h-6 bg-[#D4AF37] rounded-full flex items-center justify-center z-10">
                            <Check className="h-4 w-4 text-white" />
                          </div>}
                        
                        {
    /* Image */
  }
                        <div className="aspect-square rounded-lg overflow-hidden mb-3 bg-gray-50">
                          <img
    src={product.image}
    alt={product.name}
    className="w-full h-full object-cover"
  />
                        </div>
                        
                        {
    /* Info */
  }
                        <Badge className="text-xs mb-2 bg-gray-200 text-gray-700 hover:bg-gray-200">
                          {product.category}
                        </Badge>
                        <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
                        <div className="text-lg font-bold text-[#D4AF37]">
                          {formatPrice(product.price)}
                        </div>
                      </div>)}
                  </div>
                </div>}

              {
    /* Step 3: Card & Accessories */
  }
              {currentStep === 3 && <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Bước 3: Chọn thiệp và phụ kiện
                    </h2>
                    
                    {
    /* Cards */
  }
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Thiệp Chúc Tết</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                      {cards.map((card) => <div
    key={card.id}
    onClick={() => setSelectedCard(card.id)}
    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${selectedCard === card.id ? "border-[#D4AF37] shadow-lg bg-[#FFFDF5]" : "border-gray-200 hover:border-[#B71C1C] hover:shadow-md"}`}
  >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-900">{card.name}</h4>
                              <div className="text-sm font-bold text-[#D4AF37] mt-1">
                                {formatPrice(card.price)}
                              </div>
                            </div>
                            {selectedCard === card.id && <div className="w-6 h-6 bg-[#D4AF37] rounded-full flex items-center justify-center">
                                <Check className="h-4 w-4 text-white" />
                              </div>}
                          </div>
                        </div>)}
                    </div>

                    {
    /* Accessories */
  }
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Phụ Kiện Trang Trí</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {accessories.map((acc) => <div
    key={acc.id}
    onClick={() => toggleAccessory(acc.id)}
    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${selectedAccessories.includes(acc.id) ? "border-[#D4AF37] shadow-lg bg-[#FFFDF5]" : "border-gray-200 hover:border-[#B71C1C] hover:shadow-md"}`}
  >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-900">{acc.name}</h4>
                              <div className="text-sm font-bold text-[#D4AF37] mt-1">
                                {formatPrice(acc.price)}
                              </div>
                            </div>
                            {selectedAccessories.includes(acc.id) && <div className="w-6 h-6 bg-[#D4AF37] rounded-full flex items-center justify-center">
                                <Check className="h-4 w-4 text-white" />
                              </div>}
                          </div>
                        </div>)}
                    </div>
                  </div>
                </div>}

              {
    /* Step 4: Review & Complete */
  }
              {currentStep === 4 && <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Bước 4: Xác nhận giỏ quà của bạn
                  </h2>
                  <div className="bg-[#FFFDF5] rounded-lg p-6 border-2 border-[#D4AF37]">
                    <div className="space-y-4">
                      {getSelectedItems().map((item) => <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
                          <div>
                            <h4 className="font-semibold text-gray-900">{item.name}</h4>
                            <Badge className="text-xs mt-1">
                              {item.type === "packaging" ? "Bao b\xEC" : item.type === "product" ? "S\u1EA3n ph\u1EA9m" : item.type === "card" ? "Thi\u1EC7p" : "Ph\u1EE5 ki\u1EC7n"}
                            </Badge>
                          </div>
                          <div className="font-bold text-[#D4AF37]">
                            {formatPrice(item.price)}
                          </div>
                        </div>)}
                      
                      <div className="pt-4 border-t-2 border-[#B71C1C]">
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-gray-900">Tổng Cộng:</span>
                          <span className="text-3xl font-bold text-[#D4AF37]">
                            {formatPrice(getTotal())}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-gray-300">
                      <Button
    className="w-full bg-[#B71C1C] hover:bg-[#8B1538] text-white font-bold py-4 text-lg"
    onClick={() => onNavigate?.("checkout")}
  >
                        Thêm vào giỏ hàng & Thanh toán
                      </Button>
                    </div>
                  </div>
                </div>}

              {
    /* Navigation Buttons */
  }
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                <Button
    variant="outline"
    onClick={handlePrevStep}
    disabled={currentStep === 1}
    className="border-gray-300 hover:border-[#B71C1C] hover:text-[#B71C1C]"
  >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Quay lại
                </Button>
                
                {currentStep < 4 && <Button
    onClick={handleNextStep}
    disabled={!canProceedToNextStep()}
    className="bg-[#D4AF37] hover:bg-[#B8941F] text-white font-bold"
  >
                    Tiếp theo: {steps[currentStep]?.title}
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>}
              </div>
            </div>
          </div>

          {
    /* Right Column - Live Summary (35% - Sticky) */
  }
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold text-[#B71C1C] mb-4 flex items-center">
                <span className="mr-2">🎁</span>
                Giỏ Quà Của Bạn
              </h3>
              <p className="text-xs text-gray-500 mb-4">Your Hamper</p>
              
              <div className="space-y-3 mb-6">
                {getSelectedItems().length === 0 ? <div className="text-center py-8 text-gray-400">
                    <p className="text-sm">Chưa có sản phẩm nào</p>
                    <p className="text-xs mt-1">Hãy bắt đầu chọn hộp quà</p>
                  </div> : getSelectedItems().map((item) => <div key={item.id} className="flex items-start justify-between py-2 border-b border-gray-100">
                      <div className="flex-1 pr-2">
                        <h4 className="text-sm font-semibold text-gray-900 line-clamp-2">{item.name}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#D4AF37] whitespace-nowrap">
                          {formatPrice(item.price)}
                        </span>
                        <button
    onClick={() => removeItem(item.id)}
    className="text-red-500 hover:text-red-700 transition-colors"
  >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>)}
              </div>

              {
    /* Cost Calculator */
  }
              <div className="border-t-2 border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span className="font-semibold text-gray-900">{formatPrice(getTotal())}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="text-lg font-bold text-gray-900">Tổng cộng:</span>
                  <span className="text-2xl font-bold text-[#D4AF37]">{formatPrice(getTotal())}</span>
                </div>
              </div>

              {
    /* Add to Cart Button */
  }
              <div className="mt-6">
                <Button
    className="w-full bg-[#B71C1C] hover:bg-[#8B1538] text-white font-bold py-3"
    disabled={currentStep !== 4 || getSelectedItems().length === 0}
    onClick={() => onNavigate?.("checkout")}
  >
                  Thêm vào giỏ hàng
                </Button>
                {currentStep !== 4 && <p className="text-xs text-gray-500 text-center mt-2">
                    Hoàn thành tất cả các bước để tiếp tục
                  </p>}
              </div>

              {
    /* Progress Info */
  }
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Bước {currentStep}/4</span>
                  <span className="text-[#B71C1C] font-semibold">{Math.round(currentStep / 4 * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
    className="bg-gradient-to-r from-[#B71C1C] to-[#D4AF37] h-2 rounded-full transition-all duration-300"
    style={{ width: `${currentStep / 4 * 100}%` }}
  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
}
export {
  CustomGiftBuilder
};

