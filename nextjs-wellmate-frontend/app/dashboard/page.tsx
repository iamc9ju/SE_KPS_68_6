"use client";

import React from "react";
import Skeleton from "@/components/ui/Skeleton";
import {
    Flame,
    Footprints,
    GlassWater,
    MoonStar,
    Target,
    Utensils,
    Weight,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import RightPanel from "@/components/dashboard/RightPanel";
import StatCard from "@/components/dashboard/StatCard";
import { useAuthStore } from "@/store/auth-store";
import FoodPartnerDashboard from "@/components/dashboard/FoodPartnerDashboard";
import NutritionistDashboard from "@/components/dashboard/NutritionistDashboard";
import { StatCardSkeleton, MenuCardSkeleton } from "@/components/dashboard/DashboardSkeletons";
import api from "@/lib/api";

type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "very_active";
type GenderType = "male" | "female" | "other";

type ProgressPhoto = {
    progressPhotoId: string;
    imageUrl: string;
    createdAt: string;
};

type HealthMetric = {
    weightKg?: number | string | null;
    heightCm?: number | string | null;
    recordedAt: string;
    activityLevel?: ActivityLevel | null;
    ageYears?: number | null;
    gender?: GenderType | null;
};

type MeasurementLog = {
    bodyMeasurementLogId: string;
    weightKg?: number | string | null;
    caloriesKcal?: number | null;
    waterMl?: number | null;
    stepsCount?: number | null;
    sleepHours?: number | string | null;
    recordedAt: string;
};

type ProgressOverview = {
    patient: {
        goal?: string | null;
        goalDetail?: string | null;
        targetWeightKg?: number | string | null;
        activityLevel?: ActivityLevel | null;
    };
    latestHealthMetric?: HealthMetric | null;
    latestMeasurement?: MeasurementLog | null;
    recentPhotos: ProgressPhoto[];
};

type ProgressHistory = {
    healthMetrics: HealthMetric[];
    measurementLogs: MeasurementLog[];
};

type PatientProfile = {
    dateOfBirth?: string | null;
    gender?: GenderType | null;
};

type Appointment = {
    appointmentId: string;
    startTime: string;
    status: "pending" | "confirmed" | "completed" | "cancelled";
    nutritionist?: {
        firstName: string;
        lastName: string;
    };
};

type NotificationItem = {
    notificationId: string;
    title: string;
    body: string;
    isRead: boolean;
    createdAt: string;
};

type NotificationsPayload = {
    unread: number;
    notifications: NotificationItem[];
};

type MenuItem = {
    menuItemId: number;
    name: string;
    description?: string | null;
    imageUrl?: string | null;
    category?: string | null;
    caloriesKcal?: number | null;
    carbsG?: number | null;
    proteinG?: number | null;
    fatG?: number | null;
    foodPartner?: {
        partnerName: string;
    };
};

type MenuItemsPayload = {
    data: MenuItem[];
};

const FALLBACK_FOOD_IMAGE =
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800";
const ACTIVITY_FACTORS: Record<ActivityLevel, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
};
const MISSING_DATA_ITEMS = [
    "แคลอรี่ที่เผาผลาญจริงยังไม่มี endpoint ที่ดึง physical activities มาใช้บน dashboard นี้โดยตรง",
    "สรุปสารอาหารรายวันแบบคาร์บ โปรตีน ไขมันยังไม่มี food log ของผู้ป่วยให้คำนวณจริง",
    "เมนูในบล็อกแนะนำดึงจากฐานข้อมูลจริงแล้ว แต่ยังไม่ใช่ recommendation เฉพาะบุคคล",
    "แผนมื้ออาหารประจำวันยังมี schema ในระบบ แต่ยังไม่มี API ฝั่งคนไข้ส่งมาที่ dashboard นี้",
];

function unwrapApiData<T>(payload: unknown, fallback: T): T {
    if (payload && typeof payload === "object" && "data" in payload) {
        return (payload as { data: T }).data;
    }
    return (payload as T) ?? fallback;
}

