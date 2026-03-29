"use client";

import React from "react";
import { Bike, ChefHat, House, Store } from "lucide-react";

type OrderTrackingMapViewProps = {
    orderId: string;
    stage: 1 | 2 | 3 | 4;
    restaurantName?: string;
    customerAddress?: string;
};

const DRIVER_POSITIONS: Record<1 | 2 | 3 | 4, { x: number; y: number } | null> = {
    1: null,
    2: { x: 24, y: 70 },
    3: { x: 48, y: 52 },
    4: { x: 76, y: 26 },
};

export default function OrderTrackingMapView({
    orderId,
    stage,
    restaurantName,
    customerAddress,
}: OrderTrackingMapViewProps) {
    const driver = DRIVER_POSITIONS[stage];
    const routePath = "M 18 74 Q 34 44 62 34 T 78 24";
    const activePath =
        stage === 2
            ? "M 18 74 Q 21 72 24 70"
            : stage === 3
              ? "M 18 74 Q 30 58 48 52"
              : routePath;

    return (
        <div className="relative h-full min-h-[420px] w-full overflow-hidden rounded-[32px] border border-[#ece3cf] bg-[radial-gradient(circle_at_top_left,_rgba(198,224,101,0.22),_rgba(255,255,255,0.96)_30%),linear-gradient(180deg,#fffdfa_0%,#f8f3e7_100%)]">
            <div className="absolute inset-0 opacity-70">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(143,130,96,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(143,130,96,0.08)_1px,transparent_1px)] bg-[size:52px_52px]" />
                <div className="absolute left-[8%] top-[18%] h-44 w-44 rounded-full bg-[#f4edc6]/70 blur-3xl" />
                <div className="absolute bottom-[8%] right-[12%] h-52 w-52 rounded-full bg-[#e9f5bf]/70 blur-3xl" />
            </div>

            <div className="absolute left-6 top-6 right-6 z-10 flex items-start justify-between gap-4">
                <div className="rounded-[24px] border border-white/70 bg-white/85 px-4 py-3 shadow-[0_18px_40px_rgba(0,0,0,0.05)] backdrop-blur">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#aa9a77]">Order Tracking</p>
                    <p className="mt-1 text-sm font-black text-[#2f2a1c]">#{orderId.slice(-8)}</p>
                </div>
                <div className="rounded-[24px] border border-white/70 bg-white/85 px-4 py-3 text-right shadow-[0_18px_40px_rgba(0,0,0,0.05)] backdrop-blur">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#aa9a77]">Map Mode</p>
                    <p className="mt-1 text-sm font-black text-[#2f2a1c]">Status Mock</p>
                </div>
            </div>

            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
                <path
                    d={routePath}
                    fill="none"
                    stroke="#d4cab0"
                    strokeWidth="1.6"
                    strokeDasharray="2.8 3.2"
                    strokeLinecap="round"
                />
                {driver && (
                    <path d={activePath} fill="none" stroke="#a3cf2f" strokeWidth="2" strokeLinecap="round" />
                )}
            </svg>

            <MapPinBadge
                x={18}
                y={74}
                tone="orange"
                icon={<Store size={16} />}
                title={restaurantName || "ร้านค้า"}
                subtitle={stage >= 2 ? "กำลังเตรียมออเดอร์" : "รอยืนยันออเดอร์"}
            />

            <MapPinBadge
                x={78}
                y={24}
                tone="lime"
                icon={<House size={16} />}
                title="ปลายทาง"
                subtitle={customerAddress || "ที่อยู่จัดส่งของคุณ"}
            />

            {driver && (
                <MapPinBadge
                    x={driver.x}
                    y={driver.y}
                    tone="blue"
                    icon={stage >= 3 ? <Bike size={16} /> : <ChefHat size={16} />}
                    title={stage >= 3 ? "กำลังจัดส่ง" : "กำลังเตรียม"}
                    subtitle={stage === 4 ? "ส่งสำเร็จแล้ว" : "อัปเดตตามสถานะออเดอร์"}
                    floating={stage < 4}
                />
            )}

            <div className="absolute bottom-6 left-6 right-6 z-10 grid gap-3 md:grid-cols-3">
                <LegendCard tone="orange" title="ร้าน" helper="จุดเริ่มต้นของออเดอร์" />
                <LegendCard tone="blue" title="สถานะ" helper="ขยับตามสถานะออเดอร์ล่าสุด" />
                <LegendCard tone="lime" title="ปลายทาง" helper="ตำแหน่งจัดส่งของลูกค้า" />
            </div>
        </div>
    );
}

function MapPinBadge({
    x,
    y,
    tone,
    icon,
    title,
    subtitle,
    floating = false,
}: {
    x: number;
    y: number;
    tone: "orange" | "lime" | "blue";
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    floating?: boolean;
}) {
    const tones = {
        orange: "bg-[#fff1df] text-[#c56b1d] border-[#ffd3ad]",
        lime: "bg-[#f2fad2] text-[#6d8616] border-[#d7ea88]",
        blue: "bg-[#e9f1ff] text-[#2b67cf] border-[#c6dbff]",
    };

    return (
        <div
            className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 ${floating ? "animate-[float_3.2s_ease-in-out_infinite]" : ""}`}
            style={{ left: `${x}%`, top: `${y}%` }}
        >
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border shadow-[0_18px_40px_rgba(0,0,0,0.08)] ${tones[tone]}`}>
                {icon}
            </div>
            <div className="mt-2 min-w-[150px] rounded-[18px] border border-white/80 bg-white/92 px-3 py-2 text-center shadow-[0_12px_30px_rgba(0,0,0,0.06)]">
                <p className="text-[11px] font-black text-[#2f2a1c]">{title}</p>
                <p className="mt-1 text-[10px] font-semibold text-[#8a7d62]">{subtitle}</p>
            </div>
        </div>
    );
}

function LegendCard({
    tone,
    title,
    helper,
}: {
    tone: "orange" | "lime" | "blue";
    title: string;
    helper: string;
}) {
    const toneClass =
        tone === "orange"
            ? "bg-[#fff1df] text-[#c56b1d]"
            : tone === "lime"
              ? "bg-[#f2fad2] text-[#6d8616]"
              : "bg-[#e9f1ff] text-[#2b67cf]";

    return (
        <div className="rounded-[22px] border border-white/70 bg-white/90 p-4 shadow-[0_18px_40px_rgba(0,0,0,0.05)] backdrop-blur">
            <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${toneClass}`}>
                {title}
            </span>
            <p className="mt-3 text-sm font-semibold text-[#756a54]">{helper}</p>
        </div>
    );
}
