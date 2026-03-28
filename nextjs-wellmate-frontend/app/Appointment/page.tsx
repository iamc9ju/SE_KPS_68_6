'use client';

import React, { useState, useMemo } from 'react';
import CalendarModal from '@/components/dashboard/CalendarModal';
import AppointmentDetailModal from '@/components/dashboard/AppointmentDetailModal';

// ─── Types & Logic ────────────────────────────────────────────────────────────
type Status = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
type AppType = 'Consult' | 'Follow-up' | 'Analysis';

interface Appointment {
    appointment_id: string;
    user_name: string;
    nutritionist: string;
    datetime: string;
    type: AppType;
    status: Status;
    notes: string;
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

// ─── Configuration ────────────────────────────────────────────────────────────
const statusConfig: Record<Status, { bg: string; text: string; border: string; dot: string; label: string }> = {
    Pending: { bg: '#fffbeb', text: '#92400e', border: '#fde68a', dot: '#f59e0b', label: 'รอตรวจสอบ' },
    Confirmed: { bg: '#eff6ff', text: '#1e40af', border: '#bfdbfe', dot: '#3b82f6', label: 'ยืนยันแล้ว' },
    Completed: { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0', dot: '#22c55e', label: 'เสร็จสิ้น' },
    Cancelled: { bg: '#fff1f2', text: '#9f1239', border: '#fecdd3', dot: '#f43f5e', label: 'ยกเลิกแล้ว' },
};

const typeConfig: Record<AppType, { bg: string; text: string; label: string }> = {
    'Consult': { bg: '#faf5ff', text: '#7c3aed', label: 'ปรึกษาโภชนาการ' },
    'Follow-up': { bg: '#f0fdfa', text: '#0d9488', label: 'ติดตามผล' },
    'Analysis': { bg: '#fff7ed', text: '#ea580c', label: 'วิเคราะห์ร่างกาย' },
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const initialAppointments: Appointment[] = [
    { appointment_id: 'APM-001', user_name: 'คุณสมชาย', nutritionist: 'Nutri A', datetime: '2026-03-21T10:00', type: 'Consult', status: 'Pending', notes: 'ลดน้ำหนัก 5 kg' },
    { appointment_id: 'APM-002', user_name: 'คุณสมหญิง', nutritionist: 'Nutri B', datetime: '2026-03-21T13:00', type: 'Follow-up', status: 'Confirmed', notes: 'ติดตามผลค่าเลือด' },
    { appointment_id: 'APM-003', user_name: 'คุณไมค์', nutritionist: 'Nutri A', datetime: '2026-03-21T15:00', type: 'Analysis', status: 'Completed', notes: 'วิเคราะห์มวลกล้ามเนื้อ' },
    { appointment_id: 'APM-004', user_name: 'คุณซาร่า', nutritionist: 'Nutri C', datetime: '2026-03-21T09:00', type: 'Consult', status: 'Cancelled', notes: 'ลูกค้าติดธุระด่วน' },
    { appointment_id: 'APM-005', user_name: 'คุณต้อม', nutritionist: 'Nutri B', datetime: '2026-03-21T16:30', type: 'Consult', status: 'Pending', notes: 'ปรึกษาโภชนาการกีฬา' },
    { appointment_id: 'APM-006', user_name: 'คุณแอน', nutritionist: 'Nutri A', datetime: '2026-03-21T18:00', type: 'Follow-up', status: 'Confirmed', notes: 'ติดตามผลรายสัปดาห์' },
    { appointment_id: 'APM-007', user_name: 'คุณบี', nutritionist: 'Nutri A', datetime: '2026-01-15T10:00', type: 'Consult', status: 'Completed', notes: 'เริ่มโปรแกรมเดือนแรก' },
    { appointment_id: 'APM-008', user_name: 'คุณเจ', nutritionist: 'Nutri B', datetime: '2026-02-14T14:00', type: 'Follow-up', status: 'Completed', notes: 'ตรวจสุขภาพหัวใจ' },
    { appointment_id: 'APM-009', user_name: 'คุณฟ้า', nutritionist: 'Nutri C', datetime: '2026-04-10T11:00', type: 'Analysis', status: 'Confirmed', notes: 'เตรียมตัวก่อนแข่ง' },
    { appointment_id: 'APM-010', user_name: 'คุณนัท', nutritionist: 'Nutri A', datetime: '2026-05-20T09:00', type: 'Consult', status: 'Confirmed', notes: 'วางแผนมื้ออาหารใหม่' },
    { appointment_id: 'APM-011', user_name: 'คุณกอล์ฟ', nutritionist: 'Nutri B', datetime: '2026-06-25T15:30', type: 'Follow-up', status: 'Pending', notes: 'ติดตามผลหลัง 1 เดือน' },
    { appointment_id: 'APM-012', user_name: 'คุณนก', nutritionist: 'Nutri C', datetime: '2026-12-24T13:00', type: 'Consult', status: 'Pending', notes: 'บิ๊กเซอร์ไพรส์คริสต์มาส' },
];

// ─── Components ──────────────────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: Status }) => {
    const c = statusConfig[status];
    return (
        <span 
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider"
            style={{ backgroundColor: c.bg, color: c.text, borderColor: c.border }}
        >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.dot }} />
            {c.label}
        </span>
    );
};

