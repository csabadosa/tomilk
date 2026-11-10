'use client';

import { useEffect, useRef, useState } from 'react';
import { RAIL_STOPS, COPY, stopName, type Lang } from '@/app/content';

/* The signature interaction: a persistent dawn mountain road.
   Sky + parallax ridgelines sit fixed behind the scrolling page;
   a foreground road HUD pins the Sprinter and drives it across the
   screen as you scroll, while a route-rail lights up the real stops. */
export default function DrivingScene({ lang }: { lang: Lang }) {
  const t = COPY[lang];

  const busRef = useRef<HTMLDivElement>(null);
  const laneRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const farRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const nearRef = useRef<HTMLDivElement>(null);
  const skyRef = useRef<HTMLDivElement>(null);

  const [active, setActive] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let raf = 0;
    let lastY = window.scrollY;
    let speed = 0; // smoothed scroll speed -> drives road streak + exhaust
    let laneOffset = 0;
    let activeIdx = -1;

    const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

    const frame = () => {
      const y = window.scrollY;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const p = Math.min(1, Math.max(0, y / max));

      // scroll speed, smoothed and decaying so it eases to an idle crawl
      const dy = Math.abs(y - lastY);
      lastY = y;
      speed = lerp(speed, Math.min(1, dy / 42), 0.18);
      const drive = 0.1 + speed * 0.5; // gentler idle crawl + softer scroll boost

      // --- foreground road: streaking dashed lane + progress fill ---
      laneOffset = (laneOffset - (2 + drive * 18)) % 64;
      if (laneRef.current) laneRef.current.style.backgroundPositionX = `${laneOffset}px`;
      if (fillRef.current) fillRef.current.style.width = `${p * 100}%`;

      // --- the bus: crosses the screen, bobs, leans into curves ---
      if (busRef.current) {
        const xPct = lerp(9, 63, p);
        const bob = reduce ? 0 : Math.sin(y / 46) * (1 + speed * 1.8);
        const lean = reduce ? 0 : Math.sin(p * Math.PI * 6) * 1.6 + (y - lastY) * 0;
        busRef.current.style.setProperty('--x', `${xPct}vw`);
        busRef.current.style.setProperty('--bob', `${bob}px`);
        busRef.current.style.setProperty('--lean', `${lean}deg`);
        busRef.current.style.setProperty('--speed', drive.toFixed(3));
      }

      // --- parallax ridgelines drift as the journey advances ---
      if (farRef.current) farRef.current.style.transform = `translate3d(${-p * 46}px,0,0)`;
      if (midRef.current) midRef.current.style.transform = `translate3d(${-p * 104}px,0,0)`;
      if (nearRef.current) nearRef.current.style.transform = `translate3d(${-p * 188}px,0,0)`;
      if (skyRef.current) skyRef.current.style.setProperty('--dawn', p.toFixed(3));

      // --- active stop on the rail ---
      const idx = Math.min(RAIL_STOPS.length - 1, Math.round(p * (RAIL_STOPS.length - 1)));
      if (idx !== activeIdx) {
        activeIdx = idx;
        setActive(idx);
      }

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      {/* dawn sky — fixed behind everything, warms as you descend */}
      <div ref={skyRef} className="scene-sky" aria-hidden />

      {/* parallax Carpathian ridgelines */}
      <div className="scene-ridges" aria-hidden>
        <div ref={farRef} className="ridge ridge-far">
          <Ridge fill="var(--spruce-2)" seed={0} />
        </div>
        <div ref={midRef} className="ridge ridge-mid">
          <Ridge fill="var(--spruce)" seed={1} />
        </div>
        <div ref={nearRef} className="ridge ridge-near">
          <Trees />
        </div>
      </div>

      {/* foreground road HUD — pinned bus + live route rail */}
      <div className="road-hud" aria-hidden>
        <div className="road-rail-wrap">
          <div className="road-rail">
            <div ref={fillRef} className="road-rail-fill" />
            {RAIL_STOPS.map((s, i) => (
              <span
                key={s}
                className={`rail-stop${i <= active ? ' is-passed' : ''}${i === active ? ' is-active' : ''}`}
                style={{ left: `${(i / (RAIL_STOPS.length - 1)) * 100}%` }}
              >
                <i />
                <b className="data">{s}</b>
              </span>
            ))}
          </div>
        </div>

        <div className="road-surface">
          <div ref={laneRef} className="road-lane" />
          <div ref={busRef} className="bus">
            <span className="bus-speedlines" />
            <span className="bus-exhaust" />
            <span className="bus-exhaust bus-exhaust-2" />
            <img src="/assets/mercedes_sprinter.png" alt="" draggable={false} />
            <span className="bus-shadow" />
          </div>
        </div>
      </div>

      {/* live caption for the rail (not purely decorative) */}
      <p className="road-caption data" aria-live="polite">
        <span>{t.railLabel}</span>
        <strong>{stopName(RAIL_STOPS[active], lang)}</strong>
      </p>
    </>
  );
}

/* a soft random-ish ridgeline silhouette */
function Ridge({ fill, seed }: { fill: string; seed: number }) {
  const pts =
    seed === 0
      ? '0,170 120,90 240,130 360,60 480,120 600,70 760,140 900,80 1040,130 1200,95 1320,140 1440,110 1440,220 0,220'
      : '0,200 150,120 300,175 430,95 560,160 700,110 840,185 980,120 1120,180 1260,130 1380,180 1440,150 1440,260 0,260';
  return (
    <svg viewBox="0 0 1440 260" preserveAspectRatio="none" width="100%" height="100%">
      <polygon points={pts} fill={fill} />
    </svg>
  );
}

/* a near treeline of stylised spruce */
function Trees() {
  const trees = Array.from({ length: 26 }, (_, i) => i);
  return (
    <svg viewBox="0 0 1600 150" preserveAspectRatio="none" width="100%" height="100%">
      <rect x="0" y="118" width="1600" height="40" fill="#0a1713" />
      {trees.map((i) => {
        const x = i * 62 + ((i * 37) % 23);
        const h = 70 + ((i * 53) % 34);
        const y = 122;
        return (
          <polygon
            key={i}
            points={`${x},${y} ${x - 16},${y} ${x},${y - h} ${x + 16},${y}`}
            fill="#0b1c16"
          />
        );
      })}
    </svg>
  );
}
