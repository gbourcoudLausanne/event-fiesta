"use client";

// Showreel Event Fiesta — 15s, 1920×1080, auto-play loop, no controls.
// Adapté du design Claude Design (event-fiesta-video.jsx).

import React, {
  createContext, useContext, useMemo, useRef,
  useState, useEffect,
} from "react";

// ── Easing ────────────────────────────────────────────────────────────────────
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const easeOutCubic  = (t: number) => (--t) * t * t + 1;
const easeOutBack   = (t: number) => { const c1=1.70158,c3=c1+1; return 1+c3*Math.pow(t-1,3)+c1*Math.pow(t-1,2); };

// ── Timeline context ──────────────────────────────────────────────────────────
const TLCtx = createContext({ time: 0, duration: 15 });
const useTime = () => useContext(TLCtx).time;
const useTL   = () => useContext(TLCtx);

// ── Sprite context ────────────────────────────────────────────────────────────
const SPCtx = createContext({ localTime: 0, progress: 0, duration: 0 });
const useSprite = () => useContext(SPCtx);

function Sprite({ start=0, end=Infinity, children }: { start?:number; end?:number; children: React.ReactNode }) {
  const { time } = useTL();
  if (time < start || time > end) return null;
  const dur = end - start;
  const lt  = Math.max(0, time - start);
  const pr  = dur > 0 && isFinite(dur) ? clamp(lt / dur, 0, 1) : 0;
  return <SPCtx.Provider value={{ localTime:lt, progress:pr, duration:dur }}>{children}</SPCtx.Provider>;
}

// ── Stage (no scrubber — website embed) ───────────────────────────────────────
function Stage({ duration=15, background='#241d28', children, active=true }:
  { duration?:number; background?:string; children:React.ReactNode; active?:boolean }) {
  const [time, setTime] = useState(0);
  const raf  = useRef<number|null>(null);
  const last = useRef<number|null>(null);

  useEffect(() => {
    if (!active) { last.current = null; return; }
    const step = (ts: number) => {
      if (last.current == null) last.current = ts;
      const dt = (ts - last.current) / 1000;
      last.current = ts;
      setTime(t => { const n = t + dt; return n >= duration ? n % duration : n; });
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); last.current = null; };
  }, [active, duration]);

  const ctx = useMemo(() => ({ time, duration }), [time, duration]);
  return (
    <div style={{ position:'absolute', inset:0, background, overflow:'hidden' }}>
      <TLCtx.Provider value={ctx}>{children}</TLCtx.Provider>
    </div>
  );
}

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  cream:    '#f6efe4',
  ink:      '#241d28',
  gold:     '#c4a160',
  goldSoft: '#d8bd87',
  rose:     '#c98a86',
  plum:     '#4b3753',
};
const SERIF = "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif";
const SANS  = "var(--font-montserrat), system-ui, sans-serif";
const BASE  = '/Galerie/';

// ── Shot: full-bleed ken-burns image ─────────────────────────────────────────
function Shot({ src, dir='in', from='center' }: { src:string; dir?:string; from?:string }) {
  const { progress } = useSprite();
  const scale = dir === 'in' ? 1.07 + 0.14*progress : 1.21 - 0.14*progress;
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden', background:C.ink }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" style={{
        position:'absolute', inset:0, width:'100%', height:'100%',
        objectFit:'cover', transform:`scale(${scale})`, transformOrigin:from, willChange:'transform',
      }} />
    </div>
  );
}

// ── Persistent elements ───────────────────────────────────────────────────────
function Scrim() {
  return <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg,rgba(20,15,22,.34) 0%,rgba(20,15,22,0) 22%,rgba(20,15,22,0) 50%,rgba(20,15,22,.62) 100%)' }} />;
}
function GoldFrame() {
  return <div style={{ position:'absolute', inset:34, border:'1px solid rgba(255,255,255,.55)', pointerEvents:'none', zIndex:50 }} />;
}
function Mark() {
  return (
    <div style={{ position:'absolute', left:74, top:70, zIndex:40, fontFamily:SANS, color:'#fff', letterSpacing:'0.42em', fontSize:19, fontWeight:500, textTransform:'uppercase', textShadow:'0 1px 14px rgba(0,0,0,.35)' }}>
      EVENT FIESTA
    </div>
  );
}

