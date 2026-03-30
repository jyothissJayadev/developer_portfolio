import { useEffect, useState } from "react";

export default function CursorGlow() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-30 transition-opacity duration-300"
      style={{
        background: `radial-gradient(600px at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.15), transparent 80%)`,
      }}
    />
  );
}
