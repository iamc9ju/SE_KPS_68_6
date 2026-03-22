'use client';

import React, { useState, useMemo, useEffect } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
type Status = 'Pending' | 'Approved' | 'Rejected';

interface Nutritionist {
    id: number;
    name: string;
    expertise: string;
    exp: string;
    status: Status;
    email: string;
    phone: string;
    license: string;
    education: string;
    bio: string;
    avatarColor: string;
}

// ─── Theme tokens ─────────────────────────────────────────────────────────────
// Warm earthy palette inspired by the reference screenshot
const theme = {
    bg: '#f4f0e6',          // warm cream page background
    cardBg: '#ffffff',
    border: '#e5dfd0',
    gold: '#997000',        // primary accent — dark gold
    goldLight: '#fef3c7',   // amber-100
    goldMid: '#d4a017',     // mid gold for accents
    text: '#1c1917',        // warm near-black
    textMuted: '#78716c',   // warm gray
    textLight: '#a8a29e',
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const initialData: Nutritionist[] = [
    {
        id: 1, name: 'พญ. สมหญิง ใจดี', expertise: 'ลดน้ำหนัก', exp: '5 ปี',
        status: 'Pending', email: 'somying@example.com', phone: '081-234-5678',
        license: 'ใบประกอบวิชาชีพ #12345',
        education: 'มหาวิทยาลัยมหิดล, วท.บ. โภชนศาสตร์',
        bio: 'เชี่ยวชาญด้านการควบคุมน้ำหนักและโภชนาการบำบัด มีประสบการณ์ทำงานกับผู้ป่วยโรคอ้วนมากกว่า 500 ราย',
        avatarColor: '#997000',
    },
    {
        id: 2, name: 'นพ. สมชาย รักสุขภาพ', expertise: 'โภชนาการกีฬา', exp: '3 ปี',
        status: 'Approved', email: 'somchai@example.com', phone: '082-345-6789',
        license: 'ใบประกอบวิชาชีพ #23456',
        education: 'จุฬาลงกรณ์มหาวิทยาลัย, วท.ม. โภชนศาสตร์การกีฬา',
        bio: 'ให้คำปรึกษาด้านโภชนาการแก่นักกีฬาระดับชาติ และผู้ที่ต้องการเพิ่มสมรรถภาพร่างกาย',
        avatarColor: '#b45309',
    },
    {
        id: 3, name: 'คุณ ใจรัก อาหารคลีน', expertise: 'เบาหวาน', exp: '2 ปี',
        status: 'Rejected', email: 'jairak@example.com', phone: '083-456-7890',
        license: 'ใบประกอบวิชาชีพ #34567',
        education: 'มหาวิทยาลัยเกษตรศาสตร์, วท.บ. คหกรรมศาสตร์',
        bio: 'ผู้เชี่ยวชาญด้านโภชนาการสำหรับผู้ป่วยเบาหวาน ออกแบบแผนอาหารเฉพาะบุคคล',
        avatarColor: '#92400e',
    },
    {
        id: 4, name: 'ดร. วิชัย สุขภาพดี', expertise: 'โรคหัวใจ', exp: '8 ปี',
        status: 'Pending', email: 'wichai@example.com', phone: '084-567-8901',
        license: 'ใบประกอบวิชาชีพ #45678',
        education: 'มหาวิทยาลัยขอนแก่น, ปร.ด. โภชนศาสตร์',
        bio: 'งานวิจัยด้านโภชนาการกับโรคหัวใจและหลอดเลือด ที่ปรึกษาโรงพยาบาลมาตรฐานสากล',
        avatarColor: '#78350f',
    },
    {
        id: 5, name: 'คุณ มาลี รักกิน', expertise: 'โภชนาการเด็ก', exp: '4 ปี',
        status: 'Pending', email: 'malee@example.com', phone: '085-678-9012',
        license: 'ใบประกอบวิชาชีพ #56789',
        education: 'มหาวิทยาลัยธรรมศาสตร์, วท.บ. โภชนศาสตร์และการกำหนดอาหาร',
        bio: 'เชี่ยวชาญด้านโภชนาการสำหรับเด็กและวัยรุ่น ป้องกันและแก้ไขภาวะทุพโภชนาการ',
        avatarColor: '#a16207',
    },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getInitials = (name: string) => {
    const clean = name.replace(/^(พญ\.|นพ\.|ดร\.|คุณ)\s*/u, '');
    const parts = clean.split(' ');
    return parts.slice(0, 2).map((p) => p[0]).join('').toUpperCase();
};

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: Status }) => {
    const cfg: Record<Status, { bg: string; text: string; icon: string; label: string }> = {
        Pending: { bg: '#fef9c3', text: '#854d0e', icon: '⏳', label: 'รอดำเนินการ' },
        Approved: { bg: '#dcfce7', text: '#166534', icon: '✓', label: 'อนุมัติแล้ว' },
        Rejected: { bg: '#fee2e2', text: '#991b1b', icon: '✕', label: 'ไม่อนุมัติ' },
    };
    const c = cfg[status];
    return (
        <span
            style={{ backgroundColor: c.bg, color: c.text }}
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold"
        >
            {c.icon} {c.label}
        </span>
    );
};

