import HomeNav from "@/components/home/HomeNav";
import Hero from "@/components/home/Hero";
import CaptureDemo from "@/components/home/CaptureDemo";
import Pillars from "@/components/home/Pillars";
import HomeFooter from "@/components/home/HomeFooter";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-bg-main">
      <HomeNav />
      <main className="flex-1">
        <Hero />
        <CaptureDemo />
        <Pillars />
      </main>
      <HomeFooter />
    </div>
  );
}
