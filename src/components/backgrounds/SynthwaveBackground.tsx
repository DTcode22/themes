'use client';

import { useEffect, useRef } from 'react';

export default function SynthwaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const drawSynthwave = () => {
      // Update time
      time += 0.01;

      // Clear canvas with dark blue/purple gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#120458'); // Dark purple
      gradient.addColorStop(0.6, '#0d0221'); // Very dark purple
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw sun
      const sunGradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height * 0.85,
        0,
        canvas.width / 2,
        canvas.height * 0.85,
        canvas.height * 0.3
      );
      sunGradient.addColorStop(0, '#ff2975'); // Pink
      sunGradient.addColorStop(0.5, '#fc1142'); // Red
      sunGradient.addColorStop(1, 'rgba(252, 17, 66, 0)'); // Transparent

      ctx.beginPath();
      ctx.arc(
        canvas.width / 2,
        canvas.height * 0.85,
        canvas.height * 0.3,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = sunGradient;
      ctx.fill();

      // Draw grid
      const gridSize = 50;
      const horizonY = canvas.height * 0.8;

      // Draw horizontal grid lines
      ctx.lineWidth = 2;
      for (let i = 1; i <= 20; i++) {
        const y = horizonY - Math.pow(i, 1.5) * 15;
        if (y < 0) continue;

        const lineOpacity = (1 - i / 20) * 0.8;
        ctx.strokeStyle = `rgba(255, 41, 117, ${lineOpacity})`;

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Calculate perspective grid
      const drawVerticalGridLines = () => {
        const vanishingPointX = canvas.width / 2;

        // Draw vertical lines in perspective
        for (let x = -20; x <= 20; x++) {
          const lineOpacity = (1 - Math.abs(x) / 20) * 0.8;
          ctx.strokeStyle = `rgba(0, 255, 255, ${lineOpacity})`;

          const baseX = vanishingPointX + x * gridSize;

          ctx.beginPath();
          ctx.moveTo(baseX, horizonY);

          // Calculate curve for perspective line
          for (let y = horizonY; y <= canvas.height; y += 5) {
            const progress = (y - horizonY) / (canvas.height - horizonY);
            const distFromCenter = x * gridSize;
            const perspectiveWidth = distFromCenter * (1 + progress * 2);

            const waveFactor = Math.sin(time + y * 0.01) * 10 * progress;

            ctx.lineTo(vanishingPointX + perspectiveWidth + waveFactor, y);
          }

          ctx.stroke();
        }
      };

      drawVerticalGridLines();

      // Draw moving stars
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      for (let i = 0; i < 100; i++) {
        const x =
          Math.sin(i * 0.1 + time * 0.3) * canvas.width * 0.5 +
          canvas.width * 0.5;
        const y = ((i * canvas.height) / 100 + time * 50) % (horizonY * 0.9);
        const size = Math.random() * 2 + 1;

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Request next frame
      animationFrameId = requestAnimationFrame(drawSynthwave);
    };

    // Set up and start animation
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animationFrameId = requestAnimationFrame(drawSynthwave);

    // Clean up
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full z-0"
    />
  );
}
