"use client";

import React from "react";
import {
    AlertTriangle,
    ArrowUpRight,
    Banknote,
    Loader2,
    MapPinned,
    Package,
    Phone,
    RefreshCw,
    Search,
    ShoppingBag,
    Sparkles,
    Wallet,
} from "lucide-react";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";

type OrderStatus =
    | "pending"
    | "accepted"
    | "preparing"
    | "ready"
    | "delivering"
    | "delivered"
    | "cancelled";

type PaymentStatus = "UNPAID" | "PAID" | "REFUNDED";

type OrderItem = {
    orderItemId: number;
    menuItemId: number;
    name: string;
    imageUrl?: string | null;
    quantity: number;
    priceAtOrder: number;
    totalPrice: number;
};

type Order = {
    orderId: string;
    patientId: string;
    customerName?: string | null;
    totalAmount: number;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    deliveryAddress: string;
    contactPhone?: string | null;
    createdAt: string;
    items: OrderItem[];
};

type OrderFilter = "all" | "active" | OrderStatus | "unpaid";

const STATUS_STEPS: OrderStatus[] = [
    "pending",
    "accepted",
    "preparing",
    "ready",
    "delivering",
    "delivered",
    "cancelled",
];

const STATUS_LABELS: Record<OrderStatus, string> = {
    pending: "รอรับออเดอร์",
    accepted: "รับออเดอร์แล้ว",
    preparing: "กำลังเตรียมอาหาร",
    ready: "พร้อมส่ง",
    delivering: "กำลังจัดส่ง",
    delivered: "จัดส่งสำเร็จ",
    cancelled: "ยกเลิก",
};

const STATUS_STYLES: Record<OrderStatus, string> = {
    pending: "bg-[#fff2d8] text-[#9a5b00]",
    accepted: "bg-[#eef5cb] text-[#6d8616]",
    preparing: "bg-[#e7f1ff] text-[#2a63c8]",
    ready: "bg-[#e7fbf4] text-[#147a5b]",
    delivering: "bg-[#ffe8d7] text-[#c66a18]",
    delivered: "bg-[#ebf8ea] text-[#2d7a3f]",
    cancelled: "bg-[#f1efea] text-[#786f5f]",
};

const FILTER_OPTIONS: Array<{ key: OrderFilter; label: string }> = [
    { key: "all", label: "ทั้งหมด" },
    { key: "active", label: "งานที่กำลังเดิน" },
    { key: "pending", label: "รอรับงาน" },
    { key: "preparing", label: "กำลังเตรียม" },
    { key: "delivering", label: "กำลังส่ง" },
    { key: "unpaid", label: "ค้างชำระ" },
];

const REALTIME_GAP_ITEMS = [
    "ตำแหน่งไรเดอร์แบบ live ยังไม่ถูกส่งมาจาก API orders",
    "เวลา ETA ของการจัดส่งยังไม่มี field สำหรับคำนวณตรงในหน้าติดตามนี้",
    "สาขาหรือ partner ต้นทางของแต่ละออเดอร์ยังไม่ได้ถูกส่งกลับมาใน payload ปัจจุบัน",
];

function unwrapArray<T>(payload: unknown): T[] {
    if (Array.isArray(payload)) {
        return payload as T[];
    }
    if (payload && typeof payload === "object" && "data" in payload) {
        const nested = (payload as { data?: unknown }).data;
        return Array.isArray(nested) ? (nested as T[]) : [];
    }
    return [];
}

function formatCurrency(value: number) {
    return new Intl.NumberFormat("th-TH", {
        style: "currency",
        currency: "THB",
        maximumFractionDigits: 0,
    }).format(value);
}

