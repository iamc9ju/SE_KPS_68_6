"use client";

import React from "react";

export default function ChatPage() {
    return (
        <main className="flex-1 overflow-y-auto px-8 py-10 z-10 custom-scrollbar ml-64">
            <header className="mb-10 animate-fadeIn">
                <h1 className="text-4xl font-black mb-2 text-[#3d3522]">ข้อความ</h1>
                <p className="text-[#8a7550] font-medium text-lg">พูดคุยและปรึกษากับผู้เชี่ยวชาญได้โดยตรง</p>
            </header>

            <div className="bg-white p-8 rounded-[40px] shadow-[0_2px_40px_rgba(0,0,0,0.02)] border border-[#f0e6cc] animate-slideUp">
                <p className="text-[#3d3522] font-bold">กำลังพัฒนาในส่วนนี้...</p>
            </div>
        </main>
    );
}
