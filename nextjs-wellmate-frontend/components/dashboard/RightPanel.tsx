"use client";

import React, { useMemo, useState } from "react";
import {
    Bell,
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    Clock,
    User,
    Utensils,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

type Appointment = {
    appointmentId: string;
    startTime: string;
    status: "pending" | "confirmed" | "completed" | "cancelled";
    nutritionist?: {
        firstName: string;
        lastName: string;
    };
};

type NotificationItem = {
    notificationId: string;
    title: string;
    body: string;
    isRead: boolean;
    createdAt: string;
};

type MenuItem = {
    menuItemId: number;
    name: string;
    imageUrl?: string | null;
    category?: string | null;
    caloriesKcal?: number | null;
    foodPartner?: {
        partnerName: string;
    };
};

type RightPanelProps = {
    loading?: boolean;
    notifications: NotificationItem[];
    unreadNotifications: number;
    appointments: Appointment[];
    recommendedMenus: MenuItem[];
};

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const FALLBACK_FOOD_IMAGE =
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400";

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

export default function RightPanel({
    loading = false,
    notifications,
    unreadNotifications,
    appointments,
    recommendedMenus,
}: RightPanelProps) {
    const { user } = useAuthStore();
    const [selectedDate, setSelectedDate] = useState(() => new Date());

    const weekStart = useMemo(() => startOfWeekMonday(selectedDate), [selectedDate]);
    const days = useMemo(
        () =>
            Array.from({ length: 7 }, (_, index) => {
                const date = addDays(weekStart, index);
                return {
                    key: date.toISOString(),
                    day: WEEKDAYS[index],
                    date,
                    isActive: isSameDay(date, selectedDate),
                };
            }),
        [selectedDate, weekStart],
    );

    const upcomingAppointments = appointments
        .filter((appointment) => appointment.status === "pending" || appointment.status === "confirmed")
        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
        .slice(0, 3);

    const recentNotifications = notifications.slice(0, 3);
    const monthLabel = selectedDate.toLocaleDateString("en-US", { month: "long" });
    const yearLabel = selectedDate.getFullYear();
    const profileName = user ? `${user.firstName} ${user.lastName}`.trim() : "Member";

    return (
        <aside className="w-80 bg-white h-screen fixed right-0 top-0 border-l border-gray-100 p-6 overflow-y-auto hidden xl:block custom-scrollbar font-sans">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden shadow-sm">
                        {user?.profileImageUrl ? (
                            <img src={user.profileImageUrl} alt={profileName} className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-6 h-6 text-gray-500" />
                        )}
                    </div>
                    <div>
                        <h4 className="text-base font-black text-gray-900 leading-tight">{profileName}</h4>
                        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">Member</p>
                    </div>
                </div>
                <div className="relative w-10 h-10 bg-[#fff5e6] rounded-xl flex items-center justify-center text-[#fb923c]">
                    <Bell className="w-5 h-5 fill-[#fb923c]/20" />
                    {unreadNotifications > 0 && (
                        <span className="absolute -top-1 -right-1 min-w-5 h-5 rounded-full bg-red-500 px-1 text-[10px] font-black text-white flex items-center justify-center">
                            {unreadNotifications > 9 ? "9+" : unreadNotifications}
                        </span>
                    )}
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

            <section className="mb-8">
                <h3 className="text-lg font-black text-gray-900 mb-4">นัดหมายถัดไป</h3>
                <div className="space-y-3">
                    {loading ? (
                        <div className="rounded-3xl border border-gray-100 bg-gray-50 px-4 py-5 text-sm text-gray-400">
                            กำลังโหลดข้อมูล...
                        </div>
                    ) : upcomingAppointments.length === 0 ? (
                        <div className="rounded-3xl border border-gray-100 bg-gray-50 px-4 py-5 text-sm text-gray-500">
                            ยังไม่มีนัดหมายที่กำลังจะมาถึง
                        </div>
                    ) : (
                        upcomingAppointments.map((appointment) => (
                            <div key={appointment.appointmentId} className="rounded-3xl border border-gray-100 bg-white px-4 py-4 shadow-sm">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-[11px] font-black text-[#85B22E] uppercase tracking-widest">
                                            {appointment.status}
                                        </p>
                                        <h4 className="text-sm font-black text-gray-900 mt-1">
                                            {appointment.nutritionist
                                                ? `${appointment.nutritionist.firstName} ${appointment.nutritionist.lastName}`
                                                : "นักโภชนาการ"}
                                        </h4>
                                        <p className="text-xs text-gray-500 mt-2">
                                            {new Date(appointment.startTime).toLocaleString("th-TH", {
                                                day: "numeric",
                                                month: "short",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                    <CalendarDays className="w-5 h-5 text-gray-300" />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            <section className="mb-8">
                <h3 className="text-lg font-black text-gray-900 mb-4">เมนูจากฐานข้อมูล</h3>
                <div className="space-y-3">
                    {loading ? (
                        <div className="rounded-3xl border border-gray-100 bg-gray-50 px-4 py-5 text-sm text-gray-400">
                            กำลังโหลดเมนู...
                        </div>
                    ) : recommendedMenus.length === 0 ? (
                        <div className="rounded-3xl border border-gray-100 bg-gray-50 px-4 py-5 text-sm text-gray-500">
                            ยังไม่มีเมนูให้แสดง
                        </div>
                    ) : (
                        recommendedMenus.map((menu) => (
                            <div key={menu.menuItemId} className="rounded-3xl border border-gray-100 bg-white p-3 shadow-sm">
                                <div className="flex gap-3">
                                    <img
                                        src={menu.imageUrl || FALLBACK_FOOD_IMAGE}
                                        alt={menu.name}
                                        className="w-16 h-16 rounded-2xl object-cover border border-gray-100"
                                    />
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-[10px] font-black text-gray-500 bg-gray-100 px-2 py-1 rounded-xl">
                                                {menu.category || "เมนูอาหาร"}
                                            </span>
                                            <span className="text-[10px] font-bold text-orange-500">
                                                {menu.caloriesKcal ? `${menu.caloriesKcal} kcal` : "ไม่ระบุ kcal"}
                                            </span>
                                        </div>
                                        <h4 className="text-[13px] font-black text-gray-900 mt-2 line-clamp-2">{menu.name}</h4>
                                        <p className="text-[11px] text-[#85B22E] font-bold mt-1">
                                            {menu.foodPartner?.partnerName || "ร้านค้าในระบบ"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            <section>
                <h3 className="text-lg font-black text-gray-900 mb-4">การแจ้งเตือนล่าสุด</h3>
                <div className="space-y-3">
                    {loading ? (
                        <div className="rounded-3xl border border-gray-100 bg-gray-50 px-4 py-5 text-sm text-gray-400">
                            กำลังโหลดการแจ้งเตือน...
                        </div>
                    ) : recentNotifications.length === 0 ? (
                        <div className="rounded-3xl border border-gray-100 bg-gray-50 px-4 py-5 text-sm text-gray-500">
                            ยังไม่มีการแจ้งเตือนในระบบ
                        </div>
                    ) : (
                        recentNotifications.map((notification) => (
                            <div key={notification.notificationId} className="rounded-3xl border border-gray-100 bg-white px-4 py-4 shadow-sm">
                                <div className="flex items-start gap-3">
                                    <div className={`mt-1 w-8 h-8 rounded-xl flex items-center justify-center ${notification.isRead ? "bg-gray-100 text-gray-400" : "bg-[#f0f4d8] text-[#85B22E]"}`}>
                                        {notification.title.toLowerCase().includes("menu") ? (
                                            <Utensils className="w-4 h-4" />
                                        ) : (
                                            <Clock className="w-4 h-4" />
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h4 className="text-[13px] font-black text-gray-900">{notification.title}</h4>
                                        <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">{notification.body}</p>
                                        <p className="text-[10px] text-gray-300 font-bold mt-2">
                                            {new Date(notification.createdAt).toLocaleString("th-TH", {
                                                day: "numeric",
                                                month: "short",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </aside>
    );
}
