"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import {
    Check,
    ChevronDown,
    ImageUp,
    Pencil,
    Plus,
    Search,
    Trash2,
    UploadCloud,
} from "lucide-react";
import api from "@/lib/api";
import Swal from "sweetalert2";

type Nutrition = {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
};

type MenuItem = {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    tags: string[];
    allergenAlert?: string;
    nutrition: Nutrition;
    allergens: string[];
    active: boolean;
    category?: {
        id: number;
        name: string;
    };
    categoryId?: number;
    isSet?: boolean;
    components?: any[];
};

const ALLERGENS = [
    "Shrimp/Crab (Crustaceans)",
    "Peanuts",
    "Dairy",
    "Gluten",
];

const CATEGORY_ALL = "All";
const STATUS_ALL = "All";
const STATUS_AVAILABLE = "Available";
const STATUS_HIDDEN = "Hidden";


type FoodPartnerProfileResponse = {
    foodPartnerId: number;
};

type MenuItemApi = {
    menuItemId: number;
    name: string;
    description?: string | null;
    price: number;
    imageUrl?: string | null;
    categoryId?: number | null;
    category?: {
        id: number;
        name: string;
    } | null;
    caloriesKcal?: number | null;
    proteinG?: number | null;
    carbsG?: number | null;
    fatG?: number | null;
    allergens?: string[] | null;
    allergenAlert?: string | null;
    isAvailable?: boolean | null;
    isOutOfStock?: boolean | null;
    isSet?: boolean | null;
    components?: any[] | null;
};

type PaginatedMenuItemsDto = {
    data: MenuItemApi[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
};

type ApiEnvelope<T> = {
    success: boolean;
    data: T;
    message?: string;
};

const FALLBACK_FOOD_IMAGE =
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80";


const formatBaht = (value: number) =>
    `${value.toLocaleString("th-TH", { maximumFractionDigits: 0 })} บาท`;

function Pill({ text, tone }: { text: string; tone: string }) {
    return (
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${tone}`}>
            {text}
        </span>
    );
}

function Toggle({
    on,
    onClick,
}: {
    on: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`relative h-7 w-14 rounded-full border transition ${on
                ? "border-[#1f6b4e] bg-[#1f6b4e]"
                : "border-[#d8cbb6] bg-[#ece4d7]"
                }`}
        >
            <span
                className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ${on ? "left-7" : "left-1"
                    }`}
            />
        </button>
    );
}

function Modal({
    open,
    title,
    children,
    onClose,
}: {
    open: boolean;
    title: string;
    children: React.ReactNode;
    onClose: () => void;
}) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
            <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[32px] bg-white p-6 shadow-2xl">
                <div className="mb-5 flex items-center justify-between gap-2">
                    <h3 className="text-xl font-black text-[#2f2a1d]">{title}</h3>
                    <button
                        onClick={onClose}
                        className="rounded-full border border-[#eadfce] px-3 py-1 text-xs font-bold text-[#6b5d4b]"
                    >
                        ปิด
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

