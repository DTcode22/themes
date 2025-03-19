'use client';

import { useEffect, useRef } from 'react';

export default function MatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const symbols = '01';
    const fontBase = 16;
    const columns: number[] = [];
    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const columnsCount = Math.floor(canvas.width / fontBase);
      columns.length = 0;

      // Initialize columns at different heights
      for (let i = 0; i < columnsCount; i++) {
        columns[i] = Math.floor(Math.random() * canvas.height);
      }
    };

    const drawMatrix = () => {
      // Semi-transparent black to create fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Set the text style
      ctx.fillStyle = '#0F0'; // Matrix green
      ctx.font = `${fontBase}px monospace`;

      // Apply rotation transformation to create angled grid
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(Math.PI / 4); // 45 degree angle
      ctx.translate(-canvas.width / 2, -canvas.height / 2);

      // Draw symbols
      for (let i = 0; i < columns.length; i++) {
        // Get random symbol
        const symbol = symbols.charAt(
          Math.floor(Math.random() * symbols.length)
        );

        // Draw the symbol
        const x = i * fontBase + fontBase / 4;
        const y = columns[i] * fontBase + fontBase;

        // Vary the shade of green for depth
        const greenShade = Math.floor(Math.random() * 50 + 205);
        ctx.fillStyle = `rgba(0, ${greenShade}, 0, ${
          Math.random() * 0.5 + 0.5
        })`;

        ctx.fillText(symbol, x, y);

        // Reset to top when column reaches bottom or randomly
        if (y >= canvas.height && Math.random() > 0.99) {
          columns[i] = 0;
        } else {
          columns[i]++;
        }
      }

      // Draw grid lines
      ctx.strokeStyle = 'rgba(0, 255, 0, 0.1)';
      ctx.lineWidth = 1;

      // Horizontal grid lines
      const gridSize = fontBase * 4;
      for (let y = -canvas.height; y < canvas.height * 2; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(-canvas.width, y);
        ctx.lineTo(canvas.width * 2, y);
        ctx.stroke();
      }

      // Vertical grid lines
      for (let x = -canvas.width; x < canvas.width * 2; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, -canvas.height);
        ctx.lineTo(x, canvas.height * 2);
        ctx.stroke();
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(drawMatrix);
    };

    // Set up and start animation
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animationFrameId = requestAnimationFrame(drawMatrix);

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
