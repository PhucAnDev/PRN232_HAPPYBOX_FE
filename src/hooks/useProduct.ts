import { useState, useEffect, useCallback } from "react";
import productService, {
  ProductResponse,
  CreateProductRequest,
  UpdateProductRequest,
} from "../services/productService";

// ====== Hook lấy danh sách sản phẩm (local state) ======
export const useProducts = () => {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await productService.getAll();
      setProducts(res.data.data);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Không thể tải danh sách sản phẩm",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
};

// ====== Hook lấy chi tiết 1 sản phẩm ======
export const useProductDetail = (id: string) => {
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    productService
      .getById(id)
      .then((res) => setProduct(res.data.data))
      .catch((err) =>
        setError(err.response?.data?.message || "Không tìm thấy sản phẩm"),
      )
      .finally(() => setLoading(false));
  }, [id]);

  return { product, loading, error };
};

// ====== Hook xử lý CRUD ======
export const useProductMutation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProduct = async (data: CreateProductRequest) => {
    setLoading(true);
    setError(null);
    try {
      const res = await productService.create(data);
      return res.data.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || "Tạo sản phẩm thất bại";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: string, data: UpdateProductRequest) => {
    setLoading(true);
    setError(null);
    try {
      const res = await productService.update(id, data);
      return res.data.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || "Cập nhật sản phẩm thất bại";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await productService.delete(id);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Xóa sản phẩm thất bại";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, createProduct, updateProduct, deleteProduct };
};

// Default export (hook phổ biến nhất)
export default useProducts;
