"use client";

import React from "react";
import {
    Calendar as CalendarIcon,
    Plus,
    FileText,
    TrendingUp,
    AlertCircle,
    Menu
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";
import { useAuthStore } from "@/store/auth-store";

const usageData = [
  { name: 'Mon', value: 3, fill: '#8b5cf6' },
  { name: 'Tue', value: 5, fill: '#f87171' },
  { name: 'Wed', value: 2, fill: '#38bdf8' },
  { name: 'Thu', value: 2, fill: '#fbbf24' },
  { name: 'Fri', value: 4, fill: '#3b82f6' },
  { name: 'Sat', value: 3, fill: '#34d399' },
  { name: 'Sun', value: 5, fill: '#8b5cf6' },
];

export default function NutritionistDashboard() {
    const { user } = useAuthStore();

    return (
        <div className="flex-1 flex flex-col min-h-screen">
            <main className="flex-1 overflow-y-auto px-8 py-10 z-10 custom-scrollbar ml-64">
                <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left/Main Column - 2/3 width */}
                    <div className="col-span-1 lg:col-span-2 space-y-8 animate-fadeIn">
                        
                        {/* Banner */}
                        <div className="relative rounded-2xl h-48 overflow-hidden shadow-sm">
                            <img 
                                src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=1600" 
                                alt="Healthy Food" 
                                className="object-cover w-full h-full brightness-75"
                            />
                            <div className="absolute inset-0 flex items-center p-10 bg-gradient-to-r from-black/60 to-transparent">
                                <h1 className="text-white text-5xl font-black tracking-tight">
                                    Hello!, <span className="font-light text-white/90">Nutritionist</span>
                                </h1>
                            </div>
                        </div>

                        {/* Date greeting */}
                        <div>
                            <h2 className="text-4xl font-black text-[#4A6707] tracking-tight mb-2">February 17th, 2026</h2>
                            <p className="text-gray-500 font-bold text-lg tracking-wide">Your expertise makes a difference today.</p>
                        </div>

                        {/* Today's Schedule */}
                        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
                            <h3 className="text-xl font-black text-orange-500 tracking-wide uppercase mb-6 flex items-center gap-2">
                                TODAY'S SCHEDULE <span className="text-sm font-bold text-gray-400 normal-case ml-2">- MISS {user?.firstName?.toUpperCase() || "WANSIRI WARAKRON"}</span>
                            </h3>

                            <div className="space-y-4 font-mono text-sm font-bold">
                                <div className="bg-[#a3e635] p-5 rounded-xl border border-[#84cc16]/50 shadow-sm text-gray-800">
                                    09:00 - Mr. Somchai (Weight loss follow-up)
                                </div>
                                <div className="bg-[#bbf7d0] p-5 rounded-xl border border-[#86efac]/50 shadow-sm text-gray-800">
                                    11:00 - Ms. Anya (Diabetes control)
                                </div>
                                <div className="bg-[#dcfce3] p-5 rounded-xl border border-[#bbf7d0]/50 shadow-sm text-gray-800">
                                    14:00 - New patient consultation
                                </div>
                                
                                <button className="w-full flex items-center gap-3 bg-gray-50 hover:bg-gray-100 text-gray-400 p-5 rounded-xl border-2 border-dashed border-gray-200 transition-colors">
                                    <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                                        <Plus className="w-4 h-4" />
                                    </div>
                                    <span className="font-sans font-bold uppercase tracking-wide">Add New Patient</span>
                                </button>
                            </div>
                        </div>

                        {/* Usage Statistics */}
                        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
                            <h3 className="text-sm font-black text-orange-400 mb-6">Usage Statistics - Last 7 Days</h3>
                            <div className="h-48 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={usageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 'bold' }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 'bold' }} />
                                        <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                            {usageData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                    </div>

                    {/* Right Column - 1/3 width */}
                    <div className="col-span-1 space-y-8 animate-slideUp">
                        
                        {/* Profile Topbar */}
                        <div className="bg-[#65a30d] text-white p-4 rounded-xl shadow-md flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-md flex items-center justify-center backdrop-blur-sm">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                </div>
                                <div>
                                    <h4 className="font-black text-sm uppercase tracking-wide">{user?.firstName || "WANSIRI WARAKRON"}</h4>
                                    <p className="text-xs text-white/80">Nutritionist</p>
                                </div>
                            </div>
                            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                <Menu className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Calendar Widget */}
                        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100">
                            <div className="flex justify-between items-end mb-4">
                                <h3 className="font-black text-[#5ba300] tracking-wide uppercase text-lg">CALENDAR</h3>
                                <span className="text-xs font-bold text-gray-500">February 2026</span>
                            </div>
                            
                            <div className="grid grid-cols-7 gap-1 text-center mb-2">
                                {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
                                    <div key={d} className="text-[10px] font-bold text-gray-400 py-2">{d}</div>
                                ))}
                            </div>
                            
                            <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-gray-600">
                                {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28].map(date => (
                                    <div key={date} className={`p-2 rounded-full flex items-center justify-center w-8 h-8 mx-auto ${date === 17 ? 'border-2 border-blue-400 text-blue-500 font-bold' : 'hover:bg-gray-50 cursor-pointer'}`}>
                                        {date}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 space-y-3">
                                <button className="flex items-center gap-3 text-xs font-bold text-gray-600 hover:text-green-600 transition-colors w-full">
                                    <Plus className="w-4 h-4 text-green-500" />
                                    Add New Patient
                                </button>
                                <button className="flex items-center gap-3 text-xs font-bold text-gray-600 hover:text-green-600 transition-colors w-full">
                                    <CalendarIcon className="w-4 h-4 text-green-500" />
                                    Schedule Appointment
                                </button>
                                <button className="flex items-center gap-3 text-xs font-bold text-gray-600 hover:text-orange-500 transition-colors w-full">
                                    <FileText className="w-4 h-4 text-orange-400" />
                                    Create Nutrition Plan
                                </button>
                                <button className="flex items-center gap-3 text-xs font-bold text-gray-600 hover:text-orange-500 transition-colors w-full">
                                    <TrendingUp className="w-4 h-4 text-orange-400" />
                                    View Reports
                                </button>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div>
                            <h3 className="text-sm font-black text-orange-400 mb-1 uppercase tracking-wide">NUMBER OF CONSULTANTS</h3>
                            <p className="text-[10px] text-gray-400 mb-4">Helping patients live healthier, one plan at a time.</p>
                            
                            <div className="space-y-3">
                                <div className="bg-[#a3e635] p-4 rounded-xl shadow-sm text-gray-800 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl font-black">3</span>
                                        <span className="font-bold text-sm tracking-wide">Today's Cases</span>
                                    </div>
                                    <CalendarIcon className="w-6 h-6 text-gray-800/50" />
                                </div>
                                <div className="bg-[#fbbf24] p-4 rounded-xl shadow-sm text-gray-800 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl font-black">8</span>
                                        <span className="font-bold text-sm tracking-wide">Total Cases</span>
                                    </div>
                                    <Plus className="w-6 h-6 text-gray-800/50" />
                                </div>
                                <div className="bg-[#fb923c] p-4 rounded-xl shadow-sm text-red-900 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl font-black">1</span>
                                        <span className="font-bold text-sm tracking-wide">Urgent Case</span>
                                    </div>
                                    <AlertCircle className="w-6 h-6 text-red-900/50" />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}

// Ensure Cell is imported for recharts
import { Cell } from "recharts";
