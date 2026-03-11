"use client";

import Skeleton from "../ui/Skeleton";

export function StatCardSkeleton() {
    return (
        <div className="bg-white p-7 rounded-[35px] shadow-[0_2px_25px_rgba(0,0,0,0.02)] border border-[#f0e6cc] flex flex-col h-full">
            <div className="flex items-center gap-3 mb-4">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <Skeleton className="w-20 h-4" />
            </div>
            <div className="flex items-baseline gap-1 mb-2">
                <Skeleton className="w-16 h-8" />
                <Skeleton className="w-8 h-4" />
            </div>
            <Skeleton className="w-full h-12 mt-4 rounded-xl" />
        </div>
    );
}

export function MacroBlockSkeleton() {
    return (
        <div className="flex items-stretch h-14 w-full">
            <div className="w-36 bg-gray-100/80 rounded-l-xl flex items-center justify-center border-r border-white/50">
                <Skeleton className="w-20 h-6" />
            </div>
            <div className="flex-1 bg-gray-50/50 rounded-r-xl p-3 flex flex-col justify-between">
                <div className="flex justify-between mb-1">
                    <Skeleton className="w-24 h-3" />
                    <Skeleton className="w-8 h-3" />
                </div>
                <Skeleton className="w-full h-2 rounded-full" />
            </div>
        </div>
    );
}

export function MenuCardSkeleton() {
    return (
        <div className="group">
            <div className="relative rounded-[32px] overflow-hidden mb-5 aspect-[4/3]">
                <Skeleton className="w-full h-full" />
            </div>
            <div className="flex gap-4 mb-4 px-1">
                <Skeleton className="w-16 h-4" />
                <Skeleton className="w-16 h-4" />
                <Skeleton className="w-16 h-4" />
            </div>
            <Skeleton className="w-3/4 h-6 mb-2" />
            <Skeleton className="w-full h-10" />
        </div>
    );
}
