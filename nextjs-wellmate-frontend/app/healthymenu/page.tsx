"use client";
import React, { useState } from "react";
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
};

const menuItems: MenuItem[] = [
    {
        id: 1,
        name: "Healthy Chicken Bowl (ชามไก่เพื่อสุขภาพ)",
        desc: "ไก่ย่างกับควินัว",
        price: 220,
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
    },
    {
        id: 2,
        name: "Salmon Protein Plate (แซลมอนโปรตีนเพลต)",
        desc: "แซลมอนกับหน่อไม้ฝรั่ง",
        price: 260,
        image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288",
    },
    {
        id: 3,
        name: "Avocado Toast (ขนมปังอะโวคาโด)",
        desc: "ขนมปังโฮลเกรนกับอะโวคาโด",
        price: 150,
        image: "https://images.unsplash.com/photo-1588137378633-dea1336ce1e2",
    },
    {
        id: 4,
        name: "Greek Yogurt Bowl (กรีกโยเกิร์ต)",
        desc: "โยเกิร์ตเบอร์รีและกราโนล่า",
        price: 130,
        image: "https://images.unsplash.com/photo-1488477181946-6428a0291777",
    },
    {
        id: 5,
        name: "Protein Pancakes (แพนเค้กโปรตีน)",
        desc: "แพนเค้กโปรตีนสูง",
        price: 190,
        image: "https://images.unsplash.com/photo-1528207776546-365bb710ee93",
    },
    {
        id: 6,
        name: "Green Detox Salad (สลัดดีท็อกซ์สีเขียว)",
        desc: "สลัดเคลและแตงกวา",
        price: 170,
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
    },
];

export default function HealthyMenu() {
    const [search, setSearch] = useState("");
    const [cart, setCart] = useState<MenuItem[]>([]);
    const [showCart, setShowCart] = useState(false);

    const filteredMenu = menuItems.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    const addFood = (item: MenuItem) => {
        setCart([...cart, item]);
    };

    // ลบอาหารออกจากตะกร้า
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

                {/* PROMOTION */}

                <div
                    style={{
                        background: "#ccff00",
                        padding: "25px",
                        borderRadius: "20px",
                        textAlign: "center",
                    }}
                >
                    <p style={{ fontSize: "14px" }}>เริ่มต้นการดูแลสุขภาพของคุณด้วย</p>

                    <h3 style={{ fontSize: "20px", fontWeight: 800 }}>สิทธิ์ใช้ฟรี 1 เดือน</h3>

                    <p style={{ fontSize: "13px", marginBottom: "15px" }}>
                        ในการเข้าถึง WELLMATE
                    </p>

                    <button
                        style={{
                            background: "#0f172a",
                            color: "#fff",
                            border: "none",
                            padding: "12px 20px",
                            borderRadius: "30px",
                            fontWeight: 700,
                        }}
                    >
                        สมัครเลย!
                    </button>
                </div>
            </div>

            {/* CONTENT */}

            <div style={{ flex: 1, padding: "40px", overflowY: "auto" }}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <div>
                        <h1 style={{ fontSize: "38px", fontWeight: "800", marginBottom: "8px" }}>
                            เมนูสุขภาพ
                        </h1>
                        <p style={{ color: "#64748b", fontSize: "16px", fontWeight: "500" }}>
                            เพลิดเพลินกับตัวเลือกอาหารที่อุดมด้วยโภชนาการและแสนอร่อยของเรา
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

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "25px",
                        marginBottom: "35px",
                    }}
                >
                    <span style={{ marginRight: "10px", fontSize: "18px" }}>🔍</span>

                    <input
                        placeholder="ค้นหาอาหารเพื่อสุขภาพ..."
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

                {/* MENU LIST */}

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
                            <h3 style={{ margin: 0, fontWeight: 700 }}>{item.name}</h3>

                            <p style={{ color: "#64748b", margin: "6px 0" }}>{item.desc}</p>

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

                    {cart.length === 0 && <p>ไม่มีสินค้าในตะกร้า</p>}

                    {cart.map((item, i) => (
                        <div
                            key={i}
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
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
                                    cursor: "pointer",
                                }}
                            >
                                ✕
                            </button>
                        </div>
                    ))}

                    <hr />

                    <b>ยอดรวม : {total} ฿</b>

                    <button
                        style={{
                            marginTop: "20px",
                            width: "100%",
                            padding: "12px",
                            background: "#84cc16",
                            color: "#fff",
                            border: "none",
                            borderRadius: "10px",
                        }}
                    >
                        สั่งซื้อ
                    </button>
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
                boxShadow: active ? "0 4px 10px rgba(0,0,0,0.08)" : "none",
            }}
        >
            {icon}
            <span>{label}</span>
        </div>

    )

}