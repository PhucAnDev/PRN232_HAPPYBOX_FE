export interface VNProvince {
  code: number;
  name: string;
}

export interface VNDistrict {
  code: number;
  name: string;
}

export interface VNWard {
  code: number;
  name: string;
}

const ADDRESS_API_BASE = "https://provinces.open-api.vn/api";

const addressService = {
  async getProvinces(): Promise<VNProvince[]> {
    const response = await fetch(`${ADDRESS_API_BASE}/p/`);
    if (!response.ok) {
      throw new Error("Khong the tai danh sach tinh/thanh pho");
    }
    return response.json();
  },

  async getDistricts(provinceCode: number): Promise<VNDistrict[]> {
    const response = await fetch(
      `${ADDRESS_API_BASE}/p/${provinceCode}?depth=2`,
    );
    if (!response.ok) {
      throw new Error("Khong the tai danh sach quan/huyen");
    }

    const data = await response.json();
    return data.districts || [];
  },

  async getWards(districtCode: number): Promise<VNWard[]> {
    const response = await fetch(
      `${ADDRESS_API_BASE}/d/${districtCode}?depth=2`,
    );
    if (!response.ok) {
      throw new Error("Khong the tai danh sach phuong/xa");
    }

    const data = await response.json();
    return data.wards || [];
  },
};

export default addressService;
