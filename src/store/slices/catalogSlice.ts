import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_BASE_URL } from "../../constants/env";
import categoryService, {
  CategoryResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "../../services/categoryService";
import customBasketService, {
  ConfirmCustomBasketRequest,
  CreateCustomBasketRequest,
  GenerateExclusiveDetailsRequest,
} from "../../services/customBasketService";
import giftBoxService, {
  CreateGiftBoxRequest,
  GiftBoxResponse,
  UpdateGiftBoxRequest,
} from "../../services/giftBoxService";
import imageService, {
  CreateImageRequest,
  ImageResponse,
} from "../../services/imageService";
import inventoryService, {
  CreateInventoryRequest,
  InventoryResponse,
  UpdateInventoryRequest,
} from "../../services/inventoryService";
import productService, {
  CreateProductRequest,
  ProductResponse,
  UpdateProductRequest,
} from "../../services/productService";
import uploadService from "../../services/uploadService";
import { getErrorMessage } from "../../utils/errorMessage";

interface ProductWithDeps {
  product: ProductResponse;
  images: ImageResponse[];
  inventory: InventoryResponse | null;
}

interface CatalogState {
  products: ProductResponse[];
  categories: CategoryResponse[];
  giftBoxes: GiftBoxResponse[];
  activeGiftBoxes: GiftBoxResponse[];
  userGiftBoxes: GiftBoxResponse[];
  productDetailsById: Record<string, ProductResponse>;
  giftBoxDetailsById: Record<string, GiftBoxResponse>;
  productImagesByProductId: Record<string, ImageResponse[]>;
  inventoriesByProductId: Record<string, InventoryResponse | null>;
  uploadedImageUrls: string[];
  customBasketPreviewUrl: string | null;
  customBasketGiftBoxId: string | null;
  loading: boolean;
  uploadLoading: boolean;
  customBasketLoading: boolean;
  error: string | null;
  uploadError: string | null;
  customBasketError: string | null;
}

const initialState: CatalogState = {
  products: [],
  categories: [],
  giftBoxes: [],
  activeGiftBoxes: [],
  userGiftBoxes: [],
  productDetailsById: {},
  giftBoxDetailsById: {},
  productImagesByProductId: {},
  inventoriesByProductId: {},
  uploadedImageUrls: [],
  customBasketPreviewUrl: null,
  customBasketGiftBoxId: null,
  loading: false,
  uploadLoading: false,
  customBasketLoading: false,
  error: null,
  uploadError: null,
  customBasketError: null,
};

const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

const mergeProductImages = (
  product: ProductResponse,
  images: ImageResponse[],
): ProductResponse => ({
  ...product,
  images,
});

const normalizePreviewUrl = (url: string) =>
  url.startsWith("/") ? `${API_ORIGIN}${url}` : url;

const fetchProductDependencies = async (
  product: ProductResponse,
): Promise<ProductWithDeps> => {
  const [imagesResponse, inventoryResponse] = await Promise.all([
    imageService.getByProduct(product.id).catch(() => null),
    inventoryService.getByProductId(product.id).catch(() => null),
  ]);

  const images =
    imagesResponse?.data?.success && Array.isArray(imagesResponse.data.data)
      ? imagesResponse.data.data
      : [];

  const inventory =
    inventoryResponse?.data?.success && inventoryResponse.data.data
      ? inventoryResponse.data.data
      : null;

  return {
    product: mergeProductImages(product, images),
    images,
    inventory,
  };
};

export const fetchProductsCatalog = createAsyncThunk(
  "catalog/fetchProductsCatalog",
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.getAll();
      return await Promise.all(
        response.data.data.map((product) => fetchProductDependencies(product)),
      );
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Khong the tai danh sach san pham"),
      );
    }
  },
);

export const fetchProductDetail = createAsyncThunk(
  "catalog/fetchProductDetail",
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await productService.getById(productId);
      return await fetchProductDependencies(response.data.data);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Khong the tai chi tiet san pham"),
      );
    }
  },
);

