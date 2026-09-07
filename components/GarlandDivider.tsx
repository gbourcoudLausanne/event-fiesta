"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

const ease = [0.16, 1, 0.3, 1] as const;

// Arrondis stables serveur/client : Math.sin & co. peuvent différer d'un ULP
// entre Node et le navigateur → mismatch d'hydratation sur les attributs SVG.
const rnd = (n: number, p = 2) => {
  const f = 10 ** p;
  return Math.round(n * f) / f;
};
const tsin = (x: number) => rnd(Math.sin(x), 6);

function noise(n: number) {
  const s = tsin(n * 127.1 + 311.7) * 43758.5453;
  return rnd(s - Math.floor(s), 5);
}

const GRADS: Record<string, [string, string, string]> = {
  rose: ["#FFF1F5", "#F5AEBE", "#D97E9A"],
  roseDeep: ["#FBDCE4", "#E88DA8", "#BF5C7C"],
  blue: ["#EFF7FB", "#AAD0E2", "#7AA9C1"],
  peach: ["#FFF4E7", "#F3C6A0", "#D79A6D"],
  cream: ["#FFFEFB", "#F5EAD9", "#DAC5AB"],
  lav: ["#F7F1FB", "#D6C4E6", "#A98FC0"],
};
const GKEYS = ["rose", "blue", "peach", "roseDeep", "lav", "cream"] as const;

// Point + normale le long de la guirlande (bézier quadratique P0-P1-P2).
function swag(t: number) {
  const P0 = { x: -30, y: 34 };
  const P1 = { x: 720, y: 262 };
  const P2 = { x: 1470, y: 34 };
  const mt = 1 - t;
  const x = mt * mt * P0.x + 2 * mt * t * P1.x + t * t * P2.x;
  const y = mt * mt * P0.y + 2 * mt * t * P1.y + t * t * P2.y;
  const tx = 2 * mt * (P1.x - P0.x) + 2 * t * (P2.x - P1.x);
  const ty = 2 * mt * (P1.y - P0.y) + 2 * t * (P2.y - P1.y);
  const m = rnd(Math.sqrt(tx * tx + ty * ty), 4) || 1;
  return { x: rnd(x, 3), y: rnd(y, 3), nx: rnd(-ty / m, 5), ny: rnd(tx / m, 5) };
}

const STRING_D = "M-30 34 Q 720 262 1470 34";

type Balloon = {
  idx: number;
  x: number;
  y: number;
  sx: number;
  sy: number;
  r: number;
  g: (typeof GKEYS)[number];
  metal: 0 | 1 | 2;
  back: boolean;
  dur: number;
  del: number;
};

const N_BALLOONS = 48;
const ALL_BALLOONS: Balloon[] = Array.from({ length: N_BALLOONS }).map((_, i) => {
  const t = 0.035 + (i / (N_BALLOONS - 1)) * 0.93;
  const p = swag(t);
  const side = i % 2 === 0 ? 1 : -1;
  const back = noise(i + 9) < 0.4;
  const bump = 0.58 + 0.7 * tsin(t * Math.PI); // plus gros au centre
  const baseR = (back ? 8 : 13) + noise(i + 5) * (back ? 9 : 17);
  const r = rnd(baseR * bump, 3);
  const spread = (2 + noise(i) * 15) * (back ? 0.55 : 1);
  const off = side * spread - r * 0.28;
  const drop = (back ? 1 : 7) + noise(i + 13) * 11;
  const metal = !back && noise(i + 17) < 0.2 ? (noise(i + 31) < 0.5 ? 1 : 2) : 0;
  return {
    idx: i,
    x: rnd(p.x + p.nx * off, 3),
    y: rnd(p.y + p.ny * off + r * 0.34 + drop, 3),
    sx: p.x,
    sy: p.y,
    r,
    g: GKEYS[Math.floor(noise(i + 2) * GKEYS.length)],
    metal: metal as 0 | 1 | 2,
    back,
    dur: rnd(3.4 + noise(i + 41) * 3, 2),
    del: rnd(noise(i + 53) * 4, 2),
  };
});
const BACK = ALL_BALLOONS.filter((b) => b.back);
const FRONT = ALL_BALLOONS.filter((b) => !b.back);

const PAMPA_AT = [0.08, 0.24, 0.4, 0.5, 0.6, 0.76, 0.92];
const EUCA_AT = [0.15, 0.31, 0.45, 0.55, 0.69, 0.85];
const BERRY_AT = [0.2, 0.5, 0.8];

