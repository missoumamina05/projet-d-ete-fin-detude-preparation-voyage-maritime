'use client'
import { useEffect, useRef, useState } from 'react'

const KEYFRAMES = `
  @keyframes ticker-scroll {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes pulse-dot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.5; transform: scale(1.5); }
  }
  @keyframes fade-up {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { overflow-x: hidden; -webkit-font-smoothing: antialiased; }
  a { text-decoration: none; }
  .hero-img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center right;
    z-index: 0;
  }
`

const TICKER_ITEMS = [
  { icon: '⚓', text: 'TADOUSSAC · VENT SO 15 NDS' },
  { icon: '≋', text: 'MARÉE HAUTE QUÉBEC · 14H32 · 4.8 M' },
  { icon: '⚠', text: 'TRAFIC VHF CANAL 16' },
  { icon: '≋', text: 'VISIBILITÉ 8 NM · HOULE 0.6 M' },
  { icon: '⚓', text: 'AURORES BORÉALES POSSIBLES · CÔTE-NORD' },
  { icon: '≋', text: 'BULLETIN · TADOUSSAC' },
  { icon: '⚓', text: 'RIMOUSKI · VENT NE 8 NDS' },
  { icon: '≋', text: 'SEPT-ÎLES · BRUME LÉGÈRE' },
]

function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS]
  return (
    <div style={{
      background: '#0a1628', height: '36px', overflow: 'hidden',
      display: 'flex', alignItems: 'center',
      borderBottom: '1px solid rgba(212,146,10,0.2)',
      position: 'relative', zIndex: 100,
    }}>
      <div style={{ display: 'flex', whiteSpace: 'nowrap', animation: 'ticker-scroll 50s linear infinite' }}>
        {items.map((item, i) => (
          <span key={i} style={{
            color: '#d4920a', fontSize: '11px', letterSpacing: '0.12em',
            fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
            fontWeight: 500, padding: '0 40px',
          }}>
            {item.icon}&nbsp;&nbsp;{item.text}
          </span>
        ))}
      </div>
    </div>
  )
}

function Compass() {
  const needleRef = useRef<SVGGElement>(null)
  useEffect(() => {
    let angle = 308, raf: number
    const animate = () => {
      angle += 0.012
      if (needleRef.current)
        needleRef.current.setAttribute('transform', `rotate(${angle}, 200, 200)`)
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [])

  const ticks = Array.from({ length: 72 }, (_, i) => {
    const a = (i * 5 * Math.PI) / 180
    const isMaj = i % 18 === 0, isMed = i % 6 === 0
    const r1 = 185, r2 = isMaj ? 167 : isMed ? 175 : 181
    return {
      x1: 200 + r1 * Math.sin(a), y1: 200 - r1 * Math.cos(a),
      x2: 200 + r2 * Math.sin(a), y2: 200 - r2 * Math.cos(a),
      isMaj, isMed,
    }
  })

  return (
    <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <circle cx="200" cy="200" r="185" fill="none" stroke="rgba(212,146,10,0.45)" strokeWidth="1.5" />
      <circle cx="200" cy="200" r="148" fill="none" stroke="rgba(212,146,10,0.3)" strokeWidth="1" strokeDasharray="5 8" />
      <circle cx="200" cy="200" r="92"  fill="none" stroke="rgba(212,146,10,0.18)" strokeWidth="1" strokeDasharray="3 5" />
      {ticks.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
          stroke={t.isMaj ? 'rgba(212,146,10,0.85)' : t.isMed ? 'rgba(212,146,10,0.5)' : 'rgba(212,146,10,0.22)'}
          strokeWidth={t.isMaj ? 2.5 : t.isMed ? 1.5 : 0.8} />
      ))}
      {[
        { l: 'N', x: 200, y: 20, main: true },
        { l: 'E', x: 386, y: 204, main: false },
        { l: 'S', x: 200, y: 388, main: false },
        { l: 'O', x: 14,  y: 204, main: false },
      ].map(d => (
        <text key={d.l} x={d.x} y={d.y} textAnchor="middle" dominantBaseline="middle"
          fill={d.main ? '#d4920a' : 'rgba(212,146,10,0.5)'}
          fontSize={d.main ? '15' : '12'} fontWeight={d.main ? '700' : '500'}
          fontFamily="'DM Sans', sans-serif">{d.l}</text>
      ))}
      <g ref={needleRef} transform="rotate(308, 200, 200)">
        <polygon points="200,40 213,194 200,218 187,194" fill="#d4920a" />
        <polygon points="200,218 207,245 200,358 193,245" fill="rgba(212,146,10,0.22)" />
        <circle cx="200" cy="200" r="11" fill="#d4920a" />
        <circle cx="200" cy="200" r="5"  fill="#0a1628" />
      </g>
    </svg>
  )
}

