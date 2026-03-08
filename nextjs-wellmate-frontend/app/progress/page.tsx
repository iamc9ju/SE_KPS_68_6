"use client";

import React, { useState } from 'react';
import {
    LayoutDashboard,
    HeartPulse,
    Calendar,
    MessageSquare,
    Salad,
    Utensils,
    BookOpen,
    TrendingUp,
    LogOut,
    Bell,
    Search,
    ChevronDown,
    MoreHorizontal,
    Droplets,
    GlassWater
} from 'lucide-react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart,
    ReferenceLine
} from 'recharts';

const weightData = [
    { name: 'Apr', weight: 81 },
    { name: 'May', weight: 82 },
    { name: 'Jun', weight: 80 },
    { name: 'Jul', weight: 77 },
    { name: 'Aug', weight: 78 },
    { name: 'Sep', weight: 78 },
];

const caloriesData = [
    { name: 'Sun', cal: 1800 },
    { name: 'Mon', cal: 1500 },
    { name: 'Tue', cal: 1600 },
    { name: 'Wed', cal: 2200 },
    { name: 'Thu', cal: 1400 },
];

const hydrationData = [
    { day: 'Sun', amount: 40 },
    { day: 'Mon', amount: 60 },
    { day: 'Tue', amount: 80 },
    { day: 'Wed', amount: 100 },
    { day: 'Thu', amount: 90 },
    { day: 'Fri', amount: 30 },
    { day: 'Sat', amount: 0 }, // Used for structural alignment
];


