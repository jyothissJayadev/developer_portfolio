import React from "react";
import {
  GitMerge,
  ExternalLink,
  Layers,
  Server,
  Layout,
  ChevronRight,
  Code2,
  Terminal,
  Sparkles,
} from "lucide-react";

const projects = [
  {
    id: 1,
    title: "EcoSphere Marketplace",
    description:
      "A comprehensive MERN e-commerce platform with real-time inventory and Stripe integration.",
    tech: ["MongoDB", "Express", "React", "Node.js"],
    category: "Full Stack",
    image:
      "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=1000",
    isFeatured: true,
    github: "#",
    demo: "#",
  },
  {
    id: 2,
    title: "TaskFlow PM",
    description:
      "Real-time project management with drag-and-drop Kanban boards.",
    tech: ["React", "Socket.io", "Node.js"],
    category: "Productivity",
    image:
      "https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&q=80&w=1000",
    isFeatured: false,
    github: "#",
    demo: "#",
  },
  {
    id: 3,
    title: "DevConnect Social",
    description:
      "A community platform for developers to share code snippets and network.",
    tech: ["MERN", "JWT", "Cloudinary"],
    category: "Social Media",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000",
    isFeatured: false,
    github: "#",
    demo: "#",
  },
  {
    id: 4,
    title: "CryptoVault Dashboard",
    description:
      "A secure cryptocurrency tracking app with live price feeds and analytics.",
    tech: ["Node.js", "Chart.js", "Express"],
    category: "FinTech",
    image:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=1000",
    isFeatured: true,
    github: "#",
    demo: "#",
  },
  {
    id: 5,
    title: "StreamIt CMS",
    description: "Video streaming management system with AWS S3 integration.",
    tech: ["React", "AWS S3", "MongoDB"],
    category: "Multimedia",
    image:
      "https://images.unsplash.com/photo-1616469829581-73993eb86b02?auto=format&fit=crop&q=80&w=1000",
    isFeatured: false,
    github: "#",
    demo: "#",
  },
];

const ProjectCard = ({ project }) => {
  return (
    <div
      className={`group relative bg-slate-900/60 transition-all duration-500 hover:bg-slate-900 flex flex-col aspect-[4/3] rounded-none border-none ${project.isFeatured ? "lg:col-span-2" : "col-span-1"}`}
    >
      {/* Top Section with Corner Image */}
      <div className="flex h-[60%] w-full relative">
        {/* 4:3 Image Container in the top-left corner */}
        <div className="w-2/3 lg:w-1/2 aspect-[4/3] relative overflow-hidden bg-slate-950">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-blue-600/10 group-hover:bg-transparent transition-colors duration-500" />
        </div>

        {/* Floating Icons/Badges in the empty space next to image */}
        <div className="flex-grow p-6 flex flex-col items-end justify-start gap-4">
          <div className="flex gap-2">
            <a
              href={project.github}
              className="p-2 bg-slate-800 text-white hover:bg-blue-600 transition-colors"
            >
              <GitMerge size={18} />
            </a>
            <a
              href={project.demo}
              className="p-2 bg-slate-800 text-white hover:bg-blue-600 transition-colors"
            >
              <ExternalLink size={18} />
            </a>
          </div>
          {project.isFeatured && (
            <div className="flex items-center gap-2 text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em] bg-blue-500/5 px-3 py-1">
              <Sparkles size={12} />
              Important
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section: Content Area */}
      <div className="p-6 lg:p-8 flex-grow flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">
              {project.category}
            </span>
          </div>

          <h3
            className={`font-bold text-white mb-2 transition-colors group-hover:text-blue-400 line-clamp-1 ${project.isFeatured ? "text-2xl md:text-4xl" : "text-xl lg:text-2xl"}`}
          >
            {project.title}
          </h3>

          <p className="text-slate-400 leading-relaxed text-xs lg:text-sm line-clamp-2 max-w-[95%]">
            {project.description}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            {project.tech.map((item, idx) => (
              <span
                key={idx}
                className="text-[9px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-300 transition-colors"
              >
                // {item}
              </span>
            ))}
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button className="flex items-center gap-2 text-[11px] font-bold text-white uppercase tracking-[0.2em] group/btn hover:text-blue-500 transition-colors">
              View Project
              <ChevronRight
                size={14}
                className="group-hover/btn:translate-x-1 transition-transform"
              />
            </button>

            <div className="flex items-center gap-2 opacity-50">
              <div className="w-1.5 h-1.5 bg-emerald-500" />
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                MERN Stack
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Accent: Side bar on hover */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top" />
    </div>
  );
};

export default function App() {
  return (
    <section className="min-h-screen bg-slate-950 py-32 px-6 sm:px-12 lg:px-24 font-sans selection:bg-blue-600/30">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="relative mb-32 flex flex-col items-start text-left border-l-2 border-blue-600 pl-8">
          <div className="text-blue-500 text-xs font-bold mb-4 uppercase tracking-[0.4em]">
            Selected Works v2.0
          </div>

          <h2 className="text-6xl md:text-[8rem] font-black text-white mb-8 tracking-tighter leading-none uppercase">
            Built to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">
              Scale.
            </span>
          </h2>

          <p className="text-slate-500 max-w-xl text-lg leading-relaxed font-medium">
            Full-stack engineering focused on performance, modularity, and
            high-impact digital products.
          </p>
        </div>

        {/* Grid: Sharp edges, no borders, 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 grid-flow-row-dense bg-slate-800/20">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* Footer Contact */}
        <div className="mt-40 flex flex-col md:flex-row items-center justify-between gap-8 border-t border-slate-900 pt-20">
          <div className="text-left">
            <h3 className="text-4xl font-bold text-white tracking-tight uppercase">
              Let's build.
            </h3>
            <p className="text-slate-500 mt-2">
              Open for MERN stack opportunities.
            </p>
          </div>

          <button className="group relative px-12 py-5 bg-white text-slate-950 font-bold uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all duration-300">
            Contact Me
          </button>
        </div>
      </div>
    </section>
  );
}
