"use client";

import React, { useState, useEffect, useMemo } from "react";
import { adminService } from "@/services/admin";
import {
    Users,
    CalendarCheck,
    TrendingUp,
    Utensils,
    Star,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    ChevronRight,
    X,
    Eye,
    UserCheck,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

type AppointmentItem = {
    id: string;
    name: string;
    nutritionist: string;
    time: string;
    status: string;
    type: string;
    img?: string;
};

type NutritionistItem = {
    name: string;
    rating: number;
    appointments: number;
    img?: string;
};

const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const buildWeeklyAppointments = (appointments: AppointmentItem[]) => {
    const base = dayLabels.map(day => ({ day, count: 0 }));
    appointments.forEach(a => {
        const dt = new Date(a.time);
        if (!Number.isNaN(dt.getTime())) {
            const dayIndex = dt.getDay();
            const mappedIndex = dayIndex == 0 ? 6 : dayIndex - 1;
            base[mappedIndex].count += 1;
        }
    });
    return base;
};

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    confirmed: { label: "ยืนยันแล้ว", color: "bg-green-100 text-green-700", icon: <CheckCircle className="w-3 h-3" /> },
    pending: { label: "รอตรวจสอบ", color: "bg-yellow-100 text-yellow-700", icon: <AlertCircle className="w-3 h-3" /> },
    completed: { label: "สำเร็จ", color: "bg-blue-100 text-blue-700", icon: <CheckCircle className="w-3 h-3" /> },
    cancelled: { label: "ยกเลิก", color: "bg-red-100 text-red-700", icon: <XCircle className="w-3 h-3" /> },
};

