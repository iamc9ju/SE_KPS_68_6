import { Star } from "lucide-react";
import Button from "./Button";

const nutritionists = [
    {
        name: "Dr. Peeronuch Thepwong",
        title: "Weight Management & Diabetes",
        rating: 4.9,
        reviews: 1846,
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200&h=200",
        description: "Specializing in weight management and diabetes care, Dr. Peeranuch Thapwong provides evidence-based medical nutrition therapy tailored to each unique needs. Achieve sustainable health goals through personalized plans designed to manage blood sugar and optimize your well-being."
    },
    {
        name: "Dr. Pronchanok Phoolaikaw",
        title: "Sport Nutrition",
        rating: 4.75,
        reviews: 1260,
        image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=200&h=200",
        description: "Fuel your performance with expert guidance. Dr. Pronchanok specializes in Sport Nutrition, helping athletes and active individuals optimize their diet for maximum strength and recovery."
    },
    {
        name: "Dr. Krittiyawadee Phetthong",
        title: "Maternal Child Health",
        rating: 4.8,
        reviews: 1176,
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200&h=200",
        description: "Give your little ones the best start in life. Dr. Krittiyawadee offers compassionate, personalized nutrition plans for mothers and children to ensure a healthy future for your family."
    }
];

export default function NutritionistList() {
    return (
        <section className="py-16 bg-transparent">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">พบกับนักโภชนาการของเรา</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {nutritionists.map((person, idx) => (
                        <div key={idx} className="border border-gray-200 p-6 rounded-2xl bg-white hover:border-lime-200 transition-colors text-center">
                            {/* Avatar */}
                            <div className="flex justify-center mb-3">
                                <img
                                    src={person.image}
                                    alt={person.name}
                                    className="w-20 h-20 rounded-full object-cover bg-gray-100"
                                />
                            </div>

                            {/* Name & Title */}
                            <h3 className="font-bold text-base mb-1">{person.name}</h3>
                            <p className="text-xs text-gray-500 mb-3">{person.title}</p>

                            {/* Profile Button */}
                            <div className="mb-3">
                                <Button variant="outline" size="sm" className="text-sm px-6 py-1 border-2 border-black rounded-lg">
                                    Profile
                                </Button>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center justify-center gap-1 mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-4 h-4 ${i < Math.floor(person.rating) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`}
                                    />
                                ))}
                            </div>
                            <p className="text-xs text-gray-500 mb-3">
                                {person.rating} | {person.reviews} Reviews
                            </p>

                            {/* Description */}
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