"use client";

import React, { useState } from "react";
import {
    FileText,
    CalendarDays,
    Printer,
    Menu,
    FileEdit
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

export default function NutritionPlanPage() {
    const { user } = useAuthStore();
    const [bmiStatus, setBmiStatus] = useState<string>("ปกติ");

    return (
        <div className="flex-1 flex flex-col min-h-screen">
            <main className="flex-1 overflow-y-auto px-8 py-10 z-10 custom-scrollbar ml-64">
                <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
                    
                    {/* Main Content Form - 3/4 width */}
                    <div className="col-span-1 lg:col-span-3 space-y-6 animate-fadeIn">
                        
                        {/* Banner */}
                        <div className="relative rounded-2xl h-36 overflow-hidden shadow-sm">
                            <img 
                                src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=1600" 
                                alt="Healthy Food" 
                                className="object-cover w-full h-full brightness-75"
                            />
                            <div className="absolute inset-0 flex items-center px-10 bg-gradient-to-r from-black/60 to-transparent">
                                <h1 className="text-white text-4xl font-black tracking-tight">
                                    Hello!, <span className="font-light text-white/90">Nutritionist</span>
                                </h1>
                            </div>
                        </div>

                        {/* Title Header */}
                        <div className="flex items-center gap-4 py-4">
                            <FileText className="w-12 h-12 text-[#5ba300]" />
                            <div>
                                <h2 className="text-4xl font-black text-[#5ba300] tracking-wider">NUTRITION PLAN</h2>
                                <p className="text-xl font-bold text-[#5ba300]">จัดทำใบแนะนำ</p>
                            </div>
                        </div>

                        {/* Form Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            
                            {/* Left Form Block */}
                            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-6">
                                {/* Row: Name */}
                                <div className="flex items-center gap-4">
                                    <label className="font-bold text-gray-800 whitespace-nowrap">ชื่อ-สกุล:</label>
                                    <input type="text" className="flex-1 bg-gray-100 border-none rounded-md px-3 py-1.5 focus:ring-2 focus:ring-[#C6E065] outline-none" />
                                </div>
                                
                                {/* Row: Age & Gender */}
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2">
                                        <label className="font-bold text-gray-800">อายุ:</label>
                                        <input type="number" className="w-16 bg-gray-100 border-none rounded-md px-2 py-1.5 focus:ring-2 focus:ring-[#C6E065] outline-none" />
                                        <span className="font-bold text-gray-800">ปี</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <label className="font-bold text-gray-800">เพศ:</label>
                                        <select className="bg-gray-100 border-none rounded-md px-3 py-1.5 focus:ring-2 focus:ring-[#C6E065] outline-none font-sans font-bold text-gray-700">
                                            <option value="">▼</option>
                                            <option value="male">ชาย</option>
                                            <option value="female">หญิง</option>
                                        </select>
                                    </div>
                                </div>
                                
                                {/* Row: Height & Weight */}
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2">
                                        <label className="font-bold text-gray-800">ส่วนสูง:</label>
                                        <input type="number" className="w-20 bg-gray-100 border-none rounded-md px-2 py-1.5 focus:ring-2 focus:ring-[#C6E065] outline-none" />
                                        <span className="font-bold text-gray-800">ซม.</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <label className="font-bold text-gray-800">น้ำหนัก:</label>
                                        <input type="number" className="w-20 bg-gray-100 border-none rounded-md px-2 py-1.5 focus:ring-2 focus:ring-[#C6E065] outline-none" />
                                        <span className="font-bold text-gray-800">กก.</span>
                                    </div>
                                </div>

                                {/* Row: BMI */}
                                <div className="flex items-center gap-4">
                                    <label className="font-bold text-gray-800 whitespace-nowrap">ดัชนีมวลกาย (BMI):</label>
                                    <input type="text" readOnly className="w-24 bg-gray-200 border-none rounded-md px-3 py-1.5 outline-none font-bold text-gray-600" />
                                </div>

                                {/* BMI Checkboxes */}
                                <div className="space-y-3 pt-4">
                                    <label className="font-bold text-gray-800 block">สถานะ BMI:</label>
                                    <div className="flex flex-col gap-2 ml-2">
                                        {['ต่ำกว่าเกณฑ์', 'ปกติ', 'น้ำหนักเกิน', 'อ้วน'].map(status => (
                                            <label key={status} className="flex items-center gap-3 cursor-pointer group">
                                                <div className={`w-5 h-5 rounded border flex items-center justify-center ${bmiStatus === status ? 'bg-[#5ba300] border-[#5ba300]' : 'border-gray-400 group-hover:border-[#5ba300]'}`}>
                                                    {bmiStatus === status && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                                                </div>
                                                <input
                                                    type="radio" 
                                                    name="bmi_status" 
                                                    value={status} 
                                                    checked={bmiStatus === status} 
                                                    onChange={() => setBmiStatus(status)} 
                                                    className="hidden" 
                                                />
                                                <span className="font-bold text-gray-700">{status}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Right Form Block */}
                            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-5">
                                <div className="space-y-4">
                                    {[
                                        { label: "รอบอก:", unit: "cm" },
                                        { label: "รอบเอว:", unit: "cm" },
                                        { label: "รอบสะโพก:", unit: "cm" },
                                        { label: "รอบต้นแขน:", unit: "cm" },
                                        { label: "รอบต้นขา:", unit: "cm" }
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <label className="font-bold text-gray-800 w-24">{item.label}</label>
                                            <input type="number" className="w-20 bg-gray-100 border-none rounded-md px-2 py-1.5 focus:ring-2 focus:ring-[#C6E065] outline-none" />
                                            <span className="font-bold text-gray-800">{item.unit}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-2">
                                    <div className="flex items-center gap-2 mb-4">
                                        <label className="font-bold text-gray-800 whitespace-nowrap">อัตราส่วนเอวต่อสะโพก (Waist-Hip Ratio):</label>
                                        <input type="number" step="0.01" className="w-20 bg-gray-100 border-none rounded-md px-2 py-1.5 focus:ring-2 focus:ring-[#C6E065] outline-none" />
                                    </div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <label className="font-bold text-gray-800 whitespace-nowrap">เปอร์เซ็นต์ไขมันในร่างกาย (% Body Fat):</label>
                                        <input type="number" className="w-16 bg-gray-100 border-none rounded-md px-2 py-1.5 focus:ring-2 focus:ring-[#C6E065] outline-none" />
                                        <span className="font-bold text-gray-800">%</span>
                                    </div>
                                    <ul className="list-disc pl-6 space-y-3 font-bold text-gray-800">
                                        <li className="flex items-center gap-2">
                                            มวลกล้ามเนื้อ (Muscle Mass): 
                                            <input type="number" className="w-16 bg-gray-100 border-none rounded-md px-2 py-1 focus:ring-2 focus:ring-[#C6E065] outline-none ml-1" />
                                            kg
                                        </li>
                                        <li className="flex items-center gap-2">
                                            ไขมันในช่องท้อง (Visceral Fat Level): 
                                            <input type="number" className="w-16 bg-gray-100 border-none rounded-md px-2 py-1 focus:ring-2 focus:ring-[#C6E065] outline-none ml-1" />
                                        </li>
                                        <li className="flex items-center gap-2">
                                            อัตราการเผาผลาญพื้นฐาน (BMR): 
                                            <input type="number" className="w-20 bg-gray-100 border-none rounded-md px-2 py-1 focus:ring-2 focus:ring-[#C6E065] outline-none ml-1" />
                                            kcal/วัน
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Actions and Additional Info */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
                            
                            {/* Summary Fields */}
                            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-4">
                                {[
                                    { label: "ภาวะน้ำหนักโดยรวม:" },
                                    { label: "ระดับไขมันสะสม:" },
                                    { label: "สมดุลมวลกล้ามเนื้อ:" },
                                    { label: "ข้อสังเกตเพิ่มเติม:" }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4">
                                        <label className="font-bold text-gray-800 w-44">{item.label}</label>
                                        <input type="text" className="flex-1 bg-gray-300 border border-gray-400 rounded-sm px-3 py-1.5 focus:ring-2 focus:ring-[#C6E065] outline-none" />
                                    </div>
                                ))}
                            </div>

                            {/* Buttons */}
                            <div className="flex items-stretch gap-6 h-full p-2">
                                <button className="flex-1 bg-[#fbbf24] hover:bg-orange-400 transition-colors rounded-[32px] flex flex-col items-center justify-center gap-4 shadow-sm group">
                                    <span className="text-gray-900 font-black text-xl tracking-wide">Follow-up</span>
                                    <div className="w-12 h-12 flex items-center justify-center">
                                        <CalendarDays className="w-16 h-16 text-gray-800 group-hover:scale-110 transition-transform" />
                                    </div>
                                </button>
                                
                                <button className="flex-1 bg-[#5ba300] hover:bg-green-700 transition-colors rounded-[32px] flex flex-col items-center justify-center gap-4 shadow-sm group">
                                    <span className="text-white font-black text-xl tracking-wide">Print</span>
                                    <div className="w-12 h-12 flex items-center justify-center">
                                        <Printer className="w-16 h-16 text-white group-hover:scale-110 transition-transform" />
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column / Topbar (Desktop top-right, Mobile stacked) - 1/4 width */}
                    <div className="col-span-1 space-y-6 animate-slideUp">
                        
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
                        
                        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100">
                            <div className="space-y-4 text-sm text-gray-500 font-bold">
                                <p className="flex items-center gap-3 hover:text-[#5ba300] cursor-pointer"><FileEdit className="w-5 h-5 text-[#5ba300]" /> Edit Profile</p>
                                <p className="flex items-center gap-3 hover:text-[#5ba300] cursor-pointer"><FileText className="w-5 h-5 text-[#C6E065]" /> Update Professional Information</p>
                                <p className="flex items-center gap-3 hover:text-orange-400 cursor-pointer"><FileText className="w-5 h-5 text-orange-400" /> Notification Settings</p>
                            </div>
                        </div>

                    </div>
                    
                </div>
            </main>
        </div>
    );
}
