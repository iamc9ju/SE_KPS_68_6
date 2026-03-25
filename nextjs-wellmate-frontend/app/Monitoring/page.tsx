'use client';

import React, { useState, useMemo, useEffect } from 'react';
import OrderDetailModal from '@/component/OrderDetailModal';

// ─── Types ────────────────────────────────────────────────────────────────────
type Status = 'Pending' | 'Completed' | 'Canceled';

interface Order {
    id: string;
    user: string;
    package: string;
    date: string;
    price: number;
    status: Status;
}

interface PackageInfo {
    name: string;
    price: number;
    duration: string;
    description: string;
    features: { title: string; detail: string }[];
    color: string;
}

// ─── Theme ────────────────────────────────────────────────────────────────────
const theme = {
    bg: '#f4f0e6',
    cardBg: '#ffffff',
    border: '#e5dfd0',
    gold: '#997000',
    goldLight: '#fef3c7',
    goldMid: '#d4a017',
    text: '#1c1917',
    textMuted: '#78716c',
    textLight: '#a8a29e',
};

// ─── Status Config ────────────────────────────────────────────────────────────
const statusConfig: Record<Status, { bg: string; text: string; border: string; dot: string; label: string }> = {
    Pending: { bg: '#fffbeb', text: '#92400e', border: '#fde68a', dot: '#f59e0b', label: 'รอตรวจสอบ' },
    Completed: { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0', dot: '#22c55e', label: 'เสร็จสิ้น' },
    Canceled: { bg: '#fff1f2', text: '#9f1239', border: '#fecdd3', dot: '#f43f5e', label: 'ยกเลิกแล้ว' },
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const initialOrders: Order[] = [
    { id: 'ORD-2026-001', user: 'คุณสมชาย สายกิน', package: 'Weight Loss Gold', date: '21 มี.ค. 2026', price: 2500, status: 'Pending' },
    { id: 'ORD-2026-002', user: 'คุณสมหญิง รักสุขภาพ', package: 'Clean Food Monthly', date: '20 มี.ค. 2026', price: 4500, status: 'Completed' },
    { id: 'ORD-2026-003', user: 'คุณวิชัย ใจดี', package: 'Diabetes Care Set', date: '19 มี.ค. 2026', price: 3200, status: 'Pending' },
    { id: 'ORD-2026-004', user: 'คุณมาลี มีสุข', package: 'Kids Nutrition Plan', date: '18 มี.ค. 2026', price: 1800, status: 'Completed' },
    { id: 'ORD-2026-005', user: 'คุณประสิทธิ์ รักดี', package: 'Muscle Gain Pro', date: '17 มี.ค. 2026', price: 3500, status: 'Canceled' },
];

const packageDetails: Record<string, PackageInfo> = {
    'Weight Loss Gold': {
        name: 'Weight Loss Gold',
        price: 2500,
        duration: '30 วัน',
        description: 'โปรแกรมลดน้ำหนักระดับพรีเมียม เน้นการปรับสมดุลโภชนาการและการออกกำลังกายเบื้องต้น',
        features: [
            { title: 'แผนอาหารเฉพาะบุคคล', detail: 'จัดทำแผนผังโภชนาการที่คำนวณตามปริมาณแคลอรี่ที่ร่างกายของคุณต้องการจริงในแต่ละวัน' },
            { title: 'คู่มือการออกกำลังกาย', detail: 'คลิปแนะนำการออกกำลังกายเบื้องต้นที่สามารถทำได้ที่บ้านโดยไม่ต้องมีอุปกรณ์' },
            { title: 'ปรึกษาโภชนาการรายสัปดาห์', detail: 'นัดคุยกับผู้เชี่ยวชาญผ่านวิดีโอคอล 15 นาทีทุกสัปดาห์เพื่อติดตามผลและปรับแผน' },
            { title: 'ติดตามแคลอรี', detail: 'เข้าถึงระบบบันทึกอาหารอัจฉริยะที่จะคำนวณสารอาหารหลัก (Macro) ให้โดยอัตโนมัติ' }
        ],
        color: '#997000'
    },
    'Clean Food Monthly': {
        name: 'Clean Food Monthly',
        price: 4500,
        duration: '30 วัน',
        description: 'บริการส่งอาหารคลีนเพื่อสุขภาพถึงบ้านทุกวัน ใช้วัตถุดิบออร์แกนิกและไม่ใส่ผงชูรส',
        features: [
            { title: 'อาหาร 3 มื้อต่อวัน', detail: 'อาหารปรุงสดใหม่ส่งถึงบ้าน 2 รอบ (เช้า-เย็น) เพื่อรักษาความสดของมื้ออาหาร' },
            { title: 'วัตถุดิบออร์แกนิก', detail: 'ผักและเนื้อสัตว์ส่งตรงจากฟาร์มออร์แกนิกที่ได้รับมาตรฐาน ไร้สารเคมีตกค้าง 100%' },
            { title: 'ส่งฟรีถึงบ้าน', detail: 'ไม่มีค่าบริการจัดส่งเพิ่มเติมในเขตพื้นที่ครอบคลุม (กรุงเทพฯ และปริมณฑล)' },
            { title: 'ปรับเปลี่ยนเมนูได้', detail: 'สามารถระบุวัตถุดิบที่แพ้หรือไม่ชอบผ่านแอปพลิเคชันได้ก่อนวันจัดส่ง 24 ชม.' }
        ],
        color: '#22c55e'
    },
    'Diabetes Care Set': {
        name: 'Diabetes Care Set',
        price: 3200,
        duration: '30 วัน',
        description: 'ชุดอาหารและโปรแกรมดูแลผู้ป่วยเบาหวาน ควบคุมน้ำตาลและคาร์โบไฮเดรตอย่างเคร่งครัด',
        features: [
            { title: 'ดัชนีน้ำตาลต่ำ', detail: 'ทุกมื้ออาหารมีค่า GI ต่ำเป็นพิเศษ ช่วยให้ระดับน้ำตาลในเลือดคงที่ตลอดวัน' },
            { title: 'คู่มือติดตามค่าน้ำตาล', detail: 'สมุดบันทึกและระบบวิเคราะห์กราฟน้ำตาลในโทรศัพท์มือถือ ใช้งานง่าย' },
            { title: 'ผู้เชี่ยวชาญให้คำแนะนำ', detail: 'ทีมงานพร้อมตอบคำถามด้านการเลือกทานอาหารผ่านแชทตลอด 24 ชั่วโมง' },
            { title: 'ติดตามความดันโลหิต', detail: 'ระบบเชื่อมต่อกับเครื่องวัดระดับน้ำตาลและแจ้งเตือนเมื่อพบค่าผิดปกติ' }
        ],
        color: '#3b82f6'
    },
    'Kids Nutrition Plan': {
        name: 'Kids Nutrition Plan',
        price: 1800,
        duration: '30 วัน',
        description: 'โปรแกรมเสริมสร้างพัฒนาการเด็กด้วยสารอาหารที่ครบถ้วนและรสชาติที่ถูกใจเด็กๆ',
        features: [
            { title: 'เสริมสร้างการเติบโต', detail: 'เน้นสารอาหารประเภทแคลเซียมและโปรตีนเพื่อรองรับช่วงยืดตัวของเด็ก' },
            { title: 'สูตรอาหารสำหรับเด็ก', detail: 'เปลี่ยนผักที่ทานยากให้กลายเป็นเมนูที่เด็กๆ ชอบ เช่น พาสต้าซอสผักรวม' },
            { title: 'เน้นวิตามินที่จำเป็น', detail: 'เสริมวิตามินสกัดจากธรรมชาติในมื้ออาหารเพื่อสร้างภูมิคุ้มกัน' },
            { title: 'คู่มือการทานที่สนุกสนาน', detail: 'กล่องอาหารลายการ์ตูนและนิทานสั้นๆ เกี่ยวกับประโยชน์ของสารอาหาร' }
        ],
        color: '#f59e0b'
    },
    'Muscle Gain Pro': {
        name: 'Muscle Gain Pro',
        price: 3500,
        duration: '30 วัน',
        description: 'สำหรับผู้ที่ต้องการเสริมสร้างกล้ามเนื้อและรูปร่าง เน้นโปรตีนสูงและสารอาหารที่ช่วยซ่อมแซมร่างกาย',
        features: [
            { title: 'เน้นโปรตีนสูง', detail: 'สัดส่วนโปรตีนต่อน้ำหนักตัวที่เหมาะสม ช่วยในการสังเคราะห์กล้ามเนื้อ (Anabolism)' },
            { title: 'แผนฝึกความแข็งแรง', detail: 'โปรแกรมยกน้ำหนักรายสัปดาห์ที่ปรับเปลี่ยนตามเป้าหมาย (Bulking/Cutting)' },
            { title: 'ข้อมูลกรดอะมิโน', detail: 'การวิเคราะห์การดูดซึมสารอาหารและความต้องการโปรตีนเฉพาะบุคคล' },
            { title: 'เน้นการฟื้นฟูกล้ามเนื้อ', detail: 'สูตรอาหารและอาหารเสริมแนะนำในช่วง Post-Workout เพื่อลดการล้า' }
        ],
        color: '#f43f5e'
    }
};

// ─── Components ──────────────────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: Status }) => {
    const c = statusConfig[status];
    return (
        <span
            style={{ backgroundColor: c.bg, color: c.text, border: `1px solid ${c.border}` }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
        >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.dot }} />
            {c.label}
        </span>
    );
};

