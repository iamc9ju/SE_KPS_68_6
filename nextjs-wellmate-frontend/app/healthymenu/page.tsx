"use client";
import React, { useState } from "react";
import Link from "next/link";

import {
    LayoutDashboard,
    Heart,
    Calendar,
    MessageCircle,
    Salad,
    Utensils,
    BookOpen,
    TrendingUp,
} from "lucide-react";

type MenuItem = {
    id: number;
    name: string;
    desc: string;
    price: number;
    image: string;
    restaurantName: string;
};

type Restaurant = {
    id: number;
    name: string;
    desc: string;
    image: string;
    menu: string[];
    link: string;
};

const menuItems: MenuItem[] = [
    {
        id: 1,
        name: "Healthy Chicken Bowl",
        desc: "ไก่ย่างกับควินัว",
        price: 220,
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
        restaurantName: "Green Bowl Cafe",
    },
    {
        id: 2,
        name: "Salmon Protein Plate",
        desc: "แซลมอนกับหน่อไม้ฝรั่ง",
        price: 260,
        image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288",
        restaurantName: "Protein Kitchen",
    },
    {
        id: 3,
        name: "Avocado Toast",
        desc: "ขนมปังโฮลเกรนกับอะโวคาโด",
        price: 150,
        image: "https://images.unsplash.com/photo-1588137378633-dea1336ce1e2",
        restaurantName: "Fresh Life Restaurant",
    },
];

const restaurants: Restaurant[] = [
    {
        id: 1,
        name: "Green Bowl Cafe",
        desc: "ร้านอาหารสุขภาพและสลัด",
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5",
        menu: ["สลัดไก่ย่างควินัว", "สลัดทูน่าธัญพืช", "น้ำผักสกัดเย็น"],
        link: "/restaurantmenu/greenbowlcafe",
    },
    {
        id: 2,
        name: "Protein Kitchen",
        desc: "อาหารโปรตีนสูงสำหรับสายฟิต",
        image: "https://images.unsplash.com/photo-1552566626-52f8b828add9",
        menu: ["สเต็กไก่พริกไทยดำ", "ข้าวไรซ์เบอร์รี่อกไก่", "แพนเค้กเวย์โปรตีน"],
        link: "/restaurantmenu/proteinkitchen",
    },
    {
        id: 3,
        name: "Fresh Life Restaurant",
        desc: "เมนูคลีนและดีท็อกซ์",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
        menu: ["สมูทตี้โบวล์", "สลัดอะโวคาโด", "น้ำผลไม้ดีท็อกซ์"],
        link: "/restaurantmenu/freshlife",
    },
];

