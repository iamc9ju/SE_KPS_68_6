import Link from "next/link";
import { ChevronDown } from "lucide-react";

export default function Navbar() {
    return (
        <nav className="fixed top-0 w-full bg-white z-50 py-4 px-6 md:px-12 shadow-sm">
            <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                {}
                <Link href="/" className="hover:opacity-90 transition-opacity flex items-center gap-2">
                    <div className="text-[#8CC63F] font-bold text-2xl tracking-tighter italic">
                        W<span className="text-[#F7931E]">M</span>
                    </div>
                    <div className="font-bold text-xl tracking-tight uppercase">Wellmate</div>
                </Link>

                {}
                <div className="hidden lg:flex items-center gap-8 font-medium text-[15px] text-gray-800">
                    <Link href="/" className="px-5 py-2.5 bg-gray-100 rounded-full font-semibold">
                        หน้าหลัก
                    </Link>
                    <Link href="/dashboard" className="hover:text-black transition-colors">
                        แดชบอร์ด
                    </Link>
                    <button className="flex items-center gap-1.5 hover:text-black transition-colors">
                        บริการโภชนาการ
                        <ChevronDown className="w-4 h-4 text-gray-600" strokeWidth={2.5} />
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-black transition-colors">
                        เมนูเพื่อสุขภาพ
                        <ChevronDown className="w-4 h-4 text-gray-600" strokeWidth={2.5} />
                    </button>
                    <Link href="/progress" className="hover:text-black transition-colors">
                        ความคืบหน้า
                    </Link>
                </div>

                {}
                <div className="flex items-center gap-3">
                    <Link
                        href="/login"
                        className="px-6 py-2.5 text-black border border-black font-medium rounded-full hover:bg-gray-50 transition-colors"
                    >
                        เข้าสู่ระบบ
                    </Link>
                    <Link
                        href="/register"
                        className="px-6 py-2.5 text-black bg-[#C6E668] border border-gray-900 font-medium rounded-full hover:bg-[#b5d658] transition-colors"
                    >
                        สมัครสมาชิก
                    </Link>
                </div>

            </div>
        </nav>
    );
}
