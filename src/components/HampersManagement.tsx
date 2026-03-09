import { useState, useEffect } from "react";
import giftBoxService from "../services/giftBoxService";
import type { GiftBoxResponse } from "../services/giftBoxService";
import { setViewProduct } from "../services/productViewStore";
import categoryService from "../services/categoryService";
import productService from "../services/productService";
import uploadService from "../services/uploadService";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter,
  Download,
  Upload,
  X,
  Image as ImageIcon,
  Package,
  Calendar,
  DollarSign,
  Tag,
  ToggleLeft,
  ToggleRight,
  Save,
  AlertCircle,
} from "lucide-react";

interface HamperImage {
  id: string;
  url: string;
  isMain: boolean;
  displayOrder: number;
  productId: string | null;
  giftBoxId: string;
}

interface BoxComponent {
  id: string;
  giftBoxId: string;
  productId: string;
  productName: string;
  productSKU: string;
  productPrice: number;
  quantity: number;
}

interface Hamper {
  id: string;
  code: string;
  name: string;
  description: string;
  basePrice: number;
  isActive: boolean;
  categoryId: string;
  categoryName: string;
  giftBoxComponentConfigId: string | null;
  componentConfigName: string | null;
  createdAt: string;
  updatedAt: string | null;
  images: HamperImage[];
  boxComponents: BoxComponent[];
}

interface AvailableProduct {
  id: string;
  name: string;
  sku: string;
  price: number;
  category: string;
}

function mapToHamper(g: GiftBoxResponse): Hamper {
  return {
    id: g.id,
    code: g.code,
    name: g.name,
    description: g.description,
    basePrice: g.basePrice,
    isActive: g.isActive,
    categoryId: g.categoryId,
    categoryName: g.categoryName || "",
    giftBoxComponentConfigId: g.giftBoxComponentConfigId || null,
    componentConfigName: g.componentConfigName || null,
    createdAt: g.createdAt,
    updatedAt: g.updatedAt || null,
    images: (g.images || []).map((img) => ({
      id: img.id,
      url: img.url,
      isMain: img.isMain,
      displayOrder: 0,
      productId: null,
      giftBoxId: g.id,
    })),
    boxComponents: (g.boxComponents || []).map((c) => ({
      id: c.id,
      giftBoxId: c.giftBoxId,
      productId: c.productId,
      productName: c.productName || "",
      productSKU: c.productSKU || "",
      productPrice: c.productPrice,
      quantity: c.quantity,
    })),
  };
}