const CONF_COLORS = ["#F4A8B8", "#A8CEE0", "#F0C29A", "#E3C179", "#FBD5DE", "#CDB4E0"];
const CONFETTI = Array.from({ length: 26 }).map((_, i) => ({
  x: rnd(40 + noise(i * 3.3) * 1360, 3),
  c: CONF_COLORS[i % CONF_COLORS.length],
  shape: ["c", "r", "s"][i % 3],
  s: rnd(2 + noise(i + 7) * 2.6, 2),
  d: rnd(noise(i + 20) * 8, 3),
  dur: rnd(5.5 + noise(i + 61) * 4, 2),
}));

const SPARKLE_AT = [0.12, 0.3, 0.5, 0.7, 0.88];

function star4(s: number) {
  return `M0 ${-s * 1.5} L${s * 0.42} ${-s * 0.42} L${s * 1.5} 0 L${s * 0.42} ${s * 0.42} L0 ${s * 1.5} L${-s * 0.42} ${s * 0.42} L${-s * 1.5} 0 L${-s * 0.42} ${-s * 0.42} Z`;
}

function Pampa({ x, y, a, s = 1 }: { x: number; y: number; a: number; s?: number }) {
  const barbs = 19;
  return (
    <g transform={`translate(${x} ${y}) rotate(${a}) scale(${s})`}>
      <path d="M0 4 C 10 -16 14 -40 8 -66 C 2 -40 -8 -18 0 4 Z" fill="#E4D4B6" opacity="0.2" />
      <g stroke="#D9C6A2" strokeLinecap="round" fill="none">
        <path d="M0 0 C 3 -16 5 -38 4 -58" strokeWidth="1" opacity="0.75" />
        {Array.from({ length: barbs }).map((_, k) => {
          const tt = k / (barbs - 1);
          const yy = -3 - tt * 58;
          const env = tsin(tt * Math.PI);
          const sp = 2.5 + env * 8;
          const dr = 3 + tt * 6;
          return (
            <g key={k} opacity={0.26 + 0.4 * env}>
              <path d={`M0 ${yy} q ${sp * 0.6} ${-dr * 0.3} ${sp} ${-dr}`} strokeWidth="0.55" />
              <path d={`M0 ${yy} q ${-sp * 0.6} ${-dr * 0.3} ${-sp} ${-dr}`} strokeWidth="0.55" />
            </g>
          );
        })}
      </g>
    </g>
  );
}

function Euca({ x, y, a, flip, s = 1 }: { x: number; y: number; a: number; flip: boolean; s?: number }) {
  const dir = flip ? -1 : 1;
  const leaves = 12;
  return (
    <g transform={`translate(${x} ${y}) rotate(${a}) scale(${s})`}>
      <path d={`M0 0 Q ${10 * dir} -22 ${4 * dir} -54`} stroke="#9DB18C" strokeWidth="0.8" fill="none" strokeLinecap="round" />
      {Array.from({ length: leaves }).map((_, k) => {
        const tt = (k + 1) / leaves;
        const ly = -3 - tt * 50;
        const sx = tt * 3 * dir;
        const sgn = k % 2 === 0 ? 1 : -1;
        const lr = 2.6 + tsin(tt * Math.PI) * 3.4;
        const ax = sx + sgn * dir * lr * 0.8;
        return (
          <ellipse
            key={k}
            cx={ax}
            cy={ly}
            rx={lr}
            ry={lr * 0.6}
            fill="#B3C6A2"
            opacity={0.5 + 0.32 * tsin(tt * Math.PI)}
            transform={`rotate(${-sgn * 38 * dir} ${ax} ${ly})`}
          />
        );
      })}
    </g>
  );
}

function Berry({ x, y }: { x: number; y: number }) {
  const pts: [number, number][] = [
    [0, 0],
    [4, 3],
    [-3, 4],
    [3, -4],
    [-4, -2],
    [6, -1],
  ];
  return (
    <g transform={`translate(${x} ${y})`}>
      {pts.map(([px, py], k) => (
        <circle key={k} cx={px} cy={py} r={1.8} fill="#D98CA6" opacity="0.75" />
      ))}
    </g>
  );
}

