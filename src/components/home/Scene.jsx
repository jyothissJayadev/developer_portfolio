import React, { useState, useEffect, useRef, useMemo } from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Cpu,
  Zap,
  Target,
  ArrowRight,
  RefreshCcw,
  User,
  Hand,
  RotateCw,
  Music,
  HelpCircle,
  Briefcase,
  Code,
  Heart,
  Shield,
  Globe,
  Terminal,
  Activity,
} from "lucide-react";

// --- PERSONALIZED CONVERSATION LOGIC FOR JYOTHIS ---
const CONVERSATION_FLOW = {
  start: {
    message:
      "You’re not just viewing a portfolio — you’re exploring how Jyothis thinks and builds. I'm here to help you navigate his approach.",
    action: "wave",
    options: [
      {
        label: "Who is Jyothis?",
        icon: <User className="w-4 h-4" />,
        next: "who",
      },
      {
        label: "What does he do?",
        icon: <Briefcase className="w-4 h-4" />,
        next: "what",
      },
      {
        label: "What is he building?",
        icon: <Code className="w-4 h-4" />,
        next: "current",
      },
      {
        label: "Why does he build?",
        icon: <Heart className="w-4 h-4" />,
        next: "why",
      },
    ],
  },
  who: {
    message:
      "Jyothis is a developer who focuses on understanding systems deeply before building them. He prioritizes structural integrity over quick features.",
    action: "nod",
    options: [
      { label: "How does he think?", next: "thinking" },
      { label: "What makes him different?", next: "difference" },
      { label: "Go back", next: "start" },
    ],
  },
  thinking: {
    message:
      "He thinks in terms of structure, flow, and long-term behavior. It’s about building a foundation that doesn't just work now, but scales gracefully.",
    action: "lean_in",
    options: [
      { label: "Impact on projects?", next: "impact" },
      { label: "Go back", next: "who" },
    ],
  },
  impact: {
    message:
      "This systemic thinking results in codebases that are stable, predictable, and significantly easier for teams to maintain over time.",
    action: "nod",
    options: [{ label: "Back to start", next: "start" }],
  },
  difference: {
    message:
      "He prioritizes clarity and simplicity over unnecessary complexity. He’d rather build the right abstraction once than patch a poor one forever.",
    action: "spin",
    options: [
      { label: "How is quality ensured?", next: "quality" },
      { label: "Go back", next: "start" },
    ],
  },
  quality: {
    message:
      "Quality is a loop of refinement. He iterates on both code and user experience until the entire system feels fluid, clear, and complete.",
    action: "nod",
    options: [{ label: "Back to start", next: "start" }],
  },
  what: {
    message:
      "He constructs modern web systems with a rigorous focus on performance, architecture, and intuitive user experiences.",
    action: "nod",
    options: [
      { label: "Frontend or backend?", next: "stack" },
      { label: "What kind of systems?", next: "systems" },
      { label: "Go back", next: "start" },
    ],
  },
  stack: {
    message:
      "He works across the full stack. He ensures the frontend is responsive and the backend is scalable, keeping the bridge between them seamless.",
    action: "lean_in",
    options: [
      { label: "How about UI?", next: "ui" },
      { label: "Go back", next: "what" },
    ],
  },
  ui: {
    message:
      "Interfaces should be invisible—fast, smooth, and natural. He builds UI that doesn't get in the user's way but enhances their workflow.",
    action: "spin",
    options: [{ label: "Back to start", next: "start" }],
  },
  systems: {
    message:
      "He specializes in integrated systems where business logic, data persistence, and real-time interaction work as a single unit.",
    action: "nod",
    options: [{ label: "Back to start", next: "start" }],
  },
  current: {
    message:
      "Right now, Jyothis is building platforms that combine highly structured logic with intelligent, adaptive behaviors.",
    action: "lean_in",
    options: [
      { label: "What kind of systems?", next: "current_systems" },
      { label: "Why this direction?", next: "current_reason" },
      { label: "Go back", next: "start" },
    ],
  },
  current_systems: {
    message:
      "The current focus is on workflow automation platforms that turn complex real-world tasks into simple, automated digital processes.",
    action: "nod",
    options: [{ label: "Back to start", next: "start" }],
  },
  current_reason: {
    message:
      "He believes the future belongs to systems driven by structured intelligence—tools that understand intent, not just clicks.",
    action: "nod",
    options: [{ label: "Back to start", next: "start" }],
  },
  why: {
    message:
      "He builds because he finds genuine satisfaction in solving complex problems through elegant, structured engineering.",
    action: "wave",
    options: [
      { label: "What drives him?", next: "drive" },
      { label: "What are his values?", next: "values" },
      { label: "Go back", next: "start" },
    ],
  },
  drive: {
    message:
      "The core drive is transformation: taking a messy, complex problem and distilling it into a clean, usable solution.",
    action: "nod",
    options: [{ label: "Back to start", next: "start" }],
  },
  values: {
    message:
      "Clarity, performance, and real-world reliability. If it doesn't work under pressure, it's not finished.",
    action: "lean_in",
    options: [{ label: "Back to start", next: "start" }],
  },
};

