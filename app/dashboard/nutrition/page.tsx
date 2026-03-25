"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Search, ChevronDown, Loader2 } from "lucide-react";
import NutritionistCard from "@/components/dashboard/NutritionistCard";
import NotificationDropdown from "@/components/notifications/NotificationDropdown";
import { useAuthStore } from "@/store/auth-store";
import {
    nutritionistApi,
    type Nutritionist,
    type NutritionistQueryParams,
} from "@/services/nutritionists";

const SPECIALTIES = [
    "ทั้งหมด",
    "จัดการน้ำหนัก",
    "โภชนาการกีฬา",
    "โรคเรื้อรัง",
    "สุขภาพแม่และเด็ก",
    "สุขภาพทั่วไป",
    "เสริมสร้างกล้ามเนื้อ",
];

const SPECIALTY_API_MAP: Record<string, string> = {
    "จัดการน้ำหนัก": "Weight Management",
    "โภชนาการกีฬา": "Sports Nutrition",
    "โรคเรื้อรัง": "Chronic Conditions",
    "สุขภาพแม่และเด็ก": "Maternal & Child Health",
    "สุขภาพทั่วไป": "General Wellness",
    "เสริมสร้างกล้ามเนื้อ": "Muscle Gain",
};

const SORT_OPTIONS: { label: string; value: NutritionistQueryParams["sortBy"] | undefined }[] = [
    { label: "คะแนนสูงสุด", value: "highest_rated" },
    { label: "ค่าบริการต่ำสุด", value: "lowest_fee" },
    { label: "รีวิวมากที่สุด", value: "most_reviews" },
];

export default function NutritionPage() {
    const { user } = useAuthStore();

    const [nutritionists, setNutritionists] = useState<Nutritionist[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSpecialty, setSelectedSpecialty] = useState("ทั้งหมด");
    const [sortBy, setSortBy] = useState<NutritionistQueryParams["sortBy"]>("highest_rated");
    const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchOpen, setSearchOpen] = useState(false);
    const [page] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchNutritionists = useCallback(async () => {
        setLoading(true);
        try {
            const params: NutritionistQueryParams = {
                page,
                limit: 12,
                sortBy,
            };

            if (selectedSpecialty !== "ทั้งหมด") {
                params.specialty = SPECIALTY_API_MAP[selectedSpecialty] || selectedSpecialty;
            }

            if (searchQuery.trim()) {
                params.search = searchQuery.trim();
            }

            const response = await nutritionistApi.getNutritionists(params);
            setNutritionists(response.data);
            setTotalPages(response.meta.totalPages);
        } catch (error) {
            console.error("Failed to fetch nutritionists:", error);
            setNutritionists([]);
        } finally {
            setLoading(false);
        }
    }, [page, sortBy, selectedSpecialty, searchQuery]);

    useEffect(() => {
        fetchNutritionists();
    }, [fetchNutritionists]);

    const currentSortLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label || "คะแนนสูงสุด";

    return (
        <div className="flex-1 flex flex-col min-h-screen">
            <main className="flex-1 overflow-y-auto px-8 py-8 z-10 custom-scrollbar ml-64">
                <div className="max-w-[1400px] mx-auto">

                    {}
                    <header className="flex items-center justify-between mb-8 animate-fadeIn">
                        <h1 className="text-3xl font-black text-[#3d3522] tracking-tight">
                            ค้นหานักโภชนาการ
                        </h1>
                        <div className="flex items-center gap-3">
                            {}
                            <button
                                onClick={() => setSearchOpen(!searchOpen)}
                                className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-[#3d3522] hover:bg-[#C6E065]/20 transition-all"
                            >
                                <Search className="w-5 h-5" />
                            </button>
                            <NotificationDropdown />
                            {}
                            <div className="flex items-center gap-3 ml-2">
                                <div className="w-10 h-10 rounded-2xl bg-[#C6E065]/20 flex items-center justify-center text-[#3d3522] font-bold text-sm">
                                    {(user?.firstName?.[0] || "U").toUpperCase()}
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-sm font-bold text-[#3d3522] leading-tight">
                                        {user?.firstName || "User"} {user?.lastName || ""}
                                    </p>
                                    <p className="text-[10px] text-[#8a7550] font-medium">
                                        Member
                                    </p>
                                </div>
                            </div>
                        </div>
                    </header>

                    {}
                    {searchOpen && (
                        <div className="mb-6 animate-fadeIn">
                            <div className="relative max-w-md">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="พิมพ์ชื่อนักโภชนาการ..."
                                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[#f0e6cc] bg-white text-sm text-[#3d3522] placeholder:text-gray-300 focus:outline-none focus:border-[#C6E065] focus:ring-2 focus:ring-[#C6E065]/20 transition-all"
                                    autoFocus
                                />
                            </div>
                        </div>
                    )}

                    {}
                    <div className="flex flex-wrap items-center gap-3 mb-8 animate-slideUp">
                        {}
                        {SPECIALTIES.map((spec) => (
                            <button
                                key={spec}
                                onClick={() => setSelectedSpecialty(spec)}
                                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 border ${selectedSpecialty === spec
                                    ? "bg-[#3d3522] text-white border-[#3d3522] shadow-md"
                                    : "bg-white text-[#3d3522] border-[#e8dcc8] hover:border-[#C6E065] hover:bg-[#C6E065]/5"
                                    }`}
                            >
                                {spec}
                            </button>
                        ))}

                        {}
                        <div className="relative ml-auto">
                            <button
                                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-[#3d3522] bg-white border border-[#e8dcc8] hover:border-[#C6E065] transition-all"
                            >
                                <svg className="w-3.5 h-3.5 text-[#8a7550]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M3 6h18M7 12h10M10 18h4" />
                                </svg>
                                เรียงตาม : {currentSortLabel}
                                <ChevronDown className={`w-3.5 h-3.5 text-[#8a7550] transition-transform ${sortDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {sortDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-fadeIn">
                                    {SORT_OPTIONS.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => {
                                                setSortBy(option.value);
                                                setSortDropdownOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-3 text-xs font-bold transition-colors ${sortBy === option.value
                                                ? "bg-[#C6E065]/10 text-[#3d3522]"
                                                : "text-[#8a7550] hover:bg-gray-50"
                                                }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {}
                    {loading ? (
                        <div className="flex items-center justify-center py-32">
                            <Loader2 className="w-8 h-8 text-[#C6E065] animate-spin" />
                        </div>
                    ) : nutritionists.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-32 text-center animate-fadeIn">
                            <div className="w-20 h-20 bg-[#C6E065]/10 rounded-3xl flex items-center justify-center mb-4">
                                <span className="text-3xl">🔍</span>
                            </div>
                            <h3 className="text-lg font-bold text-[#3d3522] mb-1">ไม่พบนักโภชนาการ</h3>
                            <p className="text-sm text-[#8a7550]">ลองเปลี่ยนตัวกรองหรือคำค้นหาดูนะครับ</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-slideUp">
                            {nutritionists.map((n) => (
                                <NutritionistCard key={n.nutritionistId} nutritionist={n} />
                            ))}
                        </div>
                    )}

                    {}
                    {!loading && nutritionists.length > 0 && totalPages > 1 && (
                        <div className="mt-8 text-center">
                            <p className="text-xs text-[#8a7550] font-medium">
                                หน้า {page} จาก {totalPages}
                            </p>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
}
