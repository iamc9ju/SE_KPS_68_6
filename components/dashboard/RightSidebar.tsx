"use client";

import React from "react";
import { X, ShoppingBag, Plus, Minus, Trash2, Flame } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useRouter } from "next/navigation";

export default function RightSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const router = useRouter();
    const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCartStore();

    if (!isOpen) return null;

    const handleCheckout = () => {
        onClose();
        router.push("/dashboard/checkout");
    };

    return (
        <div className={`fixed inset-0 z-[100] overflow-hidden transition-all duration-500 ${isOpen ? 'visible' : 'invisible pointer-events-none'}`}>
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            />

            <div className={`absolute inset-y-0 right-0 flex max-w-full pl-10 transform transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="w-screen max-w-md">
                    <div className="flex h-full flex-col bg-white shadow-2xl rounded-l-[40px] border-l border-[#f0e6cc] overflow-hidden">
                        {/* Header */}
                        <div className="px-8 py-8 border-b border-[#faf8f2]">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-2xl font-black text-[#3d3522] flex items-center gap-3">
                                        <ShoppingBag className="w-6 h-6 text-[#C6E065]" />
                                        ตะกร้าสินค้า
                                    </h2>
                                    <p className="mt-1 text-sm text-[#8a7550] font-medium">รายการอาหารที่คุณเลือกไว้</p>
                                </div>
                                <button
                                    type="button"
                                    className="rounded-xl p-2 text-[#8a7550] hover:bg-[#faf8f2] transition-colors"
                                    onClick={onClose}
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* List */}
                        <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                                    <div className="w-20 h-20 bg-[#faf8f2] rounded-full flex items-center justify-center">
                                        <ShoppingBag className="w-10 h-10 text-[#d19a66] opacity-30" />
                                    </div>
                                    <div>
                                        <p className="text-[#3d3522] font-black text-lg">ตะกร้าว่างเปล่า</p>
                                        <p className="text-[#8a7550] text-sm font-medium">ไม่มีอาหารในตะกร้าของคุณในขณะนี้</p>
                                    </div>
                                </div>
                            ) : (
                                <ul className="space-y-6">
                                    {items.map((item) => (
                                        <li key={item.menuItemId} className="flex py-2">
                                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-3xl border border-[#f0e6cc]">
                                                <img
                                                    src={item.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200"}
                                                    alt={item.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>

                                            <div className="ml-4 flex flex-1 flex-col justify-between py-1">
                                                <div>
                                                    <div className="flex justify-between text-base font-black text-[#3d3522]">
                                                        <h3 className="line-clamp-1">{item.name}</h3>
                                                        <p className="ml-4">฿{item.price * item.quantity}</p>
                                                    </div>
                                                    <p className="mt-1 text-xs font-bold text-[#8a7550] flex items-center gap-1">
                                                        <Flame className="w-3 h-3 text-orange-500" /> {item.caloriesKcal || 0} kcal
                                                    </p>
                                                </div>
                                                <div className="flex items-center justify-between text-sm">
                                                    <div className="flex items-center bg-[#faf8f2] rounded-xl px-2 py-1 border border-[#f0e6cc]">
                                                        <button
                                                            onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                                                            className="p-1 text-[#3d3522] hover:text-[#C6E065]"
                                                        >
                                                            <Minus className="w-4 h-4" />
                                                        </button>
                                                        <span className="mx-3 font-black text-[#3d3522] w-4 text-center">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                                                            className="p-1 text-[#3d3522] hover:text-[#C6E065]"
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </button>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem(item.menuItemId)}
                                                        className="font-bold text-red-400 hover:text-red-500 flex items-center gap-1 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="border-t border-[#faf8f2] px-8 py-10 bg-[#faf8f2]/30">
                                <div className="flex justify-between text-base font-medium text-[#3d3522] mb-6">
                                    <p className="font-bold">ยอดรวมทั้งหมด</p>
                                    <p className="text-3xl font-black">฿{getTotalPrice()}</p>
                                </div>
                                <div className="space-y-4">
                                    <button 
                                        onClick={handleCheckout}
                                        className="w-full bg-[#C6E065] text-[#3d3522] py-5 rounded-3xl font-black text-lg shadow-lg shadow-[#C6E065]/20 hover:bg-[#b5cf54] transition-all active:scale-[0.98]"
                                    >
                                        สั่งอาหารเลย
                                    </button>
                                    <button
                                        onClick={clearCart}
                                        className="w-full text-[#8a7550] py-2 rounded-xl font-bold text-sm hover:text-red-400 transition-colors"
                                    >
                                        ล้างตะกร้าสินค้า
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
