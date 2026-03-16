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
  isCustom: boolean;
  userId?: string;
  categoryId: string;
  categoryName?: string;
  giftBoxComponentConfigId?: string;
  componentConfigName?: string;
  createdAt: string;
  updatedAt?: string;
  images?: ImageResponse[];
  boxComponents?: BoxComponentResponse[];
}

export interface GiftBoxItemRequest {
  productId: string;
  quantity: number;
}

export interface CreateGiftBoxRequest {
  code: string;
  name: string;
  description: string;
  basePrice: number;
  isActive: boolean;
  categoryId: string;
  giftBoxComponentConfigId?: string;
  items: GiftBoxItemRequest[];
  imageUrls: string[];
}

export interface UpdateGiftBoxRequest {
  code: string;
  name: string;
  description: string;
  basePrice: number;
  isActive: boolean;
  categoryId: string;
  giftBoxComponentConfigId?: string;
  items: GiftBoxItemRequest[];
  imageUrls: string[];
}

const giftBoxService = {
  getAll: () => api.get<{ success: boolean; data: GiftBoxResponse[] }>("/GiftBox"),
  getActive: () => api.get<{ success: boolean; data: GiftBoxResponse[] }>("/GiftBox/active"),
  getById: (id: string) => api.get<{ success: boolean; data: GiftBoxResponse }>(`/GiftBox/${id}`),
  getByCategory: (categoryId: string) =>
    api.get<{ success: boolean; data: GiftBoxResponse[] }>(`/GiftBox/category/${categoryId}`),
  getUserGiftBox: () => api.get<{ success: boolean; data: GiftBoxResponse[] }>("/GiftBox/user"),
  create: (data: CreateGiftBoxRequest) =>
    api.post<{ success: boolean; data: GiftBoxResponse }>("/GiftBox", data),
  update: (id: string, data: UpdateGiftBoxRequest) =>
    api.put<{ success: boolean; data: GiftBoxResponse }>(`/GiftBox/${id}`, data),
  delete: (id: string) =>
    api.delete<{ success: boolean }>(`/GiftBox/${id}`),
};

export default giftBoxService;
