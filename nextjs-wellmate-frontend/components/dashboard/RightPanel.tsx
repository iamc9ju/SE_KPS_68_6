"use client";

import React, { useMemo, useState } from "react";
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
    Activity,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const addDays = (date: Date, days: number) => {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next;
};

const startOfWeekMonday = (date: Date) => {
    const base = new Date(date);
    const day = base.getDay();
    const offset = day === 0 ? -6 : 1 - day;
    base.setDate(base.getDate() + offset);
    base.setHours(0, 0, 0, 0);
    return base;
};

const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

export default function RightPanel() {
    const { user } = useAuthStore();
    const [expandedMeal, setExpandedMeal] = useState<string | null>("lunch");
    const [selectedDate, setSelectedDate] = useState(() => new Date());

    const weekStart = useMemo(() => startOfWeekMonday(selectedDate), [selectedDate]);
    const days = useMemo(
        () =>
            Array.from({ length: 7 }, (_, i) => {
                const date = addDays(weekStart, i);
                return {
                    key: date.toISOString(),
                    day: WEEKDAYS[i],
                    date,
                    isActive: isSameDay(date, selectedDate),
                };
            }),
        [selectedDate, weekStart],
    );

    const monthLabel = selectedDate.toLocaleDateString("en-US", { month: "long" });
    const yearLabel = selectedDate.getFullYear();
    const profileName = user ? `${user.firstName} ${user.lastName}` : "Brook Thana";
    const profileRole = user?.role ?? "patient";

    const meals = [
        {
            id: "breakfast",
            type: "Breakfast",
            calories: 380,
            title: "Protein pancakes with fresh berries",
            macros: { c: 42, p: 22, f: 10 },
            img: "https://images.unsplash.com/photo-1528207776546-322186407074?auto=format&fit=crop&q=80&w=300",
            color: "bg-[#C6E065]",
        },
        {
            id: "lunch",
            type: "Lunch",
            calories: 420,
            title: "Grilled chicken salad with avocado",
            macros: { c: 15, p: 40, f: 22 },
            img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=300",
            color: "bg-[#D8F36C]",
        },
        {
            id: "snack",
            type: "Snack",
            calories: 420,
            title: "Greek yogurt with granola and berries",
            macros: { c: 28, p: 15, f: 8 },
            img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=300",
            color: "bg-[#ffd980]",
        },
        {
            id: "dinner",
            type: "Dinner",
            calories: 450,
            title: "Grilled salmon with steamed asparagus",
            macros: { c: 10, p: 35, f: 28 },
            img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=300",
            color: "bg-[#fb923c]",
        },
    ];

    return (
        <aside className="w-80 bg-white h-screen fixed right-0 top-0 border-l border-gray-100 p-6 overflow-y-auto hidden xl:block custom-scrollbar font-sans">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-400 rounded-2xl flex items-center justify-center text-white shadow-sm overflow-hidden">
                        <User className="w-7 h-7" />
                    </div>
                    <div>
                        <h4 className="text-base font-black text-gray-900 leading-tight">
                            {profileName}
                        </h4>
                        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">
                            {profileRole === "patient"
                                ? "Member"
                                : profileRole === "nutritionist"
                                  ? "Nutritionist"
                                  : profileRole === "food_partner"
                                    ? "Food Partner"
                                    : profileRole === "admin"
                                      ? "Administrator"
                                      : "Member"}
                        </p>
                    </div>
                </div>
                <div className="w-10 h-10 bg-[#fff5e6] rounded-xl flex items-center justify-center text-[#fb923c] cursor-pointer hover:scale-105 transition-transform">
                    <Bell className="w-5 h-5 fill-[#fb923c]/20" />
                </div>
            </div>

            <div className="mb-8">
                <div className="flex justify-between items-center mb-5">
                    <h3 className="text-lg font-black text-gray-900">
                        {monthLabel} <span className="text-gray-300 ml-1">{yearLabel}</span>
                    </h3>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setSelectedDate((prev) => addDays(prev, -7))}
                            className="p-1.5 rounded-lg border border-gray-100 text-gray-400 hover:bg-gray-50"
                            aria-label="Previous week"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setSelectedDate((prev) => addDays(prev, 7))}
                            className="p-1.5 rounded-lg border border-gray-100 text-gray-400 hover:bg-gray-50"
                            aria-label="Next week"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {days.map((item) => (
                        <div key={item.key} className="flex flex-col items-center gap-2">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{item.day}</span>
                            <button
                                type="button"
                                onClick={() => setSelectedDate(item.date)}
                                className={`w-9 h-11 flex items-center justify-center rounded-xl text-sm font-black transition-all ${
                                    item.isActive
                                        ? "bg-[#C6E065] text-[#1a1a1a] shadow-lg shadow-[#C6E065]/20"
                                        : "text-gray-900 hover:bg-gray-50"
                                }`}
                            >
                                {item.date.getDate()}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-3 mb-8">
                {meals.map((meal) => {
                    const isExpanded = expandedMeal === meal.id;
                    return (
                        <div
                            key={meal.id}
                            className={`border rounded-3xl overflow-hidden transition-all duration-300 ${
                                isExpanded
                                    ? "bg-white shadow-[0_12px_24px_rgba(0,0,0,0.06)] border-[#C6E065]"
                                    : "bg-white border-gray-200"
                            }`}
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
                                {isExpanded ? (
                                    <ChevronUp className="w-4 h-4 text-gray-400" />
                                ) : (
                                    <ChevronDown className="w-4 h-4 text-gray-300 group-hover:text-gray-400" />
                                )}
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
                                                <div className="flex items-center gap-1">
                                                    <Utensils className="w-3 h-3 text-[#d0d0d0]" /> <span>C: {meal.macros.c} g</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Activity className="w-3 h-3 text-[#d0d0d0]" /> <span>P: {meal.macros.p} g</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Droplets className="w-3 h-3 text-[#d0d0d0]" /> <span>F: {meal.macros.f} g</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div>
                <h3 className="text-lg font-black text-gray-900 mb-6 underline decoration-[#C6E065] decoration-4 underline-offset-4">Recent Activities</h3>
                <div className="space-y-0 relative">
                    <div className="absolute left-6 top-2 bottom-8 w-[1px] bg-gray-100"></div>

                    <TimelineItem
                        time="18:00"
                        title="Notification"
                        desc="Great job! You have completed 75% of your cardio goal."
                        icon={<Bell className="w-4 h-4" />}
                        iconBg="bg-[#C6E065]"
                    />

                    <TimelineItem
                        time="16:30"
                        title="Lunch logged successfully"
                        desc="Added 500 kcal. You reached 60% of your daily target."
                        icon={<Clock className="w-4 h-4" />}
                        iconBg="bg-[#ffd980]"
                    />

                    <TimelineItem
                        time="16:30"
                        title="Nutrition summary updated"
                        desc="Total intake 1,200 kcal. Remaining 300 kcal to hit today's target."
                        icon={<Activity className="w-4 h-4" />}
                        iconBg="bg-[#ffd980]"
                        isLast
                    />
                </div>
            </div>
        </aside>
    );
}

function TimelineItem({
    time,
    title,
    desc,
    icon,
    iconBg,
    isLast,
}: {
    time: string;
    title: string;
    desc: string;
    icon: React.ReactNode;
    iconBg: string;
    isLast?: boolean;
}) {
    return (
        <div className={`relative pl-14 pb-8 ${isLast ? "" : ""}`}>
            <div className={`absolute left-3 w-7 h-7 rounded-full flex items-center justify-center ${iconBg} shadow-sm z-10 border-2 border-white`}>
                <div className="text-gray-900 scale-75">{icon}</div>
            </div>
            <div>
                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{time}</span>
                <h5 className="text-[13px] font-black text-gray-800 mt-1">{title}</h5>
                <p className="text-[11px] text-gray-400 font-bold leading-relaxed mt-1 opacity-80">{desc}</p>
            </div>
        </div>
    );
}
