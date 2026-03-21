import { ReactNode } from "react";

interface StatCardProps {
    title: string;
    value: string | number;
    unit?: string;
    description?: string;
    icon?: ReactNode;
    colorClass?: string;
    children?: ReactNode;
}

export default function StatCard({
    title,
    value,
    unit,
    icon,
    children,
}: StatCardProps) {
    return (
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 flex flex-col justify-between h-full shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all hover:shadow-md animate-fadeIn">
            <div>
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-gray-900 font-bold text-lg tracking-tight">{title}</h3>
                </div>

                <div className="mb-1 flex items-baseline gap-1">
                    <span className="text-2xl font-black text-gray-900">
                        {value}
                    </span>
                    {unit && (
                        <span className="text-gray-400 text-sm font-medium">{unit}</span>
                    )}
                </div>

                <div className="flex-1 flex flex-col justify-center min-h-[40px]">
                    {children}
                </div>
            </div>
        </div>
    );
}
