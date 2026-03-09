"use client";

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Search, Bell, ChevronDown, ChevronLeft, ChevronRight,
    Calendar as CalendarIcon,
    Clock, MapPin, X
} from 'lucide-react';
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import Sidebar from "@/components/dashboard/Sidebar";
import BackgroundPattern from "@/components/dashboard/BackgroundPattern";

type EventType = "physical" | "appointment";

interface CalendarEvent {
    id: string;
    title: string;
    startTime: string;
    endTime?: string | null;
    type: EventType;
}

interface CalendarCell {
    key: string;
    day: number;
    isCurrent: boolean;
    events: Array<{
        id: string;
        title: string;
        time: string;
        startTime: string;
        endTime?: string | null;
        type: EventType;
    }>;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const getDateKey = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

const getEventDateKey = (isoDate: string) => {
    const datePartMatch = isoDate.match(/^\d{4}-\d{2}-\d{2}/);
    if (datePartMatch) {
        return datePartMatch[0];
    }
    return getDateKey(new Date(isoDate));
};

const formatEventTime = (isoDate: string) =>
    new Date(isoDate).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
    });

const parseDateKey = (key: string) => {
    const [year, month, day] = key.split("-").map(Number);
    return new Date(year, month - 1, day);
};

const toDatetimeLocalValue = (isoDate: string) => {
    const date = new Date(isoDate);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const toDatetimeLocalFromDate = (date: Date) => {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const formatDateFromKey = (key: string) =>
    parseDateKey(key).toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

export default function Calendar() {
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showPhysical, setShowPhysical] = useState(true);
    const [showAppointments, setShowAppointments] = useState(true);
    const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
    const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
    const [isAddMode, setIsAddMode] = useState(false);
    const [editingEventId, setEditingEventId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editStartTime, setEditStartTime] = useState("");
    const [editEndTime, setEditEndTime] = useState("");
    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newCalories, setNewCalories] = useState("");
    const [newStartTime, setNewStartTime] = useState("");
    const [newEndTime, setNewEndTime] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [viewDate, setViewDate] = useState(() => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), 1);
    });

    const fetchCalendar = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const monthStart = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
            const monthEnd = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0, 23, 59, 59, 999);

            const res = await api.get("/calendar", {
                params: {
                    start: monthStart.toISOString(),
                    end: monthEnd.toISOString(),
                },
            });

            const payload = Array.isArray(res.data) ? res.data : res.data?.data;
            if (!Array.isArray(payload)) {
                setError("Unexpected calendar response format.");
                setEvents([]);
                return;
            }

            const normalized: CalendarEvent[] = payload.map((item) => ({
                id: String(item.id),
                title: String(item.title ?? ""),
                startTime: String(item.startTime),
                endTime: item.endTime ?? null,
                type: item.type === "appointment" ? "appointment" : "physical",
            }));

            setEvents(normalized);
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 401) {
                setError("Session expired. Please login again.");
                setEvents([]);
                router.replace("/login");
                return;
            }

            console.error(err);
            setError("Unable to load calendar data.");
            setEvents([]);
        } finally {
            setLoading(false);
        }
    }, [router, viewDate]);

    useEffect(() => {
        fetchCalendar();
    }, [fetchCalendar]);

    useEffect(() => {
        if (!selectedDateKey) {
            return;
        }

        const currentMonth = viewDate.getMonth();
        const currentYear = viewDate.getFullYear();
        const selectedDate = parseDateKey(selectedDateKey);

        if (
            selectedDate.getFullYear() !== currentYear ||
            selectedDate.getMonth() !== currentMonth
        ) {
            setSelectedDateKey(null);
        }
    }, [selectedDateKey, viewDate]);

    const filteredEvents = useMemo(() => {
        return events.filter((event) => {
            if (event.type === "physical" && !showPhysical) {
                return false;
            }
            if (event.type === "appointment" && !showAppointments) {
                return false;
            }
            return true;
        });
    }, [events, showAppointments, showPhysical]);

    const yearLabel = viewDate.getFullYear();
    const monthIndex = viewDate.getMonth();
    const monthPrefix = `${yearLabel}-${String(monthIndex + 1).padStart(2, "0")}`;
    const monthEvents = useMemo(
        () => filteredEvents.filter((event) => getEventDateKey(event.startTime).startsWith(monthPrefix)),
        [filteredEvents, monthPrefix]
    );

    const summary = useMemo(() => {
        return monthEvents.reduce(
            (acc, event) => {
                if (event.type === "physical") {
                    acc.physical += 1;
                } else {
                    acc.appointment += 1;
                }
                return acc;
            },
            { physical: 0, appointment: 0 }
        );
    }, [monthEvents]);

    const calendarData = useMemo<CalendarCell[]>(() => {
        const monthStart = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
        const monthEnd = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0);
        const gridStart = new Date(monthStart);
        gridStart.setDate(monthStart.getDate() - monthStart.getDay());

        const gridEnd = new Date(monthEnd);
        gridEnd.setDate(monthEnd.getDate() + (6 - monthEnd.getDay()));

        const eventMap = new Map<string, CalendarCell["events"]>();
        monthEvents.forEach((event) => {
            const key = getEventDateKey(event.startTime);
            const list = eventMap.get(key) ?? [];
            list.push({
                id: event.id,
                title: event.title,
                time: formatEventTime(event.startTime),
                startTime: event.startTime,
                endTime: event.endTime ?? null,
                type: event.type,
            });
            eventMap.set(key, list);
        });

        const cells: CalendarCell[] = [];
        const cursor = new Date(gridStart);
        while (cursor <= gridEnd) {
            const key = getDateKey(cursor);
            cells.push({
                key,
                day: cursor.getDate(),
                isCurrent: cursor.getMonth() === viewDate.getMonth(),
                events: (eventMap.get(key) ?? []).sort(
                    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
                ),
            });
            cursor.setDate(cursor.getDate() + 1);
        }

        return cells;
    }, [monthEvents, viewDate]);

    const monthLabel = useMemo(() => {
        return new Intl.DateTimeFormat("en-US", { month: "long" }).format(viewDate);
    }, [viewDate]);

    const monthOptions = useMemo(
        () => Array.from({ length: 12 }, (_, idx) => new Date(2000, idx, 1).toLocaleString("en-US", { month: "long" })),
        []
    );
    const yearOptions = useMemo(
        () => Array.from({ length: 21 }, (_, idx) => yearLabel - 10 + idx),
        [yearLabel]
    );
    const selectedDate = useMemo(
        () => (selectedDateKey ? parseDateKey(selectedDateKey) : null),
        [selectedDateKey]
    );
    const selectedDayLabel = useMemo(
        () =>
            selectedDate
                ? selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                })
                : "",
        [selectedDate]
    );
    const selectedDayEvents = useMemo(() => {
        if (!selectedDateKey) {
            return [];
        }

        return monthEvents
            .filter((event) => getEventDateKey(event.startTime) === selectedDateKey)
            .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    }, [monthEvents, selectedDateKey]);

    const handleStartEdit = (event: CalendarEvent) => {
        setIsAddMode(false);
        setEditingEventId(event.id);
        setEditTitle(event.title);
        setEditStartTime(toDatetimeLocalValue(event.startTime));
        setEditEndTime(event.endTime ? toDatetimeLocalValue(event.endTime) : "");
    };

    const handleCancelEdit = () => {
        setEditingEventId(null);
        setEditTitle("");
        setEditStartTime("");
        setEditEndTime("");
    };

    const handleOpenAddActivity = () => {
        const baseDate = selectedDateKey ? parseDateKey(selectedDateKey) : new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
        const start = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), 9, 0, 0, 0);
        const end = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), 10, 0, 0, 0);

        setSelectedDateKey(getDateKey(baseDate));
        setEditingEventId(null);
        setIsAddMode(true);
        setNewTitle("");
        setNewDescription("");
        setNewCalories("");
        setNewStartTime(toDatetimeLocalFromDate(start));
        setNewEndTime(toDatetimeLocalFromDate(end));
    };

    const handleCancelAdd = () => {
        setIsAddMode(false);
        setNewTitle("");
        setNewDescription("");
        setNewCalories("");
        setNewStartTime("");
        setNewEndTime("");
    };

    const handleCreateActivity = async () => {
        try {
            setIsSaving(true);
            await api.post("/calendar", {
                title: newTitle,
                description: newDescription.trim() || undefined,
                startTime: new Date(newStartTime).toISOString(),
                endTime: newEndTime ? new Date(newEndTime).toISOString() : undefined,
                calories: newCalories.trim() ? Number(newCalories) : undefined,
            });
            await fetchCalendar();
            setIsAddMode(false);
        } catch (err) {
            console.error(err);
            setError("Unable to create activity.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveEdit = async (eventId: string) => {
        try {
            setIsSaving(true);
            await api.patch(`/calendar/${eventId}`, {
                title: editTitle,
                startTime: new Date(editStartTime).toISOString(),
                endTime: editEndTime ? new Date(editEndTime).toISOString() : null,
            });
            await fetchCalendar();
            handleCancelEdit();
        } catch (err) {
            console.error(err);
            setError("Unable to update activity.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleRemoveEvent = async (eventId: string) => {
        if (!window.confirm("Delete this activity?")) {
            return;
        }

        try {
            await api.delete(`/calendar/${eventId}`);
            await fetchCalendar();
        } catch (err) {
            console.error(err);
            setError("Unable to remove activity.");
        }
    };

    const displayName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || "WellMate User";
    const roleLabelMap: Record<string, string> = {
        patient: "Patient",
        nutritionist: "Nutritionist",
        food_partner: "Food Partner",
        admin: "Admin",
    };
    const roleLabel = user?.role ? roleLabelMap[user.role] ?? "Member" : "Member";
    const avatarName = encodeURIComponent(displayName);

    return (
        <div className="flex h-screen bg-[#fffbf5] font-sans text-[#3d3522] overflow-hidden relative">
            <BackgroundPattern />
            <Sidebar />

            <main className="flex-1 overflow-y-auto px-8 py-10 z-10 custom-scrollbar ml-64">
                <header className="mb-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-slate-800">Calendar</h1>
                    <div className="flex items-center gap-4">
                        <button className="text-slate-600 hover:text-slate-800"><Search size={22} /></button>
                        <button className="text-slate-600 hover:text-slate-800"><Bell size={22} /></button>
                        <div className="w-px h-6 bg-slate-200"></div>
                        <div className="flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-slate-100 transition-colors">
                            <div className="w-10 h-10 bg-slate-300 rounded-xl overflow-hidden flex items-center justify-center">
                                <Image
                                    src={`https://ui-avatars.com/api/?name=${avatarName}&background=94a3b8&color=ffffff`}
                                    alt="User"
                                    width={40}
                                    height={40}
                                />
                            </div>
                            <div className="hidden sm:block">
                                <div className="font-bold text-sm text-slate-800">{displayName}</div>
                                <div className="text-xs text-slate-500 font-medium text-right">{roleLabel}</div>
                            </div>
                            <ChevronDown size={18} className="text-slate-500 hidden sm:block" />
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-2 gap-6 mb-8">
                    { }
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center">
                        <h3 className="font-semibold text-slate-500 mb-6 text-sm border-b border-slate-200 pb-3 w-full text-center">Total Physical Activities Schedule</h3>
                        <div className="flex items-center gap-4">
                            <div className="bg-[#ffe8a1] w-14 h-14 rounded-2xl flex items-center justify-center">
                                { }
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d49a00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                </svg>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black text-slate-800">{summary.physical}</span>
                                <span className="text-xl font-bold text-slate-500">agendas</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center">
                        <h3 className="font-semibold text-slate-500 mb-6 text-sm border-b border-slate-200 pb-3 w-full text-center">Total Appointments / Events Schedule</h3>
                        <div className="flex items-center gap-4">
                            <div className="bg-orange-200 w-14 h-14 rounded-2xl flex items-center justify-center">
                                <CalendarIcon className="text-orange-600" size={28} />
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black text-slate-800">{summary.appointment}</span>
                                <span className="text-xl font-bold text-slate-500">agendas</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-slate-400">
                            <button
                                aria-label="Previous month"
                                className="hover:text-slate-700 p-1.5 rounded-md hover:bg-slate-100 transition-colors"
                                onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                aria-label="Next month"
                                className="hover:text-slate-700 p-1.5 rounded-md hover:bg-slate-100 transition-colors"
                                onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                        <div className="relative">
                            <button
                                type="button"
                                aria-label="Open month and year selector"
                                className="text-[38px] leading-none font-black text-slate-800 flex items-center gap-2 tracking-tight"
                                onClick={() => setIsMonthPickerOpen((prev) => !prev)}
                            >
                                {monthLabel}
                                <span className="text-slate-400 font-semibold">{yearLabel}</span>
                                <ChevronDown size={20} className={`text-slate-400 transition-transform ${isMonthPickerOpen ? "rotate-180" : ""}`} />
                            </button>
                            {isMonthPickerOpen && (
                                <div className="absolute left-0 top-full z-20 mt-2 flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                                    <select
                                        aria-label="Select month from title picker"
                                        className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 min-w-[124px]"
                                        value={monthIndex}
                                        onChange={(e) => {
                                            setViewDate(new Date(yearLabel, Number(e.target.value), 1));
                                            setIsMonthPickerOpen(false);
                                        }}
                                    >
                                        {monthOptions.map((month, idx) => (
                                            <option key={month} value={idx}>{month}</option>
                                        ))}
                                    </select>
                                    <select
                                        aria-label="Select year from title picker"
                                        className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 min-w-[92px]"
                                        value={yearLabel}
                                        onChange={(e) => {
                                            setViewDate(new Date(Number(e.target.value), monthIndex, 1));
                                            setIsMonthPickerOpen(false);
                                        }}
                                    >
                                        {yearOptions.map((year) => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={handleOpenAddActivity}
                        className="px-5 py-2.5 rounded-lg bg-[#ccff00] text-slate-900 font-black text-sm hover:bg-[#bfe600] transition-colors"
                    >
                        Add Activity
                    </button>
                </div>

                <div className="flex items-center gap-6 mb-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={showPhysical}
                            onChange={(e) => setShowPhysical(e.target.checked)}
                            className="w-4 h-4 rounded text-yellow-400 focus:ring-yellow-400 accent-[#ffcc00]"
                        />
                        <span className="text-sm font-bold text-slate-700">Physical Activities</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={showAppointments}
                            onChange={(e) => setShowAppointments(e.target.checked)}
                            className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500 accent-orange-500"
                        />
                        <span className="text-sm font-bold text-slate-700">Appointments/Events</span>
                    </label>
                </div>
                {loading && (
                    <div className="mb-4 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-500">
                        Loading calendar...
                    </div>
                )}
                {error && (
                    <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                        {error}
                    </div>
                )}

                { }
                <div className="bg-white border-slate-200 border-t border-l flex-1 flex flex-col min-h-[500px]">
                    <div className="flex-1 overflow-x-auto overflow-y-hidden">
                        <table className="w-full h-full table-fixed border-collapse">
                            <thead>
                                <tr>
                                    {DAYS.map(day => (
                                        <th key={day} className="py-3 text-center text-sm font-bold text-slate-500 border-r border-b border-slate-200 bg-slate-50 w-[14.28%] font-sans">
                                            {day}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {calendarData.length > 0 ? (
                                    Array.from({ length: Math.ceil(calendarData.length / 7) }).map((_, rowIndex) => (
                                        <tr key={rowIndex} className="h-1/4">
                                            {calendarData.slice(rowIndex * 7, rowIndex * 7 + 7).map((cell) => (
                                                <td
                                                    key={cell.key}
                                                    onClick={() => {
                                                        setSelectedDateKey(cell.key);
                                                        setIsAddMode(false);
                                                    }}
                                                    className={`border-b border-r border-slate-200 p-1.5 align-top bg-white cursor-pointer ${cell.key === selectedDateKey ? "ring-2 ring-inset ring-[#bfe600]" : ""}`}
                                                >
                                                    <div className="flex flex-col h-full min-h-[120px]">
                                                        <div className="mb-1 flex justify-start">
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setSelectedDateKey(cell.key);
                                                                    setIsAddMode(false);
                                                                }}
                                                                className={`inline-flex items-center justify-center w-6 h-6 text-sm font-bold rounded-full transition-colors ${cell.key === selectedDateKey
                                                                    ? "bg-[#bfe600] text-slate-900"
                                                                    : cell.isCurrent
                                                                        ? "text-slate-700 hover:bg-slate-100"
                                                                        : "text-slate-500 hover:bg-slate-100"
                                                                    }`}
                                                            >
                                                                {cell.day}
                                                            </button>
                                                        </div>
                                                        <div className="flex-1 flex flex-col gap-1 overflow-y-auto pr-1">
                                                            {cell.events.map(ev => (
                                                                <div
                                                                    key={ev.id}
                                                                    onClick={() => {
                                                                        setSelectedDateKey(cell.key);
                                                                        setIsAddMode(false);
                                                                    }}
                                                                    className={`px-2 py-1.5 rounded-md text-[10px] font-bold leading-tight ${ev.type === 'physical' ? 'bg-[#ffda75] text-[#8c6600]' : 'bg-[#fcb481] text-[#80390f]'}`}
                                                                >
                                                                    <div className="opacity-90 tracking-tight font-black text-[9px] mb-0.5">{ev.time}</div>
                                                                    <div className="truncate whitespace-normal">{ev.title}</div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="h-[240px] border-b border-r border-slate-200 text-center text-sm font-medium text-slate-400">
                                            No events in this month.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </main>

            { }
            {selectedDateKey && (
                <aside className="hidden xl:flex w-[380px] bg-gradient-to-b from-[#fff8df] via-[#fff4d6] to-[#fff0c8] border-l border-[#f1dfab] shrink-0 flex-col p-5 overflow-y-auto shadow-[-10px_0_30px_rgba(204,255,0,0.08)]">
                    <div className="mb-4 flex items-start justify-between gap-3">
                        <div>
                            <h2 className="text-[32px] leading-none font-black text-[#2f2a1c] mb-1">Schedule Detail</h2>
                            <div className="text-sm font-bold text-[#7d7050]">{selectedDayLabel}</div>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                setSelectedDateKey(null);
                                handleCancelAdd();
                            }}
                            className="rounded-md p-1 text-[#8f7f54] hover:text-[#6b5f3f] hover:bg-[#f4e7ba] transition-colors"
                            aria-label="Close schedule detail"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <div className="space-y-5">
                        {isAddMode && (
                            <div className="rounded-2xl bg-[#fffdf0] p-4 border border-[#ecd89b] shadow-[0_8px_24px_rgba(212,177,67,0.14)]">
                                <div className="flex items-start justify-between gap-3 mb-3">
                                    <div>
                                        <div className="inline-block rounded-md bg-gradient-to-r from-[#ccff00] to-[#dfff5f] px-2 py-0.5 text-[10px] font-black text-slate-900 mb-2 shadow-sm">
                                            New Activity
                                        </div>
                                        <div className="text-lg font-black text-[#2f2a1c] leading-none">Add Schedule</div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Title</label>
                                        <input
                                            value={newTitle}
                                            onChange={(e) => setNewTitle(e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-[#bfe600] focus:ring-2 focus:ring-[#e7f5a5]"
                                            placeholder="Activity title"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Description</label>
                                        <textarea
                                            value={newDescription}
                                            onChange={(e) => setNewDescription(e.target.value)}
                                            rows={3}
                                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-[#bfe600] focus:ring-2 focus:ring-[#e7f5a5] resize-none"
                                            placeholder="Describe this activity"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Calories (kcal)</label>
                                        <input
                                            type="number"
                                            min={0}
                                            value={newCalories}
                                            onChange={(e) => setNewCalories(e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-[#bfe600] focus:ring-2 focus:ring-[#e7f5a5]"
                                            placeholder="e.g. 250"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Start Time</label>
                                        <input
                                            type="datetime-local"
                                            value={newStartTime}
                                            onChange={(e) => setNewStartTime(e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-[#bfe600] focus:ring-2 focus:ring-[#e7f5a5]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-600 mb-1">End Time</label>
                                        <input
                                            type="datetime-local"
                                            value={newEndTime}
                                            onChange={(e) => setNewEndTime(e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-[#bfe600] focus:ring-2 focus:ring-[#e7f5a5]"
                                        />
                                    </div>

                                    <div className="flex justify-end gap-2 pt-1">
                                        <button
                                            onClick={handleCancelAdd}
                                            className="text-[11px] px-3 py-1.5 rounded-lg bg-slate-200 text-slate-600 font-semibold hover:bg-slate-300 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleCreateActivity}
                                            disabled={isSaving || !newTitle.trim() || !newStartTime}
                                            className="text-[11px] px-3 py-1.5 rounded-lg bg-[#ccff00] text-slate-900 font-black hover:bg-[#bfe600] transition-colors disabled:opacity-50"
                                        >
                                            {isSaving ? "Saving..." : "Create Activity"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        {selectedDayEvents.length === 0 ? (
                            <div className="rounded-2xl border border-[#e7d39d] bg-white/90 p-5 text-sm font-semibold text-[#8a7950]">
                                No schedules for this day.
                            </div>
                        ) : (
                            selectedDayEvents.map((event) => (
                                <div
                                    key={event.id}
                                    className="rounded-2xl bg-gradient-to-br from-[#fff8e8] to-[#f6ecd6] p-4 border border-[#ecd7a6] shadow-[0_8px_20px_rgba(198,224,101,0.15)]"
                                >
                                    <div
                                        className={`inline-block text-[10px] font-black px-2 py-0.5 rounded mb-3 ${event.type === "physical"
                                            ? "bg-gradient-to-r from-[#f0cf72] to-[#ffd980] text-[#70561a]"
                                            : "bg-gradient-to-r from-[#f39a61] to-[#ffb27d] text-white"
                                            }`}
                                    >
                                        {event.type === "physical" ? "Physical Activities" : "Appointments"}
                                    </div>
                                    <h3 className="font-black text-[31px] leading-[1.05] text-[#2f2a1c] mb-3">{event.title}</h3>

                                    <div className="space-y-1.5 text-[11px] text-[#5f5338] font-semibold mb-3">
                                        <div className="flex items-center gap-2">
                                            <CalendarIcon size={12} className="text-[#8e7b46]" />
                                            <span>{formatDateFromKey(getEventDateKey(event.startTime))}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock size={12} className="text-[#8e7b46]" />
                                            <span>
                                                {formatEventTime(event.startTime)}
                                                {event.endTime ? ` - ${formatEventTime(event.endTime)}` : ""}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin size={12} className="text-[#8e7b46]" />
                                            <span>Online</span>
                                        </div>
                                    </div>

                                    <div className="rounded-xl bg-[#fffdf5] p-3 border border-[#e9ddb9] mb-3">
                                        <div className="text-[10px] text-[#8a7950] font-semibold mb-1">Note</div>
                                        <div className="text-[10px] text-[#8a7950]">
                                            No additional note.
                                        </div>
                                    </div>

                                    {editingEventId === event.id ? (
                                        <div className="space-y-2">
                                            <input
                                                value={editTitle}
                                                onChange={(e) => setEditTitle(e.target.value)}
                                                className="w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-xs"
                                                placeholder="Title"
                                            />
                                            <input
                                                type="datetime-local"
                                                value={editStartTime}
                                                onChange={(e) => setEditStartTime(e.target.value)}
                                                className="w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-xs"
                                            />
                                            <input
                                                type="datetime-local"
                                                value={editEndTime}
                                                onChange={(e) => setEditEndTime(e.target.value)}
                                                className="w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-xs"
                                            />
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className="text-[10px] px-2.5 py-1 rounded bg-slate-200 text-slate-600 font-semibold"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => handleSaveEdit(event.id)}
                                                    disabled={isSaving || !editTitle.trim() || !editStartTime}
                                                    className="text-[10px] px-2.5 py-1 rounded bg-gradient-to-r from-[#b7ea2e] to-[#d2f25c] text-[#4f6400] font-bold disabled:opacity-50"
                                                >
                                                    {isSaving ? "Saving..." : "Save"}
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleStartEdit(event)}
                                                className="text-[10px] px-2.5 py-1 rounded bg-slate-200 text-slate-600 font-semibold"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleRemoveEvent(event.id)}
                                                className="text-[10px] px-2.5 py-1 rounded bg-gradient-to-r from-[#b7ea2e] to-[#d2f25c] text-[#4f6400] font-bold"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </aside>
            )}
        </div>
    );
}
