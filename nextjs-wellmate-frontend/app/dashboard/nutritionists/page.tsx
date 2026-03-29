"use client";

import React, { useState, useMemo, useEffect } from "react";
import { adminService } from "@/services/admin";
import { NutritionistCardSkeleton, NutritionistDetailSkeleton } from "@/components/dashboard/DashboardSkeletons";

type Status = "pending" | "approved" | "rejected";

interface Nutritionist {
    id: string;
    name: string;
    expertise: string;
    exp: string;
    status: Status;
    email: string;
    phone: string;
    license: string;
    education: string;
    bio: string;
    licenseDocumentUrl: string | null;
    profileImageUrl: string | null;
}

const theme = {
    bg: "#f4f0e6",
    cardBg: "#ffffff",
    border: "#e5dfd0",
    gold: "#997000",
    goldLight: "#fef3c7",
    goldMid: "#d4a017",
    text: "#1c1917",
    textMuted: "#78716c",
    textLight: "#a8a29e",
};

const getAvatarColor = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i += 1) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
        hash |= 0;
    }
    const colors = ["#997000", "#b45309", "#92400e", "#78350f", "#a16207"];
    return colors[Math.abs(hash) % colors.length];
};

const getInitials = (name: string) => {
    const clean = name.replace(/^(พญ\.|นพ\.|ดร\.|คุณ)\s*/u, "");
    const parts = clean.split(" ");
    return parts
        .slice(0, 2)
        .map((p) => p[0])
        .join("")
        .toUpperCase();
};

const statusConfig: Record<Status, { bg: string; text: string; border: string; dot: string; label: string }> = {
    pending: { bg: "#fffbeb", text: "#92400e", border: "#fde68a", dot: "#f59e0b", label: "Pending" },
    approved: { bg: "#f0fdf4", text: "#166534", border: "#bbf7d0", dot: "#22c55e", label: "Approved" },
    rejected: { bg: "#fff1f2", text: "#9f1239", border: "#fecdd3", dot: "#f43f5e", label: "Rejected" },
};

const StatusPill = ({ status }: { status: Status }) => {
    const c = statusConfig[status];
    return (
        <span
            style={{ backgroundColor: c.bg, color: c.text, border: `1px solid ${c.border}` }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
        >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.dot }} />
            {c.label}
        </span>
    );
};

interface ToastData {
    message: string;
}

