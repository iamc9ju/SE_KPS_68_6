"use client";

import { useState } from "react";
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
    LogOut,
    CheckCircle,
    Circle
} from "lucide-react";

type Meal = {
    name: string;
    calories: number;
    time: string;
    done?: boolean;
};

export default function FoodDiaryPage() {

    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    // 📌 PLAN (มาจากหน้า MealPlan)
    const [plannedMeals, setPlannedMeals] = useState<Record<string, Meal[]>>({
        [selectedDate]: [
            { name: "Avocado Bowl", calories: 350, time: "เช้า", done: false },
            { name: "Chicken Salad", calories: 420, time: "กลางวัน", done: false },
        ],
    });

    // ✅ กินจริง
    const [loggedMeals, setLoggedMeals] = useState<Record<string, Meal[]>>({});

    const toggleDone = (index: number) => {
        const updated = [...(plannedMeals[selectedDate] || [])];
        const meal = updated[index];

        meal.done = !meal.done;

        // ถ้าติ๊ก = ย้ายไป logged
        if (meal.done) {
            setLoggedMeals((prev) => ({
                ...prev,
                [selectedDate]: [...(prev[selectedDate] || []), meal],
            }));
        }

        setPlannedMeals({
            ...plannedMeals,
            [selectedDate]: updated,
        });
    };

    const totalKcal = (loggedMeals[selectedDate] || [])
        .reduce((sum, m) => sum + m.calories, 0);

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "#f3f4f6" }}>

            {/* SIDEBAR */}
            <div style={sidebarStyle}>
                <div>
                    <div style={{ textAlign: "center", marginBottom: 30 }}>
                        <div style={{ color: "#84cc16", fontWeight: 800 }}>
                            WALLMATE
                        </div>
                    </div>

                    {menuItems.map((item, i) => {
                        const active = item.name === "บันทึกอาหาร";
                        const Icon = item.icon;

                        return (
                            <div key={i} style={{
                                ...menuItemStyle,
                                background: active ? "#a3e635" : "transparent",
                                color: active ? "#1a2e05" : "#6b7280"
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
                        <h1 style={titleStyle}>บันทึกการกิน</h1>
                        <p style={subtitleStyle}>
                            ติดตามสิ่งที่คุณ “วางแผน” และ “กินจริง”
                        </p>
                    </div>
                </div>

                {/* DATE + SUMMARY */}
                <div style={topBar}>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        style={dateStyle}
                    />

                    <div style={kcalBox}>
                        🔥 กินไปแล้ว {totalKcal} kcal
                    </div>
                </div>

                {/* CONTENT */}
                <div style={{ display: "flex", gap: "30px", marginTop: "20px" }}>

                    {/* LEFT - PLAN */}
                    <div style={{ flex: 1 }}>
                        <h2>📋 แผนที่วางไว้</h2>

                        {(plannedMeals[selectedDate] || []).map((meal, i) => (
                            <div key={i} style={planCard}>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <div onClick={() => toggleDone(i)} style={{ cursor: "pointer" }}>
                                        {meal.done ? <CheckCircle color="green" /> : <Circle />}
                                    </div>

                                    <div>
                                        <h4 style={{ margin: 0 }}>{meal.name}</h4>
                                        <p style={{ margin: 0, color: "#888" }}>
                                            {meal.calories} kcal • {meal.time}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* RIGHT - LOGGED */}
                    <div style={{ width: "400px" }}>
                        <h2>✅ กินแล้ว</h2>

                        {(loggedMeals[selectedDate] || []).map((meal, i) => (
                            <div key={i} style={logCard}>
                                <h4 style={{ margin: 0 }}>{meal.name}</h4>
                                <p style={{ color: "#666" }}>
                                    {meal.calories} kcal
                                </p>
                            </div>
                        ))}

                        {/* Nutrition Tip 1 */}
                        <div
                            style={{ ...tipCardStyle, cursor: "pointer" }}
                            onClick={() => window.open("https://health.kapook.com/view289834.html", "_blank")}
                        >
                            <img
                                src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800"
                                alt="การทานอาหารหลากสี"
                                style={tipImgStyle}
                            />
                            <div style={{ padding: "20px" }}>
                                <h3 style={{ margin: "0 0 10px 0", color: "#4d7c0f", fontSize: "16px" }}>💡 ทานอาหารหลากสี</h3>
                                <p style={{ margin: 0, color: "#4b5563", lineHeight: 1.5, fontSize: "14px" }}>
                                    สุขภาพที่ดีเริ่มจากการกิน ควรเน้นผักและผลไม้หลากสีสันให้ได้ 50% ของจาน และเลือกธัญพืชไม่ขัดสีอย่างข้าวกล้อง เพื่อรับวิตามินและกากใยอย่างครบถ้วน
                                </p>
                                <div style={{ marginTop: "10px", fontSize: "12px", color: "#3b82f6", display: "flex", alignItems: "center", gap: "4px" }}>
                                    ที่มา: health.kapook.com 🔗
                                </div>
                            </div>
                        </div>

                        {/* Nutrition Tip 2 */}
                        <div
                            style={{ ...tipCardStyle, cursor: "pointer" }}
                            onClick={() => window.open("https://www.thairath.co.th/lifestyle/food/2914708", "_blank")}
                        >
                            <img
                                src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800"
                                alt="โปรตีนกับการลดน้ำหนัก"
                                style={tipImgStyle}
                            />
                            <div style={{ padding: "20px" }}>
                                <h3 style={{ margin: "0 0 10px 0", color: "#4d7c0f", fontSize: "16px" }}>💪 โปรตีนคุมน้ำหนัก</h3>
                                <p style={{ margin: 0, color: "#4b5563", lineHeight: 1.5, fontSize: "14px" }}>
                                    การลดน้ำหนักที่ดีคือการลดไขมันแต่รักษากล้ามเนื้อ การเพิ่มโปรตีนในมื้ออาหารจะช่วยให้อิ่มนานขึ้นและลดความอยากอาหารจุบจิบในระหว่างวัน
                                </p>
                                <div style={{ marginTop: "10px", fontSize: "12px", color: "#3b82f6", display: "flex", alignItems: "center", gap: "4px" }}>
                                    ที่มา: www.thairath.co.th 🔗
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

/* STYLE */

const sidebarStyle = {
    width: "260px",
    background: "#f9fafb",
    padding: "20px 16px",
    borderRight: "1px solid #e5e7eb",
    display: "flex",
    flexDirection: "column" as const,
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
};

const bannerStyle = {
    backgroundImage: "url(https://images.unsplash.com/photo-1498837167922-ddd27525d352)",
    height: "160px",
    borderRadius: "20px",
    display: "flex",
};

const overlayStyle = {
    background: "rgba(0,0,0,0.4)",
    width: "100%",
    borderRadius: "20px",
    padding: "30px",
};

const titleStyle = {
    color: "#fff",
    fontSize: "34px",
    fontWeight: 800,
};

const subtitleStyle = {
    color: "#ddd",
};

const topBar = {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
};

const dateStyle = {
    padding: "8px",
    borderRadius: "8px",
};

const kcalBox = {
    background: "#84cc16",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "10px",
};

const planCard = {
    background: "#fff",
    padding: "15px",
    borderRadius: "12px",
    marginTop: "10px",
};

const tipCardStyle = {
    marginTop: "30px",
    borderRadius: "16px",
    overflow: "hidden",
    background: "#fff",
    border: "1px solid #e5e7eb",
};

const tipImgStyle = {
    width: "100%",
    height: "180px",
    objectFit: "cover" as const,
};

const logCard = {
    background: "#ecfccb",
    padding: "15px",
    borderRadius: "12px",
    marginTop: "10px",
};

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