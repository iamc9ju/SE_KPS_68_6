"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, Bike, Store, UtensilsCrossed, Flame } from "lucide-react";
import api from "@/lib/api";
import Sidebar from "@/components/dashboard/Sidebar";
import BackgroundPattern from "@/components/dashboard/BackgroundPattern";

type MenuItem = {
    id: number;
    name: string;
    desc: string;
    price: number;
    image: string;
    restaurantName: string;
    category?: string;
    caloriesKcal?: number;
};

type Restaurant = {
    id: number;
    name: string;
    desc: string;
    image: string;
    link?: string;
};

type FoodPartnerMenuItemResponse = {
    menuItemId: number;
    name: string;
    description?: string | null;
    price: number | string;
    imageUrl?: string | null;
    category?: string | null;
    caloriesKcal?: number | null;
};

type FoodPartnerResponse = {
    foodPartnerId: number;
    partnerName: string;
    description?: string | null;
    menuItems?: FoodPartnerMenuItemResponse[];
};

type ApiEnvelope<T> = {
    success: boolean;
    data: T;
    message?: string;
};

type OrderMode = "delivery" | "pickup" | "dinein";
type FoodType =
    | "all"
    | "main"
    | "salad"
    | "drink"
    | "snack"
    | "noodle"
    | "rice"
    | "protein"
    | "vegan"
    | "dessert"
    | "soup";

const FOOD_TYPE_OPTIONS: { key: FoodType; label: string }[] = [
    { key: "all", label: "ทุกประเภท" },
    { key: "main", label: "อาหารจานหลัก" },
    { key: "protein", label: "โปรตีนสูง" },
    { key: "vegan", label: "มังสวิรัติ" },
    { key: "salad", label: "สลัด" },
    { key: "rice", label: "ข้าว" },
    { key: "noodle", label: "เส้น/ก๋วยเตี๋ยว" },
    { key: "soup", label: "ซุป" },
    { key: "snack", label: "ของว่าง" },
    { key: "dessert", label: "ของหวาน" },
    { key: "drink", label: "เครื่องดื่ม" },
];

const FALLBACK_FOOD_IMAGE =
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80";

const toSafeNumber = (value: number | string | null | undefined): number => {
    if (typeof value === "number") return value;
    if (typeof value === "string") {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : 0;
    }
    return 0;
};

function ModeButton({
    active,
    label,
    icon,
    onClick,
}: {
    active: boolean;
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`rounded-full px-4 py-2 text-sm font-bold border transition inline-flex items-center gap-2 ${
                active
                    ? "bg-[#B7E14A] text-[#223016] border-[#9FCC39]"
                    : "bg-white text-[#4b5563] border-[#d6e2c3] hover:bg-[#fffbea]"
            }`}
        >
            {icon}
            {label}
        </button>
    );
}

function MenuCard({
    item,
    onAdd,
}: {
    item: MenuItem;
    onAdd: () => void;
}) {
    return (
        <div className="rounded-3xl border border-[#d8e7c5] bg-white p-4">
            <div className="relative rounded-2xl overflow-hidden mb-3">
                <img src={item.image} alt={item.name} className="w-full h-[180px] object-cover" />
                {item.category && (
                    <span className="absolute top-3 left-3 rounded-xl bg-[#B7E14A] text-[#223016] text-xs font-black px-3 py-1">
                        {item.category}
                    </span>
                )}
                {typeof item.caloriesKcal === "number" && (
                    <span className="absolute top-3 right-3 rounded-xl bg-white text-[#374151] text-xs font-bold px-3 py-1 inline-flex items-center gap-1">
                        <Flame size={14} /> {item.caloriesKcal} kcal
                    </span>
                )}
            </div>
            <h3 className="text-lg font-black text-[#2f3d1d] leading-tight mb-1">{item.name}</h3>
            <p className="text-sm text-gray-500 line-clamp-2 mb-2">{item.desc}</p>
            <p className="text-xs text-gray-400 mb-3">จากร้าน {item.restaurantName}</p>
            <div className="flex items-center justify-between">
                <p className="font-black text-[#D6453D]">{item.price} ฿</p>
                <button
                    onClick={onAdd}
                    className="rounded-lg bg-[#F4C84A] text-[#33240A] px-3 py-1.5 text-sm font-black hover:bg-[#E8B63C] transition"
                >
                    เพิ่ม
                </button>
            </div>
        </div>
    );
}