export default function HealthyMenu() {

    const [search, setSearch] = useState("");
    const [cart, setCart] = useState<MenuItem[]>([]);
    const [showCart, setShowCart] = useState(false);

    const filteredMenu = menuItems.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    const filteredRestaurants = restaurants.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    const addFood = (item: MenuItem) => {
        setCart([...cart, item]);
    };

    const removeFood = (index: number) => {
        setCart(cart.filter((_, i) => i !== index));
    };

    const total = cart.reduce((sum, item) => sum + item.price, 0);

    return (

        <div style={{ display: "flex", height: "100vh", background: "#f8fafc" }}>

            {/* SIDEBAR */}

            <div
                style={{
                    width: "260px",
                    background: "#f3f4f6",
                    padding: "30px 20px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}
            >

                <div>

                    <h2 style={{ fontWeight: 800, fontSize: "26px" }}>
                        <span style={{ color: "#a3e635" }}>WM</span>
                        <span style={{ color: "#1f2937" }}>WELLMATE</span>
                    </h2>

                    <div style={{ marginTop: "40px" }}>
                        <MenuItemButton icon={<LayoutDashboard size={22} />} label="แดชบอร์ด" />
                        <MenuItemButton icon={<Heart size={22} />} label="บริการโภชนาการ" />
                        <MenuItemButton icon={<Calendar size={22} />} label="ปฏิทิน" />
                        <MenuItemButton icon={<MessageCircle size={22} />} label="ข้อความ" />
                        <MenuItemButton icon={<Salad size={22} />} label="เมนูสุขภาพ" active />
                        <MenuItemButton icon={<Utensils size={22} />} label="แผนมื้ออาหาร" />
                        <MenuItemButton icon={<BookOpen size={22} />} label="บันทึกอาหาร" />
                        <MenuItemButton icon={<TrendingUp size={22} />} label="ความคืบหน้า" />
                    </div>

                </div>

            </div>

            {/* CONTENT */}

            <div style={{ flex: 1, padding: "40px", overflowY: "auto" }}>

                <div style={{ display: "flex", justifyContent: "space-between" }}>

                    <div>
                        <h1 style={{ fontSize: "38px", fontWeight: 800 }}>เมนูสุขภาพ</h1>
                        <p style={{ color: "#64748b" }}>
                            ค้นหาเมนูอาหารหรือร้านอาหารเพื่อสุขภาพ
                        </p>
                    </div>

                    <div
                        onClick={() => setShowCart(!showCart)}
                        style={{
                            cursor: "pointer",
                            fontSize: "20px",
                            background: "#f1f5f9",
                            padding: "10px 16px",
                            borderRadius: "12px",
                        }}
                    >
                        🛒 {cart.length}
                    </div>

                </div>

                {/* SEARCH */}

                <div style={{ marginTop: "20px", marginBottom: "30px" }}>
                    <input
                        placeholder="ค้นหาเมนูอาหารหรือร้านอาหาร..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            padding: "10px",
                            borderRadius: "10px",
                            border: "1px solid #e5e7eb",
                            width: "320px",
                        }}
                    />
                </div>

                {/* MENU */}

                <h2 style={{ marginBottom: "15px" }}>เมนูแนะนำ</h2>

                {filteredMenu.map((item) => (
                    <div
                        key={item.id}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            background: "#fff",
                            padding: "18px",
                            borderRadius: "14px",
                            marginBottom: "16px",
                        }}
                    >

                        <img
                            src={item.image}
                            style={{
                                width: "90px",
                                height: "90px",
                                borderRadius: "12px",
                                objectFit: "cover",
                                marginRight: "20px",
                            }}
                        />

                        <div style={{ flex: 1 }}>
                            <h3 style={{ margin: 0, fontWeight: 700 }}>
                                {item.name}
                                <span
                                    style={{
                                        fontSize: "14px",
                                        fontWeight: "normal",
                                        color: "#94a3b8",
                                        marginLeft: "10px",
                                    }}
                                >
                                    (จากร้าน {item.restaurantName})
                                </span>
                            </h3>
                            <p style={{ color: "#64748b" }}>{item.desc}</p>
                            <b style={{ color: "#84cc16" }}>{item.price} ฿</b>
                        </div>

                        <button
                            onClick={() => addFood(item)}
                            style={{
                                width: "42px",
                                height: "42px",
                                borderRadius: "50%",
                                border: "none",
                                background: "#84cc16",
                                color: "#fff",
                                fontSize: "22px",
                            }}
                        >
                            +
                        </button>

                    </div>
                ))}

                {/* RESTAURANTS */}

                <h2 style={{ marginTop: "40px", marginBottom: "20px" }}>
                    ร้านอาหารแนะนำ
                </h2>

                <div
                    style={{
                        display: "flex",
                        gap: "20px",
                        overflowX: "auto",
                        paddingBottom: "10px",
                    }}
                >

                    {filteredRestaurants.map((shop) => (

                        <Link
                            key={shop.id}
                            href={shop.link}
                            style={{ textDecoration: "none", color: "inherit" }}
                        >

                            <div
                                style={{
                                    minWidth: "220px",
                                    background: "#fff",
                                    borderRadius: "14px",
                                    padding: "14px",
                                    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                                    cursor: "pointer",
                                }}
                            >

                                <img
                                    src={shop.image}
                                    style={{
                                        width: "100%",
                                        height: "120px",
                                        objectFit: "cover",
                                        borderRadius: "10px",
                                        marginBottom: "10px",
                                    }}
                                />

                                <h3>{shop.name}</h3>

                                <p
                                    style={{
                                        fontSize: "13px",
                                        color: "#64748b",
                                        marginBottom: "8px",
                                    }}
                                >
                                    {shop.desc}
                                </p>

                                <div
                                    style={{
                                        background: "#f8fafc",
                                        padding: "8px",
                                        borderRadius: "8px",
                                        fontSize: "12px",
                                        color: "#475569",
                                    }}
                                >
                                    <strong style={{ color: "#84cc16" }}>เมนูเด็ด:</strong>{" "}
                                    {shop.menu.join(", ")}
                                </div>

                            </div>

                        </Link>

                    ))}

                </div>

            </div>

            {/* CART */}

            {showCart && (

                <div
                    style={{
                        width: "320px",
                        background: "#fff",
                        padding: "25px",
                        borderLeft: "1px solid #e5e7eb",
                    }}
                >

                    <h2>ตะกร้าสินค้า</h2>

                    {cart.length === 0 && <p>ไม่มีสินค้า</p>}

                    {cart.map((item, i) => (
                        <div
                            key={i}
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: "10px",
                            }}
                        >

                            <span>
                                {item.name} - {item.price} ฿
                            </span>

                            <button
                                onClick={() => removeFood(i)}
                                style={{
                                    background: "#ef4444",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "6px",
                                    padding: "4px 8px",
                                }}
                            >
                                ✕
                            </button>

                        </div>
                    ))}

                    <hr />

                    <b>ยอดรวม : {total} ฿</b>

                </div>

            )}

        </div>
    );
}

function MenuItemButton({
    icon,
    label,
    active = false,
}: {
    icon: any;
    label: string;
    active?: boolean;
}) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "14px 16px",
                borderRadius: "14px",
                marginBottom: "10px",
                cursor: "pointer",
                fontWeight: 600,
                color: active ? "#111" : "#64748b",
                background: active ? "#ccff00" : "transparent",
            }}
        >
            {icon}
            <span>{label}</span>
        </div>
    );
}