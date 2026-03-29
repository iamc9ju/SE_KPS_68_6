"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
    Package, 
    Clock, 
    CheckCircle2, 
    ChevronRight, 
    CreditCard, 
    Wallet, 
    AlertCircle, 
    Loader2,
    LayoutGrid,
    ChevronLeft,
    TrendingUp,
    Activity,
    CreditCard as PaymentIcon,
    Calendar,
    MapPin,
    Phone,
    ArrowRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import { Order, OrderStatus, canTrackOrder, unwrapOrderList } from '@/lib/orders';
import { useAuthStore } from '@/store/auth-store';
import FoodPartnerOrders from '@/components/dashboard/FoodPartnerOrders';

type FilterOption = {
    id: 'all' | OrderStatus | 'unpaid';
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
};

const statusConfig = {
    pending: { label: 'รอการยืนยัน', color: 'bg-amber-100 text-[#3d3522]', icon: Clock },
    accepted: { label: 'รับออเดอร์แล้ว', color: 'bg-blue-100 text-[#3d3522]', icon: CheckCircle2 },
    preparing: { label: 'กำลังเตรียมอาหาร', color: 'bg-orange-100 text-[#3d3522]', icon: Package },
    ready: { label: 'เตรียมอาหารเสร็จแล้ว รอการจัดส่ง', color: 'bg-emerald-100 text-[#3d3522]', icon: CheckCircle2 },
    delivering: { label: 'กำลังจัดส่ง', color: 'bg-indigo-100 text-[#3d3522]', icon: MapPin },
    shipping: { label: 'กำลังจัดส่ง', color: 'bg-indigo-100 text-[#3d3522]', icon: MapPin }, // Compatibility
    delivered: { label: 'จัดส่งสำเร็จ', color: 'bg-emerald-100 text-[#3d3522]', icon: CheckCircle2 },
    cancelled: { label: 'ยกเลิกแล้ว', color: 'bg-slate-100 text-[#3d3522]', icon: AlertCircle },
};

