"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
    HeartPulse, Calendar as CalendarIcon, MessageSquare, Utensils,
    BookOpen, LineChart, Search, Phone, Video, Paperclip, CheckCheck,
    Check, Send, LogOut, LayoutGrid, Bell, SlidersHorizontal,
    MoreVertical, Smile, ArrowLeft, X, Star, MapPin, GraduationCap,
    ExternalLink, ChevronLeft, ChevronRight, ImageIcon, ZoomIn,
    Download, Printer, BellOff, Trash2, Ban, UserCircle,
    Link as LinkIcon, Flame, Zap, TrendingUp,
} from "lucide-react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
    id: number;
    text?: string;
    imageUrl?: string;
    time: string;
    isDoc: boolean;
    read: boolean;
    streaming?: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const DR_AVATAR = "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?q=80&w=300&auto=format&fit=crop";
const USER_AVATAR = "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=300&auto=format&fit=crop";

const GALLERY_IMAGES = [
    "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1543353071-873f17a7a088?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&auto=format&fit=crop",
];

const DOC_REPLIES = [
    "เข้าใจแล้วครับ ขอบคุณที่แจ้งมานะครับ 😊",
    "โอเคเลยครับ! จะปรับแผนให้เหมาะสมขึ้นครับ ไม่มีปัญหาครับ",
    "ดีมากครับ! ความคืบหน้าดีขึ้นเรื่อยๆ เลยนะครับ 💪",
    "น่าสนใจมากครับ มีข้อมูลเพิ่มเติมไหมครับ? อยากทราบรายละเอียดเพิ่มเติมครับ",
    "ขอบคุณที่แชร์ข้อมูลครับ จะนำไปพิจารณาให้ครับ 👍",
    "ได้เลยครับ! ปรับได้ตามที่ถามเลยครับ ✅",
    "เยี่ยมมากครับ! ทำแบบนี้ต่อไปเลยนะครับ สุขภาพดีแน่นอนครับ 🌟",
];

const DOC_IMAGE_REPLIES = [
    "ขอบคุณสำหรับรูปครับ! ดูอาหารน่ากินมากเลย 😋",
    "รูปสวยมากครับ! ดูเหมือนมื้ออาหารที่ดีต่อสุขภาพมากเลยครับ",
    "เยี่ยมเลยครับ! อาหารนี้ตรงตามแผนที่วางไว้เลยครับ 👍",
    "ดีมากเลยครับ! ขอบคุณที่บันทึกมื้ออาหารมาให้ดูด้วยนะครับ",
];

const EMOJIS = ["😀", "😅", "😂", "🥰", "😎", "🥺", "😡", "👍", "🙏", "💪", "🥗", "🍗", "🍎", "🔥", "💯", "✨", "🎉", "💤", "💊", "🏥"];

const nowTime = () =>
    new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });

const initialMessages: Message[] = [
    { id: 1, text: "สวัสดีครับ ธนพัฒน์ ผมได้อัปเดตแผนมื้ออาหารสำหรับสัปดาห์หน้าแล้วนะครับ ลองดูแล้วบอกผมได้เลยว่าโอเคไหม!", time: "09:40", isDoc: true, read: true },
    { id: 2, text: "ขอบคุณมากครับหมอ! สังเกตว่ามีเนื้อไก่เพิ่มขึ้นเยอะเลย เป็นเพราะต้องการสร้างกล้ามเนื้อเหรอครับ?", time: "09:47", isDoc: false, read: true },
    { id: 3, text: "ถูกต้องเลยครับ! 💪 เพิ่มโปรตีนเพื่อสนับสนุนเป้าหมาย hypertrophy ของคุณโดยเฉพาะเลยครับ", time: "09:48", isDoc: true, read: true },
    { id: 4, imageUrl: GALLERY_IMAGES[0], time: "10:00", isDoc: true, read: true },
    { id: 5, text: "นี่คือตัวอย่างมื้ออาหารของวันจันทร์ครับ 🥗 สดใหม่ครอบครัวครับ", time: "10:01", isDoc: true, read: true },
    { id: 6, text: "โห ดูอร่อยมากเลยครับหมอ! จะลองทำดูครับ 😋", time: "10:15", isDoc: false, read: true },
    { id: 7, text: "สวัสดีครับคุณหมอ พรุ่งนี้มื้อเที่ยงผมขอเปลี่ยนจากไก่ย่างเป็นปลาได้ไหมครับ? รู้สึกเริ่มเบื่อไก่แล้วครับ", time: "20:30", isDoc: false, read: true },
    { id: 8, text: "ได้เลยครับ! แค่ย่างหรือนึ่งก็พอนะครับ เพื่อคุมแคลอรี่ให้อยู่ในเกณฑ์ครับ 🐟", time: "20:45", isDoc: true, read: true },
];

