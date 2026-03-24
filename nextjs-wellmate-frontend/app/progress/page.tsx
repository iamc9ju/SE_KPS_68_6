"use client";

import React, { useState, useRef, useCallback } from 'react';
import {
    LayoutDashboard,
    HeartPulse,
    Calendar,
    MessageSquare,
    Salad,
    Utensils,
    BookOpen,
    TrendingUp,
    LogOut,
    Bell,
    Search,
    ChevronDown,
    MoreVertical,
    Activity,
    Flame,
    Target,
    Zap,
    TrendingDown,
    BrainCircuit,
    CheckCircle2,
    AlertCircle,
    Plus,
    Camera,
    X,
    Check,
    Droplet,
    GlassWater,
    Menu
} from 'lucide-react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine
} from 'recharts';

import Link from 'next/link';

// ─── Static Data ────────────────────────────────────────────────────────────
const weightData = [
    { date: '01 Mar', weight: 74.5, trend: 74.6 },
    { date: '04 Mar', weight: 74.2, trend: 74.4 },
    { date: '08 Mar', weight: 73.8, trend: 74.1 },
    { date: '12 Mar', weight: 73.5, trend: 73.8 },
    { date: '16 Mar', weight: 74.0, trend: 73.6 },
    { date: '18 Mar', weight: 73.2, trend: 73.3 },
    { date: '21 Mar', weight: 72.8, trend: 72.9 },
    { date: '25 Mar', weight: 72.0, trend: 72.5 },
];

const caloriesData = [
    { day: 'Mon', intake: 1600, burn: 2200 },
    { day: 'Tue', intake: 1550, burn: 2150 },
    { day: 'Wed', intake: 1700, burn: 2400 },
    { day: 'Thu', intake: 1450, burn: 2100 },
    { day: 'Fri', intake: 1950, burn: 2300 },
    { day: 'Sat', intake: 1500, burn: 2000 },
    { day: 'Sun', intake: 1650, burn: 2150 },
];

const ACTIVITY_LEVELS = [
    'นั่งทำงานเป็นหลัก (ไม่ออกกำลังกาย)',
    'Light (1-3 วัน/week)',
    'ปานกลาง (3 - 5 วัน/สัปดาห์)',
    'Active (6-7 วัน/week)',
    'ออกกำลังกายหนัก (ทุกวัน)',
];
const HEIGHT_OPTIONS = ['155 cm', '160 cm', '165 cm', '170 cm', '175 cm', '180 cm', '185 cm', '190 cm'];
const WEIGHT_OPTIONS = ['50.0 kg', '55.0 kg', '60.0 kg', '63.0 kg', '65.0 kg', '70.0 kg', '72.0 kg', '75.0 kg', '80.0 kg', '85.0 kg'];
const CHEST_OPTIONS = Array.from({ length: 20 }, (_, i) => `${(85 + i * 0.5).toFixed(1)} cm`);
const ARM_OPTIONS = Array.from({ length: 20 }, (_, i) => `${(25 + i * 0.5).toFixed(1)} cm`);
const WAIST_OPTIONS = Array.from({ length: 20 }, (_, i) => `${(70 + i * 0.5).toFixed(1)} cm`);
const HIPS_OPTIONS = Array.from({ length: 20 }, (_, i) => `${(90 + i * 0.5).toFixed(1)} cm`);
const THIGH_OPTIONS = Array.from({ length: 20 }, (_, i) => `${(55 + i * 0.5).toFixed(1)} cm`);
const BODYFAT_OPTIONS = ['10%', '12%', '14%', '16%', '18%', '20%', '22%', '24%', '26%', '28%', '30%'];
const CALORIES_OPTIONS = ['1500 kcal', '1800 kcal', '2000 kcal', '2200 kcal', '2500 kcal', '2800 kcal', '3000 kcal'];
const WATER_OPTIONS = ['1000 ml', '1500 ml', '2000 ml', '2500 ml', '3000 ml', '3500 ml'];

