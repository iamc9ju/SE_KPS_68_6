import Link from "next/link";
import Button from "./Button";

export default function Navbar() {
    return (
        <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 p-4 border-b-2 border-gray-200">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="flex flex-col">
                        <div className="w-6 h-3 bg-[#FDB813] rounded-b-full"></div>
                        <div className="w-6 h-3 bg-[#8BC34A] rounded-b-full"></div>
                    </div>
                    <div className="text-2xl font-bold font-sans">
                        <span className="text-black">Well</span>
                        <span className="text-[#8BC34A]">Mate</span>
                    </div>
                </div>

                {/* Menu */}
                <div className="hidden md:flex items-center gap-6 font-medium text-sm">
                    <Link href="/" className="px-4 py-2 bg-gray-100 rounded-full">Homepage</Link>
                    <Link href="#" className="hover:text-primary">Dashboard</Link>
                    <Link href="#" className="hover:text-primary flex items-center gap-1">
                        Nutrition Service
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </Link>
                    <Link href="#" className="hover:text-primary flex items-center gap-1">
                        Healthy Menu
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </Link>
                    <Link href="#" className="hover:text-primary">Progress</Link>
                </div>
                {/* Buttons */}
                <div className="flex items-center gap-4">
                    <Button className="px-6 py-2 bg-white text-black border-2 border-black rounded-xl font-bold hover:bg-gray-50 transition-all">
                        Sign In
                    </Button>
                    <Button className="px-6 py-2 text-black border-2 border-black rounded-xl font-bold transition-all bg-[#a3d133]">
                        Sign Up
                    </Button>
                </div>
            </div>
        </nav>
    );
}