const Toast = ({ message }: { message: string | null }) => (
    <div
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-8 py-4 rounded-2xl shadow-2xl text-sm font-bold transition-all duration-500 ${message ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}
        style={{ backgroundColor: theme.text, color: '#fff' }}
    >
        <span>✨</span> {message}
    </div>
);

const SummaryCard = ({ label, count, icon, progress, color }: any) => (
    <div
        className="bg-white p-6 rounded-[32px] border flex flex-col gap-4 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1"
        style={{ borderColor: theme.border }}
    >
        <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner" style={{ backgroundColor: color + '15', color }}>
                {icon}
            </div>
            <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] mb-1" style={{ color: theme.textLight }}>{label}</p>
                <p className="text-3xl font-extrabold" style={{ color: theme.text }}>{count}</p>
            </div>
        </div>
        <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold" style={{ color: theme.textMuted }}>
                <span>ความคืบหน้า</span>
                <span>{progress}%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${progress}%`, backgroundColor: color }}
                />
            </div>
        </div>
    </div>
);

const PackageDetailModal = ({ isOpen, onClose, pkg }: { isOpen: boolean; onClose: () => void; pkg: PackageInfo | null }) => {
    const [selectedFeature, setSelectedFeature] = useState<{ title: string, detail: string } | null>(null);
    if (!isOpen || !pkg) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-[110] p-6 transition-all duration-300" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up border border-gray-100 relative">
                <div className="relative h-48 flex items-center justify-center px-10 overflow-hidden" style={{ backgroundColor: pkg.color }}>
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20px 20px, white 2px, transparent 0)', backgroundSize: '40px 40px' }} />
                    <div className="relative z-10 text-center text-white">
                        <span className="text-sm font-bold uppercase tracking-widest opacity-80">รายละเอียดแพ็กเกจ</span>
                        <h2 className="text-3xl font-extrabold mt-2 leading-tight">{pkg.name}</h2>
                    </div>
                    <button onClick={onClose} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors">✕</button>
                </div>

                <div className="p-10 space-y-8">
                    <div className="flex justify-between items-end">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ราคา / ระยะเวลา</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-extrabold text-gray-900">฿{pkg.price.toLocaleString()}</span>
                                <span className="text-sm font-bold text-gray-400">/ {pkg.duration}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">คำอธิบาย</p>
                        <p className="text-gray-600 leading-relaxed font-medium">{pkg.description}</p>
                    </div>

                    <div className="space-y-4">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">คุณสมบัติเด่น (คลิกดูรายละเอียด)</p>
                        <div className="grid grid-cols-2 gap-3">
                            {pkg.features.map((f, i) => (
                                <div
                                    key={i}
                                    onClick={() => setSelectedFeature(f)}
                                    className="flex items-center gap-2 p-3 rounded-2xl bg-gray-50 border border-gray-100 cursor-pointer hover:bg-white hover:shadow-lg hover:scale-105 active:scale-95 transition-all group"
                                >
                                    <span className="text-xs group-hover:scale-125 transition-transform">✅</span>
                                    <span className="text-xs font-bold text-gray-700">{f.title}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full py-4 rounded-2xl text-white font-black text-sm shadow-xl active:scale-95 transition-all"
                        style={{ backgroundColor: pkg.color }}
                    >
                        ตกลง
                    </button>
                </div>

                {selectedFeature && (
                    <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-10 animate-fade-in text-center">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-6" style={{ backgroundColor: pkg.color + '15', color: pkg.color }}>✨</div>
                        <h3 className="text-2xl font-black mb-4" style={{ color: pkg.color }}>{selectedFeature.title}</h3>
                        <p className="text-gray-600 font-medium leading-relaxed mb-8">{selectedFeature.detail}</p>
                        <button
                            onClick={() => setSelectedFeature(null)}
                            className="px-8 py-3 rounded-2xl bg-gray-900 text-white font-bold text-sm hover:scale-105 active:scale-95 transition-all"
                        >
                            ปิดรายละเอียด
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default function MonitoringPage() {
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | Status>('all');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPkg, setSelectedPkg] = useState<PackageInfo | null>(null);
    const [isPkgModalOpen, setIsPkgModalOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const counts = useMemo(() => ({
        all: orders.length,
        pending: orders.filter(o => o.status === 'Pending').length,
        completed: orders.filter(o => o.status === 'Completed').length,
        canceled: orders.filter(o => o.status === 'Canceled').length,
    }), [orders]);

    const filteredOrders = useMemo(() => orders.filter(o => {
        const matchSearch = o.user.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === 'all' || o.status === filterStatus;
        return matchSearch && matchStatus;
    }), [orders, search, filterStatus]);

    const handleUpdateStatus = (id: string, newStatus: Status) => {
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
        setIsModalOpen(false);
        showToast(`อัปเดตออเดอร์ ${id} สำเร็จแล้ว`);
    };

    const handleOpenModal = (order: Order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleOpenPkgModal = (pkgName: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        const pkg = packageDetails[pkgName];
        if (pkg) {
            setSelectedPkg(pkg);
            setIsPkgModalOpen(true);
        }
    };

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: theme.bg, fontFamily: 'Inter, system-ui, sans-serif' }}>
            <Toast message={toastMessage} />

            {/* ── Header ────────────────────────────────────────────────────────── */}
            <header className="sticky top-0 z-40 border-b px-6 bg-white/80 backdrop-blur-xl" style={{ borderColor: theme.border }}>
                <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-inner" style={{ backgroundColor: theme.goldLight }}>📦</div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] leading-none" style={{ color: theme.gold }}>Wellmate ผู้ดูแลระบบ</p>
                            <h2 className="text-lg font-bold tracking-tight" style={{ color: theme.text }}>ระบบจัดการออเดอร์</h2>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-6 text-xs font-bold" style={{ color: theme.textMuted }}>
                        <div className="flex flex-col items-end">
                            <span className="text-[9px] uppercase tracking-widest opacity-50">รอตรวจสอบ</span>
                            <span className="text-amber-600 font-bold text-sm">{counts.pending}</span>
                        </div>
                        <div className="w-px h-6 bg-gray-200" />
                        <div className="flex flex-col items-end">
                            <span className="text-[9px] uppercase tracking-widest opacity-50">รายได้ทั้งหมด</span>
                            <span className="font-bold text-sm" style={{ color: theme.text }}>฿{orders.reduce((acc, o) => o.status === 'Completed' ? acc + o.price : acc, 0).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* ── Main ──────────────────────────────────────────────────────────── */}
            <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 flex flex-col gap-10">

                {/* KPI Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <SummaryCard label="ทั้งหมด" count={counts.all} icon="📊" progress={100} color={theme.gold} />
                    <SummaryCard label="รอตรวจสอบ" count={counts.pending} icon="⏳" progress={Math.round((counts.pending / counts.all) * 100) || 0} color="#f59e0b" />
                    <SummaryCard label="เสร็จสิ้น" count={counts.completed} icon="✅" progress={Math.round((counts.completed / counts.all) * 100) || 0} color="#22c55e" />
                    <SummaryCard label="ยกเลิกแล้ว" count={counts.canceled} icon="✕" progress={Math.round((counts.canceled / counts.all) * 100) || 0} color="#f43f5e" />
                </div>

                {/* Dashboard Controls */}
                <div className="bg-white p-8 rounded-[40px] border shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6" style={{ borderColor: theme.border }}>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: theme.text }}>
                            รายการออเดอร์
                        </h1>
                        <p className="text-sm font-medium" style={{ color: theme.textLight }}>
                            พบคิวการชำระเงินทั้งหมด {filteredOrders.length} รายการ
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg pointer-events-none opacity-40">🔍</span>
                            <input
                                type="text"
                                placeholder="ค้นหาด้วยรหัสหรือชื่อลูกค้า..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-12 pr-6 py-3.5 rounded-2xl text-sm font-bold border outline-none min-w-[320px] transition-all focus:border-gold focus:ring-4 focus:ring-gold/10"
                                style={{
                                    backgroundColor: theme.bg,
                                    borderColor: theme.border,
                                    color: theme.text
                                }}
                            />
                        </div>
                        <div className="flex items-center gap-2 p-1.5 bg-gray-50 rounded-2xl border" style={{ borderColor: theme.border }}>
                            {(['all', 'Pending', 'Completed', 'Canceled'] as const).map(s => (
                                <button
                                    key={s}
                                    onClick={() => setFilterStatus(s)}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${filterStatus === s ? 'bg-white shadow-sm ring-1 ring-black/5' : 'text-gray-400 hover:text-gray-600 hover:bg-white/50'}`}
                                    style={{ color: filterStatus === s ? (s === 'all' ? theme.gold : statusConfig[s as Status].text) : undefined }}
                                >
                                    {s === 'all' ? 'ทั้งหมด' : statusConfig[s as Status].label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-[40px] border shadow-sm overflow-hidden" style={{ borderColor: theme.border }}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b" style={{ borderColor: theme.border, backgroundColor: '#faf9f6' }}>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest" style={{ color: theme.textLight }}>Order ID</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest" style={{ color: theme.textLight }}>ลูกค้า</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest" style={{ color: theme.textLight }}>แพ็กเกจ</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest" style={{ color: theme.textLight }}>ยอดชำระ</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest" style={{ color: theme.textLight }}>สถานะ</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-center" style={{ color: theme.textLight }}>จัดการ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-24 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <span className="text-6xl">🔍</span>
                                                <p className="text-lg font-bold" style={{ color: theme.textLight }}>ไม่พบข้อมูลออเดอร์</p>
                                                <button onClick={() => { setSearch(''); setFilterStatus('all') }} className="text-sm font-black underline" style={{ color: theme.gold }}>ล้างตัวกรองทั้งหมด</button>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map((order) => (
                                        <tr
                                            key={order.id}
                                            className="group hover:bg-gray-50/50 transition-colors cursor-pointer"
                                            onClick={() => handleOpenModal(order)}
                                        >
                                            <td className="px-8 py-6">
                                                <span className="text-xs font-bold px-2 py-1 rounded bg-gray-100 text-gray-500">{order.id}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-sm font-bold" style={{ color: theme.text }}>{order.user}</p>
                                                <p className="text-[10px] font-bold" style={{ color: theme.textLight }}>{order.date}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <button
                                                    onClick={(e) => handleOpenPkgModal(order.package, e)}
                                                    className="text-xs font-bold text-gold hover:underline flex items-center gap-1 group/pkg"
                                                >
                                                    {order.package}
                                                    <span className="opacity-0 group-hover/pkg:opacity-100 transition-opacity">ⓘ</span>
                                                </button>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-sm font-bold" style={{ color: theme.text }}>฿{order.price.toLocaleString()}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <StatusBadge status={order.status} />
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <button className="w-10 h-10 rounded-2xl flex items-center justify-center bg-gray-50 border border-transparent group-hover:bg-white group-hover:border-gray-200 group-hover:shadow-lg transition-all mx-auto">
                                                    <span className="text-xs group-hover:scale-125 transition-transform">👁️</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Table Footer */}
                    <div className="px-8 py-4 bg-gray-50/50 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest" style={{ color: theme.textLight }}>
                        <p>แสดง {filteredOrders.length} จาก {orders.length} รายการ</p>
                        <div className="flex gap-4">
                            <button className="opacity-40 hover:opacity-100 transition-opacity">ก่อนหน้า</button>
                            <button className="opacity-40 hover:opacity-100 transition-opacity">ถัดไป</button>
                        </div>
                    </div>
                </div>
            </main>

            <OrderDetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                order={selectedOrder}
                onConfirm={(id) => handleUpdateStatus(id, 'Completed')}
                onReject={(id) => handleUpdateStatus(id, 'Canceled')}
                onViewPackage={(name) => handleOpenPkgModal(name)}
            />

            <PackageDetailModal
                isOpen={isPkgModalOpen}
                onClose={() => setIsPkgModalOpen(false)}
                pkg={selectedPkg}
            />
        </div>
    );
}
