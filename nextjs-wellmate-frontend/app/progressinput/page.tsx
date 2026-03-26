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
    MoreHorizontal,
    Droplets,
    GlassWater,
    Camera,
    X,
    Check,
    Plus
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart,
} from 'recharts';

// ─── Static Data ────────────────────────────────────────────────────────────

const weightData = [
    { name: 'Apr', weight: 81 },
    { name: 'May', weight: 82 },
    { name: 'Jun', weight: 80 },
    { name: 'Jul', weight: 77 },
    { name: 'Aug', weight: 78 },
    { name: 'Sep', weight: 78 },
];

const caloriesData = [
    { name: 'Sun', cal: 1800 },
    { name: 'Mon', cal: 1500 },
    { name: 'Tue', cal: 1600 },
    { name: 'Wed', cal: 2200 },
    { name: 'Thu', cal: 1400 },
];

const hydrationData = [
    { day: 'Sun', amount: 40 },
    { day: 'Mon', amount: 60 },
    { day: 'Tue', amount: 80 },
    { day: 'Wed', amount: 100 },
    { day: 'Thu', amount: 90 },
    { day: 'Fri', amount: 30 },
    { day: 'Sat', amount: 0 },
];

const ACTIVITY_LEVELS = [
    'Sedentary (little or no exercise)',
    'Light (1-3 days/week)',
    'Moderate (3 - 5 times / week)',
    'Active (6-7 days/week)',
    'Very Active (hard exercise every day)',
];

const HEIGHT_OPTIONS = ['155 cm', '160 cm', '165 cm', '170 cm', '175 cm', '180 cm', '185 cm', '190 cm'];
const WEIGHT_OPTIONS = ['50.0 kg', '55.0 kg', '60.0 kg', '63.0 kg', '65.0 kg', '70.0 kg', '75.0 kg', '80.0 kg', '85.0 kg', '90.0 kg'];
const CHEST_OPTIONS = Array.from({ length: 20 }, (_, i) => `${(85 + i * 0.5).toFixed(1)} cm`);
const ARM_OPTIONS = Array.from({ length: 20 }, (_, i) => `${(25 + i * 0.5).toFixed(1)} cm`);
const WAIST_OPTIONS = Array.from({ length: 20 }, (_, i) => `${(70 + i * 0.5).toFixed(1)} cm`);
const HIPS_OPTIONS = Array.from({ length: 20 }, (_, i) => `${(90 + i * 0.5).toFixed(1)} cm`);
const THIGH_OPTIONS = Array.from({ length: 20 }, (_, i) => `${(55 + i * 0.5).toFixed(1)} cm`);
const BODYFAT_OPTIONS = ['10%', '12%', '14%', '16%', '18%', '20%', '22%', '24%', '26%', '28%', '30%'];
const CALORIES_OPTIONS = ['1500 kcal', '1800 kcal', '2000 kcal', '2200 kcal', '2500 kcal', '2800 kcal', '3000 kcal'];
const WATER_OPTIONS = ['1000 ml', '1500 ml', '2000 ml', '2500 ml', '3000 ml', '3500 ml'];

// ─── Small reusable components ───────────────────────────────────────────────

