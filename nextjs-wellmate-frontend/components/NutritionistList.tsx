"use client";

import { Star, Loader2 } from "lucide-react";
import Button from "./Button";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
export default function NutritionistList() {
    const { user } = useAuthStore();
    const router = useRouter();

    const { data: nutritionists = [], isLoading } = useQuery({
        queryKey: ["public-nutritionists"],
        queryFn: async () => {
            const res = await api.get("/nutritionists?limit=3");
            return res.data?.data || [];
        }
    });

    const handleViewMore = () => {
        if (!user) {
            Swal.fire({
                title: "กรุณาเข้าสู่ระบบ",
                text: "เพื่อดูนักโภชนาการเพิ่มเติม คุณจำเป็นต้องเข้าสู่ระบบหรือสมัครสมาชิกก่อน",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "เข้าสู่ระบบ",
                cancelButtonText: "ยกเลิก",
                confirmButtonColor: "#FF6A2C"
            }).then((result) => {
                if (result.isConfirmed) {
                    router.push("/login");
                }
            });
            return;
        }
        router.push("/dashboard/nutrition");
    };

    return (
        <section className="py-16 bg-transparent">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12 animate-fadeIn">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">พบกับนักโภชนาการของเรา</h2>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <Loader2 className="w-10 h-10 animate-spin text-[#FF6A2C]" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        {nutritionists.map((person: any, idx: number) => {
                            const fullName = `${person.firstName} ${person.lastName}`;
                            const title = person.nutritionistSpecialties?.length > 0
                                ? person.nutritionistSpecialties.map((s: any) => s.specialty.name).join(", ")
                                : "นักโภชนาการ";
                            const avatarUrl = person.user?.profileImageUrl || `https://ui-avatars.com/api/?name=${person.firstName}&background=random&color=fff`;
                            const rating = person.avgRating || 0;
                            const reviews = person.totalReviews || 0;

                            return (
                                <div
                                    key={person.nutritionistId}
                                    className="border border-gray-200 p-6 rounded-2xl bg-white hover:border-lime-200 transition-all hover:-translate-y-2 text-center opacity-0 animate-slideUp"
                                    style={{ animationDelay: `${idx * 0.15 + 0.2}s`, animationFillMode: "forwards" }}
                                >
                                    <div className="flex justify-center mb-3">
                                        <img
                                            src={avatarUrl}
                                            alt={fullName}
                                            className="w-20 h-20 rounded-full object-cover bg-gray-100"
                                        />
                                    </div>

                                    <h3 className="font-bold text-base mb-1">{fullName}</h3>
                                    <p className="text-xs text-gray-500 mb-3">{title}</p>

                                    <div className="mb-3">
                                        {/* Link to public profile or let them use the dashboard if logged in */}
                                        <Link href={user ? `/dashboard/nutrition/${person.nutritionistId}` : `/nutritionist/${person.nutritionistId}`}>
                                            <Button variant="outline" size="sm" className="text-sm px-6 py-1 border-2 border-black rounded-lg">
                                                ดูโปรไฟล์
                                            </Button>
                                        </Link>
                                    </div>

                                    <div className="flex items-center justify-center gap-1 mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-500 mb-3">
                                        {rating.toFixed(1)} | {reviews} รีวิว
                                    </p>

                                    <p className="text-xs text-gray-500 leading-relaxed">
                                        {`นักโภชนาการคุณภาพจาก WellMate ยินดีให้คำปรึกษา ค่าบริการเริ่มต้นที่ ${person.consultationFee} บาท/ครั้ง`}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className="flex justify-center mt-4">
                    <Button
                        onClick={handleViewMore}
                        className="bg-[#FF6A2C] text-white hover:bg-[#E55A1C] px-8 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg"
                    >
                        ดูเพิ่มเติม
                    </Button>
                </div>
            </div>
        </section>
    );
}
