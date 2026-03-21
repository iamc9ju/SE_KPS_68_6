"use client";

import { Bell } from "lucide-react";
import { useState } from "react";

export default function NotificationDropdown() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-[#3d3522] hover:bg-[#C6E065]/20 transition-all relative"
            >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-3xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-fadeIn">
                    <div className="p-4 border-b border-gray-50 flex justify-between items-center">
                        <h4 className="font-bold text-[#3d3522]">การแจ้งเตือน</h4>
                        <span className="text-[10px] font-bold text-[#C6E065] bg-[#C6E065]/10 px-2 py-1 rounded-full">
                            ใหม่ 2
                        </span>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        <div className="p-4 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50">
                            <p className="text-xs font-bold text-[#3d3522] mb-1">ยินดีต้อนรับสู่ WellMate!</p>
                            <p className="text-[10px] text-gray-500">เริ่มเส้นทางสุขภาพของคุณได้แล้ววันนี้</p>
                            <p className="text-[9px] text-[#C6E065] font-bold mt-2">เมื่อ 5 นาทีที่แล้ว</p>
                        </div>
                        <div className="p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                            <p className="text-xs font-bold text-[#3d3522] mb-1">นัดหมายใหม่</p>
                            <p className="text-[10px] text-gray-500">คุณมีนัดหมายกับนักโภชนาการในวันพรุ่งนี้</p>
                            <p className="text-[9px] text-[#C6E065] font-bold mt-2">เมื่อ 1 ชม.ที่แล้ว</p>
                        </div>
                    </div>
                    <button className="w-full py-3 text-[10px] font-bold text-[#8a7550] hover:bg-gray-50 bg-gray-50/50 transition-colors">
                        ดูทั้งหมด
                    </button>
                </div>
            )}
        </div>
    );
}
