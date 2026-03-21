"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
    HeartPulse,
    Calendar as CalendarIcon,
    MessageSquare,
    Utensils,
    BookOpen,
    LineChart,
    Search,
    Phone,
    Video,
    Paperclip,
    CheckCheck,
    Check,
    Send,
    LogOut,
    PenLine,
    FileText,
    ExternalLink,
    ChevronRight,
    ChevronDown,
    LayoutGrid,
    Settings,
    Bell,
    SlidersHorizontal,
    ChevronLeft
} from "lucide-react";

export default function Messages() {
    return (
        <div className="flex h-screen w-full bg-white overflow-hidden text-[#434343] font-sans">

            {/* 1. Sidebar */}
            <div className="w-[280px] flex-shrink-0 border-r border-gray-100 flex flex-col justify-between py-6 bg-white z-10 hidden lg:flex">
                <div className="px-8 mb-8">
                    {/* Logo Placeholder */}
                    <div className="flex items-center gap-2">
                        <div className="text-[#8CC63F] font-bold text-2xl tracking-tighter italic">
                            W<span className="text-[#F7931E]">M</span>
                        </div>
                        <div className="font-bold text-xl tracking-tight uppercase text-[#3A3A3A]">Wellmate</div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-1">
                    <NavItem icon={<LayoutGrid size={22} className="text-gray-400" />} label="Dashboard" />
                    <NavItem icon={<HeartPulse size={22} className="text-gray-400" />} label="Nutrition Service" />
                    <NavItem icon={<CalendarIcon size={22} className="text-gray-400" />} label="Calendar" />
                    <NavItem icon={<MessageSquare size={22} />} label="Messages" active />
                    <NavItem icon={<Utensils size={22} className="text-gray-400" />} label="Healthy Menu" />
                    <NavItem icon={<BookOpen size={22} className="text-gray-400" />} label="Meal Plan" />
                    <NavItem icon={<BookOpen size={22} className="text-gray-400" />} label="Food Diary" />
                    <NavItem icon={<LineChart size={22} className="text-gray-400" />} label="Progress" />
                </nav>

                {/* Bottom Promos */}
                <div className="px-6 mt-auto">
                    <div className="bg-[#D8F08F] rounded-xl p-4 text-center mb-6 shadow-sm">
                        <h4 className="font-medium text-[13px] text-gray-800 mb-1 leading-tight">Start your health journey with</h4>
                        <div className="font-black text-lg mb-1 whitespace-nowrap">a FREE 1 MONTH</div>
                        <p className="text-[11px] font-medium text-gray-700 mb-3">access to WELLMATE</p>
                        <button className="bg-black text-white text-[11px] font-bold py-2.5 px-6 rounded-full hover:bg-gray-800 transition-colors shadow-sm">
                            Sign Up Now!
                        </button>
                    </div>

                    <button className="flex items-center justify-center w-full space-x-3 py-3.5 bg-[#F6EFE9] hover:bg-[#EBE2D9] rounded-xl transition-colors text-[#5f5f5f] font-semibold text-sm">
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            {/* 2. Messages List */}
            <div className="w-full lg:w-[340px] flex-shrink-0 flex flex-col border-r border-gray-100 bg-white">
                <div className="p-6 border-b border-transparent">
                    <h2 className="text-[28px] font-semibold mb-6 text-gray-800">Messages</h2>
                    <div className="relative flex items-center mb-2">
                        <div className="absolute left-4 text-gray-400">
                            <Search size={16} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search name , chat , etc"
                            className="w-full bg-[#f8f9fa] text-xs font-medium text-gray-600 rounded-full py-2.5 pl-11 pr-12 focus:outline-none focus:ring-1 focus:ring-gray-200"
                        />
                        <button className="absolute right-2 text-gray-400 bg-gray-200/50 p-1.5 rounded-lg hover:bg-gray-200 transition-colors">
                            <SlidersHorizontal size={14} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 pb-4">
                    <MessageListItem
                        name="Dr.Thananrada"
                        role="Nutritionist"
                        time="09:00 AM"
                        message="Hey Thanapat, Just checking in to see..."
                        avatar="https://images.unsplash.com/photo-1594824432258-f71694f41539?q=80&w=200&auto=format&fit=crop"
                        active
                    />
                </div>
            </div>

            {/* 3. Chat Window (Center) */}
            <div className="flex-1 flex flex-col bg-white hidden lg:flex">

                {/* Top bar */}
                <div className="h-[88px] border-b border-gray-100 flex justify-end items-center px-8 space-x-6">
                    <Search size={20} className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors" />
                    <Bell size={20} className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors" />
                    <div className="w-px h-6 bg-gray-200 mx-2"></div>
                    <div className="flex items-center space-x-3 cursor-pointer group rounded-full p-1 pr-3 hover:bg-gray-50 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-semibold text-sm text-gray-800">Thanapat Hongaram</span>
                            <span className="text-xs text-gray-400">Member</span>
                        </div>
                        <ChevronDown size={16} className="text-gray-400 ml-2 group-hover:text-gray-600" />
                    </div>
                </div>

                <div className="flex-1 p-6 relative">
                    <div className="bg-[#FDF3CC] rounded-[2rem] w-full h-full flex flex-col relative overflow-hidden">

                        {/* Chat header within the yellow box */}
                        <div className="px-8 py-5 flex items-center justify-between border-b border-orange-100/30">
                            <div className="flex items-center space-x-4">
                                <div className="w-[52px] h-[52px] rounded-full overflow-hidden border-2 border-white relative shadow-sm">
                                    <img src="https://images.unsplash.com/photo-1594824432258-f71694f41539?q=80&w=200&auto=format&fit=crop" alt="Dr" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex flex-col justify-center translate-y-[-2px]">
                                    <div className="flex items-center space-x-2">
                                        <h3 className="font-semibold text-[17px] text-gray-800">Dr.Thananrada</h3>
                                    </div>
                                    <p className="text-[12px] text-gray-500 font-medium mt-0.5">last seen recently</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-500 shadow-sm hover:shadow transition-shadow">
                                    <Phone size={18} fill="currentColor" className="text-gray-400" />
                                </button>
                                <button className="w-10 h-10 bg-[#87D039] rounded-[14px] flex items-center justify-center text-white shadow-sm hover:bg-[#7bc030] transition-colors">
                                    <Video size={18} fill="currentColor" />
                                </button>
                            </div>
                        </div>

                        {/* Chat Messages Area */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-6 pt-6">

                            <div className="flex justify-center mb-2">
                                <span className="text-[11px] font-medium text-gray-400">Yesterday , Feb 4</span>
                            </div>

                            <ChatBubble
                                text="Hey Thanapat, I've updated your meal plan for next week. Let me know if you like the new menu!"
                                time="9:40 AM"
                                isDoc={true}
                            />
                            <ChatBubble
                                text="Thanks, Doctor! I noticed there's more chicken breast this time. Is that for muscle building?"
                                time="9:47 AM"
                                isDoc={false}
                                read={true}
                            />
                            <ChatBubble
                                text="Exactly! 💪 We're increasing your protein intake to support your hypertrophy goals."
                                time="9:48 AM"
                                isDoc={false}
                                read={true}
                            />
                            <ChatBubble
                                text="Hey Thanapat, just checking in. How are you feeling after the first week of the new diet?"
                                time="11:00 AM"
                                isDoc={true}
                            />
                            <ChatBubble
                                text="I feel great! Less bloated and I have more energy during workouts."
                                time="11:11 AM"
                                isDoc={false}
                                read={true}
                            />

                            <div className="flex justify-center mt-8 mb-2">
                                <span className="text-[11px] font-medium text-gray-400">Today , Feb 5</span>
                            </div>

                            <ChatBubble
                                text="Hello Doctor, can I switch the grilled chicken to fish for tomorrow's lunch? I'm getting a bit bored of chicken."
                                time="8:30 PM"
                                isDoc={false}
                                read={true}
                            />
                            <ChatBubble
                                text="Just make sure to keep it grilled or steamed to stay within your calorie limit."
                                time="8:45 PM"
                                isDoc={true}
                            />
                        </div>

                        {/* Input Area */}
                        <div className="px-6 pb-6 pt-2">
                            <div className="bg-white rounded-[20px] flex items-center p-2 shadow-sm min-h-[56px]">
                                <button className="p-3 text-gray-400 hover:text-gray-600 transition-colors">
                                    <Search size={20} />
                                </button>
                                <input
                                    type="text"
                                    placeholder="Type a Message..."
                                    className="flex-1 bg-transparent px-2 py-2 outline-none text-[15px] text-gray-700 placeholder-gray-400"
                                />
                                <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-[#87D039] transition-colors rounded-full hover:bg-gray-50 mr-1">
                                    <Paperclip size={20} className="-rotate-45" />
                                </button>
                                <button className="bg-[#87D039] hover:bg-[#7bc030] text-white px-5 py-2.5 rounded-2xl font-semibold text-[15px] flex items-center shadow-sm transition-colors ml-1 h-[44px]">
                                    <span>Send</span>
                                    <Send size={16} className="ml-2" />
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* 4. Profile Sidebar (Right) */}
            <div className="w-[320px] flex-shrink-0 flex flex-col bg-white overflow-y-auto hidden xl:flex">
                <div className="p-8">
                    <div className="flex items-center justify-between mb-10 pt-4">
                        <h2 className="text-[20px] font-bold text-gray-800">Profile</h2>
                        <button className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                            <PenLine size={16} />
                        </button>
                    </div>

                    <div className="flex flex-col items-center mb-10">
                        <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-[3px] border-white shadow-md relative">
                            <img src="https://images.unsplash.com/photo-1594824432258-f71694f41539?q=80&w=200&auto=format&fit=crop" alt="Dr. Thananrada" className="w-full h-full object-cover" />
                        </div>
                        <h3 className="font-bold text-[19px] text-gray-800 tracking-tight">Dr.Thananrada</h3>
                        <span className="bg-[#E4F4D3] text-[#5AAA1D] text-[11px] font-bold px-3 py-1.5 rounded-lg mt-3 uppercase tracking-wide">Personal Nutritionist</span>
                    </div>

                    {/* About */}
                    <div className="mb-8 pl-1">
                        <div className="flex items-center space-x-2 text-gray-800 mb-3 border-b border-gray-100 pb-2">
                            <MessageSquare size={16} className="text-[#87D039]" />
                            <h4 className="font-semibold text-sm">About</h4>
                        </div>
                        <p className="text-[13px] text-gray-500 leading-relaxed">
                            Specializing in personalized nutrition for muscle hypertrophy and weight management. I believe that healthy eating should be sustainable, simple, and delicious.
                        </p>
                    </div>

                    {/* Media */}
                    <div className="mb-8 pl-1">
                        <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
                            <div className="flex items-center space-x-2 text-gray-800">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#87D039]"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
                                <h4 className="font-semibold text-sm">Media <span className="text-gray-400 font-medium">(6)</span></h4>
                            </div>
                            <button className="text-[11px] font-semibold text-gray-400 hover:text-gray-800 transition-colors">Show All</button>
                        </div>
                        <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide mr-[-1rem] pr-4">
                            <div className="w-[84px] h-[84px] rounded-[18px] bg-gray-100 flex-shrink-0 overflow-hidden shadow-sm">
                                <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&auto=format&fit=crop" className="w-full h-full object-cover" alt="media1" />
                            </div>
                            <div className="w-[84px] h-[84px] rounded-[18px] bg-gray-100 flex-shrink-0 overflow-hidden shadow-sm">
                                <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&auto=format&fit=crop" className="w-full h-full object-cover" alt="media2" />
                            </div>
                            <div className="w-[84px] h-[84px] rounded-[18px] bg-gray-100 flex-shrink-0 overflow-hidden shadow-sm opacity-60 cursor-pointer relative flex items-center justify-center">
                                <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&auto=format&fit=crop" className="w-full h-full object-cover absolute inset-0 mix-blend-multiply" alt="media3" />
                                <span className="font-bold text-white z-10 text-lg">+4</span>
                            </div>
                        </div>
                    </div>

                    {/* Documents */}
                    <div className="mb-8 pl-1">
                        <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
                            <div className="flex items-center space-x-2 text-gray-800">
                                <FileText size={16} className="text-[#87D039]" />
                                <h4 className="font-semibold text-sm">Documents <span className="text-gray-400 font-medium">(4)</span></h4>
                            </div>
                            <button className="text-[11px] font-semibold text-gray-400 hover:text-gray-800 transition-colors">Show All</button>
                        </div>
                        <div className="space-y-2.5">
                            <DocumentItem name="Documents (1)" size="2.5 mb" active={true} />
                            <DocumentItem name="Documents (2)" size="2.5 mb" active={true} />
                            <DocumentItem name="Documents (3)" size="2.5 mb" active={false} />
                            <DocumentItem name="Documents (4)" size="2.5 mb" active={true} />
                        </div>
                    </div>

                    {/* Links */}
                    <div className="pl-1 mb-10">
                        <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
                            <div className="flex items-center space-x-2 text-gray-800">
                                <ExternalLink size={16} className="text-[#87D039]" />
                                <h4 className="font-semibold text-sm">links</h4>
                            </div>
                            <button className="text-[11px] font-semibold text-gray-400 hover:text-gray-800 transition-colors">Show All</button>
                        </div>
                        <div className="space-y-2">
                            <LinkItem name="Alex Foster Fitness Tips" />
                            <LinkItem name="Home Workout Series" />
                            <LinkItem name="Healthy Cooking 101" />
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
}

// ============== Subcomponents ==============

const NavItem = ({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) => (
    <a href="#" className={`
    flex items-center px-4 py-[14px] my-1 rounded-2xl transition-all duration-200 group
    ${active
            ? 'bg-[#B4EA71] text-gray-900 font-semibold shadow-sm'
            : 'text-gray-500 hover:bg-gray-50 font-medium'
        }
  `}>
        <div className={`mr-4 ${active ? 'text-gray-800' : 'text-gray-400 group-hover:text-gray-600'}`}>
            {icon}
        </div>
        <span className="text-[15px]">{label}</span>
    </a>
);

const MessageListItem = ({ name, role, time, message, avatar, active = false }: any) => (
    <div className={`
    p-3.5 flex items-start space-x-3.5 cursor-pointer relative group
    ${active ? '' : 'hover:bg-gray-50/80 rounded-2xl transition-colors'}
  `}>
        {active && (
            <div className="absolute left-[-16px] top-1/2 -translate-y-1/2 w-1 h-[70%] bg-[#87D039] rounded-r-full"></div>
        )}

        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 relative shadow-sm">
            <img src={avatar} alt={name} className="w-full h-full object-cover" />
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-[2.5px] border-white rounded-full"></div>
        </div>
        <div className="flex-1 min-w-0 pt-0.5">
            <div className="flex justify-between items-center mb-0.5">
                <h4 className="font-bold text-[14px] text-gray-800 truncate pr-2">{name}</h4>
                <div className="text-[11px] text-gray-500 font-semibold whitespace-nowrap">{time}</div>
            </div>
            <div className="flex items-center text-xs text-[#5AAA1D] font-medium mb-1.5">
                <span>- {role}</span>
            </div>
            <p className="text-[13px] text-gray-500 truncate leading-snug font-medium max-w-[95%]">{message}</p>
        </div>
    </div>
);

const ChatBubble = ({ text, time, isDoc, read }: { text: string, time: string, isDoc?: boolean, read?: boolean }) => {
    return (
        <div className={`flex flex-col w-full ${isDoc ? 'items-start' : 'items-end'}`}>
            <div className={`
        max-w-[65%] px-5 py-3.5 rounded-2xl text-[14px] leading-relaxed shadow-sm font-medium
        ${isDoc
                    ? 'bg-white text-gray-700 rounded-tl-sm'
                    : 'bg-[#FAD981] text-gray-800 rounded-tr-sm'
                }
      `}>
                {text}
            </div>
            <div className="flex items-center mt-2 space-x-1.5 mr-1 ml-1">
                <span className="text-[11px] font-semibold text-gray-400">{time}</span>
                {!isDoc && read && <CheckCheck size={14} className="text-gray-400" />}
                {!isDoc && !read && <Check size={14} className="text-gray-400" />}
            </div>
        </div>
    );
};

const DocumentItem = ({ name, size, active }: { name: string, size: string, active: boolean }) => (
    <div className="flex items-center p-3 bg-[#FDF3CC] rounded-xl hover:bg-[#FCE89B] transition-colors cursor-pointer group">
        <div className={`w-[34px] h-[34px] rounded-[10px] flex items-center justify-center text-white mr-3.5 flex-shrink-0 shadow-sm transition-colors
      ${active ? 'bg-[#87D039]' : 'bg-[#D3D3D3]'}
    `}>
            <span className="text-[9px] font-bold tracking-wider">PDF</span>
        </div>
        <div className="flex-1">
            <h5 className="text-[13px] font-bold text-gray-800 mb-0.5">{name}</h5>
            <p className="text-[11px] font-medium text-gray-500">{size}</p>
        </div>
    </div>
);

const LinkItem = ({ name }: { name: string }) => (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 hover:bg-gray-50 cursor-pointer transition-colors group px-2 rounded-lg -ml-2 w-[calc(100%+16px)]">
        <div className="flex items-center space-x-3 text-gray-600">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 group-hover:text-[#87D039] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m10 8 6 4-6 4Z" /></svg>
            </div>
            <span className="text-[13px] font-semibold text-gray-600 group-hover:text-gray-900 transition-colors">{name}</span>
        </div>
        <ExternalLink size={14} className="text-gray-300 group-hover:text-gray-500" />
    </div>
);
