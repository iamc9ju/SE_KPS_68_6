"use client";
import React, { useState, useEffect } from "react";
import { adminService } from "@/services/admin";
import {
    Search,
    XCircle,
    Store,
    Filter,
    Star,
    ShoppingBag,
    ChevronDown,
    X,
    Eye,
    Phone,
    Mail,
    MapPin,
    DollarSign,
    Trash2,
    BarChart2,
} from "lucide-react";
import { PartnerCardSkeleton, AdminStatCardSkeleton } from "@/components/dashboard/DashboardSkeletons";

type PartnerItem = {
    id: number;
    name: string;
    owner: string;
    email: string;
    phone: string;
    address: string;
    status: string;
    menu: number;
    orders: number;
    revenue: number | null;
    commission: number;
    joined: string;
    rating: number | null;
    category: string;
    img: string;
    banner: string;
};

const statusConfig: Record<string, { label: string; color: string }> = {
    active: { label: "ใช้งานอยู่", color: "bg-green-100 text-green-700" },
    inactive: { label: "ปิดใช้งาน", color: "bg-gray-100 text-gray-500" },
};

export default function PartnersPage() {
    const [partners, setPartners] = useState<PartnerItem[]>([]);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [selected, setSelected] = useState<PartnerItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        adminService
            .getPartners()
            .then((data) => {
                setPartners(data);
            })
            .catch((err) => {
                console.error(err);
                setError("Failed to fetch partners");
            })
            .finally(() => setLoading(false));
    }, []);

    const filtered = partners.filter(
        (p) =>
            (p.name.includes(search) || p.email.includes(search) || p.phone.includes(search)) &&
            (filterStatus === "all" || p.status === filterStatus)
    );

    const activate = async (id: number) => {
        try {
            const updated = await adminService.activatePartner(id);
            setPartners((p) => p.map((r) => (r.id === id ? updated : r)));
            if (selected?.id === id) setSelected(updated);
        } catch (err) {
            console.error("Failed to activate partner", err);
            setError("Failed to activate partner");
        }
    };
    const deactivate = async (id: number) => {
        try {
            const updated = await adminService.deactivatePartner(id);
            setPartners((p) => p.map((r) => (r.id === id ? updated : r)));
            if (selected?.id === id) setSelected(updated);
        } catch (err) {
            console.error("Failed to deactivate partner", err);
            setError("Failed to deactivate partner");
        }
    };
    const remove = async (id: number) => {
        try {
            await adminService.deletePartner(id);
            setPartners((p) => p.filter((r) => r.id !== id));
            if (selected?.id === id) setSelected(null);
        } catch (err) {
            console.error("Failed to delete partner", err);
            setError("Failed to delete partner");
        }
    };

    const totalRevenue = partners.reduce((sum, p) => sum + (p.revenue ?? 0), 0);
    const totalOrders = partners.reduce((sum, p) => sum + p.orders, 0);

    return (
        <div className="flex-1 p-8 h-screen overflow-y-auto ml-64 bg-[#fffbf5]">
            <div className="mb-6">
                <h1 className="text-2xl font-black text-gray-900">จัดการร้านค้าพาร์ทเนอร์</h1>
                <p className="text-gray-400 text-sm mt-1">พาร์ทเนอร์ทั้งหมด {partners.length} ร้าน</p>
            </div>

            {loading ? (
                <>
                    {/* Stat Cards Skeleton */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                        {[...Array(4)].map((_, i) => (
                            <AdminStatCardSkeleton key={i} />
                        ))}
                    </div>

                    {/* Filter Bar Skeleton */}
                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-50 mb-5">
                        <div className="h-10 bg-gray-50 rounded-2xl w-full" />
                    </div>

                    {/* Partner Cards Skeleton */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                        {[...Array(8)].map((_, i) => (
                            <PartnerCardSkeleton key={i} />
                        ))}
                    </div>
                </>
            ) : (
                <>
                    {error && <p className="text-xs text-red-500 mb-4">{error}</p>}

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                        {[
                            {
                                label: "ร้านค้าทั้งหมด",
                                value: partners.length,
                                icon: <Store className="w-5 h-5" />,
                                bg: "bg-white",
                            },
                            {
                                label: "รายรับรวม",
                                value: `฿${totalRevenue.toLocaleString()}`,
                                icon: <DollarSign className="w-5 h-5" />,
                                bg: "bg-[#fff8e1]",
                            },
                            {
                                label: "ออเดอร์รวม",
                                value: totalOrders,
                                icon: <ShoppingBag className="w-5 h-5" />,
                                bg: "bg-white",
                            },
                            {
                                label: "ปิดใช้งาน",
                                value: partners.filter((p) => p.status === "inactive").length,
                                icon: <BarChart2 className="w-5 h-5" />,
                                bg: "bg-yellow-50",
                            },
                        ].map((s, i) => (
                            <div key={i} className={`${s.bg} rounded-2xl p-4 border border-gray-50 shadow-sm`}>
                                <div className="flex items-center gap-2 mb-2 text-[#c9a800]">{s.icon}</div>
                                <p className="text-xl font-black text-gray-900">{s.value}</p>
                                <p className="text-xs text-gray-400 font-medium mt-0.5">{s.label}</p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-50 mb-5">
                        <div className="flex flex-wrap gap-3">
                            <div className="flex items-center gap-2 border border-gray-200 rounded-2xl px-4 py-2.5 flex-1 min-w-48">
                                <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="ค้นหาร้านค้า เจ้าของ อีเมล..."
                                    className="text-sm outline-none w-full"
                                />
                            </div>
                            <div className="flex items-center gap-2 border border-gray-200 rounded-2xl px-4 py-2.5">
                                <Filter className="w-4 h-4 text-gray-400" />
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="text-sm outline-none bg-transparent"
                                >
                                    <option value="all">สถานะทั้งหมด</option>
                                    <option value="active">ใช้งานอยู่</option>
                                    <option value="inactive">ปิดใช้งาน</option>
                                </select>
                                <ChevronDown className="w-3 h-3 text-gray-400" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                        {filtered.map((p) => (
                            <div
                                key={p.id}
                                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-50 hover:shadow-md transition-shadow"
                            >
                                <div className="relative h-32 overflow-hidden">
                                    <img src={p.banner} alt={p.name} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                                        <img
                                            src={p.img}
                                            alt={p.name}
                                            className="w-10 h-10 rounded-2xl object-cover border-2 border-white shadow"
                                        />
                                        <div>
                                            <p className="text-white font-black text-sm leading-tight">{p.name}</p>
                                            <p className="text-white/70 text-[10px]">{p.category}</p>
                                        </div>
                                    </div>
                                    <div className="absolute top-3 right-3">
                                        <span
                                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusConfig[p.status].color}`}
                                        >
                                            {statusConfig[p.status].label}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-4">
                                    <div className="space-y-1 mb-3">
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                            <Mail className="w-3 h-3 text-gray-300" />
                                            {p.email}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                            <Phone className="w-3 h-3 text-gray-300" />
                                            {p.phone}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                            <MapPin className="w-3 h-3 text-gray-300" />
                                            {p.address}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 bg-[#fffdf0] rounded-2xl p-3 mb-4">
                                        <div className="text-center">
                                            <div className="flex items-center justify-center gap-0.5 text-[#c9a800]">
                                                <Star className="w-3 h-3 fill-current" />
                                                <span className="text-sm font-black text-gray-900">{p.rating ?? "-"}</span>
                                            </div>
                                            <p className="text-[10px] text-gray-400">เรตติ้ง</p>
                                        </div>
                                        <div className="text-center border-x border-yellow-100">
                                            <p className="text-sm font-black text-gray-900">{p.menu}</p>
                                            <p className="text-[10px] text-gray-400">เมนู</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-black text-gray-900">{p.orders}</p>
                                            <p className="text-[10px] text-gray-400">ออเดอร์</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mb-3 px-1">
                                        <span className="text-xs text-gray-400">รายรับ</span>
                                        <span className="text-sm font-black text-gray-900">
                                            {p.revenue != null ? `THB ${p.revenue.toLocaleString()}` : "-"}
                                        </span>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setSelected(p)}
                                            className="flex-1 flex items-center justify-center gap-1 py-2 rounded-2xl bg-[#fff3cc] hover:bg-[#ffd980] text-[#7a5c00] text-xs font-bold transition-colors"
                                        >
                                            <Eye className="w-3.5 h-3.5" /> ดู
                                        </button>
                                        {p.status === "active" && (
                                            <button
                                                onClick={() => deactivate(p.id)}
                                                className="flex-1 flex items-center justify-center gap-1 py-2 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-colors"
                                            >
                                                <XCircle className="w-3.5 h-3.5" /> ปิดใช้งาน
                                            </button>
                                        )}
                                        {p.status === "inactive" && (
                                            <button
                                                onClick={() => activate(p.id)}
                                                className="flex-1 flex items-center justify-center gap-1 py-2 rounded-2xl bg-[#ffd980] hover:bg-[#f5c518] text-[#7a5c00] text-xs font-bold transition-colors"
                                            >
                                                <Store className="w-3.5 h-3.5" /> เปิดใช้งาน
                                            </button>
                                        )}
                                        <button
                                            onClick={() => remove(p.id)}
                                            className="p-2 rounded-2xl bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {filtered.length === 0 && (
                            <div className="col-span-full text-center py-16 text-gray-400">ไม่พบร้านค้าที่ค้นหา</div>
                        )}
                    </div>
                </>
            )}

            {selected && (() => {
                const s = selected;
                return (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl overflow-hidden">
                            <div className="relative h-40">
                                <img src={s.banner} alt={s.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40" />
                                <button
                                    onClick={() => setSelected(null)}
                                    className="absolute top-3 right-3 p-1.5 bg-white/20 hover:bg-white/40 rounded-xl backdrop-blur-sm transition-colors"
                                >
                                    <X className="w-5 h-5 text-white" />
                                </button>
                                <div className="absolute bottom-3 left-4 flex items-center gap-3">
                                    <img
                                        src={s.img}
                                        alt={s.name}
                                        className="w-12 h-12 rounded-2xl object-cover border-2 border-white"
                                    />
                                    <div>
                                        <p className="text-white font-black leading-tight">{s.name}</p>
                                        <p className="text-white/70 text-xs">{s.owner}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-5">
                                <div className="grid grid-cols-3 gap-3 bg-[#fffdf0] rounded-2xl p-3 mb-4 text-center">
                                    <div>
                                        <p className="font-black text-gray-900">{s.menu}</p>
                                        <p className="text-[10px] text-gray-400">เมนู</p>
                                    </div>
                                    <div>
                                        <p className="font-black text-gray-900">{s.orders}</p>
                                        <p className="text-[10px] text-gray-400">ออเดอร์</p>
                                    </div>
                                    <div>
                                        <p className="font-black text-gray-900 text-sm">
                                            {s.revenue != null ? `THB ${(s.revenue / 1000).toFixed(1)}K` : "-"}
                                        </p>
                                        <p className="text-[10px] text-gray-400">รายรับ</p>
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm mb-4">
                                    {[
                                        ["อีเมล", s.email],
                                        ["เบอร์โทร", s.phone],
                                        ["ที่อยู่", s.address],
                                        ["หมวดหมู่", s.category],
                                        ["ค่าคอม", `${s.commission}%`],
                                        ["เข้าร่วม", s.joined],
                                    ].map(([k, v]) => (
                                        <div key={k} className="flex justify-between">
                                            <span className="text-gray-400">{k}</span>
                                            <span className="font-bold text-gray-800 text-right max-w-[60%]">{v}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    {s.status === "active" && (
                                        <button
                                            onClick={() => deactivate(s.id)}
                                            className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2.5 rounded-2xl text-sm"
                                        >
                                            ปิดใช้งาน
                                        </button>
                                    )}
                                    {s.status === "inactive" && (
                                        <button
                                            onClick={() => activate(s.id)}
                                            className="flex-1 bg-[#ffd980] hover:bg-[#f5c518] text-[#7a5c00] font-bold py-2.5 rounded-2xl text-sm"
                                        >
                                            เปิดใช้งาน
                                        </button>
                                    )}
                                    <button
                                        onClick={() => remove(s.id)}
                                        className="px-4 py-2.5 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm"
                                    >
                                        ลบ
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
}
