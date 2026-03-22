"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    LayoutDashboard,
    CalendarDays,
    Heart,
    Calendar,
    MessageCircle,
    Utensils,
    Package,
    BookOpen,
    ClipboardList,
    BarChart3,
    Settings,
    LogOut
} from "lucide-react";

type Meal = {
    name: string;
    calories: string;
    time: string;
};

export default function MealPlanPage() {
    const router = useRouter();

    // 📅 วันที่ที่เลือก
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    // 🍱 meals แยกตามวัน
    const [meals, setMeals] = useState<Record<string, Meal[]>>({
        [selectedDate]: [
            { name: "Avocado Bowl", calories: "350 kcal", time: "เช้า" },
            { name: "Chicken Salad", calories: "420 kcal", time: "กลางวัน" },
        ],
    });

    const [newMeal, setNewMeal] = useState<Meal>({
        name: "",
        calories: "",
        time: "เช้า",
    });

    const addMeal = () => {
        if (!newMeal.name) return;

        setMeals((prev) => ({
            ...prev,
            [selectedDate]: [...(prev[selectedDate] || []), newMeal],
        }));

        setNewMeal({ name: "", calories: "", time: "เช้า" });
    };

    const deleteMeal = (index: number) => {
        const updated = [...(meals[selectedDate] || [])];
        updated.splice(index, 1);

        setMeals({
            ...meals,
            [selectedDate]: updated,
        });
    };

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "#f3f4f6" }}>

            {/* SIDEBAR */}
            <div style={sidebarStyle}>
                <div>
                    <div style={{ textAlign: "center", marginBottom: "30px" }}>
                        <img
                            // src="https://cdn-icons-png.flaticon.com/512/1046/1046784.png"
                            style={{ width: "50px" }}
                        />
                        <div style={{ color: "#84cc16", fontWeight: 700 }}>WALLMATE</div>
                    </div>

                    {menuItems.map((item, i) => {
                        const active = item.name === "แผนการกิน";
                        const Icon = item.icon;

                        return (
                            <div key={i} style={{
                                ...menuItemStyle,
                                background: active ? "#a3e635" : "transparent",
                                color: active ? "#1a2e05" : "#6b7280",
                                fontWeight: active ? 600 : 400,
                            }}>
                                <Icon size={20} />
                                {item.name}
                            </div>
                        );
                    })}
                </div>

                <div style={logoutStyle}>
                    <LogOut size={20} />
                    ออกจากระบบ
                </div>
            </div>

            {/* MAIN */}
            <div style={{ flex: 1, padding: "30px" }}>

                {/* BANNER */}
                <div style={bannerStyle}>
                    <div style={overlayStyle}>
                        <h1 style={titleStyle}>แผนการกินของคุณ</h1>
                        <p style={subtitleStyle}>
                            ดูแลสุขภาพ เริ่มต้นจากมื้ออาหารที่ดี
                        </p>
                    </div>
                </div>

                {/* DATE PICKER */}
                <div style={{ marginTop: "20px" }}>
                    <label>เลือกวันที่: </label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        style={{
                            marginLeft: "10px",
                            padding: "8px",
                            borderRadius: "8px",
                            border: "1px solid #ccc"
                        }}
                    />
                </div>

                <div style={{ display: "flex", gap: "30px", marginTop: "20px" }}>

                    {/* LEFT */}
                    <div style={{ flex: 1 }}>

                        {/* FORM */}
                        <div style={formStyle}>
                            <h3>เพิ่มเมนู</h3>

                            <input
                                placeholder="ชื่ออาหาร"
                                value={newMeal.name}
                                onChange={(e) =>
                                    setNewMeal({ ...newMeal, name: e.target.value })
                                }
                                style={inputStyle}
                            />

                            <input
                                placeholder="แคลอรี่ (เช่น 300 kcal)"
                                value={newMeal.calories}
                                onChange={(e) =>
                                    setNewMeal({ ...newMeal, calories: e.target.value })
                                }
                                style={inputStyle}
                            />

                            <select
                                value={newMeal.time}
                                onChange={(e) =>
                                    setNewMeal({ ...newMeal, time: e.target.value })
                                }
                                style={inputStyle}
                            >
                                <option>เช้า</option>
                                <option>กลางวัน</option>
                                <option>เย็น</option>
                            </select>

                            <button onClick={addMeal} style={btnStyle}>
                                + เพิ่มเมนู
                            </button>
                        </div>

                        {/* LIST */}
                        {["เช้า", "กลางวัน", "เย็น"].map((time) => (
                            <div key={time} style={{ marginTop: "20px" }}>
                                <h3>{time}</h3>

                                {(meals[selectedDate] || [])
                                    .filter((m) => m.time === time)
                                    .map((meal, i) => (
                                        <div key={i} style={cardStyle}>
                                            <div>
                                                <h4 style={{ margin: 0 }}>{meal.name}</h4>
                                                <p style={{ color: "#888" }}>{meal.calories}</p>
                                            </div>

                                            <button
                                                onClick={() => deleteMeal(i)}
                                                style={deleteBtn}
                                            >
                                                ลบ
                                            </button>
                                        </div>
                                    ))}
                            </div>
                        ))}

                        <button 
                            onClick={() => router.push('/fooddiary')}
                            style={{
                                marginTop: "30px",
                                padding: "12px",
                                background: "#84cc16",
                                color: "#fff",
                                border: "none",
                                borderRadius: "10px",
                                width: "100%",
                                fontSize: "16px",
                                fontWeight: 600,
                                cursor: "pointer",
                            }}
                        >
                            บันทึกข้อมูล
                        </button>
                    </div>

                    {/* RIGHT */}
                    <div style={{ width: "400px" }}>
                        <h2>เมนูแนะนำ</h2>

                        {recommended.map((item, i) => (
                            <div key={i} style={recommendCard}>
                                <img src={item.img} style={recommendImg} />
                                <h4>{item.name}</h4>
                                <p>{item.cal}</p>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}

/* DATA */

const recommended = [
    {
        name: "ข้าวกล้อง",
        cal: "300 kcal",
        img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d"
    },
    {
        name: "สลัด",
        cal: "300 kcal",
        img: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9"
    }
];

const menuItems = [
    { name: "แดชบอร์ด", icon: LayoutDashboard },
    { name: "ประวัติการนัดหมาย", icon: CalendarDays },
    { name: "บริการโภชนาการ", icon: Heart },
    { name: "ปฏิทิน", icon: Calendar },
    { name: "ข้อความ", icon: MessageCircle },
    { name: "ร้านอาหารสุขภาพ", icon: Utensils },
    { name: "รายการสั่งซื้อ", icon: Package },
    { name: "แผนการกิน", icon: BookOpen },
    { name: "บันทึกอาหาร", icon: ClipboardList },
    { name: "ความคืบหน้า", icon: BarChart3 },
    { name: "ตั้งค่า", icon: Settings },
];

/* STYLE */

const sidebarStyle = {
    width: "260px",
    background: "#f9fafb",
    padding: "20px 16px",
    borderRight: "1px solid #e5e7eb",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
};

const menuItemStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px",
    borderRadius: "12px",
    marginTop: "6px",
    cursor: "pointer",
};

const logoutStyle = {
    display: "flex",
    gap: "10px",
    color: "#9ca3af",
    cursor: "pointer",
};

const bannerStyle = {
    backgroundImage:
        "url(https://images.unsplash.com/photo-1498837167922-ddd27525d352)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    borderRadius: "20px",
    height: "180px",
    display: "flex",
    alignItems: "center",
};

const overlayStyle = {
    background: "rgba(0,0,0,0.4)",
    width: "100%",
    height: "100%",
    borderRadius: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "30px",
};

const titleStyle = {
    color: "#fff",
    fontSize: "36px",
    fontWeight: 800,
    margin: 0,
    textShadow: "0 4px 10px rgba(0,0,0,0.5)",
};

const subtitleStyle = {
    color: "#e5e7eb",
    marginTop: "8px",
    fontSize: "16px",
};

const formStyle = {
    background: "#fff",
    padding: "20px",
    borderRadius: "16px",
};

const inputStyle = {
    display: "block",
    marginTop: "10px",
    padding: "10px",
    width: "100%",
    borderRadius: "8px",
    border: "1px solid #ddd",
};

const btnStyle = {
    marginTop: "15px",
    padding: "10px",
    background: "#84cc16",
    border: "none",
    borderRadius: "10px",
    color: "#fff",
    cursor: "pointer",
    width: "100%",
};

const cardStyle = {
    display: "flex",
    justifyContent: "space-between",
    background: "#fff",
    padding: "15px",
    borderRadius: "12px",
    marginTop: "10px",
};

const deleteBtn = {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "6px 10px",
    cursor: "pointer",
};

const recommendCard = {
    background: "#fff",
    borderRadius: "16px",
    padding: "15px",
    marginTop: "15px",
    textAlign: "center" as const,
};

const recommendImg = {
    width: "100%",
    height: "150px",
    objectFit: "cover" as const,
    borderRadius: "12px",
};