function BalloonShape({ b }: { b: Balloon }) {
  const fill = b.metal === 1 ? "url(#gd-chrome)" : b.metal === 2 ? "url(#gd-rosegold)" : `url(#gd-${b.g})`;
  const mid = GRADS[b.g][2];
  return (
    <g>
      <line x1={b.x} y1={rnd(b.y - b.r, 3)} x2={b.sx} y2={b.sy} stroke="rgba(120,90,70,0.2)" strokeWidth="0.7" />
      <circle
        cx={b.x}
        cy={b.y}
        r={b.r}
        fill={fill}
        style={b.back ? { filter: "blur(1.6px)" } : undefined}
      />
      {!b.back && (
        <>
          <path
            d={`M${b.x} ${rnd(b.y + b.r * 0.98, 3)} q ${-b.r * 0.5} ${b.r * 0.55} 0 ${b.r * 0.9} q ${b.r * 0.5} ${-b.r * 0.35} 0 ${-b.r * 0.9} Z`}
            fill="rgba(0,0,0,0.06)"
          />
          <path
            d={`M${rnd(b.x - 2.4, 3)} ${rnd(b.y + b.r, 3)} L${rnd(b.x + 2.4, 3)} ${rnd(b.y + b.r, 3)} L${b.x} ${rnd(b.y + b.r + 3.6, 3)} Z`}
            fill={mid}
          />
          <ellipse
            cx={rnd(b.x - b.r * 0.32, 3)}
            cy={rnd(b.y - b.r * 0.4, 3)}
            rx={rnd(b.r * 0.24, 3)}
            ry={rnd(b.r * 0.34, 3)}
            fill="rgba(255,255,255,0.62)"
            transform={`rotate(-22 ${rnd(b.x - b.r * 0.32, 3)} ${rnd(b.y - b.r * 0.4, 3)})`}
          />
          <circle cx={rnd(b.x + b.r * 0.28, 3)} cy={rnd(b.y + b.r * 0.06, 3)} r={rnd(b.r * 0.09, 3)} fill="rgba(255,255,255,0.4)" />
        </>
      )}
    </g>
  );
}

const popV: Variants = {
  hidden: { scale: 0, opacity: 0 },
  shown: (i: number) => ({
    scale: 1,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 240, damping: 15, delay: 0.12 + i * 0.022 },
  }),
};

