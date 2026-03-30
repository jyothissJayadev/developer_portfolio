import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, Code2, Database, Layers, Globe, Cpu } from "lucide-react";

/**
 * Optimized DeveloperProcess Component
 * Improvements:
 * - Reduced hover enlargement (flex-[1.5]) for a more subtle transition
 * - Faster transition durations (500ms) for zero-lag feel
 * - Simplified state logic to prevent unnecessary re-renders
 * - Enhanced video playback error handling
 */

const workflowSteps = [
  {
    id: 1,
    number: "01",
    title: "Scalable Database Design",
    subtitle: "MongoDB & Schema Architecture",
    description:
      "Building robust data models with Mongoose. I focus on indexing, aggregation pipelines, and ensuring your data architecture scales horizontally without bottlenecks.",
    video: "./intro.mp4",
    icon: <Database className="w-5 h-5" />,
  },
  {
    id: 2,
    number: "02",
    title: "Robust Backend Logic",
    subtitle: "Node.js & Express Engineering",
    description:
      "Developing secure RESTful and GraphQL APIs. Implementation of JWT authentication, middleware layers, and optimized server-side performance.",
    video: "./intro.mp4",
    icon: <Layers className="w-5 h-5" />,
  },
  {
    id: 3,
    number: "03",
    title: "Modern Frontend Systems",
    subtitle: "React & Next.js Ecosystem",
    description:
      "Crafting high-performance user interfaces. Leveraging Server Components, state management (Zustand/Redux), and responsive Tailwind CSS layouts.",
    video: "./intro.mp4",
    icon: <Globe className="w-5 h-5" />,
  },
];

