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

    const isWithinDays = (iso: string, days: number) => {
        const date = new Date(iso);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        return diffMs <= days * 24 * 60 * 60 * 1000;
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
        const status: OrderStatus = order.status === "delivered" ? "completed" : "cancelled";
        const statusLabel = order.status === "delivered" ? "Delivered" : "Cancelled";
        const createdTime = formatTime(order.createdAt);
        return {
            id: order.orderId,
            time: createdTime,
            createdAt: order.createdAt,
            customer: order.customerName ?? "Customer",
            itemsCount,
            subtotal,
            discount: 0,
            commission: 0,
            net: subtotal,
            status,
            statusLabel,
            items,
            timeline: [
                { time: createdTime, label: "Order created", tone: "ok" },
                {
                    time: createdTime,
                    label: status === "completed" ? "Delivered" : "Cancelled",
                    tone: status === "completed" ? "ok" : "cancel",
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

        return `
<!DOCTYPE html>
<html lang="th">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
    </head>
    <body>
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
    </body>
</html>
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
                const history = items
                    .filter((order) => order.status === "delivered" || order.status === "cancelled")
                    .map(mapOrder);
                setOrders(history);
            } catch (error) {
                console.error("Failed to load order history:", error);
                setLoadError("Failed to load order history");
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
            const matchesDate = isWithinDays(order.createdAt ?? order.time, dateRangeDays);
            return matchesQuery && matchesStatus && matchesDate;
        });
    }, [query, statusFilter, orders, dateRangeDays]);

    return (
        <div className="relative flex min-h-screen bg-[#faf4ea] text-[#3f3425]">
            <BackgroundPattern />
            <Sidebar />

            <main className="flex-1 px-8 py-8 md:ml-64">
                <div className="mx-auto max-w-[1300px] space-y-6">
                    <section className="rounded-[28px] border border-[#eadfce] bg-white/90 p-6 shadow-sm backdrop-blur">
                        <h1 className="text-3xl font-black text-[#2f2a1d]">
                            ประวัติออเดอร์
                        </h1>
                        <p className="mt-1 text-sm text-[#6b5d4b]">
                            ใช้สำหรับตรวจสอบรายได้ย้อนหลัง และดูรายละเอียดบิลทั้งหมด
                        </p>
                    </section>

                    <section className="rounded-[28px] border border-[#eadfce] bg-white p-5 shadow-sm">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex flex-1 flex-col gap-3 lg:flex-row lg:items-center">
                                <div className="relative flex-1">
                                    <Search
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8c7a66]"
                                    />
                                    <input
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder="ค้นหาด้วยรหัสออเดอร์ หรือชื่อลูกค้า"
                                        className="w-full rounded-full border border-[#eadfce] bg-white py-3 pl-11 pr-4 text-sm font-semibold text-[#2f2a1d] outline-none"
                                    />
                                </div>
                                <button className="inline-flex items-center gap-2 rounded-full border border-[#eadfce] bg-white px-4 py-2 text-xs font-bold text-[#6b5d4b]">
                                    <Calendar size={14} /> {dateRange}
                                    <ChevronDown size={14} />
                                </button>
                                <button className="inline-flex items-center gap-2 rounded-full border border-[#eadfce] bg-white px-4 py-2 text-xs font-bold text-[#6b5d4b]">
                                    สถานะ: {statusFilter}
                                    <ChevronDown size={14} />
                                </button>
                            </div>
                            <button className="inline-flex items-center gap-2 rounded-full border border-[#eadfce] bg-white px-4 py-2 text-xs font-bold text-[#6b5d4b]">
                                <FileDown size={14} /> ดาวน์โหลดเป็น CSV
                            </button>
                        </div>
                    </section>

                    <section className="rounded-[28px] border border-[#eadfce] bg-white p-4 shadow-sm">
                        <div className="grid grid-cols-1 gap-3 text-xs font-bold text-[#8c7a66] md:grid-cols-6">
                            <div className="md:col-span-2">รหัสออเดอร์ & เวลา</div>
                            <div>ชื่อลูกค้า</div>
                            <div>จำนวนรายการ</div>
                            <div>ยอดเงินสุทธิ</div>
                            <div>สถานะ</div>
                        </div>

                        <div className="mt-3 space-y-3">
                            {filtered.map((order) => (
                                <div
                                    key={order.id}
                                    className="grid grid-cols-1 items-center gap-3 rounded-2xl border border-[#f0e6d8] bg-[#faf4ea] px-4 py-4 text-sm md:grid-cols-6"
                                >
                                    <div className="md:col-span-2">
                                        <p className="text-base font-black text-[#2f2a1d]">
                                            #{order.id}
                                        </p>
                                        <p className="text-xs text-[#6b5d4b]">{order.time}</p>
                                    </div>
                                    <div className="font-semibold text-[#3f3425]">
                                        {order.customer}
                                    </div>
                                    <div className="text-[#3f3425]">
                                        {order.itemsCount} รายการ
                                    </div>
                                    <div className="font-black text-[#1f6b4e]">
                                        {formatBaht(order.net)}
                                    </div>
                                    <div className="flex items-center justify-between gap-3">
                                        <StatusPill
                                            status={order.status}
                                            label={order.statusLabel}
                                        />
                                        <button
                                            onClick={() => setSelected(order)}
                                            className="rounded-full border border-[#eadfce] bg-white px-3 py-1 text-xs font-bold text-[#6b5d4b]"
                                        >
                                            ดูรายละเอียด
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>

            <Drawer open={!!selected} onClose={() => setSelected(null)}>
                {selected && (
                    <div className="space-y-6">
                        <div className="rounded-3xl border border-[#eadfce] bg-[#faf4ea] p-4">
                            <p className="text-xs font-bold text-[#8c7a66]">
                                รายละเอียดออเดอร์
                            </p>
                            <h2 className="mt-2 text-2xl font-black text-[#2f2a1d]">
                                #{selected.id}
                            </h2>
                            <div className="mt-2 flex items-center gap-2">
                                <StatusPill
                                    status={selected.status}
                                    label={selected.statusLabel}
                                />
                                <span className="text-xs text-[#6b5d4b]">
                                    {selected.time}
                                </span>
                            </div>
                        </div>

                        <section className="rounded-3xl border border-[#eadfce] bg-white p-4">
                            <p className="text-sm font-black text-[#2f2a1d]">
                                Timeline การจัดส่ง
                            </p>
                            <div className="mt-4 space-y-4">
                                {selected.timeline.map((step, index) => (
                                    <div key={`${step.time}-${index}`} className="flex gap-3">
                                        <div className="flex flex-col items-center">
                                            <span
                                                className={`h-3 w-3 rounded-full ${
                                                    step.tone === "ok"
                                                        ? "bg-[#2f7d57]"
                                                        : "bg-[#b13a3a]"
                                                }`}
                                            />
                                            {index !== selected.timeline.length - 1 && (
                                                <span className="mt-1 h-10 w-[2px] bg-[#eadfce]" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-[#8c7a66]">
                                                {step.time}
                                            </p>
                                            <p className="text-sm font-black text-[#2f2a1d]">
                                                {step.label}
                                            </p>
                                            {step.meta && (
                                                <p className="text-xs text-[#b13a3a]">
                                                    {step.meta}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {selected.cancelInfo && (
                                    <div className="rounded-2xl border border-[#fde7e7] bg-[#fff5f5] px-3 py-2 text-xs font-bold text-[#b13a3a]">
                                        {selected.cancelInfo}
                                    </div>
                                )}
                            </div>
                        </section>

                        <section className="rounded-3xl border border-[#eadfce] bg-white p-4">
                            <p className="text-sm font-black text-[#2f2a1d]">
                                รายการอาหาร
                            </p>
                            {selected.allergy && (
                                <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-black text-red-600">
                                    แจ้งแพ้อาหาร: {selected.allergy}
                                </div>
                            )}
                            <div className="mt-3 space-y-3 text-sm text-[#3f3425]">
                                {selected.items.map((item, index) => (
                                    <div
                                        key={`${selected.id}-item-${index}`}
                                        className="rounded-2xl border border-[#f0e6d8] px-3 py-2"
                                    >
                                        <div className="flex items-center justify-between">
                                            <p className="font-black text-[#2f2a1d]">
                                                {item.name} x {item.qty}
                                            </p>
                                            <p className="text-xs font-bold text-[#8c7a66]">
                                                {formatBaht(item.price * item.qty)}
                                            </p>
                                        </div>
                                        {item.addons && item.addons.length > 0 && (
                                            <p className="mt-1 text-xs text-[#6b5d4b]">
                                                Add-on: {item.addons.join(", ")}
                                            </p>
                                        )}
                                        {item.note && (
                                            <p className="mt-1 text-xs font-black text-[#b16a2b]">
                                                โน้ตพิเศษ: {item.note}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="rounded-3xl border border-[#eadfce] bg-white p-4">
                            <p className="text-sm font-black text-[#2f2a1d]">
                                สรุปยอดเงิน
                            </p>
                            <div className="mt-4 space-y-2 text-sm text-[#3f3425]">
                                <div className="flex justify-between">
                                    <span>ค่าอาหารรวม</span>
                                    <span>{formatBaht(selected.subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>ส่วนลดของร้านค้า</span>
                                    <span>{formatBaht(selected.discount)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>ค่าคอมมิชชัน / GP</span>
                                    <span>{formatBaht(selected.commission)}</span>
                                </div>
                                <div className="flex justify-between border-t border-[#f0e6d8] pt-3 text-base font-black">
                                    <span>ยอดเงินสุทธิที่ร้านได้รับ</span>
                                    <span className="text-[#1f6b4e]">
                                        {formatBaht(selected.net)}
                                    </span>
                                </div>
                            </div>
                        </section>

                        <section className="rounded-3xl border border-[#eadfce] bg-[#faf4ea] p-4">
                            <p className="text-sm font-black text-[#2f2a1d]">
                                จัดการใบเสร็จ
                            </p>
                            <div className="mt-4 flex flex-wrap gap-3">
                                <button
                                    onClick={() => handlePrintReceipt(selected)}
                                    className="inline-flex items-center gap-2 rounded-full bg-[#2f2a1d] px-5 py-2 text-xs font-black text-white"
                                >
                                    <Printer size={14} /> พิมพ์ใบเสร็จ
                                </button>
                                <button
                                    onClick={() => handleDownloadReceipt(selected)}
                                    className="inline-flex items-center gap-2 rounded-full border border-[#eadfce] bg-white px-5 py-2 text-xs font-black text-[#6b5d4b]"
                                >
                                    <Download size={14} /> ดาวน์โหลด PDF
                                </button>
                            </div>
                        </section>
                    </div>
                )}
            </Drawer>
        </div>
    );
}




















