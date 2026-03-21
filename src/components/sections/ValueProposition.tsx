import { Truck, Award, ShieldCheck } from "lucide-react";

export function ValueProposition() {
  const features = [
    {
      icon: Truck,
      title: "Giao Hàng Nhanh",
      description: "Giao trong ngày tại Hà Nội & TP.HCM"
    },
    {
      icon: Award,
      title: "In Logo Doanh Nghiệp",
      description: "Tùy chỉnh thương hiệu trên mọi hộp quà"
    },
    {
      icon: ShieldCheck,
      title: "Thanh Toán Bảo Mật",
      description: "Hỗ trợ MoMo, Chuyển khoản, COD"
    }
  ];

  return (
    <section className="py-16 bg-[#FFFDF5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 rounded-full bg-[#B71C1C] flex items-center justify-center mb-4">
                  <Icon className="h-8 w-8 text-[#D4AF37]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}