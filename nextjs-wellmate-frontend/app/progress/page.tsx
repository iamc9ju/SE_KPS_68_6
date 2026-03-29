"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
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
    Menu,
    Footprints,
    BedDouble
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
import Sidebar from '@/components/dashboard/Sidebar';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';

// ─── Static Data ────────────────────────────────────────────────────────────
const ACTIVITY_LEVELS = [
    'Sedentary',
    'Light',
    'Moderate',
    'Active',
    'Very active',
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
const STEPS_OPTIONS = ['3000 steps', '5000 steps', '7000 steps', '8000 steps', '10000 steps', '12000 steps', '15000 steps'];
const SLEEP_OPTIONS = ['5.0 hr', '6.0 hr', '7.0 hr', '7.5 hr', '8.0 hr', '8.5 hr', '9.0 hr'];

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
    inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
    autoOpenOnFocus?: boolean;
}

function SelectDropdown({ label, value, options, onChange, placeholder, inputMode = 'text', autoOpenOnFocus = false }: ComboInputProps) {
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
                onChange(inputVal.trim());
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
                    inputMode={inputMode}
                    placeholder={placeholder}
                    onChange={(e) => { setInputVal(e.target.value); setIsTyping(true); }}
                    onFocus={() => { if (autoOpenOnFocus) openDropdown(); }}
                    onBlur={handleBlur}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            onChange(inputVal.trim());
                            setOpen(false);
                            setIsTyping(false);
                        }
                    }}
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

