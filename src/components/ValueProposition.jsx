import { Truck, Award, ShieldCheck } from "lucide-react";
function ValueProposition() {
  const features = [
    {
      icon: Truck,
      title: "Giao H\xE0ng Nhanh",
      description: "Giao trong ng\xE0y t\u1EA1i H\xE0 N\u1ED9i & TP.HCM"
    },
    {
      icon: Award,
      title: "In Logo Doanh Nghi\u1EC7p",
      description: "T\xF9y ch\u1EC9nh th\u01B0\u01A1ng hi\u1EC7u tr\xEAn m\u1ECDi h\u1ED9p qu\xE0"
    },
    {
      icon: ShieldCheck,
      title: "Thanh To\xE1n B\u1EA3o M\u1EADt",
      description: "H\u1ED7 tr\u1EE3 MoMo, Chuy\u1EC3n kho\u1EA3n, COD"
    }
  ];
  return <section className="py-16 bg-[#FFFDF5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
    const Icon = feature.icon;
    return <div
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
              </div>;
  })}
        </div>
      </div>
    </section>;
}
export {
  ValueProposition
};
