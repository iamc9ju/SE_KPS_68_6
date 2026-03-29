"use client";

import React, { useState, useEffect } from "react";
import { Search, X, Loader2, Plus, Utensils, Flame, Check } from "lucide-react";
import api from "@/lib/api";
import Swal from "sweetalert2";

type MenuItem = {
    menuItemId: number;
    name: string;
    price: number;
    imageUrl?: string;
    caloriesKcal?: number;
    category?: string;
};

type MealPlannerModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSave: (menuItemId: number) => void;
    date: Date;
    mealType: string;
};

export default function MealPlannerModal({ isOpen, onClose, onSave, date, mealType }: MealPlannerModalProps) {
    const [search, setSearch] = useState("");
    const [items, setItems] = useState<MenuItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchMenuItems("");
            setSelectedItem(null);
            setIsSubmitting(false);
        }
    }, [isOpen]);

    const fetchMenuItems = async (q: string) => {
        setIsLoading(true);
        try {
            const res = await api.get("/food-menu", { params: { q, limit: 12 } });
            // API returns { data: MenuItem[], meta: { ... } }
            const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
            setItems(data);
        } catch (error) {
            console.error("Error fetching menu items:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!selectedItem) return;
        setIsSubmitting(true);
        try {
            await onSave(selectedItem.menuItemId);
        } catch (error) {
            console.error("Error in onSave:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchMenuItems(search);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#3d3522]/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            
            <div className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-8 border-b border-gray-100">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-2xl font-black text-[#3d3522]">จัดรายการอาหาร</h2>
                            <p className="text-[#8a7550] font-medium uppercase text-[11px] tracking-widest mt-1">
                                {date.toLocaleDateString("th-TH", { weekday: 'long', day: 'numeric', month: 'long' })} • {mealType}
                            </p>
                        </div>
                        <button onClick={onClose} className="p-3 rounded-2xl hover:bg-gray-50 text-gray-400 transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSearch} className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text"
                            placeholder="ค้นหาชื่ออาหาร..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-[14px] font-black text-[#3d3522] focus:ring-2 focus:ring-[#C6E065]"
                        />
                    </form>
                </div>

                <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar bg-gray-50/30">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="text-[#C6E065] animate-spin mb-4" size={40} />
                            <p className="text-[#8a7550] font-bold">กำลังค้นหาเมนูที่เหมาะสม...</p>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="text-center py-12">
                            <Utensils size={48} className="text-gray-200 mx-auto mb-4" />
                            <p className="text-[#8a7550] font-bold">ไม่พบรายการอาหารที่ค้นหา</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {items.map((item) => (
                                <button
                                    key={item.menuItemId}
                                    onClick={() => setSelectedItem(item)}
                                    className={`p-4 rounded-3xl border-2 transition-all flex gap-4 text-left ${selectedItem?.menuItemId === item.menuItemId ? "bg-[#fafcf2] border-[#C6E065] shadow-md shadow-[#C6E065]/10" : "bg-white border-white hover:border-gray-100 hover:shadow-sm"}`}
                                >
                                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 shrink-0">
                                        <img src={item.imageUrl} className="w-full h-full object-cover" alt="" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-[13px] font-black text-[#3d3522] line-clamp-1">{item.name}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Flame size={12} className="text-orange-400" />
                                            <span className="text-[11px] font-bold text-gray-400">{item.caloriesKcal || 0} kcal</span>
                                        </div>
                                        <p className="text-[12px] font-black text-[#FF6A2C] mt-1">฿{item.price}</p>
                                    </div>
                                    {selectedItem?.menuItemId === item.menuItemId && (
                                        <div className="w-6 h-6 rounded-full bg-[#C6E065] flex items-center justify-center shrink-0">
                                            <Check size={14} className="text-white" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-8 border-t border-gray-100 bg-white">
                    <button 
                        disabled={!selectedItem || isSubmitting}
                        onClick={handleSave}
                        className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-[15px] font-black transition-all ${selectedItem && !isSubmitting ? "bg-[#3d3522] text-white hover:bg-black shadow-lg shadow-[#3d3522]/20" : "bg-gray-100 text-gray-300"}`}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                <span>กำลังบันทึก...</span>
                            </>
                        ) : (
                            <span>เพิ่มลงในแผน</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
