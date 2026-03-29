import { Suspense } from "react";
import OrderTrackingPageContent from "@/components/dashboard/OrderTrackingPageContent";
import { Loader2 } from "lucide-react";

export default function TrackingPage() {
    return (
        <Suspense fallback={
            <div className="flex-1 flex items-center justify-center min-h-screen bg-[#fffbf5] lg:pl-64">
                <div className="flex flex-col items-center gap-6">
                    <Loader2 className="w-16 h-16 animate-spin text-[#C6E065]" />
                    <p className="text-[#3d3522] font-black uppercase tracking-widest text-xs font-sans">กำลังโหลดข้อมูลการติดตาม...</p>
                </div>
            </div>
        }>
            <OrderTrackingPageContent />
        </Suspense>
    );
}
