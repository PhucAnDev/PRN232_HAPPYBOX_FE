import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  Download,
  Eye,
  FileText,
  Filter,
  Loader2,
  Package,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import reportService, {
  type DayDetailOrderDto,
  type DailyReportDto,
  type RevenueReportResponse,
} from "@/services/reportService";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const formatInputDate = (date: Date) => date.toISOString().split("T")[0];

const getDefaultDateRange = () => {
  const end = new Date();
  const start = new Date(Date.now() - 30 * DAY_IN_MS);

  return {
    startDate: formatInputDate(start),
    endDate: formatInputDate(end),
  };
};

const formatCurrency = (amount: number) =>
  `${new Intl.NumberFormat("vi-VN").format(amount)}đ`;

const formatDisplayDate = (value: string) => {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-");
    return `${day}/${month}/${year}`;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatChartDate = (value: string) => {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [, month, day] = value.split("-");
    return `${day}/${month}`;
  }

  return value;
};

const formatPercent = (value: number) => {
  const normalized = Number.isFinite(value) ? value : 0;
  const sign = normalized > 0 ? "+" : "";
  const rounded =
    Math.abs(normalized % 1) < 0.05
      ? normalized.toFixed(0)
      : normalized.toFixed(1);

  return `${sign}${rounded}%`;
};

const getGrowthBadgeClass = (value: number) => {
  if (value > 0) return "text-green-600 bg-green-50";
  if (value < 0) return "text-red-600 bg-red-50";
  return "text-gray-600 bg-gray-100";
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "Delivered":
      return "Đã giao";
    case "Cancelled":
      return "Đã hủy";
    case "Pending":
      return "Chờ xử lý";
    case "Processing":
      return "Đang xử lý";
    case "Confirmed":
      return "Đã xác nhận";
    case "Shipping":
      return "Đang giao";
    default:
      return status;
  }
};

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "Delivered":
      return "bg-green-100 text-green-700";
    case "Cancelled":
      return "bg-red-100 text-red-700";
    case "Pending":
      return "bg-amber-100 text-amber-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

const getFileNameFromDisposition = (contentDisposition?: string | null) => {
  if (!contentDisposition) return null;

  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1]);
  }

  const asciiMatch = contentDisposition.match(/filename="?([^"]+)"?/i);
  return asciiMatch?.[1] ?? null;
};

