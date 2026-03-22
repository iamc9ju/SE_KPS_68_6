"use client";
import React, { useState } from "react";
import {
    Search, CheckCircle, XCircle, Store, Filter,
    Star, ShoppingBag, ChevronDown, X, Eye,
    Phone, Mail, MapPin, DollarSign, Trash2, BarChart2
} from "lucide-react";

const partnersData = [
    {
        id: "P001", name: "ร้านแพรทองทาน(เยอะ)", owner: "คุณมานีมีทอง", email: "sunshine@food.com", phone: "084-567-8901",
        address: "123 ถ.สุขุมวิท กทม.", status: "active", menu: 45, orders: 312, revenue: 58400,
        commission: 15, joined: "10 ม.ค. 2569", rating: 4.8, category: "อาหารสุขภาพ",
        img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=120&h=120&fit=crop",
        banner: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=200&fit=crop",
    },
    {
        id: "P002", name: "ร้านกรีนโบวล์", owner: "คุณวนิดา สีเขียว", email: "greenbowl@food.com", phone: "085-678-9012",
        address: "456 ถ.พระราม 4 กทม.", status: "active", menu: 30, orders: 185, revenue: 32700,
        commission: 15, joined: "15 ม.ค. 2569", rating: 4.6, category: "Clean Food",
        img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=120&h=120&fit=crop",
        banner: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=200&fit=crop",
    },
    {
        id: "P003", name: "ร้านเฮลตี้ไลฟ์", owner: "คุณชาญ สุขภาพดี", email: "healthy@food.com", phone: "086-789-0123",
        address: "789 ถ.ลาดพร้าว กทม.", status: "pending", menu: 22, orders: 40, revenue: 8200,
        commission: 15, joined: "5 มี.ค. 2569", rating: 4.2, category: "Keto & Low Carb",
        img: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=120&h=120&fit=crop",
        banner: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=200&fit=crop",
    },
    {
        id: "P004", name: "ร้านอร่อยดี", owner: "คุณสุชาติ อร่อย", email: "aroi@food.com", phone: "087-890-1234",
        address: "321 ถ.รัชดา กทม.", status: "suspended", menu: 18, orders: 12, revenue: 2100,
        commission: 15, joined: "20 ก.พ. 2569", rating: 3.9, category: "อาหารทั่วไป",
        img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=120&h=120&fit=crop",
        banner: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=200&fit=crop",
    },
    {
        id: "P005", name: "ร้านสลัดสด", owner: "คุณวรรณา มีสุข", email: "salad@food.com", phone: "088-901-2345",
        address: "654 ถ.เพชรบุรี กทม.", status: "active", menu: 15, orders: 98, revenue: 18600,
        commission: 12, joined: "1 มี.ค. 2569", rating: 4.7, category: "Salad & Wrap",
        img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=120&h=120&fit=crop",
        banner: "https://images.unsplash.com/photo-1544025162-d76538b2a681?w=400&h=200&fit=crop",
    },
];

const statusConfig: Record<string, { label: string; color: string }> = {
    active: { label: "ใช้งาน", color: "bg-green-100 text-green-700" },
    pending: { label: "รอตรวจสอบ", color: "bg-yellow-100 text-yellow-700" },
    suspended: { label: "ระงับ", color: "bg-red-100 text-red-600" },
};

