"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
    CheckCircle, Circle, ChevronLeft, ChevronRight, Flame, BookOpen,
    Loader2, Coffee, Sun, Moon, Candy
} from "lucide-react";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import Swal from "sweetalert2";

type MealItem = {
    mealPlanItemId: number;
    planDate: string;
    mealType: string;
    isDone: boolean;
    menuItem?: {
        name: string;
        imageUrl?: string;
        caloriesKcal?: number;
    };
};

const MEAL_TYPE_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string }> = {
    breakfast: { label: "เช้า", icon: Coffee, color: "text-orange-400" },
    lunch: { label: "กลางวัน", icon: Sun, color: "text-yellow-500" },
    dinner: { label: "เย็น", icon: Moon, color: "text-indigo-400" },
    snack: { label: "ของว่าง", icon: Candy, color: "text-pink-400" },
};

export default function FoodDiaryPage() {
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(true);
    const [meals, setMeals] = useState<MealItem[]>([]);
    const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);

    useEffect(() => {
        if (user?.role !== "patient") {
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                const profileRes = await api.get("/patients/profile");
                const pData = profileRes.data?.data || profileRes.data;
                if (!pData?.patientId) {
                    setLoading(false);
                    return;
                }

                const res = await api.get(`/meal-plan/patient/${pData.patientId}`);
                const allPlans = Array.isArray(res.data) ? res.data : (res.data?.data || []);
                const allItems: MealItem[] = allPlans.reduce((acc: MealItem[], plan: any) => {
                    if (plan.mealPlanItems) {
                        return [...acc, ...plan.mealPlanItems];
                    }
                    return acc;
                }, []);
                setMeals(allItems);
            } catch (error) {
                console.error("Error fetching meal plan for diary:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const changeDate = (offset: number) => {
        const d = new Date(selectedDate);
        d.setDate(d.getDate() + offset);
        setSelectedDate(d.toISOString().split("T")[0]);
    };

    const formatDateThai = (dateStr: string) => {
        const d = new Date(dateStr);
        const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear() + 543}`;
    };

    const dayMeals = useMemo(() => {
        return meals.filter(m => {
            const mealDate = new Date(m.planDate).toISOString().split("T")[0];
            return mealDate === selectedDate;
        });
    }, [meals, selectedDate]);

    const logged = useMemo(() => dayMeals.filter(m => m.isDone), [dayMeals]);
    const totalKcal = useMemo(() => logged.reduce((sum, m) => sum + (m.menuItem?.caloriesKcal || 0), 0), [logged]);
    const totalPlannedKcal = useMemo(() => dayMeals.reduce((sum, m) => sum + (m.menuItem?.caloriesKcal || 0), 0), [dayMeals]);

    const handleToggleDone = async (itemId: number, isDone: boolean) => {
        // Optimistic update
        setMeals(prev => prev.map(m => m.mealPlanItemId === itemId ? { ...m, isDone } : m));

        try {
            await api.patch(`/meal-plan/item/${itemId}`, { isDone });
        } catch (error) {
            console.error("Error updating meal item:", error);
            // Revert
            setMeals(prev => prev.map(m => m.mealPlanItemId === itemId ? { ...m, isDone: !isDone } : m));
            Swal.fire({ icon: 'error', title: 'ผิดพลาด', text: 'ไม่สามารถบันทึกได้' });
        }
    };

    const getMealTypeLabel = (type: string) => MEAL_TYPE_CONFIG[type]?.label || type;
    const getMealTypeIcon = (type: string) => {
        const config = MEAL_TYPE_CONFIG[type];
        if (!config) return null;
        const Icon = config.icon;
        return <Icon className={`w-5 h-5 ${config.color}`} />;
    };

    if (loading) {
        return (
            <div className="flex-1 ml-64 min-h-screen flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-[#C6E065]" />
            </div>
        );
    }

    return (
        <div className="flex-1 ml-64 min-h-screen overflow-y-auto">
            {/* Banner */}
            <div className="relative h-44 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1400&h=400&fit=crop" alt="Banner" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center px-10">
                    <div className="flex items-center gap-2 text-[#ffd980] mb-1">
                        <BookOpen className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">FOOD DIARY</span>
                    </div>
                    <h1 className="text-white text-3xl font-black">บันทึกการกิน</h1>
                    <p className="text-white/60 text-sm mt-1">ติดตามสิ่งที่คุณ &quot;วางแผน&quot; และ &quot;กินจริง&quot; จากแผนโภชนาการ</p>
                </div>
            </div>

            <div className="p-8">
                {/* Date row */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">วันที่เลือก</p>
                        <h2 className="text-xl font-black text-gray-900">{formatDateThai(selectedDate)}</h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => changeDate(-1)} className="p-2 rounded-2xl bg-white hover:bg-green-50 text-gray-500 hover:text-[#4d7c0f] shadow-sm transition-colors">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
                            className="border border-gray-200 rounded-2xl px-4 py-2 text-sm outline-none focus:border-[#a3e635] bg-white shadow-sm" />
                        <button onClick={() => changeDate(1)} className="p-2 rounded-2xl bg-white hover:bg-green-50 text-gray-500 hover:text-[#4d7c0f] shadow-sm transition-colors">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                    <Link href="/dashboard/meal-plan" className="flex items-center gap-2 bg-[#C6E065] hover:bg-[#b5cf54] text-[#3d3522] font-bold px-5 py-2.5 rounded-2xl text-sm shadow-sm transition-colors">
                        📋 ไปหน้าแผนการกิน
                    </Link>
                </div>

                {/* Summary */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-50 flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#fff3cc] rounded-2xl flex items-center justify-center"><Flame className="w-6 h-6 text-[#4d7c0f]" /></div>
                        <div><p className="text-2xl font-black text-gray-900">{totalKcal}</p><p className="text-xs text-gray-400">กินไปแล้ว (kcal)</p></div>
                    </div>
                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-50 flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center"><CheckCircle className="w-6 h-6 text-green-500" /></div>
                        <div><p className="text-2xl font-black text-gray-900">{logged.length}/{dayMeals.length}</p><p className="text-xs text-gray-400">มื้อที่บันทึกแล้ว</p></div>
                    </div>
                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-50 flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#fff8e1] rounded-2xl flex items-center justify-center"><span className="text-xl">🎯</span></div>
                        <div><p className="text-2xl font-black text-gray-900">{Math.max(0, totalPlannedKcal - totalKcal)}</p><p className="text-xs text-gray-400">แคลอรี่คงเหลือ</p></div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Planned - from API */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50">
                        <h2 className="text-lg font-black text-gray-900 mb-4">📋 แผนที่วางไว้</h2>
                        {dayMeals.length === 0 ? (
                            <div className="text-center py-10 text-gray-300">
                                <p className="mb-2">ยังไม่มีแผนการกินสำหรับวันนี้</p>
                                <Link href="/dashboard/meal-plan" className="text-[#4d7c0f] text-xs font-bold hover:underline">ไปดูแผนการกินของคุณ →</Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {dayMeals.map((meal) => (
                                    <div key={meal.mealPlanItemId} className={`flex items-center gap-4 p-4 rounded-2xl transition-colors ${meal.isDone ? "bg-green-50" : "bg-[#fffdf0]"}`}>
                                        <button onClick={() => handleToggleDone(meal.mealPlanItemId, !meal.isDone)} className="flex-shrink-0 transition-transform hover:scale-110">
                                            {meal.isDone
                                                ? <CheckCircle className="w-6 h-6 text-green-500" />
                                                : <Circle className="w-6 h-6 text-gray-300" />}
                                        </button>
                                        {meal.menuItem?.imageUrl ? (
                                            <img src={meal.menuItem.imageUrl} alt={meal.menuItem?.name || ""} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                                                {getMealTypeIcon(meal.mealType)}
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <p className={`font-bold text-sm ${meal.isDone ? "line-through text-gray-400" : "text-gray-800"}`}>
                                                {meal.menuItem?.name || "รายการอาหาร"}
                                            </p>
                                            <p className="text-xs text-gray-400">{meal.menuItem?.caloriesKcal || 0} kcal · {getMealTypeLabel(meal.mealType)}</p>
                                        </div>
                                        {meal.isDone && <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">บันทึกแล้ว ✓</span>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Logged + Tips */}
                    <div className="space-y-4">
                        {/* Logged */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50">
                            <h2 className="text-lg font-black text-gray-900 mb-4">✅ กินจริงแล้ว</h2>
                            {logged.length === 0 ? (
                                <div className="text-center py-8 text-gray-300 text-sm">กดติ๊กช่องซ้ายเพื่อบันทึกว่ากินแล้ว</div>
                            ) : (
                                <div className="space-y-2">
                                    {logged.map((meal) => (
                                        <div key={meal.mealPlanItemId} className="flex items-center gap-3 p-3 bg-[#fffdf0] rounded-2xl">
                                            {meal.menuItem?.imageUrl ? (
                                                <img src={meal.menuItem.imageUrl} alt={meal.menuItem?.name || ""} className="w-10 h-10 rounded-xl object-cover" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                                                    {getMealTypeIcon(meal.mealType)}
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <p className="font-bold text-sm text-gray-800">{meal.menuItem?.name || "รายการอาหาร"}</p>
                                                <p className="text-xs text-gray-400">{meal.menuItem?.caloriesKcal || 0} kcal · {getMealTypeLabel(meal.mealType)}</p>
                                            </div>
                                            <span className="text-[#4d7c0f] font-black text-sm">{meal.menuItem?.caloriesKcal || 0} kcal</span>
                                        </div>
                                    ))}
                                    <div className="flex justify-between items-center pt-2 border-t border-gray-100 mt-2">
                                        <span className="text-sm font-bold text-gray-500">รวมทั้งหมด</span>
                                        <span className="font-black text-gray-900">{totalKcal} kcal</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Tips */}
                        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-50 cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => window.open("https://health.kapook.com/view289834.html", "_blank")}>
                            <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=300&fit=crop" alt="tip" className="w-full h-32 object-cover" />
                            <div className="p-4">
                                <h3 className="font-black text-sm text-[#4d7c0f] mb-1">💡 ทานอาหารหลากสี</h3>
                                <p className="text-xs text-gray-500 leading-relaxed">ควรเน้นผักและผลไม้หลากสีสันให้ได้ 50% ของจาน และเลือกธัญพืชไม่ขัดสีอย่างข้าวกล้อง</p>
                                <p className="text-xs text-blue-400 mt-2">ที่มา: health.kapook.com 🔗</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-50 cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => window.open("https://www.thairath.co.th/lifestyle/food/2914708", "_blank")}>
                            <img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=300&fit=crop" alt="tip2" className="w-full h-32 object-cover" />
                            <div className="p-4">
                                <h3 className="font-black text-sm text-[#4d7c0f] mb-1">💪 โปรตีนคุมน้ำหนัก</h3>
                                <p className="text-xs text-gray-500 leading-relaxed">การเพิ่มโปรตีนในมื้ออาหารจะช่วยให้อิ่มนานขึ้นและลดความอยากอาหารจุบจิบ</p>
                                <p className="text-xs text-blue-400 mt-2">ที่มา: thairath.co.th 🔗</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