// ─── PDF Viewer (mock) ────────────────────────────────────────────────────────
const PdfViewer = ({ license }: { license: string }) => (
    <div className="w-full rounded-xl overflow-hidden border" style={{ borderColor: theme.border, height: 300 }}>
        {/* toolbar */}
        <div className="flex items-center justify-between px-4 py-2" style={{ backgroundColor: theme.gold }}>
            <span className="text-white text-xs font-medium truncate">📄 {license}.pdf</span>
            <button className="text-white/80 hover:text-white text-xs px-2 py-0.5 rounded border border-white/30 hover:bg-white/10 transition-colors">
                ⬇ ดาวน์โหลด
            </button>
        </div>
        {/* document body */}
        <div className="flex flex-col items-center justify-start p-6 gap-3 bg-white h-[calc(100%-40px)]">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-1" style={{ backgroundColor: theme.goldLight }}>
                📋
            </div>
            <div className="w-44 h-3 rounded" style={{ backgroundColor: '#f5f0e6' }} />
            <div className="w-56 h-2.5 rounded" style={{ backgroundColor: '#f0ebe0' }} />
            <div className="w-48 h-2.5 rounded" style={{ backgroundColor: '#f0ebe0' }} />
            <div className="border-t border-dashed w-full mt-2 pt-3 flex flex-col gap-2" style={{ borderColor: theme.border }}>
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="rounded" style={{ height: 10, backgroundColor: '#f5f0e6', width: `${60 + i * 8}%` }} />
                ))}
            </div>
            <p className="text-xs mt-auto" style={{ color: theme.textLight }}>{license}</p>
        </div>
    </div>
);

