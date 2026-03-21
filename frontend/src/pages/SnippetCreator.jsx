import { useState } from "react";
import axios from "axios";
// (axios this is main library to send http requests (ryan2));
import Editor from "@monaco-editor/react";
import { useNavigate } from "react-router-dom";
import API_BASE from '../config.js'
import { useToast } from "../components/Toast.jsx";
import ClickSpark from "../component/ClickSpark.jsx";
import GooyNav from '../component/GooeyNav.jsx'
import Silk from '../components/Silk.jsx'
import Beams from '../components/Beams';
import LetterGlitch from '../components/LetterGlitch.jsx'

const LANG_COLORS = {
  python: "#3b82f6", javascript: "#f59e0b", java: "#f97316",
  html: "#ef4444", css: "#8b5cf6", cpp: "#06b6d4",
};

const items = [
  { label: "↑ Post Snippet" }
];

export default function SnippetCreator() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("print('hello')");
  const [loading, setLoading] = useState(false);
  const showToast = useToast()

  const token = localStorage.getItem("token");

  // ── ALL ORIGINAL LOGIC UNTOUCHED ─────────────────────────────────────────
  const handleSubmit = async () => {
    if (!token) {
      showToast("Please login first");
      navigate("/");
      return;
    }
    try {
      setLoading(true);
      await axios.post(
        `${API_BASE}/api/snippets/`,
        { title, language, code },
        { headers: { Authorization: `Token ${token}` } }
      );
      showToast("Snippet posted successfully");
      navigate("/dashboard");
    } catch (err) {
      console.log("POST ERROR:", err.response?.data || err.message);
      showToast("Error posting snippet");
    } finally {
      setLoading(false);
    }
  };

  const [showPreview, setShowPreview] = useState(false);
  const color = LANG_COLORS[language] || "#64748b";
  // ──────────────────────────────────────────────────────────────────────────

  

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        .cv-creator-root {
          min-height: 100vh;
          background: transparent;
          font-family: "Geist Mono", monospace;
          color: #f1f5f9;
        }

        
        .cv-cr-nav {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(3,7,18,.28);
          backdrop-filter: blur(20px) saturate(160%);
          -webkit-backdrop-filter: blur(20px) saturate(160%);
          border-bottom: 1px solid rgba(255,255,255,.12);
          padding: 0 32px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: 50px;
        }

        .cv-cr-nav-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 18px;
          font-weight: 700;
          letter-spacing: -0.5px;
          color: #f1f5f9;
        }

        .cv-cr-back {
          background: rgba(255,255,255,.08);
          border: 1px solid rgba(255,255,255,.15);
          border-radius: 8px;
          color: #94a3b8;
          padding: 6px 14px;
          font-size: 13px;
          font-family: "Geist Mono", monospace;
          cursor: pointer;
          transition: all .18s;
          display: flex;
          align-items: center;
          gap: 6px;
          backdrop-filter: blur(10px);
        }
        .cv-cr-back:hover { background: rgba(255,255,255,.14); color: #f1f5f9; }

        /* ── Layout ── */
        .cv-cr-main {
          position: relative;
          z-index: 1;
          width: 100%;
          height: calc(100vh - 60px);
          padding: 20px 24px 24px;
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 15px;
          align-items: start;
          overflow: hidden;
        }

        @media (max-width: 720px) {
          .cv-cr-main { grid-template-columns: 1fr; height: auto; overflow: auto; }
        }

        
        .cv-cr-sidebar {
          display: flex;
          flex-direction: column;
          gap: 14px;
          height: 100%;
          overflow-y: auto;
          width:19.7vw;
        }

        /* ── Glass panel — matches image 2 ── */
        .cv-cr-panel {
          position: relative;
          background: rgba(255,255,255,.06);
          backdrop-filter: blur(28px) saturate(180%) brightness(1.08);
          -webkit-backdrop-filter: blur(28px) saturate(180%) brightness(1.08);
          border: 1px solid rgba(255,255,255,.18);
          border-radius: 18px;
          padding: 20px;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.22),
            inset 0 -1px 0 rgba(0,0,0,.08),
            0 8px 32px rgba(0,0,0,.35);
          overflow: hidden;
        }

        /* Top shimmer line on panel */
        .cv-cr-panel::before {
          content: '';
          position: absolute;
          top: 0; left: 10%; width: 80%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent);
          pointer-events: none;
        }

        .cv-cr-panel-title {
          font-size: 11px;
          font-family: "Geist Mono", monospace;
          color: #34d399;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin: 0 0 12px;
        }

        .cv-cr-label {
          display: block;
          font-size: 12px;
          color: rgba(255,255,255,.35);
          margin-bottom: 6px;
          font-family: "Geist Mono", monospace;
        }

        .cv-cr-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255,255,255,.14);
          border-radius: 10px;
          padding: 11px 14px;
          color: #f1f5f9e0;
          font-size: 14px;
          font-family: "Geist Mono", monospace;
          outline: none;
          transition: border-color .2s, box-shadow .2s;
          margin-bottom: 14px;
          backdrop-filter: blur(10px);
        }
        .cv-cr-input::placeholder { color: rgba(255,255,255,.2); }
        .cv-cr-input:focus {
          border-color: rgba(22, 163, 74, 0.53);
          box-shadow: 0 0 0 3px rgba(22,163,74,.08);
        }

        /* Language grid */
        .cv-lang-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; }

        .cv-lang-opt {
          display: flex;
          align-items: center;
          gap: 7px;
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 10px;
          padding: 8px 10px;
          cursor: pointer;
          font-size: 12px;
          font-family: "Geist Mono", monospace;
          color: rgba(255, 255, 255, 0.88);
          transition: all .18s;
        }
        .cv-lang-opt:hover { background: rgba(255,255,255,.1); color: rgba(255,255,255,.7); }
        .cv-lang-opt.active { color: #f1f5f9; }

        .cv-lang-dot-sm { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

        /* Submit button — glass green */
        .cv-cr-submit {
          width: 100%;
          position: relative;
          background: rgba(22,163,74,.25);
          backdrop-filter: blur(18px);
          border: 1px solid rgba(52,211,153,.35);
          border-radius: 14px;
          color: #fff;
          padding: 13px 2px;
          font-size: 15px;
          font-weight: 600;
          font-family: "Geist Mono", monospace;
          cursor: pointer;
          transition: all .2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.2),
            0 4px 20px rgba(22,163,74,.2);
          overflow: hidden;
        }
        .cv-cr-submit::before {
          content: '';
          position: absolute; top: 0; left: 10%; width: 80%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.4), transparent);
        }
        .cv-cr-submit:hover:not(:disabled) {
          background: rgba(22,163,74,.35);
          transform: translateY(-1px);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.25), 0 8px 28px rgba(22,163,74,.3);
        }
        .cv-cr-submit:active:not(:disabled) { transform: translateY(0); }
        .cv-cr-submit:disabled { opacity: .45; cursor: not-allowed; }

        .cv-cr-loading-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #fff;
          animation: cvPulse .8s ease infinite alternate;
        }
        @keyframes cvPulse {
          from { opacity: .3; transform: scale(.8); }
          to   { opacity: 1;  transform: scale(1.2); }
        }

        /* ── Editor side ── */
        .cv-cr-editor-wrap { display: flex; flex-direction: column; gap: 14px; height: 100%; }

        /* ── Glass editor panel — exact match to image 2 ── */
        .cv-cr-editor-panel {
          position: relative;
          background: rgba(255,255,255,.06);
          backdrop-filter: blur(32px) saturate(200%) brightness(1.1);
          -webkit-backdrop-filter: blur(32px) saturate(200%) brightness(1.1);
          border: 1px solid rgba(255,255,255,.2);
          border-radius: 20px;
          overflow: hidden;
          flex: 1;
          display: flex;
          flex-direction: column;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.28),
            inset 0 -1px 0 rgba(0,0,0,.1),
            0 20px 60px rgba(0,0,0,.4),
            0 4px 16px rgba(0,0,0,.25);
        }

        /* Top specular shimmer */
        .cv-cr-editor-panel::before {
          content: '';
          position: absolute; top: 0; left: 8%; width: 84%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.69), transparent);
          z-index: 2; pointer-events: none;
        }

        .cv-cr-editor-header {
          padding: 14px 18px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.21);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(255, 255, 255, 0);
          position: relative; z-index: 1;
        }

        .cv-cr-editor-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-family: 'JetBrains Mono', monospace;
          color: rgba(255, 255, 255, 0.92);
        }

        .cv-cr-editor-lang {
          font-weight: 600;
          border-radius: 6px;
          padding: 2px 10px;
          font-size: 11px;
          border: 1px solid;
        }

        .cv-cr-traffic { display: flex; gap: 6px; }
        .cv-cr-traffic span { width: 12px; height: 12px; border-radius: 50%; }

        .cv-cr-editor-body {
          flex: 1; min-height: 0;
          padding: 4px 0;
          position: relative; z-index: 1;
        }

        /* ── Preview panel ── */
        .cv-cr-preview-panel {
          position: relative;
          background: rgba(255, 255, 255, 0.14);
          backdrop-filter: blur(28px) saturate(180%);
          -webkit-backdrop-filter: blur(28px) saturate(180%);
          border: 1px solid rgba(255,255,255,.18);
          border-radius: 18px;
          overflow: hidden;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.2), 0 8px 32px rgba(0, 0, 0, 0.58);
        }

        .cv-cr-preview-header {
          padding: 12px 18px;
          border-bottom: 1px solid rgba(255,255,255,.07);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(255,255,255,.03);
        }

        .cv-cr-preview-title {
          font-size: 12px;
          font-family: "Geist Mono", monospace;
          color: rgba(255,255,255,.35);
          letter-spacing: 0.5px;
        }

        .cv-cr-preview-toggle {
          background: rgba(99,102,241,.15);
          border: 1px solid rgba(99,102,241,.3);
          border-radius: 8px;
          color: #818cf8;
          padding: 4px 12px;
          font-size: 12px;
          font-family: "Geist Mono", monospace;
          font-weight: 600;
          cursor: pointer;
          transition: all .18s;
        }
        .cv-cr-preview-toggle:hover { background: rgba(99,102,241,.25); }

        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,.12); border-radius: 3px; }

        /* ── Force Monaco editor transparent ── */
