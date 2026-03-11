"use client";

import React, { useEffect, useState } from "react";
import { appointmentsApi, Appointment } from "@/services/appointments";
import { format, parseISO } from "date-fns";
import { th } from "date-fns/locale";
import { User, QrCode, AlertCircle, CheckCircle2, XCircle, MessageCircle, Droplets } from "lucide-react";
import { PiCalendarBlankLight, PiWarningCircleLight, PiCheckCircleLight } from "react-icons/pi";
import Image from "next/image";

export default function AppointmentsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                setLoading(true);
                const data = await appointmentsApi.getMyAppointments();
                setAppointments(data);
                setError(null);
            } catch (err: any) {
                console.error("Error fetching appointments:", err);
                setError(err.response?.data?.message || "ไม่สามารถโหลดข้อมูลการนัดหมายได้");
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "confirmed": return "text-green-600 bg-green-50 border-green-200";
            case "completed": return "text-gray-600 bg-gray-50 border-gray-200";
            case "cancelled": return "text-red-600 bg-red-50 border-red-200";
            case "pending": default: return "text-orange-600 bg-orange-50 border-orange-200";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "confirmed": return "ยืนยันแล้ว";
            case "completed": return "เสร็จสิ้น";
            case "cancelled": return "ยกเลิกแล้ว";
            case "pending": default: return "รอการยืนยัน / ชำระเงิน";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "confirmed": return <CheckCircle2 className="w-4 h-4" />;
            case "completed": return <CheckCircle2 className="w-4 h-4" />;
            case "cancelled": return <XCircle className="w-4 h-4" />;
            case "pending": default: return <AlertCircle className="w-4 h-4" />;
        }
    };

    const summary = {
        total: appointments.length,
        pending: appointments.filter(a => a.status === "pending").length,
        confirmed: appointments.filter(a => a.status === "confirmed").length,
        completed: appointments.filter(a => a.status === "completed").length,
        cancelled: appointments.filter(a => a.status === "cancelled").length
    };

    const [activeTab, setActiveTab] = useState("ทั้งหมด");
    const filteredAppointments = activeTab === "ทั้งหมด"
        ? appointments
        : appointments.filter(a => {
            if (activeTab === "รอชำระเงิน/ยืนยัน") return a.status === "pending";
            if (activeTab === "ยืนยันแล้ว") return a.status === "confirmed";
            if (activeTab === "เสร็จสิ้น") return a.status === "completed";
            if (activeTab === "ยกเลิก") return a.status === "cancelled";
            return true;
        });

    return (
        <main className="flex-1 overflow-y-auto px-8 py-10 z-10 custom-scrollbar ml-64 bg-[#FDF9F3]">
            <div className="max-w-[1400px] mx-auto">
                <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fadeIn">
                    <h1 className="text-3xl font-black text-[#3d3522] tracking-tight">การนัดหมาย</h1>
                    <div className="flex items-center gap-3">
                        <button className="px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all flex items-center gap-2">
                            <QrCode className="w-4 h-4" /> ส่งออกข้อมูล
                        </button>
                    </div>
                </header>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slideUp">
                    <StatCard title="นัดหมายทั้งหมด" value={summary.total} icon={
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="6" width="18" height="15" rx="3" fill="#E0F2FE" /><path d="M3 11H21V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V11Z" fill="#3B82F6" /><path d="M8 3V7M16 3V7" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" /><rect x="7" y="14" width="4" height="4" rx="1" fill="white" /></svg>
                    } />
                    <StatCard title="รอยืนยัน" value={summary.pending} icon={
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="#FFEDD5" /><path d="M12 7V13L15 15" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    } />
                    <StatCard title="ยืนยันแล้ว" value={summary.confirmed} icon={
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="#ECFCCB" /><path d="M8 12.5L11 15.5L16 9.5" stroke="#84CC16" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    } />
                    <StatCard title="สำเร็จแล้ว" value={summary.completed} icon={
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="#F3F4F6" /><path d="M8 12.5L11 15.5L16 9.5" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    } />
                </div>

                {/* Main Content Area */}
                <div className="bg-white rounded-[32px] shadow-[0_4px_40px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden animate-slideUp delay-100">
                    {/* Tabs & Search */}
                    <div className="p-4 sm:p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex flex-wrap gap-1 p-1 bg-gray-50 rounded-2xl w-fit">
                            {[
                                { name: "ทั้งหมด", count: summary.total },
                                { name: "รอชำระเงิน/ยืนยัน", count: summary.pending },
                                { name: "ยืนยันแล้ว", count: summary.confirmed },
                                { name: "เสร็จสิ้น", count: summary.completed },
                                { name: "ยกเลิก", count: summary.cancelled }
                            ].map(tab => (
                                <button
                                    key={tab.name}
                                    onClick={() => setActiveTab(tab.name)}
                                    className={`px-5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === tab.name ? "bg-white text-[#3d3522] shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                                >
                                    {tab.name}
                                    {tab.count > 0 && (
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${activeTab === tab.name ? "bg-[#C6E065]/20 text-[#C6E065]" : "bg-gray-200 text-gray-400"}`}>
                                            {tab.count}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="ค้นหานัดหมาย..."
                                    className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#C6E065]/20 outline-none w-64"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th className="px-6 py-4 text-[13px] font-black text-gray-400 uppercase tracking-wider">รหัส</th>
                                    <th className="px-6 py-4 text-[13px] font-black text-gray-400 uppercase tracking-wider">วันที่</th>
                                    <th className="px-6 py-4 text-[13px] font-black text-gray-400 uppercase tracking-wider">นักโภชนาการ</th>
                                    <th className="px-6 py-4 text-[13px] font-black text-gray-400 uppercase tracking-wider">การชำระเงิน</th>
                                    <th className="px-6 py-4 text-[13px] font-black text-gray-400 uppercase tracking-wider">ค่าบริการ</th>
                                    <th className="px-6 py-4 text-[13px] font-black text-gray-400 uppercase tracking-wider">ประเภท</th>
                                    <th className="px-6 py-4 text-[13px] font-black text-gray-400 uppercase tracking-wider">สถานะ</th>
                                    <th className="px-6 py-4 text-[13px] font-black text-gray-400 uppercase tracking-wider">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-20 text-center">
                                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#C6E065] mx-auto"></div>
                                        </td>
                                    </tr>
                                ) : filteredAppointments.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-20 text-center text-gray-400 font-bold">
                                            ไม่พบข้อมูลการนัดหมาย
                                        </td>
                                    </tr>
                                ) : (
                                    filteredAppointments.map((apt) => (
                                        <tr key={apt.appointmentId} className="hover:bg-gray-50 transition-colors group">
                                            <td className="px-6 py-5">
                                                <span className="text-sm font-bold text-gray-400">#{apt.appointmentId.slice(0, 5)}</span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-[#3d3522]">
                                                        {format(parseISO(apt.startTime), "d MMM yyyy", { locale: th })}
                                                    </span>
                                                    <span className="text-[11px] font-bold text-gray-400">
                                                        {format(parseISO(apt.startTime), "HH:mm")} - {format(parseISO(apt.endTime), "HH:mm")}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm font-black text-[#3d3522]">
                                                        {apt.nutritionist?.firstName} {apt.nutritionist?.lastName}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${Number(apt.amount) > 0 && apt.status !== "pending" ? "bg-green-50 text-green-600 border-green-100" : "bg-orange-50 text-orange-600 border-orange-100"}`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${Number(apt.amount) > 0 && apt.status !== "pending" ? "bg-green-500" : "bg-orange-500"}`}></div>
                                                    {Number(apt.amount) > 0 && apt.status !== "pending" ? "ชำระเงินแล้ว" : "รอชำระเงิน"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="text-sm font-black text-[#3d3522]">฿{Number(apt.amount || 0).toLocaleString()}</span>
                                            </td>
                                            <td className="px-6 py-5 text-sm font-bold text-gray-400">Online</td>
                                            <td className="px-6 py-5">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold border ${getStatusColor(apt.status).replace("bg-", "bg-opacity-10 bg-")}`}>
                                                    {getStatusText(apt.status)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2">
                                                    <button className="p-2 bg-gray-50 rounded-lg text-gray-400 hover:text-[#3d3522] hover:bg-gray-100 transition-all">
                                                        <QrCode className="w-4 h-4" />
                                                    </button>
                                                    {apt.status === "confirmed" && (
                                                        <button className="p-2 bg-[#C6E065]/10 rounded-lg text-[#C6E065] hover:bg-[#C6E065] hover:text-white transition-all">
                                                            <Droplets className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    );
}

function StatCard({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) {
    return (
        <div className="bg-white p-6 rounded-[32px] shadow-[0_4px_25px_rgba(138,117,80,0.04)] border border-[#faf8f2] flex flex-col items-center text-center">
            <h3 className="text-[13px] font-black text-[#8a7550] uppercase tracking-widest mb-6 border-b border-[#faf8f2] w-full pb-3">{title}</h3>
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#faf8f2] rounded-2xl flex items-center justify-center">
                    {icon}
                </div>
                <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-[#3d3522]">{value}</span>
                    <span className="text-sm font-bold text-[#8a7550]">รายการ</span>
                </div>
            </div>
        </div>
    );
}

