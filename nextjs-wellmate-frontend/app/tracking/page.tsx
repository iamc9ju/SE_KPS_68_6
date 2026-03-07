"use client";

import React, { useEffect, useState } from 'react';
import { ArrowLeft, MapPin, Navigation, Clock, Phone, Map, Car, ChefHat, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function OrderTrackingPage() {
    const [progress, setProgress] = useState(2); // 1: Accepted, 2: Preparing, 3: On The Way, 4: Delivered

    // Automatically simulate order progress
    useEffect(() => {
        const timer1 = setTimeout(() => setProgress(3), 5000); // Wait 5s to go "On The Way"
        const timer2 = setTimeout(() => setProgress(4), 15000); // Wait 15s to be "Delivered"

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, []);

    const STATUSES = {
        1: { title: "Order Accepted", desc: "The kitchen has verified your order", icon: <CheckCircle2 size={24} /> },
        2: { title: "Preparing Food", desc: "Your healthy meal is being cooked", icon: <ChefHat size={24} /> },
        3: { title: "On The Way", desc: "Driver is heading to your location", icon: <Car size={24} /> },
        4: { title: "Delivered", desc: "Enjoy your healthy meal!", icon: <MapPin size={24} /> }
    };

    const currentStatus = STATUSES[progress as keyof typeof STATUSES];

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20 relative">
            {/* Map Placeholder Backdrop */}
            <div className="absolute top-0 left-0 w-full h-[45vh] bg-slate-200 z-0 overflow-hidden">
                {/* Mock Map Image */}
                <div className="w-full h-full relative p-4">
                    {/* Pattern to look like street map */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cGF0aCBkPSJNMCA1MEwgMjAwIDUwIE0xMDAgMCBMMTAwIDIwMCBNMTAwIDUwIEwxNTAgMTUwIE01MCAxNTAgTDEwMCA1MCIgc3Ryb2tlPSIjZTJlOGYwIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz48L3N2Zz4=')] opacity-50 z-0"></div>

                    {/* Map UI Elements */}
                    <div className="absolute inset-0 flex items-center justify-center z-10 transition-transform duration-1000" style={{ transform: progress >= 3 ? 'translate(20px, 30px)' : 'translate(-20px, -20px)' }}>
                        {/* Route Line */}
                        <svg className="absolute w-[200px] h-[150px] overflow-visible" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                            <path d="M 0 0 C 100 50, 50 150, 200 150" fill="none" stroke="#a4cc00" strokeWidth="6" strokeLinecap="round" strokeDasharray="10 10" />
                        </svg>

                        {/* Restaurant Marker */}
                        <div className="absolute top-[20%] left-[25%] -translate-x-1/2 -translate-y-1/2 bg-white p-2 text-orange-500 rounded-full shadow-lg z-20">
                            <div className="bg-orange-100 p-2 rounded-full"><ChefHat size={20} /></div>
                        </div>

                        {/* User Marker */}
                        <div className="absolute bottom-[20%] right-[25%] -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
                            <div className="bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg mb-2 relative">
                                You
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                            </div>
                            <div className="bg-[#a4cc00] p-1.5 rounded-full border-4 border-white shadow-lg"><MapPin size={16} fill="white" className="text-white" /></div>
                        </div>

                        {/* Driver Marker - Moves based on progress */}
                        {progress >= 3 && (
                            <div className={`absolute z-30 transition-all duration-[10000ms] ${progress === 4 ? "bottom-[22%] right-[27%]" : "top-[50%] left-[50%]"} -translate-x-1/2 -translate-y-1/2`}>
                                <div className="bg-white p-2 rounded-full shadow-xl">
                                    <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                                        <Navigation size={20} className="fill-blue-500 text-blue-500" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Header Overlay */}
            <header className="relative z-10 px-6 py-4 flex items-center justify-between">
                <Link href="/" className="bg-white p-2.5 shadow-md rounded-full transition-colors hover:bg-slate-50">
                    <ArrowLeft size={20} className="text-slate-800" />
                </Link>
                <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full font-bold text-sm text-slate-800 shadow-sm border border-white/50">
                    Order #WM-8492
                </div>
                <div className="w-10"></div> {/* Spacer */}
            </header>

            {/* Bottom Content Container */}
            <div className="absolute top-[35vh] left-0 w-full z-20 px-4 pb-10">
                <div className="max-w-xl mx-auto space-y-4">

                    {/* Main Status Card */}
                    <div className="bg-white rounded-[32px] p-6 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 relative">
                        {/* Drag Handle */}
                        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-slate-200 rounded-full"></div>

                        <div className="text-center mt-4 mb-6">
                            <div className="text-[#a4cc00] font-black text-4xl mb-1">{progress === 4 ? "0:00" : "15-20"} <span className="text-lg font-bold text-slate-500">{progress === 4 ? "" : "min"}</span></div>
                            <h2 className="text-xl font-bold text-slate-800">Estimated Delivery Time</h2>
                        </div>

                        {/* Animated Status Bar */}
                        <div className="relative h-2 bg-slate-100 rounded-full mb-8 overflow-hidden">
                            <div
                                className="absolute top-0 left-0 h-full bg-[#a4cc00] rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${(progress / 4) * 100}%` }}
                            ></div>
                        </div>

                        {/* Current Status Detail */}
                        <div className="flex items-center gap-4 mb-2">
                            <div className={`p-4 rounded-2xl ${progress === 4 ? 'bg-[#a4cc00] text-white shadow-[#a4cc00]/30' : 'bg-orange-50 text-orange-500'} shadow-sm transition-colors duration-500`}>
                                {currentStatus.icon}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">{currentStatus.title}</h3>
                                <p className="text-sm font-medium text-slate-500">{currentStatus.desc}</p>
                            </div>
                        </div>
                    </div>

                    {/* Driver Card (Shows only if driver is assigned/on way) */}
                    {(progress >= 3) && (
                        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex items-center justify-between animate-slideUp">
                            <div className="flex items-center gap-4">
                                <img src="https://ui-avatars.com/api/?name=Somchai+Rider&background=0D8ABC&color=fff" alt="Driver" className="w-14 h-14 rounded-full border-2 border-blue-100" />
                                <div>
                                    <h4 className="font-bold text-slate-800">Somchai Delivery</h4>
                                    <div className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                                        ⭐ 4.9 (240 trips)
                                    </div>
                                    <div className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md inline-block mt-1">Honda PCX • 1กข 1234</div>
                                </div>
                            </div>
                            <button className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-white shadow-md hover:bg-black transition-transform active:scale-95">
                                <Phone size={20} fill="currentColor" />
                            </button>
                        </div>
                    )}

                    {/* Delivery Info */}
                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
                        <div className="flex gap-4">
                            <div className="flex flex-col items-center gap-1 pt-1">
                                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                                <div className="w-px h-10 bg-slate-200"></div>
                                <div className="w-3 h-3 rounded-full bg-[#a4cc00] border-2 border-white shadow-sm"></div>
                            </div>
                            <div className="flex-1 space-y-4">
                                <div>
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Pickup Store</div>
                                    <h4 className="font-bold text-sm text-slate-800">Wellmate Kitchen Center (Sukhumvit)</h4>
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Delivery Location</div>
                                    <h4 className="font-bold text-sm text-slate-800">123/45 Health Avenue Condo</h4>
                                    <p className="text-xs font-medium text-slate-500 leading-tight">Note: Please leave it at the lobby.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Spacer for bottom */}
                    <div className="h-10"></div>
                </div>
            </div>
        </div>
    );
}
