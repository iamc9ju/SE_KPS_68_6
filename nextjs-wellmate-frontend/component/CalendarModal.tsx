'use client';

import React, { useState } from 'react';

// ─── Theme ────────────────────────────────────────────────────────────────────
const theme = {
    bg: '#f4f0e6',
    cardBg: '#ffffff',
    border: '#e5dfd0',
    gold: '#997000',
    goldLight: '#fef3c7',
    text: '#1c1917',
    textMuted: '#78716c',
};

interface CalendarModalProps {
    isOpen: boolean;
    onClose: () => void;
    appointments: any[];
}

const CalendarModal: React.FC<CalendarModalProps> = ({ isOpen, onClose, appointments }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date(2026, 2, 1)); // March 2026
    const [selectedDay, setSelectedDay] = useState<number | null>(null);

    if (!isOpen) return null;

    const handleDayClick = (day: number | null) => {
        if (!day) return;
        const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayApps = appointments.filter(a => a.datetime.startsWith(dateStr));
        if (dayApps.length > 0) {
            setSelectedDay(day);
        }
    };

    const handlePrevMonth = () => {
        setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
        setSelectedDay(null);
    };

    const handleNextMonth = () => {
        setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
        setSelectedDay(null);
    };

    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
    
    // Create days array
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }

    const monthName = currentMonth.toLocaleString('th-TH', { month: 'long', year: 'numeric' });

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-[110] p-6 transition-all duration-300" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="bg-[#fcfaf5] rounded-[40px] shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in-up border border-gray-100 relative">
                
                {/* Header */}
                <div className="p-8 border-b bg-white flex justify-between items-center" style={{ borderColor: theme.border }}>
                    <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-goldLight flex items-center justify-center text-2xl shadow-inner">📅</div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1" style={{ color: theme.gold }}>Wellmate Calendar</p>
                            <div className="flex items-center gap-4">
                                <button onClick={handlePrevMonth} className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-all text-gray-400">❮</button>
                                <h2 className="text-xl font-extrabold tracking-tight min-w-[160px] text-center" style={{ color: theme.text }}>{monthName}</h2>
                                <button onClick={handleNextMonth} className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-all text-gray-400">❯</button>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl hover:bg-gray-100 transition-all">✕</button>
                </div>

                {/* Calendar Grid */}
                <div className="p-8">
                    <div className="grid grid-cols-7 gap-2 mb-4">
                        {['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'].map((d, i) => (
                            <div key={i} className="text-center text-[10px] font-bold uppercase tracking-widest text-gray-400 py-2">{d}</div>
                        ))}
                        {days.map((day, i) => {
                            if (day === null) return <div key={i} className="aspect-square" />;
                            
                            const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                            const dayApps = appointments.filter(a => a.datetime.startsWith(dateStr));

                            return (
                                <div 
                                    key={i} 
                                    onClick={() => handleDayClick(day)}
                                    className={`relative aspect-square rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all group cursor-pointer hover:border-gold hover:shadow-lg ${dayApps.length > 0 ? 'bg-white border-gold/30' : 'bg-gray-50/50 border-transparent'}`}
                                >
                                    <span className={`text-[10px] font-bold ${dayApps.length > 0 ? 'text-gold' : 'text-gray-400'}`}>{day}</span>
                                    {dayApps.length > 0 && (
                                        <div className="flex flex-col items-center w-full px-1 gap-0.5 overflow-hidden">
                                            {dayApps.slice(0, 2).map((a, idx) => (
                                                <div key={idx} className="w-full text-[7px] font-medium truncate text-center bg-gold/10 text-gold py-0.5 rounded-sm px-1 leading-none">
                                                    {a.user_name.replace('คุณ', '')}
                                                </div>
                                            ))}
                                            {dayApps.length > 2 && (
                                                <div className="text-[6px] font-bold text-gray-400 uppercase mt-0.5">
                                                    +{dayApps.length - 2} เพิ่มเติม
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    
                                    {/* Tooltip on hover */}
                                    {dayApps.length > 0 && (
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-gray-900 text-white p-3 rounded-2xl text-[10px] opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-20 shadow-xl">
                                            <p className="font-bold border-b border-white/20 pb-1 mb-1">{dayApps.length} รายการนัดหมาย</p>
                                            {dayApps.slice(0, 2).map((a, idx) => (
                                                <p key={idx} className="truncate select-none">• {a.user_name} ({a.type})</p>
                                            ))}
                                            {dayApps.length > 2 && <p className="opacity-50 select-none">... และอื่นๆ</p>}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Day Detail Overlay */}
                {selectedDay && (
                    <div className="absolute inset-0 bg-[#fcfaf5]/95 backdrop-blur-sm z-30 animate-fade-in flex flex-col pt-16">
                        <div className="flex-1 overflow-y-auto px-8 py-4">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-2xl bg-goldLight flex items-center justify-center text-xl">📅</div>
                                    <h3 className="text-xl font-extrabold" style={{ color: theme.text }}>
                                        นัดหมายวันที่ {selectedDay} {currentMonth.toLocaleString('th-TH', { month: 'long' })}
                                    </h3>
                                </div>
                                <button 
                                    onClick={() => setSelectedDay(null)} 
                                    className="px-6 py-2.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest bg-gold text-white shadow-lg shadow-gold/20 hover:bg-goldMid transition-all active:scale-95"
                                    style={{ backgroundColor: theme.gold }}
                                >
                                    กลับหน้าหลัก
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                {appointments.filter(a => a.datetime.startsWith(`${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`)).map((app, idx) => (
                                    <div key={idx} className="bg-white p-5 rounded-[24px] border border-gray-100 shadow-sm flex items-center justify-between hover:border-gold/50 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-lg">{idx + 1}</div>
                                            <div>
                                                <p className="text-sm font-bold" style={{ color: theme.text }}>{app.user_name}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{app.type} • {new Date(app.datetime).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-goldLight text-gold rounded-full">{app.status}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer Tips */}
                <div className="px-8 py-6 bg-white border-t flex items-center gap-4" style={{ borderColor: theme.border }}>
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-sm">💡</div>
                    <p className="text-[10px] font-bold text-gray-400 leading-relaxed uppercase tracking-wider">
                        คลิกที่วันที่เพื่อดูรายการนัดหมายโดยละเอียด <br/>
                        จุดสีทองหมายถึงมีการนัดหมายในวันนั้น
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CalendarModal;