function RestaurantCard({ shop }: { shop: Restaurant }) {
    const card = (
        <div className="rounded-2xl border border-[#d8e7c5] bg-white p-3 min-w-[200px]">
            <img src={shop.image} alt={shop.name} className="w-full h-[110px] rounded-xl object-cover mb-2" />
            <h4 className="font-black text-[#2f3d1d] text-sm line-clamp-1">{shop.name}</h4>
            <p className="text-xs text-gray-500 line-clamp-2">{shop.desc}</p>
        </div>
    );

    if (shop.link) {
        return (
            <Link href={shop.link} className="block">
                {card}
            </Link>
        );
    }

    return card;
}

export default function HealthyMenu() {
    const searchParams = useSearchParams();
    const openCartFromQuery = searchParams.get("cart");
    const [search, setSearch] = useState("");
    const [orderMode, setOrderMode] = useState<OrderMode>("delivery");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [selectedFoodType, setSelectedFoodType] = useState<FoodType>("all");
    const [cart, setCart] = useState<MenuItem[]>([]);
    const [showCart, setShowCart] = useState(false);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        if (openCartFromQuery === "1") {
            setShowCart(true);
        }
    }, [openCartFromQuery]);

    useEffect(() => {
        const fetchFoodPartners = async () => {
            try {
                setIsLoading(true);
                setErrorMessage(null);

                const res = await api.get<ApiEnvelope<FoodPartnerResponse[]> | FoodPartnerResponse[]>(
                    "/food-partner",
                );
                const rawPayload = res.data;
                const partners = Array.isArray(rawPayload)
                    ? rawPayload
                    : Array.isArray(rawPayload?.data)
                      ? rawPayload.data
                      : [];

                // Show only restaurants that have real image + name.
                const mappedRestaurants: Restaurant[] = partners
                    .map((partner) => {
                        const firstImage = partner.menuItems?.find((m) => !!m.imageUrl)?.imageUrl;
                        return {
                            id: partner.foodPartnerId,
                            name: partner.partnerName,
                            desc: partner.description || "",
                            image: firstImage || FALLBACK_FOOD_IMAGE,
                            link: `/restaurantmenu?partnerId=${partner.foodPartnerId}`,
                        };
                    })
                    .filter((r) => !!r.name);

                // Show only menu items that have required fields.
                const mappedMenuItems: MenuItem[] = partners.flatMap((partner) =>
                    (partner.menuItems ?? [])
                        .filter((item) => !!item.name && item.price !== null)
                        .map((item) => ({
                            id: item.menuItemId,
                            name: item.name,
                            desc: item.description || "",
                            price: toSafeNumber(item.price),
                            image: item.imageUrl || FALLBACK_FOOD_IMAGE,
                            restaurantName: partner.partnerName,
                            category: item.category || undefined,
                            caloriesKcal:
                                item.caloriesKcal === null || item.caloriesKcal === undefined
                                    ? undefined
                                    : item.caloriesKcal,
                        })),
                );

                setRestaurants(mappedRestaurants);
                setMenuItems(mappedMenuItems);
            } catch (error) {
                console.error("Failed to load food partners:", error);
                setErrorMessage("ไม่สามารถโหลดข้อมูลร้านอาหารได้");
            } finally {
                setIsLoading(false);
            }
        };

        fetchFoodPartners();
    }, []);

    const categories = useMemo(() => {
        const unique = Array.from(
            new Set(menuItems.map((item) => item.category).filter(Boolean) as string[]),
        );
        return ["all", ...unique];
    }, [menuItems]);

    const getFoodType = (item: MenuItem): FoodType => {
        const text = `${item.name} ${item.desc} ${item.category ?? ""}`.toLowerCase();
        if (/(coffee|tea|juice|smoothie|drink|water|latte|americano)/.test(text)) return "drink";
        if (/(salad)/.test(text)) return "salad";
        if (/(snack|toast|yogurt|granola)/.test(text)) return "snack";
        if (/(dessert|cake|ice cream|pudding|sweet)/.test(text)) return "dessert";
        if (/(soup|broth)/.test(text)) return "soup";
        if (/(noodle|ramen|pasta)/.test(text)) return "noodle";
        if (/(rice|fried rice|bowl)/.test(text)) return "rice";
        if (/(vegan|plant-based)/.test(text)) return "vegan";
        if (/(protein|chicken|salmon|beef|tuna)/.test(text)) return "protein";
        return "main";
    };

    const filteredMenu = useMemo(() => {
        const q = search.toLowerCase().trim();
        return menuItems.filter((item) => {
            const matchSearch =
                item.name.toLowerCase().includes(q) ||
                item.restaurantName.toLowerCase().includes(q);
            const matchCategory =
                selectedCategory === "all" || item.category === selectedCategory;
            const matchFoodType =
                selectedFoodType === "all" || getFoodType(item) === selectedFoodType;
            return matchSearch && matchCategory && matchFoodType;
        });
    }, [menuItems, search, selectedCategory, selectedFoodType]);

    const filteredRestaurants = useMemo(() => {
        const q = search.toLowerCase().trim();
        return restaurants.filter((r) => r.name.toLowerCase().includes(q));
    }, [restaurants, search]);
    const recommendedRestaurants = filteredRestaurants.slice(0, 6);

    const total = cart.reduce((sum, item) => sum + item.price, 0);

    return (
        <div className="flex h-screen bg-[#fffaf0] font-sans text-[#3d3522] overflow-hidden relative">
            <BackgroundPattern />
            <Sidebar />

            <main className={`flex-1 overflow-y-auto px-8 py-8 z-10 custom-scrollbar ml-64 ${showCart ? "mr-80" : "mr-6"}`}>
                <div className="max-w-[1240px] mx-auto">
                    <section className="rounded-[28px] bg-[#2f7d57] p-6 text-white border border-[#2a6f4d] mb-6">
                        <div className="flex justify-between items-start gap-4 mb-4">
                            <div>
                                <h1 className="text-3xl font-black mb-1">เมนูสุขภาพ</h1>
                                <p className="text-white/80 text-sm">ค้นหาเมนูอาหารหรือร้านอาหารเพื่อสุขภาพ</p>
                            </div>
                            <button
                                onClick={() => setShowCart((prev) => !prev)}
                                className="rounded-full bg-white text-[#3d3522] border border-[#e5e7eb] px-4 py-2 font-bold"
                            >
                                🛒 {cart.length}
                            </button>
                        </div>

                        <div className="bg-white rounded-2xl px-4 py-3 text-gray-700 border border-gray-200 flex items-center gap-3">
                            <Search size={20} className="text-gray-400" />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="สั่งอะไรดี?"
                                className="w-full outline-none bg-transparent placeholder:text-gray-400"
                            />
                        </div>
                    </section>

                    <section className="rounded-[24px] bg-white border border-[#d8e7c5] p-4 mb-6">
                        <div className="flex flex-wrap gap-2">
                            <ModeButton
                                active={orderMode === "delivery"}
                                label="จัดส่ง"
                                icon={<Bike size={16} />}
                                onClick={() => setOrderMode("delivery")}
                            />
                            <ModeButton
                                active={orderMode === "pickup"}
                                label="รับเองที่ร้าน"
                                icon={<Store size={16} />}
                                onClick={() => setOrderMode("pickup")}
                            />
                            <ModeButton
                                active={orderMode === "dinein"}
                                label="ดิลิเวอรี่ร้าน"
                                icon={<UtensilsCrossed size={16} />}
                                onClick={() => setOrderMode("dinein")}
                            />
                        </div>
                    </section>

                    {categories.length > 1 && (
                        <section className="rounded-[24px] bg-white border border-[#d8e7c5] p-4 mb-6">
                            <div className="flex gap-2 overflow-x-auto custom-scrollbar">
                                {categories.map((c) => (
                                    <button
                                        key={c}
                                        onClick={() => setSelectedCategory(c)}
                                        className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap border ${
                                            selectedCategory === c
                                                ? "bg-[#B7E14A] text-[#223016] border-[#9FCC39]"
                                                : "bg-white text-gray-600 border-gray-200"
                                        }`}
                                    >
                                        {c === "all" ? "ทั้งหมด" : c}
                                    </button>
                                ))}
                            </div>
                        </section>
                    )}

                    <section className="rounded-[24px] bg-white border border-[#d8e7c5] p-4 mb-6">
                        <div className="flex gap-2 overflow-x-auto custom-scrollbar">
                            {FOOD_TYPE_OPTIONS.map((t) => (
                                <button
                                    key={t.key}
                                    onClick={() => setSelectedFoodType(t.key)}
                                    className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap border ${
                                        selectedFoodType === t.key
                                            ? "bg-[#B7E14A] text-[#223016] border-[#9FCC39]"
                                            : "bg-white text-gray-600 border-gray-200"
                                    }`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </section>
                    {errorMessage && (
                        <div className="rounded-2xl bg-red-50 border border-red-100 text-red-700 px-4 py-3 mb-4">
                            {errorMessage}
                        </div>
                    )}

                    {isLoading && <p className="text-gray-500">Loading data...</p>}

                    {!isLoading && recommendedRestaurants.length > 0 && (
                        <section className="rounded-[24px] bg-white border border-[#d8e7c5] p-5 mb-6">
                            <h2 className="text-2xl font-black mb-4">Recommended Restaurants</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                                {recommendedRestaurants.map((shop) => (
                                    <RestaurantCard key={`recommended-${shop.id}`} shop={shop} />
                                ))}
                            </div>
                        </section>
                    )}

                    {!isLoading && filteredMenu.length > 0 && (
                        <section className="rounded-[24px] bg-white border border-[#d8e7c5] p-5 mb-6">
                            <h2 className="text-2xl font-black mb-4">Recommended Menus</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                {filteredMenu.map((item) => (
                                    <MenuCard
                                        key={item.id}
                                        item={item}
                                        onAdd={() => setCart((prev) => [...prev, item])}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {!isLoading && filteredRestaurants.length > 0 && (
                        <section className="rounded-[24px] bg-white border border-[#d8e7c5] p-5">
                            <h2 className="text-2xl font-black mb-4">All Restaurants</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {filteredRestaurants.map((shop) => (
                                    <RestaurantCard key={shop.id} shop={shop} />
                                ))}
                            </div>
                        </section>
                    )}
                    {!isLoading && filteredMenu.length === 0 && filteredRestaurants.length === 0 && !errorMessage && (
                        <div className="rounded-2xl bg-white border border-gray-100 px-4 py-6 text-gray-500 text-center">
                            ยังไม่มีข้อมูลเมนูหรือร้านที่พร้อมแสดงผล
                        </div>
                    )}
                </div>
            </main>

            {showCart && (
                <aside className="fixed right-0 top-0 w-80 h-screen bg-white border-l border-[#d8e7c5] p-6 z-30 overflow-y-auto">
                    <h2 className="text-xl font-black mb-4">ตะกร้าสินค้า</h2>
                    {cart.length === 0 && <p className="text-gray-500">ไม่มีสินค้า</p>}
                    <div className="space-y-3">
                        {cart.map((item, i) => (
                            <div key={`${item.id}-${i}`} className="flex justify-between items-center rounded-xl bg-[#fafafa] p-3">
                                <span className="text-sm">
                                    {item.name} - {item.price} ฿
                                </span>
                                <button
                                    onClick={() => setCart((prev) => prev.filter((_, idx) => idx !== i))}
                                    className="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 border-t border-gray-200 pt-4 font-black">ยอดรวม : {total} ฿</div>
                </aside>
            )}
        </div>
    );
}