// ─── Side Drawer ──────────────────────────────────────────────────────────────
const SideDrawer = ({
    item, onClose, onApprove, onReject,
}: {
    item: Nutritionist | null;
    onClose: () => void;
    onApprove: (id: number) => void;
    onReject: (id: number) => void;
}) => {
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    const isOpen = !!item;

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                className={`fixed inset-0 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                style={{ backgroundColor: 'rgba(28,25,23,0.35)', backdropFilter: 'blur(2px)' }}
            />
            {/* Panel */}
            <div
                className={`fixed top-0 right-0 z-50 h-full w-full max-w-[420px] flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
                style={{ backgroundColor: theme.bg }}
            >
                {item && (
                    <>
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 shrink-0 border-b" style={{ borderColor: theme.border, backgroundColor: theme.cardBg }}>
                            <h2 className="font-bold text-base" style={{ color: theme.text }}>รายละเอียดนักโภชนาการ</h2>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 flex items-center justify-center rounded-full transition-colors text-sm font-bold"
                                style={{ backgroundColor: theme.bg, color: theme.textMuted }}
                            >
                                ✕
                            </button>
                        </div>

                        {/* Scrollable Body */}
                        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                            {/* Profile Card */}
                            <div className="flex items-center gap-4 p-4 rounded-2xl border" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
                                <div
                                    className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0"
                                    style={{ backgroundColor: item.avatarColor }}
                                >
                                    {getInitials(item.name)}
                                </div>
                                <div>
                                    <p className="font-bold text-base leading-snug" style={{ color: theme.text }}>{item.name}</p>
                                    <p className="text-sm mt-0.5" style={{ color: theme.textMuted }}>{item.expertise} · {item.exp}</p>
                                    <div className="mt-2"><StatusBadge status={item.status} /></div>
                                </div>
                            </div>

                            {/* Contact */}
                            <div className="rounded-2xl border p-4 space-y-3" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
                                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.textLight }}>ข้อมูลติดต่อ</p>
                                <DrawerRow icon="📧" label="อีเมล" value={item.email} />
                                <DrawerRow icon="📞" label="โทรศัพท์" value={item.phone} />
                                <DrawerRow icon="🎓" label="การศึกษา" value={item.education} />
                            </div>

                            {/* Bio */}
                            <div className="rounded-2xl border p-4" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
                                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: theme.textLight }}>เกี่ยวกับ</p>
                                <p className="text-sm leading-relaxed" style={{ color: theme.textMuted }}>{item.bio}</p>
                            </div>

                            {/* PDF Preview */}
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: theme.textLight }}>ใบประกอบวิชาชีพ</p>
                                <PdfViewer license={item.license} />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="shrink-0 px-6 py-4 border-t flex gap-3" style={{ borderColor: theme.border, backgroundColor: theme.cardBg }}>
                            {item.status === 'Pending' ? (
                                <>
                                    <button
                                        onClick={() => { onApprove(item.id); onClose(); }}
                                        className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95"
                                        style={{ backgroundColor: theme.gold, color: '#fff' }}
                                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#7a5800')}
                                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = theme.gold)}
                                    >
                                        ✅ อนุมัติ
                                    </button>
                                    <button
                                        onClick={() => { onReject(item.id); onClose(); }}
                                        className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95"
                                        style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}
                                    >
                                        ✕ ปฏิเสธ
                                    </button>
                                </>
                            ) : (
                                <p className="flex-1 text-center text-sm py-2" style={{ color: theme.textMuted }}>
                                    {item.status === 'Approved' ? '✅ อนุมัติแล้ว' : '✕ ปฏิเสธแล้ว'} — ไม่สามารถเปลี่ยนสถานะได้
                                </p>
                            )}
                            <button
                                onClick={onClose}
                                className="px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors"
                                style={{ borderColor: theme.border, color: theme.textMuted, backgroundColor: theme.bg }}
                            >
                                ปิด
                            </button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

const DrawerRow = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
    <div className="flex items-start gap-3">
        <span className="text-base mt-0.5">{icon}</span>
        <div>
            <p className="text-xs" style={{ color: theme.textLight }}>{label}</p>
            <p className="text-sm font-medium" style={{ color: theme.text }}>{value}</p>
        </div>
    </div>
);

// ─── Toast ────────────────────────────────────────────────────────────────────
interface ToastData { message: string; type: 'success' | 'error' }

