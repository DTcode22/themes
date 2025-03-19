'use client';

import { useEffect, useRef } from 'react';

export default function EnhancedMatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Enhanced symbols including numbers and code characters
    const baseSymbols =
      '01234567890アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンΔΘΛΞΠΣΦΨΩ∞⊕⊗∭∂∫≈≠≤≥⌈⌉⌊⌋';
    const codeSymbols = '{}[]()<>:;+-*/=&|!?%@#$_~';
    const numberSymbols = '0123456789';
    const symbols = baseSymbols + codeSymbols + numberSymbols.repeat(3); // Emphasize numbers

    const fontBase = 16;
    const columns: {
      x: number;
      y: number;
      speed: number;
      lastUpdate: number;
      direction: 'left' | 'right' | 'center' | 'vortex';
      symbol: string;
      size: number;
      opacity: number;
      color: string;
      timeInterval: number; // Randomized time interval
    }[] = [];

    let animationFrameId: number;
    let lastTime = 0;
    let pulsePhase = 0;
    let vortexAngle = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initializeColumns();
    };

    const initializeColumns = () => {
      columns.length = 0;
      const columnsCount = Math.floor(canvas.width / fontBase) * 1.5;

      // Create columns with multiple flow patterns
      for (let i = 0; i < columnsCount; i++) {
        // More varied flow patterns with emphasis on vortex
        const directionOptions = [
          'left',
          'right',
          'center',
          'vortex',
          'vortex',
          'vortex',
        ];
        const direction = directionOptions[
          Math.floor(Math.random() * directionOptions.length)
        ] as 'left' | 'right' | 'center' | 'vortex';

        let x: number;
        if (direction === 'left') {
          x = canvas.width - Math.random() * (canvas.width * 0.5);
        } else if (direction === 'right') {
          x = Math.random() * (canvas.width * 0.5);
        } else if (direction === 'center') {
          x = Math.random() * canvas.width;
        } else {
          // vortex
          const angle = Math.random() * Math.PI * 2;
          const radius = Math.min(canvas.width, canvas.height) * 0.4;
          x = canvas.width / 2 + Math.cos(angle) * radius;
        }

        const y =
          direction === 'vortex'
            ? canvas.height / 2 +
              Math.sin(Math.random() * Math.PI * 2) *
                (Math.min(canvas.width, canvas.height) * 0.4)
            : Math.random() * canvas.height * 0.3;

        // More likely to be a number for vortex elements
        const symbol =
          direction === 'vortex' && Math.random() > 0.6
            ? numberSymbols.charAt(
                Math.floor(Math.random() * numberSymbols.length)
              )
            : symbols.charAt(Math.floor(Math.random() * symbols.length));

        // Randomize opacity and size for depth effect
        const opacity = Math.random() * 0.5 + 0.5;
        const size = Math.random() * 10 + fontBase;

        // Randomize the green shade for variety
        const greenValue = Math.floor(Math.random() * 50 + 205);
        const color = `rgba(0, ${greenValue}, 0, ${opacity})`;

        // Highly randomized time intervals for varied speeds
        const timeInterval = Math.random() * 200 + 20;

        columns.push({
          x,
          y,
          speed:
            (Math.random() * 1.5 + 0.5) * (direction === 'vortex' ? 0.5 : 1),
          lastUpdate: Math.random() * 500,
          direction,
          symbol,
          size,
          opacity,
          color,
          timeInterval,
        });
      }
    };

    const drawMatrix = (timestamp: number) => {
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;

      // Fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update pulse effect
      pulsePhase += deltaTime * 0.001;
      const pulseIntensity = Math.sin(pulsePhase) * 0.2 + 0.8;

      // Update vortex angle
      vortexAngle += deltaTime * 0.0005;

      // Draw grid with pulsing effect
      drawGrid(ctx, canvas, fontBase * 4, pulseIntensity);

      // Draw symbols
      for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        column.lastUpdate += deltaTime;

        // Use randomized time interval for each column
        if (column.lastUpdate > column.timeInterval / column.speed) {
          // Draw the current symbol
          ctx.font = `${column.size}px monospace`;
          ctx.fillStyle = column.color;
          ctx.fillText(column.symbol, column.x, column.y);

          // Occasionally change symbol (more frequently for vortex elements)
          if (Math.random() > (column.direction === 'vortex' ? 0.7 : 0.9)) {
            if (column.direction === 'vortex' && Math.random() > 0.6) {
              column.symbol = numberSymbols.charAt(
                Math.floor(Math.random() * numberSymbols.length)
              );
            } else {
              column.symbol = symbols.charAt(
                Math.floor(Math.random() * symbols.length)
              );
            }

            // Sometimes change the time interval too
            if (Math.random() > 0.8) {
              column.timeInterval = Math.random() * 200 + 20;
            }
          }

          // Move based on direction
          if (column.direction === 'left') {
            column.x -= column.speed;
            column.y += column.speed;
          } else if (column.direction === 'right') {
            column.x += column.speed;
            column.y += column.speed;
          } else if (column.direction === 'center') {
            // Move toward the center of the screen
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const angle = Math.atan2(centerY - column.y, centerX - column.x);
            column.x += Math.cos(angle) * column.speed;
            column.y += Math.sin(angle) * column.speed;
          } else if (column.direction === 'vortex') {
            // Create spiral motion
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const dx = column.x - centerX;
            const dy = column.y - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Calculate current angle and move it
            const angle = Math.atan2(dy, dx) + column.speed * 0.02;

            // Pull slightly inward for spiral effect
            const newRadius = distance - column.speed * 0.2;

            // Update position based on new angle and radius
            column.x = centerX + Math.cos(angle) * newRadius;
            column.y = centerY + Math.sin(angle) * newRadius;

            // Reset if too close to center
            if (newRadius < 20) {
              const newAngle = Math.random() * Math.PI * 2;
              const newRadius = Math.min(canvas.width, canvas.height) * 0.4;
              column.x = centerX + Math.cos(newAngle) * newRadius;
              column.y = centerY + Math.sin(newAngle) * newRadius;
            }
          }

          // Reset when out of bounds
          if (
            column.y > canvas.height ||
            column.x < -50 ||
            column.x > canvas.width + 50
          ) {
            resetColumn(column, canvas);
          }

          column.lastUpdate = 0;
        }
      }

      animationFrameId = requestAnimationFrame(drawMatrix);
    };

    const resetColumn = (
      column: (typeof columns)[0],
      canvas: HTMLCanvasElement
    ) => {
      if (column.direction === 'left') {
        column.x = canvas.width - Math.random() * (canvas.width * 0.3);
        column.y = Math.random() * (canvas.height * 0.3);
      } else if (column.direction === 'right') {
        column.x = Math.random() * (canvas.width * 0.3);
        column.y = Math.random() * (canvas.height * 0.3);
      } else if (column.direction === 'center') {
        // Reset to a random edge position
        const edge = Math.floor(Math.random() * 4);
        switch (edge) {
          case 0: // Top
            column.x = Math.random() * canvas.width;
            column.y = 0;
            break;
          case 1: // Right
            column.x = canvas.width;
            column.y = Math.random() * canvas.height;
            break;
          case 2: // Bottom
            column.x = Math.random() * canvas.width;
            column.y = canvas.height;
            break;
          case 3: // Left
            column.x = 0;
            column.y = Math.random() * canvas.height;
            break;
        }
      } else {
        // vortex
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.min(canvas.width, canvas.height) * 0.4;
        column.x = canvas.width / 2 + Math.cos(angle) * radius;
        column.y = canvas.height / 2 + Math.sin(angle) * radius;
      }

      // Randomize properties for variety
      column.speed =
        (Math.random() * 1.5 + 0.5) * (column.direction === 'vortex' ? 0.5 : 1);
      column.size = Math.random() * 10 + fontBase;
      column.timeInterval = Math.random() * 200 + 20; // Reset time interval too

      // More likely to be a number for vortex elements
      if (column.direction === 'vortex' && Math.random() > 0.6) {
        column.symbol = numberSymbols.charAt(
          Math.floor(Math.random() * numberSymbols.length)
        );
      } else {
        column.symbol = symbols.charAt(
          Math.floor(Math.random() * symbols.length)
        );
      }

      const greenValue = Math.floor(Math.random() * 50 + 205);
      column.color = `rgba(0, ${greenValue}, 0, ${column.opacity})`;
    };

    const drawGrid = (
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
      gridSize: number,
      intensity: number
    ) => {
      ctx.strokeStyle = `rgba(0, 255, 0, ${0.1 * intensity})`;
      ctx.lineWidth = 1;

      // Draw diagonal grid lines
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(Math.PI / 4 + Math.sin(pulsePhase * 0.5) * 0.05); // Slight rotation animation
      ctx.translate(-canvas.width / 2, -canvas.height / 2);

      // Horizontal grid lines
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

      // Add a subtle circular grid pattern
      ctx.restore();
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      const maxRadius =
        Math.sqrt(canvas.width * canvas.width + canvas.height * canvas.height) /
        2;

      for (let r = gridSize; r < maxRadius; r += gridSize) {
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 255, 0, ${
          0.05 * intensity * (1 - r / maxRadius)
        })`;
        ctx.stroke();
      }

      // Add radiating lines
      const lineCount = 12;
      for (let i = 0; i < lineCount; i++) {
        ctx.beginPath();
        const angle = (i / lineCount) * Math.PI * 2 + vortexAngle;
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(angle) * maxRadius, Math.sin(angle) * maxRadius);
        ctx.strokeStyle = `rgba(0, 255, 0, ${0.07 * intensity})`;
        ctx.stroke();
      }

      ctx.restore();
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
