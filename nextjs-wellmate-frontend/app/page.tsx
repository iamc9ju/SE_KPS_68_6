import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import NutritionistList from "@/components/NutritionistList";
import HowToUse from "@/components/HowToUse";
import UserReviews from "@/components/UserReviews";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fafafa] relative overflow-hidden">


      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">

        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0ibm9uZSI+PC9yZWN0Pgo8cGF0aCBkPSJNMCAwIEwgNDAgMCBMIDQwIDQwIEwgMCA0MCBaIiBmaWxsPSJub25lIiBzdHJva2U9IiNlNWU3ZWIiIHN0cm9rZS13aWR0aD0iMC41IiBzdHJva2Utb3BhY2l0eT0iMC41Ij48L3BhdGg+Cjwvc3ZnPg==')] opacity-50"></div>
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#A3D133]/20 to-[#FDB813]/20 blur-3xl opacity-60"></div>
        <div className="absolute top-[40%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#8BC34A]/10 to-transparent blur-3xl opacity-70"></div>
        <div className="absolute bottom-[-5%] right-[10%] w-[400px] h-[400px] rounded-full bg-gradient-to-tl from-[#FDB813]/10 to-[#A3D133]/10 blur-3xl opacity-50"></div>
      </div>

      <div className="relative z-10 flex flex-col gap-8 md:gap-16 pb-12">
        <Navbar />
        <Hero />
        <NutritionistList />
        <HowToUse />
        <UserReviews />
      </div>

      <Footer />
    </main>
  )
}