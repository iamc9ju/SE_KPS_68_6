import { Star, Quote } from "lucide-react";

const reviews = [
    {
        name: "คุณสมหญิง พ.",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&q=80&w=200&h=200",
        rating: 5,
        text: "ประทับใจมากค่ะ ได้แผนอาหารที่เหมาะกับตัวเองจริงๆ น้ำหนักลดลง 5 กก. ใน 2 เดือน โดยที่ไม่ต้องอดอาหารเลย!",
        date: "2 สัปดาห์ก่อน",
    },
    {
        name: "คุณธนกร ว.",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200",
        rating: 5,
        text: "เป็นนักกีฬาสมัครเล่นครับ หลังจากปรึกษานักโภชนาการ ทำให้ผมจัดมื้ออาหารได้ดีขึ้นมาก ร่างกายฟื้นตัวเร็วขึ้นเห็นชัด",
        date: "1 เดือนก่อน",
    },
    {
        name: "คุณพิมพ์ชนก อ.",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200&h=200",
        rating: 4,
        text: "ตอนท้องหาข้อมูลเรื่องอาหารยากมาก Wellmate ช่วยได้เยอะเลยค่ะ คุณหมอให้คำแนะนำที่ปลอดภัยและเข้าใจง่าย",
        date: "3 สัปดาห์ก่อน",
    },
];

export default function UserReviews() {
    return (
        <section className="py-20">
            <div className="max-w-7xl mx-auto px-4">

                {}
                <div className="text-center mb-14 animate-fadeIn">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-[#FDB813]/15 text-[#b8860b] text-xs font-bold tracking-wide uppercase mb-4">
                        เสียงจากผู้ใช้จริง
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
                        ผู้ใช้ของเราพูดถึงอะไร
                    </h2>
                    <p className="text-gray-500 text-sm md:text-base max-w-lg mx-auto">
                        รีวิวจากผู้ใช้งานจริงที่ไว้วางใจให้ Wellmate ดูแลสุขภาพ
                    </p>
                </div>

                {}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {reviews.map((review, idx) => (
                        <div
                            key={idx}
                            className="relative bg-white rounded-2xl p-8 border border-gray-100 shadow-sm 
                                       hover:shadow-lg hover:shadow-[#A3D133]/10 hover:border-[#A3D133]/30 
                                       hover:-translate-y-1 transition-all duration-300
                                       opacity-0 animate-slideUp"
                            style={{ animationDelay: `${idx * 0.15 + 0.2}s` }}
                        >
                            {}
                            <Quote className="absolute top-6 right-6 w-8 h-8 text-[#A3D133]/20" />

                            {}
                            <div className="flex items-center gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-4 h-4 ${i < review.rating ? 'fill-[#FDB813] text-[#FDB813]' : 'fill-gray-200 text-gray-200'}`}
                                    />
                                ))}
                            </div>

                            {}
                            <p className="text-gray-600 text-sm leading-relaxed mb-6">
                                &quot;{review.text}&quot;
                            </p>

                            {}
                            <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                                <img
                                    src={review.avatar}
                                    alt={review.name}
                                    className="w-10 h-10 rounded-full object-cover border-2 border-[#f4fce3]"
                                />
                                <div>
                                    <p className="font-semibold text-sm text-gray-900">{review.name}</p>
                                    <p className="text-xs text-gray-400">{review.date}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
