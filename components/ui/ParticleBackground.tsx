"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  r: number;
}

interface MouseState {
  x: number;
  y: number;
  nx: number;
  ny: number;
}

interface TiltState {
  x: number;
  y: number;
  tx: number;
  ty: number;
}

const CFG = {
  nodeCount: 90,
  maxDist: 180,
  grabDist: 140,
  nodeSpeed: 0.28,
  tiltAmount: 18,
  tiltSmooth: 0.055,
  nodeR: 2.2,
  // indigo palette (RGB components for interpolation)
  nodeBright: { r: 99, g: 102, b: 241 },  // #6366f1
  edgeDim:    { r: 49, g: 46,  b: 129 },  // #312e81
} as const;

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    if (!ctx) return;

    let W = 0, H = 0, cx = 0, cy = 0;
    let rafId = 0;
    let nodes: Node[] = [];
    let mouseOnScreen = false;

    const mouse: MouseState = { x: 0, y: 0, nx: 0, ny: 0 };
    const tilt: TiltState   = { x: 0, y: 0, tx: 0, ty: 0 };

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
      cx = W / 2;
      cy = H / 2;
    }

    function initNodes() {
      nodes = [];
      for (let i = 0; i < CFG.nodeCount; i++) {
        const sign = () => (Math.random() > 0.5 ? 1 : -1);
        nodes.push({
          x:  rand(0, W),
          y:  rand(0, H),
          z:  rand(0.3, 1),
          vx: rand(0, CFG.nodeSpeed) * sign(),
          vy: rand(0, CFG.nodeSpeed) * sign(),
          r:  rand(1.2, CFG.nodeR),
        });
      }
    }

    function project(node: Node) {
      const px = cx + (node.x - cx) * node.z + tilt.x * node.z * 60;
      const py = cy + (node.y - cy) * node.z + tilt.y * node.z * 60;
      return { px, py, scale: 0.5 + node.z * 0.5 };
    }

    function drawEdge(a: Node, b: Node, dist: number, maxDist: number) {
      const { px: ax, py: ay } = project(a);
      const { px: bx, py: by } = project(b);

      const mx = (ax + bx) / 2;
      const my = (ay + by) / 2;
      const md = Math.hypot(mx - mouse.x, my - mouse.y);
      const hover = Math.max(0, 1 - md / 200);

      const depth = (a.z + b.z) / 2;
      const alpha = (1 - dist / maxDist) * 0.25 * depth + hover * 0.45;

      const { r: r1, g: g1, b: b1 } = CFG.edgeDim;
      const { r: r2, g: g2, b: b2 } = CFG.nodeBright;
      const ri = Math.round(r1 + (r2 - r1) * hover);
      const gi = Math.round(g1 + (g2 - g1) * hover);
      const bi = Math.round(b1 + (b2 - b1) * hover);

      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
      ctx.strokeStyle = `rgba(${ri},${gi},${bi},${alpha})`;
      ctx.lineWidth   = depth * 0.9 + hover * 0.8;
      ctx.stroke();
    }

    function drawNode(node: Node) {
      const { px, py, scale } = project(node);
      const md     = Math.hypot(px - mouse.x, py - mouse.y);
      const hover  = Math.max(0, 1 - md / 90);
      const radius = node.r * scale + hover * 2.5;
      const alpha  = 0.35 + node.z * 0.55 + hover * 0.4;
      const { r, g, b } = CFG.nodeBright;

      if (hover > 0.1) {
        const glow = ctx.createRadialGradient(px, py, 0, px, py, radius * 5);
        glow.addColorStop(0, `rgba(${r},${g},${b},${hover * 0.25})`);
        glow.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.beginPath();
        ctx.arc(px, py, radius * 5, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(px, py, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
      ctx.fill();
    }

    function drawGrabLines() {
      if (!mouseOnScreen) return;
      const { r, g, b } = CFG.nodeBright;
      for (const n of nodes) {
        const { px, py } = project(n);
        const d = Math.hypot(px - mouse.x, py - mouse.y);
        if (d >= CFG.grabDist) continue;
        const alpha = (1 - d / CFG.grabDist) * 0.55 * n.z;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }

    function tick() {
      tilt.tx =  mouse.nx * (CFG.tiltAmount / 90);
      tilt.ty = -mouse.ny * (CFG.tiltAmount / 90);
      tilt.x += (tilt.tx - tilt.x) * CFG.tiltSmooth;
      tilt.y += (tilt.ty - tilt.y) * CFG.tiltSmooth;

      ctx.clearRect(0, 0, W, H);

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -50)    n.x = W + 50;
        if (n.x > W + 50) n.x = -50;
        if (n.y < -50)    n.y = H + 50;
        if (n.y > H + 50) n.y = -50;
      }

      const sorted = [...nodes].sort((a, b) => a.z - b.z);

      for (let i = 0; i < sorted.length; i++) {
        for (let j = i + 1; j < sorted.length; j++) {
          const { px: ax, py: ay } = project(sorted[i]);
          const { px: bx, py: by } = project(sorted[j]);
          const d = Math.hypot(ax - bx, ay - by);
          if (d < CFG.maxDist) drawEdge(sorted[i], sorted[j], d, CFG.maxDist);
        }
      }

      drawGrabLines();

      for (const n of sorted) drawNode(n);

      rafId = requestAnimationFrame(tick);
    }

    function onMouseMove(e: MouseEvent) {
      mouseOnScreen = true;
      mouse.x  = e.clientX;
      mouse.y  = e.clientY;
      mouse.nx = (e.clientX / W) * 2 - 1;
      mouse.ny = (e.clientY / H) * 2 - 1;
    }

    function onResize() {
      resize();
      initNodes();
    }

    resize();
    initNodes();
    tick();

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
