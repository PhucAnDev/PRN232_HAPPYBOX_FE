import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Upload,
  X,
  Package,
  AlertTriangle,
  ImageIcon,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useCatalog from "@/hooks/useCatalog";
import type {
  ProductResponse,
  CreateProductRequest,
  UpdateProductRequest,
} from "@/services/productService";
import type { CategoryResponse } from "@/services/categoryService";
import type { ImageResponse } from "@/services/imageService";
import {
  InventoryStatus,
  type InventoryResponse,
} from "@/services/inventoryService";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  sku: string;
  description: string;
  price: number;
  status: "active" | "hidden";
  image: string;
  inventory?: InventoryResponse | null;
}

const getReadableErrorMessage = (
  error: any,
  fallback: string,
): string => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.response?.data?.errors) {
    const errors = error.response.data.errors;
    return Object.keys(errors)
      .map((key) => `${key}: ${errors[key].join(", ")}`)
      .join("\n");
  }

  if (error?.message) {
    return error.message;
  }

  return fallback;
};

export function ProductManagement() {
  const {
    fetchProducts,
    fetchCategories,
    fetchProductImages,
    fetchProductDetail,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadFiles,
    createImage,
    deleteImage,
    createInventory,
    updateInventory,
  } = useCatalog();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: "",
    price: "",
    sku: "",
    quantity: "",
    minStockLevel: "",
  });

  // Image upload states
  const [selectedImages, setSelectedImages] = useState<File[]>([]); // New images to upload
  const [imagePreviews, setImagePreviews] = useState<string[]>([]); // Preview URLs
  const [existingImages, setExistingImages] = useState<ImageResponse[]>([]); // Images already in DB

  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const productService = {
    getAll: async () => {
      const data = await fetchProducts();
      return {
        data: {
          success: true,
          data: data.map((item) => item.product),
        },
      };
    },
    update: async (id: string, data: UpdateProductRequest) => ({
      data: {
        success: true,
        data: await updateProduct(id, data),
      },
    }),
    delete: async (id: string) => {
      await deleteProduct(id);
      return { data: { success: true } };
    },
    create: async (data: CreateProductRequest) => ({
      data: {
        success: true,
        data: await createProduct(data),
      },
    }),
  };
  const categoryService = {
    getAll: async () => ({
      data: {
        success: true,
        data: await fetchCategories(),
      },
    }),
  };
  const imageService = {
    getByProduct: async (productId: string) => {
      const data = await fetchProductImages(productId);
      return {
        data: {
          success: true,
          data: data.images,
        },
      };
    },
    create: async (payload: Parameters<typeof createImage>[0]) => ({
      data: {
        success: true,
        data: await createImage(payload),
      },
    }),
    delete: async (imageId: string) => {
      await deleteImage(imageId);
      return { data: { success: true } };
    },
  };
  const uploadService = {
    uploadMultipleImages: async (files: File[]) => uploadFiles(files),
    constructor: {
      getSetupInstructions: () =>
        "Cloudinary dang duoc goi thong qua useCatalog/uploadFiles.",
    },
  };
  const inventoryService = {
    getByProductId: async (productId: string) => {
      const data = await fetchProductDetail(productId);
      return {
        data: {
          success: true,
          data: data.inventory,
        },
      };
    },
    update: async (
      id: string,
      data: Parameters<typeof updateInventory>[1],
    ) => ({
      data: {
        success: true,
        data: await updateInventory(id, data),
      },
    }),
    create: async (payload: Parameters<typeof createInventory>[0]) => ({
      data: {
        success: true,
        data: await createInventory(payload),
      },
    }),
  };

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [productsRes, categoriesRes] = await Promise.all([
        productService.getAll(),
        categoryService.getAll(),
      ]);

      if (productsRes.data.success && categoriesRes.data.success) {
        // Map ProductResponse to Product with images and inventory
        const productsWithImages = await Promise.all(
          productsRes.data.data.map(async (p) => {
            try {
              const [imagesRes, inventoryRes] = await Promise.all([
                imageService.getByProduct(p.id),
                inventoryService.getByProductId(p.id).catch(() => null),
              ]);

              const images = imagesRes.data.success ? imagesRes.data.data : [];
              const inventory =
                inventoryRes && inventoryRes.data.success
                  ? inventoryRes.data.data
                  : null;

              // Get main image or first image
              const mainImage = images.find((img) => img.isMain) || images[0];

              return {
                id: p.id,
                name: p.name,
                category: p.categoryName || "Chưa phân loại",
                categoryId: p.categoryId,
                sku: p.sku,
                description: p.description,
                price: p.price,
                status: p.isActive ? "active" : "hidden",
                image: mainImage?.url || "🎁", // Use image URL or emoji fallback
                inventory: inventory,
              };
            } catch (err) {
              // If image fetch fails, use emoji
              return {
                id: p.id,
                name: p.name,
                category: p.categoryName || "Chưa phân loại",
                categoryId: p.categoryId,
                sku: p.sku,
                description: p.description,
                price: p.price,
                status: p.isActive ? "active" : "hidden",
                image: "🎁",
                inventory: null,
              };
            }
          }),
        );

        setProducts(productsWithImages);
        setCategories(categoriesRes.data.data);
      } else {
        setError("Không thể tải dữ liệu");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Render inventory status badge
  const renderInventoryBadge = (
    inventory: InventoryResponse | null | undefined,
  ) => {
    if (!inventory) {
      return (
        <div className="flex items-center justify-center">
          <span className="text-xs text-gray-400">Chưa có</span>
        </div>
      );
    }

    const { quantity, minStockLevel, status } = inventory;

    // Hết hàng
    if (status === InventoryStatus.OutOfStock || quantity === 0) {
      return (
        <div className="flex flex-col items-center gap-1">
          <span className="text-sm font-bold text-gray-900">{quantity}</span>
          <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-red-100 text-red-700">
            <X className="h-3 w-3" />
            <span className="text-xs font-semibold">Hết hàng</span>
          </div>
        </div>
      );
    }

    // Sắp hết (LowStock)
    if (status === InventoryStatus.LowStock || quantity <= minStockLevel) {
      const remaining = quantity;
      return (
        <div className="flex flex-col items-center gap-1">
          <span className="text-sm font-bold text-gray-900">{quantity}</span>
          <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-yellow-100 text-yellow-700">
            <AlertTriangle className="h-3 w-3" />
            <span className="text-xs font-semibold">{remaining} còn lại</span>
          </div>
        </div>
      );
    }

    // Còn hàng đủ (InStock)
    return (
      <div className="flex items-center justify-center">
        <span className="text-sm font-bold text-gray-900">{quantity}</span>
      </div>
    );
  };

  const handleToggleStatus = async (productId: string) => {
    try {
      const product = products.find((p) => p.id === productId);
      if (!product) return;

      const updateData: UpdateProductRequest = {
        isActive: product.status === "hidden", // Toggle
      };

      const response = await productService.update(productId, updateData);

      if (response.data.success) {
        // Update local state
        setProducts(
          products.map((p) =>
            p.id === productId
              ? {
                  ...p,
                  status: p.status === "active" ? "hidden" : "active",
                }
              : p,
          ),
        );
        toast.success(
          product.status === "active"
            ? "Đã ẩn sản phẩm thành công."
            : "Đã kích hoạt sản phẩm thành công.",
        );
      } else {
        toast.error("Không thể cập nhật trạng thái sản phẩm.");
      }
    } catch (err) {
      console.error("Error toggling status:", err);
      toast.error(
        getReadableErrorMessage(err, "Có lỗi xảy ra khi cập nhật trạng thái."),
      );
    }
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    setDeleting(true);
    try {
      const response = await productService.delete(productToDelete.id);

      if (response.data.success) {
        setProducts((previous) =>
          previous.filter((product) => product.id !== productToDelete.id),
        );
        toast.success("Xóa sản phẩm thành công.");
        setProductToDelete(null);
      } else {
        toast.error("Không thể xóa sản phẩm.");
      }
    } catch (err) {
      console.error("Error deleting product:", err);
      const errorMessage =
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "data" in err.response &&
        err.response.data &&
        typeof err.response.data === "object" &&
        "message" in err.response.data &&
        typeof err.response.data.message === "string"
          ? err.response.data.message
          : "Có lỗi xảy ra khi xóa sản phẩm.";
      toast.error(errorMessage);
    } finally {
      setDeleting(false);
    }
  };

  const handleEditProduct = async (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      categoryId: product.categoryId,
      price: product.price.toString(),
      sku: product.sku,
      quantity: product.inventory?.quantity?.toString() || "",
      minStockLevel: product.inventory?.minStockLevel?.toString() || "",
    });

    // Fetch existing images from API
    try {
      const imagesResponse = await imageService.getByProduct(product.id);
      if (imagesResponse.data.success && imagesResponse.data.data.length > 0) {
        const images = imagesResponse.data.data.sort(
          (a: any, b: any) => a.sortOrder - b.sortOrder,
        );

        // Store existing images with IDs for deletion tracking
        setExistingImages(images);

        // Set URLs as previews
        const imageUrls = images.map((img: any) => img.url);
        setImagePreviews(imageUrls);

        console.log(`✅ Đã load ${imageUrls.length} ảnh của sản phẩm:`, images);
      } else {
        setExistingImages([]);
        setImagePreviews([]);
      }
    } catch (error) {
      console.error("❌ Lỗi khi load ảnh sản phẩm:", error);
      setExistingImages([]);
      setImagePreviews([]);
    }

    // Reset selected images (user will add new ones if needed)
    setSelectedImages([]);
    setShowAddModal(true);
  };

  const handleAddNewProduct = () => {
    resetForm(); // Clear all form and image states
    setShowAddModal(true);
  };

  const handleSaveProduct = async () => {
    // Validation
    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập tên sản phẩm.");
      return;
    }
    if (!formData.sku.trim()) {
      toast.error("Vui lòng nhập SKU.");
      return;
    }
    if (!formData.categoryId) {
      toast.error("Vui lòng chọn danh mục.");
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error("Vui lòng nhập giá hợp lệ.");
      return;
    }
    if (!formData.quantity || parseInt(formData.quantity) < 0) {
      toast.error("Vui lòng nhập số lượng tồn kho hợp lệ (>= 0).");
      return;
    }
    if (!formData.minStockLevel || parseInt(formData.minStockLevel) < 0) {
      toast.error("Vui lòng nhập số lượng tối thiểu hợp lệ (>= 0).");
      return;
    }

    setSaving(true);

    try {
      if (editingProduct) {
        // Update existing product
        console.log("📝 Editing Product ID:", editingProduct.id);
        console.log("📝 Editing Product:", editingProduct);

        const updateData: UpdateProductRequest = {
          sku: formData.sku,
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          categoryId: formData.categoryId,
        };

        console.log("📝 Update Data:", updateData);
        const response = await productService.update(
          editingProduct.id,
          updateData,
        );

        console.log("📥 Response:", response);

        if (response.data.success) {
          // Upload and save new images if any were selected
          if (selectedImages.length > 0) {
            try {
              console.log(
                `📤 Đang upload ${selectedImages.length} ảnh lên Cloudinary...`,
              );

              // Upload images to Cloudinary
              const imageUrls =
                await uploadService.uploadMultipleImages(selectedImages);
              console.log("☁️ Upload Cloudinary thành công:", imageUrls);

              // Save image URLs to database
              await Promise.all(
                imageUrls.map(async (url, index) => {
                  await imageService.create({
                    url: url,
                    isMain: index === 0,
                    sortOrder: index,
                    productId: editingProduct.id,
                  });
                }),
              );

              console.log("✅ Lưu ảnh vào database thành công");
            } catch (imgErr: any) {
              console.error("❌ Lỗi upload ảnh:", imgErr);

              // Check if it's Cloudinary setup issue
              if (imgErr.message?.includes("Upload failed")) {
                toast.error(
                  "Lỗi upload ảnh lên Cloudinary. Có thể bạn chưa setup Cloudinary.",
                );
                console.error(uploadService.constructor.getSetupInstructions());
              } else {
                toast.error(
                  `Sản phẩm đã được cập nhật nhưng có lỗi khi lưu ảnh: ${getReadableErrorMessage(imgErr, "Lỗi không xác định")}`,
                );
              }
            }
          }

          // Update or create inventory
          try {
            console.log("📦 Đang cập nhật inventory...");
            if (editingProduct.inventory) {
              // Update existing inventory
              await inventoryService.update(editingProduct.inventory.id, {
                quantity: parseInt(formData.quantity),
                minStockLevel: parseInt(formData.minStockLevel),
              });
              console.log("✅ Cập nhật inventory thành công");
            } else {
              // Create new inventory if not exists
              await inventoryService.create({
                productId: editingProduct.id,
                quantity: parseInt(formData.quantity),
                minStockLevel: parseInt(formData.minStockLevel),
              });
              console.log("✅ Tạo inventory thành công");
            }
          } catch (invErr: any) {
            console.error("❌ Lỗi cập nhật inventory:", invErr);
            toast.error(
              `Sản phẩm đã được cập nhật nhưng có lỗi khi cập nhật tồn kho: ${getReadableErrorMessage(invErr, "Lỗi không xác định")}`,
            );
          }

          // Refresh data
          await fetchData();
          setShowAddModal(false);
          resetForm();
          toast.success("Cập nhật sản phẩm thành công.");
        } else {
          toast.error("Không thể cập nhật sản phẩm.");
        }
      } else {
        // Create new product
        const createData: CreateProductRequest = {
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          categoryId: formData.categoryId,
          sku: formData.sku,
        };

        const response = await productService.create(createData);

        if (response.data.success) {
          const newProductId = response.data.data.id;
          console.log("✅ Tạo sản phẩm thành công, ID:", newProductId);

          // Upload and save images if any were selected
          if (selectedImages.length > 0) {
            try {
              console.log(
                `📤 Đang upload ${selectedImages.length} ảnh lên Cloudinary...`,
              );

              // Upload images to Cloudinary
              const imageUrls =
                await uploadService.uploadMultipleImages(selectedImages);
              console.log("☁️ Upload Cloudinary thành công:", imageUrls);

              // Save image URLs to database
              await Promise.all(
                imageUrls.map(async (url, index) => {
                  await imageService.create({
                    url: url,
                    isMain: index === 0,
                    sortOrder: index,
                    productId: newProductId,
                  });
                }),
              );

              console.log("✅ Lưu ảnh vào database thành công");
            } catch (imgErr: any) {
              console.error("❌ Lỗi upload ảnh:", imgErr);

              // Check if it's Cloudinary setup issue
              if (imgErr.message?.includes("Upload failed")) {
                toast.error(
                  "Lỗi upload ảnh lên Cloudinary. Sản phẩm đã được tạo nhưng chưa có ảnh.",
                );
                console.error(uploadService.constructor.getSetupInstructions());
              } else {
                toast.error(
                  `Sản phẩm đã được tạo nhưng có lỗi khi lưu ảnh: ${getReadableErrorMessage(imgErr, "Lỗi không xác định")}`,
                );
              }
            }
          }

          // Create inventory for the new product
          try {
            console.log("📦 Đang tạo inventory cho sản phẩm...");
            await inventoryService.create({
              productId: newProductId,
              quantity: parseInt(formData.quantity),
              minStockLevel: parseInt(formData.minStockLevel),
            });
            console.log("✅ Tạo inventory thành công");
          } catch (invErr: any) {
            console.error("❌ Lỗi tạo inventory:", invErr);
            toast.error(
              `Sản phẩm đã được tạo nhưng có lỗi khi tạo tồn kho: ${getReadableErrorMessage(invErr, "Lỗi không xác định")}`,
            );
          }

          // Refresh data
          await fetchData();
          setShowAddModal(false);
          resetForm();
          toast.success("Thêm sản phẩm thành công.");
        } else {
          toast.error("Không thể tạo sản phẩm.");
        }
      }
    } catch (err: any) {
      console.error("❌ Error saving product:", err);
      console.error("Response data:", err?.response?.data);

      toast.error(
        `Có lỗi xảy ra khi lưu sản phẩm: ${getReadableErrorMessage(err, "Lỗi không xác định")}`,
      );
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      categoryId: "",
      price: "",
      sku: "",
      quantity: "",
      minStockLevel: "",
    });
    setSelectedImages([]);
    setImagePreviews([]);
    setExistingImages([]);
    setEditingProduct(null);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    const validFiles = fileArray.filter((file) => {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error(`File ${file.name} không phải là ảnh.`);
        return false;
      }
      // Validate file size (max 5MB for base64)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File ${file.name} vượt quá 5MB. Vui lòng chọn ảnh nhỏ hơn.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Create previews
    const newPreviews: string[] = [];
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === validFiles.length) {
          setImagePreviews([...imagePreviews, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    setSelectedImages([...selectedImages, ...validFiles]);
  };

  const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (!files) return;

    // Convert FileList to array and process like handleImageSelect
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`File ${file.name} không phải là ảnh.`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File ${file.name} vượt quá 5MB. Vui lòng chọn ảnh nhỏ hơn.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    const newPreviews: string[] = [];
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === validFiles.length) {
          setImagePreviews([...imagePreviews, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    setSelectedImages([...selectedImages, ...validFiles]);
  };

  const handleRemoveImage = async (index: number) => {
    // Check if this is an existing image (already in DB)
    if (index < existingImages.length) {
      const imageToDelete = existingImages[index];

      try {
        console.log(`🗑️ Đang xóa ảnh ID: ${imageToDelete.id} khỏi database...`);
        await imageService.delete(imageToDelete.id);
        console.log("✅ Đã xóa ảnh khỏi database");

        // Remove from existing images list
        setExistingImages(existingImages.filter((_, i) => i !== index));
        setImagePreviews(imagePreviews.filter((_, i) => i !== index));
      } catch (error: any) {
        console.error("❌ Lỗi khi xóa ảnh:", error);
        toast.error(
          `Không thể xóa ảnh: ${getReadableErrorMessage(error, "Lỗi không xác định")}`,
        );
      }
    } else {
      // This is a new image (not yet uploaded) - just remove from preview
      const newImageIndex = index - existingImages.length;
      setSelectedImages(selectedImages.filter((_, i) => i !== newImageIndex));
      setImagePreviews(imagePreviews.filter((_, i) => i !== index));
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || product.categoryId === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const productStats = {
    total: products.length,
    active: products.filter((p) => p.status === "active").length,
    lowStock: 0, // N/A - Backend không có inventory API
    outOfStock: 0, // N/A - Backend không có inventory API
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-[#D4AF37] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-900 font-semibold mb-2">Có lỗi xảy ra</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button
            onClick={fetchData}
            className="bg-[#D4AF37] hover:bg-[#C19A6B]"
          >
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-3xl font-bold text-gray-900 mb-2"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Quản Lý Sản Phẩm & Kho
        </h1>
        <p className="text-gray-600">
          Quản lý thông tin sản phẩm và theo dõi tồn kho
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Tổng sản phẩm</p>
              <p
                className="text-2xl font-bold text-gray-900"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {productStats.total}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg shadow-sm p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-800 mb-1">Đang hoạt động</p>
              <p
                className="text-2xl font-bold text-green-900"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {productStats.active}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-200 flex items-center justify-center">
              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg shadow-sm p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-800 mb-1">Sắp hết hàng</p>
              <p
                className="text-2xl font-bold text-yellow-900"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {productStats.lowStock}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-yellow-200 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-red-50 rounded-lg shadow-sm p-4 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-800 mb-1">Hết hàng</p>
              <p
                className="text-2xl font-bold text-red-900"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {productStats.outOfStock}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-red-200 flex items-center justify-center">
              <X className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Tìm kiếm theo tên sản phẩm hoặc SKU..."
                className="pl-10 pr-4 py-2 w-full border-gray-300 rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Filters and Actions */}
          <div className="flex flex-wrap gap-3">
            {/* Category Filter */}
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-colors"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">Tất cả danh mục</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Add Product Button */}
            <Button
              onClick={handleAddNewProduct}
              className="bg-[#D4AF37] hover:bg-[#C19A6B] text-white font-semibold px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Thêm Sản Phẩm Mới
            </Button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Sản Phẩm
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Giá Bán
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tồn Kho
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Trạng Thái
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Hành Động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* Product Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-[#FFFDF5] to-[#F5F5F5] flex items-center justify-center border border-gray-200 overflow-hidden">
                        {product.image.startsWith("http") ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-3xl">{product.image}</span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {product.category}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* SKU */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-mono text-gray-700">
                      {product.sku}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-gray-900">
                      {formatCurrency(product.price)}
                    </span>
                  </td>

                  {/* Inventory */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderInventoryBadge(product.inventory)}
                  </td>

                  {/* Status Toggle */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => handleToggleStatus(product.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          product.status === "active"
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            product.status === "active"
                              ? "translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                      <span
                        className={`text-sm font-semibold ml-2 ${
                          product.status === "active"
                            ? "text-green-700"
                            : "text-gray-500"
                        }`}
                      >
                        {product.status === "active" ? "Hoạt động" : "Ẩn"}
                      </span>
                    </div>
                  </td>

                                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="p-2 text-gray-600 hover:text-[#D4AF37] hover:bg-gray-100 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setProductToDelete(product)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="py-16 text-center">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào</p>
          </div>
        )}

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Hiển thị{" "}
            <span className="font-semibold">{filteredProducts.length}</span> /{" "}
            <span className="font-semibold">{products.length}</span> sản phẩm
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-[#B71C1C] text-white border-[#B71C1C]"
            >
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              Sau
            </Button>
          </div>
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#B71C1C] to-[#8B1538] px-6 py-5 flex items-center justify-between sticky top-0 z-10">
              <h3
                className="text-2xl font-bold text-white"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {editingProduct ? "Chỉnh Sửa Sản Phẩm" : "Thêm Sản Phẩm Mới"}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Product Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tên Sản Phẩm <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="Nhập tên sản phẩm"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full border-gray-300 rounded-lg"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Danh Mục <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) =>
                        setFormData({ ...formData, categoryId: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                    >
                      <option value="">Chọn danh mục</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* SKU */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      SKU <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="Ví dụ: HMP-2026-001"
                      value={formData.sku}
                      onChange={(e) =>
                        setFormData({ ...formData, sku: e.target.value })
                      }
                      className="w-full border-gray-300 rounded-lg font-mono"
                      disabled={!!editingProduct}
                    />
                    {editingProduct && (
                      <p className="text-xs text-gray-500 mt-1">
                        SKU không thể thay đổi khi chỉnh sửa
                      </p>
                    )}
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Giá Bán (VND) <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="number"
                      placeholder="4500000"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      className="w-full border-gray-300 rounded-lg"
                    />
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Số Lượng Tồn Kho <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="number"
                      placeholder="100"
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData({ ...formData, quantity: e.target.value })
                      }
                      className="w-full border-gray-300 rounded-lg"
                      min="0"
                    />
                  </div>

                  {/* Min Stock Level */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Số Lượng Tối Thiểu <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="number"
                      placeholder="5"
                      value={formData.minStockLevel}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          minStockLevel: e.target.value,
                        })
                      }
                      className="w-full border-gray-300 rounded-lg"
                      min="0"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Mô Tả Sản Phẩm
                    </label>
                    <textarea
                      placeholder="Nhập mô tả chi tiết về sản phẩm..."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent resize-none"
                    />
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Hình Ảnh Sản Phẩm
                    </label>
                    <input
                      type="file"
                      id="image-upload"
                      multiple
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleImageDrop}
                      onClick={() =>
                        document.getElementById("image-upload")?.click()
                      }
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#D4AF37] transition-colors cursor-pointer"
                    >
                      {imagePreviews.length === 0 ? (
                        <div className="flex flex-col items-center space-y-3">
                          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                            <Upload className="h-8 w-8 text-gray-400" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-700">
                              Kéo thả ảnh vào đây
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              hoặc click để chọn file
                            </p>
                          </div>
                          <p className="text-xs text-gray-400">
                            PNG, JPG lên đến 5MB
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-2">
                          {imagePreviews.map((preview, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveImage(index);
                                }}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {imagePreviews.length > 0 && (
                      <p className="text-xs text-gray-500 mt-2">
                        {imagePreviews.length} ảnh đã chọn. Click để thêm ảnh
                        khác.
                      </p>
                    )}
                    <p className="text-xs text-green-600 mt-2 flex items-start gap-1">
                      <ImageIcon className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      <span>
                        ☁️ Ảnh sẽ được upload lên Cloudinary (miễn phí, nhanh,
                        CDN). Cần setup: xem uploadService.ts
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Product Preview */}
              {formData.name && (
                <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
                    Xem Trước
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-[#FFFDF5] to-[#F5F5F5] flex items-center justify-center border border-gray-300 overflow-hidden">
                      {imagePreviews.length > 0 ? (
                        <img
                          src={imagePreviews[0]}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-4xl">🎁</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">{formData.name}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {categories.find((c) => c.id === formData.categoryId)
                          ?.name || "Chưa chọn danh mục"}
                      </p>
                      {formData.price && (
                        <p className="text-sm font-bold text-[#B71C1C] mt-1">
                          {formatCurrency(parseFloat(formData.price))}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 mt-8">
                <Button
                  onClick={() => setShowAddModal(false)}
                  variant="outline"
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 py-3"
                  disabled={saving}
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleSaveProduct}
                  className="relative flex-1 bg-[#D4AF37] hover:bg-[#C19A6B] text-white font-semibold py-3"
                  disabled={
                    saving ||
                    !formData.name ||
                    !formData.categoryId ||
                    !formData.sku ||
                    !formData.price ||
                    !formData.quantity ||
                    !formData.minStockLevel
                  }
                >
                  {editingProduct ? "Cập Nhật Sản Phẩm" : "Thêm Sản Phẩm"}
                  {saving && (
                    <span className="absolute inset-0 inline-flex items-center justify-center gap-2 rounded-md bg-[#D4AF37] text-white">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {editingProduct ? "Đang cập nhật..." : "Đang lưu..."}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => !deleting && setProductToDelete(null)}
          />
          <div
            className="relative z-[51] w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-[#B71C1C] to-[#8B1538] px-6 py-5 text-white">
              <h3
                className="text-2xl font-bold"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Xác Nhận Xóa Sản Phẩm
              </h3>
              <p className="mt-1 text-sm text-white/85">
                Hành động này sẽ xóa sản phẩm khỏi danh sách quản lý
              </p>
            </div>

            <div className="p-6">
              <div className="mb-5 flex items-start gap-4 rounded-2xl border border-red-100 bg-red-50 p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    Bạn có chắc muốn xóa sản phẩm này?
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    Sản phẩm{" "}
                    <span className="font-semibold text-[#B71C1C]">
                      {productToDelete.name}
                    </span>{" "}
                    sẽ bị xóa khỏi danh sách hiện tại.
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-white">
                    {productToDelete.image.startsWith("http") ? (
                      <img
                        src={productToDelete.image}
                        alt={productToDelete.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl">{productToDelete.image}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-bold text-gray-900">
                      {productToDelete.name}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      SKU: {productToDelete.sku}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#B71C1C]">
                      {formatCurrency(productToDelete.price)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-200 bg-white px-6 py-4">
              <Button
                variant="outline"
                onClick={() => setProductToDelete(null)}
                disabled={deleting}
                className="min-w-[110px]"
              >
                Hủy
              </Button>
              <Button
                onClick={handleDeleteProduct}
                disabled={deleting}
                className="min-w-[140px] bg-red-600 text-white hover:bg-red-700"
              >
                {deleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xóa...
                  </>
                ) : (
                  "Xóa Sản Phẩm"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
