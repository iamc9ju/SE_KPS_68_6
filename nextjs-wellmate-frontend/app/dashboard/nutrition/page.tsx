"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Search, ChevronDown, Loader2 } from "lucide-react";
import NutritionistCard from "@/components/dashboard/NutritionistCard";
import NutritionistCardSkeleton from "@/components/dashboard/NutritionistCardSkeleton";
import NotificationDropdown from "@/components/notifications/NotificationDropdown";
import ImageUpload from "@/components/common/ImageUpload";
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
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchNutritionists = useCallback(async () => {
        setLoading(true);
        try {
            const params: NutritionistQueryParams = {
                page,
                limit: 8,
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
        <div className="flex-1 flex flex-col min-h-screen bg-[#FDF9F3]">
            <main className="flex-1 overflow-y-auto px-6 py-4 sm:px-8 sm:py-6 z-10 custom-scrollbar ml-64">
                <div className="max-w-[1500px] mx-auto">
                    {/* Top Global Header with Search and Profile */}
                    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 animate-fadeIn">

                        {/* Search Bar - Left Side */}
                        <div className="relative w-full sm:max-w-[400px] md:max-w-[500px]">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-[20px] h-[20px] text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by name..."
                                className="w-full pl-[56px] pr-6 py-[14px] rounded-[30px] border-[2px] border-[#F4D9C7] hover:border-[#FF6A2C] focus:border-[#FF6A2C] shadow-sm bg-white text-[15px] text-[#111111] placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-[#FF6A2C]/10 transition-all font-medium"
                            />
                        </div>

                        {/* User Profile & Actions - Right Side */}
                        <div className="flex items-center gap-4 self-end sm:self-auto">
                            {/* Notification Button */}
                            <div className="w-[46px] h-[46px] rounded-full bg-white flex items-center justify-center shadow-sm relative cursor-pointer">
                                <NotificationDropdown />
                            </div>

                            {/* User Profile */}
                            <div className="flex items-center gap-3 ml-2 bg-white/50 pl-2 pr-4 py-1.5 rounded-2xl hover:bg-white hover:shadow-sm transition-all">
                                <ImageUpload sizeClasses="w-11 h-11" />
                                <div className="hidden sm:block cursor-pointer">
                                    <p className="text-[15px] font-medium text-[#111111] leading-tight">
                                        {user?.firstName || "User"} {user?.lastName || ""}
                                    </p>
                                    <p className="text-[11px] text-gray-500 font-medium tracking-wide">
                                        Member
                                    </p>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Main White Canvas Container */}
                    <div className="bg-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] min-h-[60vh] flex flex-col">

                        {/* Top Filters Row (Pills & Sort) */}
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">

                            {/* Specialty Pills */}
                            <div className="flex flex-wrap items-center gap-3 flex-1">
                                {SPECIALTIES.map((spec) => (
                                    <button
                                        key={spec}
                                        onClick={() => setSelectedSpecialty(spec)}
                                        className={`px-[22px] py-[10px] rounded-[20px] text-[15px] transition-all duration-200 border ${selectedSpecialty === spec
                                            ? "bg-transparent text-[#111111] font-medium border-gray-400"
                                            : "bg-transparent text-gray-600 font-medium border-gray-200 hover:border-gray-300"
                                            }`}
                                    >
                                        {spec}
                                    </button>
                                ))}
                            </div>

                            {/* Sort Dropdown */}
                            <div className="relative flex-shrink-0">
                                <button
                                    onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                                    className="flex items-center gap-2 px-[22px] py-[10px] rounded-[20px] text-[15px] font-medium text-[#111111] bg-transparent border border-gray-200 hover:border-gray-300 transition-all"
                                >
                                    <svg className="w-[18px] h-[18px] text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="4" y1="6" x2="20" y2="6"></line>
                                        <line x1="4" y1="12" x2="14" y2="12"></line>
                                        <line x1="4" y1="18" x2="8" y2="18"></line>
                                    </svg>
                                    Sort By : {currentSortLabel}
                                    <ChevronDown className={`w-[18px] h-[18px] text-gray-400 transition-transform ${sortDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {sortDropdownOpen && (
                                    <div className="absolute right-0 top-[110%] w-[220px] bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100 z-50 overflow-hidden animate-fadeIn py-1">
                                        {SORT_OPTIONS.map((option) => (
                                            <button
                                                key={option.value}
                                                onClick={() => {
                                                    setSortBy(option.value);
                                                    setSortDropdownOpen(false);
                                                }}
                                                className={`w-full text-left px-5 py-3 text-[14px] font-medium transition-colors ${sortBy === option.value
                                                    ? "bg-[#FDF9F3] text-[#111111]"
                                                    : "text-gray-500 hover:bg-gray-50"
                                                    }`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Grid Result */}
                        {loading ? (
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-5 gap-y-6 animate-fadeIn">
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <NutritionistCardSkeleton key={i} />
                                ))}
                            </div>
                        ) : nutritionists.length === 0 ? (
                            <div className="flex flex-col flex-1 items-center justify-center py-16 text-center animate-fadeIn bg-gray-50/50 rounded-[24px] border border-dashed border-gray-200">
                                <div className="w-[60px] h-[60px] bg-white rounded-full flex items-center justify-center mb-4 shadow-sm text-gray-300">
                                    <Search className="w-[28px] h-[28px]" />
                                </div>
                                <h3 className="text-[18px] font-medium text-[#111111] mb-2">ไม่พบผลลัพธ์</h3>
                                <p className="text-[14px] text-gray-500">ลองเปลี่ยนเงื่อนไขการค้นหาดูนะครับ</p>
                            </div>
                        ) : (
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-5 gap-y-6 animate-slideUp">
                                {nutritionists.map((n) => (
                                    <NutritionistCard key={n.nutritionistId} nutritionist={n} />
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {!loading && totalPages > 1 && (
                            <div className="mt-8 flex justify-center border-t border-gray-100 pt-5">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="px-5 py-2 rounded-full text-[13px] font-medium bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:text-[#111111] shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        ย้อนกลับ
                                    </button>
                                    <span className="text-[13px] font-medium text-[#111111] mx-2">
                                        หน้า {page} จาก {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className="px-5 py-2 rounded-full text-[13px] font-medium bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:text-[#111111] shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        ถัดไป
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </main>
        </div>
    );
}
