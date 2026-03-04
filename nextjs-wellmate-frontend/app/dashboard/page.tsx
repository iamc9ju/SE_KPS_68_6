"use client";

import React from 'react';
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
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
    Flame,
    CheckCircle2,
    Clock
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
    const calorieData = [
        { name: 'Eaten', value: 1750 },
        { name: 'Remaining', value: 1250 }
    ];
    const COLORS = ['#F97316', '#F1F5F9'];

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
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
                        <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active />
                        <NavItem icon={<HeartPulse size={20} />} label="Nutrition Service" />
                        <NavItem icon={<Calendar size={20} />} label="Calendar" />
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
            <main className="flex-1 overflow-y-auto p-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold mb-1 text-slate-800">Hello , New User!</h1>
                    <p className="text-slate-500 font-medium">let's begin our journey to better health today</p>
                </header>

                {/* TOP STATS CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
                    {/* Weight Card */}
                    <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
                        <h3 className="font-semibold text-slate-700 mb-2">Weight</h3>
                        <div className="flex justify-center items-end gap-1 mb-4">
                            <span className="text-4xl font-bold">82</span>
                        </div>
                        {/* Visual fake scale slider */}
                        <div className="flex flex-col items-center">
                            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-orange-500 mb-1"></div>
                            <div className="w-full h-8 overflow-hidden rounded flex justify-between items-center border border-slate-200 bg-slate-50 px-2">
                                {Array.from({ length: 21 }).map((_, i) => (
                                    <div key={i} className={`w-[2px] ${i % 5 === 0 ? 'h-5 bg-slate-400' : 'h-3 bg-slate-200'}`}></div>
                                ))}
                            </div>
                            <div className="w-full flex justify-between text-[10px] text-slate-400 font-bold mt-1 px-1">
                                <span>90</span><span>85</span><span>80</span><span>75</span><span>70</span>
                            </div>
                        </div>
                    </div>

                    {/* Steps Card */}
                    <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
                        <div>
                            <h3 className="font-semibold text-slate-700 mb-1">Steps</h3>
                            <div className="text-2xl font-bold flex items-baseline gap-1">4850 <span className="text-sm font-medium text-slate-500">steps</span></div>
                        </div>
                        <div className="mt-6">
                            <div className="flex gap-1 h-3.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full w-[65%] bg-orange-400 rounded-full"></div>
                                <div className="h-full w-[15%] bg-orange-200 rounded-full"></div>
                            </div>
                            <div className="flex justify-between text-xs mt-3 font-semibold">
                                <span className="text-slate-800">65%</span>
                                <span className="text-slate-400">2150 steps left</span>
                            </div>
                        </div>
                    </div>

                    {/* Sleep Card */}
                    <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
                        <div>
                            <h3 className="font-semibold text-slate-700 mb-1">Sleep</h3>
                            <div className="text-2xl font-bold flex items-baseline gap-1 mb-4">7.5 <span className="text-sm font-medium text-slate-500">hours</span></div>
                        </div>
                        <div className="flex items-end h-16 gap-2 justify-between px-1">
                            {[4, 5, 4, 7.5, 6, 6.5, 5].map((h, i) => (
                                <div key={i} className={`w-3.5 rounded-full ${i === 3 ? 'bg-[#bfe600]' : 'bg-slate-200'}`} style={{ height: `${(h / 8) * 100}%` }}></div>
                            ))}
                        </div>
                    </div>

                    {/* Water Intake Card */}
                    <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
                        <div>
                            <h3 className="font-semibold text-slate-700 mb-1">Water Intake</h3>
                            <div className="text-xl font-bold flex items-baseline gap-1">0.7 <span className="text-sm font-medium text-slate-500">litre left</span></div>
                        </div>
                        <div className="mt-4">
                            <div className="h-16 w-full bg-[#fceea6] rounded-xl overflow-hidden relative flex items-end">
                                <div className="w-full bg-[#f7b733] h-[65%] rounded-t-sm"></div>
                                <div className="absolute top-2 right-3 text-xs font-bold text-slate-600">1.3/2 litre</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CALORIES INTAKE */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-slate-800">Calories Intake</h3>
                        <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal /></button>
                    </div>

                    <div className="flex flex-col lg:flex-row items-center gap-10">
                        {/* Donut Chart */}
                        <div className="relative w-52 h-52 flex-shrink-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={calorieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={75}
                                        outerRadius={95}
                                        stroke="none"
                                        dataKey="value"
                                        startAngle={90}
                                        endAngle={-270}
                                        cornerRadius={10}
                                    >
                                        {calorieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <Flame className="text-orange-500 mb-1" size={24} />
                                <span className="text-2xl font-bold text-slate-800">1750 <span className="text-sm font-medium text-slate-500">kcal</span></span>
                                <span className="text-xs text-slate-500 font-medium tracking-tight">calories left</span>
                            </div>
                        </div>

                        {/* Right side macros and summary */}
                        <div className="flex-1 w-full">
                            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                                <div className="bg-[#f0f5e1] rounded-2xl p-4 flex items-center gap-4 flex-1">
                                    <div className="bg-[#bfe600] p-2.5 rounded-xl"><Utensils size={20} className="text-slate-800" /></div>
                                    <div>
                                        <div className="text-xl font-bold text-slate-800">1750 <span className="text-sm font-medium text-slate-600">kcal</span></div>
                                        <div className="text-sm text-slate-500 font-medium">Eaten calories</div>
                                    </div>
                                </div>
                                <div className="bg-[#fff4ed] rounded-2xl p-4 flex items-center gap-4 flex-1">
                                    <div className="bg-orange-200 p-2.5 rounded-xl"><Flame size={20} className="text-orange-600" /></div>
                                    <div>
                                        <div className="text-xl font-bold text-slate-800">510 <span className="text-sm font-medium text-slate-600">kcal</span></div>
                                        <div className="text-sm text-slate-500 font-medium">Burned calories</div>
                                    </div>
                                </div>
                            </div>

                            {/* Macros */}
                            <div className="space-y-3">
                                <MacroProgress value={120} max={325} label="Carbohydrates" percentage={37} fillClass="bg-slate-300" labelClass="text-slate-500" valueClass="text-slate-600" />
                                <MacroProgress value={70} max={75} label="Proteins" percentage={93} fillClass="bg-[#bfe600]" labelClass="text-slate-600" valueClass="text-slate-800" />
                                <MacroProgress value={20} max={44} label="Fats" percentage={45} fillClass="bg-slate-300" labelClass="text-slate-500" valueClass="text-slate-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* RECOMMENDED MENU */}
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-slate-800">Recommended Menu</h3>
                        <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal /></button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Menu item 1 */}
                        <div className="group cursor-pointer">
                            <div className="relative rounded-3xl overflow-hidden mb-4 aspect-[4/3]">
                                <img src="https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=800" alt="Yogurt" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute top-4 left-4 flex gap-2">
                                    <span className="bg-[#ccff00] text-black text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">Snack</span>
                                    <span className="bg-white/95 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1"><Flame size={12} className="text-orange-500" /> 260 kcal</span>
                                </div>
                            </div>
                            <div className="flex gap-4 text-xs font-bold text-slate-600 mb-2">
                                <span className="flex items-center gap-1 text-slate-600"><span className="text-green-500 text-base">■</span> C 28 g</span>
                                <span className="flex items-center gap-1 text-slate-600"><span className="text-orange-400 text-base">■</span> P 15 g</span>
                                <span className="flex items-center gap-1 text-slate-600"><span className="text-red-400 text-base">○</span> F 8 g</span>
                            </div>
                            <h4 className="font-bold text-lg leading-tight mb-2 text-slate-800 group-hover:text-amber-600 transition-colors">Greek Yogurt with Granola and Mixed Berries</h4>
                            <p className="text-sm text-slate-400 font-medium">Rich in probiotics and antioxidants. A perfect</p>
                        </div>

                        {/* Menu item 2 */}
                        <div className="group cursor-pointer">
                            <div className="relative rounded-3xl overflow-hidden mb-4 aspect-[4/3]">
                                <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800" alt="Salad" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute top-4 left-4 flex gap-2">
                                    <span className="bg-orange-400 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">Lunch</span>
                                    <span className="bg-white/95 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1"><Flame size={12} className="text-orange-500" /> 420 kcal</span>
                                </div>
                            </div>
                            <div className="flex gap-4 text-xs font-bold text-slate-600 mb-2">
                                <span className="flex items-center gap-1 text-slate-600"><span className="text-green-500 text-base">■</span> C 15 g</span>
                                <span className="flex items-center gap-1 text-slate-600"><span className="text-orange-400 text-base">■</span> P 40 g</span>
                                <span className="flex items-center gap-1 text-slate-600"><span className="text-red-400 text-base">○</span> F 22 g</span>
                            </div>
                            <h4 className="font-bold text-lg leading-tight mb-2 text-slate-800 group-hover:text-amber-600 transition-colors">Grilled Chicken Salad with Avocado and Fresh Vegetables</h4>
                            <p className="text-sm text-slate-400 font-medium">Packed with lean protein and healthy fats from</p>
                        </div>
                    </div>
                </div>

            </main>

            {/* RIGHT SIDEBAR */}
            <aside className="w-[320px] bg-white border-l border-slate-200 overflow-y-auto shrink-0 flex-col hidden xl:flex">
                {/* Profile Header */}
                <div className="p-6 pb-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold overflow-hidden shadow-sm">
                            <img src="https://ui-avatars.com/api/?name=Thanapat+Hongaram&background=E2E8F0&color=475569" alt="User" />
                        </div>
                        <div>
                            <div className="font-bold text-[15px] text-slate-800">Thanapat Hongaram</div>
                            <div className="text-[13px] text-slate-500 font-medium">Member</div>
                        </div>
                    </div>
                    <button className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 hover:bg-orange-100 transition-colors">
                        <Bell size={18} />
                    </button>
                </div>

                {/* Calendar Widget */}
                <div className="px-6 py-4">
                    <div className="flex justify-between items-center mb-5 text-[15px] font-bold text-slate-800">
                        <span>January 2026</span>
                        <div className="flex gap-1 text-slate-400">
                            <button className="hover:text-slate-700 p-1"><ChevronLeft size={18} /></button>
                            <button className="hover:text-slate-700 p-1"><ChevronRight size={18} /></button>
                        </div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 font-semibold mb-3">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                            <span key={day} className={`w-8 text-center ${day === 'Wed' ? 'text-white bg-[#bfe600] rounded px-1 !bg-opacity-0 !text-slate-800' : ''}`}>{day}</span>
                        ))}
                    </div>
                    <div className="flex justify-between text-sm font-bold text-slate-700">
                        <span className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 cursor-pointer">19</span>
                        <span className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 cursor-pointer">20</span>
                        <span className="w-8 h-8 flex items-center justify-center rounded-full bg-[#ccff00] text-slate-900 shadow-sm cursor-pointer">21</span>
                        <span className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 cursor-pointer">22</span>
                        <span className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 cursor-pointer">23</span>
                        <span className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 cursor-pointer">24</span>
                        <span className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 cursor-pointer">25</span>
                    </div>
                </div>

                {/* Meals List */}
                <div className="px-6 py-5 flex-1 relative z-10 space-y-5 border-t border-slate-100">
                    <MealItem
                        type="Breakfast"
                        calories={380}
                        title="Fluffy Protein Pancakes with Fresh Strawberries"
                        macros={{ c: 42, p: 22, f: 10 }}
                        imgSrc="https://images.unsplash.com/photo-1528207776546-322186407074?auto=format&fit=crop&q=80&w=150"
                        tagColor="bg-[#a8e6cf]"
                    />
                    <MealItem
                        type="Lunch"
                        calories={420}
                        title="Grilled Chicken Salad with Avocado and Fresh Vegetables"
                        macros={{ c: 15, p: 40, f: 22 }}
                        imgSrc="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=150"
                        tagColor="bg-[#ccff00]"
                    />
                    <MealItem
                        type="Snack"
                        calories={420}
                        title="Greek Yogurt with Granola and Mixed Berries"
                        macros={{ c: 28, p: 15, f: 8 }}
                        imgSrc="https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=150"
                        tagColor="bg-[#ffd3b6]"
                    />
                    <MealItem
                        type="Dinner"
                        calories={450}
                        title="Baked Salmon with Steamed Asparagus"
                        macros={{ c: 10, p: 35, f: 28 }}
                        imgSrc="https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=150"
                        tagColor="bg-[#ffbd59]"
                    />
                </div>

                {/* Recent Activity */}
                <div className="px-6 pb-6 pt-4 border-t border-slate-100">
                    <h3 className="font-bold text-base mb-5 text-slate-800">Recent Activity</h3>
                    <div className="relative space-y-5 before:absolute before:inset-0 before:ml-3 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                        <ActivityItem
                            time="6:00 PM"
                            title="Notification"
                            desc="Congratulations! You've reached 75% of your cardio endurance goal"
                            icon={<CheckCircle2 size={16} className="text-[#84cc16]" />}
                            iconBg="bg-[#ecfccb]"
                        />
                        <ActivityItem
                            time="4:30 PM"
                            title="Lunch Logged Description"
                            desc="~ 500 kcal added. You have reached 60% of your daily calorie goal."
                            icon={<Clock size={16} className="text-orange-500" />}
                            iconBg="bg-orange-100"
                        />
                        <ActivityItem
                            time="4:30 PM"
                            title="Nutrition Summary Updated"
                            desc="Total intake: 1,200 kcal. You are currently 300 kcal under your daily limit."
                            icon={<Clock size={16} className="text-orange-500" />}
                            iconBg="bg-orange-100"
                        />
                    </div>
                </div>
            </aside>
        </div>
    );
}

