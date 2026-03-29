"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    Building2,
    Clock3,
    Calendar,
    Store,
    UtensilsCrossed,
    FileText,
    Image,
    ImageUp,
    MapPin,
    Phone,
    Plus,
    UploadCloud,
    Wallet,
} from "lucide-react";
import api from "@/lib/api";
import Swal from "sweetalert2";

type Category =
    | "อาหารคลีน"
    | "คีโต"
    | "มังสวิรัติ"
    | "วีแกน"
    | "อาหารสุขภาพทั่วไป";

type DayKey =
    | "mon"
    | "tue"
    | "wed"
    | "thu"
    | "fri"
    | "sat"
    | "sun";

type DaySchedule = {
    day: string;
    open: boolean;
    slots: { start: string; end: string }[];
};

type HolidayClosure = {
    date: string;
    reason?: string | null;
};

type OpeningSlotResponse = {
    startTime: string;
    endTime: string;
    sequence?: number | null;
};

type OpeningHourResponse = {
    dayOfWeek: number;
    isOpen: boolean;
    slots: OpeningSlotResponse[];
};

type FoodPartnerProfileResponse = {
    partnerName?: string | null;
    description?: string | null;
    addressLine1?: string | null;
    addressLine2?: string | null;
    subdistrict?: string | null;
    district?: string | null;
    province?: string | null;
    postalCode?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    contactPhone?: string | null;
    contactEmail?: string | null;
    lineId?: string | null;
    socialLink?: string | null;
    logoUrl?: string | null;
    coverImageUrl?: string | null;
    categories?: string[] | null;
    storeOnline?: boolean | null;
    pauseUntil?: string | null;
    holidayClosures?: HolidayClosure[] | null;
    bankName?: string | null;
    bankAccountNo?: string | null;
    bankAccountName?: string | null;
    bankDocumentUrl?: string | null;
    businessDocumentUrl?: string | null;
    openingHours?: OpeningHourResponse[] | null;
};

type ApiEnvelope<T> = {
    success: boolean;
    data: T;
    message?: string;
};

const CATEGORIES: Category[] = [
    "อาหารคลีน",
    "คีโต",
    "มังสวิรัติ",
    "วีแกน",
    "อาหารสุขภาพทั่วไป",
];

const DEFAULT_SCHEDULE: Record<DayKey, DaySchedule> = {
    mon: { day: "จันทร์", open: true, slots: [{ start: "08:00", end: "14:00" }] },
    tue: { day: "อังคาร", open: true, slots: [{ start: "08:00", end: "14:00" }] },
    wed: { day: "พุธ", open: true, slots: [{ start: "08:00", end: "14:00" }] },
    thu: { day: "พฤหัสบดี", open: true, slots: [{ start: "08:00", end: "14:00" }] },
    fri: { day: "ศุกร์", open: true, slots: [{ start: "08:00", end: "14:00" }] },
    sat: {
        day: "เสาร์",
        open: true,
        slots: [
            { start: "08:00", end: "14:00" },
            { start: "16:00", end: "20:00" },
        ],
    },
    sun: { day: "อาทิตย์", open: false, slots: [] },
};

const HOLIDAYS = [
    { date: "13 เม.ย. 2026", reason: "เทศกาลสงกรานต์" },
    { date: "14 เม.ย. 2026", reason: "หยุดพักทีมครัว" },
];

const PAUSE_OPTIONS = [
    { label: "พัก 30 นาที", minutes: 30 },
    { label: "พัก 1 ชั่วโมง", minutes: 60 },
    { label: "พักจนถึงสิ้นวัน", minutes: 0 },
];

const DAY_KEYS_BY_INDEX: Record<number, DayKey> = {
    0: "sun",
    1: "mon",
    2: "tue",
    3: "wed",
    4: "thu",
    5: "fri",
    6: "sat",
};

const DAY_INDEX_BY_KEY: Record<DayKey, number> = {
    sun: 0,
    mon: 1,
    tue: 2,
    wed: 3,
    thu: 4,
    fri: 5,
    sat: 6,
};

