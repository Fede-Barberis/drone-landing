import { useEffect, useRef, useState } from "react";

/* ─── Particle canvas ─────────────────────────────────────────────── */
function ParticleCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let raf, W, H, pts = [];
    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    const init = () => {
      pts = Array.from({ length: 80 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25,
        r: Math.random() * 1.2 + .3, a: Math.random() * .5 + .1,
      }));
    };
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.hypot(dx, dy);
          if (d < 110) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(34,211,238,${.07 * (1 - d / 110)})`;
            ctx.lineWidth = .5;
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
        const p = pts[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34,211,238,${p.a})`;
        ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      }
      raf = requestAnimationFrame(draw);
    };
    resize(); init(); draw();
    window.addEventListener("resize", () => { resize(); init(); });
    return () => { cancelAnimationFrame(raf); };
  }, []);
  return <canvas ref={ref} style={{ position:"absolute",inset:0,width:"100%",height:"100%",opacity:.55,pointerEvents:"none" }} />;
}

/* ─── Drone SVG ────────────────────────────────────────────────────── */
function DroneIllustration() {
  return (
    <svg viewBox="0 0 600 480" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width:"100%", maxWidth:580, filter:"drop-shadow(0 0 60px rgba(34,211,238,.18)) drop-shadow(0 20px 60px rgba(0,0,0,.7))" }}>
      <defs>
        <filter id="propBlur"><feGaussianBlur stdDeviation="3.5"/></filter>
        <filter id="softBlur"><feGaussianBlur stdDeviation="12"/></filter>
        <filter id="glowBlur"><feGaussianBlur stdDeviation="6"/></filter>
        <linearGradient id="bodyTop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2A3A52"/>
          <stop offset="100%" stopColor="#111827"/>
        </linearGradient>
        <linearGradient id="armGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1a2535"/>
          <stop offset="50%" stopColor="#2e4060"/>
          <stop offset="100%" stopColor="#1a2535"/>
        </linearGradient>
        <linearGradient id="cameraGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#374151"/>
          <stop offset="100%" stopColor="#111827"/>
        </linearGradient>
        <radialGradient id="lensGrad" cx="38%" cy="38%" r="55%">
          <stop offset="0%" stopColor="#4B9CD3" stopOpacity=".9"/>
          <stop offset="60%" stopColor="#1e3a5f"/>
          <stop offset="100%" stopColor="#0B0F17"/>
        </radialGradient>
        <linearGradient id="motorGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3B4F6A"/>
          <stop offset="100%" stopColor="#1a2535"/>
        </linearGradient>
        <style>{`
          @keyframes spinProp { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
          .prop-fl { animation: spinProp .18s linear infinite; transform-box:fill-box; transform-origin:center; }
          .prop-fr { animation: spinProp .18s linear infinite reverse; transform-box:fill-box; transform-origin:center; }
          .prop-rl { animation: spinProp .22s linear infinite; transform-box:fill-box; transform-origin:center; }
          .prop-rr { animation: spinProp .22s linear infinite reverse; transform-box:fill-box; transform-origin:center; }
          @keyframes ledBlink { 0%,100%{opacity:1} 50%{opacity:.15} }
          .led-r  { animation: ledBlink 1.2s ease-in-out infinite; }
          .led-g  { animation: ledBlink 1.2s ease-in-out infinite .6s; }
          @keyframes scanLine { 0%{transform:translateY(-10px)} 100%{transform:translateY(10px)} }
          .scan   { animation: scanLine .9s ease-in-out infinite alternate; }
          @keyframes droneHover { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-14px)} }
          .drone-group { animation: droneHover 4s ease-in-out infinite; }
        `}</style>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="300" cy="462" rx="130" ry="12" fill="rgba(0,0,0,.45)" filter="url(#softBlur)">
        <animate attributeName="rx" values="130;165;130" dur="4s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values=".45;.18;.45" dur="4s" repeatCount="indefinite"/>
      </ellipse>

      <g className="drone-group">

        {/* ── ARMS ── */}
        <rect x="185" y="231" width="95" height="10" rx="5" fill="url(#armGrad)" transform="rotate(-38 185 231)"/>
        <rect x="320" y="231" width="95" height="10" rx="5" fill="url(#armGrad)" transform="rotate(38 320 231) translate(-95 0)"/>
        <rect x="185" y="257" width="95" height="10" rx="5" fill="url(#armGrad)" transform="rotate(38 185 257)"/>
        <rect x="320" y="257" width="95" height="10" rx="5" fill="url(#armGrad)" transform="rotate(-38 320 257) translate(-95 0)"/>

        {/* Arm accent */}
        <line x1="215" y1="218" x2="155" y2="185" stroke="#22D3EE" strokeWidth=".6" opacity=".25"/>
        <line x1="385" y1="218" x2="445" y2="185" stroke="#22D3EE" strokeWidth=".6" opacity=".25"/>
        <line x1="215" y1="266" x2="155" y2="299" stroke="#22D3EE" strokeWidth=".6" opacity=".25"/>
        <line x1="385" y1="266" x2="445" y2="299" stroke="#22D3EE" strokeWidth=".6" opacity=".25"/>

        {/* ── MOTORS ── */}
        {[{cx:133,cy:176},{cx:467,cy:176},{cx:133,cy:308},{cx:467,cy:308}].map((m,i)=>(
          <g key={i}>
            <circle cx={m.cx} cy={m.cy} r="24" fill="url(#motorGrad)" stroke="#2e4060" strokeWidth="1.5"/>
            <circle cx={m.cx} cy={m.cy} r="14" fill="#1a2535" stroke="#3B5998" strokeWidth="1"/>
            <circle cx={m.cx} cy={m.cy} r="5"  fill="#2563EB"/>
            <circle cx={m.cx} cy={m.cy} r="2.5" fill="#22D3EE"/>
          </g>
        ))}

        {/* ── PROPELLERS ── */}
        {/* FL */}
        <ellipse cx="133" cy="176" rx="60" ry="7" fill="rgba(34,211,238,.07)" filter="url(#propBlur)"/>
        <g className="prop-fl">
          <rect x="73"  y="173" width="120" height="6" rx="3" fill="rgba(156,220,240,.52)"/>
          <rect x="130" y="116" width="6"   height="120" rx="3" fill="rgba(156,220,240,.52)"/>
        </g>
        {/* FR */}
        <ellipse cx="467" cy="176" rx="60" ry="7" fill="rgba(34,211,238,.07)" filter="url(#propBlur)"/>
        <g className="prop-fr">
          <rect x="407" y="173" width="120" height="6" rx="3" fill="rgba(156,220,240,.52)"/>
          <rect x="464" y="116" width="6"   height="120" rx="3" fill="rgba(156,220,240,.52)"/>
        </g>
        {/* RL */}
        <ellipse cx="133" cy="308" rx="60" ry="7" fill="rgba(34,211,238,.05)" filter="url(#propBlur)"/>
        <g className="prop-rl">
          <rect x="73"  y="305" width="120" height="6" rx="3" fill="rgba(156,220,240,.42)"/>
          <rect x="130" y="248" width="6"   height="120" rx="3" fill="rgba(156,220,240,.42)"/>
        </g>
        {/* RR */}
        <ellipse cx="467" cy="308" rx="60" ry="7" fill="rgba(34,211,238,.05)" filter="url(#propBlur)"/>
        <g className="prop-rr">
          <rect x="407" y="305" width="120" height="6" rx="3" fill="rgba(156,220,240,.42)"/>
          <rect x="464" y="248" width="6"   height="120" rx="3" fill="rgba(156,220,240,.42)"/>
        </g>

        {/* ── MAIN BODY ── */}
        <rect x="222" y="212" width="156" height="62" rx="14" fill="url(#bodyTop)" stroke="#2e4060" strokeWidth="1.5"/>
        <rect x="230" y="218" width="140" height="26" rx="8" fill="#1d2d42" opacity=".7"/>
        {/* Logo */}
        <rect x="266" y="224" width="68" height="20" rx="5" fill="#0d1829"/>
        <text x="300" y="237.5" textAnchor="middle" fontFamily="'Rajdhani',sans-serif" fontSize="9.5" fontWeight="700" fill="#22D3EE" letterSpacing="1.8">AEROLUX</text>
        {/* Battery bar */}
        <rect x="238" y="254" width="124" height="5" rx="2.5" fill="#0d1829"/>
        <rect x="238" y="254" width="78"  height="5" rx="2.5" fill="#2563EB" opacity=".85"/>
        {/* Vent slots */}
        {[0,1,2,3].map(i=>(
          <rect key={i} x={344+i*7} y="221" width="4" height="15" rx="2" fill="#0B0F17" opacity=".8"/>
        ))}
        {/* Center cross */}
        <line x1="300" y1="212" x2="300" y2="274" stroke="#22D3EE" strokeWidth=".5" opacity=".15"/>
        <line x1="222" y1="243" x2="378" y2="243" stroke="#22D3EE" strokeWidth=".5" opacity=".15"/>

        {/* Nav LEDs */}
        <circle cx="232" cy="221" r="8" fill="rgba(248,113,113,.15)" filter="url(#glowBlur)" className="led-r"/>
        <circle cx="232" cy="221" r="3.5" fill="#F87171" className="led-r"/>
        <circle cx="368" cy="221" r="8" fill="rgba(74,222,128,.15)" filter="url(#glowBlur)" className="led-g"/>
        <circle cx="368" cy="221" r="3.5" fill="#4ADE80" className="led-g"/>
        <circle cx="300" cy="271" r="6" fill="rgba(34,211,238,.2)" filter="url(#glowBlur)"/>
        <circle cx="300" cy="271" r="2.5" fill="#22D3EE">
          <animate attributeName="opacity" values="1;.3;1" dur=".8s" repeatCount="indefinite"/>
        </circle>

        {/* ── CAMERA GIMBAL ── */}
        <rect x="276" y="272" width="48" height="9" rx="4.5" fill="#1a2535" stroke="#2e4060" strokeWidth="1"/>
        <rect x="272" y="279" width="56" height="36" rx="10" fill="url(#cameraGrad)" stroke="#2e4060" strokeWidth="1.2"/>
        <circle cx="300" cy="298" r="15" fill="#111827" stroke="#2e4060" strokeWidth="1.5"/>
        <circle cx="300" cy="298" r="11" fill="url(#lensGrad)"/>
        <circle cx="293" cy="291" r="3.5" fill="white" opacity=".18"/>
        <circle cx="295" cy="293" r="1.8" fill="white" opacity=".3"/>
        <rect x="291" y="297" width="18" height="1.5" rx=".75" fill="rgba(34,211,238,.65)" className="scan"/>
        <circle cx="300" cy="298" r="11" fill="none" stroke="#22D3EE" strokeWidth=".5" opacity=".4"/>
        <line x1="272" y1="291" x2="258" y2="296" stroke="#2e4060" strokeWidth="2" strokeLinecap="round"/>
        <line x1="328" y1="291" x2="342" y2="296" stroke="#2e4060" strokeWidth="2" strokeLinecap="round"/>

        {/* ── LANDING GEAR ── */}
        <line x1="258" y1="272" x2="244" y2="326" stroke="#2e4060" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="342" y1="272" x2="356" y2="326" stroke="#2e4060" strokeWidth="2.5" strokeLinecap="round"/>
        <rect x="224" y="324" width="40" height="5" rx="2.5" fill="#2e4060"/>
        <rect x="336" y="324" width="40" height="5" rx="2.5" fill="#2e4060"/>

        {/* Downwash glow */}
        <ellipse cx="300" cy="358" rx="65" ry="10" fill="rgba(34,211,238,.06)" filter="url(#softBlur)"/>
      </g>

      {/* HUD corner brackets */}
      {[[40,40,1,1],[560,40,-1,1],[40,440,1,-1],[560,440,-1,-1]].map(([x,y,sx,sy],i)=>(
        <g key={i} transform={`translate(${x} ${y}) scale(${sx} ${sy})`} opacity=".3">
          <line x1="0" y1="0" x2="22" y2="0" stroke="#22D3EE" strokeWidth="1.5"/>
          <line x1="0" y1="0" x2="0"  y2="22" stroke="#22D3EE" strokeWidth="1.5"/>
        </g>
      ))}

      {/* Center crosshair */}
      <circle cx="300" cy="242" r="80" fill="none" stroke="rgba(34,211,238,.06)" strokeWidth="1" strokeDasharray="4 8"/>
    </svg>
  );
}

