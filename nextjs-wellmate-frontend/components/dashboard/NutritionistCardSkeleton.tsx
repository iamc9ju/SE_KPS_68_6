"use client";

import Skeleton from "../ui/Skeleton";

export default function NutritionistCardSkeleton() {
    return (
        <div className="bg-white rounded-3xl border border-[#f0e6cc]/60 overflow-hidden flex flex-col h-full shadow-sm">
            {/* Image Placeholder */}
            <div className="aspect-[4/3] bg-gray-100 relative">
                <Skeleton className="w-full h-full rounded-none" />
            </div>

            <div className="p-4 flex-1 flex flex-col">
                {/* Header */}
                <div className="mb-4">
                    <Skeleton className="w-3/4 h-5 mb-2" />
                    <Skeleton className="w-1/2 h-4" />
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-6">
                    <Skeleton className="w-24 h-4" />
                    <Skeleton className="w-8 h-4" />
                    <Skeleton className="w-16 h-3" />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                    <div>
                        <Skeleton className="w-10 h-3 mb-1" />
                        <Skeleton className="w-16 h-5" />
                    </div>
                    <Skeleton className="w-20 h-9 rounded-xl" />
                </div>
            </div>
        </div>
    );
}
