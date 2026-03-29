import { Suspense } from "react";
import OrderTrackingPageContent from "@/components/dashboard/OrderTrackingPageContent";

export default function DashboardTrackingPage() {
    return (
        <Suspense fallback={<div>Loading tracking data...</div>}>
            <OrderTrackingPageContent />
        </Suspense>
    );
}
