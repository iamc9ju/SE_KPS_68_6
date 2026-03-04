"use client";

import React, { useState } from 'react';
import {
    Search, Bell, ChevronDown, ChevronLeft, ChevronRight,
    LayoutDashboard, HeartPulse, Calendar as CalendarIcon, MessageSquare, Salad, Utensils, BookOpen, TrendingUp, LogOut,
    MapPin, Clock, AlignLeft
} from 'lucide-react';

export default function Calendar() {
    const calendarData = [
        { day: 1, events: [] },
        { day: 2, events: [] },
        { day: 3, events: [] },
        { day: 4, events: [] },
        {
            day: 5, isCurrent: true, events: [
                { id: 1, title: 'Morning Yoga Session', time: '7:00 AM', type: 'physical' },
                { id: 2, title: 'Deep Stretch & Recovery', time: '9:00 AM', type: 'physical' },
                { id: 3, title: 'General Health Check-up with Nutritionist', time: '4:00 PM', type: 'appointment' }
            ]
        },
        { day: 6, events: [] },
        { day: 7, events: [] },
        {
            day: 8, events: [
                { id: 4, title: 'HIIT Cardio Session', time: '5:00 PM', type: 'physical' }
            ]
        },
        { day: 9, events: [] },
        {
            day: 10, events: [
                { id: 5, title: 'Morning Jogging', time: '5:30 AM', type: 'physical' }
            ]
        },
        { day: 11, events: [] },
        {
            day: 12, events: [
                { id: 6, title: 'Outdoor Cycling', time: '4:30 PM', type: 'physical' }
            ]
        },
        { day: 13, events: [] },
        { day: 14, events: [] },
        {
            day: 15, events: [
                { id: 7, title: 'Upper Body Strength', time: '5:30 PM', type: 'physical' }
            ]
        },
        {
            day: 16, events: [
                { id: 8, title: 'Swimming Laps', time: '6:30 PM', type: 'physical' }
            ]
        },
        {
            day: 17, events: [
                { id: 9, title: 'General Health Check-up with Nutritionist', time: '4:00 PM', type: 'appointment' }
            ]
        },
        { day: 18, events: [] },
        {
            day: 19, events: [
                { id: 10, title: 'Muay Thai Boxing', time: '10:00 AM', type: 'physical' }
            ]
        },
        { day: 20, events: [] },
        { day: 21, events: [] },
        {
            day: 22, events: [
                { id: 11, title: 'Core & Abs Workout', time: '5:00 PM', type: 'physical' }
            ]
        },
        { day: 23, events: [] },
        { day: 24, events: [] },
        {
            day: 25, events: [
                { id: 12, title: 'Morning Yoga Session', time: '7:00 AM', type: 'physical' }
            ]
        },
        {
            day: 26, events: [
                { id: 13, title: 'Muay Thai Boxing', time: '10:00 AM', type: 'physical' }
            ]
        },
        {
            day: 27, events: [
                { id: 14, title: 'Swimming Laps', time: '7:00 PM', type: 'physical' }
            ]
        },
        { day: 28, events: [] },
    ];

    return (
        <div className="flex h-screen bg-[#fffdf8] font-sans text-slate-800 overflow-hidden">
            {/* LEFT SIDEBAR */}
            <aside className="w-[260px] bg-white border-r border-slate-200 flex-col justify-between py-6 px-4 shrink-0 overflow-y-auto hidden md:flex">
                <div>
                    <div className="flex items-center gap-2 px-2 mb-10">
                        <div className="font-bold text-2xl tracking-tighter flex items-center">
                            <span className="text-[#a4cc00] mr-1 italic">WM</span>
                            <span className="text-slate-800">WELLMATE</span>
                        </div>
                    </div>

                    <nav className="space-y-1">
                        <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" />
                        <NavItem icon={<HeartPulse size={20} />} label="Nutrition Service" />
                        <NavItem icon={<CalendarIcon size={20} />} label="Calendar" active />
                        <NavItem icon={<MessageSquare size={20} />} label="Messages" />
                        <NavItem icon={<Salad size={20} />} label="Healthy Menu" />
                        <NavItem icon={<Utensils size={20} />} label="Meal Plan" />
                        <NavItem icon={<BookOpen size={20} />} label="Food Diary" />
                        <NavItem icon={<TrendingUp size={20} />} label="Progress" />
                    </nav>
                </div>

                <div className="mt-8">
                    <div className="bg-[#ccff00] p-5 rounded-2xl mb-4 text-center">
                        <p className="text-sm font-medium mb-1 text-slate-800">Start your health journey with</p>
                        <p className="font-black text-lg mb-2 text-slate-900">a FREE 1 MONTH</p>
                        <p className="text-xs mb-4 text-slate-700 font-medium">access to WELLMATE</p>
                        <button className="bg-slate-900 text-white hover:bg-black text-xs font-bold py-2.5 px-4 rounded-full w-full transition-colors">Sign Up Now!</button>
                    </div>

                    <button className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-slate-700 bg-orange-50 hover:bg-orange-100 transition-colors font-semibold">
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 overflow-y-auto p-8 flex flex-col">
                <header className="mb-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-slate-800">Calendar</h1>
                    <div className="flex items-center gap-4">
                        <button className="text-slate-600 hover:text-slate-800"><Search size={22} /></button>
                        <button className="text-slate-600 hover:text-slate-800"><Bell size={22} /></button>
                        <div className="w-px h-6 bg-slate-200"></div>
                        <div className="flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-slate-100 transition-colors">
                            <div className="w-10 h-10 bg-slate-300 rounded-xl overflow-hidden flex items-center justify-center">
                                <img src="https://ui-avatars.com/api/?name=Thanapat+Hongaram&background=94a3b8&color=ffffff" alt="User" />
                            </div>
                            <div className="hidden sm:block">
                                <div className="font-bold text-sm text-slate-800">Thanapat Hongaram</div>
                                <div className="text-xs text-slate-500 font-medium text-right">Member</div>
                            </div>
                            <ChevronDown size={18} className="text-slate-500 hidden sm:block" />
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-2 gap-6 mb-8">
                    {/* Summary Cards */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center">
                        <h3 className="font-semibold text-slate-500 mb-6 text-sm border-b border-slate-200 pb-3 w-full text-center">Total Physical Activities Schedule</h3>
                        <div className="flex items-center gap-4">
                            <div className="bg-[#ffe8a1] w-14 h-14 rounded-2xl flex items-center justify-center">
                                {/* Using a custom SVG or similar for the muscular arm */}
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d49a00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                </svg>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black text-slate-800">12</span>
                                <span className="text-xl font-bold text-slate-500">agendas</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center">
                        <h3 className="font-semibold text-slate-500 mb-6 text-sm border-b border-slate-200 pb-3 w-full text-center">Total Appointments / Events Schedule</h3>
                        <div className="flex items-center gap-4">
                            <div className="bg-orange-200 w-14 h-14 rounded-2xl flex items-center justify-center">
                                <CalendarIcon className="text-orange-600" size={28} />
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black text-slate-800">2</span>
                                <span className="text-xl font-bold text-slate-500">agendas</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                        <div className="flex gap-2 text-slate-400">
                            <button className="hover:text-slate-700 p-1"><ChevronLeft size={20} /></button>
                            <button className="hover:text-slate-700 p-1"><ChevronRight size={20} /></button>
                        </div>
                        <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                            February <span className="text-slate-400 font-medium">2027</span> <ChevronDown size={20} className="text-slate-400" />
                        </h2>
                    </div>
                    <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1">
                        <button className="px-4 py-1.5 text-sm font-bold text-slate-500 hover:text-slate-700 rounded-md">Day</button>
                        <button className="px-4 py-1.5 text-sm font-bold text-slate-500 hover:text-slate-700 rounded-md">Week</button>
                        <button className="px-4 py-1.5 text-sm font-bold bg-[#ccff00] text-slate-800 rounded-md shadow-sm">Month</button>
                    </div>
                </div>

                <div className="flex items-center gap-6 mb-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-yellow-400 focus:ring-yellow-400 accent-[#ffcc00]" />
                        <span className="text-sm font-bold text-slate-700">Physical Activities</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500 accent-orange-500" />
                        <span className="text-sm font-bold text-slate-700">Appointments/Events</span>
                    </label>
                </div>

                {/* Calendar Table */}
                <div className="bg-white border-slate-200 border-t border-l flex-1 flex flex-col min-h-[500px]">
                    <div className="flex-1 overflow-x-auto overflow-y-hidden">
                        <table className="w-full h-full table-fixed border-collapse">
                            <thead>
                                <tr>
                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                        <th key={day} className="py-3 text-center text-sm font-bold text-slate-500 border-r border-b border-slate-200 bg-slate-50 w-[14.28%] font-sans">
                                            {day}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {Array.from({ length: Math.ceil(calendarData.length / 7) }).map((_, rowIndex) => (
                                    <tr key={rowIndex} className="h-1/4">
                                        {calendarData.slice(rowIndex * 7, rowIndex * 7 + 7).map((cell) => (
                                            <td key={cell.day} className="border-b border-r border-slate-200 p-1.5 align-top bg-white">
                                                <div className="flex flex-col h-full min-h-[120px]">
                                                    <div className="mb-1 flex justify-start">
                                                        <span className={`inline-flex items-center justify-center w-6 h-6 text-sm font-bold rounded-full ${cell.isCurrent ? 'bg-[#bfe600] text-slate-900' : 'text-slate-500'}`}>
                                                            {cell.day}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1 flex flex-col gap-1 overflow-y-auto pr-1">
                                                        {cell.events.map(ev => (
                                                            <div key={ev.id} className={`px-2 py-1.5 rounded-md text-[10px] font-bold leading-tight ${ev.type === 'physical' ? 'bg-[#ffda75] text-[#8c6600]' : 'bg-[#fcb481] text-[#80390f]'}`}>
                                                                <div className="opacity-90 tracking-tight font-black text-[9px] mb-0.5">{ev.time}</div>
                                                                <div className="truncate whitespace-normal">{ev.title}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </main>

            {/* RIGHT SIDEBAR */}
            <aside className="w-[340px] bg-white border-l border-slate-200 overflow-y-auto shrink-0 flex flex-col p-6 hidden xl:flex">
                <h2 className="text-xl font-black text-slate-800 mb-6">Schedule Detail</h2>

                <div className="space-y-6">
                    {/* Activity Card 1 */}
                    <div className="bg-[#fef9f0] p-5 rounded-2xl border border-orange-50/50 shadow-sm relative group">
                        <div className="inline-block bg-[#ffdda8] text-[#c28e3b] text-[10px] font-black uppercase px-2 py-0.5 rounded mb-3">Physical Activities</div>
                        <h3 className="font-bold text-slate-800 leading-tight mb-3">Morning Yoga Session</h3>

                        <div className="space-y-2.5 text-xs text-slate-600 font-medium mb-4">
                            <div className="flex items-center gap-2">
                                <CalendarIcon size={14} className="text-slate-400" />
                                <span>Tuesday, 5 February 2027</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock size={14} className="text-slate-400" />
                                <span>7:00 AM</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" />
                                <span>Sunrise Yoga Studio, Lat Phrao District</span>
                            </div>
                        </div>

                        <div className="border-t border-orange-100 pt-3 relative">
                            <div className="absolute top-0 left-0 w-8 h-px bg-slate-400 -mt-px"></div>
                            <div className="text-[10px] text-slate-400 font-semibold mb-1">Note</div>
                            <div className="text-xs text-slate-500 italic">Focus on flexibility and breathing exercises. 1-hour session.</div>
                        </div>

                        <div className="flex justify-end gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="text-[10px] font-bold text-slate-500 hover:text-slate-700">Edit</button>
                            <button className="text-[10px] font-bold bg-[#ccff00] text-slate-800 px-3 py-1 rounded">Remove</button>
                        </div>
                    </div>

                    {/* Activity Card 2 */}
                    <div className="bg-[#fff4ed] p-5 rounded-2xl border border-orange-50 shadow-sm relative group">
                        <div className="inline-block bg-orange-300 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded mb-3">Appointments</div>
                        <h3 className="font-bold text-slate-800 leading-tight mb-3">General Health Check-up with Nutritionist</h3>

                        <div className="space-y-2.5 text-xs text-slate-600 font-medium mb-4">
                            <div className="flex items-center gap-2">
                                <CalendarIcon size={14} className="text-slate-400" />
                                <span>Tuesday, 5 February 2027</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock size={14} className="text-slate-400" />
                                <span>4:00 PM</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" />
                                <span>Online</span>
                            </div>
                        </div>

                        <div className="border-t border-orange-100 pt-3 relative">
                            <div className="absolute top-0 left-0 w-8 h-px bg-slate-400 -mt-px"></div>
                            <div className="text-[10px] text-slate-400 font-semibold mb-1">Note</div>
                            <div className="text-xs text-slate-500 italic">Discuss meal planning strategies for muscle gain and protein intake.</div>
                        </div>

                        <div className="flex justify-end gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="text-[10px] font-bold text-slate-500 hover:text-slate-700">Edit</button>
                            <button className="text-[10px] font-bold bg-[#ccff00] text-slate-800 px-3 py-1 rounded">Remove</button>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
    return (
        <a href="#" className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-semibold text-[15px]
      ${active ? 'bg-[#bfe600] text-slate-900 shadow-sm' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>
            <div className={`${active ? 'text-slate-900' : 'text-slate-400'}`}>{icon}</div>
            <span>{label}</span>
        </a>
    );
}
