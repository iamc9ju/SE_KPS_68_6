"use client";

import React, { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Plus, Trash2, Loader2, Info, Save } from "lucide-react";
import { nutritionistApi } from "@/services/nutritionists";
import Swal from "sweetalert2";
import { format } from "date-fns";
import { th } from "date-fns/locale";

export default function LeaveManagementPage() {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [leaves, setLeaves] = useState<any[]>([]);

    // Form state
    const [leaveDate, setLeaveDate] = useState(format(new Date(), "yyyy-MM-dd"));
    const [isFullDay, setIsFullDay] = useState(true);
    const [newStartTime, setNewStartTime] = useState("09:00");
    const [newEndTime, setNewEndTime] = useState("17:00");

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        try {
            const data = await nutritionistApi.getMyLeaves();
            setLeaves(data);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถดึงข้อมูลวันลาได้',
                timer: 2000,
                showConfirmButton: false
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await nutritionistApi.createLeave({
                leaveDate,
                isFullDay,
                newStartTime: isFullDay ? undefined : newStartTime,
                newEndTime: isFullDay ? undefined : newEndTime,
            });
            Swal.fire({
                icon: 'success',
                title: 'สำเร็จ',
                text: 'บันทึกวันลาเรียบร้อยแล้ว',
                timer: 2000,
                showConfirmButton: false
            });
            fetchLeaves(); // Refresh list
        } catch (error) {
            console.error("Error saving leave:", error);
            Swal.fire({
                icon: 'error',
                title: 'ผิดพลาด',
                text: 'ไม่สามารถบันทึกวันลาได้',
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: 'ยืนยันการยกเลิก?',
            text: "คุณแน่ใจหรือไม่ว่าต้องการยกเลิกวันลานี้?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3d3522',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ใช่, ยกเลิกเลย',
            cancelButtonText: 'ยกเลิก'
        });

        if (!result.isConfirmed) return;

        try {
            await nutritionistApi.deleteLeave(id);
            Swal.fire({
                icon: 'success',
                title: 'สำเร็จ',
                text: 'ยกเลิกวันลาเรียบร้อยแล้ว',
                timer: 2000,
                showConfirmButton: false
            });
            setLeaves(leaves.filter(l => l.nutritionistLeaveId !== parseInt(id)));
        } catch (error) {
            console.error("Error deleting leave:", error);
            Swal.fire({
                icon: 'error',
                title: 'ผิดพลาด',
                text: 'ยกเลิกวันลาไม่สำเร็จ',
            });
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
                <header className="mb-10 text-center md:text-left">
                    <h1 className="text-3xl font-black text-[#3d3522] mb-2 flex items-center justify-center md:justify-start gap-3">
                        <CalendarIcon className="w-8 h-8 text-[#C6E065]" />
                        จัดการวันลา
                    </h1>
                    <p className="text-gray-500">บันทึกวันลาหรือช่วงเวลาที่คุณไม่สะดวกรับนัดหมาย</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 sticky top-8">
                            <h2 className="font-bold text-lg text-[#3d3522] mb-6 flex items-center gap-2">
                                <Plus className="w-5 h-5 text-[#C6E065]" />
                                เพิ่มรายการลา
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">วันที่ลา</label>
                                    <input
                                        type="date"
                                        value={leaveDate}
                                        onChange={(e) => setLeaveDate(e.target.value)}
                                        className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#C6E065]"
                                        required
                                    />
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                    <input
                                        type="checkbox"
                                        id="isFullDay"
                                        checked={isFullDay}
                                        onChange={(e) => setIsFullDay(e.target.checked)}
                                        className="w-5 h-5 text-[#C6E065] focus:ring-[#C6E065] rounded-md"
                                    />
                                    <label htmlFor="isFullDay" className="text-sm font-bold text-[#3d3522] cursor-pointer selections-none">ลาทั้งวัน</label>
                                </div>

                                {!isFullDay && (
                                    <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">ตั้งแต่</label>
                                            <input
                                                type="time"
                                                value={newStartTime}
                                                onChange={(e) => setNewStartTime(e.target.value)}
                                                className="w-full bg-gray-50 border-none rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#C6E065]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">ถึง</label>
                                            <input
                                                type="time"
                                                value={newEndTime}
                                                onChange={(e) => setNewEndTime(e.target.value)}
                                                className="w-full bg-gray-50 border-none rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#C6E065]"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full bg-[#3d3522] text-white font-bold py-4 rounded-2xl hover:bg-black transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-[#3d3522]/20 flex items-center justify-center gap-2"
                                    >
                                        {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                        บันทึกรายการ
                                    </button>
                                </div>
                            </form>

                            <div className="mt-6 p-4 bg-yellow-50 rounded-2xl flex gap-3 border border-yellow-100">
                                <Info className="w-5 h-5 text-yellow-600 shrink-0" />
                                <p className="text-[10px] text-yellow-700 leading-relaxed font-medium">
                                    การบันทึกวันลาจะทำให้ผู้ใช้ไม่สามารถจองเวลานัดหมายในช่วงเวลาดังกล่าวได้
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* List Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 min-h-[500px]">
                            <h2 className="font-bold text-lg text-[#3d3522] mb-8">ประวัติการลา / รายการที่กำลังมาถึง</h2>

                            {leaves.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                    <div className="bg-gray-50 p-6 rounded-full mb-4">
                                        <CalendarIcon className="w-12 h-12 opacity-20" />
                                    </div>
                                    <p className="font-medium text-sm">ยังไม่มีรายการลาในขณะนี้</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {leaves.map((leave) => (
                                        <div
                                            key={leave.nutritionistLeaveId}
                                            className="group flex items-center justify-between p-5 bg-white border border-gray-100 rounded-3xl hover:border-[#C6E065]/50 hover:bg-[#C6E065]/5 transition-all duration-300"
                                        >
                                            <div className="flex items-center gap-5">
                                                <div className="bg-[#C6E065]/20 p-4 rounded-2xl group-hover:bg-[#C6E065] transition-colors">
                                                    <CalendarIcon className="w-6 h-6 text-[#3d3522]" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-[#3d3522] text-lg">
                                                        {format(new Date(leave.leaveDate), "eeee d MMMM yyyy", { locale: th })}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        {leave.isFullDay ? (
                                                            <span className="text-xs bg-[#3d3522] text-white px-3 py-1 rounded-lg font-bold">ทั้งวัน</span>
                                                        ) : (
                                                            <span className="text-xs font-bold text-gray-500">
                                                                {leave.newStartTime?.slice(0, 5)} - {leave.newEndTime?.slice(0, 5)} น.
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleDelete(leave.nutritionistLeaveId.toString())}
                                                className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all active:scale-90"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