const Toast = ({ toast }: { toast: ToastData | null }) => (
    <div
        className={`fixed top-5 right-5 z-[60] flex items-center gap-2 px-5 py-3 rounded-2xl shadow-2xl font-semibold text-sm transition-all duration-300 ${toast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
        style={{ backgroundColor: theme.gold, color: '#fff' }}
    >
        {toast?.message}
    </div>
);

// ─── Summary Card ─────────────────────────────────────────────────────────────
const SummaryCard = ({ label, count, barColor }: { label: string; count: number; barColor: string }) => (
    <div
        className="rounded-2xl border p-4 flex flex-col gap-2"
        style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
    >
        <div className="flex items-end justify-between">
            <span className="text-3xl font-extrabold" style={{ color: theme.text }}>{count}</span>
            <span className="text-xs font-medium" style={{ color: theme.textMuted }}>{label}</span>
        </div>
        {/* mini bar */}
        <div className="h-1.5 w-full rounded-full" style={{ backgroundColor: theme.bg }}>
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.max(10, count * 20)}%`, backgroundColor: barColor }} />
        </div>
    </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function NutritionistApproval() {
    const [nutritionists, setNutritionists] = useState<Nutritionist[]>(initialData);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | Status>('all');
    const [drawerItem, setDrawerItem] = useState<Nutritionist | null>(null);
    const [toast, setToast] = useState<ToastData | null>(null);

    // keep drawer in sync with state changes
    useEffect(() => {
        if (drawerItem) {
            const updated = nutritionists.find((n) => n.id === drawerItem.id);
            if (updated) setDrawerItem(updated);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nutritionists]);

    const filtered = useMemo(() =>
        nutritionists.filter((n) => {
            const matchSearch = n.name.toLowerCase().includes(search.toLowerCase()) ||
                n.expertise.toLowerCase().includes(search.toLowerCase());
            const matchStatus = filterStatus === 'all' || n.status === filterStatus;
            return matchSearch && matchStatus;
        }),
        [nutritionists, search, filterStatus]
    );

    const counts = useMemo(() => ({
        all: nutritionists.length,
        pending: nutritionists.filter((n) => n.status === 'Pending').length,
        approved: nutritionists.filter((n) => n.status === 'Approved').length,
        rejected: nutritionists.filter((n) => n.status === 'Rejected').length,
    }), [nutritionists]);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 2800);
    };

    const updateStatus = (id: number, status: Status) => {
        setNutritionists((prev) => prev.map((n) => (n.id === id ? { ...n, status } : n)));
        showToast(status === 'Approved' ? '✅ อนุมัติสำเร็จแล้ว' : '✕ ปฏิเสธคำขอแล้ว', status === 'Approved' ? 'success' : 'error');
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: theme.bg, fontFamily: 'Inter, system-ui, sans-serif' }}>
            <Toast toast={toast} />
            <SideDrawer
                item={drawerItem}
                onClose={() => setDrawerItem(null)}
                onApprove={(id) => updateStatus(id, 'Approved')}
                onReject={(id) => updateStatus(id, 'Rejected')}
            />

            <div className="max-w-5xl mx-auto px-6 py-8">
                {/* ── Header ───────────────────────────────────────────────── */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5 mb-7">
                    <div>
                        <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: theme.text }}>
                            Nutritionist Approval
                        </h1>
                        <p className="text-sm mt-1" style={{ color: theme.textMuted }}>
                            ตรวจสอบและอนุมัติคำขอของนักโภชนาการ
                        </p>
                    </div>

                    {/* Search & Filter */}
                    <div className="flex gap-2 flex-wrap">
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: theme.textLight }}>🔍</span>
                            <input
                                type="text"
                                placeholder="ค้นหา..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 pr-4 py-2 rounded-xl text-sm w-48 border focus:outline-none transition-shadow"
                                style={{
                                    backgroundColor: theme.cardBg,
                                    borderColor: theme.border,
                                    color: theme.text,
                                    boxShadow: 'none',
                                }}
                                onFocus={e => e.currentTarget.style.boxShadow = `0 0 0 2px ${theme.goldMid}55`}
                                onBlur={e => e.currentTarget.style.boxShadow = 'none'}
                            />
                        </div>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as 'all' | Status)}
                            className="px-4 py-2 rounded-xl text-sm border focus:outline-none"
                            style={{ backgroundColor: theme.cardBg, borderColor: theme.border, color: theme.text }}
                        >
                            <option value="all">สถานะทั้งหมด</option>
                            <option value="Pending">⏳ Pending</option>
                            <option value="Approved">✓ Approved</option>
                            <option value="Rejected">✕ Rejected</option>
                        </select>
                    </div>
                </div>

                {/* ── Summary Cards ─────────────────────────────────────────── */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    <SummaryCard label="ทั้งหมด" count={counts.all} barColor={theme.gold} />
                    <SummaryCard label="รอพิจารณา" count={counts.pending} barColor="#d97706" />
                    <SummaryCard label="อนุมัติแล้ว" count={counts.approved} barColor={theme.gold} />
                    <SummaryCard label="ปฏิเสธแล้ว" count={counts.rejected} barColor="#d97706" />
                </div>

                {/* ── Table ─────────────────────────────────────────────────── */}
                <div className="rounded-2xl border overflow-hidden shadow-sm" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr style={{ backgroundColor: theme.bg, borderBottom: `1px solid ${theme.border}` }}>
                                    {['#', 'นักโภชนาการ', 'ความเชี่ยวชาญ', 'ประสบการณ์', 'สถานะ', 'จัดการ'].map((h, i) => (
                                        <th
                                            key={h}
                                            className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider ${i === 5 ? 'text-center' : ''} ${i === 0 ? 'pl-6' : ''} ${i === 5 ? 'pr-6' : ''}`}
                                            style={{ color: theme.textMuted }}
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-16 text-center text-sm" style={{ color: theme.textLight }}>
                                            <div className="flex flex-col items-center gap-2">
                                                <span className="text-4xl">🔍</span>
                                                <span>ไม่พบข้อมูลที่ค้นหา</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((item, index) => (
                                        <tr
                                            key={item.id}
                                            className="transition-colors"
                                            style={{ borderBottom: `1px solid ${theme.border}` }}
                                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#fef9ef')}
                                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                                        >
                                            {/* # */}
                                            <td className="pl-6 px-4 py-3.5 text-sm" style={{ color: theme.textLight }}>{index + 1}</td>

                                            {/* Avatar + Name */}
                                            <td className="px-4 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                                                        style={{ backgroundColor: item.avatarColor }}
                                                    >
                                                        {getInitials(item.name)}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-sm" style={{ color: theme.text }}>{item.name}</p>
                                                        <p className="text-xs" style={{ color: theme.textLight }}>{item.email}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Expertise */}
                                            <td className="px-4 py-3.5 text-sm font-medium" style={{ color: theme.text }}>{item.expertise}</td>

                                            {/* Exp */}
                                            <td className="px-4 py-3.5 text-sm" style={{ color: theme.textMuted }}>{item.exp}</td>

                                            {/* Status */}
                                            <td className="px-4 py-3.5"><StatusBadge status={item.status} /></td>

                                            {/* Actions */}
                                            <td className="px-4 pr-6 py-3.5">
                                                <div className="flex justify-center items-center gap-1.5">
                                                    {/* 👁 View */}
                                                    <button
                                                        onClick={() => setDrawerItem(item)}
                                                        title="ดูรายละเอียด"
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg text-base transition-colors"
                                                        style={{ backgroundColor: theme.goldLight, color: theme.gold }}
                                                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#fde68a')}
                                                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = theme.goldLight)}
                                                    >
                                                        👁️
                                                    </button>

                                                    {item.status === 'Pending' && (
                                                        <>
                                                            {/* ✓ Approve */}
                                                            <button
                                                                onClick={() => updateStatus(item.id, 'Approved')}
                                                                title="อนุมัติ"
                                                                className="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-colors"
                                                                style={{ backgroundColor: '#16a34a', color: '#fff' }}
                                                                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#15803d')}
                                                                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#16a34a')}
                                                            >
                                                                ✓
                                                            </button>
                                                            {/* ✕ Reject */}
                                                            <button
                                                                onClick={() => updateStatus(item.id, 'Rejected')}
                                                                title="ปฏิเสธ"
                                                                className="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-colors"
                                                                style={{ backgroundColor: '#dc2626', color: '#fff' }}
                                                                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#b91c1c')}
                                                                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#dc2626')}
                                                            >
                                                                ✕
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer */}
                    <div
                        className="px-6 py-3 flex justify-between items-center text-xs"
                        style={{ backgroundColor: theme.bg, borderTop: `1px solid ${theme.border}`, color: theme.textLight }}
                    >
                        <span>แสดง {filtered.length} จาก {nutritionists.length} รายการ</span>
                        {filterStatus !== 'all' && (
                            <button
                                onClick={() => setFilterStatus('all')}
                                className="underline"
                                style={{ color: theme.gold }}
                            >
                                ล้างตัวกรอง
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}