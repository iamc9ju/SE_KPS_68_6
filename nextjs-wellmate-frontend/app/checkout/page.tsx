"use client";

import React, { useState } from 'react';
import { ArrowLeft, MapPin, CreditCard, Wallet, Banknote, ChevronRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
    const router = useRouter();
    const [selectedPayment, setSelectedPayment] = useState('credit_card');

    const orderItems = [
        {
            id: 1,
            name: 'Grilled Chicken Salad with Avocado',
            price: 185,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=150',
            calories: 420,
        },
        {
            id: 2,
            name: 'Greek Yogurt with Mixed Berries',
            price: 95,
            quantity: 2,
            image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=150',
            calories: 260,
        }
    ];

    const subtotal = orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const deliveryFee = 35;
    const discount = 0;
    const total = subtotal + deliveryFee - discount;

    const handlePlaceOrder = () => {
        // Mocking the order creation delay
        setTimeout(() => {
            router.push('/tracking');
        }, 800);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20">
            {/* Header */}
            <header className="bg-white px-6 py-4 sticky top-0 z-10 border-b border-slate-100 flex items-center shadow-sm">
                <button onClick={() => router.back()} className="mr-4 p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <ArrowLeft size={20} className="text-slate-600" />
                </button>
                <h1 className="text-xl font-bold text-slate-800 flex-1 text-center pr-10">Checkout</h1>
            </header>

            <main className="max-w-3xl mx-auto p-4 md:p-6 space-y-6">

                {/* Delivery Address Section */}
                <section className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-bold text-lg text-slate-800">Delivery Address</h2>
                        <button className="text-[#a4cc00] font-semibold text-sm hover:underline">Edit</button>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="bg-orange-50 p-3 rounded-xl shrink-0 mt-1">
                            <MapPin className="text-orange-500" size={24} />
                        </div>
                        <div>
                            <div className="font-bold text-slate-800 mb-1">Home (Default)</div>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                123/45 Health Avenue Condo, Building A, Room 101<br />
                                Sukhumvit Road, Khlong Toei, Bangkok 10110
                            </p>
                            <div className="text-sm text-slate-600 font-medium mt-2">
                                Note: Please leave it at the lobby.
                            </div>
                        </div>
                    </div>
                </section>

                {/* Order Items Section */}
                <section className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                    <h2 className="font-bold text-lg text-slate-800 mb-4">Order Summary</h2>
                    <div className="space-y-4">
                        {orderItems.map(item => (
                            <div key={item.id} className="flex items-center gap-4">
                                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover bg-slate-100 shadow-sm" />
                                <div className="flex-1">
                                    <h3 className="font-bold text-sm text-slate-800 line-clamp-1">{item.name}</h3>
                                    <div className="text-xs text-slate-500 font-medium mb-1">{item.calories} kcal</div>
                                    <div className="text-[#a4cc00] font-bold text-sm">฿{item.price}</div>
                                </div>
                                <div className="text-sm font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                                    x{item.quantity}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Payment Method Section */}
                <section className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                    <h2 className="font-bold text-lg text-slate-800 mb-4">Payment Method</h2>
                    <div className="space-y-3">
                        <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedPayment === 'credit_card' ? 'border-[#a4cc00] bg-[#f9fcfo]' : 'border-slate-100 hover:border-slate-200 bg-white'}`}>
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-50 p-2.5 rounded-lg"><CreditCard size={20} className="text-blue-500" /></div>
                                <div>
                                    <div className="font-bold text-sm text-slate-800">Credit / Debit Card</div>
                                    <div className="text-xs text-slate-500 font-medium">**** **** **** 4242</div>
                                </div>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPayment === 'credit_card' ? 'border-[#a4cc00] bg-[#a4cc00]' : 'border-slate-300'}`}>
                                {selectedPayment === 'credit_card' && <CheckCircle2 size={12} className="text-white" />}
                            </div>
                            <input type="radio" name="payment" value="credit_card" className="hidden" checked={selectedPayment === 'credit_card'} onChange={() => setSelectedPayment('credit_card')} />
                        </label>

                        <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedPayment === 'promptpay' ? 'border-[#a4cc00] bg-[#f9fcfo]' : 'border-slate-100 hover:border-slate-200 bg-white'}`}>
                            <div className="flex items-center gap-3">
                                <div className="bg-indigo-50 p-2.5 rounded-lg"><Wallet size={20} className="text-indigo-500" /></div>
                                <div className="font-bold text-sm text-slate-800">PromptPay QR</div>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPayment === 'promptpay' ? 'border-[#a4cc00] bg-[#a4cc00]' : 'border-slate-300'}`}>
                                {selectedPayment === 'promptpay' && <CheckCircle2 size={12} className="text-white" />}
                            </div>
                            <input type="radio" name="payment" value="promptpay" className="hidden" checked={selectedPayment === 'promptpay'} onChange={() => setSelectedPayment('promptpay')} />
                        </label>

                        <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedPayment === 'cash' ? 'border-[#a4cc00] bg-[#f9fcfo]' : 'border-slate-100 hover:border-slate-200 bg-white'}`}>
                            <div className="flex items-center gap-3">
                                <div className="bg-emerald-50 p-2.5 rounded-lg"><Banknote size={20} className="text-emerald-500" /></div>
                                <div className="font-bold text-sm text-slate-800">Cash on Delivery</div>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPayment === 'cash' ? 'border-[#a4cc00] bg-[#a4cc00]' : 'border-slate-300'}`}>
                                {selectedPayment === 'cash' && <CheckCircle2 size={12} className="text-white" />}
                            </div>
                            <input type="radio" name="payment" value="cash" className="hidden" checked={selectedPayment === 'cash'} onChange={() => setSelectedPayment('cash')} />
                        </label>
                    </div>
                </section>

                {/* Bill Details Section */}
                <section className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-[100px]">
                    <h2 className="font-bold text-lg text-slate-800 mb-4">Payment Summary</h2>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 font-medium">Subtotal</span>
                            <span className="font-bold text-slate-800">฿{subtotal}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 font-medium">Delivery Fee</span>
                            <span className="font-bold text-slate-800">฿{deliveryFee}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[#a4cc00] font-medium flex items-center gap-1">Discount <span className="text-xs bg-lime-100 text-lime-800 px-2 rounded-md">PROMO</span></span>
                            <span className="font-bold text-[#a4cc00]">-฿{discount}</span>
                        </div>
                        <div className="w-full h-px bg-slate-100 my-2"></div>
                        <div className="flex justify-between items-center text-lg">
                            <span className="font-bold text-slate-800">Total</span>
                            <span className="font-black text-slate-900">฿{total}</span>
                        </div>
                    </div>
                </section>
            </main>

            {/* Bottom Floating Action Bar */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] z-20">
                <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Payment</span>
                        <span className="text-xl font-black text-slate-900">฿{total}</span>
                    </div>
                    <button
                        onClick={handlePlaceOrder}
                        className="bg-slate-900 hover:bg-black text-[#ccff00] font-bold text-sm md:text-base py-3.5 px-8 rounded-full shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 flex-1 md:flex-none"
                    >
                        Place Order <ChevronRight size={18} />
                    </button>
                </div>
            </div>

        </div>
    );
}
