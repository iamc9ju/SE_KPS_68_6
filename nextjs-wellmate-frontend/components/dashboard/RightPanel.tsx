"use client";

import React, { useState } from "react";
import {
    ChevronRight,
    User,
    Bell,
    ChevronLeft,
    Flame,
    Utensils,
    Droplets,
    ChevronDown,
    ChevronUp,
    Clock,
    Activity
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

export default function RightPanel() {
    const { user } = useAuthStore();
    const [expandedMeal, setExpandedMeal] = useState<string | null>("lunch");

    const days = [
        { day: "จ.", date: 19 },
        { day: "อ.", date: 20 },
        { day: "พ.", date: 21, active: true },
        { day: "พฤ.", date: 22 },
        { day: "ศ.", date: 23 },
        { day: "ส.", date: 24 },
        { day: "อา.", date: 25 },
    ];

    const meals = [
        {
            id: "breakfast",
            type: "มื้อเช้า",
            calories: 380,
            title: "แพนเค้กโปรตีนกับสตรอว์เบอร์รี่สด",
            macros: { c: 42, p: 22, f: 10 },
            img: "https://images.unsplash.com/photo-1528207776546-322186407074?auto=format&fit=crop&q=80&w=300",
            color: "bg-[#C6E065]"
        },
        {
            id: "lunch",
            type: "มื้อเที่ยง",
            calories: 420,
            title: "สลัดไก่ย่างกับอะโวคาโดและผักสด",
            macros: { c: 15, p: 40, f: 22 },
            img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=300",
            color: "bg-[#D8F36C]"
        },
        {
            id: "snack",
            type: "ของว่าง",
            calories: 420,
            title: "กรีกโยเกิร์ต กราโนล่า และมิกซ์เบอร์รี่",
            macros: { c: 28, p: 15, f: 8 },
            img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=300",
            color: "bg-[#ffd980]"
        },
        {
            id: "dinner",
            type: "มื้อเย็น",
            calories: 450,
            title: "ปลาแซลมอนย่างกับหน่อไม้ฝรั่งนึ่ง",
            macros: { c: 10, p: 35, f: 28 },
            img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=300",
            color: "bg-[#fb923c]"
        }
    ];

    return (
        <aside className="w-80 bg-white h-screen fixed right-0 top-0 border-l border-gray-100 p-6 overflow-y-auto hidden xl:block custom-scrollbar font-sans">
            {}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-400 rounded-2xl flex items-center justify-center text-white shadow-sm overflow-hidden">
                        <User className="w-7 h-7" />
                    </div>
                    <div>
                        <h4 className="text-base font-black text-gray-900 leading-tight">
                            {user ? `${user.firstName} ${user.lastName}` : "กำลังโหลด..."}
                        </h4>
                        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">
                            {user?.role === "patient" ? "ผู้ใช้งานทั่วไป" :
                                user?.role === "nutritionist" ? "นักโภชนาการ" :
                                    user?.role === "food_partner" ? "ร้านอาหาร" :
                                        user?.role === "admin" ? "ผู้ดูแลระบบ" :
                                            user?.role || "สมาชิก"}
                        </p>
                    </div>
                </div>
                <div className="w-10 h-10 bg-[#fff5e6] rounded-xl flex items-center justify-center text-[#fb923c] cursor-pointer hover:scale-105 transition-transform">
                    <Bell className="w-5 h-5 fill-[#fb923c]/20" />
                </div>
            </div>

            {}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-5">
                    <h3 className="text-lg font-black text-gray-900">มกราคม <span className="text-gray-300 ml-1">2026</span></h3>
                    <div className="flex gap-2">
                        <button className="p-1.5 rounded-lg border border-gray-100 text-gray-400 hover:bg-gray-50"><ChevronLeft className="w-4 h-4" /></button>
                        <button className="p-1.5 rounded-lg border border-gray-100 text-gray-400 hover:bg-gray-50"><ChevronRight className="w-4 h-4" /></button>
                    </div>
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {days.map((item, i) => (
                        <div key={i} className="flex flex-col items-center gap-2">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{item.day}</span>
                            <div className={`w-9 h-11 flex items-center justify-center rounded-xl text-sm font-black transition-all ${item.active ? 'bg-[#C6E065] text-[#1a1a1a] shadow-lg shadow-[#C6E065]/20' : 'text-gray-900 hover:bg-gray-50'}`}>
                                {item.date}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {}
            <div className="space-y-3 mb-8">
                {meals.map((meal) => {
                    const isExpanded = expandedMeal === meal.id;
                    return (
                        <div
                            key={meal.id}
                            className={`border rounded-3xl overflow-hidden transition-all duration-300 ${isExpanded ? 'bg-white shadow-[0_12px_24px_rgba(0,0,0,0.06)] border-[#C6E065]' : 'bg-white border-gray-200'}`}
                        >
                            <button
                                onClick={() => setExpandedMeal(isExpanded ? null : meal.id)}
                                className="w-full px-4 py-4 flex items-center justify-between group text-left"
                            >
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className={`w-2 h-5 rounded-full ${meal.color}`}></div>
                                    <span className="text-[11px] font-black text-gray-800 bg-gray-100 px-3 py-1.5 rounded-xl">
                                        {meal.type}
                                    </span>
                                    <span className="text-[11px] font-bold text-gray-400 flex items-center gap-1">
                                        <Flame className="w-3.5 h-3.5 text-orange-400" /> {meal.calories} kcal
                                    </span>
                                </div>
                                {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-300 group-hover:text-gray-400" />}
                            </button>

                            {isExpanded && (
                                <div className="px-4 pb-5 animate-fadeIn">
                                    <div className="flex gap-4 items-start">
                                        <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100 shadow-sm">
                                            <img src={meal.img} alt={meal.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h5 className="text-[13px] font-black text-gray-900 leading-snug mb-2 line-clamp-2">
                                                {meal.title}
                                            </h5>
                                            <div className="h-[1px] bg-gray-100 w-full mb-3"></div>
                                            <div className="flex flex-wrap justify-between items-center text-[10px] font-black text-gray-400/80 gap-y-1">
                                                <div className="flex items-center gap-1"><Utensils className="w-3 h-3 text-[#d0d0d0]" /> <span>ค. {meal.macros.c} ก.</span></div>
                                                <div className="flex items-center gap-1"><Activity className="w-3 h-3 text-[#d0d0d0]" /> <span>ป. {meal.macros.p} ก.</span></div>
                                                <div className="flex items-center gap-1"><Droplets className="w-3 h-3 text-[#d0d0d0]" /> <span>ข. {meal.macros.f} ก.</span></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {}
            <div>
                <h3 className="text-lg font-black text-gray-900 mb-6 underline decoration-[#C6E065] decoration-4 underline-offset-4">กิจกรรมล่าสุด</h3>
                <div className="space-y-0 relative">
                    <div className="absolute left-6 top-2 bottom-8 w-[1px] bg-gray-100"></div>

                    <TimelineItem
                        time="18 : 00 น."
                        title="การแจ้งเตือน:"
                        desc='"ยินดีด้วย! คุณทำเป้าหมายการออกกำลังกายคาร์ดิโอสำเร็จแล้ว 75%!"'
                        icon={<Bell className="w-4 h-4" />}
                        iconBg="bg-[#C6E065]"
                    />

                    <TimelineItem
                        time="16 : 30 น."
                        title="บันทึกมื้อเที่ยงสำเร็จ"
                        desc="- เพิ่ม 500 kcal แล้ว คุณได้รับแคลอรี่ครบ 60% ของเป้าหมายรายวัน"
                        icon={<Clock className="w-4 h-4" />}
                        iconBg="bg-[#ffd980]"
                    />

                    <TimelineItem
                        time="16 : 30 น."
                        title="อัปเดตสรุปข้อมูลโภชนาการ"
                        desc="ปริมาณที่ได้รับทั้งหมด: 1,200 kcal. คุณยังได้รับแคลอรี่น้อยกว่าเป้าหมาย 300 kcal"
                        icon={<Activity className="w-4 h-4" />}
                        iconBg="bg-[#ffd980]"
                        isLast
                    />
                </div>
            </div>
        </aside>
    );
}

function TimelineItem({ time, title, desc, icon, iconBg, isLast }: { time: string, title: string, desc: string, icon: React.ReactNode, iconBg: string, isLast?: boolean }) {
    return (
        <div className={`relative pl-14 pb-8 ${isLast ? '' : ''}`}>
            <div className={`absolute left-3 w-7 h-7 rounded-full flex items-center justify-center ${iconBg} shadow-sm z-10 border-2 border-white`}>
                <div className="text-gray-900 scale-75">
                    {icon}
                </div>
            </div>
            <div>
                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{time}</span>
                <h5 className="text-[13px] font-black text-gray-800 mt-1">{title}</h5>
                <p className="text-[11px] text-gray-400 font-bold leading-relaxed mt-1 opacity-80">{desc}</p>
            </div>
        </div>
    );
}
