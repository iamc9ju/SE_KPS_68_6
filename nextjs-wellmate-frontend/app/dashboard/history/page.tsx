"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
    Calendar,
    ChevronDown,
    Download,
    FileDown,
    Printer,
    Search,
    X,
} from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";
import BackgroundPattern from "@/components/dashboard/BackgroundPattern";
import api from "@/lib/api";

type OrderStatus = "completed" | "cancelled";

type OrderItem = {
    name: string;
    qty: number;
    price: number;
    note?: string;
    addons?: string[];
};

type TimelineStep = {
    time: string;
    label: string;
    tone: "ok" | "cancel";
    meta?: string;
};

type HistoryOrder = {
    id: string;
    time: string;
    customer: string;
    itemsCount: number;
    subtotal: number;
    discount: number;
    commission: number;
    net: number;
    status: OrderStatus;
    statusLabel: string;
    cancelInfo?: string;
    allergy?: string;
    items: OrderItem[];
    timeline: TimelineStep[];
    createdAt?: string;
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
    createdAt?: string;
    items: ApiOrderItem[];
};

type ApiEnvelope<T> = {
    success: boolean;
    data: T;
    message?: string;
};

const SAMPLE_HISTORY: HistoryOrder[] = [];

const formatBaht = (value: number) =>
    `${value.toLocaleString("th-TH", { maximumFractionDigits: 0 })} บาท`;

function StatusPill({ status, label }: { status: OrderStatus; label: string }) {
    return (
        <span
            className={`rounded-full px-3 py-1 text-xs font-black ${
                status === "completed"
                    ? "bg-[#e7f2e9] text-[#2f7d57]"
                    : "bg-[#fde7e7] text-[#b13a3a]"
            }`}
        >
            {label}
        </span>
    );
}

function Drawer({
    open,
    onClose,
    children,
}: {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
}) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex">
            <div className="flex-1 bg-black/40" onClick={onClose} />
            <div className="w-full max-w-xl overflow-y-auto bg-white p-6 shadow-2xl">
                <button
                    onClick={onClose}
                    className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#eadfce] px-3 py-1 text-xs font-bold text-[#6b5d4b]"
                >
                    <X size={14} /> ปิด
                </button>
                {children}
            </div>
        </div>
    );
}

