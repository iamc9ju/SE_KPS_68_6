"use client";

import { useState } from "react";
import Image from "next/image";


export default function HealthProfilePage() {
    const [form, setForm] = useState({
        gender: "",
        age: "",
        height: "",
        weight: "",
        goal: "",
        goalDetail: "",
    });

    const handleChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        console.log("Health Profile:", form);
        alert("บันทึกข้อมูลสุขภาพเรียบร้อย!");
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>

                {/* Logo */}
                <div style={styles.logoBox}>
                    <Image
                        src="/logo.png"
                        alt="WellMate Logo"
                        width={140}
                        height={70}
                        style={{ objectFit: "contain" }}
                    />
                </div>

                <h1 style={styles.title}>ตั้งค่าโปรไฟล์สุขภาพ</h1>
                <p style={styles.subtitle}>
                    กรอกข้อมูลเบื้องต้นเพื่อให้ WellMate แนะนำสุขภาพที่เหมาะกับคุณ
                </p>

                {/* Gender */}
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

                {/* Age */}
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

                {/* Height */}
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

                {/* Weight */}
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

                {/* Goal */}
                <div style={styles.section}>
                    <label style={styles.label}>เป้าหมายสุขภาพ</label>
                    <div style={styles.grid}>
                        {["ลดน้ำหนัก", "เพิ่มกล้ามเนื้อ", "รักษาสุขภาพ"].map((goal) => (
                            <button
                                key={goal}
                                style={buttonStyle(form.goal === goal)}
                                onClick={() => handleChange("goal", goal)}
                            >
                                {goal}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Additional Goal Detail */}
                <div style={styles.section}>
                    <label style={styles.label}>เป้าหมายเพิ่มเติม</label>
                    <textarea
                        placeholder="เช่น ต้องการลดน้ำหนัก 5 กิโลภายใน 3 เดือน หรืออยากเริ่มกินอาหารสุขภาพ..."
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

const styles: any = {
    page: {
        minHeight: "100vh",
        background: "#F6F8F4",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Inter, sans-serif",
    },

    card: {
        background: "white",
        padding: "40px",
        borderRadius: "20px",
        width: "520px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
    },

    logoBox: {
        display: "flex",
        justifyContent: "center",
        marginBottom: "20px",
    },

    title: {
        fontSize: "28px",
        fontWeight: 700,
        marginBottom: "5px",
        textAlign: "center",
        color: "#9EDB6A",
    },

    subtitle: {
        color: "#777",
        marginBottom: "30px",
        textAlign: "center",
    },

    section: {
        marginBottom: "20px",
    },

    label: {
        fontWeight: 600,
        marginBottom: "8px",
        display: "block",
    },

    row: {
        display: "flex",
        gap: "10px",
    },

    grid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: "10px",
    },

    input: {
        width: "100%",
        padding: "12px",
        borderRadius: "10px",
        border: "1px solid #ddd",
        fontSize: "14px",
    },

    textarea: {
        width: "100%",
        minHeight: "90px",
        padding: "12px",
        borderRadius: "10px",
        border: "1px solid #ddd",
        fontSize: "14px",
        resize: "none",
    },

    submit: {
        marginTop: "20px",
        width: "100%",
        padding: "14px",
        borderRadius: "12px",
        border: "none",
        background: "#9EDB6A",
        color: "white",
        fontSize: "16px",
        fontWeight: 600,
        cursor: "pointer",
    },
};

const buttonStyle = (active: boolean) => ({
    padding: "12px",
    borderRadius: "10px",
    border: active ? "2px solid #9EDB6A" : "1px solid #ddd",
    background: active ? "#E9F7DC" : "white",
    cursor: "pointer",
    fontWeight: 500,
});