function NavItem({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
    return (
        <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors ${active ? 'bg-[#c1eb7c] font-medium text-zinc-800' : 'text-zinc-500 hover:bg-zinc-50'
                }`}
        >
            {icon}
            <span>{label}</span>
        </div>
    );
}

interface ComboInputProps {
    label: string;
    value: string;
    options: string[];
    onChange: (v: string) => void;
    placeholder?: string;
}

function ComboInput({ label, value, options, onChange, placeholder }: ComboInputProps) {
    const [open, setOpen] = useState(false);
    const [inputVal, setInputVal] = useState(value);
    const [isTyping, setIsTyping] = useState(false);
    const [dropStyle, setDropStyle] = useState<React.CSSProperties>({});
    const containerRef = useRef<HTMLDivElement>(null);

    // keep inputVal in sync if parent changes value externally
    React.useEffect(() => { setInputVal(value); }, [value]);

    // Show all options when just opened; filter only after user starts typing
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
        setIsTyping(false); // reset typing flag so all options show
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
        <div
            style={dropStyle}
            className="bg-white rounded-xl shadow-2xl border border-zinc-100 max-h-44 overflow-y-auto"
        >
            {filtered.map((opt) => (
                <div
                    key={opt}
                    className={`px-4 py-2 text-sm cursor-pointer transition-colors ${opt === value ? 'bg-[#BCE875]/40 font-semibold text-zinc-800' : 'text-zinc-700 hover:bg-zinc-50'
                        }`}
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
                <button
                    type="button"
                    tabIndex={-1}
                    onMouseDown={(e) => { e.preventDefault(); if (open) setOpen(false); else openDropdown(); }}
                    className="text-zinc-400 hover:text-zinc-600 flex-shrink-0"
                >
                    <ChevronDown size={14} />
                </button>
            </div>
            {typeof window !== 'undefined' && dropdownEl
                ? require('react-dom').createPortal(dropdownEl, document.body)
                : null}
        </div>
    );
}

// SelectDropdown = ComboInput (supports both typing and dropdown)
const SelectDropdown = ComboInput;

// ─── Update Progress Modal ────────────────────────────────────────────────────

interface ModalProps {
    onClose: () => void;
    onSave: (data: FormData) => void;
}

interface FormData {
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

function UpdateProgressModal({ onClose, onSave }: ModalProps) {
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

    const [form, setForm] = useState<FormData>({
        weight: '63.0 kg',
        height: '165 cm',
        chest: '95.0 cm',
        arm: '30.0 cm',
        waist: '80.0 cm',
        hips: '100.0 cm',
        thigh: '66.0 cm',
        bodyFat: '18%',
        calories: '2500 kcal',
        water: '2000 ml',
        activityLevel: 'Moderate (3 - 5 times / week)',
        photoUrl: null,
    });

    const [showActivityDropdown, setShowActivityDropdown] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [saved, setSaved] = useState(false);

    const set = (field: keyof FormData) => (v: string) => setForm((f) => ({ ...f, [field]: v }));

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
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-start justify-between px-8 pt-8 pb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-zinc-800">Update Progress</h2>
                        <p className="text-sm text-zinc-500 mt-1">{dateStr}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-zinc-100 transition-colors text-zinc-400 hover:text-zinc-700 mt-1"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="px-8 pb-8 flex flex-col gap-6">
                    {/* Body Check */}
                    <div>
                        <h3 className="text-base font-bold text-zinc-800 mb-4">Body Check</h3>
                        <div className="flex gap-4">
                            {/* Left: form fields grid */}
                            <div className="flex-1 grid grid-cols-2 gap-3">
                                <SelectDropdown label="Current Weight (kg)" value={form.weight} options={WEIGHT_OPTIONS} onChange={set('weight')} />
                                <SelectDropdown label="Height (cm)" value={form.height} options={HEIGHT_OPTIONS} onChange={set('height')} />
                                <SelectDropdown label="Chest (cm)" value={form.chest} options={CHEST_OPTIONS} onChange={set('chest')} />
                                <SelectDropdown label="Arm (cm)" value={form.arm} options={ARM_OPTIONS} onChange={set('arm')} />
                                <SelectDropdown label="Waist (cm)" value={form.waist} options={WAIST_OPTIONS} onChange={set('waist')} />
                                <SelectDropdown label="Hipe (cm)" value={form.hips} options={HIPS_OPTIONS} onChange={set('hips')} />
                                <SelectDropdown label="Thigh (cm)" value={form.thigh} options={THIGH_OPTIONS} onChange={set('thigh')} />
                                <SelectDropdown label="% Body Fat" value={form.bodyFat} options={BODYFAT_OPTIONS} onChange={set('bodyFat')} />
                            </div>

                            {/* Right: Photo Upload */}
                            <div className="w-[140px] flex-shrink-0">
                                <label className="block text-xs text-zinc-500 mb-1 font-medium invisible">Photo</label>
                                <div
                                    className="w-full h-full min-h-[200px] border-2 border-dashed border-zinc-300 rounded-2xl bg-zinc-50 flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-100 transition-colors relative overflow-hidden group"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {form.photoUrl ? (
                                        <>
                                            <img
                                                src={form.photoUrl}
                                                alt="Progress"
                                                className="absolute inset-0 w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Camera size={24} className="text-white" />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <Camera size={28} className="text-zinc-400 mb-2" />
                                            <span className="text-xs text-zinc-500 text-center px-2 font-medium">Upload Today Photo</span>
                                        </>
                                    )}
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handlePhotoUpload}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Calories Activities */}
                    <div>
                        <h3 className="text-base font-bold text-zinc-800 mb-3">Calories Activities (kcal)</h3>
                        <SelectDropdown label="" value={form.calories} options={CALORIES_OPTIONS} onChange={set('calories')} />
                    </div>

                    {/* Water Intake */}
                    <div>
                        <h3 className="text-base font-bold text-zinc-800 mb-3">Water Intake (ml)</h3>
                        <SelectDropdown label="" value={form.water} options={WATER_OPTIONS} onChange={set('water')} />
                    </div>

                    {/* Daily Habits */}
                    <div>
                        <h3 className="text-base font-bold text-zinc-800 mb-1">Daily Habits</h3>
                        <p className="text-xs text-zinc-500 mb-3">Activity Level :</p>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setShowActivityDropdown(!showActivityDropdown)}
                                className="w-full flex items-center justify-between bg-[#F5EBE1] border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-800 font-medium hover:border-zinc-300 transition-colors focus:outline-none focus:ring-2 focus:ring-[#BCE875]"
                            >
                                {form.activityLevel}
                                <ChevronDown size={14} className="text-zinc-400 ml-2 flex-shrink-0" />
                            </button>
                            {showActivityDropdown && (
                                <div className="absolute top-full mt-1 left-0 right-0 bg-white rounded-xl shadow-xl border border-zinc-100 z-50">
                                    {ACTIVITY_LEVELS.map((opt) => (
                                        <div
                                            key={opt}
                                            className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${opt === form.activityLevel
                                                ? 'bg-[#BCE875]/40 font-semibold text-zinc-800'
                                                : 'text-zinc-700 hover:bg-zinc-50'
                                                }`}
                                            onClick={() => { set('activityLevel')(opt); setShowActivityDropdown(false); }}
                                        >
                                            {opt}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 rounded-2xl border border-zinc-200 text-zinc-600 font-semibold text-sm hover:bg-zinc-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            className={`flex-1 py-3 rounded-2xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${saved
                                ? 'bg-green-500 text-white'
                                : 'bg-[#BCE875] hover:bg-[#aade5e] text-zinc-800'
                                }`}
                        >
                            {saved ? <><Check size={16} /> Saved!</> : 'Save & Update'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProgressInputPage() {
    // ── Measurements table state ──────────────────────────────────────────────
    const [measurements, setMeasurements] = useState([
        { id: 1, week: 'Week 1', chest: '95.0', arm: '30.0', waist: '80.0', hipe: '100.0', thigh: '66.0' },
        { id: 2, week: 'Week 2', chest: '94.0', arm: '29.5', waist: '79.0', hipe: '99.0', thigh: '59.5' },
        { id: 3, week: 'Week 3', chest: '93.5', arm: '29.0', waist: '78.0', hipe: '98.0', thigh: '58.5' },
        { id: 4, week: 'Week 4', chest: '93.0', arm: '28.5', waist: '77.5', hipe: '97.5', thigh: '58.5' },
    ]);

    const handleMeasurementChange = (index: number, field: string, value: string) => {
        const updated = [...measurements];
        updated[index] = { ...updated[index], [field]: value };
        setMeasurements(updated);
    };

    const handleSave = (index: number, field: string) => {
        console.log(`Saved row ${index} field ${field}:`, measurements[index][field as keyof (typeof measurements)[0]]);
    };

    // ── Dropdown / timeframe states ───────────────────────────────────────────
    const [bodyTimeframe, setBodyTimeframe] = useState('Today');
    const [monthTimeframe, setMonthTimeframe] = useState('February 2026');
    const [caloriesTimeframe, setCaloriesTimeframe] = useState('Last 5 Days');
    const [healthTimeframe, setHealthTimeframe] = useState('Last 5 Days');
    const [hydrationTimeframe, setHydrationTimeframe] = useState('This Week');

    const [showBodyDropdown, setShowBodyDropdown] = useState(false);
    const [showMonthDropdown, setShowMonthDropdown] = useState(false);
    const [showCaloriesDropdown, setShowCaloriesDropdown] = useState(false);
    const [showHealthDropdown, setShowHealthDropdown] = useState(false);
    const [showHydrationDropdown, setShowHydrationDropdown] = useState(false);
    const [showWeightOptions, setShowWeightOptions] = useState(false);

    // Header
    const [showSearch, setShowSearch] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    // Modal
    const [showModal, setShowModal] = useState(false);
    const [savedData, setSavedData] = useState<null | ReturnType<typeof Object>>(null);

    const handleModalSave = useCallback((data: Parameters<typeof UpdateProgressModal>[0]['onSave'] extends (d: infer D) => void ? D : never) => {
        setSavedData(data as object);
        // Update measurements row 1 with fresh data from modal
        const parseNum = (s: string) => s.replace(/[^\d.]/g, '');
        setMeasurements((prev) => {
            const next = [...prev];
            // update Week 1 (index 0) body measurements from modal input
            next[0] = {
                ...next[0],
                chest: parseNum((data as { chest: string }).chest),
                arm: parseNum((data as { arm: string }).arm),
                waist: parseNum((data as { waist: string }).waist),
                hipe: parseNum((data as { hips: string }).hips),
                thigh: parseNum((data as { thigh: string }).thigh),
            };
            return next;
        });
    }, []);

    return (
        <div className="flex h-screen bg-white text-zinc-800 font-sans overflow-hidden">
            {/* ── Sidebar ──────────────────────────────────────────────────────── */}
            <div className="w-64 flex-shrink-0 border-r border-zinc-100 flex flex-col justify-between py-6 px-4 bg-white z-10 overflow-y-auto">
                <div>
                    <div className="flex items-center gap-2 px-2 mb-8">
                        <div className="text-[#8CC63F] font-black italic text-2xl tracking-tighter">
                            W<span className="text-[#F7931E]">M</span>
                        </div>
                        <div className="font-bold text-[17px] text-[#3A3A3A] uppercase tracking-tight">WELLMATE</div>
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
                </div>

                <div className="mt-8 flex flex-col gap-4">
                    <div className="bg-[#c1eb7c] p-4 rounded-xl relative overflow-hidden">
                        <div className="relative z-10 text-sm">
                            <p className="font-medium text-zinc-800 mb-1">Start your health journey with</p>
                            <p className="font-bold text-xl mb-3">a FREE 1 MONTH</p>
                            <p className="text-zinc-700 text-xs mb-3">access to WELLMATE</p>
                            <button className="bg-zinc-800 text-white text-xs px-4 py-1.5 rounded-full font-medium">
                                Sign Up Now!
                            </button>
                        </div>
                    </div>
                    <button className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#F4EBE1] text-zinc-600 font-medium hover:bg-[#ebdccc] transition-colors">
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </div>

            {/* ── Main Content ─────────────────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto bg-[#FCF9F5] px-8 py-6">
                {/* Header Navbar */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-semibold text-zinc-800">Progress</h1>
                        {/* Update Button */}
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center gap-2 bg-[#BCE875] hover:bg-[#aade5e] text-zinc-800 text-sm font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm"
                        >
                            <Plus size={16} />
                            Update Progress
                        </button>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Search */}
                        <div className="relative">
                            <button
                                onClick={() => setShowSearch(!showSearch)}
                                className="p-2 text-zinc-400 hover:bg-zinc-100 rounded-full transition-colors focus:outline-none"
                            >
                                <Search size={20} />
                            </button>
                            {showSearch && (
                                <div className="absolute top-10 right-0 w-64 bg-white rounded-xl shadow-lg border border-zinc-100 p-2 z-50 flex items-center">
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="w-full text-sm outline-none px-2 py-1 text-zinc-700"
                                        autoFocus
                                    />
                                </div>
                            )}
                        </div>

                        {/* Notifications */}
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="p-2 text-zinc-400 hover:bg-zinc-100 rounded-full transition-colors focus:outline-none relative"
                            >
                                <Bell size={20} />
                                <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                            </button>
                            {showNotifications && (
                                <div className="absolute top-10 right-0 w-72 bg-white rounded-xl shadow-lg border border-zinc-100 z-50 overflow-hidden">
                                    <div className="px-4 py-3 border-b border-zinc-100 font-bold text-sm text-zinc-800">Notifications</div>
                                    <div className="p-4 text-xs text-zinc-500 text-center">No new notifications</div>
                                </div>
                            )}
                        </div>

                        {/* Profile */}
                        <div className="relative">
                            <div
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="flex items-center gap-3 ml-2 cursor-pointer p-1 pr-3 rounded-full hover:bg-white/50 transition-colors"
                            >
                                <div className="w-10 h-10 bg-zinc-300 rounded-full flex items-center justify-center overflow-hidden">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500">
                                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-zinc-800 leading-none">Thanapat Hongaram</span>
                                    <span className="text-xs text-zinc-500 mt-1">Member</span>
                                </div>
                                <ChevronDown size={16} className="text-zinc-400 ml-2" />
                            </div>
                            {showProfileMenu && (
                                <div className="absolute top-12 right-0 w-48 bg-white rounded-xl shadow-lg border border-zinc-100 overflow-hidden z-50">
                                    {['My Profile', 'Settings', 'Support', 'Sign Out'].map((opt, i) => (
                                        <div
                                            key={opt}
                                            className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-zinc-50 ${i === 3 ? 'text-red-500 border-t border-zinc-100' : 'text-zinc-700'}`}
                                            onClick={() => setShowProfileMenu(false)}
                                        >
                                            {opt}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="flex flex-col xl:flex-row gap-6">

                    {/* Left Column: Body Image & Measurements */}
                    <div className="flex-1 xl:w-[45%] flex flex-col gap-8">
                        {/* Body Model */}
                        <div className="relative pt-4 pl-4 h-[400px] flex items-center justify-center">
                            <div className="absolute top-0 left-0 z-20">
                                <button
                                    onClick={() => setShowBodyDropdown(!showBodyDropdown)}
                                    className="flex items-center gap-2 bg-[#BCE875] px-4 py-2 rounded-xl font-medium text-zinc-800 text-sm hover:bg-[#aade5e] transition-colors"
                                >
                                    {bodyTimeframe} <ChevronDown size={16} />
                                </button>
                                {showBodyDropdown && (
                                    <div className="absolute top-12 left-0 w-32 bg-white rounded-xl shadow-lg border border-zinc-100 overflow-hidden z-30">
                                        {['Today', 'Yesterday', 'Last Week'].map((opt) => (
                                            <div
                                                key={opt}
                                                className="px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 cursor-pointer"
                                                onClick={() => { setBodyTimeframe(opt); setShowBodyDropdown(false); }}
                                            >
                                                {opt}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="relative w-full h-[360px] flex justify-center items-center mt-4">
                                <div className="w-[180px] h-full flex justify-center items-center drop-shadow-2xl">
                                    <svg viewBox="0 0 200 500" className="w-full h-full text-[#e8eaef]" fill="currentColor" stroke="#ced4da" strokeWidth="3" strokeLinejoin="round" style={{ filter: 'drop-shadow(0px 10px 15px rgba(0,0,0,0.1))' }}>
                                        <ellipse cx="100" cy="55" rx="30" ry="40" />
                                        <path d="M 85 92 Q 100 110 115 92 C 140 100 155 125 160 150 C 165 175 145 280 135 300 C 120 330 80 330 65 300 C 55 280 35 175 40 150 C 45 125 60 100 85 92 Z" />
                                        <path d="M 40 150 C 15 190 5 260 15 310 C 20 330 45 330 45 300 C 50 260 55 200 65 160 Z" />
                                        <path d="M 160 150 C 185 190 195 260 185 310 C 180 330 155 330 155 300 C 150 260 145 200 135 160 Z" />
                                        <path d="M 65 300 C 55 360 35 450 40 480 C 45 510 75 510 80 480 C 85 440 95 330 100 295 Z" />
                                        <path d="M 135 300 C 145 360 165 450 160 480 C 155 510 125 510 120 480 C 115 440 105 330 100 295 Z" />
                                    </svg>
                                </div>

                                {/* Chest */}
                                <div className="absolute top-[28%] right-[5%] text-xs text-zinc-700 flex items-center bg-white shadow-md border border-zinc-100 px-4 py-2 rounded-3xl z-10 transition-all">
                                    <div className="w-8 h-[1px] bg-[#F7931E] mr-3 transform -rotate-[15deg] origin-right"></div>
                                    <span className="font-medium mr-2 w-8">Chest</span>
                                    <input
                                        type="text"
                                        value={measurements[0].chest}
                                        onChange={(e) => handleMeasurementChange(0, 'chest', e.target.value)}
                                        className="w-10 font-bold text-zinc-900 border-b border-[#F7931E]/40 focus:border-[#F7931E] outline-none bg-transparent text-center transition-colors"
                                    />
                                    <span className="text-[10px] text-zinc-500 font-normal ml-1">cm</span>
                                </div>
                                {/* Arm */}
                                <div className="absolute top-[45%] left-[-2%] text-xs text-zinc-700 flex items-center bg-white shadow-md border border-zinc-100 px-4 py-2 rounded-3xl z-10 transition-all">
                                    <span className="font-medium mr-2 w-8">Arm</span>
                                    <input
                                        type="text"
                                        value={measurements[0].arm}
                                        onChange={(e) => handleMeasurementChange(0, 'arm', e.target.value)}
                                        className="w-10 font-bold text-zinc-900 border-b border-[#F7931E]/40 focus:border-[#F7931E] outline-none bg-transparent text-center transition-colors"
                                    />
                                    <span className="text-[10px] text-zinc-500 font-normal ml-1 mr-3">cm</span>
                                    <div className="w-8 h-[1px] bg-[#F7931E] transform rotate-[15deg] origin-left"></div>
                                </div>
                                {/* Waist */}
                                <div className="absolute top-[48%] right-[-2%] text-xs text-zinc-700 flex items-center bg-white shadow-md border border-zinc-100 px-4 py-2 rounded-3xl z-10 transition-all">
                                    <div className="w-8 h-[1px] bg-[#F7931E] mr-3 transform rotate-[15deg] origin-right"></div>
                                    <span className="font-medium mr-2 w-8">Waist</span>
                                    <input
                                        type="text"
                                        value={measurements[0].waist}
                                        onChange={(e) => handleMeasurementChange(0, 'waist', e.target.value)}
                                        className="w-10 font-bold text-zinc-900 border-b border-[#F7931E]/40 focus:border-[#F7931E] outline-none bg-transparent text-center transition-colors"
                                    />
                                    <span className="text-[10px] text-zinc-500 font-normal ml-1">cm</span>
                                </div>
                                {/* Hips */}
                                <div className="absolute top-[62%] left-[2%] text-xs text-zinc-700 flex items-center bg-white shadow-md border border-zinc-100 px-4 py-2 rounded-3xl z-10 transition-all">
                                    <span className="font-medium mr-2 w-8">Hips</span>
                                    <input
                                        type="text"
                                        value={measurements[0].hipe}
                                        onChange={(e) => handleMeasurementChange(0, 'hipe', e.target.value)}
                                        className="w-10 font-bold text-zinc-900 border-b border-[#F7931E]/40 focus:border-[#F7931E] outline-none bg-transparent text-center transition-colors"
                                    />
                                    <span className="text-[10px] text-zinc-500 font-normal ml-1 mr-3">cm</span>
                                    <div className="w-8 h-[1px] bg-[#F7931E] transform -rotate-[15deg] origin-left"></div>
                                </div>
                                {/* Thigh */}
                                <div className="absolute bottom-[20%] right-[3%] text-xs text-zinc-700 flex items-center bg-white shadow-md border border-zinc-100 px-4 py-2 rounded-3xl z-10 transition-all">
                                    <div className="w-8 h-[1px] bg-[#F7931E] mr-3 transform -rotate-[35deg] origin-right"></div>
                                    <span className="font-medium mr-2 w-8">Thigh</span>
                                    <input
                                        type="text"
                                        value={measurements[0].thigh}
                                        onChange={(e) => handleMeasurementChange(0, 'thigh', e.target.value)}
                                        className="w-10 font-bold text-zinc-900 border-b border-[#F7931E]/40 focus:border-[#F7931E] outline-none bg-transparent text-center transition-colors"
                                    />
                                    <span className="text-[10px] text-zinc-500 font-normal ml-1">cm</span>
                                </div>
                            </div>
                        </div>

                        {/* Measurements Table */}
                        <div className="bg-[#F5EBE1] rounded-3xl p-6">
                            <div className="flex justify-between items-center text-zinc-800 font-medium text-sm mb-5 px-4 w-full">
                                <div className="relative w-[120px] sm:w-[140px]">
                                    <div
                                        className="flex items-center gap-1 font-bold cursor-pointer hover:text-green-700 transition-colors"
                                        onClick={() => setShowMonthDropdown(!showMonthDropdown)}
                                    >
                                        {monthTimeframe} <ChevronDown className="w-4 h-4 ml-1 text-zinc-500" />
                                    </div>
                                    {showMonthDropdown && (
                                        <div className="absolute top-8 left-0 w-36 bg-white rounded-xl shadow-lg border border-zinc-100 overflow-hidden z-30 max-h-48 overflow-y-auto">
                                            {['January 2026', 'February 2026', 'March 2026', 'April 2026', 'May 2026', 'June 2026', 'July 2026', 'August 2026', 'September 2026', 'October 2026', 'November 2026', 'December 2026'].map((opt) => (
                                                <div
                                                    key={opt}
                                                    className="px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 cursor-pointer"
                                                    onClick={() => { setMonthTimeframe(opt); setShowMonthDropdown(false); }}
                                                >
                                                    {opt}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 flex justify-around pl-4">
                                    <div className="text-center text-xs text-zinc-500 font-medium">Chest (cm)</div>
                                    <div className="text-center text-xs text-zinc-500 font-medium">Arm (cm)</div>
                                    <div className="text-center text-xs text-zinc-500 font-medium">Waist (cm)</div>
                                    <div className="text-center text-xs text-zinc-500 font-medium">Hipe (cm)</div>
                                    <div className="text-center text-xs text-zinc-500 font-medium">Thigh (cm)</div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                {measurements.map((row, idx) => (
                                    <div key={row.id} className="flex justify-between items-center px-4">
                                        <div className="w-[80px] sm:w-[100px] text-sm text-zinc-600 font-medium">{row.week}</div>
                                        <div className="flex-1 flex justify-around pl-4">
                                            {(['chest', 'arm', 'waist', 'hipe', 'thigh'] as const).map((field) => (
                                                <input
                                                    key={field}
                                                    value={row[field]}
                                                    onChange={(e) => handleMeasurementChange(idx, field, e.target.value)}
                                                    onBlur={() => handleSave(idx, field)}
                                                    className="w-12 sm:w-16 h-10 bg-white rounded-xl text-center text-zinc-700 font-semibold text-sm outline-none focus:ring-2 focus:ring-[#BCE875] transition-all"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Center Column: Weight & Photos */}
                    <div className="flex-1 xl:w-[25%] flex flex-col gap-6">
                        {/* Weight Tracking */}
                        <div className="bg-[#F5EBE1] rounded-3xl p-6 h-[280px] flex flex-col">
                            <div className="flex justify-between items-start mb-4 relative">
                                <h3 className="font-bold text-zinc-800">Weight Tracking</h3>
                                <div className="relative">
                                    <MoreHorizontal
                                        className="text-zinc-400 cursor-pointer hover:text-zinc-700 transition-colors"
                                        size={20}
                                        onClick={() => setShowWeightOptions(!showWeightOptions)}
                                    />
                                    {showWeightOptions && (
                                        <div className="absolute top-6 right-0 w-32 bg-white rounded-xl shadow-lg border border-zinc-100 overflow-hidden z-30">
                                            {['Edit Goal', 'Export Data', 'Share'].map((opt) => (
                                                <div
                                                    key={opt}
                                                    className="px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 cursor-pointer"
                                                    onClick={() => setShowWeightOptions(false)}
                                                >
                                                    {opt}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-y-2 mb-6">
                                <div className="text-zinc-500 text-xs">Start Weight</div>
                                <div className="text-right font-bold text-zinc-800 text-sm">85 <span className="font-normal text-xs text-zinc-500">kg</span></div>
                                <div className="text-zinc-500 text-xs">Current Weight</div>
                                <div className="text-right font-bold text-zinc-800 text-sm">78 <span className="font-normal text-xs text-zinc-500">kg</span></div>
                                <div className="text-zinc-500 text-xs">Weight Goal</div>
                                <div className="text-right font-bold text-zinc-800 text-sm">65 <span className="font-normal text-xs text-zinc-500">kg</span></div>
                            </div>

                            <div className="flex-1 min-h-0 w-[105%] -ml-[5%]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={weightData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={false} domain={['dataMin - 2', 'dataMax + 2']} />
                                        <Tooltip cursor={{ stroke: '#e5e7eb', strokeWidth: 1 }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                        <Area type="monotone" dataKey="weight" stroke="#fbbf24" strokeWidth={2} fillOpacity={1} fill="url(#colorWeight)" activeDot={{ r: 6, fill: '#fbbf24', stroke: '#fff', strokeWidth: 2 }} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Progress Photos */}
                        <div className="bg-[#FCF9F5] rounded-3xl pt-2">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-zinc-800">Progress Photos</h3>
                                <button className="bg-[#BCE875] text-zinc-800 text-xs px-3 py-1.5 rounded-lg font-medium hover:bg-[#aade5e] transition-colors">
                                    View all
                                </button>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1 bg-[#F5EBE1] rounded-2xl p-3 flex flex-col items-center">
                                    <div className="flex justify-between w-full text-[10px] text-zinc-600 font-medium mb-3">
                                        <span>Jun 2026</span>
                                        <span className="font-bold text-zinc-800 text-xs">82 <span className="font-normal text-[10px]">kg</span></span>
                                    </div>
                                    <div className="w-full aspect-[4/3] bg-zinc-300 rounded-xl overflow-hidden relative group cursor-pointer">
                                        <img src="https://images.unsplash.com/photo-1548690312-e3b507d8c110?q=80&w=500&auto=format&fit=crop" alt="Progress June" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    </div>
                                </div>
                                <div className="flex-1 bg-[#F5EBE1] rounded-2xl p-3 flex flex-col items-center">
                                    <div className="flex justify-between w-full text-[10px] text-zinc-600 font-medium mb-3">
                                        <span>Aug 2026</span>
                                        <span className="font-bold text-zinc-800 text-xs">78 <span className="font-normal text-[10px]">kg</span></span>
                                    </div>
                                    <div className="w-full aspect-[4/3] bg-zinc-300 rounded-xl overflow-hidden relative group cursor-pointer">
                                        <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=500&auto=format&fit=crop" alt="Progress August" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Calories, Health Indicators, Hydration */}
                    <div className="flex-1 xl:w-[30%] flex flex-col gap-6">

                        {/* Calories Activities */}
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-bold text-zinc-800 text-sm">Calories Activities</h3>
                                    <div className="flex items-baseline gap-1 mt-1">
                                        <span className="font-bold text-xl text-zinc-800">450</span>
                                        <span className="text-xs text-zinc-500">kcal left</span>
                                    </div>
                                    <div className="text-[10px] text-zinc-400 mt-1">Calorie Goal 2500 kcal</div>
                                </div>
                                <div className="relative">
                                    <button
                                        className="flex items-center gap-1 bg-[#BCE875] px-2 py-1 rounded text-[10px] font-medium text-zinc-800 hover:bg-[#aade5e] transition-colors"
                                        onClick={() => setShowCaloriesDropdown(!showCaloriesDropdown)}
                                    >
                                        {caloriesTimeframe} <ChevronDown size={12} />
                                    </button>
                                    {showCaloriesDropdown && (
                                        <div className="absolute top-7 right-0 w-28 bg-white rounded-lg shadow-lg border border-zinc-100 overflow-hidden z-30">
                                            {['Last 5 Days', 'Last 7 Days', 'This Month'].map((opt) => (
                                                <div
                                                    key={opt}
                                                    className="px-3 py-2 text-[10px] text-zinc-700 hover:bg-zinc-50 cursor-pointer"
                                                    onClick={() => { setCaloriesTimeframe(opt); setShowCaloriesDropdown(false); }}
                                                >
                                                    {opt}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="h-[140px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={caloriesData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                                        <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                        <Bar dataKey="cal" fill="#FCD34D" radius={[2, 2, 0, 0]} barSize={12} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Health Indicators */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-zinc-800 text-sm">Health Indicators</h3>
                                <div className="relative">
                                    <button
                                        className="flex items-center gap-1 bg-[#BCE875] px-2 py-1 rounded text-[10px] font-medium text-zinc-800 hover:bg-[#aade5e] transition-colors"
                                        onClick={() => setShowHealthDropdown(!showHealthDropdown)}
                                    >
                                        {healthTimeframe} <ChevronDown size={12} />
                                    </button>
                                    {showHealthDropdown && (
                                        <div className="absolute top-7 right-0 w-28 bg-white rounded-lg shadow-lg border border-zinc-100 overflow-hidden z-30">
                                            {['Last 5 Days', 'Last 7 Days', 'This Month'].map((opt) => (
                                                <div
                                                    key={opt}
                                                    className="px-3 py-2 text-[10px] text-zinc-700 hover:bg-zinc-50 cursor-pointer"
                                                    onClick={() => { setHealthTimeframe(opt); setShowHealthDropdown(false); }}
                                                >
                                                    {opt}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-[#F5EBE1] rounded-2xl p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-zinc-700">BMI</span>
                                        <span className="bg-[#BCE875] text-[10px] font-bold px-2 py-0.5 rounded-full text-zinc-800">Normal</span>
                                    </div>
                                    <div className="font-bold text-2xl text-zinc-800">22.5</div>
                                </div>
                                <div className="bg-[#F5EBE1] rounded-2xl p-4">
                                    <div className="text-sm font-medium text-zinc-700 mb-2">% Body Fat</div>
                                    <div className="font-bold text-2xl text-zinc-800">18%</div>
                                </div>
                                <div className="bg-[#F5EBE1] rounded-2xl p-4">
                                    <div className="text-sm font-medium text-zinc-700 mb-2">BMR</div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="font-bold text-2xl text-zinc-800">1650</span>
                                        <span className="text-[10px] text-zinc-500 font-medium">kcal</span>
                                    </div>
                                </div>
                                <div className="bg-[#F5EBE1] rounded-2xl p-4">
                                    <div className="text-sm font-medium text-zinc-700 mb-2">TDEE</div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="font-bold text-2xl text-zinc-800">2300</span>
                                        <span className="text-[10px] text-zinc-500 font-medium">kcal</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Hydration */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-zinc-800 text-sm">Hydration</h3>
                                <div className="relative">
                                    <button
                                        className="flex items-center gap-1 bg-[#BCE875] px-2 py-1 rounded text-[10px] font-medium text-zinc-800 hover:bg-[#aade5e] transition-colors"
                                        onClick={() => setShowHydrationDropdown(!showHydrationDropdown)}
                                    >
                                        {hydrationTimeframe} <ChevronDown size={12} />
                                    </button>
                                    {showHydrationDropdown && (
                                        <div className="absolute top-7 right-0 w-28 bg-white rounded-lg shadow-lg border border-zinc-100 overflow-hidden z-30">
                                            {['This Week', 'Last Week', 'This Month'].map((opt) => (
                                                <div
                                                    key={opt}
                                                    className="px-3 py-2 text-[10px] text-zinc-700 hover:bg-zinc-50 cursor-pointer"
                                                    onClick={() => { setHydrationTimeframe(opt); setShowHydrationDropdown(false); }}
                                                >
                                                    {opt}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex-1 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-[#BCE875] flex items-center justify-center text-zinc-800">
                                        <Droplets size={20} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-zinc-500">Hydration Level</div>
                                        <div className="font-bold text-sm text-zinc-800">Normal</div>
                                    </div>
                                </div>
                                <div className="flex-1 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-[#fca5b1] flex items-center justify-center text-zinc-800">
                                        <GlassWater size={20} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-zinc-500">Intake</div>
                                        <div className="font-bold text-sm text-zinc-800">2.0 L</div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-end h-[60px] px-2">
                                {hydrationData.map((data, i) => (
                                    <div key={i} className="flex flex-col items-center gap-2">
                                        <div className="w-1.5 h-[50px] bg-zinc-200 rounded-full flex flex-col justify-end overflow-hidden">
                                            <div
                                                className={`w-full rounded-full ${data.amount > 0 && data.amount < 100 ? 'bg-[#fcd34d]' : data.amount === 100 ? 'bg-[#bce875]' : ''}`}
                                                style={{ height: `${data.amount}%` }}
                                            />
                                        </div>
                                        <div className="text-[9px] text-zinc-400">{data.day}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Update Progress Modal ─────────────────────────────────────────── */}
            {showModal && (
                <UpdateProgressModal
                    onClose={() => setShowModal(false)}
                    onSave={handleModalSave}
                />
            )}
        </div>
    );
}