export const createProductEntity = createAsyncThunk(
  "catalog/createProductEntity",
  async (payload: CreateProductRequest, { rejectWithValue }) => {
    try {
      const response = await productService.create(payload);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Khong the tao san pham"));
    }
  },
);

export const updateProductEntity = createAsyncThunk(
  "catalog/updateProductEntity",
  async (
    payload: { id: string; data: UpdateProductRequest },
    { rejectWithValue },
  ) => {
    try {
      const response = await productService.update(payload.id, payload.data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Khong the cap nhat san pham"),
      );
    }
  },
);

export const deleteProductEntity = createAsyncThunk(
  "catalog/deleteProductEntity",
  async (productId: string, { rejectWithValue }) => {
    try {
      await productService.delete(productId);
      return productId;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Khong the xoa san pham"));
    }
  },
);

export const fetchCategories = createAsyncThunk(
  "catalog/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await categoryService.getAll();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Khong the tai danh muc"));
    }
  },
);

export const createCategoryEntity = createAsyncThunk(
  "catalog/createCategoryEntity",
  async (payload: CreateCategoryRequest, { rejectWithValue }) => {
    try {
      const response = await categoryService.create(payload);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Khong the tao danh muc"));
    }
  },
);

export const updateCategoryEntity = createAsyncThunk(
  "catalog/updateCategoryEntity",
  async (
    payload: { id: string; data: UpdateCategoryRequest },
    { rejectWithValue },
  ) => {
    try {
      const response = await categoryService.update(payload.id, payload.data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Khong the cap nhat danh muc"),
      );
    }
  },
);

export const deleteCategoryEntity = createAsyncThunk(
  "catalog/deleteCategoryEntity",
  async (categoryId: string, { rejectWithValue }) => {
    try {
      await categoryService.delete(categoryId);
      return categoryId;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Khong the xoa danh muc"));
    }
  },
);

export const fetchGiftBoxes = createAsyncThunk(
  "catalog/fetchGiftBoxes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await giftBoxService.getAll();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Khong the tai danh sach gio qua"),
      );
    }
  },
);

export const fetchActiveGiftBoxes = createAsyncThunk(
  "catalog/fetchActiveGiftBoxes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await giftBoxService.getActive();
      return response.data.data.filter((giftBox) => !giftBox.isCustom);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Khong the tai gio qua dang ban"),
      );
    }
  },
);

export const fetchUserGiftBoxes = createAsyncThunk(
  "catalog/fetchUserGiftBoxes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await giftBoxService.getUserGiftBox();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Khong the tai gio qua cua nguoi dung"),
      );
    }
  },
);

export const fetchGiftBoxDetail = createAsyncThunk(
  "catalog/fetchGiftBoxDetail",
  async (giftBoxId: string, { rejectWithValue }) => {
    try {
      const response = await giftBoxService.getById(giftBoxId);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Khong the tai chi tiet gio qua"),
      );
    }
  },
);

export const createGiftBoxEntity = createAsyncThunk(
  "catalog/createGiftBoxEntity",
  async (payload: CreateGiftBoxRequest, { rejectWithValue }) => {
    try {
      const response = await giftBoxService.create(payload);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Khong the tao gio qua"));
    }
  },
);

export const updateGiftBoxEntity = createAsyncThunk(
  "catalog/updateGiftBoxEntity",
  async (
    payload: { id: string; data: UpdateGiftBoxRequest },
    { rejectWithValue },
  ) => {
    try {
      const response = await giftBoxService.update(payload.id, payload.data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Khong the cap nhat gio qua"),
      );
    }
  },
);

export const deleteGiftBoxEntity = createAsyncThunk(
  "catalog/deleteGiftBoxEntity",
  async (giftBoxId: string, { rejectWithValue }) => {
    try {
      await giftBoxService.delete(giftBoxId);
      return giftBoxId;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Khong the xoa gio qua"));
    }
  },
);

