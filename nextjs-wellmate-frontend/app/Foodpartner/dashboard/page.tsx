"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
    Bell,
    ChartLine,
    ChevronDown,
    Crown,
    FileText,
    Flame,
    Store,
    TrendingDown,
    TrendingUp,
} from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";
import BackgroundPattern from "@/components/dashboard/BackgroundPattern";
import api from "@/lib/api";
import Swal from "sweetalert2";

type OrderStatus = "new" | "preparing" | "ready" | "delivered" | "cancelled";

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

type ProfileResponse = {
    storeOnline?: boolean | null;
    partnerName?: string | null;
};

type SummaryCard = {
    title: string;
    value: string;
    hint: string;
    badge: string;
    badgeTone: "up" | "down";
    icon: React.ReactNode;
};

type RecentOrder = {
    id: string;
    time: string;
    customer: string;
    amount: number;
    status: OrderStatus;
    items: ApiOrderItem[];
};

type TopMenu = {
    rank: number;
    name: string;
    sold: number;
    color: string;
    imageUrl?: string | null;
};

type RangeKey = "7d" | "month" | "year";

const RANGE_LABEL: Record<RangeKey, string> = {
    "7d": "7 วันที่ผ่านมา",
    month: "เดือนนี้",
    year: "ปีนี้",
};

const STATUS_STYLES: Record<OrderStatus, string> = {
    new: "bg-[#fde7e7] text-[#b13a3a]",
    preparing: "bg-[#fff6df] text-[#8c6b13]",
    ready: "bg-[#e7f2e9] text-[#2f7d57]",
    delivered: "bg-[#e6f0ff] text-[#3f6fb5]",
    cancelled: "bg-[#f9d8d8] text-[#b13a3a]",
};

const STATUS_LABEL: Record<OrderStatus, string> = {
    new: "รอรับ",
    preparing: "กำลังทำ",
    ready: "พร้อมส่ง",
    delivered: "ส่งแล้ว",
    cancelled: "ยกเลิก",
};

const formatBaht = (value: number) =>
    `${value.toLocaleString("th-TH", { maximumFractionDigits: 0 })} บาท`;

const toOrderStatus = (status: ApiOrder["status"]): OrderStatus => {
    if (status === "pending") return "new";
    if (status === "accepted" || status === "preparing") return "preparing";
    if (status === "ready" || status === "delivering") return "ready";
    if (status === "delivered") return "delivered";
    return "cancelled";
};