// ── Intro scene (0 → 3.08s) ───────────────────────────────────────────────────
function Intro() {
  const { localTime, duration } = useSprite();
  const eo = (t: number) => easeOutCubic(clamp(t, 0, 1));
  const tagIn = eo(localTime / 0.7);
  const h1In  = eo((localTime - 0.45) / 0.85);
  const h2In  = eo((localTime - 0.85) / 0.9);
  const out   = clamp((duration - localTime) / 0.4, 0, 1);
  const line  = (p: number): React.CSSProperties => ({ transform:`translateY(${(1-p)*30}px)`, opacity:Math.min(p, out) });
  return (
    <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:'0 110px 132px', zIndex:30 }}>
      <div style={{ ...line(tagIn), fontFamily:SANS, color:C.goldSoft, letterSpacing:'0.4em', fontSize:20, textTransform:'uppercase', marginBottom:22, fontWeight:500 }}>
        Lausanne · Suisse Romande · Depuis 2020
      </div>
      <div style={{ ...line(h1In), fontFamily:SERIF, color:'#fff', fontSize:124, lineHeight:0.98, fontWeight:500, letterSpacing:'-0.01em', textShadow:'0 2px 30px rgba(0,0,0,.3)' }}>
        Vos événements,
      </div>
      <div style={{ ...line(h2In), fontFamily:SERIF, color:C.goldSoft, fontStyle:'italic', fontSize:124, lineHeight:1.0, fontWeight:500, letterSpacing:'-0.01em', textShadow:'0 2px 30px rgba(0,0,0,.3)' }}>
        notre œuvre.
      </div>
    </div>
  );
}

// ── Montage label ─────────────────────────────────────────────────────────────
function ShotLabel({ kicker, title, total }: { kicker:string; title:string; total:string }) {
  const { localTime, duration } = useSprite();
  const inP = easeOutCubic(clamp(localTime / 0.4, 0, 1));
  const out  = clamp((duration - localTime) / 0.25, 0, 1);
  const op   = Math.min(inP, out);
  const ty   = (1 - inP) * 26;
  return (
    <>
      <div style={{ position:'absolute', right:74, top:70, zIndex:40, fontFamily:SANS, color:'#fff', letterSpacing:'0.2em', fontSize:18, fontWeight:500, opacity:op*.9, textShadow:'0 1px 12px rgba(0,0,0,.4)' }}>
        <span style={{ fontSize:26 }}>{kicker}</span>
        <span style={{ opacity:.55 }}> / {total}</span>
      </div>
      <div style={{ position:'absolute', left:110, bottom:130, zIndex:30, transform:`translateY(${ty}px)`, opacity:op }}>
        <div style={{ display:'flex', alignItems:'center', gap:18, marginBottom:14 }}>
          <div style={{ width:46, height:1, background:C.goldSoft }} />
          <div style={{ fontFamily:SANS, color:C.goldSoft, letterSpacing:'0.34em', fontSize:17, textTransform:'uppercase', fontWeight:500 }}>Nos créations</div>
        </div>
        <div style={{ fontFamily:SERIF, color:'#fff', fontSize:96, lineHeight:1.0, fontWeight:500, letterSpacing:'-0.01em', textShadow:'0 2px 26px rgba(0,0,0,.35)' }}>
          {title}
        </div>
      </div>
    </>
  );
}

function MontageShot({ start, dur, src, title, idx, total, dir='in', from='center' }:
  { start:number; dur:number; src:string; title:string; idx:string; total:string; dir?:string; from?:string }) {
  return (
    <Sprite start={start} end={start+dur}>
      <Shot src={src} dir={dir} from={from} />
      <Scrim />
      <Mark />
      <ShotLabel kicker={idx} title={title} total={total} />
    </Sprite>
  );
}

// ── Confetti ─────────────────────────────────────────────────────────────────
function Confetti({ n=18 }: { n?:number }) {
  const { localTime } = useSprite();
  const cols = [C.gold, C.rose, C.goldSoft, C.plum];
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none' }}>
      {Array.from({ length:n }, (_,i) => {
        const seed = (i*97.13)%1, sx = (i*131.7)%100, spd = 14+(i%5)*5;
        const y = ((seed*1080) + localTime*spd*8) % 1140 - 30;
        const x = sx/100*1920 + Math.sin((localTime+seed*6)*1.2)*22;
        const sz = 5 + (i%4)*2;
        return <div key={i} style={{ position:'absolute', left:x, top:y, width:sz, height:sz, borderRadius:'50%', background:cols[i%cols.length], opacity:.34 }} />;
      })}
    </div>
  );
}

// ── Stats scene ───────────────────────────────────────────────────────────────
function StatItem({ value, suffix, label, p }: { value:number; suffix:string; label:string; p:number }) {
  const shown = Math.round(value * easeOutCubic(p));
  return (
    <div style={{ textAlign:'center', flex:1 }}>
      <div style={{ fontFamily:SERIF, color:C.ink, fontSize:150, fontWeight:500, lineHeight:1, letterSpacing:'-0.02em' }}>{shown}{suffix}</div>
      <div style={{ width:44, height:1, background:C.gold, margin:'26px auto 22px' }} />
      <div style={{ fontFamily:SANS, color:C.plum, fontSize:23, letterSpacing:'0.26em', textTransform:'uppercase', fontWeight:500 }}>{label}</div>
    </div>
  );
}
function Stats() {
  const { localTime, duration } = useSprite();
  const p   = clamp(localTime / 1.3, 0, 1);
  const out = clamp((duration - localTime) / 0.35, 0, 1);
  const head = easeOutCubic(clamp(localTime / 0.6, 0, 1));
  return (
    <div style={{ position:'absolute', inset:0, background:C.cream, opacity:out }}>
      <Confetti n={16} />
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', padding:'0 120px' }}>
        <div style={{ opacity:head, transform:`translateY(${(1-head)*18}px)`, fontFamily:SANS, color:C.gold, letterSpacing:'0.36em', fontSize:20, textTransform:'uppercase', fontWeight:500, marginBottom:70 }}>Notre engagement</div>
        <div style={{ display:'flex', width:'100%', maxWidth:1400, gap:40 }}>
          <StatItem value={200} suffix="+" label="Événements" p={p} />
          <StatItem value={5}   suffix="★" label="Satisfaction" p={p} />
          <StatItem value={100} suffix="%" label="Sur mesure"   p={p} />
        </div>
      </div>
    </div>
  );
}

