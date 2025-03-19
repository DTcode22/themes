'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function SpaceBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Store ref value
    const container = containerRef.current;

    let scene: THREE.Scene,
      camera: THREE.PerspectiveCamera,
      renderer: THREE.WebGLRenderer,
      particleSystem: THREE.Points;

    const dispersionCenter = new THREE.Vector3(0, 0, 0);
    const dispersionStrength = 0.3;
    const clock = new THREE.Clock();

    // Initialize the scene
    const init = () => {
      // Create scene with space background
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x000005);

      // Create camera
      const containerWidth = containerRef.current!.clientWidth;
      const containerHeight = containerRef.current!.clientHeight;
      camera = new THREE.PerspectiveCamera(
        75,
        containerWidth / containerHeight,
        0.1,
        1000
      );
      camera.position.z = 20;

      // Create renderer
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(containerWidth, containerHeight);
      containerRef.current!.appendChild(renderer.domElement);
      renderer.domElement.style.zIndex = '0';
      renderer.domElement.style.position = 'absolute';
      renderer.domElement.style.top = '0';
      renderer.domElement.style.left = '0';

      // Create particles
      createParticles();

      // Start animation
      animate();
    };

    // Generate star texture data URL
    const generateStarTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;

      const context = canvas.getContext('2d')!;
      const gradient = context.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2
      );

      gradient.addColorStop(0, 'rgba(255,255,255,1)');
      gradient.addColorStop(0.2, 'rgba(240,240,240,0.8)');
      gradient.addColorStop(0.4, 'rgba(220,220,220,0.4)');
      gradient.addColorStop(1, 'rgba(0,0,0,0)');

      context.fillStyle = gradient;
      context.fillRect(0, 0, canvas.width, canvas.height);

      return canvas.toDataURL();
    };

    // Create particles with space theme colors
    const createParticles = () => {
      const particleCount = 8000;
      const particles = new THREE.BufferGeometry();

      // Create arrays to hold particle data
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const originalPositions = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);

      // Color palette for space theme
      const starColors = [
        [1.0, 1.0, 1.0], // White
        [0.9, 0.9, 1.0], // Bluish white
        [1.0, 0.9, 0.7], // Yellowish white
        [0.9, 0.6, 0.6], // Reddish
        [0.6, 0.8, 1.0], // Blue star
        [0.7, 1.0, 0.7], // Green nebula particle
      ];

      // Generate random positions and colors
      for (let i = 0; i < particleCount * 3; i += 3) {
        // Random position in large sphere
        const radius = 15 + Math.random() * 10;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i + 2] = radius * Math.cos(phi);

        // Store original positions
        originalPositions[i] = positions[i];
        originalPositions[i + 1] = positions[i + 1];
        originalPositions[i + 2] = positions[i + 2];

        // Choose a color from the palette or random for variety
        const colorChoice =
          Math.random() > 0.7
            ? starColors[Math.floor(Math.random() * starColors.length)]
            : [Math.random(), Math.random(), Math.random()];

        colors[i] = colorChoice[0];
        colors[i + 1] = colorChoice[1];
        colors[i + 2] = colorChoice[2];

        // Varied sizes for stars
        sizes[i / 3] = Math.random() * 0.15 + 0.02;
      }

      // Set attributes
      particles.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3)
      );
      particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      particles.setAttribute(
        'originalPosition',
        new THREE.BufferAttribute(originalPositions, 3)
      );
      particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      // Create material with custom shader to allow various star sizes
      const particleMaterial = new THREE.ShaderMaterial({
        uniforms: {
          pointTexture: {
            value: new THREE.TextureLoader().load(generateStarTexture()),
          },
        },
        vertexShader: `
          attribute float size;
          attribute vec3 color;
          varying vec3 vColor;
          void main() {
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          uniform sampler2D pointTexture;
          varying vec3 vColor;
          void main() {
            gl_FragColor = vec4(vColor, 1.0) * texture2D(pointTexture, gl_PointCoord);
          }
        `,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true,
      });

      // Create particle system
      particleSystem = new THREE.Points(particles, particleMaterial);
      scene.add(particleSystem);
    };

    // Update particles based on color and dispersion center
    const updateParticles = (deltaTime: number) => {
      const positions = particleSystem.geometry.attributes.position
        .array as Float32Array;
      const originalPositions = particleSystem.geometry.attributes
        .originalPosition.array as Float32Array;
      const colors = particleSystem.geometry.attributes.color
        .array as Float32Array;

      for (let i = 0; i < positions.length; i += 3) {
        // Vector from dispersion center to particle
        const particlePos = new THREE.Vector3(
          originalPositions[i],
          originalPositions[i + 1],
          originalPositions[i + 2]
        );

        const toParticle = particlePos.clone().sub(dispersionCenter);
        const distance = toParticle.length();

        // Skip particles too close to center to avoid extreme displacement
        if (distance < 1) continue;

        // Color-based dispersion factor (different for R, G, B)
        const rFactor = (colors[i] * 1.5 - 0.5) * dispersionStrength;
        const gFactor = (colors[i + 1] * 1.5 - 0.5) * dispersionStrength;
        const bFactor = (colors[i + 2] * 1.5 - 0.5) * dispersionStrength;

        // Apply wave motion with cosmic feel
        const time = clock.getElapsedTime();
        const waveFactor = Math.sin(time * 0.3 + distance * 0.15) * 0.2;

        // Calculate new position with color dispersion
        positions[i] =
          originalPositions[i] + toParticle.x * rFactor * waveFactor;
        positions[i + 1] =
          originalPositions[i + 1] + toParticle.y * gFactor * waveFactor;
        positions[i + 2] =
          originalPositions[i + 2] + toParticle.z * bFactor * waveFactor;
      }

      // Update geometry
      particleSystem.geometry.attributes.position.needsUpdate = true;

      // Slowly rotate the particle system for cosmic movement
      particleSystem.rotation.y += 0.005 * deltaTime;
      particleSystem.rotation.x += 0.001 * deltaTime;
    };

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;

      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    // Handle mouse movement to move dispersion center
    const handleMouseMove = (event: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();

      // Calculate mouse position relative to the container
      const mouseX =
        ((event.clientX - rect.left) / containerRef.current.clientWidth) * 2 -
        1;
      const mouseY =
        -((event.clientY - rect.top) / containerRef.current.clientHeight) * 2 +
        1;

      // Move dispersion center based on mouse (limited range)
      dispersionCenter.x = mouseX * 0.6;
      dispersionCenter.y = mouseY * 0.6;
    };

    // Animation loop
    const animate = () => {
      const animationId = requestAnimationFrame(animate);

      const deltaTime = clock.getDelta();
      updateParticles(deltaTime);

      renderer.render(scene, camera);

      return () => cancelAnimationFrame(animationId);
    };

    // Initialize everything
    init();

    // Add event listeners
    window.addEventListener('resize', handleResize);
    container.addEventListener('mousemove', handleMouseMove);

    // Cleanup function uses stored reference
    return () => {
      window.removeEventListener('resize', handleResize);
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        if (renderer) {
          container.removeChild(renderer.domElement);
        }
      }
      if (scene && particleSystem) {
        scene.remove(particleSystem);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute top-0 left-0 w-full h-full z-0"
      style={{ backgroundColor: '#000005' }}
    />
  );
}
