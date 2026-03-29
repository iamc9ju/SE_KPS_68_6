"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
    ArrowLeft,
    Bike,
    CalendarDays,
    CheckCircle2,
    ClipboardList,
    Clock3,
    CreditCard,
    MapPin,
    Package,
    Phone,
    RefreshCw,
    Store,
    Wallet,
    XCircle,
} from "lucide-react";
import api from "@/lib/api";
import { Order, OrderStatus, unwrapOrderList } from "@/lib/orders";

const OrderTrackingMapView = dynamic(() => import("@/components/dashboard/OrderTrackingMapView"), { ssr: false });

const STATUS_META: Record<
    OrderStatus,
    {
        stage: 1 | 2 | 3 | 4;
        label: string;
        description: string;
        eta: string;
        accent: string;
        icon: React.ComponentType<{ size?: number; className?: string }>;
    }
> = {
    pending: {
        stage: 1,
        label: "ออเดอร์เข้าสู่ระบบแล้ว",
        description: "ร้านค้ากำลังตรวจสอบคำสั่งซื้อและคิวการเตรียมอาหาร",
        eta: "25-35 นาที",
        accent: "bg-[#fff5df] text-[#9b6a1d]",
        icon: ClipboardList,
    },
    accepted: {
        stage: 2,
        label: "ร้านกำลังเตรียมอาหาร",
        description: "ออเดอร์ได้รับการยืนยันแล้วและกำลังจัดเตรียมเมนูของคุณ",
        eta: "15-25 นาที",
        accent: "bg-[#eaf3ff] text-[#295fc0]",
        icon: Package,
    },
    shipping: {
        stage: 3,
        label: "ออเดอร์กำลังจัดส่ง",
        description: "ออเดอร์ออกจากร้านแล้วและกำลังเดินทางไปหาคุณ",
        eta: "10-20 นาที",
        accent: "bg-[#eef8df] text-[#5f7d12]",
        icon: Bike,
    },
    delivered: {
        stage: 4,
        label: "จัดส่งสำเร็จแล้ว",
        description: "คุณได้รับออเดอร์เรียบร้อยแล้ว",
        eta: "สำเร็จแล้ว",
        accent: "bg-[#eaf8ef] text-[#1f7a47]",
        icon: CheckCircle2,
    },
    cancelled: {
        stage: 1,
        label: "คำสั่งซื้อถูกยกเลิก",
        description: "ออเดอร์นี้ถูกยกเลิกและจะไม่มีการจัดส่งต่อ",
        eta: "-",
        accent: "bg-[#fff0ef] text-[#b54c3d]",
        icon: XCircle,
    },
};

function formatCurrency(value: number) {
    return new Intl.NumberFormat("th-TH", {
        style: "currency",
        currency: "THB",
        maximumFractionDigits: 0,
    }).format(value || 0);
}

function formatDateTime(value?: string) {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return new Intl.DateTimeFormat("th-TH", {
        dateStyle: "long",
        timeStyle: "short",
    }).format(date);
}

function isActiveOrder(status: OrderStatus) {
    return status === "pending" || status === "accepted" || status === "shipping";
}

