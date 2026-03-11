"use client";

import React from "react";
import Skeleton from "@/components/ui/Skeleton";
import {
    Flame,
    Plus,
    Utensils,
    Droplets
} from "lucide-react";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer
} from "recharts";
import RightPanel from "@/components/dashboard/RightPanel";
import StatCard from "@/components/dashboard/StatCard";
import { useAuthStore } from "@/store/auth-store";
import { StatCardSkeleton, MacroBlockSkeleton, MenuCardSkeleton } from "@/components/dashboard/DashboardSkeletons";

export default function DashboardPage() {
    const { user } = useAuthStore();
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const calorieData = [
        { name: "ได้รับแล้ว", value: 1750 },
        { name: "คงเหลือ", value: 1250 },
    ];

    return (
        <div className="flex-1 flex flex-col min-h-screen">
            <main className="flex-1 overflow-y-auto px-8 py-10 z-10 custom-scrollbar ml-64 mr-80">
                <div className="max-w-[1240px] mx-auto">
                    { }
                    <header className="mb-8 animate-fadeIn">
                        <h1 className="text-4xl font-black text-[#1a1a1a] tracking-tight mb-2">
                            สวัสดี , {user?.firstName || "ผู้ใช้งานใหม่"}!
                        </h1>
                        <p className="text-gray-500 font-medium text-lg">
                            มาเริ่มการเดินทางสู่สุขภาพที่ดีขึ้นตั้งแต่วันนี้กันเถอะ
                        </p>
                    </header>

                    { }
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8 animate-slideUp">
                        {loading ? (
                            Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
                        ) : (
                            <>
                                { }
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
                                        { }
                                        <div className="absolute top-[1px] left-0 right-0 flex justify-between px-2 opacity-30">
                                            {Array.from({ length: 21 }).map((_, i) => (
                                                i % 5 !== 0 && <div key={i} className="h-2 w-[1px] bg-gray-400"></div>
                                            ))}
                                        </div>
                                    </div>
                                </StatCard>

                                { }
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

                                { }
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

                                { }
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
                            </>
                        )}
                    </div>

                    { }
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
                            { }
                            <div className="relative w-72 h-72 flex-shrink-0">
                                {loading ? (
                                    <Skeleton className="w-full h-full rounded-full" />
                                ) : (
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
                                )}
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <Flame className="text-gray-900 mb-2 w-8 h-8 fill-gray-900/10" />
                                    {loading ? (
                                        <Skeleton className="w-24 h-12" />
                                    ) : (
                                        <span className="text-5xl font-black text-gray-900">1750</span>
                                    )}
                                    <span className="text-[11px] text-gray-500 font-bold uppercase tracking-widest mt-1">kcal</span>
                                    <span className="text-[11px] text-gray-400 font-bold mt-1">แคลอรี่คงเหลือ</span>
                                </div>
                            </div>

                            { }
                            <div className="flex-1 w-full space-y-4">
                                {loading ? (
                                    Array.from({ length: 3 }).map((_, i) => <MacroBlockSkeleton key={i} />)
                                ) : (
                                    <>
                                        <MacroBlock label="คาร์โบไฮเดรต" value={120} max={325} percentage={37} />
                                        <MacroBlock label="โปรตีน" value={70} max={75} percentage={93} />
                                        <MacroBlock label="ไขมัน" value={20} max={44} percentage={45} />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    { }
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
                            {loading ? (
                                Array.from({ length: 2 }).map((_, i) => <MenuCardSkeleton key={i} />)
                            ) : (
                                <>
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
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <RightPanel />
        </div>
    );
}

function MacroBlock({ label, value, max, percentage }: { label: string, value: number, max: number, percentage: number }) {
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
