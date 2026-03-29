"use client";

import React, { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Save, Search, User, Filter, AlertCircle, ShoppingBag, Plus, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import WeeklyCalendar, { MealEntry } from "@/components/meal-plan/WeeklyCalendar";
import MealPlannerModal from "@/components/meal-plan/MealPlannerModal";
import Swal from "sweetalert2";

type Patient = {
    patientId: string;
    firstName: string;
    lastName: string;
    user: { email: string; profileImageUrl?: string };
};

export default function MealPlanPage() {
    const { user } = useAuthStore();
    const isNutritionist = user?.role === "nutritionist";
    
    // Auth-store User type doesn't have patient/nutritionist nested
    // We'll fetch them separately or use metadata if available
    const [patientId, setPatientId] = useState<string | null>(null);
    const [nutritionistId, setNutritionistId] = useState<string | null>(null);

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [meals, setMeals] = useState<MealEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Nutritionist specific state
    const [patients, setPatients] = useState<Patient[]>([]);
    const [selectedPatientId, setSelectedPatientId] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState("");
    const [showPlanner, setShowPlanner] = useState(false);
    const [plannerDate, setPlannerDate] = useState(new Date());
    const [plannerType, setPlannerType] = useState("");
    
    const [appointments, setAppointments] = useState<any[]>([]);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState<string>("");

    useEffect(() => {
        const init = async () => {
            if (isNutritionist && user) {
                // Fetch nutritionist profile
                try {
                    const res = await api.get("/nutritionists/profile");
                    // Handle both wrapped { data: ... } and direct object
                    const nutData = res.data?.data || res.data;
                    if (nutData?.nutritionistId) {
                        setNutritionistId(nutData.nutritionistId);
                    } else {
                        console.error("No nutritionistId in profile data:", res.data);
                    }
                } catch (e) {
                    console.error("Error fetching nutritionist profile", e);
                }
                fetchPatients();
                setIsLoading(false);
            } else if (user?.role === "patient") {
                // Fetch patient record
                try {
                    const res = await api.get("/patients/profile");
                    const pData = res.data?.data || res.data;
                    if (pData?.patientId) {
                        setPatientId(pData.patientId);
                        fetchMealPlan(pData.patientId);
                        fetchPatientAppointments(pData.patientId);
                    } else {
                        console.error("No patientId in profile data:", res.data);
                        setIsLoading(false);
                    }
                } catch (e) {
                    console.error("No patient record found");
                    setIsLoading(false);
                }
            } else {
                // Not a patient or nutritionist (e.g. food_partner or admin)
                setIsLoading(false);
            }
        };
        init();
    }, [user, isNutritionist]);

    const fetchMealPlan = async (patientId: string, appointmentId?: string) => {
        console.log("Fetching meal plan for patientId:", patientId, "appointmentId:", appointmentId);
        setIsLoading(true);
        try {
            const res = await api.get(`/meal-plan/patient/${patientId}`);
            console.log("Raw API Response for meal plan:", res.data);
            
            let allPlans = Array.isArray(res.data) ? res.data : (res.data?.data || []);
            
            // Filter plans by appointmentId if provided
            if (appointmentId) {
                allPlans = allPlans.filter((p: any) => p.appointmentId === appointmentId);
            } else if (isNutritionist) {
                // For nutritionist, if no appointment selected, show only general plans (no appointmentId)
                allPlans = allPlans.filter((p: any) => !p.appointmentId);
            }
            
            // Flatten all mealPlanItems from filtered plans
            const allItems = allPlans.reduce((acc: any[], plan: any) => {
                if (plan.mealPlanItems) {
                    return [...acc, ...plan.mealPlanItems];
                }
                return acc;
            }, []);
            
            console.log("Flattened meals count:", allItems.length);
            setMeals(allItems);
        } catch (error) {
            console.error("Error fetching meal plan:", error);
            Swal.fire({ icon: 'error', title: 'ผิดพลาด', text: 'ไม่สามารถโหลดแผนการกินได้' });
        } finally {
            setIsLoading(false);
        }
    };

    const fetchPatientAppointments = async (pId: string) => {
        try {
            const res = await api.get(`/appointments/patient/${pId}`);
            const apps = Array.isArray(res.data) ? res.data : (res.data?.data || []);
            // Filter for confirmed or completed
            const relevantApps = apps.filter((a: any) => 
                (a.status === 'confirmed' || a.status === 'completed') && 
                a.nutritionistId === nutritionistId
            );
            setAppointments(relevantApps);
        } catch (e) {
            console.error("Error fetching patient appointments", e);
        }
    };

    const fetchPatients = async () => {
        try {
            // Simplified: Fetch patients associated with this nutritionist
            const res = await api.get("/patients"); 
            const data = res.data?.data || res.data || [];
            setPatients(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching patients:", error);
            setPatients([]);
        }
    };

    const handleToggleDone = async (itemId: number, isDone: boolean) => {
        // Optimistic update
        setMeals(prev => prev.map(m => m.mealPlanItemId === itemId ? { ...m, isDone } : m));
        
        try {
            await api.patch(`/meal-plan/item/${itemId}`, { isDone });
            // toast success
        } catch (error) {
            console.error("Error updating meal item:", error);
            // Revert on error
            setMeals(prev => prev.map(m => m.mealPlanItemId === itemId ? { ...m, isDone: !isDone } : m));
            Swal.fire({ icon: 'error', title: 'ผิดพลาด', text: 'ไม่สามารถบันทึกได้' });
        }
    };

    const handleOpenPlanner = (date: Date, type: string) => {
        setPlannerDate(date);
        setPlannerType(type);
        setShowPlanner(true);
    };

    const handleSaveMealItem = async (menuItemId: number) => {
        if (!selectedPatientId) {
            Swal.fire({ icon: 'warning', title: 'ไม่สามารถดำเนินการได้', text: 'กรุณาเลือกผู้ป่วยก่อน' });
            return;
        }

        if (!nutritionistId) {
            Swal.fire({ 
                icon: 'error', 
                title: 'ข้อมูลไม่สมบูรณ์', 
                text: 'ไม่พบรหัสนักโภชนาการของคุณ (Nutritionist Profile) กรุณาติดต่อผู้ดูแลระบบ' 
            });
            return;
        }
        
        try {
            setIsLoading(true);
            await api.post("/meal-plan/item", {
                patientId: selectedPatientId,
                nutritionistId: nutritionistId, 
                appointmentId: selectedAppointmentId || undefined,
                planDate: plannerDate.toLocaleDateString('en-CA'),
                mealType: plannerType,
                menuItemId,
            });
            setShowPlanner(false);
            fetchMealPlan(selectedPatientId, selectedAppointmentId);
            Swal.fire({ icon: 'success', title: 'สำเร็จ', text: 'บันทึกแผนการกินเรียบร้อย', timer: 1500 });
        } catch (error) {
            console.error("Error saving meal item:", error);
            Swal.fire({ icon: 'error', title: 'ผิดพลาด', text: 'ไม่สามารถบันทึกได้' });
        } finally {
            setIsLoading(false);
        }
    };

    const changeWeek = (direction: number) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() + direction * 7);
        setSelectedDate(newDate);
    };

    const handleSelectPatient = (patientId: string) => {
        setSelectedPatientId(patientId);
        setSelectedAppointmentId("");
        fetchMealPlan(patientId, "");
        fetchPatientAppointments(patientId);
    };

    const handleSelectAppointment = (appId: string) => {
        setSelectedAppointmentId(appId);
        fetchMealPlan(selectedPatientId, appId);
    };

    if (isLoading && !isNutritionist) {
        return (
            <div className="flex-1 bg-[#fffbf5] p-8 flex items-center justify-center ml-64">
                <div className="text-[#8a7550] animate-pulse font-black text-xl">กำลังโหลดแผนการกินของคุณ...</div>
            </div>
        );
    }

    return (
        <div className="flex-1 bg-[#fffbf5] overflow-y-auto custom-scrollbar ml-64">
            <div className="p-4 sm:p-8 max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-2 text-[#8a7550] mb-2">
                            <ShoppingBag size={18} className="text-[#C6E065]" />
                            <span className="text-[11px] font-black uppercase tracking-widest">Wellness Planner</span>
                        </div>
                        <h1 className="text-4xl font-black text-[#3d3522]">{isNutritionist ? "ออกแบบแผนการกิน" : "แผนการกินของคุณ"}</h1>
                        <p className="text-[#8a7550] font-medium mt-1">{isNutritionist ? "จัดการและติดตามการควบคุมอาหารอย่างมีประสิทธิภาพ" : "จัดการและติดตามโภชนาการของคุณให้ตรงตามเป้าหมาย"}</p>
                    </div>

                    <div className="flex items-center gap-3 bg-white p-2 rounded-[28px] shadow-sm border border-gray-200">
                        <button 
                            onClick={() => changeWeek(-1)}
                            className="w-10 h-10 rounded-2xl flex items-center justify-center hover:bg-gray-50 text-gray-400 group transition-all"
                        >
                            <ChevronLeft size={20} className="group-hover:-translate-x-0.5" />
                        </button>
                        <div className="flex items-center gap-2 px-4 border-x border-gray-100 min-w-[180px] justify-center text-[13px] font-black text-[#3d3522]">
                            <CalendarIcon size={16} className="text-gray-300" />
                            {selectedDate.toLocaleDateString("th-TH", { month: "long", year: "numeric" })}
                        </div>
                        <button 
                            onClick={() => changeWeek(1)}
                            className="w-10 h-10 rounded-2xl flex items-center justify-center hover:bg-gray-50 text-gray-400 group transition-all"
                        >
                            <ChevronRight size={20} className="group-hover:translate-x-0.5" />
                        </button>
                    </div>
                </div>

                {isNutritionist && (
                    <div className="mb-10 bg-white rounded-[40px] p-8 border border-gray-200 shadow-sm">
                        <div className="flex flex-col sm:flex-row items-center gap-6 justify-between">
                            <div className="flex-1 w-full sm:w-auto">
                                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">เลือกผู้ป่วยที่ต้องการจัดแผน</label>
                                <BeautifulSelect 
                                    options={patients.map(p => ({
                                        id: p.patientId,
                                        label: `${p.firstName} ${p.lastName}`,
                                        image: p.user?.profileImageUrl,
                                        email: p.user?.email
                                    }))}
                                    value={selectedPatientId}
                                    onChange={handleSelectPatient}
                                    placeholder="เลือกรายชื่อผู้ป่วย..."
                                />
                            </div>

                            {selectedPatientId && (
                                <div className="flex-1 w-full sm:w-auto">
                                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">เป้าหมาย/การนัดหมาย</label>
                                    <BeautifulSelect 
                                        options={[
                                            { id: "", label: "แผนอาหารทั่วไป (General Plan)", email: "ไม่มีระบุเป้าหมายเฉพาะนัดหมาย" },
                                            ...appointments.map(a => ({
                                                id: a.appointmentId,
                                                label: a.summary || `นัดหมายวันที่ ${new Date(a.startTime).toLocaleDateString('th-TH')}`,
                                                email: `สถานะ: ${a.status === 'completed' ? 'เสร็จสิ้น' : 'ยืนยันแล้ว'}`
                                            }))
                                        ]}
                                        value={selectedAppointmentId}
                                        onChange={handleSelectAppointment}
                                        placeholder="เลือกเป้าหมายการนัดหมาย..."
                                    />
                                </div>
                            )}
                            
                        </div>
                    </div>
                )}

                {/* Main Content Card */}
                <div className="bg-white rounded-[48px] p-6 sm:p-10 border border-gray-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#C6E065]/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                    
                    {!selectedPatientId && isNutritionist ? (
                        <div className="py-24 flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                <User size={40} className="text-gray-300" />
                            </div>
                            <h3 className="text-xl font-black text-[#3d3522] mb-2">ยังไม่ได้เลือกผู้ป่วย</h3>
                            <p className="text-[#8a7550] font-medium max-w-xs mx-auto">กรุณาเลือกรายชื่อผู้ป่วยด้านบนเพื่อจัดการหรือดูแผนการกินรายสัปดาห์</p>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center justify-between mb-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 flex items-center justify-center -ml-2">
                                        <img src="/images/calendar-3d.png" alt="Calendar" className="w-full h-full object-contain" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black text-[#3d3522]">
                                            {selectedAppointmentId 
                                                ? (appointments.find(a => a.appointmentId === selectedAppointmentId)?.summary || "แผนอาหารเฉพาะนัดหมาย") 
                                                : "ตารางสัปดาห์นี้"}
                                        </h2>
                                        <p className="text-[13px] text-[#8a7550] font-bold">
                                            {selectedAppointmentId ? "แผนโภชนาการสำหรับเป้าหมายนี้" : "สรุปโภชนาการและการทานอาหารทั่วไป"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {user?.role === 'patient' && appointments.length > 0 && (
                                        <select 
                                            value={selectedAppointmentId}
                                            onChange={(e) => handleSelectAppointment(e.target.value)}
                                            className="bg-gray-50 px-3 py-2 rounded-xl text-[12px] font-black text-[#3d3522] border-none focus:ring-1 focus:ring-[#C6E065]"
                                        >
                                            <option value="">แผนทั่วไป</option>
                                            {appointments.map(a => (
                                                <option key={a.appointmentId} value={a.appointmentId}>
                                                    {a.summary || `นัดหมาย ${new Date(a.startTime).toLocaleDateString('th-TH')}`}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                    <div className="bg-gray-50 px-4 py-2 rounded-xl text-[12px] font-black text-[#3d3522]">
                                        {(() => {
                                            const start = new Date(selectedDate);
                                            const day = start.getDay();
                                            const diff = start.getDate() - day + (day === 0 ? -6 : 1);
                                            start.setDate(diff);
                                            const weekDaysStr = Array.from({length: 7}, (_, i) => {
                                                const d = new Date(start);
                                                d.setDate(start.getDate() + i);
                                                return d.toDateString();
                                            });
                                            const weeklyMeals = meals.filter(m => weekDaysStr.includes(new Date(m.planDate).toDateString()));
                                            const doneCount = weeklyMeals.filter(m => m.isDone).length;
                                            return `ทานแล้ว: ${doneCount} / ${weeklyMeals.length}`;
                                        })()}
                                    </div>
                                </div>
                            </div>

                            {meals.length === 0 && !isNutritionist ? (
                                <div className="py-20 flex flex-col items-center justify-center text-center">
                                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                        <AlertCircle size={40} className="text-gray-300" />
                                    </div>
                                    <h3 className="text-xl font-black text-[#3d3522] mb-2">ยังไม่มีแผนสำหรับช่วงเวลานี้</h3>
                                    <p className="text-[#8a7550] font-medium max-w-xs mx-auto">คุณยังไม่มีแผนการกินในช่วงสัปดาห์ที่เลือก กรุณาติอต่อฝ่ายบริการลูกค้าหรือนักโภชนาการ</p>
                                </div>
                            ) : (
                                <WeeklyCalendar 
                                    selectedDate={selectedDate}
                                    meals={meals}
                                    onToggleDone={handleToggleDone}
                                    onAddMeal={handleOpenPlanner}
                                    isEditable={isNutritionist}
                                />
                            )}
                        </>
                    )}
                </div>

                <MealPlannerModal 
                    isOpen={showPlanner}
                    onClose={() => setShowPlanner(false)}
                    onSave={handleSaveMealItem}
                    date={plannerDate}
                    mealType={plannerType}
                />
            </div>
        </div>
    );
}

function BeautifulSelect({ options, value, onChange, placeholder }: { options: any[], value: string, onChange: (val: string) => void, placeholder: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const selected = options.find(o => o.id === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative z-[100]" ref={containerRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between px-6 py-4 rounded-[24px] border transition-all duration-300 group ${isOpen ? "bg-white border-[#C6E065] shadow-[0_10px_30px_-10px_rgba(198,224,101,0.3)] ring-4 ring-[#C6E065]/5" : "bg-gray-50/50 border-gray-100 hover:border-[#C6E065] hover:bg-white shadow-sm"}`}
            >
                <div className="flex items-center gap-4">
                    {selected ? (
                        <>
                            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm ring-2 ring-gray-50 flex-shrink-0">
                                <img src={selected.image || "/images/default-avatar.png"} alt={selected.label} className="w-full h-full object-cover" />
                            </div>
                            <div className="text-left">
                                <p className="text-[14px] font-black text-[#3d3522] leading-tight">{selected.label}</p>
                                <p className="text-[11px] text-[#8a7550] font-bold opacity-60 leading-tight mt-0.5">{selected.email}</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                <User size={20} />
                            </div>
                            <span className="text-[14px] font-bold text-gray-400">{placeholder}</span>
                        </>
                    )}
                </div>
                <div className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
                    <ChevronRight size={18} className={`rotate-90 text-gray-300 group-hover:text-[#C6E065] transition-colors`} />
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full left-0 right-0 mt-3 bg-white border border-[#f0f4e8] rounded-[32px] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.12)] overflow-hidden"
                    >
                        <div className="max-h-[320px] overflow-y-auto custom-scrollbar p-2">
                            {options.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => {
                                        onChange(option.id);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between p-3 rounded-[20px] transition-all group ${value === option.id ? "bg-[#C6E065]/10" : "hover:bg-gray-50"}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-colors ${value === option.id ? "border-[#C6E065]" : "border-white"}`}>
                                            <img src={option.image || "/images/default-avatar.png"} alt={option.label} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="text-left">
                                            <p className={`text-[13px] font-black transition-colors ${value === option.id ? "text-[#3d3522]" : "text-[#8a7550] group-hover:text-[#3d3522]"}`}>{option.label}</p>
                                            <p className="text-[10px] text-[#8a7550] font-bold opacity-50">{option.email}</p>
                                        </div>
                                    </div>
                                    {value === option.id && (
                                        <div className="mr-3 text-[#C6E065]">
                                            <Check size={18} strokeWidth={3} />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