export const fetchProductImages = createAsyncThunk(
  "catalog/fetchProductImages",
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await imageService.getByProduct(productId);
      return {
        productId,
        images: response.data.data,
      };
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Khong the tai hinh anh san pham"),
      );
    }
  },
);

export const createImageEntity = createAsyncThunk(
  "catalog/createImageEntity",
  async (payload: CreateImageRequest, { rejectWithValue }) => {
    try {
      const response = await imageService.create(payload);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Khong the tao hinh anh"));
    }
  },
);

export const deleteImageEntity = createAsyncThunk(
  "catalog/deleteImageEntity",
  async (
    payload: { imageId: string; productId?: string },
    { rejectWithValue },
  ) => {
    try {
      await imageService.delete(payload.imageId);
      return payload;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Khong the xoa hinh anh"));
    }
  },
);

export const createInventoryEntity = createAsyncThunk(
  "catalog/createInventoryEntity",
  async (payload: CreateInventoryRequest, { rejectWithValue }) => {
    try {
      const response = await inventoryService.create(payload);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Khong the tao ton kho"));
    }
  },
);

export const updateInventoryEntity = createAsyncThunk(
  "catalog/updateInventoryEntity",
  async (
    payload: { id: string; data: UpdateInventoryRequest },
    { rejectWithValue },
  ) => {
    try {
      const response = await inventoryService.update(payload.id, payload.data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Khong the cap nhat ton kho"),
      );
    }
  },
);

export const uploadImages = createAsyncThunk(
  "catalog/uploadImages",
  async (files: File[], { rejectWithValue }) => {
    try {
      return await uploadService.uploadMultipleImages(files);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Khong the upload hinh"));
    }
  },
);

export const generateCustomBasketPreview = createAsyncThunk(
  "catalog/generateCustomBasketPreview",
  async (payload: CreateCustomBasketRequest, { rejectWithValue }) => {
    try {
      const previewUrl = await customBasketService.generateCustomBasketImage(
        payload,
      );
      return normalizePreviewUrl(previewUrl);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Khong the tao anh gio qua"),
      );
    }
  },
);

export const confirmCustomBasketDesign = createAsyncThunk(
  "catalog/confirmCustomBasketDesign",
  async (payload: ConfirmCustomBasketRequest, { rejectWithValue }) => {
    try {
      return await customBasketService.confirmCustomBasket(payload);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Khong the xac nhan gio qua"),
      );
    }
  },
);

export const generateExclusiveCustomBasketDetails = createAsyncThunk(
  "catalog/generateExclusiveCustomBasketDetails",
  async (payload: GenerateExclusiveDetailsRequest, { rejectWithValue }) => {
    try {
      const previewUrl = await customBasketService.generateExclusiveDetails(
        payload,
      );
      return normalizePreviewUrl(previewUrl);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Khong the chinh sua anh gio qua"),
      );
    }
  },
);

const upsertProduct = (state: CatalogState, product: ProductResponse) => {
  const images = product.images || state.productImagesByProductId[product.id] || [];
  const nextProduct = {
    ...product,
    images,
  };
  state.productDetailsById[product.id] = nextProduct;

  const index = state.products.findIndex((item) => item.id === product.id);
  if (index >= 0) {
    state.products[index] = nextProduct;
  } else {
    state.products.unshift(nextProduct);
  }
};

const upsertGiftBox = (state: CatalogState, giftBox: GiftBoxResponse) => {
  state.giftBoxDetailsById[giftBox.id] = giftBox;

  const index = state.giftBoxes.findIndex((item) => item.id === giftBox.id);
  if (index >= 0) {
    state.giftBoxes[index] = giftBox;
  } else {
    state.giftBoxes.unshift(giftBox);
  }

  const activeIndex = state.activeGiftBoxes.findIndex(
    (item) => item.id === giftBox.id,
  );
  if (giftBox.isActive && !giftBox.isCustom) {
    if (activeIndex >= 0) {
      state.activeGiftBoxes[activeIndex] = giftBox;
    } else {
      state.activeGiftBoxes.unshift(giftBox);
    }
  } else if (activeIndex >= 0) {
    state.activeGiftBoxes.splice(activeIndex, 1);
  }

  const userIndex = state.userGiftBoxes.findIndex(
    (item) => item.id === giftBox.id,
  );
  if (userIndex >= 0) {
    state.userGiftBoxes[userIndex] = giftBox;
  }
};

