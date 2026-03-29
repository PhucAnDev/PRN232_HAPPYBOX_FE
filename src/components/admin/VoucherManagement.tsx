import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useVouchers from "@/hooks/useVouchers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Filter,
  Download,
  Tag,
  Calendar,
  TrendingUp,
  TicketPercent,
} from "lucide-react";
import type {
  VoucherResponse,
  CreateVoucherRequest,
  UpdateVoucherRequest,
} from "@/services/voucherService";

interface Voucher {
  id: string;
  code: string;
  description: string;
  discountType: "PERCENT" | "AMOUNT";
  value: number;
  minOrderValue: number;
  maxDiscountAmount: number | null;
  startDate: string;
  endDate: string;
  usageLimit: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
}

// Helper function to convert BE response to FE format
const mapVoucherResponseToVoucher = (response: VoucherResponse): Voucher => ({
  id: response.id,
  code: response.code,
  description: response.description,
  discountType: response.isPercentage ? "PERCENT" : "AMOUNT",
  value: response.value,
  minOrderValue: response.minOrderValue,
  maxDiscountAmount: response.maxDiscountAmount,
  startDate: response.startDate.split("T")[0],
  endDate: response.endDate.split("T")[0],
  usageLimit: response.usageLimit,
  isActive: response.isActive,
  createdAt: response.createdAt.split("T")[0],
  updatedAt: null,
});