// ─── Image Lightbox ───────────────────────────────────────────────────────────
const Lightbox = ({ images, startIndex, onClose }: { images: string[]; startIndex: number; onClose: () => void }) => {
    const [current, setCurrent] = useState(startIndex);

    const prev = useCallback(() => setCurrent((i) => (i - 1 + images.length) % images.length), [images.length]);
    const next = useCallback(() => setCurrent((i) => (i + 1) % images.length), [images.length]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowLeft") prev();
            if (e.key === "ArrowRight") next();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose, prev, next]);

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm" onClick={onClose}>
            {/* Close */}
            <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10">
                <X size={20} />
            </button>
            {/* Counter */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/70 text-sm font-medium">
                {current + 1} / {images.length}
            </div>
            {/* Arrows */}
            {images.length > 1 && (
                <>
                    <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors z-10">
                        <ChevronLeft size={22} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors z-10">
                        <ChevronRight size={22} />
                    </button>
                </>
            )}
            {/* Image */}
            <img
                src={images[current]}
                alt=""
                onClick={(e) => e.stopPropagation()}
                className="max-w-[90vw] max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            />
            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((src, i) => (
                        <button
                            key={i}
                            onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                            className={`w-10 h-10 rounded-lg overflow-hidden border-2 transition-all ${i === current ? "border-white scale-110" : "border-transparent opacity-60 hover:opacity-90"}`}
                        >
                            <img src={src} alt="" className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

// ─── Subcomponents ────────────────────────────────────────────────────────────
function NavItem({ icon, label, active = false, href, onClick }: { icon: React.ReactNode, label: string, active?: boolean, href?: string, onClick?: () => void }) {
    const content = (
        <div onClick={onClick} className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors ${active ? "bg-[#c1eb7c] font-medium text-zinc-800 shadow-sm" : "text-zinc-500 hover:bg-zinc-50"}`}>
            {icon}
            <span className="text-[14px]">{label}</span>
        </div>
    );
    return href ? <Link href={href} className="block">{content}</Link> : content;
}

const DateDivider = ({ label }: { label: string }) => (
    <div className="flex items-center gap-3 my-1">
        <div className="flex-1 h-px bg-gray-200/70" />
        <span className="text-[11px] font-semibold text-gray-400 px-3 py-0.5 bg-white rounded-full border border-gray-200/80 whitespace-nowrap">{label}</span>
        <div className="flex-1 h-px bg-gray-200/70" />
    </div>
);

const ChatBubble = ({ msg, onImageClick }: { msg: Message; onImageClick?: (url: string) => void }) => {
    const isImage = !!msg.imageUrl;
    return (
        <div className={`flex items-end gap-2.5 ${msg.isDoc ? "justify-start" : "justify-end"}`}>
            {msg.isDoc && (
                <img src={DR_AVATAR} alt="Dr" className="w-8 h-8 rounded-full object-cover flex-shrink-0 mb-1 shadow ring-2 ring-white" />
            )}
            <div className={`flex flex-col max-w-[68%] ${msg.isDoc ? "items-start" : "items-end"}`}>
                {isImage ? (
                    <div
                        className={`relative rounded-2xl overflow-hidden shadow-sm cursor-pointer group ${msg.isDoc ? "rounded-bl-sm" : "rounded-br-sm"}`}
                        style={{ maxWidth: 220 }}
                        onClick={() => onImageClick?.(msg.imageUrl!)}
                    >
                        <img src={msg.imageUrl} alt="" className="w-full h-auto object-cover group-hover:brightness-90 transition-all duration-200" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center">
                                <ZoomIn size={18} className="text-white" />
                            </div>
                        </div>
                        <div className="font-bold text-xl tracking-tight uppercase text-[#3A3A3A]">Wellmate</div>
                    </div>
                ) : (
                    <div className={`px-4 py-3 text-[14px] leading-relaxed shadow-sm ${msg.isDoc
                        ? "bg-white text-gray-700 rounded-2xl rounded-bl-sm"
                        : "bg-[#C5F285] text-gray-800 rounded-2xl rounded-br-sm"}`}>
                        {msg.streaming ? (
                            <span>
                                {msg.text}
                                <span className="inline-block w-0.5 h-4 bg-gray-400 ml-0.5 animate-pulse align-middle" />
                            </span>
                        ) : msg.text}
                    </div>
                )}
                <div className="flex items-center mt-1 gap-1">
                    <span className="text-[11px] font-medium text-gray-400">{msg.time}</span>
                    {!msg.isDoc && msg.read && <CheckCheck size={13} className="text-[#87D039]" />}
                    {!msg.isDoc && !msg.read && <Check size={13} className="text-gray-400" />}
                </div>
            </div>
            {!msg.isDoc && (
                <img src={USER_AVATAR} alt="Me" className="w-8 h-8 rounded-full object-cover flex-shrink-0 mb-1 shadow ring-2 ring-white" />
            )}
        </div>
    );
};

// ─── Document Viewer Modal ───────────────────────────────────────────────────
const DOC_CONTENTS: Record<string, { pages: string[]; size: string; date: string }> = {
    "แผนมื้ออาหาร (สัปดาห์ที่ 1).pdf": {
        size: "2.5 MB", date: "19 มี.ค. 2569",
        pages: [
            "แผนมื้ออาหารประจำสัปดาห์",
            "วันจันทร์: ข้าวกล้อง + ไก่ย่าง + สลัดผัก",
            "วันอังคาร: โอ๊ตมีล + ไข่ลวก + ผลไม้สด",
            "วันพุธ: ข้าวไรซ์เบอร์รี่ + ปลานึ่ง + ผักต้ม",
            "วันพฤหัสฯ: สลัดไก่ + ขนมปังโฮลวีต",
            "แนะนำดื่มน้ำ 8 แก้วต่อวัน ✅",
        ],
    },
    "รายงานความคืบหน้า.pdf": {
        size: "1.2 MB", date: "20 มี.ค. 2569",
        pages: [
            "รายงานความคืบหน้าด้านสุขภาพ",
            "น้ำหนักเริ่มต้น: 78 กก. → ปัจจุบัน: 75.5 กก.",
            "ดัชนีมวลกาย (BMI): 24.8 → 23.4",
            "ไขมันในร่างกาย: 22% → 20%",
            "สมรรถภาพ: ดีขึ้น 18%",
            "ประเมินครั้งต่อไป: 5 เม.ย. 2569",
        ],
    },
};

const DocViewerModal = ({ name, onClose }: { name: string; onClose: () => void }) => {
    const doc = DOC_CONTENTS[name];
    if (!doc) return null;
    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
                {/* toolbar */}
                <div className="flex items-center justify-between px-5 py-3.5 bg-[#87D039]">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                            <span className="text-[9px] font-black text-white">PDF</span>
                        </div>
                        <div>
                            <p className="text-white font-bold text-[13px] leading-tight truncate max-w-[220px]">{name}</p>
                            <p className="text-white/70 text-[11px]">{doc.size} · {doc.date}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <button className="w-8 h-8 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors" title="ดาวน์โหลด">
                            <Download size={15} />
                        </button>
                        <button className="w-8 h-8 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors" title="พิมพ์">
                            <Printer size={15} />
                        </button>
                        <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors ml-1">
                            <X size={15} />
                        </button>
                    </div>
                </div>
                {/* page counter */}
                <div className="bg-gray-50 border-b border-gray-100 px-5 py-2 flex items-center justify-between">
                    <span className="text-[12px] text-gray-500 font-medium">1 / 1 หน้า</span>
                    <div className="flex items-center gap-1">
                        <button className="w-6 h-6 rounded bg-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-300 transition-colors"><ChevronLeft size={13} /></button>
                        <button className="w-6 h-6 rounded bg-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-300 transition-colors"><ChevronRight size={13} /></button>
                    </div>
                </div>
                {/* document body  */}
                <div className="p-6 bg-white">
                    <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                        <div className="bg-gray-50 px-5 py-4 border-b border-gray-100 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#f0fde4] flex items-center justify-center flex-shrink-0">
                                <span className="text-[10px] font-black text-[#87D039]">PDF</span>
                            </div>
                            <div>
                                <p className="font-bold text-gray-800 text-[14px]">{doc.pages[0]}</p>
                                <p className="text-[11px] text-gray-400">WellMate · {doc.date}</p>
                            </div>
                        </div>
                        <div className="px-5 py-4 space-y-2.5">
                            {doc.pages.slice(1).map((line, i) => (
                                <div key={i} className="flex items-start gap-2.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#87D039] mt-1.5 flex-shrink-0" />
                                    <p className="text-[13px] text-gray-700 leading-relaxed">{line}</p>
                                </div>
                            ))}
                        </div>
                        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
                            <p className="text-[11px] text-gray-400 text-center">เอกสารนี้จัดทำโดย Dr. Thananrada · WellMate</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── More Menu Dropdown ──────────────────────────────────────────────────────
const MoreMenu = ({ onClose, onClearChat, onViewProfile, isMuted, onToggleMute, onSearchClick }: { onClose: () => void; onClearChat: () => void; onViewProfile: () => void; isMuted: boolean; onToggleMute: () => void; onSearchClick: () => void }) => {
    const menuRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handler = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) onClose(); };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [onClose]);

    const items = [
        { icon: <UserCircle size={16} />, label: "ดูโปรไฟล์", onClick: () => { onViewProfile(); onClose(); } },
        { icon: <Search size={16} />, label: "ค้นหาในแชท", onClick: () => { onSearchClick(); onClose(); } },
        { icon: isMuted ? <Bell size={16} /> : <BellOff size={16} />, label: isMuted ? "เปิดเสียงแจ้งเตือน" : "ปิดเสียงแจ้งเตือน", onClick: () => { onToggleMute(); onClose(); } },
        { icon: <Trash2 size={16} />, label: "ล้างการสนทนา", danger: true, onClick: () => { onClearChat(); onClose(); } },
        { icon: <Ban size={16} />, label: "บล็อกผู้ใช้", danger: true, onClick: onClose },
    ];

    return (
        <div ref={menuRef} className="absolute top-14 right-4 z-50 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden py-1" style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>
            {items.map((item, i) => (
                <button
                    key={i}
                    onClick={item.onClick}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium transition-colors text-left ${(item as any).danger
                        ? "text-red-500 hover:bg-red-50"
                        : "text-gray-700 hover:bg-gray-50"
                        }`}
                >
                    <span className={(item as any).danger ? "text-red-400" : "text-gray-400"}>{item.icon}</span>
                    {item.label}
                </button>
            ))}
        </div>
    );
};