// --- 3D ROBOT COMPONENT ---
const RobotScene = ({ mouse, currentAction }) => {
  const canvasRef = useRef(null);
  const robotRef = useRef({
    group: null,
    head: null,
    leftArm: null,
    rightArm: null,
    leftForearm: null,
    rightForearm: null,
    followLight: null,
    actionStartTime: 0,
    activeAction: null,
  });

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0a0a0a, 10, 50);

    const camera = new THREE.PerspectiveCamera(
      35,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
    mainLight.position.set(5, 5, 5);
    scene.add(mainLight);

    const followLight = new THREE.PointLight(0x00f2ff, 15, 20);
    scene.add(followLight);
    robotRef.current.followLight = followLight;

    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 1.0,
      roughness: 0.15,
      emissive: 0x111111,
    });
    const accentMat = new THREE.MeshStandardMaterial({
      color: 0x050505,
      metalness: 0.8,
      roughness: 0.4,
    });
    const glowMat = new THREE.MeshBasicMaterial({ color: 0x00f2ff });

    const robotGroup = new THREE.Group();

    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.35, 1.5, 32),
      chromeMat,
    );
    robotGroup.add(body);

    const headGroup = new THREE.Group();
    headGroup.position.y = 1.1;
    const skull = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.6, 0.7),
      chromeMat,
    );
    headGroup.add(skull);
    const visor = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.15, 0.1),
      accentMat,
    );
    visor.position.set(0, 0.05, 0.35);
    headGroup.add(visor);
    const visorGlow = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.03, 0.02),
      glowMat,
    );
    visorGlow.position.set(0, 0.05, 0.41);
    headGroup.add(visorGlow);
    robotRef.current.head = headGroup;
    robotGroup.add(headGroup);

    const createArm = (side) => {
      const armGroup = new THREE.Group();
      const shoulder = new THREE.Mesh(
        new THREE.SphereGeometry(0.15, 16, 16),
        accentMat,
      );
      armGroup.add(shoulder);

      const upperArm = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 0.6),
        chromeMat,
      );
      upperArm.position.y = -0.3;
      armGroup.add(upperArm);

      const forearmGroup = new THREE.Group();
      forearmGroup.position.y = -0.6;
      const elbow = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 12, 12),
        accentMat,
      );
      forearmGroup.add(elbow);

      const lowerArm = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 0.6),
        chromeMat,
      );
      lowerArm.position.y = -0.3;
      forearmGroup.add(lowerArm);

      const hand = new THREE.Mesh(
        new THREE.BoxGeometry(0.15, 0.15, 0.05),
        accentMat,
      );
      hand.position.y = -0.65;
      forearmGroup.add(hand);

      armGroup.add(forearmGroup);
      armGroup.position.set(side === "left" ? -0.65 : 0.65, 0.5, 0);

      return { armGroup, forearmGroup };
    };

    const leftArmData = createArm("left");
    const rightArmData = createArm("right");

    robotRef.current.leftArm = leftArmData.armGroup;
    robotRef.current.leftForearm = leftArmData.forearmGroup;
    robotRef.current.rightArm = rightArmData.armGroup;
    robotRef.current.rightForearm = rightArmData.forearmGroup;

    robotGroup.add(leftArmData.armGroup);
    robotGroup.add(rightArmData.armGroup);

    scene.add(robotGroup);
    robotRef.current.group = robotGroup;

    const updateLayout = () => {
      const isMobile = window.innerWidth < 768;
      robotGroup.position.set(isMobile ? 0 : -2.5, isMobile ? 1.5 : -0.2, 0);
      robotGroup.scale.set(1.4, 1.4, 1.4);
    };
    updateLayout();

    const clock = new THREE.Clock();

    const animate = () => {
      const t = clock.getElapsedTime();
      const actionT = t - robotRef.current.actionStartTime;
      requestAnimationFrame(animate);

      if (robotRef.current.followLight) {
        robotRef.current.followLight.position.x = mouse.current.x * 8;
        robotRef.current.followLight.position.y = mouse.current.y * 8;
        robotRef.current.followLight.position.z = 4;
      }

      if (robotRef.current.head) {
        robotRef.current.head.rotation.y = THREE.MathUtils.lerp(
          robotRef.current.head.rotation.y,
          mouse.current.x * 0.6,
          0.05,
        );
        robotRef.current.head.rotation.x = THREE.MathUtils.lerp(
          robotRef.current.head.rotation.x,
          -mouse.current.y * 0.3,
          0.05,
        );
      }

      if (robotRef.current.group) {
        robotRef.current.group.position.y += Math.sin(t * 1.5) * 0.002;
        robotRef.current.group.rotation.z = Math.sin(t * 0.5) * 0.02;

        robotRef.current.leftArm.rotation.z = THREE.MathUtils.lerp(
          robotRef.current.leftArm.rotation.z,
          0.2 + Math.sin(t) * 0.05,
          0.1,
        );
        robotRef.current.rightArm.rotation.z = THREE.MathUtils.lerp(
          robotRef.current.rightArm.rotation.z,
          -0.2 - Math.sin(t) * 0.05,
          0.1,
        );
      }

      const action = robotRef.current.activeAction;

      if (action === "wave" && actionT < 3) {
        robotRef.current.leftArm.rotation.z = THREE.MathUtils.lerp(
          robotRef.current.leftArm.rotation.z,
          2.5,
          0.1,
        );
        robotRef.current.leftForearm.rotation.x = Math.sin(actionT * 8) * 0.5;
      } else if (action === "dance") {
        robotRef.current.group.position.y += Math.sin(actionT * 12) * 0.05;
        robotRef.current.leftArm.rotation.z =
          1.5 + Math.sin(actionT * 10) * 1.0;
        robotRef.current.rightArm.rotation.z =
          -1.5 + Math.cos(actionT * 10) * 1.0;
        robotRef.current.head.rotation.z = Math.sin(actionT * 10) * 0.3;
      } else {
        robotRef.current.leftForearm.rotation.x = THREE.MathUtils.lerp(
          robotRef.current.leftForearm.rotation.x,
          0,
          0.1,
        );
        robotRef.current.head.rotation.z = THREE.MathUtils.lerp(
          robotRef.current.head.rotation.z,
          0,
          0.1,
        );
      }

      if (action === "nod" && actionT < 2) {
        robotRef.current.head.rotation.x += Math.sin(actionT * 10) * 0.1;
      }

      if (action === "spin" && actionT < 1.5) {
        robotRef.current.group.rotation.y += 0.2;
      } else if (action !== "dance") {
        robotRef.current.group.rotation.y = THREE.MathUtils.lerp(
          robotRef.current.group.rotation.y,
          0,
          0.05,
        );
      }

      if (action === "lean_in" && actionT < 3) {
        robotRef.current.group.position.z = THREE.MathUtils.lerp(
          robotRef.current.group.position.z,
          2,
          0.05,
        );
        robotRef.current.group.rotation.x = THREE.MathUtils.lerp(
          robotRef.current.group.rotation.x,
          0.2,
          0.05,
        );
      } else if (action !== "dance") {
        robotRef.current.group.position.z = THREE.MathUtils.lerp(
          robotRef.current.group.position.z,
          0,
          0.05,
        );
        robotRef.current.group.rotation.x = THREE.MathUtils.lerp(
          robotRef.current.group.rotation.x,
          0,
          0.05,
        );
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      updateLayout();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (currentAction) {
      robotRef.current.activeAction = currentAction;
      robotRef.current.actionStartTime = performance.now() / 1000;
    }
  }, [currentAction]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-10 pointer-events-none"
    />
  );
};