/* ─── Telemetry card ───────────────────────────────────────────────── */
function TelemetryCard({ style, children, delay = 0 }) {
  const [on, setOn] = useState(false);
  useEffect(() => { const t = setTimeout(() => setOn(true), 700 + delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div style={{
      position:"absolute",
      background:"rgba(11,15,23,.82)",
      backdropFilter:"blur(14px)",
      border:"1px solid rgba(34,211,238,.18)",
      borderRadius:10,
      padding:"11px 15px",
      boxShadow:"0 8px 32px rgba(0,0,0,.5), inset 0 1px 0 rgba(34,211,238,.07)",
      opacity: on ? 1 : 0,
      transform: on ? "translateY(0)" : "translateY(12px)",
      transition:`opacity .6s ease, transform .6s ease`,
      ...style
    }}>{children}</div>
  );
}

/* ─── MAIN HERO ────────────────────────────────────────────────────── */
export default function Hero() {
  const [vis, setVis] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVis(true), 80); return () => clearTimeout(t); }, []);

  const tr = (delay) => ({
    opacity: vis ? 1 : 0,
    transform: vis ? "translateY(0)" : "translateY(28px)",
    transition: `opacity .7s ease ${delay}ms, transform .7s ease ${delay}ms`,
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        .hero {
          position:relative; min-height:100vh;
          background:#0B0F17;
          font-family:'DM Sans',sans-serif;
          overflow:hidden; display:flex; align-items:center;
        }
        .hero::before {
          content:'';
          position:absolute; top:0; right:0;
          width:55%; height:100%;
          background:linear-gradient(135deg, transparent 25%, rgba(37,99,235,.05) 70%, rgba(34,211,238,.03));
          clip-path: polygon(12% 0, 100% 0, 100% 100%, 0% 100%);
          pointer-events:none;
        }
        .blob { position:absolute; border-radius:50%; filter:blur(90px); pointer-events:none; }
        .b1 { width:700px;height:500px;background:radial-gradient(circle,rgba(37,99,235,.22) 0%,transparent 70%);top:-200px;left:-200px; }
        .b2 { width:420px;height:420px;background:radial-gradient(circle,rgba(34,211,238,.1) 0%,transparent 70%);bottom:-100px;right:5%;animation:bp 7s ease-in-out infinite; }
        @keyframes bp{0%,100%{transform:scale(1)}50%{transform:scale(1.12)}}
        .grid-bg {
          position:absolute; inset:0;
          background-image:linear-gradient(rgba(34,211,238,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(34,211,238,.025) 1px,transparent 1px);
          background-size:52px 52px; pointer-events:none;
        }
        .scanline {
          position:absolute; inset:0;
          background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,.06) 3px,rgba(0,0,0,.06) 4px);
          pointer-events:none;
        }
        .inner {
          position:relative; z-index:10;
          width:100%; max-width:1300px;
          margin:0 auto; padding:0 48px;
          display:grid; grid-template-columns:1fr 1fr;
          align-items:center; gap:0; min-height:100vh;
        }
        .badge {
          display:inline-flex; align-items:center; gap:8px;
          border:1px solid rgba(34,211,238,.25);
          background:rgba(34,211,238,.06);
          border-radius:4px; padding:5px 14px;
          font-family:'Rajdhani',sans-serif; font-size:11px; font-weight:600;
          letter-spacing:.15em; text-transform:uppercase; color:#22D3EE;
          margin-bottom:28px;
        }
        .badge-pulse{width:6px;height:6px;border-radius:50%;background:#22D3EE;box-shadow:0 0 8px #22D3EE;animation:blk 1.4s ease-in-out infinite;}
        @keyframes blk{0%,100%{opacity:1}50%{opacity:.2}}
        h1 {
          font-family:'Rajdhani',sans-serif;
          font-size:clamp(50px,5.5vw,84px);
          font-weight:700; line-height:.96;
          letter-spacing:-.01em; color:#F0F4FA;
          margin-bottom:10px;
        }
        .model-tag {
          display:block;
          font-family:'Rajdhani',sans-serif;
          font-size:clamp(26px,2.8vw,40px);
          font-weight:500; color:#2563EB;
          letter-spacing:.06em; margin-bottom:28px;
        }
        .accent{color:#22D3EE;}
        .desc{font-size:16px;line-height:1.75;color:#8B96A8;max-width:460px;margin-bottom:40px;}
        .desc strong{color:#c9d4e0;font-weight:500;}
        .actions{display:flex;gap:14px;flex-wrap:wrap;align-items:center;}
        .btn-p {
          position:relative; overflow:hidden;
          display:inline-flex; align-items:center; gap:9px;
          padding:13px 30px;
          background:linear-gradient(135deg,#2563EB,#1a4fd4);
          color:#fff; font-family:'Rajdhani',sans-serif;
          font-size:14px; font-weight:700; letter-spacing:.08em; text-transform:uppercase;
          border:none; border-radius:6px; cursor:pointer; text-decoration:none;
          box-shadow:0 0 30px rgba(37,99,235,.5),0 4px 20px rgba(0,0,0,.4);
          transition:transform .2s,box-shadow .2s;
          clip-path:polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%);
        }
        .btn-p::after{content:'';position:absolute;top:-50%;left:-60%;width:35%;height:200%;background:rgba(255,255,255,.18);transform:skewX(-20deg);transition:left .5s ease;}
        .btn-p:hover::after{left:130%;}
        .btn-p:hover{transform:translateY(-2px);box-shadow:0 0 50px rgba(37,99,235,.7),0 8px 30px rgba(0,0,0,.5);}
        .btn-g {
          display:inline-flex; align-items:center; gap:8px;
          padding:12px 22px;
          background:transparent; color:#8B96A8;
          font-family:'Rajdhani',sans-serif; font-size:14px; font-weight:600; letter-spacing:.08em; text-transform:uppercase;
          border:1px solid rgba(255,255,255,.1); border-radius:6px;
          cursor:pointer; text-decoration:none;
          transition:all .2s;
          clip-path:polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%);
        }
        .btn-g:hover{border-color:rgba(34,211,238,.35);color:#22D3EE;background:rgba(34,211,238,.05);transform:translateY(-2px);}
        .specs{display:flex;gap:0;margin-top:44px;border-top:1px solid rgba(255,255,255,.07);padding-top:28px;}
        .spec-item{flex:1;padding-right:18px;border-right:1px solid rgba(255,255,255,.06);margin-right:18px;}
        .spec-item:last-child{border-right:none;margin-right:0;}
        .spec-val{font-family:'Rajdhani',sans-serif;font-size:26px;font-weight:700;color:#F0F4FA;letter-spacing:-.01em;}
        .spec-val span{color:#22D3EE;font-size:17px;}
        .spec-lbl{font-size:11px;color:#6B7280;text-transform:uppercase;letter-spacing:.1em;margin-top:1px;}
        .right{position:relative;display:flex;justify-content:center;align-items:center;padding:20px 0;}
        .drone-wrap{position:relative;}
        .t-lbl{font-family:'Rajdhani',sans-serif;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#4B5563;margin-bottom:3px;}
        .t-val{font-family:'Rajdhani',sans-serif;font-size:18px;font-weight:700;color:#F0F4FA;}
        .t-sub{font-size:11px;color:#6B7280;margin-top:2px;}
        .t-bar{margin-top:7px;height:3px;background:rgba(255,255,255,.07);border-radius:2px;}
        .t-fill{height:100%;border-radius:2px;background:linear-gradient(90deg,#2563EB,#22D3EE);}
        .t-row{display:flex;gap:6px;align-items:baseline;}
        .t-accent{color:#22D3EE;font-family:'Rajdhani',sans-serif;font-size:13px;}
        .crosshair{position:absolute;top:50%;left:50%;width:320px;height:320px;transform:translate(-50%,-50%);border-radius:50%;border:1px dashed rgba(34,211,238,.1);pointer-events:none;animation:spinSlow 28s linear infinite;}
        .crosshair2{position:absolute;top:50%;left:50%;width:480px;height:480px;transform:translate(-50%,-50%);border-radius:50%;border:1px dashed rgba(37,99,235,.08);pointer-events:none;animation:spinSlow 42s linear infinite reverse;}
        @keyframes spinSlow{from{transform:translate(-50%,-50%) rotate(0deg)}to{transform:translate(-50%,-50%) rotate(360deg)}}
        @media(max-width:880px){
          .inner{grid-template-columns:1fr;padding:80px 24px;}
          .right{display:none;}
        }
      `}</style>

      <section className="hero">
        <div className="blob b1"/>
        <div className="blob b2"/>
        <div className="grid-bg"/>
        <div className="scanline"/>
        <ParticleCanvas/>

        <div className="inner">

          {/* ── LEFT ── */}
          <div>
            <div className="badge" style={tr(0)}>
              <div className="badge-pulse"/>
              Nuevo · Lanzamiento 2025
            </div>

            <h1 style={tr(120)}>
              DOMINA<br/>EL <span className="accent">CIELO.</span>
              <span className="model-tag">— AEROLUX X1 —</span>
            </h1>

            <p className="desc" style={tr(240)}>
              El dron de última generación para profesionales sin compromisos.
              Velocidad de <strong>120 km/h</strong>, autonomía de <strong>48 min</strong>
              &nbsp;y cámara <strong>8K</strong> con estabilización activa de 3 ejes.
            </p>

            <div className="actions" style={tr(360)}>
              <a href="#" className="btn-p">
                Reservar ahora
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a href="#" className="btn-g">Ver specs completas</a>
            </div>

            <div className="specs" style={tr(480)}>
              {[
                {val:"120",unit:"km/h",lbl:"Velocidad máx."},
                {val:"48", unit:"min", lbl:"Autonomía"},
                {val:"8",  unit:"K",   lbl:"Resolución cam."},
                {val:"4.7",unit:"km",  lbl:"Alcance"},
              ].map(s=>(
                <div className="spec-item" key={s.lbl}>
                  <div className="spec-val">{s.val}<span>{s.unit}</span></div>
                  <div className="spec-lbl">{s.lbl}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div className="right">
            <div className="crosshair"/>
            <div className="crosshair2"/>

            <div className="drone-wrap">
              <DroneIllustration/>

              {/* Altitude */}
              <TelemetryCard style={{top:10,right:-5,minWidth:145}} delay={0}>
                <div className="t-lbl">Altitud</div>
                <div className="t-row">
                  <div className="t-val">142</div>
                  <div className="t-accent">m ASL</div>
                </div>
                <div className="t-bar"><div className="t-fill" style={{width:"68%"}}/></div>
              </TelemetryCard>

              {/* Speed */}
              <TelemetryCard style={{top:130,right:-45,minWidth:155}} delay={180}>
                <div className="t-lbl">Velocidad</div>
                <div className="t-row">
                  <div className="t-val">87</div>
                  <div className="t-accent">km/h</div>
                </div>
                <div className="t-sub" style={{color:"#2563EB",fontFamily:"Rajdhani,sans-serif",fontSize:11,marginTop:4}}>▲ acelerando</div>
              </TelemetryCard>

              {/* Battery */}
              <TelemetryCard style={{bottom:90,left:-25,minWidth:160}} delay={360}>
                <div className="t-lbl">Batería</div>
                <div className="t-row">
                  <div className="t-val">78</div>
                  <div className="t-accent">%</div>
                </div>
                <div className="t-bar" style={{marginTop:8}}>
                  <div className="t-fill" style={{width:"78%",background:"linear-gradient(90deg,#22D3EE,#4ADE80)"}}/>
                </div>
                <div className="t-sub">~34 min restantes</div>
              </TelemetryCard>

              {/* GPS */}
              <TelemetryCard style={{bottom:200,left:-55,minWidth:138}} delay={540}>
                <div className="t-lbl">GPS</div>
                <div className="t-row">
                  <div className="t-val">4.7</div>
                  <div className="t-accent">km</div>
                </div>
                <div className="t-sub">14 satélites · fix</div>
              </TelemetryCard>

            </div>
          </div>

        </div>
      </section>
    </>
  );
}