function Hero() {
  return (
    <section style={{
      position: 'relative', height: 'calc(100vh - 36px)', minHeight: '650px',
      background: '#071120', overflow: 'hidden',
    }}>
      {/* ✅ IMAGE avec balise <img> — beaucoup plus fiable que background-image CSS */}
      <img
        className="hero-img"
        src="/sea-luxury.jpg"
        alt=""
      />

      {/* Gradient gauche léger pour lisibilité du texte */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'linear-gradient(to right, rgba(5,14,28,0.72) 0%, rgba(5,14,28,0.35) 55%, rgba(5,14,28,0.05) 100%)',
      }} />
      {/* Gradient bas */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '200px', zIndex: 1,
        background: 'linear-gradient(to top, rgba(5,14,28,0.92) 0%, transparent 100%)',
      }} />

      {/* Navbar */}
      <nav style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 48px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px', height: '40px', background: '#d4920a',
            borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '19px',
          }}>⚓</div>
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: '15px', fontFamily: "'DM Sans', sans-serif" }}>Cap Marine</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '9px', letterSpacing: '0.15em', marginTop: '1px', fontFamily: "'DM Sans', sans-serif" }}>QUÉBEC · SAINT-LAURENT</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <a href="#" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px', fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>Connexion</a>
          <a href="#" style={{
            background: '#d4920a', color: '#fff', padding: '9px 22px',
            borderRadius: '8px', fontSize: '14px', fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
          }}>Embarquer</a>
        </div>
      </nav>

      {/* Contenu */}
      <div style={{
        position: 'relative', zIndex: 5, height: '100%',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '0 48px', paddingTop: '60px',
        animation: 'fade-up 0.9s ease both',
      }}>
        {/* Badge coordonnées */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(10,22,40,0.60)',
          border: '1px solid rgba(212,146,10,0.45)',
          borderRadius: '100px', padding: '6px 14px',
          marginBottom: '22px', width: 'fit-content',
        }}>
          <span style={{
            width: '6px', height: '6px', borderRadius: '50%', background: '#d4920a',
            display: 'inline-block', animation: 'pulse-dot 2s ease-in-out infinite',
          }} />
          <span style={{ color: '#d4920a', fontSize: '11px', letterSpacing: '0.08em', fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
            48° 09' N · 69° 43' O · TADOUSSAC EN DIRECT
          </span>
        </div>

        {/* Titre 4 lignes */}
        <h1 style={{
          fontFamily: "'Playfair Display', 'Georgia', serif",
          fontSize: 'clamp(42px, 5vw, 68px)',
          lineHeight: 1.06, marginBottom: '32px', maxWidth: '700px',
        }}>
          <span style={{ color: '#fff', display: 'block' }}>Le fleuve</span>
          <span style={{ color: '#d4920a', fontStyle: 'italic', display: 'block' }}>se prépare</span>
          <span style={{ color: '#fff', display: 'block' }}>avant qu'on le</span>
          <span style={{ color: '#fff', display: 'block' }}>navigue.</span>
        </h1>

        {/* Cards compactes */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'stretch', maxWidth: '680px' }}>
          <div style={{
            background: 'rgba(8,18,34,0.78)', backdropFilter: 'blur(10px)',
            borderRadius: '10px', padding: '14px 18px',
            border: '1px solid rgba(255,255,255,0.07)', flex: '2 1 0',
          }}>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '12px', lineHeight: 1.65, fontFamily: "'DM Sans', sans-serif" }}>
              Carte ECDIS, marées du SHC, météo d'Environnement Canada et règlements du{' '}
              <span style={{ color: '#d4920a' }}>Saint-Laurent</span>
              {' '}— réunis dans une passerelle pensée à Québec, pour les marins du fleuve.
            </p>
          </div>
          <div style={{
            background: 'rgba(8,18,34,0.78)', backdropFilter: 'blur(10px)',
            borderRadius: '10px', padding: '14px 18px',
            border: '1px solid rgba(255,255,255,0.07)', flex: '1 1 0', minWidth: '110px',
          }}>
            <div style={{ color: 'rgba(255,255,255,0.38)', fontSize: '9px', letterSpacing: '0.13em', marginBottom: '5px', fontFamily: "'DM Sans', sans-serif" }}>CAP SUGGÉRÉ</div>
            <div style={{ color: '#fff', fontSize: '26px', fontWeight: 700, fontFamily: "'DM Sans', sans-serif", lineHeight: 1 }}>308°</div>
          </div>
          <div style={{
            background: 'rgba(8,18,34,0.78)', backdropFilter: 'blur(10px)',
            borderRadius: '10px', padding: '14px 18px',
            border: '1px solid rgba(255,255,255,0.07)', flex: '1 1 0', minWidth: '110px',
          }}>
            <div style={{ color: 'rgba(255,255,255,0.38)', fontSize: '9px', letterSpacing: '0.13em', marginBottom: '5px', fontFamily: "'DM Sans', sans-serif" }}>MARÉE</div>
            <div style={{ color: '#fff', fontSize: '20px', fontFamily: "'Playfair Display', serif", fontStyle: 'italic', lineHeight: 1 }}>↑ flot</div>
            <div style={{ color: 'rgba(255,255,255,0.32)', fontSize: '9px', marginTop: '4px', fontFamily: "'DM Sans', sans-serif" }}>Québec · QC</div>
          </div>
        </div>
      </div>

      {/* Boussole droite */}
      <div style={{
        position: 'absolute', right: '-80px', top: '50%',
        transform: 'translateY(-50%)', zIndex: 4,
        width: '520px', height: '520px', opacity: 0.85,
      }}>
        <Compass />
      </div>
    </section>
  )
}

