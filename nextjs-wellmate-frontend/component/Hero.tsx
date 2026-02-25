import Button from "./Button";

export default function Hero() {
    return (
        <section className="pt-24 pb-10 bg-transparent overflow-hidden">
            <div className="max-w-7xl mx-auto px-4">
                {/* Hero Banner with food background image */}
                <div className="relative rounded-3xl overflow-hidden min-h-[350px] flex items-center justify-center">
                    {/* Background food image */}
                    <img
                        src="/hero-food.png"
                        alt="Healthy food background"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* Dark overlay for text readability */}
                    <div className="absolute inset-0 bg-black/40"></div>

                    {/* Content */}
                    <div className="relative z-10 text-center text-white px-4 py-16">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 italic" style={{ fontFamily: "'Georgia', serif" }}>
                            Start your health journey today.
                        </h1>
                        <p className="text-sm md:text-base mb-8 max-w-2xl mx-auto opacity-90">
                            Don&apos;t wait until you realize it&apos;s too late. Consult a specialist and get a nutrition plan tailored specifically for you today!
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Button className="bg-white text-black border-2 border-black rounded-lg font-bold px-6 py-3 hover:bg-gray-100 transition-all text-sm">
                                Get Your Health Assessment
                            </Button>
                            <Button className="bg-white text-black border-2 border-black rounded-lg font-bold px-6 py-3 hover:bg-gray-100 transition-all text-sm">
                                Package
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}