const App = () => {
  const [isMobile, setIsMobile] = useState(false);
  const videoRefs = useRef([]);

  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkViewport();
    window.addEventListener("resize", checkViewport, { passive: true });
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  const safePlay = (index) => {
    const v = videoRefs.current[index];
    if (v && v.paused) {
      v.muted = true;
      v.playsInline = true;
      v.play().catch(() => {});
    }
  };

  const pauseVideo = (index) => {
    const v = videoRefs.current[index];
    if (v && !v.paused) {
      v.pause();
      v.currentTime = 0;
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] text-white font-sans selection:bg-[#06b6d4]/30 overflow-x-hidden">
      <section className="relative pt-16 pb-24 md:pt-24 md:pb-48 px-4 sm:px-6">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:30px_30px] md:bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="relative max-w-[86rem] mx-auto border-x border-t border-white/5 bg-[#030303]/40 backdrop-blur-sm">
          {/* Top Corner Dots */}
          <div className="w-[7px] h-[7px] z-10 absolute -left-[4px] -top-[4px] bg-[#050508] border border-white/10"></div>
          <div className="w-[7px] h-[7px] z-10 absolute -right-[4px] -top-[4px] bg-[#050508] border border-white/10"></div>

          {/* Header Section */}
          <div className="relative flex flex-col text-center md:text-left md:flex-row items-center md:items-end justify-between px-6 md:px-10 py-12 md:py-20 gap-8">
            <div className="flex-1">
              <p className="uppercase font-mono tracking-widest w-fit px-2 py-1 text-[#06b6d4] bg-[#06b6d4]/10 border border-[#06b6d4]/30 text-[10px] mx-auto md:mx-0 mb-4 rounded-sm flex items-center gap-2">
                <Cpu className="w-3 h-3" />
                MERN STACK WORKFLOW
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight leading-none">
                From DB Schema <br />
                <span className="text-gray-500 italic font-mono font-light">
                  to Production
                </span>
              </h2>
            </div>
            <p className="text-gray-400 text-sm md:text-lg max-w-[32rem] md:border-l border-white/5 md:pl-8 leading-relaxed">
              I architect full-cycle web applications, ensuring every layer from
              the database to the client-side interaction is optimized for
              speed, security, and scalability.
            </p>
          </div>

          {/* ✅ Interactive Cards List with Adjusted Flex Expansion */}
          <ol className="flex flex-col md:flex-row w-full h-auto md:h-[42rem] border-y border-white/5 bg-[#030303]">
            {workflowSteps.map((step, index) => (
              <li
                key={step.id}
                onMouseEnter={() => !isMobile && safePlay(index)}
                onMouseLeave={() => !isMobile && pauseVideo(index)}
                className="group transition-all duration-500 ease-out flex-1 flex flex-col relative border-b md:border-b-0 md:border-r last:border-r-0 border-white/5 hover:bg-[#050508] md:hover:flex-[1.5] overflow-hidden will-change-[flex]"
              >
                {/* Corner Dots for each card */}
                <div className="w-[6px] h-[6px] z-10 absolute -right-[3px] -top-[3px] bg-[#050508] border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="w-[6px] h-[6px] z-10 absolute -right-[3px] -bottom-[3px] bg-[#050508] border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Card Content Container */}
                <div className="flex flex-col h-full p-8 md:p-10 gap-y-6 relative z-10">
                  {/* Step Number & Icon */}
                  <div className="flex justify-between items-center">
                    <p className="text-4xl font-mono text-white/5 group-hover:text-[#06b6d4]/30 transition-colors duration-300">
                      {step.number}
                    </p>
                    <div className="p-2 bg-white/5 border border-white/10 text-[#06b6d4] rounded-md opacity-40 group-hover:opacity-100 transition-all duration-300">
                      {step.icon}
                    </div>
                  </div>

                  {/* Video/Media Placeholder */}
                  <div className="relative w-full aspect-video md:h-56 rounded-lg overflow-hidden border border-white/5 bg-black/40 group-hover:border-[#06b6d4]/20 transition-all duration-300">
                    <video
                      ref={(el) => (videoRefs.current[index] = el)}
                      src={step.video}
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover opacity-20 group-hover:opacity-100 transition-opacity duration-500 scale-105 group-hover:scale-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-transparent opacity-60" />
                  </div>

                  {/* Description Section */}
                  <div className="mt-auto">
                    <h4 className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#06b6d4] mb-2 opacity-60">
                      {step.subtitle}
                    </h4>
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-white transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 md:line-clamp-none group-hover:text-gray-200 transition-colors duration-300">
                      {step.description}
                    </p>

                    {/* Action Link */}
                    <div className="mt-8 flex items-center gap-3 text-[10px] font-mono tracking-widest uppercase text-gray-500 hover:text-[#06b6d4] cursor-pointer transition-colors duration-300 group/link">
                      <span>View Documentation</span>
                      <ArrowRight className="w-3 h-3 group-hover/link:translate-x-1.5 transition-transform duration-300" />
                    </div>
                  </div>
                </div>

                {/* Subtile background glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#1d4ed8]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </li>
            ))}
          </ol>

          {/* Bottom Corner Dots */}
          <div className="w-[7px] h-[7px] z-10 absolute -left-[4px] -bottom-[4px] bg-[#050508] border border-white/10 hidden md:block"></div>
          <div className="w-[7px] h-[7px] z-10 absolute -right-[4px] -bottom-[4px] bg-[#050508] border border-white/10 hidden md:block"></div>
        </div>

        {/* Status / Availability Footer */}
        <div className="mt-10 max-w-[86rem] mx-auto flex flex-col md:flex-row justify-between items-center gap-6 px-4 text-gray-500 text-[10px] font-mono uppercase tracking-[0.2em]">
          <div className="flex items-center gap-3">
            <div className="relative flex h-2 w-2">
              <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#06b6d4] opacity-75"></div>
              <div className="relative inline-flex rounded-full h-2 w-2 bg-[#06b6d4]"></div>
            </div>
            <span>Current Status: Open for collaborations</span>
          </div>
          <div className="flex items-center gap-8">
            <a
              href="#"
              className="hover:text-[#06b6d4] transition-colors duration-300"
            >
              GitHub
            </a>
            <a
              href="#"
              className="hover:text-[#06b6d4] transition-colors duration-300"
            >
              LinkedIn
            </a>
            <a
              href="#"
              className="hover:text-[#06b6d4] transition-colors duration-300"
            >
              E-mail
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default App;
