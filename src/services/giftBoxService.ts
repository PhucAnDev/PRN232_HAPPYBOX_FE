import api from "./api";

export interface ImageResponse {
  id: string;
  url: string;
  isMain: boolean;
}

export interface BoxComponentResponse {
  id: string;
  giftBoxId: string;
  productId: string;
  productName?: string;
  productSKU?: string;
  productPrice: number;
  quantity: number;
}

export interface GiftBoxResponse {
  id: string;
  code: string;
  name: string;
  description: string;
  basePrice: number;
  isActive: boolean;
  categoryId: string;
  categoryName?: string;
  giftBoxComponentConfigId?: string;
  componentConfigName?: string;
  createdAt: string;
  updatedAt?: string;
  images?: ImageResponse[];
  boxComponents?: BoxComponentResponse[];
}

const giftBoxService = {
  getAll: () => api.get<{ success: boolean; data: GiftBoxResponse[] }>("/GiftBox"),
  getActive: () => api.get<{ success: boolean; data: GiftBoxResponse[] }>("/GiftBox/active"),
  getById: (id: string) => api.get<{ success: boolean; data: GiftBoxResponse }>(`/GiftBox/${id}`),
  getByCategory: (categoryId: string) =>
    api.get<{ success: boolean; data: GiftBoxResponse[] }>(`/GiftBox/category/${categoryId}`),
};

export default giftBoxService;
