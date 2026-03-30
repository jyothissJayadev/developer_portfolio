import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { Home, Briefcase, User, Mail, Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { id: "/", label: "Home", icon: Home, color: "#0a1a1f" },
  { id: "/projects", label: "Work", icon: Briefcase, color: "#0d1520" },
  { id: "/about", label: "Self", icon: User, color: "#0a1218" },
  { id: "/contact", label: "Ping", icon: Mail, color: "#080e18" },
];

// ── Cyan ping dot (matches primary accent #06b6d4) ──────────────────────────
const PingDot = () => (
  <span className="relative flex h-2 w-2">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-60" />
    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
  </span>
);

// ── Scanline overlay (subtle CRT texture on the pill) ───────────────────────
const Scanlines = () => (
  <div
    className="absolute inset-0 rounded-full pointer-events-none overflow-hidden"
    style={{ zIndex: 1 }}
  >
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage:
          "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(6,182,212,0.018) 2px, rgba(6,182,212,0.018) 4px)",
        borderRadius: "9999px",
      }}
    />
  </div>
);

// ── Floating desktop navbar (480 px +) ──────────────────────────────────────
const DesktopNav = ({ location, navigate, dims }) => {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(0);

  const activeIndex = Math.max(
    0,
    NAV_ITEMS.findIndex((i) => i.id === location.pathname),
  );
  const activeItem = NAV_ITEMS[activeIndex];

  useEffect(() => {
    const sync = () =>
      containerRef.current && setWidth(containerRef.current.offsetWidth);
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [dims]);

  const xPos = useSpring(0, { stiffness: 300, damping: 30, mass: 1 });
  const velocity = useVelocity(xPos);
  const rotation = useTransform(velocity, [-3000, 0, 3000], [-360, 0, 360]);
  const stretch = useTransform(velocity, [-2000, 0, 2000], [40, 0, 40]);

  useEffect(() => {
    if (width > 0) {
      const tw = width / NAV_ITEMS.length;
      xPos.set(activeIndex * tw + tw / 2);
    }
  }, [activeIndex, width, xPos]);

  const pathData = useTransform([xPos, stretch], ([x, s]) => {
    const dipDepth = dims.bubbleSize * 0.6 + s * 0.08;
    const dipWidth = dims.bubbleSize * 0.86 + s * 0.4;
    const lc = dims.navHeight / 2;
    const rc = width - lc;
    const ls = Math.max(lc, x - dipWidth);
    const re = Math.min(rc, x + dipWidth);
    return `M 0 0 H ${ls}
      C ${x - dipWidth * 0.45} 0, ${x - dipWidth * 0.25} ${dipDepth}, ${x} ${dipDepth}
      C ${x + dipWidth * 0.25} ${dipDepth}, ${x + dipWidth * 0.45} 0, ${re} 0
      H ${width} V ${dims.navHeight} H 0 Z`;
  });

  const bubbleX = useTransform(xPos, (x) => x - dims.bubbleSize / 2);

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100]">
      {/* Ambient glow */}
      <motion.div
        animate={{ backgroundColor: "#06b6d4" }}
        className="absolute left-1/2 -translate-x-1/2 rounded-full pointer-events-none"
        style={{
          top: "-50px",
          width: dims.navWidth * 0.7,
          height: dims.navWidth * 0.4,
          filter: "blur(60px)",
          opacity: 0.12,
        }}
      />

      {/* Cyan rim glow */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          boxShadow:
            "0 0 0 1px rgba(6,182,212,0.12), 0 0 28px 2px rgba(6,182,212,0.06)",
        }}
      />

      {/* Pill shell */}
      <div
        ref={containerRef}
        className="relative rounded-full flex items-center border border-white/5"
        style={{
          width: dims.navWidth,
          height: dims.navHeight,
          background:
            "linear-gradient(180deg, rgba(8,14,24,0.97) 0%, rgba(3,3,3,0.99) 100%)",
          backdropFilter: "blur(32px)",
          WebkitBackdropFilter: "blur(32px)",
          boxShadow:
            "0 24px 64px rgba(0,0,0,0.8), inset 0 1px 0 rgba(6,182,212,0.06)",
        }}
      >
        <Scanlines />

        {/* Top highlight */}
        <div
          className="absolute inset-x-0 top-0 h-px rounded-full pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(6,182,212,0.18) 30%, rgba(6,182,212,0.18) 70%, transparent)",
            zIndex: 2,
          }}
        />

        {/* SVG dip */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
          style={{ borderRadius: "9999px", zIndex: 2 }}
        >
          <motion.path
            d={pathData}
            animate={{ fill: activeItem.color }}
            clipPath="inset(0 0 0 0 round 9999px)"
            style={{ opacity: 0.95 }}
            transition={{ fill: { duration: 0.7 } }}
          />
        </svg>

        {/* Rolling bubble */}
        <motion.div
          className="absolute pointer-events-none"
          style={{ top: dims.bubbleTop, x: bubbleX, zIndex: 50 }}
        >
          <motion.div
            className="rounded-full flex items-center justify-center relative overflow-hidden"
            animate={{ backgroundColor: activeItem.color }}
            style={{
              width: dims.bubbleSize,
              height: dims.bubbleSize,
              rotate: rotation,
              boxShadow: `0 0 0 1px rgba(6,182,212,0.2), 0 8px 28px rgba(0,0,0,0.7)`,
              border: "1px solid rgba(6,182,212,0.15)",
            }}
            transition={{ backgroundColor: { duration: 0.7 } }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/60" />
            {/* Cyan specular */}
            <div
              className="absolute rounded-full"
              style={{
                top: "10%",
                left: "16%",
                width: "28%",
                height: "28%",
                background:
                  "radial-gradient(circle, rgba(6,182,212,0.5) 0%, transparent 70%)",
                filter: "blur(2px)",
              }}
            />
            <motion.div
              style={{ rotate: useTransform(rotation, (r) => -r), zIndex: 2 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeItem.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  {React.createElement(activeItem.icon, {
                    size: dims.iconSize,
                    color: "#06b6d4",
                    strokeWidth: 2,
                  })}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Tabs */}
        <div
          className="relative w-full flex justify-around items-center"
          style={{ zIndex: 10, paddingLeft: 8, paddingRight: 8 }}
        >
          {NAV_ITEMS.map((item, idx) => {
            const isActive = location.pathname === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className="relative flex flex-col items-center justify-center outline-none cursor-pointer group"
                style={{ width: dims.tabWidth, height: dims.tabHeight }}
              >
                {/* Active ping dot */}
                {isActive && (
                  <div className="absolute top-1 right-1">
                    <PingDot />
                  </div>
                )}
                <motion.div
                  animate={{
                    y: isActive ? dims.labelY : 0,
                    opacity: isActive ? 1 : 0.35,
                    scale: isActive ? 0.8 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  className="flex flex-col items-center gap-0.5"
                >
                  {!isActive && (
                    <item.icon
                      size={dims.inactiveIconSize}
                      color="rgba(156,163,175,0.7)"
                      strokeWidth={1.5}
                    />
                  )}
                  <span
                    className="font-bold uppercase tracking-widest"
                    style={{
                      fontSize: dims.fontSize,
                      color: isActive ? "#06b6d4" : "rgba(156,163,175,0.5)",
                      letterSpacing: "0.12em",
                    }}
                  >
                    {item.label}
                  </span>
                </motion.div>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

// ── Mobile top drawer (< 480 px) ─────────────────────────────────────────────
const MobileNav = ({ location, navigate }) => {
  const [open, setOpen] = useState(false);
  const activeItem =
    NAV_ITEMS.find((i) => i.id === location.pathname) ?? NAV_ITEMS[0];

  const handleNav = (id) => {
    navigate(id);
    setOpen(false);
  };

  return (
    <>
      {/* ── Fixed top bar ── */}
      <div
        className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-4"
        style={{
          height: 56,
          background:
            "linear-gradient(180deg, rgba(3,3,3,0.98) 0%, rgba(5,5,8,0.92) 100%)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(6,182,212,0.08)",
          boxShadow: "0 4px 32px rgba(0,0,0,0.6)",
        }}
      >
        {/* Brand / active route label */}
        <div className="flex items-center gap-2.5">
          <PingDot />
          <motion.span
            key={activeItem.id}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-sm font-bold tracking-widest uppercase"
            style={{ color: "#06b6d4", letterSpacing: "0.15em" }}
          >
            {activeItem.label}
          </motion.span>
        </div>

        {/* Hamburger toggle */}
        <motion.button
          onClick={() => setOpen((v) => !v)}
          whileTap={{ scale: 0.88 }}
          className="relative flex items-center justify-center rounded-full outline-none"
          style={{
            width: 38,
            height: 38,
            background: open
              ? "rgba(6,182,212,0.12)"
              : "rgba(255,255,255,0.04)",
            border: "1px solid",
            borderColor: open
              ? "rgba(6,182,212,0.3)"
              : "rgba(255,255,255,0.06)",
            transition: "background 0.25s, border-color 0.25s",
          }}
        >
          <AnimatePresence mode="wait">
            {open ? (
              <motion.div
                key="x"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <X size={16} color="#06b6d4" strokeWidth={2} />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <Menu size={16} color="rgba(156,163,175,0.8)" strokeWidth={2} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cyan ring pulse on open */}
          {open && (
            <motion.div
              className="absolute inset-0 rounded-full"
              initial={{ opacity: 0.5, scale: 1 }}
              animate={{ opacity: 0, scale: 1.6 }}
              transition={{ duration: 0.5 }}
              style={{ border: "1px solid #06b6d4" }}
            />
          )}
        </motion.button>
      </div>

      {/* ── Dropdown drawer ── */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[90]"
              style={{
                background: "rgba(3,3,3,0.7)",
                backdropFilter: "blur(4px)",
              }}
              onClick={() => setOpen(false)}
            />

            {/* Drawer panel */}
            <motion.div
              key="drawer"
              initial={{ opacity: 0, y: -16, scaleY: 0.92 }}
              animate={{ opacity: 1, y: 0, scaleY: 1 }}
              exit={{ opacity: 0, y: -12, scaleY: 0.94 }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              className="fixed left-3 right-3 z-[99] rounded-2xl overflow-hidden"
              style={{
                top: 64,
                background:
                  "linear-gradient(160deg, rgba(8,14,24,0.98) 0%, rgba(3,3,3,0.99) 100%)",
                border: "1px solid rgba(6,182,212,0.1)",
                boxShadow:
                  "0 24px 64px rgba(0,0,0,0.85), inset 0 1px 0 rgba(6,182,212,0.07)",
                transformOrigin: "top center",
              }}
            >
              {/* Top cyan line */}
              <div
                style={{
                  height: 1,
                  background:
                    "linear-gradient(90deg, transparent, #06b6d4 40%, #06b6d4 60%, transparent)",
                  opacity: 0.35,
                }}
              />

              {/* Nav items */}
              <div className="p-3 flex flex-col gap-1.5">
                {NAV_ITEMS.map((item, idx) => {
                  const isActive = location.pathname === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: idx * 0.055,
                        type: "spring",
                        stiffness: 400,
                        damping: 28,
                      }}
                      onClick={() => handleNav(item.id)}
                      className="relative flex items-center gap-3.5 w-full rounded-xl outline-none text-left overflow-hidden"
                      style={{
                        padding: "11px 14px",
                        background: isActive
                          ? "rgba(6,182,212,0.08)"
                          : "rgba(255,255,255,0.02)",
                        border: "1px solid",
                        borderColor: isActive
                          ? "rgba(6,182,212,0.18)"
                          : "rgba(255,255,255,0.04)",
                        transition: "background 0.2s, border-color 0.2s",
                      }}
                    >
                      {/* Active left accent bar */}
                      {isActive && (
                        <motion.div
                          layoutId="mobile-active-bar"
                          className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full"
                          style={{ background: "#06b6d4" }}
                        />
                      )}

                      {/* Icon container */}
                      <div
                        className="flex items-center justify-center rounded-lg flex-shrink-0"
                        style={{
                          width: 36,
                          height: 36,
                          background: isActive
                            ? "rgba(6,182,212,0.1)"
                            : "rgba(255,255,255,0.04)",
                          border: "1px solid",
                          borderColor: isActive
                            ? "rgba(6,182,212,0.2)"
                            : "rgba(255,255,255,0.05)",
                        }}
                      >
                        <item.icon
                          size={16}
                          color={isActive ? "#06b6d4" : "rgba(156,163,175,0.6)"}
                          strokeWidth={isActive ? 2 : 1.5}
                        />
                      </div>

                      {/* Label */}
                      <span
                        className="text-sm font-bold uppercase tracking-widest"
                        style={{
                          color: isActive
                            ? "#06b6d4"
                            : "rgba(156,163,175,0.55)",
                          letterSpacing: "0.12em",
                          fontSize: 11,
                        }}
                      >
                        {item.label}
                      </span>

                      {/* Active ping */}
                      {isActive && (
                        <div className="ml-auto">
                          <PingDot />
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Bottom grid line decoration */}
              <div
                className="mx-3 mb-3 rounded-lg"
                style={{
                  height: 28,
                  background:
                    "repeating-linear-gradient(90deg, rgba(6,182,212,0.04) 0px, rgba(6,182,212,0.04) 1px, transparent 1px, transparent 24px)",
                  border: "1px solid rgba(6,182,212,0.05)",
                }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

// ── Root export ──────────────────────────────────────────────────────────────
const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [dims, setDims] = useState({
    navWidth: 400,
    navHeight: 60,
    bubbleSize: 56,
    bubbleTop: -26,
    iconSize: 24,
    inactiveIconSize: 18,
    fontSize: 8,
    tabWidth: 56,
    tabHeight: 56,
    labelY: 28,
  });

  useEffect(() => {
    const compute = () => {
      const vw = window.innerWidth;
      setIsMobile(vw < 480);
      if (vw >= 480) {
        if (vw < 640) {
          setDims({
            navWidth: Math.min(vw - 32, 380),
            navHeight: 58,
            bubbleSize: 52,
            bubbleTop: -24,
            iconSize: 22,
            inactiveIconSize: 17,
            fontSize: 7,
            tabWidth: 52,
            tabHeight: 52,
            labelY: 26,
          });
        } else {
          setDims({
            navWidth: 400,
            navHeight: 60,
            bubbleSize: 56,
            bubbleTop: -26,
            iconSize: 24,
            inactiveIconSize: 18,
            fontSize: 8,
            tabWidth: 56,
            tabHeight: 56,
            labelY: 28,
          });
        }
      }
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  if (isMobile) {
    return <MobileNav location={location} navigate={navigate} />;
  }
  return <DesktopNav location={location} navigate={navigate} dims={dims} />;
};

export default Navbar;
