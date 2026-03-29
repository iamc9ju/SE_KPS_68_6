"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
    Clock, 
    Save, 
    Loader2, 
    CheckCircle2, 
    XCircle, 
    Calendar as CalendarIcon, 
    List as ListIcon,
    Plus,
    Trash2,
    Info
} from "lucide-react";
import { nutritionistApi, CreateSchedulePayload, CreateLeavePayload } from "@/services/nutritionists";
import Swal from "sweetalert2";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Setup for react-big-calendar
const locales = {
    "en-US": enUS,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

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
    const [leaves, setLeaves] = useState<any[]>([]);
    
    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [modalData, setModalData] = useState({
        startTime: "09:00",
        endTime: "17:00",
        isFullDay: false,
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const leaveData = await nutritionistApi.getMyLeaves();
            setLeaves(leaveData);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'ผิดพลาด',
                text: 'ไม่สามารถดึงข้อมูลได้',
                timer: 2000,
                showConfirmButton: false
            });
        } finally {
            setLoading(false);
        }
    };

    // Calculate events for Calendar
    const events = useMemo(() => {
        const calendarEvents: any[] = [];
        // Only show explicit logs from 'leaves' (which are now our Daily Logs)
        leaves.forEach(log => {
            const day = new Date(log.leaveDate);
            if (log.isFullDay) {
                calendarEvents.push({
                    title: "🔴 ปิดรับนัด (Day Off)",
                    start: day,
                    end: day,
                    allDay: true,
                    resource: { type: 'leave', data: log }
                });
            } else if (log.newStartTime && log.newEndTime) {
                const [sH, sM] = log.newStartTime.split(":").map(Number);
                const [eH, eM] = log.newEndTime.split(":").map(Number);
                const startDt = new Date(day);
                startDt.setHours(sH, sM, 0);
                const endDt = new Date(day);
                endDt.setHours(eH, eM, 0);

                calendarEvents.push({
                    title: `🟢 เปิด: ${log.newStartTime}-${log.newEndTime}`,
                    start: startDt,
                    end: endDt,
                    allDay: false,
                    resource: { type: 'work', data: log }
                });
            }
        });

        return calendarEvents;
    }, [leaves]);

    const handleSelectSlot = ({ start }: any) => {
        const existingLog = leaves.find(l => isSameDay(new Date(l.leaveDate), start));
        
        setSelectedDate(start);
        setModalData({
            startTime: existingLog?.newStartTime || "09:00",
            endTime: existingLog?.newEndTime || "17:00",
            isFullDay: existingLog ? existingLog.isFullDay : false,
        });
        setIsModalOpen(true);
    };

    const handleSaveFromModal = async () => {
        setSaving(true);
        try {
            // Create/Update Daily Log
            await nutritionistApi.createLeave({
                leaveDate: format(selectedDate!, "yyyy-MM-dd"),
                isFullDay: modalData.isFullDay,
                newStartTime: modalData.isFullDay ? undefined : modalData.startTime,
                newEndTime: modalData.isFullDay ? undefined : modalData.endTime,
            });
            
            await fetchData();
            setIsModalOpen(false);
            Swal.fire({ icon: 'success', title: 'สำเร็จ', text: 'บันทึกการลงเวลาเรียบร้อยแล้ว', timer: 1500, showConfirmButton: false });
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'ผิดพลาด', text: 'บันทึกข้อมูลไม่สำเร็จ' });
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteLog = async (logId: string) => {
        const result = await Swal.fire({
            title: 'ยกเลิกการลงเวลานี้?',
            text: "หากยกเลิก วันนี้จะถือว่าเป็นวันที่ไม่ว่าง (Unavailable) โดยอัตโนมัติ",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3d3522',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ยืนยันยกเลิก',
            cancelButtonText: 'กลับไปก่อน'
        });

        if (result.isConfirmed) {
            try {
                await nutritionistApi.deleteLeave(logId);
                await fetchData();
                Swal.fire('สำเร็จ!', 'ยกเลิกการลงเวลาเรียบร้อยแล้ว', 'success');
            } catch (error) {
                Swal.fire('ผิดพลาด!', 'ไม่สามารถลบข้อมูลได้', 'error');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center text-[#C6E065]">
                <Loader2 className="w-12 h-12 animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-[#fffbf5] ml-64">
            <div className="max-w-6xl mx-auto">
                <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-[#3d3522] mb-3 flex items-center gap-4">
                            <CalendarIcon className="w-10 h-10 text-[#C6E065]" />
                            ตารางลงเวลาทำงานรายวัน
                        </h1>
                        <p className="text-gray-500 font-medium">ให้นักโภชนาการลงเวลาทำงานเป็นรายวัน (ถ้าไม่ลงเวลาจะถือว่าไม่ว่างรับนัด)</p>
                    </div>
                </header>

                <div className="bg-white p-6 md:p-10 rounded-[48px] shadow-sm border border-gray-100 min-h-[700px]">
                    <div className="mb-8 flex items-center gap-8 text-xs font-black uppercase tracking-widest text-gray-400">
                        <div className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full bg-[#C6E065]"></span> วันที่เปิดรับนัด
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full bg-red-400"></span> วันที่ลาหยุด/ไม่ว่าง
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full bg-gray-100 border border-gray-200"></span> ยังไม่ได้ลงเวลา (ไม่ว่าง)
                        </div>
                    </div>

                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 650 }}
                        onSelectSlot={handleSelectSlot}
                        onSelectEvent={(event: any) => handleDeleteLog(event.resource.data.nutritionistLeaveId)}
                        selectable
                        views={['month', 'week', 'day']}
                        eventPropGetter={(event: any) => {
                            let backgroundColor = "#C6E065";
                            if (event.resource.type === 'leave') backgroundColor = "#f87171";
                            return { 
                                style: { 
                                    backgroundColor, 
                                    color: '#3d3522', 
                                    border: 'none', 
                                    borderRadius: '16px', 
                                    fontSize: '12px', 
                                    fontFamily: 'inherit',
                                    fontWeight: '900',
                                    padding: '6px 12px',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                } 
                            };
                        }}
                    />
                </div>

                {/* MODAL */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3d3522]/70 backdrop-blur-xl">
                        <div className="bg-[#fffbf5] w-full max-w-lg rounded-[56px] shadow-2xl overflow-hidden border border-white/40">
                            <div className="p-12">
                                <div className="flex justify-between items-start mb-10">
                                    <div>
                                        <h3 className="text-3xl font-black text-[#3d3522]">ลงเวลาทำงาน</h3>
                                        <p className="text-sm font-bold text-[#3d3522] uppercase tracking-[0.2em] mt-2">
                                            {selectedDate ? format(selectedDate, "eeee, dd MMMM yyyy") : ""}
                                        </p>
                                    </div>
                                    <button onClick={() => setIsModalOpen(false)} className="p-4 hover:bg-white hover:shadow-sm rounded-full transition-all group">
                                        <XCircle className="w-8 h-8 text-gray-300 group-hover:text-red-400 transition-colors" />
                                    </button>
                                </div>

                                <div className="space-y-10">
                                    <div className="p-6 bg-white rounded-[32px] border border-gray-100 shadow-sm space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 rounded-2xl ${modalData.isFullDay ? "bg-red-50 text-red-500" : "bg-[#C6E065]/20 text-[#3d3522]"}`}>
                                                    <Clock className="w-6 h-6" />
                                                </div>
                                                <span className="font-black text-lg text-[#3d3522]">วันนี้ลาหยุด / ไม่รับนัด</span>
                                            </div>
                                            <button 
                                                onClick={() => setModalData({...modalData, isFullDay: !modalData.isFullDay})}
                                                className={`w-16 h-8 rounded-full transition-all relative ${modalData.isFullDay ? "bg-red-400 shadow-inner" : "bg-gray-200"}`}
                                            >
                                                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg transition-all ${modalData.isFullDay ? "left-9" : "left-1"}`}></div>
                                            </button>
                                        </div>

                                        {!modalData.isFullDay && (
                                            <div className="pt-6 border-t border-gray-50 flex flex-col gap-6 animate-in fade-in slide-in-from-top-4">
                                                <div className="grid grid-cols-2 gap-6">
                                                    <div className="space-y-3">
                                                        <label className="text-[11px] font-black text-gray-400 ml-5 uppercase tracking-[0.15em]">เปิดรับนัดตั้งแต่</label>
                                                        <input 
                                                            type="time" 
                                                            value={modalData.startTime} 
                                                            onChange={e => setModalData({...modalData, startTime: e.target.value})} 
                                                            className="w-full bg-gray-50 border-none rounded-[24px] px-6 py-5 text-base font-black focus:ring-4 focus:ring-[#C6E065] transition-all" 
                                                        />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <label className="text-[11px] font-black text-gray-400 ml-5 uppercase tracking-[0.15em]">สิ้นสุดเวลา</label>
                                                        <input 
                                                            type="time" 
                                                            value={modalData.endTime} 
                                                            onChange={e => setModalData({...modalData, endTime: e.target.value})} 
                                                            className="w-full bg-gray-50 border-none rounded-[24px] px-6 py-5 text-base font-black focus:ring-4 focus:ring-[#C6E065] transition-all" 
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <button 
                                        disabled={saving}
                                        onClick={handleSaveFromModal}
                                        className="w-full bg-[#3d3522] text-white py-6 rounded-[32px] font-black text-lg flex items-center justify-center gap-4 hover:bg-black transition-all shadow-2xl hover:shadow-[#3d3522]/20 active:scale-[0.97] disabled:opacity-50"
                                    >
                                        {saving ? <Loader2 className="w-7 h-7 animate-spin" /> : <Save className="w-7 h-7" />}
                                        บันทึกตารางวันนี้
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

