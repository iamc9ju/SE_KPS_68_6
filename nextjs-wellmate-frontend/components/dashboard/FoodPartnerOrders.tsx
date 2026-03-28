"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    Bell,
    Bike,
    CheckCircle2,
    Clock3,
    Flame,
    Phone,
    Store,
    UtensilsCrossed,
} from "lucide-react";
import api from "@/lib/api";
import Swal from "sweetalert2";

type OrderStatus = "new" | "preparing" | "ready";

type OrderItem = {
    name: string;
    qty: number;
    addons?: string[];
    note?: string;
    price?: number;
};

type Order = {
    id: string;
    status: OrderStatus;
    minutes: number;
    placedAt: string;
    items: OrderItem[];
    note?: string;
    allergy?: string;
    customerName: string;
    customerPhone: string;
    deliveryFee: number;
    subtotal: number;
    discount?: number;
    paymentStatus: "paid" | "cod" | "pending";
    paymentMethod?: string;
    riderStatus?: string;
    riderName?: string;
    riderPhone?: string;
    eta?: string;
    createdAt: string;
};

type ApiOrderItem = {
    orderItemId: number;
    menuItemId: number;
    name: string;
    imageUrl?: string | null;
    quantity: number;
    priceAtOrder: number;
    totalPrice: number;
};

type ApiOrder = {
    orderId: string;
    patientId: string;
    customerName?: string | null;
    totalAmount: number;
    status: "pending" | "accepted" | "preparing" | "ready" | "delivering" | "delivered" | "cancelled";
    paymentStatus: "UNPAID" | "PAID" | "REFUNDED";
    deliveryAddress?: string | null;
    contactPhone?: string | null;
    createdAt: string;
    items: ApiOrderItem[];
};

type ApiEnvelope<T> = {
    success: boolean;
    data: T;
    message?: string;
};

const RIDER_POOL = [
    { name: "พงศพัศ พิมพ์จันทร์คำ", phone: "080-000-1111" },
    { name: "อานนท์ แสนสมบัติ", phone: "080-000-2222" },
    { name: "มรกต คล่องใจ", phone: "080-000-3333" },
];
const REJECT_REASONS = ["วัตถุดิบหมด", "ร้านยุ่งเกินไป", "กำลังจะปิดร้าน"];

const STATUS_LABEL: Record<OrderStatus, string> = {
    new: "กำลังรอรับออเดอร์",
    preparing: "กำลังเตรียมอาหาร",
    ready: "พร้อมส่ง / รอไรเดอร์",
};

const STATUS_TONE: Record<OrderStatus, string> = {
    new: "bg-[#e7f2e9] text-[#2f7d57]",
    preparing: "bg-[#fff6df] text-[#8c6b13]",
    ready: "bg-[#e6f0ff] text-[#3f6fb5]",
};

const PAYMENT_LABEL: Record<Order["paymentStatus"], string> = {
    paid: "โอนจ่ายเรียบร้อยแล้ว",
    cod: "เก็บเงินปลายทาง",
    pending: "รอการชำระเงิน",
};

const formatBaht = (value: number) =>
    `${value.toLocaleString("th-TH", { maximumFractionDigits: 0 })} บาท`;

const toUiStatus = (status: ApiOrder["status"]): OrderStatus => {
    if (status === "pending") return "new";
    if (status === "accepted" || status === "preparing") return "preparing";
    if (status === "ready" || status === "delivering") return "ready";
    return "new";
};

const isActiveStatus = (status: ApiOrder["status"]) =>
    status !== "delivered" && status !== "cancelled";

const toPaymentStatus = (status: ApiOrder["paymentStatus"]): Order["paymentStatus"] => {
    if (status === "PAID") return "paid";
    if (status === "REFUNDED") return "pending";
    return "pending";
};

const minutesSince = (iso: string) => {
    const created = new Date(iso);
    const diffMs = Date.now() - created.getTime();
    return Math.max(1, Math.round(diffMs / 60000));
};

const pickRider = (orderId: string) => {
    let sum = 0;
    for (let i = 0; i < orderId.length; i += 1) sum += orderId.charCodeAt(i);
    return RIDER_POOL[sum % RIDER_POOL.length];
};