function toNumber(value: number | string | null | undefined): number | null {
    if (value === null || value === undefined || value === "") {
        return null;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
}

function formatNumber(value: number | null, digits = 0) {
    if (value === null || Number.isNaN(value)) {
        return "-";
    }

    return new Intl.NumberFormat("th-TH", {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    }).format(value);
}

function formatDateLabel(value: string | null | undefined) {
    if (!value) {
        return "ยังไม่มีข้อมูล";
    }

    return new Date(value).toLocaleDateString("th-TH", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function getRecentValues(
    logs: MeasurementLog[],
    accessor: (log: MeasurementLog) => number | null,
) {
    return logs
        .slice(-7)
        .map(accessor)
        .filter((value): value is number => value !== null);
}

function average(values: number[]) {
    if (values.length === 0) {
        return null;
    }

    return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function ensureArray<T>(value: unknown): T[] {
    return Array.isArray(value) ? value as T[] : [];
}

function calculateAge(dateOfBirth?: string | null) {
    if (!dateOfBirth) {
        return null;
    }

    const birthDate = new Date(dateOfBirth);
    if (Number.isNaN(birthDate.getTime())) {
        return null;
    }

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age -= 1;
    }
    return age;
}

function calculateDailyCalorieGoal({
    weightKg,
    heightCm,
    ageYears,
    gender,
    activityLevel,
}: {
    weightKg: number | null;
    heightCm: number | null;
    ageYears: number | null;
    gender: GenderType | null;
    activityLevel: ActivityLevel | null;
}) {
    if (
        weightKg === null ||
        heightCm === null ||
        ageYears === null ||
        !gender ||
        !activityLevel
    ) {
        return null;
    }

    const sexConstant = gender === "male" ? 5 : gender === "female" ? -161 : 0;
    const bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageYears + sexConstant;
    return Math.round(bmr * ACTIVITY_FACTORS[activityLevel]);
}

export default function DashboardPage() {
    const { user } = useAuthStore();
    const [loading, setLoading] = React.useState(true);
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
    const [overview, setOverview] = React.useState<ProgressOverview | null>(null);
    const [history, setHistory] = React.useState<ProgressHistory>({
        healthMetrics: [],
        measurementLogs: [],
    });
    const [profile, setProfile] = React.useState<PatientProfile | null>(null);
    const [appointments, setAppointments] = React.useState<Appointment[]>([]);
    const [notifications, setNotifications] = React.useState<NotificationsPayload>({
        unread: 0,
        notifications: [],
    });
    const [recommendedMenus, setRecommendedMenus] = React.useState<MenuItem[]>([]);

    React.useEffect(() => {
        if (user?.role !== "patient") {
            setLoading(false);
            return;
        }

        let isMounted = true;

        const fetchDashboardData = async () => {
            setLoading(true);
            setErrorMessage(null);

            try {
                const [
                    overviewResult,
                    historyResult,
                    profileResult,
                    appointmentsResult,
                    notificationsResult,
                    menuResult,
                ] = await Promise.allSettled([
                    api.get("/patients/progress"),
                    api.get("/patients/progress/history"),
                    api.get("/patients/profile"),
                    api.get("/appointments/me"),
                    api.get("/notifications"),
                    api.get("/food-menu", {
                        params: {
                            limit: 2,
                        },
                    }),
                ]);

                if (!isMounted) {
                    return;
                }

                const overviewFallback: ProgressOverview = {
                    patient: {},
                    latestHealthMetric: null,
                    latestMeasurement: null,
                    recentPhotos: [],
                };
                const historyFallback: ProgressHistory = {
                    healthMetrics: [],
                    measurementLogs: [],
                };

                setOverview(
                    overviewResult.status === "fulfilled"
                        ? unwrapApiData<ProgressOverview>(overviewResult.value.data, overviewFallback)
                        : overviewFallback,
                );
                const resolvedHistory =
                    historyResult.status === "fulfilled"
                        ? unwrapApiData<ProgressHistory>(historyResult.value.data, historyFallback)
                        : historyFallback;
                setHistory({
                    healthMetrics: ensureArray<HealthMetric>(resolvedHistory?.healthMetrics),
                    measurementLogs: ensureArray<MeasurementLog>(resolvedHistory?.measurementLogs),
                });
                setProfile(
                    profileResult.status === "fulfilled"
                        ? unwrapApiData<PatientProfile | null>(profileResult.value.data, null)
                        : null,
                );
                setAppointments(
                    appointmentsResult.status === "fulfilled"
                        ? ensureArray<Appointment>(unwrapApiData<Appointment[] | { data?: Appointment[] }>(appointmentsResult.value.data, []))
                        : [],
                );
                const resolvedNotifications =
                    notificationsResult.status === "fulfilled"
                        ? unwrapApiData<NotificationsPayload>(notificationsResult.value.data, { unread: 0, notifications: [] })
                        : { unread: 0, notifications: [] };
                setNotifications({
                    unread: typeof resolvedNotifications?.unread === "number" ? resolvedNotifications.unread : 0,
                    notifications: ensureArray<NotificationItem>(resolvedNotifications?.notifications),
                });
                setRecommendedMenus(
                    menuResult.status === "fulfilled"
                        ? ensureArray<MenuItem>(unwrapApiData<MenuItemsPayload>(menuResult.value.data, { data: [] }).data)
                        : [],
                );

                const failedCritical =
                    overviewResult.status === "rejected" &&
                    historyResult.status === "rejected" &&
                    profileResult.status === "rejected";
                const hadPartialFailure = [
                    overviewResult,
                    historyResult,
                    profileResult,
                    appointmentsResult,
                    notificationsResult,
                    menuResult,
                ].some((result) => result.status === "rejected");

                if (failedCritical) {
                    setErrorMessage("ไม่สามารถโหลดข้อมูลหลักของ dashboard จากฐานข้อมูลได้");
                } else if (hadPartialFailure) {
                    setErrorMessage("บางส่วนของ dashboard โหลดไม่สำเร็จ จึงแสดงเฉพาะข้อมูลที่ดึงได้");
                }
            } catch (error) {
                console.error("Failed to fetch patient dashboard data:", error);
                if (isMounted) {
                    setErrorMessage("ไม่สามารถโหลดข้อมูล dashboard จากฐานข้อมูลได้ในขณะนี้");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        void fetchDashboardData();

        return () => {
            isMounted = false;
        };
    }, [user?.role]);

    if (user?.role === "food_partner") {
        return <FoodPartnerDashboard />;
    }

    if (user?.role === "nutritionist") {
        return <NutritionistDashboard />;
    }

    const latestMeasurement = overview?.latestMeasurement ?? null;
    const latestHealthMetric = overview?.latestHealthMetric ?? null;
    const recentMeasurements = ensureArray<MeasurementLog>(history?.measurementLogs);
    const safeAppointments = ensureArray<Appointment>(appointments);
    const safeRecommendedMenus = ensureArray<MenuItem>(recommendedMenus);
    const safeNotificationItems = ensureArray<NotificationItem>(notifications?.notifications);

    const latestWeight =
        toNumber(latestMeasurement?.weightKg) ??
        toNumber(latestHealthMetric?.weightKg);
    const latestSteps = latestMeasurement?.stepsCount ?? null;
    const latestSleepHours = toNumber(latestMeasurement?.sleepHours);
    const latestWaterLiters = latestMeasurement?.waterMl ? latestMeasurement.waterMl / 1000 : null;
    const latestCalories = latestMeasurement?.caloriesKcal ?? null;

    const averageSteps = average(getRecentValues(recentMeasurements, (log) => log.stepsCount ?? null));
    const averageSleep = average(getRecentValues(recentMeasurements, (log) => toNumber(log.sleepHours)));
    const averageWaterLiters = average(
        getRecentValues(recentMeasurements, (log) =>
            log.waterMl !== null && log.waterMl !== undefined ? log.waterMl / 1000 : null,
        ),
    );
    const averageCalories = average(getRecentValues(recentMeasurements, (log) => log.caloriesKcal ?? null));

    const targetWeight = toNumber(overview?.patient.targetWeightKg);
    const heightCm = toNumber(latestHealthMetric?.heightCm);
    const ageYears = latestHealthMetric?.ageYears ?? calculateAge(profile?.dateOfBirth);
    const gender = latestHealthMetric?.gender ?? profile?.gender ?? null;
    const activityLevel = latestHealthMetric?.activityLevel ?? overview?.patient.activityLevel ?? null;
    const calorieGoal = calculateDailyCalorieGoal({
        weightKg: latestWeight,
        heightCm,
        ageYears,
        gender,
        activityLevel,
    });
    const remainingCalories =
        calorieGoal !== null && latestCalories !== null
            ? Math.max(calorieGoal - latestCalories, 0)
            : null;

    const calorieChartData = calorieGoal !== null && latestCalories !== null
        ? [
            { name: "consumed", value: latestCalories },
            { name: "remaining", value: Math.max(calorieGoal - latestCalories, 0) },
        ]
        : [
            { name: "latest", value: latestCalories ?? 0 },
            { name: "empty", value: 0 },
        ];

    const nextAppointment = safeAppointments
        .filter((appointment) => appointment.status === "pending" || appointment.status === "confirmed")
        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())[0] ?? null;

    return (
        <div className="flex-1 flex flex-col min-h-screen">
            <main className="flex-1 overflow-y-auto px-8 py-10 z-10 custom-scrollbar ml-64 mr-80">
                <div className="max-w-[1240px] mx-auto">
                    <header className="mb-8 animate-fadeIn">
                        <h1 className="text-4xl font-black text-[#1a1a1a] tracking-tight mb-2">
                            สวัสดี, {user?.firstName || "ผู้ใช้งาน"}!
                        </h1>
                        <p className="text-gray-500 font-medium text-lg">
                            หน้านี้ดึงข้อมูลสุขภาพล่าสุดจากฐานข้อมูลจริงของคุณแล้ว
                        </p>
                    </header>

                    {errorMessage && (
                        <div className="mb-8 rounded-[28px] border border-red-100 bg-red-50 px-6 py-5 text-sm font-medium text-red-600">
                            {errorMessage}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8 animate-slideUp">
                        {loading ? (
                            Array.from({ length: 4 }).map((_, index) => <StatCardSkeleton key={index} />)
                        ) : (
                            <>
                                <StatCard title="น้ำหนัก" value={formatNumber(latestWeight, 1)} unit="กก.">
                                    <MetricMeta
                                        icon={<Weight className="w-4 h-4" />}
                                        primary={
                                            targetWeight !== null && latestWeight !== null
                                                ? `เป้าหมาย ${formatNumber(targetWeight, 1)} กก.`
                                                : "ยังไม่มีเป้าหมายน้ำหนัก"
                                        }
                                        secondary={`อัปเดตล่าสุด ${formatDateLabel(latestMeasurement?.recordedAt ?? latestHealthMetric?.recordedAt)}`}
                                    />
                                </StatCard>

                                <StatCard title="ก้าวเดิน" value={formatNumber(latestSteps)} unit="ก้าว">
                                    <MetricMeta
                                        icon={<Footprints className="w-4 h-4" />}
                                        primary={
                                            averageSteps !== null
                                                ? `เฉลี่ย 7 วัน ${formatNumber(averageSteps)} ก้าว`
                                                : "ยังไม่มีประวัติก้าวเดิน"
                                        }
                                        secondary={`อัปเดตล่าสุด ${formatDateLabel(latestMeasurement?.recordedAt)}`}
                                    />
                                </StatCard>

                                <StatCard title="การนอนหลับ" value={formatNumber(latestSleepHours, 1)} unit="ชั่วโมง">
                                    <MetricMeta
                                        icon={<MoonStar className="w-4 h-4" />}
                                        primary={
                                            averageSleep !== null
                                                ? `เฉลี่ย 7 วัน ${formatNumber(averageSleep, 1)} ชั่วโมง`
                                                : "ยังไม่มีประวัติการนอน"
                                        }
                                        secondary={`อัปเดตล่าสุด ${formatDateLabel(latestMeasurement?.recordedAt)}`}
                                    />
                                </StatCard>

                                <StatCard title="ดื่มน้ำ" value={formatNumber(latestWaterLiters, 1)} unit="ลิตร">
                                    <MetricMeta
                                        icon={<GlassWater className="w-4 h-4" />}
                                        primary={
                                            averageWaterLiters !== null
                                                ? `เฉลี่ย 7 วัน ${formatNumber(averageWaterLiters, 1)} ลิตร`
                                                : "ยังไม่มีประวัติการดื่มน้ำ"
                                        }
                                        secondary={`อัปเดตล่าสุด ${formatDateLabel(latestMeasurement?.recordedAt)}`}
                                    />
                                </StatCard>
                            </>
                        )}
                    </div>

                    <div className="bg-white p-10 rounded-[40px] shadow-[0_4px_40px_rgba(0,0,0,0.02)] border border-gray-50 mb-8 animate-slideUp delay-100">
                        <div className="flex flex-col gap-5 lg:flex-row lg:justify-between lg:items-start mb-8">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900">สรุปแคลอรี่จากข้อมูลล่าสุด</h3>
                                <p className="text-sm font-medium text-gray-400 mt-2">
                                    ใช้ค่าที่บันทึกล่าสุดร่วมกับข้อมูลสุขภาพที่มีอยู่ในระบบ
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-4">
                                <SummaryBadge
                                    icon={<Utensils className="w-5 h-5" />}
                                    label="แคลอรี่ล่าสุด"
                                    value={`${formatNumber(latestCalories)} kcal`}
                                />
                                <SummaryBadge
                                    icon={<Target className="w-5 h-5" />}
                                    label={calorieGoal !== null ? "เป้าหมายคำนวณได้" : "ยังคำนวณไม่ได้"}
                                    value={calorieGoal !== null ? `${formatNumber(calorieGoal)} kcal` : "ข้อมูลไม่พอ"}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col lg:flex-row items-center gap-16">
                            <div className="relative w-72 h-72 flex-shrink-0">
                                {loading ? (
                                    <Skeleton className="w-full h-full rounded-full" />
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={calorieChartData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={100}
                                                outerRadius={115}
                                                stroke="none"
                                                dataKey="value"
                                                startAngle={180}
                                                endAngle={-180}
                                                cornerRadius={15}
                                                paddingAngle={0}
                                            >
                                                <Cell fill="url(#calorieGradient)" />
                                                <Cell fill="#f4f4f4" />
                                            </Pie>
                                            <defs>
                                                <linearGradient id="calorieGradient" x1="0" y1="0" x2="1" y2="0">
                                                    <stop offset="0%" stopColor="#ffd980" />
                                                    <stop offset="100%" stopColor="#ff9933" />
                                                </linearGradient>
                                            </defs>
                                        </PieChart>
                                    </ResponsiveContainer>
                                )}
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <Flame className="text-gray-900 mb-2 w-8 h-8 fill-gray-900/10" />
                                    <span className="text-5xl font-black text-gray-900">
                                        {calorieGoal !== null ? formatNumber(remainingCalories) : formatNumber(latestCalories)}
                                    </span>
                                    <span className="text-[11px] text-gray-500 font-bold uppercase tracking-widest mt-1">kcal</span>
                                    <span className="text-[11px] text-gray-400 font-bold mt-1">
                                        {calorieGoal !== null ? "แคลอรี่คงเหลือโดยประมาณ" : "แคลอรี่ล่าสุดที่บันทึก"}
                                    </span>
                                </div>
                            </div>

                            <div className="flex-1 w-full space-y-4">
                                {loading ? (
                                    Array.from({ length: 3 }).map((_, index) => (
                                        <Skeleton key={index} className="h-16 rounded-xl" />
                                    ))
                                ) : (
                                    <>
                                        <InsightBlock
                                            label="ค่าเฉลี่ย 7 วัน"
                                            value={averageCalories !== null ? `${formatNumber(averageCalories)} kcal` : "ยังไม่มีข้อมูล"}
                                            percentage={latestCalories !== null && averageCalories !== null && averageCalories > 0
                                                ? Math.min(Math.round((latestCalories / averageCalories) * 100), 100)
                                                : 0}
                                            detail="ใช้จากประวัติการบันทึก caloriesKcal ใน progress"
                                        />
                                        <InsightBlock
                                            label="นัดหมายครั้งถัดไป"
                                            value={
                                                nextAppointment
                                                    ? `${new Date(nextAppointment.startTime).toLocaleDateString("th-TH", { day: "numeric", month: "short" })}`
                                                    : "ยังไม่มีนัดหมาย"
                                            }
                                            percentage={nextAppointment ? 100 : 0}
                                            detail={
                                                nextAppointment
                                                    ? `กับ ${(nextAppointment.nutritionist?.firstName || "").trim()} ${(nextAppointment.nutritionist?.lastName || "").trim()}`.trim() || "มีนัดหมายในระบบ"
                                                    : "ดึงจาก appointments ของผู้ป่วย"
                                            }
                                        />
                                        <InsightBlock
                                            label="บันทึกล่าสุด"
                                            value={formatDateLabel(latestMeasurement?.recordedAt ?? latestHealthMetric?.recordedAt)}
                                            percentage={100}
                                            detail="อ้างอิงจาก progress และ health metrics ล่าสุด"
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-10 rounded-[40px] shadow-[0_4px_40px_rgba(0,0,0,0.02)] border border-gray-50 mb-8 animate-slideUp delay-200">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900">เมนูจากฐานข้อมูล</h3>
                                <p className="text-sm font-medium text-gray-400 mt-2">
                                    แสดงเมนูจริงล่าสุดที่เปิดขายอยู่ในระบบ
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {loading ? (
                                Array.from({ length: 2 }).map((_, index) => <MenuCardSkeleton key={index} />)
                            ) : safeRecommendedMenus.length === 0 ? (
                                <div className="col-span-full rounded-[28px] border border-dashed border-gray-200 bg-gray-50/70 px-6 py-10 text-center text-sm font-medium text-gray-500">
                                    ยังไม่มีเมนูในฐานข้อมูลที่พร้อมแสดงบน dashboard
                                </div>
                            ) : (
                                safeRecommendedMenus.map((menu) => (
                                    <MenuCard
                                        key={menu.menuItemId}
                                        category={menu.category || "เมนูอาหาร"}
                                        calories={menu.caloriesKcal ?? null}
                                        title={menu.name}
                                        description={menu.description || "ไม่มีรายละเอียดเพิ่มเติม"}
                                        macros={{
                                            c: menu.carbsG ?? null,
                                            p: menu.proteinG ?? null,
                                            f: menu.fatG ?? null,
                                        }}
                                        partnerName={menu.foodPartner?.partnerName || "ร้านค้าในระบบ"}
                                        image={menu.imageUrl || FALLBACK_FOOD_IMAGE}
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    <div className="bg-[#fffdf7] p-8 rounded-[32px] border border-[#f0e6cc] animate-slideUp delay-300">
                        <h3 className="text-xl font-black text-[#3d3522] mb-4">ส่วนที่ยังไม่มีข้อมูลจริงบน dashboard นี้</h3>
                        <div className="space-y-3 text-sm text-[#6b5c3f] font-medium">
                            {MISSING_DATA_ITEMS.map((item) => (
                                <div key={item} className="flex items-start gap-3">
                                    <div className="mt-2 h-2 w-2 rounded-full bg-[#C6E065]" />
                                    <p>{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
            <RightPanel
                loading={loading}
                notifications={safeNotificationItems}
                unreadNotifications={typeof notifications?.unread === "number" ? notifications.unread : 0}
                appointments={safeAppointments}
                recommendedMenus={safeRecommendedMenus}
            />
        </div>
    );
}

function MetricMeta({
    icon,
    primary,
    secondary,
}: {
    icon: React.ReactNode;
    primary: string;
    secondary: string;
}) {
    return (
        <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                <span className="text-[#85B22E]">{icon}</span>
                <span>{primary}</span>
            </div>
            <p className="text-xs font-medium text-gray-400">{secondary}</p>
        </div>
    );
}

function SummaryBadge({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-center gap-3 bg-[#f0f4d8] px-5 py-2.5 rounded-2xl">
            <div className="w-10 h-10 bg-[#C6E065] rounded-xl flex items-center justify-center text-white shadow-sm">
                {icon}
            </div>
            <div>
                <p className="text-lg font-black text-gray-900 leading-tight">{value}</p>
                <p className="text-[11px] text-gray-400 font-bold -mt-0.5">{label}</p>
            </div>
        </div>
    );
}

function InsightBlock({
    label,
    value,
    percentage,
    detail,
}: {
    label: string;
    value: string;
    percentage: number;
    detail: string;
}) {
    return (
        <div className="flex items-stretch h-16 w-full">
            <div className="w-44 bg-gray-100/80 rounded-l-xl flex items-center justify-center border-r border-white/50 px-3">
                <span className="text-base font-black text-gray-900 text-center leading-tight">{value}</span>
            </div>
            <div className="flex-1 bg-gray-50/50 rounded-r-xl p-3 flex flex-col justify-between">
                <div className="flex justify-between text-[11px] font-black tracking-tight mb-1 uppercase gap-4">
                    <span className="text-gray-400">{label}</span>
                    <span className="text-gray-900">{Math.max(percentage, 0)}%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-[#C6E065] rounded-full transition-all duration-1000"
                        style={{ width: `${Math.max(Math.min(percentage, 100), 0)}%` }}
                    />
                </div>
                <p className="text-[11px] text-gray-400 font-medium mt-2">{detail}</p>
            </div>
        </div>
    );
}

function MenuCard({
    category,
    calories,
    title,
    description,
    macros,
    image,
    partnerName,
}: {
    category: string;
    calories: number | null;
    title: string;
    description: string;
    macros: { c: number | null; p: number | null; f: number | null };
    image: string;
    partnerName: string;
}) {
    return (
        <div className="group cursor-pointer">
            <div className="relative rounded-[32px] overflow-hidden mb-5 aspect-[4/3] shadow-sm">
                <img
                    src={image}
                    alt={title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-[#C6E065] text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-sm">
                    {category}
                </div>
                <div className="absolute top-4 right-4 bg-white text-gray-900 text-[10px] font-black px-4 py-1.5 rounded-full shadow-sm border border-gray-100 flex items-center gap-1.5">
                    <Flame className="w-3 h-3 text-orange-400" /> {calories !== null ? `${formatNumber(calories)} kcal` : "ไม่ระบุ kcal"}
                </div>
            </div>

            <div className="flex gap-4 text-[11px] font-black text-gray-400 mb-3 px-1">
                <span className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-[#faf8f2] border border-[#f0e6cc] rounded-lg flex items-center justify-center text-[9px] font-black text-[#3d3522]">C</div>
                    {macros.c !== null ? `${formatNumber(macros.c, 0)} ก.` : "-"}
                </span>
                <span className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-[#faf8f2] border border-[#f0e6cc] rounded-lg flex items-center justify-center text-[9px] font-black text-[#3d3522]">P</div>
                    {macros.p !== null ? `${formatNumber(macros.p, 0)} ก.` : "-"}
                </span>
                <span className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-[#faf8f2] border border-[#f0e6cc] rounded-lg flex items-center justify-center text-[9px] font-black text-[#3d3522]">F</div>
                    {macros.f !== null ? `${formatNumber(macros.f, 0)} ก.` : "-"}
                </span>
            </div>

            <p className="text-xs font-bold text-[#85B22E] px-1 mb-2">{partnerName}</p>
            <h4 className="font-black text-xl leading-tight mb-2 text-gray-900 group-hover:text-orange-500 transition-colors">
                {title}
            </h4>
            <p className="text-sm text-gray-400 font-medium leading-relaxed line-clamp-2">
                {description}
            </p>
        </div>
    );
}
