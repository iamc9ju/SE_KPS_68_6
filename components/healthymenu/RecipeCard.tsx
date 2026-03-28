"use client";

import React from "react";
import { Heart, Eye, Flame, Timer, BarChart, Plus, MoreVertical } from "lucide-react";
import { MenuItem as StoreMenuItem } from "@/store/cart-store";

export type RecipeCardProps = {
    item: StoreMenuItem & {
        restaurantName?: string;
        prepTime?: string;
        difficulty?: "Easy" | "Medium" | "Hard";
        likes?: string;
        views?: string;
        isNew?: boolean;
    };
    onAdd?: (item: any) => void;
};

const RecipeCard: React.FC<RecipeCardProps> = ({ item, onAdd }) => {
    const FALLBACK_FOOD_IMAGE = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80";

    // Randomize some metadata if not provided to make the UI look rich as in the screenshot
    const prepTime = item.prepTime || "15min";
    const difficulty = item.difficulty || (item.price > 200 ? "Hard" : item.price > 100 ? "Medium" : "Easy");
    const likes = item.likes || "1.2k";
    const views = item.views || "156k";

    const difficultyColor = {
        Easy: "text-emerald-500 bg-emerald-50",
        Medium: "text-amber-500 bg-amber-50",
        Hard: "text-rose-500 bg-rose-50",
    }[difficulty];

    return (
        <div className="group bg-white rounded-[40px] p-5 hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] transition-all duration-500 flex flex-col h-full relative border border-gray-50/50 hover:-translate-y-2">
            {/* Header / New Badge */}
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex flex-col gap-1">
                   <div className="flex items-center gap-2">
                        <h3 className="text-lg font-black text-[#1a1a1a] line-clamp-1 group-hover:text-[#6366f1] transition-colors">
                            {item.name}
                        </h3>
                        {item.isNew !== false && (
                            <span className="px-2 py-0.5 bg-rose-50 text-rose-500 text-[10px] font-black rounded-lg uppercase tracking-wider border border-rose-100/50">
                                New
                            </span>
                        )}
                   </div>
                    <p className="text-[11px] text-gray-400 font-bold line-clamp-2 leading-relaxed mt-1">
                        {item.description || "Learn how to make the best healthy meal with fresh ingredients in just a few minutes!"}
                    </p>
                </div>
                <button className="text-gray-300 hover:text-gray-600 transition-colors p-1">
                    <MoreVertical size={18} />
                </button>
            </div>

            {/* Tags Row */}
            <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1.5 bg-gray-50 text-gray-500 text-[11px] font-black rounded-xl border border-gray-100/50">
                    {item.category || "Main"}
                </span>
                <span className="px-3 py-1.5 bg-gray-50 text-gray-500 text-[11px] font-black rounded-xl border border-gray-100/50 flex items-center gap-1.5">
                    <Flame size={12} className="text-orange-400" />
                    {item.caloriesKcal || 250}kcal
                </span>
                <span className="px-3 py-1.5 bg-gray-50 text-gray-500 text-[11px] font-black rounded-xl border border-gray-100/50 flex items-center gap-1.5">
                    <Timer size={12} className="text-blue-400" />
                    {prepTime}
                </span>
            </div>

            {/* Difficulty Badge */}
            <div className="mb-5">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black ${difficultyColor}`}>
                    <BarChart size={12} />
                    {difficulty}
                </span>
            </div>

            {/* Image Container */}
            <div className="relative aspect-[4/3] rounded-[32px] overflow-hidden mb-5 bg-gray-50 shadow-inner">
                <img
                    src={item.imageUrl || FALLBACK_FOOD_IMAGE}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = FALLBACK_FOOD_IMAGE;
                    }}
                />
                
                {/* Stats Overlay */}
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                     <div className="flex gap-2">
                        <div className="bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-[10px] font-black text-gray-600 shadow-sm">
                            <Heart size={10} className="text-rose-500 fill-rose-500" />
                            {likes}
                        </div>
                        <div className="bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-[10px] font-black text-gray-600 shadow-sm">
                            <Eye size={10} className="text-blue-500" />
                            {views}
                        </div>
                     </div>
                </div>

                {/* Video Icon placeholder */}
                <div className="absolute top-3 right-3 bg-black/20 backdrop-blur-sm p-1.5 rounded-lg text-white">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21.53 10C20.69 10 20 10.69 20 11.53V15.47C20 16.31 20.69 17 21.53 17C22.37 17 23.06 16.31 23.06 15.47V11.53C23.06 10.69 22.37 10 21.53 10ZM19 19H5C2.79 19 1 17.21 1 15V9C1 6.79 2.79 5 5 5H19C19.55 5 20 5.45 20 6V18C20 18.55 19.55 19 19 19Z" />
                    </svg>
                </div>
            </div>

            {/* Bottom Section - Price & Add Button */}
            <div className="flex items-center justify-between mt-auto">
                <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Price</p>
                    <p className="text-2xl font-black text-[#1a1a1a]">
                        <span className="text-[14px] align-top mt-1 inline-block mr-0.5">฿</span>
                        {item.price}
                    </p>
                </div>
                
                <button 
                    onClick={() => onAdd?.(item)}
                    className="w-12 h-12 rounded-2xl bg-[#6366f1] text-white flex items-center justify-center hover:bg-[#4f46e5] hover:scale-110 active:scale-95 transition-all shadow-lg shadow-indigo-200"
                >
                    <Plus size={24} strokeWidth={3} />
                </button>
            </div>
        </div>
    );
};

export default RecipeCard;