function sortByDate(list: Hamper[]): Hamper[] {
  return [...list].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

const ITEMS_PER_PAGE = 10;

interface HampersManagementProps {
  onNavigate?: (page: string) => void;
}

export function HampersManagement({ onNavigate }: HampersManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [hamperToDelete, setHamperToDelete] = useState<string | null>(null);
  const [selectedHamper, setSelectedHamper] = useState<Hamper | null>(null);

  const [hampers, setHampers] = useState<Hamper[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    basePrice: "",
    categoryId: "",
    giftBoxComponentConfigId: "",
    isActive: true,
    images: [] as string[],
    boxComponents: [] as BoxComponent[],
  });

  // Temporary state for adding new box component
  const [newComponent, setNewComponent] = useState({
    productId: "",
    quantity: "",
  });

  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [availableProducts, setAvailableProducts] = useState<AvailableProduct[]>([]);

  const filteredProducts = availableProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearchTerm.toLowerCase())
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [hampersRes, categoriesRes, productsRes] = await Promise.all([
          giftBoxService.getAll(),
          categoryService.getAll(),
          productService.getAll(),
        ]);
        if (hampersRes.data.success) {
          setHampers(sortByDate(hampersRes.data.data.map(mapToHamper)));
        }
        if (categoriesRes.data.success) {
          setCategories(
            categoriesRes.data.data.map((c) => ({ id: c.id, name: c.name }))
          );
        }
        if (productsRes.data.success) {
          setAvailableProducts(
            productsRes.data.data.map((p) => ({
              id: p.id,
              name: p.name,
              sku: p.sku,
              price: p.price,
              category: p.categoryName || "",
            }))
          );
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Chưa cập nhật";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Reset to page 1 when filters change
  useEffect(() => { setCurrentPage(1); }, [searchTerm, filterCategory, filterStatus]);

  // Filter logic
  const filteredHampers = hampers.filter((hamper) => {
    const matchesSearch =
      hamper.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hamper.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hamper.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === "all" || hamper.categoryId === filterCategory;

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && hamper.isActive) ||
      (filterStatus === "inactive" && !hamper.isActive);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredHampers.length / ITEMS_PER_PAGE));
  const paginatedHampers = filteredHampers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleToggleActive = async (id: string) => {
    const hamper = hampers.find((h) => h.id === id);
    if (!hamper) return;
    try {
      await giftBoxService.update(id, {
        code: hamper.code,
        name: hamper.name,
        description: hamper.description,
        basePrice: hamper.basePrice,
        isActive: !hamper.isActive,
        categoryId: hamper.categoryId,
        giftBoxComponentConfigId: hamper.giftBoxComponentConfigId || undefined,
        items: hamper.boxComponents.map((c) => ({
          productId: c.productId,
          quantity: c.quantity,
        })),
        imageUrls: hamper.images.map((img) => img.url),
      });
      setHampers(
        hampers.map((h) =>
          h.id === id ? { ...h, isActive: !h.isActive } : h
        )
      );
    } catch (err) {
      console.error("Failed to toggle active state:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await giftBoxService.delete(id);
      setHampers(hampers.filter((hamper) => hamper.id !== id));
    } catch (err) {
      console.error("Failed to delete hamper:", err);
    }
  };

  const handleEdit = (hamper: Hamper) => {
    setSelectedHamper(hamper);
    setFormData({
      code: hamper.code,
      name: hamper.name,
      description: hamper.description,
      basePrice: hamper.basePrice.toString(),
      categoryId: hamper.categoryId,
      giftBoxComponentConfigId: hamper.giftBoxComponentConfigId || "",
      isActive: hamper.isActive,
      images: hamper.images.map((img) => img.url),
      boxComponents: hamper.boxComponents,
    });
    setIsEditModalOpen(true);
  };

  const handleViewDetail = (hamper: Hamper) => {
    setSelectedHamper(hamper);
    setIsDetailModalOpen(true);
  };

  const handleAddNew = () => {
    setFormData({
      code: "",
      name: "",
      description: "",
      basePrice: "",
      categoryId: "",
      giftBoxComponentConfigId: "",
      isActive: true,
      images: [],
      boxComponents: [],
    });
    setIsAddModalOpen(true);
  };

  const handleSaveNew = async () => {
    try {
      setSaving(true);
      const res = await giftBoxService.create({
        code: formData.code,
        name: formData.name,
        description: formData.description,
        basePrice: parseFloat(formData.basePrice),
        isActive: formData.isActive,
        categoryId: formData.categoryId,
        giftBoxComponentConfigId: formData.giftBoxComponentConfigId || undefined,
        items: formData.boxComponents.map((c) => ({
          productId: c.productId,
          quantity: c.quantity,
        })),
        imageUrls: formData.images,
      });
      if (res.data.success) {
        setHampers(sortByDate([mapToHamper(res.data.data), ...hampers]));
        setIsAddModalOpen(false);
      }
    } catch (err) {
      console.error("Failed to save hamper:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedHamper) return;
    try {
      setSaving(true);
      const res = await giftBoxService.update(selectedHamper.id, {
        code: formData.code,
        name: formData.name,
        description: formData.description,
        basePrice: parseFloat(formData.basePrice),
        isActive: formData.isActive,
        categoryId: formData.categoryId,
        giftBoxComponentConfigId: formData.giftBoxComponentConfigId || undefined,
        items: formData.boxComponents.map((c) => ({
          productId: c.productId,
          quantity: c.quantity,
        })),
        imageUrls: formData.images,
      });
      if (res.data.success) {
        setHampers(
          sortByDate(hampers.map((h) =>
            h.id === selectedHamper.id ? mapToHamper(res.data.data) : h
          ))
        );
        setIsEditModalOpen(false);
      }
    } catch (err) {
      console.error("Failed to update hamper:", err);
    } finally {
      setSaving(false);
    }
  };

  const stats = {
    total: hampers.length,
    active: hampers.filter((h) => h.isActive).length,
    inactive: hampers.filter((h) => !h.isActive).length,
    totalValue: hampers.reduce((sum, h) => sum + h.basePrice, 0),
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-3xl font-bold text-gray-900 mb-2"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Quản Lý Giỏ Quà
        </h1>
        <p className="text-gray-600">
          Quản lý danh sách giỏ quà Tết cao cấp
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Tổng Giỏ Quà</p>
              <p
                className="text-3xl font-bold text-gray-900"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {stats.total}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Đang Hoạt Động</p>
              <p
                className="text-3xl font-bold text-green-600"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {stats.active}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <ToggleRight className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Tạm Dừng</p>
              <p
                className="text-3xl font-bold text-gray-600"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {stats.inactive}
              </p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <ToggleLeft className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Tổng Giá Trị</p>
              <p
                className="text-2xl font-bold text-[#D4AF37]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {formatCurrency(stats.totalValue)}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-[#D4AF37]" />
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Tìm kiếm theo mã, tên, mô tả..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            >
              <option value="all">Tất cả danh mục</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Tạm dừng</option>
            </select>

            <Button
              onClick={handleAddNew}
              className="bg-gradient-to-r from-[#B71C1C] to-[#8B1538] hover:from-[#8B1538] hover:to-[#B71C1C] text-white"
            >
              <Plus className="h-5 w-5 mr-2" />
              Thêm Giỏ Quà
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Hình Ảnh
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Mã & Tên
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Danh Mục
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Giá Gốc
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Trạng Thái
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Ngày Tạo
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">
                  Hành Động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedHampers.map((hamper) => (
                <tr
                  key={hamper.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                      {hamper.images.length > 0 ? (
                        <img
                          src={hamper.images[0].url}
                          alt={hamper.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {hamper.name}
                      </p>
                      <p className="text-sm text-gray-500">{hamper.code}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {hamper.categoryName}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(hamper.basePrice)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleActive(hamper.id)}
                      className="flex items-center gap-2"
                    >
                      {hamper.isActive ? (
                        <>
                          <ToggleRight className="h-6 w-6 text-green-600" />
                          <span className="text-sm font-medium text-green-600">
                            Active
                          </span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="h-6 w-6 text-gray-400" />
                          <span className="text-sm font-medium text-gray-500">
                            Inactive
                          </span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      {formatDate(hamper.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleViewDetail(hamper)}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye className="h-5 w-5 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleEdit(hamper)}
                        className="p-2 hover:bg-yellow-50 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit className="h-5 w-5 text-yellow-600" />
                      </button>
                      <button
                        onClick={() => {
                          setHamperToDelete(hamper.id);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="h-5 w-5 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Loading/Empty State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Đang tải dữ liệu...</p>
          </div>
        )}
        {!loading && filteredHampers.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Không tìm thấy giỏ quà nào</p>
          </div>
        )}

        {/* Pagination */}
        {!loading && filteredHampers.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Hiển thị{" "}
              <span className="font-semibold">
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredHampers.length)}
              </span>{" "}
              /{" "}
              <span className="font-semibold">{filteredHampers.length}</span> sản phẩm
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                Trước
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={currentPage === page ? "bg-[#B71C1C] text-white border-[#B71C1C]" : ""}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                Sau
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="bg-gradient-to-r from-[#B71C1C] to-[#8B1538] px-6 py-5 flex items-center justify-between sticky top-0 z-10 rounded-t-2xl">
              <h3
                className="text-2xl font-bold text-white"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Thêm Giỏ Quà Mới
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mã Sản Phẩm *
                  </label>
                  <Input
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                    placeholder="G8006"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Giá Gốc (VNĐ) *
                  </label>
                  <Input
                    type="number"
                    value={formData.basePrice}
                    onChange={(e) =>
                      setFormData({ ...formData, basePrice: e.target.value })
                    }
                    placeholder="3450000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tên Giỏ Quà *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Giỏ Thực Phẩm Hảo Hạng"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Danh Mục *
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) =>
                    setFormData({ ...formData, categoryId: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mô Tả *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  placeholder="Mô tả chi tiết sản phẩm..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Gift Box Component Config ID (Optional)
                </label>
                <Input
                  value={formData.giftBoxComponentConfigId}
                  onChange={(e) =>
                    setFormData({ ...formData, giftBoxComponentConfigId: e.target.value })
                  }
                  placeholder="3fa85f64-5717-4562-b3fc-2c963f66afa6"
                />
                <p className="text-xs text-gray-500 mt-1">UUID của cấu hình component (để trống nếu không có)</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Trạng Thái
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      setFormData({ ...formData, isActive: !formData.isActive })
                    }
                    className="flex items-center gap-2"
                  >
                    {formData.isActive ? (
                      <>
                        <ToggleRight className="h-8 w-8 text-green-600" />
                        <span className="font-medium text-green-600">
                          Đang hoạt động
                        </span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="h-8 w-8 text-gray-400" />
                        <span className="font-medium text-gray-500">
                          Tạm dừng
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Items (Products in Gift Box) */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Sản Phẩm Trong Giỏ (Items) *
                  </label>
                  <span className="text-xs text-gray-500">
                    {formData.boxComponents.length} sản phẩm
                  </span>
                </div>

                {/* Add Item Form */}
                <div className="bg-blue-50 p-4 rounded-lg mb-3 space-y-3">
                  <p className="text-sm font-semibold text-gray-700">Thêm Sản Phẩm Mới</p>
                  
                  {/* Search Products */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Tìm kiếm và chọn sản phẩm *
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        value={productSearchTerm}
                        onChange={(e) => setProductSearchTerm(e.target.value)}
                        placeholder="Tìm theo tên, SKU, danh mục..."
                        className="text-sm pl-10"
                      />
                    </div>
                    
                    {/* Product Selection Dropdown */}
                    {productSearchTerm && filteredProducts.length > 0 && (
                      <div className="mt-2 max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg">
                        {filteredProducts.map((product) => (
                          <button
                            key={product.id}
                            type="button"
                            onClick={() => {
                              setNewComponent({ ...newComponent, productId: product.id });
                              setProductSearchTerm(product.name);
                            }}
                            className="w-full px-3 py-3 hover:bg-blue-50 transition-colors text-left border-b border-gray-100 last:border-0"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                                <div className="flex items-center gap-3 mt-1">
                                  <span className="text-xs text-gray-600">SKU: {product.sku}</span>
                                  <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded">
                                    {product.category}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-3 text-right">
                                <p className="text-sm font-bold text-[#D4AF37]">
                                  {formatCurrency(product.price)}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {productSearchTerm && filteredProducts.length === 0 && (
                      <div className="mt-2 p-4 bg-white border border-gray-300 rounded-lg text-center">
                        <p className="text-sm text-gray-500">Không tìm thấy sản phẩm nào</p>
                      </div>
                    )}
                    
                    {/* Selected Product Display */}
                    {newComponent.productId && (
                      <div className="mt-2 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-300 rounded-lg">
                        {(() => {
                          const selectedProduct = availableProducts.find(p => p.id === newComponent.productId);
                          return selectedProduct ? (
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-bold text-gray-900">{selectedProduct.name}</p>
                                <p className="text-xs text-gray-600">SKU: {selectedProduct.sku}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-[#D4AF37]">
                                  {formatCurrency(selectedProduct.price)}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setNewComponent({ ...newComponent, productId: "" });
                                    setProductSearchTerm("");
                                  }}
                                  className="p-1 hover:bg-red-100 rounded"
                                >
                                  <X className="h-4 w-4 text-red-600" />
                                </button>
                              </div>
                            </div>
                          ) : null;
                        })()}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Số Lượng *
                    </label>
                    <Input
                      type="number"
                      value={newComponent.quantity}
                      onChange={(e) =>
                        setNewComponent({ ...newComponent, quantity: e.target.value })
                      }
                      placeholder="1"
                      className="text-sm"
                      min="1"
                    />
                  </div>
                  
                  <Button
                    type="button"
                    onClick={() => {
                      if (newComponent.productId && newComponent.quantity) {
                        const selectedProduct = availableProducts.find(p => p.id === newComponent.productId);
                        if (selectedProduct) {
                          const newBoxComponent: BoxComponent = {
                            id: `temp-${Date.now()}`,
                            giftBoxId: "temp",
                            productId: selectedProduct.id,
                            productName: selectedProduct.name,
                            productSKU: selectedProduct.sku,
                            productPrice: selectedProduct.price,
                            quantity: parseInt(newComponent.quantity),
                          };
                          setFormData({
                            ...formData,
                            boxComponents: [...formData.boxComponents, newBoxComponent],
                          });
                          setNewComponent({ productId: "", quantity: "" });
                          setProductSearchTerm("");
                        }
                      }
                    }}
                    disabled={!newComponent.productId || !newComponent.quantity}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm Sản Phẩm
                  </Button>
                </div>

                {/* Items List */}
                {formData.boxComponents.length > 0 && (
                  <div className="space-y-2">
                    {formData.boxComponents.map((item, index) => (
                      <div
                        key={item.id}
                        className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-start gap-3 flex-1">
                            <Package className="h-5 w-5 text-purple-600 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm font-bold text-gray-900">{item.productName}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs px-2 py-0.5 bg-purple-600 text-white rounded font-semibold">
                                  {item.productSKU}
                                </span>
                                <span className="text-xs text-gray-600">
                                  x{item.quantity}
                                </span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              setFormData({
                                ...formData,
                                boxComponents: formData.boxComponents.filter((_, i) => i !== index),
                              })
                            }
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between pl-8">
                          <span className="text-xs text-gray-500">Đơn giá: {formatCurrency(item.productPrice)}</span>
                          <span className="text-sm font-bold text-[#B71C1C]">
                            Tổng: {formatCurrency(item.productPrice * item.quantity)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {formData.boxComponents.length === 0 && (
                  <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <Package className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Chưa có sản phẩm nào trong giỏ</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hình Ảnh Sản Phẩm (imageUrls)
                </label>
                
                {/* Upload from device */}
                <div className="mb-3">
                  <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#D4AF37] hover:bg-yellow-50 transition-all">
                    <Upload className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-600">
                      {uploadingImages ? "Đang tải lên Cloudinary..." : "Tải ảnh từ máy"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      disabled={uploadingImages}
                      onChange={async (e) => {
                        const files = Array.from(e.target.files || []);
                        if (!files.length) return;
                        e.target.value = "";
                        setUploadingImages(true);
                        try {
                          const urls = await uploadService.uploadMultipleImages(files);
                          setFormData((prev) => ({
                            ...prev,
                            images: [...prev.images, ...urls],
                          }));
                        } catch (err) {
                          console.error("Upload failed:", err);
                        } finally {
                          setUploadingImages(false);
                        }
                      }}
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-1">Chọn một hoặc nhiều ảnh từ máy (JPG, PNG, GIF...)</p>
                </div>
                
                {/* Or enter URL */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-white text-gray-500">hoặc</span>
                  </div>
                </div>
                
                <div className="mt-3">
                  <Input
                    placeholder="https://images.unsplash.com/photo-..."
                    onBlur={(e) => {
                      if (e.target.value) {
                        setFormData({
                          ...formData,
                          images: [...formData.images, e.target.value],
                        });
                        e.target.value = "";
                      }
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-1">Nhập URL hình ảnh và nhấn Tab/Enter để thêm</p>
                </div>
                {formData.images.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {formData.images.map((url, index) => (
                      <div
                        key={index}
                        className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200"
                      >
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() =>
                            setFormData({
                              ...formData,
                              images: formData.images.filter(
                                (_, i) => i !== index
                              ),
                            })
                          }
                          className="absolute top-1 right-1 p-1 bg-red-500 rounded-full"
                        >
                          <X className="h-3 w-3 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => setIsAddModalOpen(false)}
              >
                Hủy
              </Button>
              <Button
                onClick={handleSaveNew}
                disabled={saving || uploadingImages}
                className="bg-gradient-to-r from-[#B71C1C] to-[#8B1538] hover:from-[#8B1538] hover:to-[#B71C1C] text-white disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Đang lưu..." : "Lưu Giỏ Quà"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedHamper && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="bg-gradient-to-r from-[#B71C1C] to-[#8B1538] px-6 py-5 flex items-center justify-between sticky top-0 z-10 rounded-t-2xl">
              <h3
                className="text-2xl font-bold text-white"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Chỉnh Sửa Giỏ Quà
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mã Sản Phẩm *
                  </label>
                  <Input
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Giá Gốc (VNĐ) *
                  </label>
                  <Input
                    type="number"
                    value={formData.basePrice}
                    onChange={(e) =>
                      setFormData({ ...formData, basePrice: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tên Giỏ Quà *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Danh Mục *
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) =>
                    setFormData({ ...formData, categoryId: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mô Tả *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Gift Box Component Config ID (Optional)
                </label>
                <Input
                  value={formData.giftBoxComponentConfigId}
                  onChange={(e) =>
                    setFormData({ ...formData, giftBoxComponentConfigId: e.target.value })
                  }
                  placeholder="3fa85f64-5717-4562-b3fc-2c963f66afa6"
                />
                <p className="text-xs text-gray-500 mt-1">UUID của cấu hình component (để trống nếu không có)</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Trạng Thái
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      setFormData({ ...formData, isActive: !formData.isActive })
                    }
                    className="flex items-center gap-2"
                  >
                    {formData.isActive ? (
                      <>
                        <ToggleRight className="h-8 w-8 text-green-600" />
                        <span className="font-medium text-green-600">
                          Đang hoạt động
                        </span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="h-8 w-8 text-gray-400" />
                        <span className="font-medium text-gray-500">
                          Tạm dừng
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Items (Products in Gift Box) - EDIT MODE */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Sản Phẩm Trong Giỏ (Items) *
                  </label>
                  <span className="text-xs text-gray-500">
                    {formData.boxComponents.length} sản phẩm
                  </span>
                </div>

                {/* Add Item Form */}
                <div className="bg-blue-50 p-4 rounded-lg mb-3 space-y-3">
                  <p className="text-sm font-semibold text-gray-700">Thêm Sản Phẩm Mới</p>
                  
                  {/* Search Products */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Tìm kiếm và chọn sản phẩm *
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        value={productSearchTerm}
                        onChange={(e) => setProductSearchTerm(e.target.value)}
                        placeholder="Tìm theo tên, SKU, danh mục..."
                        className="text-sm pl-10"
                      />
                    </div>
                    
                    {/* Product Selection Dropdown */}
                    {productSearchTerm && filteredProducts.length > 0 && (
                      <div className="mt-2 max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg">
                        {filteredProducts.map((product) => (
                          <button
                            key={product.id}
                            type="button"
                            onClick={() => {
                              setNewComponent({ ...newComponent, productId: product.id });
                              setProductSearchTerm(product.name);
                            }}
                            className="w-full px-3 py-3 hover:bg-blue-50 transition-colors text-left border-b border-gray-100 last:border-0"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                                <div className="flex items-center gap-3 mt-1">
                                  <span className="text-xs text-gray-600">SKU: {product.sku}</span>
                                  <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded">
                                    {product.category}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-3 text-right">
                                <p className="text-sm font-bold text-[#D4AF37]">
                                  {formatCurrency(product.price)}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {productSearchTerm && filteredProducts.length === 0 && (
                      <div className="mt-2 p-4 bg-white border border-gray-300 rounded-lg text-center">
                        <p className="text-sm text-gray-500">Không tìm thấy sản phẩm nào</p>
                      </div>
                    )}
                    
                    {/* Selected Product Display */}
                    {newComponent.productId && (
                      <div className="mt-2 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-300 rounded-lg">
                        {(() => {
                          const selectedProduct = availableProducts.find(p => p.id === newComponent.productId);
                          return selectedProduct ? (
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-bold text-gray-900">{selectedProduct.name}</p>
                                <p className="text-xs text-gray-600">SKU: {selectedProduct.sku}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-[#D4AF37]">
                                  {formatCurrency(selectedProduct.price)}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setNewComponent({ ...newComponent, productId: "" });
                                    setProductSearchTerm("");
                                  }}
                                  className="p-1 hover:bg-red-100 rounded"
                                >
                                  <X className="h-4 w-4 text-red-600" />
                                </button>
                              </div>
                            </div>
                          ) : null;
                        })()}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Số Lượng *
                    </label>
                    <Input
                      type="number"
                      value={newComponent.quantity}
                      onChange={(e) =>
                        setNewComponent({ ...newComponent, quantity: e.target.value })
                      }
                      placeholder="1"
                      className="text-sm"
                      min="1"
                    />
                  </div>
                  
                  <Button
                    type="button"
                    onClick={() => {
                      if (newComponent.productId && newComponent.quantity) {
                        const selectedProduct = availableProducts.find(p => p.id === newComponent.productId);
                        if (selectedProduct) {
                          const newBoxComponent: BoxComponent = {
                            id: `temp-${Date.now()}`,
                            giftBoxId: "temp",
                            productId: selectedProduct.id,
                            productName: selectedProduct.name,
                            productSKU: selectedProduct.sku,
                            productPrice: selectedProduct.price,
                            quantity: parseInt(newComponent.quantity),
                          };
                          setFormData({
                            ...formData,
                            boxComponents: [...formData.boxComponents, newBoxComponent],
                          });
                          setNewComponent({ productId: "", quantity: "" });
                          setProductSearchTerm("");
                        }
                      }
                    }}
                    disabled={!newComponent.productId || !newComponent.quantity}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm Sản Phẩm
                  </Button>
                </div>

                {/* Items List */}
                {formData.boxComponents.length > 0 && (
                  <div className="space-y-2">
                    {formData.boxComponents.map((item, index) => (
                      <div
                        key={item.id}
                        className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-start gap-3 flex-1">
                            <Package className="h-5 w-5 text-purple-600 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm font-bold text-gray-900">{item.productName}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs px-2 py-0.5 bg-purple-600 text-white rounded font-semibold">
                                  {item.productSKU}
                                </span>
                                <span className="text-xs text-gray-600">
                                  x{item.quantity}
                                </span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              setFormData({
                                ...formData,
                                boxComponents: formData.boxComponents.filter((_, i) => i !== index),
                              })
                            }
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between pl-8">
                          <span className="text-xs text-gray-500">Đơn giá: {formatCurrency(item.productPrice)}</span>
                          <span className="text-sm font-bold text-[#B71C1C]">
                            Tổng: {formatCurrency(item.productPrice * item.quantity)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {formData.boxComponents.length === 0 && (
                  <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <Package className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Chưa có sản phẩm nào trong giỏ</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hình Ảnh Sản Phẩm (imageUrls)
                </label>
                
                {/* Upload from device */}
                <div className="mb-3">
                  <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#D4AF37] hover:bg-yellow-50 transition-all">
                    <Upload className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-600">
                      {uploadingImages ? "Đang tải lên Cloudinary..." : "Tải ảnh từ máy"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      disabled={uploadingImages}
                      onChange={async (e) => {
                        const files = Array.from(e.target.files || []);
                        if (!files.length) return;
                        e.target.value = "";
                        setUploadingImages(true);
                        try {
                          const urls = await uploadService.uploadMultipleImages(files);
                          setFormData((prev) => ({
                            ...prev,
                            images: [...prev.images, ...urls],
                          }));
                        } catch (err) {
                          console.error("Upload failed:", err);
                        } finally {
                          setUploadingImages(false);
                        }
                      }}
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-1">Chọn một hoặc nhiều ảnh từ máy (JPG, PNG, GIF...)</p>
                </div>
                
                {/* Or enter URL */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-white text-gray-500">hoặc</span>
                  </div>
                </div>
                
                <div className="mt-3">
                  <Input
                    placeholder="https://images.unsplash.com/photo-..."
                    onBlur={(e) => {
                      if (e.target.value) {
                        setFormData({
                          ...formData,
                          images: [...formData.images, e.target.value],
                        });
                        e.target.value = "";
                      }
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-1">Nhập URL hình ảnh và nhấn Tab/Enter để thêm</p>
                </div>
                
                {formData.images.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {formData.images.map((url, index) => (
                      <div
                        key={index}
                        className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200"
                      >
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() =>
                            setFormData({
                              ...formData,
                              images: formData.images.filter(
                                (_, i) => i !== index
                              ),
                            })
                          }
                          className="absolute top-1 right-1 p-1 bg-red-500 rounded-full"
                        >
                          <X className="h-3 w-3 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
              >
                Hủy
              </Button>
              <Button
                onClick={handleSaveEdit}
                disabled={saving || uploadingImages}
                className="bg-gradient-to-r from-[#B71C1C] to-[#8B1538] hover:from-[#8B1538] hover:to-[#B71C1C] text-white disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Đang lưu..." : "Cập Nhật"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {isDetailModalOpen && selectedHamper && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="bg-gradient-to-r from-[#B71C1C] to-[#8B1538] px-6 py-5 flex items-center justify-between sticky top-0 z-10 rounded-t-2xl">
              <h3
                className="text-2xl font-bold text-white"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Chi Tiết Giỏ Quà
              </h3>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Images */}
              {selectedHamper.images.length > 0 && (
                <div>
                  <img
                    src={selectedHamper.images[0].url}
                    alt={selectedHamper.name}
                    className="w-full h-64 object-cover rounded-xl"
                  />
                </div>
              )}

              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Mã Sản Phẩm</p>
                  <p className="text-lg font-bold text-gray-900">
                    {selectedHamper.code}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">ID</p>
                  <p className="text-sm font-mono text-gray-700">
                    {selectedHamper.id}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Tên Giỏ Quà</p>
                <p
                  className="text-2xl font-bold text-gray-900"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {selectedHamper.name}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Mô Tả</p>
                <p className="text-gray-700 leading-relaxed">
                  {selectedHamper.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Giá Gốc</p>
                  <p className="text-2xl font-bold text-[#D4AF37]">
                    {formatCurrency(selectedHamper.basePrice)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Danh Mục</p>
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {selectedHamper.categoryName}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Trạng Thái</p>
                  <div className="flex items-center gap-2">
                    {selectedHamper.isActive ? (
                      <>
                        <ToggleRight className="h-6 w-6 text-green-600" />
                        <span className="font-medium text-green-600">
                          Đang hoạt động
                        </span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="h-6 w-6 text-gray-400" />
                        <span className="font-medium text-gray-500">
                          Tạm dừng
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Category ID</p>
                  <p className="text-sm font-mono text-gray-700">
                    {selectedHamper.categoryId}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Component Config ID
                  </p>
                  <p className="text-sm font-mono text-gray-700">
                    {selectedHamper.giftBoxComponentConfigId || "null"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Component Config Name
                  </p>
                  <p className="text-sm text-gray-700">
                    {selectedHamper.componentConfigName || "null"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Ngày Tạo</p>
                  <p className="text-sm text-gray-900">
                    {formatDate(selectedHamper.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Ngày Cập Nhật</p>
                  <p className="text-sm text-gray-900">
                    {formatDate(selectedHamper.updatedAt)}
                  </p>
                </div>
              </div>

              {/* Images Details */}
              {selectedHamper.images.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    Thông Tin Hình Ảnh
                  </p>
                  <div className="space-y-3">
                    {selectedHamper.images.map((img, index) => (
                      <div
                        key={img.id}
                        className="p-4 bg-gray-50 rounded-lg space-y-2"
                      >
                        <div className="flex items-center gap-2">
                          <ImageIcon className="h-4 w-4 text-gray-600" />
                          <p className="text-sm font-medium text-gray-900">
                            Image #{index + 1}
                          </p>
                          {img.isMain && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs font-semibold">
                              Main
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-gray-600">ID:</span>{" "}
                            <span className="font-mono">{img.id}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Display Order:</span>{" "}
                            {img.displayOrder}
                          </div>
                          <div className="col-span-2">
                            <span className="text-gray-600">URL:</span>{" "}
                            <a
                              href={img.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline break-all"
                            >
                              {img.url}
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Box Components */}
              {selectedHamper.boxComponents.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    Sản Phẩm Trong Giỏ (Box Components)
                  </p>
                  <div className="space-y-3">
                    {selectedHamper.boxComponents.map((component, index) => (
                      <div
                        key={component.id}
                        className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 space-y-3"
                      >
                        <div className="flex items-center gap-2">
                          <Package className="h-5 w-5 text-blue-600" />
                          <p className="text-base font-bold text-gray-900">
                            {component.productName}
                          </p>
                          <span className="ml-auto px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-bold">
                            x{component.quantity}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="bg-white/70 p-2 rounded">
                            <span className="text-gray-600 font-medium">ID:</span>{" "}
                            <span className="font-mono text-xs text-gray-800">
                              {component.id}
                            </span>
                          </div>
                          <div className="bg-white/70 p-2 rounded">
                            <span className="text-gray-600 font-medium">Gift Box ID:</span>{" "}
                            <span className="font-mono text-xs text-gray-800">
                              {component.giftBoxId}
                            </span>
                          </div>
                          <div className="bg-white/70 p-2 rounded">
                            <span className="text-gray-600 font-medium">Product ID:</span>{" "}
                            <span className="font-mono text-xs text-gray-800">
                              {component.productId}
                            </span>
                          </div>
                          <div className="bg-white/70 p-2 rounded">
                            <span className="text-gray-600 font-medium">SKU:</span>{" "}
                            <span className="font-bold text-blue-700">
                              {component.productSKU}
                            </span>
                          </div>
                          <div className="bg-white/70 p-2 rounded">
                            <span className="text-gray-600 font-medium">Giá:</span>{" "}
                            <span className="font-bold text-[#D4AF37]">
                              {formatCurrency(component.productPrice)}
                            </span>
                          </div>
                          <div className="bg-white/70 p-2 rounded">
                            <span className="text-gray-600 font-medium">Số lượng:</span>{" "}
                            <span className="font-bold text-green-600">
                              {component.quantity}
                            </span>
                          </div>
                        </div>
                        <div className="bg-white/70 p-2 rounded flex items-center justify-between">
                          <span className="text-gray-600 font-medium">Thành tiền:</span>
                          <span className="text-lg font-bold text-[#B71C1C]">
                            {formatCurrency(component.productPrice * component.quantity)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-300">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-700">
                        Tổng giá trị các sản phẩm:
                      </span>
                      <span
                        className="text-2xl font-bold text-green-600"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {formatCurrency(
                          selectedHamper.boxComponents.reduce(
                            (sum, c) => sum + c.productPrice * c.quantity,
                            0
                          )
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => setIsDetailModalOpen(false)}
              >
                Đóng
              </Button>
              <Button
                onClick={() => {
                  setIsDetailModalOpen(false);
                  handleEdit(selectedHamper);
                }}
                className="bg-gradient-to-r from-[#B71C1C] to-[#8B1538] hover:from-[#8B1538] hover:to-[#B71C1C] text-white"
              >
                <Edit className="h-4 w-4 mr-2" />
                Chỉnh Sửa
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && hamperToDelete && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full shadow-2xl transform animate-in zoom-in-95 duration-200"
          >
            {/* Icon and Title */}
            <div className="p-6 text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <h3
                className="text-2xl font-bold text-gray-900 mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Xác Nhận Xóa
              </h3>
              <p className="text-gray-600 text-base">
                Bạn có chắc chắn muốn xóa giỏ quà này không?
              </p>
            </div>

            {/* Action Buttons */}
            <div className="bg-gray-50 px-6 py-4 flex gap-3 rounded-b-2xl">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setHamperToDelete(null);
                }}
                className="flex-1 border-gray-300 hover:bg-gray-100"
              >
                Hủy
              </Button>
              <Button
                onClick={() => {
                  if (hamperToDelete) {
                    handleDelete(hamperToDelete);
                  }
                  setIsDeleteModalOpen(false);
                  setHamperToDelete(null);
                }}
                className="flex-1 bg-gradient-to-r from-[#B71C1C] to-[#8B1538] hover:from-[#8B1538] hover:to-[#B71C1C] text-white"
              >
                Xóa
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}