export default function FoodPartnerHistoryPage() {
    const [query, setQuery] = useState("");
    const [dateRange, setDateRange] = useState("7 วันที่ผ่านมา");
    const dateRangeDays = 7;
    const [statusFilter, setStatusFilter] = useState("ทั้งหมด");
    const [orders, setOrders] = useState<HistoryOrder[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [selected, setSelected] = useState<HistoryOrder | null>(null);
    const unwrap = <T,>(payload: ApiEnvelope<T> | T): T => {
        if (payload && typeof payload === "object" && "data" in payload) {
            return (payload as ApiEnvelope<T>).data;
        }
        return payload as T;
    };

    const isWithinDays = (iso: string | undefined, days: number) => {
        if (!iso) return false;
        try {
            const date = new Date(iso);
            if (isNaN(date.getTime())) return false;
            const now = new Date();
            const diffMs = now.getTime() - date.getTime();
            return diffMs <= days * 24 * 60 * 60 * 1000;
        } catch {
            return false;
        }
    };

    const formatTime = (iso: string) =>
        new Date(iso).toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });

    const mapOrder = (order: ApiOrder): HistoryOrder => {
        const items = order.items.map((item) => ({
            name: item.name,
            qty: item.quantity,
            price: item.priceAtOrder,
        }));
        const itemsCount = order.items.reduce((sum, i) => sum + i.quantity, 0);
        const subtotal = order.items.reduce((sum, i) => sum + Number(i.totalPrice || 0), 0);
        
        // Map all statuses for consistency
        const statusConfig: Record<string, { type: OrderStatus; label: string }> = {
            delivered: { type: "completed", label: "จัดส่งคุณแล้ว" },
            cancelled: { type: "cancelled", label: "ยกเลิกแล้ว" },
            pending: { type: "completed", label: "รอการยืนยัน" },
            accepted: { type: "completed", label: "รับออเดอร์แล้ว" },
            preparing: { type: "completed", label: "กำลังเตรียมอาหาร" },
            ready: { type: "completed", label: "พร้อมคนขับ" },
            delivering: { type: "completed", label: "กำลังไปส่ง" },
        };

        const config = statusConfig[order.status] || { type: "completed", label: order.status };
        const createdTime = formatTime(order.createdAt ?? new Date().toISOString());
        
        return {
            id: order.orderId,
            time: createdTime,
            createdAt: order.createdAt,
            customer: order.customerName ?? "ลูกค้าทั่วไป",
            itemsCount,
            subtotal,
            discount: 0,
            commission: 0,
            net: subtotal,
            status: config.type,
            statusLabel: config.label,
            items,
            timeline: [
                { time: createdTime, label: "สร้างออเดอร์", tone: "ok" },
                {
                    time: createdTime,
                    label: config.label,
                    tone: config.type === "completed" ? "ok" : "cancel",
                },
            ],
        };
    };

    const formatDate = (iso?: string) => {
        if (!iso) return "-";
        return new Date(iso).toLocaleDateString("th-TH", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    // ... handlePrintReceipt / handleDownloadReceipt ... (kept same logic but I'll skip re-pasting for brevity if possible, but replace_file_content needs the full block)
    // Actually, I'll keep them.

    const buildReceiptHtml = (order: HistoryOrder) => {
        const rows = order.items
            .map(
                (item, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td>
                        <div class="item-name">${item.name}</div>
                        <div class="item-note">x ${item.qty}</div>
                    </td>
                    <td class="price">${formatBaht(item.price)}</td>
                    <td class="price">${formatBaht(item.price * item.qty)}</td>
                </tr>
            `,
            )
            .join("");

        const t = {
            html: "html",
            head: "head",
            body: "body",
            meta: "meta"
        };

        return `
<!DOCTYPE html>
<${t.html} lang="th">
    <${t.head}>
        <${t.meta} charset="UTF-8" />
        <${t.meta} name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Receipt ${order.id}</title>
        <style>
            * { box-sizing: border-box; }
            body { font-family: "Sarabun", "Noto Sans Thai", sans-serif; color: #2f2a1d; margin: 24px; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; }
            .title { font-size: 28px; font-weight: 800; }
            .subtitle { font-size: 14px; color: #6b5d4b; margin-top: 4px; }
            .logo { font-size: 20px; font-weight: 800; color: #4c8b4a; }
            .section { margin-top: 18px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 12px; }
            .box { border: 1px solid #eadfce; border-radius: 12px; padding: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 12px; }
            thead th { background: #6b8f3b; color: white; padding: 8px; text-align: left; }
            tbody td { border-bottom: 1px solid #eadfce; padding: 10px 8px; vertical-align: top; }
            .price { text-align: right; }
            .item-name { font-weight: 700; }
            .item-note { color: #6b5d4b; font-size: 11px; }
            .summary { margin-top: 14px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
            .summary .row { display: flex; justify-content: space-between; margin-bottom: 6px; }
            .total { font-size: 16px; font-weight: 800; }
            .sign { margin-top: 18px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-size: 12px; }
            .line { border-bottom: 1px dashed #a6a19a; height: 18px; margin-top: 18px; }
            @media print { body { margin: 0; padding: 16px; } }
        </style>
    </${t.head}>
    <${t.body}>
        <div class="header">
            <div>
                <div class="title">ใบเสร็จรับเงิน</div>
                <div class="subtitle">Receipt</div>
            </div>
            <div class="logo">WELLMATE</div>
        </div>

        <div class="section">
            <div class="box">
                <div><strong>ข้อมูลลูกค้า</strong></div>
                <div>${order.customer}</div>
                <div>รหัสออเดอร์: #${order.id}</div>
                <div>วันที่: ${formatDate(order.createdAt)}</div>
                <div>เวลา: ${order.time}</div>
            </div>
            <div class="box">
                <div><strong>ผู้ขายสินค้า/ร้าน</strong></div>
                <div>WellMate Co., Ltd.</div>
                <div>ที่อยู่: 99/9 ถนนสุขภาพดี กรุงเทพฯ 10000</div>
                <div>โทร: 089-456-7890</div>
                <div>เลขผู้เสียภาษี: 0123456789</div>
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th style="width: 50px;">ลำดับ</th>
                    <th>รายการ</th>
                    <th style="width: 100px;" class="price">ราคา</th>
                    <th style="width: 120px;" class="price">ยอดรวม</th>
                </tr>
            </thead>
            <tbody>
                ${rows}
            </tbody>
        </table>

        <div class="summary">
            <div></div>
            <div class="box">
                <div class="row"><span>ยอดรวม</span><span>${formatBaht(order.subtotal)}</span></div>
                <div class="row"><span>ส่วนลด</span><span>${formatBaht(order.discount)}</span></div>
                <div class="row total"><span>ยอดสุทธิ</span><span>${formatBaht(order.net)}</span></div>
            </div>
        </div>

        <div class="sign">
            <div class="box">
                <div>ช่องทางการชำระเงิน: ${order.status === "completed" ? "ชำระเงินแล้ว" : "ยกเลิก"}</div>
                <div>วันที่: ${formatDate(order.createdAt)}</div>
                <div>เวลา: ${order.time}</div>
            </div>
            <div class="box">
                <div>ลงชื่อผู้รับเงิน</div>
                <div class="line"></div>
                <div>ลงชื่อผู้รับสินค้า</div>
                <div class="line"></div>
            </div>
        </div>
    </${t.body}>
</${t.html}>
        `;
    };

    const handlePrintReceipt = (order: HistoryOrder) => {
        const win = window.open("", "_blank", "width=900,height=1200");
        if (!win) return;
        win.document.open();
        win.document.write(buildReceiptHtml(order));
        win.document.close();
        win.focus();
        win.print();
    };

    const handleDownloadReceipt = (order: HistoryOrder) => {
        const win = window.open("", "_blank", "width=900,height=1200");
        if (!win) return;
        win.document.open();
        win.document.write(buildReceiptHtml(order));
        win.document.close();
        win.focus();
        win.print();
    };


    useEffect(() => {
        const fetchHistory = async () => {
            setIsLoading(true);
            setLoadError("");
            try {
                const res = await api.get<ApiEnvelope<ApiOrder[]> | ApiOrder[]>("/orders");
                const data = unwrap(res.data);
                const items = Array.isArray(data) ? data : [];
                // Remove strict filter to allow seeing active orders in 'History' too
                const mapped = items.map(mapOrder);
                setOrders(mapped);
            } catch (error) {
                console.error("Failed to load order history:", error);
                setLoadError("ไม่สามารถโหลดประวัติออเดอร์ได้");
                setOrders([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const filtered = useMemo(() => {
        return orders.filter((order) => {
            const matchesQuery =
                order.id.toLowerCase().includes(query.toLowerCase()) ||
                order.customer.toLowerCase().includes(query.toLowerCase());
            
            const matchesStatus =
                statusFilter === "ทั้งหมด"
                    ? true
                    : statusFilter === "สำเร็จ"
                      ? order.status === "completed"
                      : order.status === "cancelled";

            // Allow viewing older orders if filtered accordingly, but default to 7 days in label
            const matchesDate = dateRange === "แสดงทั้งหมด" ? true : isWithinDays(order.createdAt, dateRangeDays);
            
            return matchesQuery && matchesStatus && matchesDate;
        });
    }, [query, statusFilter, orders, dateRangeDays, dateRange]);

    const changeDateRange = () => {
        if (dateRange === "7 วันที่ผ่านมา") setDateRange("แสดงทั้งหมด");
        else setDateRange("7 วันที่ผ่านมา");
    };

    const changeStatusFilter = () => {
        if (statusFilter === "ทั้งหมด") setStatusFilter("สำเร็จ");
        else if (statusFilter === "สำเร็จ") setStatusFilter("ยกเลิก");
        else setStatusFilter("ทั้งหมด");
    };

    return (
        <main className="flex-1 h-screen overflow-y-auto px-8 py-10 lg:pl-64 scroll-smooth">
            <div className="mx-auto max-w-[1440px] space-y-6">
                <section className="rounded-[28px] border border-[#eadfce] bg-white/90 p-8 shadow-sm backdrop-blur">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-[#f7efe1] rounded-2xl text-[#7b6a55]">
                            <Search size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-[#2f2a1d]">ประวัติออเดอร์</h1>
                            <p className="text-sm text-[#6b5d4b] font-medium mt-1">
                                ใช้สำหรับตรวจสอบรายได้ย้อนหลัง และดูรายละเอียดบิลทั้งหมดแบบเรียลไทม์
                            </p>
                        </div>
                    </div>
                </section>

                <section className="rounded-[28px] border border-[#eadfce] bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex flex-1 flex-col gap-4 lg:flex-row lg:items-center">
                            <div className="relative flex-1">
                                <Search
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8c7a66]"
                                />
                                <input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="ค้นหาด้วยรหัสออเดอร์ หรือชื่อลูกค้า"
                                    className="w-full rounded-2xl border border-[#eadfce] bg-[#faf4ea]/30 py-4 pl-12 pr-4 text-sm font-bold text-[#2f2a1d] outline-none focus:border-[#C6E065] transition-colors"
                                />
                            </div>
                            <button 
                                onClick={changeDateRange}
                                className="inline-flex items-center gap-2 rounded-2xl border border-[#eadfce] bg-white px-5 py-4 text-sm font-bold text-[#6b5d4b] hover:bg-gray-50 transition-colors"
                            >
                                <Calendar size={16} /> {dateRange}
                                <ChevronDown size={14} className={`transition-transform ${dateRange === "แสดงทั้งหมด" ? "rotate-180" : ""}`} />
                            </button>
                            <button 
                                onClick={changeStatusFilter}
                                className="inline-flex items-center gap-2 rounded-2xl border border-[#eadfce] bg-white px-5 py-4 text-sm font-bold text-[#6b5d4b] hover:bg-gray-50 transition-colors"
                            >
                                สถานะ: <span className="text-[#2f2a1d]">{statusFilter}</span>
                                <ChevronDown size={14} />
                            </button>
                        </div>
                        <button className="inline-flex items-center gap-2 rounded-2xl bg-[#3d3522] px-6 py-4 text-sm font-black text-white hover:bg-[#2d2618] transition-all shadow-lg active:scale-95">
                            <FileDown size={18} /> ดาวน์โหลด CSV
                        </button>
                    </div>
                </section>

                <section className="rounded-[28px] border border-[#eadfce] bg-white p-6 shadow-sm overflow-hidden">
                    <div className="grid grid-cols-1 gap-4 text-[11px] font-black text-[#8c7a66] md:grid-cols-[1.5fr_1fr_1fr_1fr_1.2fr] uppercase tracking-wider border-b border-[#f0e6d8] pb-4 mb-4">
                        <div>รหัสออเดอร์ & เวลา</div>
                        <div>ชื่อลูกค้า</div>
                        <div>จำนวนรายการ</div>
                        <div>ยอดเงินสุทธิ</div>
                        <div className="text-right">สถานะ / รายละเอียด</div>
                    </div>

                    <div className="space-y-4">
                        {isLoading ? (
                            <div className="py-20 text-center text-[#8c7a66] font-bold">กำลังโหลดข้อมููล...</div>
                        ) : filtered.length === 0 ? (
                            <div className="py-20 text-center text-[#8c7a66] font-bold">ไม่พบข้อมูลออเดอร์</div>
                        ) : (
                            filtered.map((order) => (
                                <div
                                    key={order.id}
                                    className="grid grid-cols-1 items-center gap-4 rounded-[24px] border border-[#f0e6d8] bg-[#faf4ea]/30 px-6 py-5 text-sm md:grid-cols-[1.5fr_1fr_1fr_1fr_1.2fr] hover:border-[#C6E065] transition-all group"
                                >
                                    <div>
                                        <p className="text-lg font-black text-[#2f2a1d] group-hover:text-[#4c8b4a] transition-colors">
                                            #{order.id.slice(-8).toUpperCase()}
                                        </p>
                                        <p className="text-xs font-bold text-[#8c7a66] flex items-center gap-2 mt-1">
                                            <Calendar size={12} /> {formatDate(order.createdAt)} • {order.time}
                                        </p>
                                    </div>
                                    <div className="font-black text-[#3f3425]">
                                        {order.customer}
                                    </div>
                                    <div className="font-bold text-[#6b5d4b]">
                                        {order.itemsCount} รายการ
                                    </div>
                                    <div className="text-xl font-black text-[#2f7d57]">
                                        {formatBaht(order.net)}
                                    </div>
                                    <div className="flex items-center justify-end gap-3">
                                        <StatusPill
                                            status={order.status}
                                            label={order.statusLabel}
                                        />
                                        <button
                                            onClick={() => setSelected(order)}
                                            className="rounded-xl border-2 border-[#eadfce] bg-white px-4 py-2 text-xs font-black text-[#3d3522] hover:bg-[#3d3522] hover:text-white transition-all shadow-sm active:scale-95"
                                        >
                                            ดูรายละเอียด
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>

            <Drawer open={!!selected} onClose={() => setSelected(null)}>
                {selected && (
                    <div className="space-y-8 animate-fadeIn">
                        <div className="rounded-[32px] border border-[#eadfce] bg-[#faf4ea] p-8">
                            <p className="text-[11px] font-black text-[#8c7a66] uppercase tracking-[0.2em] mb-3">
                                รายละเอียดออเดอร์
                            </p>
                            <h2 className="text-4xl font-black text-[#2f2a1d] tracking-tight">
                                #{selected.id.toUpperCase()}
                            </h2>
                            <div className="mt-4 flex items-center gap-3">
                                <StatusPill
                                    status={selected.status}
                                    label={selected.statusLabel}
                                />
                                <span className="text-sm font-bold text-[#6b5d4b]">
                                    {formatDate(selected.createdAt)} • {selected.time}
                                </span>
                            </div>
                        </div>

                        <section className="rounded-[32px] border border-[#eadfce] bg-white p-8 shadow-sm">
                            <p className="text-[11px] font-black text-[#2f2a1d] uppercase tracking-[0.2em] mb-6">
                                Timeline การจัดส่ง
                            </p>
                            <div className="space-y-6">
                                {selected.timeline.map((step, index) => (
                                    <div key={`${step.time}-${index}`} className="flex gap-6">
                                        <div className="flex flex-col items-center">
                                            <div
                                                className={`h-4 w-4 rounded-full ring-4 ${
                                                    step.tone === "ok"
                                                        ? "bg-[#2f7d57] ring-[#e7f2e9]"
                                                        : "bg-[#b13a3a] ring-[#fde7e7]"
                                                }`}
                                            />
                                            {index !== selected.timeline.length - 1 && (
                                                <div className="mt-2 h-12 w-[2px] bg-gradient-to-b from-[#eadfce] to-transparent" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-[#8c7a66]">
                                                {step.time}
                                            </p>
                                            <p className="text-base font-black text-[#2f2a1d] mt-1">
                                                {step.label}
                                            </p>
                                            {step.meta && (
                                                <p className="text-xs font-bold text-[#b13a3a] mt-1 bg-red-50 px-2 py-1 rounded-lg">
                                                    {step.meta}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="rounded-[32px] border border-[#eadfce] bg-white p-8 shadow-sm">
                            <p className="text-[11px] font-black text-[#2f2a1d] uppercase tracking-[0.2em] mb-6">
                                รายการอาหาร ({selected.itemsCount})
                            </p>
                            {selected.allergy && (
                                <div className="mb-6 rounded-2xl bg-red-50 p-4 border border-red-100">
                                    <p className="text-xs font-black text-red-600 uppercase tracking-widest mb-1">🚨 แจ้งแพ้อาหาร</p>
                                    <p className="text-sm font-bold text-red-700">{selected.allergy}</p>
                                </div>
                            )}
                            <div className="space-y-3">
                                {selected.items.map((item, index) => (
                                    <div
                                        key={`${selected.id}-item-${index}`}
                                        className="rounded-2xl border border-[#f0e6d8] bg-[#faf4ea]/20 p-4 hover:border-[#C6E065] transition-colors"
                                    >
                                        <div className="flex items-center justify-between">
                                            <p className="text-base font-black text-[#2f2a1d]">
                                                {item.name} <span className="text-[#8c7a66] ml-2 font-bold">x {item.qty}</span>
                                            </p>
                                            <p className="text-lg font-black text-[#2f2a1d]">
                                                {formatBaht(item.price * item.qty)}
                                            </p>
                                        </div>
                                        {item.addons && item.addons.length > 0 && (
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {item.addons.map((addon) => (
                                                    <span key={addon} className="text-[10px] font-black text-[#6b5d4b] bg-white px-2 py-1 rounded-md border border-[#eadfce]">
                                                        +{addon}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        {item.note && (
                                            <p className="mt-2 text-xs font-bold text-[#b16a2b] italic">
                                                “ {item.note} ”
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="rounded-[32px] border border-[#eadfce] bg-white p-8 shadow-sm">
                            <p className="text-[11px] font-black text-[#2f2a1d] uppercase tracking-[0.2em] mb-6">
                                สรุปยอดเงินสุทธิ
                            </p>
                            <div className="space-y-4 text-sm font-bold text-[#3f3425]">
                                <div className="flex justify-between text-[#8c7a66]">
                                    <span>ค่าอาหารรวม</span>
                                    <span>{formatBaht(selected.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-[#8c7a66]">
                                    <span>ส่วนลดจากร้านค้า</span>
                                    <span>- {formatBaht(selected.discount)}</span>
                                </div>
                                <div className="flex justify-between text-[#b16a2b]">
                                    <span>ค่าธรรมเนียมแพลตฟอร์ม</span>
                                    <span>- {formatBaht(selected.commission)}</span>
                                </div>
                                <div className="flex justify-between border-t border-dashed border-[#eadfce] pt-6 items-end">
                                    <div>
                                        <p className="text-[10px] font-black text-[#8c7a66] uppercase tracking-widest mb-1">ยอดเงินที่ร้านได้รับ</p>
                                        <p className="text-4xl font-black text-[#2f7d57]">{formatBaht(selected.net)}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="rounded-lg bg-[#e7f2e9] px-3 py-1.5 text-[10px] font-black text-[#2f7d57] uppercase tracking-widest">
                                            {selected.status === "completed" ? "โอนเงินแล้ว" : "รอดำเนินการ"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="rounded-[32px] border border-[#eadfce] bg-[#3d3522] p-8 shadow-xl shadow-[#3d3522]/20">
                            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                                <div className="text-center sm:text-left">
                                    <p className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em] mb-1">จัดการเอกสาร</p>
                                    <h4 className="text-lg font-black text-white">ใบเสร็จรับเงิน (E-Receipt)</h4>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handlePrintReceipt(selected)}
                                        className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-xs font-black text-[#3d3522] hover:bg-gray-100 transition-all active:scale-95 shadow-lg"
                                    >
                                        <Printer size={16} /> พิมพ์
                                    </button>
                                    <button
                                        onClick={() => handleDownloadReceipt(selected)}
                                        className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-6 py-3 text-xs font-black text-white hover:bg-white/20 transition-all active:scale-95 border border-white/20"
                                    >
                                        <Download size={16} /> บันทึก PDF
                                    </button>
                                </div>
                            </div>
                        </section>
                    </div>
                )}
            </Drawer>
        </main>
    );
}




















