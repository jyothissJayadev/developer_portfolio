import React, { useState, useEffect } from "react";
import {
  Zap,
  Terminal,
  Code2,
  Database,
  Layers,
  ArrowUpRight,
  Server,
  Timer,
} from "lucide-react";

/**
 * Human-like Typing Effect Hook with Looping
 */
const useTypingLoop = (speed = 50, endDelay = 4000) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  // The sequence: write -> typo -> delete -> correct -> finish
  const sequence = [
    { type: "write", content: "I believe good prod" },
    { type: "write", content: "uxts" }, // Typo
    { type: "delete", count: 4 }, // Delete "xts"
    { type: "write", content: "ucts come from cl" },
    { type: "write", content: "aer" }, // Typo
    { type: "delete", count: 3 }, // Delete "er"
    { type: "write", content: "ear thinking, not just good tools." },
  ];

  useEffect(() => {
    let currentStep = 0;
    let currentChar = 0;
    let currentText = "";
    let timeoutId;

    const runEffect = () => {
      if (currentStep >= sequence.length) {
        setIsComplete(true);
        timeoutId = setTimeout(() => {
          setIsComplete(false);
          currentStep = 0;
          currentChar = 0;
          currentText = "";
          setDisplayedText("");
          runEffect();
        }, endDelay);
        return;
      }

      const step = sequence[currentStep];

      if (step.type === "write") {
        if (currentChar < step.content.length) {
          currentText += step.content[currentChar];
          setDisplayedText(currentText);
          currentChar++;
          const variance = Math.random() * 80;
          timeoutId = setTimeout(runEffect, speed + variance);
        } else {
          currentStep++;
          currentChar = 0;
          timeoutId = setTimeout(runEffect, 400);
        }
      } else if (step.type === "delete") {
        if (currentChar < step.count) {
          currentText = currentText.slice(0, -1);
          setDisplayedText(currentText);
          currentChar++;
          timeoutId = setTimeout(runEffect, speed);
        } else {
          currentStep++;
          currentChar = 0;
          timeoutId = setTimeout(runEffect, 200);
        }
      }
    };

    runEffect();
    return () => clearTimeout(timeoutId);
  }, []);

  return { displayedText, isComplete };
};

