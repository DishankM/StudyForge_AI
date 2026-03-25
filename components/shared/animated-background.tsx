"use client";

import { motion, useMotionValue, useTransform, type MotionValue } from "framer-motion";
import { useCallback } from "react";

const orbColors = [
  "rgba(255, 107, 157, 0.4)",
  "rgba(192, 111, 245, 0.4)",
  "rgba(59, 130, 246, 0.4)",
  "rgba(139, 92, 246, 0.3)",
  "rgba(236, 72, 153, 0.3)",
];

const orbSizes = [300, 400, 250, 350, 200];
const orbPositions = [
  { x: "10%", y: "20%" },
  { x: "80%", y: "30%" },
  { x: "50%", y: "70%" },
  { x: "20%", y: "60%" },
  { x: "70%", y: "80%" },
];

export function AnimatedBackground() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const { clientX, clientY } = e;
      const centerX = typeof window !== "undefined" ? window.innerWidth / 2 : 0;
      const centerY = typeof window !== "undefined" ? window.innerHeight / 2 : 0;
      mouseX.set((clientX - centerX) / 50);
      mouseY.set((clientY - centerY) / 50);
    },
    [mouseX, mouseY]
  );

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      onMouseMove={handleMouseMove}
      aria-hidden
    >
      <div className="absolute inset-0 bg-gradient-hero" />
      {orbColors.map((color, i) => (
        <Orb
          key={i}
          color={color}
          size={orbSizes[i]}
          position={orbPositions[i]}
          mouseX={mouseX}
          mouseY={mouseY}
          delay={i * 0.2}
        />
      ))}
    </div>
  );
}

function Orb({
  color,
  size,
  position,
  mouseX,
  mouseY,
  delay,
}: {
  color: string;
  size: number;
  position: { x: string; y: string };
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  delay: number;
}) {
  const x = useTransform(mouseX, [-20, 20], [-30, 30]);
  const y = useTransform(mouseY, [-20, 20], [-30, 30]);

  return (
    <motion.div
      className="absolute rounded-full blur-3xl pointer-events-none"
      style={{
        left: position.x,
        top: position.y,
        width: size,
        height: size,
        background: color,
        x,
        y,
      }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.4, 0.6, 0.4],
      }}
      transition={{
        duration: 4 + delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}
