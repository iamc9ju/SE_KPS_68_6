"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ShoppingCart, X } from "lucide-react";
import api from "@/lib/api";
import MenuCard from "@/components/restaurant/MenuCard";
import Sidebar from "@/components/dashboard/Sidebar";
import BackgroundPattern from "@/components/dashboard/BackgroundPattern";

type Food = {
    id: number;
    name: string;
    desc: string;
    price: number;
    image: string;
};

type FoodPartnerMenuItemResponse = {
    menuItemId: number;
    name: string;
    description?: string | null;
    price: number | string;
    imageUrl?: string | null;
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

export default function RestaurantMenuPage() {
    const searchParams = useSearchParams();
    const partnerIdParam = searchParams.get("partnerId");
    const partnerId = partnerIdParam ? Number(partnerIdParam) : null;

    const [search, setSearch] = useState("");
    const [cart, setCart] = useState<Food[]>([]);
    const [partnerName, setPartnerName] = useState("Restaurant Menu");
    const [menuItems, setMenuItems] = useState<Food[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showCart, setShowCart] = useState(false);

    useEffect(() => {
        const fetchPartner = async () => {
            try {
                setIsLoading(true);
                setErrorMessage(null);

                const res = await api.get<ApiEnvelope<FoodPartnerResponse[]> | FoodPartnerResponse[]>("/food-partner");
                const payload = res.data;
                const partners = Array.isArray(payload)
                    ? payload
                    : Array.isArray(payload?.data)
                      ? payload.data
                      : [];

                if (partners.length === 0) {
                    setPartnerName("Restaurant Menu");
                    setMenuItems([]);
                    return;
                }

                const selectedPartner =
                    typeof partnerId === "number" && Number.isFinite(partnerId)
                        ? partners.find((p) => p.foodPartnerId === partnerId) ?? partners[0]
                        : partners[0];

                setPartnerName(selectedPartner.partnerName || "Restaurant Menu");

                const mappedMenus: Food[] = (selectedPartner.menuItems ?? []).map((item) => ({
                    id: item.menuItemId,
                    name: item.name,
                    desc: item.description || "",
                    price: toSafeNumber(item.price),
                    image: item.imageUrl || FALLBACK_FOOD_IMAGE,
                }));

                setMenuItems(mappedMenus);
            } catch (error) {
                console.error("Failed to load restaurant menu:", error);
                setErrorMessage("Unable to load restaurant data.");
                setPartnerName("Restaurant Menu");
                setMenuItems([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPartner();
    }, [partnerId]);

    const addFood = (item: Food) => {
        setCart((prev) => [...prev, item]);
    };

    const removeFood = (index: number) => {
        setCart((prev) => prev.filter((_, i) => i !== index));
    };

    const total = useMemo(() => cart.reduce((sum, item) => sum + item.price, 0), [cart]);

    const filteredMenus = useMemo(
        () => menuItems.filter((item) => item.name.toLowerCase().includes(search.toLowerCase())),
        [menuItems, search],
    );
    const featuredMenus = useMemo(() => menuItems.slice(0, 4), [menuItems]);
    const popularMenus = useMemo(
        () => [...menuItems].sort((a, b) => b.price - a.price).slice(0, 4),
        [menuItems],
    );

    return (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", width: "100%", background: "#fffaf0", minHeight: "100vh", color: "#3d3522", position: "relative" }}>
            {/* BackgroundPattern and Sidebar are provided by DashboardLayout */}

            <div style={{ flex: 1, padding: "40px", marginLeft: "256px", marginRight: "24px", zIndex: 10 }}>
                <Link href="/dashboard/healthymenu">
                    <button
                        style={{
                            marginBottom: "20px",
                            padding: "8px 14px",
                            borderRadius: "8px",
                            border: "1px solid #d8e7c5",
                            background: "#ffffff",
                            cursor: "pointer",
                            color: "#2f3d1d",
                            fontWeight: 700,
                        }}
                    >
                        Back
                    </button>
                </Link>

                <div
                    style={{
                        backgroundImage:
                            "url(https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80)",
                        height: "220px",
                        borderRadius: "20px",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        display: "flex",
                        alignItems: "flex-end",
                        padding: "20px",
                        color: "#fff",
                        marginBottom: "30px",
                        border: "1px solid #2a6f4d",
                    }}
                >
                    <h1
                        style={{
                            fontSize: "42px",
                            fontWeight: 800,
                            textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                        }}
                    >
                        {partnerName}
                    </h1>
                </div>

                <input
                    placeholder="Search menu..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                        padding: "10px",
                        borderRadius: "12px",
                        border: "1px solid #d8e7c5",
                        width: "300px",
                        marginBottom: "30px",
                        background: "#ffffff",
                    }}
                />

                {errorMessage && <p style={{ color: "#dc2626", marginBottom: "16px" }}>{errorMessage}</p>}
                {isLoading && <p style={{ color: "#5f6b55" }}>Loading menus...</p>}

                {!isLoading && filteredMenus.length === 0 && (
                    <div style={{
                        padding: "60px 20px",
                        background: "rgba(255, 255, 255, 0.5)",
                        backdropFilter: "blur(10px)",
                        borderRadius: "30px",
                        border: "1px solid #d8e7c5",
                        textAlign: "center",
                        marginTop: "20px"
                    }}>
                        <div style={{
                            width: "80px",
                            height: "80px",
                            background: "#faf8f2",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 20px"
                        }}>
                             <ShoppingCart size={40} style={{ color: "#8a7550", opacity: 0.2 }} />
                        </div>
                        <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#3d3522", marginBottom: "8px" }}>
                            ไม่พบรายการอาหารในขณะนี้
                        </h3>
                        <p style={{ color: "#8a7550", fontWeight: 500 }}>
                            ขออภัย ร้านนี้ยังไม่มีรายการอาหาร หรือไม่มีรายการที่ตรงกับคำค้นหาของคุณ
                        </p>
                    </div>
                )}

                {!isLoading && featuredMenus.length > 0 && (
                    <section style={{ marginBottom: "30px" }}>
                        <h2 style={{ color: "#2f3d1d", marginBottom: "12px" }}>เมนูแนะนำประจำร้าน</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "12px" }}>
                            {featuredMenus.map((item) => (
                                <MenuCard key={`featured-${item.id}`} item={item} addFood={addFood} />
                            ))}
                        </div>
                    </section>
                )}

                {!isLoading && popularMenus.length > 0 && (
                    <section style={{ marginBottom: "30px" }}>
                        <h2 style={{ color: "#2f3d1d", marginBottom: "12px" }}>เมนูยอดฮิต</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "12px" }}>
                            {popularMenus.map((item) => (
                                <MenuCard key={`popular-${item.id}`} item={item} addFood={addFood} />
                            ))}
                        </div>
                    </section>
                )}

                {!isLoading && filteredMenus.length > 0 && (
                    <section>
                        <h2 style={{ color: "#2f3d1d", marginBottom: "12px" }}>เมนูทั้งหมด</h2>
                        {filteredMenus.map((item) => (
                            <MenuCard key={item.id} item={item} addFood={addFood} />
                        ))}
                    </section>
                )}
            </div>

            <button
                onClick={() => setShowCart((prev) => !prev)}
                style={{
                    position: "fixed",
                    top: "28px",
                    right: "28px",
                    zIndex: 40,
                    border: "1px solid #d8e7c5",
                    background: "#ffffff",
                    borderRadius: "999px",
                    padding: "10px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontWeight: 800,
                    color: "#2f3d1d",
                    boxShadow: "0 8px 20px rgba(34, 48, 22, 0.12)",
                    cursor: "pointer",
                }}
            >
                <ShoppingCart size={18} />
                {cart.length}
            </button>

            {showCart && (
                <div
                    style={{
                        position: "fixed",
                        right: 0,
                        top: 0,
                        width: "320px",
                        height: "100vh",
                        background: "#ffffff",
                        padding: "25px",
                        borderLeft: "1px solid #d8e7c5",
                        zIndex: 35,
                        overflowY: "auto",
                    }}
                >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                        <h2 style={{ color: "#2f3d1d", margin: 0 }}>Cart</h2>
                        <button
                            onClick={() => setShowCart(false)}
                            style={{
                                border: "1px solid #d8e7c5",
                                background: "#fff",
                                borderRadius: "8px",
                                padding: "6px",
                                cursor: "pointer",
                                color: "#5f6b55",
                            }}
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {cart.length === 0 && <p style={{ color: "#5f6b55" }}>No items in cart.</p>}

                    {cart.map((item, i) => (
                        <div
                            key={`${item.id}-${i}`}
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: "10px",
                            }}
                        >
                            <span>{item.name}</span>

                            <button
                                onClick={() => removeFood(i)}
                                style={{
                                    background: "#d6453d",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "6px",
                                    padding: "4px 8px",
                                }}
                            >
                                X
                            </button>
                        </div>
                    ))}

                    <hr />

                    <b style={{ color: "#2f3d1d" }}>Total: {total} THB</b>
                </div>
            )}
        </div>
    );
}
