"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Wallet, ChevronRight, CheckCircle2, Loader2, AlertCircle, QrCode, Zap, ShieldCheck, Plus, Trash2, Home, Briefcase } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import { useCartStore } from '@/store/cart-store';

export default function CheckoutPage() {
    const router = useRouter();
    const { items, getTotalPrice, clearCart } = useCartStore();

    const [status, setStatus] = useState<'idle' | 'creating' | 'show_qr' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [omiseQrUrl, setOmiseQrUrl] = useState<string | null>(null);
    const [orderId, setOrderId] = useState<string | null>(null);
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [showValidation, setShowValidation] = useState(false);
    const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
    const [saveToProfile, setSaveToProfile] = useState(false);
    const [addressLabel, setAddressLabel] = useState('Home');
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);

    useEffect(() => {
        if (items.length === 0 && status !== 'success' && status !== 'show_qr') {
            router.push('/dashboard/healthymenu');
        }
    }, [items, status, router]);

    useEffect(() => {
        fetchSavedAddresses();
    }, []);

    const fetchSavedAddresses = async () => {
        try {
            const res = await api.get('/patients/addresses');
            const addresses = res.data?.data || [];
            setSavedAddresses(addresses);
            
            // Set default if exists
            const defaultAddr = addresses.find((a: any) => a.isDefault);
            if (defaultAddr) {
                handleSelectAddress(defaultAddr);
            }
        } catch (err) {
            console.error('Failed to fetch addresses:', err);
        } finally {
            setIsLoadingAddresses(false);
        }
    };

    const handleSelectAddress = (addr: any) => {
        setDeliveryAddress(addr.address);
        setContactPhone(addr.phone);
        setSelectedAddressId(addr.id);
        setSaveToProfile(false);
    };

    const handleDeleteAddress = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        if (!confirm('ยืนยันการลบที่อยู่นี้?')) return;
        try {
            await api.delete(`/patients/addresses/${id}`);
            setSavedAddresses(prev => prev.filter(a => a.id !== id));
            if (selectedAddressId === id) {
                setSelectedAddressId(null);
            }
        } catch (err) {
            console.error('Failed to delete address:', err);
        }
    };

    const subtotal = getTotalPrice();
    const deliveryFee = 35;
    const discount = 0;
    const total = subtotal + deliveryFee - discount;

    const handlePlaceOrder = async () => {
        if (!deliveryAddress.trim() || !contactPhone.trim()) {
            setShowValidation(true);
            return;
        }

        setStatus('creating');
        try {
            // Save address if requested
            if (saveToProfile && savedAddresses.length < 3) {
                try {
                    await api.post('/patients/addresses', {
                        address: deliveryAddress,
                        phone: contactPhone,
                        label: addressLabel,
                        isDefault: savedAddresses.length === 0
                    });
                } catch (saveErr) {
                    console.error('Failed to auto-save address:', saveErr);
                }
            }

            const orderData = {
                items: items.map(item => ({
                    menuItemId: parseInt(item.menuItemId.toString(), 10),
                    quantity: parseInt(item.quantity.toString(), 10)
                })),
                deliveryAddress,
                contactPhone
            };

            const res = await api.post('/orders', orderData);

            if (res.data?.data?.qrCodeUrl) {
                setOmiseQrUrl(res.data.data.qrCodeUrl);
                setOrderId(res.data.data.orderId);
                setStatus('show_qr');
            } else {
                throw new Error('ไม่สามารถสร้าง QR Code ได้');
            }
        } catch (err: any) {
            console.error('Order creation failed:', err);
            setStatus('error');
            setErrorMessage(err.response?.data?.message || 'ไม่สามารถทำรายการได้ กรุณาลองใหม่อีกครั้ง');
        }
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (status === 'show_qr' && orderId) {
            interval = setInterval(async () => {
                try {
                    const res = await api.get(`/orders/${orderId}/check-payment`);
                    const paymentData = res.data?.data || res.data;
                    if (paymentData?.paymentStatus === 'PAID') {
                        clearInterval(interval);
                        handleConfirmPayment();
                    }
                } catch (err) {
                    console.error('Polling error:', err);
                }
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [status, orderId]);

    const handleConfirmPayment = () => {
        setStatus('success');
        setTimeout(() => {
            clearCart();
            router.push('/dashboard/orders');
        }, 2000);
    };

    // ============ SUCCESS VIEW ============
    if (status === 'success') {
        return (
            <div className="flex-1 overflow-y-auto min-h-screen bg-slate-50 lg:pl-64 flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-12 rounded-2xl shadow-lg border border-slate-100 flex flex-col items-center text-center max-w-md w-full"
                >
                    <div className="w-20 h-20 bg-lime-100 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle2 size={40} className="text-[#a4cc00]" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">ชำระเงินสำเร็จ!</h2>
                    <p className="text-slate-500 font-medium mb-8">ขอบคุณสำหรับคำสั่งซื้อ ระบบกำลังพาคุณไปยังหน้าประวัติการสั่งซื้อ</p>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 2 }}
                            className="h-full bg-[#a4cc00]"
                        />
                    </div>
                </motion.div>
            </div>
        );
    }

    // ============ PAYMENT QR VIEW ============
    if (status === 'show_qr') {
        return (
            <div className="flex-1 overflow-y-auto min-h-screen bg-slate-50 lg:pl-64">
                <header className="bg-white px-6 py-4 sticky top-0 z-10 border-b border-slate-100 flex items-center shadow-sm">
                    <button onClick={() => setStatus('idle')} className="mr-4 p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <ArrowLeft size={20} className="text-slate-600" />
                    </button>
                    <h1 className="text-xl font-bold text-slate-800 flex-1 text-center pr-10">ชำระเงินผ่าน PromptPay</h1>
                </header>

                <main className="max-w-lg mx-auto p-6 md:p-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center"
                    >
                        {/* QR Header */}
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-indigo-50 p-2.5 rounded-lg">
                                <QrCode size={20} className="text-indigo-500" />
                            </div>
                            <h2 className="font-bold text-lg text-slate-800">สแกน QR เพื่อชำระเงิน</h2>
                        </div>
                        <p className="text-sm text-slate-400 mb-8">ใช้แอปธนาคารสแกน QR Code ด้านล่าง</p>

                        {/* QR Code */}
                        <div className="relative mb-8 group">
                            <div className="bg-white border-2 border-slate-200 p-4 rounded-2xl shadow-md group-hover:shadow-lg transition-shadow">
                                <div className="w-64 h-64 flex items-center justify-center">
                                    <img src={omiseQrUrl || ''} alt="PromptPay QR" className="w-full h-full object-contain" />
                                </div>
                            </div>
                        </div>

                        {/* Amount */}
                        <div className="w-full bg-slate-50 p-4 rounded-xl mb-6 flex justify-between items-center border border-slate-100">
                            <span className="text-slate-500 font-medium text-sm">ยอดชำระ</span>
                            <span className="text-2xl font-black text-slate-900">฿{total.toLocaleString()}</span>
                        </div>

                        {/* Waiting Status */}
                        <div className="flex items-center gap-3 text-slate-500 bg-slate-50 px-6 py-3 rounded-full mb-4">
                            <Loader2 size={16} className="animate-spin text-[#a4cc00]" />
                            <span className="text-sm font-bold uppercase tracking-widest">กำลังตรวจสอบรายการ...</span>
                        </div>

                        <button
                            onClick={() => setStatus('idle')}
                            className="mt-4 text-slate-400 text-sm font-medium hover:text-slate-600 transition-colors"
                        >
                            ยกเลิกรายการ
                        </button>

                        <div className="mt-8 flex items-center gap-2 opacity-30">
                            <ShieldCheck size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Secured by Omise</span>
                        </div>
                    </motion.div>
                </main>
            </div>
        );
    }

    // ============ CHECKOUT VIEW ============
    return (
        <div className="flex-1 overflow-y-auto min-h-screen bg-slate-50 font-sans text-slate-800 lg:pl-64">
            {/* Header */}
            <header className="bg-white px-6 py-4 sticky top-0 z-10 border-b border-slate-100 flex items-center shadow-sm">
                <button onClick={() => router.back()} className="mr-4 p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <ArrowLeft size={20} className="text-slate-600" />
                </button>
                <h1 className="text-xl font-bold text-slate-800 flex-1 text-center pr-10">ชำระเงิน</h1>
            </header>

            <main className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">

                {/* Delivery Address Section */}
                <section className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-slate-100 overflow-hidden relative group">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                        <div>
                            <h2 className="font-black text-2xl text-slate-900 flex items-center gap-3">
                                <div className="bg-[#a4cc00]/10 p-2 rounded-xl">
                                    <MapPin size={24} className="text-[#a4cc00]" />
                                </div>
                                ที่อยู่จัดส่ง
                            </h2>
                            <p className="text-[#a4cc00] font-bold text-sm mt-1 ml-12 animate-pulse">
                                {savedAddresses.length > 0 ? "← เลือกที่อยู่จัดส่งจากที่เคยบันทึกไว้" : "ระบุที่อยู่สำหรับจัดส่ง"}
                            </p>
                        </div>
                        
                        {savedAddresses.length > 0 && (
                            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar md:pb-0">
                                {savedAddresses.map((addr) => (
                                    <button
                                        key={addr.id}
                                        onClick={() => handleSelectAddress(addr)}
                                        className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap border-2 shadow-sm ${
                                            selectedAddressId === addr.id 
                                            ? 'bg-slate-900 text-[#ccff00] border-slate-900 scale-105' 
                                            : 'bg-white text-slate-600 border-slate-100 hover:border-[#a4cc00]'
                                        }`}
                                    >
                                        {addr.label === 'Home' ? <Home size={14} /> : addr.label === 'Work' ? <Briefcase size={14} /> : <MapPin size={14} />}
                                        {addr.label}
                                        {selectedAddressId === addr.id && (
                                            <Trash2 
                                                size={14} 
                                                className="ml-1 text-red-400 hover:text-red-500 transition-colors"
                                                onClick={(e) => handleDeleteAddress(e, addr.id)}
                                            />
                                        )}
                                    </button>
                                ))}
                                {savedAddresses.length < 3 && (
                                    <button
                                        onClick={() => {
                                            setSelectedAddressId(null);
                                            setDeliveryAddress('');
                                            setContactPhone('');
                                        }}
                                        className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold border-2 border-dashed border-slate-200 text-slate-400 hover:border-[#a4cc00] hover:text-[#a4cc00] transition-all whitespace-nowrap"
                                    >
                                        <Plus size={14} />
                                        ระบุใหม่
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-1">
                        <div className="space-y-3">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <MapPin size={12} /> ข้อมูลที่อยู่
                            </label>
                            <textarea
                                placeholder="กรอกที่อยู่สำหรับจัดส่ง..."
                                value={deliveryAddress}
                                onChange={(e) => {
                                    setDeliveryAddress(e.target.value);
                                    if (selectedAddressId) setSelectedAddressId(null);
                                }}
                                className={`w-full bg-slate-50 border-2 rounded-2xl p-5 text-sm font-bold text-slate-800 focus:outline-none focus:bg-white transition-all min-h-[120px] shadow-inner resize-none ${showValidation && !deliveryAddress ? 'border-red-400' : 'border-slate-100 focus:border-[#a4cc00]'}`}
                            />
                        </div>
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <Zap size={12} /> เบอร์โทรศัพท์ติดต่อ
                                </label>
                                <input
                                    type="tel"
                                    placeholder="0XX-XXX-XXXX"
                                    value={contactPhone}
                                    onChange={(e) => {
                                        setContactPhone(e.target.value);
                                        if (selectedAddressId) setSelectedAddressId(null);
                                    }}
                                    className={`w-full bg-slate-50 border-2 rounded-2xl px-6 py-5 text-sm font-bold text-slate-800 focus:outline-none focus:bg-white transition-all shadow-inner ${showValidation && !contactPhone ? 'border-red-400' : 'border-slate-100 focus:border-[#a4cc00]'}`}
                                />
                            </div>

                            {!selectedAddressId && savedAddresses.length < 3 && (
                                <motion.div 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="bg-slate-50 p-4 rounded-2xl border border-slate-100"
                                >
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative">
                                            <input 
                                                type="checkbox" 
                                                checked={saveToProfile}
                                                onChange={(e) => setSaveToProfile(e.target.checked)}
                                                className="sr-only"
                                            />
                                            <div className={`w-10 h-6 rounded-full transition-colors ${saveToProfile ? 'bg-[#a4cc00]' : 'bg-slate-300'}`}></div>
                                            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${saveToProfile ? 'translate-x-4' : ''}`}></div>
                                        </div>
                                        <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">บันทึกที่อยู่นี้ไว้ใช้ตอนหลัง</span>
                                    </label>
                                    
                                    {saveToProfile && (
                                        <div className="mt-4 flex gap-2">
                                            {['Home', 'Work', 'Other'].map(l => (
                                                <button
                                                    key={l}
                                                    onClick={() => setAddressLabel(l)}
                                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                                                        addressLabel === l 
                                                        ? 'bg-slate-900 text-white shadow-md' 
                                                        : 'bg-white text-slate-400 border border-slate-100 hover:border-slate-300'
                                                    }`}
                                                >
                                                    {l}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Order Items Section */}
                <section className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                    <h2 className="font-bold text-lg text-slate-800 mb-4">สรุปรายการสั่งซื้อ</h2>
                    <div className="space-y-4">
                        {items.map(item => (
                            <div key={item.menuItemId} className="flex items-center gap-4">
                                <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-xl object-cover bg-slate-100 shadow-sm" />
                                <div className="flex-1">
                                    <h3 className="font-bold text-sm text-slate-800 line-clamp-1">{item.name}</h3>
                                    <div className="text-[#a4cc00] font-bold text-sm">฿{item.price.toLocaleString()}</div>
                                </div>
                                <div className="text-sm font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                                    x{item.quantity}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Payment Method - PromptPay Only */}
                <section className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                    <h2 className="font-bold text-lg text-slate-800 mb-4">วิธีการชำระเงิน</h2>
                    <div className="flex items-center justify-between p-4 rounded-xl border-2 border-[#a4cc00] bg-lime-50/30">
                        <div className="flex items-center gap-3">
                            <div className="bg-indigo-50 p-2.5 rounded-lg"><Wallet size={20} className="text-indigo-500" /></div>
                            <div>
                                <div className="font-bold text-sm text-slate-800">พร้อมเพย์ QR (Omise)</div>
                                <div className="text-xs text-slate-500 font-medium">สแกน QR Code ผ่านแอปธนาคาร</div>
                            </div>
                        </div>
                        <div className="w-5 h-5 rounded-full border-2 border-[#a4cc00] bg-[#a4cc00] flex items-center justify-center">
                            <CheckCircle2 size={12} className="text-white" />
                        </div>
                    </div>
                </section>

                {/* Payment Summary + Place Order */}
                <section className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                    <h2 className="font-bold text-lg text-slate-800 mb-4">สรุปการชำระเงิน</h2>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 font-medium">ราคารวม</span>
                            <span className="font-bold text-slate-800">฿{subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 font-medium">ค่าจัดส่ง</span>
                            <span className="font-bold text-slate-800">฿{deliveryFee}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[#a4cc00] font-medium flex items-center gap-1">ส่วนลด <span className="text-xs bg-lime-100 text-lime-800 px-2 rounded-md">โปรโมชั่น</span></span>
                            <span className="font-bold text-[#a4cc00]">-฿{discount}</span>
                        </div>
                        <div className="w-full h-px bg-slate-100 my-2"></div>
                        <div className="flex justify-between items-center text-lg">
                            <span className="font-bold text-slate-800">ยอดรวมทั้งหมด</span>
                            <span className="font-black text-slate-900">฿{total.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Error */}
                    {status === 'error' && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600">
                            <AlertCircle size={18} />
                            <p className="text-sm font-medium">{errorMessage}</p>
                        </div>
                    )}

                    <button
                        onClick={handlePlaceOrder}
                        disabled={status === 'creating'}
                        className="mt-6 w-full bg-slate-900 hover:bg-black text-[#ccff00] font-bold text-base py-4 rounded-2xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {status === 'creating' ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                กำลังสร้างรายการ...
                            </>
                        ) : (
                            <>
                                สั่งซื้อและชำระเงิน <ChevronRight size={18} />
                            </>
                        )}
                    </button>
                </section>
            </main>
        </div>
    );
}