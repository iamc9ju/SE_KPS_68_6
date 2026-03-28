"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
    Search, Phone, Video, Paperclip, CheckCheck,
    Check, Send, Bell, MoreVertical, Smile, X, Star,
    ExternalLink, ChevronLeft, ChevronRight, ImageIcon, ZoomIn,
    Download, Printer, BellOff, Trash2, Ban, UserCircle,
    Clock, LogOut, Info,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useChatWebSocket } from "@/hooks/useChatWebSocket";
import api from "@/lib/api";
import { format } from "date-fns";
import { th } from "date-fns/locale";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
    id: string;
    text: string;
    time: string;
    isDoc: boolean; // isDoc here means "is from the other person" in the original mock's logic (confusing name, but keeping for UI compatibility)
    read: boolean;
    type: "text" | "image" | "file";
    status?: "sending" | "sent" | "error";
    avatarUrl?: string;
}

interface ChatRoom {
    chatRoomId: string;
    appointment: {
        appointmentId: string;
        startTime: string;
        endTime: string;
        summary?: string;
        nutritionistNotes?: string;
        patient: { firstName: string; lastName: string; user: { profileImageUrl: string } };
        nutritionist: { firstName: string; lastName: string; user: { profileImageUrl: string } };
    };
    chatMessages: any[];
}

// ─── Constants ────────────────────────────────────────────────────────────────
const DEFAULT_AVATAR = "/images/default-avatar.png";

const GALLERY_IMAGES = [
    "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1543353071-873f17a7a088?w=800&auto=format&fit=crop",
];

const EMOJIS = ["😀", "😅", "😂", "🥰", "😎", "🥺", "😡", "👍", "🙏", "💪", "🥗", "🍗", "🍎", "🔥", "💯", "✨", "🎉", "💤", "💊", "🏥"];

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
            <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10">
                <X size={20} />
            </button>
            <img src={images[current]} alt="" onClick={(e) => e.stopPropagation()} className="max-w-[90vw] max-h-[85vh] object-contain rounded-2xl shadow-2xl" />
        </div>
    );
};

// ─── Subcomponents ────────────────────────────────────────────────────────────
const DateDivider = ({ label }: { label: string }) => (
    <div className="flex items-center gap-3 my-1">
        <div className="flex-1 h-px bg-gray-200/70" />
        <span className="text-[11px] font-semibold text-gray-400 px-3 py-0.5 bg-white rounded-full border border-gray-200/80 whitespace-nowrap">{label}</span>
        <div className="flex-1 h-px bg-gray-200/70" />
    </div>
);