.cv-cr-editor-panel .monaco-editor,
.cv-cr-editor-panel .monaco-editor-background,
.cv-cr-editor-panel .monaco-editor .margin,
.cv-cr-editor-panel .monaco-editor .monaco-editor-background,
.cv-cr-editor-panel .monaco-editor .inputarea.ime-input,
.cv-cr-editor-panel .overflow-guard,
.cv-cr-editor-panel .monaco-scrollable-element,
.cv-cr-editor-panel .lines-content,
.cv-cr-editor-panel .view-lines,
.cv-cr-editor-panel .monaco-editor .margin-view-overlays {
backdrop-filter: blur(8px);
color: black;
  background: transparent !important;
  background-color: transparent !important;
}
      `}</style>

      <ClickSpark sparkColor='#fff' sparkSize={10} sparkRadius={15} sparkCount={8} duration={400}>
        <div className="cv-creator-root">
          <ClickSpark sparkColor='#fff' sparkSize={10} sparkRadius={15} sparkCount={8} duration={400}>

            {/* ── Silk fullscreen background ── */}
            <div style={{ width: '100%', height: '1000px', position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
              <Beams
                beamWidth={1.5}
                beamHeight={19}
                beamNumber={20}
                lightColor="#9824a5"
                speed={4.9}
                noiseIntensity={2.05}
                scale={0.22}
                rotation={417}
              />
              {/* <LetterGlitch
                glitchSpeed={10}
                centerVignette={true}
                outerVignette={false}
                smooth={true}
              /> */}
            </div>
            {/* {#ffffff36 } */}

            <nav className="cv-cr-nav">
              <div className="cv-cr-nav-brand">
                <img src="./public/logo.jpg" alt="logo" className="cv-logo-img" /> Ryan's Core
              </div>
              <button className="cv-cr-back" onClick={() => navigate("/dashboard")}>
                ← Dashboard
              </button>
            </nav>

            
            <div className="cv-cr-main">

             
              <aside className="cv-cr-sidebar">

               
                <div className="cv-cr-panel">
                  <p className="cv-cr-panel-title">File Name</p>
                  <label className="cv-cr-label">Enter with Extension:</label>
                  <input
                    className="cv-cr-input"
                    placeholder="Enter File Name"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                
                <div className="cv-cr-panel">
                  <p className="cv-cr-panel-title">Language</p>
                  <div className="cv-lang-grid">
                    {[
                      { value: "python", label: "Python" },
                      { value: "javascript", label: "JS" },
                      { value: "java", label: "Java" },
                      { value: "html", label: "HTML" },
                      { value: "css", label: "CSS" },
                      { value: "cpp", label: "C++" },
                    ].map((l) => {
                      const c = LANG_COLORS[l.value] || "#64748b";
                      const active = language === l.value;
                      return (
                        <button
                          key={l.value}
                          className={`cv-lang-opt${active ? " active" : ""}`}
                          style={active ? { background: `${c}22`, borderColor: `${c}50`, color: c } : {}}
                          onClick={() => setLanguage(l.value)}
                        >
                          <div className="cv-lang-dot-sm"
                            style={{ background: c, boxShadow: active ? `0 0 6px ${c}` : "none" }} />
                          {l.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

               
                <button className="cv-cr-submit" onClick={handleSubmit} disabled={loading}>
                  {loading ? (
                    <><div className="cv-cr-loading-dot" /> Posting…</>
                  ) : (
                    "↑ Post Snippet"
                  )}
                </button>

              </aside>

             
              <div className="cv-cr-editor-wrap">

                
                <div className="cv-cr-editor-panel">
                  <div className="cv-cr-editor-header">
                    <div className="cv-cr-editor-title">
                      <span>editor</span>
                      <span className="cv-cr-editor-lang"
                        style={{ background: `${color}20`, color, borderColor: `${color}50` }}>
                        {language}
                      </span>
                    </div>
                    <div className="cv-cr-traffic">
                      <span style={{ background: "#ef4444" }} />
                      <span style={{ background: "#f59e0b" }} />
                      <span style={{ background: "#22c55e" }} />
                    </div>
                  </div>

                  <div className="cv-cr-editor-body">
                    
                    <Editor
                      height="calc(100vh - 160px)"
                      theme="vs-dark"
                      language={language}
                      value={code}
                      onChange={(value) => setCode(value || "")}
                      options={{
                        fontSize: 16,
                        fontFamily: "'JetBrains Mono', monospace",
                        color:"Black",
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        padding: { top: 16, bottom: 16 },
                        lineNumbersMinChars: 3,
                      }}
                      onMount={(editor) => {
                        // Make Monaco bg transparent so glass shows through
                        const container = editor.getDomNode();
                        if (container) {
                          const monacoEl = container.querySelector('.monaco-editor');
                          const monacoScrollable = container.querySelector('.monaco-editor-background');
                          if (monacoEl) monacoEl.style.background = 'transparent';
                          if (monacoScrollable) monacoScrollable.style.background = 'transparent';
                        }
                      }}
                    />
                  </div>
                </div>

            
                {language === "html" && (
                  <div className="cv-cr-preview-panel">
                    <div className="cv-cr-preview-header">
                      <span className="cv-cr-preview-title">LIVE PREVIEW</span>
                      <button className="cv-cr-preview-toggle"
                        onClick={() => setShowPreview(!showPreview)}>
                        {showPreview ? "▼ Hide" : "▶ Show"}
                      </button>
                    </div>
                    {showPreview && (
                      <iframe title="preview" srcDoc={code}
                        style={{ width: "100%", height: "220px", background: "#fff", border: "none", display: "block" }} />
                    )}
                  </div>
                )}

              </div>
            </div>

          </ClickSpark>
        </div>
      </ClickSpark>
    </>
  );
}