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

export function AdminStatCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl p-4 text-center border border-gray-50 shadow-sm">
            <Skeleton className="w-10 h-8 mx-auto mb-1 rounded-lg" />
            <Skeleton className="w-16 h-3 mx-auto rounded-md" />
        </div>
    );
}

export function UserCardSkeleton() {
    return (
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-50">
            <div className="flex items-start gap-4 mb-4">
                <Skeleton className="w-14 h-14 rounded-2xl flex-shrink-0" />
                <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                        <Skeleton className="w-24 h-4 rounded-md" />
                        <Skeleton className="w-12 h-3 rounded-full" />
                    </div>
                    <Skeleton className="w-16 h-3 rounded-full" />
                </div>
            </div>
            <div className="space-y-2 mb-4">
                <Skeleton className="w-full h-3 rounded-md" />
                <Skeleton className="w-2/3 h-3 rounded-md" />
                <Skeleton className="w-3/4 h-3 rounded-md" />
            </div>
            <div className="flex gap-3 mb-4 bg-gray-50 rounded-2xl p-3">
                <Skeleton className="flex-1 h-8 rounded-lg" />
                <Skeleton className="flex-1 h-8 rounded-lg" />
                <Skeleton className="flex-1 h-8 rounded-lg" />
            </div>
            <div className="flex gap-2">
                <Skeleton className="flex-1 h-9 rounded-2xl" />
                <Skeleton className="flex-1 h-9 rounded-2xl" />
                <Skeleton className="w-9 h-9 rounded-2xl" />
            </div>
        </div>
    );
}

export function NutritionistCardSkeleton() {
    return (
        <div className="p-6 rounded-3xl border border-gray-50 bg-white">
            <div className="flex items-center gap-4">
                <Skeleton className="w-14 h-14 rounded-2xl shrink-0" />
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                        <Skeleton className="w-1/3 h-5 rounded-md" />
                        <Skeleton className="w-20 h-5 rounded-full" />
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="w-16 h-4 rounded-full" />
                        <Skeleton className="w-24 h-4 rounded-md" />
                    </div>
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-50 flex gap-2">
                <Skeleton className="flex-1 h-8 rounded-xl" />
                <Skeleton className="flex-1 h-8 rounded-xl" />
            </div>
        </div>
    );
}

export function NutritionistDetailSkeleton() {
    return (
        <div className="flex-1 rounded-3xl border border-gray-50 bg-white flex flex-col overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex flex-col items-center">
                <Skeleton className="w-12 h-12 rounded-2xl mb-4" />
                <Skeleton className="w-1/2 h-8 rounded-lg mb-3" />
                <div className="flex flex-col items-center gap-2">
                    <Skeleton className="w-20 h-5 rounded-full" />
                    <Skeleton className="w-32 h-4 rounded-md" />
                </div>
            </div>
            <div className="p-6 space-y-6">
                <div className="space-y-3">
                    <Skeleton className="w-1/4 h-3 rounded" />
                    <Skeleton className="w-full h-12 rounded-xl" />
                    <Skeleton className="w-full h-12 rounded-xl" />
                    <Skeleton className="w-full h-12 rounded-xl" />
                </div>
                <div className="space-y-3">
                    <Skeleton className="w-1/4 h-3 rounded" />
                    <Skeleton className="w-full h-20 rounded-xl" />
                </div>
            </div>
            <div className="p-6 border-t border-gray-50 flex gap-4">
                <Skeleton className="flex-1 h-12 rounded-2xl" />
                <Skeleton className="flex-1 h-12 rounded-2xl" />
            </div>
        </div>
    );
}

export function PartnerCardSkeleton() {
    return (
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-50">
            <div className="relative h-32 bg-gray-50 flex items-center justify-center">
                <Skeleton className="w-full h-full" />
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <Skeleton className="w-10 h-10 rounded-2xl border-2 border-white" />
                    <div className="space-y-1">
                        <Skeleton className="w-20 h-3 rounded-md" />
                        <Skeleton className="w-12 h-2 rounded-md" />
                    </div>
                </div>
            </div>
            <div className="p-4">
                <div className="space-y-2 mb-4">
                    <Skeleton className="w-full h-3 rounded-md" />
                    <Skeleton className="w-2/3 h-3 rounded-md" />
                    <Skeleton className="w-3/4 h-3 rounded-md" />
                </div>
                <div className="grid grid-cols-3 gap-2 bg-gray-50 rounded-2xl p-3 mb-4">
                    <Skeleton className="h-8 rounded-lg" />
                    <Skeleton className="h-8 rounded-lg" />
                    <Skeleton className="h-8 rounded-lg" />
                </div>
                <div className="flex justify-between mb-3 px-1">
                    <Skeleton className="w-10 h-3" />
                    <Skeleton className="w-20 h-4" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="flex-1 h-9 rounded-2xl" />
                    <Skeleton className="flex-1 h-9 rounded-2xl" />
                    <Skeleton className="w-9 h-9 rounded-2xl" />
                </div>
            </div>
        </div>
    );
}