function Dropdown({
    label,
    value,
    options,
    onChange,
}: {
    label: string;
    value: string;
    options: Array<{ id: string | number; name: string }>;
    onChange: (val: string | number) => void;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const displayValue = options.find(opt => String(opt.id) === String(value))?.name || value;

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center gap-2 rounded-full border border-[#eadfce] bg-white px-4 py-2 text-xs font-bold text-[#6b5d4b]"
            >
                {label}: {displayValue}
                <ChevronDown size={14} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
            {isOpen && (
                <div className="absolute left-0 top-full z-50 mt-2 min-w-[160px] overflow-hidden rounded-2xl border border-[#eadfce] bg-white shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="py-1">
                        {options.map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => {
                                    onChange(opt.id);
                                    setIsOpen(false);
                                }}
                                className={`flex w-full items-center px-4 py-2.5 text-left text-xs font-bold transition-colors ${String(value) === String(opt.id) ? "bg-[#f4ead8] text-[#1f6b4e]" : "text-[#6b5d4b] hover:bg-[#faf4ea]"
                                    }`}
                            >
                                {opt.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function FoodPartnerMenuPage() {
    const [menus, setMenus] = useState<MenuItem[]>([]);
    const [query, setQuery] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | string>(CATEGORY_ALL);
    const [status, setStatus] = useState(STATUS_ALL);
    const [availableCategories, setAvailableCategories] = useState<Array<{ id: number; name: string }>>([]);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<MenuItem | null>(null);
    const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
    const [foodPartnerId, setFoodPartnerId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        imageUrl: "",
        categoryId: "" as string | number,
        calories: "",
        protein: "",
        carbs: "",
        fat: "",
        allergenAlert: "",
        isSet: false,
        components: [] as { componentItemId: number; quantity: number }[],
    });

    useEffect(() => {
        if (form.isSet && form.components.length > 0) {
            let totalCalories = 0;
            let totalProtein = 0;
            let totalCarbs = 0;
            let totalFat = 0;
            let totalPrice = 0;

            form.components.forEach(comp => {
                const item = menus.find(m => m.id === comp.componentItemId);
                if (item) {
                    totalCalories += (item.nutrition.calories || 0) * comp.quantity;
                    totalProtein += (item.nutrition.protein || 0) * comp.quantity;
                    totalCarbs += (item.nutrition.carbs || 0) * comp.quantity;
                    totalFat += (item.nutrition.fat || 0) * comp.quantity;
                    totalPrice += (item.price || 0) * comp.quantity;
                }
            });

            setForm(prev => {
                if (
                    prev.calories === String(totalCalories) &&
                    prev.protein === String(totalProtein) &&
                    prev.carbs === String(totalCarbs) &&
                    prev.fat === String(totalFat) &&
                    prev.price === String(totalPrice)
                ) {
                    return prev;
                }
                return {
                    ...prev,
                    calories: String(totalCalories),
                    protein: String(totalProtein),
                    carbs: String(totalCarbs),
                    fat: String(totalFat),
                    price: String(totalPrice),
                };
            });
        }
    }, [form.components, form.isSet, menus]);

    const unwrap = <T,>(payload: ApiEnvelope<T> | T): T => {
        if (payload && typeof payload === "object" && "data" in payload) {
            return (payload as ApiEnvelope<T>).data;
        }
        return payload as T;
    };

    const uploadAsset = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        setIsUploading(true);
        try {
            const res = await api.post<ApiEnvelope<{ url: string }> | { url: string }>("/food-menu/upload/image", formData);
            const data = unwrap(res.data);
            if (data?.url) {
                setForm((prev) => ({ ...prev, imageUrl: data.url }));
            }
        } catch (error) {
            console.error("Upload failed:", error);
            Swal.fire({
                icon: "error",
                title: "อัปโหลดไม่สำเร็จ",
                text: "ไม่สามารถอัปโหลดรูปภาพได้ กรุณาลองใหม่",
                confirmButtonColor: "#3d3522",
                background: "#fffbf5",
            });
        } finally {
            setIsUploading(false);
        }
    };

    const buildTags = (item: MenuItemApi) => {
        const tags: string[] = [];
        if (item.caloriesKcal !== null && item.caloriesKcal !== undefined) {
            tags.push(`🔥 ${item.caloriesKcal} kcal`);
        }
        if (item.proteinG !== null && item.proteinG !== undefined) {
            tags.push(`💪 โปรตีน ${item.proteinG}g`);
        }
        if (item.carbsG !== null && item.carbsG !== undefined) {
            tags.push(`🍞 คาร์บ ${item.carbsG}g`);
        }
        if (item.fatG !== null && item.fatG !== undefined) {
            tags.push(`🥑 ไขมัน ${item.fatG}g`);
        }
        return tags;
    };

    const mapMenuItem = (item: MenuItemApi): MenuItem => {
        const active = (item.isAvailable ?? true) && !(item.isOutOfStock ?? false);
        return {
            id: item.menuItemId,
            name: item.name,
            description: item.description ?? "",
            price: Number(item.price),
            imageUrl: item.imageUrl || FALLBACK_FOOD_IMAGE,
            tags: buildTags(item),
            nutrition: {
                calories: item.caloriesKcal ?? 0,
                protein: item.proteinG ?? 0,
                carbs: item.carbsG ?? 0,
                fat: item.fatG ?? 0,
            },
            allergens: item.allergens ?? [],
            allergenAlert: item.allergenAlert ?? undefined,
            active,
            categoryId: item.categoryId ?? undefined,
            category: item.category ?? undefined,
            isSet: item.isSet ?? false,
            components: item.components ?? [],
        };
    };

    const categoryDropdownOptions = useMemo(() => {
        return [
            { id: CATEGORY_ALL, name: "ทั้งหมด" },
            ...availableCategories.map(c => ({ id: c.id, name: c.name }))
        ];
    }, [availableCategories]);

    const statusOptions = [
        { id: STATUS_ALL, name: "ทั้งหมด" },
        { id: STATUS_AVAILABLE, name: "เปิดขาย" },
        { id: STATUS_HIDDEN, name: "ซ่อนเมนู" }
    ];

    const filteredMenus = useMemo(() => {
        return menus.filter((menu) => {
            const matchesQuery =
                menu.name.toLowerCase().includes(query.toLowerCase()) ||
                menu.description.toLowerCase().includes(query.toLowerCase());
            const matchesStatus =
                status === STATUS_ALL
                    ? true
                    : status === STATUS_AVAILABLE
                        ? menu.active
                        : !menu.active;
            const matchesCategory =
                selectedCategoryId === CATEGORY_ALL ? true : menu.categoryId === selectedCategoryId;
            return matchesQuery && matchesStatus && matchesCategory;
        });
    }, [menus, query, status, selectedCategoryId]);

    const openNew = () => {
        setEditing(null);
        setSelectedAllergens([]);
        setForm({
            name: "",
            description: "",
            price: "",
            imageUrl: "",
            calories: "",
            protein: "",
            carbs: "",
            fat: "",
            categoryId: "",
            allergenAlert: "",
            isSet: false,
            components: [],
        });
        setShowModal(true);
    };

    const openEdit = (menu: MenuItem) => {
        setEditing(menu);
        setSelectedAllergens(menu.allergens);
        setForm({
            name: menu.name,
            description: menu.description,
            price: String(menu.price),
            imageUrl: menu.imageUrl === FALLBACK_FOOD_IMAGE ? "" : menu.imageUrl,
            calories: String(menu.nutrition.calories),
            protein: String(menu.nutrition.protein),
            carbs: String(menu.nutrition.carbs),
            fat: String(menu.nutrition.fat),
            categoryId: menu.categoryId ?? "",
            allergenAlert: menu.allergenAlert ?? "",
            isSet: menu.isSet ?? false,
            components: menu.components?.map(c => ({ componentItemId: c.menuItemId, quantity: c.quantity })) ?? [],
        });
        setShowModal(true);
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get<
                    ApiEnvelope<FoodPartnerProfileResponse> | FoodPartnerProfileResponse
                >("/foodpartner_system/profile");
                const data = unwrap(res.data);
                if (data?.foodPartnerId) {
                    setFoodPartnerId(data.foodPartnerId);
                } else {
                    setLoadError("ไม่พบข้อมูลร้านอาหาร");
                }
            } catch (error) {
                console.error("Failed to load food partner profile:", error);
                setLoadError("ไม่สามารถโหลดข้อมูลร้านอาหารได้");
            }
        };

        fetchProfile();

        const fetchCategories = async () => {
            try {
                const res = await api.get<ApiEnvelope<Array<{ id: number; name: string }>> | Array<{ id: number; name: string }>>("/food-menu/categories");
                const data = unwrap(res.data);
                setAvailableCategories(data || []);
            } catch (error) {
                console.error("Failed to load categories:", error);
            }
        };
        fetchCategories();
    }, []);
    const fetchMenus = async () => {
        if (!foodPartnerId) return;
        setIsLoading(true);
        setLoadError("");
        try {
            const params: Record<string, string | number | boolean> = {
                foodPartnerId,
                page: 1,
                limit: 100,
            };

            if (query.trim()) params.q = query.trim();
            if (selectedCategoryId !== CATEGORY_ALL) params.categoryId = selectedCategoryId;
            if (status === STATUS_AVAILABLE) params.isAvailable = true;
            if (status === STATUS_HIDDEN) params.isAvailable = false;

            const res = await api.get<ApiEnvelope<PaginatedMenuItemsDto> | PaginatedMenuItemsDto>(
                "/food-menu",
                { params },
            );
            const payload = unwrap(res.data);
            const items = Array.isArray(payload)
                ? payload
                : Array.isArray(payload?.data)
                    ? payload.data
                    : [];
            setMenus(items.map(mapMenuItem));
        } catch (error) {
            console.error("Failed to load menu items:", error);
            setLoadError("??????????????????????????????????????????????????????????????????????????????");
            setMenus([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMenus();
    }, [foodPartnerId, query, selectedCategoryId, status]);

    const toggleAvailability = async (menu: MenuItem) => {
        const next = !menu.active;
        setMenus((prev) =>
            prev.map((item) => (item.id === menu.id ? { ...item, active: next } : item)),
        );
        try {
            await api.patch(`/food-menu/${menu.id}`, {
                name: menu.name,
                price: menu.price,
                isAvailable: next,
            });
        } catch (error) {
            console.error("Failed to update menu availability:", error);
            setMenus((prev) =>
                prev.map((item) => (item.id === menu.id ? { ...item, active: !next } : item)),
            );
            Swal.fire({
                icon: "error",
                title: "อัปเดตไม่สำเร็จ",
                text: "ไม่สามารถเปลี่ยนสถานะเมนูได้",
                confirmButtonColor: "#3d3522",
                background: "#fffbf5",
            });
        }
    };

    const handleSave = async () => {
        if (!form.name.trim()) {
            Swal.fire({
                icon: "warning",
                title: "กรุณากรอกชื่อเมนู",
                confirmButtonColor: "#3d3522",
                background: "#fffbf5",
            });
            return;
        }
        setIsSaving(true);
        try {
            const payload = {
                name: form.name.trim(),
                description: form.description.trim() || undefined,
                price: Number(form.price),
                imageUrl: form.imageUrl.trim() || undefined,
                categoryId: Number(form.categoryId) || undefined,
                caloriesKcal: Number(form.calories) || 0,
                proteinG: Number(form.protein) || 0,
                carbsG: Number(form.carbs) || 0,
                fatG: Number(form.fat) || 0,
                allergens: selectedAllergens,
                allergenAlert: form.allergenAlert.trim() || undefined,
                isSet: form.isSet,
                components: form.isSet ? form.components : undefined,
            };

            if (editing) {
                await api.patch(`/food-menu/${editing.id}`, payload);
            } else {
                await api.post("/food-menu", payload);
            }

            await fetchMenus();
            setShowModal(false);
            setEditing(null);
            Swal.fire({
                icon: "success",
                title: "บันทึกสำเร็จ",
                timer: 1200,
                showConfirmButton: false,
                background: "#fffbf5",
            });
        } catch (error) {
            console.error("Failed to save menu item:", error);
            Swal.fire({
                icon: "error",
                title: "บันทึกไม่สำเร็จ",
                text: "ไม่สามารถบันทึกรายการเมนูได้",
                confirmButtonColor: "#3d3522",
                background: "#fffbf5",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (menu: MenuItem) => {
        if (isDeleting) return;
        const result = await Swal.fire({
            icon: "warning",
            title: "ลบเมนูนี้หรือไม่?",
            text: menu.name,
            showCancelButton: true,
            confirmButtonText: "ลบ",
            cancelButtonText: "ยกเลิก",
            confirmButtonColor: "#b13a3a",
            background: "#fffbf5",
        });
        if (!result.isConfirmed) return;
        setIsDeleting(true);
        try {
            await api.delete(`/food-menu/${menu.id}`);
            await fetchMenus();
            Swal.fire({
                icon: "success",
                title: "ลบแล้ว",
                timer: 1000,
                showConfirmButton: false,
                background: "#fffbf5",
            });
        } catch (error) {
            console.error("Failed to delete menu item:", error);
            Swal.fire({
                icon: "error",
                title: "ลบไม่สำเร็จ",
                text: "ไม่สามารถลบเมนูได้",
                confirmButtonColor: "#3d3522",
                background: "#fffbf5",
            });
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
                <div className="w-full px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-32 py-10 space-y-6">
                    <section className="rounded-[28px] border border-[#eadfce] bg-white/90 p-6 shadow-sm backdrop-blur">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <h1 className="text-3xl font-black text-[#2f2a1d]">
                                    จัดการเมนูอาหาร
                                </h1>
                                <p className="mt-1 text-sm text-[#6b5d4b]">
                                    เพิ่ม ลบ หรือแก้ไขรายการอาหารของคุณ
                                </p>
                            </div>
                            <button
                                onClick={openNew}
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1f6b4e] px-6 py-3 text-sm font-black text-white shadow-sm"
                            >
                                <Plus size={18} /> เพิ่มเมนูใหม่
                            </button>
                        </div>
                    </section>

                    <section className="rounded-[28px] border border-[#eadfce] bg-white p-5 shadow-sm">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                            <div className="relative flex-1">
                                <Search
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8c7a66]"
                                />
                                <input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="ค้นหาชื่อเมนู..."
                                    className="w-full rounded-full border border-[#eadfce] bg-white py-3 pl-11 pr-4 text-sm font-semibold text-[#2f2a1d] outline-none"
                                />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Dropdown
                                    label="หมวดหมู่"
                                    value={String(selectedCategoryId)}
                                    options={categoryDropdownOptions}
                                    onChange={(val) => {
                                        if (val === CATEGORY_ALL) setSelectedCategoryId(CATEGORY_ALL);
                                        else setSelectedCategoryId(Number(val));
                                    }}
                                />
                                <Dropdown
                                    label="สถานะ"
                                    value={status}
                                    options={statusOptions}
                                    onChange={(val) => setStatus(String(val))}
                                />
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4">
                        {isLoading && (
                            <div className="rounded-[26px] border border-[#eadfce] bg-white p-6 text-sm text-[#6b5d4b]">
                                กำลังโหลดรายการเมนู...
                            </div>
                        )}
                        {!isLoading && loadError && (
                            <div className="rounded-[26px] border border-[#f0e6d8] bg-[#fff5f5] p-6 text-sm text-[#b13a3a]">
                                {loadError}
                            </div>
                        )}
                        {!isLoading && !loadError && filteredMenus.length === 0 && (
                            <div className="rounded-[26px] border border-[#eadfce] bg-white p-6 text-sm text-[#6b5d4b]">
                                ยังไม่มีรายการเมนู
                            </div>
                        )}
                        {filteredMenus.map((menu, index) => (
                            <div
                                key={`${menu.id}-${index}`}
                                className="flex flex-col gap-4 rounded-[26px] border border-[#eadfce] bg-white p-4 shadow-sm lg:flex-row lg:items-center"
                            >
                                <div className="h-24 w-24 overflow-hidden rounded-2xl border border-[#f0e6d8] bg-[#f7efe1]">
                                    <img
                                        src={menu.imageUrl}
                                        alt={menu.name}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h3 className="text-lg font-black text-[#2f2a1d]">
                                            {menu.name}
                                        </h3>
                                        <span className="text-sm font-black text-[#1f6b4e]">
                                            {formatBaht(menu.price)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-[#6b5d4b]">{menu.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {menu.tags.map((tag, tagIndex) => (
                                            <Pill
                                                key={`${menu.id}-tag-${tagIndex}`}
                                                text={tag}
                                                tone="bg-[#f4ead8] text-[#7b6a55]"
                                            />
                                        ))}
                                    </div>
                                    {menu.allergenAlert && (
                                        <div className="text-xs font-bold text-[#b13a3a]">
                                            {menu.allergenAlert}
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-wrap items-center gap-3 lg:flex-col lg:items-end">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-[#6b5d4b]">
                                            {menu.active ? "เปิดขาย" : "ซ่อนเมนู"}
                                        </span>
                                        <Toggle
                                            on={menu.active}
                                            onClick={() => toggleAvailability(menu)}
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => openEdit(menu)}
                                            className="rounded-full border border-[#eadfce] bg-white p-2 text-[#8c7a66]"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(menu)}
                                            className="rounded-full border border-[#eadfce] bg-white p-2 text-[#8c7a66]"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </section>
            </div>
        </main>

            <Modal
                open={showModal}
                title={editing ? "แก้ไขเมนูอาหาร" : "เพิ่มเมนูใหม่"}
                onClose={() => setShowModal(false)}
            >
                <div className="grid gap-6 lg:grid-cols-2">
                    <section className="space-y-4">
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-black text-[#2f2a1d]">ข้อมูลทั่วไป และรูปภาพ</p>
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className={`group relative mt-2 flex h-44 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition ${
                                    isUploading ? "border-[#eadfce] bg-[#fdfaf5] opacity-70" : "border-[#eadfce] bg-[#faf4ea] hover:border-[#cbb89f] hover:bg-[#f4ead8]"
                                }`}
                            >
                                {form.imageUrl ? (
                                    <>
                                        <img src={form.imageUrl} alt="Menu preview" className="h-full w-full object-cover" />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                                            <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#2f2a1d]">
                                                <UploadCloud size={16} /> เปลี่ยนรูปภาพ
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center text-sm text-[#6b5d4b]">
                                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#6b5d4b] shadow-sm transition group-hover:scale-105 group-hover:text-[#2f7d57]">
                                            <ImageUp size={20} />
                                        </div>
                                        <p className="mt-2 font-semibold">อัปโหลดรูปภาพเมนู</p>
                                        <p className="text-[11px]">แนะนำขนาด 800x800 px พื้นหลังใส</p>
                                    </div>
                                )}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) uploadAsset(file);
                                    }}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[#6b5d4b]">
                                ชื่อเมนู
                            </label>
                            <input
                                value={form.name}
                                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                                placeholder="เช่น ข้าวผัดอกไก่ไร้มัน"
                                className="w-full rounded-2xl border border-[#eadfce] px-4 py-3 text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[#6b5d4b]">
                                คำอธิบาย
                            </label>
                            <textarea
                                value={form.description}
                                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                                rows={4}
                                placeholder="บรรยายความน่ากินของเมนู"
                                className="w-full rounded-2xl border border-[#eadfce] px-4 py-3 text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[#6b5d4b]">
                                หมวดหมู่ <span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-2 gap-2 mt-1 sm:grid-cols-3">
                                {availableCategories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => setForm(prev => ({ ...prev, categoryId: cat.id }))}
                                        className={`flex items-center justify-center rounded-xl border p-3 text-xs font-bold transition-all ${Number(form.categoryId) === cat.id
                                                ? "border-[#1f6b4e] bg-[#e7f2e9] text-[#1f6b4e] shadow-sm"
                                                : "border-[#eadfce] bg-white text-[#6b5d4b] hover:border-[#cbb89f] hover:bg-[#faf4ea]"
                                            }`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                            {availableCategories.length === 0 && (
                                <p className="text-[10px] text-gray-400 italic">กำลังโหลดหมวดหมู่...</p>
                            )}
                        </div>

                        <div className="pt-2">
                             <div className="flex items-center justify-between gap-4 rounded-2xl border border-[#eadfce] bg-[#faf4ea] p-4">
                                <div>
                                    <p className="text-sm font-black text-[#2f2a1d]">เมนูเซต (Set Menu)</p>
                                    <p className="text-[11px] text-[#6b5d4b]">เมนูนี้ประกอบด้วยอาหารหลายอย่างรวมกัน</p>
                                </div>
                                <Toggle 
                                    on={form.isSet} 
                                    onClick={() => setForm(prev => ({ ...prev, isSet: !prev.isSet }))} 
                                />
                             </div>
                        </div>

                        {form.isSet && (
                            <div className="space-y-3 rounded-2xl border border-[#eadfce] bg-white p-4 shadow-sm">
                                <p className="text-xs font-bold text-[#6b5d4b]">รายการย่อยภายในเซต</p>
                                <div className="space-y-2">
                                    {form.components.map((comp, idx) => {
                                        const originalItem = menus.find(m => m.id === comp.componentItemId);
                                        return (
                                            <div key={idx} className="flex items-center justify-between gap-3 rounded-xl border border-[#eadfce] bg-[#fdfaf5] p-2">
                                                <div className="flex flex-1 items-center gap-3">
                                                    <div className="h-10 w-10 overflow-hidden rounded-lg bg-gray-100">
                                                        <img src={originalItem?.imageUrl || FALLBACK_FOOD_IMAGE} alt="" className="h-full w-full object-cover" />
                                                    </div>
                                                    <div className="text-xs font-bold text-[#2f2a1d]">
                                                        {originalItem?.name || "Unknown Item"}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <input 
                                                        type="number"
                                                        value={comp.quantity}
                                                        onChange={(e) => {
                                                            const val = Math.max(1, parseInt(e.target.value) || 1);
                                                            const newComps = [...form.components];
                                                            newComps[idx].quantity = val;
                                                            setForm(prev => ({ ...prev, components: newComps }));
                                                        }}
                                                        className="w-12 rounded-lg border border-[#eadfce] py-1 text-center text-xs font-bold"
                                                    />
                                                    <button 
                                                        onClick={() => {
                                                            setForm(prev => ({ ...prev, components: prev.components.filter((_, i) => i !== idx) }));
                                                        }}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                
                                <div className="relative pt-2">
                                    <p className="mb-2 text-[10px] font-bold text-[#8c7a66]">เพิ่มเมนูย่อย:</p>
                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 max-h-[200px] overflow-y-auto">
                                        {menus
                                            .filter(m => !m.isSet && m.id !== editing?.id && !form.components.some(c => c.componentItemId === m.id))
                                            .map((m) => (
                                                <button
                                                    key={m.id}
                                                    onClick={() => setForm(prev => ({ ...prev, components: [...prev.components, { componentItemId: m.id, quantity: 1 }] }))}
                                                    className="flex items-center gap-2 rounded-xl border border-[#eadfce] bg-white p-2 text-left hover:border-[#1f6b4e] transition-all"
                                                >
                                                    <div className="h-8 w-8 overflow-hidden rounded-lg bg-gray-100">
                                                        <img src={m.imageUrl} alt="" className="h-full w-full object-cover" />
                                                    </div>
                                                    <span className="text-[11px] font-bold text-[#6b5d4b] line-clamp-1">{m.name}</span>
                                                </button>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[#6b5d4b]">
                                ราคา (บาท)
                            </label>
                            <input
                                type="number"
                                value={form.price}
                                disabled={form.isSet}
                                onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
                                placeholder="0"
                                className="w-full rounded-2xl border border-[#eadfce] px-4 py-3 text-sm"
                            />
                        </div>
                    </section>

                    <section className="space-y-4">
                        <div className="rounded-3xl border border-[#eadfce] bg-[#faf4ea] p-4">
                            <p className="text-sm font-black text-[#2f2a1d]">
                                โภชนาการและสารก่อภูมิแพ้
                            </p>
                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                {[
                                    { label: "แคลอรีรวม (kcal)", key: "calories" },
                                    { label: "โปรตีน (g)", key: "protein" },
                                    { label: "คาร์โบไฮเดรต (g)", key: "carbs" },
                                    { label: "ไขมัน (g)", key: "fat" },
                                ].map((field) => (
                                    <div key={field.key} className="space-y-2">
                                        <label className="text-xs font-bold text-[#6b5d4b]">
                                            {field.label}
                                        </label>
                                        <input
                                            type="number"
                                            value={(form as any)[field.key]}
                                            disabled={form.isSet}
                                            onChange={(e) =>
                                                setForm((prev) => ({
                                                    ...prev,
                                                    [field.key]: e.target.value,
                                                }))
                                            }
                                            placeholder="0"
                                            className="w-full rounded-2xl border border-[#eadfce] bg-white px-3 py-2 text-sm"
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 space-y-2">
                                <p className="text-xs font-bold text-[#6b5d4b]">
                                    สารก่อภูมิแพ้
                                </p>
                                <div className="grid gap-2 sm:grid-cols-2">
                                    {ALLERGENS.map((allergen) => {
                                        const active = selectedAllergens.includes(allergen);
                                        return (
                                            <button
                                                key={allergen}
                                                type="button"
                                                onClick={() =>
                                                    setSelectedAllergens((prev) =>
                                                        prev.includes(allergen)
                                                            ? prev.filter((a) => a !== allergen)
                                                            : [...prev, allergen],
                                                    )
                                                }
                                                className={`flex items-center justify-between rounded-2xl border px-3 py-2 text-xs font-bold transition ${active
                                                    ? "border-[#1f6b4e] bg-[#e7f2e9] text-[#1f6b4e]"
                                                    : "border-[#eadfce] bg-white text-[#6b5d4b]"
                                                    }`}
                                            >
                                                <span>{allergen}</span>
                                                {active && <Check size={14} />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>


                        <div className="mt-4 space-y-2">
                            <label className="text-xs font-bold text-[#6b5d4b]">
                                Allergen alert
                            </label>
                            <textarea
                                rows={3}
                                value={form.allergenAlert}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        allergenAlert: e.target.value,
                                    }))
                                }
                                placeholder="Short warning, e.g. contains nuts/milk"
                                className="w-full rounded-2xl border border-[#eadfce] bg-white px-3 py-2 text-sm"
                            />
                        </div>

                        <div className="rounded-3xl border border-[#eadfce] bg-white p-4">
                            <p className="text-xs font-bold text-[#6b5d4b]">Preview</p>
                            <div className="mt-3 space-y-2 text-sm text-[#3f3425]">
                                <div className="flex justify-between">
                                    <span>Calories</span>
                                    <span>{form.calories} kcal</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Protein</span>
                                    <span>{form.protein} g</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Carbs</span>
                                    <span>{form.carbs} g</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Fat</span>
                                    <span>{form.fat} g</span>
                                </div>
                            </div>
                        </div>

                    </section>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
                    <button
                        onClick={() => setShowModal(false)}
                        className="rounded-full border border-[#eadfce] bg-white px-5 py-2 text-xs font-black text-[#6b5d4b]"
                    >
                        ยกเลิก
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="rounded-full bg-[#1f6b4e] px-6 py-2 text-xs font-black text-white disabled:opacity-70"
                    >
                        {isSaving ? "Saving..." : "Save menu"}
                    </button>
                </div>
            </Modal>
        </>
    );
}
