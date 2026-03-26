"use client";

import React from "react";
import {
    Plus,
    FileEdit,
    FileText,
    CalendarDays,
    Menu
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

export default function MedicalRecordPage() {
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

                        {/* Middle Action Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Calendar */}
                            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100">
                                <div className="flex justify-between items-end mb-4">
                                    <h3 className="font-black text-[#5ba300] tracking-wide uppercase text-sm">CALENDAR</h3>
                                    <span className="text-[10px] font-bold text-gray-500">February 2026</span>
                                </div>
                                <div className="grid grid-cols-7 gap-1 text-center mb-1">
                                    {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
                                        <div key={d} className="text-[9px] font-bold text-gray-400 py-1">{d}</div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-600">
                                    {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28].map(date => (
                                        <div key={date} className={`flex items-center justify-center w-6 h-6 mx-auto rounded-full ${date === 17 ? 'border border-blue-400 text-blue-500 font-bold' : 'hover:bg-gray-50 cursor-pointer'}`}>
                                            {date}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Actions Container */}
                            <div className="col-span-1 lg:col-span-2 flex flex-col gap-4">
                                <div className="flex gap-4 h-full">
                                    {/* Add New Patient */}
                                    <button className="flex-1 bg-white hover:bg-gray-50 transition-colors p-6 rounded-[32px] shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-4 group">
                                        <span className="text-[#5ba300] text-sm font-bold">Add New Patient</span>
                                        <div className="w-16 h-16 rounded-full border-4 border-[#5ba300] flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Plus className="w-8 h-8 text-[#5ba300]" />
                                        </div>
                                    </button>
                                    
                                    {/* Create Nutrition Plan */}
                                    <button className="flex-1 bg-white hover:bg-gray-50 transition-colors p-6 rounded-[32px] shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-4 group">
                                        <span className="text-orange-500 text-sm font-bold">Create Nutrition Plan</span>
                                        <FileEdit className="w-14 h-14 text-orange-400 group-hover:scale-110 transition-transform" />
                                    </button>
                                </div>
                                
                                {/* Schedule Appointment */}
                                <button className="bg-white hover:bg-gray-50 transition-colors py-4 px-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center gap-3">
                                    <span className="text-[#5ba300] font-bold">Schedule Appointment</span>
                                    <CalendarDays className="w-5 h-5 text-[#C6E065]" />
                                </button>
                            </div>
                        </div>

                        {/* Reservation Details */}
                        <div>
                            <h3 className="text-xl font-black text-[#5ba300] tracking-wide mb-4">Reservation Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                
                                {/* Patient 1 */}
                                <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 relative">
                                    <div className="absolute top-6 left-6 font-black text-2xl text-gray-900">09:00</div>
                                    <div className="flex flex-col items-center pt-8">
                                        <img src="https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&q=80&w=200" alt="Mr. Somchai" className="w-24 h-24 object-cover rounded-[32px] border-4 border-[#C6E065] shadow-sm mb-6" />
                                        <div className="text-left w-full space-y-1 font-bold text-sm text-gray-800">
                                            <p><span className="text-gray-900">Name:</span> Mr.Somchai Kittipong</p>
                                            <p><span className="text-gray-900">Age:</span> 35 years old</p>
                                            <p><span className="text-gray-900">Weight:</span> 82 kg</p>
                                            <p><span className="text-gray-900">Height:</span> 175 cm</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Patient 2 */}
                                <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 relative">
                                    <div className="absolute top-6 left-6 font-black text-2xl text-gray-900">11:00</div>
                                    <div className="flex flex-col items-center pt-8">
                                        <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200" alt="Ms. Anya" className="w-24 h-24 object-cover rounded-[32px] border-4 border-[#C6E065] shadow-sm mb-6" />
                                        <div className="text-left w-full space-y-1 font-bold text-sm text-gray-800">
                                            <p><span className="text-gray-900">Name:</span> Ms. Anya Phanthip</p>
                                            <p><span className="text-gray-900">Age:</span> 29 years old</p>
                                            <p><span className="text-gray-900">Weight:</span> 68 kg</p>
                                            <p><span className="text-gray-900">Height:</span> 165 cm</p>
                                        </div>
                                    </div>
                                </div>

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
                        
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="space-y-2 text-sm text-gray-600 font-bold">
                                <p className="flex items-center gap-2 hover:text-[#5ba300] cursor-pointer"><FileEdit className="w-4 h-4 text-[#5ba300]" /> Edit Profile</p>
                                <p className="flex items-center gap-2 hover:text-[#5ba300] cursor-pointer"><FileText className="w-4 h-4 text-[#C6E065]" /> Update Professional Information</p>
                                <p className="flex items-center gap-2 hover:text-orange-400 cursor-pointer"><FileText className="w-4 h-4 text-orange-400" /> Notification Settings</p>
                            </div>
                        </div>

                        {/* Today's Schedule List */}
                        <div>
                            <h3 className="text-2xl font-black text-orange-400 mb-6 uppercase tracking-wide">TODAY'S SCHEDULE</h3>
                            
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <h4 className="text-xl font-black text-gray-900">09:00</h4>
                                    <div className="bg-[#fbbf24] p-5 rounded-2xl shadow-sm text-gray-900 border border-orange-200">
                                        <p className="font-black text-lg">Mr.Somchai</p>
                                        <p className="text-sm font-bold">Weight loss follow-up</p>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <h4 className="text-xl font-black text-gray-900">11:00</h4>
                                    <div className="bg-[#fbbf24] p-5 rounded-2xl shadow-sm text-gray-900 border border-orange-200">
                                        <p className="font-black text-lg">Ms. Anya</p>
                                        <p className="text-sm font-bold">Diabetes control</p>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <h4 className="text-xl font-black text-gray-900">14:00</h4>
                                    <div className="bg-[#fed7aa] p-5 rounded-2xl shadow-sm border border-orange-100 text-gray-900">
                                        <p className="font-black text-lg mt-1">New patient consultation</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
