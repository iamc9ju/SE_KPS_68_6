"use client";

import { useState } from "react";
import Link from "next/link";

type Food = {
    name: string;
    desc: string;
    price: number;
    image: string;
};

function MenuCard({ item, addFood }: { item: Food; addFood: (food: Food) => void }) {
    return (
        <div
            style={{
                display: "flex",
                background: "#fff",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "16px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                alignItems: "center",
            }}
        >
            <img
                src={item.image}
                style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "12px",
                    marginRight: "20px",
                }}
            />

            <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0 }}>{item.name}</h3>
                <p style={{ color: "#64748b" }}>{item.desc}</p>
                <b style={{ color: "#84cc16" }}>{item.price} ฿</b>
            </div>

            <button
                onClick={() => addFood(item)}
                style={{
                    background: "#84cc16",
                    border: "none",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    color: "#fff",
                    fontWeight: 600
                }}
            >
                Add
            </button>
        </div>
    );
}

export default function GreenBowlCafe() {

    const [search, setSearch] = useState("");
    const [cart, setCart] = useState<Food[]>([]);

    const courses: Food[] = [
        {
            name: "Detox Course",
            desc: "Salad + Cold Press Juice + Fruit",
            price: 189,
            image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
        },
        {
            name: "Protein Course",
            desc: "Chicken Bowl + Protein Smoothie",
            price: 219,
            image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd"
        },
        {
            name: "Vegan Course",
            desc: "Plant Bowl + Avocado Salad",
            price: 199,
            image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af"
        }
    ];

    const singles: Food[] = [
        {
            name: "Avocado Bowl",
            desc: "Avocado, quinoa, veggies",
            price: 129,
            image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe"
        },
        {
            name: "Chicken Power Bowl",
            desc: "Grilled chicken with brown rice",
            price: 149,
            image: "https://images.unsplash.com/photo-1604908176997-4314b4c1a3c6"
        },
        {
            name: "Salmon Fit Bowl",
            desc: "Salmon with fresh vegetables",
            price: 179,
            image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288"
        }
    ];

    const addFood = (item: Food) => {
        setCart([...cart, item]);
    };

    const removeFood = (index: number) => {
        setCart(cart.filter((_, i) => i !== index));
    };

    const total = cart.reduce((sum, item) => sum + item.price, 0);

    const filteredCourses = courses.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    const filteredSingles = singles.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ display: "flex", background: "#f8fafc", minHeight: "100vh" }}>

            {/* MAIN */}

            <div style={{ flex: 1, padding: "40px" }}>

                <Link href="/dashboard/healthymenu">
                    <button
                        style={{
                            marginBottom: "20px",
                            padding: "8px 14px",
                            borderRadius: "8px",
                            border: "none",
                            background: "#e2e8f0",
                            cursor: "pointer"
                        }}
                    >
                        ← กลับ
                    </button>
                </Link>

                {/* HEADER */}

                <div
                    style={{
                        backgroundImage:
                            "url(https://images.unsplash.com/photo-1555396273-367ea4eb4db5)",
                        height: "220px",
                        borderRadius: "16px",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        display: "flex",
                        alignItems: "flex-end",
                        padding: "20px",
                        color: "#fff",
                        marginBottom: "30px",
                    }}
                >
                    <h1
                        style={{
                            fontSize: "42px",
                            fontWeight: 800,
                            textShadow: "0 2px 10px rgba(0,0,0,0.5)"
                        }}
                    >
                        Green Bowl Cafe
                    </h1>
                </div>

                {/* SEARCH */}

                <input
                    placeholder="ค้นหาเมนู..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                        padding: "10px",
                        borderRadius: "10px",
                        border: "1px solid #e5e7eb",
                        width: "300px",
                        marginBottom: "30px"
                    }}
                />

                {/* COURSE */}

                <h2>🥗 Course Menu</h2>

                {filteredCourses.map((item, index) => (
                    <MenuCard key={index} item={item} addFood={addFood} />
                ))}

                {/* SINGLE */}

                <h2 style={{ marginTop: "40px" }}>🍽 Single Menu</h2>

                {filteredSingles.map((item, index) => (
                    <MenuCard key={index} item={item} addFood={addFood} />
                ))}

            </div>

            {/* CART */}

            <div
                style={{
                    width: "320px",
                    background: "#fff",
                    padding: "25px",
                    borderLeft: "1px solid #e5e7eb"
                }}
            >

                <h2>ตะกร้า 🛒</h2>

                {cart.length === 0 && <p>ยังไม่มีสินค้า</p>}

                {cart.map((item, i) => (
                    <div
                        key={i}
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "10px"
                        }}
                    >
                        <span>{item.name}</span>

                        <button
                            onClick={() => removeFood(i)}
                            style={{
                                background: "#ef4444",
                                color: "#fff",
                                border: "none",
                                borderRadius: "6px",
                                padding: "4px 8px"
                            }}
                        >
                            ✕
                        </button>
                    </div>
                ))}

                <hr />

                <b>รวม : {total} ฿</b>

            </div>

        </div>
    );
}