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
    user: { email: string };
    nutritionistSpecialties?: {
        specialty: { id: number; name: string };
    }[];
}

const NUTRITIONIST_PHOTOS = [
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1594824476967-48c8b9649571?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=600",
];

function getPhotoForNutritionist(id: string): string {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % NUTRITIONIST_PHOTOS.length;
    return NUTRITIONIST_PHOTOS[index];
}

export default function NutritionistCard({
    nutritionist,
}: {
    nutritionist: Nutritionist;
}) {
    const router = useRouter();

    const photoUrl = getPhotoForNutritionist(nutritionist.nutritionistId);

    const specialties =
        nutritionist.nutritionistSpecialties?.map((ns) => ns.specialty.name) ?? [];
    const primarySpecialty = specialties[0] || "โภชนาการทั่วไป";

    const rating = nutritionist.avgRating ?? 0;
    const reviewCount = nutritionist.totalReviews ?? 0;

    return (
        <div
            className="bg-white rounded-3xl border border-[#f0e6cc]/60 hover:border-[#C6E065] hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group"
            onClick={() =>
                router.push(`/dashboard/nutrition/${nutritionist.nutritionistId}`)
            }
        >
            { }
            <div className="aspect-[4/3] bg-gradient-to-br from-[#faf8f2] to-[#f0e6cc]/30 relative overflow-hidden">
                { }
                <img
                    src={photoUrl}
                    alt={`${nutritionist.firstName} ${nutritionist.lastName}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {nutritionist.verificationStatus === "approved" && (
                    <span className="absolute top-3 right-3 bg-[#C6E065] text-[#3d3522] text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                        ✓
                    </span>
                )}
            </div>

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
                    <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={`w-3.5 h-3.5 ${star <= Math.round(rating)
                                    ? "text-amber-400 fill-amber-400"
                                    : "text-gray-200 fill-gray-200"
                                    }`}
                            />
                        ))}
                    </div>
                    <span className="text-xs font-bold text-[#3d3522]">
                        {rating > 0 ? rating.toFixed(2) : "—"}
                    </span>
                    <span className="text-[10px] text-[#8a7550]">
                        ({reviewCount.toLocaleString()} รีวิว)
                    </span>
                </div>
            </div>
        </div>
    );
}
