import React, { useRef, useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import Scene from "../components/home/Scene";
import Hero from "../components/home/Hero";
import Philosophy from "../components/home/Philosophy"; // 1. Import it

const Home = () => {
  const mouse = useRef({ x: 0, y: 0 });
  const requestRef = useRef();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      preventScrollOnFocus: true,
    });

    function animate(time) {
      lenis.raf(time);
      requestRef.current = requestAnimationFrame(animate);
    }
    requestRef.current = requestAnimationFrame(animate);

    const handleMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="relative w-full bg-[#050508] text-white overflow-x-hidden">
      <main className="relative z-10 w-full">
        {/* SECTION 1: THE SENTINEL */}
        <section className="relative h-screen w-full bg-[#050508] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Scene mouse={mouse} centered={true} />
          </div>
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-20 animate-pulse flex flex-col items-center gap-2">
            <span className="text-[9px] tracking-[0.5em] uppercase">
              Initialize_Core
            </span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-cyan-500 to-transparent" />
          </div>
        </section>

        {/* SECTION 2: THE IDENTITY */}
        <section className="relative min-h-screen w-full flex flex-col bg-[#050508] border-t border-white/5">
          <Hero />
        </section>

        {/* SECTION 3: THE PHILOSOPHY (NEW) */}
        <Philosophy />

        {/* SECTION 4: WORK */}
        <section className="relative h-[80vh] w-full flex flex-col justify-center px-8 md:px-24 bg-[#050508] border-t border-white/5">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase opacity-20">
            Selected_Modules
          </h2>
        </section>
      </main>
    </div>
  );
};

export default Home;
