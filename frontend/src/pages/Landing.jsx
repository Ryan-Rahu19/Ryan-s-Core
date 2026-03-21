// Add this at the top with your other imports
import GradientBlinds from '../component/GradientBlinds'
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import TextPressure from "../components/TextPressure";
import ScrollReveal from "../components/ScrollReveal";
import ScrollTrigger from 'gsap/ScrollTrigger';
import FallingText from '../components/FallingText'
import BorderGlow from '../components/BorderGlow'
import SpotlightCard from '../components/SpotlightCard'
import TextCursor from '../components/TextCursor';
gsap.registerPlugin(ScrollTrigger)
const ORBS = [
  { w: 520, h: 520, top: "-10%", left: "-8%", color: "rgba(34,197,94,.18)", blur: 120, delay: 0 },
  { w: 400, h: 400, top: "50%", right: "-5%", color: "rgba(99,102,241,.15)", blur: 100, delay: 0.4 },
  { w: 300, h: 300, top: "30%", left: "40%", color: "rgba(14,165,233,.12)", blur: 90, delay: 0.8 },
  { w: 250, h: 250, top: "70%", left: "15%", color: "rgba(168,85,247,.1)", blur: 80, delay: 1.2 },
];

const FLOATING_SNIPPETS = [
  { code: "const vault = new CodeVault();", top: "12%", left: "3%", rotate: -4 },
  { code: "def save_snippet(code, lang):", top: "22%", right: "2%", rotate: 3 },
  { code: "git commit -m 'add snippet'", top: "65%", left: "1%", rotate: -2 },
  { code: "export default function App() {", top: "75%", right: "3%", rotate: 4 },
  { code: "<CodeVault token={auth} />", top: "45%", left: "2%", rotate: -3 },
  { code: "SELECT * FROM snippets WHERE owner=me", top: "88%", right: "2%", rotate: 2 },
];

const FEATURES = [
  { icon: "⌗", title: "Smart Storage", desc: "Organise snippets by language, tags, and project with instant search." },
  { icon: "⬡", title: "Instant Sharing", desc: "Generate public links for any snippet — shareable without login." },
  { icon: "✦", title: "Owner Control", desc: "Only you can edit or delete your snippets. Full ownership, always." },
  { icon: "▶", title: "Live Preview", desc: "HTML snippets render in real-time directly inside the card." },
];

