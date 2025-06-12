/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface BubbleProps {
  size: number;
  position: { x: number; y: number };
  color: string;
  animationDuration: number;
  animationDelay: number;
}

const Bubble = ({ size, position, color, animationDuration, animationDelay }: BubbleProps) => {
  return (
    <div
      className="absolute rounded-full blur-xl opacity-30"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        left: `${position.x}%`,
        top: `${position.y}%`,
        backgroundColor: color,
        animation: `float ${animationDuration}s ease-in-out infinite`,
        animationDelay: `${animationDelay}s`,
      }}
    />
  );
};

export function FloatingBubbles() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [bubbles, setBubbles] = useState<BubbleProps[]>([]);

  useEffect(() => {
    const generateBubbles = () => {
      const newBubbles: BubbleProps[] = [];
      const bubbleCount = 20;

      for (let i = 0; i < bubbleCount; i++) {
        const size = Math.random() * 200 + 80;
        const position = {
          x: Math.random() * 100,
          y: Math.random() * 100,
        };

        const isGreen = i % 2 === 0;
        const colorIntensity = Math.floor(Math.random() * 40) + 60;

        let color;
        if (isGreen) {
          color = `rgba(34, 197, 94, 0.3)`; // Green
        } else {
          color = `rgba(249, 115, 22, 0.3)`; // Orange
        }

        const animationDuration = Math.random() * 25 + 15;
        const animationDelay = Math.random() * 8;

        newBubbles.push({
          size,
          position,
          color,
          animationDuration,
          animationDelay,
        });
      }

      setBubbles(newBubbles);
    };

    generateBubbles();
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) translateX(0) scale(1);
          }
          25% {
            transform: translateY(-30px) translateX(15px) scale(1.1);
          }
          50% {
            transform: translateY(-15px) translateX(-20px) scale(0.9);
          }
          75% {
            transform: translateY(20px) translateX(10px) scale(1.05);
          }
        }
      `}</style>

      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
        {bubbles.map((bubble, index) => (
          <Bubble key={index} {...bubble} />
        ))}
      </div>
    </>
  );
}
