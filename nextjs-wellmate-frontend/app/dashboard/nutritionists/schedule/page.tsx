"use client";

import React, { useState, useEffect } from "react";
import { Clock, Save, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { nutritionistApi } from "@/services/nutritionists";
import Swal from "sweetalert2";

const DAYS = [
    { id: 1, name: "วันจันทร์", color: "bg-yellow-400" },
    { id: 2, name: "วันอังคาร", color: "bg-pink-400" },
    { id: 3, name: "วันพุธ", color: "bg-green-400" },
    { id: 4, name: "วันพฤหัสบดี", color: "bg-orange-400" },
    { id: 5, name: "วันศุกร์", color: "bg-blue-400" },
    { id: 6, name: "วันเสาร์", color: "bg-purple-400" },
    { id: 0, name: "วันอาทิตย์", color: "bg-red-400" },
];

export default function WorkSchedulePage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [schedules, setSchedules] = useState<any[]>([]);

    useEffect(() => {
        fetchSchedules();
    }, []);

    const fetchSchedules = async () => {
        try {
            const data = await nutritionistApi.getMySchedules();
            setSchedules(data);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'ผิดพลาด',
                text: 'ไม่สามารถดึงข้อมูลเวลาทำงานได้',
                timer: 2000,
                showConfirmButton: false
            });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateSchedule = (dayId: number, field: string, value: any) => {
        const existing = schedules.find((s) => s.dayOfWeek === dayId);
        if (existing) {
            setSchedules(
                schedules.map((s) =>
                    s.dayOfWeek === dayId ? { ...s, [field]: value } : s
                )
            );
        } else {
            setSchedules([
                ...schedules,
                {
                    dayOfWeek: dayId,
                    startTime: "09:00",
                    endTime: "17:00",
                    isAvailable: true,
                    [field]: value,
                },
            ]);
        }
    };

    const handleSave = async (dayId: number) => {
        const schedule = schedules.find((s) => s.dayOfWeek === dayId);
        if (!schedule) return;

        setSaving(true);
        try {
            await nutritionistApi.createSchedule({
                dayOfWeek: schedule.dayOfWeek,
                startTime: schedule.startTime,
                endTime: schedule.endTime,
                isAvailable: schedule.isAvailable,
            });
            Swal.fire({
                icon: 'success',
                title: 'สำเร็จ',
                text: 'บันทึกข้อมูลเรียบร้อยแล้ว',
                timer: 1500,
                showConfirmButton: false
            });
        } catch (error) {
            console.error("Error saving schedule:", error);
            Swal.fire({
                icon: 'error',
                title: 'ผิดพลาด',
                text: 'บันทึกข้อมูลไม่สำเร็จ',
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#C6E065]" />
            </div>
        );
    }

    return (
        <div className="flex-1 p-8 overflow-y-auto bg-[#fffbf5]">
            <div className="max-w-4xl mx-auto">
                <header className="mb-10">
                    <h1 className="text-3xl font-black text-[#3d3522] mb-2 flex items-center gap-3">
                        <Clock className="w-8 h-8 text-[#C6E065]" />
                        จัดการเวลาทำงาน
                    </h1>
                    <p className="text-gray-500">กำหนดช่วงเวลาที่คุณพร้อมให้บริการรับคำปรึกษาในแต่ละวัน</p>
                </header>

                <div className="space-y-4">
                    {DAYS.map((day) => {
                        const schedule = schedules.find((s) => s.dayOfWeek === day.id) || {
                            dayOfWeek: day.id,
                            startTime: "09:00",
                            endTime: "17:00",
                            isAvailable: false,
                        };

                        return (
                            <div
                                key={day.id}
                                className={`bg-white p-6 rounded-[32px] shadow-sm border ${schedule.isAvailable ? "border-[#C6E065]/30 bg-[#C6E065]/5" : "border-gray-100"
                                    } transition-all duration-300 flex flex-col md:flex-row items-center gap-6`}
                            >
                                <div className="flex items-center gap-4 w-full md:w-48">
                                    <div className={`w-3 h-10 rounded-full ${day.color}`}></div>
                                    <span className="font-bold text-lg text-[#3d3522]">{day.name}</span>
                                </div>

                                <div className="flex items-center gap-4 flex-1">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="time"
                                            value={schedule.startTime}
                                            disabled={!schedule.isAvailable}
                                            onChange={(e) => handleUpdateSchedule(day.id, "startTime", e.target.value)}
                                            className="bg-gray-50 border-none rounded-2xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#C6E065] disabled:opacity-50"
                                        />
                                        <span className="text-gray-400">-</span>
                                        <input
                                            type="time"
                                            value={schedule.endTime}
                                            disabled={!schedule.isAvailable}
                                            onChange={(e) => handleUpdateSchedule(day.id, "endTime", e.target.value)}
                                            className="bg-gray-50 border-none rounded-2xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#C6E065] disabled:opacity-50"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => handleUpdateSchedule(day.id, "isAvailable", !schedule.isAvailable)}
                                        className={`flex items-center gap-2 px-6 py-2 rounded-2xl font-bold text-sm transition-all ${schedule.isAvailable
                                            ? "bg-[#C6E065] text-[#3d3522] shadow-md shadow-[#C6E065]/20"
                                            : "bg-gray-100 text-gray-400"
                                            }`}
                                    >
                                        {schedule.isAvailable ? (
                                            <>
                                                <CheckCircle2 className="w-4 h-4" />
                                                เปิดรับนัด
                                            </>
                                        ) : (
                                            <>
                                                <XCircle className="w-4 h-4" />
                                                ปิดรับนัด
                                            </>
                                        )}
                                    </button>

                                    <button
                                        onClick={() => handleSave(day.id)}
                                        disabled={saving}
                                        className="p-3 bg-[#3d3522] text-white rounded-2xl hover:bg-black transition-all active:scale-95 disabled:opacity-50 shadow-md"
                                    >
                                        <Save className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