export function VoucherManagement() {
  const {
    fetchVouchers: fetchVoucherList,
    createVoucher,
    updateVoucher,
    deleteVoucher,
  } = useVouchers();
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Form state
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "PERCENT" as "PERCENT" | "AMOUNT",
    value: "",
    minOrderValue: "",
    maxDiscountAmount: "",
    startDate: "",
    endDate: "",
    usageLimit: "",
    isActive: true,
  });
  const voucherService = {
    getAllVouchers: async () => fetchVoucherList(),
    createVoucher: async (payload: CreateVoucherRequest) =>
      createVoucher(payload),
    updateVoucher: async (id: string, payload: UpdateVoucherRequest) =>
      updateVoucher(id, payload),
    deleteVoucher: async (id: string) => deleteVoucher(id),
  };

  // Fetch vouchers on mount
  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await voucherService.getAllVouchers();
        const mapped = response.map(mapVoucherResponseToVoucher);
        setVouchers(mapped);
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load vouchers",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, []);

  // Statistics
  const stats = {
    totalVouchers: vouchers.length,
    activeVouchers: vouchers.filter((v) => v.isActive).length,
    totalLimit: vouchers.reduce((sum, v) => sum + v.usageLimit, 0),
    totalRevenue: 125600000, // Mock data
  };

  // Filter vouchers
  const filteredVouchers = vouchers
    .filter((voucher) => {
      const matchesSearch =
        voucher.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        voucher.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        filterStatus === "all"
          ? true
          : filterStatus === "active"
            ? voucher.isActive
            : !voucher.isActive;

      return matchesSearch && matchesStatus;
    })
    .sort(
      (left, right) =>
        new Date(right.createdAt).getTime() -
        new Date(left.createdAt).getTime(),
    );

  // Block body scroll when modal is open
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

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isAddDialogOpen, isEditDialogOpen, isViewDialogOpen, isDeleteDialogOpen]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      code: "",
      description: "",
      discountType: "PERCENT",
      value: "",
      minOrderValue: "",
      maxDiscountAmount: "",
      startDate: "",
      endDate: "",
      usageLimit: "",
      isActive: true,
    });
  };

  // Handle add voucher
  const handleAddVoucher = async () => {
    try {
      setLoading(true);

      const request: CreateVoucherRequest = {
        code: formData.code.toUpperCase(),
        description: formData.description,
        isPercentage: formData.discountType === "PERCENT",
        value: parseFloat(formData.value),
        minOrderValue: parseFloat(formData.minOrderValue),
        maxDiscountAmount: formData.maxDiscountAmount
          ? parseFloat(formData.maxDiscountAmount)
          : null,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        usageLimit: parseInt(formData.usageLimit),
      };

      const response = await voucherService.createVoucher(request);
      const newVoucher = mapVoucherResponseToVoucher(response);

      setVouchers([newVoucher, ...vouchers]);
      setIsAddDialogOpen(false);
      resetForm();
      toast.success("Thêm voucher thành công.");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Không thể thêm voucher.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle edit voucher
  const handleEditVoucher = async () => {
    if (!selectedVoucher) return;

    try {
      setLoading(true);

      const request: UpdateVoucherRequest = {
        description: formData.description,
        isPercentage: formData.discountType === "PERCENT",
        value: parseFloat(formData.value),
        minOrderValue: parseFloat(formData.minOrderValue),
        maxDiscountAmount: formData.maxDiscountAmount
          ? parseFloat(formData.maxDiscountAmount)
          : null,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        usageLimit: parseInt(formData.usageLimit),
        isActive: formData.isActive,
      };

      await voucherService.updateVoucher(selectedVoucher.id, request);

      // Refresh vouchers after update
      const response = await voucherService.getAllVouchers();
      const mapped = response.map(mapVoucherResponseToVoucher);
      setVouchers(mapped);

      setIsEditDialogOpen(false);
      setSelectedVoucher(null);
      resetForm();
      toast.success("Cập nhật voucher thành công.");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Không thể cập nhật voucher.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle delete voucher
  const handleDeleteVoucher = async () => {
    if (!selectedVoucher) return;

    try {
      setLoading(true);

      await voucherService.deleteVoucher(selectedVoucher.id);

      // Remove deleted voucher from state
      setVouchers(vouchers.filter((v) => v.id !== selectedVoucher.id));

      setIsDeleteDialogOpen(false);
      setSelectedVoucher(null);
      toast.success("Xóa voucher thành công.");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Không thể xóa voucher.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Open edit dialog
  const openEditDialog = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    setFormData({
      code: voucher.code,
      description: voucher.description,
      discountType: voucher.discountType,
      value: voucher.value.toString(),
      minOrderValue: voucher.minOrderValue.toString(),
      maxDiscountAmount: voucher.maxDiscountAmount?.toString() || "",
      startDate: voucher.startDate,
      endDate: voucher.endDate,
      usageLimit: voucher.usageLimit.toString(),
      isActive: voucher.isActive,
    });
    setIsEditDialogOpen(true);
  };

  // Check if voucher is expired
  const isExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1
            className="text-4xl font-bold text-gray-900"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Quản Lý Khuyến Mãi
          </h1>
          <p className="text-gray-600 mt-2">
            Quản lý voucher và chương trình khuyến mãi
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setIsAddDialogOpen(true);
          }}
          className="bg-gradient-to-r from-[#D4AF37] to-[#B8962E] hover:from-[#B8962E] hover:to-[#9A7A25] text-white px-6 py-6 rounded-xl font-bold shadow-lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          Thêm Voucher
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-[#B71C1C]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Tổng Voucher</p>
              <p className="text-3xl font-bold text-[#B71C1C]">
                {stats.totalVouchers}
              </p>
            </div>
            <div className="w-14 h-14 bg-[#B71C1C]/10 rounded-xl flex items-center justify-center">
              <Tag className="h-7 w-7 text-[#B71C1C]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Đang Hoạt Động</p>
              <p className="text-3xl font-bold text-green-600">
                {stats.activeVouchers}
              </p>
            </div>
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
              <TicketPercent className="h-7 w-7 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Lượt Sử Dụng</p>
              <p className="text-3xl font-bold text-blue-600">
                {stats.totalLimit.toLocaleString()}
              </p>
            </div>
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-7 w-7 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-[#D4AF37]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Tổng Tiết Kiệm</p>
              <p className="text-2xl font-bold text-[#D4AF37]">
                {formatCurrency(stats.totalRevenue)}
              </p>
            </div>
            <div className="w-14 h-14 bg-[#D4AF37]/10 rounded-xl flex items-center justify-center">
              <Calendar className="h-7 w-7 text-[#D4AF37]" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Tìm theo mã voucher hoặc mô tả..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-6 rounded-xl border-gray-300"
            />
          </div>

          {/* Status Filter */}
          <Select
            value={filterStatus}
            onValueChange={(value: any) => setFilterStatus(value)}
          >
            <SelectTrigger className="w-full md:w-48 py-6 rounded-xl">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="active">Đang hoạt động</SelectItem>
              <SelectItem value="inactive">Không hoạt động</SelectItem>
            </SelectContent>
          </Select>

          {/* Export Button */}
          <Button
            variant="outline"
            className="px-6 py-6 rounded-xl border-2 hover:bg-gray-50"
          >
            <Download className="h-5 w-5 mr-2" />
            Xuất Excel
          </Button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg
                className="h-5 w-5 text-red-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              className="text-red-700 border-red-300 hover:bg-red-100"
            >
              Thử lại
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#B71C1C] mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Đang tải dữ liệu...</p>
            </div>
          </div>
        ) : filteredVouchers.length === 0 ? (
          <div className="text-center py-12">
            <Tag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Không tìm thấy voucher nào</p>
          </div>
        ) : (
          <>
            <div className="overflow-y-auto overflow-x-hidden max-h-[calc(100vh-400px)]">
              <Table className="table-fixed [&_th]:px-3 [&_th]:py-4 [&_th]:whitespace-normal [&_th]:break-words [&_td]:px-3 [&_td]:py-4 [&_td]:align-top [&_td]:whitespace-normal [&_td]:break-words">
                <colgroup>
                  <col className="w-[10%]" />
                  <col className="w-[29%]" />
                  <col className="w-[8%]" />
                  <col className="w-[9%]" />
                  <col className="w-[10%]" />
                  <col className="w-[11%]" />
                  <col className="w-[14%]" />
                  <col className="w-[7%]" />
                  <col className="w-[8%]" />
                  <col className="w-[10%]" />
                </colgroup>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-bold">Mã Voucher</TableHead>
                    <TableHead className="font-bold">Mô Tả</TableHead>
                    <TableHead className="font-bold">Loại</TableHead>
                    <TableHead className="font-bold">Giá Trị</TableHead>
                    <TableHead className="font-bold">Đơn Tối Thiểu</TableHead>
                    <TableHead className="font-bold">Giảm Tối Đa</TableHead>
                    <TableHead className="font-bold">Thời Gian</TableHead>
                    <TableHead className="font-bold">Còn Lại</TableHead>
                    <TableHead className="font-bold">Trạng Thái</TableHead>
                    <TableHead className="font-bold text-center">
                      Hoạt Động
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVouchers
                    .slice(
                      (currentPage - 1) * itemsPerPage,
                      currentPage * itemsPerPage,
                    )
                    .map((voucher) => (
                      <TableRow key={voucher.id} className="hover:bg-gray-50">
                        <TableCell className="font-bold text-[#B71C1C] break-all">
                          {voucher.code}
                        </TableCell>
                        <TableCell className="max-w-[280px]">
                          <div className="line-clamp-2 break-words">
                            {voucher.description}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant="outline"
                            className={
                              voucher.discountType === "PERCENT"
                                ? "border-blue-500 text-blue-700 bg-blue-50"
                                : "border-green-500 text-green-700 bg-green-50"
                            }
                          >
                            {voucher.discountType === "PERCENT"
                              ? "Phần trăm"
                              : "Số tiền"}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold text-center">
                          {voucher.discountType === "PERCENT"
                            ? `${voucher.value}%`
                            : formatCurrency(voucher.value)}
                        </TableCell>
                        <TableCell className="text-center">
                          {formatCurrency(voucher.minOrderValue)}
                        </TableCell>
                        <TableCell className="text-center">
                          {voucher.maxDiscountAmount
                            ? formatCurrency(voucher.maxDiscountAmount)
                            : "Không giới hạn"}
                        </TableCell>
                        <TableCell className="text-sm">
                          <div>{formatDate(voucher.startDate)}</div>
                          <div className="text-gray-500">
                            đến {formatDate(voucher.endDate)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <div className="font-bold text-[#D4AF37] text-lg">
                              {voucher.usageLimit.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              lần
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {isExpired(voucher.endDate) ? (
                            <Badge
                              variant="outline"
                              className="border-gray-500 text-gray-700 bg-gray-50"
                            >
                              Hết hạn
                            </Badge>
                          ) : voucher.isActive ? (
                            <Badge
                              variant="outline"
                              className="border-green-500 text-green-700 bg-green-50"
                            >
                              Hoạt động
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="border-red-500 text-red-700 bg-red-50"
                            >
                              Tạm dừng
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap items-center justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedVoucher(voucher);
                                setIsViewDialogOpen(true);
                              }}
                              className="hover:bg-blue-50 hover:text-blue-600"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(voucher)}
                              className="hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedVoucher(voucher);
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

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Hiển thị{" "}
                <span className="font-semibold text-gray-900">
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>{" "}
                đến{" "}
                <span className="font-semibold text-gray-900">
                  {Math.min(
                    currentPage * itemsPerPage,
                    filteredVouchers.length,
                  )}
                </span>{" "}
                trong tổng số{" "}
                <span className="font-semibold text-gray-900">
                  {filteredVouchers.length}
                </span>{" "}
                voucher
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg"
                >
                  ← Trước
                </Button>

                {/* Page Numbers */}
                <div className="flex gap-1">
                  {Array.from(
                    {
                      length: Math.ceil(filteredVouchers.length / itemsPerPage),
                    },
                    (_, i) => i + 1,
                  ).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded-lg ${
                        currentPage === page
                          ? "bg-[#D4AF37] hover:bg-[#B8962E] text-white"
                          : ""
                      }`}
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(
                        prev + 1,
                        Math.ceil(filteredVouchers.length / itemsPerPage),
                      ),
                    )
                  }
                  disabled={
                    currentPage ===
                    Math.ceil(filteredVouchers.length / itemsPerPage)
                  }
                  className="px-3 py-2 rounded-lg"
                >
                  Sau →
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add/Edit Voucher Dialog */}
      {(isAddDialogOpen || isEditDialogOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => {
              setIsAddDialogOpen(false);
              setIsEditDialogOpen(false);
              setSelectedVoucher(null);
              resetForm();
            }}
          />
          <div
            className="relative z-[51] w-full max-w-2xl max-h-[90vh] overflow-hidden bg-white rounded-lg shadow-xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setIsAddDialogOpen(false);
                setIsEditDialogOpen(false);
                setSelectedVoucher(null);
                resetForm();
              }}
              className="absolute top-4 right-4 text-white hover:text-gray-200 text-3xl z-10 w-8 h-8 flex items-center justify-center"
              aria-label="Đóng"
            >
              ×
            </button>

            <div className="bg-gradient-to-r from-[#B71C1C] to-[#8B1538] px-6 py-6 text-white flex-shrink-0">
              <h2
                className="text-2xl font-semibold mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {isEditDialogOpen ? "Cập Nhật Voucher" : "Thêm Voucher Mới"}
              </h2>
              <p className="text-white/90 text-sm">
                Điền thông tin chi tiết về voucher khuyến mãi
              </p>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid gap-6">
                {/* Code */}
                <div className="grid gap-2">
                  <Label htmlFor="code" className="font-semibold">
                    Mã Voucher <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="code"
                    placeholder="VD: TET2026"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        code: e.target.value.toUpperCase(),
                      })
                    }
                    className="uppercase"
                    required
                  />
                </div>

                {/* Description */}
                <div className="grid gap-2">
                  <Label htmlFor="description" className="font-semibold">
                    Mô Tả
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Mô tả chi tiết về voucher..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                  />
                </div>

                {/* Discount Type & Value */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="discountType" className="font-semibold">
                      Loại Giảm Giá <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.discountType}
                      onValueChange={(value: "PERCENT" | "AMOUNT") =>
                        setFormData({ ...formData, discountType: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PERCENT">Phần trăm (%)</SelectItem>
                        <SelectItem value="AMOUNT">Số tiền (VNĐ)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="value" className="font-semibold">
                      Giá Trị <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="value"
                      type="number"
                      placeholder={
                        formData.discountType === "PERCENT"
                          ? "VD: 15"
                          : "VD: 500000"
                      }
                      value={formData.value}
                      onChange={(e) =>
                        setFormData({ ...formData, value: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                {/* Min Order Value & Max Discount */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="minOrderValue" className="font-semibold">
                      Đơn Hàng Tối Thiểu <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="minOrderValue"
                      type="number"
                      placeholder="VD: 2000000"
                      value={formData.minOrderValue}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          minOrderValue: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label
                      htmlFor="maxDiscountAmount"
                      className="font-semibold"
                    >
                      Giảm Tối Đa (Tùy chọn)
                    </Label>
                    <Input
                      id="maxDiscountAmount"
                      type="number"
                      placeholder="VD: 500000 (để trống nếu không giới hạn)"
                      value={formData.maxDiscountAmount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          maxDiscountAmount: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                {/* Start & End Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="startDate" className="font-semibold">
                      Ngày Bắt Đầu <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="endDate" className="font-semibold">
                      Ngày Kết Thúc <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                {/* Usage Limit */}
                <div className="grid gap-2">
                  <Label htmlFor="usageLimit" className="font-semibold">
                    Số Lần Sử Dụng Tối Đa{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="usageLimit"
                    type="number"
                    placeholder="VD: 1000"
                    value={formData.usageLimit}
                    onChange={(e) =>
                      setFormData({ ...formData, usageLimit: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Is Active */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="w-4 h-4 text-[#B71C1C] border-gray-300 rounded focus:ring-[#D4AF37]"
                  />
                  <Label
                    htmlFor="isActive"
                    className="font-medium cursor-pointer"
                  >
                    Kích hoạt voucher ngay sau khi tạo
                  </Label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-200 bg-white flex-shrink-0">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddDialogOpen(false);
                  setIsEditDialogOpen(false);
                  setSelectedVoucher(null);
                  resetForm();
                }}
              >
                Hủy
              </Button>
              <Button
                onClick={
                  isEditDialogOpen ? handleEditVoucher : handleAddVoucher
                }
                className="bg-gradient-to-r from-[#D4AF37] to-[#B8962E] hover:from-[#B8962E] hover:to-[#9A7A25] text-white"
              >
                {isEditDialogOpen ? "Cập Nhật" : "Thêm Voucher"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* View Voucher Dialog */}
      {isViewDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsViewDialogOpen(false)}
          />
          <div
            className="relative z-[51] w-full max-w-2xl max-h-[90vh] overflow-hidden bg-white rounded-lg shadow-xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsViewDialogOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-200 text-3xl z-10 w-8 h-8 flex items-center justify-center"
              aria-label="Đóng"
            >
              ×
            </button>

            <div className="bg-gradient-to-r from-[#B71C1C] to-[#8B1538] px-6 py-6 text-white flex-shrink-0">
              <h2
                className="text-2xl font-semibold mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Chi Tiết Voucher
              </h2>
              <p className="text-white/90 text-sm">
                Thông tin chi tiết về voucher khuyến mãi
              </p>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {selectedVoucher && (
                <div className="space-y-6">
                  {/* Voucher Code Badge */}
                  <div className="bg-gradient-to-r from-[#B71C1C] to-[#8B1538] rounded-2xl p-6 text-white text-center">
                    <div className="text-sm opacity-90 mb-2">Mã Voucher</div>
                    <div
                      className="text-4xl font-bold tracking-wider"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {selectedVoucher.code}
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="text-sm text-gray-600 mb-1">
                        Loại Giảm Giá
                      </div>
                      <div className="font-semibold">
                        {selectedVoucher.discountType === "PERCENT"
                          ? "Phần trăm"
                          : "Số tiền"}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="text-sm text-gray-600 mb-1">Giá Trị</div>
                      <div className="font-semibold text-[#D4AF37]">
                        {selectedVoucher.discountType === "PERCENT"
                          ? `${selectedVoucher.value}%`
                          : formatCurrency(selectedVoucher.value)}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="text-sm text-gray-600 mb-1">
                        Đơn Hàng Tối Thiểu
                      </div>
                      <div className="font-semibold">
                        {formatCurrency(selectedVoucher.minOrderValue)}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="text-sm text-gray-600 mb-1">
                        Giảm Tối Đa
                      </div>
                      <div className="font-semibold">
                        {selectedVoucher.maxDiscountAmount
                          ? formatCurrency(selectedVoucher.maxDiscountAmount)
                          : "Không giới hạn"}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="text-sm text-gray-600 mb-1">
                        Ngày Bắt Đầu
                      </div>
                      <div className="font-semibold">
                        {formatDate(selectedVoucher.startDate)}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="text-sm text-gray-600 mb-1">
                        Ngày Kết Thúc
                      </div>
                      <div className="font-semibold">
                        {formatDate(selectedVoucher.endDate)}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="text-sm text-gray-600 mb-1">
                        Số Lần Sử Dụng
                      </div>
                      <div className="font-semibold text-[#D4AF37]">
                        {selectedVoucher.usageLimit.toLocaleString()} lần
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="text-sm text-gray-600 mb-1">
                        Trạng Thái
                      </div>
                      <div>
                        {isExpired(selectedVoucher.endDate) ? (
                          <Badge
                            variant="outline"
                            className="border-gray-500 text-gray-700 bg-gray-50"
                          >
                            Hết hạn
                          </Badge>
                        ) : selectedVoucher.isActive ? (
                          <Badge
                            variant="outline"
                            className="border-green-500 text-green-700 bg-green-50"
                          >
                            Hoạt động
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="border-red-500 text-red-700 bg-red-50"
                          >
                            Tạm dừng
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {selectedVoucher.description && (
                    <div className="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-4">
                      <div className="text-sm font-semibold text-blue-900 mb-2">
                        Mô Tả
                      </div>
                      <div className="text-blue-800">
                        {selectedVoucher.description}
                      </div>
                    </div>
                  )}

                  {/* Audit Info */}
                  <div className="border-t pt-4">
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Ngày tạo:</span>{" "}
                        {formatDate(selectedVoucher.createdAt)}
                      </div>
                      {selectedVoucher.updatedAt && (
                        <div>
                          <span className="font-medium">Cập nhật:</span>{" "}
                          {formatDate(selectedVoucher.updatedAt)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-200 bg-white flex-shrink-0">
              <Button
                variant="outline"
                onClick={() => setIsViewDialogOpen(false)}
              >
                Đóng
              </Button>
              {selectedVoucher && (
                <Button
                  onClick={() => {
                    setIsViewDialogOpen(false);
                    openEditDialog(selectedVoucher);
                  }}
                  className="bg-gradient-to-r from-[#D4AF37] to-[#B8962E] hover:from-[#B8962E] hover:to-[#9A7A25] text-white"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Chỉnh Sửa
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsDeleteDialogOpen(false)}
          />
          <div
            className="relative z-[51] w-full max-w-md bg-white rounded-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsDeleteDialogOpen(false)}
              className="absolute top-3 right-3 text-white hover:text-gray-200 text-2xl z-20 w-8 h-8 flex items-center justify-center"
              aria-label="Đóng"
            >
              ×
            </button>

            <div className="bg-gradient-to-r from-[#B71C1C] to-[#8B1538] px-6 py-4 text-white">
              <h2
                className="text-xl font-semibold"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Xác Nhận Xóa Voucher
              </h2>
              <p className="text-white/90 text-sm mt-1">
                Hành động này không thể hoàn tác
              </p>
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-2">
                Bạn có chắc chắn muốn xóa voucher{" "}
                <span className="font-bold text-red-600">
                  {selectedVoucher?.code}
                </span>
                ?
              </p>
              <p className="text-gray-500 text-sm">
                Hành động này sẽ đánh dấu xóa mềm voucher (soft delete).
              </p>
            </div>

            <div className="flex justify-end gap-3 px-6 pb-6 bg-white">
              <button
                onClick={() => setIsDeleteDialogOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 min-w-[100px]"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteVoucher}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md min-w-[120px]"
              >
                Xóa Voucher
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
