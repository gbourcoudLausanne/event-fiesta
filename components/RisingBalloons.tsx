type BalloonDef = {
  x: number;
  color: string;
  size: number;
  dur: number;
  phase: number;
  mirror: boolean;
  blur?: number;
  op?: number;
};

// Jeu par défaut (splash screen)
const BALLOONS: BalloonDef[] = [
  { x: 2, color: "#E8749E", size: 32, dur: 14, phase: 0.05, mirror: false },
  { x: 8, color: "#F4A8B8", size: 22, dur: 18, phase: 0.42, mirror: true },
  { x: 15, color: "#B98AE8", size: 30, dur: 12, phase: 0.71, mirror: false },
  { x: 22, color: "#E8A688", size: 20, dur: 16, phase: 0.18, mirror: true },
  { x: 29, color: "#6FC7A0", size: 36, dur: 20, phase: 0.58, mirror: false },
  { x: 36, color: "#E8749E", size: 18, dur: 15, phase: 0.85, mirror: true },
  { x: 43, color: "#F4A8B8", size: 28, dur: 13, phase: 0.30, mirror: false },
  { x: 50, color: "#E8C870", size: 24, dur: 17, phase: 0.65, mirror: true },
  { x: 57, color: "#E8749E", size: 30, dur: 19, phase: 0.10, mirror: false },
  { x: 64, color: "#B98AE8", size: 22, dur: 14, phase: 0.48, mirror: true },
  { x: 71, color: "#6FC7A0", size: 26, dur: 16, phase: 0.78, mirror: false },
  { x: 78, color: "#F4A8B8", size: 20, dur: 21, phase: 0.22, mirror: true },
  { x: 84, color: "#E8A688", size: 34, dur: 15, phase: 0.55, mirror: false },
  { x: 91, color: "#E8749E", size: 22, dur: 18, phase: 0.90, mirror: true },
  { x: 5, color: "#E8C870", size: 18, dur: 22, phase: 0.35, mirror: true },
  { x: 33, color: "#B98AE8", size: 16, dur: 11, phase: 0.62, mirror: false },
  { x: 60, color: "#E8749E", size: 24, dur: 16, phase: 0.15, mirror: true },
  { x: 96, color: "#F4A8B8", size: 28, dur: 13, phase: 0.88, mirror: false },
];