export function RevenueReport() {
  const defaultRange = useMemo(() => getDefaultDateRange(), []);
  const [startDate, setStartDate] = useState(defaultRange.startDate);
  const [endDate, setEndDate] = useState(defaultRange.endDate);
  const [reportData, setReportData] = useState<RevenueReportResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [dayDetails, setDayDetails] = useState<DayDetailOrderDto[]>([]);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const fetchData = async (start: string, end: string) => {
    if (end < start) {
      toast.error("Ngày kết thúc không được nhỏ hơn ngày bắt đầu.");
      return;
    }

    setLoading(true);

    try {
      const response = await reportService.getRevenueReport(start, end);
      setReportData(response.data.data);
    } catch (error) {
      console.error("Error fetching revenue report:", error);
      toast.error("Không thể tải dữ liệu báo cáo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchData(defaultRange.startDate, defaultRange.endDate);
  }, [defaultRange.endDate, defaultRange.startDate]);

  const handleFilter = () => {
    void fetchData(startDate, endDate);
  };

  const handleExport = async () => {
    if (endDate < startDate) {
      toast.error("Ngày kết thúc không được nhỏ hơn ngày bắt đầu.");
      return;
    }

    setIsExporting(true);

    try {
      const response = await reportService.exportRevenueReport(startDate, endDate);
      const contentType = response.headers["content-type"] || "text/csv;charset=utf-8";
      const fileName =
        getFileNameFromDisposition(response.headers["content-disposition"]) ||
        `Bao_Cao_Doanh_Thu_${startDate}_${endDate}.csv`;

      const blob = new Blob([response.data], { type: contentType });
      const downloadUrl = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");

      anchor.href = downloadUrl;
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(downloadUrl);

      toast.success("Đã tải báo cáo doanh thu.");
    } catch (error) {
      console.error("Error exporting revenue report:", error);
      toast.error("Không thể xuất báo cáo doanh thu.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleViewDayDetails = async (date: string) => {
    setSelectedDay(date);
    setIsDetailsOpen(true);
    setIsLoadingDetails(true);

    try {
      const response = await reportService.getRevenueDayDetails(date);
      setDayDetails(response.data.data);
    } catch (error) {
      console.error("Error fetching day details:", error);
      setDayDetails([]);
      toast.error("Không thể tải chi tiết đơn hàng của ngày này.");
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const dailyReports: DailyReportDto[] = reportData?.dailyReports ?? [];
  const chartData = dailyReports.map((day) => ({
    date: formatChartDate(day.date),
    revenue: day.revenue / 1000000,
  }));

  const totalRevenue = reportData?.totalRevenue ?? 0;
  const totalOrders = reportData?.totalOrders ?? 0;
  const successOrders = reportData?.deliveredOrders ?? 0;
  const cancelledOrders = reportData?.cancelledOrders ?? 0;
  const totalProducts = reportData?.totalProductsSold ?? 0;
  const revenueGrowth = reportData?.revenueGrowthPercent ?? 0;
  const orderGrowth = reportData?.orderGrowthPercent ?? 0;
  const productGrowth = reportData?.productGrowthPercent ?? 0;
  const averageProductsPerOrder =
    totalOrders > 0 ? (totalProducts / totalOrders).toFixed(1) : "0";

  return (
    <>
      <div className="p-8">
        <div className="mb-6">
          <h1
            className="text-3xl font-bold text-gray-900 mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Báo Cáo Doanh Thu
          </h1>
          <p className="text-gray-600">
            Theo dõi và phân tích hiệu suất kinh doanh theo thời gian
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end">
            <div className="flex-1 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Từ ngày
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(event) => setStartDate(event.target.value)}
                    className="pl-10 pr-4 py-3 w-full border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Đến ngày
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(event) => setEndDate(event.target.value)}
                    className="pl-10 pr-4 py-3 w-full border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleFilter}
                disabled={loading}
                className="bg-[#B71C1C] hover:bg-[#8B1538] text-white font-semibold px-8 py-3 h-[52px]"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <Filter className="h-5 w-5 mr-2" />
                )}
                Lọc Dữ Liệu
              </Button>

              <Button
                onClick={handleExport}
                disabled={isExporting}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold px-8 py-3 h-[52px]"
              >
                {isExporting ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <Download className="h-5 w-5 mr-2" />
                )}
                Xuất Excel
              </Button>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Khoảng thời gian:{" "}
              <span className="font-bold text-gray-900">
                {formatDisplayDate(startDate)} - {formatDisplayDate(endDate)}
              </span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-3">
          <div className="bg-gradient-to-br from-[#B71C1C] to-[#8B1538] rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                <TrendingUp className="h-6 w-6" />
              </div>
              <span
                className={`text-sm font-semibold px-3 py-1 rounded-full ${getGrowthBadgeClass(revenueGrowth)}`}
              >
                {formatPercent(revenueGrowth)}
              </span>
            </div>
            <p className="text-sm opacity-90 mb-2">Tổng Doanh Thu</p>
            <p
              className="text-4xl font-bold text-[#D4AF37]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {loading ? "Đang tải..." : formatCurrency(totalRevenue)}
            </p>
            <p className="text-xs opacity-75 mt-2">
              So với kỳ trước: {formatCurrency(reportData?.previousRevenue ?? 0)}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
              <span
                className={`text-sm font-semibold px-3 py-1 rounded-full ${getGrowthBadgeClass(orderGrowth)}`}
              >
                {formatPercent(orderGrowth)}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">Tổng Đơn Hàng</p>
            <p
              className="text-4xl font-bold text-gray-900"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {loading ? "..." : totalOrders}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Thành công: {successOrders} | Hủy: {cancelledOrders}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Package className="h-6 w-6 text-green-600" />
              </div>
              <span
                className={`text-sm font-semibold px-3 py-1 rounded-full ${getGrowthBadgeClass(productGrowth)}`}
              >
                {formatPercent(productGrowth)}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">Sản Phẩm Đã Bán</p>
            <p
              className="text-4xl font-bold text-gray-900"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {loading ? "..." : totalProducts}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Trung bình: {averageProductsPerOrder} sp/đơn
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="mb-6">
            <h3
              className="text-xl font-bold text-gray-900 mb-1"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Biểu Đồ Doanh Thu Theo Ngày
            </h3>
            <p className="text-sm text-gray-600">
              So sánh doanh thu giữa các ngày trong khoảng thời gian đã chọn
            </p>
          </div>

          <div className="h-80">
            {loading ? (
              <div className="h-full flex items-center justify-center text-gray-400">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                Đang tải dữ liệu biểu đồ...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="date"
                    stroke="#6B7280"
                    style={{ fontSize: "12px", fontWeight: 600 }}
                  />
                  <YAxis
                    stroke="#6B7280"
                    style={{ fontSize: "12px", fontWeight: 600 }}
                    tickFormatter={(value) => `${value}M`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                    formatter={(value: number) => [
                      `${value.toFixed(1)}M VND`,
                      "Doanh thu",
                    ]}
                    labelStyle={{ fontWeight: "bold", color: "#1F2937" }}
                  />
                  <Legend
                    wrapperStyle={{
                      paddingTop: "20px",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="#B71C1C"
                    radius={[8, 8, 0, 0]}
                    name="Doanh thu (Triệu VND)"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3
                  className="text-xl font-bold text-gray-900"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Chi Tiết Doanh Thu Theo Ngày
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Bảng tổng hợp chi tiết cho từng ngày
                </p>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-semibold text-gray-700">
                  {dailyReports.length} ngày
                </span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Ngày
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Số Đơn Hàng
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Đơn Thành Công
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Đơn Hủy
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Sản Phẩm Bán
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Doanh Thu
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Hành Động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : dailyReports.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                      Không có dữ liệu trong khoảng thời gian này.
                    </td>
                  </tr>
                ) : (
                  dailyReports.map((day) => (
                    <tr key={day.date} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-bold text-gray-900">
                            {formatDisplayDate(day.date)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-700 text-sm font-bold">
                          {day.totalOrders}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-700 text-sm font-bold">
                          {day.deliveredOrders}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-100 text-red-700 text-sm font-bold">
                          {day.cancelledOrders}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 text-amber-700 text-sm font-bold">
                          {day.productsSold}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span
                          className="text-lg font-bold text-[#D4AF37]"
                          style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                          {formatCurrency(day.revenue)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => void handleViewDayDetails(day.date)}
                          className="p-2 text-gray-600 hover:text-[#B71C1C] hover:bg-gray-100 rounded-lg transition-colors inline-flex items-center"
                          title="Xem chi tiết"
                        >
                          {isLoadingDetails && selectedDay === day.date ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                )}

                {!loading && (
                  <tr className="bg-gray-50 font-bold">
                    <td className="px-6 py-4 text-sm text-gray-900">Tổng Cộng</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-200 text-blue-900 text-sm font-bold">
                        {totalOrders}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-200 text-green-900 text-sm font-bold">
                        {successOrders}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-200 text-red-900 text-sm font-bold">
                        {cancelledOrders}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-200 text-amber-900 text-sm font-bold">
                        {totalProducts}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span
                        className="text-xl font-bold text-[#B71C1C]"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {formatCurrency(totalRevenue)}
                      </span>
                    </td>
                    <td className="px-6 py-4"></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              Chi tiết đơn hàng ngày {selectedDay ? formatDisplayDate(selectedDay) : ""}
            </DialogTitle>
            <DialogDescription>
              Danh sách các đơn hàng trong ngày được chọn từ báo cáo doanh thu.
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[60vh] overflow-auto rounded-lg border border-gray-200">
            <table className="w-full">
              <thead className="sticky top-0 bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Mã đơn
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Khách hàng
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Thời gian
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Giá trị
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {isLoadingDetails ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-gray-400">
                      <Loader2 className="h-5 w-5 animate-spin inline mr-2" />
                      Đang tải chi tiết đơn hàng...
                    </td>
                  </tr>
                ) : dayDetails.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-gray-400">
                      Không có đơn hàng nào trong ngày này.
                    </td>
                  </tr>
                ) : (
                  dayDetails.map((order) => (
                    <tr key={order.orderId} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                        {order.orderNumber}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {order.customerName}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {new Date(order.createdAt).toLocaleString("vi-VN")}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeClass(order.status)}`}
                        >
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-[#B71C1C]">
                        {formatCurrency(order.finalAmount)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
