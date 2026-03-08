import { Star } from "lucide-react";
import Button from "./Button";
import Link from "next/link";
import { nutritionists } from "@/data/nutritionistData";

export default function NutritionistList() {
    return (
        <section className="py-16 bg-transparent">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12 animate-fadeIn">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">พบกับนักโภชนาการของเรา</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {nutritionists.map((person, idx) => (
                        <div
                            key={idx}
                            className="border border-gray-200 p-6 rounded-2xl bg-white hover:border-lime-200 transition-all hover:-translate-y-2 text-center opacity-0 animate-slideUp"
                            style={{ animationDelay: `${idx * 0.15 + 0.2}s` }}
                        >
                            {}
                            <div className="flex justify-center mb-3">
                                <img
                                    src={person.image}
                                    alt={person.name}
                                    className="w-20 h-20 rounded-full object-cover bg-gray-100"
                                />
                            </div>

                            {}
                            <h3 className="font-bold text-base mb-1">{person.name}</h3>
                            <p className="text-xs text-gray-500 mb-3">{person.title}</p>

                            {}
                            <div className="mb-3">
                                <Link href={`/nutritionist/${person.id}`}>
                                    <Button variant="outline" size="sm" className="text-sm px-6 py-1 border-2 border-black rounded-lg">
                                        ดูโปรไฟล์
                                    </Button>
                                </Link>
                            </div>

                            {}
                            <div className="flex items-center justify-center gap-1 mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-4 h-4 ${i < Math.floor(person.rating) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`}
                                    />
                                ))}
                            </div>
                            <p className="text-xs text-gray-500 mb-3">
                                {person.rating} | {person.reviews} รีวิว
                            </p>

                            {}
                            <p className="text-xs text-gray-500 leading-relaxed">
                                {person.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