// ─── Profile Panel ────────────────────────────────────────────────────────────
const ProfilePanel = ({ onClose, onOpenGallery, onOpenDoc }: { onClose: () => void; onOpenGallery: (idx: number) => void; onOpenDoc: (name: string) => void }) => (
    <div className="w-[290px] flex-shrink-0 border-l border-gray-100 bg-white flex flex-col overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800">โปรไฟล์</h3>
            <button onClick={onClose} className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors">
                <X size={14} />
            </button>
        </div>
        <div className="flex flex-col items-center pt-7 pb-5 px-5 bg-gradient-to-b from-[#f0fde4] to-white">
            <div className="relative mb-4">
                <img src={DR_AVATAR} alt="Dr.Thananrada" className="w-24 h-24 rounded-full object-cover shadow-lg ring-4 ring-white" />
                <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
            </div>
            <h3 className="font-bold text-[18px] text-gray-800">Dr. Thananrada</h3>
            <span className="mt-2 px-3 py-1 bg-[#E4F4D3] text-[#4a9e1b] text-[11px] font-bold rounded-lg uppercase tracking-wide">นักโภชนาการส่วนบุคคล</span>
            <div className="flex items-center gap-1 mt-2.5 text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} size={13} fill="currentColor" />)}
                <span className="text-[12px] text-gray-500 font-medium ml-1">5.0 (142)</span>
            </div>
        </div>
        <div className="px-5 pb-6 space-y-4">
            <p className="text-[13px] text-gray-600 leading-relaxed">
                ผู้เชี่ยวชาญด้านโภชนาการเฉพาะบุคคล เน้นสร้างกล้ามเนื้อ และการจัดการน้ำหนัก เชื่อว่าการกินดีต้องยั่งยืน เรียบง่าย และอร่อย
            </p>
            <hr className="border-gray-100" />
            <div className="space-y-3">
                <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-[#f0fde4] flex items-center justify-center flex-shrink-0">
                        <GraduationCap size={14} className="text-[#87D039]" />
                    </div>
                    <div>
                        <p className="text-[11px] text-gray-400 font-medium">การศึกษา</p>
                        <p className="text-[13px] text-gray-700 font-semibold">ป.โท โภชนศาสตร์คลินิก มหิดล</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-[#f0fde4] flex items-center justify-center flex-shrink-0">
                        <MapPin size={14} className="text-[#87D039]" />
                    </div>
                    <div>
                        <p className="text-[11px] text-gray-400 font-medium">สถานที่</p>
                        <p className="text-[13px] text-gray-700 font-semibold">กรุงเทพมหานคร, ไทย</p>
                    </div>
                </div>
            </div>
            <hr className="border-gray-100" />
            {/* Gallery */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">รูปภาพ ({GALLERY_IMAGES.length})</p>
                    <button onClick={() => onOpenGallery(0)} className="text-[11px] text-[#87D039] font-semibold hover:underline">ดูทั้งหมด</button>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                    {GALLERY_IMAGES.slice(0, 6).map((src, i) => (
                        <button key={i} onClick={() => onOpenGallery(i)} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group">
                            <img src={src} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                            {i === 5 && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">+{GALLERY_IMAGES.length - 5}</span>
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>
            <hr className="border-gray-100" />
            <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">เอกสาร (2)</p>
                <div className="space-y-2">
                    {["แผนมื้ออาหาร (สัปดาห์ที่ 1).pdf", "รายงานความคืบหน้า.pdf"].map((name, i) => (
                        <button key={i} onClick={() => onOpenDoc(name)} className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 hover:bg-[#f0fde4] transition-colors cursor-pointer group text-left">
                            <div className="w-8 h-8 rounded-lg bg-[#87D039] flex items-center justify-center flex-shrink-0">
                                <span className="text-[8px] font-black text-white">PDF</span>
                            </div>
                            <p className="flex-1 text-[12px] font-semibold text-gray-700 truncate">{name}</p>
                            <ExternalLink size={13} className="text-gray-300 group-hover:text-[#87D039] flex-shrink-0" />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Messages() {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [lightboxImages, setLightboxImages] = useState<string[] | null>(null);
    const [lightboxStart, setLightboxStart] = useState(0);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [openDoc, setOpenDoc] = useState<string | null>(null);
    const [showMenu, setShowMenu] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const bottomRef = useRef<HTMLDivElement>(null);
    const fileRef = useRef<HTMLInputElement>(null);
    const emojiRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    useEffect(() => {
        const handler = (e: MouseEvent | TouchEvent) => {
            if (emojiRef.current && !emojiRef.current.contains(e.target as Node) && !(e.target as Element).closest('#emoji-toggle-btn')) {
                setShowEmojiPicker(false);
            }
        };
        document.addEventListener("mousedown", handler);
        document.addEventListener("touchstart", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
            document.removeEventListener("touchstart", handler);
        };
    }, []);

    // Streaming reply effect
    const streamReply = (fullText: string) => {
        const words = fullText.split(" ");
        const msgId = Date.now() + 1;
        setMessages((prev) => [...prev, { id: msgId, text: "", time: nowTime(), isDoc: true, read: true, streaming: true }]);
        let i = 0;
        const interval = setInterval(() => {
            i++;
            setMessages((prev) => prev.map((m) => m.id === msgId
                ? { ...m, text: words.slice(0, i).join(" "), streaming: i < words.length }
                : m
            ));
            if (i >= words.length) clearInterval(interval);
        }, 80);
    };

    const sendText = () => {
        const text = input.trim();
        if (!text) return;
        const userMsg: Message = { id: Date.now(), text, time: nowTime(), isDoc: false, read: false };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setTimeout(() => setMessages((prev) => prev.map((m) => m.id === userMsg.id ? { ...m, read: true } : m)), 900);
        setIsTyping(true);
        const delay = 1200 + Math.random() * 800;
        setTimeout(() => {
            setIsTyping(false);
            streamReply(DOC_REPLIES[Math.floor(Math.random() * DOC_REPLIES.length)]);
        }, delay);
    };

    const sendImage = (src: string) => {
        const userMsg: Message = { id: Date.now(), imageUrl: src, time: nowTime(), isDoc: false, read: false };
        setMessages((prev) => [...prev, userMsg]);
        setImagePreview(null);
        setTimeout(() => setMessages((prev) => prev.map((m) => m.id === userMsg.id ? { ...m, read: true } : m)), 900);
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            streamReply(DOC_IMAGE_REPLIES[Math.floor(Math.random() * DOC_IMAGE_REPLIES.length)]);
        }, 1500);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        setImagePreview(url);
        e.target.value = "";
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendText(); }
    };

    const openGallery = (idx: number) => { setLightboxImages(GALLERY_IMAGES); setLightboxStart(idx); };
    const openSingleImage = (url: string) => { setLightboxImages([url]); setLightboxStart(0); };
    const clearChat = () => setMessages([]);

    const lastMsg = messages[messages.length - 1];

    return (
        <div className="flex h-screen w-full bg-white overflow-hidden text-[#434343] font-sans">

            {/* Lightbox */}
            {lightboxImages && (
                <Lightbox images={lightboxImages} startIndex={lightboxStart} onClose={() => setLightboxImages(null)} />
            )}

            {/* Document viewer */}
            {openDoc && <DocViewerModal name={openDoc} onClose={() => setOpenDoc(null)} />}

            {/* Image send confirm */}
            {imagePreview && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-sm w-full mx-4">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                            <p className="font-bold text-gray-800">ส่งรูปภาพ</p>
                            <button onClick={() => setImagePreview(null)} className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500">
                                <X size={14} />
                            </button>
                        </div>
                        <div className="p-5">
                            <img src={imagePreview} alt="" className="w-full rounded-2xl object-contain max-h-64" />
                        </div>
                        <div className="flex gap-3 px-5 pb-5">
                            <button onClick={() => setImagePreview(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">ยกเลิก</button>
                            <button onClick={() => sendImage(imagePreview)} className="flex-1 py-2.5 rounded-xl bg-[#87D039] hover:bg-[#6fba2c] text-white text-sm font-bold transition-colors">ส่ง</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Sidebar ────────────────────────────────────────────── */}
            <div className="w-[240px] flex-shrink-0 border-r border-gray-100 flex flex-col py-6 bg-white hidden lg:flex">
                <div className="px-7 mb-7">
                    <div className="flex items-center gap-2">
                        <div className="text-[#8CC63F] font-black italic text-2xl tracking-tighter">
                            W<span className="text-[#F7931E]">M</span>
                        </div>
                        <span className="font-bold text-[#3A3A3A] text-[17px] uppercase tracking-tight">WELLMATE</span>
                    </div>
                </div>
                <nav className="flex-1 px-3 space-y-0.5 mt-2">
                    <NavItem icon={<LayoutGrid size={20} />} label="แดชบอร์ด" href="/dashboard" />
                    <NavItem icon={<HeartPulse size={20} />} label="บริการโภชนาการ" href="/approval" />
                    <NavItem icon={<CalendarIcon size={20} />} label="ปฏิทิน" href="/calendar" />
                    <NavItem icon={<MessageSquare size={20} />} label="ข้อความ" active href="/messages" />
                    <NavItem icon={<Utensils size={20} />} label="เมนูสุขภาพ" onClick={() => alert("ฟีเจอร์เมนูสุขภาพกำลังมา!")} />
                    <NavItem icon={<BookOpen size={20} />} label="แผนอาหาร" onClick={() => alert("ฟีเจอร์แผนการกินกำลังมา!")} />
                    <NavItem icon={<BookOpen size={20} />} label="บันทึกอาหาร" href="/tracking" />
                    <NavItem icon={<TrendingUp size={20} />} label="ติดตามผล" href="/progress" />
                </nav>
                <div className="px-5 mt-auto">
                    <div className="bg-[#D8F08F] rounded-2xl p-4 text-center mb-4">
                        <p className="font-medium text-[12px] text-gray-700 mb-0.5">เริ่มต้นเส้นทางสุขภาพไปกับ</p>
                        <p className="font-black text-[16px] mb-0.5">ใช้งานฟรี 1 เดือน</p>
                        <p className="text-[11px] text-gray-600 mb-3">เข้าถึงฟีเจอร์ของ WELLMATE</p>
                        <button onClick={() => alert("กำลังไปยังหน้าสมัครสมาชิก...")} className="bg-black text-white text-[11px] font-bold py-2 px-5 rounded-full hover:bg-gray-800 transition-colors w-full">สมัครสมาชิกเลย!</button>
                    </div>
                    <button onClick={() => alert("กำลังออกจากระบบ...")} className="flex items-center justify-center w-full gap-2 py-3 bg-[#F6EFE9] hover:bg-[#EBE2D9] rounded-xl transition-colors text-[#5f5f5f] font-semibold text-sm">
                        <LogOut size={16} /><span>ออกจากระบบ</span>
                    </button>
                </div>
            </div>

            {/* ── Conversation List ───────────────────────────────────── */}
            <div className="w-[270px] flex-shrink-0 flex flex-col border-r border-gray-100 bg-white hidden md:flex">
                <div className="px-4 py-4 border-b border-gray-100/80">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-800">ข้อความ</h2>
                        <button className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors">
                            <Bell size={15} />
                        </button>
                    </div>
                    <div className="relative flex items-center">
                        <Search size={14} className="absolute left-3.5 text-gray-400 pointer-events-none" />
                        <input type="text" placeholder="ค้นหา..." className="w-full bg-gray-50 text-[13px] text-gray-600 rounded-full py-2.5 pl-9 pr-9 focus:outline-none focus:ring-2 focus:ring-[#87D039]/30 placeholder-gray-400" />
                        <button className="absolute right-2.5 text-gray-400 hover:text-gray-600 transition-colors">
                            <SlidersHorizontal size={13} />
                        </button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto px-3 py-3">
                    <div className="relative p-3 flex items-start gap-3 rounded-2xl bg-[#f0fde4] cursor-pointer">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-[55%] bg-[#87D039] rounded-r-full" />
                        <div className="relative w-11 h-11 rounded-full overflow-hidden flex-shrink-0 shadow-sm">
                            <img src={DR_AVATAR} alt="Dr." className="w-full h-full object-cover" />
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-0.5">
                                <p className="font-bold text-[13px] text-gray-800">Dr.Thananrada</p>
                                <p className="text-[10px] text-gray-500 font-semibold">{lastMsg?.time}</p>
                            </div>
                            <p className="text-[11px] text-[#5AAA1D] font-semibold mb-0.5">นักโภชนาการ</p>
                            <p className="text-[12px] text-gray-500 truncate">
                                {lastMsg?.imageUrl ? "📷 รูปภาพ" : lastMsg?.text}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-3">
                    <img src={USER_AVATAR} alt="Me" className="w-9 h-9 rounded-full object-cover ring-2 ring-[#87D039]" />
                    <div className="flex-1 min-w-0">
                        <p className="font-bold text-[13px] text-gray-800 truncate">ธนพัฒน์ สุขใจ</p>
                        <p className="text-[11px] text-gray-400">สมาชิก</p>
                    </div>
                </div>
            </div>

            {/* ── Chat Window ─────────────────────────────────────────── */}
            <div className="flex-1 flex flex-col bg-[#F8F9FA] min-w-0 relative">
                {/* Top bar */}
                <div className="flex items-center justify-between px-5 py-3 bg-white border-b border-gray-100 shadow-sm z-10">
                    <div className="flex items-center gap-2">
                        <button className="md:hidden w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500">
                            <ArrowLeft size={18} />
                        </button>
                        <button onClick={() => setShowProfile((p) => !p)} className="flex items-center gap-3 rounded-2xl px-3 py-1.5 hover:bg-gray-50 transition-colors group">
                            <div className="relative w-10 h-10 rounded-full overflow-hidden shadow-sm">
                                <img src={DR_AVATAR} alt="Dr" className="w-full h-full object-cover" />
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-[15px] text-gray-800 group-hover:text-[#4a9e1b] transition-colors">Dr. Thananrada</p>
                                {isTyping
                                    ? <p className="text-[12px] text-[#87D039] font-medium animate-pulse">กำลังพิมพ์...</p>
                                    : <p className="text-[12px] text-gray-400">ออนไลน์อยู่ · แตะดูโปรไฟล์</p>}
                            </div>
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="w-9 h-9 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors"><Phone size={17} /></button>
                        <button className="w-9 h-9 rounded-[10px] bg-[#87D039] hover:bg-[#6fba2c] flex items-center justify-center text-white transition-colors shadow-sm"><Video size={17} /></button>
                        <button
                            onClick={() => setShowMenu((v) => !v)}
                            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${showMenu ? "bg-gray-200 text-gray-700" : "bg-gray-50 hover:bg-gray-100 text-gray-500"}`}
                        >
                            <MoreVertical size={17} />
                        </button>
                    </div>
                </div>
                {showMenu && <MoreMenu onClose={() => setShowMenu(false)} onClearChat={clearChat} onViewProfile={() => setShowProfile(true)} isMuted={isMuted} onToggleMute={() => setIsMuted(prev => !prev)} onSearchClick={() => setShowSearch(true)} />}

                {showSearch && (
                    <div className="px-5 py-2.5 bg-white border-b border-gray-100 flex items-center justify-between gap-3 shadow-sm z-10 relative">
                        <div className="flex-1 flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200">
                            <Search size={15} className="text-gray-400" />
                            <input
                                autoFocus
                                type="text"
                                placeholder="ค้นหาข้อความ..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="flex-1 bg-transparent text-[13px] outline-none text-gray-700 placeholder-gray-400 min-w-0"
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery("")} className="text-gray-400 hover:text-gray-600 outline-none">
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                        <button onClick={() => { setShowSearch(false); setSearchQuery(""); }} className="text-[13px] font-semibold text-gray-500 hover:text-gray-700">สำเร็จ</button>
                    </div>
                )}

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-5 py-5 space-y-3.5">
                    {messages.slice(0, 5).filter(m => !searchQuery || (m.text && m.text.toLowerCase().includes(searchQuery.toLowerCase()))).length > 0 && (
                        <DateDivider label="เมื่อวาน · 20 มี.ค. 2569" />
                    )}
                    {messages.slice(0, 5).filter(m => !searchQuery || (m.text && m.text.toLowerCase().includes(searchQuery.toLowerCase()))).map((msg) => (
                        <ChatBubble key={msg.id} msg={msg} onImageClick={openSingleImage} />
                    ))}
                    {messages.slice(5).filter(m => !searchQuery || (m.text && m.text.toLowerCase().includes(searchQuery.toLowerCase()))).length > 0 && (
                        <DateDivider label="วันนี้ · 21 มี.ค. 2569" />
                    )}
                    {messages.slice(5).filter(m => !searchQuery || (m.text && m.text.toLowerCase().includes(searchQuery.toLowerCase()))).map((msg) => (
                        <ChatBubble key={msg.id} msg={msg} onImageClick={openSingleImage} />
                    ))}
                    {isTyping && !searchQuery && (
                        <div className="flex items-end gap-2.5">
                            <img src={DR_AVATAR} alt="Dr" className="w-8 h-8 rounded-full object-cover flex-shrink-0 mb-1 shadow ring-2 ring-white" />
                            <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3.5 shadow-sm flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "0ms" }} />
                                <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "150ms" }} />
                                <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>

                {/* Input */}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                <div className="px-4 py-3 bg-white border-t border-gray-100 relative">
                    {/* Emoji Picker */}
                    {showEmojiPicker && (
                        <div ref={emojiRef} className="absolute bottom-16 left-4 z-50 bg-white rounded-2xl shadow-xl border border-gray-100 p-3 grid grid-cols-5 gap-2 w-64" style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>
                            {EMOJIS.map(emoji => (
                                <button key={emoji} onClick={() => { setInput(prev => prev + emoji); setShowEmojiPicker(false); }} className="text-2xl hover:bg-gray-100 rounded-lg p-1.5 transition-colors flex items-center justify-center">{emoji}</button>
                            ))}
                        </div>
                    )}
                    <div className="flex items-center gap-2 bg-gray-50 rounded-2xl px-4 py-2 border border-gray-200 focus-within:border-[#87D039]/50 focus-within:ring-2 focus-within:ring-[#87D039]/10 transition-all">
                        <button id="emoji-toggle-btn" onClick={() => setShowEmojiPicker(p => !p)} className={`transition-colors flex-shrink-0 p-1 ${showEmojiPicker ? "text-[#87D039]" : "text-gray-400 hover:text-[#87D039]"}`}>
                            <Smile size={19} />
                        </button>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="พิมพ์ข้อความ..."
                            className="flex-1 bg-transparent outline-none text-[14px] text-gray-700 placeholder-gray-400 py-1.5 min-w-0"
                        />
                        <button
                            onClick={() => fileRef.current?.click()}
                            title="ส่งรูปภาพ"
                            className="text-gray-400 hover:text-[#87D039] transition-colors flex-shrink-0 p-1"
                        >
                            <ImageIcon size={19} />
                        </button>
                        <button
                            onClick={sendText}
                            disabled={!input.trim()}
                            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 active:scale-95 disabled:opacity-35"
                            style={{ backgroundColor: input.trim() ? "#87D039" : "#e5e7eb" }}
                        >
                            <Send size={16} className={input.trim() ? "text-white" : "text-gray-400"} />
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Profile Panel ────────────────────────────────────────── */}
            {showProfile && <ProfilePanel onClose={() => setShowProfile(false)} onOpenGallery={openGallery} onOpenDoc={(name) => setOpenDoc(name)} />}
        </div>
    );
}
