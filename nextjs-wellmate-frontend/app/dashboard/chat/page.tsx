"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
    Search, Paperclip, CheckCheck,
    Check, Send, Star,
    X, 
    Clock, LogOut, Info, Smile,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useChatWebSocket } from "@/hooks/useChatWebSocket";
import api from "@/lib/api";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { appointmentsApi } from "@/services/appointments";
import { menuApi, MenuItem as ServiceMenuItem } from "@/services/menu-items";
import { useCartStore } from "@/store/cart-store";
import Swal from "sweetalert2";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
    id: string;
    text: string;
    time: string;
    isDoc: boolean; 
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
        recommendedItems?: any[];
        patient: { firstName: string; lastName: string; user: { profileImageUrl: string } | null };
        nutritionist: { firstName: string; lastName: string; user: { profileImageUrl: string } | null };
    };
    chatMessages: any[];
}

// ─── Constants ────────────────────────────────────────────────────────────────
const DEFAULT_AVATAR = "/images/default-avatar.png";

// ─── Subcomponents ────────────────────────────────────────────────────────────
const RecommendationCard = ({ items, onAddToCart }: { items: any[]; onAddToCart: (item: any) => void }) => {
    const [selectedIds, setSelectedIds] = useState<number[]>(items.map(i => i.menuItem.menuItemId));
    
    const toggleSelect = (id: number) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const handleAddSelected = () => {
        const selectedItems = items.filter(i => selectedIds.includes(i.menuItem.menuItemId));
        selectedItems.forEach(i => onAddToCart(i.menuItem));
    };

    return (
        <div className="bg-white rounded-[24px] border border-[#87D039]/20 shadow-md overflow-hidden mt-4 w-full max-w-[400px] animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="bg-[#87D039]/10 px-5 py-3 border-b border-[#87D039]/10 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <Smile className="text-[#87D039]" size={18} />
                    <span className="text-[13px] font-black text-[#5AAA1D] uppercase tracking-wider">โภชนาการแนะนำ</span>
                </div>
                <button 
                    onClick={() => setSelectedIds(selectedIds.length === items.length ? [] : items.map(i => i.menuItem.menuItemId))}
                    className="text-[10px] font-black uppercase tracking-widest text-[#5AAA1D] hover:underline"
                >
                    {selectedIds.length === items.length ? "ล้างทั้งหมด" : "เลือกทั้งหมด"}
                </button>
            </div>
            <div className="p-4 space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
                {items.map((rec) => {
                    const isSelected = selectedIds.includes(rec.menuItem.menuItemId);
                    return (
                        <div 
                            key={rec.menuItemId} 
                            onClick={() => toggleSelect(rec.menuItem.menuItemId)}
                            className={`flex items-center gap-3 p-2 rounded-xl transition-all group cursor-pointer border ${isSelected ? "bg-[#87D039]/5 border-[#87D039]/20" : "hover:bg-gray-50 border-transparent"}`}
                        >
                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${isSelected ? "bg-[#87D039] border-[#87D039]" : "border-gray-200"}`}>
                                {isSelected && <Check size={12} className="text-white" />}
                            </div>
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 shadow-sm ml-1">
                                <img src={rec.menuItem.imageUrl || DEFAULT_AVATAR} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[13px] font-bold text-gray-800 truncate">{rec.menuItem.name}</p>
                                <p className="text-[11px] text-[#87D039] font-black">฿{rec.menuItem.price} <span className="text-gray-300 font-medium ml-1">| {rec.menuItem.caloriesKcal || 0} kcal</span></p>
                            </div>
                        </div>
                    );
                })}
            </div>
            <button 
                onClick={handleAddSelected}
                disabled={selectedIds.length === 0}
                className="w-full py-3.5 bg-[#87D039] hover:bg-[#76b831] text-white text-[12px] font-black uppercase tracking-[2px] transition-all border-t border-[#87D039]/10 active:scale-[0.98] disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
            >
                สั่งอาหารที่เลือก ({selectedIds.length})
            </button>
        </div>
    );
};

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
    const [lightboxImages, setLightboxImages] = useState<string[] | null>(null);
    const [lightboxStart, setLightboxStart] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [debugMode, setDebugMode] = useState(false);

    // Recommendation State
    const [showRecModal, setShowRecModal] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [availableItems, setAvailableItems] = useState<ServiceMenuItem[]>([]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [isSavingRec, setIsSavingRec] = useState(false);
    
    const addToCart = useCartStore((state) => state.addItem);

    // ─── Helper: Map DB Message to UI Message ───
    const mapMessage = useCallback((m: any): Message => ({
        id: String(m.chatMessageId),
        text: m.content,
        time: format(new Date(m.createdAt), "HH:mm"),
        isDoc: String(m.senderId) !== String(user?.userId),
        read: m.isRead || false,
        type: m.messageType || "text",
        avatarUrl: m.sender?.profileImageUrl,
    }), [user?.userId]);

    const bottomRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { sendMessage, markAsRead, onNewMessage, onMessagesRead, isConnected } = useChatWebSocket(selectedRoomId);

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const cats = await menuApi.getCategories();
                setCategories(cats);
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };
        fetchCategories();
    }, []);

    // Fetch items when category changes
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const res = await menuApi.getMenuItems({ 
                    categoryId: selectedCategoryId || undefined,
                    limit: 50 
                });
                setAvailableItems(res.data);
            } catch (err) {
                console.error("Error fetching items:", err);
            }
        };
        if (showRecModal) fetchItems();
    }, [selectedCategoryId, showRecModal]);

    // Fetch rooms
    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const res = await api.get("/chat/rooms");
                const roomsData = Array.isArray(res.data) ? res.data : (res.data?.data || []);
                setRooms(roomsData);
                
                if (roomsData.length > 0 && !selectedRoomId) {
                    const firstRoom = roomsData[0];
                    setSelectedRoomId(firstRoom.chatRoomId);
                    
                    if (firstRoom.chatMessages && firstRoom.chatMessages.length > 0) {
                        const initialMsgs = firstRoom.chatMessages.map(mapMessage).reverse();
                        setMessages(initialMsgs);
                    }
                }
            } catch (err) {
                console.error("Error fetching rooms:", err);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchRooms();
    }, [user, selectedRoomId, mapMessage]);

    // Fetch messages when room selected
    useEffect(() => {
        if (!selectedRoomId) {
            setMessages([]);
            return;
        }

        setMessages([]);
        let isCurrent = true;

        const localRoom = rooms.find(r => String(r.chatRoomId) === String(selectedRoomId));
        if (localRoom?.chatMessages) {
            const initialMsgs = localRoom.chatMessages.map(mapMessage).reverse();
            if (isCurrent) setMessages(initialMsgs);
        }

        const fetchMessages = async () => {
            try {
                const res = await api.get(`/chat/${selectedRoomId}/messages`);
                if (!isCurrent) return;
                
                const rawMessages = Array.isArray(res.data) ? res.data : (res.data?.data || []);
                const mapped: Message[] = rawMessages.map(mapMessage).reverse();
                setMessages(mapped);
            } catch (err) {
                console.error("Error fetching messages:", err);
            }
        };
        fetchMessages();

        return () => {
            isCurrent = false;
        };
    }, [selectedRoomId, user?.userId, mapMessage, rooms]);

    // Handle new messages from socket
    useEffect(() => {
        const cleanup = onNewMessage((newMsg: any) => {
            if (String(newMsg.chatRoomId) === String(selectedRoomId)) {
                const mapped: Message = mapMessage(newMsg);
                setMessages((prev) => {
                    if (prev.some(m => String(m.id) === String(mapped.id))) {
                        return prev;
                    }
                    
                    if (!mapped.isDoc) {
                        const optIndex = prev.findIndex(m => 
                            (m.status === "sending" || m.id.startsWith("opt-")) && 
                            m.text === mapped.text && 
                            m.type === mapped.type
                        );
                        
                        if (optIndex !== -1) {
                            const next = [...prev];
                            next[optIndex] = { ...mapped, status: "sent" };
                            return next;
                        }
                    }
                    
                    return [...prev, mapped];
                });
            }
        });
        return cleanup;
    }, [selectedRoomId, onNewMessage, user?.userId, mapMessage]);

    // Handle read receipts
    useEffect(() => {
        const cleanup = onMessagesRead((data: any) => {
            if (String(data.chatRoomId) === String(selectedRoomId) && String(data.userId) !== String(user?.userId)) {
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
    }, [selectedRoomId, isConnected, messages.length, markAsRead]); 

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
    }, [activeRoom, currentTime, debugMode]);

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

        sendMessage(content, "text", (ack: any) => {
            if (ack && ack.chatMessageId) {
                setMessages((prev) => prev.map(m => m.id === tempId ? {
                    ...m,
                    id: String(ack.chatMessageId),
                    status: "sent"
                } : m));
            } else {
                setMessages((prev) => prev.map(m => m.id === tempId ? {
                    ...m,
                    status: "error"
                } : m));
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
            Swal.fire({
                icon: 'error',
                title: 'อัปโหลดไม่สำเร็จ',
                text: 'ไม่สามารถอัปโหลดรูปภาพได้ในขณะนี้'
            });
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
    };

    if (loading) return <div className="flex h-screen w-full items-center justify-center bg-gray-50 flex-1 ml-64 font-bold text-[#87D039]">กำลังเตรียมห้องแชท...</div>;

    return (
        <div className="flex h-screen w-full bg-white overflow-hidden text-[#434343] font-sans ml-64">
            {lightboxImages && <Lightbox images={lightboxImages} startIndex={lightboxStart} onClose={() => setLightboxImages(null)} />}

            {/* Conversation List */}
            <div className="w-[300px] flex-shrink-0 flex flex-col border-r border-gray-100 bg-white hidden lg:flex">
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

                    <div className="flex items-center gap-2">
                        {user?.role === "nutritionist" && sessionStatus === "active" && (
                            <button 
                                onClick={() => {
                                    setSelectedItems(activeRoom?.appointment?.recommendedItems?.map((i: any) => i.menuItemId) || []);
                                    setShowRecModal(true);
                                }}
                                className="px-4 py-2 bg-[#87D039] text-white text-[12px] font-black rounded-xl hover:bg-[#76b831] transition-all shadow-sm active:scale-95 flex items-center gap-2"
                            >
                                <Smile size={16} />
                                <span>แนะนำเมนู</span>
                            </button>
                        )}
                        
                        <button 
                            onClick={() => setDebugMode(!debugMode)}
                            className={`px-3 py-1.5 rounded-full text-[10px] font-black transition-all border ${debugMode ? "bg-[#87D039] text-white border-[#87D039]" : "bg-white text-gray-400 border-gray-100 hover:border-gray-200"}`}
                        >
                            {debugMode ? "TEST MODE: ON" : "TEST MODE: OFF"}
                        </button>
                    </div>
                </div>

                {/* Recommendation Modal */}
                {showRecModal && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={(e) => e.target === e.currentTarget && setShowRecModal(false)}>
                        <div className="bg-white rounded-[32px] w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-black text-gray-800 tracking-tight">แนะนำเมนูอาหาร</h3>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Select items to recommend from partners</p>
                                </div>
                                <button onClick={() => setShowRecModal(false)} className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-all">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
                                <div className="flex flex-wrap gap-2 mb-8">
                                    <button 
                                        onClick={() => setSelectedCategoryId(null)}
                                        className={`px-4 py-2 rounded-xl text-xs font-black transition-all border ${selectedCategoryId === null ? "bg-[#87D039] text-white border-[#87D039]" : "bg-white text-gray-400 border-gray-100 hover:border-gray-200"}`}
                                    >
                                        ทั้งหมด
                                    </button>
                                    {categories.map(cat => (
                                        <button 
                                            key={cat.id}
                                            onClick={() => setSelectedCategoryId(cat.id)}
                                            className={`px-4 py-2 rounded-xl text-xs font-black transition-all border ${selectedCategoryId === cat.id ? "bg-[#87D039] text-white border-[#87D039]" : "bg-white text-gray-400 border-gray-100 hover:border-gray-200"}`}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {availableItems.map(item => (
                                        <div 
                                            key={item.menuItemId}
                                            onClick={() => {
                                                if (selectedItems.includes(item.menuItemId)) {
                                                    setSelectedItems(selectedItems.filter(id => id !== item.menuItemId));
                                                } else {
                                                    setSelectedItems([...selectedItems, item.menuItemId]);
                                                }
                                            }}
                                            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer group flex gap-3 ${selectedItems.includes(item.menuItemId) ? "border-[#87D039] bg-[#87D039]/5" : "border-gray-100 hover:border-gray-200 bg-white"}`}
                                        >
                                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 shadow-sm">
                                                <img src={item.imageUrl || DEFAULT_AVATAR} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-[14px] text-gray-800 truncate">{item.name}</p>
                                                <p className="text-[12px] text-[#87D039] font-black mt-0.5">฿{item.price}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">{item.caloriesKcal || 0} kcal</p>
                                            </div>
                                            {selectedItems.includes(item.menuItemId) && (
                                                <div className="w-6 h-6 rounded-full bg-[#87D039] flex items-center justify-center text-white shrink-0">
                                                    <Check size={14} />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                                <p className="text-sm font-bold text-gray-400 tracking-tight">
                                    เลือกแล้ว <span className="text-gray-800 font-black">{selectedItems.length}</span> รายการ
                                </p>
                                <button 
                                    disabled={isSavingRec}
                                    onClick={async () => {
                                        if (!selectedRoomId || !activeRoom) return;
                                        setIsSavingRec(true);
                                        try {
                                            await appointmentsApi.saveRecommendations(activeRoom.appointment.appointmentId, selectedItems);
                                            setShowRecModal(false);
                                            Swal.fire({
                                                icon: 'success',
                                                title: 'บันทึกสำเร็จ',
                                                text: 'บันทึกรายการแนะนำเมนูเรียบร้อยแล้ว',
                                                timer: 1500,
                                                showConfirmButton: false
                                            });
                                            
                                            // Refresh rooms list to reflect changes
                                            const res = await api.get("/chat/rooms");
                                            setRooms(Array.isArray(res.data) ? res.data : (res.data?.data || []));
                                        } catch (err) {
                                            console.error("Save recommendations failed:", err);
                                            Swal.fire({
                                                icon: 'error',
                                                title: 'เกิดข้อผิดพลาด',
                                                text: 'ขัดข้องทางเทคนิค กรุณาลองใหม่อีกครั้ง'
                                            });
                                        } finally {
                                            setIsSavingRec(false);
                                        }
                                    }}
                                    className="px-8 py-3 bg-[#87D039] text-white text-sm font-black rounded-xl hover:bg-[#76b831] transition-all shadow-md active:scale-95 disabled:opacity-50"
                                >
                                    {isSavingRec ? "กำลังบันทึก..." : "บันทึกคำแนะนำ"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 custom-scrollbar">
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

                    {/* Recommendations for Patient */}
                    {user?.role === "patient" && activeRoom?.appointment?.recommendedItems && activeRoom.appointment.recommendedItems.length > 0 && (
                        <div className="flex justify-start">
                            <RecommendationCard 
                                items={activeRoom.appointment.recommendedItems} 
                                onAddToCart={(item) => {
                                    addToCart({
                                        menuItemId: String(item.menuItemId),
                                        name: item.name,
                                        price: Number(item.price),
                                        imageUrl: item.imageUrl,
                                        foodPartnerId: item.foodPartnerId,
                                    }, 1);
                                    Swal.fire({
                                        title: 'เพิ่มลงตะกร้า!',
                                        text: `คุณได้เพิ่ม ${item.name} ลงในตะกร้าสินค้าแล้ว`,
                                        icon: 'success',
                                        timer: 1500,
                                        showConfirmButton: false,
                                        toast: true,
                                        position: 'top-end'
                                    });
                                }}
                            />
                        </div>
                    )}

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
                                <span className={`px-3 py-1 text-[11px] rounded-full font-black uppercase tracking-wider ${sessionStatus === 'ended' ? 'bg-[#C5F285]/20 text-[#5AAA1D]' : 'bg-gray-100 text-gray-400'}`}>
                                    {sessionStatus === 'ended' ? 'COMPLETED' : 'IN PROGRESS'}
                                </span>
                            </div>
                            
                            {activeRoom?.appointment.summary ? (
                                <div className="bg-gray-50 rounded-2xl p-5">
                                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">ภาพรวมการปรึกษา</p>
                                    <p className="text-gray-700 text-[15px] leading-relaxed font-medium italic">&quot;{activeRoom.appointment.summary}&quot;</p>
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
                        </div>
                    </div>
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