export default function Landing() {
  const navRef = useRef(null);
  const badgeRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const featuresRef = useRef(null);
  const orbsRef = useRef([]);
  const codeRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {

      
      orbsRef.current.forEach((orb, i) => {
        if (!orb) return;
        gsap.from(orb, { scale: 0, opacity: 0, duration: 1.8, delay: ORBS[i].delay, ease: "power3.out" });
        gsap.to(orb, { y: `${(i % 2 === 0 ? -1 : 1) * (20 + i * 8)}px`, duration: 4 + i * 1.2, repeat: -1, yoyo: true, ease: "sine.inOut", delay: i * 0.3 });
      });

     
      codeRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.from(el, { opacity: 0, x: i % 2 === 0 ? -40 : 40, duration: 1.4, delay: 0.5 + i * 0.18, ease: "power2.out" });
        gsap.to(el, { y: `${(i % 2 === 0 ? -1 : 1) * 14}px`, duration: 3.5 + i * 0.6, repeat: -1, yoyo: true, ease: "sine.inOut", delay: i * 0.5 });
      });

     
      gsap.from(navRef.current, { y: -60, opacity: 0, duration: 0.9, ease: "power3.out", delay: 0.2 });

      
      gsap.from(badgeRef.current, { scale: 0.4, opacity: 0, duration: 0.7, ease: "back.out(2)", delay: 0.6 });

     
      gsap.from(titleRef.current, { y: 50, opacity: 0, duration: 0.9, ease: "power3.out", delay: 0.85 });

      
      gsap.from(subtitleRef.current, { y: 30, opacity: 0, duration: 0.8, ease: "power2.out", delay: 1.4 });
      gsap.from(ctaRef.current, { y: 30, opacity: 0, duration: 0.8, ease: "power2.out", delay: 1.6 });

      if (featuresRef.current) {
        const cards = gsap.utils.toArray(".lp-feat-card");

        // First, ensure cards are visible initially (in case GSAP fails)
        gsap.set(cards, { opacity: 1, y: 0, scale: 1 });

        gsap.from(cards, {
          y: 60,
          opacity: 0,
          scale: 0.96,
          duration: 0.8,
          stagger: 0.15,  // Reduced for smoother cascade
          ease: "power3.out",
          scrub: 1,
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 75%",  
            toggleActions: "play none none none", scrub: 1
          }
          
        });
      }
    

    });
    return () => ctx.revert();
  }, []);




  return (
    <>
      <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap');
      font-family: "Space Grotesk", sans-serif;
       
       

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .lp-root {
          min-height: 100vh; background: #020817;
          font-family: "Space Grotesk", sans-serif;
          overflow-x: hidden; position: relative;
        }
        .lp-root::after {
          content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 0; opacity: .6;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
        }
          /* Add inside your <style> tag */
.text-cursor-container,
[class*="TextCursor"],
[class*="text-cursor"] {
  position: fixed !important;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 9999 !important;
}
        .lp-mesh {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 80% 60% at 10% 20%, rgba(34,197,94,.07) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 90% 80%, rgba(99,102,241,.07) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 50% 50%, rgba(14,165,233,.04) 0%, transparent 60%);
        }
        .lp-orb { position: fixed; border-radius: 50%; pointer-events: none; z-index: 0; }
        .lp-float-code {
          position: fixed; font-family: "Space Grotesk", sans-serif;
          font-size: 11px; color: rgba(255,255,255,.06);
          white-space: nowrap; pointer-events: none; z-index: 1; letter-spacing: 0.3px;
        }

        /* ── Nav ── */
        .lp-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          padding: 0 40px; height: 68px;
          display: flex; align-items: center; justify-content: space-between;
          background: rgba(2, 8, 23, 0.07); backdrop-filter: blur(8px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 50px;
        }
        .lp-nav-brand {
          display: flex; align-items: center; gap: 10px;
          font-family: "Bebas Neue", sans-serif;
          font-size: 25px;
          margin-right: 0.25em;
          color: #f0f4ff; letter-spacing: 2.9px;
          font-weight:800
        }
        .lp-nav-icon {
          width: 34px; height: 34px; border-radius: 10px;
          background: linear-gradient(135deg, rgba(34,197,94,.25), rgba(16,185,129,.15));
          border: 1px solid rgba(34,197,94,.3);
          display: flex; align-items: center; justify-content: center; font-size: 16px;
          font-family: "Space Grotesk", sans-serif;
        }
        .lp-nav-links { display: flex; align-items: center; gap: 12px; }
        .lp-nav-login {
          padding: 8px 20px; 
           
          border-radius: 50px;
          backdrop-filter: blur(8px);
          color: #cbd5e1; font-size: 14px; 
          font-weight: 300;
          text-decoration: none; transition: all .2s;
        }
        .lp-nav-login:hover { color: #f0f4ff; }
        .lp-nav-register {
          padding: 8px 20px;
          background: linear-gradient(135deg, #16a34a85, #15803c30);
          border: 1px solid rgba(34, 197, 94, 0.42); 
          border-radius: 10px;
          color: #fff; font-size: 14px; font-weight: 600;
          text-decoration: none; transition: all .2s;
          box-shadow: 0 0 20px rgba(34,197,94,.2);
          backdrop-filter: blur(8px);
          font-weight: 600;
        }
        .lp-nav-register:hover { opacity: .9; box-shadow: 0 0 30px rgba(34,197,94,.35); transform: translateY(-1px); }

        /* ── Hero ── */
        .lp-hero {
          position: relative; z-index: 10; min-height: 100vh;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 120px 24px 80px; text-align: center;
        }
        .lp-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(34,197,94,.08); border: 1px solid rgba(34,197,94,.2);
          border-radius: 100px; padding: 6px 16px;
          font-size: 12px; font-weight: 500; color: #34d399;
          letter-spacing: 1px; text-transform: uppercase;
          margin-bottom: 32px; font-family: "Space Grotesk", sans-serif;
          backdrop-filter: blur(10px);
        }
        .lp-badge-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #34d399; box-shadow: 0 0 8px #34d399;
          animation: lpPulse 2s infinite;
        }
        @keyframes lpPulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:.5; transform:scale(.8); }
        }

        /* ── Title host — TextPressure lives here ── */
        .lp-title-host { margin-bottom: 16px; }

        .lp-subtitle-line {
          font-size: 21px; color: #f72584;
          font-weight: 410; letter-spacing: 4px; text-transform: uppercase;
          font-family: "Space Grotesk", sans-serif; margin-bottom: 36px;
        }
        .lp-sub {
          max-width: 520px; font-size: 23px;
          color: #f72584; line-height: 1.7; margin-bottom: 44px; font-weight:30vw;
        }

        /* ── CTA ── */
        .lp-cta { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
        .lp-cta-primary {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 15px 32px;
          background: linear-gradient(135deg, #9716a375, #0d948936);
          border: none; border-radius: 14px; color: #fff;
          backdrop-filter: blur(30px);
          font-size: 16px; font-weight: 600; font-family: "Space Grotesk", sans-serif;
          text-decoration: none; cursor: pointer; transition: all .25s;
          box-shadow: 0 0 40px rgba(34, 197, 94, 0.11), 0 4px 20px rgba(0,0,0,.4);
          position: relative; overflow: hidden;
        }
        .lp-cta-primary::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,.15), transparent);
          opacity: 0; transition: opacity .2s;
        }
        .lp-cta-primary:hover::before { opacity: 1; }
        .lp-cta-primary:hover { transform: translateY(-2px); box-shadow: 0 0 60px rgba(34,197,94,.4), 0 8px 30px rgba(0,0,0,.4); }
        .lp-cta-secondary {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 15px 32px;  border-radius: 34px;
          color: #cbd5e1; font-size: 16px; font-weight: 500;
          font-family: "Space Grotesk", sans-serif; text-decoration: none;
          transition: all .25s; backdrop-filter: blur(10px);
        }
        .lp-cta-secondary:hover {  color: #f0f4ff; transform: translateY(-2px); }

        /* ── Glass snippet preview ── */
        .lp-preview-wrap { position: relative; z-index: 10; max-width: 700px; margin: 0 auto; padding: 0 24px 80px; }
        .lp-preview-label { text-align: center; margin-bottom: 16px; font-size: 15px; color: #f72584; font-family: "Space Grotesk", sans-serif; letter-spacing: 1px; text-transform: uppercase; font-weight: 900}
        .lp-glass-card {
          background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.1);
          border-radius: 20px; overflow: hidden; backdrop-filter: blur(24px);
          box-shadow: 0 32px 80px rgba(0,0,0,.6), 0 0 0 1px rgba(34,197,94,.05),
            inset 0 1px 0 rgba(255,255,255,.08);
        }
        .lp-glass-topbar {
          padding: 14px 20px; border-bottom: 1px solid rgba(255,255,255,.06);
          display: flex; align-items: center; justify-content: space-between;
          background: rgba(255,255,255,.02);
        }
        .lp-glass-traffic { display: flex; gap: 7px; }
        .lp-glass-traffic span { width: 12px; height: 12px; border-radius: 50%; }
        .lp-glass-lang {
          font-family: "Space Grotesk", sans-serif; font-size: 11px; color: #34d399;
          background: rgba(34,197,94,.1); border: 1px solid rgba(34,197,94,.2);
          border-radius: 6px; padding: 2px 10px;
        }
        .lp-glass-code { padding: 24px 28px; font-family: "Space Grotesk", sans-serif; font-size: 13px; line-height: 26px; color: #94a3b8; }
        .lp-gc-kw { color: #60a5fa; font-weight: 600; }
        .lp-gc-fn { color: #34d399; }
        .lp-gc-cm { color: #f72584; font-style: italic;font-weight: 900 }
        .lp-gc-nu { color: #fb923c; }

        /* ── Features ── */
        .lp-features { position: relative; z-index: 10; max-width: 920px; margin: 0 auto; padding: 0 24px 120px; }
        .lp-feat-heading { text-align: center; margin-bottom: 48px; }
        .lp-feat-heading h2 { font-family: "Space Grotesk", sans-serif; font-size: 48px; font-weight: 700; letter-spacing: -1px; color: #bec3d1; margin-bottom: 10px; }
        .lp-feat-heading p { color: white; font-size: 15px; text-shadow: 0 0 20px rgba(34,211,238,0.25); }
        .lp-feat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px,1fr)); gap: 16px }
        /* ✅ Make sure lp-feat-card fills SpotlightCard */
.lp-feat-card {
  background: rgba(255,255,255,.03);
  border: 1px solid rgba(255,255,255,.07);
  border-radius: 18px;
  padding: 28px 24px;
  backdrop-filter: blur(36px);
  position: relative;
  overflow: hidden;
  /* ── Remove any width/height constraints ── */
  width: 100%;
  height: 100%;
  min-height: 200px;  /* ✅ Ensure minimum height for content */
  display: flex;
  flex-direction: column;
}
        .lp-feat-card::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,rgba(34, 197, 94, 0.39),transparent); opacity:0; transition:opacity .3s; }
        .lp-feat-card:hover { background: rgba(255,255,255,.06); border-color: rgba(34,197,94,.2); transform: translateY(-4px); box-shadow: 0 20px 60px rgba(0,0,0,.4), 0 0 30px rgba(34,197,94,.05); }
        .lp-feat-card:hover::before { opacity: 1; }
        .lp-feat-icon { width:44px; height:44px; border-radius:12px; background:rgba(34,197,94,.1); border:1px solid rgba(34,197,94,.2); display:flex; align-items:center; justify-content:center; font-size:20px; margin-bottom:16px; }
        .lp-feat-card h3 { font-family: "Space Grotesk", sans-serif; font-size:16px; font-weight:100vw; color:#f72584ae; margin-bottom:8px; letter-spacing:-0.3px; }
        .lp-feat-card p { font-size:13px; color:#bec3d1; line-height:1.6; font-weight:600}

        /* ── Footer CTA ── */
        .lp-footer-cta { position:relative; z-index:10; text-align:center; padding:0 24px 100px; }
        // .lp-footer-glass { display:inline-block; background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.08); border-radius:24px; padding:52px 64px; backdrop-filter:blur(20px); max-width:560px; width:100%; }
        .lp-footer-glass h2 { font-family: "Space Grotesk", sans-serif; font-size:4.3vw; font-weight:800; color:#f0f4ff; margin-bottom:12px; letter-spacing:-1px; }
        .lp-footer-glass p { color:#bec3d1; font-size:20px; margin-bottom:32px; line-height:1.6; }
      `}</style>

      <TextCursor
        text="code"
        spacing={80}
        followMouseDirection
        randomFloat
        exitDuration={0.3}
        removalInterval={20}
        maxPoints={10}
      />

      <div style={{ height: '600px', position: 'relative' }}>
        
      
          
        
          <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
            <GradientBlinds
              gradientColors={['#683d82ee', '#0208175b']}
              angle={0}
              noise={0.3}
              blindCount={10}
              blindMinWidth={100}
              spotlightRadius={0.80}
              spotlightSoftness={1}
              spotlightOpacity={0.9}
              mouseDampening={1}
              distortAmount={10}
              shineDirection="top"
              mixBlendMode="lighten"
            />
          </div>
        

        {ORBS.map((orb, i) => (
          <div key={i} ref={el => orbsRef.current[i] = el} className="lp-orb"
            style={{
              width: orb.w, height: orb.h, top: orb.top, left: orb.left, right: orb.right,
              background: `radial-gradient(circle, ${orb.color}, transparent 70%)`,
              filter: `blur(${orb.blur}px)`
            }} />
        ))}

        {FLOATING_SNIPPETS.map((s, i) => (
          <div key={i} ref={el => codeRefs.current[i] = el} className="lp-float-code"
            style={{ top: s.top, left: s.left, right: s.right, transform: `rotate(${s.rotate}deg)` }}>
            {s.code}
          </div>
        ))}

        {/* ── Navbar ── */}
        <nav className="lp-nav" ref={navRef}>
          <Link to="/" className="lp-nav-brand">
              <BorderGlow
                edgeSensitivity={50}
                glowColor="80 80 80"
                backgroundColor="#262429"
                borderRadius={58}
                glowRadius={40}
                glowIntensity={1}
                coneSpread={25}
                animated
                colors={['#c084fc', '#f472b6', '#38bdf8']}
              >
              <img src="/logo.jpg" alt="logo" className="cv-logo-img" />
              </BorderGlow>
              Ryan's Core
          </Link>
          <div className="lp-nav-links">
              <BorderGlow
                edgeSensitivity={50}
                glowColor="80 80 80"
                backgroundColor="#262429"
                borderRadius={58}
                glowRadius={40}
                glowIntensity={1}
                coneSpread={25}
                animated
                colors={['#c084fc', '#f472b6', '#38bdf8']}
              >
            <Link to="/login" className="lp-nav-login">Login</Link>
              </BorderGlow>
            <Link to="/register" className="lp-nav-register">Get Started ..!</Link>
          </div>
        </nav>

        {/* ── Hero ── */}
        <section className="lp-hero">
          <div className="lp-badge" ref={badgeRef}>
            <span className="lp-badge-dot" />
            Your Personal Code Library
          </div>

          {/* ── TextPressure title — mouse warps each letter's weight ── */}
          <div className="lp-title-host" ref={titleRef}>
            <TextPressure
                text="Ryan's Core.!"
              flex
              alpha={false}
              stroke={true}
              width={false}
              weight
              italic={false}
              textColor="#fffbfb"
                strokeColor="#f72584ae"
              minFontSize={200}
            />
          </div>

          <p className="lp-subtitle-line" ref={subtitleRef}>
            Snippet Sharing Platform You never experienced before..!!
          </p>

          <p className="lp-sub">
          
            Store, organise, and share code snippets in a beautiful vault.
            Built for developers who value their craft.
           
          </p>

          <div className="lp-cta" ref={ctaRef}>
            <Link to="/register" className="lp-cta-primary">Register..!</Link>
              <BorderGlow
                edgeSensitivity={50}
                glowColor="80 80 80"
                backgroundColor="#262429"
                borderRadius={58}
                glowRadius={40}
                glowIntensity={1}
                coneSpread={25}
                animated
                colors={['#c084fc', '#f472b6', '#38bdf8']}
              >
            <Link to="/login" className="lp-cta-secondary">Sign In..!</Link>
              </BorderGlow>
          </div>
        </section>

        {/* ── Glass snippet preview ── */}
        <div className="lp-preview-wrap">
          <p className="lp-preview-label">⌗ &nbsp; snippet preview</p>
          
          <div className="lp-glass-card">
            <div className="lp-glass-topbar">
              <div className="lp-glass-traffic">
                <span style={{ background: "#ef4444" }} />
                <span style={{ background: "#f59e0b" }} />
                <span style={{ background: "#22c55e" }} />
              </div>
              <span className="lp-glass-lang">python</span>
            </div>
            <div className="lp-glass-code">
              <div><span className="lp-gc-cm"># fibonacci sequence — clean & efficient</span></div>
              <div><span className="lp-gc-kw">def</span> <span className="lp-gc-fn">fibonacci</span>(n: <span className="lp-gc-fn">int</span>) -&gt; <span className="lp-gc-fn">list</span>:</div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;a, b = <span className="lp-gc-nu">0</span>, <span className="lp-gc-nu">1</span></div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;result = []</div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="lp-gc-kw">for</span> _ <span className="lp-gc-kw">in</span> <span className="lp-gc-fn">range</span>(n):</div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;result.<span className="lp-gc-fn">append</span>(a)</div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;a, b = b, a + b</div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="lp-gc-kw">return</span> result</div>
                <div style={{ marginTop: 8 }}><span className="lp-gc-cm"># saved to Ryan's Core ✦</span></div>
            </div>
          </div>
            
        </div>

        {/* ── Features ── */}
        <section className="lp-features" ref={featuresRef}>
          <div className="lp-feat-heading">
            <ScrollReveal
              baseOpacity={0.10}
              enableBlur
              baseRotation={12}
              blurStrength={8}
            >
            
              Everything you need.
              Built for developers, designed for speed, 
              Sharability,
              </ScrollReveal>
            
          </div>
          
          <div className="lp-feat-grid">
            {FEATURES.map((f, i) => (
              <SpotlightCard
                key={i}
                className="custom-spotlight-card"
                spotlightColor="#683d82ee"
              >
                <div className="lp-feat-card">
                  <div className="lp-feat-icon">{f.icon}</div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </section>

        {/* ── Footer CTA ── */}
        <div className="lp-footer-cta">
          <div className="lp-footer-glass">
            <h2>
              Ready to build your vault?</h2>
            <p>Join and start saving code snippets in under 30 seconds.</p>
          
          </div>
        </div>
      </div>
      
    </>
  );
}