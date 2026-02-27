import { ClipboardList, Search, UserCheck, Utensils } from "lucide-react";

const steps = [
    {
        icon: UserCheck,
        title: "สมัครสมาชิก",
        description: "สร้างบัญชีฟรีภายในไม่กี่วินาที เพียงกรอกข้อมูลพื้นฐานเพื่อเริ่มต้นใช้งาน",
        color: "#A3D133",
        bgColor: "#A3D133",
    },
    {
        icon: Search,
        title: "ค้นหานักโภชนาการ",
        description: "เลือกผู้เชี่ยวชาญที่ตรงกับความต้องการของคุณ จากทีมนักโภชนาการที่ได้รับการรับรอง",
        color: "#8BC34A",
        bgColor: "#8BC34A",
    },
    {
        icon: ClipboardList,
        title: "ประเมินสุขภาพ",
        description: "ทำแบบประเมินสุขภาพเบื้องต้น เพื่อให้ผู้เชี่ยวชาญวิเคราะห์และออกแบบแผนที่เหมาะกับคุณ",
        color: "#FDB813",
        bgColor: "#FDB813",
    },
    {
        icon: Utensils,
        title: "รับแผนโภชนาการ",
        description: "รับแผนอาหารที่ออกแบบเฉพาะบุคคล พร้อมติดตามผลและปรับแผนอย่างต่อเนื่อง",
        color: "#FF9800",
        bgColor: "#FF9800",
    },
];

export default function HowToUse() {
    return (
        <section className="py-20">
            <div className="max-w-7xl mx-auto px-4">

                {/* Section Header */}
                <div className="text-center mb-14 animate-fadeIn">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-[#A3D133]/15 text-[#6b8f1a] text-xs font-bold tracking-wide uppercase mb-4">
                        เริ่มต้นง่ายๆ
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
                        ใช้งานอย่างไร
                    </h2>
                    <p className="text-gray-500 text-sm md:text-base max-w-lg mx-auto">
                        เพียง 4 ขั้นตอนง่ายๆ คุณก็สามารถเริ่มต้นดูแลสุขภาพกับ Wellmate ได้แล้ว
                    </p>
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, idx) => {
                        const Icon = step.icon;
                        return (
                            <div
                                key={idx}
                                className="relative text-center group opacity-0 animate-slideUp"
                                style={{ animationDelay: `${idx * 0.15 + 0.2}s` }}
                            >
                                {/* Connector line (not on last item) */}
                                {idx < steps.length - 1 && (
                                    <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-gray-200 to-gray-100 z-0" />
                                )}

                                {/* Step number badge */}
                                <div className="relative z-10 flex flex-col items-center">
                                    {/* Icon circle */}
                                    <div
                                        className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5 shadow-lg 
                                                   group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300"
                                        style={{
                                            backgroundColor: `${step.bgColor}15`,
                                            boxShadow: `0 8px 25px ${step.bgColor}20`,
                                        }}
                                    >
                                        <Icon className="w-9 h-9" style={{ color: step.color }} />
                                    </div>

                                    {/* Step number */}
                                    <span
                                        className="absolute -top-2 -right-2 w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center shadow-md"
                                        style={{ backgroundColor: step.color }}
                                    >
                                        {idx + 1}
                                    </span>

                                    {/* Title */}
                                    <h3 className="font-bold text-lg text-gray-900 mb-2">{step.title}</h3>

                                    {/* Description */}
                                    <p className="text-sm text-gray-500 leading-relaxed max-w-[240px] mx-auto">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
