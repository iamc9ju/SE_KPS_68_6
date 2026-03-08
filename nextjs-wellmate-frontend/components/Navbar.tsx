import Link from "next/link";
import { ChevronDown } from "lucide-react";

export default function Navbar() {
    return (
        <nav className="fixed top-0 w-full bg-white z-50 py-4 px-6 md:px-12 shadow-sm">
            <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                {}
                <Link href="/" className="flex items-end gap-3 hover:opacity-90 transition-opacity">
                    {}
                    <div className="flex flex-col items-center justify-center -mt-1">
                        <svg width="42" height="28" viewBox="0 0 50 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12L12 25L25 5L38 25L45 12" stroke="#8BC34A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M12 25L25 15L38 25" stroke="#FDB813" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="text-[7px] font-bold text-gray-400 tracking-wider uppercase mt-0.5">Wallmate</span>
                    </div>

                    <div className="text-2xl font-bold font-sans tracking-wide leading-none pb-1">
                        <span className="text-[#8BC34A]">WELL</span>
                        <span className="text-[#FDB813]">MATE</span>
                    </div>
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
