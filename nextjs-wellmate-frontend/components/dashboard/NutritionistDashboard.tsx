"use client";

import React from "react";
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
    Star
} from "lucide-react";
import { motion } from "framer-motion";

export default function NutritionistDashboard() {
    // Mock data for the nutritionist
    const stats = [
        { label: "คนไข้ในการดูแล", value: "24", icon: Users, color: "bg-blue-50 text-blue-600", trend: "+12%" },
        { label: "นัดหมายวันนี้", value: "8", icon: Calendar, color: "bg-purple-50 text-purple-600", trend: "0%" },
        { label: "แผนอาหารที่รอตรวจ", value: "5", icon: Clock, color: "bg-orange-50 text-orange-600", trend: "-2" },
        { label: "คะแนนรีวิวเฉลี่ย", value: "4.9", icon: Star, color: "bg-yellow-50 text-yellow-600", trend: "จาก 150 รีวิว" },
    ];

    const upcomingAppointments = [
        { id: 1, name: "คุณสมชาย รักสุขภาพ", time: "10:00 - 10:30", type: "ติดตามผลครั้งที่ 2", status: "ในอีก 15 นาที", avatar: "SS" },
        { id: 2, name: "คุณวิภาวรรณ ใจดี", time: "11:00 - 11:30", type: "ปรึกษาครั้งแรก", status: "รอยืนยัน", avatar: "WJ" },
        { id: 3, name: "คุณธนพล มุ่งมั่น", time: "13:30 - 14:00", type: "ปรับแผนอาหาร", status: "รอยืนยัน", avatar: "TM" },
    ];

    const activePatients = [
        { id: 1, name: "คุณพัชราภรณ์", goal: "ลดน้ำหนัก/ไขมัน", progress: 65, lastActive: "2 ชั่วโมงที่แล้ว" },
        { id: 2, name: "คุณอานนท์", goal: "เพิ่มกล้ามเนื้อ", progress: 40, lastActive: "5 ชั่วโมงที่แล้ว" },
        { id: 3, name: "คุณศิริขวัญ", goal: "ควบคุมเบาหวาน", progress: 85, lastActive: "เมื่อวานนี้" },
    ];

    return (
        <main className="flex-1 px-8 py-10 z-10 custom-scrollbar ml-64">
            <div className="max-w-[1240px] mx-auto space-y-8">
                {/* Header Section */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-[#1a1a1a] tracking-tight">แดชบอร์ดนักโภชนาการ</h1>
                        <p className="text-gray-500 font-medium">ยินดีต้อนรับกลับมาครับ! วันนี้คุณมีนัดหมายทั้งหมด 8 เคส</p>
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
                            {upcomingAppointments.map((appointment) => (
                                <div 
                                    key={appointment.id}
                                    className="bg-white p-5 rounded-[28px] border border-gray-100 shadow-sm flex items-center justify-between group hover:border-[#C6E065]/50 transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center font-black text-gray-500 group-hover:bg-[#C6E065] group-hover:text-[#3d3522] transition-colors">
                                            {appointment.avatar}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#1a1a1a]">{appointment.name}</h4>
                                            <p className="text-xs text-gray-400 font-medium">{appointment.type} • {appointment.time}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-[11px] font-black text-[#3d3522] bg-gray-50 px-3 py-1.5 rounded-full">
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
                            ))}
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
                            {activePatients.map((patient) => (
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
                                    <p className="mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest">{patient.lastActive}</p>
                                </div>
                            ))}
                            <button className="w-full py-4 text-xs font-black text-gray-400 hover:text-[#3d3522] transition-colors bg-gray-50/50 uppercase tracking-widest">
                                ดูคนไข้ทั้งหมด
                            </button>
                        </div>

                        <div className="bg-[#C6E065]/10 border border-[#C6E065]/20 rounded-[32px] p-6 space-y-4">
                            <h4 className="text-sm font-black text-[#3d3522] uppercase tracking-wider">แจ้งเตือนระบบ</h4>
                            <div className="flex gap-3">
                                <Clock size={20} className="text-[#3d3522] shrink-0" />
                                <p className="text-xs text-[#3d3522]/70 font-medium leading-relaxed">
                                    มีคนไข้ 5 รายที่กำลังรอคุณตรวจแผนอาหารประจำสัปดาห์ กรุณาดำเนินการภายใน 24 ชม.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
