"use client";

import React, { useEffect, useState, useMemo } from "react";
import { 
    Users, 
    Calendar, 
    MessageSquare, 
    CheckCircle2, 
    Clock, 
    ChevronRight, 
    MoreHorizontal,
    Search,
    Filter,
    ArrowUpRight,
    Star,
    Loader2,
    TrendingUp,
    Activity
} from "lucide-react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { format, subDays, startOfDay, endOfDay, isWithinInterval } from "date-fns";
import { th } from "date-fns/locale";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from "recharts";

interface DashboardStats {
    totalPatients: number;
    appointmentsToday: number;
    pendingMealPlans: number;
    averageRating: number;
    totalReviews: number;
}

interface Appointment {
    appointmentId: string;
    patientId: string;
    startTime: string;
    endTime: string;
    status: string;
    type: string;
    patient: {
        firstName: string;
        lastName: string;
        user: {
            email: string;
            phone: string;
        };
    };
}

export default function NutritionistDashboard() {
    const [statsData, setStatsData] = useState<DashboardStats | null>(null);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const [statsRes, appointmentsRes] = await Promise.all([
                    api.get("/nutritionists/me/dashboard-stats"),
                    api.get("/appointments/me/nutritionist")
                ]);
                
                setStatsData(statsRes.data?.data ?? statsRes.data);
                const apptData = appointmentsRes.data?.data ?? appointmentsRes.data;
                setAppointments(Array.isArray(apptData) ? apptData : []);
            } catch (err: any) {
                console.error("Failed to fetch dashboard data:", err);
                setError("ไม่สามารถโหลดข้อมูลแดชบอร์ดได้ กรุณาลองใหม่อีกครั้ง");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const stats = [
        { 
            label: "คนไข้ในการดูแล", 
            value: statsData?.totalPatients?.toString() || "0", 
            icon: Users, 
            color: "bg-blue-50 text-blue-600", 
            trend: "+0%" 
        },
        { 
            label: "นัดหมายวันนี้", 
            value: statsData?.appointmentsToday?.toString() || "0", 
            icon: Calendar, 
            color: "bg-purple-50 text-purple-600", 
            trend: "0%" 
        },
        { 
            label: "แผนอาหารที่รอตรวจ", 
            value: statsData?.pendingMealPlans?.toString() || "0", 
            icon: Clock, 
            color: "bg-orange-50 text-orange-600", 
            trend: "0" 
        },
        { 
            label: "คะแนนรีวิวเฉลี่ย", 
            value: statsData?.averageRating?.toString() || "0", 
            icon: Star, 
            color: "bg-yellow-50 text-yellow-600", 
            trend: `จาก ${statsData?.totalReviews || 0} รีวิว` 
        },
    ];

    // Chart data: appointments per day for last 7 days
    const weeklyChartData = useMemo(() => {
        const safeAppts = Array.isArray(appointments) ? appointments : [];
        const today = new Date();
        return Array.from({ length: 7 }, (_, i) => {
            const day = subDays(today, 6 - i);
            const count = safeAppts.filter(a => {
                if (!a?.startTime) return false;
                return isWithinInterval(new Date(a.startTime), {
                    start: startOfDay(day),
                    end: endOfDay(day),
                });
            }).length;
            return {
                day: format(day, "EEE", { locale: th }),
                นัดหมาย: count,
            };
        });
    }, [appointments]);

    // Chart data: appointment status breakdown
    const statusBreakdownData = useMemo(() => {
        const safeAppts = Array.isArray(appointments) ? appointments : [];
        const statusMap: Record<string, number> = {};
        safeAppts.forEach(a => {
            const s = a?.status || "unknown";
            statusMap[s] = (statusMap[s] || 0) + 1;
        });
        const statusLabels: Record<string, string> = {
            confirmed: "ยืนยันแล้ว",
            pending: "รอยืนยัน",
            completed: "เสร็จสิ้น",
            cancelled: "ยกเลิก",
        };
        return Object.entries(statusMap).map(([key, value]) => ({
            name: statusLabels[key] || key,
            value,
        }));
    }, [appointments]);

    const PIE_COLORS = ["#C6E065", "#facc15", "#22c55e", "#f87171", "#a78bfa"];

    const upcomingAppointments = (Array.isArray(appointments) ? appointments : [])
        .filter(appt => appt && appt.startTime && new Date(appt.startTime) >= new Date())
        .slice(0, 3)
        .map(appt => ({
            id: appt.appointmentId,
            name: appt.patient ? `${appt.patient.firstName} ${appt.patient.lastName}` : "ไม่ระบุชื่อ",
            time: appt.startTime && appt.endTime 
                ? `${format(new Date(appt.startTime), "HH:mm")} - ${format(new Date(appt.endTime), "HH:mm")}`
                : "ไม่ระบุเวลา",
            type: appt.type === "online" ? "ปรึกษาออนไลน์" : "นัดหมาย",
            status: appt.status === "confirmed" ? "ยืนยันแล้ว" : "รอยืนยัน",
            avatar: appt.patient ? (appt.patient.firstName[0] || "") + (appt.patient.lastName[0] || "") : "?",
            rawStatus: appt.status
        }));

    const activePatients = Array.from(new Set((Array.isArray(appointments) ? appointments : []).map(a => a.patientId)))
        .slice(0, 3)
        .map(patientId => {
            const lastAppt = appointments.find(a => a.patientId === patientId);
            return {
                id: patientId,
                name: lastAppt?.patient ? `${lastAppt.patient.firstName} ${lastAppt.patient.lastName}` : "ไม่ระบุชื่อ",
                goal: "ติดตามภาวะโภชนาการ",
                progress: 50,
                lastActive: lastAppt ? format(new Date(lastAppt.startTime), "d MMM yyyy", { locale: th }) : "N/A"
            };
        });

    if (loading) {
        return (
            <main className="flex-1 h-screen overflow-y-auto px-8 py-10 z-10 custom-scrollbar ml-64">
                <div className="max-w-[1240px] mx-auto space-y-8 animate-pulse">
                    {/* Header skeleton */}
                    <div className="flex justify-between items-center">
                        <div>
                            <div className="h-8 w-64 bg-gray-200 rounded-xl mb-2" />
                            <div className="h-4 w-80 bg-gray-100 rounded-lg" />
                        </div>
                        <div className="flex gap-3">
                            <div className="h-10 w-24 bg-gray-100 rounded-2xl" />
                            <div className="h-10 w-32 bg-[#C6E065]/30 rounded-2xl" />
                        </div>
                    </div>

                    {/* Stats cards skeleton */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white p-6 rounded-[32px] border border-gray-100">
                                <div className="flex justify-between mb-4">
                                    <div className="w-11 h-11 bg-gray-100 rounded-2xl" />
                                    <div className="w-12 h-5 bg-gray-100 rounded-full" />
                                </div>
                                <div className="h-7 w-16 bg-gray-200 rounded-lg mb-1" />
                                <div className="h-4 w-24 bg-gray-100 rounded-md" />
                            </div>
                        ))}
                    </div>

                    {/* Charts skeleton */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        <div className="lg:col-span-3 bg-white p-6 rounded-[32px] border border-gray-100">
                            <div className="flex justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 bg-green-50 rounded-xl" />
                                    <div>
                                        <div className="h-4 w-28 bg-gray-200 rounded-md mb-1" />
                                        <div className="h-3 w-16 bg-gray-100 rounded-sm" />
                                    </div>
                                </div>
                            </div>
                            <div className="h-[220px] bg-gray-50 rounded-2xl" />
                        </div>
                        <div className="lg:col-span-2 bg-white p-6 rounded-[32px] border border-gray-100">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-9 h-9 bg-purple-50 rounded-xl" />
                                <div>
                                    <div className="h-4 w-24 bg-gray-200 rounded-md mb-1" />
                                    <div className="h-3 w-16 bg-gray-100 rounded-sm" />
                                </div>
                            </div>
                            <div className="h-[220px] bg-gray-50 rounded-2xl flex items-center justify-center">
                                <div className="w-32 h-32 bg-gray-100 rounded-full" />
                            </div>
                        </div>
                    </div>

                    {/* Appointments & patients skeleton */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            <div className="flex justify-between">
                                <div className="h-6 w-48 bg-gray-200 rounded-lg" />
                                <div className="h-4 w-20 bg-gray-100 rounded-lg" />
                            </div>
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="bg-white p-5 rounded-[28px] border border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-100 rounded-2xl" />
                                        <div>
                                            <div className="h-4 w-32 bg-gray-200 rounded-md mb-2" />
                                            <div className="h-3 w-40 bg-gray-100 rounded-sm" />
                                        </div>
                                    </div>
                                    <div className="h-6 w-20 bg-gray-100 rounded-full" />
                                </div>
                            ))}
                        </div>
                        <div className="space-y-4">
                            <div className="h-6 w-28 bg-gray-200 rounded-lg" />
                            <div className="bg-white rounded-[32px] border border-gray-100 divide-y divide-gray-50 overflow-hidden">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="p-5">
                                        <div className="h-4 w-28 bg-gray-200 rounded-md mb-3" />
                                        <div className="h-3 w-36 bg-gray-100 rounded-sm mb-4" />
                                        <div className="h-1.5 w-full bg-gray-100 rounded-full" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <div className="flex-1 flex items-center justify-center ml-64 min-h-screen">
                <div className="bg-red-50 p-8 rounded-3xl border border-red-100 text-center max-w-md">
                    <h3 className="text-red-800 font-black text-xl mb-2">เกิดข้อผิดพลาด</h3>
                    <p className="text-red-600 mb-6">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-red-800 text-white rounded-xl font-bold hover:bg-red-900 transition-colors"
                    >
                        ลองใหม่อีกครั้ง
                    </button>
                </div>
            </div>
        );
    }

    return (
        <main className="flex-1 h-screen overflow-y-auto px-8 py-10 z-10 custom-scrollbar ml-64">
            <div className="max-w-[1240px] mx-auto space-y-8">
                {/* Header Section */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-[#1a1a1a] tracking-tight">แดชบอร์ดนักโภชนาการ</h1>
                        <p className="text-gray-500 font-medium">
                            ยินดีต้อนรับกลับมาครับ! วันนี้คุณมีนัดหมายทั้งหมด {statsData?.appointmentsToday || 0} เคส
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
                            <Filter size={18} />
                            ตัวกรอง
                        </button>
                        <button className="flex items-center gap-2 px-6 py-2.5 bg-[#C6E065] rounded-2xl text-sm font-bold text-[#3d3522] hover:shadow-lg transition-all shadow-md">
                            จัดเวลาทำงาน
                        </button>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, idx) => (
                        <motion.div 
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-2xl ${stat.color} transition-transform group-hover:scale-110`}>
                                    <stat.icon size={22} />
                                </div>
                                <span className={`text-[10px] font-black px-2 py-1 rounded-full ${
                                    stat.trend.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-500'
                                }`}>
                                    {stat.trend}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-[#1a1a1a]">{stat.value}</h3>
                                <p className="text-sm font-medium text-gray-400">{stat.label}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Weekly Activity Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="lg:col-span-3 bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-50 rounded-xl">
                                    <Activity size={18} className="text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-black text-[#1a1a1a]">กิจกรรมนัดหมาย</h3>
                                    <p className="text-xs text-gray-400">7 วันล่าสุด</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                <TrendingUp size={12} />
                                <span>ภาพรวม</span>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={220}>
                            <AreaChart data={weeklyChartData}>
                                <defs>
                                    <linearGradient id="colorAppointments" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#C6E065" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#C6E065" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#a3a3a3" }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 12, fill: "#a3a3a3" }} axisLine={false} tickLine={false} allowDecimals={false} />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: 16,
                                        border: "1px solid #e5e7eb",
                                        boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                                        fontSize: 13,
                                        fontWeight: 600,
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="นัดหมาย"
                                    stroke="#C6E065"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorAppointments)"
                                    dot={{ fill: "#C6E065", strokeWidth: 2, r: 4 }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </motion.div>

                    {/* Status Breakdown Pie Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="lg:col-span-2 bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-col"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-purple-50 rounded-xl">
                                <CheckCircle2 size={18} className="text-purple-600" />
                            </div>
                            <div>
                                <h3 className="font-black text-[#1a1a1a]">สถานะนัดหมาย</h3>
                                <p className="text-xs text-gray-400">ภาพรวมทั้งหมด</p>
                            </div>
                        </div>
                        {statusBreakdownData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={220}>
                                <PieChart>
                                    <Pie
                                        data={statusBreakdownData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={80}
                                        paddingAngle={4}
                                        dataKey="value"
                                        strokeWidth={0}
                                    >
                                        {statusBreakdownData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: 16,
                                            border: "1px solid #e5e7eb",
                                            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                                            fontSize: 13,
                                            fontWeight: 600,
                                        }}
                                    />
                                    <Legend
                                        iconType="circle"
                                        iconSize={8}
                                        wrapperStyle={{ fontSize: 11, fontWeight: 700 }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-gray-300 text-sm italic">
                                ยังไม่มีข้อมูล
                            </div>
                        )}
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Appointments */}
                    <section className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-black text-[#1a1a1a]">นัดหมายที่กำลังจะมาถึง</h2>
                            <button className="text-sm font-bold text-[#3d3522] hover:underline flex items-center gap-1">
                                ดูทั้งหมด <ChevronRight size={16} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {upcomingAppointments.length > 0 ? (
                                upcomingAppointments.map((appointment) => (
                                    <div 
                                        key={appointment.id}
                                        className="bg-white p-5 rounded-[28px] border border-gray-100 shadow-sm flex items-center justify-between group hover:border-[#C6E065]/50 transition-all"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center font-black text-gray-500 group-hover:bg-[#C6E065] group-hover:text-[#3d3522] transition-colors uppercase">
                                                {appointment.avatar}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-[#1a1a1a]">{appointment.name}</h4>
                                                <p className="text-xs text-gray-400 font-medium">{appointment.type} • {appointment.time}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`text-[11px] font-black px-3 py-1.5 rounded-full ${
                                                appointment.rawStatus === 'confirmed' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                                            }`}>
                                                {appointment.status}
                                            </span>
                                            <button className="p-2 hover:bg-gray-50 rounded-xl transition-colors">
                                                <MessageSquare size={18} className="text-gray-400" />
                                            </button>
                                            <button className="p-2 hover:bg-gray-50 rounded-xl transition-colors">
                                                <MoreHorizontal size={18} className="text-gray-400" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="bg-white p-10 rounded-[28px] border border-dashed border-gray-200 text-center">
                                    <Calendar className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                    <p className="text-gray-400 font-medium italic">ไม่มีนัดหมายใหม่ในช่วงนี้</p>
                                </div>
                            )}
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-[#1a1a1a] rounded-[32px] p-8 text-white relative overflow-hidden">
                            <div className="relative z-10 max-w-[60%]">
                                <h3 className="text-2xl font-black mb-2">เริ่มให้คำปรึกษาผ่านวิดีโอ?</h3>
                                <p className="text-gray-400 text-sm mb-6">คุณสามารถเริ่มห้องสนทนาวิดีโอสำหรับเคสถัดไปได้ทันที เพื่อเตรียมพร้อมก่อนเริ่มการนัดหมาย</p>
                                <button className="px-6 py-3 bg-[#C6E065] text-[#1a1a1a] font-black rounded-2xl hover:scale-105 transition-all">
                                    เปิดห้องสนทนา
                                </button>
                            </div>
                            <Calendar className="absolute -right-6 -bottom-6 w-48 h-48 text-white/5 rotate-12" />
                        </div>
                    </section>

                    {/* Right Column: Active Patients */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-black text-[#1a1a1a]">คนไข้ล่าสุด</h2>
                            <Search size={18} className="text-gray-400" />
                        </div>

                        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm divide-y divide-gray-50 overflow-hidden">
                            {activePatients.length > 0 ? (
                                activePatients.map((patient) => (
                                    <div key={patient.id} className="p-5 hover:bg-gray-50 transition-all group cursor-pointer">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-bold text-[#1a1a1a] group-hover:text-[#3d3522]">{patient.name}</h4>
                                            <ArrowUpRight size={16} className="text-gray-300 group-hover:text-[#3d3522]" />
                                        </div>
                                        <p className="text-xs text-gray-400 mb-4">{patient.goal}</p>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-gray-400">
                                                <span>ความคืบหน้า</span>
                                                <span>{patient.progress}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${patient.progress}%` }}
                                                    className="h-full bg-[#C6E065]"
                                                />
                                            </div>
                                        </div>
                                        <p className="mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest">นัดล่าสุด: {patient.lastActive}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-gray-400 italic text-sm">ยังไม่มีคนไข้ในประวัติ</div>
                            )}
                            <button className="w-full py-4 text-xs font-black text-gray-400 hover:text-[#3d3522] transition-colors bg-gray-50/50 uppercase tracking-widest">
                                ดูคนไข้ทั้งหมด
                            </button>
                        </div>

                        {statsData && statsData.pendingMealPlans > 0 && (
                            <div className="bg-[#C6E065]/10 border border-[#C6E065]/20 rounded-[32px] p-6 space-y-4">
                                <h4 className="text-sm font-black text-[#3d3522] uppercase tracking-wider">แจ้งเตือนระบบ</h4>
                                <div className="flex gap-3">
                                    <Clock size={20} className="text-[#3d3522] shrink-0" />
                                    <p className="text-xs text-[#3d3522]/70 font-medium leading-relaxed">
                                        มีนัดหมาย {statsData.pendingMealPlans} เคสที่ได้รับการยืนยันแล้วแต่ยังไม่มีแผนอาหาร กรุณาดำเนินการจัดเตรียมแผนอาหารให้คนไข้
                                    </p>
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </main>
    );
}