const formatHolidayDate = (value: string) => {
    if (!value) return value;
    if (!/^\d{4}-\d{2}-\d{2}/.test(value)) return value;
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return new Intl.DateTimeFormat("th-TH-u-ca-gregory", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(parsed);
};


function SectionHeader({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-[#f7efe1] p-3 text-[#7b6a55]">{icon}</div>
                <div>
                    <p className="text-base font-black text-[#2f2a1d]">{title}</p>
                    <p className="text-xs text-[#6b5d4b]">{desc}</p>
                </div>
            </div>
        </div>
    );
}

function Field({
    label,
    hint,
    icon,
    children,
}: {
    label: string;
    hint?: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-2">
            <div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#6b5d4b]">
                    {icon && (
                        <span className="flex h-6 w-6 items-center justify-center rounded-xl bg-[#f7efe1] text-[#7b6a55]">
                            {icon}
                        </span>
                    )}
                    <span>{label}</span>
                </div>
                {hint && <p className="text-[11px] text-[#8c7a66]">{hint}</p>}
            </div>
            {children}
        </div>
    );
}

function TextInput({
    placeholder,
    value,
    onChange,
}: {
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            className="w-full rounded-2xl border border-[#eadfce] bg-white px-4 py-3 text-sm text-[#2f2a1d] shadow-sm outline-none transition focus:border-[#cbb89f] focus:ring-2 focus:ring-[#f4ead8]"
        />
    );
}

function Toggle({
    on,
    onClick,
    label,
    description,
}: {
    on: boolean;
    onClick: () => void;
    label: string;
    description: string;
}) {
    return (
        <button
            onClick={onClick}
            className="flex w-full items-center justify-between gap-4 rounded-2xl border border-[#eadfce] bg-white px-4 py-3 text-left shadow-sm"
        >
            <div>
                <p className="text-sm font-black text-[#2f2a1d]">{label}</p>
                <p className="text-xs text-[#6b5d4b]">{description}</p>
            </div>
            <div
                className={`relative inline-flex h-7 w-14 items-center rounded-full border ${
                    on ? "border-[#2f7d57] bg-[#2f7d57]" : "border-[#d8cbb6] bg-[#ece4d7]"
                }`}
            >
                <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition ${
                        on ? "translate-x-7" : "translate-x-1"
                    }`}
                />
            </div>
        </button>
    );
}

export default function FoodPartnerProfilePage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [storeOnline, setStoreOnline] = useState(true);
    const [pauseMinutes, setPauseMinutes] = useState<number | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [schedule, setSchedule] = useState<Record<DayKey, DaySchedule>>(DEFAULT_SCHEDULE);
    const [holidayClosures, setHolidayClosures] = useState<HolidayClosure[]>(HOLIDAYS);
    const [newHoliday, setNewHoliday] = useState({ date: "", reason: "" });
    const [isUploading, setIsUploading] = useState(false);
    const logoInputRef = useRef<HTMLInputElement | null>(null);
    const coverInputRef = useRef<HTMLInputElement | null>(null);
    const bankDocInputRef = useRef<HTMLInputElement | null>(null);
    const businessDocInputRef = useRef<HTMLInputElement | null>(null);
    const [form, setForm] = useState({
        partnerName: "",
        description: "",
        addressLine1: "",
        addressSoi: "",
        addressRoad: "",
        subdistrict: "",
        district: "",
        province: "",
        postalCode: "",
        latitude: "",
        longitude: "",
        contactPhone: "",
        contactEmail: "",
        lineId: "",
        socialLink: "",
        logoUrl: "",
        coverImageUrl: "",
        bankName: "",
        bankAccountNo: "",
        bankAccountName: "",
        bankDocumentUrl: "",
        businessDocumentUrl: "",
    });

    const pauseLabel = useMemo(() => {
        if (pauseMinutes === null) return "ร้านเปิดให้รับออเดอร์ตามปกติ";
        if (pauseMinutes === 0) return "พักออเดอร์จนถึงสิ้นวัน";
        return `พักออเดอร์ชั่วคราว ${pauseMinutes} นาที`;
    }, [pauseMinutes]);

    const handleFormChange = (key: keyof typeof form, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const toggleCategory = (item: Category) => {
        setCategories((prev) =>
            prev.includes(item) ? prev.filter((value) => value !== item) : [...prev, item],
        );
    };

    const applyOpeningHours = (openingHours?: OpeningHourResponse[] | null) => {
        if (!openingHours || openingHours.length === 0) return;
        setSchedule((prev) => {
            const next = { ...prev };
            for (const day of openingHours) {
                const key = DAY_KEYS_BY_INDEX[day.dayOfWeek];
                if (!key) continue;
                next[key] = {
                    ...next[key],
                    open: day.isOpen,
                    slots: (day.slots ?? []).map((slot) => ({
                        start: slot.startTime,
                        end: slot.endTime,
                    })),
                };
            }
            return next;
        });
    };

    const derivePauseMinutes = (pauseUntil?: string | null) => {
        if (!pauseUntil) return null;
        const until = new Date(pauseUntil);
        if (Number.isNaN(until.getTime())) return null;
        const now = new Date();
        const diffMs = until.getTime() - now.getTime();
        if (diffMs <= 0) return null;
        const diffMinutes = Math.round(diffMs / 60000);
        const isEndOfDay =
            until.getHours() === 23 && until.getMinutes() >= 50 && until.toDateString() === now.toDateString();
        if (isEndOfDay) return 0;
        if (diffMinutes <= 45) return 30;
        if (diffMinutes <= 90) return 60;
        return null;
    };

    const toNumberOrNull = (value: string) => {
        if (value.trim() === "") return null;
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : null;
    };

    const toNumberOrUndefined = (value: string) => {
        const parsed = toNumberOrNull(value);
        return parsed === null ? undefined : parsed;
    };

    const toOptionalString = (value: string) => {
        const trimmed = value.trim();
        return trimmed === "" ? undefined : trimmed;
    };

    const buildPauseUntil = (minutes: number | null) => {
        if (minutes === null) return null;
        const now = new Date();
        if (minutes === 0) {
            const endOfDay = new Date(now);
            endOfDay.setHours(23, 59, 59, 999);
            return endOfDay.toISOString();
        }
        return new Date(now.getTime() + minutes * 60000).toISOString();
    };

    const addHoliday = () => {
        const date = newHoliday.date.trim();
        const reason = newHoliday.reason.trim();
        if (!date) return;
        setHolidayClosures((prev) => {
            if (prev.some((item) => item.date === date)) return prev;
            return [...prev, { date, reason: reason || undefined }];
        });
        setNewHoliday({ date: "", reason: "" });
    };

    const removeHoliday = (date: string) => {
        setHolidayClosures((prev) => prev.filter((item) => item.date !== date));
    };

    const unwrap = <T,>(payload: ApiEnvelope<T> | T): T => {
        if (payload && typeof payload === "object" && "data" in payload) {
            return (payload as ApiEnvelope<T>).data;
        }
        return payload as T;
    };

    const uploadAsset = async (endpoint: string, file: File, onSuccess: (url: string) => void) => {
        const formData = new FormData();
        formData.append("file", file);
        setIsUploading(true);
        try {
            const res = await api.post<ApiEnvelope<{ url: string }> | { url: string }>(endpoint, formData);
            const data = unwrap(res.data);
            if (data?.url) {
                onSuccess(data.url);
            }
        } catch (error) {
            console.error("Upload failed:", error);
            Swal.fire({
                icon: "error",
                title: "Upload failed",
                text: "Unable to upload file. Please try again.",
                confirmButtonColor: "#3d3522",
                background: "#fffbf5",
            });
        } finally {
            setIsUploading(false);
        }
    };

    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            try {
                const res = await api.get<ApiEnvelope<FoodPartnerProfileResponse> | FoodPartnerProfileResponse>(
                    "/foodpartner_system/profile",
                );
                const data = unwrap(res.data) || {};
                const addressLine2 = data.addressLine2 ?? "";
                const hasDivider = addressLine2.includes(" | ");
                const [soi, road] = hasDivider ? addressLine2.split(" | ") : [addressLine2, ""];
                setForm({
                    partnerName: data.partnerName ?? "",
                    description: data.description ?? "",
                    addressLine1: data.addressLine1 ?? "",
                    addressSoi: soi ?? "",
                    addressRoad: road ?? "",
                    subdistrict: data.subdistrict ?? "",
                    district: data.district ?? "",
                    province: data.province ?? "",
                    postalCode: data.postalCode ?? "",
                    latitude: data.latitude !== null && data.latitude !== undefined ? String(data.latitude) : "",
                    longitude: data.longitude !== null && data.longitude !== undefined ? String(data.longitude) : "",
                    contactPhone: data.contactPhone ?? "",
                    contactEmail: data.contactEmail ?? "",
                    lineId: data.lineId ?? "",
                    socialLink: data.socialLink ?? "",
                    logoUrl: data.logoUrl ?? "",
                    coverImageUrl: data.coverImageUrl ?? "",
                    bankName: data.bankName ?? "",
                    bankAccountNo: data.bankAccountNo ?? "",
                    bankAccountName: data.bankAccountName ?? "",
                    bankDocumentUrl: data.bankDocumentUrl ?? "",
                    businessDocumentUrl: data.businessDocumentUrl ?? "",
                });
                setCategories(
                    Array.isArray(data.categories)
                        ? (data.categories.filter(Boolean) as Category[])
                        : [],
                );
                setStoreOnline(data.storeOnline ?? true);
                setPauseMinutes(derivePauseMinutes(data.pauseUntil));
                setHolidayClosures(
                    Array.isArray(data.holidayClosures) && data.holidayClosures.length > 0
                        ? data.holidayClosures
                        : HOLIDAYS,
                );
                const openingHours = data.openingHours;
                applyOpeningHours(openingHours);
            } catch (error) {
                console.error("Failed to load food partner profile:", error);
            } finally {
                setIsLoading(false);
            }
        };

        const fetchOpeningHours = async () => {
            try {
                const res = await api.get<ApiEnvelope<OpeningHourResponse[]> | OpeningHourResponse[]>(
                    "/foodpartner_system/opening-hours",
                );
                const data = unwrap(res.data);
                const openingHours = Array.isArray(data) ? data : [];
                applyOpeningHours(openingHours);
            } catch (error) {
                console.error("Failed to load opening hours:", error);
            }
        };

        fetchProfile();
        fetchOpeningHours();
    }, []);

    const addSlot = (key: DayKey) => {
        setSchedule((prev) => ({
            ...prev,
            [key]: {
                ...prev[key],
                slots: [...prev[key].slots, { start: "08:00", end: "17:00" }],
            },
        }));
    };

    const updateSlot = (key: DayKey, index: number, field: "start" | "end", value: string) => {
        setSchedule((prev) => ({
            ...prev,
            [key]: {
                ...prev[key],
                slots: prev[key].slots.map((slot, slotIndex) =>
                    slotIndex === index ? { ...slot, [field]: value } : slot,
                ),
            },
        }));
    };

    const removeSlot = (key: DayKey, index: number) => {
        setSchedule((prev) => ({
            ...prev,
            [key]: {
                ...prev[key],
                slots: prev[key].slots.filter((_, slotIndex) => slotIndex !== index),
            },
        }));
    };

    const toggleDay = (key: DayKey) => {
        setSchedule((prev) => ({
            ...prev,
            [key]: { ...prev[key], open: !prev[key].open },
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const profilePayload = {
                partnerName: toOptionalString(form.partnerName),
                description: toOptionalString(form.description),
                addressLine1: toOptionalString(form.addressLine1),
                addressLine2: toOptionalString([form.addressSoi, form.addressRoad].filter(Boolean).join(" ")),
                subdistrict: toOptionalString(form.subdistrict),
                district: toOptionalString(form.district),
                province: toOptionalString(form.province),
                postalCode: toOptionalString(form.postalCode),
                latitude: toNumberOrUndefined(form.latitude),
                longitude: toNumberOrUndefined(form.longitude),
                contactPhone: toOptionalString(form.contactPhone),
                contactEmail: toOptionalString(form.contactEmail),
                lineId: toOptionalString(form.lineId),
                socialLink: toOptionalString(form.socialLink),
                logoUrl: toOptionalString(form.logoUrl),
                coverImageUrl: toOptionalString(form.coverImageUrl),
                categories,
                storeOnline,
                pauseUntil: buildPauseUntil(pauseMinutes) ?? undefined,
                holidayClosures,
                bankName: toOptionalString(form.bankName),
                bankAccountNo: toOptionalString(form.bankAccountNo),
                bankAccountName: toOptionalString(form.bankAccountName),
                bankDocumentUrl: toOptionalString(form.bankDocumentUrl),
                businessDocumentUrl: toOptionalString(form.businessDocumentUrl),
            };

            const openingPayload = {
                days: (Object.keys(schedule) as DayKey[]).map((key) => ({
                    dayOfWeek: DAY_INDEX_BY_KEY[key],
                    isOpen: schedule[key].open,
                    slots: schedule[key].slots.map((slot, index) => ({
                        startTime: slot.start,
                        endTime: slot.end,
                        sequence: index + 1,
                    })),
                })),
            };

            await api.patch("/foodpartner_system/profile", profilePayload);
            await api.put("/foodpartner_system/opening-hours", openingPayload);

            await Swal.fire({
                icon: "success",
                title: "Saved",
                text: "Profile updated successfully.",
                timer: 1800,
                showConfirmButton: false,
                background: "#fffbf5",
            });
        } catch (error) {
            console.error("Failed to save food partner profile:", error);
            Swal.fire({
                icon: "error",
                title: "Save failed",
                text: "Unable to update profile. Please try again.",
                confirmButtonColor: "#3d3522",
                background: "#fffbf5",
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <main className="flex-1 overflow-y-auto custom-scrollbar ml-64 px-4 sm:px-8 py-8">
            <div className="mx-auto max-w-[1440px] space-y-6 pb-20">
                    <section className="rounded-[28px] border border-[#eadfce] bg-white p-6 shadow-sm">
                        <div className="flex flex-col gap-4">
                            <div className="inline-flex items-center gap-2 rounded-full bg-[#f4ead8] px-3 py-1 text-xs font-bold text-[#7b6a55]">
                                <Building2 size={14} /> WellMate Food Partner
                            </div>
                            <div className="flex flex-wrap items-end justify-between gap-3">
                                <div>
                                    <h1 className="text-3xl font-black text-[#2f2a1d]">
                                        โปรไฟล์ร้านอาหาร
                                    </h1>
                                    <p className="text-sm text-[#6b5d4b]">
                                        อัปเดตข้อมูลร้านให้ครบ เพื่อแสดงผลบนแอปและช่วยระบบคำนวณค่าส่งได้แม่นยำ
                                    </p>
                                </div>
                                <div className="flex flex-wrap items-center gap-3">
                                    <div className="rounded-2xl border border-[#eadfce] bg-white px-4 py-3 text-xs font-bold text-[#6b5d4b]">
                                        สถานะร้าน:{" "}
                                        <span className="font-black text-[#2f7d57]">
                                            {storeOnline ? "Online" : "Offline"}
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving || isLoading}
                                        className="rounded-2xl border border-[#eadfce] bg-[#2f7d57] px-4 py-3 text-xs font-black text-white shadow-sm transition hover:bg-[#276a4b] disabled:cursor-not-allowed disabled:opacity-70"
                                    >
                                        {isSaving ? "Saving..." : "Save changes"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-[28px] border border-[#eadfce] bg-white p-6 shadow-sm">
                        <SectionHeader
                            icon={<FileText size={18} />}
                            title="ข้อมูลทั่วไป"
                            desc="บอกเล่าตัวตนร้านให้ชัดเจน เพื่อสร้างความน่าเชื่อถือบนแอป"
                        />

                        <div className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                            <div className="space-y-4">
                                <Field label="ชื่อร้าน" icon={<Store size={14} />}>
                                    <TextInput
                                        placeholder="เช่น Green Bowl Kitchen"
                                        value={form.partnerName}
                                        onChange={(value) => handleFormChange("partnerName", value)}
                                    />
                                </Field>

                                <Field
                                    label="หมวดหมู่อาหาร (เลือกได้มากกว่า 1)"
                                    icon={<UtensilsCrossed size={14} />}
                                >
                                    <div className="flex flex-wrap gap-2">
                                        {CATEGORIES.map((item) => (
                                            <button
                                                key={item}
                                                onClick={() => toggleCategory(item)}
                                                className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                                                    categories.includes(item)
                                                        ? "bg-[#2f7d57] text-white"
                                                        : "border border-[#eadfce] bg-white text-[#6b5d4b]"
                                                }`}
                                            >
                                                {item}
                                            </button>
                                        ))}
                                    </div>
                                </Field>

                                <Field label="คำอธิบายร้าน (About Us)" icon={<FileText size={14} />}>
                                    <textarea
                                        className="min-h-[120px] w-full rounded-2xl border border-[#eadfce] bg-white px-4 py-3 text-sm text-[#2f2a1d] shadow-sm outline-none transition focus:border-[#cbb89f] focus:ring-2 focus:ring-[#f4ead8]"
                                        value={form.description}
                                        onChange={(event) => handleFormChange("description", event.target.value)}
                                    />
                                </Field>
                            </div>

                            <div className="space-y-4">
                                <Field
                                    label="โลโก้ร้าน"
                                    hint="แนะนำขนาด 400x400 px (ไฟล์ PNG พื้นหลังโปร่งใส)"
                                    icon={<Image size={14} />}
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-dashed border-[#eadfce] bg-[#faf4ea] px-4 py-3 text-sm text-[#6b5d4b]">
                                        <span>{form.logoUrl ? "มีไฟล์แล้ว" : "อัปโหลดโลโก้ร้าน"}</span>
                                        <button
                                            type="button"
                                            disabled={isUploading}
                                            onClick={() => logoInputRef.current?.click()}
                                            className="flex items-center gap-2 rounded-full border border-[#eadfce] bg-white px-3 py-1 text-xs font-bold text-[#2f2a1d]"
                                        >
                                            เลือกไฟล์ <UploadCloud size={14} />
                                        </button>
                                        <input
                                            ref={logoInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(event) => {
                                                const file = event.target.files?.[0];
                                                if (!file) return;
                                                uploadAsset("/foodpartner_system/profile/logo", file, (url) =>
                                                    setForm((prev) => ({ ...prev, logoUrl: url })),
                                                );
                                            }}
                                        />
                                    </div>
                                </Field>

                                <Field
                                    label="รูปปกหน้าร้าน"
                                    hint="แนะนำขนาด 800x400 px เพื่อไม่ให้ภาพแตก"
                                    icon={<ImageUp size={14} />}
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-dashed border-[#eadfce] bg-[#faf4ea] px-4 py-3 text-sm text-[#6b5d4b]">
                                        <span>{form.coverImageUrl ? "มีไฟล์แล้ว" : "อัปโหลดรูปปก"}</span>
                                        <button
                                            type="button"
                                            disabled={isUploading}
                                            onClick={() => coverInputRef.current?.click()}
                                            className="flex items-center gap-2 rounded-full border border-[#eadfce] bg-white px-3 py-1 text-xs font-bold text-[#2f2a1d]"
                                        >
                                            เลือกไฟล์ <UploadCloud size={14} />
                                        </button>
                                        <input
                                            ref={coverInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(event) => {
                                                const file = event.target.files?.[0];
                                                if (!file) return;
                                                uploadAsset("/foodpartner_system/profile/cover", file, (url) =>
                                                    setForm((prev) => ({ ...prev, coverImageUrl: url })),
                                                );
                                            }}
                                        />
                                    </div>
                                </Field>
                            </div>
                        </div>

                        <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                            <div className="space-y-4">
                                <Field label="ที่อยู่ร้าน" icon={<MapPin size={14} />}>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <TextInput
                                            placeholder="บ้านเลขที่"
                                            value={form.addressLine1}
                                            onChange={(value) => handleFormChange("addressLine1", value)}
                                        />
                                        <TextInput
                                            placeholder="ซอย"
                                            value={form.addressSoi}
                                            onChange={(value) => handleFormChange("addressSoi", value)}
                                        />
                                        <TextInput
                                            placeholder="ถนน"
                                            value={form.addressRoad}
                                            onChange={(value) => handleFormChange("addressRoad", value)}
                                        />
                                        <TextInput
                                            placeholder="ตำบล/แขวง"
                                            value={form.subdistrict}
                                            onChange={(value) => handleFormChange("subdistrict", value)}
                                        />
                                        <TextInput
                                            placeholder="อำเภอ/เขต"
                                            value={form.district}
                                            onChange={(value) => handleFormChange("district", value)}
                                        />
                                        <TextInput
                                            placeholder="จังหวัด"
                                            value={form.province}
                                            onChange={(value) => handleFormChange("province", value)}
                                        />
                                        <TextInput
                                            placeholder="รหัสไปรษณีย์"
                                            value={form.postalCode}
                                            onChange={(value) => handleFormChange("postalCode", value)}
                                        />
                                    </div>
                                </Field>
                            </div>

                            <div className="space-y-4">
                                <Field label="ปักหมุดแผนที่ (Map Pin)" icon={<MapPin size={14} />}>
                                    <div className="rounded-2xl border border-[#eadfce] bg-[#faf4ea] p-4">
                                        <div className="flex items-center gap-2 text-xs font-bold text-[#6b5d4b]">
                                            <MapPin size={14} /> พิกัดร้าน
                                        </div>
                                        <div className="mt-3 grid gap-2 text-xs text-[#6b5d4b]">
                                            <div className="flex items-center justify-between rounded-xl bg-white px-3 py-2">
                                                ละติจูด
                                                <span className="font-black text-[#2f2a1d]">
                                                    {form.latitude || "-"}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between rounded-xl bg-white px-3 py-2">
                                                ลองจิจูด
                                                <span className="font-black text-[#2f2a1d]">
                                                    {form.longitude || "-"}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                            <TextInput
                                                placeholder="ละติจูด"
                                                value={form.latitude}
                                                onChange={(value) => handleFormChange("latitude", value)}
                                            />
                                            <TextInput
                                                placeholder="ลองจิจูด"
                                                value={form.longitude}
                                                onChange={(value) => handleFormChange("longitude", value)}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (!navigator.geolocation) return;
                                                navigator.geolocation.getCurrentPosition(
                                                    (pos) => {
                                                        handleFormChange("latitude", String(pos.coords.latitude));
                                                        handleFormChange("longitude", String(pos.coords.longitude));
                                                    },
                                                    (err) => {
                                                        console.error(err);
                                                    },
                                                );
                                            }}
                                            className="mt-3 w-full rounded-full border border-[#eadfce] bg-white px-4 py-2 text-xs font-black text-[#2f2a1d]"
                                        >
                                            ใช้ตำแหน่งปัจจุบัน
                                        </button>
                                    </div>
                                </Field>

                                <Field label="ข้อมูลการติดต่อ" icon={<Phone size={14} />}>
                                    <div className="space-y-3">
                                        <TextInput
                                            placeholder="เบอร์โทรร้าน"
                                            value={form.contactPhone}
                                            onChange={(value) => handleFormChange("contactPhone", value)}
                                        />
                                        <TextInput
                                            placeholder="อีเมลร้าน"
                                            value={form.contactEmail}
                                            onChange={(value) => handleFormChange("contactEmail", value)}
                                        />
                                        <TextInput
                                            placeholder="Line OA / Social"
                                            value={form.lineId}
                                            onChange={(value) => handleFormChange("lineId", value)}
                                        />
                                        <TextInput
                                            placeholder="ลิงก์โซเชียล (Facebook/IG)"
                                            value={form.socialLink}
                                            onChange={(value) => handleFormChange("socialLink", value)}
                                        />
                                    </div>
                                </Field>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-[28px] border border-[#eadfce] bg-white p-6 shadow-sm">
                        <SectionHeader
                            icon={<Clock3 size={18} />}
                            title="เวลาทำการ"
                            desc="กำหนดเวลาเปิด-ปิดรายวัน พร้อมช่วงพักเพื่อให้ระบบจัดคิวได้ถูกต้อง"
                        />

                        <div className="mt-5 grid gap-3">
                            {(Object.keys(schedule) as DayKey[]).map((key) => {
                                const day = schedule[key];
                                return (
                                    <div
                                        key={key}
                                        className="rounded-2xl border border-[#eadfce] bg-[#faf4ea] p-4"
                                    >
                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-xl bg-white px-3 py-1 text-xs font-bold text-[#6b5d4b]">
                                                    {day.day}
                                                </div>
                                                <span className="text-xs text-[#6b5d4b]">
                                                    {day.open ? "เปิดรับออเดอร์" : "ปิดรับออเดอร์"}
                                                </span>
                                            </div>
                                            <Toggle
                                                on={day.open}
                                                onClick={() => toggleDay(key)}
                                                label={day.open ? "เปิด" : "ปิด"}
                                                description="ตั้งสถานะวันนี้"
                                            />
                                        </div>

                                        {day.open && (
                                            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                                {day.slots.map((slot, index) => (
                                            <div
                                                key={`${key}-${index}`}
                                                className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white px-3 py-2 text-xs font-bold text-[#2f2a1d]"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="time"
                                                        value={slot.start}
                                                        onChange={(event) =>
                                                            updateSlot(key, index, "start", event.target.value)
                                                        }
                                                        className="rounded-lg border border-[#eadfce] bg-white px-2 py-1 text-xs font-bold text-[#2f2a1d]"
                                                    />
                                                    <span>-</span>
                                                    <input
                                                        type="time"
                                                        value={slot.end}
                                                        onChange={(event) =>
                                                            updateSlot(key, index, "end", event.target.value)
                                                        }
                                                        className="rounded-lg border border-[#eadfce] bg-white px-2 py-1 text-xs font-bold text-[#2f2a1d]"
                                                    />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="rounded-full bg-[#f7efe1] px-2 py-1 text-[10px] text-[#7b6a55]">
                                                        ช่วงเวลา {index + 1}
                                                    </span>
                                                    <button
                                                        onClick={() => removeSlot(key, index)}
                                                        className="rounded-full border border-[#eadfce] bg-white px-2 py-1 text-[10px] font-bold text-[#b13a3a]"
                                                    >
                                                        ลบ
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                                <button
                                                    onClick={() => addSlot(key)}
                                                    className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-[#eadfce] bg-white px-3 py-2 text-xs font-bold text-[#6b5d4b]"
                                                >
                                                    <Plus size={14} /> เพิ่มช่วงเวลา
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-5 rounded-2xl border border-[#eadfce] bg-white p-4">
                            <div className="flex items-center gap-2">
                                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#f7efe1] text-[#7b6a55]">
                                    <Calendar size={14} />
                                </span>
                                <p className="text-sm font-black text-[#2f2a1d]">วันหยุดพิเศษ</p>
                            </div>
                            <div className="mt-3 grid gap-2 text-sm text-[#3f3425]">
                                {holidayClosures.map((holiday) => (
                                    <div
                                        key={holiday.date}
                                        className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#f0e6d8] px-3 py-2"
                                    >
                                        <span>{formatHolidayDate(holiday.date)}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-[#6b5d4b]">{holiday.reason || "-"}</span>
                                            <button
                                                onClick={() => removeHoliday(holiday.date)}
                                                className="rounded-full border border-[#eadfce] bg-white px-2 py-1 text-[10px] font-bold text-[#b13a3a]"
                                            >
                                                ลบ
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_1.5fr_auto]">
                                <input
                                    type="date"
                                    value={newHoliday.date}
                                    onChange={(event) =>
                                        setNewHoliday((prev) => ({ ...prev, date: event.target.value }))
                                    }
                                    className="rounded-full border border-[#eadfce] bg-white px-4 py-2 text-xs font-bold text-[#2f2a1d]"
                                />
                                <input
                                    type="text"
                                    placeholder="เหตุผลวันหยุด"
                                    value={newHoliday.reason}
                                    onChange={(event) =>
                                        setNewHoliday((prev) => ({ ...prev, reason: event.target.value }))
                                    }
                                    className="rounded-full border border-[#eadfce] bg-white px-4 py-2 text-xs font-bold text-[#2f2a1d]"
                                />
                                <button
                                    onClick={addHoliday}
                                    className="rounded-full border border-[#eadfce] bg-white px-4 py-2 text-xs font-black text-[#2f2a1d]"
                                >
                                    เพิ่มวันหยุดล่วงหน้า
                                </button>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-[28px] border border-[#eadfce] bg-white p-6 shadow-sm">
                        <SectionHeader
                            icon={<Clock3 size={18} />}
                            title="สถานะร้านค้า / Emergency Control"
                            desc="ป้องกันออเดอร์ล้นด้วยการพักออเดอร์ชั่วคราว และระบบจะเปิดให้อัตโนมัติ"
                        />

                        <div className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                            <div className="space-y-3">
                                <Toggle
                                    on={storeOnline}
                                    onClick={() => setStoreOnline((prev) => !prev)}
                                    label={storeOnline ? "เปิดร้าน (Online)" : "ปิดร้าน (Offline)"}
                                    description="สวิตช์หลักสำหรับเปิดหรือปิดร้าน"
                                />

                                <div className="rounded-2xl border border-[#eadfce] bg-[#faf4ea] p-4">
                                    <p className="text-xs font-bold text-[#6b5d4b]">พักรับออเดอร์</p>
                                    <p className="mt-1 text-sm font-black text-[#2f2a1d]">{pauseLabel}</p>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {PAUSE_OPTIONS.map((option) => (
                                            <button
                                                key={option.label}
                                                onClick={() => setPauseMinutes(option.minutes)}
                                                className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                                                    pauseMinutes === option.minutes
                                                        ? "bg-[#b13a3a] text-white"
                                                        : "border border-[#eadfce] bg-white text-[#6b5d4b]"
                                                }`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => setPauseMinutes(null)}
                                            className="rounded-full border border-[#eadfce] bg-white px-4 py-2 text-xs font-bold text-[#2f2a1d]"
                                        >
                                            ยกเลิกพัก
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-[#eadfce] bg-white p-4">
                                <p className="text-sm font-black text-[#2f2a1d]">
                                    สถานะระบบเรียลไทม์
                                </p>
                                <div className="mt-3 space-y-2 text-xs text-[#6b5d4b]">
                                    <div className="flex items-center justify-between rounded-xl bg-[#f7efe1] px-3 py-2">
                                        คิวออเดอร์ปัจจุบัน
                                        <span className="font-black text-[#2f2a1d]">12 ใบ</span>
                                    </div>
                                    <div className="flex items-center justify-between rounded-xl bg-[#f7efe1] px-3 py-2">
                                        เวลารอเฉลี่ย
                                        <span className="font-black text-[#2f2a1d]">18 นาที</span>
                                    </div>
                                    <div className="flex items-center justify-between rounded-xl bg-[#f7efe1] px-3 py-2">
                                        ความหนาแน่นครัว
                                        <span className="font-black text-[#b13a3a]">สูงมาก</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-[28px] border border-[#eadfce] bg-white p-6 shadow-sm">
                        <SectionHeader
                            icon={<Wallet size={18} />}
                            title="Payout / Bank Info"
                            desc="ตรวจสอบบัญชีรับเงินโอนจากระบบให้ถูกต้อง"
                        />

                        <div className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                            <div className="rounded-2xl border border-[#eadfce] bg-[#faf4ea] p-5 space-y-3">
                                <p className="text-xs font-bold text-[#6b5d4b]">บัญชีผูกไว้</p>
                                <TextInput
                                    placeholder="ธนาคาร"
                                    value={form.bankName}
                                    onChange={(value) => handleFormChange("bankName", value)}
                                />
                                <TextInput
                                    placeholder="ชื่อบัญชี"
                                    value={form.bankAccountName}
                                    onChange={(value) => handleFormChange("bankAccountName", value)}
                                />
                                <TextInput
                                    placeholder="เลขที่บัญชี"
                                    value={form.bankAccountNo}
                                    onChange={(value) => handleFormChange("bankAccountNo", value)}
                                />
                            </div>

                            <div className="rounded-2xl border border-[#eadfce] bg-white p-5">
                                <p className="text-xs font-bold text-[#6b5d4b]">เอกสารประกอบ</p>
                                <div className="mt-3 space-y-2 text-sm text-[#3f3425]">
                                    <div className="flex items-center justify-between rounded-xl border border-[#f0e6d8] px-3 py-2">
                                        สำเนาหน้าสมุดบัญชี
                                        <button
                                            type="button"
                                            disabled={isUploading}
                                            onClick={() => bankDocInputRef.current?.click()}
                                            className="rounded-full border border-[#eadfce] bg-white px-3 py-1 text-[11px] font-bold text-[#6b5d4b]"
                                        >
                                            อัปโหลดใหม่
                                        </button>
                                        <input
                                            ref={bankDocInputRef}
                                            type="file"
                                            accept="image/*,application/pdf"
                                            className="hidden"
                                            onChange={(event) => {
                                                const file = event.target.files?.[0];
                                                if (!file) return;
                                                uploadAsset("/foodpartner_system/profile/bank-document", file, (url) =>
                                                    setForm((prev) => ({ ...prev, bankDocumentUrl: url })),
                                                );
                                            }}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between rounded-xl border border-[#f0e6d8] px-3 py-2">
                                        หนังสือรับรองบริษัท
                                        <button
                                            type="button"
                                            disabled={isUploading}
                                            onClick={() => businessDocInputRef.current?.click()}
                                            className="rounded-full border border-[#eadfce] bg-white px-3 py-1 text-[11px] font-bold text-[#6b5d4b]"
                                        >
                                            อัปโหลดใหม่
                                        </button>
                                        <input
                                            ref={businessDocInputRef}
                                            type="file"
                                            accept="image/*,application/pdf"
                                            className="hidden"
                                            onChange={(event) => {
                                                const file = event.target.files?.[0];
                                                if (!file) return;
                                                uploadAsset("/foodpartner_system/profile/business-document", file, (url) =>
                                                    setForm((prev) => ({ ...prev, businessDocumentUrl: url })),
                                                );
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        );
}