export default function OrderTrackingPageContent() {
    const searchParams = useSearchParams();
    const orderIdFromQuery = searchParams.get("orderId");

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const fetchOrders = useCallback(async (initialLoad = false) => {
        try {
            if (initialLoad) {
                setLoading(true);
            } else {
                setRefreshing(true);
            }

            const response = await api.get("/orders");
            setOrders(unwrapOrderList(response.data));
            setErrorMessage(null);
        } catch {
            setOrders([]);
            setErrorMessage("ยังโหลดข้อมูลการติดตามออเดอร์ไม่ได้ในตอนนี้");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        void fetchOrders(true);
    }, [fetchOrders]);

    const selectedOrder = useMemo(() => {
        if (!orders.length) return null;

        if (orderIdFromQuery) {
            const matchedOrder = orders.find((order) => order.orderId === orderIdFromQuery);
            if (matchedOrder) return matchedOrder;
        }

        const activeOrders = orders.filter((order) => isActiveOrder(order.status));
        if (activeOrders.length) {
            return [...activeOrders].sort(
                (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
            )[0];
        }

        return [...orders].sort(
            (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
        )[0];
    }, [orderIdFromQuery, orders]);

    const statusMeta = selectedOrder ? STATUS_META[selectedOrder.status] : STATUS_META.pending;
    const StageIcon = statusMeta.icon;

    const restaurantAddress = [
        selectedOrder?.partner?.addressLine1,
        selectedOrder?.partner?.address,
        selectedOrder?.partner?.district,
        selectedOrder?.partner?.province,
    ]
        .filter(Boolean)
        .join(" ");

    const steps = [
        { step: 1 as const, label: "รับออเดอร์", done: statusMeta.stage >= 1 },
        { step: 2 as const, label: "ร้านเตรียมอาหาร", done: statusMeta.stage >= 2 },
        { step: 3 as const, label: "กำลังจัดส่ง", done: statusMeta.stage >= 3 },
        { step: 4 as const, label: "จัดส่งสำเร็จ", done: selectedOrder?.status === "delivered" },
    ];

    if (loading) {
        return (
            <div className="flex-1 h-screen overflow-y-auto bg-[#fffbf5] px-6 py-10 lg:pl-[296px] lg:pr-10">
                <div className="mx-auto max-w-7xl animate-pulse space-y-6">
                    <div className="h-40 rounded-[32px] bg-white" />
                    <div className="grid gap-6 lg:grid-cols-[1.45fr_0.95fr]">
                        <div className="h-[520px] rounded-[32px] bg-white" />
                        <div className="h-[520px] rounded-[32px] bg-white" />
                    </div>
                </div>
            </div>
        );
    }

    if (!selectedOrder) {
        return (
            <div className="flex-1 h-screen overflow-y-auto bg-[#fffbf5] px-6 py-10 lg:pl-[296px] lg:pr-10">
                <div className="mx-auto max-w-4xl rounded-[32px] border border-[#efe6d4] bg-white p-10 text-center shadow-[0_24px_80px_rgba(103,86,42,0.08)]">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#f4f8df] text-[#7c9528]">
                        <Package size={32} />
                    </div>
                    <h1 className="mt-6 text-3xl font-black text-[#2f2a1c]">ยังไม่มีออเดอร์ให้ติดตาม</h1>
                    <p className="mt-3 text-base font-medium text-[#7f745d]">
                        เมื่อมีคำสั่งซื้อใหม่ คุณจะสามารถติดตามสถานะได้จากหน้านี้
                    </p>
                    <Link
                        href="/dashboard/orders"
                        className="mt-8 inline-flex items-center justify-center rounded-full bg-[#2f2a1c] px-6 py-3 text-sm font-black text-white transition hover:bg-[#1f1b12]"
                    >
                        กลับไปหน้าคำสั่งซื้อ
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 h-screen overflow-y-auto bg-[#fffbf5] px-6 py-8 lg:pl-[296px] lg:pr-10">
            <div className="mx-auto max-w-7xl space-y-6">
                <section className="rounded-[36px] border border-[#ece3cf] bg-[radial-gradient(circle_at_top_left,_rgba(220,237,146,0.55),_rgba(255,255,255,0.96)_28%),linear-gradient(135deg,#fffdfa_0%,#fffaf0_100%)] p-6 shadow-[0_24px_80px_rgba(103,86,42,0.08)] lg:p-10">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        <div className="max-w-3xl">
                            <div className="flex flex-wrap items-center gap-3">
                                <Link
                                    href="/dashboard/orders"
                                    className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-[#3b321f] shadow-[0_12px_30px_rgba(0,0,0,0.05)] transition hover:-translate-y-0.5"
                                >
                                    <ArrowLeft size={18} />
                                    กลับไปหน้าคำสั่งซื้อ
                                </Link>
                                <span className="inline-flex rounded-full bg-[#eef8cf] px-5 py-3 text-sm font-black uppercase tracking-[0.2em] text-[#748619]">
                                    Live Order Status
                                </span>
                            </div>

                            <h1 className="mt-6 text-4xl font-black tracking-tight text-[#2f2a1c] md:text-6xl">
                                ติดตามสถานะออเดอร์ของคุณ
                            </h1>
                            <p className="mt-4 max-w-2xl text-lg font-medium leading-8 text-[#72664d]">
                                แสดงสถานะล่าสุดของออเดอร์ รายการอาหาร และข้อมูลการจัดส่งที่ควรเห็นได้จากหน้ารวมออเดอร์
                            </p>
                        </div>

                        <div className="flex flex-col gap-4 lg:items-end">
                            <div className="rounded-[28px] border border-white/80 bg-white/90 px-6 py-4 shadow-[0_18px_40px_rgba(0,0,0,0.05)]">
                                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#ae9e7a]">Order ID</p>
                                <p className="mt-2 text-3xl font-black text-[#2f2a1c]">#{selectedOrder.orderId.slice(-8)}</p>
                            </div>

                            <button
                                type="button"
                                onClick={() => void fetchOrders(false)}
                                disabled={refreshing}
                                className="inline-flex items-center gap-3 rounded-full bg-[#2f2a1c] px-6 py-4 text-base font-black text-white transition hover:bg-[#1f1b12] disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
                                รีเฟรชสถานะ
                            </button>
                        </div>
                    </div>
                </section>

                {errorMessage && (
                    <div className="rounded-[28px] border border-[#ffd7cf] bg-[#fff1ed] px-6 py-5 text-sm font-bold text-[#b55239] shadow-sm">
                        {errorMessage}
                    </div>
                )}

                <section className="grid gap-6 lg:grid-cols-[1.45fr_0.95fr]">
                    <div className="rounded-[32px] border border-[#ece3cf] bg-white p-4 shadow-[0_24px_80px_rgba(103,86,42,0.08)] lg:p-5">
                        <OrderTrackingMapView
                            orderId={selectedOrder.orderId}
                            stage={statusMeta.stage}
                            restaurantName={selectedOrder.partner?.partnerName}
                            customerAddress={selectedOrder.deliveryAddress}
                        />
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-[32px] border border-[#ece3cf] bg-white p-7 shadow-[0_24px_80px_rgba(103,86,42,0.08)]">
                            <p className="text-sm font-black uppercase tracking-[0.24em] text-[#b0a17c]">Current Status</p>
                            <div className="mt-5 flex items-start gap-4">
                                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${statusMeta.accent}`}>
                                    <StageIcon size={28} />
                                </div>
                                <div>
                                    <h2 className="text-4xl font-black leading-tight text-[#2f2a1c]">{statusMeta.label}</h2>
                                    <p className="mt-3 text-lg leading-8 text-[#746852]">{statusMeta.description}</p>
                                </div>
                            </div>

                            <div className="mt-8 grid gap-4 md:grid-cols-2">
                                <InfoCard icon={<Clock3 size={22} />} title="เวลาประมาณ" value={statusMeta.eta} tone="lime" />
                                <InfoCard
                                    icon={<Wallet size={22} />}
                                    title="การชำระเงิน"
                                    value={selectedOrder.paymentStatus}
                                    tone={selectedOrder.paymentStatus === "PAID" ? "blue" : "orange"}
                                />
                            </div>
                        </div>

                        {(selectedOrder.status === "cancelled" || selectedOrder.status === "delivered") && (
                            <div
                                className={`rounded-[28px] border px-6 py-5 shadow-sm ${
                                    selectedOrder.status === "cancelled"
                                        ? "border-[#ffd8d1] bg-[#fff2f0] text-[#af4b3e]"
                                        : "border-[#d9ecc0] bg-[#f4fbdf] text-[#5c7714]"
                                }`}
                            >
                                <p className="text-sm font-black uppercase tracking-[0.2em]">
                                    {selectedOrder.status === "cancelled" ? "Order Cancelled" : "Order Delivered"}
                                </p>
                                <p className="mt-2 text-base font-semibold">
                                    {selectedOrder.status === "cancelled"
                                        ? "ออเดอร์นี้ถูกยกเลิกแล้ว หากมีข้อสงสัยสามารถกลับไปตรวจสอบในหน้าคำสั่งซื้อได้"
                                        : "ออเดอร์นี้จัดส่งเรียบร้อยแล้ว คุณยังสามารถกลับมาดูรายละเอียดรายการอาหารได้เสมอ"}
                                </p>
                            </div>
                        )}
                    </div>
                </section>

                <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                    <div className="rounded-[32px] border border-[#ece3cf] bg-white p-7 shadow-[0_24px_80px_rgba(103,86,42,0.08)]">
                        <p className="text-sm font-black uppercase tracking-[0.24em] text-[#b0a17c]">Order Progress</p>
                        <div className="mt-8 space-y-5">
                            {steps.map((item) => (
                                <div key={item.step} className="flex items-center gap-4">
                                    <div
                                        className={`flex h-12 w-12 items-center justify-center rounded-full border-2 ${
                                            item.done
                                                ? "border-[#c6e065] bg-[#eef8cf] text-[#6f8519]"
                                                : "border-[#e7dcc8] bg-[#faf5ec] text-[#b7aa92]"
                                        }`}
                                    >
                                        {item.done ? <CheckCircle2 size={20} /> : <span className="text-sm font-black">{item.step}</span>}
                                    </div>
                                    <div className="flex-1 rounded-[22px] border border-[#f0e7d8] bg-[#fffdfa] px-5 py-4">
                                        <p className="text-base font-black text-[#2f2a1c]">{item.label}</p>
                                        <p className="mt-1 text-sm font-medium text-[#857861]">
                                            {item.done ? "อัปเดตแล้ว" : "รอสถานะถัดไป"}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-[32px] border border-[#ece3cf] bg-white p-7 shadow-[0_24px_80px_rgba(103,86,42,0.08)]">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-black uppercase tracking-[0.24em] text-[#b0a17c]">Order Summary</p>
                                <h3 className="mt-3 text-3xl font-black text-[#2f2a1c]">รายละเอียดออเดอร์</h3>
                            </div>
                            <div className="rounded-full bg-[#f6f1e5] px-4 py-2 text-sm font-black text-[#6f6249]">
                                {formatCurrency(selectedOrder.totalAmount)}
                            </div>
                        </div>

                        <div className="mt-8 grid gap-4">
                            <DetailRow icon={<CalendarDays size={18} />} label="เวลาสั่งซื้อ" value={formatDateTime(selectedOrder.createdAt)} />
                            <DetailRow icon={<MapPin size={18} />} label="ที่อยู่จัดส่ง" value={selectedOrder.deliveryAddress || "-"} />
                            {selectedOrder.partner?.partnerName && (
                                <DetailRow icon={<Store size={18} />} label="ร้านค้า" value={selectedOrder.partner.partnerName} />
                            )}
                            {restaurantAddress && (
                                <DetailRow icon={<Store size={18} />} label="ที่อยู่ร้าน" value={restaurantAddress} />
                            )}
                            {selectedOrder.contactPhone && (
                                <DetailRow icon={<Phone size={18} />} label="เบอร์โทรติดต่อ" value={selectedOrder.contactPhone} />
                            )}
                            <DetailRow
                                icon={<CreditCard size={18} />}
                                label="ยอดรวมทั้งหมด"
                                value={formatCurrency(selectedOrder.totalAmount)}
                                emphasized
                            />
                        </div>
                    </div>
                </section>

                <section className="rounded-[32px] border border-[#ece3cf] bg-white p-7 shadow-[0_24px_80px_rgba(103,86,42,0.08)]">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-black uppercase tracking-[0.24em] text-[#b0a17c]">Order Items</p>
                            <h3 className="mt-3 text-3xl font-black text-[#2f2a1c]">รายการอาหารในออเดอร์</h3>
                        </div>
                        <div className="rounded-full bg-[#f4f8df] px-4 py-2 text-sm font-black text-[#72881a]">
                            {selectedOrder.items.length} รายการ
                        </div>
                    </div>

                    <div className="mt-8 grid gap-4">
                        {selectedOrder.items.map((item) => (
                            <div
                                key={item.orderItemId}
                                className="flex flex-col gap-4 rounded-[28px] border border-[#f0e7d8] bg-[#fffdfa] p-5 md:flex-row md:items-center md:justify-between"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-[22px] bg-[#f6f1e5]">
                                        {item.imageUrl ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <Package size={24} className="text-[#b5a98f]" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-lg font-black text-[#2f2a1c]">{item.name}</p>
                                        <p className="mt-1 text-sm font-medium text-[#857861]">
                                            จำนวน {item.quantity} x {formatCurrency(item.priceAtOrder)}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#b1a27f]">Subtotal</p>
                                    <p className="mt-1 text-2xl font-black text-[#2f2a1c]">{formatCurrency(item.totalPrice)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}

function InfoCard({
    icon,
    title,
    value,
    tone,
}: {
    icon: React.ReactNode;
    title: string;
    value: string;
    tone: "lime" | "blue" | "orange";
}) {
    const toneClass =
        tone === "lime"
            ? "bg-[#eef8cf] text-[#738719]"
            : tone === "blue"
              ? "bg-[#eaf3ff] text-[#2a61c7]"
              : "bg-[#fff3e2] text-[#b37022]";

    return (
        <div className="rounded-[26px] border border-[#efe5d3] bg-[#fffdfa] p-5">
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${toneClass}`}>{icon}</div>
            <p className="mt-5 text-sm font-black uppercase tracking-[0.18em] text-[#b0a17c]">{title}</p>
            <p className="mt-2 text-3xl font-black text-[#2f2a1c]">{value}</p>
        </div>
    );
}

function DetailRow({
    icon,
    label,
    value,
    emphasized = false,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    emphasized?: boolean;
}) {
    return (
        <div className="flex items-start gap-4 rounded-[24px] border border-[#f0e7d8] bg-[#fffdfa] px-5 py-4">
            <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f4f8df] text-[#788f1c]">
                {icon}
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-[#b0a17c]">{label}</p>
                <p className={`mt-2 break-words ${emphasized ? "text-2xl font-black text-[#2f2a1c]" : "text-base font-semibold text-[#605540]"}`}>
                    {value}
                </p>
            </div>
        </div>
    );
}
