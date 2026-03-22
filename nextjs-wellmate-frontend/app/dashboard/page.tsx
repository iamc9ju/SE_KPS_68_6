"use client";

import React from "react";
import {
<<<<<<< HEAD
    LayoutDashboard,
    HeartPulse,
    Calendar,
    MessageSquare,
    Salad,
    Utensils,
    BookOpen,
    TrendingUp,
    LogOut,
    Bell,
    Search,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    MoreHorizontal,
    MoreVertical,
    Flame,
    CheckCircle2,
    Clock,
    Droplet
} from 'lucide-react';
=======
    Flame,
    Plus,
    Utensils,
    Droplets
} from "lucide-react";
>>>>>>> 2d88d27a5f1de6e160ca7642bf0073a053576e8d
import {
    PieChart,
    Pie,
    Cell,
<<<<<<< HEAD
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from 'recharts';
=======
    ResponsiveContainer
} from "recharts";
import RightPanel from "@/components/dashboard/RightPanel";
import StatCard from "@/components/dashboard/StatCard";
import { useAuthStore } from "@/store/auth-store";

export default function DashboardPage() {
    const { user } = useAuthStore();
>>>>>>> 2d88d27a5f1de6e160ca7642bf0073a053576e8d

    const calorieData = [
        { name: "ได้รับแล้ว", value: 1750 },
        { name: "คงเหลือ", value: 1250 },
    ];

    const [showAdvanced, setShowAdvanced] = React.useState(false);

    return (
<<<<<<< HEAD
        <div className="flex h-screen bg-[#fdf6ec] font-sans text-slate-800 overflow-hidden">
            {/* LEFT SIDEBAR */}
            <aside className="w-[260px] bg-white border-r border-slate-200 flex-col justify-between py-6 px-4 shrink-0 overflow-y-auto hidden md:flex">
                <div>
                    <div className="flex items-center gap-2 px-2 mb-10">
                        <div className="flex items-center gap-2">
                            <div className="text-[#8CC63F] font-black italic text-2xl tracking-tighter">
                                W<span className="text-[#F7931E]">M</span>
                            </div>
                            <div className="font-bold text-[17px] text-[#3A3A3A] uppercase tracking-tight">WELLMATE</div>
                        </div>
                    </div>

                    <nav className="space-y-1">
                        <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active />
                        <NavItem icon={<HeartPulse size={20} />} label="Nutrition Service" />
                        <NavItem icon={<Calendar size={20} />} label="Calendar" />
                        <NavItem icon={<MessageSquare size={20} />} label="Messages" />
                        <NavItem icon={<Salad size={20} />} label="Healthy Menu" />
                        <NavItem icon={<Utensils size={20} />} label="Meal Plan" />
                        <NavItem icon={<BookOpen size={20} />} label="Food Diary" />
                        <NavItem icon={<TrendingUp size={20} />} label="Progress" />
                    </nav>
                </div>

                <div className="mt-8">
                    <div className="bg-[#baec60] p-5 rounded-2xl mb-4 text-center">
                        <p className="text-sm font-medium mb-1 text-slate-800">Start your health journey with</p>
                        <p className="font-black text-lg mb-2 text-slate-900">a FREE 1 MONTH</p>
                        <p className="text-xs mb-4 text-slate-700 font-medium">access to WELLMATE</p>
                        <button className="bg-slate-900 text-white hover:bg-black text-xs font-bold py-2.5 px-4 rounded-full w-full transition-colors">Sign Up Now!</button>
                    </div>

                    <button className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-slate-700 bg-[#f9ecda] hover:bg-[#f2dfc2] transition-colors font-semibold">
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 overflow-y-auto p-8">
                <header className="mb-8 flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold mb-1 text-slate-800">Hello , New User!</h1>
                        <p className="text-slate-500 font-medium">let's begin our journey to better health today</p>
                    </div>
                    <button
                        onClick={() => setShowAdvanced(true)}
                        className="flex items-center justify-center w-10 h-10 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
                    >
                        <MoreVertical size={20} />
                    </button>
                </header>

                {/* TOP STATS CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
                    {/* Weight Card */}
                    <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
                        <h3 className="font-semibold text-slate-700 mb-2">Weight</h3>
                        <div className="flex justify-center items-end gap-1 mb-4">
                            <span className="text-4xl font-bold">82</span>
                        </div>
                        {/* Visual fake scale slider */}
                        <div className="flex flex-col items-center">
                            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-orange-500 mb-1"></div>
                            <div className="w-full h-8 overflow-hidden rounded flex justify-between items-center border border-slate-200 bg-slate-50 px-2">
                                {Array.from({ length: 21 }).map((_, i) => (
                                    <div key={i} className={`w-[2px] ${i % 5 === 0 ? 'h-5 bg-slate-400' : 'h-3 bg-slate-200'}`}></div>
                                ))}
=======
        <div className="flex-1 flex flex-col min-h-screen">
            <main className="flex-1 overflow-y-auto px-8 py-10 z-10 custom-scrollbar ml-64 mr-80">
                <div className="max-w-[1240px] mx-auto">
                    {}
                    <header className="mb-8 animate-fadeIn">
                        <h1 className="text-4xl font-black text-[#1a1a1a] tracking-tight mb-2">
                            สวัสดี , {user?.firstName || "ผู้ใช้งานใหม่"}!
                        </h1>
                        <p className="text-gray-500 font-medium text-lg">
                            มาเริ่มการเดินทางสู่สุขภาพที่ดีขึ้นตั้งแต่วันนี้กันเถอะ
                        </p>
                    </header>

                    {}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8 animate-slideUp">
                        {}
                        <StatCard
                            title="น้ำหนัก"
                            value={82}
                            unit="กก."
                        >
                            <div className="mt-4 relative px-2">
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                                    <div className="w-3 h-3 bg-orange-500 rounded-full border-2 border-white shadow-sm"></div>
                                </div>
                                <div className="h-[1px] bg-gray-200 w-full mb-2"></div>
                                <div className="flex justify-between items-start h-8">
                                    {[90, 85, 80, 75, 70].map((v, i) => (
                                        <div key={i} className="flex flex-col items-center gap-1">
                                            <div className="h-4 w-[1px] bg-gray-300"></div>
                                            <span className="text-[10px] text-gray-400 font-bold">{v}</span>
                                        </div>
                                    ))}
                                </div>
                                {}
                                <div className="absolute top-[1px] left-0 right-0 flex justify-between px-2 opacity-30">
                                    {Array.from({ length: 21 }).map((_, i) => (
                                        i % 5 !== 0 && <div key={i} className="h-2 w-[1px] bg-gray-400"></div>
                                    ))}
                                </div>
>>>>>>> 2d88d27a5f1de6e160ca7642bf0073a053576e8d
                            </div>
                        </StatCard>

                        {}
                        <StatCard
                            title="ก้าวเดิน"
                            value={"4850"}
                            unit="ก้าว"
                        >
                            <div className="mt-4">
                                <div className="flex gap-1 h-5 w-full">
                                    <div className="h-full w-[65%] bg-orange-400 rounded-sm"></div>
                                    <div className="h-full flex-1 bg-[#fff5e6] rounded-sm"></div>
                                </div>
                                <div className="flex justify-between mt-3">
                                    <span className="text-[11px] font-black text-gray-800 tracking-tight">65%</span>
                                    <span className="text-[11px] font-bold text-gray-400 tracking-tight">อีก 2150 ก้าว</span>
                                </div>
                            </div>
                        </StatCard>

                        {}
                        <StatCard
                            title="การนอนหลับ"
                            value={7.5}
                            unit="ชั่วโมง"
                        >
                            <div className="mt-4 flex items-end justify-between h-12 gap-1.5 px-1">
                                <div className="w-2.5 h-[40%] bg-gray-200 rounded-full"></div>
                                <div className="w-2.5 h-[70%] bg-[#ffd980] rounded-full"></div>
                                <div className="w-2.5 h-[55%] bg-[#ffd980] rounded-full"></div>
                                <div className="w-2.5 h-[90%] bg-[#C6E065] rounded-full"></div>
                                <div className="w-2.5 h-[75%] bg-[#85B22E] rounded-full"></div>
                                <div className="w-2.5 h-[30%] bg-gray-100 rounded-full"></div>
                                <div className="w-2.5 h-[50%] bg-gray-100 rounded-full"></div>
                            </div>
                        </StatCard>

                        {}
                        <StatCard
                            title="ดื่มน้ำ"
                            value={0.7}
                            unit="ลิตร (เหลือ)"
                        >
                            <div className="mt-4 relative h-16 w-full bg-[#f4f4f4] rounded-xl overflow-hidden group">
                                <div
                                    className="absolute bottom-0 left-0 right-0 bg-[#ffd980] transition-all duration-1000 ease-out"
                                    style={{ height: '65%' }}
                                >
                                </div>
                                <div className="absolute bottom-2 right-3 text-[10px] font-black text-gray-600/60">
                                    1.3/2 ลิตร
                                </div>
                            </div>
                        </StatCard>
                    </div>

                    {}
                    <div className="bg-white p-10 rounded-[40px] shadow-[0_4px_40px_rgba(0,0,0,0.02)] border border-gray-50 mb-8 animate-slideUp delay-100">
                        <div className="flex justify-between items-start mb-8">
                            <h3 className="text-2xl font-black text-gray-900">ปริมาณแคลอรี่</h3>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-3 bg-[#f0f4d8] px-5 py-2.5 rounded-2xl">
                                    <div className="w-10 h-10 bg-[#C6E065] rounded-xl flex items-center justify-center text-sm font-black text-white shadow-sm">
                                        <Utensils className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-black text-gray-900 leading-tight">1750 <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">kcal</span></p>
                                        <p className="text-[11px] text-gray-400 font-bold -mt-0.5">ที่กินไปแล้ว</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-[#f0f4d8] px-5 py-2.5 rounded-2xl">
                                    <div className="w-10 h-10 bg-[#C6E065] rounded-xl flex items-center justify-center text-white shadow-sm">
                                        <Droplets className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-black text-gray-900 leading-tight">510 <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">kcal</span></p>
                                        <p className="text-[11px] text-gray-400 font-bold -mt-0.5">ที่เผาผลาญ</p>
                                    </div>
                                </div>
                                <button className="ml-4 text-gray-300 hover:text-gray-400">
                                    <div className="flex gap-1.5">
                                        {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-current"></div>)}
                                    </div>
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col lg:flex-row items-center gap-16">
                            {}
                            <div className="relative w-72 h-72 flex-shrink-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={calorieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={100}
                                            outerRadius={115}
                                            stroke="none"
                                            dataKey="value"
                                            startAngle={180}
                                            endAngle={-180}
                                            cornerRadius={15}
                                            paddingAngle={0}
                                        >
                                            <Cell fill="url(#calorieGradient)" />
                                            <Cell fill="#f4f4f4" />
                                        </Pie>
                                        <defs>
                                            <linearGradient id="calorieGradient" x1="0" y1="0" x2="1" y2="0">
                                                <stop offset="0%" stopColor="#ffd980" />
                                                <stop offset="100%" stopColor="#ff9933" />
                                            </linearGradient>
                                        </defs>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <Flame className="text-gray-900 mb-2 w-8 h-8 fill-gray-900/10" />
                                    <span className="text-5xl font-black text-gray-900">1750</span>
                                    <span className="text-[11px] text-gray-500 font-bold uppercase tracking-widest mt-1">kcal</span>
                                    <span className="text-[11px] text-gray-400 font-bold mt-1">แคลอรี่คงเหลือ</span>
                                </div>
                            </div>

                            {}
                            <div className="flex-1 w-full space-y-4">
                                <MacroBlock label="คาร์โบไฮเดรต" value={120} max={325} percentage={37} />
                                <MacroBlock label="โปรตีน" value={70} max={75} percentage={93} />
                                <MacroBlock label="ไขมัน" value={20} max={44} percentage={45} />
                            </div>
                        </div>
                    </div>

                    {}
                    <div className="bg-white p-10 rounded-[40px] shadow-[0_4px_40px_rgba(0,0,0,0.02)] border border-gray-50 animate-slideUp delay-200">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-black text-gray-900">เมนูแนะนำ</h3>
                            <button className="text-gray-300 hover:text-gray-400">
                                <div className="flex gap-1.5">
                                    {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-current"></div>)}
                                </div>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <MenuCard
                                category="ของว่าง"
                                calories={280}
                                title="กรีกโยเกิร์ต กราโนล่า และมิกซ์เบอร์รี่"
                                description="อุดมไปด้วยโปรไบโอติกและสารต้านอนุมูลอิสระ ของว่างเพื่อสุขภาพที่สมบูรณ์แบบ"
                                macros={{ c: 28, p: 15, f: 8 }}
                                image="https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=800"
                            />
                            <MenuCard
                                category="มื้อเที่ยง"
                                calories={420}
                                title="สลัดไก่ย่างกับอะโวคาโดและผักสด"
                                description="เต็มไปด้วยโปรตีนลีนและไขมันดีจากอะโวคาโด"
                                macros={{ c: 15, p: 40, f: 22 }}
                                image="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800"
                            />
                        </div>
                    </div>
                </div>
            </main>
<<<<<<< HEAD
            
            <AdvancedStatsDrawer isOpen={showAdvanced} onClose={() => setShowAdvanced(false)} />

            {/* RIGHT SIDEBAR */}
            <aside className="w-[320px] bg-white border-l border-slate-200 overflow-y-auto shrink-0 flex-col hidden xl:flex">
                {/* Profile Header */}
                <div className="p-6 pb-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold overflow-hidden shadow-sm">
                            <img src="https://ui-avatars.com/api/?name=Thanapat+Hongaram&background=E2E8F0&color=475569" alt="User" />
                        </div>
                        <div>
                            <div className="font-bold text-[15px] text-slate-800">Thanapat Hongaram</div>
                            <div className="text-[13px] text-slate-500 font-medium">Member</div>
                        </div>
                    </div>
                    <button className="w-9 h-9 rounded-full bg-[#faeedc] flex items-center justify-center text-orange-500 hover:bg-[#f6dfc0] transition-colors">
                        <Bell size={18} />
                    </button>
                </div>

                {/* Calendar Widget */}
                <div className="px-6 py-4">
                    <div className="flex justify-between items-center mb-5 text-[15px] font-bold text-slate-800">
                        <span>January 2026</span>
                        <div className="flex gap-1 text-slate-400">
                            <button className="hover:text-slate-700 p-1"><ChevronLeft size={18} /></button>
                            <button className="hover:text-slate-700 p-1"><ChevronRight size={18} /></button>
                        </div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 font-semibold mb-3">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                            <span key={day} className={`w-8 text-center ${day === 'Wed' ? 'text-white bg-[#baec60] rounded px-1 !bg-opacity-0 !text-slate-800' : ''}`}>{day}</span>
                        ))}
                    </div>
                    <div className="flex justify-between text-sm font-bold text-slate-700">
                        <span className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 cursor-pointer">19</span>
                        <span className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 cursor-pointer">20</span>
                        <span className="w-8 h-8 flex items-center justify-center rounded-full bg-[#baec60] text-slate-900 shadow-sm cursor-pointer">21</span>
                        <span className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 cursor-pointer">22</span>
                        <span className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 cursor-pointer">23</span>
                        <span className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 cursor-pointer">24</span>
                        <span className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 cursor-pointer">25</span>
                    </div>
                </div>

                {/* Meals List */}
                <div className="px-6 py-5 flex-1 relative z-10 space-y-5 border-t border-slate-100">
                    <MealItem
                        type="Breakfast"
                        calories={380}
                        title="Fluffy Protein Pancakes with Fresh Strawberries"
                        macros={{ c: 42, p: 22, f: 10 }}
                        imgSrc="https://images.unsplash.com/photo-1528207776546-322186407074?auto=format&fit=crop&q=80&w=150"
                        tagColor="bg-[#a8e6cf]"
                    />
                    <MealItem
                        type="Lunch"
                        calories={420}
                        title="Grilled Chicken Salad with Avocado and Fresh Vegetables"
                        macros={{ c: 15, p: 40, f: 22 }}
                        imgSrc="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=150"
                        tagColor="bg-[#baec60]"
                    />
                    <MealItem
                        type="Snack"
                        calories={420}
                        title="Greek Yogurt with Granola and Mixed Berries"
                        macros={{ c: 28, p: 15, f: 8 }}
                        imgSrc="https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=150"
                        tagColor="bg-[#ffd3b6]"
                    />
                    <MealItem
                        type="Dinner"
                        calories={450}
                        title="Baked Salmon with Steamed Asparagus"
                        macros={{ c: 10, p: 35, f: 28 }}
                        imgSrc="https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=150"
                        tagColor="bg-[#ffbd59]"
                    />
                </div>

                {/* Recent Activity */}
                <div className="px-6 pb-6 pt-4 border-t border-slate-100">
                    <h3 className="font-bold text-base mb-5 text-slate-800">Recent Activity</h3>
                    <div className="relative space-y-5 before:absolute before:inset-0 before:ml-3 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                        <ActivityItem
                            time="6:00 PM"
                            title="Notification"
                            desc="Congratulations! You've reached 75% of your cardio endurance goal"
                            icon={<CheckCircle2 size={16} className="text-[#84cc16]" />}
                            iconBg="bg-[#ecfccb]"
                        />
                        <ActivityItem
                            time="4:30 PM"
                            title="Lunch Logged Description"
                            desc="~ 500 kcal added. You have reached 60% of your daily calorie goal."
                            icon={<Clock size={16} className="text-orange-500" />}
                            iconBg="bg-orange-100"
                        />
                        <ActivityItem
                            time="4:30 PM"
                            title="Nutrition Summary Updated"
                            desc="Total intake: 1,200 kcal. You are currently 300 kcal under your daily limit."
                            icon={<Clock size={16} className="text-orange-500" />}
                            iconBg="bg-orange-100"
                        />
                    </div>
                </div>
            </aside>
=======
            <RightPanel />
>>>>>>> 2d88d27a5f1de6e160ca7642bf0073a053576e8d
        </div>
    );
}

<<<<<<< HEAD
// ─── Sub-Components ─────────────────────────────────────────────────────────────

function AdvancedStatsDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    if (!isOpen) return null;

    // Internal sub-component for timeframe selection
    const TimeframeSelector = ({ selected, onChange, options }: { selected: string, onChange: (val: string) => void, options: string[] }) => {
        const [showDropdown, setShowDropdown] = React.useState(false);
        return (
            <div className="relative">
                <div 
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="bg-[#cceb7c] px-3 py-1.5 rounded-lg text-[11px] font-bold text-[#558019] flex items-center gap-1 cursor-pointer hover:bg-[#bde068] transition-colors"
                >
                    {selected} <ChevronDown size={12} className={`transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
                </div>
                {showDropdown && (
                    <>
                        <div className="fixed inset-0 z-[120]" onClick={() => setShowDropdown(false)} />
                        <div className="absolute right-0 mt-2 w-36 bg-white border border-zinc-100 rounded-xl shadow-xl z-[130] py-1 animate-in fade-in zoom-in duration-200">
                            {options.map((opt) => (
                                <div 
                                    key={opt}
                                    onClick={() => { onChange(opt); setShowDropdown(false); }}
                                    className={`px-4 py-2.5 text-[11px] font-bold cursor-pointer hover:bg-[#f3f9e4] transition-colors border-b last:border-0 border-zinc-50 ${selected === opt ? 'text-[#558019]' : 'text-zinc-500'}`}
                                >
                                    {opt}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        );
    };

    const CALORIES_CHART_DATA = [
        { day: 'Sun', kcal: 1800 },
        { day: 'Mon', kcal: 1500 },
        { day: 'Tue', kcal: 1600 },
        { day: 'Wed', kcal: 2200 },
        { day: 'Thu', kcal: 1400 },
    ];

    const [calTimeframe, setCalTimeframe] = React.useState('5 วันที่ผ่านมา');
    const [healthTimeframe, setHealthTimeframe] = React.useState('5 วันที่ผ่านมา');
    const [hydroTimeframe, setHydroTimeframe] = React.useState('สัปดาห์นี้');
    const [historyTimeframe, setHistoryTimeframe] = React.useState('ดูทั้งหมด');

    const timeframeOptions = ["วันนี้", "เมื่อวาน", "5 วันที่ผ่านมา", "7 วันที่ผ่านมา", "เดือนนี้"];
    const historyOptions = ["ดูทั้งหมด", "สัปดาห์นี้", "สัปดาห์ที่แล้ว", "เดือนนี้"];

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/20 z-[100] transition-opacity duration-300 opacity-100" onClick={onClose} />
            
            {/* Drawer */}
            <div className="fixed inset-y-0 right-0 w-full md:w-[460px] bg-[#FCFBF8] shadow-2xl z-[110] transform transition-transform duration-300 ease-in-out overflow-y-auto translate-x-0">
                {/* Header Profile */}
                <div className="flex items-center justify-between p-6 pb-4 border-b border-zinc-100 mb-6 bg-[#FCFBF8]">
                    <div className="flex items-center gap-4">
                        <button className="text-zinc-400 hover:text-zinc-600"><Search size={22} /></button>
                        <button className="text-zinc-400 hover:text-zinc-600 relative">
                            <Bell size={22} />
                            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#FCFBF8]"></span>
                        </button>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-zinc-200 rounded-full overflow-hidden">
                            <img src="https://ui-avatars.com/api/?name=Thanapat+Hongaram&background=E2E8F0&color=475569" alt="User" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="text-sm font-bold text-zinc-800 leading-tight">Thanapat Hongaram</span>
                            <span className="text-[11px] text-zinc-500 font-medium">Member</span>
                        </div>
                        <ChevronDown size={14} className="text-zinc-400 ml-1" />
                    </div>
                </div>
                
                {/* Content */}
                <div className="px-8 pb-10 flex flex-col gap-10">
                    
                    {/* Calories Activities */}
                    <div className="pt-2">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-[18px] font-black text-zinc-800 tracking-tight">สถิติแคลอรีและกิจกรรม</h2>
                            <TimeframeSelector 
                                selected={calTimeframe} 
                                onChange={setCalTimeframe} 
                                options={timeframeOptions} 
                            />
                        </div>
                        <div className="mb-8">
                            <div className="flex items-baseline gap-1.5 mb-1">
                                <span className="text-4xl font-black text-zinc-800">450</span>
                                <span className="text-[13px] text-zinc-400 font-medium">kcal คงเหลือ</span>
                            </div>
                            <p className="text-[11px] text-zinc-400 font-medium tracking-wide">เป้าหมายแคลอรี 2500 kcal</p>
                        </div>
                        <div className="h-44 w-full mb-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={CALORIES_CHART_DATA} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#A1A1AA', fontWeight: 500 }} dy={15} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#A1A1AA', fontWeight: 500 }} tickCount={5} domain={[0, 2200]} />
                                    <Bar dataKey="kcal" fill="#F6D365" radius={[4, 4, 0, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Health Indicators */}
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-[18px] font-black text-zinc-800 tracking-tight">ตัวบ่งชี้สุขภาพ</h2>
                            <TimeframeSelector 
                                selected={healthTimeframe} 
                                onChange={setHealthTimeframe} 
                                options={timeframeOptions} 
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-[#F6EFE9] rounded-3xl p-5 flex flex-col justify-between min-h-[110px]">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="text-[13px] font-bold text-zinc-700">BMI</span>
                                    <span className="bg-[#BCE875] text-[#4d7018] text-[10px] font-bold px-2 py-0.5 rounded-full">ปกติ</span>
                                </div>
                                <span className="text-3xl font-black text-zinc-800">22.5</span>
                            </div>
                            <div className="bg-[#F6EFE9] rounded-3xl p-5 flex flex-col justify-between min-h-[110px]">
                                <span className="text-[13px] font-bold text-zinc-700 mb-3">% Body Fat</span>
                                <span className="text-3xl font-black text-zinc-800">18%</span>
                            </div>
                            <div className="bg-[#F6EFE9] rounded-3xl p-5 flex flex-col justify-between min-h-[110px]">
                                <span className="text-[13px] font-bold text-zinc-700 mb-3">BMR</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-black text-zinc-800">1650</span>
                                    <span className="text-[11px] font-bold text-zinc-500">kcal</span>
                                </div>
                            </div>
                            <div className="bg-[#F6EFE9] rounded-3xl p-5 flex flex-col justify-between min-h-[110px]">
                                <span className="text-[13px] font-bold text-zinc-700 mb-3">TDEE</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-black text-zinc-800">2300</span>
                                    <span className="text-[11px] font-bold text-zinc-500">kcal</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hydration */}
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-[18px] font-black text-zinc-800 tracking-tight">การดื่มน้ำ</h2>
                            <TimeframeSelector 
                                selected={hydroTimeframe} 
                                onChange={setHydroTimeframe} 
                                options={["สัปดาห์นี้", "สัปดาห์ที่แล้ว", "เดือนนี้"]} 
                            />
                        </div>
                        <div className="flex gap-8 items-center mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-[#E5F5C1] flex items-center justify-center text-[#6CA920]">
                                    <Droplet size={24} fill="currentColor" strokeWidth={0} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[11px] font-medium text-zinc-500 mb-0.5">ระดับความชุ่มชื้น</span>
                                    <span className="text-[15px] font-black text-zinc-800">ปกติ</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-[#FFAEB4] flex items-center justify-center text-white">
                                    <Droplet size={24} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[11px] font-medium text-zinc-500 mb-0.5">ปริมาณที่ดื่ม</span>
                                    <span className="text-[15px] font-black text-zinc-800">2.0 L</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Historical Results Summary */}
                    <div className="pb-10">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-[18px] font-black text-zinc-800 tracking-tight">ประวัติผลลัพธ์ย้อนหลัง</h2>
                            <TimeframeSelector 
                                selected={historyTimeframe} 
                                onChange={setHistoryTimeframe} 
                                options={historyOptions} 
                            />
                        </div>
                        <div className="space-y-3">
                            {[
                                { date: '15 มี.ค. 2026', weight: '72.5 kg', bmi: '22.8', status: 'ปกติ' },
                                { date: '08 มี.ค. 2026', weight: '73.2 kg', bmi: '23.0', status: 'ปกติ' },
                                { date: '01 มี.ค. 2026', weight: '74.0 kg', bmi: '23.4', status: 'เริ่มมีน้ำหนักเกิน' },
                            ].map((item, idx) => (
                                <div key={idx} className="bg-white border border-zinc-100 rounded-2xl p-4 flex justify-between items-center shadow-sm">
                                    <div className="flex flex-col">
                                        <span className="text-[11px] font-bold text-zinc-400 mb-0.5">{item.date}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-black text-zinc-800">{item.weight}</span>
                                            <span className="text-[11px] font-bold text-zinc-500">BMI {item.bmi}</span>
                                        </div>
                                    </div>
                                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${item.status === 'ปกติ' ? 'bg-[#EEF7F1] text-[#4d7018]' : 'bg-[#FFF5F5] text-[#E53E3E]'}`}>
                                        {item.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

// Subcomponents

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
=======
function MacroBlock({ label, value, max, percentage }: { label: string, value: number, max: number, percentage: number }) {
>>>>>>> 2d88d27a5f1de6e160ca7642bf0073a053576e8d
    return (
        <div className="flex items-stretch h-14 w-full">
            <div className="w-36 bg-gray-100/80 rounded-l-xl flex items-center justify-center border-r border-white/50">
                <span className="text-lg font-black text-gray-900">{value} <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">/ {max}ก.</span></span>
            </div>
            <div className="flex-1 bg-gray-50/50 rounded-r-xl p-3 flex flex-col justify-between">
                <div className="flex justify-between text-[11px] font-black tracking-tight mb-1 uppercase">
                    <span className="text-gray-400">{label}</span>
                    <span className="text-gray-900">{percentage}%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-[#C6E065] rounded-full transition-all duration-1000"
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
}

function MenuCard({ category, calories, title, description, macros, image }: { category: string, calories: number, title: string, description: string, macros: { c: number, p: number, f: number }, image: string }) {
    return (
        <div className="group cursor-pointer">
            <div className="relative rounded-[32px] overflow-hidden mb-5 aspect-[4/3] shadow-sm">
                <img
                    src={image}
                    alt={title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-[#C6E065] text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-sm">
                    {category}
                </div>
                <div className="absolute top-4 right-4 bg-white text-gray-900 text-[10px] font-black px-4 py-1.5 rounded-full shadow-sm border border-gray-100 flex items-center gap-1.5">
                    <Flame className="w-3 h-3 text-orange-400" /> {calories} kcal
                </div>
            </div>

            <div className="flex gap-4 text-[11px] font-black text-gray-400 mb-4 px-1">
                <span className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-[#faf8f2] border border-[#f0e6cc] rounded-lg flex items-center justify-center text-[9px] font-black text-[#3d3522]">C</div> {macros.c} ก.
                </span>
                <span className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-[#faf8f2] border border-[#f0e6cc] rounded-lg flex items-center justify-center text-[9px] font-black text-[#3d3522]">P</div> {macros.p} ก.
                </span>
                <span className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-[#faf8f2] border border-[#f0e6cc] rounded-lg flex items-center justify-center text-[9px] font-black text-[#3d3522]">F</div> {macros.f} ก.
                </span>
            </div>

            <h4 className="font-black text-xl leading-tight mb-2 text-gray-900 group-hover:text-orange-500 transition-colors">
                {title}
            </h4>
            <p className="text-sm text-gray-400 font-medium leading-relaxed line-clamp-2">
                {description}
            </p>
        </div>
    );
}
