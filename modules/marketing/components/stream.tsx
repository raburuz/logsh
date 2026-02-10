"use client"
import React, { useEffect, useRef } from 'react';

const ClarityStream = () => {
  const canvasRef = useRef<any>(null);
  const containerRef = useRef<any>(null);
  const animationFrameRef = useRef<any>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false });
    let width: number, height: number, dpr: number;
    let time = 0;

    const numLines = 50;
    const segments = 30;

    // Precompute x positions
    const xPos = new Float32Array(segments + 1);
    for (let i = 0; i <= segments; i++) {
      xPos[i] = i / segments;
    }

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // Precompute gradients
    const createGradients = () => {
      const gradients = [];
      for (let i = 0; i < numLines; i++) {
        const g = ctx.createLinearGradient(0, 0, width, 0);
        const p = i / numLines;
        g.addColorStop(0, `rgba(${255 - p * 50},${120 + p * 40},${80 + p * 60},0.25)`);
        g.addColorStop(0.5, `rgba(${180 + p * 30},${100 + p * 40},${220},0.3)`);
        g.addColorStop(1, `rgba(${100 + p * 80},${140 + p * 80},255,0.35)`);
        gradients.push(g);
      }
      return gradients;
    };

    resize();
    let gradients = createGradients();

    const animate = () => {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, width, height);
      time += 0.0008;

      const yBase = height * 0.65;
      const amp = height * 0.12;

      for (let l = 0; l < numLines; l++) {
        // Offset each line in time to create a flowing effect
        const offset = l * 0.08;
        // Add a tightness factor to create a more dynamic wave pattern default 0
        const tight = (l - numLines / 2) * 10.8;
        ctx.beginPath();

        for (let i = 0; i <= segments; i++) {
          const p = xPos[i];
          const x = p * width;

          // Combine multiple sine waves for a more complex motion
          const y =
            yBase +
            Math.sin(p * 4 + time + offset) * amp +
            Math.sin(p * 8 - time * 0.7 + offset) * amp * 0.2 +
            tight;

          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.strokeStyle = gradients[l];
        // Line width based on position to create depth effect
        ctx.lineWidth = 1 + (l / numLines) * 20.3;
        ctx.stroke();
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      resize();
      gradients = createGradients();
    };

    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className='absolute inset-0 z-0 -bottom-48 opacity-50'
      style={{
        background: 'linear-gradient(to bottom, #0a0a0f, #000)',
        overflow: 'hidden',
      }}
    >
      <canvas
        ref={canvasRef}
        className='w-full h-full'
      />
      <div className="absolute left-0 top-0 bottom-0 w-96 bg-linear-to-r from-black to-transparent z-10"></div>
      <div className="absolute right-0 top-0 bottom-0 w-96 bg-linear-to-l from-black to-transparent z-10"></div>
      <div className="absolute bottom-0 w-full h-96 bg-linear-to-t from-black to-transparent z-10"></div>
    </div>
  );
};

export default ClarityStream;