"use client";

import { useEffect, useState } from "react";
import { User, Calendar, Ruler, Scale, Activity, Target, FileText, CheckCircle2, ChevronRight, ChevronLeft, Droplets, AlertCircle, LogOut, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import { useAuth } from "@/hooks/useAuth";

type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "very_active";

const STEPS = [
    { id: 1, title: "ข้อมูลทั่วไป", icon: User },
    { id: 2, title: "สัดส่วนร่างกาย", icon: Scale },
    { id: 3, title: "ระดับกิจกรรม", icon: Activity },
    { id: 4, title: "เป้าหมาย", icon: Target },
];

export default function HealthProfilePage() {
    const router = useRouter();
    const { user, setUser } = useAuthStore();
    const { logoutUser } = useAuth();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({
        gender: "",
        dateOfBirth: "",
        age: "",
        bloodType: "",
        height: "",
        weight: "",
        chronicDiseases: "",
        activityLevel: "" as ActivityLevel | "",
        goal: "",
        goalDetail: "",
    });

    useEffect(() => {
        if (!user) return;
        if (user.role === "patient") {
            if (user.isProfileComplete) {
                router.replace("/dashboard");
            }
            return;
        }
        if (user.role === "food_partner") {
            router.replace("/Foodpartner/profile");
            return;
        }
        router.replace("/dashboard");
    }, [user, router]);

    const handleChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const validateStep = (step: number) => {
        switch (step) {
            case 1:
                return form.gender !== "" && form.dateOfBirth !== "" && form.bloodType !== "";
            case 2:
                return form.height !== "" && form.weight !== "";
            case 3:
                return form.activityLevel !== "";
            case 4:
                return form.goal !== "";
            default:
                return true;
        }
    };

    const handleNext = () => {
        if (!validateStep(currentStep)) {
            Swal.fire({
                icon: 'warning',
                title: 'ข้อมูลไม่ครบถ้วน',
                text: 'กรุณากรอกข้อมูลในหน้านี้ให้ครบก่อนทำการวาดต่อไป',
                confirmButtonColor: '#3d3522',
                background: '#fffbf5',
                customClass: {
                    popup: "rounded-3xl",
                    confirmButton: "rounded-2xl px-6 py-2.5 font-bold shadow-md",
                }
            });
            return;
        }

        if (currentStep < STEPS.length) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // 1. Update Patient Profile (includes goal now)
            const profilePayload = {
                gender: form.gender,
                dateOfBirth: form.dateOfBirth,
                bloodType: form.bloodType,
                chronicDiseases: form.chronicDiseases.split(",").map(d => d.trim()).filter(d => d !== ""),
                goal: form.goal,
                goalDetail: form.goalDetail,
                activityLevel: form.activityLevel
            };
            await api.post('/patients/complete-profile', profilePayload);

            // 2. Save Health Metrics (weight & height only)
            const metricsPayload = {
                weightKg: Number(form.weight),
                heightCm: Number(form.height),
            };
            await api.post('/patients/health-metrics', metricsPayload);

            // Update local auth state to reflect completed profile
            if (user) {
                setUser({ ...user, isProfileComplete: true });
            }

            await Swal.fire({
                icon: 'success',
                title: 'บันทึกข้อมูลสำเร็จ!',
                text: 'ระบบกำลังนำคุณเข้าสู่หน้าแดชบอร์ด...',
                timer: 2000,
                showConfirmButton: false,
                background: "#fffbf5",
                color: "#3d3522",
                customClass: {
                    popup: "rounded-3xl",
                }
            });

            router.push('/dashboard');
        } catch (error) {
            console.error("Failed to save health profile:", error);
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
                confirmButtonColor: '#3d3522',
                background: "#fffbf5",
                customClass: {
                    popup: "rounded-3xl",
                    confirmButton: "rounded-2xl px-6 py-2.5 font-bold shadow-md",
                }
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const activityOptions: { value: ActivityLevel; label: string; desc: string }[] = [
        { value: "sedentary", label: "นั่งทำงานเป็นหลัก", desc: "ไม่ได้ออกกำลังกายเลย" },
        { value: "light", label: "ออกกำลังกายเบาๆ", desc: "1-2 วัน/สัปดาห์" },
        { value: "moderate", label: "ออกกำลังกายปานกลาง", desc: "3-4 วัน/สัปดาห์" },
        { value: "active", label: "ออกกำลังกายหนัก", desc: "5-6 วัน/สัปดาห์" },
        { value: "very_active", label: "ใช้แรงมากทุกวัน", desc: "นักกีฬา / งานใช้แรงงาน" },
    ];

    const goalOptions = ["ลดน้ำหนัก", "เพิ่มกล้ามเนื้อ", "รักษาสุขภาพ", "เพิ่มความฟิต"];

    return (
        <div className="min-h-screen bg-[#fffbf5] flex flex-col items-center justify-center py-12 px-4 sm:px-6 md:px-12 font-sans relative overflow-hidden">
            {/* Floating Premium Logout Button */}
            <div className="fixed top-6 right-6 z-50 animate-fadeIn" style={{ animationDelay: '500ms' }}>
                <button
                    onClick={logoutUser}
                    className="group flex items-center gap-3 px-4 py-2.5 bg-white/40 backdrop-blur-md border border-white/20 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:bg-white/60 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all duration-300 active:scale-95"
                >
                    <div className="w-8 h-8 rounded-xl bg-[#C6E065] flex items-center justify-center text-[#3d3522] font-black text-xs shadow-sm group-hover:rotate-12 transition-transform duration-300">
                        {user?.firstName?.charAt(0) || 'U'}
                    </div>
                    <div className="flex flex-col items-start mr-1">
                        <span className="text-[10px] font-bold text-[#8a7550] uppercase tracking-wider leading-none mb-0.5">ออกจากระบบ</span>
                        <span className="text-xs font-black text-[#3d3522] leading-none">{user?.firstName}</span>
                    </div>
                    <LogOut className="w-4 h-4 text-[#3d3522]/40 group-hover:text-[#3d3522] group-hover:translate-x-0.5 transition-all" />
                </button>
            </div>

            {/* Background Decorations (Scattered Fruits & Vegetables) */}
            <div className="absolute top-[10%] left-[5%] text-6xl opacity-20 rotate-12 animate-pulse hover:opacity-40 transition-opacity">🥑</div>
            <div className="absolute top-[20%] right-[10%] text-7xl opacity-15 rotate-[-15deg] animate-bounce hover:opacity-40 transition-opacity" style={{ animationDuration: '3s' }}>🥦</div>
            <div className="absolute bottom-[15%] left-[15%] text-5xl opacity-20 rotate-45 animate-pulse hover:opacity-40 transition-opacity" style={{ animationDelay: '1s' }}>🥕</div>
            <div className="absolute bottom-[20%] right-[5%] text-6xl opacity-15 rotate-[-30deg] animate-bounce hover:opacity-40 transition-opacity" style={{ animationDuration: '4s' }}>🍋</div>
            <div className="absolute top-[50%] left-[2%] text-5xl opacity-10 rotate-90 animate-pulse hover:opacity-40 transition-opacity" style={{ animationDelay: '2s' }}>🥬</div>
            <div className="absolute top-[60%] right-[2%] text-6xl opacity-10 rotate-180 animate-bounce hover:opacity-40 transition-opacity" style={{ animationDuration: '5s' }}>🍅</div>

            <div className="w-full max-w-3xl bg-white p-8 md:p-12 rounded-[40px] shadow-[0_8px_40px_rgba(0,0,0,0.03)] border border-[#C6E065]/20 relative z-10 animate-slideUp">

                <div className="flex justify-center mb-8 animate-fadeIn">
                    <img src="/logo.png" alt="WellMate Logo" className="h-20 w-auto drop-shadow-sm" />
                </div>

                <div className="text-center mb-10 animate-fadeIn" style={{ animationDelay: "100ms" }}>
                    <h1 className="text-3xl md:text-4xl font-black text-[#3d3522] mb-3 tracking-tight">ตั้งค่าโปรไฟล์สุขภาพ</h1>
                    <p className="text-[#8a7550] font-medium text-sm md:text-base">ข้อมูลเหล่านี้จะถูกนำไปใช้คำนวณค่า <span className="text-[#3d3522] font-bold">BMI</span>, <span className="text-[#3d3522] font-bold">BMR</span> และ <span className="text-[#3d3522] font-bold">TDEE</span> เฉพาะตัวคุณ</p>
                </div>

                {/* Progress Stepper */}
                <div className="mb-12 relative flex justify-between items-center w-full max-w-xl mx-auto z-0 before:absolute before:inset-0 before:ml-[12%] before:mr-[12%] before:-z-10 before:h-1 before:w-[76%] before:-translate-y-1/2 before:top-1/2 before:bg-gray-100 before:rounded-full">
                    <div
                        className="absolute top-1/2 -translate-y-1/2 -z-10 h-1 bg-[#8BC34A] rounded-full transition-all duration-500 ml-[12%]"
                        style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 76}%` }}
                    />

                    {STEPS.map((step) => {
                        const isCompleted = currentStep > step.id;
                        const isCurrent = currentStep === step.id;
                        const Icon = step.icon;

                        return (
                            <div key={step.id} className="flex flex-col items-center gap-2 relative z-10">
                                <div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${isCompleted
                                        ? "bg-[#8BC34A] border-white shadow-md text-[#3d3522]"
                                        : isCurrent
                                            ? "bg-white border-[#8BC34A] text-[#8BC34A] shadow-lg scale-110"
                                            : "bg-white border-gray-100 text-gray-300"
                                        }`}
                                >
                                    {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-5 h-5" />}
                                </div>
                                <span className={`text-sm font-bold absolute -bottom-7 w-max text-center ${isCurrent || isCompleted ? "text-[#3d3522]" : "text-gray-400"
                                    }`}>
                                    {step.title}
                                </span>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-16 animate-fadeIn transition-all duration-300 min-h-[300px]">
                    {/* Step 1: Gender & Age */}
                    {currentStep === 1 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animation-slideInRight">
                            <div className="space-y-4">
                                <label className="flex items-center gap-2 font-bold text-[#3d3522] ml-2">
                                    <User className="w-5 h-5 text-[#3d3522]" />
                                    เพศสภาพ
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        className={`py-4 px-4 rounded-3xl font-bold border-2 transition-all flex items-center justify-center gap-2 ${form.gender === "male"
                                            ? "border-[#C6E065] bg-[#C6E065]/10 text-[#3d3522] shadow-[0_4px_16px_rgba(198,224,101,0.2)]"
                                            : "border-gray-100 bg-gray-50 text-gray-400 hover:border-[#C6E065]/50 hover:bg-white"
                                            }`}
                                        onClick={() => handleChange("gender", "male")}
                                    >
                                        {form.gender === "male" && <CheckCircle2 className="w-5 h-5 text-[#3d3522]" />}
                                        ชาย
                                    </button>
                                    <button
                                        className={`py-4 px-4 rounded-3xl font-bold border-2 transition-all flex items-center justify-center gap-2 ${form.gender === "female"
                                            ? "border-[#C6E065] bg-[#C6E065]/10 text-[#3d3522] shadow-[0_4px_16px_rgba(198,224,101,0.2)]"
                                            : "border-gray-100 bg-gray-50 text-gray-400 hover:border-[#C6E065]/50 hover:bg-white"
                                            }`}
                                        onClick={() => handleChange("gender", "female")}
                                    >
                                        {form.gender === "female" && <CheckCircle2 className="w-5 h-5 text-[#3d3522]" />}
                                        หญิง
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="flex items-center gap-2 font-bold text-[#3d3522] ml-2">
                                    <Calendar className="w-5 h-5 text-[#3d3522]" />
                                    วันเกิด
                                </label>
                                <input
                                    type="date"
                                    value={form.dateOfBirth}
                                    onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                                    className="w-full py-4 px-6 rounded-3xl bg-gray-50 border-2 border-transparent focus:border-[#C6E065] focus:bg-white focus:ring-4 focus:ring-[#C6E065]/10 text-[#3d3522] font-semibold transition-all outline-none"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="flex items-center gap-2 font-bold text-[#3d3522] ml-2">
                                    <Droplets className="w-5 h-5 text-red-500" />
                                    หมู่เลือด
                                </label>
                                <select
                                    value={form.bloodType}
                                    onChange={(e) => handleChange("bloodType", e.target.value)}
                                    className="w-full py-4 px-6 rounded-3xl bg-gray-50 border-2 border-transparent focus:border-[#C6E065] focus:bg-white focus:ring-4 focus:ring-[#C6E065]/10 text-[#3d3522] font-semibold transition-all outline-none appearance-none cursor-pointer"
                                >
                                    <option value="">เลือกหมู่เลือด</option>
                                    <option value="A">A</option>
                                    <option value="B">B</option>
                                    <option value="AB">AB</option>
                                    <option value="O">O</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Height & Weight */}
                    {currentStep === 2 && (
                        <div className="animation-slideInRight">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div className="space-y-4">
                                    <label className="flex items-center gap-2 font-bold text-[#3d3522] ml-2">
                                        <Ruler className="w-5 h-5 text-[#3d3522]" />
                                        ส่วนสูง (เซนติเมตร)
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="เช่น 170"
                                        value={form.height}
                                        onChange={(e) => handleChange("height", e.target.value)}
                                        className="w-full py-4 px-6 rounded-3xl bg-gray-50 border-2 border-transparent focus:border-[#C6E065] focus:bg-white focus:ring-4 focus:ring-[#C6E065]/10 text-[#3d3522] font-semibold transition-all outline-none"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="flex items-center gap-2 font-bold text-[#3d3522] ml-2">
                                        <Scale className="w-5 h-5 text-[#3d3522]" />
                                        น้ำหนัก (กิโลกรัม)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        placeholder="เช่น 65.5"
                                        value={form.weight}
                                        onChange={(e) => handleChange("weight", e.target.value)}
                                        className="w-full py-4 px-6 rounded-3xl bg-gray-50 border-2 border-transparent focus:border-[#C6E065] focus:bg-white focus:ring-4 focus:ring-[#C6E065]/10 text-[#3d3522] font-semibold transition-all outline-none"
                                    />
                                </div>
                            </div>

                            {form.height && form.weight && (() => {
                                const bmi = Number(form.weight) / Math.pow(Number(form.height) / 100, 2);
                                let label = "";
                                let colorClass = "";
                                let activeIndex = -1;

                                if (bmi < 18.5) { label = "น้ำหนักน้อยกว่าเกณฑ์"; colorClass = "text-blue-500"; activeIndex = 0; }
                                else if (bmi <= 22.9) { label = "น้ำหนักปกติ (สมส่วน)"; colorClass = "text-green-500"; activeIndex = 1; }
                                else if (bmi <= 24.9) { label = "น้ำหนักเกิน (ท้วม)"; colorClass = "text-yellow-500"; activeIndex = 2; }
                                else if (bmi <= 29.9) { label = "อ้วนระดับ 1"; colorClass = "text-orange-500"; activeIndex = 3; }
                                else { label = "อ้วนระดับ 2"; colorClass = "text-red-500"; activeIndex = 4; }

                                return (
                                    <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-3 border border-[#C6E065]/30 flex flex-col items-center justify-center animate-fadeIn shadow-sm hover:shadow-md transition-shadow">
                                        <h3 className="text-[10px] font-bold text-[#8a7550] mb-1 uppercase tracking-widest">ดัชนีมวลกาย (BMI)</h3>

                                        <div className="text-4xl font-black text-[#3d3522] mb-0.5 drop-shadow-sm">
                                            {bmi.toFixed(1)}
                                        </div>

                                        <div className={`text-[11px] font-bold ${colorClass} mb-3 px-3 py-0.5 bg-white rounded-full shadow-sm`}>
                                            {label}
                                        </div>

                                        {/* BMI Visual Scale */}
                                        <div className="w-full max-w-[280px] flex gap-1 h-2 items-center mb-1.5">
                                            <div className={`flex-1 h-full rounded-full transition-all duration-500 ${activeIndex === 0 ? 'bg-blue-400 scale-y-125' : 'bg-gray-200 opacity-40'}`} />
                                            <div className={`flex-1 h-full rounded-full transition-all duration-500 ${activeIndex === 1 ? 'bg-green-400 scale-y-125' : 'bg-gray-200 opacity-40'}`} />
                                            <div className={`flex-1 h-full rounded-full transition-all duration-500 ${activeIndex === 2 ? 'bg-yellow-400 scale-y-125' : 'bg-gray-200 opacity-40'}`} />
                                            <div className={`flex-1 h-full rounded-full transition-all duration-500 ${activeIndex === 3 ? 'bg-orange-400 scale-y-125' : 'bg-gray-200 opacity-40'}`} />
                                            <div className={`flex-1 h-full rounded-full transition-all duration-500 ${activeIndex === 4 ? 'bg-red-400 scale-y-125' : 'bg-gray-200 opacity-40'}`} />
                                        </div>
                                        <div className="w-full max-w-[280px] flex justify-between px-0.5">
                                            <span className="text-[8px] text-gray-400 font-bold">18.5</span>
                                            <span className="text-[8px] text-gray-400 font-bold">23.0</span>
                                            <span className="text-[8px] text-gray-400 font-bold">25.0</span>
                                            <span className="text-[8px] text-gray-400 font-bold">30.0</span>
                                        </div>
                                    </div>
                                );
                            })()}

                            <div className="mt-8 space-y-4">
                                <label className="flex items-center gap-2 font-bold text-[#3d3522] ml-2">
                                    <AlertCircle className="w-5 h-5 text-orange-500" />
                                    โรคประจำตัว (ถ้ามี ให้คั่นด้วยเครื่องหมายจุลภาค ,)
                                </label>
                                <input
                                    type="text"
                                    placeholder="เช่น เบาหวาน, ความดันโลหิตสูง"
                                    value={form.chronicDiseases}
                                    onChange={(e) => handleChange("chronicDiseases", e.target.value)}
                                    className="w-full py-4 px-6 rounded-3xl bg-gray-50 border-2 border-transparent focus:border-[#C6E065] focus:bg-white focus:ring-4 focus:ring-[#C6E065]/10 text-[#3d3522] font-semibold transition-all outline-none"
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 3: Activity Level */}
                    {currentStep === 3 && (
                        <div className="space-y-4 animation-slideInRight">
                            <label className="flex items-center gap-2 font-bold text-[#3d3522] ml-2">
                                <Activity className="w-5 h-5 text-[#3d3522]" />
                                ระดับกิจกรรมในแต่ละวัน
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {activityOptions.map((item) => {
                                    const isActive = form.activityLevel === item.value;
                                    return (
                                        <button
                                            key={item.value}
                                            onClick={() => handleChange("activityLevel", item.value)}
                                            className={`p-5 rounded-[28px] border-2 text-left transition-all ${isActive
                                                ? "border-[#C6E065] bg-[#C6E065]/10 shadow-[0_8px_20px_rgba(198,224,101,0.2)]"
                                                : "border-gray-100 bg-gray-50 hover:border-[#C6E065]/40 hover:bg-white hover:-translate-y-1"
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <span className={`font-bold ${isActive ? "text-[#3d3522]" : "text-gray-600"}`}>
                                                    {item.label}
                                                </span>
                                                {isActive && <CheckCircle2 className="w-5 h-5 text-[#3d3522]" />}
                                            </div>
                                            <p className={`text-xs ${isActive ? "text-[#8a7550] font-medium" : "text-gray-400"}`}>
                                                {item.desc}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Step 4: Goals */}
                    {currentStep === 4 && (
                        <div className="space-y-8 animation-slideInRight">
                            <div className="space-y-4">
                                <label className="flex items-center gap-2 font-bold text-[#3d3522] ml-2">
                                    <Target className="w-5 h-5 text-[#C6E065]" />
                                    เป้าหมายหลัก
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    {goalOptions.map((goal) => {
                                        const isActive = form.goal === goal;
                                        return (
                                            <button
                                                key={goal}
                                                onClick={() => handleChange("goal", goal)}
                                                className={`py-4 px-2 rounded-3xl font-bold border-2 text-sm transition-all flex items-center justify-center gap-2 ${isActive
                                                    ? "border-[#C6E065] bg-[#C6E065]/10 text-[#3d3522] shadow-[0_4px_16px_rgba(198,224,101,0.2)]"
                                                    : "border-gray-100 bg-gray-50 text-gray-500 hover:border-[#C6E065]/40 hover:bg-white"
                                                    }`}
                                            >
                                                {isActive && <CheckCircle2 className="w-4 h-4 text-[#C6E065]" />}
                                                {goal}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="flex items-center gap-2 font-bold text-[#3d3522] ml-2">
                                    <FileText className="w-5 h-5 text-[#C6E065]" />
                                    รายละเอียดเพิ่มเติม (ถ้ามี)
                                </label>
                                <textarea
                                    placeholder="เช่น ต้องการลดน้ำหนัก 5 กิโลภายใน 3 เดือน หรืออยากควบคุมน้ำตาล..."
                                    value={form.goalDetail}
                                    onChange={(e) => handleChange("goalDetail", e.target.value)}
                                    className="w-full h-32 py-5 px-6 rounded-3xl bg-gray-50 border-2 border-transparent focus:border-[#C6E065] focus:bg-white focus:ring-4 focus:ring-[#C6E065]/10 text-[#3d3522] placeholder:text-gray-400 transition-all outline-none resize-none font-medium"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Navigation Buttons */}
                <div className="pt-10 flex gap-4 animate-slideUp border-t border-gray-100 mt-8">
                    {currentStep > 1 && (
                        <button
                            onClick={handleBack}
                            className="w-1/3 py-5 bg-gray-100 text-gray-500 font-bold text-lg rounded-[28px] hover:bg-gray-200 transition-all active:scale-[0.98] outline-none flex items-center justify-center gap-2"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            กลับ
                        </button>
                    )}

                    <button
                        onClick={handleNext}
                        disabled={isSubmitting}
                        className={`flex-1 py-5 bg-[#C6E065] text-[#3d3522] font-black text-lg rounded-[28px] shadow-[0_12px_30px_rgba(198,224,101,0.3)] hover:shadow-[0_16px_40px_rgba(198,224,101,0.4)] hover:-translate-y-1 transition-all active:scale-[0.98] outline-none flex items-center justify-center gap-2 ${currentStep === 1 ? 'w-full' : ''} ${isSubmitting ? 'opacity-80 cursor-not-allowed' : ''}`}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-6 h-6 animate-spin text-[#3d3522]" />
                                <span>กำลังบันทึกข้อมูล...</span>
                            </>
                        ) : (
                            <>
                                {currentStep === STEPS.length ? "บันทึกข้อมูลสุขภาพ" : "ถัดไป"}
                                {currentStep < STEPS.length && <ChevronRight className="w-5 h-5" />}
                            </>
                        )}
                    </button>
                </div>

            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .animation-slideInRight {
                    animation: slideInRight 0.4s ease-out forwards;
                }
                @keyframes slideInRight {
                    0% {
                        opacity: 0;
                        transform: translateX(20px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `}} />
        </div>
    );
}
