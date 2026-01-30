import { useState } from "react";
import {
  Calendar,
  Filter,
  Download,
  Eye,
  TrendingUp,
  ShoppingCart,
  Package,
  FileText
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
function RevenueReport() {
  const [startDate, setStartDate] = useState("2026-01-01");
  const [endDate, setEndDate] = useState("2026-01-05");
  const [filteredData, setFilteredData] = useState([]);
  const allDailyData = [
    {
      date: "2026-01-01",
      displayDate: "01/01/2026",
      totalOrders: 8,
      successfulOrders: 7,
      cancelledOrders: 1,
      revenue: 28e6
    },
    {
      date: "2026-01-02",
      displayDate: "02/01/2026",
      totalOrders: 12,
      successfulOrders: 11,
      cancelledOrders: 1,
      revenue: 35e6
    },
    {
      date: "2026-01-03",
      displayDate: "03/01/2026",
      totalOrders: 15,
      successfulOrders: 14,
      cancelledOrders: 1,
      revenue: 42e6
    },
    {
      date: "2026-01-04",
      displayDate: "04/01/2026",
      totalOrders: 10,
      successfulOrders: 9,
      cancelledOrders: 1,
      revenue: 31e6
    },
    {
      date: "2026-01-05",
      displayDate: "05/01/2026",
      totalOrders: 14,
      successfulOrders: 13,
      cancelledOrders: 1,
      revenue: 38e6
    },
    {
      date: "2026-01-06",
      displayDate: "06/01/2026",
      totalOrders: 9,
      successfulOrders: 8,
      cancelledOrders: 1,
      revenue: 29e6
    },
    {
      date: "2026-01-07",
      displayDate: "07/01/2026",
      totalOrders: 11,
      successfulOrders: 10,
      cancelledOrders: 1,
      revenue: 34e6
    },
    {
      date: "2026-01-08",
      displayDate: "08/01/2026",
      totalOrders: 16,
      successfulOrders: 15,
      cancelledOrders: 1,
      revenue: 45e6
    },
    {
      date: "2026-01-09",
      displayDate: "09/01/2026",
      totalOrders: 13,
      successfulOrders: 12,
      cancelledOrders: 1,
      revenue: 37e6
    },
    {
      date: "2026-01-10",
      displayDate: "10/01/2026",
      totalOrders: 17,
      successfulOrders: 16,
      cancelledOrders: 1,
      revenue: 48e6
    },
    {
      date: "2026-01-11",
      displayDate: "11/01/2026",
      totalOrders: 8,
      successfulOrders: 7,
      cancelledOrders: 1,
      revenue: 27e6
    },
    {
      date: "2026-01-12",
      displayDate: "12/01/2026",
      totalOrders: 10,
      successfulOrders: 9,
      cancelledOrders: 1,
      revenue: 32e6
    },
    {
      date: "2026-01-13",
      displayDate: "13/01/2026",
      totalOrders: 14,
      successfulOrders: 13,
      cancelledOrders: 1,
      revenue: 4e7
    },
    {
      date: "2026-01-14",
      displayDate: "14/01/2026",
      totalOrders: 12,
      successfulOrders: 11,
      cancelledOrders: 1,
      revenue: 36e6
    },
    {
      date: "2026-01-15",
      displayDate: "15/01/2026",
      totalOrders: 15,
      successfulOrders: 14,
      cancelledOrders: 1,
      revenue: 43e6
    }
  ];
  const filterDataByDateRange = () => {
    const filtered = allDailyData.filter((day) => {
      const dayDate = new Date(day.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return dayDate >= start && dayDate <= end;
    });
    setFilteredData(filtered);
  };
  useState(() => {
    filterDataByDateRange();
  });
  const dailyData = filteredData.length > 0 ? filteredData : allDailyData.filter((day) => {
    const dayDate = new Date(day.date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return dayDate >= start && dayDate <= end;
  });
  const chartData = dailyData.map((day) => ({
    date: day.displayDate.slice(0, 5),
    // "01/01"
    revenue: day.revenue / 1e6
    // Convert to millions for better display
  }));
  const totalRevenue = dailyData.reduce((sum, day) => sum + day.revenue, 0);
  const totalOrders = dailyData.reduce((sum, day) => sum + day.totalOrders, 0);
  const totalProducts = 35;
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "\u0111";
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };
  const handleFilter = () => {
    filterDataByDateRange();
    console.log("Filtering from", startDate, "to", endDate);
  };
  const handleExport = () => {
    alert("Xu\u1EA5t b\xE1o c\xE1o Excel th\xE0nh c\xF4ng!");
  };
  return <div className="p-8">
      {
    /* Header */
  }
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

      {
    /* Top Control Bar */
  }
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-end gap-4">
          {
    /* Date Range Picker */
  }
          <div className="flex-1 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Từ ngày
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
    type="date"
    value={startDate}
    onChange={(e) => setStartDate(e.target.value)}
    className="pl-10 pr-4 py-3 w-full border-gray-300 rounded-lg"
  />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Đến ngày
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
    type="date"
    value={endDate}
    onChange={(e) => setEndDate(e.target.value)}
    className="pl-10 pr-4 py-3 w-full border-gray-300 rounded-lg"
  />
              </div>
            </div>
          </div>

          {
    /* Action Buttons */
  }
          <div className="flex gap-3">
            <Button
    onClick={handleFilter}
    className="bg-[#B71C1C] hover:bg-[#8B1538] text-white font-semibold px-8 py-3 h-[52px]"
  >
              <Filter className="h-5 w-5 mr-2" />
              Lọc Dữ Liệu
            </Button>

            <Button
    onClick={handleExport}
    variant="outline"
    className="border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold px-8 py-3 h-[52px]"
  >
              <Download className="h-5 w-5 mr-2" />
              Xuất Excel
            </Button>
          </div>
        </div>

        {
    /* Selected Range Display */
  }
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Khoảng thời gian:{" "}
            <span className="font-bold text-gray-900">
              {formatDate(startDate)} - {formatDate(endDate)}
            </span>
          </p>
        </div>
      </div>

      {
    /* Summary Cards */
  }
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {
    /* Card 1: Total Revenue */
  }
        <div className="bg-gradient-to-br from-[#B71C1C] to-[#8B1538] rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-white bg-opacity-20 flex items-center justify-center">
              <TrendingUp className="h-6 w-6" />
            </div>
            <span className="text-sm font-semibold bg-white bg-opacity-20 px-3 py-1 rounded-full">
              +12%
            </span>
          </div>
          <p className="text-sm opacity-90 mb-2">Tổng Doanh Thu</p>
          <p
    className="text-4xl font-bold text-[#D4AF37]"
    style={{ fontFamily: "'Playfair Display', serif" }}
  >
            {formatCurrency(totalRevenue)}
          </p>
          <p className="text-xs opacity-75 mt-2">
            So với kỳ trước: +5.000.000đ
          </p>
        </div>

        {
    /* Card 2: Total Orders */
  }
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
              +8%
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-2">Tổng Đơn Hàng</p>
          <p
    className="text-4xl font-bold text-gray-900"
    style={{ fontFamily: "'Playfair Display', serif" }}
  >
            {totalOrders}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Thành công: {dailyData.reduce((sum, d) => sum + d.successfulOrders, 0)} | Hủy:{" "}
            {dailyData.reduce((sum, d) => sum + d.cancelledOrders, 0)}
          </p>
        </div>

        {
    /* Card 3: Products Sold */
  }
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <Package className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
              +15%
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-2">Sản Phẩm Đã Bán</p>
          <p
    className="text-4xl font-bold text-gray-900"
    style={{ fontFamily: "'Playfair Display', serif" }}
  >
            {totalProducts}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Trung bình: {(totalProducts / totalOrders).toFixed(1)} sp/đơn
          </p>
        </div>
      </div>

      {
    /* Data Visualization */
  }
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
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
    }}
    formatter={(value) => [
      `${value.toFixed(1)}M VND`,
      "Doanh thu"
    ]}
    labelStyle={{ fontWeight: "bold", color: "#1F2937" }}
  />
              <Legend
    wrapperStyle={{
      paddingTop: "20px",
      fontSize: "14px",
      fontWeight: 600
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
        </div>
      </div>

      {
    /* Detailed Data Table */
  }
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
                {dailyData.length} ngày
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
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Doanh Thu
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Hành Động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dailyData.map((day) => <tr
    key={day.date}
    className="hover:bg-gray-50 transition-colors"
  >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-bold text-gray-900">
                        {day.displayDate}
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
                      {day.successfulOrders}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-100 text-red-700 text-sm font-bold">
                      {day.cancelledOrders}
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
    onClick={() => alert(`Xem chi ti\u1EBFt ng\xE0y ${day.displayDate}`)}
    className="p-2 text-gray-600 hover:text-[#B71C1C] hover:bg-gray-100 rounded-lg transition-colors inline-flex items-center"
    title="Xem chi tiết"
  >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>)}

              {
    /* Total Row */
  }
              <tr className="bg-gray-50 font-bold">
                <td className="px-6 py-4 text-sm text-gray-900">
                  Tổng Cộng
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-200 text-blue-900 text-sm font-bold">
                    {totalOrders}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-200 text-green-900 text-sm font-bold">
                    {dailyData.reduce((sum, d) => sum + d.successfulOrders, 0)}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-200 text-red-900 text-sm font-bold">
                    {dailyData.reduce((sum, d) => sum + d.cancelledOrders, 0)}
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
                <td className="px-6 py-4" />
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>;
}
export {
  RevenueReport
};

