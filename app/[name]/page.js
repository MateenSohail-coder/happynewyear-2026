"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function CelebrationPage() {
  const { name } = useParams();
  const [isStarted, setIsStarted] = useState(false);
  const displayName =
    name?.replace(/[^a-zA-Z\s]/g, "").slice(0, 20) || "My Love";

  const fiveRef = useRef(null);
  const sixRef = useRef(null);
  const canvasRef = useRef(null);

  const createParticles = (ctx, width, height, type = "firework") => {
    const particles = [];
    const colors = ["#FF2D55", "#00F2FF", "#FFCC00", "#AF52DE", "#FFFFFF"];
    const isPop = type === "pop";
    const count = isPop ? 80 : 50;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: isPop ? Math.random() * width : Math.random() * width,
        y: isPop ? -20 : height * 0.3,
        size: isPop ? Math.random() * 6 + 3 : Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * (isPop ? 4 : 12),
        vy: isPop ? Math.random() * 4 + 2 : (Math.random() - 0.5) * 12,
        opacity: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        type: type,
      });
    }

    particles.forEach((p) => {
      if (p.type === "firework") {
        gsap.to(p, {
          x: p.x + p.vx * 10,
          y: p.y + p.vy * 10 + 30,
          opacity: 0,
          duration: 1.2,
          ease: "power2.out",
        });
      } else {
        gsap.to(p, {
          y: height - Math.random() * 20,
          x: p.x + (Math.random() - 0.5) * 80,
          rotation: p.rotation + 360,
          duration: Math.random() * 2.5 + 2,
          ease: "bounce.out",
        });
      }
    });
    return particles;
  };

  useEffect(() => {
    if (!isStarted) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let ww = (canvas.width = window.innerWidth);
    let wh = (canvas.height = window.innerHeight);
    let allParticles = [];

    const render = () => {
      ctx.clearRect(0, 0, ww, wh);
      allParticles.forEach((p, i) => {
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        if (p.type === "pop")
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
        if (p.opacity <= 0 && p.type === "firework") allParticles.splice(i, 1);
      });
      requestAnimationFrame(render);
    };
    render();

    const tl = gsap.timeline();
    const fireworkSound = new Audio(
      "https://assets.mixkit.co/active_storage/sfx/588/588-preview.mp3"
    );

    // Twinkle multi-colored bulbs
    gsap.to(".bulb", {
      opacity: 0.3,
      scale: 0.8,
      repeat: -1,
      yoyo: true,
      stagger: { each: 0.1, from: "random" },
      duration: 0.6,
    });

    tl.to(fiveRef.current, {
      y: -120,
      opacity: 0,
      duration: 0.8,
      ease: "power4.in",
    })
      .to(
        sixRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "elastic.out(1, 0.3)",
          onStart: () => {
            fireworkSound.play().catch(() => {});
            allParticles.push(...createParticles(ctx, ww, wh, "pop"));

            // Firework Sync: Only loop while sound is playing
            const fwInterval = setInterval(() => {
              if (fireworkSound.paused || fireworkSound.ended) {
                clearInterval(fwInterval);
              } else {
                allParticles.push(...createParticles(ctx, ww, wh, "firework"));
              }
            }, 450);
          },
        },
        "-=0.2"
      )
      .from(".ui-reveal", {
        y: 20,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: "power2.out",
      });
  }, [isStarted]);

  const bulbColors = [
    "bg-rose-400 shadow-[0_0_15px_#fb7185]",
    "bg-cyan-400 shadow-[0_0_15px_#22d3ee]",
    "bg-yellow-400 shadow-[0_0_15px_#facc15]",
    "bg-purple-400 shadow-[0_0_15px_#c084fc]",
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden font-sans selection:bg-rose-500/30">
      {/* MULTI-COLOR BULB WIRE */}
      <div className="absolute top-0 left-0 w-full flex justify-around px-2 z-30 pt-1">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-[1px] h-4 bg-white/10" />
            <div
              className={`bulb w-3 h-3 rounded-full ${
                bulbColors[i % bulbColors.length]
              }`}
            />
          </div>
        ))}
      </div>
      {!isStarted && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#050505] backdrop-blur-2xl">
          {/* High-end Container for floating effect */}
          <div
            className="relative group cursor-pointer transform hover:scale-105 transition-all duration-500 animate-bounce-slow"
            onClick={() => setIsStarted(true)}
          >
            {/* 1. Massive Animated Glow - Larger Blur Radius */}
            <div className="absolute -inset-2 bg-gradient-to-r from-rose-600 via-pink-500 to-purple-600 rounded-full blur-[20px] opacity-60 group-hover:opacity-100 group-hover:blur-[30px] transition duration-700 animate-pulse"></div>

            {/* 2. The Main Cinematic Button */}
            <button className="relative px-16 py-8 bg-black/80 backdrop-blur-md rounded-full border border-white/10 flex items-center shadow-2xl overflow-hidden">
              {/* Shimmer Effect - A light ray that passes over the button */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer"></div>

              <span className="flex items-center space-x-6">
                {/* Status Indicator (Bigger) */}
                <span className="flex h-4 w-4 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 shadow-[0_0_10px_#f43f5e]"></span>
                </span>

                <div className="flex flex-col items-start leading-none">
                  <span className="text-gray-400 text-[0.6rem] tracking-[0.4em] uppercase mb-2 font-medium">
                    A Personal Message For
                  </span>
                  <span className="text-white flex items-center gap-3 font-black tracking-[0.2em] uppercase text-2xl sm:text-3xl font2">
                    {displayName} <span className="text-rose-500">✨</span>
                  </span>
                </div>
              </span>
            </button>

            {/* 3. Enhanced Hint Text */}
            <div className="absolute -bottom-16 left-0 right-0 flex flex-col items-center gap-2">
              <p className="text-white/60 text-sm tracking-[0.5em] uppercase font-light animate-pulse">
                Click to Open
              </p>
              <div className="w-1 h-8 bg-gradient-to-b from-rose-500 to-transparent rounded-full animate-bounce"></div>
            </div>
          </div>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-20"
      />
      <div className="relative z-10 text-center px-6">
        <div className="flex items-center justify-center gap-3 font-black text-[20vw] sm:text-[12rem] leading-none text-white tracking-tighter font2">
          <span className="opacity-90">2</span>
          <span className="opacity-90">0</span>
          <span className="opacity-90">2</span>
          <div className="relative flex items-center justify-center w-[0.8ch] h-[1em]">
            <span ref={fiveRef} className="absolute opacity-20">
              5
            </span>
            <span
              ref={sixRef}
              className="absolute text-rose-500 opacity-0"
              style={{ textShadow: "0 0 40px rgba(244,39,84,0.6)" }}
            >
              6
            </span>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <p className="ui-reveal text-xs sm:text-sm tracking-[0.5em] text-white/40 uppercase font-medium">
            Est. 2026
          </p>
          <h1 className="ui-reveal font text-6xl sm:text-8xl font-bold text-white tracking-tight">
            Happy New Year, <br />
            <span className="bg-gradient-to-r font2 from-rose-400 via-white to-rose-400 bg-clip-text text-transparent">
              {displayName}
            </span>
          </h1>
          <p className="ui-reveal text-sm sm:text-base text-white/30 max-w-sm mx-auto font-light leading-relaxed">
            A beautiful new chapter begins now. <br /> May every second be
            filled with joy.
          </p>
        </div>
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(40,0,10,0.3)_0%,transparent_100%)]" />
    </div>
  );
}
