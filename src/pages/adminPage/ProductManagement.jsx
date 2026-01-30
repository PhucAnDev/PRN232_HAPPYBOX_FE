import { useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Upload,
  X,
  Package,
  AlertTriangle
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
function ProductManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    stock: "",
    sku: "",
    image: ""
  });
  const [products, setProducts] = useState([
    {
      id: "1",
      name: "Hamper T\u1EBFt Ph\xFA Qu\xFD",
      category: "Hampers Cao C\u1EA5p",
      sku: "HMP-2026-001",
      price: 45e5,
      stock: 45,
      status: "active",
      image: "\u{1F381}"
    },
    {
      id: "2",
      name: "R\u01B0\u1EE3u Vang Bordeaux Premium",
      category: "R\u01B0\u1EE3u Vang",
      sku: "WINE-2026-012",
      price: 89e5,
      stock: 8,
      status: "active",
      image: "\u{1F377}"
    },
    {
      id: "3",
      name: "H\u1ED9p Qu\xE0 Tr\xE0 Cao C\u1EA5p",
      category: "Tr\xE0 & Cafe",
      sku: "TEA-2026-045",
      price: 25e5,
      stock: 120,
      status: "active",
      image: "\u{1F375}"
    },
    {
      id: "4",
      name: "B\xE1nh K\u1EB9o Luxury Collection",
      category: "B\xE1nh K\u1EB9o",
      sku: "CANDY-2026-078",
      price: 18e5,
      stock: 3,
      status: "active",
      image: "\u{1F36C}"
    },
    {
      id: "5",
      name: "Hamper T\u1EBFt Sang Tr\u1ECDng",
      category: "Hampers Cao C\u1EA5p",
      sku: "HMP-2026-002",
      price: 67e5,
      stock: 28,
      status: "active",
      image: "\u{1F381}"
    },
    {
      id: "6",
      name: "Cafe H\u1EA1t Nguy\xEAn Ch\u1EA5t",
      category: "Tr\xE0 & Cafe",
      sku: "COFFEE-2026-021",
      price: 12e5,
      stock: 0,
      status: "hidden",
      image: "\u2615"
    },
    {
      id: "7",
      name: "Champagne Mo\xEBt & Chandon",
      category: "R\u01B0\u1EE3u Vang",
      sku: "WINE-2026-089",
      price: 156e5,
      stock: 12,
      status: "active",
      image: "\u{1F37E}"
    },
    {
      id: "8",
      name: "H\u1ED9p Qu\xE0 T\u1EBFt Gia \u0110\xECnh",
      category: "Hampers Cao C\u1EA5p",
      sku: "HMP-2026-015",
      price: 32e5,
      stock: 65,
      status: "active",
      image: "\u{1F381}"
    }
  ]);
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND"
    }).format(amount);
  };
  const handleToggleStatus = (productId) => {
    setProducts(
      products.map(
        (product) => product.id === productId ? {
          ...product,
          status: product.status === "active" ? "hidden" : "active"
        } : product
      )
    );
  };
  const handleDeleteProduct = (productId) => {
    if (confirm("B\u1EA1n c\xF3 ch\u1EAFc mu\u1ED1n x\xF3a s\u1EA3n ph\u1EA9m n\xE0y?")) {
      setProducts(products.filter((product) => product.id !== productId));
    }
  };
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: "",
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      sku: product.sku,
      image: product.image
    });
    setShowAddModal(true);
  };
  const handleAddNewProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      category: "",
      price: "",
      stock: "",
      sku: "",
      image: ""
    });
    setShowAddModal(true);
  };
  const handleSaveProduct = () => {
    if (editingProduct) {
      setProducts(
        products.map(
          (product) => product.id === editingProduct.id ? {
            ...product,
            name: formData.name,
            category: formData.category,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock),
            sku: formData.sku
          } : product
        )
      );
    } else {
      const newProduct = {
        id: (products.length + 1).toString(),
        name: formData.name,
        category: formData.category,
        sku: formData.sku,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        status: "active",
        image: "\u{1F381}"
      };
      setProducts([...products, newProduct]);
    }
    setShowAddModal(false);
    setFormData({
      name: "",
      description: "",
      category: "",
      price: "",
      stock: "",
      sku: "",
      image: ""
    });
  };
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });
  const productStats = {
    total: products.length,
    active: products.filter((p) => p.status === "active").length,
    lowStock: products.filter((p) => p.stock < 10 && p.stock > 0).length,
    outOfStock: products.filter((p) => p.stock === 0).length
  };
  const categories = [
    "Hampers Cao C\u1EA5p",
    "R\u01B0\u1EE3u Vang",
    "Tr\xE0 & Cafe",
    "B\xE1nh K\u1EB9o"
  ];
  return <div className="p-8">
      {
    /* Header */
  }
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

      {
    /* Stats Overview */
  }
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
              <div className="w-3 h-3 bg-green-600 rounded-full" />
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

      {
    /* Search and Actions */
  }
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {
    /* Search */
  }
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

          {
    /* Filters and Actions */
  }
          <div className="flex flex-wrap gap-3">
            {
    /* Category Filter */
  }
            <select
    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-colors"
    value={categoryFilter}
    onChange={(e) => setCategoryFilter(e.target.value)}
  >
              <option value="all">Tất cả danh mục</option>
              {categories.map((cat) => <option key={cat} value={cat}>
                  {cat}
                </option>)}
            </select>

            {
    /* Add Product Button */
  }
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

      {
    /* Products Table */
  }
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
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
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
              {filteredProducts.map((product) => <tr
    key={product.id}
    className="hover:bg-gray-50 transition-colors"
  >
                  {
    /* Product Info */
  }
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-[#FFFDF5] to-[#F5F5F5] flex items-center justify-center text-3xl border border-gray-200">
                        {product.image}
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

                  {
    /* SKU */
  }
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-mono text-gray-700">
                      {product.sku}
                    </span>
                  </td>

                  {
    /* Price */
  }
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-gray-900">
                      {formatCurrency(product.price)}
                    </span>
                  </td>

                  {
    /* Stock */
  }
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {product.stock === 0 ? <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 flex items-center gap-1">
                          <X className="h-3 w-3" />
                          Hết hàng
                        </span> : product.stock < 10 ? <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {product.stock} còn lại
                        </span> : <span className="text-sm font-semibold text-gray-900">
                          {product.stock}
                        </span>}
                    </div>
                  </td>

                  {
    /* Status Toggle */
  }
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center">
                      <button
    onClick={() => handleToggleStatus(product.id)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${product.status === "active" ? "bg-green-500" : "bg-gray-300"}`}
  >
                        <span
    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${product.status === "active" ? "translate-x-6" : "translate-x-1"}`}
  />
                      </button>
                      <span
    className={`text-sm font-semibold ml-2 ${product.status === "active" ? "text-green-700" : "text-gray-500"}`}
  >
                        {product.status === "active" ? "Ho\u1EA1t \u0111\u1ED9ng" : "\u1EA8n"}
                      </span>
                    </div>
                  </td>

                  {
    /* Actions */
  }
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
    onClick={() => handleDeleteProduct(product.id)}
    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
    title="Xóa"
  >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>

        {
    /* Empty State */
  }
        {filteredProducts.length === 0 && <div className="py-16 text-center">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào</p>
          </div>}

        {
    /* Pagination */
  }
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

      {
    /* Add/Edit Product Modal */
  }
      {showAddModal && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {
    /* Modal Header */
  }
            <div className="bg-gradient-to-r from-[#B71C1C] to-[#8B1538] px-6 py-5 flex items-center justify-between sticky top-0 z-10">
              <h3
    className="text-2xl font-bold text-white"
    style={{ fontFamily: "'Playfair Display', serif" }}
  >
                {editingProduct ? "Ch\u1EC9nh S\u1EEDa S\u1EA3n Ph\u1EA9m" : "Th\xEAm S\u1EA3n Ph\u1EA9m M\u1EDBi"}
              </h3>
              <button
    onClick={() => setShowAddModal(false)}
    className="text-white/80 hover:text-white transition-colors"
  >
                <X className="h-6 w-6" />
              </button>
            </div>

            {
    /* Modal Body */
  }
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {
    /* Left Column */
  }
                <div className="space-y-6">
                  {
    /* Product Name */
  }
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tên Sản Phẩm <span className="text-red-500">*</span>
                    </label>
                    <Input
    type="text"
    placeholder="Nhập tên sản phẩm"
    value={formData.name}
    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
    className="w-full border-gray-300 rounded-lg"
  />
                  </div>

                  {
    /* Category */
  }
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Danh Mục <span className="text-red-500">*</span>
                    </label>
                    <select
    value={formData.category}
    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
  >
                      <option value="">Chọn danh mục</option>
                      {categories.map((cat) => <option key={cat} value={cat}>
                          {cat}
                        </option>)}
                    </select>
                  </div>

                  {
    /* SKU */
  }
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      SKU <span className="text-red-500">*</span>
                    </label>
                    <Input
    type="text"
    placeholder="Ví dụ: HMP-2026-001"
    value={formData.sku}
    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
    className="w-full border-gray-300 rounded-lg font-mono"
  />
                  </div>

                  {
    /* Price */
  }
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Giá Bán (VND) <span className="text-red-500">*</span>
                    </label>
                    <Input
    type="number"
    placeholder="4500000"
    value={formData.price}
    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
    className="w-full border-gray-300 rounded-lg"
  />
                  </div>

                  {
    /* Stock */
  }
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Số Lượng Tồn Kho <span className="text-red-500">*</span>
                    </label>
                    <Input
    type="number"
    placeholder="100"
    value={formData.stock}
    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
    className="w-full border-gray-300 rounded-lg"
  />
                  </div>
                </div>

                {
    /* Right Column */
  }
                <div className="space-y-6">
                  {
    /* Description */
  }
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Mô Tả Sản Phẩm
                    </label>
                    <textarea
    placeholder="Nhập mô tả chi tiết về sản phẩm..."
    value={formData.description}
    onChange={(e) => setFormData({
      ...formData,
      description: e.target.value
    })}
    rows={6}
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent resize-none"
  />
                  </div>

                  {
    /* Image Upload */
  }
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Hình Ảnh Sản Phẩm
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#D4AF37] transition-colors cursor-pointer">
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
                          PNG, JPG lên đến 10MB
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {
    /* Product Preview */
  }
              {formData.name && <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
                    Xem Trước
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-[#FFFDF5] to-[#F5F5F5] flex items-center justify-center text-4xl border border-gray-300">
                      🎁
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">{formData.name}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {formData.category || "Ch\u01B0a ch\u1ECDn danh m\u1EE5c"}
                      </p>
                      {formData.price && <p className="text-sm font-bold text-[#B71C1C] mt-1">
                          {formatCurrency(parseFloat(formData.price))}
                        </p>}
                    </div>
                  </div>
                </div>}

              {
    /* Action Buttons */
  }
              <div className="flex gap-3 mt-8">
                <Button
    onClick={() => setShowAddModal(false)}
    variant="outline"
    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 py-3"
  >
                  Hủy
                </Button>
                <Button
    onClick={handleSaveProduct}
    className="flex-1 bg-[#D4AF37] hover:bg-[#C19A6B] text-white font-semibold py-3"
    disabled={!formData.name || !formData.category || !formData.sku || !formData.price || !formData.stock}
  >
                  {editingProduct ? "C\u1EADp Nh\u1EADt S\u1EA3n Ph\u1EA9m" : "Th\xEAm S\u1EA3n Ph\u1EA9m"}
                </Button>
              </div>
            </div>
          </div>
        </div>}
    </div>;
}
export {
  ProductManagement
};

