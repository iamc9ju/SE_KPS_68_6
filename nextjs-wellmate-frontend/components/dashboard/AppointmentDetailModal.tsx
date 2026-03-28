'use client';

import React from 'react';

// ─── Theme ────────────────────────────────────────────────────────────────────
const theme = {
    bg: '#f4f0e6',
    cardBg: '#ffffff',
    border: '#e5dfd0',
    gold: '#997000',
    goldLight: '#fef3c7',
    text: '#1c1917',
    textMuted: '#78716c',
    textLight: '#a8a29e',
};

interface Appointment {
    appointment_id: string;
    user_name: string;
    nutritionist: string;
    datetime: string;
    type: 'Consult' | 'Follow-up' | 'Analysis';
    status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
    notes: string;
}

interface AppointmentDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    appointment: Appointment | null;
    onSave?: (updated: Appointment) => void;
}

const AppointmentDetailModal: React.FC<AppointmentDetailModalProps> = ({ isOpen, onClose, appointment, onSave }) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const [formData, setFormData] = React.useState<Appointment | null>(null);

    // Reset edit state when appointment changes or modal closes
    React.useEffect(() => {
        if (appointment) {
            setFormData(appointment);
        }
        setIsEditing(false);
    }, [appointment, isOpen]);

    if (!appointment || !formData) return null;

    const formattedDate = new Date(formData.datetime).toLocaleDateString('th-TH', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long'
    });
    const formattedTime = new Date(formData.datetime).toLocaleTimeString('th-TH', { 
        hour: '2-digit', 
        minute: '2-digit' 
    }) + ' น.';

    const handleSave = () => {
        if (onSave && formData) {
            onSave(formData);
            setIsEditing(false);
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div 
                className={`fixed inset-0 z-[120] bg-black/20 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Modal Container */}
            <div 
                className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white z-[130] rounded-[40px] shadow-2xl transition-all duration-500 overflow-hidden ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}
            >
                {/* Header */}
                <div className="px-10 py-8 border-b flex justify-between items-center" style={{ borderColor: theme.border }}>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-goldLight flex items-center justify-center text-2xl shadow-inner">
                            {isEditing ? '📝' : '📅'}
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1" style={{ color: theme.gold }}>
                                {isEditing ? 'แก้ไขข้อมูลการนัด' : 'ข้อมูลการนัดหมาย'}
                            </p>
                            <h2 className="text-xl font-extrabold tracking-tight" style={{ color: theme.text }}>
                                {isEditing ? 'โหมดแก้ไขข้อมูล' : `รายละเอียดลำดับ ${appointment.appointment_id}`}
                            </h2>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl hover:bg-gray-100 transition-all">✕</button>
                </div>

                {/* Content */}
                <div className="px-10 py-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    
                    {/* User & Nutritionist (Static) */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3 p-5 rounded-3xl border bg-gray-50/30" style={{ borderColor: theme.border }}>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">ลูกค้า</p>
                            <p className="text-lg font-extrabold" style={{ color: theme.text }}>คุณ{appointment.user_name}</p>
                            <span className="inline-block px-2 py-0.5 rounded-full bg-gold/10 text-gold text-[8px] font-bold uppercase tracking-widest">Wellmate Member</span>
                        </div>
                        <div className="space-y-3 p-5 rounded-3xl border bg-gray-50/30" style={{ borderColor: theme.border }}>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">นักโภชนาการ</p>
                            <p className="text-lg font-extrabold" style={{ color: theme.text }}>{appointment.nutritionist}</p>
                            <span className="inline-block px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[8px] font-bold uppercase tracking-widest">โภชนากรประจํา</span>
                        </div>
                    </div>

                    {/* Time & Type (Editable) */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: theme.textLight }}>วันเวลาและประเภท</h3>
                            {!isEditing && <span className="text-[8px] font-bold text-gold uppercase animate-pulse">คลิกเพื่อเลื่อนนัด 👆</span>}
                        </div>
                        
                        {isEditing ? (
                            <div className="space-y-4 p-6 rounded-[32px] border bg-gray-50/50" style={{ borderColor: theme.border }}>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">เลือกวันและเวลาใหม่</label>
                                    <input 
                                        type="datetime-local" 
                                        value={formData.datetime}
                                        onChange={(e) => setFormData({ ...formData, datetime: e.target.value })}
                                        className="w-full px-4 py-3 rounded-2xl border text-sm font-bold focus:ring-2 focus:ring-gold outline-none transition-all"
                                        style={{ borderColor: theme.border }}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">ประเภทการนัด</label>
                                    <select 
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                                        className="w-full px-4 py-3 rounded-2xl border text-sm font-bold focus:ring-2 focus:ring-gold outline-none transition-all appearance-none bg-white"
                                        style={{ borderColor: theme.border }}
                                    >
                                        <option value="Consult">ปรึกษาโภชนาการ</option>
                                        <option value="Follow-up">ติดตามผล</option>
                                        <option value="Analysis">วิเคราะห์ร่างกาย</option>
                                    </select>
                                </div>
                            </div>
                        ) : (
                            <div 
                                onClick={() => setIsEditing(true)}
                                className="p-6 rounded-[32px] border bg-white space-y-4 cursor-pointer hover:border-gold hover:bg-gold/5 transition-all group" 
                                style={{ borderColor: theme.border }}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl group-hover:scale-110 transition-transform">📆</span>
                                        <div>
                                            <p className="text-sm font-bold group-hover:text-gold transition-colors" style={{ color: theme.text }}>{formattedDate}</p>
                                            <p className="text-[10px] font-bold text-gray-400">เวลา {formattedTime}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-[10px] font-bold border border-purple-100 uppercase tracking-wider">{formData.type}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Notes (Editable) */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: theme.textLight }}>บันทึกเพิ่มเติม</h3>
                        {isEditing ? (
                            <textarea 
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                className="w-full p-6 rounded-[32px] border bg-white text-sm focus:ring-2 focus:ring-gold outline-none transition-all min-h-[120px]"
                                style={{ borderColor: theme.border }}
                                placeholder="ระบุบันทึกเพิ่มเติมที่นี่..."
                            />
                        ) : (
                            <div className="p-6 rounded-[32px] border bg-yellow-50/30 min-h-[100px]" style={{ borderColor: theme.border }}>
                                <p className="text-sm leading-relaxed text-gray-600 font-medium italic">"{formData.notes || 'ไม่มีบันทึกเพิ่มเติม'}"</p>
                            </div>
                        )}
                    </div>

                    {/* Status Footer Section */}
                    {!isEditing && (
                        <div className="flex items-center justify-between p-6 rounded-[32px] bg-gray-900 text-white">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <p className="text-xs font-bold uppercase tracking-widest">สถานะปัจจุบัน</p>
                            </div>
                            <p className="text-sm font-black uppercase tracking-widest">{formData.status}</p>
                        </div>
                    )}
                </div>

                {/* Footer Buttons */}
                <div className="px-10 py-8 bg-gray-50/50 border-t flex gap-4" style={{ borderColor: theme.border }}>
                    {isEditing ? (
                        <>
                            <button 
                                onClick={() => setIsEditing(false)}
                                className="flex-1 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest border bg-white hover:bg-gray-100 transition-all active:scale-95 text-gray-400"
                                style={{ borderColor: theme.border }}
                            >
                                ยกเลิก
                            </button>
                            <button 
                                onClick={handleSave}
                                className="flex-1 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest bg-gold text-white shadow-lg shadow-gold/20 hover:bg-goldMid transition-all active:scale-95"
                                style={{ backgroundColor: theme.gold }}
                            >
                                บันทึกการเปลี่ยนแปลง
                            </button>
                        </>
                    ) : (
                        <>
                            <button 
                                onClick={onClose}
                                className="flex-1 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest border bg-white hover:bg-gray-100 transition-all active:scale-95 text-gray-400"
                                style={{ borderColor: theme.border }}
                            >
                                ปิดหน้านี้
                            </button>
                            <button 
                                onClick={() => setIsEditing(true)}
                                className="flex-1 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest bg-gold text-white shadow-lg shadow-gold/20 hover:bg-goldMid transition-all active:scale-95"
                                style={{ backgroundColor: theme.gold }}
                            >
                                แก้ไขข้อมูล
                            </button>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default AppointmentDetailModal;
