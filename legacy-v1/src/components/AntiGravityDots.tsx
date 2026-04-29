import React, { useEffect, useRef } from 'react';

const AntiGravityDots: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const particles: {
      relX: number;
      relY: number;
      radius: number;
      opacity: number;
      angle: number;
      speed: number;
      x: number;
      y: number;
      vx: number;
      vy: number;
    }[] = [];

    let width = window.innerWidth;
    let height = window.innerHeight;

    // Cluster properties
    const clusterRadius = Math.min(width, height) * 0.25; // Base radius of the round-ball
    let time = 0;
    let isHovering = false;
    let currentExpansion = 1.0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const initParticles = () => {
      particles.length = 0;
      const particleCount = 900; // Dense enough to look like a solid swarm/water

      for (let i = 0; i < particleCount; i++) {
        // Generate points uniformly within a circle
        const r = clusterRadius * Math.sqrt(Math.random());
        const theta = Math.random() * 2 * Math.PI;

        const relX = r * Math.cos(theta);
        const relY = r * Math.sin(theta);

        particles.push({
          relX,
          relY,
          radius: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.5 + 0.1,
          angle: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.02 + 0.001,
          x: width / 2 + relX,
          y: height / 2 + relY,
          vx: 0,
          vy: 0,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.015; // Reduced speed

      // Base cluster center oscillates left and right
      const amplitudeX = width * 0.2;
      const clusterCenterX = width / 2 + Math.sin(time * 0.2) * amplitudeX;
      const clusterCenterY = height / 2;

      // Smoothly animate the expansion factor when hovered
      const expansionTarget = isHovering ? 2.5 : 1.0;
      currentExpansion += (expansionTarget - currentExpansion) * 0.05;

      particles.forEach((p) => {
        // Calculate the base target position including expansion
        let tx = clusterCenterX + p.relX * currentExpansion;
        let ty = clusterCenterY + p.relY * currentExpansion;

        // Apply water ripple effect when hovered
        if (isHovering) {
          const distFromCenter = Math.sqrt(p.relX * p.relX + p.relY * p.relY);
          // Ripple wave radiating outwards based on distance and time
          const rippleAmplitude = 30;
          const ripple = Math.sin(distFromCenter * 0.05 - time * 2) * rippleAmplitude;

          const angleFromCenter = Math.atan2(p.relY, p.relX);
          tx += Math.cos(angleFromCenter) * ripple;
          ty += Math.sin(angleFromCenter) * ripple;
        }

        // Add slow internal swirling
        p.angle += p.speed;
        tx += Math.cos(p.angle) * 10;
        ty += Math.sin(p.angle) * 10;

        // Spring physics to move current position (x,y) towards target (tx,ty)
        const spring = 0.05;
        const friction = 0.85;

        const ax = (tx - p.x) * spring;
        const ay = (ty - p.y) * spring;

        p.vx = (p.vx + ax) * friction;
        p.vy = (p.vy + ay) * friction;

        p.x += p.vx;
        p.y += p.vy;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 120, 150, ${p.opacity})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    const handleMouseEnter = () => {
      isHovering = true;
    };

    const handleMouseLeave = () => {
      isHovering = false;
    };

    // Initialize
    resize();
    initParticles();
    draw();

    window.addEventListener('resize', () => {
      resize();
      initParticles();
    });

    // We attach hover listeners to the whole window or a specific container
    // so moving mouse over the page triggers the effect
    window.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mousemove', handleMouseEnter);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mousemove', handleMouseEnter);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
};

export default AntiGravityDots;