export default function OrdersPage() {
    const { user } = useAuthStore();
    const router = useRouter();
    const isFoodPartner = user?.role === "food_partner";
    const isPatient = user?.role === "patient";
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | OrderStatus | 'unpaid'>('all');
    const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
    const [qrModalOrder, setQrModalOrder] = useState<Order | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 6;

    const fetchOrders = async () => {
        if (!isPatient) return;
        try {
            setLoading(true);
            const res = await api.get('/orders');
            setOrders(unwrapOrderList(res.data));
            setErrorMessage(null);
        } catch {
            setOrders([]);
            setErrorMessage('ยังโหลดรายการสั่งซื้อไม่ได้ กรุณาตรวจสอบว่า backend กำลังรันอยู่ แล้วลองรีเฟรชอีกครั้ง');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [isPatient]);

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
                } catch {
                    setErrorMessage('ยังตรวจสอบสถานะการชำระเงินไม่ได้ในขณะนี้');
                }
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [qrModalOrder]);


    const filteredOrders = orders.filter(order => {
        if (filter === 'all') return true;
        if (filter === 'unpaid') return order.paymentStatus === 'UNPAID';
        return order.status === filter;
    });

    // Reset pagination when filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [filter]);

    // Scroll to top when page changes
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [currentPage]);

    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
    const paginatedOrders = filteredOrders.slice(
        (currentPage - 1) * ordersPerPage,
        currentPage * ordersPerPage
    );

    // Statistics Calculation
    const stats = {
        totalOrders: orders.length,
        totalSpent: orders
            .filter(o => o.paymentStatus === 'PAID')
            .reduce((sum, o) => sum + o.totalAmount, 0),
        pendingPayment: orders
            .filter(o => o.paymentStatus === 'UNPAID')
            .reduce((sum, o) => sum + o.totalAmount, 0),
        pendingCount: orders.filter(o => o.paymentStatus === 'UNPAID').length
    };

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

    if (isFoodPartner) {
        return <FoodPartnerOrders />;
    }

    if (!isPatient) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-screen bg-[#fffbf5] lg:pl-64">
                <div className="bg-white rounded-[48px] p-20 text-center shadow-sm border border-gray-100 max-w-2xl mx-10">
                    <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
                        <AlertCircle size={48} className="text-red-400" />
                    </div>
                    <h3 className="text-2xl font-black text-[#3d3522] mb-3">เข้าถึงไม่ได้</h3>
                    <p className="text-[#3d3522] font-bold mb-10 text-lg leading-relaxed">
                        ขออภัย หน้านี้สำหรับผู้ใช้งานในกลุ่ม "คนไข้" หรือ "ร้านค้าอาหาร" เท่านั้น
                    </p>
                    <button 
                        onClick={() => router.push('/dashboard')}
                        className="bg-[#3d3522] text-white px-12 py-5 rounded-[24px] font-black hover:bg-[#2d2618] transition-all shadow-xl active:scale-95 text-lg"
                    >
                        กลับไปหน้าหลัก
                    </button>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-screen bg-[#fffbf5] lg:pl-64">
                <div className="flex flex-col items-center gap-6">
                    <Loader2 className="w-16 h-16 animate-spin text-[#C6E065]" />
                    <p className="text-[#3d3522] font-black uppercase tracking-widest text-xs">กำลังโหลดรายการสั่งซื้อ...</p>
                </div>
            </div>
        );
    }

    return (
        <div 
            ref={scrollContainerRef}
            className="flex-1 h-screen overflow-y-auto bg-[#fffbf5] lg:pl-64 scroll-smooth"
        >
            <main className="max-w-6xl mx-auto p-6 md:p-12 pb-32">
                {/* Header Inline */}
                <header className="mb-12">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-[#C6E065]/20 rounded-2xl">
                            <Package className="w-8 h-8 text-[#3d3522]" />
                        </div>
                        <h1 className="text-4xl font-black text-[#3d3522]">ประวัติการสั่งซื้อ</h1>
                    </div>
                    <p className="text-[#3d3522] font-medium text-lg">ติดตามสถานะและตรวจสอบรายการอาหารสุขภาพที่คุณสั่ง</p>
                    
                    {/* Stats Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                        <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-shadow group flex items-center gap-6">
                            <div className="p-5 bg-blue-50 text-blue-600 rounded-[28px] group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <Activity size={28} />
                            </div>
                            <div>
                                <p className="text-[11px] font-black text-[#3d3522] uppercase tracking-[0.2em] mb-1">คำสั่งซื้อทั้งหมด</p>
                                <p className="text-3xl font-black text-[#3d3522]">{stats.totalOrders}</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-shadow group flex items-center gap-6">
                            <div className="p-5 bg-[#C6E065]/20 text-[#3d3522] rounded-[28px] group-hover:bg-[#C6E065] transition-colors">
                                <TrendingUp size={28} />
                            </div>
                            <div>
                                <p className="text-[11px] font-black text-[#3d3522] uppercase tracking-[0.2em] mb-1">ยอดการใช้จ่ายทั้งหมด</p>
                                <p className="text-3xl font-black text-[#3d3522]">฿{stats.totalSpent.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-shadow group flex items-center gap-6">
                            <div className="p-5 bg-amber-50 text-amber-600 rounded-[28px] group-hover:bg-amber-600 group-hover:text-white transition-colors">
                                <PaymentIcon size={28} />
                            </div>
                            <div>
                                <p className="text-[11px] font-black text-[#3d3522] uppercase tracking-[0.2em] mb-1">ยอดรอการชำระเงิน</p>
                                <p className="text-3xl font-black text-[#3d3522]">฿{stats.pendingPayment.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Filters - Modern Chips */}
                    <div className="flex gap-3 mt-10 overflow-x-auto pb-4 no-scrollbar">
                        {([
                            { id: 'all', label: 'ทั้งหมด', icon: LayoutGrid },
                            { id: 'unpaid', label: 'ค้างชำระ', icon: Wallet },
                            { id: 'accepted', label: 'กำลังเตรียม', icon: Clock },
                            { id: 'shipping', label: 'กำลังส่ง', icon: MapPin },
                            { id: 'delivered', label: 'สำเร็จแล้ว', icon: CheckCircle2 },
                        ] as FilterOption[]).map((btn) => (
                            <button
                                key={btn.id}
                                onClick={() => setFilter(btn.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black whitespace-nowrap transition-all border-2 ${
                                    filter === btn.id 
                                    ? 'bg-[#3d3522] text-white border-[#3d3522] shadow-xl scale-105' 
                                    : 'bg-white text-[#3d3522] border-gray-100 hover:border-[#C6E065]'
                                }`}
                            >
                                <btn.icon size={16} />
                                {btn.label}
                            </button>
                        ))}
                    </div>
                </header>

                {errorMessage && (
                    <div className="mb-8 rounded-[28px] border border-[#ffd7cf] bg-[#fff1ed] px-6 py-5 text-sm font-bold text-[#b55239] shadow-sm">
                        {errorMessage}
                    </div>
                )}

                {filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-[48px] p-20 text-center shadow-sm border border-gray-100 mt-8">
                        <div className="w-24 h-24 bg-[#fffbf5] rounded-full flex items-center justify-center mx-auto mb-8">
                            <Package size={48} className="text-[#C6E065]" />
                        </div>
                        <h3 className="text-2xl font-black text-[#3d3522] mb-3">ยังไม่มีรายการสั่งซื้อ</h3>
                        <p className="text-[#3d3522] font-bold max-w-sm mx-auto mb-10 text-lg leading-relaxed">
                            ดูเหมือนว่าคุณจะยังไม่มีรายการสั่งซื้อในหมวดนี้ ลองดูเมนูแนะนำของเราสิ!
                        </p>
                        <button 
                            onClick={() => router.push('/dashboard/healthymenu')}
                            className="bg-[#C6E065] text-[#3d3522] px-12 py-5 rounded-[24px] font-black hover:bg-[#b0cc5a] transition-all shadow-xl hover:shadow-[#C6E065]/20 active:scale-95 text-lg"
                        >
                            เลือกเมนูสุขภาพเลย
                        </button>
                    </div>
                ) : (
                    <div className="mt-12">
                        {/* Desktop Table View */}
                        <div className="hidden lg:block bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50 border-b border-gray-50">
                                    <tr>
                                        <th className="px-8 py-6 text-[11px] font-black text-[#3d3522] uppercase tracking-widest">รหัสสั่งซื้อ</th>
                                        <th className="px-8 py-6 text-[11px] font-black text-[#3d3522] uppercase tracking-widest">วันที่</th>
                                        <th className="px-8 py-6 text-[11px] font-black text-[#3d3522] uppercase tracking-widest">รายการอาหาร</th>
                                        <th className="px-8 py-6 text-[11px] font-black text-[#3d3522] uppercase tracking-widest text-right">ยอดสุทธิ</th>
                                        <th className="px-8 py-6 text-[11px] font-black text-[#3d3522] uppercase tracking-widest text-center">สถานะ</th>
                                        <th className="px-8 py-6 text-[11px] font-black text-[#3d3522] uppercase tracking-widest text-right">ตัวเลือก</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {paginatedOrders.map((order) => {
                                        const status = statusConfig[order.status] || statusConfig.pending;
                                        const mainItem = order.items[0];
                                        const othersCount = order.items.length - 1;
                                        const trackingHref = `/dashboard/tracking?orderId=${encodeURIComponent(order.orderId)}`;
                                        
                                        return (
                                            <React.Fragment key={order.orderId}>
                                                <tr 
                                                    onClick={() => setSelectedOrder(selectedOrder === order.orderId ? null : order.orderId)}
                                                    className="group cursor-pointer hover:bg-gray-50/30 transition-colors"
                                                >
                                                    <td className="px-8 py-6">
                                                        <span className="text-[11px] font-black text-[#3d3522] tracking-[0.2em] bg-gray-50 px-3 py-1 rounded-lg">#{order.orderId.slice(-6)}</span>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <p className="text-sm font-bold text-[#3d3522]">{formatDate(order.createdAt).split('เวลา')[0]}</p>
                                                        <p className="text-[10px] font-bold text-[#3d3522]/40 mt-0.5">{formatDate(order.createdAt).split('เวลา')[1]}</p>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="relative">
                                                                {mainItem?.imageUrl ? (
                                                                    <img src={mainItem.imageUrl} className="w-12 h-12 rounded-2xl object-cover bg-gray-50 shadow-inner" alt={mainItem.name} />
                                                                ) : (
                                                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 shadow-inner">
                                                                        <Package size={18} className="text-[#3d3522]/30" />
                                                                    </div>
                                                                )}
                                                                {order.paymentStatus === 'UNPAID' && (
                                                                    <div className="absolute -top-1.5 -right-1.5 bg-amber-400 text-white p-1 rounded-lg shadow-lg">
                                                                        <Wallet size={10} />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-black text-[#3d3522] line-clamp-1">{mainItem?.name || 'ไม่มีรายการอาหาร'}</p>
                                                                {othersCount > 0 && <p className="text-[10px] font-bold text-[#3d3522]/40 mt-0.5">และอีก {othersCount} รายการ</p>}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <span className="text-lg font-black text-[#3d3522]">฿{order.totalAmount.toLocaleString()}</span>
                                                    </td>
                                                    <td className="px-8 py-6 text-center">
                                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-2 ${status.color}`}>
                                                            <status.icon size={12} />
                                                            {status.label}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <div className="flex items-center justify-end">
                                                            {order.paymentStatus === 'UNPAID' ? (
                                                                <button 
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setQrModalOrder(order);
                                                                    }}
                                                                    className="bg-amber-400 hover:bg-amber-500 text-[#3d3522] px-5 py-2.5 rounded-xl font-black transition-all flex items-center gap-2 text-[11px] shadow-lg shadow-amber-400/20 active:scale-95"
                                                                >
                                                                    ชำระเงิน <ArrowRight size={14} />
                                                                </button>
                                                            ) : canTrackOrder(order) ? (
                                                                <Link
                                                                    href={trackingHref}
                                                                    onClick={(e) => e.stopPropagation()}
                                                                    className="bg-[#3d3522] hover:bg-[#2d2618] text-white px-5 py-2.5 rounded-xl font-black transition-all flex items-center gap-2 text-[11px] shadow-lg shadow-[#3d3522]/15 active:scale-95"
                                                                >
                                                                    ติดตามออเดอร์ <MapPin size={14} />
                                                                </Link>
                                                            ) : (
                                                                <div className="flex items-center gap-2 text-[#3d3522] text-[11px] font-black uppercase tracking-widest group-hover:translate-x-1 transition-transform opacity-40 group-hover:opacity-100">
                                                                    ดูรายละเอียด <ChevronRight size={16} />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                                <AnimatePresence>
                                                    {selectedOrder === order.orderId && (
                                                        <tr>
                                                            <td colSpan={6} className="p-0 bg-[#fffbf5]">
                                                                <motion.div
                                                                    initial={{ height: 0, opacity: 0 }}
                                                                    animate={{ height: 'auto', opacity: 1 }}
                                                                    exit={{ height: 0, opacity: 0 }}
                                                                    className="overflow-hidden"
                                                                >
                                                                    <div className="p-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
                                                                        <div className="space-y-6">
                                                                            <h4 className="text-[11px] font-black text-[#3d3522]/30 uppercase tracking-[0.3em] pl-1">สรุปรายการสั่งซื้อ</h4>
                                                                            <div className="border-t-2 border-dashed border-gray-100 pt-6 grid gap-4">
                                                                                {order.items.map(item => (
                                                                                    <div key={item.orderItemId} className="flex justify-between items-center bg-white p-5 rounded-3xl border border-gray-100 shadow-sm group/item hover:border-[#C6E065] transition-colors">
                                                                                        <div className="flex items-center gap-5">
                                                                                            <img src={item.imageUrl} className="w-14 h-14 rounded-2xl object-cover shadow-inner bg-gray-50" alt="" />
                                                                                            <div>
                                                                                                <p className="text-base font-black text-[#3d3522]">{item.name}</p>
                                                                                                <p className="text-xs font-bold text-[#3d3522]/40 mt-0.5">จำนวน x{item.quantity}</p>
                                                                                            </div>
                                                                                        </div>
                                                                                        <span className="text-lg font-black text-[#3d3522]">฿{item.totalPrice.toLocaleString()}</span>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                        <div className="space-y-8">
                                                                            <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm">
                                                                                <h4 className="text-[11px] font-black text-[#3d3522]/30 uppercase tracking-[0.3em] mb-6">ที่อยู่และการติดต่อ</h4>
                                                                                <div className="flex items-start gap-4 mb-8">
                                                                                    <div className="p-3 bg-[#fffbf5] rounded-2xl text-[#C6E065]">
                                                                                        <MapPin size={24} />
                                                                                    </div>
                                                                                    <div>
                                                                                        <p className="text-[10px] font-black text-[#3d3522]/20 uppercase tracking-widest mb-1">จัดส่งที่</p>
                                                                                        <p className="text-sm font-bold text-[#3d3522] leading-relaxed">{order.deliveryAddress}</p>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="flex items-center gap-4">
                                                                                    <div className="p-3 bg-[#C6E065]/10 rounded-2xl text-[#3d3522]">
                                                                                        <Phone size={24} />
                                                                                    </div>
                                                                                    <div>
                                                                                        <p className="text-[10px] font-black text-[#3d3522]/20 uppercase tracking-widest mb-1">เบอร์โทรศัพท์</p>
                                                                                        <p className="text-lg font-black text-[#3d3522]">{order.contactPhone}</p>
                                                                                    </div>
                                                                                </div>
                                                                                {canTrackOrder(order) && (
                                                                                    <Link
                                                                                        href={`/dashboard/tracking?orderId=${encodeURIComponent(order.orderId)}`}
                                                                                        onClick={(e) => e.stopPropagation()}
                                                                                        className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#f4f8df] px-5 py-3 text-sm font-black text-[#3d3522] transition hover:bg-[#e8f1c2]"
                                                                                    >
                                                                                        ติดตามออเดอร์นี้ <MapPin size={16} />
                                                                                    </Link>
                                                                                )}
                                                                            </div>
                                                                            
                                                                            <div className="px-8 py-6 bg-[#3d3522] rounded-[32px] text-white flex justify-between items-center shadow-2xl shadow-[#3d3522]/20">
                                                                                <div>
                                                                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-1">ราคารวมทั้งหมด</p>
                                                                                    <p className="text-3xl font-black">฿{order.totalAmount.toLocaleString()}</p>
                                                                                </div>
                                                                                <div className="text-right">
                                                                                    <p className="text-[11px] font-black uppercase tracking-widest mb-1 opacity-40">สถานะ</p>
                                                                                    <p className="text-sm font-black uppercase text-[#C6E065]">{status.label}</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </motion.div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </AnimatePresence>
                                            </React.Fragment>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View (Fallback) */}
                        <div className="lg:hidden grid gap-6">
                            {paginatedOrders.map((order) => {
                                const status = statusConfig[order.status] || statusConfig.pending;
                                const mainItem = order.items[0];
                                
                                return (
                                    <div 
                                        key={`mobile-${order.orderId}`}
                                        className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm active:scale-[0.98] transition-all"
                                        onClick={() => setSelectedOrder(selectedOrder === order.orderId ? null : order.orderId)}
                                    >
                                        <div className="flex justify-between items-start mb-6">
                                            <span className="text-[11px] font-black text-[#3d3522] tracking-[0.2em] bg-gray-50 px-3 py-1 rounded-lg">#{order.orderId.slice(-6)}</span>
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${status.color}`}>
                                                {status.label}
                                            </span>
                                        </div>
                                        <div className="flex gap-6 mb-8">
                                            <div className="relative">
                                                {mainItem?.imageUrl ? (
                                                    <img src={mainItem.imageUrl} className="w-20 h-20 rounded-3xl object-cover shadow-inner bg-gray-50" alt={mainItem.name} />
                                                ) : (
                                                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gray-50 shadow-inner">
                                                        <Package size={24} className="text-[#3d3522]/30" />
                                                    </div>
                                                )}
                                                {order.paymentStatus === 'UNPAID' && (
                                                    <div className="absolute -top-2 -right-2 bg-amber-400 text-white p-2 rounded-xl shadow-lg">
                                                        <Wallet size={12} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-xl font-black text-[#3d3522] line-clamp-2 leading-tight mb-2">{mainItem?.name || 'ไม่มีรายการอาหาร'}</h3>
                                                <p className="text-2xl font-black text-[#3d3522]">฿{order.totalAmount.toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div className="mb-6 flex items-center justify-end">
                                            {order.paymentStatus === 'UNPAID' ? (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setQrModalOrder(order);
                                                    }}
                                                    className="bg-amber-400 hover:bg-amber-500 text-[#3d3522] px-5 py-2.5 rounded-xl font-black transition-all flex items-center gap-2 text-[11px] shadow-lg shadow-amber-400/20 active:scale-95"
                                                >
                                                    ชำระเงิน <ArrowRight size={14} />
                                                </button>
                                            ) : canTrackOrder(order) ? (
                                                <Link
                                                    href={`/dashboard/tracking?orderId=${encodeURIComponent(order.orderId)}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="bg-[#3d3522] hover:bg-[#2d2618] text-white px-5 py-2.5 rounded-xl font-black transition-all flex items-center gap-2 text-[11px] shadow-lg shadow-[#3d3522]/15 active:scale-95"
                                                >
                                                    ติดตามออเดอร์ <MapPin size={14} />
                                                </Link>
                                            ) : null}
                                        </div>
                                        <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                            <div className="flex items-center gap-2 text-[#3d3522]/40">
                                                <Calendar size={14} />
                                                <span className="text-xs font-bold">{formatDate(order.createdAt).split('เวลา')[0]}</span>
                                            </div>
                                            <div className="text-[11px] font-black text-[#3d3522] uppercase tracking-[0.2em] flex items-center gap-2">
                                                {selectedOrder === order.orderId ? 'ปิด' : 'ดูรายละเอียด'} <ChevronRight size={16} className={`transition-transform ${selectedOrder === order.orderId ? 'rotate-90' : ''}`} />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination Bar */}
                        {totalPages > 1 && (
                            <div className="mt-16 flex items-center justify-center gap-4">
                                <button
                                    onClick={(e) => { e.stopPropagation(); setCurrentPage(p => Math.max(1, p - 1)); }}
                                    disabled={currentPage === 1}
                                    className="w-14 h-14 rounded-2xl border-2 border-gray-100 flex items-center justify-center text-[#3d3522] disabled:opacity-20 hover:border-[#C6E065] transition-all bg-white shadow-sm hover:shadow-lg active:scale-95"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                
                                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-[28px] border border-gray-100 shadow-sm">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                                        <button
                                            key={num}
                                            onClick={(e) => { e.stopPropagation(); setCurrentPage(num); }}
                                            className={`w-12 h-12 rounded-2xl text-sm font-black transition-all ${
                                                currentPage === num 
                                                ? 'bg-[#3d3522] text-white shadow-xl shadow-[#3d3522]/30 scale-110' 
                                                : 'text-[#3d3522] hover:bg-[#fffbf5] hover:text-[#3d3522]'
                                            }`}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={(e) => { e.stopPropagation(); setCurrentPage(p => Math.min(totalPages, p + 1)); }}
                                    disabled={currentPage === totalPages}
                                    className="w-14 h-14 rounded-2xl border-2 border-gray-100 flex items-center justify-center text-[#3d3522] disabled:opacity-20 hover:border-[#C6E065] transition-all bg-white shadow-sm hover:shadow-lg active:scale-95"
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* QR Payment Modal */}
            <AnimatePresence>
                {qrModalOrder && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setQrModalOrder(null)}
                            className="absolute inset-0 bg-[#3d3522]/80 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 40 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 40 }}
                            className="bg-[#fffbf5] rounded-[56px] w-full max-w-md overflow-hidden relative shadow-2xl border border-white/20"
                        >
                            <div className="p-12 flex flex-col items-center">
                                <div className="flex flex-col items-center gap-4 mb-10">
                                    <div className="bg-[#C6E065]/20 p-4 rounded-[28px]">
                                        <CreditCard size={32} className="text-[#3d3522]" />
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-2xl font-black text-[#3d3522]">ชำระเงินด้วย PromptPay</h3>
                                        <p className="text-sm font-bold text-[#3d3522] tracking-widest mt-1 uppercase">สแกน QR Code เพื่อชำระเงิน</p>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-[40px] mb-10 shadow-2xl shadow-[#3d3522]/5 border-2 border-[#3d3522]/5 group">
                                    <img 
                                        src={qrModalOrder.qrCodeUrl} 
                                        alt="Order QR" 
                                        className="w-56 h-56 object-contain group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>

                                <div className="w-full bg-white p-6 rounded-[28px] mb-10 border border-gray-100 flex justify-between items-center">
                                    <span className="text-[#3d3522] text-xs font-black uppercase tracking-widest">ยอดชำระสุทธิ</span>
                                    <span className="text-3xl font-black text-[#3d3522]">฿{qrModalOrder.totalAmount.toLocaleString()}</span>
                                </div>

                                <div className="flex items-center gap-3 text-[#3d3522] mb-12 bg-white/50 px-6 py-3 rounded-full border border-white">
                                    <Loader2 size={16} className="animate-spin text-[#C6E065]" />
                                    <span className="text-[11px] font-black uppercase tracking-[0.2em]">กำลังตรวจสอบสถานะการชำระเงิน...</span>
                                </div>

                                <button
                                    onClick={() => setQrModalOrder(null)}
                                    className="text-[#3d3522] hover:text-red-400 text-xs font-black uppercase tracking-[0.3em] transition-colors"
                                >
                                    ยกเลิกการชำระเงิน
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
