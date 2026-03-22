"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Sun, Coffee, Moon, Plus, Trash2, ChevronLeft, ChevronRight,
    BookOpen, Flame, Leaf, Heart, X
} from "lucide-react";

type Meal = { id: number; name: string; calories: string; time: string; img: string };

const recommended = [
    { name: "ข้าวกล้องไข่ต้ม", cal: "320 kcal", protein: "18g", carb: "45g", fat: "8g", img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=300&h=200&fit=crop" },
    { name: "สลัดไก่ย่าง", cal: "280 kcal", protein: "30g", carb: "12g", fat: "10g", img: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=300&h=200&fit=crop" },
    { name: "โยเกิร์ตผลไม้", cal: "190 kcal", protein: "8g", carb: "28g", fat: "4g", img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&h=200&fit=crop" },
    { name: "ซุปผักรวม", cal: "150 kcal", protein: "6g", carb: "20g", fat: "3g", img: "https://images.unsplash.com/photo-1547592180-85f173990554?w=300&h=200&fit=crop" },
];

const timeConfig: Record<string, { label: string; icon: any; color: string; bg: string }> = {
    "เช้า": { label: "มื้อเช้า", icon: Coffee, color: "text-orange-500", bg: "bg-orange-50" },
    "กลางวัน": { label: "มื้อกลางวัน", icon: Sun, color: "text-[#c9a800]", bg: "bg-[#e8f5e9]" },
    "เย็น": { label: "มื้อเย็น", icon: Moon, color: "text-indigo-400", bg: "bg-indigo-50" },
};

const mealImages = [
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=60&h=60&fit=crop",
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=60&h=60&fit=crop",
    "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=60&h=60&fit=crop",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=60&h=60&fit=crop",
];

let nextId = 3;

export default function MealPlanPage() {
    const router = useRouter();

    const today = new Date();
    const [selectedDate, setSelectedDate] = useState(today.toISOString().split("T")[0]);
    const [meals, setMeals] = useState<Record<string, Meal[]>>({
        [today.toISOString().split("T")[0]]: [
            { id: 1, name: "Avocado Bowl", calories: "350 kcal", time: "เช้า", img: mealImages[0] },
            { id: 2, name: "Chicken Salad", calories: "420 kcal", time: "กลางวัน", img: mealImages[1] },
        ],
    });
    const [newMeal, setNewMeal] = useState({ name: "", calories: "", time: "เช้า" });
    const [showForm, setShowForm] = useState(false);
    const [showModal, setShowModal] = useState<typeof recommended[0] | null>(null);

    const dayMeals = meals[selectedDate] || [];

    const totalCal = dayMeals.reduce((sum, m) => {
        const n = parseInt(m.calories);
        return sum + (isNaN(n) ? 0 : n);
    }, 0);

    const addMeal = () => {
        if (!newMeal.name) return;
        const meal: Meal = { id: nextId++, ...newMeal, img: mealImages[Math.floor(Math.random() * mealImages.length)] };
        setMeals(prev => ({ ...prev, [selectedDate]: [...(prev[selectedDate] || []), meal] }));
        setNewMeal({ name: "", calories: "", time: "เช้า" });
        setShowForm(false);
    };

    const deleteMeal = (id: number) => {
        setMeals(prev => ({ ...prev, [selectedDate]: (prev[selectedDate] || []).filter(m => m.id !== id) }));
    };

    const addRecommended = (item: typeof recommended[0]) => {
        const meal: Meal = { id: nextId++, name: item.name, calories: item.cal, time: "กลางวัน", img: item.img };
        setMeals(prev => ({ ...prev, [selectedDate]: [...(prev[selectedDate] || []), meal] }));
        setShowModal(null);
    };

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

    return (
        <div className="min-h-screen bg-[#f3f4f6]">
            {/* Banner */}
            <div className="relative h-52 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1400&h=400&fit=crop" alt="Banner" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center px-10">
                    <div className="flex items-center gap-2 text-[#ffd980] mb-1">
                        <BookOpen className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">MEAL PLAN</span>
                    </div>
                    <h1 className="text-white text-3xl font-black">แผนการกินของคุณ</h1>
                    <p className="text-white/60 text-sm mt-1">ดูแลสุขภาพ เริ่มต้นจากมื้ออาหารที่ดี</p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Date Picker */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">วันที่เลือก</p>
                        <h2 className="text-xl font-black text-gray-900">{formatDateThai(selectedDate)}</h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => changeDate(-1)} className="p-2 rounded-2xl bg-white hover:bg-green-50 text-gray-500 hover:text-[#4d7c0f] shadow-sm transition-colors">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={e => setSelectedDate(e.target.value)}
                            className="border border-gray-200 rounded-2xl px-4 py-2 text-sm outline-none focus:border-[#a3e635] bg-white shadow-sm"
                        />
                        <button onClick={() => changeDate(1)} className="p-2 rounded-2xl bg-white hover:bg-green-50 text-gray-500 hover:text-[#4d7c0f] shadow-sm transition-colors">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 bg-[#a3e635] hover:bg-[#84cc16] text-[#1a2e05] font-bold px-5 py-2.5 rounded-2xl text-sm shadow-sm transition-colors"
                    >
                        <Plus className="w-4 h-4" /> เพิ่มเมนู
                    </button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-50 flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#ecfdf5] rounded-2xl flex items-center justify-center"><Flame className="w-6 h-6 text-green-600" /></div>
                        <div><p className="text-2xl font-black text-gray-900">{totalCal}</p><p className="text-xs text-gray-400">แคลอรี่รวม</p></div>
                    </div>
                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-50 flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center"><Leaf className="w-6 h-6 text-green-500" /></div>
                        <div><p className="text-2xl font-black text-gray-900">{dayMeals.length}</p><p className="text-xs text-gray-400">มื้ออาหาร</p></div>
                    </div>
                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-50 flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center"><Heart className="w-6 h-6 text-red-400" /></div>
                        <div><p className="text-2xl font-black text-gray-900">{Math.max(0, 2000 - totalCal)}</p><p className="text-xs text-gray-400">เหลือเป้าหมาย</p></div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Meal List */}
                    <div className="lg:col-span-2 space-y-4">
                        {["เช้า", "กลางวัน", "เย็น"].map(time => {
                            const cfg = timeConfig[time];
                            const Icon = cfg.icon;
                            const timeMeals = dayMeals.filter(m => m.time === time);
                            return (
                                <div key={time} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-50">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-9 h-9 ${cfg.bg} rounded-2xl flex items-center justify-center`}>
                                                <Icon className={`w-5 h-5 ${cfg.color}`} />
                                            </div>
                                            <span className="font-black text-gray-900">{cfg.label}</span>
                                        </div>
                                        <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                                            {timeMeals.reduce((s, m) => s + (parseInt(m.calories) || 0), 0)} kcal
                                        </span>
                                    </div>
                                    {timeMeals.length === 0 ? (
                                        <div className="text-center py-6 text-gray-300 text-sm">
                                            <p>ยังไม่มีเมนู</p>
                                            <button onClick={() => { setNewMeal(p => ({ ...p, time })); setShowForm(true); }} className="mt-2 text-[#c9a800] text-xs font-bold hover:underline">
                                                + เพิ่มเมนู{cfg.label}
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {timeMeals.map(meal => (
                                                <div key={meal.id} className="flex items-center justify-between p-3 bg-[#fffdf0] rounded-2xl">
                                                    <div className="flex items-center gap-3">
                                                        <img src={meal.img} alt={meal.name} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                                                        <div>
                                                            <p className="font-bold text-sm text-gray-800">{meal.name}</p>
                                                            <p className="text-xs text-gray-400">{meal.calories}</p>
                                                        </div>
                                                    </div>
                                                    <button onClick={() => deleteMeal(meal.id)} className="p-1.5 rounded-xl bg-white hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        <button
                            onClick={() => router.push("/fooddiary")}
                            className="w-full bg-[#a3e635] hover:bg-[#84cc16] text-[#1a2e05] font-bold py-3.5 rounded-3xl text-sm shadow-sm transition-colors"
                        >
                            📋 บันทึกและดูไดอารี่อาหาร
                        </button>
                    </div>

                    {/* Recommended */}
                    <div>
                        <h2 className="text-lg font-black text-gray-900 mb-4">เมนูแนะนำ</h2>
                        <div className="space-y-3">
                            {recommended.map((item, i) => (
                                <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-50 hover:shadow-md transition-shadow">
                                    <img src={item.img} alt={item.name} className="w-full h-28 object-cover" />
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <p className="font-bold text-sm text-gray-800">{item.name}</p>
                                            <span className="text-xs font-bold text-[#c9a800] bg-[#e8f5e9] px-2 py-0.5 rounded-full">{item.cal}</span>
                                        </div>
                                        <div className="flex gap-2 text-[10px] text-gray-400 mb-3">
                                            <span>โปรตีน {item.protein}</span>
                                            <span>·</span>
                                            <span>คาร์บ {item.carb}</span>
                                            <span>·</span>
                                            <span>ไขมัน {item.fat}</span>
                                        </div>
                                        <button
                                            onClick={() => setShowModal(item)}
                                            className="w-full flex items-center justify-center gap-1 py-2 rounded-2xl bg-[#fff3cc] hover:bg-[#a3e635] text-[#4d7c0f] text-xs font-bold transition-colors"
                                        >
                                            <Plus className="w-3.5 h-3.5" /> เพิ่มลงแผน
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Meal Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl">
                        <div className="flex justify-between items-start mb-5">
                            <h3 className="text-lg font-black text-gray-900">เพิ่มเมนูอาหาร</h3>
                            <button onClick={() => setShowForm(false)} className="p-1.5 rounded-xl hover:bg-gray-100"><X className="w-5 h-5 text-gray-400" /></button>
                        </div>
                        <div className="space-y-3 mb-5">
                            <div>
                                <label className="text-xs font-bold text-gray-500 mb-1 block">ชื่ออาหาร *</label>
                                <input value={newMeal.name} onChange={e => setNewMeal(p => ({ ...p, name: e.target.value }))} placeholder="เช่น ข้าวกล้องไข่ต้ม..." className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 text-sm outline-none focus:border-[#a3e635]" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 mb-1 block">แคลอรี่</label>
                                <input value={newMeal.calories} onChange={e => setNewMeal(p => ({ ...p, calories: e.target.value }))} placeholder="เช่น 300 kcal" className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 text-sm outline-none focus:border-[#a3e635]" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 mb-1 block">มื้อ</label>
                                <select value={newMeal.time} onChange={e => setNewMeal(p => ({ ...p, time: e.target.value }))} className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 text-sm outline-none focus:border-[#a3e635]">
                                    <option value="เช้า">มื้อเช้า</option>
                                    <option value="กลางวัน">มื้อกลางวัน</option>
                                    <option value="เย็น">มื้อเย็น</option>
                                </select>
                            </div>
                        </div>
                        <button onClick={addMeal} className="w-full bg-[#a3e635] hover:bg-[#84cc16] text-[#1a2e05] font-bold py-3 rounded-2xl text-sm transition-colors">
                            + เพิ่มเมนู
                        </button>
                    </div>
                </div>
            )}

            {/* Recommended Detail Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl overflow-hidden">
                        <div className="relative">
                            <img src={showModal.img} alt={showModal.name} className="w-full h-40 object-cover" />
                            <button onClick={() => setShowModal(null)} className="absolute top-3 right-3 p-1.5 bg-white/80 hover:bg-white rounded-xl backdrop-blur-sm"><X className="w-5 h-5 text-gray-600" /></button>
                        </div>
                        <div className="p-5">
                            <h3 className="text-lg font-black text-gray-900 mb-1">{showModal.name}</h3>
                            <span className="text-sm font-bold text-[#c9a800]">{showModal.cal}</span>
                            <div className="grid grid-cols-3 gap-3 bg-[#fffdf0] rounded-2xl p-3 my-4 text-center text-xs">
                                <div><p className="font-black text-gray-900">{showModal.protein}</p><p className="text-gray-400">โปรตีน</p></div>
                                <div className="border-x border-yellow-100"><p className="font-black text-gray-900">{showModal.carb}</p><p className="text-gray-400">คาร์บ</p></div>
                                <div><p className="font-black text-gray-900">{showModal.fat}</p><p className="text-gray-400">ไขมัน</p></div>
                            </div>
                            <div className="mb-3">
                                <label className="text-xs font-bold text-gray-500 mb-1 block">เพิ่มลงมื้อ</label>
                                <select id="modal-time" className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 text-sm outline-none focus:border-[#a3e635]">
                                    <option value="เช้า">มื้อเช้า</option>
                                    <option value="กลางวัน">มื้อกลางวัน</option>
                                    <option value="เย็น">มื้อเย็น</option>
                                </select>
                            </div>
                            <button onClick={() => addRecommended(showModal)} className="w-full bg-[#a3e635] hover:bg-[#84cc16] text-[#1a2e05] font-bold py-3 rounded-2xl text-sm transition-colors">
                                + เพิ่มลงแผนการกิน
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}