const getDayKey = (iso: string) => {
    const date = new Date(iso);
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const formatDateTh = (date: Date) =>
    date.toLocaleDateString("th-TH", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

const greetingText = () => {
    const hour = new Date().getHours();
    if (hour < 11) return "สวัสดีตอนเช้า";
    if (hour < 15) return "สวัสดีตอนเที่ยง";
    if (hour < 19) return "สวัสดีตอนบ่าย";
    return "สวัสดีตอนเย็น";
};

export default function FoodPartnerDashboardPage() {
    const [storeOnline, setStoreOnline] = useState(true);
    const [partnerName, setPartnerName] = useState("ร้านของคุณ");
    const [range, setRange] = useState<RangeKey>("7d");
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);
    const [orders, setOrders] = useState<ApiOrder[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [selectedOrder, setSelectedOrder] = useState<RecentOrder | null>(null);
    const today = useMemo(() => new Date(), []);

    const unwrap = <T,>(payload: ApiEnvelope<T> | T): T => {
        if (payload && typeof payload === "object" && "data" in payload) {
            return (payload as ApiEnvelope<T>).data;
        }
        return payload as T;
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setLoadError("");
            try {
                const [ordersRes, profileRes] = await Promise.all([
                    api.get<ApiEnvelope<ApiOrder[]> | ApiOrder[]>("/orders"),
                    api.get<ApiEnvelope<ProfileResponse> | ProfileResponse>(
                        "/foodpartner_system/profile",
                    ),
                ]);
                const orderData = unwrap(ordersRes.data);
                const profileData = unwrap(profileRes.data) || {};
                setOrders(Array.isArray(orderData) ? orderData : []);
                setStoreOnline(profileData.storeOnline ?? true);
                setPartnerName(profileData.partnerName ?? "ร้านของคุณ");
            } catch (error) {
                console.error("Failed to load dashboard data:", error);
                setLoadError("โหลดข้อมูลแดชบอร์ดไม่สำเร็จ");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const updateStoreStatus = async () => {
        const next = !storeOnline;
        setStoreOnline(next);
        try {
            await api.patch("/foodpartner_system/profile", { storeOnline: next });
        } catch (error) {
            console.error("Failed to update store status:", error);
            setStoreOnline((prev) => !prev);
            Swal.fire({
                icon: "error",
                title: "อัปเดตสถานะไม่สำเร็จ",
                text: "ไม่สามารถอัปเดตสถานะร้านได้ กรุณาลองใหม่",
                confirmButtonColor: "#3d3522",
                background: "#fffbf5",
            });
        }
    };

    const rangeDays = range === "7d" ? 7 : range === "month" ? 30 : 365;

    const rangeOrders = useMemo(() => {
        const now = Date.now();
        const ms = rangeDays * 24 * 60 * 60 * 1000;
        return orders.filter((order) => now - new Date(order.createdAt).getTime() <= ms);
    }, [orders, rangeDays]);

    const todayKey = getDayKey(new Date().toISOString());
    const todayOrders = orders.filter((order) => getDayKey(order.createdAt) === todayKey);

    const revenueToday = todayOrders.reduce(
        (sum, order) => sum + order.items.reduce((s, i) => s + Number(i.totalPrice || 0), 0),
        0,
    );

    const activeOrders = orders.filter((order) =>
        ["pending", "accepted", "preparing", "ready", "delivering"].includes(order.status),
    ).length;

    const cancelledToday = todayOrders.filter((order) => order.status === "cancelled").length;

    const totalOrdersToday = todayOrders.length;

    const chartSeries = useMemo(() => {
        const days: { key: string; label: string; sales: number; orders: number }[] = [];
        for (let i = rangeDays - 1; i >= 0; i -= 1) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const key = getDayKey(date.toISOString());
            const label = date.toLocaleDateString("th-TH", {
                day: "2-digit",
                month: "short",
            });
            days.push({ key, label, sales: 0, orders: 0 });
        }
        rangeOrders.forEach((order) => {
            const key = getDayKey(order.createdAt);
            const target = days.find((d) => d.key === key);
            if (!target) return;
            const subtotal = order.items.reduce((sum, i) => sum + Number(i.totalPrice || 0), 0);
            target.sales += subtotal;
            target.orders += 1;
        });
        return days;
    }, [rangeOrders, rangeDays]);

    const maxSales = Math.max(1, ...chartSeries.map((d) => d.sales));
    const points = chartSeries.map((d, i) => {
        const x = (i / (chartSeries.length - 1 || 1)) * 100;
        const y = 100 - (d.sales / maxSales) * 80 - 10;
        return { ...d, x, y };
    });

    const areaPath = points
        .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
        .join(" ");
    const areaFill = `${areaPath} L 100 100 L 0 100 Z`;

    const topMenus: TopMenu[] = useMemo(() => {
        const countMap = new Map<string, { count: number; imageUrl?: string | null }>();
        rangeOrders
            .filter((order) => order.status === "delivered")
            .forEach((order) => {
                order.items.forEach((item) => {
                    const current = countMap.get(item.name);
                    const nextCount = (current?.count ?? 0) + item.quantity;
                    const nextImage = current?.imageUrl ?? item.imageUrl ?? null;
                    countMap.set(item.name, { count: nextCount, imageUrl: nextImage });
                });
            });
        const colors = [
            "from-[#b8f7d4] to-[#6ee7a8]",
            "from-[#d3f0ff] to-[#90cdf4]",
            "from-[#ffe4b8] to-[#f6ad55]",
            "from-[#fbd1ff] to-[#d6bcfa]",
            "from-[#ffd2d2] to-[#feb2b2]",
        ];
        return Array.from(countMap.entries())
            .sort((a, b) => b[1].count - a[1].count)
            .slice(0, 5)
            .map((entry, index) => ({
                rank: index + 1,
                name: entry[0],
                sold: entry[1].count,
                imageUrl: entry[1].imageUrl ?? null,
                color: colors[index % colors.length],
            }));
    }, [rangeOrders]);

    const recentOrders: RecentOrder[] = useMemo(() => {
        return orders
            .slice()
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5)
            .map((order) => ({
                id: order.orderId,
                time: new Date(order.createdAt).toLocaleTimeString("th-TH", {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
                customer: order.customerName ?? "Customer",
                amount: order.items.reduce((sum, i) => sum + Number(i.totalPrice || 0), 0),
                status: toOrderStatus(order.status),
                items: order.items,
            }));
    }, [orders]);

    const hasNotifications = cancelledToday > 0;

    const summaryCards: SummaryCard[] = [
        {
            title: "ยอดขายวันนี้",
            value: formatBaht(revenueToday),
            hint: "ยอดขายรวมจากออเดอร์วันนี้",
            badge: revenueToday > 0 ? "↑ LIVE" : "LIVE",
            badgeTone: "up",
            icon: <ChartLine size={18} />,
        },
        {
            title: "ออเดอร์วันนี้",
            value: `${totalOrdersToday} ออเดอร์`,
            hint: "จำนวนออเดอร์ที่เข้ามาวันนี้",
            badge: "LIVE",
            badgeTone: "up",
            icon: <FileText size={18} />,
        },
        {
            title: "ออเดอร์ที่กำลังทำ",
            value: `${activeOrders} ออเดอร์`,
            hint: "ออเดอร์ที่ยังไม่เสร็จสิ้น",
            badge: "LIVE",
            badgeTone: "up",
            icon: <Flame size={18} />,
        },
        {
            title: "ยกเลิกวันนี้",
            value: `${cancelledToday} ออเดอร์`,
            hint: "จำนวนออเดอร์ที่ยกเลิกวันนี้",
            badge: cancelledToday > 0 ? `↓ ${cancelledToday}` : "LIVE",
            badgeTone: cancelledToday > 0 ? "down" : "up",
            icon: <TrendingDown size={18} />,
        },
    ];

    return (
        <div className="relative flex min-h-screen bg-[#faf4ea] text-[#3f3425]">
            <BackgroundPattern />
            <Sidebar />

            <main className="flex-1 px-8 py-8 md:ml-64">
                <div className="mx-auto max-w-[1300px] space-y-6">
                    <section className="rounded-[28px] border border-[#eadfce] bg-white/90 p-6 shadow-sm backdrop-blur">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <div className="inline-flex items-center gap-2 rounded-full bg-[#f4ead8] px-3 py-1 text-xs font-bold text-[#7b6a55]">
                                    <Store size={14} /> WellMate Food Partner
                                </div>
                                <h1 className="mt-3 text-3xl font-black text-[#2f2a1d]">
                                    {greetingText()}, {partnerName}!
                                </h1>
                                <p className="mt-1 text-sm text-[#6b5d4b]">
                                    ติดตามภาพรวมยอดขายและออเดอร์ของวันนี้แบบเรียลไทม์
                                </p>
                                <p className="mt-1 text-xs text-[#8c7a66]">{formatDateTh(today)}</p>
                            </div>
                            <div className="flex flex-col items-end gap-3">
                                <div className="flex items-center gap-3">
                                    <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#eadfce] bg-white text-[#6b5d4b]">
                                        <Bell size={16} />
                                        {hasNotifications && (
                                            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
                                        )}
                                    </button>
                                    <div className="rounded-2xl border border-[#eadfce] bg-white px-4 py-3">
                                        <p className="text-xs font-bold text-[#6b5d4b]">สถานะร้าน</p>
                                        <button
                                            onClick={updateStoreStatus}
                                            className={`mt-2 flex items-center gap-3 rounded-full px-5 py-2 text-xs font-black shadow-sm transition ${
                                                storeOnline
                                                    ? "bg-[#2f7d57] text-white"
                                                    : "bg-[#e6e0d6] text-[#6b5d4b]"
                                            }`}
                                        >
                                            <span
                                                className={`h-3 w-3 rounded-full ${
                                                    storeOnline ? "bg-white" : "bg-[#cbb89f]"
                                                }`}
                                            />
                                            {storeOnline ? "เปิดรับออเดอร์ (Online)" : "ปิดรับออเดอร์ (Offline)"}
                                        </button>
                                    </div>
                                </div>
                                {loadError && (
                                    <p className="text-xs font-bold text-[#b13a3a]">{loadError}</p>
                                )}
                            </div>
                        </div>
                    </section>

                    <section className="grid gap-4 lg:grid-cols-4">
                        {summaryCards.map((card, index) => (
                            <div
                                key={`${card.title}-${index}`}
                                className="relative overflow-hidden rounded-2xl border border-[#eadfce] bg-white p-4 shadow-sm"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f7efe1] text-[#7b6a55]">
                                            {card.icon}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-[#8c7a66]">{card.title}</p>
                                            <p className="mt-2 text-2xl font-black text-[#2f2a1d]">
                                                {card.value}
                                            </p>
                                        </div>
                                    </div>
                                    <span
                                        className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                                            card.badgeTone === "up"
                                                ? "bg-[#e7f2e9] text-[#2f7d57]"
                                                : "bg-[#fde7e7] text-[#b13a3a]"
                                        }`}
                                    >
                                        {card.badge}
                                    </span>
                                </div>
                                <p className="mt-2 text-xs text-[#6b5d4b]">{card.hint}</p>
                            </div>
                        ))}
                    </section>

                    <section className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
                        <div className="rounded-[28px] border border-[#eadfce] bg-white p-6 shadow-sm">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <p className="text-sm font-black text-[#2f2a1d]">
                                        ยอดขายย้อนหลัง
                                    </p>
                                    <p className="text-xs text-[#6b5d4b]">
                                        สรุปยอดขายและจำนวนออเดอร์ตามช่วงเวลา
                                    </p>
                                </div>
                                <button
                                    onClick={() =>
                                        setRange((prev) =>
                                            prev === "7d" ? "month" : prev === "month" ? "year" : "7d",
                                        )
                                    }
                                    className="flex items-center gap-2 rounded-full border border-[#eadfce] bg-white px-4 py-2 text-xs font-bold text-[#2f7d57]"
                                >
                                    {RANGE_LABEL[range]} <ChevronDown size={14} />
                                </button>
                            </div>

                            <div className="relative mt-6 overflow-hidden rounded-[24px] border border-[#e6dccd] bg-white p-4 shadow-sm">
                                <div className="flex items-center justify-between pb-3">
                                    <p className="text-xs font-bold text-[#6b5d4b]">Stocks Graph</p>
                                    <div className="text-[11px] font-semibold text-[#9a8a76]">Points</div>
                                </div>
                                <div className="relative h-[210px] w-full">
                                    {(() => {
                                        const xStart = 6;
                                        const xEnd = 94;
                                        const yTop = 14;
                                        const yBottom = 88;
                                        const yRange = yBottom - yTop;
                                        const orderMax = Math.max(1, ...chartSeries.map((d) => d.orders));
                                        const salesMax = Math.max(1, ...chartSeries.map((d) => d.sales));
                                        const scaleX = (i: number) =>
                                            xStart + (i / (chartSeries.length - 1 || 1)) * (xEnd - xStart);
                                        const scaleY = (value: number, max: number) =>
                                            yBottom - (value / max) * yRange;

                                        const orderPoints = chartSeries.map((d, i) => ({
                                            ...d,
                                            x: scaleX(i),
                                            y: scaleY(d.orders, orderMax),
                                        }));
                                        const salesPoints = chartSeries.map((d, i) => ({
                                            ...d,
                                            x: scaleX(i),
                                            y: scaleY(d.sales, salesMax),
                                        }));
                                        const orderPath = orderPoints
                                            .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
                                            .join(" ");
                                        const salesPath = salesPoints
                                            .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
                                            .join(" ");
                                        return (
                                            <svg viewBox="0 0 100 100" className="h-full w-full">
                                                <g stroke="#efe7dc" strokeWidth="0.7">
                                                    <line x1={xStart} y1="26" x2={xEnd} y2="26" />
                                                    <line x1={xStart} y1="44" x2={xEnd} y2="44" />
                                                    <line x1={xStart} y1="62" x2={xEnd} y2="62" />
                                                    <line x1={xStart} y1="80" x2={xEnd} y2="80" />
                                                </g>
                                                <path
                                                    d={salesPath}
                                                    fill="none"
                                                    stroke="#1f1f1f"
                                                    strokeWidth="1.8"
                                                    strokeLinecap="round"
                                                />
                                                <path
                                                    d={orderPath}
                                                    fill="none"
                                                    stroke="#f0b44f"
                                                    strokeWidth="1.6"
                                                    strokeLinecap="round"
                                                />
                                                {salesPoints.map((p, index) => (
                                                    <g key={`${p.label}-${index}`}>
                                                        <circle
                                                            cx={p.x}
                                                            cy={p.y}
                                                            r="2.2"
                                                            fill="#1f1f1f"
                                                            onMouseEnter={() => setHoverIndex(index)}
                                                            onMouseLeave={() => setHoverIndex(null)}
                                                        />
                                                    </g>
                                                ))}
                                            </svg>
                                        );
                                    })()}

                                    {hoverIndex !== null && (
                                        <div
                                            className="absolute -translate-y-10 rounded-xl bg-[#1f1f1f] px-3 py-2 text-[11px] font-semibold text-white shadow-lg"
                                            style={{
                                                left: `${points[hoverIndex].x}%`,
                                                top: `${points[hoverIndex].y}%`,
                                                transform: "translate(-50%, -70%)",
                                            }}
                                        >
                                            <div className="text-[10px] text-white/70">
                                            {chartSeries[hoverIndex].label}
                                        </div>
                                        <div>{chartSeries[hoverIndex].orders} Points</div>
                                    </div>
                                )}
                            </div>
                                <div className="mt-2 grid grid-cols-7 text-center text-[10px] text-[#6b5d4b]">
                                    {chartSeries.map((d, index) => (
                                        <span key={`${d.label}-${index}`}>{d.label}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="rounded-[28px] border border-[#eadfce] bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-black text-[#2f2a1d]">เมนูขายดี</p>
                                <span className="text-xs text-[#6b5d4b]">Top 5</span>
                            </div>
                            <div className="mt-4 space-y-3">
                                {topMenus.length === 0 && (
                                    <p className="text-xs text-[#6b5d4b]">
                                        ยังไม่มีเมนูขายดีในช่วงเวลานี้
                                    </p>
                                )}
                                {topMenus.map((menu, index) => (
                                    <div
                                        key={`${menu.name}-${index}`}
                                        className="group flex items-center justify-between gap-3 rounded-2xl border border-[#f0e6d8] bg-gradient-to-r from-[#fff9f0] via-[#ffffff] to-[#fff6e8] px-3 py-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-xs font-black text-[#7b6a55] shadow-sm">
                                                {menu.rank === 1 ? <Crown size={16} /> : menu.rank}
                                            </div>
                                            <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-[#f0e6d8] bg-white shadow-sm">
                                                {menu.imageUrl ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img
                                                        src={menu.imageUrl}
                                                        alt={menu.name}
                                                        className="h-full w-full object-cover transition group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div
                                                        className={`h-full w-full rounded-2xl bg-gradient-to-br ${menu.color}`}
                                                    />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-[#2f2a1d]">{menu.name}</p>
                                                <p className="text-xs text-[#6b5d4b]">อันดับที่ {menu.rank}</p>
                                            </div>
                                        </div>
                                        <p className="text-xs font-bold text-[#2f7d57]">
                                            ขายได้ {menu.sold} จาน
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="rounded-[28px] border border-[#eadfce] bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-black text-[#2f2a1d]">ออเดอร์ล่าสุด</p>
                                <p className="text-xs text-[#6b5d4b]">
                                    ล่าสุด 5 รายการที่มีการสั่งซื้อ
                                </p>
                            </div>
                            <button className="rounded-full border border-[#eadfce] bg-white px-4 py-2 text-xs font-bold text-[#2f7d57]">
                                ดูทั้งหมด
                            </button>
                        </div>

                        <div className="mt-4 space-y-2">
                            {recentOrders.map((order) => (
                                <button
                                    key={order.id}
                                    onClick={() => setSelectedOrder(order)}
                                    className="flex w-full flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#f0e6d8] bg-[#faf4ea] px-4 py-3 text-sm text-[#2f2a1d] transition hover:bg-[#f7efe1]"
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="font-black">#{order.id}</span>
                                        <span className="text-xs text-[#6b5d4b]">{order.time}</span>
                                        <span>{order.customer}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-[#2f7d57]">
                                            {formatBaht(order.amount)}
                                        </span>
                                        <span
                                            className={`rounded-full px-3 py-1 text-[11px] font-bold ${STATUS_STYLES[order.status]}`}
                                        >
                                            {STATUS_LABEL[order.status]}
                                        </span>
                                    </div>
                                </button>
                            ))}
                            {!isLoading && recentOrders.length === 0 && (
                                <p className="text-xs text-[#6b5d4b]">ยังไม่มีออเดอร์ในช่วงนี้</p>
                            )}
                        </div>
                    </section>
                </div>
            </main>

            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
                    <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-xl">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-black text-[#2f2a1d]">รายละเอียดออเดอร์</h3>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="rounded-full border border-[#eadfce] px-3 py-1 text-xs font-bold text-[#6b5d4b]"
                            >
                                ปิด
                            </button>
                        </div>
                        <div className="mt-4 rounded-2xl border border-[#eadfce] bg-[#faf4ea] p-4">
                            <p className="text-xs font-bold text-[#6b5d4b]">#{selectedOrder.id}</p>
                            <p className="text-sm font-black text-[#2f2a1d]">{selectedOrder.customer}</p>
                            <p className="text-xs text-[#6b5d4b]">เวลา {selectedOrder.time}</p>
                        </div>
                        <div className="mt-4 space-y-2 text-sm">
                            {selectedOrder.items.map((item) => (
                                <div
                                    key={`${selectedOrder.id}-${item.orderItemId}`}
                                    className="flex items-center justify-between rounded-xl border border-[#f0e6d8] px-3 py-2"
                                >
                                    <span>
                                        {item.name} x {item.quantity}
                                    </span>
                                    <span className="font-bold text-[#2f2a1d]">
                                        {formatBaht(item.totalPrice)}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 flex items-center justify-between rounded-xl bg-[#f7efe1] px-4 py-3 text-sm font-black">
                            <span>ยอดรวม</span>
                            <span>{formatBaht(selectedOrder.amount)}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
