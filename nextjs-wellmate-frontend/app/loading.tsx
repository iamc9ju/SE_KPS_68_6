import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white/50 z-50">
            <Loader2 className="w-10 h-10 text-[#C6E065] animate-spin" />
        </div>
    );
}
