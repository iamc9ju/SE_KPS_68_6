"use client";

import React, { useState } from "react";
import { Package, Navigation, UtensilsCrossed, AlertCircle, ChevronRight, User, MapPin } from "lucide-react";

export default function AdminTrackingDashboard() {
    const [filter, setFilter] = useState("all");

    const stats = [
        { label: "ออเดอร์ทั้งหมดวันนี้", value: 142, icon: <Package size={20} className="text-[#85B22E]" />, color: "bg-[#f0f4d8]" },
        { label: "กำลังจัดส่ง", value: 24, icon: <Navigation size={20} className="text-orange-500" />, color: "bg-orange-50" },
        { label: "รอทำอาหาร", value: 12, icon: <UtensilsCrossed size={20} className="text-blue-500" />, color: "bg-blue-50" },
        { label: "ล่าช้า (เกิน 45 นาที)", value: 2, icon: <AlertCircle size={20} className="text-red-500" />, color: "bg-red-50" },
    ];

    const orders = [
        { id: "#WM-8492", customer: "Somchai K.", phone: "081-xxx-xxxx", status: "delivering", time: "18 mins", driver: "Winai R." },
        { id: "#WM-8493", customer: "Ariya M.", phone: "089-xxx-xxxx", status: "preparing", time: "5 mins", driver: "Waiting..." },
        { id: "#WM-8494", customer: "Napat T.", phone: "082-xxx-xxxx", status: "delayed", time: "50 mins", driver: "Sompop T." },
        { id: "#WM-8495", customer: "Ploy P.", phone: "083-xxx-xxxx", status: "accepted", time: "1 min", driver: "Waiting..." },
    ];

    return (
        <div className="flex-1 flex flex-col min-h-screen">
            <main className="flex-1 overflow-y-auto px-8 py-10 z-10 custom-scrollbar ml-64">
                <div className="max-w-[1240px] mx-auto">
                    {/* Header */}
                    <header className="mb-8 animate-fadeIn flex justify-between items-end">
                        <div>
                            <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
                                จัดการการจัดส่ง
                            </h1>
                            <p className="text-gray-500 font-medium text-lg">
                                ดูแลภาพรวมออเดอร์และตำแหน่งไรเดอร์แบบ Real-time
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button className="bg-white px-5 py-2.5 rounded-2xl text-sm font-bold text-gray-700 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 hover:bg-gray-50 transition-all flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#85B22E] animate-pulse"></div>
                                Live Sync (Online)
                            </button>
                        </div>
                    </header>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slideUp">
                        {stats.map((stat, i) => (
                            <div key={i} className="bg-white p-6 rounded-[28px] shadow-[0_4px_40px_rgba(0,0,0,0.02)] border border-gray-50 flex items-center gap-5">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.color}`}>
                                    {stat.icon}
                                </div>
                                <div>
                                    <h4 className="text-[13px] font-bold text-gray-400 mb-1">{stat.label}</h4>
                                    <p className="text-3xl font-black text-gray-900">{stat.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Main Layout */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-slideUp delay-100">
                        {/* Order List */}
                        <div className="xl:col-span-1 flex flex-col gap-4">
                            <div className="bg-white p-6 rounded-[32px] shadow-[0_4px_40px_rgba(0,0,0,0.02)] border border-gray-50 col-span-1 h-[600px] flex flex-col">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-black text-gray-900">ออเดอร์ (ล่าสุด)</h3>
                                    <button className="text-[#85B22E] text-[11px] font-black uppercase tracking-widest bg-[#f0f4d8] px-3 py-1.5 rounded-xl hover:bg-[#85B22E] hover:text-white transition-colors">ดูทั้งหมด</button>
                                </div>

                                <div className="flex gap-2 mb-6 overflow-x-auto custom-scrollbar pb-2">
                                    {["all", "preparing", "delivering", "delayed"].map(f => (
                                        <button
                                            key={f}
                                            onClick={() => setFilter(f)}
                                            className={`px-4 py-1.5 rounded-full text-[13px] font-bold whitespace-nowrap transition-all ${filter === f ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                        >
                                            {f === 'all' ? 'ทั้งหมด' : f === 'preparing' ? 'กำลังเตรียม' : f === 'delivering' ? 'ไปส่ง' : 'ล่าช้า'}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
                                    {orders.filter(o => filter === 'all' || o.status === filter).map(order => (
                                        <div key={order.id} className="p-4 rounded-2xl border border-gray-100 hover:border-[#85B22E]/30 hover:shadow-sm bg-white transition-all cursor-pointer group flex flex-col relative overflow-hidden">
                                            {order.status === 'delayed' && <div className="absolute top-0 left-0 w-1 h-full bg-red-400"></div>}
                                            {order.status === 'delivering' && <div className="absolute top-0 left-0 w-1 h-full bg-orange-400"></div>}

                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[11px] font-black text-white bg-gray-900 px-2 py-0.5 rounded-lg">{order.id}</span>
                                                    {order.status === 'delayed' && <AlertCircle size={14} className="text-red-500 animate-pulse" />}
                                                </div>
                                                <span className={`text-[11px] font-black ${order.status === 'delayed' ? 'text-red-500' : 'text-gray-400'}`}>{order.time}</span>
                                            </div>

                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-10 h-10 rounded-full bg-[#f4f4f4] flex items-center justify-center shrink-0 text-gray-500">
                                                    <User size={18} />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-black text-gray-900 leading-tight">{order.customer}</h4>
                                                    <p className="text-[11px] font-bold text-gray-400 mt-0.5">{order.driver}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-50">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${order.status === 'preparing' ? 'bg-blue-500' : order.status === 'delivering' ? 'bg-orange-500' : order.status === 'delayed' ? 'bg-red-500' : 'bg-[#85B22E]'}`}></div>
                                                    <span className="text-[11px] font-bold text-gray-600">
                                                        {order.status === 'preparing' ? 'กำลังเตรียมอาหาร' : order.status === 'delivering' ? 'กำลังไปส่ง' : order.status === 'delayed' ? 'ออเดอร์ล่าช้า !' : 'รับออเดอร์แล้ว'}
                                                    </span>
                                                </div>
                                                <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#85B22E] transition-colors">
                                                    <ChevronRight size={14} className="text-gray-400 group-hover:text-white" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Map View Placeholder */}
                        <div className="xl:col-span-2 bg-white p-6 rounded-[32px] shadow-[0_4px_40px_rgba(0,0,0,0.02)] border border-gray-50 h-[600px] flex flex-col relative overflow-hidden">
                            <div className="absolute top-10 left-10 z-10 bg-white/90 backdrop-blur-md p-5 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.05)] border border-gray-100 w-80">
                                <h4 className="font-black text-gray-900 mb-5">ภาพรวมสาขา</h4>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-[#f0f4d8] flex items-center justify-center shrink-0">
                                            <MapPin size={18} className="text-[#85B22E]" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between mb-1">
                                                <span className="text-[12px] font-bold text-gray-500">สาขา สุขุมวิท</span>
                                                <span className="text-[11px] font-black text-gray-900">12 order
                                                    <span className="text-gray-400 font-bold ml-1">/ 20</span>
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                                <div className="bg-[#C6E065] h-full w-[60%]"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                                            <MapPin size={18} className="text-orange-500" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between mb-1">
                                                <span className="text-[12px] font-bold text-gray-500">สาขา สาทร</span>
                                                <span className="text-[11px] font-black text-orange-500">24 order <span className="text-gray-400 font-bold">(Busy)</span></span>
                                            </div>
                                            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                                <div className="bg-orange-500 h-full w-[95%]"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full h-full bg-[#fafafa] rounded-2xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center relative overflow-hidden">
                                {/* Map Graphic Simulation */}
                                <svg className="absolute inset-0 w-full h-full opacity-30" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <pattern id="grid2" width="60" height="60" patternUnits="userSpaceOnUse">
                                            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                                        </pattern>
                                    </defs>
                                    <rect width="100%" height="100%" fill="url(#grid2)" />
                                    <path d="M 150 150 Q 300 50 500 400 T 900 200" fill="none" stroke="#CBD5E1" strokeWidth="6" strokeDasharray="10,10" strokeLinecap="round" />
                                    <path d="M 250 500 Q 450 600 700 250 T 1000 450" fill="none" stroke="#E2E8F0" strokeWidth="6" strokeDasharray="10,10" strokeLinecap="round" />
                                </svg>

                                {/* Map pins mockups */}
                                <div className="absolute top-[35%] left-[45%] text-orange-500 animate-[bounce_2s_infinite]">
                                    <MapPin size={38} fill="currentColor" stroke="white" strokeWidth={2} />
                                </div>
                                <div className="absolute top-[65%] left-[65%] text-[#85B22E] animate-[bounce_2.5s_infinite]" style={{ animationDelay: '0.5s' }}>
                                    <MapPin size={38} fill="currentColor" stroke="white" strokeWidth={2} />
                                </div>
                                <div className="absolute top-[45%] left-[75%] text-orange-500 animate-[bounce_2.2s_infinite]" style={{ animationDelay: '1s' }}>
                                    <MapPin size={38} fill="currentColor" stroke="white" strokeWidth={2} />
                                </div>
                                <div className="absolute top-[20%] left-[60%] text-blue-500 animate-[bounce_2.1s_infinite]" style={{ animationDelay: '1.2s' }}>
                                    <MapPin size={38} fill="currentColor" stroke="white" strokeWidth={2} />
                                </div>

                                <div className="absolute top-[50%] left-[80%] flex flex-col items-center gap-1 opacity-60">
                                    <div className="w-3 h-3 rounded-full bg-red-400 animate-pulse"></div>
                                    <div className="bg-white px-2 py-0.5 rounded-lg border border-gray-100 text-[10px] font-black shadow-sm">Sompop T. (Delay)</div>
                                </div>

                                <div className="z-10 bg-white/80 backdrop-blur-xl px-8 py-4 rounded-[20px] shadow-[0_4px_30px_rgba(0,0,0,0.05)] border border-white text-sm font-bold text-gray-500 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                        <MapPin size={16} className="text-gray-400" />
                                    </div>
                                    Interactive Admin Map
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="h-20"></div>
                </div>
            </main>
        </div>
    );
}
