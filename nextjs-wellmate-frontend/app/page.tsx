import Navbar from "@/component/Navbar";
import Hero from "@/component/Hero";
import NutritionistList from "@/component/NutritionistList";
import Footer from "@/component/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <NutritionistList />
      <Footer></Footer>
    </main>
  )
}