function formatDateTime(value: string) {
    return new Date(value).toLocaleString("th-TH", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function formatShortDate(value: string) {
    return new Date(value).toLocaleDateString("th-TH", {
        day: "numeric",
        month: "short",
    });
}

function minutesSince(value: string) {
    const diff = Date.now() - new Date(value).getTime();
    return Math.max(Math.round(diff / 60000), 0);
}

function isActiveStatus(status: OrderStatus) {
    return ["pending", "accepted", "preparing", "ready", "delivering"].includes(status);
}

function getStatusCount(orders: Order[], status: OrderStatus) {
    return orders.filter((order) => order.status === status).length;
}

function getPaymentCount(orders: Order[], paymentStatus: PaymentStatus) {
    return orders.filter((order) => order.paymentStatus === paymentStatus).length;
}

export default function AdminTrackingDashboard() {
    const { user } = useAuthStore();
    const [loading, setLoading] = React.useState(true);
    const [refreshing, setRefreshing] = React.useState(false);
    const [orders, setOrders] = React.useState<Order[]>([]);
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
    const [filter, setFilter] = React.useState<OrderFilter>("all");
    const [query, setQuery] = React.useState("");
    const [lastUpdated, setLastUpdated] = React.useState<string | null>(null);

    const fetchOrders = React.useCallback(async (showSpinner = true) => {
        if (showSpinner) {
            setLoading(true);
        } else {
            setRefreshing(true);
        }

        try {
            const response = await api.get("/orders");
            const payload = unwrapArray<Order>(response.data);
            setOrders(payload);
            setErrorMessage(null);
            setLastUpdated(new Date().toISOString());
        } catch (error) {
            console.error("Failed to load admin tracking orders:", error);
            setErrorMessage("โหลดข้อมูลติดตามออเดอร์ไม่สำเร็จ");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    React.useEffect(() => {
        void fetchOrders(true);
        const timer = window.setInterval(() => {
            void fetchOrders(false);
        }, 30000);
        return () => window.clearInterval(timer);
    }, [fetchOrders]);

    const filteredOrders = React.useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();

        return orders.filter((order) => {
            const matchesFilter =
                filter === "all"
                    ? true
                    : filter === "active"
                      ? isActiveStatus(order.status)
                      : filter === "unpaid"
                        ? order.paymentStatus === "UNPAID"
                        : order.status === filter;

            if (!matchesFilter) {
                return false;
            }

            if (!normalizedQuery) {
                return true;
            }

            const haystack = [
                order.orderId,
                order.customerName,
                order.deliveryAddress,
                order.contactPhone,
                ...order.items.map((item) => item.name),
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return haystack.includes(normalizedQuery);
        });
    }, [filter, orders, query]);

    const activeOrders = React.useMemo(
        () => orders.filter((order) => isActiveStatus(order.status)),
        [orders],
    );

    const paidRevenue = React.useMemo(
        () =>
            orders
                .filter((order) => order.paymentStatus === "PAID")
                .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0),
        [orders],
    );

    const unpaidRevenue = React.useMemo(
        () =>
            orders
                .filter((order) => order.paymentStatus === "UNPAID")
                .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0),
        [orders],
    );

    const averageTicket = React.useMemo(() => {
        if (orders.length === 0) {
            return 0;
        }
        const total = orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
        return total / orders.length;
    }, [orders]);

    const atRiskOrders = React.useMemo(
        () =>
            activeOrders
                .filter((order) => minutesSince(order.createdAt) >= 45)
                .sort((a, b) => minutesSince(b.createdAt) - minutesSince(a.createdAt))
                .slice(0, 4),
        [activeOrders],
    );

    const newestOrders = React.useMemo(
        () =>
            [...orders]
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 5),
        [orders],
    );

    const popularItems = React.useMemo(() => {
        const itemMap = new Map<string, { name: string; quantity: number; revenue: number; orders: number }>();

        orders.forEach((order) => {
            const seenInOrder = new Set<string>();

            order.items.forEach((item) => {
                const current = itemMap.get(item.name) ?? {
                    name: item.name,
                    quantity: 0,
                    revenue: 0,
                    orders: 0,
                };

                current.quantity += Number(item.quantity || 0);
                current.revenue += Number(item.totalPrice || 0);

                if (!seenInOrder.has(item.name)) {
                    current.orders += 1;
                    seenInOrder.add(item.name);
                }

                itemMap.set(item.name, current);
            });
        });

        return Array.from(itemMap.values())
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 5);
    }, [orders]);

    const hourlyLoad = React.useMemo(() => {
        const buckets = new Map<string, number>();

        orders.forEach((order) => {
            const date = new Date(order.createdAt);
            const label = date.toLocaleTimeString("th-TH", {
                hour: "2-digit",
                minute: "2-digit",
            });
            buckets.set(label, (buckets.get(label) ?? 0) + 1);
        });

        return Array.from(buckets.entries())
            .map(([label, count]) => ({ label, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 4);
    }, [orders]);

    if (user?.role && user.role !== "admin") {
        return (
            <div className="flex-1 ml-64 min-h-screen bg-[#fffbf5] px-8 py-12">
                <div className="mx-auto max-w-4xl rounded-[32px] border border-[#eee4cf] bg-white p-10 shadow-[0_20px_60px_rgba(0,0,0,0.04)]">
                    <p className="inline-flex rounded-full bg-[#fff0da] px-4 py-2 text-xs font-black text-[#a86614]">
                        จำกัดสิทธิ์การเข้าถึง
                    </p>
                    <h1 className="mt-5 text-3xl font-black text-[#2f2a1c]">หน้าติดตามนี้สำหรับแอดมิน</h1>
                    <p className="mt-3 max-w-2xl text-sm font-medium text-[#83765d]">
                        ถ้าต้องการให้ role อื่นใช้หน้าเดียวกันได้ ผมช่วยแยกมุมมองตามสิทธิ์ต่อให้ได้ครับ
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 min-h-screen overflow-y-auto bg-[#fffbf5] pl-64">
            <main className="mx-auto max-w-[1380px] px-8 py-10">
                <section className="relative overflow-hidden rounded-[36px] border border-[#efe5d0] bg-[radial-gradient(circle_at_top_left,_rgba(210,234,106,0.28),_rgba(255,255,255,0.98)_28%),linear-gradient(135deg,#fffef9_0%,#faf4e7_100%)] p-8 shadow-[0_20px_70px_rgba(120,100,60,0.08)]">
                    <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-[#f7efc9]/60 blur-3xl" />
                    <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                        <div className="max-w-3xl">
                            <p className="inline-flex items-center gap-2 rounded-full bg-[#eef5cb] px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#6d8616]">
                                <Sparkles size={14} />
                                Admin Tracking
                            </p>
                            <h1 className="mt-5 text-4xl font-black tracking-tight text-[#2f2a1c] md:text-5xl">
                                ศูนย์ติดตามออเดอร์แบบเรียลไทม์
                            </h1>
                            <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-[#81735b]">
                                หน้านี้ถูกปรับใหม่ให้ยึดข้อมูลจากฐานข้อมูลออเดอร์จริงของระบบ WellMate
                                เพื่อให้แอดมินเห็นภาพรวมงานที่กำลังเดิน งานค้างชำระ งานเสี่ยงล่าช้า
                                และรายการอาหารที่ถูกสั่งบ่อยในหน้าเดียว
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <div className="rounded-[24px] border border-white/70 bg-white/85 px-5 py-4 shadow-[0_14px_30px_rgba(0,0,0,0.04)] backdrop-blur">
                                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#af9f7c]">
                                    Last Sync
                                </p>
                                <p className="mt-1 text-sm font-black text-[#2f2a1c]">
                                    {lastUpdated
                                        ? new Date(lastUpdated).toLocaleTimeString("th-TH", {
                                              hour: "2-digit",
                                              minute: "2-digit",
                                          })
                                        : "ยังไม่อัปเดต"}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => void fetchOrders(false)}
                                className="inline-flex items-center gap-2 rounded-[24px] bg-[#2f2a1c] px-5 py-4 text-sm font-black text-white shadow-[0_14px_30px_rgba(47,42,28,0.18)] transition-transform hover:scale-[1.02]"
                            >
                                <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
                                รีเฟรชข้อมูล
                            </button>
                        </div>
                    </div>
                </section>

                <section className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                    <MetricCard
                        title="ออเดอร์ทั้งหมด"
                        value={String(orders.length)}
                        helper="รวมทุกสถานะในระบบ"
                        icon={<ShoppingBag size={20} />}
                        tone="lime"
                    />
                    <MetricCard
                        title="งานที่กำลังเดิน"
                        value={String(activeOrders.length)}
                        helper="รอรับงานจนถึงกำลังส่ง"
                        icon={<Package size={20} />}
                        tone="orange"
                    />
                    <MetricCard
                        title="ยอดที่ชำระแล้ว"
                        value={formatCurrency(paidRevenue)}
                        helper={`${getPaymentCount(orders, "PAID")} ออเดอร์`}
                        icon={<Banknote size={20} />}
                        tone="blue"
                    />
                    <MetricCard
                        title="ยอดค้างชำระ"
                        value={formatCurrency(unpaidRevenue)}
                        helper={`${getPaymentCount(orders, "UNPAID")} ออเดอร์`}
                        icon={<Wallet size={20} />}
                        tone="red"
                    />
                </section>

                <section className="mt-8 grid grid-cols-1 gap-8 xl:grid-cols-[1.2fr_0.8fr]">
                    <div className="space-y-8">
                        <div className="rounded-[34px] border border-[#efe6d1] bg-white p-6 shadow-[0_18px_45px_rgba(156,140,100,0.08)]">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#b2a27f]">
                                        Order Flow
                                    </p>
                                    <h2 className="mt-2 text-2xl font-black text-[#2f2a1c]">
                                        ติดตามคิวงานจากข้อมูลจริง
                                    </h2>
                                </div>

                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                    <label className="relative">
                                        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#97896d]" />
                                        <input
                                            value={query}
                                            onChange={(event) => setQuery(event.target.value)}
                                            placeholder="ค้นหาเลขออเดอร์ ลูกค้า รายการอาหาร"
                                            className="w-full rounded-2xl border border-[#ece2ce] bg-[#fffdf8] py-3 pl-11 pr-4 text-sm font-semibold text-[#2f2a1c] outline-none transition focus:border-[#d8ef6f] sm:w-80"
                                        />
                                    </label>
                                    <div className="rounded-2xl bg-[#f7f4eb] px-4 py-3 text-sm font-bold text-[#7e7259]">
                                        {filteredOrders.length} รายการ
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
                                {FILTER_OPTIONS.map((item) => (
                                    <button
                                        key={item.key}
                                        type="button"
                                        onClick={() => setFilter(item.key)}
                                        className={`rounded-full px-4 py-2 text-[12px] font-black transition-all ${
                                            filter === item.key
                                                ? "bg-[#d8f06d] text-[#2e2a1f]"
                                                : "bg-[#f3f0e8] text-[#81745c] hover:bg-[#ece6d7]"
                                        }`}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>

                            {errorMessage && (
                                <div className="mt-5 rounded-[24px] border border-[#ffd7cf] bg-[#fff1ed] px-4 py-4 text-sm font-bold text-[#b55239]">
                                    {errorMessage}
                                </div>
                            )}

                            {loading ? (
                                <div className="flex min-h-[300px] items-center justify-center">
                                    <div className="flex flex-col items-center gap-4 text-[#8a7d62]">
                                        <Loader2 className="h-10 w-10 animate-spin text-[#a2c52a]" />
                                        <p className="text-sm font-bold">กำลังโหลดข้อมูลออเดอร์</p>
                                    </div>
                                </div>
                            ) : filteredOrders.length === 0 ? (
                                <div className="mt-6 rounded-[28px] border border-dashed border-[#e8ddc4] bg-[#fffdf8] px-6 py-12 text-center">
                                    <p className="text-lg font-black text-[#2f2a1c]">
                                        ยังไม่มีรายการตรงกับตัวกรองนี้
                                    </p>
                                    <p className="mt-2 text-sm font-medium text-[#8d8169]">
                                        ลองเปลี่ยนสถานะหรือคำค้นหาแล้วรีเฟรชอีกครั้ง
                                    </p>
                                </div>
                            ) : (
                                <div className="mt-6 space-y-4">
                                    {filteredOrders.map((order) => (
                                        <article
                                            key={order.orderId}
                                            className="rounded-[28px] border border-[#f0ead9] bg-[#fffdfa] p-5 transition-all hover:-translate-y-0.5 hover:border-[#d8f06d] hover:shadow-[0_12px_30px_rgba(190,210,100,0.15)]"
                                        >
                                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                                <div className="min-w-0">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#b6a98d]">
                                                            #{order.orderId}
                                                        </p>
                                                        <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${STATUS_STYLES[order.status]}`}>
                                                            {STATUS_LABELS[order.status]}
                                                        </span>
                                                        <span
                                                            className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${
                                                                order.paymentStatus === "PAID"
                                                                    ? "bg-[#eaf8e7] text-[#2d7a3f]"
                                                                    : "bg-[#fff0da] text-[#a86614]"
                                                            }`}
                                                        >
                                                            {order.paymentStatus === "PAID" ? "ชำระแล้ว" : "ค้างชำระ"}
                                                        </span>
                                                    </div>

                                                    <h3 className="mt-3 text-xl font-black text-[#2f2a1c]">
                                                        {order.customerName?.trim() || "ผู้ใช้ในระบบ"}
                                                    </h3>
                                                    <p className="mt-1 text-sm font-semibold text-[#8d8068]">
                                                        {order.items.length} รายการ • {formatCurrency(Number(order.totalAmount || 0))}
                                                    </p>
                                                </div>

                                                <div className="text-left lg:text-right">
                                                    <p className="text-xs font-bold text-[#a09174]">
                                                        สร้างเมื่อ {formatDateTime(order.createdAt)}
                                                    </p>
                                                    <p className="mt-1 text-sm font-black text-[#2f2a1c]">
                                                        ผ่านมา {minutesSince(order.createdAt)} นาที
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                                                <InfoChip
                                                    icon={<Phone size={14} />}
                                                    label={order.contactPhone || "ไม่มีเบอร์ติดต่อ"}
                                                />
                                                <InfoChip
                                                    icon={<MapPinned size={14} />}
                                                    label={order.deliveryAddress}
                                                />
                                            </div>

                                            <div className="mt-4 rounded-[22px] bg-[#f8f4ea] p-4">
                                                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#a09174]">
                                                    รายการอาหาร
                                                </p>
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {order.items.map((item) => (
                                                        <span
                                                            key={`${order.orderId}-${item.orderItemId}`}
                                                            className="rounded-full bg-white px-3 py-2 text-xs font-bold text-[#5f5643]"
                                                        >
                                                            {item.name} x{item.quantity}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="rounded-[34px] border border-[#efe6d1] bg-white p-6 shadow-[0_18px_45px_rgba(156,140,100,0.08)]">
                            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#b2a27f]">
                                Stage Snapshot
                            </p>
                            <h2 className="mt-2 text-2xl font-black text-[#2f2a1c]">ภาพรวมแต่ละสถานะ</h2>

                            <div className="mt-6 space-y-4">
                                {STATUS_STEPS.map((status) => {
                                    const count = getStatusCount(orders, status);
                                    const percentage = orders.length === 0 ? 0 : Math.round((count / orders.length) * 100);

                                    return (
                                        <div key={status}>
                                            <div className="mb-2 flex items-center justify-between text-sm font-bold text-[#6b6049]">
                                                <span>{STATUS_LABELS[status]}</span>
                                                <span>{count} รายการ</span>
                                            </div>
                                            <div className="h-2.5 overflow-hidden rounded-full bg-[#efe8d6]">
                                                <div
                                                    className="h-full rounded-full bg-[#d8f06d]"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <SmallInsightCard
                                title="บิลเฉลี่ยต่อออเดอร์"
                                value={formatCurrency(averageTicket)}
                                helper="คำนวณจาก totalAmount"
                                tone="lime"
                            />
                            <SmallInsightCard
                                title="ออเดอร์ล่าสุด"
                                value={newestOrders[0] ? formatShortDate(newestOrders[0].createdAt) : "-"}
                                helper={newestOrders[0]?.orderId || "ยังไม่มีข้อมูล"}
                                tone="orange"
                            />
                        </div>

                        <div className="rounded-[34px] border border-[#efe6d1] bg-white p-6 shadow-[0_18px_45px_rgba(156,140,100,0.08)]">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#b2a27f]">
                                        Follow Up
                                    </p>
                                    <h2 className="mt-2 text-2xl font-black text-[#2f2a1c]">งานที่ควรรีบดู</h2>
                                </div>
                                <div className="rounded-2xl bg-[#fff1ed] px-4 py-2 text-xs font-black text-[#b55239]">
                                    {atRiskOrders.length} เคส
                                </div>
                            </div>

                            <div className="mt-5 space-y-3">
                                {atRiskOrders.length === 0 ? (
                                    <div className="rounded-[24px] bg-[#f8f4ea] px-4 py-5 text-sm font-semibold text-[#7a705c]">
                                        ยังไม่มีออเดอร์ active ที่เกิน 45 นาที
                                    </div>
                                ) : (
                                    atRiskOrders.map((order) => (
                                        <div
                                            key={order.orderId}
                                            className="rounded-[24px] border border-[#f0ead9] bg-[#fffdfa] px-4 py-4"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <p className="text-sm font-black text-[#2f2a1c]">
                                                        {order.customerName?.trim() || order.orderId}
                                                    </p>
                                                    <p className="mt-1 text-xs font-semibold text-[#8d8068]">
                                                        {STATUS_LABELS[order.status]} • ผ่านมา {minutesSince(order.createdAt)} นาที
                                                    </p>
                                                </div>
                                                <AlertTriangle className="h-5 w-5 text-[#d26b52]" />
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="rounded-[34px] border border-[#efe6d1] bg-white p-6 shadow-[0_18px_45px_rgba(156,140,100,0.08)]">
                            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#b2a27f]">
                                Popular Menu
                            </p>
                            <h2 className="mt-2 text-2xl font-black text-[#2f2a1c]">รายการที่ถูกสั่งบ่อย</h2>

                            <div className="mt-5 space-y-3">
                                {popularItems.length === 0 ? (
                                    <div className="rounded-[24px] bg-[#f8f4ea] px-4 py-5 text-sm font-semibold text-[#7a705c]">
                                        ยังไม่มีข้อมูลเมนูจากคำสั่งซื้อ
                                    </div>
                                ) : (
                                    popularItems.map((item, index) => (
                                        <div
                                            key={item.name}
                                            className="flex items-center justify-between gap-4 rounded-[24px] border border-[#f0ead9] bg-[#fffdfa] px-4 py-4"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef5cb] text-sm font-black text-[#6d8616]">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-[#2f2a1c]">{item.name}</p>
                                                    <p className="mt-1 text-xs font-semibold text-[#8d8068]">
                                                        {item.orders} ออเดอร์ • {item.quantity} ชิ้น
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="text-sm font-black text-[#2f2a1c]">
                                                {formatCurrency(item.revenue)}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="rounded-[34px] border border-[#efe6d1] bg-white p-6 shadow-[0_18px_45px_rgba(156,140,100,0.08)]">
                            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#b2a27f]">
                                Peak Time
                            </p>
                            <h2 className="mt-2 text-2xl font-black text-[#2f2a1c]">ช่วงเวลาที่มีออเดอร์หนาแน่น</h2>

                            <div className="mt-5 space-y-3">
                                {hourlyLoad.length === 0 ? (
                                    <div className="rounded-[24px] bg-[#f8f4ea] px-4 py-5 text-sm font-semibold text-[#7a705c]">
                                        ยังไม่มีข้อมูลคำสั่งซื้อให้สรุปช่วงเวลา
                                    </div>
                                ) : (
                                    hourlyLoad.map((item) => (
                                        <div key={item.label}>
                                            <div className="mb-2 flex items-center justify-between text-sm font-bold text-[#6b6049]">
                                                <span>{item.label}</span>
                                                <span>{item.count} ออเดอร์</span>
                                            </div>
                                            <div className="h-2.5 overflow-hidden rounded-full bg-[#efe8d6]">
                                                <div
                                                    className="h-full rounded-full bg-[#f5b66c]"
                                                    style={{
                                                        width: `${Math.max(
                                                            20,
                                                            Math.round((item.count / hourlyLoad[0].count) * 100),
                                                        )}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="rounded-[34px] border border-[#efe6d1] bg-[#fffdf8] p-6 shadow-[0_18px_45px_rgba(156,140,100,0.08)]">
                            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#b2a27f]">
                                Missing Connections
                            </p>
                            <h2 className="mt-2 text-2xl font-black text-[#2f2a1c]">ส่วนที่ยังไม่มีข้อมูลสด</h2>
                            <div className="mt-5 space-y-3">
                                {REALTIME_GAP_ITEMS.map((item) => (
                                    <div
                                        key={item}
                                        className="flex items-start gap-3 rounded-[22px] bg-[#f8f4ea] px-4 py-4 text-sm font-semibold text-[#6f644f]"
                                    >
                                        <ArrowUpRight className="mt-0.5 h-4 w-4 text-[#a08f68]" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

function MetricCard({
    title,
    value,
    helper,
    icon,
    tone,
}: {
    title: string;
    value: string;
    helper: string;
    icon: React.ReactNode;
    tone: "lime" | "orange" | "blue" | "red";
}) {
    const toneClass =
        tone === "lime"
            ? {
                  card: "from-[#f8ffe1] to-[#eef8bf]",
                  icon: "bg-[#dff26a] text-[#6f8f1f]",
              }
            : tone === "orange"
              ? {
                    card: "from-[#fff3e4] to-[#ffe1c0]",
                    icon: "bg-[#ffc483] text-[#c66a18]",
                }
              : tone === "blue"
                ? {
                      card: "from-[#eef6ff] to-[#dcecff]",
                      icon: "bg-[#bfd9ff] text-[#2563eb]",
                  }
                : {
                      card: "from-[#fff1ef] to-[#ffd9d4]",
                      icon: "bg-[#ffb8ac] text-[#d04b39]",
                  };

    return (
        <div
            className={`rounded-[30px] border border-white/70 bg-gradient-to-br ${toneClass.card} p-6 shadow-[0_16px_45px_rgba(170,160,120,0.12)]`}
        >
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#796f57]">
                        {title}
                    </p>
                    <p className="mt-3 text-3xl font-black text-[#2f2a1c]">{value}</p>
                    <p className="mt-2 text-xs font-semibold text-[#8b8067]">{helper}</p>
                </div>
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${toneClass.icon}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}

function InfoChip({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <div className="flex items-center gap-2 rounded-2xl bg-[#f6f2e8] px-3 py-3 text-xs font-bold text-[#6f644f]">
            <span className="shrink-0 text-[#8d8167]">{icon}</span>
            <span className="truncate">{label}</span>
        </div>
    );
}

function SmallInsightCard({
    title,
    value,
    helper,
    tone,
}: {
    title: string;
    value: string;
    helper: string;
    tone: "lime" | "orange";
}) {
    const toneClass =
        tone === "lime"
            ? "bg-[#f3f9d2] text-[#607b12]"
            : "bg-[#fff0dd] text-[#c36f17]";

    return (
        <div className="rounded-[28px] border border-[#efe6d1] bg-white p-5 shadow-[0_14px_35px_rgba(156,140,100,0.06)]">
            <div className={`inline-flex rounded-2xl px-3 py-2 text-[11px] font-black uppercase tracking-[0.16em] ${toneClass}`}>
                {title}
            </div>
            <p className="mt-4 text-2xl font-black text-[#2f2a1c]">{value}</p>
            <p className="mt-2 text-sm font-semibold text-[#8d8169]">{helper}</p>
        </div>
    );
}