function NumericInput({
    label,
    value,
    onChange,
    placeholder,
    suffix,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    suffix?: string;
}) {
    return (
        <div>
            <label className="mb-1 block text-xs font-medium text-zinc-500">{label}</label>
            <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-[#F5EBE1] px-4 py-2.5 transition-colors hover:border-zinc-300 focus-within:ring-2 focus-within:ring-[#BCE875]">
                <input
                    type="text"
                    inputMode="decimal"
                    value={value}
                    placeholder={placeholder}
                    onChange={(e) => onChange(e.target.value)}
                    className="min-w-0 flex-1 bg-transparent text-sm font-medium text-zinc-800 outline-none placeholder:text-zinc-400"
                />
                {suffix && <span className="text-xs font-semibold text-zinc-400">{suffix}</span>}
            </div>
        </div>
    );
}

export default function ProgressPage() {
    return <ProgressPageContent />;
}

// Update Progress Modal
interface FormDataParams {
    weight: string;
    height: string;
    targetWeight: string;
    chest: string;
    arm: string;
    waist: string;
    hips: string;
    thigh: string;
    bodyFat: string;
    calories: string;
    water: string;
    steps: string;
    sleepHours: string;
    activityLevel: string;
    photoUrl: string | null;
    photoFile: File | null;
}

interface ProgressOverviewResponse {
    patient: {
        patientId: string;
        goal: string | null;
        goalDetail: string | null;
        targetWeightKg?: number | string | null;
        activityLevel: string | null;
    };
    latestHealthMetric: {
        weightKg?: number | string | null;
        heightCm?: number | string | null;
        recordedAt?: string;
    } | null;
    latestMeasurement: {
        bodyMeasurementLogId: string;
        weightKg?: number | string | null;
        bodyFatPercent?: number | string | null;
        chestCm?: number | string | null;
        armCm?: number | string | null;
        waistCm?: number | string | null;
        hipsCm?: number | string | null;
        thighCm?: number | string | null;
        caloriesKcal?: number | null;
        waterMl?: number | null;
        stepsCount?: number | null;
        sleepHours?: number | string | null;
        recordedAt?: string;
    } | null;
    recentPhotos: Array<{
        progressPhotoId: string;
        imageUrl: string;
        createdAt: string;
    }>;
}

interface ProgressHistoryResponse {
    healthMetrics: Array<{
        id: number;
        weightKg?: number | string | null;
        heightCm?: number | string | null;
        activityLevel?: string | null;
        recordedAt: string;
    }>;
    measurementLogs: Array<{
        bodyMeasurementLogId: string;
        weightKg?: number | string | null;
        bodyFatPercent?: number | string | null;
        chestCm?: number | string | null;
        armCm?: number | string | null;
        waistCm?: number | string | null;
        hipsCm?: number | string | null;
        thighCm?: number | string | null;
        caloriesKcal?: number | null;
        waterMl?: number | null;
        stepsCount?: number | null;
        sleepHours?: number | string | null;
        recordedAt: string;
    }>;
}

type BodyMeasurementView = {
    id: number;
    value: string;
    week: string;
    recordedAt?: string;
    chest: string;
    arm: string;
    waist: string;
    hipe: string;
    thigh: string;
};

const ACTIVITY_LEVEL_LABELS: Record<string, string> = {
    sedentary: 'Sedentary',
    light: 'Light',
    moderate: 'Moderate',
    active: 'Active',
    very_active: 'Very active',
};
const ACTIVITY_LEVEL_VALUES = Object.entries(ACTIVITY_LEVEL_LABELS).reduce<Record<string, string>>((acc, [key, label]) => {
    acc[label] = key;
    return acc;
}, {});

const toNumber = (value: string | number | null | undefined) => {
    if (value === null || value === undefined || value === "") return null;
    const parsed = typeof value === "number" ? value : Number(String(value).replace(/[^\d.-]/g, ""));
    return Number.isFinite(parsed) ? parsed : null;
};

const formatNumber = (value: number | null | undefined, digits = 1) =>
    value === null || value === undefined ? "-" : value.toFixed(digits);

const formatDateLabel = (value?: string) => {
    if (!value) return "-";
    return new Date(value).toLocaleDateString("th-TH", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const getDaysFromTimeFilter = (value?: string) => {
    if (!value) return 7;
    if (value.includes("30")) return 30;
    if (value.includes("3")) return 90;
    return 7;
};

const isWithinDays = (value: string | undefined, days: number) => {
    if (!value) return false;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return false;
    const cutoff = new Date();
    cutoff.setHours(23, 59, 59, 999);
    cutoff.setDate(cutoff.getDate() - (days - 1));
    cutoff.setHours(0, 0, 0, 0);
    return date >= cutoff;
};

const normalizeActivityLevel = (value?: string | null) => {
    if (!value) return null;
    return ACTIVITY_LEVEL_VALUES[value] ?? value;
};

const formatActivityLevel = (value?: string | null) => {
    if (!value) return '-';
    return ACTIVITY_LEVEL_LABELS[value] ?? value;
};

const getActivityMultiplier = (value?: string | null) => {
    switch (value) {
        case 'light':
            return 1.375;
        case 'moderate':
            return 1.55;
        case 'active':
            return 1.725;
        case 'very_active':
            return 1.9;
        default:
            return 1.2;
    }
};

const EMPTY_MEASUREMENT: BodyMeasurementView = {
    id: 1,
    value: '',
    week: 'No measurement yet',
    recordedAt: undefined,
    chest: '-',
    arm: '-',
    waist: '-',
    hipe: '-',
    thigh: '-',
};

function UpdateProgressModal({ onClose, onSave, defaultData }: { onClose: () => void, onSave: (d: FormDataParams) => Promise<void>, defaultData?: any }) {
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

    const [form, setForm] = useState<FormDataParams>({
        weight: defaultData?.weight ?? '',
        height: defaultData?.height ?? '',
        targetWeight: defaultData?.targetWeight ?? '',
        chest: defaultData?.chest ? `${defaultData.chest} cm` : '',
        arm: defaultData?.arm ? `${defaultData.arm} cm` : '',
        waist: defaultData?.waist ? `${defaultData.waist} cm` : '',
        hips: defaultData?.hipe ? `${defaultData.hipe} cm` : '',
        thigh: defaultData?.thigh ? `${defaultData.thigh} cm` : '',
        bodyFat: defaultData?.bodyFat ?? '',
        calories: defaultData?.calories ?? '',
        water: defaultData?.water ?? '',
        steps: defaultData?.steps ?? '',
        sleepHours: defaultData?.sleepHours ?? '',
        activityLevel: defaultData?.activityLevel ?? '',
        photoUrl: null,
        photoFile: null,
    });

    const [showActivityDropdown, setShowActivityDropdown] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const [modalError, setModalError] = useState<string | null>(null);

    const set = (field: keyof FormDataParams) => (v: string) => setForm((f) => ({ ...f, [field]: v }));
    const filledFields = [
        form.weight,
        form.height,
        form.targetWeight,
        form.chest,
        form.arm,
        form.waist,
        form.hips,
        form.thigh,
        form.bodyFat,
        form.calories,
        form.water,
        form.steps,
        form.sleepHours,
        form.activityLevel,
    ].filter((value) => value.trim().length > 0).length;
    const canSave = filledFields > 0 || Boolean(form.photoFile);

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        setForm((f) => ({ ...f, photoUrl: url, photoFile: file }));
        setModalError(null);
    };

    const handleSave = async () => {
        if (!canSave) {
            setModalError('Please add at least one progress detail before saving.');
            return;
        }

        setSaving(true);
        setModalError(null);
        try {
            await onSave(form);
            setSaved(true);
            setTimeout(() => { setSaved(false); onClose(); }, 800);
        } catch {
            setModalError('Unable to save this update right now. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/35 p-4 backdrop-blur-md"
            onClick={onClose}
        >
            <div
                className="w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-[36px] border border-[#eadfce] bg-[linear-gradient(180deg,#fffdfa_0%,#fffaf4_100%)] text-zinc-800 font-sans shadow-[0_35px_80px_-30px_rgba(64,44,16,0.35)]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 z-10 flex items-start justify-between border-b border-[#efe4d2] bg-white/90 px-8 py-6 backdrop-blur">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 rounded-full border border-[#e7d9c5] bg-[#fff6ea] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#a26b18]">
                            <TrendingUp size={14} />
                            Progress Update
                        </div>
                        <div>
                            <h2 className="text-[28px] font-black leading-tight text-zinc-800">Update your progress</h2>
                            <p className="mt-1 text-sm text-zinc-500">Save your latest body measurements, activity, hydration, and progress photo in one place.</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500">
                            <span className="rounded-full bg-[#f4eadb] px-3 py-1 font-semibold text-zinc-700">{dateStr}</span>
                            <span>{filledFields} fields ready</span>
                            <span>{form.photoFile ? 'Photo selected' : 'No photo yet'}</span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full border border-[#eadfce] bg-white p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="px-8 pb-8 pt-6 flex flex-col gap-6">
                    {modalError && (
                        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {modalError}
                        </div>
                    )}

                    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
                        <div className="rounded-[28px] border border-[#efe4d2] bg-white p-5 shadow-[0_10px_30px_-25px_rgba(64,44,16,0.25)]">
                            <div className="mb-5 flex items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-lg font-black text-zinc-800">Body measurements</h3>
                                    <p className="mt-1 text-xs text-zinc-500">Type the exact value you measured today. Suggested values are optional, so decimals like 65.35 kg or 86.2 cm work too.</p>
                                </div>
                                <div className="rounded-2xl bg-[#f7efe2] px-4 py-3 text-right">
                                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400">Session</p>
                                    <p className="text-sm font-bold text-zinc-700">{dateStr}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                <SelectDropdown label="Current weight (kg)" value={form.weight} options={WEIGHT_OPTIONS} onChange={set('weight')} placeholder="e.g. 65.35 kg" inputMode="decimal" />
                                <SelectDropdown label="Height (cm)" value={form.height} options={HEIGHT_OPTIONS} onChange={set('height')} placeholder="e.g. 170.4 cm" inputMode="decimal" />
                                <NumericInput label="Target weight (kg)" value={form.targetWeight} onChange={set('targetWeight')} placeholder="e.g. 58.50" suffix="kg" />
                                <SelectDropdown label="Chest (cm)" value={form.chest} options={CHEST_OPTIONS} onChange={set('chest')} placeholder="e.g. 95.2 cm" inputMode="decimal" />
                                <SelectDropdown label="Arm (cm)" value={form.arm} options={ARM_OPTIONS} onChange={set('arm')} placeholder="e.g. 30.4 cm" inputMode="decimal" />
                                <SelectDropdown label="Waist (cm)" value={form.waist} options={WAIST_OPTIONS} onChange={set('waist')} placeholder="e.g. 80.3 cm" inputMode="decimal" />
                                <SelectDropdown label="Hips (cm)" value={form.hips} options={HIPS_OPTIONS} onChange={set('hips')} placeholder="e.g. 100.8 cm" inputMode="decimal" />
                                <SelectDropdown label="Thigh (cm)" value={form.thigh} options={THIGH_OPTIONS} onChange={set('thigh')} placeholder="e.g. 66.7 cm" inputMode="decimal" />
                                <SelectDropdown label="Body fat (%)" value={form.bodyFat} options={BODYFAT_OPTIONS} onChange={set('bodyFat')} placeholder="e.g. 21.6%" inputMode="decimal" />
                            </div>
                        </div>

                        <div className="rounded-[28px] border border-[#efe4d2] bg-[linear-gradient(180deg,#fffaf4_0%,#fff3e4_100%)] p-5 shadow-[0_10px_30px_-25px_rgba(64,44,16,0.25)]">
                            <div className="mb-4">
                                <h3 className="text-lg font-black text-zinc-800">Progress photo</h3>
                                <p className="mt-1 text-xs text-zinc-500">Attach today's photo so it can be stored with this progress entry.</p>
                            </div>
                            <div className="w-full">
                                <div className="w-full min-h-[280px] border-2 border-dashed border-[#d9ccb8] rounded-[28px] bg-white/75 flex flex-col items-center justify-center cursor-pointer hover:bg-white transition-colors relative overflow-hidden group" onClick={() => fileInputRef.current?.click()}>
                                    {form.photoUrl ? (
                                        <>
                                            <img src={form.photoUrl} alt="Progress upload preview" className="absolute inset-0 w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Camera size={24} className="text-white" />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="mb-3 rounded-2xl bg-[#f7efe2] p-4 text-zinc-500">
                                                <Camera size={30} />
                                            </div>
                                            <span className="text-sm font-bold text-zinc-700">Upload today's photo</span>
                                            <span className="mt-1 text-xs text-zinc-500">JPG, PNG or HEIC</span>
                                        </>
                                    )}
                                </div>
                                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                                <p className="mt-3 text-xs text-zinc-500">{form.photoFile ? form.photoFile.name : 'No file selected yet'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
                        <div className="rounded-[28px] border border-[#efe4d2] bg-white p-5 shadow-[0_10px_30px_-25px_rgba(64,44,16,0.25)]">
                            <h3 className="text-lg font-black text-zinc-800">Nutrition, hydration & recovery</h3>
                            <p className="mt-1 text-xs text-zinc-500">Save calories, water, steps, and sleep so the progress dashboard reflects your latest routine.</p>
                            <div className="mt-5 grid gap-4 md:grid-cols-2">
                                <SelectDropdown label="Calories (kcal)" value={form.calories} options={CALORIES_OPTIONS} onChange={set('calories')} placeholder="e.g. 1985 kcal" inputMode="numeric" />
                                <SelectDropdown label="Water intake (ml)" value={form.water} options={WATER_OPTIONS} onChange={set('water')} placeholder="e.g. 2150 ml" inputMode="numeric" />
                                <SelectDropdown label="Steps" value={form.steps} options={STEPS_OPTIONS} onChange={set('steps')} placeholder="e.g. 8200 steps" inputMode="numeric" />
                                <SelectDropdown label="Sleep (hours)" value={form.sleepHours} options={SLEEP_OPTIONS} onChange={set('sleepHours')} placeholder="e.g. 7.5 hr" inputMode="decimal" />
                            </div>
                        </div>

                        <div className="rounded-[28px] border border-[#efe4d2] bg-white p-5 shadow-[0_10px_30px_-25px_rgba(64,44,16,0.25)]">
                            <h3 className="text-lg font-black text-zinc-800">Daily activity</h3>
                            <p className="mt-1 text-xs text-zinc-500">Choose your activity level to update BMR and TDEE calculations.</p>
                            <div className="relative mt-5">
                                <button type="button" onClick={() => setShowActivityDropdown(!showActivityDropdown)} className="w-full flex items-center justify-between rounded-2xl border border-zinc-200 bg-[#F5EBE1] px-4 py-3.5 text-sm text-zinc-800 font-medium hover:border-zinc-300 transition-colors focus:outline-none focus:ring-2 focus:ring-[#BCE875]">
                                    <span>{form.activityLevel || 'Select activity level'}</span>
                                    <ChevronDown size={14} className="text-zinc-400 ml-2 flex-shrink-0" />
                                </button>
                                {showActivityDropdown && (
                                    <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl shadow-xl border border-zinc-100 z-50 overflow-hidden">
                                        {ACTIVITY_LEVELS.map((opt) => (
                                            <div key={opt} className={`px-4 py-3 text-sm cursor-pointer transition-colors ${opt === form.activityLevel ? 'bg-[#BCE875]/40 font-semibold text-zinc-800' : 'text-zinc-700 hover:bg-zinc-50'}`} onClick={() => { set('activityLevel')(opt); setShowActivityDropdown(false); }}>
                                                {opt}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="mt-4 rounded-2xl bg-[#f7efe2] px-4 py-3 text-xs text-zinc-600">
                                After saving, the progress page refreshes from the latest database values automatically.
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 border-t border-[#efe4d2] pt-6 md:flex-row md:items-center md:justify-between">
                        <div className="text-sm text-zinc-500">
                            {canSave ? 'Ready to save this progress update.' : 'Add at least one value or a photo to create a new progress entry.'}
                        </div>
                        <div className="flex gap-3">
                            <button type="button" onClick={onClose} className="flex-1 rounded-2xl border border-zinc-200 bg-white px-6 py-3 text-zinc-600 font-semibold text-sm hover:bg-zinc-50 transition-colors">Cancel</button>
                            <button type="button" onClick={handleSave} disabled={saving || !canSave} className={`flex-1 rounded-2xl px-6 py-3 font-semibold text-sm transition-all flex items-center justify-center gap-2 ${saved ? 'bg-green-500 text-white' : 'bg-[#BCE875] hover:bg-[#aade5e] text-zinc-800'} ${(saving || !canSave) ? 'cursor-not-allowed opacity-70' : ''}`}>
                                {saved ? <><Check size={16} /> Saved!</> : 'Save Progress'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function AdvancedStatsDrawer({
    isOpen,
    onClose,
    caloriesChartData,
    targetCalories,
    avgCalories,
    currentWeight,
    currentHeight,
    currentBodyFat,
    currentWaterMl,
    bmi,
    bmr,
    tdee,
    currentActivityLevel,
    historyItems,
}: {
    isOpen: boolean;
    onClose: () => void;
    caloriesChartData: Array<{ day: string; intake: number; burn: number }>;
    targetCalories: number;
    avgCalories: number | null;
    currentWeight: number | null;
    currentHeight: number | null;
    currentBodyFat: number | null;
    currentWaterMl: number | null;
    bmi: number | null;
    bmr: number | null;
    tdee: number | null;
    currentActivityLevel: string | null;
    historyItems: Array<{ date: string; weight: number; bmi: number | null; status: string }>;
}) {
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

    const caloriesRemaining = avgCalories !== null ? targetCalories - avgCalories : null;
    const hydrationBars = Array.from({ length: 10 }, (_, index) =>
        currentWaterMl !== null && (index + 1) * 10 <= Math.min(100, Math.round((currentWaterMl / 2000) * 100)) ? 70 : 0,
    );

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
                {/* Header */}
                <div className="flex items-center justify-between p-6 pb-4 border-b border-zinc-100 mb-6 bg-[#FCFBF8]">
                    <div>
                        <h2 className="text-lg font-black text-zinc-800">รายละเอียดเชิงลึก</h2>
                        <p className="text-xs text-zinc-500 font-medium mt-1">สรุปแนวโน้มและตัวชี้วัดของช่วงเวลาที่เลือก</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full border border-zinc-200 bg-white p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
                    >
                        <X size={18} />
                    </button>
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
                                    <span className="text-4xl font-black text-zinc-800">{caloriesRemaining ?? '-'}</span>
                                <span className="text-[13px] text-zinc-400 font-medium">kcal คงเหลือ</span>
                            </div>
                            <p className="text-[11px] text-zinc-400 font-medium tracking-wide">เป้าหมายแคลอรี {targetCalories} kcal</p>
                        </div>
                        <div className="h-44 w-full mb-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={caloriesChartData.map((item) => ({ day: item.day, kcal: item.intake }))} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
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
                                    <span className="bg-[#BCE875] text-[#4d7018] text-[10px] font-bold px-2 py-0.5 rounded-full">{bmi && bmi < 25 ? 'ปกติ' : 'ต้องติดตาม'}</span>
                                </div>
                                <span className="text-3xl font-black text-zinc-800">{formatNumber(bmi)}</span>
                            </div>
                            <div className="bg-[#F6EFE9] rounded-3xl p-5 flex flex-col justify-between min-h-[110px]">
                                <span className="text-[13px] font-bold text-zinc-700 mb-3">% Body Fat</span>
                                <span className="text-3xl font-black text-zinc-800">{currentBodyFat !== null ? `${formatNumber(currentBodyFat)}%` : '-'}</span>
                            </div>
                            <div className="bg-[#F6EFE9] rounded-3xl p-5 flex flex-col justify-between min-h-[110px]">
                                <span className="text-[13px] font-bold text-zinc-700 mb-3">BMR</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-black text-zinc-800">{bmr ?? '-'}</span>
                                    <span className="text-[11px] font-bold text-zinc-500">kcal</span>
                                </div>
                            </div>
                            <div className="bg-[#F6EFE9] rounded-3xl p-5 flex flex-col justify-between min-h-[110px]">
                                <span className="text-[13px] font-bold text-zinc-700 mb-3">TDEE</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-black text-zinc-800">{tdee ?? '-'}</span>
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
                                    <span className="text-[15px] font-black text-zinc-800">{currentWaterMl !== null ? (currentWaterMl >= 2000 ? 'ปกติ' : 'น้อยไป') : '-'}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-[#FFAEB4] flex items-center justify-center text-white">
                                    <Droplet size={24} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[11px] font-medium text-zinc-500 mb-0.5">ปริมาณที่ดื่ม</span>
                                    <span className="text-[15px] font-black text-zinc-800">{currentWaterMl ? `${(currentWaterMl / 1000).toFixed(1)} L` : '-'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-end justify-between h-[40px] gap-2 pb-0 border-b border-zinc-200 mt-4">
                            {hydrationBars.map((val, i) => (
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
                            {historyItems.map((item, idx) => (
                                <div key={idx} className="bg-white border border-zinc-100 rounded-2xl p-4 flex justify-between items-center shadow-sm">
                                    <div className="flex flex-col">
                                        <span className="text-[11px] font-bold text-zinc-400 mb-0.5">{item.date}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-black text-zinc-800">{formatNumber(item.weight)} kg</span>
                                            <span className="text-[11px] font-bold text-zinc-500">BMI {item.bmi ? formatNumber(item.bmi) : '-'}</span>
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
export function ProgressPageContent({ embedded = false }: { embedded?: boolean } = {}) {
    const user = useAuthStore((state) => state.user);
    // Top states
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);

    const [timeFilter, setTimeFilter] = useState('7 วัน');
    const [showTimeFilter, setShowTimeFilter] = useState(false);
    const [overview, setOverview] = useState<ProgressOverviewResponse | null>(null);
    const [historyData, setHistoryData] = useState<ProgressHistoryResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [saveError, setSaveError] = useState<string | null>(null);

    // Body Measurements
    const [bodyTimeframe, setBodyTimeframe] = useState('');
    const [showBodyDropdown, setShowBodyDropdown] = useState(false);

    const loadProgressData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [overviewResponse, historyResponse] = await Promise.all([
                api.get('/patients/progress'),
                api.get('/patients/progress/history'),
            ]);

            const nextOverview = overviewResponse.data?.data as ProgressOverviewResponse;
            const nextHistory = historyResponse.data?.data as ProgressHistoryResponse;

            setOverview(nextOverview);
            setHistoryData(nextHistory);

            setSaveError(null);
        } catch (error) {
            console.error('Failed to load progress data', error);
            setSaveError('Unable to load progress data right now.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadProgressData();
    }, [loadProgressData]);

    const selectedRangeDays = getDaysFromTimeFilter(timeFilter);
    const filteredHealthMetrics = (historyData?.healthMetrics ?? []).filter((item) => isWithinDays(item.recordedAt, selectedRangeDays));
    const filteredMeasurementLogs = (historyData?.measurementLogs ?? []).filter((item) => isWithinDays(item.recordedAt, selectedRangeDays));
    const filteredRecentPhotos = (overview?.recentPhotos ?? []).filter((item) => isWithinDays(item.createdAt, selectedRangeDays));

    const measurementEntries: BodyMeasurementView[] = filteredMeasurementLogs
        .slice()
        .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime())
        .map((item, index) => ({
            id: index + 1,
            value: `${item.recordedAt}-${index}`,
            week: formatDateLabel(item.recordedAt),
            recordedAt: item.recordedAt,
            chest: formatNumber(toNumber(item.chestCm)),
            arm: formatNumber(toNumber(item.armCm)),
            waist: formatNumber(toNumber(item.waistCm)),
            hipe: formatNumber(toNumber(item.hipsCm)),
            thigh: formatNumber(toNumber(item.thighCm)),
        }));

    useEffect(() => {
        if (measurementEntries.length === 0) {
            setBodyTimeframe('');
            return;
        }

        if (!bodyTimeframe || !measurementEntries.some((item) => item.value === bodyTimeframe)) {
            setBodyTimeframe(measurementEntries[0].value);
        }
    }, [bodyTimeframe, measurementEntries]);

    const selectedMeasurement =
        measurementEntries.find((item) => item.value === bodyTimeframe) ??
        measurementEntries[0] ??
        EMPTY_MEASUREMENT;

    const handleModalSave = useCallback(async (data: FormDataParams) => {
        setSaveError(null);

        const payload = {
            weightKg: toNumber(data.weight),
            heightCm: toNumber(data.height),
            targetWeightKg: toNumber(data.targetWeight),
            chestCm: toNumber(data.chest),
            armCm: toNumber(data.arm),
            waistCm: toNumber(data.waist),
            hipsCm: toNumber(data.hips),
            thighCm: toNumber(data.thigh),
            bodyFatPercent: toNumber(data.bodyFat),
            caloriesKcal: toNumber(data.calories),
            waterMl: toNumber(data.water),
            stepsCount: toNumber(data.steps),
            sleepHours: toNumber(data.sleepHours),
            activityLevel: normalizeActivityLevel(data.activityLevel),
            recordedAt: new Date().toISOString(),
        };

        try {
            const createResponse = await api.post('/patients/progress', payload);
            const measurementId = createResponse.data?.data?.measurement?.bodyMeasurementLogId as string | undefined;

            if (data.photoFile) {
                const photoForm = new FormData();
                photoForm.append('file', data.photoFile);
                if (measurementId) {
                    photoForm.append('bodyMeasurementLogId', measurementId);
                }

                await api.post('/patients/progress/photos', photoForm, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    params: measurementId ? { bodyMeasurementLogId: measurementId } : undefined,
                });
            }

            await loadProgressData();
        } catch (error) {
            console.error('Failed to save progress data', error);
            setSaveError('Unable to save progress data right now.');
            throw error;
        }
    }, [loadProgressData]);

    // Target calculation logic
    const latestHealthMetricEntry = filteredHealthMetrics[filteredHealthMetrics.length - 1] ?? null;
    const latestMeasurementEntry = filteredMeasurementLogs[filteredMeasurementLogs.length - 1] ?? null;
    const latestMetricWeight = toNumber(latestHealthMetricEntry?.weightKg);
    const latestMeasurementWeight = toNumber(latestMeasurementEntry?.weightKg);
    const currentWeight = latestMeasurementWeight ?? latestMetricWeight;
    const hasCurrentWeight = currentWeight !== null;
    const weightSeries = filteredHealthMetrics
        ?.map((metric) => ({
            date: formatDateLabel(metric.recordedAt),
            weight: toNumber(metric.weightKg),
            recordedAt: metric.recordedAt,
        }))
        .filter((item): item is { date: string; weight: number; recordedAt: string } => item.weight !== null) ?? [];
    const chartWeightData = weightSeries.map((item, index, items) => {
        const windowItems = items.slice(Math.max(0, index - 2), index + 1);
        const trend = windowItems.reduce((sum, entry) => sum + entry.weight, 0) / windowItems.length;
        return {
            date: item.date,
            weight: item.weight,
            trend: Number(trend.toFixed(1)),
        };
    });
    const startWeight = weightSeries[0]?.weight ?? currentWeight ?? null;
    const targetWeight = toNumber(overview?.patient?.targetWeightKg) ?? currentWeight ?? null;
    const weightLost = startWeight !== null && currentWeight !== null ? Math.max(0, startWeight - currentWeight) : null;
    const totalToLose = startWeight !== null && targetWeight !== null ? Math.max(1, startWeight - targetWeight) : null;
    const progressPercent =
        weightLost !== null && totalToLose !== null
            ? Math.max(0, Math.min(100, Math.round((weightLost / totalToLose) * 100)))
            : null;

    // Goal Prediction Logic
    const predictGoal = (current: number, target: number, changePerDay: number) => {
        return Math.ceil((current - target) / changePerDay);
    };
    const estimatedDays = currentWeight !== null && targetWeight !== null && currentWeight > targetWeight
        ? predictGoal(currentWeight, targetWeight, 0.16)
        : null;

    // Insights logic
    const measurementLogs = filteredMeasurementLogs;
    const avgCalories = measurementLogs.length
        ? Math.round(measurementLogs.reduce((sum, item) => sum + (item.caloriesKcal ?? 0), 0) / measurementLogs.length)
        : null;
    const targetCalories = 1500;
    const calorieDiff = avgCalories !== null ? avgCalories - targetCalories : null;
    const uniqueLogDays = new Set(measurementLogs.map((item) => item.recordedAt.slice(0, 10))).size;
    const consistency = uniqueLogDays ? Math.min(100, Math.round((uniqueLogDays / selectedRangeDays) * 100)) : null;
    const sortedLogDays = [...new Set(measurementLogs.map((item) => item.recordedAt.slice(0, 10)))].sort().reverse();
    let streak = 0;
    let cursor = new Date();
    for (const day of sortedLogDays) {
        const expected = cursor.toISOString().slice(0, 10);
        if (day !== expected) break;
        streak += 1;
        cursor.setDate(cursor.getDate() - 1);
    }
    const caloriesChartData = Array.from(
        measurementLogs.reduce((map, item) => {
            const dateKey = item.recordedAt.slice(0, 10);
            const current = map.get(dateKey);

            if (!current || new Date(item.recordedAt) > new Date(current.recordedAt)) {
                map.set(dateKey, item);
            }

            return map;
        }, new Map<string, typeof measurementLogs[number]>()),
    )
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-7)
        .map(([, item]) => ({
            day: new Date(item.recordedAt).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
            intake: item.caloriesKcal ?? 0,
            burn: Math.max((item.caloriesKcal ?? 0) + 300, 0),
        }));
    const latestPhoto = filteredRecentPhotos[0]?.imageUrl ?? null;
    const previousPhoto = filteredRecentPhotos[1]?.imageUrl ?? null;
    const latestPhotoDate = filteredRecentPhotos[0]?.createdAt;
    const previousPhotoDate = filteredRecentPhotos[1]?.createdAt;
    const previousWeight = weightSeries.length > 1 ? weightSeries[weightSeries.length - 2].weight : null;
    const weightDelta =
        currentWeight !== null && previousWeight !== null
            ? Number((currentWeight - previousWeight).toFixed(1))
            : null;
    const currentHeight = toNumber(latestHealthMetricEntry?.heightCm);
    const currentBodyFat = toNumber(latestMeasurementEntry?.bodyFatPercent);
    const currentWaterMl = latestMeasurementEntry?.waterMl ?? null;
    const currentSteps = latestMeasurementEntry?.stepsCount ?? null;
    const currentSleepHours = toNumber(latestMeasurementEntry?.sleepHours);
    const currentActivityLevel = normalizeActivityLevel(latestHealthMetricEntry?.activityLevel ?? overview?.patient?.activityLevel);
    const bmi = currentHeight && currentWeight !== null ? currentWeight / Math.pow(currentHeight / 100, 2) : null;
    const bmr = currentWeight !== null ? Math.round(currentWeight * 24) : null;
    const tdee = bmr ? Math.round(bmr * getActivityMultiplier(currentActivityLevel)) : null;
    const loggedWorkoutDays = uniqueLogDays;
    const estimatedMinutes = loggedWorkoutDays * 45;
    const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.email || 'WellMate User';
    const profileImageUrl = user?.profileImageUrl || 'https://i.pravatar.cc/150?u=wellmate-progress';
    const modalDefaultData = {
        chest: selectedMeasurement.chest !== '-' ? selectedMeasurement.chest : undefined,
        arm: selectedMeasurement.arm !== '-' ? selectedMeasurement.arm : undefined,
        waist: selectedMeasurement.waist !== '-' ? selectedMeasurement.waist : undefined,
        hipe: selectedMeasurement.hipe !== '-' ? selectedMeasurement.hipe : undefined,
        thigh: selectedMeasurement.thigh !== '-' ? selectedMeasurement.thigh : undefined,
        weight: currentWeight !== null ? `${formatNumber(currentWeight)} kg` : undefined,
        height: currentHeight !== null ? `${formatNumber(currentHeight)} cm` : undefined,
        targetWeight: overview?.patient?.targetWeightKg ? `${formatNumber(toNumber(overview.patient.targetWeightKg))} kg` : undefined,
        bodyFat: currentBodyFat !== null ? `${formatNumber(currentBodyFat)}%` : undefined,
        calories: latestMeasurementEntry?.caloriesKcal ? `${latestMeasurementEntry.caloriesKcal} kcal` : undefined,
        water: currentWaterMl ? `${currentWaterMl} ml` : undefined,
        steps: currentSteps ? `${currentSteps} steps` : undefined,
        sleepHours: currentSleepHours !== null ? `${formatNumber(currentSleepHours)} hr` : undefined,
        activityLevel: formatActivityLevel(currentActivityLevel) !== '-' ? formatActivityLevel(currentActivityLevel) : undefined,
    };
    const historyItems = weightSeries.slice(-5).reverse().map((item) => {
        const heightForItem = currentHeight;
        const bmiValue = heightForItem ? item.weight / Math.pow(heightForItem / 100, 2) : null;
        return {
            date: item.date,
            weight: item.weight,
            bmi: bmiValue,
            status: bmiValue !== null && bmiValue < 25 ? 'ปกติ' : 'ต้องติดตาม',
        };
    });

    return (
        <div className={embedded ? "flex-1 min-h-screen bg-[#fffbf5] text-zinc-800 font-sans overflow-hidden relative" : "flex min-h-screen bg-[#fffbf5] text-zinc-800 font-sans overflow-hidden relative"}>
            {!embedded && <Sidebar />}
            {/* ── Sidebar ────────────────────────────────────────── */}
            <div className="hidden w-64 flex-shrink-0 border-r border-zinc-100 flex-col justify-between py-6 px-4 bg-white z-10 overflow-y-auto">
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
                        <NavItem icon={<MessageSquare size={20} />} label="ข้อความ" href="/dashboard/chat" />
                        <NavItem icon={<Salad size={20} />} label="เมนูสุขภาพ" onClick={() => alert("เมนูสุขภาพ Feature Coนาทีg Soon!")} />
                        <NavItem icon={<Utensils size={20} />} label="แผนการกิน" onClick={() => alert("แผนการกิน Feature Coนาทีg Soon!")} />
                        <NavItem icon={<BookOpen size={20} />} label="บันทึกอาหาร" href="/tracking" />
                        <NavItem icon={<TrendingUp size={20} />} label="ติดตามผล" active={true} href="/dashboard/progress" />
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
            <main className={`flex-1 overflow-y-auto bg-[#FCF9F5] px-8 py-6 ${embedded ? "" : "ml-64"}`}>

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

                        <div>
                        <button onClick={() => alert("Notifications:\n- Remember to log your dinner!\n- 3 วัน streak! 🔥")} className="p-2 text-zinc-400 hover:bg-white rounded-full transition-colors focus:outline-none relative bg-white/50 border border-transparent hover:border-zinc-200">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#FCF9F5]"></span>
                        </button>

                        </div>
                        {/* Profile Dropdown */}
                        <div className="relative">
                            <div onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center gap-3 ml-2 cursor-pointer p-1.5 pr-4 rounded-full bg-white border border-zinc-200 shadow-sm hover:bg-zinc-50 transition-colors">
                                <div className="w-8 h-8 bg-zinc-200 rounded-full overflow-hidden">
                                    <img src={profileImageUrl} alt="User" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-zinc-800 leading-tight">{displayName}</span>
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
                {saveError && (
                    <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {saveError}
                    </div>
                )}

                {isLoading && (
                    <div className="mb-6 rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-500">
                        Loading progress data...
                    </div>
                )}

                <div className="flex flex-col xl:flex-row gap-6 mb-6">
                    {/* Left: Body Model */}
                    <div className="flex-[3] bg-[#FCF9F5] border-2 border-dashed border-[#e4dccf] rounded-3xl relative pt-4 pl-4 h-[350px] flex items-center justify-center">
                        <div className="absolute top-4 left-4 z-20">
                            <button
                                onClick={() => setShowBodyDropdown(!showBodyDropdown)}
                                className="flex items-center gap-2 bg-[#BCE875] px-4 py-1.5 rounded-xl font-medium text-zinc-800 text-xs hover:bg-[#aade5e] transition-colors"
                            >
                                {selectedMeasurement.week || 'Latest entry'} <ChevronDown size={14} />
                            </button>
                            {showBodyDropdown && (
                                <div className="absolute top-10 left-0 min-w-[10rem] bg-white rounded-xl shadow-lg border border-zinc-100 overflow-hidden z-30">
                                    {measurementEntries.length ? measurementEntries.map((item) => (
                                        <div key={item.value} className="px-3 py-2 text-xs text-zinc-700 hover:bg-zinc-50 cursor-pointer" onClick={() => { setBodyTimeframe(item.value); setShowBodyDropdown(false); }}>
                                            {item.week}
                                        </div>
                                    )) : (
                                        <div className="px-3 py-2 text-xs text-zinc-500">
                                            No measurement history
                                        </div>
                                    )}
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
                                <span className="font-bold mr-2 text-[#F7931E]">Chest</span>
                                <span className="w-8 font-bold text-zinc-900 text-center">{selectedMeasurement.chest}</span>
                                <span className="text-[9px] text-zinc-400">cm</span>
                            </div>
                            <div className="absolute top-[42%] left-[0%] md:left-[5%] text-[10px] text-zinc-700 flex items-center bg-white shadow-sm border border-zinc-100 px-3 py-1.5 rounded-3xl z-10">
                                <span className="font-bold mr-2 text-[#F7931E]">Arm</span>
                                <span className="w-8 font-bold text-zinc-900 text-center">{selectedMeasurement.arm}</span>
                                <span className="text-[9px] text-zinc-400">cm</span>
                            </div>
                            <div className="absolute top-[47%] right-[0%] md:right-[15%] text-[10px] text-zinc-700 flex items-center bg-white shadow-sm border border-zinc-100 px-3 py-1.5 rounded-3xl z-10">
                                <span className="font-bold mr-2 text-[#F7931E]">Waist</span>
                                <span className="w-8 font-bold text-zinc-900 text-center">{selectedMeasurement.waist}</span>
                                <span className="text-[9px] text-zinc-400">cm</span>
                            </div>
                            <div className="absolute top-[60%] left-[2%] md:left-[10%] text-[10px] text-zinc-700 flex items-center bg-white shadow-sm border border-zinc-100 px-3 py-1.5 rounded-3xl z-10">
                                <span className="font-bold mr-2 text-[#F7931E]">Hips</span>
                                <span className="w-9 font-bold text-zinc-900 text-center">{selectedMeasurement.hipe}</span>
                                <span className="text-[9px] text-zinc-400">cm</span>
                            </div>
                            <div className="absolute bottom-[20%] right-[3%] md:right-[15%] text-[10px] text-zinc-700 flex items-center bg-white shadow-sm border border-zinc-100 px-3 py-1.5 rounded-3xl z-10">
                                <span className="font-bold mr-2 text-[#F7931E]">Thigh</span>
                                <span className="w-8 font-bold text-zinc-900 text-center">{selectedMeasurement.thigh}</span>
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
                                    <span>{previousPhotoDate ? formatDateLabel(previousPhotoDate) : 'No previous photo'}</span>
                                    <span className="font-bold text-zinc-800 text-xs">{previousWeight !== null ? formatNumber(previousWeight) : '-'} <span className="font-normal text-[10px]">kg</span></span>
                                </div>
                                <div className="w-full flex-1 bg-zinc-300 rounded-xl overflow-hidden relative group cursor-pointer">
                                    {previousPhoto ? (
                                        <img src={previousPhoto} alt="Previous progress" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-center text-xs font-medium text-zinc-500">
                                            No previous photo
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex-1 bg-[#F5EBE1] rounded-2xl p-3 flex flex-col items-center relative group cursor-pointer transition-all hover:ring-2 hover:ring-[#BCE875]" onClick={() => setShowModal(true)}>
                                <div className="flex justify-between w-full text-[10px] text-zinc-600 font-medium mb-2">
                                    <span className="text-[#BCE875] font-bold">{latestPhotoDate ? formatDateLabel(latestPhotoDate) : 'Latest'}</span>
                                    <span className="font-bold text-zinc-800 text-xs">{currentWeight !== null ? formatNumber(currentWeight) : '-'} <span className="font-normal text-[10px]">kg</span></span>
                                </div>
                                <div className="w-full flex-1 rounded-xl overflow-hidden relative flex flex-col justify-center items-center bg-zinc-100 border-2 border-dashed border-zinc-300">
                                    {latestPhoto ? (
                                        <img src={latestPhoto} alt="Upload" className="w-full h-full object-cover" />
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 mb-6">
                    <div className="bg-white rounded-3xl p-5 border border-zinc-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                        <div className="flex justify-between items-start mb-2">
                            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-500 flex items-center justify-center">
                                <TrendingDown size={20} />
                            </div>
                            <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">{weightLost !== null ? `-${formatNumber(weightLost)} kg` : 'No data'}</span>
                        </div>
                        <p className="text-sm text-zinc-500 font-medium mt-3 mb-0.5">น้ำหนักปัจจุบัน</p>
                        <div className="flex items-end gap-1">
                            <h3 className="text-2xl font-black text-zinc-800">{currentWeight !== null ? formatNumber(currentWeight) : '-'}</h3>
                            <span className="text-sm text-zinc-400 font-medium mb-1">kg</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-3xl p-5 border border-zinc-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                        <div className="flex justify-between items-start mb-2">
                            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-500 flex items-center justify-center">
                                <Target size={20} />
                            </div>
                            <span className="bg-[#BCE875] text-zinc-800 text-xs font-bold px-2.5 py-1 rounded-full">{progressPercent !== null ? `${progressPercent}%` : 'No target'}</span>
                        </div>
                        <p className="text-sm text-zinc-500 font-medium mt-3 mb-0.5">Target ติดตามผล</p>
                        <div className="flex items-end gap-1">
                            <h3 className="text-2xl font-black text-zinc-800">{targetWeight !== null ? formatNumber(targetWeight) : '-'}</h3>
                            <span className="text-sm text-zinc-400 font-medium mb-1">kg</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-3xl p-5 border border-zinc-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                        <div className="flex justify-between items-start mb-2">
                            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-500 flex items-center justify-center">
                                <Flame size={20} />
                            </div>
                            <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">{calorieDiff !== null ? `${calorieDiff > 0 ? `+${calorieDiff}` : calorieDiff} kcal` : 'No logs'}</span>
                        </div>
                        <p className="text-sm text-zinc-500 font-medium mt-3 mb-0.5">แคลอรีเฉลี่ย</p>
                        <div className="flex items-end gap-1">
                            <h3 className="text-2xl font-black text-zinc-800">{avgCalories ?? '-'}</h3>
                            <span className="text-sm text-zinc-400 font-medium mb-1">/ วัน</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-3xl p-5 border border-zinc-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                        <div className="flex justify-between items-start mb-2">
                            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-500 flex items-center justify-center">
                                <Activity size={20} />
                            </div>
                            <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2.5 py-1 rounded-full">{loggedWorkoutDays > 0 ? 'Synced' : 'No logs'}</span>
                        </div>
                        <p className="text-sm text-zinc-500 font-medium mt-3 mb-0.5">ความสม่ำเสมอ</p>
                        <div className="flex items-end gap-1">
                            <h3 className="text-2xl font-black text-zinc-800">{consistency !== null ? `${consistency}%` : '-'}</h3>
                        </div>
                    </div>
                    <div className="bg-white rounded-3xl p-5 border border-zinc-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                        <div className="flex justify-between items-start mb-2">
                            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                <Footprints size={20} />
                            </div>
                            <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">
                                {currentSteps === null ? 'No data' : currentSteps >= 8000 ? 'On track' : 'Keep going'}
                            </span>
                        </div>
                        <p className="text-sm text-zinc-500 font-medium mt-3 mb-0.5">ก้าวเดินล่าสุด</p>
                        <div className="flex items-end gap-1">
                            <h3 className="text-2xl font-black text-zinc-800">{currentSteps !== null ? currentSteps.toLocaleString() : '-'}</h3>
                            <span className="text-sm text-zinc-400 font-medium mb-1">steps</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-3xl p-5 border border-zinc-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                        <div className="flex justify-between items-start mb-2">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                <BedDouble size={20} />
                            </div>
                            <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full">
                                {currentSleepHours === null ? 'No data' : currentSleepHours >= 7 ? 'Recovered' : 'Need rest'}
                            </span>
                        </div>
                        <p className="text-sm text-zinc-500 font-medium mt-3 mb-0.5">เวลานอนล่าสุด</p>
                        <div className="flex items-end gap-1">
                            <h3 className="text-2xl font-black text-zinc-800">{currentSleepHours !== null ? formatNumber(currentSleepHours) : '-'}</h3>
                            <span className="text-sm text-zinc-400 font-medium mb-1">hr</span>
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
                        {chartWeightData.length ? <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartWeightData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#a1a1aa' }} dy={10} />
                                <YAxis domain={['dataMin - 1', 'dataMax + 1']} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#a1a1aa' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ fontSize: '13px', fontWeight: 'bold' }}
                                />
                                {targetWeight !== null && <ReferenceLine y={targetWeight} stroke="#f87171" strokeDasharray="3 3" label={{ position: 'right', value: 'Target', fill: '#f87171', fontSize: 12, fontWeight: 'bold' }} />}

                                <Line type="monotone" dataKey="trend" name="แนวโน้ม" stroke="#BCE875" strokeWidth={3} dot={false} activeDot={false} />
                                <Line type="monotone" dataKey="weight" name="จริง" stroke="#F7931E" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer> : <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 text-sm text-zinc-500">No weight history yet</div>}
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
                                    <p className="text-sm font-black text-zinc-800">{avgCalories ?? '-'} <span className="text-[10px] text-zinc-500 font-medium">kcal</span></p>
                                </div>
                                <div className="text-center px-4 py-2 bg-zinc-50 rounded-xl border border-zinc-100">
                                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-1">สถานะ</p>
                                    <p className={`text-sm font-black ${calorieDiff !== null && calorieDiff > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                        {calorieDiff !== null ? (calorieDiff > 0 ? `+${calorieDiff}` : calorieDiff) : '-'} <span className="text-[10px] text-zinc-500 font-medium">kcal</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="h-[220px] w-full mt-2">
                            {caloriesChartData.length ? <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={caloriesChartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }} barGap={2}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#a1a1aa' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#a1a1aa' }} />
                                    <Tooltip cursor={{ fill: '#f4f4f5', opacity: 0.4 }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                    <ReferenceLine y={targetCalories} stroke="#f87171" strokeDasharray="3 3" />
                                    <Bar dataKey="intake" name="รับเข้า" fill="#F7931E" radius={[4, 4, 0, 0]} barSize={14} />
                                    <Bar dataKey="burn" name="เผาผลาญ" fill="#BCE875" radius={[4, 4, 0, 0]} barSize={14} />
                                </BarChart>
                            </ResponsiveContainer> : <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 text-sm text-zinc-500">No calorie history yet</div>}
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
                                    <p className="text-xl font-black text-zinc-800">{loggedWorkoutDays} <span className="text-xs text-zinc-400 font-medium">วัน</span></p>
                                </div>
                                <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                                    <p className="text-xs text-zinc-500 font-medium mb-1">เวลาทั้งหมด</p>
                                    <p className="text-xl font-black text-zinc-800">{estimatedMinutes} <span className="text-xs text-zinc-400 font-medium">นาที</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5. Targets & 6. Insights ──────────────────────────────── */}
                <div className="flex flex-col xl:flex-row gap-6">
                    <div className="flex-[2] bg-white rounded-3xl p-6 border border-zinc-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                        <h2 className="text-lg font-bold text-zinc-800 mb-1">Target ติดตามผล</h2>
                        <p className="text-xs text-zinc-500 font-medium mb-6">เส้นทางสู่Target {targetWeight !== null ? `${formatNumber(targetWeight)} kg` : '-'}</p>

                        <div className="flex justify-between items-end mb-2 px-1">
                            <div className="text-center">
                                <span className="block text-[10px] text-zinc-400 font-bold uppercase tracking-wider">เริ่มต้น</span>
                                <span className="text-sm font-bold text-zinc-400">{startWeight !== null ? `${formatNumber(startWeight)}kg` : '-'}</span>
                            </div>
                            <div className="text-center">
                                <span className="block text-[10px] text-zinc-800 font-bold uppercase tracking-wider mb-1">ปัจจุบัน</span>
                                <div className="bg-[#18181b] text-white px-3 py-1 rounded-lg">
                                    <span className="text-base font-black">{currentWeight !== null ? `${formatNumber(currentWeight)}kg` : '-'}</span>
                                </div>
                            </div>
                            <div className="text-center">
                                <span className="block text-[10px] text-green-600 font-bold uppercase tracking-wider">Target</span>
                                <span className="text-sm font-bold text-green-600">{targetWeight !== null ? `${formatNumber(targetWeight)}kg` : '-'}</span>
                            </div>
                        </div>

                        <div className="relative w-full h-4 bg-zinc-100 rounded-full overflow-hidden mb-6 border border-zinc-200">
                            <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#deff9e] to-[#99d628] rounded-full transition-all duration-1000" style={{ width: `${progressPercent ?? 0}%` }}></div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-[#F5EBE1]/50 rounded-2xl border border-[#F5EBE1]">
                            <span className="text-sm font-bold text-zinc-700">เหลืออีก</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-black text-orange-500">{currentWeight !== null && targetWeight !== null ? Math.max(0, Number((currentWeight - targetWeight).toFixed(1))) : '-'}</span>
                                <span className="text-sm text-zinc-500 font-bold">kg</span>
                            </div>
                        </div>

                        <div className="mt-3 flex items-center justify-center gap-2 p-3 bg-[#f0fde4] border border-[#cef0a6] rounded-2xl">
                            <span className="text-lg">📅</span>
                            <p className="font-bold text-[#629723] text-sm">{estimatedDays !== null ? `บรรลุเป้าหมายในอีก ${estimatedDays} วัน` : 'ยังไม่มีข้อมูลพอสำหรับคำนวณ'}</p>
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
                            {avgCalories !== null && avgCalories > targetCalories && (
                                <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                                    <AlertCircle className="text-red-400 mt-0.5" size={18} />
                                    <div>
                                        <h4 className="text-sm font-bold text-white mb-1">Caloric Surplus Detected</h4>
                                        <p className="text-xs text-red-200/80 leading-relaxed">
                                            คุณทานอาหารเกินเป้าหมายเฉลี่ย <span className="text-red-400 font-bold">{calorieDiff ?? '-'} kcal</span> จากข้อมูลที่บันทึกล่าสุด ลองลดของหวานหรือมื้อดึกลงเล็กน้อยเพื่อให้ตัวเลขกลับมาใกล้เป้ามากขึ้น
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
                                            คุณบันทึกข้อมูลต่อเนื่อง {streak} วันติดกันแล้ว ทำให้ WellMate มองเห็นแนวโน้มได้แม่นขึ้น และช่วยประเมินความคืบหน้าได้ดีขึ้นเรื่อย ๆ
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-start gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl">
                                <TrendingUp className="text-blue-400 mt-0.5" size={18} />
                                <div>
                                    <h4 className="text-sm font-bold text-white mb-1">Weight แนวโน้ม Analysis</h4>
                                    <p className="text-xs text-zinc-300 leading-relaxed">
                                        {weightDelta !== null ? <>น้ำหนักล่าสุด{weightDelta <= 0 ? 'ลดลง' : 'เพิ่มขึ้น'} <span className="text-[#BCE875] font-bold">{formatNumber(Math.abs(weightDelta))} kg</span> เทียบกับการบันทึกก่อนหน้า และค่า activity level ตอนนี้คือ {formatActivityLevel(currentActivityLevel)}</> : <>ยังไม่มีน้ำหนักย้อนหลังเพียงพอสำหรับเปรียบเทียบ แต่ค่า activity level ปัจจุบันคือ {formatActivityLevel(currentActivityLevel)}</>}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </main>

            {/* Advanced Stats Drawer overlay */}
            <AdvancedStatsDrawer
                isOpen={showAdvanced}
                onClose={() => setShowAdvanced(false)}
                caloriesChartData={caloriesChartData}
                targetCalories={targetCalories}
                avgCalories={avgCalories}
                currentWeight={currentWeight}
                currentHeight={currentHeight}
                currentBodyFat={currentBodyFat}
                currentWaterMl={currentWaterMl}
                bmi={bmi}
                bmr={bmr}
                tdee={tdee}
                currentActivityLevel={currentActivityLevel}
                historyItems={historyItems}
            />

            {/* Update Progress Modal */}
            {showModal && <UpdateProgressModal onClose={() => setShowModal(false)} onSave={handleModalSave} defaultData={modalDefaultData} />}
        </div>
    );
}