export default function PartnersPage() {
    const [partners, setPartners] = useState(partnersData);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [selected, setSelected] = useState<typeof partnersData[0] | null>(null);

    const filtered = partners.filter(p =>
        (p.name.includes(search) || p.owner.includes(search) || p.email.includes(search)) &&
        (filterStatus === "all" || p.status === filterStatus)
    );

    const approve = (id: string) => { setPartners(p => p.map(r => r.id === id ? { ...r, status: "active" } : r)); setSelected(null); };
    const suspend = (id: string) => { setPartners(p => p.map(r => r.id === id ? { ...r, status: "suspended" } : r)); setSelected(null); };
    const remove = (id: string) => { setPartners(p => p.filter(r => r.id !== id)); setSelected(null); };

    const totalRevenue = partners.reduce((sum, p) => sum + p.revenue, 0);
    const totalOrders = partners.reduce((sum, p) => sum + p.orders, 0);

    return (
        <div className="p-8 min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-black text-gray-900">จัดการร้านค้าพาร์ทเนอร์</h1>
                <p className="text-gray-400 text-sm mt-1">พาร์ทเนอร์ทั้งหมด {partners.length} ร้าน</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                {[
                    { label: "ร้านค้าทั้งหมด", value: partners.length, icon: <Store className="w-5 h-5" />, bg: "bg-white" },
                    { label: "รายรับรวม", value: `฿${totalRevenue.toLocaleString()}`, icon: <DollarSign className="w-5 h-5" />, bg: "bg-[#fff8e1]" },
                    { label: "ออเดอร์รวม", value: totalOrders, icon: <ShoppingBag className="w-5 h-5" />, bg: "bg-white" },
                    { label: "รอตรวจสอบ", value: partners.filter(p => p.status === "pending").length, icon: <BarChart2 className="w-5 h-5" />, bg: "bg-yellow-50" },
                ].map((s, i) => (
                    <div key={i} className={`${s.bg} rounded-2xl p-4 border border-gray-50 shadow-sm`}>
                        <div className="flex items-center gap-2 mb-2 text-[#c9a800]">{s.icon}</div>
                        <p className="text-xl font-black text-gray-900">{s.value}</p>
                        <p className="text-xs text-gray-400 font-medium mt-0.5">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-50 mb-5">
                <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 border border-gray-200 rounded-2xl px-4 py-2.5 flex-1 min-w-48">
                        <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="ค้นหาร้านค้า เจ้าของ อีเมล..." className="text-sm outline-none w-full" />
                    </div>
                    <div className="flex items-center gap-2 border border-gray-200 rounded-2xl px-4 py-2.5">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="text-sm outline-none bg-transparent">
                            <option value="all">สถานะทั้งหมด</option>
                            <option value="active">ใช้งาน</option>
                            <option value="pending">รอตรวจสอบ</option>
                            <option value="suspended">ระงับ</option>
                        </select>
                        <ChevronDown className="w-3 h-3 text-gray-400" />
                    </div>
                </div>
            </div>

            {/* Partner Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map(p => (
                    <div key={p.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-50 hover:shadow-md transition-shadow">
                        {/* Banner */}
                        <div className="relative h-32 overflow-hidden">
                            <img src={p.banner} alt={p.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                            <div className="absolute bottom-3 left-3 flex items-center gap-2">
                                <img src={p.img} alt={p.name} className="w-10 h-10 rounded-2xl object-cover border-2 border-white shadow" />
                                <div>
                                    <p className="text-white font-black text-sm leading-tight">{p.name}</p>
                                    <p className="text-white/70 text-[10px]">{p.category}</p>
                                </div>
                            </div>
                            <div className="absolute top-3 right-3">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusConfig[p.status].color}`}>{statusConfig[p.status].label}</span>
                            </div>
                        </div>

                        <div className="p-4">
                            {/* Info */}
                            <div className="space-y-1 mb-3">
                                <div className="flex items-center gap-1.5 text-xs text-gray-500"><Mail className="w-3 h-3 text-gray-300" />{p.email}</div>
                                <div className="flex items-center gap-1.5 text-xs text-gray-500"><Phone className="w-3 h-3 text-gray-300" />{p.phone}</div>
                                <div className="flex items-center gap-1.5 text-xs text-gray-500"><MapPin className="w-3 h-3 text-gray-300" />{p.address}</div>
                            </div>

                            {/* Stats row */}
                            <div className="grid grid-cols-3 gap-2 bg-[#fffdf0] rounded-2xl p-3 mb-4">
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-0.5 text-[#c9a800]">
                                        <Star className="w-3 h-3 fill-current" />
                                        <span className="text-sm font-black text-gray-900">{p.rating}</span>
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
                                <span className="text-sm font-black text-gray-900">฿{p.revenue.toLocaleString()}</span>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <button onClick={() => setSelected(p)} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-2xl bg-[#fff3cc] hover:bg-[#ffd980] text-[#7a5c00] text-xs font-bold transition-colors">
                                    <Eye className="w-3.5 h-3.5" /> ดูข้อมูล
                                </button>
                                {p.status === "pending" && (
                                    <button onClick={() => approve(p.id)} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-2xl bg-green-50 hover:bg-green-100 text-green-700 text-xs font-bold transition-colors">
                                        <CheckCircle className="w-3.5 h-3.5" /> อนุมัติ
                                    </button>
                                )}
                                {p.status === "active" && (
                                    <button onClick={() => suspend(p.id)} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-colors">
                                        <XCircle className="w-3.5 h-3.5" /> ระงับ
                                    </button>
                                )}
                                {p.status === "suspended" && (
                                    <button onClick={() => approve(p.id)} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-2xl bg-[#ffd980] hover:bg-[#f5c518] text-[#7a5c00] text-xs font-bold transition-colors">
                                        <Store className="w-3.5 h-3.5" /> เปิดใช้
                                    </button>
                                )}
                                <button onClick={() => remove(p.id)} className="p-2 rounded-2xl bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {filtered.length === 0 && <div className="col-span-3 text-center py-16 text-gray-400">ไม่พบร้านค้าที่ค้นหา</div>}
            </div>

            {/* Detail Modal */}
            {selected && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl overflow-hidden">
                        <div className="relative h-40">
                            <img src={selected.banner} alt={selected.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40" />
                            <button onClick={() => setSelected(null)} className="absolute top-3 right-3 p-1.5 bg-white/20 hover:bg-white/40 rounded-xl backdrop-blur-sm transition-colors">
                                <X className="w-5 h-5 text-white" />
                            </button>
                            <div className="absolute bottom-3 left-4 flex items-center gap-3">
                                <img src={selected.img} alt={selected.name} className="w-12 h-12 rounded-2xl object-cover border-2 border-white" />
                                <div>
                                    <p className="text-white font-black leading-tight">{selected.name}</p>
                                    <p className="text-white/70 text-xs">{selected.owner}</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="grid grid-cols-3 gap-3 bg-[#fffdf0] rounded-2xl p-3 mb-4 text-center">
                                <div><p className="font-black text-gray-900">{selected.menu}</p><p className="text-[10px] text-gray-400">เมนู</p></div>
                                <div><p className="font-black text-gray-900">{selected.orders}</p><p className="text-[10px] text-gray-400">ออเดอร์</p></div>
                                <div><p className="font-black text-gray-900 text-sm">฿{(selected.revenue / 1000).toFixed(1)}K</p><p className="text-[10px] text-gray-400">รายรับ</p></div>
                            </div>
                            <div className="space-y-2 text-sm mb-4">
                                {[["อีเมล", selected.email], ["เบอร์โทร", selected.phone], ["ที่อยู่", selected.address], ["หมวดหมู่", selected.category], ["ค่าคอม", `${selected.commission}%`], ["เข้าร่วม", selected.joined]].map(([k, v]) => (
                                    <div key={k} className="flex justify-between">
                                        <span className="text-gray-400">{k}</span>
                                        <span className="font-bold text-gray-800 text-right max-w-[60%]">{v}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                {selected.status === "pending" && <button onClick={() => approve(selected.id)} className="flex-1 bg-[#ffd980] hover:bg-[#f5c518] text-[#7a5c00] font-bold py-2.5 rounded-2xl text-sm">✓ อนุมัติ</button>}
                                {selected.status === "active" && <button onClick={() => suspend(selected.id)} className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2.5 rounded-2xl text-sm">ระงับร้านค้า</button>}
                                {selected.status === "suspended" && <button onClick={() => approve(selected.id)} className="flex-1 bg-[#ffd980] hover:bg-[#f5c518] text-[#7a5c00] font-bold py-2.5 rounded-2xl text-sm">เปิดใช้งาน</button>}
                                <button onClick={() => remove(selected.id)} className="px-4 py-2.5 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm">ลบ</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
