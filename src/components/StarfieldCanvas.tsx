import {useEffect, useRef} from 'react';

interface Star {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  speed: number;
  phase: number;
  tint: string;
}

const STAR_TINTS = [
  '255, 255, 255',
  '186, 230, 253',
  '253, 224, 171',
  '221, 214, 254',
  '251, 207, 232',
];

export function StarfieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    let animationFrameId = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const setCanvasSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    setCanvasSize();

    const starCount = Math.min(Math.floor((width * height) / 14000), 140);
    const stars: Star[] = Array.from({length: starCount}, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.45 + 0.35,
      baseAlpha: Math.random() * 0.55 + 0.2,
      speed: Math.random() * 0.14 + 0.03,
      phase: Math.random() * Math.PI * 2,
      tint: STAR_TINTS[Math.floor(Math.random() * STAR_TINTS.length)],
    }));

    const renderFrame = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      const scrollOffset = window.scrollY * 0.08;

      for (const star of stars) {
        const yWrapped = (star.y - scrollOffset * star.speed * 4 + height * 10) % height;
        const twinkle = prefersReducedMotion
          ? star.baseAlpha
          : star.baseAlpha + Math.sin(time * 0.0014 + star.phase) * 0.22;

        ctx.beginPath();
        ctx.arc(star.x, yWrapped, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${star.tint}, ${Math.max(0.08, Math.min(0.95, twinkle))})`;
        ctx.fill();

        if (!prefersReducedMotion) {
          star.x += star.speed * 0.08;
          if (star.x > width + 4) star.x = -4;
        }
      }

      if (!prefersReducedMotion) {
        animationFrameId = window.requestAnimationFrame(renderFrame);
      }
    };

    if (prefersReducedMotion) {
      renderFrame(0);
    } else {
      animationFrameId = window.requestAnimationFrame(renderFrame);
    }

    window.addEventListener('resize', setCanvasSize);

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 opacity-80"
    />
  );
}