const applyProductWithDeps = (state: CatalogState, payload: ProductWithDeps) => {
  upsertProduct(state, payload.product);
  state.productImagesByProductId[payload.product.id] = payload.images;
  state.inventoriesByProductId[payload.product.id] = payload.inventory;
};

const catalogSlice = createSlice({
  name: "catalog",
  initialState,
  reducers: {
    clearCatalogError(state) {
      state.error = null;
      state.uploadError = null;
      state.customBasketError = null;
    },
    clearUploadedImages(state) {
      state.uploadedImageUrls = [];
      state.uploadError = null;
    },
    clearCustomBasketState(state) {
      state.customBasketPreviewUrl = null;
      state.customBasketGiftBoxId = null;
      state.customBasketError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsCatalog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsCatalog.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.map((item) => item.product);
        action.payload.forEach((item) => applyProductWithDeps(state, item));
      })
      .addCase(fetchProductsCatalog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProductDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetail.fulfilled, (state, action) => {
        state.loading = false;
        applyProductWithDeps(state, action.payload);
      })
      .addCase(fetchProductDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createProductEntity.fulfilled, (state, action) => {
        upsertProduct(state, action.payload);
      })
      .addCase(updateProductEntity.fulfilled, (state, action) => {
        upsertProduct(state, action.payload);
      })
      .addCase(deleteProductEntity.fulfilled, (state, action) => {
        state.products = state.products.filter((item) => item.id !== action.payload);
        delete state.productDetailsById[action.payload];
        delete state.productImagesByProductId[action.payload];
        delete state.inventoriesByProductId[action.payload];
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(createCategoryEntity.fulfilled, (state, action) => {
        state.categories.unshift(action.payload);
      })
      .addCase(updateCategoryEntity.fulfilled, (state, action) => {
        const index = state.categories.findIndex(
          (item) => item.id === action.payload.id,
        );
        if (index >= 0) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(deleteCategoryEntity.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          (item) => item.id !== action.payload,
        );
      })
      .addCase(fetchGiftBoxes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGiftBoxes.fulfilled, (state, action) => {
        state.loading = false;
        state.giftBoxes = action.payload;
        action.payload.forEach((item) => {
          state.giftBoxDetailsById[item.id] = item;
        });
      })
      .addCase(fetchGiftBoxes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchActiveGiftBoxes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveGiftBoxes.fulfilled, (state, action) => {
        state.loading = false;
        state.activeGiftBoxes = action.payload;
        action.payload.forEach((item) => {
          state.giftBoxDetailsById[item.id] = item;
        });
      })
      .addCase(fetchActiveGiftBoxes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserGiftBoxes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserGiftBoxes.fulfilled, (state, action) => {
        state.loading = false;
        state.userGiftBoxes = action.payload;
        action.payload.forEach((item) => {
          state.giftBoxDetailsById[item.id] = item;
        });
      })
      .addCase(fetchUserGiftBoxes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchGiftBoxDetail.fulfilled, (state, action) => {
        state.loading = false;
        upsertGiftBox(state, action.payload);
      })
      .addCase(createGiftBoxEntity.fulfilled, (state, action) => {
        upsertGiftBox(state, action.payload);
      })
      .addCase(updateGiftBoxEntity.fulfilled, (state, action) => {
        upsertGiftBox(state, action.payload);
      })
      .addCase(deleteGiftBoxEntity.fulfilled, (state, action) => {
        state.giftBoxes = state.giftBoxes.filter((item) => item.id !== action.payload);
        state.activeGiftBoxes = state.activeGiftBoxes.filter(
          (item) => item.id !== action.payload,
        );
        state.userGiftBoxes = state.userGiftBoxes.filter(
          (item) => item.id !== action.payload,
        );
        delete state.giftBoxDetailsById[action.payload];
      })
      .addCase(fetchProductImages.fulfilled, (state, action) => {
        state.productImagesByProductId[action.payload.productId] =
          action.payload.images;
        if (state.productDetailsById[action.payload.productId]) {
          state.productDetailsById[action.payload.productId].images =
            action.payload.images;
        }
        const product = state.products.find(
          (item) => item.id === action.payload.productId,
        );
        if (product) {
          product.images = action.payload.images;
        }
      })
      .addCase(createImageEntity.fulfilled, (state, action) => {
        if (!action.payload.productId) return;
        const productId = action.payload.productId;
        const currentImages = state.productImagesByProductId[productId] || [];
        state.productImagesByProductId[productId] = [
          ...currentImages,
          action.payload,
        ];
      })
      .addCase(deleteImageEntity.fulfilled, (state, action) => {
        if (!action.payload.productId) return;
        state.productImagesByProductId[action.payload.productId] = (
          state.productImagesByProductId[action.payload.productId] || []
        ).filter((image) => image.id !== action.payload.imageId);
      })
      .addCase(createInventoryEntity.fulfilled, (state, action) => {
        state.inventoriesByProductId[action.payload.productId] = action.payload;
      })
      .addCase(updateInventoryEntity.fulfilled, (state, action) => {
        state.inventoriesByProductId[action.payload.productId] = action.payload;
      })
      .addCase(uploadImages.pending, (state) => {
        state.uploadLoading = true;
        state.uploadError = null;
      })
      .addCase(uploadImages.fulfilled, (state, action) => {
        state.uploadLoading = false;
        state.uploadedImageUrls = action.payload;
      })
      .addCase(uploadImages.rejected, (state, action) => {
        state.uploadLoading = false;
        state.uploadError = action.payload as string;
      })
      .addCase(generateCustomBasketPreview.pending, (state) => {
        state.customBasketLoading = true;
        state.customBasketError = null;
        state.customBasketPreviewUrl = null;
        state.customBasketGiftBoxId = null;
      })
      .addCase(generateCustomBasketPreview.fulfilled, (state, action) => {
        state.customBasketLoading = false;
        state.customBasketPreviewUrl = action.payload;
      })
      .addCase(generateCustomBasketPreview.rejected, (state, action) => {
        state.customBasketLoading = false;
        state.customBasketError = action.payload as string;
      })
      .addCase(confirmCustomBasketDesign.pending, (state) => {
        state.customBasketLoading = true;
        state.customBasketError = null;
      })
      .addCase(confirmCustomBasketDesign.fulfilled, (state, action) => {
        state.customBasketLoading = false;
        state.customBasketGiftBoxId = action.payload;
      })
      .addCase(confirmCustomBasketDesign.rejected, (state, action) => {
        state.customBasketLoading = false;
        state.customBasketError = action.payload as string;
      })
      .addCase(generateExclusiveCustomBasketDetails.pending, (state) => {
        state.customBasketLoading = true;
        state.customBasketError = null;
      })
      .addCase(generateExclusiveCustomBasketDetails.fulfilled, (state, action) => {
        state.customBasketLoading = false;
        state.customBasketPreviewUrl = action.payload;
        state.customBasketGiftBoxId = null;
      })
      .addCase(generateExclusiveCustomBasketDetails.rejected, (state, action) => {
        state.customBasketLoading = false;
        state.customBasketError = action.payload as string;
      });
  },
});

export const {
  clearCatalogError,
  clearUploadedImages,
  clearCustomBasketState,
} = catalogSlice.actions;

export default catalogSlice.reducer;