function Toggle({
    on,
    onClick,
    label,
    description,
    onColor,
}: {
    on: boolean;
    onClick: () => void;
    label: string;
    description: string;
    onColor: string;
}) {
    return (
        <button
            onClick={onClick}
            className="w-full rounded-2xl border border-[#eadfce] bg-white px-4 py-3 text-left shadow-sm transition hover:-translate-y-[1px]"
        >
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-black text-[#2f2a1d]">{label}</p>
                    <p className="text-xs text-[#6b5d4b]">{description}</p>
                </div>
                <div
                    className={`relative inline-flex h-7 w-14 items-center rounded-full border ${on ? onColor : "border-[#d8cbb6] bg-[#ece4d7]"
                        }`}
                >
                    <span
                        className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition ${on ? "translate-x-7" : "translate-x-1"
                            }`}
                    />
                </div>
            </div>
        </button>
    );
}

function Badge({ text }: { text: string }) {
    return (
        <span className="rounded-full bg-[#f7efe1] px-3 py-1 text-xs font-bold text-[#7b6a55]">
            {text}
        </span>
    );
}

function StatCard({
    title,
    value,
    hint,
    accent,
    icon,
    pulse,
}: {
    title: string;
    value: string;
    hint: string;
    accent: string;
    icon: React.ReactNode;
    pulse?: boolean;
}) {
    return (
        <div className="group relative overflow-hidden rounded-[26px] border border-[#eadfce] bg-gradient-to-br from-white via-white to-[#fff7ec] p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="absolute -left-10 top-6 h-24 w-24 rounded-full bg-[#f7efe1]/70 blur-2xl" />
            <div className="relative flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#eadfce] bg-white text-[#6b5d4b] shadow-sm">
                        {icon}
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs font-bold text-[#8c7a66]">{title}</p>
                        <p className="mt-1 text-3xl font-black text-[#2f2a1d]">
                            {value}
                        </p>
                        <p className="mt-1 text-xs text-[#6b5d4b]">{hint}</p>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <div
                        className={`flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold ${accent} text-white`}
                    >
                        <span className="h-2 w-2 rounded-full bg-white/70" />
                        LIVE
                    </div>
                    {pulse && (
                        <div className="text-[10px] font-semibold text-[#9a8a76]">
                            อัปเดตเรียลไทม์
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function Modal({
    open,
    title,
    children,
    onClose,
    wide,
}: {
    open: boolean;
    title: string;
    children: React.ReactNode;
    onClose: () => void;
    wide?: boolean;
}) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-10">
            <div
                className={`w-full rounded-3xl bg-white p-6 shadow-xl ${wide ? "max-w-3xl" : "max-w-lg"
                    }`}
            >
                <div className="mb-4 flex items-center justify-between gap-2">
                    <h3 className="text-xl font-black text-[#2f2a1d]">{title}</h3>
                    <button
                        onClick={onClose}
                        className="rounded-full border border-[#eadfce] px-3 py-1 text-xs font-bold text-[#6b5d4b]"
                    >
                        ปิด
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

function OrderCard({
    order,
    onAccept,
    onReject,
    onReady,
    onView,
}: {
    order: Order;
    onAccept: () => void;
    onReject: () => void;
    onReady: () => void;
    onView: () => void;
}) {
    const isLate = order.minutes >= 15;
    return (
        <div className="rounded-2xl border border-[#eadfce] bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-lg font-black text-[#2f2a1d]">#{order.id}</p>
                    <div className="mt-1 flex items-center gap-2 text-xs font-bold">
                        <Clock3 size={14} className={isLate ? "text-red-500" : "text-[#8c7a66]"} />
                        <span className={isLate ? "text-red-600" : "text-[#8c7a66]"}>
                            {order.minutes} นาทีที่แล้ว
                        </span>
                        {isLate && <Badge text="ใกล้เกินเวลา" />}
                    </div>
                </div>
                <div className="rounded-full bg-[#f4ead8] px-3 py-1 text-xs font-bold text-[#7b6a55]">
                    <span className="inline-flex items-center gap-1">
                        <UtensilsCrossed size={12} /> ออเดอร์อาหาร
                    </span>
                </div>
            </div>

            <div className="mt-3 space-y-1 text-sm text-[#3f3425]">
                {order.items.map((item, idx) => (
                    <p key={`${order.id}-${idx}`}>
                        {item.name} x {item.qty}
                    </p>
                ))}
            </div>

            {order.note && (
                <p className="mt-2 text-sm italic text-[#5d5243]">หมายเหตุ: {order.note}</p>
            )}

            {order.allergy && (
                <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-black text-red-600">
                    🚨 แจ้งแพ้อาหาร: {order.allergy}
                </div>
            )}

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#f0e6d8] pt-3">
                <div className="flex flex-wrap items-center gap-2">
                    {order.status === "new" && (
                        <>
                            <button
                                onClick={onAccept}
                                className="rounded-full bg-[#2f7d57] px-4 py-2 text-xs font-black text-white"
                            >
                                รับออเดอร์
                            </button>
                            <button
                                onClick={onReject}
                                className="rounded-full border border-[#eadfce] bg-white px-4 py-2 text-xs font-black text-[#b13a3a]"
                            >
                                ปฏิเสธ
                            </button>
                        </>
                    )}
                    {order.status === "preparing" && (
                        <button
                            onClick={onReady}
                            className="rounded-full bg-[#f4c84a] px-4 py-2 text-xs font-black text-[#3b2c12]"
                        >
                            อาหารเสร็จแล้ว
                        </button>
                    )}
                    {order.status === "ready" && (
                        <div className="text-xs font-bold text-[#6b5d4b]">
                            {order.riderStatus ?? "รอไรเดอร์มารับ"}
                        </div>
                    )}
                </div>
                <button
                    onClick={onView}
                    className="rounded-full border border-[#eadfce] bg-white px-4 py-2 text-xs font-black text-[#2f2a1d]"
                >
                    ดูรายละเอียด
                </button>
            </div>
        </div>
    );
}

export default function FoodPartnerOrders() {
    const [storeOpen, setStoreOpen] = useState(true);
    const [soundOn, setSoundOn] = useState(true);
    const [mobileTab, setMobileTab] = useState<OrderStatus>("new");
    const [orders, setOrders] = useState<Order[]>([]);
    const [allOrders, setAllOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showDetails, setShowDetails] = useState(false);
    const [showReject, setShowReject] = useState(false);
    const [showEmergencyPause, setShowEmergencyPause] = useState(false);
    const [selectedReason, setSelectedReason] = useState(REJECT_REASONS[0]);

    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const knownOrderIdsRef = useRef<Set<string> | null>(null);

    const unwrap = <T,>(payload: ApiEnvelope<T> | T): T => {
        if (payload && typeof payload === "object" && "data" in payload) {
            return (payload as ApiEnvelope<T>).data;
        }
        return payload as T;
    };

    const mapOrder = (order: ApiOrder): Order => {
        const rider = pickRider(order.orderId);
        const minutes = minutesSince(order.createdAt);
        const etaMinutes = Math.min(30, Math.max(8, minutes + 5));
        return {
            id: order.orderId,
            status: toUiStatus(order.status),
            minutes,
            placedAt: new Date(order.createdAt).toLocaleString("th-TH"),
            items: order.items.map((item) => ({
                menuItemId: item.menuItemId,
                name: item.name,
                qty: item.quantity,
                price: item.priceAtOrder,
            })),
            customerName: order.customerName ?? "Customer",
            customerPhone: order.contactPhone ?? "-",
            deliveryFee: 0,
            subtotal: order.items.reduce((sum, i) => sum + Number(i.totalPrice || 0), 0),
            paymentStatus: toPaymentStatus(order.paymentStatus),
            riderStatus: `Rider arriving (in ${etaMinutes} min)`,
            riderName: rider.name,
            riderPhone: rider.phone,
            eta: new Date(Date.now() + etaMinutes * 60000).toLocaleTimeString("th-TH", {
                hour: "2-digit",
                minute: "2-digit",
            }),
            createdAt: order.createdAt,
        };
    };

    const isSameDay = (iso: string) => {
        const date = new Date(iso);
        const now = new Date();
        return (
            date.getFullYear() === now.getFullYear() &&
            date.getMonth() === now.getMonth() &&
            date.getDate() === now.getDate()
        );
    };

    const fetchOrders = async () => {
        setIsLoading(true);
        setLoadError("");
        try {
            const res = await api.get<ApiEnvelope<ApiOrder[]> | ApiOrder[]>("/orders");
            const data = unwrap(res.data);
            const allItems = Array.isArray(data) ? data : [];
            const activeItems = allItems.filter((item) => isActiveStatus(item.status));
            const mappedAll = allItems.map(mapOrder);
            const mappedActive = activeItems.map(mapOrder);
            if (!knownOrderIdsRef.current) {
                knownOrderIdsRef.current = new Set(mappedActive.map((o) => o.id));
                setAllOrders(mappedAll);
                setOrders(mappedActive);
                setLastUpdated(new Date());
            } else {
                const known = knownOrderIdsRef.current;
                const hasNew = mappedActive.some((o) => !known.has(o.id));
                if (hasNew) {
                    knownOrderIdsRef.current = new Set(mappedActive.map((o) => o.id));
                    setAllOrders(mappedAll);
                    setOrders(mappedActive);
                    setLastUpdated(new Date());
                }
            }
        } catch (error) {
            console.error("Failed to load orders:", error);
            setLoadError("Failed to load orders");
            setAllOrders([]);
            setOrders([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        let active = true;
        const run = () => {
            if (!active) return;
            fetchOrders();
        };
        run();
        const interval = setInterval(run, 15000);
        const handleFocus = () => run();
        const handleVisibility = () => {
            if (document.visibilityState === "visible") run();
        };
        window.addEventListener("focus", handleFocus);
        document.addEventListener("visibilitychange", handleVisibility);
        return () => {
            active = false;
            clearInterval(interval);
            window.removeEventListener("focus", handleFocus);
            document.removeEventListener("visibilitychange", handleVisibility);
        };
    }, []);

    const grouped = useMemo(() => {
        return {
            new: orders.filter((o) => o.status === "new"),
            preparing: orders.filter((o) => o.status === "preparing"),
            ready: orders.filter((o) => o.status === "ready"),
        };
    }, [orders]);

    const stats = useMemo(() => {
        const sales = allOrders
            .filter((o) => isSameDay(o.createdAt))
            .reduce((sum, o) => sum + o.subtotal + o.deliveryFee, 0);
        return {
            newOrders: grouped.new.length,
            preparing: grouped.preparing.length,
            sales,
        };
    }, [grouped, allOrders]);

    const openDetails = (order: Order) => {
        setSelectedOrder(order);
        setShowDetails(true);
    };

    const openReject = (order: Order) => {
        setSelectedOrder(order);
        setShowReject(true);
    };

    const acceptOrder = async (order: Order) => {
        try {
            await api.patch(`/orders/${order.id}/status`, { status: "preparing" });
            setOrders((prev) =>
                prev.map((o) => (o.id === order.id ? { ...o, status: "preparing" } : o)),
            );
        } catch (error) {
            console.error("Failed to accept order:", error);
            Swal.fire({
                icon: "error",
                title: "Update failed",
                text: "Unable to accept order",
                confirmButtonColor: "#3d3522",
                background: "#fffbf5",
            });
        }
    };

    const markReady = async (order: Order) => {
        try {
            await api.patch(`/orders/${order.id}/status`, { status: "ready" });
            setOrders((prev) =>
                prev.map((o) => (o.id === order.id ? { ...o, status: "ready" } : o)),
            );
        } catch (error) {
            console.error("Failed to mark ready:", error);
            Swal.fire({
                icon: "error",
                title: "Update failed",
                text: "Unable to mark order as ready",
                confirmButtonColor: "#3d3522",
                background: "#fffbf5",
            });
        }
    };

    const markDelivered = async (order: Order) => {
        try {
            await api.patch(`/orders/${order.id}/status`, { status: "delivered" });
            setOrders((prev) => prev.filter((o) => o.id !== order.id));
            setShowDetails(false);
            setSelectedOrder(null);
        } catch (error) {
            console.error("Failed to mark delivered:", error);
            Swal.fire({
                icon: "error",
                title: "Update failed",
                text: "Unable to mark delivered",
                confirmButtonColor: "#3d3522",
                background: "#fffbf5",
            });
        }
    };

    const confirmReject = async () => {
        if (!selectedOrder) return;
        try {
            await api.patch(`/orders/${selectedOrder.id}/status`, { status: "cancelled" });
            setOrders((prev) => prev.filter((o) => o.id !== selectedOrder.id));
            setShowReject(false);
        } catch (error) {
            console.error("Failed to reject order:", error);
            Swal.fire({
                icon: "error",
                title: "Update failed",
                text: "Unable to reject order",
                confirmButtonColor: "#3d3522",
                background: "#fffbf5",
            });
        }
    };

    const toggleStore = () => {
        if (storeOpen) {
            setShowEmergencyPause(true);
            return;
        }
        setStoreOpen(true);
    };

    const confirmPause = () => {
        setStoreOpen(false);
        setShowEmergencyPause(false);
    };

    return (
        <main className="flex-1 h-screen overflow-y-auto px-8 py-10 lg:pl-64 bg-[#fffbf5] scroll-smooth">
            <div className="mx-auto max-w-[1300px] space-y-6">
                <section className="rounded-[28px] border border-[#eadfce] bg-white/90 p-6 shadow-sm backdrop-blur">
                    {loadError && (
                        <div className="mb-4 rounded-2xl border border-[#f0e6d8] bg-[#fff5f5] px-4 py-3 text-xs font-bold text-[#b13a3a]">
                            {loadError}
                        </div>
                    )}
                    {!loadError && lastUpdated && (
                        <div className="mb-4 text-[11px] font-semibold text-[#8c7a66]">
                            Updated: {lastUpdated.toLocaleTimeString("th-TH")}
                        </div>
                    )}
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full bg-[#f4ead8] px-3 py-1 text-xs font-bold text-[#7b6a55]">
                                <Store size={14} /> WellMate Food Partner
                            </div>
                            <h1 className="mt-3 text-3xl font-black text-[#2f2a1d]">
                                หน้ารับออเดอร์ร้านค้า
                            </h1>
                            <p className="mt-1 text-sm text-[#6b5d4b]">
                                จัดการออเดอร์ได้ทันที เห็นภาพรวมทั้งวันและไม่พลาดแจ้งเตือนสำคัญ
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Toggle
                                on={storeOpen}
                                onClick={toggleStore}
                                label="สถานะร้าน"
                                description={storeOpen ? "เปิดรับออเดอร์" : "ปิดรับออเดอร์ชั่วคราว"}
                                onColor="border-[#2f7d57] bg-[#2f7d57]"
                            />
                            <Toggle
                                on={soundOn}
                                onClick={() => setSoundOn((prev) => !prev)}
                                label="เสียงแจ้งเตือน"
                                description={soundOn ? "เปิดเสียงแจ้งเตือนออเดอร์ใหม่" : "ปิดเสียงชั่วคราว"}
                                onColor="border-[#f4c84a] bg-[#f4c84a]"
                            />
                        </div>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        <StatCard
                            title="ออเดอร์ใหม่"
                            value={`${stats.newOrders} ใบ`}
                            hint="รอการกดรับ"
                            accent="bg-[#2f7d57]"
                            icon={<Clock3 size={18} />}
                            pulse
                        />
                        <StatCard
                            title="กำลังเตรียมอาหาร"
                            value={`${stats.preparing} ใบ`}
                            hint="อยู่ในครัว"
                            accent="bg-[#f4c84a]"
                            icon={<Flame size={18} />}
                        />
                        <StatCard
                            title="ยอดขายวันนี้"
                            value={`${stats.sales.toFixed(0)} บาท`}
                            hint="รวมค่าส่งแล้ว"
                            accent="bg-[#3f6fb5]"
                            icon={<CheckCircle2 size={18} />}
                        />
                    </div>
                </section>

                <section className="rounded-[28px] border border-[#eadfce] bg-white p-6 shadow-sm">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[#6b5d4b]">
                            <Badge text="โหมด Kanban" />
                            <span className="inline-flex items-center gap-1">
                                <Bell size={12} /> แจ้งเตือนออเดอร์ใหม่แบบเรียลไทม์
                            </span>
                            <span className="inline-flex items-center gap-1">
                                <Bike size={12} /> ดูสถานะไรเดอร์ได้ทันที
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-[#6b5d4b]">
                            <span className="h-2 w-2 rounded-full bg-[#2f7d57]" />
                            เปิดร้านอยู่
                        </div>
                    </div>

                    <div className="flex gap-2 md:hidden">
                        {([
                            { key: "new", label: "ออเดอร์ใหม่" },
                            { key: "preparing", label: "กำลังเตรียม" },
                            { key: "ready", label: "รอจัดส่ง" },
                        ] as const).map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setMobileTab(tab.key)}
                                className={`flex-1 rounded-full border px-3 py-2 text-xs font-black ${mobileTab === tab.key
                                    ? "border-[#2f7d57] bg-[#2f7d57] text-white"
                                    : "border-[#eadfce] bg-white text-[#6b5d4b]"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-3">
                        {([
                            {
                                key: "new",
                                title: "ออเดอร์ใหม่",
                                description: "รอการกดรับ",
                                accent: "bg-[#e7f2e9] text-[#2f7d57]",
                                orders: grouped.new,
                            },
                            {
                                key: "preparing",
                                title: "กำลังเตรียมอาหาร",
                                description: "กำลังทำในครัว",
                                accent: "bg-[#fff6df] text-[#8c6b13]",
                                orders: grouped.preparing,
                            },
                            {
                                key: "ready",
                                title: "รอจัดส่ง",
                                description: "เสร็จแล้ว รอไรเดอร์",
                                accent: "bg-[#e6f0ff] text-[#3f6fb5]",
                                orders: grouped.ready,
                            },
                        ] as const).map((column) => (
                            <div
                                key={column.key}
                                className={`space-y-3 ${mobileTab !== column.key ? "hidden md:block" : ""
                                    }`}
                            >
                                <div className="rounded-2xl border border-[#f0e6d8] bg-[#faf4ea] px-4 py-3">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-black text-[#2f2a1d]">
                                                {column.title}
                                            </p>
                                            <p className="text-xs text-[#6b5d4b]">
                                                {column.description}
                                            </p>
                                        </div>
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-black ${column.accent}`}
                                        >
                                            {column.orders.length}
                                        </span>
                                    </div>
                                </div>

                                {column.orders.length === 0 && (
                                    <div className="rounded-2xl border border-dashed border-[#eadfce] bg-white p-4 text-sm text-[#6b5d4b]">
                                        ยังไม่มีออเดอร์ในคอลัมน์นี้
                                    </div>
                                )}

                                {column.orders.map((order) => (
                                    <OrderCard
                                        key={order.id}
                                        order={order}
                                        onAccept={() => acceptOrder(order)}
                                        onReject={() => openReject(order)}
                                        onReady={() => markReady(order)}
                                        onView={() => openDetails(order)}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {showDetails && selectedOrder && (
                <div
                    className="fixed inset-0 z-50 overflow-y-auto bg-[#1f1b14]/70 px-4 py-10"
                    onClick={() => setShowDetails(false)}
                >
                    <div
                        className="relative mx-auto w-full max-w-4xl rounded-[36px] border border-[#eadfce] bg-white shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            onClick={() => setShowDetails(false)}
                            className="absolute right-4 top-4 rounded-full border border-[#eadfce] bg-white px-3 py-1 text-xs font-black text-[#6b5d4b] shadow-sm"
                        >
                            ×
                        </button>
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f0e6d8] px-6 py-5">
                            <div>
                                <p className="text-xs font-bold text-[#8c7a66]">
                                    ข้อมูลรายละเอียดออเดอร์
                                </p>
                                <div className="mt-2 flex flex-wrap items-center gap-3">
                                    <h2 className="text-3xl font-black text-[#2f2a1d]">
                                        #{selectedOrder.id}
                                    </h2>
                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-black ${STATUS_TONE[selectedOrder.status]}`}
                                    >
                                        {STATUS_LABEL[selectedOrder.status]}
                                    </span>
                                </div>
                                <p className="mt-2 text-sm text-[#6b5d4b]">
                                    เวลาที่ลูกค้ากดสั่ง: {selectedOrder.placedAt}
                                </p>
                            </div>
                            <button
                                onClick={() => setShowDetails(false)}
                                className="rounded-full border border-[#eadfce] px-4 py-2 text-xs font-black text-[#6b5d4b]"
                            >
                                ปิดหน้าต่าง
                            </button>
                        </div>

                        <div className="space-y-6 px-6 py-6">
                            <section className="rounded-3xl border border-[#eadfce] bg-[#faf4ea] p-5">
                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    <div>
                                        <p className="text-xs font-bold text-[#6b5d4b]">
                                            ข้อมูลลูกค้า
                                        </p>
                                        <p className="text-xl font-black text-[#2f2a1d]">
                                            {selectedOrder.customerName}
                                        </p>
                                        <div className="mt-2 flex items-center gap-2 text-sm text-[#6b5d4b]">
                                            <Phone size={14} /> {selectedOrder.customerPhone}
                                        </div>
                                    </div>
                                    <div className="rounded-2xl bg-white px-4 py-3 text-xs text-[#6b5d4b] shadow-sm">
                                        <p className="font-bold text-[#2f2a1d]">สถานะการชำระเงิน</p>
                                        <p className="mt-1 font-black text-[#2f7d57]">
                                            {PAYMENT_LABEL[selectedOrder.paymentStatus]}
                                        </p>
                                        {selectedOrder.paymentMethod && (
                                            <p className="mt-1">{selectedOrder.paymentMethod}</p>
                                        )}
                                    </div>
                                </div>
                            </section>

                            <section className="rounded-3xl border border-[#eadfce] bg-white p-5">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-black text-[#2f2a1d]">
                                        รายการอาหาร (สำหรับแม่ครัว)
                                    </p>
                                    <span className="text-xs font-bold text-[#8c7a66]">
                                        {selectedOrder.items.length} รายการ
                                    </span>
                                </div>

                                {selectedOrder.allergy && (
                                    <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-black text-red-600">
                                        แจ้งแพ้อาหาร: {selectedOrder.allergy}
                                    </div>
                                )}

                                <div className="mt-4 space-y-3 text-sm text-[#3f3425]">
                                    {selectedOrder.items.map((item, idx) => (
                                        <div
                                            key={`${selectedOrder.id}-detail-${idx}`}
                                            className="rounded-2xl border border-[#f0e6d8] px-4 py-3"
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <p className="font-black text-[#2f2a1d]">
                                                    {item.name} x {item.qty}
                                                </p>
                                                {item.price && (
                                                    <p className="text-xs font-bold text-[#8c7a66]">
                                                        {formatBaht(item.price * item.qty)}
                                                    </p>
                                                )}
                                            </div>
                                            {item.addons && item.addons.length > 0 && (
                                                <p className="mt-2 text-xs text-[#6b5d4b]">
                                                    Add-on: {item.addons.join(", ")}
                                                </p>
                                            )}
                                            {item.note && (
                                                <p className="mt-2 text-xs font-black text-[#b16a2b]">
                                                    โน้ตพิเศษ: {item.note}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {selectedOrder.note && (
                                    <div className="mt-4 rounded-2xl border border-[#f0e6d8] bg-[#f7efe1] px-4 py-3 text-xs text-[#6b5d4b]">
                                        หมายเหตุจากลูกค้า: {selectedOrder.note}
                                    </div>
                                )}
                            </section>

                            <section className="rounded-3xl border border-[#eadfce] bg-white p-5">
                                <p className="text-sm font-black text-[#2f2a1d]">
                                    สรุปค่าใช้จ่าย
                                </p>
                                <div className="mt-4 space-y-2 text-sm text-[#3f3425]">
                                    <div className="flex justify-between">
                                        <span>ค่าอาหารรวม</span>
                                        <span>{formatBaht(selectedOrder.subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>ส่วนลด</span>
                                        <span>{formatBaht(selectedOrder.discount ?? 0)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>ค่าส่ง</span>
                                        <span>{formatBaht(selectedOrder.deliveryFee)}</span>
                                    </div>
                                    <div className="flex justify-between border-t border-[#f0e6d8] pt-3 text-base font-black">
                                        <span>ยอดเงินสุทธิ</span>
                                        <span>
                                            {formatBaht(
                                                selectedOrder.subtotal -
                                                (selectedOrder.discount ?? 0),
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </section>

                            <section className="rounded-3xl border border-[#eadfce] bg-white p-5">
                                <p className="text-sm font-black text-[#2f2a1d]">
                                    ข้อมูลคนขับ (Rider)
                                </p>
                                {selectedOrder.riderName ? (
                                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                        <div className="rounded-2xl border border-[#f0e6d8] px-4 py-3 text-sm text-[#3f3425]">
                                            <p className="text-xs font-bold text-[#6b5d4b]">ชื่อคนขับ</p>
                                            <p className="mt-1 font-black text-[#2f2a1d]">
                                                {selectedOrder.riderName}
                                            </p>
                                        </div>
                                        <div className="rounded-2xl border border-[#f0e6d8] px-4 py-3 text-sm text-[#3f3425]">
                                            <p className="text-xs font-bold text-[#6b5d4b]">เบอร์โทรศัพท์</p>
                                            <p className="mt-1 font-black text-[#2f2a1d]">
                                                {selectedOrder.riderPhone ?? "-"}
                                            </p>
                                        </div>
                                        <div className="rounded-2xl border border-[#f0e6d8] px-4 py-3 text-sm text-[#3f3425] sm:col-span-2">
                                            <p className="text-xs font-bold text-[#6b5d4b]">เวลาคาดการณ์ถึงร้าน</p>
                                            <p className="mt-1 font-black text-[#2f2a1d]">
                                                {selectedOrder.eta ?? "กำลังอัปเดต"}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="mt-3 text-sm text-[#6b5d4b]">
                                        ยังไม่มีไรเดอร์รับออเดอร์นี้
                                    </p>
                                )}
                            </section>

                            <section className="rounded-3xl border border-[#eadfce] bg-[#faf4ea] p-5">
                                <p className="text-sm font-black text-[#2f2a1d]">
                                    ปุ่มกดสั่งการ
                                </p>
                                <div className="mt-4 flex flex-wrap gap-3">
                                    <button
                                        onClick={() => window.print()}
                                        className="rounded-full bg-[#2f2a1d] px-5 py-2 text-xs font-black text-white"
                                    >
                                        พิมพ์ใบเสร็จ
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (!selectedOrder) return;
                                            if (selectedOrder.status === "new") {
                                                acceptOrder(selectedOrder);
                                                return;
                                            }
                                            if (selectedOrder.status === "preparing") {
                                                markReady(selectedOrder);
                                                return;
                                            }
                                            markDelivered(selectedOrder);
                                        }}
                                        className="rounded-full bg-[#f4c84a] px-5 py-2 text-xs font-black text-[#3b2c12]"
                                    >
                                        {selectedOrder.status === "new"
                                            ? "Start cooking"
                                            : selectedOrder.status === "preparing"
                                                ? "Food ready"
                                                : "Delivered"}
                                    </button>
                                    <button className="rounded-full border border-[#eadfce] bg-white px-5 py-2 text-xs font-black text-[#b13a3a]">
                                        ติดต่อแอดมิน / รายงานปัญหา
                                    </button>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            )}

            <Modal
                open={showReject && !!selectedOrder}
                title="ปฏิเสธออเดอร์"
                onClose={() => setShowReject(false)}
            >
                <div className="space-y-3 text-sm text-[#3f3425]">
                    <p className="text-xs text-[#6b5d4b]">
                        โปรดเลือกเหตุผลในการปฏิเสธเพื่อเก็บสถิติให้แอดมิน
                    </p>
                    <div className="space-y-2">
                        {REJECT_REASONS.map((reason) => (
                            <label
                                key={reason}
                                className="flex cursor-pointer items-center justify-between rounded-xl border border-[#eadfce] bg-white px-3 py-2"
                            >
                                <span>{reason}</span>
                                <input
                                    type="radio"
                                    name="reject-reason"
                                    value={reason}
                                    checked={selectedReason === reason}
                                    onChange={() => setSelectedReason(reason)}
                                />
                            </label>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={confirmReject}
                            className="flex-1 rounded-full bg-[#b13a3a] px-4 py-2 text-xs font-black text-white"
                        >
                            ยืนยันปฏิเสธ
                        </button>
                        <button
                            onClick={() => setShowReject(false)}
                            className="flex-1 rounded-full border border-[#eadfce] bg-white px-4 py-2 text-xs font-black text-[#6b5d4b]"
                        >
                            ยกเลิก
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal
                open={showEmergencyPause}
                title="ยืนยันปิดร้านชั่วคราว"
                onClose={() => setShowEmergencyPause(false)}
            >
                <div className="space-y-4 text-sm text-[#3f3425]">
                    <div className="rounded-2xl border border-[#fde7e7] bg-[#fff5f5] p-4">
                        <p className="text-sm font-black text-[#b13a3a]">โหมดหยุดฉุกเฉิน</p>
                        <p className="text-xs text-[#8f5b5b]">
                            หากปิดร้าน ระบบจะหยุดรับออเดอร์ใหม่ทันที และแจ้งลูกค้าว่าร้านไม่พร้อมให้บริการ
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={confirmPause}
                            className="flex-1 rounded-full bg-[#2f2a1d] px-4 py-2 text-xs font-black text-white"
                        >
                            ยืนยันปิดร้าน
                        </button>
                        <button
                            onClick={() => setShowEmergencyPause(false)}
                            className="flex-1 rounded-full border border-[#eadfce] bg-white px-4 py-2 text-xs font-black text-[#6b5d4b]"
                        >
                            ยกเลิก
                        </button>
                    </div>
                </div>
            </Modal>
        </main>
    );
}