function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
    return (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors ${active ? 'bg-[#c1eb7c] font-medium text-zinc-800' : 'text-zinc-500 hover:bg-zinc-50'}`}>
            {icon}
            <span>{label}</span>
        </div>
    );
}

export default function ProgressPage() {
    const [measurements, setMeasurements] = useState([
        { id: 1, week: 'Week 1', chest: '95.0', arm: '30.0', waist: '80.0', hipe: '100.0', thigh: '66.0' },
        { id: 2, week: 'Week 2', chest: '94.0', arm: '29.5', waist: '79.0', hipe: '99.0', thigh: '59.5' },
        { id: 3, week: 'Week 3', chest: '93.5', arm: '29.0', waist: '78.0', hipe: '98.0', thigh: '58.5' },
        { id: 4, week: 'Week 4', chest: '93.0', arm: '28.5', waist: '77.5', hipe: '97.5', thigh: '58.5' },
    ]);

    const handleMeasurementChange = (index: number, field: string, value: string) => {
        const updated = [...measurements];
        updated[index] = { ...updated[index], [field]: value };
        setMeasurements(updated);
    };

    // State for interactive dropdowns & buttons
    const [bodyTimeframe, setBodyTimeframe] = useState('Today');
    const [monthTimeframe, setMonthTimeframe] = useState('February 2027');
    const [caloriesTimeframe, setCaloriesTimeframe] = useState('Last 5 Days');
    const [healthTimeframe, setHealthTimeframe] = useState('Last 5 Days');
    const [hydrationTimeframe, setHydrationTimeframe] = useState('This Week');

    // Toggle states for basic dropdowns
    const [showBodyDropdown, setShowBodyDropdown] = useState(false);
    const [showMonthDropdown, setShowMonthDropdown] = useState(false);
    const [showCaloriesDropdown, setShowCaloriesDropdown] = useState(false);
    const [showHealthDropdown, setShowHealthDropdown] = useState(false);
    const [showHydrationDropdown, setShowHydrationDropdown] = useState(false);
    const [showWeightOptions, setShowWeightOptions] = useState(false);

    // Header interactive states
    const [showSearch, setShowSearch] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const handleSave = (index: number, field: string) => {
        console.log(`Saved value for row ${index}, field ${field}: ${measurements[index][field as keyof typeof measurements[0]]}`);
    };

    return (
        <div className="flex h-screen bg-white text-zinc-800 font-sans overflow-hidden">
            {/* Sidebar */}
            <div className="w-64 flex-shrink-0 border-r border-zinc-100 flex flex-col justify-between py-6 px-4 bg-white z-10 overflow-y-auto">
                <div>
                    <div className="flex items-center gap-2 px-2 mb-8">
                        {/* Logo placeholder */}
                        <div className="text-[#8CC63F] font-bold text-2xl tracking-tighter italic">
                            W<span className="text-[#F7931E]">M</span>
                        </div>
                        <div className="font-bold text-xl tracking-tight uppercase">Wellmate</div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" />
                        <NavItem icon={<HeartPulse size={20} />} label="Nutrition Service" />
                        <NavItem icon={<Calendar size={20} />} label="Calendar" />
                        <NavItem icon={<MessageSquare size={20} />} label="Messages" />
                        <NavItem icon={<Salad size={20} />} label="Healthy Menu" />
                        <NavItem icon={<Utensils size={20} />} label="Meal Plan" />
                        <NavItem icon={<BookOpen size={20} />} label="Food Diary" />
                        <NavItem icon={<TrendingUp size={20} />} label="Progress" active={true} />
                    </div>
                </div>

                <div className="mt-8 flex flex-col gap-4">
                    <div className="bg-[#c1eb7c] p-4 rounded-xl relative overflow-hidden">
                        <div className="relative z-10 text-sm">
                            <p className="font-medium text-zinc-800 mb-1">Start your health journey with</p>
                            <p className="font-bold text-xl mb-3">a FREE 1 MONTH</p>
                            <p className="text-zinc-700 text-xs mb-3">access to WELLMATE</p>
                            <button className="bg-zinc-800 text-white text-xs px-4 py-1.5 rounded-full font-medium">
                                Sign Up Now!
                            </button>
                        </div>
                    </div>
                    <button className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#F4EBE1] text-zinc-600 font-medium hover:bg-[#ebdccc] transition-colors">
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto bg-[#FCF9F5] px-8 py-6">
                {/* Header Navbar */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-semibold text-zinc-800">Progress</h1>
                    <div className="flex items-center gap-4">
                        {/* Search Dropdown / Input */}
                        <div className="relative">
                            <button
                                onClick={() => setShowSearch(!showSearch)}
                                className="p-2 text-zinc-400 hover:bg-zinc-100 rounded-full transition-colors focus:outline-none"
                            >
                                <Search size={20} />
                            </button>
                            {showSearch && (
                                <div className="absolute top-10 right-0 w-64 bg-white rounded-xl shadow-lg border border-zinc-100 p-2 z-50 flex items-center">
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="w-full text-sm outline-none px-2 py-1 text-zinc-700"
                                        autoFocus
                                    />
                                </div>
                            )}
                        </div>

                        {/* Notifications Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="p-2 text-zinc-400 hover:bg-zinc-100 rounded-full transition-colors focus:outline-none relative"
                            >
                                <Bell size={20} />
                                <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                            </button>
                            {showNotifications && (
                                <div className="absolute top-10 right-0 w-72 bg-white rounded-xl shadow-lg border border-zinc-100 z-50 overflow-hidden">
                                    <div className="px-4 py-3 border-b border-zinc-100 font-bold text-sm text-zinc-800">Notifications</div>
                                    <div className="p-4 text-xs text-zinc-500 text-center">
                                        No new notifications
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <div
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="flex items-center gap-3 ml-2 cursor-pointer p-1 pr-3 rounded-full hover:bg-white/50 transition-colors"
                            >
                                <div className="w-10 h-10 bg-zinc-300 rounded-full flex items-center justify-center overflow-hidden">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-zinc-800 leading-none">Thanapat Hongaram</span>
                                    <span className="text-xs text-zinc-500 mt-1">Member</span>
                                </div>
                                <ChevronDown size={16} className="text-zinc-400 ml-2" />
                            </div>
                            {showProfileMenu && (
                                <div className="absolute top-12 right-0 w-48 bg-white rounded-xl shadow-lg border border-zinc-100 overflow-hidden z-50">
                                    {['My Profile', 'Settings', 'Support', 'Sign Out'].map((opt, i) => (
                                        <div
                                            key={opt}
                                            className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-zinc-50 ${i === 3 ? 'text-red-500 border-t border-zinc-100' : 'text-zinc-700'}`}
                                            onClick={() => setShowProfileMenu(false)}
                                        >
                                            {opt}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="flex flex-col xl:flex-row gap-6">

                    {/* Left Column: Body Image & Measurements */}
                    <div className="flex-1 xl:w-[45%] flex flex-col gap-8">
                        {/* Body Model Placeholder Area */}
                        <div className="relative pt-4 pl-4 h-[400px] flex items-center justify-center">
                            {/* "Today" Dropdown overlay */}
                            <div className="absolute top-0 left-0 z-20">
                                <button
                                    onClick={() => setShowBodyDropdown(!showBodyDropdown)}
                                    className="flex items-center gap-2 bg-[#BCE875] px-4 py-2 rounded-xl font-medium text-zinc-800 text-sm hover:bg-[#aade5e] transition-colors"
                                >
                                    {bodyTimeframe} <ChevronDown size={16} />
                                </button>
                                {showBodyDropdown && (
                                    <div className="absolute top-12 left-0 w-32 bg-white rounded-xl shadow-lg border border-zinc-100 overflow-hidden z-30">
                                        {['Today', 'Yesterday', 'Last Week'].map(opt => (
                                            <div
                                                key={opt}
                                                className="px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 cursor-pointer"
                                                onClick={() => { setBodyTimeframe(opt); setShowBodyDropdown(false); }}
                                            >
                                                {opt}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Human body representation */}
                            <div className="relative w-full h-[360px] flex justify-center items-center mt-4">
                                {/* Better Human Silhouette Image/SVG */}
                                <div className="w-[180px] h-full flex justify-center items-center drop-shadow-2xl">
                                    <svg viewBox="0 0 100 250" className="w-full h-full text-[#e8eaef]" fill="currentColor" stroke="#ced4da" strokeWidth="1" strokeLinejoin="round" style={{ filter: 'drop-shadow(0px 10px 15px rgba(0, 0, 0, 0.1))' }}>
                                        {/* Head & Neck */}
                                        <path d="M50 10 C44 10, 40 16, 40 24 C40 32, 44 38, 50 38 C56 38, 60 32, 60 24 C60 16, 56 10, 50 10 Z" />
                                        {/* Torso & Shoulders */}
                                        <path d="M50 38 C46 38, 43 40, 38 42 C30 45, 23 50, 20 60 C18 68, 19 80, 22 90 C25 100, 28 110, 32 120 C34 125, 36 130, 40 135 C45 141, 55 141, 60 135 C64 130, 66 125, 68 120 C72 110, 75 100, 78 90 C81 80, 82 68, 80 60 C77 50, 70 45, 62 42 C57 40, 54 38, 50 38 Z" />
                                        {/* Left Arm */}
                                        <path d="M22 62 C16 68, 10 90, 8 110 C7 125, 9 135, 12 140 C14 143, 17 141, 18 138 C19 135, 18 125, 22 110 C25 100, 28 85, 30 75 C31 70, 26 65, 22 62 Z" />
                                        {/* Right Arm */}
                                        <path d="M78 62 C84 68, 90 90, 92 110 C93 125, 91 135, 88 140 C86 143, 83 141, 82 138 C81 135, 82 125, 78 110 C75 100, 72 85, 70 75 C69 70, 74 65, 78 62 Z" />
                                        {/* Left Leg */}
                                        <path d="M40 135 C35 145, 32 170, 30 190 C28 210, 25 230, 26 235 C27 240, 32 240, 35 238 C38 235, 38 215, 40 195 C42 175, 45 150, 48 140 C49 137, 44 133, 40 135 Z" />
                                        {/* Right Leg */}
                                        <path d="M60 135 C65 145, 68 170, 70 190 C72 210, 75 230, 74 235 C73 240, 68 240, 65 238 C62 235, 62 215, 60 195 C58 175, 55 150, 52 140 C51 137, 56 133, 60 135 Z" />
                                    </svg>
                                </div>

                                {/* Interactive Labels */}
                                <div className="absolute top-[25%] right-[20%] text-xs text-zinc-700 flex items-center bg-white/60 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-sm border border-white">
                                    <div className="w-8 h-[1px] bg-[#F7931E] mr-2 transform -rotate-12"></div>
                                    <span className="font-medium mr-1">Chest</span>
                                    <input
                                        type="text"
                                        value={measurements[0].chest}
                                        onChange={(e) => handleMeasurementChange(0, 'chest', e.target.value)}
                                        className="w-12 font-bold text-zinc-900 border-b-2 border-[#F7931E]/30 focus:border-[#F7931E] outline-none bg-transparent text-center transition-colors"
                                    />
                                    <span className="text-[10px] text-zinc-500 font-normal ml-0.5">cm</span>
                                </div>

                                <div className="absolute top-[38%] left-[0%] text-xs text-zinc-700 flex items-center bg-white/60 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-sm border border-white">
                                    <span className="font-medium mr-1">Arm</span>
                                    <input
                                        type="text"
                                        value={measurements[0].arm}
                                        onChange={(e) => handleMeasurementChange(0, 'arm', e.target.value)}
                                        className="w-12 font-bold text-zinc-900 border-b-2 border-[#F7931E]/30 focus:border-[#F7931E] outline-none bg-transparent text-center transition-colors"
                                    />
                                    <span className="text-[10px] text-zinc-500 font-normal ml-0.5 mr-2">cm</span>
                                    <div className="w-8 h-[1px] bg-[#F7931E] transform rotate-12"></div>
                                </div>

                                <div className="absolute top-[40%] right-[15%] text-xs text-zinc-700 flex items-center bg-white/60 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-sm border border-white">
                                    <div className="w-8 h-[1px] bg-[#F7931E] mr-2 transform rotate-12"></div>
                                    <span className="font-medium mr-1">Waist</span>
                                    <input
                                        type="text"
                                        value={measurements[0].waist}
                                        onChange={(e) => handleMeasurementChange(0, 'waist', e.target.value)}
                                        className="w-12 font-bold text-zinc-900 border-b-2 border-[#F7931E]/30 focus:border-[#F7931E] outline-none bg-transparent text-center transition-colors"
                                    />
                                    <span className="text-[10px] text-zinc-500 font-normal ml-0.5">cm</span>
                                </div>

                                <div className="absolute top-[55%] left-[5%] text-xs text-zinc-700 flex items-center bg-white/60 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-sm border border-white">
                                    <span className="font-medium mr-1">Hips</span>
                                    <input
                                        type="text"
                                        value={measurements[0].hipe}
                                        onChange={(e) => handleMeasurementChange(0, 'hipe', e.target.value)}
                                        className="w-12 font-bold text-zinc-900 border-b-2 border-[#F7931E]/30 focus:border-[#F7931E] outline-none bg-transparent text-center transition-colors"
                                    />
                                    <span className="text-[10px] text-zinc-500 font-normal ml-0.5 mr-2">cm</span>
                                    <div className="w-8 h-[1px] bg-[#F7931E] transform -rotate-12"></div>
                                </div>

                                <div className="absolute bottom-[20%] right-[20%] text-xs text-zinc-700 flex items-center bg-white/60 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-sm border border-white">
                                    <div className="w-8 h-[1px] bg-[#F7931E] mr-2 transform rotate-45"></div>
                                    <span className="font-medium mr-1">Thigh</span>
                                    <input
                                        type="text"
                                        value={measurements[0].thigh}
                                        onChange={(e) => handleMeasurementChange(0, 'thigh', e.target.value)}
                                        className="w-12 font-bold text-zinc-900 border-b-2 border-[#F7931E]/30 focus:border-[#F7931E] outline-none bg-transparent text-center transition-colors"
                                    />
                                    <span className="text-[10px] text-zinc-500 font-normal ml-0.5">cm</span>
                                </div>
                            </div>
                        </div>

                        {/* Measurements Table Wrapper */}
                        <div className="bg-[#F5EBE1] rounded-3xl p-6">
                            <div className="flex justify-between items-center text-zinc-800 font-medium text-sm mb-5 px-4 w-full">
                                <div className="relative w-[120px] sm:w-[140px]">
                                    <div
                                        className="flex items-center gap-1 font-bold cursor-pointer hover:text-green-700 transition-colors"
                                        onClick={() => setShowMonthDropdown(!showMonthDropdown)}
                                    >
                                        {monthTimeframe} <ChevronDown className="w-4 h-4 ml-1 text-zinc-500" />
                                    </div>
                                    {showMonthDropdown && (
                                        <div className="absolute top-8 left-0 w-36 bg-white rounded-xl shadow-lg border border-zinc-100 overflow-hidden z-30">
                                            {['January 2027', 'February 2027', 'March 2027', 'April 2027'].map(opt => (
                                                <div
                                                    key={opt}
                                                    className="px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 cursor-pointer"
                                                    onClick={() => { setMonthTimeframe(opt); setShowMonthDropdown(false); }}
                                                >
                                                    {opt}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 flex justify-around pl-4">
                                    <div className="text-center text-xs text-zinc-500 font-medium">Chest (cm)</div>
                                    <div className="text-center text-xs text-zinc-500 font-medium">Arm (cm)</div>
                                    <div className="text-center text-xs text-zinc-500 font-medium">Waist (cm)</div>
                                    <div className="text-center text-xs text-zinc-500 font-medium">Hipe (cm)</div>
                                    <div className="text-center text-xs text-zinc-500 font-medium">Thigh (cm)</div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                {measurements.map((row, idx) => (
                                    <div key={row.id} className="flex justify-between items-center px-4">
                                        <div className="w-[80px] sm:w-[100px] text-sm text-zinc-600 font-medium">{row.week}</div>
                                        <div className="flex-1 flex justify-around pl-4">
                                            <input
                                                value={row.chest}
                                                onChange={(e) => handleMeasurementChange(idx, 'chest', e.target.value)}
                                                onBlur={() => handleSave(idx, 'chest')}
                                                className="w-12 sm:w-16 h-10 bg-white rounded-xl text-center text-zinc-700 font-semibold text-sm outline-none focus:ring-2 focus:ring-[#BCE875] transition-all"
                                            />
                                            <input
                                                value={row.arm}
                                                onChange={(e) => handleMeasurementChange(idx, 'arm', e.target.value)}
                                                onBlur={() => handleSave(idx, 'arm')}
                                                className="w-12 sm:w-16 h-10 bg-white rounded-xl text-center text-zinc-700 font-semibold text-sm outline-none focus:ring-2 focus:ring-[#BCE875] transition-all"
                                            />
                                            <input
                                                value={row.waist}
                                                onChange={(e) => handleMeasurementChange(idx, 'waist', e.target.value)}
                                                onBlur={() => handleSave(idx, 'waist')}
                                                className="w-12 sm:w-16 h-10 bg-white rounded-xl text-center text-zinc-700 font-semibold text-sm outline-none focus:ring-2 focus:ring-[#BCE875] transition-all"
                                            />
                                            <input
                                                value={row.hipe}
                                                onChange={(e) => handleMeasurementChange(idx, 'hipe', e.target.value)}
                                                onBlur={() => handleSave(idx, 'hipe')}
                                                className="w-12 sm:w-16 h-10 bg-white rounded-xl text-center text-zinc-700 font-semibold text-sm outline-none focus:ring-2 focus:ring-[#BCE875] transition-all"
                                            />
                                            <input
                                                value={row.thigh}
                                                onChange={(e) => handleMeasurementChange(idx, 'thigh', e.target.value)}
                                                onBlur={() => handleSave(idx, 'thigh')}
                                                className="w-12 sm:w-16 h-10 bg-white rounded-xl text-center text-zinc-700 font-semibold text-sm outline-none focus:ring-2 focus:ring-[#BCE875] transition-all"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>


                    {/* Center Column: Weight & Photos */}
                    <div className="flex-1 xl:w-[25%] flex flex-col gap-6">
                        {/* Weight Tracking */}
                        <div className="bg-[#F5EBE1] rounded-3xl p-6 h-[280px] flex flex-col">
                            <div className="flex justify-between items-start mb-4 relative">
                                <h3 className="font-bold text-zinc-800">Weight Tracking</h3>
                                <div className="relative">
                                    <MoreHorizontal
                                        className="text-zinc-400 cursor-pointer hover:text-zinc-700 transition-colors"
                                        size={20}
                                        onClick={() => setShowWeightOptions(!showWeightOptions)}
                                    />
                                    {showWeightOptions && (
                                        <div className="absolute top-6 right-0 w-32 bg-white rounded-xl shadow-lg border border-zinc-100 overflow-hidden z-30">
                                            {['Edit Goal', 'Export Data', 'Share'].map(opt => (
                                                <div
                                                    key={opt}
                                                    className="px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 cursor-pointer"
                                                    onClick={() => setShowWeightOptions(false)}
                                                >
                                                    {opt}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-y-2 mb-6">
                                <div className="text-zinc-500 text-xs">Start Weight</div>
                                <div className="text-right font-bold text-zinc-800 text-sm">85 <span className="font-normal text-xs text-zinc-500">kg</span></div>
                                <div className="text-zinc-500 text-xs">Current Weight</div>
                                <div className="text-right font-bold text-zinc-800 text-sm">78 <span className="font-normal text-xs text-zinc-500">kg</span></div>
                                <div className="text-zinc-500 text-xs">Weight Goal</div>
                                <div className="text-right font-bold text-zinc-800 text-sm">65 <span className="font-normal text-xs text-zinc-500">kg</span></div>
                            </div>

                            <div className="flex-1 min-h-0 w-[105%] -ml-[5%]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={weightData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={false} domain={['dataMin - 2', 'dataMax + 2']} />
                                        <Tooltip cursor={{ stroke: '#e5e7eb', strokeWidth: 1 }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                        <Area type="monotone" dataKey="weight" stroke="#fbbf24" strokeWidth={2} fillOpacity={1} fill="url(#colorWeight)" activeDot={{ r: 6, fill: '#fbbf24', stroke: '#fff', strokeWidth: 2 }} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Progress Photos */}
                        <div className="bg-[#FCF9F5] rounded-3xl pt-2">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-zinc-800">Progress Photos</h3>
                                <button
                                    className="bg-[#BCE875] text-zinc-800 text-xs px-3 py-1.5 rounded-lg font-medium hover:bg-[#aade5e] transition-colors"
                                    onClick={() => alert('View All Photos clicked')}
                                >
                                    View all
                                </button>
                            </div>
                            <div className="flex gap-4">
                                {/* Photo card 1 */}
                                <div className="flex-1 bg-[#F5EBE1] rounded-2xl p-3 flex flex-col items-center">
                                    <div className="flex justify-between w-full text-[10px] text-zinc-600 font-medium mb-3">
                                        <span>Jun 2027</span>
                                        <span className="font-bold text-zinc-800 text-xs">82 <span className="font-normal text-[10px]">kg</span></span>
                                    </div>
                                    <div className="w-full aspect-[4/3] bg-zinc-300 rounded-xl overflow-hidden flex items-center justify-center">
                                        <div className="w-8 h-12 bg-zinc-400 rounded-t-[100px] mt-2"></div>
                                    </div>
                                </div>
                                {/* Photo card 2 */}
                                <div className="flex-1 bg-[#F5EBE1] rounded-2xl p-3 flex flex-col items-center">
                                    <div className="flex justify-between w-full text-[10px] text-zinc-600 font-medium mb-3">
                                        <span>Jun 2027</span>
                                        <span className="font-bold text-zinc-800 text-xs">82 <span className="font-normal text-[10px]">kg</span></span>
                                    </div>
                                    <div className="w-full aspect-[4/3] bg-zinc-300 rounded-xl overflow-hidden flex items-center justify-center">
                                        <div className="w-8 h-12 bg-zinc-400 rounded-t-[100px] mt-2"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Right Column: Calories, Indicators, Hydration */}
                    <div className="flex-1 xl:w-[30%] flex flex-col gap-6">

                        {/* Calories Activities */}
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-bold text-zinc-800 text-sm">Calories Activities</h3>
                                    <div className="flex items-baseline gap-1 mt-1">
                                        <span className="font-bold text-xl text-zinc-800">450</span>
                                        <span className="text-xs text-zinc-500">kcal left</span>
                                    </div>
                                    <div className="text-[10px] text-zinc-400 mt-1">Calorie Goal 2500 kcal</div>
                                </div>
                                <div className="relative">
                                    <button
                                        className="flex items-center gap-1 bg-[#BCE875] px-2 py-1 rounded text-[10px] font-medium text-zinc-800 hover:bg-[#aade5e] transition-colors"
                                        onClick={() => setShowCaloriesDropdown(!showCaloriesDropdown)}
                                    >
                                        {caloriesTimeframe} <ChevronDown size={12} />
                                    </button>
                                    {showCaloriesDropdown && (
                                        <div className="absolute top-7 right-0 w-28 bg-white rounded-lg shadow-lg border border-zinc-100 overflow-hidden z-30">
                                            {['Last 5 Days', 'Last 7 Days', 'This Month'].map(opt => (
                                                <div
                                                    key={opt}
                                                    className="px-3 py-2 text-[10px] text-zinc-700 hover:bg-zinc-50 cursor-pointer"
                                                    onClick={() => { setCaloriesTimeframe(opt); setShowCaloriesDropdown(false); }}
                                                >
                                                    {opt}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="h-[140px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={caloriesData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                                        <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                        <Bar dataKey="cal" fill="#FCD34D" radius={[2, 2, 0, 0]} barSize={12} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Health Indicators */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-zinc-800 text-sm">Health Indicators</h3>
                                <div className="relative">
                                    <button
                                        className="flex items-center gap-1 bg-[#BCE875] px-2 py-1 rounded text-[10px] font-medium text-zinc-800 hover:bg-[#aade5e] transition-colors"
                                        onClick={() => setShowHealthDropdown(!showHealthDropdown)}
                                    >
                                        {healthTimeframe} <ChevronDown size={12} />
                                    </button>
                                    {showHealthDropdown && (
                                        <div className="absolute top-7 right-0 w-28 bg-white rounded-lg shadow-lg border border-zinc-100 overflow-hidden z-30">
                                            {['Last 5 Days', 'Last 7 Days', 'This Month'].map(opt => (
                                                <div
                                                    key={opt}
                                                    className="px-3 py-2 text-[10px] text-zinc-700 hover:bg-zinc-50 cursor-pointer"
                                                    onClick={() => { setHealthTimeframe(opt); setShowHealthDropdown(false); }}
                                                >
                                                    {opt}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-[#F5EBE1] rounded-2xl p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-zinc-700">BMI</span>
                                        <span className="bg-[#BCE875] text-[10px] font-bold px-2 py-0.5 rounded-full text-zinc-800">Normal</span>
                                    </div>
                                    <div className="font-bold text-2xl text-zinc-800">22.5</div>
                                </div>
                                <div className="bg-[#F5EBE1] rounded-2xl p-4">
                                    <div className="text-sm font-medium text-zinc-700 mb-2">% Body Fat</div>
                                    <div className="font-bold text-2xl text-zinc-800">18%</div>
                                </div>
                                <div className="bg-[#F5EBE1] rounded-2xl p-4">
                                    <div className="text-sm font-medium text-zinc-700 mb-2">BMR</div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="font-bold text-2xl text-zinc-800">1650</span>
                                        <span className="text-[10px] text-zinc-500 font-medium">kcal</span>
                                    </div>
                                </div>
                                <div className="bg-[#F5EBE1] rounded-2xl p-4">
                                    <div className="text-sm font-medium text-zinc-700 mb-2">TDEE</div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="font-bold text-2xl text-zinc-800">2300</span>
                                        <span className="text-[10px] text-zinc-500 font-medium">kcal</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Hydration */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-zinc-800 text-sm">Hydration</h3>
                                <div className="relative">
                                    <button
                                        className="flex items-center gap-1 bg-[#BCE875] px-2 py-1 rounded text-[10px] font-medium text-zinc-800 hover:bg-[#aade5e] transition-colors"
                                        onClick={() => setShowHydrationDropdown(!showHydrationDropdown)}
                                    >
                                        {hydrationTimeframe} <ChevronDown size={12} />
                                    </button>
                                    {showHydrationDropdown && (
                                        <div className="absolute top-7 right-0 w-28 bg-white rounded-lg shadow-lg border border-zinc-100 overflow-hidden z-30">
                                            {['This Week', 'Last Week', 'This Month'].map(opt => (
                                                <div
                                                    key={opt}
                                                    className="px-3 py-2 text-[10px] text-zinc-700 hover:bg-zinc-50 cursor-pointer"
                                                    onClick={() => { setHydrationTimeframe(opt); setShowHydrationDropdown(false); }}
                                                >
                                                    {opt}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex-1 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-[#BCE875] flex items-center justify-center text-zinc-800">
                                        <Droplets size={20} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-zinc-500">Hydration Level</div>
                                        <div className="font-bold text-sm text-zinc-800">Normal</div>
                                    </div>
                                </div>
                                <div className="flex-1 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-[#fca5b1] flex items-center justify-center text-zinc-800">
                                        <GlassWater size={20} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-zinc-500">Intake</div>
                                        <div className="font-bold text-sm text-zinc-800">2.0 L</div>
                                    </div>
                                </div>
                            </div>

                            {/* Custom Hydration Bar Chart implementation since it looks distinct from standard bars */}
                            <div className="flex justify-between items-end h-[60px] px-2">
                                {hydrationData.map((data, i) => (
                                    <div key={i} className="flex flex-col items-center gap-2">
                                        <div className="w-1.5 h-[50px] bg-zinc-200 rounded-full flex flex-col justify-end overflow-hidden">
                                            <div
                                                className={`w-full rounded-full ${data.amount > 0 && data.amount < 100 ? 'bg-[#fcd34d]' : data.amount === 100 ? 'bg-[#bce875]' : ''}`}
                                                style={{ height: `${data.amount}%` }}
                                            />
                                        </div>
                                        <div className="text-[9px] text-zinc-400">{data.day}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
