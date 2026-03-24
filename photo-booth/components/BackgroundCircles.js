'use client';

// Animated bokeh orbs background — lightweight, CSS-only, no images needed.
// Replaces the previous floating-character animation.
const ORBS = [
  { size: 320, top: '-80px',   left: '-80px',  color: 'rgba(217,70,239,0.15)', delay: '0s',   dur: '18s' },
  { size: 240, top: '20%',     left: '75%',    color: 'rgba(139,92,246,0.12)', delay: '3s',   dur: '22s' },
  { size: 400, top: '55%',     left: '-10%',   color: 'rgba(192,132,252,0.10)', delay: '6s',  dur: '26s' },
  { size: 180, top: '70%',     left: '60%',    color: 'rgba(244,114,182,0.12)', delay: '1s',  dur: '20s' },
  { size: 280, top: '35%',     left: '40%',    color: 'rgba(167,139,250,0.08)', delay: '9s',  dur: '30s' },
  { size: 200, top: '10%',     left: '50%',    color: 'rgba(236,72,153,0.08)',  delay: '4s',  dur: '24s' },
];

export default function BackgroundCircles() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {ORBS.map((orb, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: orb.top,
            left: orb.left,
            width: orb.size,
            height: orb.size,
            borderRadius: '50%',
            background: orb.color,
            filter: 'blur(60px)',
            animation: `blobPulse ${orb.dur} ease-in-out ${orb.delay} infinite`,
          }}
        />
      ))}
    </div>
  );
}