const TypeBadge = ({ type }: { type: AppType }) => {
    const c = typeConfig[type];
    return (
        <span 
            className="px-2.5 py-1 rounded-lg text-[10px] font-bold border"
            style={{ backgroundColor: c.bg, color: c.text, borderColor: 'transparent' }}
        >
            {c.label}
        </span>
    );
};

const SummaryCard = ({ label, count, icon, color, subtext }: any) => (
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
        <div>
            <p className="text-[10px] font-bold bg-gray-50 px-3 py-1.5 rounded-full inline-block" style={{ color: theme.textMuted }}>{subtext}</p>
        </div>
    </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AppointmentMonitoring() {
    const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterType, setFilterType] = useState<string>('all');
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [visibleCount, setVisibleCount] = useState(5);

    const handleSaveAppointment = (updated: Appointment) => {
        setAppointments(prev => prev.map(a => a.appointment_id === updated.appointment_id ? updated : a));
    };

    // 📄 Export Logic (CSV)
    const handleExport = () => {
        const headers = ['ID', 'Customer', 'Nutritionist', 'Date/Time', 'Type', 'Status', 'Notes'];
        const rows = filtered.map(a => [
            a.appointment_id,
            a.user_name,
            a.nutritionist,
            new Date(a.datetime).toLocaleString('th-TH'),
            typeConfig[a.type].label,
            statusConfig[a.status].label,
            a.notes
        ]);
        
        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `wellmate_appointments_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // 📊 Stats Calculation
    const stats = useMemo(() => {
        const total = appointments.length;
        const pending = appointments.filter(a => a.status === 'Pending').length;
        const confirmed = appointments.filter(a => a.status === 'Confirmed').length;
        const cancelled = appointments.filter(a => a.status === 'Cancelled').length;
        const completed = appointments.filter(a => a.status === 'Completed').length;
        const valid = total - cancelled;
        const rate = valid > 0 ? Math.round((completed / valid) * 100) : 0;
        
        return { total, pending, confirmed, cancelled, rate };
    }, [appointments]);

    // 🔍 Filtering Logic
    const filtered = useMemo(() => {
        return appointments.filter(a => {
            const matchSearch = a.user_name.toLowerCase().includes(search.toLowerCase()) || 
                              a.appointment_id.toLowerCase().includes(search.toLowerCase());
            const matchStatus = filterStatus === 'all' || a.status === filterStatus;
            const matchType = filterType === 'all' || a.type === filterType;
            return matchSearch && matchStatus && matchType;
        });
    }, [appointments, search, filterStatus, filterType]);

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: theme.bg, fontFamily: 'Inter, system-ui, sans-serif' }}>
            
            {/* ── Header ────────────────────────────────────────────────────────── */}
            <header className="sticky top-0 z-40 border-b px-6 bg-white/80 backdrop-blur-xl" style={{ borderColor: theme.border }}>
                <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-inner" style={{ backgroundColor: theme.goldLight }}>📅</div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] leading-none" style={{ color: theme.gold }}>Wellmate ผู้ดูแลระบบ</p>
                            <h2 className="text-lg font-bold tracking-tight" style={{ color: theme.text }}>จัดการการนัดหมาย</h2>
                        </div>
                    </div>

                    <div className="hidden md:flex gap-4">
                        <button 
                            onClick={() => setIsCalendarOpen(true)}
                            className="px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all hover:bg-gray-50 active:scale-95" 
                            style={{ borderColor: theme.border, color: theme.textMuted }}
                        >
                            ปฏิทินการนัด
                        </button>
                        <button 
                            onClick={handleExport}
                            className="px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-gold/10 active:scale-95" 
                            style={{ backgroundColor: theme.gold, color: '#fff' }}
                        >
                            ส่งออกข้อมูล
                        </button>
                    </div>
                </div>
            </header>

            {/* ── Main Content ──────────────────────────────────────────────────── */}
            <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 flex flex-col gap-10">
                
                {/* KPI Section */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
                    <SummaryCard label="รวมทั้งหมด" count={stats.total} icon="📅" color={theme.text} subtext="นัดหมายวันนี้" />
                    <SummaryCard label="รอตรวจสอบ" count={stats.pending} icon="⏳" color="#f59e0b" subtext="รอพิจารณา" />
                    <SummaryCard label="ยืนยันแล้ว" count={stats.confirmed} icon="✅" color="#3b82f6" subtext="ยืนยันการนัด" />
                    <SummaryCard label="ยกเลิกแล้ว" count={stats.cancelled} icon="✕" color="#f43f5e" subtext="ยกเลิกออเดอร์" />
                    <SummaryCard label="สำเร็จ" count={stats.rate + '%'} icon="📊" color="#10b981" subtext="อัตราการสำเร็จ" />
                </div>

                {/* Search & Filter Bar */}
                <div className="bg-white p-6 rounded-[32px] border shadow-sm flex flex-col md:flex-row items-center gap-4" style={{ borderColor: theme.border }}>
                    <div className="relative flex-1 w-full">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm opacity-30">🔍</span>
                        <input 
                            type="text" 
                            placeholder="ค้นหาชื่อลูกค้า หรือรหัสการนัดหมาย..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm border focus:outline-none focus:ring-2 transition-all outline-none"
                            style={{ borderColor: theme.border, color: theme.text }}
                        />
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-40">
                            <select 
                                value={filterStatus}
                                onChange={(e) => { setFilterStatus(e.target.value); setVisibleCount(5); }}
                                className="w-full px-4 py-3 rounded-2xl text-xs font-bold border appearance-none outline-none cursor-pointer bg-gray-50/50 hover:bg-gray-100 transition-colors pr-10"
                                style={{ borderColor: theme.border, color: theme.text }}
                            >
                                <option value="all">สถานะทั้งหมด</option>
                                <option value="Pending">รอตรวจสอบ</option>
                                <option value="Confirmed">ยืนยันแล้ว</option>
                                <option value="Completed">เสร็จสิ้น</option>
                                <option value="Cancelled">ยกเลิกแล้ว</option>
                            </select>
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[10px] opacity-30">▼</span>
                        </div>
                        <div className="relative flex-1 md:w-40">
                            <select 
                                value={filterType}
                                onChange={(e) => { setFilterType(e.target.value); setVisibleCount(5); }}
                                className="w-full px-4 py-3 rounded-2xl text-xs font-bold border appearance-none outline-none cursor-pointer bg-gray-50/50 hover:bg-gray-100 transition-colors pr-10"
                                style={{ borderColor: theme.border, color: theme.text }}
                            >
                                <option value="all">ประเภททั้งหมด</option>
                                <option value="Consult">ปรึกษาโภชนาการ</option>
                                <option value="Follow-up">ติดตามผล</option>
                                <option value="Analysis">วิเคราะห์ร่างกาย</option>
                            </select>
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[10px] opacity-30">▼</span>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-[40px] border shadow-sm overflow-hidden" style={{ borderColor: theme.border }}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b" style={{ borderColor: theme.border, backgroundColor: '#faf9f6' }}>
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">ID นัดหมาย</th>
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">ลูกค้า</th>
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">นักโภชนาการ</th>
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">วัน/เวลา</th>
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">ประเภท</th>
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">สถานะ</th>
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-center text-gray-400">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y" style={{ borderColor: theme.border }}>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <span className="text-4xl">🔍</span>
                                                <p className="text-sm font-bold text-gray-300">ไม่พบรายการนัดหมายที่คุณค้นหา</p>
                                                <button onClick={() => { setSearch(''); setFilterStatus('all'); setFilterType('all'); }} className="text-xs font-bold underline text-gold">ล้างการค้นหา</button>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.slice(0, visibleCount).map((item) => (
                                        <tr key={item.appointment_id} className="group hover:bg-gray-50/50 transition-colors cursor-pointer">
                                            <td className="px-8 py-6">
                                                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-gray-100 text-gray-500">{item.appointment_id}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-sm font-bold" style={{ color: theme.text }}>{item.user_name}</p>
                                                <p className="text-[10px] font-bold text-gray-400">ลูกค้า Wellmate</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-sm font-bold" style={{ color: theme.text }}>{item.nutritionist}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-sm font-bold" style={{ color: theme.text }}>
                                                    {new Date(item.datetime).toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' })} น.
                                                </p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <TypeBadge type={item.type} />
                                            </td>
                                            <td className="px-8 py-6">
                                                <StatusBadge status={item.status} />
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <div className="flex justify-center gap-2 transition-opacity">
                                                    <button 
                                                        onClick={() => setSelectedAppointment(item)}
                                                        className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white border border-gray-200 shadow-sm hover:border-gold hover:text-gold transition-all"
                                                    >👁️</button>
                                                    <button 
                                                        onClick={() => setSelectedAppointment(item)}
                                                        className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white border border-gray-200 shadow-sm hover:border-gold hover:text-gold transition-all"
                                                    >⚙️</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Footer */}
                    <div className="px-8 py-5 bg-gray-50/50 flex flex-col items-center gap-4">
                        {filtered.length > visibleCount && (
                            <button 
                                onClick={() => setVisibleCount(prev => prev + 5)}
                                className="px-8 py-2.5 rounded-full bg-white border border-gray-200 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:border-gold hover:text-gold transition-all shadow-sm active:scale-95"
                            >
                                ดูเพิ่มเติม...
                            </button>
                        )}
                        <div className="w-full flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gray-400">
                            <p>แสดง {Math.min(visibleCount, filtered.length)} จาก {filtered.length} รายการนัดหมาย</p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Appointment Detail Modal */}
            <AppointmentDetailModal 
                isOpen={!!selectedAppointment} 
                onClose={() => setSelectedAppointment(null)} 
                appointment={selectedAppointment} 
                onSave={handleSaveAppointment}
            />

            {/* Calendar Modal */}
            <CalendarModal 
                isOpen={isCalendarOpen} 
                onClose={() => setIsCalendarOpen(false)} 
                appointments={appointments} 
            />
        </div>
    );
}