const ChatBubble = ({ msg, onImageClick }: { msg: Message; onImageClick?: (url: string) => void }) => {
    const isImage = msg.type === "image";
    return (
        <div className={`flex items-end gap-2.5 ${msg.isDoc ? "justify-start" : "justify-end"}`}>
            {msg.isDoc && (
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 mb-1 shadow ring-2 ring-white bg-gray-200">
                    <img src={msg.avatarUrl || DEFAULT_AVATAR} alt="" className="w-full h-auto object-cover" />
                </div>
            )}
            <div className={`flex flex-col max-w-[68%] ${msg.isDoc ? "items-start" : "items-end"}`}>
                {isImage ? (
                    <div className={`relative rounded-2xl overflow-hidden shadow-sm cursor-pointer group ${msg.isDoc ? "rounded-bl-sm" : "rounded-br-sm"}`} style={{ maxWidth: 280 }} onClick={() => onImageClick?.(msg.text)}>
                        <img src={msg.text} alt="" className="w-full h-auto object-cover group-hover:brightness-90 transition-all duration-200" />
                    </div>
                ) : (
                    <div className={`px-4 py-3 text-[14px] leading-relaxed shadow-sm ${msg.isDoc ? "bg-white text-gray-700 rounded-2xl rounded-bl-sm" : "bg-[#C5F285] text-gray-800 rounded-2xl rounded-br-sm"} ${msg.status === "sending" ? "opacity-70" : ""}`}>
                        {msg.text}
                    </div>
                )}
                <div className="flex items-center mt-1 gap-1">
                    <span className="text-[11px] font-medium text-gray-400">{msg.time}</span>
                    {!msg.isDoc && (
                        <>
                            {msg.status === "sending" && <Star size={12} className="text-gray-300 animate-pulse" />}
                            {msg.status === "sent" && !msg.read && <Check size={13} className="text-[#87D039]" />}
                            {msg.read && <CheckCheck size={13} className="text-[#87D039]" />}
                            {msg.status === "error" && <X size={13} className="text-red-500" />}
                        </>
                    )}
                </div>
            </div>
            {!msg.isDoc && (
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 mb-1 shadow ring-2 ring-white bg-gray-200">
                    <img src={msg.avatarUrl || DEFAULT_AVATAR} alt="Me" className="w-full h-auto object-cover" />
                </div>
            )}
        </div>
    );
};

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ChatPage() {
    const user = useAuthStore((state) => state.user);
    const [rooms, setRooms] = useState<ChatRoom[]>([]);
    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [showProfile, setShowProfile] = useState(false);
    const [lightboxImages, setLightboxImages] = useState<string[] | null>(null);
    const [lightboxStart, setLightboxStart] = useState(0);
    const [showMenu, setShowMenu] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [debugMode, setDebugMode] = useState(false);

    const bottomRef = useRef<HTMLDivElement>(null);
    const emojiRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { sendMessage, markAsRead, onNewMessage, onMessagesRead, isConnected } = useChatWebSocket(selectedRoomId);

    // Fetch rooms
    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const res = await api.get("/chat/rooms");
                const roomsData = Array.isArray(res.data) ? res.data : (res.data?.data || []);
                setRooms(roomsData);
                if (roomsData.length > 0 && !selectedRoomId) {
                    setSelectedRoomId(roomsData[0].chatRoomId);
                }
            } catch (err) {
                console.error("Error fetching rooms:", err);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchRooms();
    }, [user, selectedRoomId]);

    // Fetch messages when room selected
    useEffect(() => {
        if (!selectedRoomId) return;
        const fetchMessages = async () => {
            try {
                const res = await api.get(`/chat/${selectedRoomId}/messages`);
                const rawMessages = Array.isArray(res.data) ? res.data : (res.data?.data || []);
                const mapped: Message[] = rawMessages.map((m: any) => ({
                    id: String(m.chatMessageId),
                    text: m.content,
                    time: format(new Date(m.createdAt), "HH:mm"),
                    isDoc: String(m.senderId) !== String(user?.userId),
                    read: m.isRead || false,
                    type: m.messageType || "text",
                    avatarUrl: m.sender?.profileImageUrl,
                })).reverse();
                setMessages(mapped);
            } catch (err) {
                console.error("Error fetching messages:", err);
            }
        };
        fetchMessages();
    }, [selectedRoomId, user?.userId]);

    // Handle new messages from socket
    useEffect(() => {
        const cleanup = onNewMessage((newMsg: any) => {
            console.log("📨 Received new_message:", newMsg);
            if (String(newMsg.chatRoomId) === String(selectedRoomId)) {
                console.log("✅ Message belongs to active room. Updating UI...");
                const mapped: Message = {
                    id: String(newMsg.chatMessageId),
                    text: newMsg.content,
                    time: format(new Date(newMsg.createdAt), "HH:mm"),
                    isDoc: String(newMsg.senderId) !== String(user?.userId),
                    read: true,
                    type: newMsg.messageType || "text",
                };
                setMessages((prev) => {
                    // 1. Avoid duplicates immediately (real ID check)
                    if (prev.some(m => String(m.id) === String(mapped.id))) {
                        console.log("🚫 Skipping duplicate message ID:", mapped.id);
                        return prev;
                    }
                    
                    // 2. Matching optimistic messages from self (by text/type)
                    if (!mapped.isDoc) {
                        const optIndex = prev.findIndex(m => 
                            (m.status === "sending" || m.id.startsWith("opt-")) && 
                            m.text === mapped.text && 
                            m.type === mapped.type
                        );
                        
                        if (optIndex !== -1) {
                            console.log("🔄 Synchronizing optimistic message with server version");
                            const next = [...prev];
                            next[optIndex] = { ...mapped, status: "sent" };
                            return next;
                        }
                    }
                    
                    return [...prev, mapped];
                });
            } else {
                console.log(`ℹ️ Message for room ${newMsg.chatRoomId} ignored (Current: ${selectedRoomId})`);
            }
        });
        return cleanup;
    }, [selectedRoomId, onNewMessage, user?.userId]);

    // Handle read receipts
    useEffect(() => {
        const cleanup = onMessagesRead((data: any) => {
            console.log("📖 Messages read in room:", data);
            if (String(data.chatRoomId) === String(selectedRoomId) && String(data.userId) !== String(user?.userId)) {
                console.log("✅ Other person read my messages. Updating UI...");
                setMessages((prev) => prev.map(m => (!m.isDoc ? { ...m, read: true } : m)));
            }
        });
        return cleanup;
    }, [selectedRoomId, onMessagesRead, user?.userId]);

    // Mark as read when entering room or receiving message
    useEffect(() => {
        if (selectedRoomId && isConnected) {
            markAsRead();
        }
    }, [selectedRoomId, isConnected, messages.length]); 

    // Auto scroll to bottom
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 30000);
        return () => clearInterval(timer);
    }, []);

    const activeRoom = useMemo(() => rooms.find(r => r.chatRoomId === selectedRoomId), [rooms, selectedRoomId]);
    
    const sessionStatus = useMemo(() => {
        if (!activeRoom) return "none";
        if (debugMode) return "active";
        const start = new Date(activeRoom.appointment.startTime);
        const end = new Date(activeRoom.appointment.endTime);
        if (currentTime < start) return "upcoming";
        if (currentTime > end) return "ended";
        return "active";
    }, [activeRoom, currentTime]);

    const otherParticipant = useMemo(() => {
        if (!activeRoom) return null;
        return user?.role === "patient" 
            ? activeRoom.appointment.nutritionist 
            : activeRoom.appointment.patient;
    }, [activeRoom, user]);

    const otherParticipantName = useMemo(() => {
        if (!otherParticipant) return "";
        const prefix = user?.role === "patient" ? "Dr. " : "";
        return `${prefix}${otherParticipant.firstName} ${otherParticipant.lastName}`;
    }, [otherParticipant, user]);

    const otherParticipantAvatar = useMemo(() => {
        return otherParticipant?.user?.profileImageUrl || DEFAULT_AVATAR;
    }, [otherParticipant]);

    const handleSend = () => {
        if (!input.trim() || !selectedRoomId) return;
        
        const content = input.trim();
        const tempId = `opt-${Date.now()}`;
        
        // 1. Add optimistic message
        const optimisticMsg: Message = {
            id: tempId,
            text: content,
            time: format(new Date(), "HH:mm"),
            isDoc: false,
            read: false,
            type: "text",
            status: "sending",
            avatarUrl: user?.profileImageUrl
        };
        
        setMessages((prev) => [...prev, optimisticMsg]);
        setInput("");

        // 2. Send via socket
        sendMessage(content, "text", (ack: any) => {
            console.log("📨 Message acknowledgement:", ack);
            if (ack && ack.chatMessageId) {
                // Update specific optimistic message to sent status and real ID
                setMessages((prev) => {
                    return prev.map(m => m.id === tempId ? {
                        ...m,
                        id: String(ack.chatMessageId),
                        status: "sent"
                    } : m);
                });
            } else {
                // Handle error
                setMessages((prev) => {
                    return prev.map(m => m.id === tempId ? {
                        ...m,
                        status: "error"
                    } : m);
                });
            }
        });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !selectedRoomId) return;

        const tempId = `opt-${Date.now()}`;
        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await api.post("/chat/upload", formData);
            const imageUrl = res.data.data.imageUrl;
            
            // Add optimistic image
            const optimisticMsg: Message = {
                id: tempId,
                text: imageUrl,
                time: format(new Date(), "HH:mm"),
                isDoc: false,
                read: false,
                type: "image",
                status: "sending",
                avatarUrl: user?.profileImageUrl
            };
            setMessages(prev => [...prev, optimisticMsg]);

            // Send via socket
            sendMessage(imageUrl, "image", (ack: any) => {
                if (ack && ack.chatMessageId) {
                    setMessages(prev => prev.map(m => m.id === tempId ? {
                        ...m,
                        id: String(ack.chatMessageId),
                        status: "sent"
                    } : m));
                }
            });
        } catch (err) {
            console.error("Image upload failed:", err);
            alert("อัปโหลดรูปภาพไม่สำเร็จ");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
    };

    if (loading) return <div className="flex h-screen w-full items-center justify-center bg-gray-50 flex-1 ml-64">กำลังโหลด...</div>;

    return (
        <div className="flex h-screen w-full bg-white overflow-hidden text-[#434343] font-sans ml-64">
            {lightboxImages && <Lightbox images={lightboxImages} startIndex={lightboxStart} onClose={() => setLightboxImages(null)} />}

            {/* Conversation List */}
            <div className="w-[300px] flex-shrink-0 flex flex-col border-r border-gray-100 bg-white hidden md:flex">
                <div className="px-5 py-6 border-b border-gray-100/80">
                    <h2 className="text-2xl font-black text-gray-800 tracking-tight mb-4">ข้อความ</h2>
                    <div className="relative flex items-center">
                        <Search size={15} className="absolute left-4 text-gray-400 pointer-events-none" />
                        <input type="text" placeholder="ค้นหาการสนทนา..." className="w-full bg-gray-50 text-[14px] text-gray-600 rounded-2xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-[#87D039]/30 border-none transition-all" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto px-3 py-4 custom-scrollbar">
                    {rooms.map((room) => {
                        const isPatient = user?.role === "patient";
                        const other = isPatient ? room.appointment.nutritionist : room.appointment.patient;
                        return (
                            <div
                                key={room.chatRoomId}
                                onClick={() => setSelectedRoomId(room.chatRoomId)}
                                className={`relative p-4 flex items-start gap-3 rounded-2xl cursor-pointer transition-all mb-2 ${selectedRoomId === room.chatRoomId ? "bg-[#f0fde4] shadow-sm" : "hover:bg-gray-50"}`}
                            >
                                {selectedRoomId === room.chatRoomId && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-[60%] bg-[#87D039] rounded-r-full" />}
                                <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 shadow-sm bg-gray-200">
                                    <img src={other?.user?.profileImageUrl || DEFAULT_AVATAR} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-0.5">
                                        <p className="font-bold text-[14px] text-gray-800 tracking-tight truncate">
                                            {isPatient ? `Dr. ${other.firstName} ${other.lastName}` : `${other.firstName} ${other.lastName}`}
                                        </p>
                                    </div>
                                    <p className="text-[11px] text-[#5AAA1D] font-bold mb-1 uppercase tracking-wider">{isPatient ? "Nutritionist" : "Patient"}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Chat Window */}
            <div className="flex-1 flex flex-col bg-[#F8F9FA] min-w-0 relative">
                <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 shadow-sm z-10">
                    <div className="flex items-center gap-3">
                        <div className="relative w-11 h-11 rounded-full overflow-hidden shadow-sm bg-gray-200">
                            <img src={otherParticipantAvatar} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="text-left">
                            <p className="font-black text-[16px] text-gray-800">{otherParticipantName}</p>
                            <p className="text-[12px] text-gray-400 font-medium tracking-tight">
                                {isConnected ? "เดี๋ยวนี้นะ" : "กำลังเชื่อมต่อ..."}
                                {sessionStatus === "ended" && !debugMode && " • จบการสนทนา"}
                                {sessionStatus === "upcoming" && !debugMode && " • ยังไม่ถึงเวลา"}
                                {debugMode && <span className="text-[#87D039] font-black animate-pulse"> • TEST MODE ACTIVE</span>}
                            </p>
                        </div>
                    </div>
                    
                    {/* Test Mode Toggle (Only visible in Dev or for testing) */}
                    <button 
                        onClick={() => setDebugMode(!debugMode)}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-black transition-all border ${debugMode ? "bg-[#87D039] text-white border-[#87D039]" : "bg-white text-gray-400 border-gray-100 hover:border-gray-200"}`}
                    >
                        {debugMode ? "DISABLE TEST" : "ENABLE TEST"}
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 custom-scrollbar">
                    {/* Session Status Warnings */}
                    {sessionStatus === "upcoming" && (
                        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-4 shadow-sm mb-6 max-w-2xl mx-auto">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <Clock className="text-blue-600" size={20} />
                            </div>
                            <div>
                                <p className="text-blue-900 font-bold text-sm">ยังไม่ถึงเวลานัดหมาย</p>
                                <p className="text-blue-700/80 text-[13px] mt-1 leading-relaxed font-medium">
                                    คุณสามารถเข้าห้องแชทได้ในเวลา {format(new Date(activeRoom!.appointment.startTime), "HH:mm", { locale: th })} น. กรุณารอสักครู่
                                </p>
                            </div>
                        </div>
                    )}

                    {sessionStatus === "ended" && (
                        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start gap-4 shadow-sm mb-6 max-w-2xl mx-auto">
                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                                <LogOut className="text-amber-600" size={20} />
                            </div>
                            <div>
                                <p className="text-amber-900 font-bold text-sm">การนัดหมายนี้สิ้นสุดลงแล้ว</p>
                                <p className="text-amber-700/80 text-[13px] mt-1 leading-relaxed font-medium">
                                    นักโภชนาการได้จบการสนทนาและออกจากห้องแชทแล้ว คุณสามารถดูประวัติการสนทนาย้อนหลังได้
                                </p>
                            </div>
                        </div>
                    )}

                    {messages.map((msg) => (
                        <ChatBubble key={msg.id} msg={msg} onImageClick={(url) => { setLightboxImages([url]); setLightboxStart(0); }} />
                    ))}

                    {/* Ended Session Summary */}
                    {sessionStatus === "ended" && (
                        <div className="mt-12 p-8 bg-white rounded-[32px] border border-gray-100 shadow-sm max-w-2xl mx-auto">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-2xl bg-[#C5F285]/20 flex items-center justify-center">
                                    <Info className="text-[#87D039]" size={22} />
                                </div>
                                <h3 className="font-black text-xl text-gray-800 tracking-tight">สรุปการนัดหมาย</h3>
                            </div>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between py-3 border-b border-gray-50">
                                    <span className="text-gray-400 text-sm font-bold uppercase tracking-widest">สถานะ</span>
                                    <span className="px-3 py-1 bg-[#C5F285]/20 text-[#5AAA1D] text-[11px] rounded-full font-black uppercase tracking-wider">COMPLETED</span>
                                </div>
                                
                                {activeRoom?.appointment.summary ? (
                                    <div className="bg-gray-50 rounded-2xl p-5">
                                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">ภาพรวมการปรึกษา</p>
                                        <p className="text-gray-700 text-[15px] leading-relaxed font-medium italic">"{activeRoom.appointment.summary}"</p>
                                    </div>
                                ) : (
                                    <div className="text-center py-4 border-2 border-dashed border-gray-100 rounded-2xl">
                                        <p className="text-gray-400 text-sm font-medium">ไม่มีข้อมูลสรุปสำหรับการนัดหมายนี้</p>
                                    </div>
                                )}

                                {activeRoom?.appointment.nutritionistNotes && (
                                    <div>
                                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">คำแนะนำเพิ่มเติม</p>
                                        <div className="prose prose-sm max-w-none text-gray-600 font-medium">
                                            {activeRoom.appointment.nutritionistNotes}
                                        </div>
                                    </div>
                                )}
                                
                                <button className="w-full py-4 bg-gray-50 hover:bg-gray-100 text-gray-500 font-bold text-sm rounded-2xl transition-all mt-4 border border-gray-100">
                                    ดาวน์โหลดสรุปการนัดหมาย (PDF)
                                </button>
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>

                <div className={`px-5 py-5 bg-white border-t border-gray-100 ${sessionStatus !== "active" ? "opacity-40 grayscale pointer-events-none cursor-not-allowed" : ""}`}>
                    <div className="flex items-center gap-3 bg-gray-50 rounded-[24px] px-5 py-3 border border-gray-200 focus-within:border-[#87D039]/60 focus-within:ring-4 focus-within:ring-[#87D039]/5 transition-all">
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading || sessionStatus !== "active"}
                            className="p-2 text-gray-400 hover:text-[#87D039] transition-all hover:bg-white rounded-xl shadow-sm hover:shadow active:scale-95 disabled:opacity-30"
                        >
                            {isUploading ? <Star className="animate-spin" size={20} /> : <Paperclip size={20} />}
                        </button>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={sessionStatus === "active" ? "พิมพ์ข้อความที่ต้องการปรึกษา..." : "ไม่สามารถส่งข้อความได้ในช่วงเวลานี้"}
                            disabled={sessionStatus !== "active"}
                            className="flex-1 bg-transparent outline-none text-[15px] font-medium text-gray-700 placeholder-gray-400 py-1"
                        />
                        <button className="p-2 text-gray-400 hover:text-[#87D039] transition-all hover:bg-white rounded-xl">
                            <Smile size={20} />
                        </button>
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || sessionStatus !== "active"}
                            className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 active:scale-90 shadow-lg ${input.trim() && sessionStatus === "active" ? "bg-[#87D039] text-white" : "bg-gray-200 text-gray-400 opacity-50 cursor-not-allowed"}`}
                        >
                            <Send size={18} />
                        </button>
                    </div>
                    <p className="text-[10px] text-gray-300 text-center mt-3 font-bold tracking-widest uppercase">
                        {sessionStatus === "active" ? "SECURE END-TO-END ENCRYPTED" : "SESSION COMPLETE / READ ONLY"}
                    </p>
                </div>
            </div>
        </div>
    );
}
