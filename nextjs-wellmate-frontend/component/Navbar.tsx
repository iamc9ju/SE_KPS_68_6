import Link from "next/link";
import { ChevronDown } from "lucide-react";

export default function Navbar() {
    return (
        <nav className="fixed top-0 w-full bg-white z-50 py-4 px-6 md:px-12 shadow-sm">
            <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center hover:opacity-90 transition-opacity gap-2">
                    <img src="/logo.png" alt="WellMate Logo" className="h-20 w-auto" />
                </Link>

                {/* Menu */}
                <div className="hidden lg:flex items-center gap-8 font-medium text-[15px] text-gray-800">
                    <Link href="/" className="px-5 py-2.5 bg-gray-100 rounded-full font-semibold">
                        หน้าหลัก
                    </Link>
                    <Link href="/dashboard" className="hover:text-black transition-colors">
                        แดชบอร์ด
                    </Link>
                    <Link href="/dashboard/appointments" className="hover:text-black transition-colors">
                        ประวัติการนัดหมาย
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

                {/* Buttons */}
                <div className="flex items-center gap-3">
                    <Link
                        href="/signin"
                        className="px-6 py-2.5 text-black border border-black font-medium rounded-full hover:bg-gray-50 transition-colors"
                    >
                        เข้าสู่ระบบ
                    </Link>
                    <Link
                        href="/signup"
                        className="px-6 py-2.5 text-black bg-[#C6E668] border border-gray-900 font-medium rounded-full hover:bg-[#b5d658] transition-colors"
                    >
                        สมัครสมาชิก
                    </Link>
                </div>

            </div>
        </nav>
    );
}