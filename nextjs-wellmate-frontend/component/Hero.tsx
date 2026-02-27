import Button from "./Button";

export default function Hero() {
    return (
        <section className="pt-24 pb-10 bg-transparent overflow-hidden">
            <div className="max-w-7xl mx-auto px-4">
                {/* Hero Banner with food background image */}
                <div className="relative rounded-3xl overflow-hidden min-h-[350px] flex items-center justify-center">
                    {/* Background food image */}
                    <img
                        src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=2000"
                        alt="Healthy food background"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* Dark overlay for text readability */}
                    <div className="absolute inset-0 bg-black/50"></div>

                    {/* Content */}
                    <div className="relative z-10 text-center text-white px-4 py-16">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fadeIn tracking-tight leading-tight">
                            ค้นพบสุขภาพที่ดีกว่า<br />ในแบบที่เป็นคุณ
                        </h1>
                        <p className="text-base md:text-lg mb-10 max-w-2xl mx-auto opacity-0 animate-slideUp font-light text-gray-100 leading-relaxed" style={{ animationDelay: '0.2s' }}>
                            ให้เราดูแลโภชนาการของคุณ ด้วยแผนอาหารที่ออกแบบเฉพาะบุคคลโดยผู้เชี่ยวชาญ เริ่มต้นเส้นทางสู่สุขภาพที่แข็งแรงได้ตั้งแต่วันนี้
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4 opacity-0 animate-slideUp" style={{ animationDelay: '0.4s' }}>
                            <Button className="bg-white text-black border-2 border-black rounded-lg font-bold px-6 py-3 hover:bg-gray-100 transition-all text-sm">
                                ประเมินสุขภาพของคุณ
                            </Button>
                            <Button className="bg-white text-black border-2 border-black rounded-lg font-bold px-6 py-3 hover:bg-gray-100 transition-all text-sm">
                                แพ็กเกจ
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}