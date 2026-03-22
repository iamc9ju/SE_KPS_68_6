"use client";

import React, { useState } from "react";
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

const weeklyAppointments = [
    { day: "จ.", count: 8 },
    { day: "อ.", count: 14 },
    { day: "พ.", count: 11 },
    { day: "พฤ.", count: 16 },
    { day: "ศ.", count: 9 },
    { day: "ส.", count: 5 },
    { day: "อา.", count: 3 },
];

const initialAppointments = [
    { id: "APM-001", name: "คุณสมชาย ใจดี", nutritionist: "นักโภชนาการ A", time: "10:00", status: "confirmed", type: "ปรึกษาโภชนาการ", img: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=80&h=80&fit=crop" },
    { id: "APM-002", name: "คุณสมหญิง สุขใส", nutritionist: "นักโภชนาการ B", time: "13:00", status: "pending", type: "ติดตามผล", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop" },
    { id: "APM-003", name: "คุณวิชัย มั่นคง", nutritionist: "นักโภชนาการ A", time: "15:00", status: "completed", type: "ปรึกษาโภชนาการ", img: "https://images.unsplash.com/photo-1528892952291-009c663ce843?w=80&h=80&fit=crop" },
    { id: "APM-004", name: "คุณนิภา งาม", nutritionist: "นักโภชนาการ C", time: "16:30", status: "cancelled", type: "ติดตามผล", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop" },
    { id: "APM-005", name: "คุณธนา สร้างสุข", nutritionist: "นักโภชนาการ B", time: "09:00", status: "pending", type: "วางแผนอาหาร", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop" },
    { id: "APM-006", name: "คุณวรรณา มีสุข", nutritionist: "นักโภชนาการ C", time: "14:00", status: "confirmed", type: "วางแผนอาหาร", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop" },
];

const topNutritionists = [
    { name: "นักโภชนาการ A", rating: 4.9, appointments: 42, img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=80&h=80&fit=crop" },
    { name: "นักโภชนาการ B", rating: 4.7, appointments: 38, img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=80&h=80&fit=crop" },
    { name: "นักโภชนาการ C", rating: 4.6, appointments: 31, img: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=80&h=80&fit=crop" },
];

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    confirmed: { label: "ยืนยันแล้ว", color: "bg-green-100 text-green-700", icon: <CheckCircle className="w-3 h-3" /> },
    pending: { label: "รอตรวจสอบ", color: "bg-yellow-100 text-yellow-700", icon: <AlertCircle className="w-3 h-3" /> },
    completed: { label: "สำเร็จ", color: "bg-blue-100 text-blue-700", icon: <CheckCircle className="w-3 h-3" /> },
    cancelled: { label: "ยกเลิก", color: "bg-red-100 text-red-700", icon: <XCircle className="w-3 h-3" /> },
};

const statDetails: Record<string, string[]> = {
    "ผู้ใช้งานทั้งหมด": ["ผู้ป่วย: 980 คน", "นักโภชนาการ: 24 คน", "ร้านอาหาร: 8 ร้าน", "ผู้ดูแลระบบ: 3 คน", "สมัครใหม่วันนี้: 12 คน"],
    "การนัดหมายวันนี้": ["ยืนยันแล้ว: 14 รายการ", "รอตรวจสอบ: 4 รายการ", "สำเร็จ: 4 รายการ", "ยกเลิก: 2 รายการ"],
    "รายการอาหาร": ["ข้าวและธัญพืช: 45 รายการ", "โปรตีน: 80 รายการ", "ผักและผลไม้: 120 รายการ", "เครื่องดื่ม: 67 รายการ"],
    "อัตราความสำเร็จ": ["เดือนนี้: 87%", "เดือนที่แล้ว: 82%", "เฉลี่ย 3 เดือน: 84%", "เป้าหมาย: 90%"],
};

export default function AdminDashboard() {
    const [appointments, setAppointments] = useState(initialAppointments);
    const [showAll, setShowAll] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedAppt, setSelectedAppt] = useState<typeof initialAppointments[0] | null>(null);
    const [showStatModal, setShowStatModal] = useState<string | null>(null);
    const [newAppt, setNewAppt] = useState({ name: "", nutritionist: "นักโภชนาการ A", time: "", type: "ปรึกษาโภชนาการ" });

    const displayed = showAll ? appointments : appointments.slice(0, 4);

    const counts = {
        confirmed: appointments.filter(a => a.status === "confirmed").length,
        pending: appointments.filter(a => a.status === "pending").length,
        completed: appointments.filter(a => a.status === "completed").length,
        cancelled: appointments.filter(a => a.status === "cancelled").length,
    };

    const handleApprove = (id: string) => {
        setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: "confirmed" } : a));
        setSelectedAppt(null);
    };

    const handleCancel = (id: string) => {
        setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: "cancelled" } : a));
        setSelectedAppt(null);
    };

    const handleAddAppointment = () => {
        if (!newAppt.name || !newAppt.time) return;
        const next = { ...newAppt, id: `APM-00${appointments.length + 1}`, status: "pending", img: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=80&h=80&fit=crop" };
        setAppointments(prev => [next, ...prev]);
        setShowAddModal(false);
        setNewAppt({ name: "", nutritionist: "นักโภชนาการ A", time: "", type: "ปรึกษาโภชนาการ" });
    };

    return (
        <div className="min-h-screen bg-[#F5F1E8] p-6 lg:p-10">
            {/* Hero Banner */}
            <div className="relative w-full h-44 rounded-3xl overflow-hidden mb-8 shadow-sm">
                <img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1400&h=400&fit=crop" alt="Banner" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/65 to-transparent flex flex-col justify-center px-8">
                    <p className="text-[#ffd980] text-sm font-bold uppercase tracking-widest">WELLMATE Admin</p>
                    <h1 className="text-white text-3xl font-black tracking-tight mt-1">ภาพรวมระบบ</h1>
                    <p className="text-white/60 text-sm mt-1">วันจันทร์ที่ 23 มีนาคม 2569 · มี {counts.pending} รายการรอการอนุมัติ</p>
                </div>
            </div>

            {/* Header row */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <p className="text-xs text-gray-400 font-medium">วันจันทร์ที่ 23 มีนาคม 2569</p>
                    <h2 className="text-2xl font-black text-[#1a1a1a]">แผงควบคุม</h2>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-[#ffd980] hover:bg-[#f5c518] text-[#1a1a1a] font-bold px-6 py-3 rounded-2xl text-sm transition-colors shadow-sm"
                >
                    + เพิ่มการนัดหมาย
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                    { label: "ผู้ใช้งานทั้งหมด", value: "1,248", sub: "+12 คนวันนี้", icon: <Users className="w-6 h-6" />, color: "bg-[#ffd980]" },
                    { label: "การนัดหมายวันนี้", value: String(appointments.length), sub: `${counts.pending} รอยืนยัน`, icon: <CalendarCheck className="w-6 h-6" />, color: "bg-[#ffe9a0]" },
                    { label: "รายการอาหาร", value: "312", sub: "จาก 8 ร้านค้า", icon: <Utensils className="w-6 h-6" />, color: "bg-[#ffd980]" },
                    { label: "อัตราความสำเร็จ", value: "87%", sub: "↑ 5% จากเดือนที่แล้ว", icon: <TrendingUp className="w-6 h-6" />, color: "bg-[#ffe9a0]" },
                ].map((stat, i) => (
                    <button
                        key={i}
                        onClick={() => setShowStatModal(stat.label)}
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
                        <span className="text-xs text-gray-400 bg-[#fff8e1] px-3 py-1 rounded-full font-medium">สัปดาห์นี้ · 66 รายการ</span>
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
                        {topNutritionists.map((n, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="relative flex-shrink-0">
                                    <img src={n.img} alt={n.name} className="w-10 h-10 rounded-2xl object-cover" />
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#ffd980] rounded-full flex items-center justify-center text-[9px] font-black text-[#7a5c00]">{i + 1}</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-gray-800">{n.name}</p>
                                    <p className="text-xs text-gray-400">{n.appointments} การนัด</p>
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
                    {displayed.map((appt, i) => {
                        const s = statusConfig[appt.status];
                        return (
                            <div key={i} className="flex items-center justify-between p-4 bg-[#fffdf0] rounded-2xl hover:bg-[#fff8d6] transition-colors">
                                <div className="flex items-center gap-4">
                                    <img src={appt.img} alt={appt.name} className="w-10 h-10 rounded-2xl object-cover flex-shrink-0" />
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm">{appt.name}</p>
                                        <p className="text-xs text-gray-400">{appt.nutritionist} · {appt.type}</p>
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
                                            <UserCheck className="w-3 h-3" /> อนุมัติ
                                        </button>
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
                        <img src={selectedAppt.img} alt={selectedAppt.name} className="w-16 h-16 rounded-2xl object-cover mb-4" />
                        <div className="space-y-2 text-sm mb-5">
                            <div className="flex justify-between"><span className="text-gray-400">รหัส</span><span className="font-bold">{selectedAppt.id}</span></div>
                            <div className="flex justify-between"><span className="text-gray-400">ลูกค้า</span><span className="font-bold">{selectedAppt.name}</span></div>
                            <div className="flex justify-between"><span className="text-gray-400">นักโภชนาการ</span><span className="font-bold">{selectedAppt.nutritionist}</span></div>
                            <div className="flex justify-between"><span className="text-gray-400">ประเภท</span><span className="font-bold">{selectedAppt.type}</span></div>
                            <div className="flex justify-between"><span className="text-gray-400">เวลา</span><span className="font-bold">{selectedAppt.time}</span></div>
                            <div className="flex justify-between items-center"><span className="text-gray-400">สถานะ</span>
                                <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${statusConfig[selectedAppt.status].color}`}>
                                    {statusConfig[selectedAppt.status].label}
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

            {/* Modal: Add Appointment */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl">
                        <div className="flex justify-between items-start mb-5">
                            <h3 className="text-lg font-black text-gray-900">เพิ่มการนัดหมาย</h3>
                            <button onClick={() => setShowAddModal(false)} className="p-1.5 rounded-xl hover:bg-gray-100">
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>
                        <div className="space-y-3 mb-5">
                            <div>
                                <label className="text-xs font-bold text-gray-500 mb-1 block">ชื่อลูกค้า</label>
                                <input value={newAppt.name} onChange={e => setNewAppt(p => ({ ...p, name: e.target.value }))} placeholder="คุณ..." className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 text-sm outline-none focus:border-[#ffd980]" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 mb-1 block">เวลา</label>
                                <input type="time" value={newAppt.time} onChange={e => setNewAppt(p => ({ ...p, time: e.target.value }))} className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 text-sm outline-none focus:border-[#ffd980]" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 mb-1 block">นักโภชนาการ</label>
                                <select value={newAppt.nutritionist} onChange={e => setNewAppt(p => ({ ...p, nutritionist: e.target.value }))} className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 text-sm outline-none focus:border-[#ffd980]">
                                    <option>นักโภชนาการ A</option>
                                    <option>นักโภชนาการ B</option>
                                    <option>นักโภชนาการ C</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 mb-1 block">ประเภท</label>
                                <select value={newAppt.type} onChange={e => setNewAppt(p => ({ ...p, type: e.target.value }))} className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 text-sm outline-none focus:border-[#ffd980]">
                                    <option>ปรึกษาโภชนาการ</option>
                                    <option>ติดตามผล</option>
                                    <option>วางแผนอาหาร</option>
                                </select>
                            </div>
                        </div>
                        <button onClick={handleAddAppointment} className="w-full bg-[#ffd980] hover:bg-[#f5c518] text-[#7a5c00] font-bold py-3 rounded-2xl text-sm transition-colors">
                            + เพิ่มการนัดหมาย
                        </button>
                    </div>
                </div>
            )}

            {/* Modal: Stat Detail */}
            {showStatModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-6 max-w-xs w-full shadow-2xl">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-black text-gray-900">{showStatModal}</h3>
                            <button onClick={() => setShowStatModal(null)} className="p-1.5 rounded-xl hover:bg-gray-100">
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>
                        <div className="space-y-2">
                            {(statDetails[showStatModal] || []).map((line, i) => (
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