// ─── Components ─────────────────────────────────────────────────────────────
function NavItem({ icon, label, active = false, href, onClick }: { icon: React.ReactNode, label: string, active?: boolean, href?: string, onClick?: () => void }) {
    const content = (
        <div onClick={onClick} className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors ${active ? 'bg-[#c1eb7c] font-medium text-zinc-800 shadow-sm' : 'text-zinc-500 hover:bg-zinc-50'}`}>
            {icon}
            <span>{label}</span>
        </div>
    );
    return href ? <Link href={href} className="block">{content}</Link> : content;
}

// SelectDropdown Component
interface ComboInputProps {
    label: string;
    value: string;
    options: string[];
    onChange: (v: string) => void;
    placeholder?: string;
}

function SelectDropdown({ label, value, options, onChange, placeholder }: ComboInputProps) {
    const [open, setOpen] = useState(false);
    const [inputVal, setInputVal] = useState(value);
    const [isTyping, setIsTyping] = useState(false);
    const [dropStyle, setDropStyle] = useState<React.CSSProperties>({});
    const containerRef = useRef<HTMLDivElement>(null);

    React.useEffect(() => { setInputVal(value); }, [value]);

    const filtered = isTyping
        ? options.filter((o) => o.toLowerCase().includes(inputVal.toLowerCase()))
        : options;

    const openDropdown = () => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setDropStyle({
                position: 'fixed',
                top: rect.bottom + 4,
                left: rect.left,
                width: rect.width,
                zIndex: 9999,
            });
        }
        setIsTyping(false);
        setOpen(true);
    };

    const handleBlur = () => {
        setTimeout(() => {
            if (!containerRef.current?.contains(document.activeElement)) {
                setOpen(false);
                setIsTyping(false);
                if (inputVal.trim()) onChange(inputVal.trim());
            }
        }, 150);
    };

    const dropdownEl = open && filtered.length > 0 ? (
        <div style={dropStyle} className="bg-white rounded-xl shadow-2xl border border-zinc-100 max-h-44 overflow-y-auto">
            {filtered.map((opt) => (
                <div
                    key={opt}
                    className={`px-4 py-2 text-sm cursor-pointer transition-colors ${opt === value ? 'bg-[#BCE875]/40 font-semibold text-zinc-800' : 'text-zinc-700 hover:bg-zinc-50'}`}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        onChange(opt);
                        setInputVal(opt);
                        setOpen(false);
                    }}
                >
                    {opt}
                </div>
            ))}
        </div>
    ) : null;

    return (
        <div className="relative" ref={containerRef}>
            {label && <label className="block text-xs text-zinc-500 mb-1 font-medium">{label}</label>}
            <div className="w-full flex items-center bg-[#F5EBE1] border border-zinc-200 rounded-xl px-4 py-2.5 gap-2 focus-within:ring-2 focus-within:ring-[#BCE875] hover:border-zinc-300 transition-colors">
                <input
                    type="text"
                    value={inputVal}
                    placeholder={placeholder}
                    onChange={(e) => { setInputVal(e.target.value); setIsTyping(true); if (!open) openDropdown(); }}
                    onFocus={openDropdown}
                    onBlur={handleBlur}
                    className="flex-1 bg-transparent outline-none text-sm text-zinc-800 font-medium placeholder:text-zinc-400 min-w-0"
                />
                <button type="button" tabIndex={-1} onMouseDown={(e) => { e.preventDefault(); if (open) setOpen(false); else openDropdown(); }} className="text-zinc-400 hover:text-zinc-600 flex-shrink-0">
                    <ChevronDown size={14} />
                </button>
            </div>
            {typeof window !== 'undefined' && dropdownEl ? require('react-dom').createPortal(dropdownEl, document.body) : null}
        </div>
    );
}

// Update Progress Modal
interface FormDataParams {
    weight: string;
    height: string;
    chest: string;
    arm: string;
    waist: string;
    hips: string;
    thigh: string;
    bodyFat: string;
    calories: string;
    water: string;
    activityLevel: string;
    photoUrl: string | null;
}

function UpdateProgressModal({ onClose, onSave, defaultData }: { onClose: () => void, onSave: (d: FormDataParams) => void, defaultData?: any }) {
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

    const [form, setForm] = useState<FormDataParams>({
        weight: '72.0 kg',
        height: '170 cm',
        chest: defaultData?.chest ? `${defaultData.chest} cm` : '95.0 cm',
        arm: defaultData?.arm ? `${defaultData.arm} cm` : '30.0 cm',
        waist: defaultData?.waist ? `${defaultData.waist} cm` : '80.0 cm',
        hips: defaultData?.hipe ? `${defaultData.hipe} cm` : '100.0 cm',
        thigh: defaultData?.thigh ? `${defaultData.thigh} cm` : '66.0 cm',
        bodyFat: '18%',
        calories: '2500 kcal',
        water: '2000 ml',
        activityLevel: 'ปานกลาง (3 - 5 วัน/สัปดาห์)',
        photoUrl: null,
    });

    const [showActivityDropdown, setShowActivityDropdown] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [saved, setSaved] = useState(false);

    const set = (field: keyof FormDataParams) => (v: string) => setForm((f) => ({ ...f, [field]: v }));

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        setForm((f) => ({ ...f, photoUrl: url }));
    };

    const handleSave = () => {
        onSave(form);
        setSaved(true);
        setTimeout(() => { setSaved(false); onClose(); }, 800);
    };

    return (
        <div className="flex h-screen bg-white text-zinc-800 font-sans overflow-hidden">
            {/* Sidebar */}
            <div className="w-64 flex-shrink-0 border-r border-zinc-100 flex flex-col justify-between py-6 px-4 bg-white z-10 overflow-y-auto">
                <div>
                    <div className="flex items-center gap-2 px-2 mb-8">
                        <div className="text-[#8CC63F] font-bold text-2xl tracking-tighter italic">
                            W<span className="text-[#F7931E]">M</span>
                        </div>
                        <div className="font-bold text-xl tracking-tight uppercase">Wellmate</div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" />
                        <NavItem icon={<HeartPulse size={20} />} label="Nutrition Service" />
                        <NavItem icon={<Calendar size={20} />} label="Calendar" />
                        <NavItem icon={<MessageSquare size={20} />} label="Messages" />
                        <NavItem icon={<Salad size={20} />} label="Healthy Menu" />
                        <NavItem icon={<Utensils size={20} />} label="Meal Plan" />
                        <NavItem icon={<BookOpen size={20} />} label="Food Diary" />
                        <NavItem icon={<TrendingUp size={20} />} label="Progress" active={true} />
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-100 transition-colors text-zinc-400 hover:text-zinc-700 mt-1"><X size={18} /></button>
                </div>

                <div className="px-8 pb-8 flex flex-col gap-6">
                    <div>
                        <h3 className="text-base font-bold text-zinc-800 mb-4">สัดส่วนร่างกาย</h3>
                        <div className="flex gap-4">
                            <div className="flex-1 grid grid-cols-2 gap-3">
                                <SelectDropdown label="น้ำหนักปัจจุบัน (กก.)" value={form.weight} options={WEIGHT_OPTIONS} onChange={set('weight')} />
                                <SelectDropdown label="ส่วนสูง (ซม.)" value={form.height} options={HEIGHT_OPTIONS} onChange={set('height')} />
                                <SelectDropdown label="หน้าอก (ซม.)" value={form.chest} options={CHEST_OPTIONS} onChange={set('chest')} />
                                <SelectDropdown label="แขน (ซม.)" value={form.arm} options={ARM_OPTIONS} onChange={set('arm')} />
                                <SelectDropdown label="เอว (ซม.)" value={form.waist} options={WAIST_OPTIONS} onChange={set('waist')} />
                                <SelectDropdown label="สะโพก (ซม.)" value={form.hips} options={HIPS_OPTIONS} onChange={set('hips')} />
                                <SelectDropdown label="ต้นขา (ซม.)" value={form.thigh} options={THIGH_OPTIONS} onChange={set('thigh')} />
                                <SelectDropdown label="เปอร์เซ็นต์ไขมัน (%)" value={form.bodyFat} options={BODYFAT_OPTIONS} onChange={set('bodyFat')} />
                            </div>
                            <div className="w-[140px] flex-shrink-0">
                                <label className="block text-xs text-zinc-500 mb-1 font-medium invisible">Photo</label>
                                <div className="w-full h-full min-h-[200px] border-2 border-dashed border-zinc-300 rounded-2xl bg-zinc-50 flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-100 transition-colors relative overflow-hidden group" onClick={() => fileInputRef.current?.click()}>
                                    {form.photoUrl ? (
                                        <><img src={form.photoUrl} alt="ติดตามผล" className="absolute inset-0 w-full h-full object-cover" /><div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Camera size={24} className="text-white" /></div></>
                                    ) : (
                                        <><Camera size={28} className="text-zinc-400 mb-2" /><span className="text-xs text-zinc-500 text-center px-2 font-medium">Upload วันนี้ Photo</span></>
                                    )}
                                </div>
                                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-zinc-800 mb-3">กิจกรรมการเผาผลาญ (กิโลแคลอรี)</h3>
                        <SelectDropdown label="" value={form.calories} options={CALORIES_OPTIONS} onChange={set('calories')} />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-zinc-800 mb-3">ปริมาณดื่มน้ำ (มล.)</h3>
                        <SelectDropdown label="" value={form.water} options={WATER_OPTIONS} onChange={set('water')} />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-zinc-800 mb-1">พฤติกรรมประจำวัน</h3>
                        <p className="text-xs text-zinc-500 mb-3">ระดับกิจกรรม :</p>
                        <div className="relative">
                            <button type="button" onClick={() => setShowActivityDropdown(!showActivityDropdown)} className="w-full flex items-center justify-between bg-[#F5EBE1] border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-800 font-medium hover:border-zinc-300 transition-colors focus:outline-none focus:ring-2 focus:ring-[#BCE875]">
                                {form.activityLevel} <ChevronDown size={14} className="text-zinc-400 ml-2 flex-shrink-0" />
                            </button>
                            {showActivityDropdown && (
                                <div className="absolute top-full mt-1 left-0 right-0 bg-white rounded-xl shadow-xl border border-zinc-100 z-50">
                                    {ACTIVITY_LEVELS.map((opt) => (
                                        <div key={opt} className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${opt === form.activityLevel ? 'bg-[#BCE875]/40 font-semibold text-zinc-800' : 'text-zinc-700 hover:bg-zinc-50'}`} onClick={() => { set('activityLevel')(opt); setShowActivityDropdown(false); }}>
                                            {opt}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 py-3 rounded-2xl border border-zinc-200 text-zinc-600 font-semibold text-sm hover:bg-zinc-50 transition-colors">ยกเลิก</button>
                        <button type="button" onClick={handleSave} className={`flex-1 py-3 rounded-2xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${saved ? 'bg-green-500 text-white' : 'bg-[#BCE875] hover:bg-[#aade5e] text-zinc-800'}`}>
                            {saved ? <><Check size={16} /> บันทึกแล้ว!</> : 'บันทึกข้อมูล'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Advanced Stats Drawer ──────────────────────────────────────────────────
function AdvancedStatsDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    if (!isOpen) return null;

    // Internal sub-component for timeframe selection
    const TimeframeSelector = ({ selected, onChange, options }: { selected: string, onChange: (val: string) => void, options: string[] }) => {
        const [showDropdown, setShowDropdown] = useState(false);
        return (
            <div className="relative">
                <div
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="bg-[#cceb7c] px-3 py-1.5 rounded-lg text-[11px] font-bold text-[#558019] flex items-center gap-1 cursor-pointer hover:bg-[#bde068] transition-colors"
                >
                    {selected} <ChevronDown size={12} className={`transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
                </div>
                {showDropdown && (
                    <>
                        <div className="fixed inset-0 z-[120]" onClick={() => setShowDropdown(false)} />
                        <div className="absolute right-0 mt-2 w-36 bg-white border border-zinc-100 rounded-xl shadow-xl z-[130] py-1 animate-in fade-in zoom-in duration-200">
                            {options.map((opt) => (
                                <div
                                    key={opt}
                                    onClick={() => { onChange(opt); setShowDropdown(false); }}
                                    className={`px-4 py-2.5 text-[11px] font-bold cursor-pointer hover:bg-[#f3f9e4] transition-colors border-b last:border-0 border-zinc-50 ${selected === opt ? 'text-[#558019]' : 'text-zinc-500'}`}
                                >
                                    {opt}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        );
    };

    const CALORIES_CHART_DATA = [
        { day: 'Sun', kcal: 1800 },
        { day: 'Mon', kcal: 1500 },
        { day: 'Tue', kcal: 1600 },
        { day: 'Wed', kcal: 2200 },
        { day: 'Thu', kcal: 1400 },
    ];

    const [calTimeframe, setCalTimeframe] = useState('5 วันที่ผ่านมา');
    const [healthTimeframe, setHealthTimeframe] = useState('5 วันที่ผ่านมา');
    const [hydroTimeframe, setHydroTimeframe] = useState('สัปดาห์นี้');
    const [historyTimeframe, setHistoryTimeframe] = useState('ดูทั้งหมด');

    const timeframeOptions = ["วันนี้", "เมื่อวาน", "5 วันที่ผ่านมา", "7 วันที่ผ่านมา", "เดือนนี้"];
    const historyOptions = ["ดูทั้งหมด", "สัปดาห์นี้", "สัปดาห์ที่แล้ว", "เดือนนี้"];

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/20 z-[100] transition-opacity duration-300 opacity-100" onClick={onClose} />

            {/* Drawer */}
            <div className="fixed inset-y-0 right-0 w-full md:w-[460px] bg-[#FCFBF8] shadow-2xl z-[110] transform transition-transform duration-300 ease-in-out overflow-y-auto translate-x-0">
                {/* Header Profile */}
                <div className="flex items-center justify-between p-6 pb-4 border-b border-zinc-100 mb-6 bg-[#FCFBF8]">
                    <div className="flex items-center gap-4">
                        <button className="text-zinc-400 hover:text-zinc-600"><Search size={22} /></button>
                        <button className="text-zinc-400 hover:text-zinc-600 relative">
                            <Bell size={22} />
                            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#FCFBF8]"></span>
                        </button>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-zinc-200 rounded-full overflow-hidden">
                            <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="User" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="text-sm font-bold text-zinc-800 leading-tight">Thanapat Hongaram</span>
                            <span className="text-[11px] text-zinc-500 font-medium">Member</span>
                        </div>
                        <ChevronDown size={14} className="text-zinc-400 ml-1" />
                    </div>
                </div>

                {/* Content */}
                <div className="px-8 pb-10 flex flex-col gap-10">

                    {/* Calories Activities */}
                    <div className="pt-2">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-[18px] font-black text-zinc-800 tracking-tight">สถิติแคลอรีและกิจกรรม</h2>
                            <TimeframeSelector
                                selected={calTimeframe}
                                onChange={setCalTimeframe}
                                options={timeframeOptions}
                            />
                        </div>
                        <div className="mb-8">
                            <div className="flex items-baseline gap-1.5 mb-1">
                                <span className="text-4xl font-black text-zinc-800">450</span>
                                <span className="text-[13px] text-zinc-400 font-medium">kcal คงเหลือ</span>
                            </div>
                            <p className="text-[11px] text-zinc-400 font-medium tracking-wide">เป้าหมายแคลอรี 2500 kcal</p>
                        </div>
                        <div className="h-44 w-full mb-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={CALORIES_CHART_DATA} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#A1A1AA', fontWeight: 500 }} dy={15} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#A1A1AA', fontWeight: 500 }} tickCount={5} domain={[0, 2200]} />
                                    <Bar dataKey="kcal" fill="#F6D365" radius={[4, 4, 0, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Health Indicators */}
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-[18px] font-black text-zinc-800 tracking-tight">ตัวบ่งชี้สุขภาพ</h2>
                            <TimeframeSelector
                                selected={healthTimeframe}
                                onChange={setHealthTimeframe}
                                options={timeframeOptions}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-[#F6EFE9] rounded-3xl p-5 flex flex-col justify-between min-h-[110px]">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="text-[13px] font-bold text-zinc-700">BMI</span>
                                    <span className="bg-[#BCE875] text-[#4d7018] text-[10px] font-bold px-2 py-0.5 rounded-full">ปกติ</span>
                                </div>
                                <span className="text-3xl font-black text-zinc-800">22.5</span>
                            </div>
                            <div className="bg-[#F6EFE9] rounded-3xl p-5 flex flex-col justify-between min-h-[110px]">
                                <span className="text-[13px] font-bold text-zinc-700 mb-3">% Body Fat</span>
                                <span className="text-3xl font-black text-zinc-800">18%</span>
                            </div>
                            <div className="bg-[#F6EFE9] rounded-3xl p-5 flex flex-col justify-between min-h-[110px]">
                                <span className="text-[13px] font-bold text-zinc-700 mb-3">BMR</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-black text-zinc-800">1650</span>
                                    <span className="text-[11px] font-bold text-zinc-500">kcal</span>
                                </div>
                            </div>
                            <div className="bg-[#F6EFE9] rounded-3xl p-5 flex flex-col justify-between min-h-[110px]">
                                <span className="text-[13px] font-bold text-zinc-700 mb-3">TDEE</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-black text-zinc-800">2300</span>
                                    <span className="text-[11px] font-bold text-zinc-500">kcal</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hydration */}
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-[18px] font-black text-zinc-800 tracking-tight">การดื่มน้ำ</h2>
                            <TimeframeSelector
                                selected={hydroTimeframe}
                                onChange={setHydroTimeframe}
                                options={["สัปดาห์นี้", "สัปดาห์ที่แล้ว", "เดือนนี้"]}
                            />
                        </div>
                        <div className="flex gap-8 items-center mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-[#E5F5C1] flex items-center justify-center text-[#6CA920]">
                                    <Droplet size={24} fill="currentColor" strokeWidth={0} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[11px] font-medium text-zinc-500 mb-0.5">ระดับความชุ่มชื้น</span>
                                    <span className="text-[15px] font-black text-zinc-800">ปกติ</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-[#FFAEB4] flex items-center justify-center text-white">
                                    <Droplet size={24} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[11px] font-medium text-zinc-500 mb-0.5">ปริมาณที่ดื่ม</span>
                                    <span className="text-[15px] font-black text-zinc-800">2.0 L</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-end justify-between h-[40px] gap-2 pb-0 border-b border-zinc-200 mt-4">
                            {[10, 0, 30, 0, 40, 0, 70, 0, 50, 0, 20].map((val, i) => (
                                <div key={i} className="w-2.5 bg-zinc-100 rounded-t-lg h-full flex items-end">
                                    <div className={`w-full ${val ? 'bg-[#F2D766]' : 'bg-transparent'} rounded-t-lg`} style={{ height: `${val}%` }}></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Historical Results Summary */}
                    <div className="pb-10">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-[18px] font-black text-zinc-800 tracking-tight">ประวัติผลลัพธ์ย้อนหลัง</h2>
                            <TimeframeSelector
                                selected={historyTimeframe}
                                onChange={setHistoryTimeframe}
                                options={historyOptions}
                            />
                        </div>
                        <div className="space-y-3">
                            {[
                                { date: '15 มี.ค. 2026', weight: '72.5 kg', bmi: '22.8', status: 'ปกติ' },
                                { date: '08 มี.ค. 2026', weight: '73.2 kg', bmi: '23.0', status: 'ปกติ' },
                                { date: '01 มี.ค. 2026', weight: '74.0 kg', bmi: '23.4', status: 'เริ่มมีน้ำหนักเกิน' },
                            ].map((item, idx) => (
                                <div key={idx} className="bg-white border border-zinc-100 rounded-2xl p-4 flex justify-between items-center shadow-sm">
                                    <div className="flex flex-col">
                                        <span className="text-[11px] font-bold text-zinc-400 mb-0.5">{item.date}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-black text-zinc-800">{item.weight}</span>
                                            <span className="text-[11px] font-bold text-zinc-500">BMI {item.bmi}</span>
                                        </div>
                                    </div>
                                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${item.status === 'ปกติ' ? 'bg-[#EEF7F1] text-[#4d7018]' : 'bg-[#FFF5F5] text-[#E53E3E]'}`}>
                                        {item.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

// ─── Main Page ──────────────────────────────────────────────────────────────
export default function ProgressPage() {
    // Top states
    const [showSearch, setShowSearch] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    // UI Panels
    const [showModal, setShowModal] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);

    const [timeFilter, setTimeFilter] = useState('7 วัน');
    const [showTimeFilter, setShowTimeFilter] = useState(false);

    // Body Measurements
    const [measurements, setMeasurements] = useState([
        { id: 1, week: 'วันนี้', chest: '95.0', arm: '30.0', waist: '80.0', hipe: '100.0', thigh: '66.0' },
    ]);
    const [bodyTimeframe, setBodyTimeframe] = useState('วันนี้');
    const [showBodyDropdown, setShowBodyDropdown] = useState(false);

    // Photos
    const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);

    const handleMeasurementChange = (index: number, field: string, value: string) => {
        const updated = [...measurements];
        updated[index] = { ...updated[index], [field]: value };
        setMeasurements(updated);
    };

    const handleModalSave = useCallback((data: FormDataParams) => {
        const parseNum = (s: string) => s.replace(/[^\d.]/g, '');
        setMeasurements((prev) => {
            const next = [...prev];
            next[0] = {
                ...next[0],
                chest: parseNum(data.chest || ''),
                arm: parseNum(data.arm || ''),
                waist: parseNum(data.waist || ''),
                hipe: parseNum(data.hips || ''),
                thigh: parseNum(data.thigh || ''),
            };
            return next;
        });

        if (data.photoUrl) {
            setUploadedPhoto(data.photoUrl);
        }
    }, []);

    // Target calculation logic
    const startWeight = 75;
    const currentWeight = 72;
    const targetWeight = 65;
    const weightLost = startWeight - currentWeight;
    const totalToLose = startWeight - targetWeight;
    const progressPercent = Math.round((weightLost / totalToLose) * 100);

    // Goal Prediction Logic
    const predictGoal = (current: number, target: number, changePerDay: number) => {
        return Math.ceil((current - target) / changePerDay);
    };
    const estimatedDays = predictGoal(currentWeight, targetWeight, 0.16);

    // Insights logic
    const avgรับเข้า = 1628;
    const targetรับเข้า = 1500;
    const diffรับเข้า = avgรับเข้า - targetรับเข้า;
    const consistency = 78;
    const streak = 5;

    return (
        <div className="flex h-screen bg-white text-zinc-800 font-sans overflow-hidden">
            {/* ── Sidebar ────────────────────────────────────────── */}
            <div className="w-64 flex-shrink-0 border-r border-zinc-100 flex flex-col justify-between py-6 px-4 bg-white z-10 overflow-y-auto">
                <div>
                    <div className="flex items-center gap-2 px-2 mb-8">
                        <div className="text-[#8CC63F] font-black italic text-2xl tracking-tighter">
                            W<span className="text-[#F7931E]">M</span>
                        </div>
                        <div className="font-bold text-[17px] text-[#3A3A3A] uppercase tracking-tight">WELLMATE</div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <NavItem icon={<LayoutDashboard size={20} />} label="หน้าหลัก" href="/dashboard" />
                        <NavItem icon={<HeartPulse size={20} />} label="ปรึกษานักโภชนาการ" href="/approval" />
                        <NavItem icon={<Calendar size={20} />} label="ปฏิทิน" href="/calendar" />
                        <NavItem icon={<MessageSquare size={20} />} label="ข้อความ" href="/messages" />
                        <NavItem icon={<Salad size={20} />} label="เมนูสุขภาพ" onClick={() => alert("เมนูสุขภาพ Feature Coนาทีg Soon!")} />
                        <NavItem icon={<Utensils size={20} />} label="แผนการกิน" onClick={() => alert("แผนการกิน Feature Coนาทีg Soon!")} />
                        <NavItem icon={<BookOpen size={20} />} label="บันทึกอาหาร" href="/tracking" />
                        <NavItem icon={<TrendingUp size={20} />} label="ติดตามผล" active={true} href="/progress" />
                    </div>
                </div>

                <div className="mt-8 flex flex-col gap-4">
                    <div className="bg-[#D8F08F] p-4 rounded-xl text-center">
                        <p className="font-medium text-[12px] text-gray-700 mb-0.5">เริ่มต้นเส้นทางสุขภาพกับ</p>
                        <p className="font-black text-[16px] mb-0.5">ฟรี 1 เดือนแรก</p>
                        <p className="text-[11px] text-gray-600 mb-3">เข้าใช้งาน WELLMATE</p>
                        <button onClick={() => alert("กำลังไปยังหน้าสมัครสมาชิก...")} className="bg-black text-white text-[11px] font-bold py-2 px-5 rounded-full hover:bg-gray-800 transition-colors w-full">สมัครสมาชิกเลย!</button>
                    </div>
                    <button onClick={() => alert("กำลังออกจากระบบ...")} className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#F6EFE9] text-zinc-600 font-medium hover:bg-[#EBE2D9] transition-colors text-sm">
                        <LogOut size={16} />
                        ออกจากระบบ
                    </button>
                </div>
            </div>

            {/* ── Main Content ─────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto bg-[#FCF9F5] px-8 py-6">

                {/* Header Navbar */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-zinc-800">ติดตามผล Tracker</h1>
                            <p className="text-sm text-zinc-500 mt-1">ติดตามผลลัพธ์และรับคำแนะนำเชิงลึก</p>
                        </div>
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center ml-2 gap-2 bg-[#BCE875] hover:bg-[#aade5e] text-zinc-800 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
                        >
                            <Plus size={16} />
                            อัปเดตข้อมูล
                        </button>
                        <button
                            onClick={() => setShowAdvanced(true)}
                            className="flex items-center ml-2 justify-center w-10 h-10 bg-white border border-zinc-200 rounded-xl text-zinc-600 hover:bg-zinc-50 transition-colors shadow-sm"
                        >
                            <MoreVertical size={20} />
                        </button>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Global Time Filter */}
                        <div className="relative">
                            <button
                                onClick={() => setShowTimeFilter(!showTimeFilter)}
                                className="flex items-center gap-2 bg-white border border-zinc-200 px-4 py-2 rounded-xl text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors shadow-sm"
                            >
                                <Calendar size={16} className="text-zinc-500" />
                                Last {timeFilter}
                                <ChevronDown size={14} className="text-zinc-400" />
                            </button>
                            {showTimeFilter && (
                                <div className="absolute top-12 right-0 w-36 bg-white rounded-xl shadow-lg border border-zinc-100 z-50 overflow-hidden">
                                    {['7 วัน', '30 วัน', '3 เดือน'].map(opt => (
                                        <div
                                            key={opt}
                                            className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-zinc-50 transition-colors ${timeFilter === opt ? 'font-semibold text-zinc-800 bg-zinc-50/50' : 'text-zinc-600'}`}
                                            onClick={() => { setTimeFilter(opt); setShowTimeFilter(false); }}
                                        >
                                            {opt}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Search & Notifications */}
                        {showSearch ? (
                            <div className="flex items-center bg-white border border-zinc-200 rounded-full px-3 py-1.5 shadow-sm transform transition-all duration-300 w-48">
                                <Search size={16} className="text-zinc-400 mr-2" />
                                <input type="text" placeholder="Search..." className="bg-transparent text-sm w-full outline-none" autoFocus onBlur={() => setShowSearch(false)} />
                            </div>
                        ) : (
                            <button onClick={() => setShowSearch(true)} className="p-2 text-zinc-400 hover:bg-white rounded-full transition-colors focus:outline-none bg-white/50 border border-transparent hover:border-zinc-200">
                                <Search size={20} />
                            </button>
                        )}
                        <button onClick={() => alert("Notifications:\n- Remember to log your dinner!\n- 3 วัน streak! 🔥")} className="p-2 text-zinc-400 hover:bg-white rounded-full transition-colors focus:outline-none relative bg-white/50 border border-transparent hover:border-zinc-200">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#FCF9F5]"></span>
                        </button>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <div onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center gap-3 ml-2 cursor-pointer p-1.5 pr-4 rounded-full bg-white border border-zinc-200 shadow-sm hover:bg-zinc-50 transition-colors">
                                <div className="w-8 h-8 bg-zinc-200 rounded-full overflow-hidden">
                                    <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="User" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-zinc-800 leading-tight">Thanapat H.</span>
                                    <span className="text-[10px] text-zinc-500 font-medium">สมาชิก</span>
                                </div>
                                <ChevronDown size={14} className="text-zinc-400 ml-1" />
                            </div>
                            {showProfileMenu && (
                                <div className="absolute top-12 right-0 w-48 bg-white rounded-xl shadow-lg border border-zinc-100 z-50 overflow-hidden">
                                    <div className="px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 cursor-pointer" onClick={() => { alert("เปิดการตั้งค่า"); setShowProfileMenu(false); }}>การตั้งค่า</div>
                                    <div className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer" onClick={() => { alert("กำลังออกจากระบบ..."); setShowProfileMenu(false); }}>ออกจากระบบ</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 0. Body Measurement & Photos (Merged feature) ─────── */}
                <div className="flex flex-col xl:flex-row gap-6 mb-6">
                    {/* Left: Body Model */}
                    <div className="flex-[3] bg-[#FCF9F5] border-2 border-dashed border-[#e4dccf] rounded-3xl relative pt-4 pl-4 h-[350px] flex items-center justify-center">
                        <div className="absolute top-4 left-4 z-20">
                            <button
                                onClick={() => setShowBodyDropdown(!showBodyDropdown)}
                                className="flex items-center gap-2 bg-[#BCE875] px-4 py-1.5 rounded-xl font-medium text-zinc-800 text-xs hover:bg-[#aade5e] transition-colors"
                            >
                                {bodyTimeframe} <ChevronDown size={14} />
                            </button>
                            {showBodyDropdown && (
                                <div className="absolute top-10 left-0 w-28 bg-white rounded-xl shadow-lg border border-zinc-100 overflow-hidden z-30">
                                    {['วันนี้', 'เมื่อวาน', 'สัปดาห์ที่แล้ว'].map((opt) => (
                                        <div key={opt} className="px-3 py-2 text-xs text-zinc-700 hover:bg-zinc-50 cursor-pointer" onClick={() => { setBodyTimeframe(opt); setShowBodyDropdown(false); }}>
                                            {opt}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="relative w-full h-[300px] flex justify-center items-center">
                            <div className="w-[150px] h-full flex justify-center items-center drop-shadow-2xl">
                                <svg viewBox="0 0 200 500" className="w-full h-full text-[#e8eaef]" fill="currentColor" stroke="#ced4da" strokeWidth="3" strokeLinejoin="round" style={{ filter: 'drop-shadow(0px 10px 15px rgba(0,0,0,0.1))' }}>
                                    <ellipse cx="100" cy="55" rx="30" ry="40" />
                                    <path d="M 85 92 Q 100 110 115 92 C 140 100 155 125 160 150 C 165 175 145 280 135 300 C 120 330 80 330 65 300 C 55 280 35 175 40 150 C 45 125 60 100 85 92 Z" />
                                    <path d="M 40 150 C 15 190 5 260 15 310 C 20 330 45 330 45 300 C 50 260 55 200 65 160 Z" />
                                    <path d="M 160 150 C 185 190 195 260 185 310 C 180 330 155 330 155 300 C 150 260 145 200 135 160 Z" />
                                    <path d="M 65 300 C 55 360 35 450 40 480 C 45 510 75 510 80 480 C 85 440 95 330 100 295 Z" />
                                    <path d="M 135 300 C 145 360 165 450 160 480 C 155 510 125 510 120 480 C 115 440 105 330 100 295 Z" />
                                </svg>
                            </div>

                            {/* Pointing Lines */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                                {/* Chest */}
                                <line x1="50%" y1="30%" x2="80%" y2="28%" stroke="#ced4da" strokeWidth="1.5" strokeDasharray="3 3" />
                                <circle cx="50%" cy="30%" r="3" fill="#ced4da" />

                                {/* Arm */}
                                <line x1="40%" y1="44%" x2="10%" y2="45%" stroke="#ced4da" strokeWidth="1.5" strokeDasharray="3 3" />
                                <circle cx="40%" cy="44%" r="3" fill="#ced4da" />

                                {/* Waist */}
                                <line x1="50%" y1="52%" x2="80%" y2="50%" stroke="#ced4da" strokeWidth="1.5" strokeDasharray="3 3" />
                                <circle cx="50%" cy="52%" r="3" fill="#ced4da" />

                                {/* Hips */}
                                <line x1="45%" y1="62%" x2="15%" y2="63%" stroke="#ced4da" strokeWidth="1.5" strokeDasharray="3 3" />
                                <circle cx="45%" cy="62%" r="3" fill="#ced4da" />

                                {/* Thigh */}
                                <line x1="58%" y1="75%" x2="80%" y2="78%" stroke="#ced4da" strokeWidth="1.5" strokeDasharray="3 3" />
                                <circle cx="58%" cy="75%" r="3" fill="#ced4da" />
                            </svg>

                            {/* Inputs */}
                            <div className="absolute top-[25%] right-[2%] md:right-[15%] text-[10px] text-zinc-700 flex items-center bg-white shadow-sm border border-zinc-100 px-3 py-1.5 rounded-3xl z-10">
                                <span className="font-bold mr-2 text-[#F7931E]">หน้าอก</span>
                                <input type="text" value={measurements[0].chest} onChange={(e) => handleMeasurementChange(0, 'chest', e.target.value)} className="w-8 font-bold text-zinc-900 outline-none bg-transparent text-center" />
                                <span className="text-[9px] text-zinc-400">cm</span>
                            </div>
                            <div className="absolute top-[42%] left-[0%] md:left-[5%] text-[10px] text-zinc-700 flex items-center bg-white shadow-sm border border-zinc-100 px-3 py-1.5 rounded-3xl z-10">
                                <span className="font-bold mr-2 text-[#F7931E]">แขน</span>
                                <input type="text" value={measurements[0].arm} onChange={(e) => handleMeasurementChange(0, 'arm', e.target.value)} className="w-8 font-bold text-zinc-900 outline-none bg-transparent text-center" />
                                <span className="text-[9px] text-zinc-400">cm</span>
                            </div>
                            <div className="absolute top-[47%] right-[0%] md:right-[15%] text-[10px] text-zinc-700 flex items-center bg-white shadow-sm border border-zinc-100 px-3 py-1.5 rounded-3xl z-10">
                                <span className="font-bold mr-2 text-[#F7931E]">เอว</span>
                                <input type="text" value={measurements[0].waist} onChange={(e) => handleMeasurementChange(0, 'waist', e.target.value)} className="w-8 font-bold text-zinc-900 outline-none bg-transparent text-center" />
                                <span className="text-[9px] text-zinc-400">cm</span>
                            </div>
                            <div className="absolute top-[60%] left-[2%] md:left-[10%] text-[10px] text-zinc-700 flex items-center bg-white shadow-sm border border-zinc-100 px-3 py-1.5 rounded-3xl z-10">
                                <span className="font-bold mr-2 text-[#F7931E]">สะโพก</span>
                                <input type="text" value={measurements[0].hipe} onChange={(e) => handleMeasurementChange(0, 'hipe', e.target.value)} className="w-9 font-bold text-zinc-900 outline-none bg-transparent text-center" />
                                <span className="text-[9px] text-zinc-400">cm</span>
                            </div>
                            <div className="absolute bottom-[20%] right-[3%] md:right-[15%] text-[10px] text-zinc-700 flex items-center bg-white shadow-sm border border-zinc-100 px-3 py-1.5 rounded-3xl z-10">
                                <span className="font-bold mr-2 text-[#F7931E]">ต้นขา</span>
                                <input type="text" value={measurements[0].thigh} onChange={(e) => handleMeasurementChange(0, 'thigh', e.target.value)} className="w-8 font-bold text-zinc-900 outline-none bg-transparent text-center" />
                                <span className="text-[9px] text-zinc-400">cm</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: ติดตามผล Photos */}
                    <div className="flex-[2] bg-white rounded-3xl p-6 border border-zinc-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col h-[350px]">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className="font-bold text-zinc-800">ติดตามผล Photos</h3>
                                <p className="text-[10px] text-zinc-500">ติดตามการเปลี่ยนแปลงรูปร่าง</p>
                            </div>
                            <button onClick={() => alert("กำลังเปิดอัลบั้มภาพ...")} className="bg-zinc-100 text-zinc-600 text-xs px-3 py-1.5 rounded-lg font-medium hover:bg-zinc-200 transition-colors">
                                ดูทั้งหมด
                            </button>
                        </div>
                        <div className="flex gap-4 flex-1 overflow-hidden">
                            <div className="flex-1 bg-[#F5EBE1] rounded-2xl p-3 flex flex-col items-center">
                                <div className="flex justify-between w-full text-[10px] text-zinc-600 font-medium mb-2">
                                    <span>Aug 2026</span>
                                    <span className="font-bold text-zinc-800 text-xs">78 <span className="font-normal text-[10px]">kg</span></span>
                                </div>
                                <div className="w-full flex-1 bg-zinc-300 rounded-xl overflow-hidden relative group cursor-pointer">
                                    <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=500&auto=format&fit=crop" alt="ติดตามผล August" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                </div>
                            </div>
                            <div className="flex-1 bg-[#F5EBE1] rounded-2xl p-3 flex flex-col items-center relative group cursor-pointer transition-all hover:ring-2 hover:ring-[#BCE875]" onClick={() => setShowModal(true)}>
                                <div className="flex justify-between w-full text-[10px] text-zinc-600 font-medium mb-2">
                                    <span className="text-[#BCE875] font-bold">วันนี้</span>
                                    <span className="font-bold text-zinc-800 text-xs">72 <span className="font-normal text-[10px]">kg</span></span>
                                </div>
                                <div className="w-full flex-1 rounded-xl overflow-hidden relative flex flex-col justify-center items-center bg-zinc-100 border-2 border-dashed border-zinc-300">
                                    {uploadedPhoto ? (
                                        <img src={uploadedPhoto} alt="Upload" className="w-full h-full object-cover" />
                                    ) : (
                                        <>
                                            <Camera size={24} className="text-zinc-400 mb-1" />
                                            <span className="text-[10px] text-zinc-500 font-medium text-center leading-tight">คลิกเพื่อ<br />อัปโหลด</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 1. Summary Cards ────────────────────────────────────── */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
                    <div className="bg-white rounded-3xl p-5 border border-zinc-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                        <div className="flex justify-between items-start mb-2">
                            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-500 flex items-center justify-center">
                                <TrendingDown size={20} />
                            </div>
                            <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">-1.2 kg</span>
                        </div>
                        <p className="text-sm text-zinc-500 font-medium mt-3 mb-0.5">น้ำหนักปัจจุบัน</p>
                        <div className="flex items-end gap-1">
                            <h3 className="text-2xl font-black text-zinc-800">72.0</h3>
                            <span className="text-sm text-zinc-400 font-medium mb-1">kg</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-3xl p-5 border border-zinc-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                        <div className="flex justify-between items-start mb-2">
                            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-500 flex items-center justify-center">
                                <Target size={20} />
                            </div>
                            <span className="bg-[#BCE875] text-zinc-800 text-xs font-bold px-2.5 py-1 rounded-full">{progressPercent}%</span>
                        </div>
                        <p className="text-sm text-zinc-500 font-medium mt-3 mb-0.5">Target ติดตามผล</p>
                        <div className="flex items-end gap-1">
                            <h3 className="text-2xl font-black text-zinc-800">{targetWeight}</h3>
                            <span className="text-sm text-zinc-400 font-medium mb-1">kg</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-3xl p-5 border border-zinc-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                        <div className="flex justify-between items-start mb-2">
                            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-500 flex items-center justify-center">
                                <Flame size={20} />
                            </div>
                            <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">{diffรับเข้า > 0 ? `+${diffรับเข้า}` : diffรับเข้า} kcal</span>
                        </div>
                        <p className="text-sm text-zinc-500 font-medium mt-3 mb-0.5">แคลอรีเฉลี่ย</p>
                        <div className="flex items-end gap-1">
                            <h3 className="text-2xl font-black text-zinc-800">{avgรับเข้า}</h3>
                            <span className="text-sm text-zinc-400 font-medium mb-1">/ วัน</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-3xl p-5 border border-zinc-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                        <div className="flex justify-between items-start mb-2">
                            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-500 flex items-center justify-center">
                                <Activity size={20} />
                            </div>
                            <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2.5 py-1 rounded-full">Good 👍</span>
                        </div>
                        <p className="text-sm text-zinc-500 font-medium mt-3 mb-0.5">ความสม่ำเสมอ</p>
                        <div className="flex items-end gap-1">
                            <h3 className="text-2xl font-black text-zinc-800">{consistency}%</h3>
                        </div>
                    </div>
                </div>

                {/* 2. กราฟน้ำหนัก Graph ────────────────────────────── */}
                <div className="bg-white rounded-3xl p-6 border border-zinc-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] mb-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-lg font-bold text-zinc-800">กราฟน้ำหนัก</h2>
                            <p className="text-xs text-zinc-500 font-medium mt-1">เปรียบเทียบน้ำหนักจริงกับค่าเฉลี่ย 7 วัน</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-[#BCE875]"></div>
                                <span className="text-xs font-medium text-zinc-600">แนวโน้ม</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-[#F7931E]"></div>
                                <span className="text-xs font-medium text-zinc-600">จริง</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-[2px] bg-red-400 border border-dashed border-red-400"></div>
                                <span className="text-xs font-medium text-zinc-600">Target</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={weightData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#a1a1aa' }} dy={10} />
                                <YAxis domain={['dataMin - 1', 'dataMax + 1']} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#a1a1aa' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ fontSize: '13px', fontWeight: 'bold' }}
                                />
                                <ReferenceLine y={targetWeight} stroke="#f87171" strokeDasharray="3 3" label={{ position: 'right', value: 'Target', fill: '#f87171', fontSize: 12, fontWeight: 'bold' }} />

                                <Line type="monotone" dataKey="trend" name="แนวโน้ม" stroke="#BCE875" strokeWidth={3} dot={false} activeDot={false} />
                                <Line type="monotone" dataKey="weight" name="จริง" stroke="#F7931E" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 3. Calories Tracking & 4. Activity ──────────────────── */}
                <div className="flex flex-col xl:flex-row gap-6 mb-6">
                    <div className="flex-[3] bg-white rounded-3xl p-6 border border-zinc-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-lg font-bold text-zinc-800">สมดุลแคลอรี</h2>
                                <p className="text-xs text-zinc-500 font-medium mt-1">แคลอรีรับเข้า เทียบกับ เผาผลาญ</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="text-center px-4 py-2 bg-zinc-50 rounded-xl border border-zinc-100">
                                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-1">รับเข้าเฉลี่ย</p>
                                    <p className="text-sm font-black text-zinc-800">{avgรับเข้า} <span className="text-[10px] text-zinc-500 font-medium">kcal</span></p>
                                </div>
                                <div className="text-center px-4 py-2 bg-zinc-50 rounded-xl border border-zinc-100">
                                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-1">สถานะ</p>
                                    <p className={`text-sm font-black ${diffรับเข้า > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                        {diffรับเข้า > 0 ? `+${diffรับเข้า}` : diffรับเข้า} <span className="text-[10px] text-zinc-500 font-medium">kcal</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="h-[220px] w-full mt-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={caloriesData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }} barGap={2}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#a1a1aa' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#a1a1aa' }} />
                                    <Tooltip cursor={{ fill: '#f4f4f5', opacity: 0.4 }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                    <ReferenceLine y={targetรับเข้า} stroke="#f87171" strokeDasharray="3 3" />
                                    <Bar dataKey="intake" name="รับเข้า" fill="#F7931E" radius={[4, 4, 0, 0]} barSize={14} />
                                    <Bar dataKey="burn" name="เผาผลาญ" fill="#BCE875" radius={[4, 4, 0, 0]} barSize={14} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="flex-[2] bg-white rounded-3xl p-6 border border-zinc-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col">
                        <h2 className="text-lg font-bold text-zinc-800 mb-1">สรุปกิจกรรม</h2>
                        <p className="text-xs text-zinc-500 font-medium mb-6">ภาพรวมการออกกำลังกาย</p>

                        <div className="flex-1 flex flex-col justify-center gap-4">
                            <div className="flex items-center p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
                                <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center mr-4">
                                    <Zap size={24} className="fill-orange-500 opacity-80" />
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-500 font-medium mb-0.5">ทำต่อเนื่อง</p>
                                    <p className="text-xl font-black text-zinc-800">{streak} วัน 🔥</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                                    <p className="text-xs text-zinc-500 font-medium mb-1">ออกกำลังกาย</p>
                                    <p className="text-xl font-black text-zinc-800">4 <span className="text-xs text-zinc-400 font-medium">วัน</span></p>
                                </div>
                                <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                                    <p className="text-xs text-zinc-500 font-medium mb-1">เวลาทั้งหมด</p>
                                    <p className="text-xl font-black text-zinc-800">180 <span className="text-xs text-zinc-400 font-medium">นาที</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5. Targets & 6. Insights ──────────────────────────────── */}
                <div className="flex flex-col xl:flex-row gap-6">
                    <div className="flex-[2] bg-white rounded-3xl p-6 border border-zinc-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                        <h2 className="text-lg font-bold text-zinc-800 mb-1">Target ติดตามผล</h2>
                        <p className="text-xs text-zinc-500 font-medium mb-6">เส้นทางสู่Target {targetWeight} kg</p>

                        <div className="flex justify-between items-end mb-2 px-1">
                            <div className="text-center">
                                <span className="block text-[10px] text-zinc-400 font-bold uppercase tracking-wider">เริ่มต้น</span>
                                <span className="text-sm font-bold text-zinc-400">{startWeight}kg</span>
                            </div>
                            <div className="text-center">
                                <span className="block text-[10px] text-zinc-800 font-bold uppercase tracking-wider mb-1">ปัจจุบัน</span>
                                <div className="bg-[#18181b] text-white px-3 py-1 rounded-lg">
                                    <span className="text-base font-black">{currentWeight}kg</span>
                                </div>
                            </div>
                            <div className="text-center">
                                <span className="block text-[10px] text-green-600 font-bold uppercase tracking-wider">Target</span>
                                <span className="text-sm font-bold text-green-600">{targetWeight}kg</span>
                            </div>
                        </div>

                        <div className="relative w-full h-4 bg-zinc-100 rounded-full overflow-hidden mb-6 border border-zinc-200">
                            <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#deff9e] to-[#99d628] rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-[#F5EBE1]/50 rounded-2xl border border-[#F5EBE1]">
                            <span className="text-sm font-bold text-zinc-700">เหลืออีก</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-black text-orange-500">{currentWeight - targetWeight}</span>
                                <span className="text-sm text-zinc-500 font-bold">kg</span>
                            </div>
                        </div>

                        <div className="mt-3 flex items-center justify-center gap-2 p-3 bg-[#f0fde4] border border-[#cef0a6] rounded-2xl">
                            <span className="text-lg">📅</span>
                            <p className="font-bold text-[#629723] text-sm">บรรลุเป้าหมายในอีก {estimatedDays} วัน</p>
                        </div>
                    </div>

                    <div className="flex-[3] bg-zinc-900 rounded-3xl p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.2)] text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#BCE875] opacity-20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4"></div>

                        <div className="relative z-10 flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-[#BCE875]/20 text-[#BCE875] flex items-center justify-center">
                                <BrainCircuit size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-white leading-tight">วิเคราะห์ข้อมูล WellMate</h2>
                                <p className="text-xs text-zinc-400 font-medium">การวิเคราะห์อัตโนมัติ</p>
                            </div>
                        </div>

                        <div className="relative z-10 space-y-3">
                            {avgรับเข้า > targetรับเข้า && (
                                <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                                    <AlertCircle className="text-red-400 mt-0.5" size={18} />
                                    <div>
                                        <h4 className="text-sm font-bold text-white mb-1">Caloric Surplus Detected</h4>
                                        <p className="text-xs text-red-200/80 leading-relaxed">
                                            คุณทานอาหารเกินTargetเฉลี่ย <span className="text-red-400 font-bold">{diffรับเข้า} kcal</span> ในช่วง 7 วันที่ผ่านมา ซึ่งอาจทำให้น้ำหนักไม่ลดตามเป้า ลองปรับลดคาร์โบไฮเดรตในมื้อเย็นดูครับ
                                        </p>
                                    </div>
                                </div>
                            )}

                            {streak >= 3 && (
                                <div className="flex items-start gap-3 p-4 bg-[#BCE875]/10 border border-[#BCE875]/20 rounded-2xl">
                                    <CheckCircle2 className="text-[#BCE875] mt-0.5" size={18} />
                                    <div>
                                        <h4 className="text-sm font-bold text-white mb-1">Excellent ความสม่ำเสมอ</h4>
                                        <p className="text-xs text-[#BCE875]/80 leading-relaxed">
                                            คุณออกกำลังกายอย่างสม่ำเสมอ ({streak} วันติดต่อกัน) ระบบเผาผลาญประจำวันของคุณจึงสูงขึ้น ช่วยหักล้างแคลอรีส่วนเกินได้ดีมาก ทำต่อไปแบบนี้นะครับ! 🔥
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-start gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl">
                                <TrendingUp className="text-blue-400 mt-0.5" size={18} />
                                <div>
                                    <h4 className="text-sm font-bold text-white mb-1">Weight แนวโน้ม Analysis</h4>
                                    <p className="text-xs text-zinc-300 leading-relaxed">
                                        แม้ในช่วงเสาร์-อาทิตย์น้ำหนักจะเพิ่มเล็กน้อย (Water Weight) แต่แนวโน้มรวม (แนวโน้ม Line) ของคุณยังคง<span className="text-[#BCE875] font-bold">ลดลง</span> ถือว่าพัฒนาการอยู่ในเกณฑ์ดี
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Advanced Stats Drawer overlay */}
            <AdvancedStatsDrawer isOpen={showAdvanced} onClose={() => setShowAdvanced(false)} />

            {/* Update Progress Modal */}
            {showModal && <UpdateProgressModal onClose={() => setShowModal(false)} onSave={handleModalSave} defaultData={measurements[0]} />}
        </div>
    );
}