const MessageBubble = ({ message, isBot }) => (
  <motion.div
    initial={{ opacity: 0, y: 10, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    className={`flex ${isBot ? "justify-start" : "justify-end"} mb-4`}
  >
    <div
      className={`flex gap-3 max-w-[85%] ${isBot ? "flex-row" : "flex-row-reverse"}`}
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
          isBot
            ? "bg-cyan-500/10 border-cyan-500/30"
            : "bg-white/10 border-white/20"
        }`}
      >
        {isBot ? (
          <Cpu className="w-4 h-4 text-cyan-400" />
        ) : (
          <User className="w-4 h-4 text-gray-300" />
        )}
      </div>
      <div
        className={`p-4 rounded-2xl text-sm leading-relaxed backdrop-blur-md border ${
          isBot
            ? "bg-white/5 border-white/10 text-gray-200 rounded-tl-none"
            : "bg-cyan-500/20 border-cyan-500/30 text-white rounded-tr-none shadow-[0_0_20px_rgba(6,182,212,0.1)]"
        }`}
      >
        {message}
      </div>
    </div>
  </motion.div>
);

const TypingIndicator = () => (
  <div className="flex gap-2 p-4 mb-4 bg-white/5 border border-white/10 rounded-2xl rounded-tl-none w-16 ml-11">
    <motion.div
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ repeat: Infinity, duration: 0.6 }}
      className="w-1.5 h-1.5 bg-cyan-400 rounded-full"
    />
    <motion.div
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
      className="w-1.5 h-1.5 bg-cyan-400 rounded-full"
    />
    <motion.div
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
      className="w-1.5 h-1.5 bg-cyan-400 rounded-full"
    />
  </div>
);

export default function App() {
  const [history, setHistory] = useState([]);
  const [currentNode, setCurrentNode] = useState("start");
  const [isTyping, setIsTyping] = useState(false);
  const [robotAction, setRobotAction] = useState(null);
  const mouse = useRef({ x: 0, y: 0 });
  const chatEndRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleBotResponse("start");
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, isTyping]);

  const handleBotResponse = async (nodeKey) => {
    setIsTyping(true);
    setRobotAction(null);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const node = CONVERSATION_FLOW[nodeKey];
    if (node) {
      setHistory((prev) => [
        ...prev,
        { text: node.message, isBot: true, nodeKey },
      ]);
      setCurrentNode(nodeKey);
      setRobotAction(node.action);
    }
    setIsTyping(false);
  };

  const triggerQuickAction = (e, action, label) => {
    e.preventDefault();
    setHistory((prev) => [...prev, { text: label, isBot: false }]);
    setRobotAction(null);
    setTimeout(() => setRobotAction(action), 50);
  };

  const handleOptionClick = (e, option) => {
    e.preventDefault();
    setHistory((prev) => [...prev, { text: option.label, isBot: false }]);
    handleBotResponse(option.next);
  };

  const handleMouseMove = (e) => {
    mouse.current = {
      x: (e.clientX / window.innerWidth) * 2 - 1,
      y: -(e.clientY / window.innerHeight) * 2 + 1,
    };
  };

  const currentOptions = CONVERSATION_FLOW[currentNode]?.options || [];

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative w-full h-screen bg-[#0A0A0A] text-white overflow-hidden flex flex-col md:flex-row"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,_rgba(6,182,212,0.15),_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,_rgba(139,92,246,0.1),_transparent_50%)]" />

      {/* Robot Scene is at z-10 */}
      <RobotScene mouse={mouse} currentAction={robotAction} />

      {/* Main container no longer has a global z-index 
         so children can have independent z-indices relative to the robot.
      */}
      <main className="relative w-full h-full flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-12">
        {/* Title Section: Set to z-0 to go BEHIND the robot (z-10) */}
        <div className="hidden md:flex flex-col justify-start pt-24 h-full w-1/2 pr-12 relative z-0 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 40 }}
              className="h-1 bg-cyan-500 rounded-full"
            />
            <h1 className="text-4xl lg:text-6xl font-black tracking-tighter leading-none opacity-60">
              JYOTHIS <br />
              <span className="text-cyan-400">ARCHITECT</span>
            </h1>
            <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">
              System Designer & Builder
            </p>
          </motion.div>
        </div>

        {/* Chat Section: Set to z-30 to stay in FRONT of the robot (z-10) */}
        <div className="w-full md:w-[450px] lg:w-[500px] h-full flex flex-col justify-end md:justify-center relative z-30">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl h-[75vh] md:h-[650px]"
          >
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse absolute -right-0.5 -bottom-0.5" />
                  <div className="w-10 h-10 rounded-full border border-cyan-500/50 flex items-center justify-center bg-cyan-500/10">
                    <Cpu className="w-5 h-5 text-cyan-400" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-sm uppercase tracking-tight">
                    System Liaison
                  </h3>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                    Interactive Unit
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setHistory([]);
                  handleBotResponse("start");
                }}
                className="p-2 hover:bg-white/5 rounded-full transition-colors group"
              >
                <RefreshCcw className="w-4 h-4 text-gray-500 group-hover:text-cyan-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-2 scrollbar-hide">
              {history.map((msg, idx) => (
                <MessageBubble key={idx} message={msg.text} isBot={msg.isBot} />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={chatEndRef} />
            </div>

            <div className="p-6 bg-white/5 border-t border-white/10 space-y-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <p className="text-[10px] text-gray-500 uppercase font-bold shrink-0 mr-2">
                  Cmds:
                </p>
                <button
                  onClick={(e) =>
                    triggerQuickAction(e, "wave", "👋 Wave Hello")
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[11px] transition-colors shrink-0"
                >
                  <Hand className="w-3 h-3 text-yellow-400" /> Wave
                </button>
                <button
                  onClick={(e) =>
                    triggerQuickAction(e, "spin", "🔄 System Spin")
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[11px] transition-colors shrink-0"
                >
                  <RotateCw className="w-3 h-3 text-cyan-400" /> Spin
                </button>
                <button
                  onClick={(e) =>
                    triggerQuickAction(e, "dance", "🕺 Celebration")
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-[11px] transition-colors shrink-0"
                >
                  <Music className="w-3 h-3 text-cyan-400" /> Dance
                </button>
              </div>

              <AnimatePresence mode="wait">
                {!isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-wrap gap-2"
                  >
                    {currentOptions.map((option, idx) => (
                      <button
                        key={option.next}
                        onClick={(e) => handleOptionClick(e, option)}
                        className="group flex items-center gap-2 px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 hover:border-cyan-500/40 rounded-full text-xs font-semibold transition-all duration-300"
                      >
                        {option.icon}
                        <span>{option.label}</span>
                        <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </main>

      <div className="absolute bottom-8 left-8 hidden lg:block opacity-30">
        <div className="text-[10px] space-y-1 font-mono">
          <p className="text-cyan-400 font-bold tracking-widest underline underline-offset-4 mb-2">
            SYSTEM_LOG_JYOTHIS
          </p>
          <p>MODAL: STRUCTURED_EXPLORATION</p>
          <p>GESTURES: {robotAction ? robotAction.toUpperCase() : "IDLE"}</p>
          <p>IDENTITY: VERIFIED</p>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