export function GarlandDivider({ bg = "#FAF7F2" }: { bg?: string }) {
  const reduce = useReducedMotion();

  return (
    <div style={{ background: bg, lineHeight: 0 }} aria-hidden>
      <motion.svg
        viewBox="0 0 1440 250"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", width: "100%", height: "auto", overflow: "visible" }}
        initial={reduce ? undefined : "hidden"}
        whileInView={reduce ? undefined : "shown"}
        viewport={{ once: true, amount: 0.25 }}
      >
        <defs>
          {GKEYS.map((k) => {
            const [a, b, c] = GRADS[k];
            return (
              <radialGradient key={k} id={`gd-${k}`} cx="34%" cy="24%" r="82%">
                <stop offset="0%" stopColor={a} />
                <stop offset="50%" stopColor={b} />
                <stop offset="100%" stopColor={c} />
              </radialGradient>
            );
          })}
          <linearGradient id="gd-chrome" x1="0" y1="0" x2="0.25" y2="1">
            <stop offset="0%" stopColor="#FCEBF1" />
            <stop offset="26%" stopColor="#E6A6BC" />
            <stop offset="44%" stopColor="#FFF8FB" />
            <stop offset="62%" stopColor="#D386A2" />
            <stop offset="100%" stopColor="#AF6486" />
          </linearGradient>
          <linearGradient id="gd-rosegold" x1="0" y1="0" x2="0.25" y2="1">
            <stop offset="0%" stopColor="#FBEEDD" />
            <stop offset="30%" stopColor="#E7B98E" />
            <stop offset="46%" stopColor="#FFF6EC" />
            <stop offset="64%" stopColor="#D89F73" />
            <stop offset="100%" stopColor="#B67F55" />
          </linearGradient>
        </defs>

        {/* Ombre au sol pour ancrer la guirlande */}
        <ellipse cx="720" cy="216" rx="700" ry="20" fill="rgba(120,60,80,0.05)" style={{ filter: "blur(9px)" }} />

        {/* Confettis qui tombent */}
        {!reduce &&
          CONFETTI.map((f, i) => (
            <motion.g
              key={`c${i}`}
              initial={{ opacity: 0 }}
              animate={{ y: [-50, 280], rotate: [0, 260], opacity: [0, 0.75, 0.75, 0] }}
              transition={{ repeat: Infinity, duration: f.dur, ease: "linear", delay: f.d }}
            >
              {f.shape === "c" ? (
                <circle cx={f.x} cy={0} r={f.s} fill={f.c} />
              ) : f.shape === "r" ? (
                <rect x={f.x - f.s * 0.6} y={-f.s * 1.6} width={f.s * 1.2} height={f.s * 3.2} rx={f.s * 0.5} fill={f.c} />
              ) : (
                <path d={star4(f.s * 0.9)} transform={`translate(${f.x} 0)`} fill={f.c} />
              )}
            </motion.g>
          ))}

        <g
          style={
            reduce
              ? { transformOrigin: "720px 24px" }
              : { transformOrigin: "720px 24px", animation: "gd-sway 9s ease-in-out infinite" }
          }
        >
          {/* Fil de la guirlande */}
          <motion.path
            d={STRING_D}
            fill="none"
            stroke="rgba(120,90,70,0.32)"
            strokeWidth="1.5"
            strokeLinecap="round"
            variants={{
              hidden: { pathLength: 0 },
              shown: { pathLength: 1, transition: { duration: 0.9, ease } },
            }}
          />

          {/* Verdure — arrière */}
          {PAMPA_AT.map((t, i) => {
            const p = swag(t);
            return (
              <motion.g
                key={`p${i}`}
                custom={i}
                variants={popV}
                style={{ transformOrigin: `${p.x}px ${p.y}px` }}
              >
                <Pampa x={p.x} y={p.y + 6} a={(t - 0.5) * 96 + (i % 2 ? 7 : -7)} s={t > 0.35 && t < 0.65 ? 1.25 : 1} />
              </motion.g>
            );
          })}
          {EUCA_AT.map((t, i) => {
            const p = swag(t);
            return (
              <motion.g
                key={`e${i}`}
                custom={i}
                variants={popV}
                style={{ transformOrigin: `${p.x}px ${p.y}px` }}
              >
                <Euca x={p.x} y={p.y + 8} a={(t - 0.5) * 128} flip={t > 0.5} s={1.15} />
              </motion.g>
            );
          })}

          {/* Ballons — rangée arrière (floue) */}
          {BACK.map((b) => (
            <motion.g key={`b${b.idx}`} custom={b.idx} variants={popV} style={{ transformOrigin: `${b.x}px ${b.y}px` }}>
              <g
                style={
                  reduce
                    ? undefined
                    : { transformOrigin: `${b.x}px ${b.y}px`, animation: `gd-bob ${b.dur}s ease-in-out ${b.del}s infinite` }
                }
              >
                <BalloonShape b={b} />
              </g>
            </motion.g>
          ))}

          {/* Baies séchées */}
          {BERRY_AT.map((t, i) => {
            const p = swag(t);
            return (
              <motion.g key={`by${i}`} custom={i + 2} variants={popV} style={{ transformOrigin: `${p.x}px ${p.y}px` }}>
                <Berry x={p.x + (i % 2 ? 14 : -14)} y={p.y + 16} />
              </motion.g>
            );
          })}

          {/* Ballons — rangée avant */}
          {FRONT.map((b) => (
            <motion.g key={`f${b.idx}`} custom={b.idx} variants={popV} style={{ transformOrigin: `${b.x}px ${b.y}px` }}>
              <g
                style={
                  reduce
                    ? undefined
                    : { transformOrigin: `${b.x}px ${b.y}px`, animation: `gd-bob ${b.dur}s ease-in-out ${b.del}s infinite` }
                }
              >
                <BalloonShape b={b} />
              </g>
            </motion.g>
          ))}

          {/* Étincelles */}
          {!reduce &&
            SPARKLE_AT.map((t, i) => {
              const p = swag(t);
              return (
                <g key={`s${i}`} transform={`translate(${p.x + (i % 2 ? 22 : -22)} ${p.y - 20})`}>
                  <motion.path
                    d={star4(3.2)}
                    fill="#F6E7C9"
                    style={{ transformOrigin: "0px 0px" }}
                    animate={{ scale: [0.5, 1, 0.5], opacity: [0.2, 0.95, 0.2] }}
                    transition={{ repeat: Infinity, duration: 2.6 + i * 0.4, ease: "easeInOut", delay: i * 0.5 }}
                  />
                </g>
              );
            })}
        </g>
      </motion.svg>
    </div>
  );
}