function TideChart({ station }: { station: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let raf: number
    const tide = (t: number) => {
      const h1 = Math.exp(-Math.pow((t - 0.22) / 0.14, 2))
      const h2 = Math.exp(-Math.pow((t - 0.65) / 0.14, 2))
      return Math.max(0, (h1 + h2) * 0.88)
    }
    const draw = () => {
      const W = canvas.width, H = canvas.height
      const now = Date.now() / 1000
      const pl = 30, pr = 20, pt = 20, pb = 30
      const cW = W - pl - pr, cH = H - pt - pb
      ctx.clearRect(0, 0, W, H)
      ctx.strokeStyle = '#f2f2f0'
      ctx.lineWidth = 1
      for (let i = 1; i <= 3; i++) {
        ctx.beginPath(); ctx.moveTo(pl, pt + cH * i / 4); ctx.lineTo(W - pr, pt + cH * i / 4); ctx.stroke()
      }
      const grad = ctx.createLinearGradient(0, pt, 0, pt + cH)
      grad.addColorStop(0, 'rgba(192,172,138,0.32)')
      grad.addColorStop(1, 'rgba(192,172,138,0.03)')
      ctx.beginPath(); ctx.moveTo(pl, pt + cH)
      for (let x = 0; x <= cW; x++) ctx.lineTo(pl + x, pt + cH - tide(x / cW) * cH * 0.88)
      ctx.lineTo(pl + cW, pt + cH); ctx.closePath(); ctx.fillStyle = grad; ctx.fill()
      ctx.beginPath(); ctx.strokeStyle = '#0d1f35'; ctx.lineWidth = 2.5; ctx.lineJoin = 'round'; ctx.lineCap = 'round'
      for (let x = 0; x <= cW; x++) { const y = pt + cH - tide(x / cW) * cH * 0.88; x === 0 ? ctx.moveTo(pl + x, y) : ctx.lineTo(pl + x, y) }
      ctx.stroke()
      const cT = 0.50, cX = pl + cT * cW, cY = pt + cH - tide(cT) * cH * 0.88
      ctx.setLineDash([4, 5]); ctx.strokeStyle = '#d4920a'; ctx.lineWidth = 1.5
      ctx.beginPath(); ctx.moveTo(cX, pt); ctx.lineTo(cX, pt + cH); ctx.stroke(); ctx.setLineDash([])
      const pulse = 3.5 + Math.sin(now * 3) * 2.5
      ctx.beginPath(); ctx.arc(cX, cY, pulse + 3, 0, Math.PI * 2); ctx.fillStyle = 'rgba(212,146,10,0.18)'; ctx.fill()
      ctx.beginPath(); ctx.arc(cX, cY, 4.5, 0, Math.PI * 2); ctx.fillStyle = '#d4920a'; ctx.fill()
      ctx.fillStyle = '#bbb'; ctx.font = '11px "DM Sans", sans-serif'; ctx.textAlign = 'center'
      ;['00H', '06H', '12H', '18H', '24H'].forEach((l, i) => ctx.fillText(l, pl + (i / 4) * cW, H - 7))
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [station])
  return (
    <div style={{ background: '#fff', borderRadius: '16px', padding: '24px 24px 14px', boxShadow: '0 2px 32px rgba(0,0,0,0.07)', border: '1px solid #efefef' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
        <div>
          <div style={{ fontSize: '10px', color: '#c0c0b8', letterSpacing: '0.13em', marginBottom: '4px', fontFamily: "'DM Sans', sans-serif" }}>HAUTEUR D'EAU · 24H</div>
          <div style={{ fontSize: '17px', fontWeight: 600, color: '#0d1f35', fontFamily: "'DM Sans', sans-serif" }}>Station {station.charAt(0) + station.slice(1).toLowerCase()} · QC</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '27px', fontWeight: 700, color: '#d4920a', fontFamily: "'DM Sans', sans-serif", lineHeight: 1 }}>3.4 m</div>
          <div style={{ fontSize: '10px', color: '#bbb', letterSpacing: '0.08em', marginTop: '3px', fontFamily: "'DM Sans', sans-serif" }}>↑ FLOT</div>
        </div>
      </div>
      <canvas ref={canvasRef} width={520} height={200} style={{ width: '100%', height: 'auto', display: 'block' }} />
    </div>
  )
}

const STATIONS = ['MONTRÉAL', 'TROIS-RIVIÈRES', 'QUÉBEC', 'TADOUSSAC', 'RIMOUSKI', 'SEPT-ÎLES', 'GASPÉ']

function TideSection() {
  const [selected, setSelected] = useState('QUÉBEC')
  return (
    <section style={{ background: '#f4f6f9', padding: '100px 60px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.25fr', gap: '80px', alignItems: 'center' }}>
        <div>
          <div style={{ color: '#d4920a', fontSize: '11px', letterSpacing: '0.16em', fontWeight: 600, marginBottom: '20px', fontFamily: "'DM Sans', sans-serif" }}>MARÉGRAMME · {selected}</div>
          <h2 style={{ fontFamily: "'Playfair Display', 'Georgia', serif", fontSize: 'clamp(30px, 4vw, 48px)', lineHeight: 1.14, color: '#0d1f35', marginBottom: '20px' }}>
            Le fleuve respire <em>deux<br />fois par jour</em>.
          </h2>
          <p style={{ color: '#5a6b7e', fontSize: '15px', lineHeight: 1.78, fontFamily: "'DM Sans', sans-serif", marginBottom: '32px', maxWidth: '400px' }}>
            À Québec, le marnage atteint près de 5 mètres. Cap Marine synchronise en continu les prédictions du Service hydrographique du Canada pour 12 stations entre Montréal et la Pointe-au-Père.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {STATIONS.map(s => (
              <button key={s} onClick={() => setSelected(s)} style={{
                padding: '7px 16px', borderRadius: '100px',
                border: `1.5px solid ${s === selected ? '#d4920a' : '#cdd2db'}`,
                background: 'transparent', color: s === selected ? '#d4920a' : '#637080',
                fontSize: '11px', letterSpacing: '0.08em', fontWeight: s === selected ? 600 : 400,
                fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', transition: 'all 0.2s',
              }}>{s}</button>
            ))}
          </div>
        </div>
        <TideChart station={selected} />
      </div>
    </section>
  )
}

function ModuleWave() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let raf: number, t = 0
    const draw = () => {
      const W = canvas.width, H = canvas.height
      ctx.clearRect(0, 0, W, H); t += 0.022
      ctx.beginPath(); ctx.strokeStyle = '#d4920a'; ctx.lineWidth = 2.2; ctx.lineJoin = 'round'; ctx.lineCap = 'round'
      for (let x = 0; x <= W; x++) {
        const p = x / W, y = H / 2 + Math.sin(p * Math.PI * 2.8 + t) * (H * 0.32) * Math.sin(p * Math.PI)
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.stroke()
      const dp = (t * 0.075) % 1, dx = dp * W
      const dy = H / 2 + Math.sin(dp * Math.PI * 2.8 + t) * (H * 0.32) * Math.sin(dp * Math.PI)
      ctx.beginPath(); ctx.arc(dx, dy, 5.5, 0, Math.PI * 2); ctx.fillStyle = '#d4920a'; ctx.fill()
      raf = requestAnimationFrame(draw)
    }
    draw(); return () => cancelAnimationFrame(raf)
  }, [])
  return <canvas ref={canvasRef} width={600} height={80} style={{ width: '100%', height: '80px', display: 'block' }} />
}

