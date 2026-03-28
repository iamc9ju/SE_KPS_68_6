"use client";

import React, { useState, useEffect } from 'react';
import { 
    Package, 
    Clock, 
    CheckCircle2, 
    ChevronRight, 
    Search, 
    Filter, 
    CreditCard, 
    Wallet, 
    ExternalLink, 
    AlertCircle, 
    Loader2,
    Calendar,
    MapPin,
    Phone,
    ArrowRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

type OrderStatus = 'pending' | 'accepted' | 'shipping' | 'delivered' | 'cancelled';
type PaymentStatus = 'UNPAID' | 'PAID';

interface OrderItem {
    orderItemId: string;
    menuItemId: number;
    name: string;
    imageUrl: string;
    quantity: number;
    priceAtOrder: number;
    totalPrice: number;
}

interface Order {
    orderId: string;
    totalAmount: number;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    deliveryAddress: string;
    contactPhone: string;
    qrCodeUrl?: string;
    createdAt: string;
    items: OrderItem[];
}

const statusConfig = {
    pending: { label: 'รอการยืนยัน', color: 'bg-amber-100 text-amber-600', icon: Clock },
    accepted: { label: 'กำลังเตรียมอาหาร', color: 'bg-blue-100 text-blue-600', icon: Package },
    shipping: { label: 'กำลังจัดส่ง', color: 'bg-indigo-100 text-indigo-600', icon: MapPin },
    delivered: { label: 'จัดส่งสำเร็จ', color: 'bg-emerald-100 text-emerald-600', icon: CheckCircle2 },
    cancelled: { label: 'ยกเลิกแล้ว', color: 'bg-slate-100 text-slate-500', icon: AlertCircle },
};

import { useAuthStore } from '@/store/auth-store';
import FoodPartnerOrders from '@/components/dashboard/FoodPartnerOrders';

export default function OrdersPage() {
    const { user } = useAuthStore();
    const router = useRouter();

    if (user?.role === "food_partner") {
        return <FoodPartnerOrders />;
    }

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | OrderStatus | 'unpaid'>('all');
    const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
    const [qrModalOrder, setQrModalOrder] = useState<Order | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    // Polling logic for QR Modal if open
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (qrModalOrder) {
            interval = setInterval(async () => {
                try {
                    const res = await api.get(`/orders/${qrModalOrder.orderId}/check-payment`);
                    const data = res.data?.data || res.data;
                    if (data?.paymentStatus === 'PAID') {
                        setQrModalOrder(null);
                        fetchOrders();
                    }
                } catch (err) {
                    console.error('Polling error:', err);
                }
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [qrModalOrder]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await api.get('/orders');
            // Backend wraps in { success: true, data: [] }
            const data = res.data?.data || res.data || [];
            setOrders(data);
        } catch (err) {
            console.error('Failed to fetch orders:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredOrders = orders.filter(order => {
        if (filter === 'all') return true;
        if (filter === 'unpaid') return order.paymentStatus === 'UNPAID';
        return order.status === filter;
    });

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-screen bg-slate-50 lg:pl-64">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-[#a4cc00]" />
                    <p className="text-slate-400 font-medium">กำลังโหลดข้อมูลรายการสั่งซื้อ...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 min-h-screen bg-slate-50 lg:pl-64 pb-20">
            {/* Header */}
            <header className="bg-white px-8 py-10 border-b border-slate-100 sticky top-0 z-10 shadow-sm">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-3xl font-black text-slate-900 mb-2">ประวัติการสั่งซื้อ</h1>
                    <p className="text-slate-500 font-medium">ติดตามและตรวจสอบรายการอาหารที่คุณเคยสั่งทั้งหมด</p>
                    
                    {/* Filters */}
                    <div className="flex gap-2 mt-8 overflow-x-auto pb-2 scrollbar-none">
                        {[
                            { id: 'all', label: 'ทั้งหมด' },
                            { id: 'unpaid', label: 'รอการชำระเงิน' },
                            { id: 'accepted', label: 'กำลังเตรียม' },
                            { id: 'shipping', label: 'กำลังจัดส่ง' },
                            { id: 'delivered', label: 'สำเร็จแล้ว' },
                        ].map((btn) => (
                            <button
                                key={btn.id}
                                onClick={() => setFilter(btn.id as any)}
                                className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                                    filter === btn.id 
                                    ? 'bg-[#a4cc00] text-white shadow-md' 
                                    : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'
                                }`}
                            >
                                {btn.label}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto p-6 md:p-8">
                {filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-[32px] p-16 text-center shadow-sm border border-slate-100 mt-10">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Package size={40} className="text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">ไม่พบรายการสั่งซื้อ</h3>
                        <p className="text-slate-400 font-medium max-w-xs mx-auto">คุณยังไม่มีรายการสั่งซื้อในหมวดหมู่นี้ ลองเลือกดูเมนูสุขภาพของเราสิ!</p>
                        <button 
                            onClick={() => router.push('/dashboard/healthymenu')}
                            className="mt-8 bg-[#a4cc00] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#92b500] transition-colors shadow-lg"
                        >
                            สั่งอาหารเลย
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {filteredOrders.map((order) => {
                            const status = statusConfig[order.status] || statusConfig.pending;
                            const mainItem = order.items[0];
                            const othersCount = order.items.length - 1;

                            return (
                                <motion.div
                                    layout
                                    key={order.orderId}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group cursor-pointer"
                                    onClick={() => setSelectedOrder(selectedOrder === order.orderId ? null : order.orderId)}
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        {/* Left: Info & Items Preview */}
                                        <div className="flex gap-4 flex-1">
                                            <div className="relative">
                                                <img 
                                                    src={mainItem.imageUrl} 
                                                    className="w-20 h-20 rounded-2xl object-cover bg-slate-100 shadow-sm"
                                                    alt={mainItem.name}
                                                />
                                                {order.paymentStatus === 'UNPAID' && (
                                                    <div className="absolute -top-2 -right-2 bg-amber-400 text-white p-1 rounded-full shadow-sm animate-pulse">
                                                        <Wallet size={12} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">
                                                        #{order.orderId.slice(-6)}
                                                    </span>
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${status.color}`}>
                                                        {status.label}
                                                    </span>
                                                    {order.paymentStatus === 'PAID' && (
                                                        <span className="bg-emerald-50 text-emerald-500 px-3 py-1 rounded-full text-[10px] font-bold">
                                                            ชำระเงินแล้ว
                                                        </span>
                                                    )}
                                                </div>
                                                <h3 className="font-bold text-slate-900 group-hover:text-[#a4cc00] transition-colors line-clamp-1">
                                                    {mainItem.name} {othersCount > 0 && `(และอีก ${othersCount} รายการ)`}
                                                </h3>
                                                <div className="flex items-center gap-4 mt-2 text-xs font-medium text-slate-400">
                                                    <span className="flex items-center gap-1.5"><Calendar size={12} /> {formatDate(order.createdAt)}</span>
                                                    <span className="hidden md:flex items-center gap-1.5"><MapPin size={12} /> {order.deliveryAddress.slice(0, 20)}...</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right: Price & Action */}
                                        <div className="flex items-center justify-between md:flex-col md:items-end gap-2 md:pl-6 md:border-l border-slate-50 min-w-[140px]">
                                            <div className="text-2xl font-black text-slate-900">
                                                ฿{order.totalAmount.toLocaleString()}
                                            </div>
                                            
                                            {order.paymentStatus === 'UNPAID' ? (
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setQrModalOrder(order);
                                                    }}
                                                    className="bg-amber-400 hover:bg-amber-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2"
                                                >
                                                    จ่ายเงิน <ArrowRight size={14} />
                                                </button>
                                            ) : (
                                                <div className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                                    ดูรายละเอียด <ChevronRight size={14} />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Expandable Details */}
                                    <AnimatePresence>
                                        {selectedOrder === order.orderId && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="mt-8 pt-8 border-t border-slate-100 space-y-6">
                                                    {/* Items List */}
                                                    <div className="space-y-4">
                                                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">รายการอาหาร</h4>
                                                        {order.items.map((item) => (
                                                            <div key={item.orderItemId} className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl">
                                                                <div className="flex items-center gap-3">
                                                                    <img src={item.imageUrl} className="w-10 h-10 rounded-xl object-cover" alt="" />
                                                                    <div>
                                                                        <p className="text-sm font-bold text-slate-800">{item.name}</p>
                                                                        <p className="text-[10px] text-slate-400">จำนวน x{item.quantity}</p>
                                                                    </div>
                                                                </div>
                                                                <p className="text-sm font-bold text-slate-900">฿{item.totalPrice.toLocaleString()}</p>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Delivery Info */}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="bg-slate-50 p-4 rounded-2xl">
                                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">ที่อยู่จัดส่ง</h4>
                                                            <p className="text-sm font-medium text-slate-700 leading-relaxed">{order.deliveryAddress}</p>
                                                        </div>
                                                        <div className="bg-slate-50 p-4 rounded-2xl">
                                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">ข้อมูลติดต่อ</h4>
                                                            <p className="text-sm font-medium text-slate-700 flex items-center gap-2"><Phone size={14} className="text-[#a4cc00]" /> {order.contactPhone}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </main>

            {/* QR Payment Modal */}
            <AnimatePresence>
                {qrModalOrder && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-0">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setQrModalOrder(null)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-[32px] w-full max-w-sm overflow-hidden relative shadow-2xl"
                        >
                            <div className="p-8 flex flex-col items-center">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="bg-indigo-50 p-2 rounded-lg">
                                        <CreditCard size={18} className="text-indigo-500" />
                                    </div>
                                    <h3 className="font-bold text-slate-800">ชำระเงินผ่าน PromptPay</h3>
                                </div>

                                <div className="bg-white border-2 border-slate-100 p-3 rounded-2xl mb-6 shadow-sm">
                                    <img 
                                        src={qrModalOrder.qrCodeUrl} 
                                        alt="Order QR" 
                                        className="w-48 h-48 object-contain"
                                    />
                                </div>

                                <div className="w-full bg-slate-50 p-4 rounded-2xl mb-6 flex justify-between items-center">
                                    <span className="text-slate-400 text-xs font-bold uppercase">ยอดชำระ</span>
                                    <span className="text-xl font-black text-slate-900">฿{qrModalOrder.totalAmount.toLocaleString()}</span>
                                </div>

                                <div className="flex items-center gap-2 text-slate-400 mb-8">
                                    <Loader2 size={14} className="animate-spin text-[#a4cc00]" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">กำลังตรวจสอบสถานะ...</span>
                                </div>

                                <button
                                    onClick={() => setQrModalOrder(null)}
                                    className="text-slate-400 hover:text-slate-600 text-xs font-bold uppercase tracking-widest transition-colors"
                                >
                                    ปิดหน้านี้
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
