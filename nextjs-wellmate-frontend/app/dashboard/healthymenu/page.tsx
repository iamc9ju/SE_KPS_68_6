"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, Bike, Store, UtensilsCrossed, Flame, Heart, ShoppingBag, ShoppingCart, Leaf, Apple, Cake, CupSoda, Fish, Info, ChevronRight } from "lucide-react";
import api from "@/lib/api";
import RightSidebar from "@/components/dashboard/RightSidebar";
import RecipeCard from "@/components/healthymenu/RecipeCard";
import { useCartStore, MenuItem as StoreMenuItem } from "@/store/cart-store";

type LocalMenuItem = StoreMenuItem & {
    restaurantName: string;
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

// Unused ModeButton removed to match new UI design.

function CategoryItem({ icon, label, count, active, onClick }: { icon: React.ReactNode, label: string, count: string, active: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="flex flex-col items-center gap-2 group min-w-[100px]"
        >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${active ? "bg-[#C6E065] shadow-lg shadow-[#C6E065]/20 scale-110" : "bg-white border border-gray-100 group-hover:border-[#C6E065] group-hover:bg-gray-50"}`}>
                <div className={`${active ? "text-white" : "text-gray-400 group-hover:text-[#C6E065]"}`}>
                    {icon}
                </div>
            </div>
            <div className="text-center">
                <p className={`text-[13px] font-black leading-tight ${active ? "text-[#1a1a1a]" : "text-gray-500 group-hover:text-[#1a1a1a]"}`}>{label}</p>
                <p className="text-[10px] text-gray-400 font-bold">{count}</p>
            </div>
        </button>
    );
}

function MenuCardWrapper({
    item,
}: {
    item: LocalMenuItem;
}) {
    // MenuCard expects the cart-store MenuItem type
    return (
        <div className="group bg-white rounded-[32px] border border-gray-100 p-4 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-all duration-500 flex flex-col h-full relative">
            <button className="absolute top-6 right-6 z-20 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-gray-300 hover:text-red-500 transition-colors shadow-sm">
                <Heart size={16} />
            </button>

            <div className="relative aspect-square rounded-[24px] overflow-hidden mb-4 bg-gray-50">
                <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = FALLBACK_FOOD_IMAGE;
                    }}
                />
                {item.category && (
                    <span className="absolute top-4 left-4 rounded-full bg-[#C6E065] text-white text-[10px] font-black px-3 py-1.5 shadow-sm uppercase tracking-wider">
                        {item.category}
                    </span>
                )}
            </div>

            <div className="px-1 flex flex-col flex-1">
                <div className="flex gap-2 mb-3">
                    <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">100 กรัม</span>
                    <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">500 กรัม</span>
                </div>

                <div className="flex items-baseline gap-2 mb-1">
                    <p className="text-lg font-black text-[#FF6A2C]">฿{item.price}</p>
                    <p className="text-[13px] text-gray-300 font-bold line-through">฿{Math.round(item.price * 1.2)}</p>
                    <span className="text-[10px] text-red-500 font-black bg-red-50 px-1.5 py-0.5 rounded-md">-20%</span>
                </div>

                <h3 className="text-[15px] font-black text-[#1a1a1a] leading-tight mb-2 group-hover:text-[#FF6A2C] transition-colors line-clamp-2">
                    {item.name}
                </h3>

                <div className="flex items-center gap-2 mb-4">
                    <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(s => <span key={s} className="w-2.5 h-2.5 bg-yellow-400 rounded-full"></span>)}
                    </div>
                    <span className="text-[11px] text-gray-400 font-bold">(5.00)</span>
                </div>

                <AddToCartButton item={item} />
            </div>
        </div>
    );
}

function AddToCartButton({ item }: { item: LocalMenuItem }) {
    const addItem = useCartStore(state => state.addItem);
    return (
        <button
            onClick={() => addItem(item, 1)}
            className="mt-auto w-full rounded-2xl bg-[#C6E065]/10 text-[#C6E065] py-3 text-[13px] font-black hover:bg-[#C6E065] hover:text-white transition-all flex items-center justify-center gap-2 group/btn border border-[#C6E065]/20"
        >
            <ShoppingBag size={16} className="group-hover/btn:scale-110 transition-transform" />
            เลือกรายการนี้
        </button>
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
    const [showCart, setShowCart] = useState(false);

    const { items: cartItems, isOpen: isCartOpen, setIsOpen: setIsCartOpen, getTotalItems } = useCartStore();

    const [menuItems, setMenuItems] = useState<LocalMenuItem[]>([]);
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
                            link: `/dashboard/restaurantmenu?partnerId=${partner.foodPartnerId}`,
                        };
                    })
                    .filter((r) => !!r.name);

                // Show only menu items that have required fields.
                const mappedMenuItems: LocalMenuItem[] = partners.flatMap((partner) =>
                    (partner.menuItems ?? [])
                        .filter((item) => !!item.name && item.price !== null)
                        .map((item) => ({
                            menuItemId: item.menuItemId.toString(),
                            name: item.name,
                            description: item.description || "",
                            price: toSafeNumber(item.price),
                            imageUrl: item.imageUrl || FALLBACK_FOOD_IMAGE,
                            restaurantName: partner.partnerName,
                            category: item.category || undefined,
                            foodPartnerId: partner.foodPartnerId,
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

    const getFoodType = (item: LocalMenuItem): FoodType => {
        const text = `${item.name} ${item.description} ${item.category ?? ""}`.toLowerCase();
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

    // total has been removed

    return (
        <div className="flex-1 flex flex-col w-full h-screen bg-[#fffaf0] font-sans text-[#3d3522] overflow-hidden relative">
            <main className={`flex-1 overflow-y-auto px-8 py-8 z-10 custom-scrollbar ml-64 bg-[#FDF9F3] mr-0`}>
                <div className="max-w-none w-full">


                    {/* Category Circles Row */}
                    <section className="flex items-center gap-6 mb-10 overflow-x-auto custom-scrollbar pb-4 -mx-2 px-2">
                        {categories.filter(cat => cat !== "all").map((cat) => {
                            let icon = <Leaf size={24} />;
                            let label = cat === "all" ? "ทั้งหมด" : cat;
                            const count = menuItems.filter(item => cat === "all" || item.category === cat).length;

                            if (cat.toLowerCase().includes("fruit")) icon = <Apple size={24} />;
                            if (cat.toLowerCase().includes("dessert") || cat.toLowerCase().includes("หวาน")) icon = <Cake size={24} />;
                            if (cat.toLowerCase().includes("drink") || cat.toLowerCase().includes("น้ำ") || cat.toLowerCase().includes("เครื่องดื่ม")) icon = <CupSoda size={24} />;
                            if (cat.toLowerCase().includes("meat") || cat.toLowerCase().includes("เนื้อ") || cat.toLowerCase().includes("protein")) icon = <Fish size={24} />;

                            return (
                                <CategoryItem
                                    key={cat}
                                    icon={icon}
                                    label={label}
                                    count={`${count} รายการ`}
                                    active={selectedCategory === cat}
                                    onClick={() => setSelectedCategory(cat)}
                                />
                            );
                        })}
                    </section>

                    {/* Hero Section */}
                    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                        {/* Main Banner */}
                        <div className="lg:col-span-2 relative h-[450px] rounded-[40px] overflow-hidden group">
                            <img
                                src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                                alt="Fresh Organic"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent flex flex-col justify-center px-12 text-white">
                                <h2 className="text-6xl font-black mb-4 leading-tight drop-shadow-md">วัตถุดิบออร์แกนิก<br /><span className="text-[#84cc16]">เพื่อสุขภาพที่ดี</span></h2>
                                <p className="text-4xl font-black drop-shadow-md">฿590.00</p>
                            </div>
                        </div>

                        {/* Side Banners Grid */}
                        <div className="flex flex-col gap-6">
                            <div className="h-[213px] rounded-[32px] overflow-hidden relative group hover:shadow-md transition-shadow duration-300">
                                <img
                                    src="/images/banners/creamy_fruit.png"
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                                    alt="ผลไม้ครีมมี่"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent flex flex-col justify-center p-8 z-10">
                                    <h4 className="text-xl font-black text-white mb-2 drop-shadow-md">ผลไม้ครีมมี่<br />สูตรพิเศษสำหรับคุณ</h4>


                                </div>
                            </div>
                            <div className="h-[213px] rounded-[32px] overflow-hidden relative group hover:shadow-md transition-shadow duration-300">
                                <img
                                    src="/images/banners/healthy_snack.png"
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                                    alt="ของว่างสุขภาพ"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent flex flex-col justify-center p-8 z-10">
                                    <h4 className="text-xl font-black text-white mb-2 drop-shadow-md">ของว่างสุขภาพ<br />ใยอาหารสูง</h4>


                                </div>
                            </div>
                        </div>
                    </section>
                    {/* Inline Cart Banner Removed - Replaced by Floating FAB */}

                    <section className="mb-12">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                            <h2 className="text-3xl font-black text-[#1a1a1a]">สินค้าแนะนำสำหรับคุณ</h2>
                            <div className="flex items-center gap-6">
                                {["All", "Dessert", "Vegetables", "Snack"].map((tab) => {
                                    const labels: Record<string, string> = {
                                        "All": "ทั้งหมด",
                                        "Dessert": "ของหวาน",
                                        "Vegetables": "ผักสด",
                                        "Snack": "ของว่าง"
                                    };
                                    const displayTab = labels[tab] || tab;
                                    const isActive = (tab === "All" && selectedCategory === "all") || (selectedCategory === tab);

                                    return (
                                        <button
                                            key={tab}
                                            onClick={() => setSelectedCategory(tab.toLowerCase() === "all" ? "all" : tab)}
                                            className={`text-[13px] font-black transition-all ${isActive ? "text-[#C6E065] underline decoration-4 underline-offset-8" : "text-gray-400 hover:text-gray-600"}`}
                                        >
                                            {displayTab}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="text-center py-12">
                                <p className="text-[#8a7550] font-bold animate-pulse">กำลังโหลดข้อมูล...</p>
                            </div>
                        ) : filteredMenu.length === 0 ? (
                            <div className="py-20 bg-white/50 backdrop-blur-sm rounded-[40px] border border-[#f0e6cc] flex flex-col items-center justify-center text-center">
                                <div className="w-20 h-20 bg-[#faf8f2] rounded-full flex items-center justify-center mb-6">
                                    <ShoppingBag size={40} className="text-[#8a7550] opacity-20" />
                                </div>
                                <h3 className="text-xl font-black text-[#3d3522] mb-2">ไม่พบเมนูแนะนำ</h3>
                                <p className="text-[#8a7550] font-medium max-w-xs">ขออภัย ยังไม่มีรายการอาหารแนะนำที่ตรงตามโภชนาการของคุณในขณะนี้</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 animate-slideUp">
                                {filteredMenu.slice(0, 5).map((item) => (
                                    <MenuCardWrapper
                                        key={item.menuItemId}
                                        item={item}
                                    />
                                ))}
                            </div>
                        )}
                    </section>

                    {/* All Products Grid */}
                    <section className="mb-16">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-[#1a1a1a]">รายการอาหารทั้งหมด</h2>
                            <div className="bg-white rounded-2xl px-4 py-2 text-gray-700 border border-gray-100 flex items-center gap-3 w-[300px] shadow-sm focus-within:ring-2 focus-within:ring-[#C6E065]/20 transition-all">
                                <Search size={18} className="text-gray-400" />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="ค้นหาเมนูอาหาร..."
                                    className="w-full outline-none bg-transparent placeholder:text-gray-400 text-sm font-medium"
                                />
                            </div>
                        </div>

                        {filteredMenu.length === 0 ? (
                            <div className="py-24 bg-white/40 backdrop-blur-md rounded-[50px] border border-[#fdf0d5] flex flex-col items-center justify-center text-center shadow-lg shadow-[#fdf0d5]/10">
                                <div className="w-24 h-24 bg-[#fdf0d5] rounded-full flex items-center justify-center mb-8 relative">
                                    <UtensilsCrossed size={48} className="text-[#8a7550] opacity-30" />
                                    <div className="absolute -bottom-1 -right-1 bg-white p-2 rounded-full shadow-sm">
                                        <Search size={20} className="text-[#C6E065]" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-black text-[#3d3522] mb-3">ไม่พบรายการอาหาร</h3>
                                <p className="text-[#8a7550] font-medium max-w-sm px-6">ขออภัย เราไม่พบเมนูอาหารที่คุณกำลังมองหา ลองเปลี่ยนหมวดหมู่หรือคำค้นหาดูนะครับ</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                {filteredMenu.map((item) => (
                                    <MenuCardWrapper
                                        key={item.menuItemId}
                                        item={item}
                                    />
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Top Seller Users */}
                    <section className="mb-12">
                        <div className="flex items-center gap-4 mb-8">
                            <h2 className="text-2xl font-black text-[#1a1a1a]">ร้านค้ายอดนิยม</h2>
                            <div className="h-[2px] flex-1 bg-gray-100 rounded-full"></div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                            {restaurants.slice(0, 6).map((shop) => (
                                <Link
                                    key={shop.id}
                                    href={shop.link || "#"}
                                    className="group flex flex-col items-center gap-3 p-4 bg-white rounded-3xl border border-gray-50 hover:border-[#C6E065] hover:shadow-xl hover:shadow-[#C6E065]/5 transition-all duration-500"
                                >
                                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
                                        <img src={shop.image} alt={shop.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    </div>
                                    <div className="text-center">
                                        <h4 className="text-[13px] font-black text-[#1a1a1a] line-clamp-1 group-hover:text-[#C6E065] transition-colors">{shop.name}</h4>
                                        <p className="text-[10px] text-gray-400 font-bold">120+ เมนู</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                </div>
            </main>

            <RightSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

            {/* Floating Cart Button (Shopee/Lazada style - Brown/Cream Edition) */}
            <button
                onClick={() => setIsCartOpen(true)}
                className="fixed bottom-8 right-8 z-[60] bg-[#faf8f2] border-[6px] border-[#8a7550] shadow-[0_10px_40px_-5px_rgba(138,117,80,0.4)] p-4 rounded-full hover:scale-110 hover:border-[#3d3522] transition-all duration-300 flex items-center justify-center group"
            >
                <div className="relative text-[#8a7550] group-hover:text-[#3d3522] transition-colors">
                    <ShoppingCart size={36} strokeWidth={2.5} />
                    {cartItems.length > 0 && (
                        <div className="absolute -top-3 -left-4 bg-red-500 text-white text-[12px] font-black w-[26px] h-[26px] rounded-full flex items-center justify-center shadow-lg border-2 border-[#faf8f2]">
                            {getTotalItems() > 99 ? '99+' : getTotalItems()}
                        </div>
                    )}
                </div>
            </button>
        </div>
    );
}









