"use client";

import { useRouter } from "next/navigation";
import { Star } from "lucide-react";

export interface Nutritionist {
    nutritionistId: string;
    firstName: string;
    lastName: string;
    licenseNumber: string | null;
    consultationFee: number;
    verificationStatus: string;
    avgRating: number;
    totalReviews: number;
    user: {
        email: string;
        profileImageUrl?: string | null;
    };
    nutritionistSpecialties?: {
        specialty: { id: number; name: string };
    }[];
}

function getPhotoForNutritionist(nutritionist: Nutritionist): string {
    // Priority 1: Real uploaded profile image
    if (nutritionist.user?.profileImageUrl) {
        return nutritionist.user.profileImageUrl;
    }
    // Priority 2: Dynamic avatar based on name
    return `https://ui-avatars.com/api/?name=${nutritionist.firstName}&background=random&color=fff&size=500&font-size=0.4`;
}

export default function NutritionistCard({
    nutritionist
}: {
    nutritionist: Nutritionist
}) {
    const router = useRouter();
    const photoUrl = getPhotoForNutritionist(nutritionist);
    const specialties = nutritionist.nutritionistSpecialties?.map((ns) => ns.specialty.name) ?? [];
    const primarySpecialty = specialties.length > 0 ? specialties.join(", ") : "โภชนาการทั่วไป";
    const rating = nutritionist.avgRating ?? 0;

    return (
        <div
            onClick={() =>
                router.push(`/dashboard/nutrition/${nutritionist.nutritionistId}/book`)
            }
            className="group cursor-pointer bg-white rounded-3xl border border-gray-100/80 p-3.5 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-[#F2E6D0] transition-all duration-300 flex flex-col h-full"
        >
<<<<<<< HEAD
            {/* Image Container */}
            <div className="relative overflow-hidden rounded-[20px] mb-4 bg-gray-50 aspect-[4/3]">
=======
            { }
            <div className="aspect-[4/3] bg-gradient-to-br from-[#faf8f2] to-[#f0e6cc]/30 relative overflow-hidden">
                { }
>>>>>>> 97f29b793709bc26138f87259945fab9abb004c1
                <img
                    src={photoUrl}
                    alt={`${nutritionist.firstName} ${nutritionist.lastName}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-out"
                />

                {/* Optional Verification Badge */}
                {nutritionist.verificationStatus === "approved" && (
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm border border-white/20">
                        <svg className="w-3.5 h-3.5 text-[#FF6A2C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                    </div>
                )}
            </div>

<<<<<<< HEAD
            {/* Content Section */}
            <div className="px-1 flex flex-col flex-1">
                {/* Title and Price Row */}
                <div className="flex justify-between items-start gap-2 mb-1.5">
                    <h3 className="font-bold text-[#111111] text-[17px] leading-tight line-clamp-2">
                        {nutritionist.firstName} {nutritionist.lastName}
                    </h3>
                    <span className="font-bold text-[#FF6A2C] text-[17px] whitespace-nowrap">
                        ฿{Number(nutritionist.consultationFee).toLocaleString()}
                    </span>
                </div>

                {/* Specialty */}
                <p className="text-[13px] text-gray-500 font-medium mb-4 line-clamp-1">
                    {primarySpecialty}
                </p>

                {/* Rating & Reviews */}
                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center gap-3">
=======
            { }
            <div className="p-4">
                <h3 className="font-bold text-[#3d3522] text-sm mb-0.5 group-hover:text-[#4A6707] transition-colors leading-tight">
                    {nutritionist.firstName} {nutritionist.lastName}
                </h3>
                <p className="text-xs text-[#8a7550] mb-3 line-clamp-1">
                    {primarySpecialty}
                </p>

                { }
                <div className="flex items-center gap-1.5">
>>>>>>> 97f29b793709bc26138f87259945fab9abb004c1
                    <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={`w-[14px] h-[14px] ${star <= Math.round(rating)
                                    ? "text-[#FFC107] fill-[#FFC107]"
                                    : "text-gray-200 fill-gray-200"
                                    }`}
                            />
                        ))}
                    </div>
                    <div className="flex items-center text-[12px] font-medium text-gray-500">
                        <span className="text-[#111111] font-bold mr-1">{rating > 0 ? rating.toFixed(2) : "0.0"}</span>
                        ({nutritionist.totalReviews.toLocaleString()} Reviews)
                    </div>
                </div>
            </div>
        </div>
    );
}