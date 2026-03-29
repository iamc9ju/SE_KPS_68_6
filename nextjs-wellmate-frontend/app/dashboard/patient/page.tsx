"use client";
import React, { useState, useEffect } from "react";
import { adminService } from "@/services/admin";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import {
    Search, UserX, Shield, Filter, Mail, Phone,
    CalendarDays, Activity, ChevronDown, X, Eye, Trash2
} from "lucide-react";
import { UserCardSkeleton, AdminStatCardSkeleton } from "@/components/dashboard/DashboardSkeletons";

type UserItem = {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    status: string;
    joined: string;
    lastSeen: string;
    bmi: number | null;
    appointments: number;
    img: string;
};

const roleLabel: Record<string, string> = { patient: "ผู้ป่วย", nutritionist: "นักโภชนาการ", food_partner: "ร้านค้า", admin: "แอดมิน" };
const roleColor: Record<string, string> = { patient: "bg-blue-100 text-blue-700", nutritionist: "bg-[#fff3cc] text-[#7a5c00]", food_partner: "bg-orange-100 text-orange-700", admin: "bg-purple-100 text-purple-700" };
const statusColor: Record<string, string> = { active: "bg-green-100 text-green-700", inactive: "bg-gray-100 text-gray-500" };
const statusLabel: Record<string, string> = { active: "Active", inactive: "Inactive" };


const formatUser = (u: any): UserItem => ({
    ...u,
    joined: new Date(u.joined).toLocaleDateString('th-TH'),
    lastSeen: u.lastSeen ?? "-",
    bmi: u.bmi ?? null
});

