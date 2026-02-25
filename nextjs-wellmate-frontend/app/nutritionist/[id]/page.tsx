import { nutritionists } from "@/data/nutritionistData";
import { notFound } from "next/navigation";
import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";
import { Star, GraduationCap, Briefcase, Globe, CalendarDays, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Button from "@/component/Button";

export default async function NutritionistProfile({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const person = nutritionists.find((n) => n.id === id);

    if (!person) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            <div className="pt-24 pb-16 max-w-5xl mx-auto px-4">
                {/* Back button */}
                <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors mb-8">
                    <ArrowLeft size={18} />
                    <span className="text-sm font-medium">Back to Home</span>
                </Link>

                {/* Profile Header */}
                <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-8">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                        {/* Photo */}
                        <img
                            src={person.image}
                            alt={person.name}
                            className="w-36 h-36 rounded-full object-cover bg-gray-100 border-4 border-lime-100 shadow-lg"
                        />

                        {/* Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{person.name}</h1>
                            <p className="text-[#A3D133] font-semibold mb-3">{person.title}</p>

                            {/* Rating */}
                            <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                                <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-5 h-5 ${i < Math.floor(person.rating) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`}
                                        />
                                    ))}
                                </div>
                                <span className="font-bold text-gray-800">{person.rating}</span>
                                <span className="text-gray-400">|</span>
                                <span className="text-gray-500 text-sm">{person.reviews} Reviews</span>
                            </div>

                            {/* Languages & Experience */}
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1.5">
                                    <Briefcase size={15} className="text-[#A3D133]" />
                                    <span>{person.experience} experience</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Globe size={15} className="text-[#A3D133]" />
                                    <span>{person.languages.join(", ")}</span>
                                </div>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="flex-shrink-0">
                            <Button className="bg-[#A3D133] text-black border-2 border-black rounded-xl font-bold px-8 py-3 hover:bg-[#b5e63d] transition-all">
                                Book Consultation
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column - About & Education */}
                    <div className="md:col-span-2 space-y-8">
                        {/* About */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-3">About</h2>
                            <p className="text-gray-600 leading-relaxed">{person.description}</p>
                        </div>

                        {/* Education */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <GraduationCap size={20} className="text-[#A3D133]" />
                                Education & Certifications
                            </h2>
                            <ul className="space-y-3">
                                {person.education.map((edu, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <div className="w-2 h-2 rounded-full bg-[#A3D133] mt-2 flex-shrink-0"></div>
                                        <span className="text-gray-600">{edu}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Specializations */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Specializations</h2>
                            <div className="flex flex-wrap gap-2">
                                {person.specializations.map((spec, idx) => (
                                    <span
                                        key={idx}
                                        className="bg-lime-50 text-lime-800 px-4 py-2 rounded-full text-sm font-medium border border-lime-200"
                                    >
                                        {spec}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Availability */}
                    <div className="space-y-8">
                        <div className="bg-white border border-gray-200 rounded-2xl p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <CalendarDays size={20} className="text-[#A3D133]" />
                                Availability
                            </h2>
                            <ul className="space-y-2">
                                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => {
                                    const isAvailable = person.availableDays.includes(day);
                                    return (
                                        <li key={day} className={`flex items-center justify-between py-2 px-3 rounded-lg text-sm ${isAvailable ? 'bg-lime-50' : 'bg-gray-50'}`}>
                                            <span className={isAvailable ? 'text-gray-800 font-medium' : 'text-gray-400'}>{day}</span>
                                            <span className={`text-xs font-semibold ${isAvailable ? 'text-[#A3D133]' : 'text-gray-300'}`}>
                                                {isAvailable ? 'Available' : 'Unavailable'}
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        {/* Quick Contact */}
                        <div className="bg-gradient-to-br from-[#A3D133]/10 to-lime-50 border border-lime-200 rounded-2xl p-6 text-center">
                            <h3 className="font-bold text-gray-900 mb-2">Need help choosing?</h3>
                            <p className="text-sm text-gray-600 mb-4">Contact our team to find the right nutritionist for you.</p>
                            <Button variant="outline" className="border-2 border-black rounded-xl text-sm px-6 py-2">
                                Contact Us
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