// Subcomponents

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
    return (
        <a href="#" className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-semibold text-[15px]
      ${active ? 'bg-[#ccff00] text-slate-900 shadow-sm' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>
            <div className={`${active ? 'text-slate-900' : 'text-slate-400'}`}>{icon}</div>
            <span>{label}</span>
        </a>
    );
}

function MacroProgress({ value, max, label, percentage, fillClass, labelClass, valueClass }: any) {
    return (
        <div className="flex h-11 w-full rounded-2xl overflow-hidden bg-slate-100 shadow-sm">
            {/* Left block */}
            <div className="w-[32%] bg-slate-200/60 flex items-center px-4 font-bold text-sm shrink-0">
                <span className={valueClass}>{value}</span> <span className="font-semibold text-slate-400 text-xs ml-1">/{max}gr</span>
            </div>
            {/* Right block */}
            <div className="flex-1 relative flex items-center bg-slate-50">
                <div className={`absolute left-0 top-0 h-full ${fillClass} rounded-r-2xl transition-all duration-1000 w-full`} style={{ width: `${percentage}%` }}></div>
                <div className="relative z-10 w-full flex justify-between items-center px-4 text-[13px] font-bold">
                    <span className={labelClass}>{label}</span>
                    <span className="text-slate-500">{percentage}%</span>
                </div>
            </div>
        </div>
    );
}

