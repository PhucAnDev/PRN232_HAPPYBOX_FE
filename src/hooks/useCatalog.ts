import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import {
  clearCatalogError,
  clearCustomBasketState,
  clearUploadedImages,
  confirmCustomBasketDesign,
  createCategoryEntity,
  createGiftBoxEntity,
  createImageEntity,
  createInventoryEntity,
  createProductEntity,
  deleteCategoryEntity,
  deleteGiftBoxEntity,
  deleteImageEntity,
  deleteProductEntity,
  fetchActiveGiftBoxes,
  fetchCategories,
  fetchGiftBoxDetail,
  fetchGiftBoxes,
  fetchProductDetail,
  fetchProductImages,
  fetchProductsCatalog,
  fetchUserGiftBoxes,
  generateExclusiveCustomBasketDetails,
  generateCustomBasketPreview,
  updateCategoryEntity,
  updateGiftBoxEntity,
  updateInventoryEntity,
  updateProductEntity,
  uploadImages,
} from "../store/slices/catalogSlice";

const useCatalog = () => {
  const dispatch = useDispatch<AppDispatch>();
  const catalog = useSelector((state: RootState) => state.catalog);

  return {
    ...catalog,
    fetchProducts: () => dispatch(fetchProductsCatalog()).unwrap(),
    fetchProductDetail: (productId: string) =>
      dispatch(fetchProductDetail(productId)).unwrap(),
    createProduct: (payload: Parameters<typeof createProductEntity>[0]) =>
      dispatch(createProductEntity(payload)).unwrap(),
    updateProduct: (
      id: string,
      data: Parameters<typeof updateProductEntity>[0]["data"],
    ) => dispatch(updateProductEntity({ id, data })).unwrap(),
    deleteProduct: (productId: string) =>
      dispatch(deleteProductEntity(productId)).unwrap(),
    fetchCategories: () => dispatch(fetchCategories()).unwrap(),
    createCategory: (payload: Parameters<typeof createCategoryEntity>[0]) =>
      dispatch(createCategoryEntity(payload)).unwrap(),
    updateCategory: (
      id: string,
      data: Parameters<typeof updateCategoryEntity>[0]["data"],
    ) => dispatch(updateCategoryEntity({ id, data })).unwrap(),
    deleteCategory: (categoryId: string) =>
      dispatch(deleteCategoryEntity(categoryId)).unwrap(),
    fetchGiftBoxes: () => dispatch(fetchGiftBoxes()).unwrap(),
    fetchActiveGiftBoxes: () => dispatch(fetchActiveGiftBoxes()).unwrap(),
    fetchUserGiftBoxes: () => dispatch(fetchUserGiftBoxes()).unwrap(),
    fetchGiftBoxDetail: (giftBoxId: string) =>
      dispatch(fetchGiftBoxDetail(giftBoxId)).unwrap(),
    createGiftBox: (payload: Parameters<typeof createGiftBoxEntity>[0]) =>
      dispatch(createGiftBoxEntity(payload)).unwrap(),
    updateGiftBox: (
      id: string,
      data: Parameters<typeof updateGiftBoxEntity>[0]["data"],
    ) => dispatch(updateGiftBoxEntity({ id, data })).unwrap(),
    deleteGiftBox: (giftBoxId: string) =>
      dispatch(deleteGiftBoxEntity(giftBoxId)).unwrap(),
    fetchProductImages: (productId: string) =>
      dispatch(fetchProductImages(productId)).unwrap(),
    createImage: (payload: Parameters<typeof createImageEntity>[0]) =>
      dispatch(createImageEntity(payload)).unwrap(),
    deleteImage: (imageId: string, productId?: string) =>
      dispatch(deleteImageEntity({ imageId, productId })).unwrap(),
    createInventory: (payload: Parameters<typeof createInventoryEntity>[0]) =>
      dispatch(createInventoryEntity(payload)).unwrap(),
    updateInventory: (
      id: string,
      data: Parameters<typeof updateInventoryEntity>[0]["data"],
    ) => dispatch(updateInventoryEntity({ id, data })).unwrap(),
    uploadFiles: (files: File[]) => dispatch(uploadImages(files)).unwrap(),
    generateCustomBasketPreview: (
      payload: Parameters<typeof generateCustomBasketPreview>[0],
    ) => dispatch(generateCustomBasketPreview(payload)).unwrap(),
    confirmCustomBasket: (
      payload: Parameters<typeof confirmCustomBasketDesign>[0],
    ) => dispatch(confirmCustomBasketDesign(payload)).unwrap(),
    generateExclusiveDetails: (
      payload: Parameters<typeof generateExclusiveCustomBasketDetails>[0],
    ) => dispatch(generateExclusiveCustomBasketDetails(payload)).unwrap(),
    clearErrors: () => dispatch(clearCatalogError()),
    clearUploadedImages: () => dispatch(clearUploadedImages()),
    clearCustomBasketState: () => dispatch(clearCustomBasketState()),
  };
};

export default useCatalog;