export default function UsersPage() {
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const [mounted, setMounted] = useState(false);
    const [users, setUsers] = useState<UserItem[]>([]);
    const [search, setSearch] = useState("");
    const [filterRole, setFilterRole] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [selected, setSelected] = useState<UserItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        if (!user) {
            router.replace("/login");
            return;
        }
        if (user.role !== "admin") {
            router.replace("/dashboard");
        }
    }, [mounted, user, router]);

    useEffect(() => {
        if (!mounted || !user || user.role !== "admin") return;
        setLoading(true);
        setError(null);
        adminService.getUsers().then(data => {
            const formatted = data.map((u: any) => formatUser(u));
            setUsers(formatted);
        }).catch(err => {
            console.error("Failed to fetch users", err);
            setError("Failed to fetch users");
        }).finally(() => setLoading(false));
    }, [mounted, user]);

    if (!mounted || !user || user.role !== "admin") {
        return (
            <div className="flex h-screen items-center justify-center bg-[#F5F1E8]">
                <div className="animate-spin w-8 h-8 border-4 border-[#ffd980] border-t-transparent rounded-full"></div>
            </div>
        );
    }

    const filtered = users.filter(u => {
        const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()) || u.phone.includes(search);
        const matchRole = filterRole === "all" || u.role === filterRole;
        const matchStatus = filterStatus === "all" || u.status === filterStatus;
        return matchSearch && matchRole && matchStatus;
    });

    const toggleStatus = async (user: UserItem) => {
        try {
            const updated = user.status === "active"
                ? await adminService.deactivateUser(user.id)
                : await adminService.activateUser(user.id);
            const formatted = formatUser(updated);
            setUsers(p => p.map(u => u.id === formatted.id ? formatted : u));
            if (selected?.id === formatted.id) setSelected(formatted);
        } catch (err) {
            console.error("Failed to update user status", err);
            setError("Failed to update user status");
        }
    };
    const deleteUser = async (id: string) => {
        try {
            await adminService.deleteUser(id);
            setUsers(p => p.filter(u => u.id !== id));
            if (selected?.id === id) setSelected(null);
        } catch (err) {
            console.error("Failed to delete user", err);
            setError("Failed to delete user");
        }
    };

    const stats = {
        total: users.length,
        patient: users.filter(u => u.role === "patient").length,
        nutritionist: users.filter(u => u.role === "nutritionist").length,
        partner: users.filter(u => u.role === "food_partner").length,
        inactive: users.filter(u => u.status === "inactive").length,
    };

    return (
        <div className="flex-1 p-8 h-screen overflow-y-auto ml-64 bg-[#fffbf5]">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-black text-gray-900">จัดการผู้ใช้</h1>
                <p className="text-gray-400 text-sm mt-1">ผู้ใช้ทั้งหมด {stats.total} คน</p>
            </div>

            {loading ? (
                <>
                    {/* Stat Cards Skeleton */}
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
                        {[...Array(5)].map((_, i) => (
                            <AdminStatCardSkeleton key={i} />
                        ))}
                    </div>

                    {/* Filter Bar Skeleton */}
                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-50 mb-5">
                        <div className="h-10 bg-gray-50 rounded-2xl w-full" />
                    </div>

                    {/* User Cards Skeleton */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                        {[...Array(10)].map((_, i) => (
                            <UserCardSkeleton key={i} />
                        ))}
                    </div>
                </>
            ) : (
                <>
                    {/* Stat Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
                        {[
                            { label: "ทั้งหมด", value: stats.total, color: "bg-white" },
                            { label: "ผู้ป่วย", value: stats.patient, color: "bg-blue-50" },
                            { label: "นักโภชนาการ", value: stats.nutritionist, color: "bg-[#fff8e1]" },
                            { label: "ร้านค้า", value: stats.partner, color: "bg-orange-50" },
                            { label: "Inactive", value: stats.inactive, color: "bg-gray-50" },
                        ].map((s, i) => (
                            <div key={i} className={`${s.color} rounded-2xl p-4 text-center border border-gray-50 shadow-sm`}>
                                <p className="text-2xl font-black text-gray-900">{s.value}</p>
                                <p className="text-xs text-gray-400 font-medium mt-0.5">{s.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-50 mb-5">
                        <div className="flex flex-wrap gap-3">
                            <div className="flex items-center gap-2 border border-gray-200 rounded-2xl px-4 py-2.5 flex-1 min-w-48">
                                <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="ค้นหาชื่อ อีเมล เบอร์โทร..." className="text-sm outline-none w-full" />
                            </div>
                            <div className="flex items-center gap-2 border border-gray-200 rounded-2xl px-4 py-2.5">
                                <Filter className="w-4 h-4 text-gray-400" />
                                <select value={filterRole} onChange={e => setFilterRole(e.target.value)} className="text-sm outline-none bg-transparent">
                                    <option value="all">บทบาททั้งหมด</option>
                                    <option value="patient">ผู้ป่วย</option>
                                    <option value="nutritionist">นักโภชนาการ</option>
                                    <option value="food_partner">ร้านค้า</option>
                                </select>
                                <ChevronDown className="w-3 h-3 text-gray-400" />
                            </div>
                            <div className="flex items-center gap-2 border border-gray-200 rounded-2xl px-4 py-2.5">
                                <Activity className="w-4 h-4 text-gray-400" />
                                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="text-sm outline-none bg-transparent">
                                    <option value="all">สถานะทั้งหมด</option>
                                    <option value="active">ใช้งาน</option>                            <option value="inactive">ไม่ใช้งาน</option>
                                </select>
                                <ChevronDown className="w-3 h-3 text-gray-400" />
                            </div>
                        </div>
                    </div>

                    {/* User Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                        {filtered.map(user => (
                            <div key={user.id} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-50 hover:shadow-md transition-shadow">
                                <div className="flex items-start gap-4 mb-4">
                                    <img src={user.img} alt={user.name} className="w-14 h-14 rounded-2xl object-cover flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <p className="font-black text-gray-900 text-sm leading-tight">{user.name}</p>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0 ${statusColor[user.status]}`}>{statusLabel[user.status]}</span>
                                        </div>
                                        <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${roleColor[user.role]}`}>{roleLabel[user.role]}</span>
                                    </div>
                                </div>
                                <div className="space-y-1.5 mb-4">
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <Mail className="w-3.5 h-3.5 text-gray-300" />
                                        <span className="truncate">{user.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <Phone className="w-3.5 h-3.5 text-gray-300" />
                                        <span>{user.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <CalendarDays className="w-3.5 h-3.5 text-gray-300" />
                                        <span>เข้าร่วม {user.joined} · เข้าใช้ล่าสุด {user.lastSeen}</span>
                                    </div>
                                </div>
                                <div className="flex gap-3 mb-4 bg-[#fffdf0] rounded-2xl p-3">
                                    {user.bmi && <div className="flex-1 text-center"><p className="text-base font-black text-gray-900">{user.bmi}</p><p className="text-[10px] text-gray-400">BMI</p></div>}
                                    <div className="flex-1 text-center"><p className="text-base font-black text-gray-900">{user.appointments}</p><p className="text-[10px] text-gray-400">{user.role === "nutritionist" ? "นัดหมาย" : "การนัด"}</p></div>
                                    <div className="flex-1 text-center"><p className="text-base font-black text-gray-900">{user.id}</p><p className="text-[10px] text-gray-400">รหัส</p></div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setSelected(user)} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-2xl bg-[#fff3cc] hover:bg-[#ffd980] text-[#7a5c00] text-xs font-bold transition-colors">
                                        <Eye className="w-3.5 h-3.5" /> ดูข้อมูล
                                    </button>
                                    <button onClick={() => toggleStatus(user)} className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-2xl text-xs font-bold transition-colors ${user.status === "active" ? "bg-red-50 hover:bg-red-100 text-red-600" : "bg-green-50 hover:bg-green-100 text-green-700"}`}>
                                        {user.status === "active" ? <><UserX className="w-3.5 h-3.5" /> ระงับ</> : <><Shield className="w-3.5 h-3.5" /> เปิดใช้</>}
                                    </button>
                                    <button onClick={() => deleteUser(user.id)} className="p-2 rounded-2xl bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {filtered.length === 0 && (
                            <div className="col-span-3 text-center py-16 text-gray-400">ไม่พบผู้ใช้ที่ค้นหา</div>
                        )}
                    </div>
                </>
            )}

            {/* Detail Modal */}
            {selected && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl">
                        <div className="flex justify-between items-start mb-5">
                            <h3 className="text-lg font-black text-gray-900">ข้อมูลผู้ใช้</h3>
                            <button onClick={() => setSelected(null)} className="p-1.5 rounded-xl hover:bg-gray-100"><X className="w-5 h-5 text-gray-400" /></button>
                        </div>
                        <div className="flex flex-col items-center mb-5">
                            <img src={selected.img} alt={selected.name} className="w-20 h-20 rounded-3xl object-cover mb-3 shadow-sm" />
                            <p className="font-black text-lg text-gray-900">{selected.name}</p>
                            <span className={`mt-1 px-3 py-1 rounded-full text-xs font-bold ${roleColor[selected.role]}`}>{roleLabel[selected.role]}</span>
                        </div>
                        <div className="space-y-2 text-sm mb-5 bg-[#fffdf0] rounded-2xl p-4">
                            {[
                                ["รหัส", selected.id],
                                ["อีเมล", selected.email],
                                ["เบอร์โทร", selected.phone],
                                ["สถานะ", statusLabel[selected.status]],
                                ["เข้าร่วม", selected.joined],
                                ["เข้าใช้ล่าสุด", selected.lastSeen],
                                ["การนัดหมาย", `${selected.appointments} ครั้ง`],
                                ...(selected.bmi ? [["BMI", String(selected.bmi)]] : []),
                            ].map(([k, v]) => (
                                <div key={k} className="flex justify-between">
                                    <span className="text-gray-400">{k}</span>
                                    <span className="font-bold text-gray-800">{v}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => toggleStatus(selected)} className={`flex-1 font-bold py-2.5 rounded-2xl text-sm transition-colors ${selected.status === "active" ? "bg-red-50 hover:bg-red-100 text-red-600" : "bg-[#ffd980] hover:bg-[#f5c518] text-[#7a5c00]"}`}>
                                {selected.status === "active" ? "ระงับบัญชี" : "เปิดใช้งาน"}
                            </button>
                            <button onClick={() => deleteUser(selected.id)} className="px-4 py-2.5 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-colors">
                                ลบ
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
