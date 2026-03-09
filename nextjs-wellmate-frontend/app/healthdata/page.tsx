"use client";

import { CSSProperties, useState } from "react";

type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "very_active";

export default function HealthProfilePage() {
    const [form, setForm] = useState({
        gender: "",
        age: "",
        height: "",
        weight: "",
        activityLevel: "" as ActivityLevel | "",
        goal: "",
        goalDetail: "",
    });

    const handleChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        console.log("Health Profile (for body calculation):", form);
        alert("บันทึกข้อมูลที่ใช้คำนวณร่างกายเรียบร้อย");
    };

    const activityOptions: { value: ActivityLevel; label: string }[] = [
        { value: "sedentary", label: "นั่งทำงานเป็นหลัก" },
        { value: "light", label: "ออกกำลังเบา 1-2 วัน/สัปดาห์" },
        { value: "moderate", label: "ออกกำลังปานกลาง 3-4 วัน/สัปดาห์" },
        { value: "active", label: "ออกกำลังหนัก 5-6 วัน/สัปดาห์" },
        { value: "very_active", label: "ใช้แรงมากทุกวัน/นักกีฬา" },
    ];

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <div style={styles.logoBox}>
                    <div style={styles.logoMark}>
                        W<span style={styles.logoMarkOrange}>M</span>
                    </div>
                    <div style={styles.logoText}>Wellmate</div>
                </div>

                <h1 style={styles.title}>ตั้งค่าโปรไฟล์สุขภาพ</h1>
                <p style={styles.subtitle}>
                    กรอกเฉพาะข้อมูลที่ใช้คำนวณร่างกาย (BMI / BMR / TDEE)
                </p>

                <div style={styles.section}>
                    <label style={styles.label}>เพศ</label>
                    <div style={styles.row}>
                        <button
                            style={buttonStyle(form.gender === "male")}
                            onClick={() => handleChange("gender", "male")}
                        >
                            ชาย
                        </button>
                        <button
                            style={buttonStyle(form.gender === "female")}
                            onClick={() => handleChange("gender", "female")}
                        >
                            หญิง
                        </button>
                    </div>
                </div>

                <div style={styles.section}>
                    <label style={styles.label}>อายุ</label>
                    <input
                        type="number"
                        placeholder="เช่น 25"
                        style={styles.input}
                        value={form.age}
                        onChange={(e) => handleChange("age", e.target.value)}
                    />
                </div>

                <div style={styles.section}>
                    <label style={styles.label}>ส่วนสูง (cm)</label>
                    <input
                        type="number"
                        placeholder="เช่น 170"
                        style={styles.input}
                        value={form.height}
                        onChange={(e) => handleChange("height", e.target.value)}
                    />
                </div>

                <div style={styles.section}>
                    <label style={styles.label}>น้ำหนัก (kg)</label>
                    <input
                        type="number"
                        placeholder="เช่น 65"
                        style={styles.input}
                        value={form.weight}
                        onChange={(e) => handleChange("weight", e.target.value)}
                    />
                </div>

                <div style={styles.section}>
                    <label style={styles.label}>ระดับกิจกรรม</label>
                    <div style={styles.activityGrid}>
                        {activityOptions.map((item) => (
                            <button
                                key={item.value}
                                style={buttonStyle(form.activityLevel === item.value)}
                                onClick={() => handleChange("activityLevel", item.value)}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={styles.section}>
                    <label style={styles.label}>เป้าหมาย</label>
                    <div style={styles.goalGrid}>
                        {["ลดน้ำหนัก", "เพิ่มกล้ามเนื้อ", "รักษาสุขภาพ", "เพิ่มความฟิต"].map(
                            (goal) => (
                                <button
                                    key={goal}
                                    style={buttonStyle(form.goal === goal)}
                                    onClick={() => handleChange("goal", goal)}
                                >
                                    {goal}
                                </button>
                            ),
                        )}
                    </div>
                </div>

                <div style={styles.section}>
                    <label style={styles.label}>เป้าหมายเพิ่มเติม</label>
                    <textarea
                        placeholder="เช่น ต้องการลดน้ำหนัก 5 กิโลภายใน 3 เดือน หรืออยากควบคุมแคลอรี่ต่อวัน..."
                        style={styles.textarea}
                        value={form.goalDetail}
                        onChange={(e) => handleChange("goalDetail", e.target.value)}
                    />
                </div>

                <button style={styles.submit} onClick={handleSubmit}>
                    บันทึกข้อมูล
                </button>
            </div>
        </div>
    );
}

const styles: Record<string, CSSProperties> = {
    page: {
        minHeight: "100vh",
        background:
            "radial-gradient(circle at 15% 20%, #efffdd 0%, transparent 30%), radial-gradient(circle at 85% 12%, #fff2dd 0%, transparent 26%), linear-gradient(140deg, #fffaf0 0%, #f7ffe9 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Poppins', 'Noto Sans Thai', sans-serif",
        padding: "20px",
    },
    card: {
        background: "rgba(255,255,255,0.95)",
        padding: "40px",
        borderRadius: "24px",
        width: "560px",
        border: "1px solid #e6f0d5",
        boxShadow: "0 18px 45px rgba(124, 167, 47, 0.16)",
    },
    logoBox: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        justifyContent: "center",
        marginBottom: "20px",
    },
    logoMark: {
        color: "#8CC63F",
        fontWeight: 700,
        fontSize: "32px",
        fontStyle: "italic",
        lineHeight: 1,
    },
    logoMarkOrange: {
        color: "#F7931E",
    },
    logoText: {
        fontWeight: 700,
        fontSize: "26px",
        textTransform: "uppercase",
        letterSpacing: "0.02em",
        color: "#2d3d1f",
    },
    title: {
        fontSize: "28px",
        fontWeight: 700,
        marginBottom: "5px",
        textAlign: "center",
        color: "#9EDB6A",
    },
    subtitle: {
        color: "#647460",
        marginBottom: "30px",
        textAlign: "center",
    },
    section: {
        marginBottom: "20px",
    },
    label: {
        fontWeight: 700,
        color: "#33492a",
        marginBottom: "8px",
        display: "block",
    },
    row: {
        display: "flex",
        gap: "10px",
    },
    activityGrid: {
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: "10px",
    },
    goalGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "10px",
    },
    input: {
        width: "100%",
        padding: "13px",
        borderRadius: "12px",
        border: "1px solid #d3dfc0",
        background: "#fbfff6",
        fontSize: "14px",
        color: "#2d4022",
        outline: "none",
    },
    textarea: {
        width: "100%",
        minHeight: "96px",
        padding: "13px",
        borderRadius: "12px",
        border: "1px solid #d3dfc0",
        background: "#fbfff6",
        fontSize: "14px",
        color: "#2d4022",
        outline: "none",
        resize: "none",
    },
    submit: {
        marginTop: "20px",
        width: "100%",
        padding: "14px",
        borderRadius: "14px",
        border: "none",
        background: "linear-gradient(135deg, #b8e45f 0%, #8fc73f 100%)",
        color: "#1f2a11",
        fontSize: "16px",
        fontWeight: 800,
        cursor: "pointer",
        boxShadow: "0 10px 24px rgba(143, 199, 63, 0.3)",
    },
};

const buttonStyle = (active: boolean): CSSProperties => ({
    padding: "12px",
    borderRadius: "12px",
    border: active ? "2px solid #9EDB6A" : "1px solid #d3dfc0",
    background: active
        ? "linear-gradient(135deg, #eef9dd 0%, #e1f3c5 100%)"
        : "#ffffff",
    color: active ? "#36501d" : "#4b5563",
    cursor: "pointer",
    fontWeight: 700,
    boxShadow: active ? "0 8px 18px rgba(158, 219, 106, 0.24)" : "none",
});