// ── CTA scene ────────────────────────────────────────────────────────────────
function CTA() {
  const { localTime } = useSprite();
  const eo = (t: number) => easeOutCubic(clamp(t, 0, 1));
  const a = eo(localTime / 0.7);
  const b = eo((localTime - 0.4) / 0.8);
  const c = eo((localTime - 0.95) / 0.7);
  const line = (p: number): React.CSSProperties => ({ opacity:p, transform:`translateY(${(1-p)*26}px)` });
  return (
    <div style={{ position:'absolute', inset:0, background:C.ink, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', textAlign:'center', padding:'0 140px' }}>
      <Confetti n={20} />
      <div style={{ ...line(a), fontFamily:SANS, color:C.goldSoft, letterSpacing:'0.4em', fontSize:20, textTransform:'uppercase', fontWeight:500, marginBottom:40 }}>Commençons ensemble</div>
      <div style={{ ...line(b), fontFamily:SERIF, color:'#fff', fontSize:104, lineHeight:1.05, fontWeight:500, letterSpacing:'-0.01em', maxWidth:1280 }}>
        Votre prochaine célébration{' '}
        <span style={{ fontStyle:'italic', color:C.goldSoft }}>mérite l'excellence.</span>
      </div>
      <div style={{ ...line(c), marginTop:64, display:'flex', flexDirection:'column', alignItems:'center', gap:24 }}>
        <div style={{ fontFamily:SERIF, color:'#fff', fontSize:46, letterSpacing:'0.02em', borderBottom:`1px solid ${C.gold}`, paddingBottom:10 }}>event-fiesta.ch</div>
        <div style={{ fontFamily:SANS, color:'rgba(255,255,255,.6)', letterSpacing:'0.3em', fontSize:17, textTransform:'uppercase' }}>Décoration sur mesure · Lausanne</div>
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
const SHOTS = [
  { src:`${BASE}anniversaires/Anniv_1.webp`,            title:'Anniversaire',        dir:'in',  from:'center' },
  { src:`${BASE}Baptemes/Bapteme_1.jpeg`,               title:'Baptême',             dir:'out', from:'top'    },
  { src:`${BASE}Gender-Reveal/GenderReveal_1.webp`,     title:'Baby Shower',         dir:'in',  from:'center' },
  { src:`${BASE}Soiree-a-theme/Soiree_1.avif`,          title:'Soirée à thème',      dir:'out', from:'center' },
  { src:`${BASE}Corporate/Corporate_1.jpg`,             title:'Corporate',           dir:'in',  from:'bottom' },
  { src:`${BASE}Creation-sur-mesure/IMG_6343.JPG`,      title:'Création sur mesure', dir:'out', from:'center' },
  { src:`${BASE}goodies/Goodies_1.jpg`,                 title:'Goodies & cadeaux',   dir:'in',  from:'center' },
];
const M_START = 3.0;
const M_DUR   = 1.12;

export function VideoReel({ active = true }: { active?: boolean }) {
  const statsStart = M_START + SHOTS.length * M_DUR;

  return (
    <Stage duration={15} background={C.ink} active={active}>
      {/* Intro */}
      <Sprite start={0} end={3.08}>
        <Shot src={`${BASE}Hero/Hero_3.jpg`} dir="in" from="center" />
        <Scrim />
        <Mark />
        <Intro />
      </Sprite>

      {/* Montage */}
      {SHOTS.map((s, i) => (
        <MontageShot key={i}
          start={M_START + i * M_DUR} dur={M_DUR + 0.04}
          src={s.src} title={s.title}
          idx={String(i + 1).padStart(2, '0')} total={String(SHOTS.length).padStart(2, '0')}
          dir={s.dir} from={s.from}
        />
      ))}

      {/* Stats */}
      <Sprite start={statsStart} end={statsStart + 2.35}>
        <Stats />
      </Sprite>

      {/* CTA */}
      <Sprite start={13.0} end={15.0}>
        <CTA />
      </Sprite>

      <GoldFrame />
    </Stage>
  );
}