const MODULES = [
  { icon: '◎', title: 'Plan de route', desc: 'Waypoints, cap, distance et ETA segment par segment.' },
  { icon: '≋', title: 'Météo & marées', desc: 'Vent, houle et heures de pleine mer du SHC.' },
  { icon: '⚙', title: 'Boîte à outils', desc: 'Conversions, autonomie, stabilité, chargement.' },
  { icon: '📖', title: 'Règlements', desc: 'COLREG, Loi de 2001 sur la marine marchande du Canada.' },
  { icon: '📡', title: 'Veille AIS', desc: 'Trafic maritime en temps réel, signaux et trajectoires.' },
]
const CARD_SM: React.CSSProperties = { background: '#f8f9fb', borderRadius: '14px', padding: '26px', border: '1px solid #eef0f4' }
const ICON_BOX: React.CSSProperties = { width: '40px', height: '40px', background: '#eef0f4', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', marginBottom: '14px' }

function ModulesSection() {
  return (
    <section style={{ background: '#fff', padding: '100px 60px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '56px', alignItems: 'end' }}>
          <div>
            <div style={{ color: '#d4920a', fontSize: '11px', letterSpacing: '0.16em', fontWeight: 600, marginBottom: '16px', fontFamily: "'DM Sans', sans-serif" }}>SIX MODULES · UNE PASSERELLE</div>
            <h2 style={{ fontFamily: "'Playfair Display', 'Georgia', serif", fontSize: 'clamp(28px, 4vw, 46px)', lineHeight: 1.14, color: '#0d1f35' }}>
              Du <em>brief de quai</em> à la veille<br /><em>de quart</em>.
            </h2>
          </div>
          <p style={{ color: '#7a8b9e', fontSize: '15px', lineHeight: 1.72, fontFamily: "'DM Sans', sans-serif", alignSelf: 'end' }}>
            Pensé pour le fleuve et le golfe — règles canadiennes, marées du SHC, cartes du SHC/SHOM et météo d'Environnement Canada.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div style={{ background: '#0d1f35', borderRadius: '16px', padding: '36px 36px 0', overflow: 'hidden', gridRow: 'span 2', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '22px', marginBottom: '14px' }}>🗺</div>
            <h3 style={{ fontFamily: "'Playfair Display', 'Georgia', serif", fontSize: '26px', color: '#fff', fontWeight: 700, marginBottom: '12px' }}>Carte ECDIS allégée</h3>
            <p style={{ color: 'rgba(255,255,255,0.58)', fontSize: '14px', lineHeight: 1.72, fontFamily: "'DM Sans', sans-serif", flex: 1 }}>
              Leaflet avec aides à la navigation, météo Windy, balisage IALA région B et trafic AIS superposés. Centrée par défaut sur le Saint-Laurent.
            </p>
            <div style={{ marginTop: '28px' }}><ModuleWave /></div>
          </div>
          {MODULES.slice(0, 2).map(m => (
            <div key={m.title} style={CARD_SM}>
              <div style={ICON_BOX}>{m.icon}</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', color: '#0d1f35', fontWeight: 700, marginBottom: '8px' }}>{m.title}</h3>
              <p style={{ color: '#7a8b9e', fontSize: '13px', lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>{m.desc}</p>
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          {MODULES.slice(2).map(m => (
            <div key={m.title} style={CARD_SM}>
              <div style={ICON_BOX}>{m.icon}</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', color: '#0d1f35', fontWeight: 700, marginBottom: '8px' }}>{m.title}</h3>
              <p style={{ color: '#7a8b9e', fontSize: '13px', lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function QuoteSection() {
  return (
    <section style={{ background: '#0a1628', padding: '110px 60px', textAlign: 'center', overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'absolute', right: '-120px', top: '-120px', width: '420px', height: '420px', opacity: 0.05 }}><Compass /></div>
      <div style={{ position: 'relative', zIndex: 2, maxWidth: '820px', margin: '0 auto' }}>
        <div style={{ fontSize: '26px', color: '#d4920a', marginBottom: '34px' }}>≋</div>
        <blockquote style={{ fontFamily: "'Playfair Display', 'Georgia', serif", fontSize: 'clamp(20px, 3vw, 32px)', lineHeight: 1.55, color: '#fff', fontStyle: 'italic' }}>
          « Le marin prudent ne combat pas la mer ;{' '}
          <span style={{ color: '#d4920a' }}>il l'écoute avant d'appareiller. »</span>
        </blockquote>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', letterSpacing: '0.2em', marginTop: '34px', fontFamily: "'DM Sans', sans-serif" }}>
          VIEIL ADAGE DES PILOTES DU BAS SAINT-LAURENT
        </p>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section style={{ background: 'linear-gradient(135deg, #156070 0%, #197060 25%, #3d6e20 60%, #c08010 100%)', padding: '120px 60px', textAlign: 'center' }}>
      <h2 style={{ fontFamily: "'Playfair Display', 'Georgia', serif", fontSize: 'clamp(34px, 5.5vw, 68px)', color: '#fff', marginBottom: '20px', fontWeight: 700 }}>
        Prêt à larguer les amarres ?
      </h2>
      <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: '16px', marginBottom: '44px', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.65 }}>
        Créez un compte gratuit, ajoutez votre navire et planifiez<br />votre première traversée en moins de cinq minutes.
      </p>
      <a href="#" style={{ display: 'inline-block', background: '#fff', color: '#0d1f35', padding: '16px 44px', borderRadius: '10px', fontSize: '15px', fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
        Créer mon compte
      </a>
    </section>
  )
}

function Footer() {
  return (
    <footer style={{ background: '#071120', padding: '28px 60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ width: '38px', height: '38px', background: '#d4920a', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>⚓</div>
        <div>
          <div style={{ color: '#fff', fontWeight: 600, fontSize: '14px', fontFamily: "'DM Sans', sans-serif" }}>Cap Marine</div>
          <div style={{ color: 'rgba(255,255,255,0.32)', fontSize: '11px', fontFamily: "'DM Sans', sans-serif" }}>© 2026 — Tous droits réservés</div>
        </div>
      </div>
      <div style={{ border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px 18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '14px' }}>🎓</span>
        <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '10px', letterSpacing: '0.12em', fontFamily: "'DM Sans', sans-serif" }}>
          PROJET D'ÉTÉ · BACCALAURÉAT EN INFORMATIQUE · QUÉBEC, CANADA
        </span>
      </div>
    </footer>
  )
}

export default function Home() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />
      <Ticker />
      <Hero />
      <TideSection />
      <ModulesSection />
      <QuoteSection />
      <CTASection />
      <Footer />
    </>
  )
}