function MealItem({ type, calories, title, macros, imgSrc, tagColor }: { type: string, calories: number, title: string, macros: { c: number, p: number, f: number }, imgSrc: string, tagColor: string }) {
    return (
        <div className="relative group cursor-pointer">
            <div className="flex justify-between items-center mb-2.5">
                <div className="flex gap-2.5 items-center">
                    <span className={`px-2.5 py-1 rounded-md text-slate-900 font-bold text-[10px] uppercase tracking-wider ${tagColor}`}>{type}</span>
                    <span className="text-slate-500 bg-slate-100 px-2 py-1 rounded-md flex items-center gap-1 font-bold text-[10px]"><Flame size={10} className="text-slate-400" /> {calories} kcal</span>
                </div>
                <button className="text-slate-400 hover:text-slate-600 transition-colors"><div className="w-5 h-5 rounded-full border-2 border-slate-200 flex items-center justify-center group-hover:bg-slate-200 transition-colors"><ChevronRight size={12} className="rotate-[-90deg]" /></div></button>
            </div>
            <div className="flex gap-3.5 items-center">
                <img src={imgSrc} alt={title} className="w-14 h-14 rounded-2xl object-cover bg-slate-100 shrink-0 shadow-sm group-hover:scale-105 transition-transform" />
                <div className="min-w-0">
                    <div className="text-[13px] font-bold leading-tight mb-1.5 text-slate-800 line-clamp-2">{title}</div>
                    <div className="flex gap-2.5 text-[11px] font-bold text-slate-500">
                        <span className="flex items-center gap-0.5"><span className="text-slate-300 text-sm">□</span> C {macros.c}g</span>
                        <span className="flex items-center gap-0.5"><span className="text-slate-300 text-sm">□</span> P {macros.p}g</span>
                        <span className="flex items-center gap-0.5"><span className="text-slate-300 text-sm">○</span> F {macros.f}g</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ActivityItem({ time, title, desc, icon, iconBg }: { time: string, title: string, desc: string, icon: React.ReactNode, iconBg: string }) {
    return (
        <div className="relative flex items-start gap-4">
            <div className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2 border-white shadow-sm ${iconBg}`}>
                {icon}
            </div>
            <div className="pt-0.5 flex-1 pb-1">
                <div className="text-[11px] text-slate-400 font-bold mb-0.5">{time}</div>
                <div className="text-[13px] font-bold mb-1 text-slate-800">{title}</div>
                <div className="text-[11px] text-slate-500 font-medium leading-relaxed">{desc}</div>
            </div>
        </div>
    );
}
