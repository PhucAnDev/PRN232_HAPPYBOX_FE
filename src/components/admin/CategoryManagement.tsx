import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  Edit,
  Eye,
  Folder,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import useCatalog from "@/hooks/useCatalog";
import type { CategoryResponse } from "@/services/categoryService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ITEMS_PER_PAGE = 10;

function formatDate(dateString?: string) {
  if (!dateString) return "Chưa cập nhật";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "Không hợp lệ";

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function isSameLocalDate(dateString?: string) {
  if (!dateString) return false;

  const date = new Date(dateString);
  const today = new Date();

  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

function getErrorMessage(error: unknown, fallback: string) {
  if (typeof error === "string") return error;

  if (
    error &&
    typeof error === "object" &&
    "response" in error &&
    error.response &&
    typeof error.response === "object" &&
    "data" in error.response &&
    error.response.data &&
    typeof error.response.data === "object" &&
    "message" in error.response.data &&
    typeof error.response.data.message === "string"
  ) {
    return error.response.data.message;
  }

  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return fallback;
}

export function CategoryManagement() {
  const {
    categories,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCatalog();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryResponse | null>(
    null,
  );
  const [formData, setFormData] = useState({
    name: "",
  });

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      await fetchCategories();
    } catch (err) {
      setError(getErrorMessage(err, "Không thể tải danh sách danh mục."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    if (
      isAddDialogOpen ||
      isEditDialogOpen ||
      isViewDialogOpen ||
      isDeleteDialogOpen
    ) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isAddDialogOpen, isEditDialogOpen, isViewDialogOpen, isDeleteDialogOpen]);

  const sortedCategories = useMemo(
    () =>
      [...categories].sort(
        (left, right) =>
          new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
      ),
    [categories],
  );

  const filteredCategories = useMemo(
    () =>
      sortedCategories.filter((category) => {
        const query = searchQuery.trim().toLowerCase();
        return !query || category.name.toLowerCase().includes(query);
      }),
    [searchQuery, sortedCategories],
  );

  const stats = useMemo(
    () => ({
      totalCategories: categories.length,
      visibleCategories: filteredCategories.length,
      createdToday: categories.filter((category) =>
        isSameLocalDate(category.createdAt),
      ).length,
      updatedToday: categories.filter((category) =>
        isSameLocalDate(category.updatedAt || category.createdAt),
      ).length,
    }),
    [categories, filteredCategories.length],
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCategories.length / ITEMS_PER_PAGE),
  );

  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const resetForm = () => {
    setFormData({
      name: "",
    });
  };

  const closeAllDialogs = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setIsViewDialogOpen(false);
    setIsDeleteDialogOpen(false);
    setSelectedCategory(null);
    resetForm();
  };

  const openAddDialog = () => {
    setSelectedCategory(null);
    resetForm();
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (category: CategoryResponse) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
    });
    setIsEditDialogOpen(true);
  };

  const handleCreateCategory = async () => {
    const name = formData.name.trim();
    if (!name) {
      toast.error("Vui lòng nhập tên danh mục.");
      return;
    }

    try {
      setSubmitting(true);
      await createCategory({ name });
      await loadCategories();
      toast.success("Thêm danh mục thành công.");
      closeAllDialogs();
    } catch (err) {
      toast.error(getErrorMessage(err, "Không thể thêm danh mục."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateCategory = async () => {
    if (!selectedCategory) return;

    const name = formData.name.trim();
    if (!name) {
      toast.error("Vui lòng nhập tên danh mục.");
      return;
    }

    try {
      setSubmitting(true);
      await updateCategory(selectedCategory.id, { name });
      await loadCategories();
      toast.success("Cập nhật danh mục thành công.");
      closeAllDialogs();
    } catch (err) {
      toast.error(getErrorMessage(err, "Không thể cập nhật danh mục."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    try {
      setSubmitting(true);
      await deleteCategory(selectedCategory.id);
      await loadCategories();
      toast.success("Xóa danh mục thành công.");
      closeAllDialogs();
    } catch (err) {
      toast.error(getErrorMessage(err, "Không thể xóa danh mục."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1
            className="text-4xl font-bold text-gray-900"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Quản Lý Danh Mục
          </h1>
          <p className="mt-2 text-gray-600">
            Quản lý danh mục sản phẩm và cấu trúc phân loại trong hệ thống
          </p>
        </div>

        <Button
          onClick={openAddDialog}
          className="rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8962E] px-6 py-6 font-bold text-white shadow-lg hover:from-[#B8962E] hover:to-[#9A7A25]"
        >
          <Plus className="mr-2 h-5 w-5" />
          Thêm Danh Mục
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="rounded-2xl border-l-4 border-[#B71C1C] bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1 text-sm text-gray-600">Tổng danh mục</p>
              <p className="text-3xl font-bold text-[#B71C1C]">
                {stats.totalCategories}
              </p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#B71C1C]/10">
              <Folder className="h-7 w-7 text-[#B71C1C]" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border-l-4 border-green-500 bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1 text-sm text-gray-600">Đang hiển thị</p>
              <p className="text-3xl font-bold text-green-600">
                {stats.visibleCategories}
              </p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-100">
              <Folder className="h-7 w-7 text-green-600" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border-l-4 border-blue-500 bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1 text-sm text-gray-600">Tạo hôm nay</p>
              <p className="text-3xl font-bold text-blue-600">
                {stats.createdToday}
              </p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100">
              <Calendar className="h-7 w-7 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border-l-4 border-[#D4AF37] bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1 text-sm text-gray-600">Cập nhật hôm nay</p>
              <p className="text-3xl font-bold text-[#D4AF37]">
                {stats.updatedToday}
              </p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#D4AF37]/10">
              <Calendar className="h-7 w-7 text-[#D4AF37]" />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-lg">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Tìm theo tên danh mục..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="py-6 pl-10 rounded-xl border-gray-300"
            />
          </div>

          <Button
            variant="outline"
            className="rounded-xl border-2 px-6 py-6 hover:bg-gray-50"
            onClick={loadCategories}
          >
            <RefreshCw className="mr-2 h-5 w-5" />
            Làm mới
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-4">
          <div className="flex items-center justify-between gap-4">
            <p className="font-medium text-red-700">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={loadCategories}
              className="border-red-300 text-red-700 hover:bg-red-100"
            >
              Thử lại
            </Button>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-b-2 border-[#B71C1C]" />
              <p className="font-medium text-gray-600">Đang tải danh mục...</p>
            </div>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="py-14 text-center">
            <Folder className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <p className="text-lg text-gray-600">Chưa có danh mục phù hợp</p>
          </div>
        ) : (
          <>
            <div className="max-h-[calc(100vh-380px)] overflow-y-auto overflow-x-hidden">
              <Table className="table-fixed [&_th]:px-3 [&_th]:py-4 [&_th]:whitespace-normal [&_th]:break-words [&_td]:px-3 [&_td]:py-4 [&_td]:align-top [&_td]:whitespace-normal [&_td]:break-words">
                <colgroup>
                  <col className="w-[50%]" />
                  <col className="w-[15%]" />
                  <col className="w-[15%]" />
                  <col className="w-[20%]" />
                </colgroup>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-bold">
                      <div className="pl-[52px]">Tên danh mục</div>
                    </TableHead>
                    <TableHead className="text-center font-bold">Ngày tạo</TableHead>
                    <TableHead className="text-center font-bold">Cập nhật</TableHead>
                    <TableHead className="text-center font-bold">
                      Hành động
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedCategories.map((category) => (
                    <TableRow key={category.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#B71C1C]/10">
                            <Folder className="h-5 w-5 text-[#B71C1C]" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {category.name}
                            </p>
                            <p className="text-xs text-gray-500 break-all">
                              {category.id}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDate(category.createdAt)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDate(category.updatedAt || category.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedCategory(category);
                              setIsViewDialogOpen(true);
                            }}
                            className="hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(category)}
                            className="hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedCategory(category);
                              setIsDeleteDialogOpen(true);
                            }}
                            className="hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex flex-col gap-4 border-t border-gray-200 px-6 py-4 lg:flex-row lg:items-center">
              <div className="min-w-0 flex-1 text-sm text-gray-600">
                Hiển thị{" "}
                <span className="font-semibold text-gray-900">
                  {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                </span>{" "}
                đến{" "}
                <span className="font-semibold text-gray-900">
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredCategories.length)}
                </span>{" "}
                trong tổng số{" "}
                <span className="font-semibold text-gray-900">
                  {filteredCategories.length}
                </span>{" "}
                danh mục
              </div>

              <div className="flex items-center gap-2 lg:ml-auto lg:justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((previous) => Math.max(previous - 1, 1))
                  }
                  className="rounded-lg px-3 py-2"
                >
                  ← Trước
                </Button>

                {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      size="sm"
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => setCurrentPage(page)}
                      className={
                        currentPage === page
                          ? "rounded-lg bg-[#D4AF37] px-3 py-2 text-white hover:bg-[#B8962E]"
                          : "rounded-lg px-3 py-2"
                      }
                    >
                      {page}
                    </Button>
                  ),
                )}

                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((previous) => Math.min(previous + 1, totalPages))
                  }
                  className="rounded-lg px-3 py-2"
                >
                  Sau →
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {(isAddDialogOpen || isEditDialogOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeAllDialogs} />
          <div
            className="relative z-[51] flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg bg-white shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeAllDialogs}
              className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center text-3xl text-white hover:text-gray-200"
              aria-label="Đóng"
            >
              ×
            </button>

            <div className="shrink-0 bg-gradient-to-r from-[#B71C1C] to-[#8B1538] px-6 py-6 text-white">
              <h2
                className="mb-2 text-2xl font-semibold"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {isEditDialogOpen ? "Cập Nhật Danh Mục" : "Thêm Danh Mục Mới"}
              </h2>
              <p className="text-sm text-white/90">
                Điền thông tin để quản lý cấu trúc danh mục sản phẩm
              </p>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto p-6">
              <div className="grid gap-2">
                <Label htmlFor="category-name" className="font-semibold">
                  Tên danh mục <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="category-name"
                  placeholder="Ví dụ: Quà Tết Cao Cấp"
                  value={formData.name}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      name: event.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="flex shrink-0 justify-end gap-2 border-t border-gray-200 bg-white px-6 py-4">
              <Button variant="outline" onClick={closeAllDialogs} disabled={submitting}>
                Hủy
              </Button>
              <Button
                onClick={
                  isEditDialogOpen ? handleUpdateCategory : handleCreateCategory
                }
                disabled={submitting}
                className="min-w-[150px] bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-white hover:from-[#B8962E] hover:to-[#9A7A25]"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang lưu...
                  </>
                ) : isEditDialogOpen ? (
                  "Cập Nhật"
                ) : (
                  "Thêm Danh Mục"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {isViewDialogOpen && selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeAllDialogs} />
          <div
            className="relative z-[51] flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg bg-white shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeAllDialogs}
              className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center text-3xl text-white hover:text-gray-200"
              aria-label="Đóng"
            >
              ×
            </button>

            <div className="shrink-0 bg-gradient-to-r from-[#B71C1C] to-[#8B1538] px-6 py-6 text-white">
              <h2
                className="mb-2 text-2xl font-semibold"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Chi Tiết Danh Mục
              </h2>
              <p className="text-sm text-white/90">
                Thông tin chi tiết của danh mục đang quản lý
              </p>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto p-6">
              <div className="rounded-2xl bg-gradient-to-r from-[#B71C1C] to-[#8B1538] p-6 text-center text-white">
                <div className="mb-2 text-sm opacity-90">Tên danh mục</div>
                <div
                  className="text-4xl font-bold"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {selectedCategory.name}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="mb-1 text-sm text-gray-600">Ngày tạo</div>
                  <div className="font-semibold">
                    {formatDate(selectedCategory.createdAt)}
                  </div>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="mb-1 text-sm text-gray-600">Cập nhật</div>
                  <div className="font-semibold">
                    {formatDate(selectedCategory.updatedAt || selectedCategory.createdAt)}
                  </div>
                </div>
              </div>

              <div className="rounded-lg border-l-4 border-blue-400 bg-blue-50 p-4">
                <div className="mb-2 text-sm font-semibold text-blue-900">
                  Mã danh mục
                </div>
                <div className="break-all text-blue-800">{selectedCategory.id}</div>
              </div>
            </div>

            <div className="flex shrink-0 justify-end gap-2 border-t border-gray-200 bg-white px-6 py-4">
              <Button variant="outline" onClick={closeAllDialogs}>
                Đóng
              </Button>
              <Button
                onClick={() => {
                  setIsViewDialogOpen(false);
                  openEditDialog(selectedCategory);
                }}
                className="bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-white hover:from-[#B8962E] hover:to-[#9A7A25]"
              >
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh Sửa
              </Button>
            </div>
          </div>
        </div>
      )}

      {isDeleteDialogOpen && selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeAllDialogs} />
          <div
            className="relative z-[51] w-full max-w-md rounded-lg bg-white shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeAllDialogs}
              className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center text-2xl text-white hover:text-gray-200"
              aria-label="Đóng"
            >
              ×
            </button>

            <div className="bg-gradient-to-r from-[#B71C1C] to-[#8B1538] px-6 py-4 text-white">
              <h2
                className="text-xl font-semibold"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Xác Nhận Xóa Danh Mục
              </h2>
              <p className="mt-1 text-sm text-white/90">
                Hành động này có thể ảnh hưởng tới sản phẩm đang gắn danh mục này
              </p>
            </div>

            <div className="p-6">
              <p className="mb-2 text-gray-700">
                Bạn có chắc chắn muốn xóa danh mục{" "}
                <span className="font-bold text-red-600">
                  {selectedCategory.name}
                </span>
                ?
              </p>
              <p className="text-sm text-gray-500">
                Nếu danh mục đang được sử dụng, hệ thống có thể từ chối thao tác này.
              </p>
            </div>

            <div className="flex justify-end gap-3 px-6 pb-6">
              <Button variant="outline" onClick={closeAllDialogs} disabled={submitting}>
                Hủy
              </Button>
              <Button
                onClick={handleDeleteCategory}
                disabled={submitting}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xóa...
                  </>
                ) : (
                  "Xóa Danh Mục"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