const App = () => {
  const { displayedText, isComplete } = useTypingLoop(50, 5000);

  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-cyan-500/40 font-sans overflow-hidden relative">
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-15%] left-[-5%] w-[50%] h-[50%] bg-cyan-600/10 blur-[140px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-blue-700/10 blur-[140px] rounded-full" />

        {/* Subtle Grid */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <main className="relative z-10 w-full min-h-screen px-8 md:px-24 flex flex-col justify-center py-16">
        {/* Status Area */}
        <div className="flex flex-wrap items-center justify-between gap-6 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          {/* Left Side Group */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </div>
              <span className="text-[10px] font-bold tracking-[0.25em] text-cyan-400 uppercase">
                Stack_Verified: MERN
              </span>
            </div>

            <div className="h-[1px] w-8 bg-white/10 hidden md:block" />

            <span className="text-[10px] font-mono text-white/30 tracking-widest uppercase hidden sm:block">
              NODE_RUNTIME: ACTIVE
            </span>
          </div>

          {/* Right Side Experience Highlight (Bigger & Prominent) */}
          <div className="group flex items-center gap-4 px-6 py-3 rounded-2xl border border-cyan-500/30 bg-cyan-500/5 backdrop-blur-xl hover:border-cyan-500/60 hover:bg-cyan-500/10 transition-all duration-500 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
            <div className="relative">
              <Timer size={24} className="text-cyan-400 animate-spin-slow" />
              <div className="absolute inset-0 bg-cyan-400/30 blur-lg rounded-full" />
            </div>
            <div className="flex flex-col">
              <span className="text-4xl font-black leading-none text-white group-hover:text-cyan-400 transition-colors">
                04
              </span>
              <span className="text-[10px] font-bold tracking-[0.2em] text-cyan-500/80 uppercase">
                Years_Experience
              </span>
            </div>
          </div>
        </div>

        {/* Hero Identity */}
        <div className="max-w-7xl">
          <div className="relative inline-block mb-4">
            <h1 className="text-[14vw] md:text-[9vw] font-black leading-[0.8] tracking-tighter uppercase mb-2">
              <span className="block hover:translate-x-4 transition-transform duration-500 cursor-default">
                Jyothiss
              </span>
              <span
                className="block text-transparent stroke-text"
                style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.2)" }}
              >
                Jayadevan
              </span>
            </h1>
          </div>

          {/* Thought Console */}
          <div className="mt-12 max-w-4xl relative">
            <div className="group bg-white/[0.02] border border-white/5 rounded-2xl p-8 backdrop-blur-sm hover:border-cyan-500/20 transition-all duration-700">
              <div className="flex items-center justify-between mb-8 opacity-40 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-3">
                  <Terminal size={16} className="text-cyan-500" />
                  <span className="text-[11px] font-mono tracking-[0.3em] uppercase">
                    MERN_Architect.v4
                  </span>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-white/10" />
                  <div className="w-2 h-2 rounded-full bg-white/10" />
                  <div className="w-2 h-2 rounded-full bg-white/10" />
                </div>
              </div>

              <div className="relative">
                <p className="text-3xl md:text-5xl text-gray-400 font-light leading-[1.3] min-h-[120px]">
                  <span className="text-white/20 select-none">“</span>
                  <span className="text-white">{displayedText}</span>
                  <span
                    className={`inline-block w-[4px] h-[0.9em] bg-cyan-500 ml-2 translate-y-1.5 ${isComplete ? "animate-pulse" : "opacity-100"}`}
                  />
                  <span className="text-white/20 select-none">”</span>
                </p>
              </div>
            </div>
          </div>

          {/* MERN Stack Capabilities Grid */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-16 border-t border-white/5 pt-16">
            {/* Backend & Database */}
            <div className="group">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black transition-all duration-500">
                  <Database size={20} />
                </div>
                <span className="text-[10px] font-bold tracking-[0.3em] text-gray-500 uppercase">
                  Data_Layer
                </span>
              </div>
              <h3 className="text-xl font-medium mb-2 group-hover:text-cyan-400 transition-colors uppercase tracking-tight">
                MongoDB_Node_Logic
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed font-light">
                Engineering high-performance NoSQL schemas and robust Express.js
                REST APIs for complex data orchestration.
              </p>
            </div>

            {/* Frontend React */}
            <div className="group">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 group-hover:bg-blue-500 group-hover:text-black transition-all duration-500">
                  <Layers size={20} />
                </div>
                <span className="text-[10px] font-bold tracking-[0.3em] text-gray-500 uppercase">
                  Interface_Core
                </span>
              </div>
              <h3 className="text-xl font-medium mb-2 group-hover:text-blue-400 transition-colors uppercase tracking-tight">
                React_Ecosystem
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed font-light">
                Building dynamic, component-driven UIs with React, leveraging
                advanced state management and optimized rendering.
              </p>
            </div>

            {/* API & Integration */}
            <div className="group">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-white group-hover:bg-white group-hover:text-black transition-all duration-500">
                  <Server size={20} />
                </div>
                <span className="text-[10px] font-bold tracking-[0.3em] text-gray-500 uppercase">
                  Connectivity
                </span>
              </div>
              <h3 className="text-xl font-medium mb-2 group-hover:opacity-80 transition-opacity uppercase tracking-tight">
                Fullstack_Integration
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed font-light">
                Seamlessly connecting client-side logic with server-side
                processing through secure JWT Auth and real-time sockets.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Meta */}
      <div className="fixed left-8 bottom-8 hidden lg:block">
        <div className="text-[10px] font-mono text-white/20 tracking-[0.5em] flex items-center gap-4">
          <span className="h-[1px] w-8 bg-white/10" />
          MERN_ENV // STABLE_BUILD
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .stroke-text {
          -webkit-text-fill-color: transparent;
        }
        .animate-in {
          animation: fade-in 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `,
        }}
      />
    </div>
  );
};

export default App;
