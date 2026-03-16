import api from "./api";

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  price: number;
  isActive: boolean;
  categoryId: string;
  categoryName?: string;
  images?: Array<{ id: string; url: string; isMain: boolean; sortOrder: number }>;
}

export interface GiftBox {
  id: string;
  code: string;
  name: string;
  description: string;
  basePrice: number;
  isActive: boolean;
  categoryId: string;
  categoryName?: string;
  images?: Array<{ id: string; url: string; isMain: boolean; sortOrder: number }>;
}

export interface CustomBasketProduct {
  productId: string;
  quantity: number;
  imageUrl: string;
}

export interface CreateCustomBasketRequest {
  basketImageUrl: string;
  products: CustomBasketProduct[];
}

export interface ConfirmCustomBasketRequest {
  previewImageUrl: string;
  products: CustomBasketProduct[];
}

const customBasketService = {
  // Lấy tất cả sản phẩm
  async getAllProducts(): Promise<Product[]> {
    const response = await api.get("/Product");
    return response.data.data;
  },

  // Lấy tất cả gift boxes (có thể dùng làm packaging options)
  async getAllGiftBoxes(): Promise<GiftBox[]> {
    const response = await api.get("/GiftBox");
    return response.data.data;
  },

  // Lấy danh sách active gift boxes
  async getActiveGiftBoxes(): Promise<GiftBox[]> {
    const response = await api.get("/GiftBox/active");
    return response.data.data;
  },

  // Tạo custom basket image với AI
  async generateCustomBasketImage(request: CreateCustomBasketRequest): Promise<string> {
    const response = await api.post("/custom-baskets/generate-image", request);
    return response.data.data; // Returns image URL
  },

  // Xác nhận và tạo custom basket
  async confirmCustomBasket(request: ConfirmCustomBasketRequest): Promise<string> {
    const response = await api.post("/custom-baskets/confirm", request);
    return response.data.data; // Returns giftBoxId
  },
};

export default customBasketService;