export default function AdminDashboard() {
    const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
    const [topNuts, setTopNuts] = useState<NutritionistItem[]>([]);
    const [stats, setStats] = useState({ totalUsers: 0, totalOrders: 0, totalPartners: 0, totalAppointments: 0, pendingAppointments: 0 });
    const [showAll, setShowAll] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        adminService.getDashboard().then(data => {
            setStats({
                totalUsers: data.stats?.totalUsers ?? 0,
                totalOrders: data.stats?.totalOrders ?? 0,
                totalPartners: data.stats?.totalPartners ?? 0,
                totalAppointments: data.stats?.totalAppointments ?? 0,
                pendingAppointments: data.stats?.pendingAppointments ?? 0
            });
            setAppointments(data.recentAppointments ?? []);
            setTopNuts(data.topNutritionists ?? []);
        }).catch(err => {
            console.error(err);
            setError("Failed to load data");
        }).finally(() => setLoading(false));
    }, []);
    const [selectedAppt, setSelectedAppt] = useState<AppointmentItem | null>(null);
    const [showStatModal, setShowStatModal] = useState<"users" | "appointments" | "orders" | "success" | null>(null);

    const displayed = showAll ? appointments : appointments.slice(0, 4);

    const counts = {
        confirmed: appointments.filter(a => a.status === "confirmed").length,
        pending: appointments.filter(a => a.status === "pending").length,
        completed: appointments.filter(a => a.status === "completed").length,
        cancelled: appointments.filter(a => a.status === "cancelled").length,
    };

    const weeklyAppointments = useMemo(() => buildWeeklyAppointments(appointments), [appointments]);
    const successRate = appointments.length > 0 ? Math.round((counts.completed / appointments.length) * 100) : 0;
    const todayLabel = new Date().toLocaleDateString('th-TH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const statLabels = {
        users: "Total users",
        appointments: "Appointments",
        orders: "Orders",
        success: "Success rate"
    };

    const getStatDetails = (key: keyof typeof statLabels) => {
        if (key === "users") {
            return [
                `Total users: ${stats.totalUsers}`,
                `Partners: ${stats.totalPartners}`,
                `Orders: ${stats.totalOrders}`,
                `Appointments: ${stats.totalAppointments}`,
                `Pending approvals: ${stats.pendingAppointments}`
            ];
        }
        if (key === "appointments") {
            return [
                `Appointments: ${stats.totalAppointments}`,
                `Pending approvals: ${stats.pendingAppointments}`,
                `Confirmed: ${counts.confirmed}`,
                `Completed: ${counts.completed}`,
                `Cancelled: ${counts.cancelled}`
            ];
        }
        if (key === "orders") {
            return [`Orders: ${stats.totalOrders}`];
        }
        return [
            `Completed: ${counts.completed}`,
            `Total: ${appointments.length}`,
            `Success rate: ${successRate}%`
        ];
    };

    const handleApprove = (id: string) => {
        setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: "confirmed" } : a));
        setSelectedAppt(null);
    };

    const handleCancel = (id: string) => {
        setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: "cancelled" } : a));
        setSelectedAppt(null);
    };


    return (
        <div className="min-h-screen bg-[#F5F1E8] p-6 lg:p-10">
            {/* Hero Banner */}
            <div className="relative w-full h-44 rounded-3xl overflow-hidden mb-8 shadow-sm">
                <img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1400&h=400&fit=crop" alt="Banner" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/65 to-transparent flex flex-col justify-center px-8">
                    <p className="text-[#ffd980] text-sm font-bold uppercase tracking-widest">WELLMATE Admin</p>
                    <h1 className="text-white text-3xl font-black tracking-tight mt-1">ภาพรวมระบบ</h1>
                    <p className="text-white/60 text-sm mt-1">{todayLabel} - {counts.pending} pending approvals</p>
                </div>
            </div>

            {/* Header row */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <p className="text-xs text-gray-400 font-medium">{todayLabel}</p>
                    <h2 className="text-2xl font-black text-[#1a1a1a]">แผงควบคุม</h2>
                </div>
            </div>
            {loading && <p className="text-xs text-gray-400 mb-4">Loading data...</p>}
            {error && <p className="text-xs text-red-500 mb-4">{error}</p>}

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                    { key: "users", label: statLabels.users, value: stats.totalUsers.toLocaleString(), sub: "All in system", icon: <Users className="w-6 h-6" />, color: "bg-[#ffd980]" },
                    { key: "appointments", label: statLabels.appointments, value: stats.totalAppointments.toLocaleString(), sub: `${stats.pendingAppointments} pending approvals`, icon: <CalendarCheck className="w-6 h-6" />, color: "bg-[#ffe9a0]" },
                    { key: "orders", label: statLabels.orders, value: stats.totalOrders.toLocaleString(), sub: `from ${stats.totalPartners} partners`, icon: <Utensils className="w-6 h-6" />, color: "bg-[#ffd980]" },
                    { key: "success", label: statLabels.success, value: `Success rate: ${successRate}%`, sub: "based on recent appointments", icon: <TrendingUp className="w-6 h-6" />, color: "bg-[#ffe9a0]" },
                ].map((stat, i) => (
                    <button
                        key={i}
                        onClick={() => setShowStatModal(stat.key)}
                        className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50 hover:shadow-md hover:scale-[1.02] transition-all text-left w-full"
                    >
                        <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
                            {stat.icon}
                        </div>
                        <h3 className="text-3xl font-black text-gray-900">{stat.value}</h3>
                        <p className="text-sm text-gray-400 font-medium mt-1">{stat.label}</p>
                        <p className="text-xs text-[#c9a800] font-medium mt-1">{stat.sub}</p>
                    </button>
                ))}
            </div>

            {/* Chart + Nutritionists */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-gray-50">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-black text-gray-900">การนัดหมายรายสัปดาห์</h2>
                        <span className="text-xs text-gray-400 bg-[#fff8e1] px-3 py-1 rounded-full font-medium">This week · {appointments.length} appointments</span>
                    </div>
                    <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={weeklyAppointments} barCategoryGap="30%">
                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9ca3af", fontWeight: 700 }} />
                            <YAxis hide />
                            <Tooltip cursor={{ fill: "#fffbf0" }} content={({ active, payload }) =>
                                active && payload?.length ? (
                                    <div className="bg-white border border-yellow-100 rounded-xl px-3 py-2 text-xs font-bold shadow">{payload[0].value} การนัด</div>
                                ) : null
                            } />
                            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                                {weeklyAppointments.map((_, i) => (
                                    <Cell key={i} fill={i === 0 ? "#ffd980" : "#fff3cc"} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50">
                    <div className="flex justify-between items-center mb-5">
                        <h2 className="text-lg font-black text-gray-900">นักโภชนาการยอดนิยม</h2>
                        <Star className="w-4 h-4 text-[#ffd980] fill-[#ffd980]" />
                    </div>
                    <div className="space-y-4">
                        {topNuts.length === 0 && (
                            <div className="text-sm text-gray-400">No nutritionists found</div>
                        )}
                        {topNuts.map((n, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="relative flex-shrink-0">
                                    <img src={n.img || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=80&h=80&fit=crop"} alt={n.name} className="w-10 h-10 rounded-2xl object-cover" />
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#ffd980] rounded-full flex items-center justify-center text-[9px] font-black text-[#7a5c00]">{i + 1}</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-gray-800">{n.name}</p>
                                    <p className="text-xs text-gray-400">{n.appointments} appointments</p>
                                </div>
                                <div className="flex items-center gap-1 text-xs font-bold text-gray-600">
                                    <Star className="w-3 h-3 text-[#ffd980] fill-[#ffd980]" />{n.rating}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Appointments */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50 mb-6">
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-lg font-black text-gray-900">การนัดหมายวันนี้</h2>
                    <button
                        onClick={() => setShowAll(v => !v)}
                        className="text-sm text-[#c9a800] font-bold flex items-center gap-1 hover:underline"
                    >
                        {showAll ? "ย่อลง" : "ดูทั้งหมด"} <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
                <div className="space-y-3">
                    {displayed.length === 0 && (
                        <div className="text-sm text-gray-400">No appointments</div>
                    )}
                    {displayed.map((appt, i) => {
                        const s = statusConfig[appt.status] || statusConfig.pending;
                        return (
                            <div key={i} className="flex items-center justify-between p-4 bg-[#fffdf0] rounded-2xl hover:bg-[#fff8d6] transition-colors">
                                <div className="flex items-center gap-4">
                                    <img src={appt.img || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=80&h=80&fit=crop"} alt={appt.name} className="w-10 h-10 rounded-2xl object-cover flex-shrink-0" />
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm">{appt.name}</p>
                                        <p className="text-xs text-gray-400">{appt.nutritionist} - {appt.type}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                                        <Clock className="w-3 h-3" />{appt.time}
                                    </div>
                                    <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${s.color}`}>
                                        {s.icon} {s.label}
                                    </span>
                                    <button
                                        onClick={() => setSelectedAppt(appt)}
                                        className="p-1.5 rounded-xl bg-[#fff3cc] hover:bg-[#ffd980] text-[#7a5c00] transition-colors"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    {appt.status === "pending" && (
                                        <button
                                            onClick={() => handleApprove(appt.id)}
                                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#ffd980] hover:bg-[#f5c518] text-[#7a5c00] text-xs font-bold transition-colors"
                                        >
                                            <UserCheck className="w-3 h-3" /> Approve</button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                {[
                    { label: "ยืนยันแล้ว", value: counts.confirmed, color: "text-green-600", bg: "bg-green-50" },
                    { label: "รอตรวจสอบ", value: counts.pending, color: "text-yellow-600", bg: "bg-yellow-50" },
                    { label: "สำเร็จ", value: counts.completed, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "ยกเลิก", value: counts.cancelled, color: "text-red-500", bg: "bg-red-50" },
                ].map((item, i) => (
                    <button
                        key={i}
                        onClick={() => setShowStatModal("การนัดหมายวันนี้")}
                        className={`${item.bg} rounded-2xl p-4 hover:scale-[1.03] transition-transform`}
                    >
                        <p className={`text-2xl font-black ${item.color}`}>{item.value}</p>
                        <p className="text-xs text-gray-500 font-medium mt-1">{item.label}</p>
                    </button>
                ))}
            </div>

            {/* Modal: View Appointment */}
            {selectedAppt && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-black text-gray-900">รายละเอียดการนัด</h3>
                            <button onClick={() => setSelectedAppt(null)} className="p-1.5 rounded-xl hover:bg-gray-100">
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>
                        <img src={selectedAppt.img || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=80&h=80&fit=crop"} alt={selectedAppt.name} className="w-16 h-16 rounded-2xl object-cover mb-4" />
                        <div className="space-y-2 text-sm mb-5">
                            <div className="flex justify-between"><span className="text-gray-400">รหัส</span><span className="font-bold">{selectedAppt.id}</span></div>
                            <div className="flex justify-between"><span className="text-gray-400">ลูกค้า</span><span className="font-bold">{selectedAppt.name}</span></div>
                            <div className="flex justify-between"><span className="text-gray-400">นักโภชนาการ</span><span className="font-bold">{selectedAppt.nutritionist}</span></div>
                            <div className="flex justify-between"><span className="text-gray-400">ประเภท</span><span className="font-bold">{selectedAppt.type}</span></div>
                            <div className="flex justify-between"><span className="text-gray-400">เวลา</span><span className="font-bold">{selectedAppt.time}</span></div>
                            <div className="flex justify-between items-center"><span className="text-gray-400">สถานะ</span>
                                <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${(statusConfig[selectedAppt.status] || statusConfig.pending).color}`}>
                                    {(statusConfig[selectedAppt.status] || statusConfig.pending).label}
                                </span>
                            </div>
                        </div>
                        {selectedAppt.status === "pending" && (
                            <div className="flex gap-2">
                                <button onClick={() => handleApprove(selectedAppt.id)} className="flex-1 bg-[#ffd980] hover:bg-[#f5c518] text-[#7a5c00] font-bold py-2.5 rounded-2xl text-sm transition-colors">
                                    ✓ อนุมัติ
                                </button>
                                <button onClick={() => handleCancel(selectedAppt.id)} className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2.5 rounded-2xl text-sm transition-colors">
                                    ✕ ยกเลิก
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Modal: Stat Detail */}
            {showStatModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-6 max-w-xs w-full shadow-2xl">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-black text-gray-900">{statLabels[showStatModal]}</h3>
                            <button onClick={() => setShowStatModal(null)} className="p-1.5 rounded-xl hover:bg-gray-100">
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>
                        <div className="space-y-2">
                            {getStatDetails(showStatModal).map((line, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-[#fffdf0] rounded-2xl text-sm font-medium text-gray-700">
                                    <div className="w-2 h-2 rounded-full bg-[#ffd980] flex-shrink-0" />
                                    {line}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