const Toast = ({ toast }: { toast: ToastData | null }) => (
    <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2.5 px-6 py-3.5 rounded-2xl shadow-2xl text-sm font-semibold transition-all duration-300 ${
            toast ? "opacity-100 translate-y-0" : "opacity-100 translate-y-8 pointer-events-none opacity-0"
        }`}
        style={{ backgroundColor: theme.text, color: "#fff", minWidth: 220 }}
    >
        {toast?.message}
    </div>
);

const PdfViewer = ({ licenseUrl }: { licenseUrl: string | null }) => (
    <div className="w-full rounded-2xl overflow-hidden border flex flex-col" style={{ borderColor: theme.border }}>
        <div className="flex items-center justify-between px-3 py-2" style={{ backgroundColor: theme.gold }}>
            <span className="text-white text-[10px] font-medium truncate">License Document</span>
            {licenseUrl && (
                <a href={licenseUrl} target="_blank" rel="noreferrer" className="text-white/90 text-[10px] underline">
                    Open
                </a>
            )}
        </div>
        <div className="p-4 text-xs" style={{ color: theme.textMuted }}>
            {licenseUrl ? "Document attached" : "No document"}
        </div>
    </div>
);

const DetailPanel = ({
    item,
    onApprove,
    onReject,
}: {
    item: Nutritionist | null;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
}) => {
    const [expandedBio, setExpandedBio] = useState(false);
    const [expandedEdu, setExpandedEdu] = useState(false);

    useEffect(() => {
        setExpandedBio(false);
        setExpandedEdu(false);
    }, [item]);

    if (!item) {
        return (
            <div
                className="flex-1 flex flex-col items-center justify-center gap-4 rounded-3xl border"
                style={{ backgroundColor: theme.cardBg, borderColor: theme.border, minHeight: 400 }}
            >
                <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl" style={{ backgroundColor: theme.goldLight }}>
                    🔍
                </div>
                <div className="text-center">
                    <p className="font-semibold text-base" style={{ color: theme.text }}>
                        เลือกรายการเพื่อดูรายละเอียด
                    </p>
                    <p className="text-sm mt-1" style={{ color: theme.textLight }}>
                        คลิกที่การ์ดนักโภชนาการเพื่อดูข้อมูลเพิ่มเติม
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 rounded-3xl border flex flex-col overflow-hidden" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
            <div className="relative px-3 pt-5 pb-4 border-b flex flex-col items-center text-center" style={{ borderColor: theme.border }}>
                <div className="absolute inset-x-0 top-0 h-1.5 rounded-t-3xl" style={{ background: `linear-gradient(90deg, ${theme.gold}, ${theme.goldMid})` }} />

                <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-sm mb-1.5 mt-1"
                    style={{ backgroundColor: getAvatarColor(item.name) }}
                >
                    {getInitials(item.name)}
                </div>

                <p className="font-black text-[32px] leading-tight px-0" style={{ color: theme.text }}>
                    {item.name}
                </p>
                <div className="flex flex-col items-center gap-1.5 mt-2 justify-center">
                    <StatusPill status={item.status} />
                    <span className="text-[11px] font-semibold" style={{ color: theme.textMuted }}>
                        {item.expertise} · ประสบการณ์ {item.exp}
                    </span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
                <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: theme.textLight }}>
                        ข้อมูลติดต่อ
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                        {[
                            { icon: "📧", label: "อีเมล", value: item.email, expandable: false },
                            { icon: "📞", label: "โทรศัพท์", value: item.phone, expandable: false },
                            { icon: "🎓", label: "การศึกษา", value: item.education, expandable: true },
                        ].map(({ icon, label, value, expandable }) => {
                            const isEduExpanded = expandable && expandedEdu;
                            return (
                                <button
                                    key={label}
                                    onClick={expandable ? () => setExpandedEdu(!expandedEdu) : undefined}
                                    className={`flex items-start gap-2 p-2 rounded-xl text-left w-full transition-colors ${
                                        expandable ? "cursor-pointer hover:brightness-95" : "cursor-default"
                                    }`}
                                    style={{ backgroundColor: theme.bg }}
                                >
                                    <span className="text-xs mt-0.5 shrink-0">{icon}</span>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[9px] font-semibold uppercase tracking-wide" style={{ color: theme.textLight }}>
                                            {label}
                                        </p>
                                        <p className={`text-xs font-medium mt-0.5 ${!isEduExpanded ? "truncate" : ""}`} style={{ color: theme.text }}>
                                            {value}
                                        </p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest mb-1.5 flex justify-between items-center" style={{ color: theme.textLight }}>
                        เกี่ยวกับนักโภชนาการ
                        <button
                            onClick={() => setExpandedBio(!expandedBio)}
                            className="text-[9px] font-bold underline cursor-pointer"
                            style={{ color: theme.gold }}
                        >
                            {expandedBio ? "ย่อ" : "อ่านเพิ่ม"}
                        </button>
                    </p>
                    <div
                        onClick={() => setExpandedBio(!expandedBio)}
                        className={`text-[11px] leading-relaxed p-2 rounded-xl cursor-pointer transition-colors hover:brightness-95 ${
                            expandedBio ? "" : "line-clamp-2"
                        }`}
                        style={{ color: theme.textMuted, backgroundColor: theme.bg }}
                    >
                        {item.bio}
                    </div>
                </div>

                <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest mb-1.5" style={{ color: theme.textLight }}>
                        ใบประกอบวิชาชีพ
                    </p>
                    <PdfViewer licenseUrl={item.licenseDocumentUrl} />
                </div>
            </div>

            <div className="shrink-0 px-3 py-3 border-t" style={{ borderColor: theme.border }}>
                {item.status === "pending" ? (
                    <div className="flex gap-3">
                        <button
                            onClick={() => onApprove(item.id)}
                            className="flex-1 py-3 rounded-2xl text-sm font-bold transition-all duration-150 active:scale-95 flex items-center justify-center gap-2"
                            style={{ backgroundColor: theme.gold, color: "#fff" }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#7a5800")}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = theme.gold)}
                        >
                            <span className="text-base">✅</span> อนุมัติคำขอ
                        </button>
                        <button
                            onClick={() => onReject(item.id)}
                            className="flex-1 py-3 rounded-2xl text-sm font-bold transition-all duration-150 active:scale-95 flex items-center justify-center gap-2"
                            style={{ backgroundColor: "#fff1f2", color: "#9f1239", border: "1px solid #fecdd3" }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#ffe4e6")}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fff1f2")}
                        >
                            <span className="text-base">✖</span> ปฏิเสธ
                        </button>
                    </div>
                ) : (
                    <div className="py-2 px-4 rounded-2xl text-sm text-center font-medium" style={{ backgroundColor: theme.bg, color: theme.textMuted }}>
                        {item.status === "approved"
                            ? "✅ อนุมัติแล้ว — ไม่สามารถเปลี่ยนสถานะได้"
                            : "✖ ปฏิเสธแล้ว — ไม่สามารถเปลี่ยนสถานะได้"}
                    </div>
                )}
            </div>
        </div>
    );
};

const NutritionistCard = ({
    item,
    isActive,
    onClick,
    onApprove,
    onReject,
}: {
    item: Nutritionist;
    isActive: boolean;
    onClick: () => void;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
}) => (
    <div
        onClick={onClick}
        className="group relative p-6 rounded-3xl border cursor-pointer transition-all duration-200"
        style={{
            backgroundColor: isActive ? theme.goldLight : theme.cardBg,
            borderColor: isActive ? theme.goldMid : theme.border,
            boxShadow: isActive ? `0 0 0 2px ${theme.goldMid}44` : "none",
        }}
        onMouseEnter={(e) => {
            if (!isActive) e.currentTarget.style.borderColor = theme.textLight;
        }}
        onMouseLeave={(e) => {
            if (!isActive) e.currentTarget.style.borderColor = theme.border;
        }}
    >
        {isActive && <div className="absolute left-0 top-6 bottom-6 w-1.5 rounded-r-full" style={{ backgroundColor: theme.gold }} />}

        <div className="flex items-center gap-4">
            <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shrink-0 shadow-sm"
                style={{ backgroundColor: getAvatarColor(item.name) }}
            >
                {getInitials(item.name)}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3">
                    <p className="font-extrabold text-lg truncate" style={{ color: theme.text }}>
                        {item.name}
                    </p>
                    <StatusPill status={item.status} />
                </div>
                <div className="flex items-center gap-2.5 mt-1.5">
                    <span
                        className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                        style={{ backgroundColor: `${getAvatarColor(item.name)}18`, color: getAvatarColor(item.name) }}
                    >
                        {item.expertise}
                    </span>
                    <span className="text-xs font-medium" style={{ color: theme.textMuted }}>
                        · ประสบการณ์ {item.exp}
                    </span>
                </div>
            </div>
        </div>

        {item.status === "pending" && (
            <div
                className="flex gap-2.5 mt-4 pt-4 border-t"
                style={{ borderColor: theme.border }}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={() => onApprove(item.id)}
                    className="flex-1 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm"
                    style={{ backgroundColor: "#16a34a", color: "#fff" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#15803d")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#16a34a")}
                >
                    ✓ อนุมัติคำขอ
                </button>
                <button
                    onClick={() => onReject(item.id)}
                    className="flex-1 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm"
                    style={{ backgroundColor: "#fee2e2", color: "#991b1b" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#fecaca")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fee2e2")}
                >
                    ✖ ปฏิเสธ
                </button>
            </div>
        )}
    </div>
);

const StatChip = ({
    label,
    count,
    active,
    onClick,
    dotColor,
}: {
    label: string;
    count: number;
    active: boolean;
    onClick: () => void;
    dotColor: string;
}) => (
    <button
        onClick={onClick}
        className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold border transition-all duration-200"
        style={{
            backgroundColor: active ? theme.gold : theme.cardBg,
            color: active ? "#fff" : theme.textMuted,
            borderColor: active ? theme.gold : theme.border,
        }}
    >
        {!active && <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: dotColor }} />}
        {label}
        <span
            className={`ml-0.5 px-1.5 py-0.5 rounded-full text-xs font-bold ${active ? "bg-white/25" : ""}`}
            style={!active ? { backgroundColor: theme.bg } : {}}
        >
            {count}
        </span>
    </button>
);

export default function NutritionistApproval() {
    const [nutritionists, setNutritionists] = useState<Nutritionist[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState<"all" | Status>("all");
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [toast, setToast] = useState<ToastData | null>(null);

    const selectedItem = useMemo(
        () => nutritionists.find((n) => n.id === selectedId) ?? null,
        [nutritionists, selectedId]
    );

    useEffect(() => {
        setLoading(true);
        setError(null);
        adminService
            .getNutritionists()
            .then((data) => {
                setNutritionists(data);
            })
            .catch((err) => {
                console.error("Failed to fetch nutritionists", err);
                setError("Failed to fetch nutritionists");
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        const first = nutritionists.find((n) => n.status === "pending");
        if (first) setSelectedId(first.id);
    }, [nutritionists]);

    const filtered = useMemo(
        () =>
            nutritionists.filter((n) => {
                const matchSearch =
                    n.name.toLowerCase().includes(search.toLowerCase()) ||
                    (n.expertise || "").toLowerCase().includes(search.toLowerCase());
                const matchStatus = filterStatus === "all" || n.status === filterStatus;
                return matchSearch && matchStatus;
            }),
        [nutritionists, search, filterStatus]
    );

    const counts = useMemo(
        () => ({
            all: nutritionists.length,
            pending: nutritionists.filter((n) => n.status === "pending").length,
            approved: nutritionists.filter((n) => n.status === "approved").length,
            rejected: nutritionists.filter((n) => n.status === "rejected").length,
        }),
        [nutritionists]
    );

    const showToast = (message: string) => {
        setToast({ message });
        setTimeout(() => setToast(null), 2800);
    };

    const updateStatus = async (id: string, status: Status) => {
        try {
            const updated =
                status === "approved"
                    ? await adminService.approveNutritionist(id)
                    : await adminService.rejectNutritionist(id);
            setNutritionists((prev) => prev.map((n) => (n.id === id ? updated : n)));
            showToast(status === "approved" ? "Approved" : "Rejected");
        } catch (err) {
            console.error("Failed to update status", err);
            setError("Failed to update status");
        }
    };

    return (
        <div
            className="flex-1 h-screen overflow-y-auto ml-64 bg-[#fffbf5] flex flex-col"
            style={{ fontFamily: "Inter, system-ui, sans-serif" }}
        >
            <Toast toast={toast} />

            <header
                className="sticky top-0 z-30 border-b px-8 py-0"
                style={{
                    backgroundColor: "rgba(255, 251, 245, 0.85)",
                    borderColor: theme.border,
                    backdropFilter: "blur(12px)",
                }}
            >
                <div className="w-full flex items-center justify-between h-14">
                    <div className="flex items-center gap-2 text-sm" style={{ color: theme.textMuted }}>
                        <span style={{ color: theme.textLight }}>Admin</span>
                        <span>/</span>
                        <span className="font-semibold" style={{ color: theme.text }}>
                            Nutritionist Approval
                        </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-semibold" style={{ color: theme.textMuted }}>
                        <span>
                            รอพิจารณา <span className="text-amber-600 font-bold">{counts.pending}</span>
                        </span>
                        <span>
                            อนุมัติ <span className="font-bold" style={{ color: "#16a34a" }}>
                                {counts.approved}
                            </span>
                        </span>
                        <span>
                            ปฏิเสธ <span className="text-red-600 font-bold">{counts.rejected}</span>
                        </span>
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full px-8 py-6 flex flex-col gap-5">
                <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                    <div>
                        <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: theme.text }}>
                            ตรวจสอบคำขอนักโภชนาการ
                        </h1>
                        <p className="text-sm mt-0.5" style={{ color: theme.textMuted }}>
                            รวม {counts.all} รายการ · เลือกการ์ดเพื่อดูรายละเอียด
                        </p>
                    </div>

                    <div className="sm:ml-auto relative">
                        <span
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none"
                            style={{ color: theme.textLight }}
                        >
                            🔍
                        </span>
                        <input
                            type="text"
                            placeholder="ค้นหาชื่อ หรือความเชี่ยวชาญ..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 pr-4 py-2 rounded-xl text-sm border focus:outline-none w-64 transition-shadow"
                            style={{ backgroundColor: theme.cardBg, borderColor: theme.border, color: theme.text }}
                            onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 2px ${theme.goldMid}55`)}
                            onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
                        />
                    </div>
                </div>

                {error && (
                    <p className="text-xs" style={{ color: "#dc2626" }}>
                        {error}
                    </p>
                )}

                <div className="flex flex-wrap gap-2">
                    <StatChip
                        label="ทั้งหมด"
                        count={counts.all}
                        active={filterStatus === "all"}
                        onClick={() => setFilterStatus("all")}
                        dotColor={theme.gold}
                    />
                    <StatChip
                        label="รอพิจารณา"
                        count={counts.pending}
                        active={filterStatus === "pending"}
                        onClick={() => setFilterStatus("pending")}
                        dotColor="#f59e0b"
                    />
                    <StatChip
                        label="อนุมัติแล้ว"
                        count={counts.approved}
                        active={filterStatus === "approved"}
                        onClick={() => setFilterStatus("approved")}
                        dotColor="#22c55e"
                    />
                    <StatChip
                        label="ปฏิเสธแล้ว"
                        count={counts.rejected}
                        active={filterStatus === "rejected"}
                        onClick={() => setFilterStatus("rejected")}
                        dotColor="#f43f5e"
                    />
                </div>

                {loading ? (
                    <div className="flex flex-col xl:flex-row gap-6 items-start">
                        <div className="w-full xl:flex-1 min-w-0 flex flex-col gap-4">
                            {[...Array(5)].map((_, i) => (
                                <NutritionistCardSkeleton key={i} />
                            ))}
                        </div>
                        <div className="w-full xl:w-[420px] shrink-0 sticky top-[72px]">
                            <NutritionistDetailSkeleton />
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col xl:flex-row gap-6 items-start">
                        <div className="w-full xl:flex-1 min-w-0 flex flex-col gap-4">
                            {filtered.length === 0 ? (
                                <div
                                    className="flex flex-col items-center gap-3 py-16 rounded-3xl border"
                                    style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
                                >
                                    <span className="text-4xl">🔍</span>
                                    <p className="text-sm" style={{ color: theme.textLight }}>
                                        ไม่พบข้อมูลที่ค้นหา
                                    </p>
                                    {filterStatus !== "all" && (
                                        <button
                                            onClick={() => setFilterStatus("all")}
                                            className="text-xs underline"
                                            style={{ color: theme.gold }}
                                        >
                                            ล้างตัวกรอง
                                        </button>
                                    )}
                                </div>
                            ) : (
                                filtered.map((item) => (
                                    <NutritionistCard
                                        key={item.id}
                                        item={item}
                                        isActive={selectedId === item.id}
                                        onClick={() => setSelectedId(item.id)}
                                        onApprove={(id) => updateStatus(id, "approved")}
                                        onReject={(id) => updateStatus(id, "rejected")}
                                    />
                                ))
                            )}
                            <p className="text-xs text-center pt-1" style={{ color: theme.textLight }}>
                                แสดง {filtered.length} จาก {nutritionists.length} รายการ
                            </p>
                        </div>

                        <div className="w-full xl:w-[420px] shrink-0 sticky top-[72px]" style={{ minHeight: 520 }}>
                            <DetailPanel
                                item={selectedItem}
                                onApprove={(id) => {
                                    updateStatus(id, "approved");
                                }}
                                onReject={(id) => {
                                    updateStatus(id, "rejected");
                                }}
                            />
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