// Jeu « hero » : ballons groupés à gauche et à droite (colonne centrale calme
// pour le texte), en deux plans (fond flou/discret + premier plan gros/net)
const HERO_BALLOONS: BalloonDef[] = [
  // ── GAUCHE · arrière-plan ──
  { x: 3, color: "#F4A8B8", size: 24, dur: 22, phase: 0.10, mirror: true, blur: 2.5, op: 0.34 },
  { x: 11, color: "#B98AE8", size: 28, dur: 24, phase: 0.55, mirror: false, blur: 3, op: 0.3 },
  { x: 19, color: "#E8C870", size: 20, dur: 20, phase: 0.80, mirror: true, blur: 2, op: 0.38 },
  { x: 26, color: "#E8749E", size: 26, dur: 23, phase: 0.25, mirror: false, blur: 3, op: 0.3 },
  { x: 8, color: "#6FC7A0", size: 18, dur: 26, phase: 0.62, mirror: false, blur: 3, op: 0.28 },
  // ── GAUCHE · premier plan ──
  { x: 1, color: "#E8749E", size: 48, dur: 13, phase: 0.08, mirror: false, op: 0.8 },
  { x: 9, color: "#F4A8B8", size: 40, dur: 15, phase: 0.50, mirror: true, op: 0.74 },
  { x: 17, color: "#E8C870", size: 44, dur: 12, phase: 0.85, mirror: false, op: 0.72 },
  { x: 24, color: "#B98AE8", size: 38, dur: 16, phase: 0.20, mirror: true, op: 0.74 },
  { x: 30, color: "#E8A688", size: 34, dur: 14, phase: 0.62, mirror: false, op: 0.76 },
  { x: 5, color: "#B98AE8", size: 36, dur: 18, phase: 0.35, mirror: true, op: 0.7 },
  { x: 14, color: "#6FC7A0", size: 46, dur: 17, phase: 0.72, mirror: false, op: 0.68 },
  { x: 28, color: "#E8749E", size: 32, dur: 15, phase: 0.42, mirror: true, op: 0.76 },
  // ── DROITE · arrière-plan ──
  { x: 73, color: "#E8749E", size: 22, dur: 22, phase: 0.32, mirror: true, blur: 2.5, op: 0.34 },
  { x: 81, color: "#E8C870", size: 28, dur: 23, phase: 0.72, mirror: false, blur: 3, op: 0.3 },
  { x: 89, color: "#F4A8B8", size: 20, dur: 20, phase: 0.18, mirror: true, blur: 2, op: 0.36 },
  { x: 96, color: "#B98AE8", size: 24, dur: 25, phase: 0.92, mirror: false, blur: 2.5, op: 0.3 },
  { x: 77, color: "#6FC7A0", size: 18, dur: 26, phase: 0.48, mirror: true, blur: 3, op: 0.28 },
  // ── DROITE · premier plan ──
  { x: 71, color: "#F4A8B8", size: 42, dur: 13, phase: 0.42, mirror: false, op: 0.76 },
  { x: 78, color: "#E8A688", size: 46, dur: 15, phase: 0.78, mirror: true, op: 0.72 },
  { x: 85, color: "#E8749E", size: 40, dur: 12, phase: 0.30, mirror: false, op: 0.78 },
  { x: 92, color: "#E8C870", size: 36, dur: 16, phase: 0.65, mirror: true, op: 0.74 },
  { x: 99, color: "#6FC7A0", size: 34, dur: 15, phase: 0.05, mirror: true, op: 0.68 },
  { x: 74, color: "#B98AE8", size: 36, dur: 18, phase: 0.55, mirror: false, op: 0.7 },
  { x: 88, color: "#F4A8B8", size: 44, dur: 14, phase: 0.90, mirror: true, op: 0.72 },
  { x: 95, color: "#E8749E", size: 32, dur: 17, phase: 0.22, mirror: false, op: 0.76 },
  // ── CENTRE · quelques ballons très discrets, loin derrière ──
  { x: 42, color: "#F4A8B8", size: 22, dur: 28, phase: 0.30, mirror: true, blur: 4, op: 0.14 },
  { x: 55, color: "#E8C870", size: 20, dur: 27, phase: 0.70, mirror: false, blur: 4, op: 0.14 },
  { x: 48, color: "#B98AE8", size: 18, dur: 29, phase: 0.50, mirror: true, blur: 4.5, op: 0.12 },
];

function BalloonSVG({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={Math.round(size * 1.85)} viewBox="0 0 30 56" fill="none">
      <ellipse cx="15" cy="15" rx="13" ry="14.5" fill={color} opacity="0.92" stroke="rgba(13,11,8,0.12)" strokeWidth="0.5" />
      <ellipse cx="10" cy="10" rx="3.5" ry="4.5" fill="white" opacity="0.3" transform="rotate(-20 10 10)" />
      <path d="M13 29 Q15 33 17 29" stroke={color} strokeWidth="1.5" fill={color} opacity="0.92" />
      <path d="M15 33 Q13 39 15 45 Q17 50 15 56" stroke="rgba(13,11,8,0.25)" strokeWidth="0.8" strokeLinecap="round" />
    </svg>
  );
}

// Champ de ballons qui montent en continu.
// mode "default" : splash · mode "hero" : plus nombreux, deux plans (fond flou + premier plan)
export function RisingBalloons({
  mode = "default",
  opacity = 1,
}: {
  mode?: "default" | "hero";
  opacity?: number;
}) {
  const balloons = mode === "hero" ? HERO_BALLOONS : BALLOONS;
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ opacity }} aria-hidden>
      {balloons.map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            bottom: 0,
            left: `${b.x}%`,
            opacity: b.op ?? 1,
            filter: b.blur ? `blur(${b.blur}px)` : undefined,
            animationName: b.mirror ? "balloon-float-r" : "balloon-float",
            animationDuration: `${b.dur}s`,
            animationTimingFunction: "linear",
            animationDelay: `${-b.phase * b.dur}s`,
            animationIterationCount: "infinite",
            willChange: "transform",
          }}
        >
          <BalloonSVG color={b.color} size={b.size} />
        </div>
      ))}
    </div>
  );
}
