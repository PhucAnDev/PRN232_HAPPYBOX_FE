import { useEffect, useMemo, useRef } from "react";
import useCatalog from "./useCatalog";
import type {
  CreateProductRequest,
  ProductResponse,
  UpdateProductRequest,
} from "../services/productService";

export const useProducts = () => {
  const {
    products,
    loading,
    error,
    fetchProducts,
  } = useCatalog();
  const hasRequestedRef = useRef(false);

  useEffect(() => {
    if (products.length > 0 || loading || hasRequestedRef.current) {
      return;
    }

    hasRequestedRef.current = true;
    void fetchProducts();
  }, [products.length, loading]);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
  };
};

export const useProductDetail = (id: string) => {
  const {
    productDetailsById,
    inventoriesByProductId,
    loading,
    error,
    fetchProductDetail,
  } = useCatalog();

  const product = useMemo(
    () => (id ? productDetailsById[id] || null : null),
    [id, productDetailsById],
  );

  return {
    product,
    inventory: id ? inventoriesByProductId[id] ?? null : null,
    loading,
    error,
    refetch: () => fetchProductDetail(id),
  };
};

export const useProductMutation = () => {
  const { loading, error, createProduct, updateProduct, deleteProduct } =
    useCatalog();

  const create = (data: CreateProductRequest) => createProduct(data);
  const update = (id: string, data: UpdateProductRequest) =>
    updateProduct(id, data);
  const remove = (id: string) => deleteProduct(id);

  return {
    loading,
    error,
    createProduct: create,
    updateProduct: update,
    deleteProduct: remove,
  };
};

export type { ProductResponse };

export default useProducts;
