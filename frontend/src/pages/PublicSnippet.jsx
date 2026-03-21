import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import API_BASE from "../config";
import Silk from "../components/Silk";

function highlight(code, lang) {
    const esc = (s) =>
        s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    let c = esc(code);
    const rules = {
        python: [
            [/(#[^\n]*)/g, '<span class="ps-cm">$1</span>'],
            [/\b(def|class|return|if|else|elif|import|from|for|while|in|not|and|or|is|None|True|False|try|except|with|as|pass|lambda|yield|async|await)\b/g, '<span class="ps-kw">$1</span>'],
            [/(@\w+)/g, '<span class="ps-dec">$1</span>'],
            [/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g, '<span class="ps-st">$1</span>'],
            [/\b(\d+)\b/g, '<span class="ps-nm">$1</span>'],
        ],
        javascript: [
            [/(\/\/[^\n]*)/g, '<span class="ps-cm">$1</span>'],
            [/\b(const|let|var|function|return|if|else|for|while|import|export|default|class|new|this|async|await|try|catch|throw|typeof|null|undefined|true|false)\b/g, '<span class="ps-kw">$1</span>'],
            [/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g, '<span class="ps-st">$1</span>'],
            [/\b(\d+)\b/g, '<span class="ps-nm">$1</span>'],
        ],
        html: [
            [/(&lt;\/?[a-zA-Z][^&]*?&gt;)/g, '<span class="ps-tg">$1</span>'],
            [/("(?:[^"\\]|\\.)*")/g, '<span class="ps-st">$1</span>'],
        ],
        css: [
            [/(\/\*[\s\S]*?\*\/)/g, '<span class="ps-cm">$1</span>'],
            [/([.#]?[\w-]+\s*\{)/g, '<span class="ps-tg">$1</span>'],
            [/(:[\w-]+)/g, '<span class="ps-kw">$1</span>'],
        ],
    };
    (rules[lang] || []).forEach(([re, rep]) => { c = c.replace(re, rep); });
    return c;
}

const LANG_COLORS = {
    python: "#3b82f6", javascript: "#f59e0b", typescript: "#6366f1",
    html: "#ef4444", css: "#8b5cf6", bash: "#10b981",
    go: "#06b6d4", rust: "#f97316", java: "#f97316", cpp: "#06b6d4",
};

export default function PublicSnippet() {
    const { share_token } = useParams();
    const [snippet, setSnippet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        axios
            .get(`${API_BASE}/api/snippet/${share_token}/`)
            .then((res) => { setSnippet(res.data); setLoading(false); })
            .catch(() => { setNotFound(true); setLoading(false); });
    }, [share_token]);

    const handleCopy = () => {
        navigator.clipboard.writeText(snippet.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const lines = snippet?.code?.split("\n") || [];
    const color = LANG_COLORS[snippet?.language] || "#64748b";

    return (
        <>
            <style>{`
         @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        .ps-root {
          min-height: 100vh;
          background: #030712;
          font-family: "Geist Mono", monospace;
          color: #f1f5f9;
          display: flex;
          flex-direction: column;
        }

        .ps-root::before {
          content: '';
          position: fixed; inset: 0;
          background:
            radial-gradient(ellipse at 20% 40%, rgba(22,163,74,.07) 0%, transparent 55%),
            radial-gradient(ellipse at 80% 60%, rgba(59,130,246,.05) 0%, transparent 55%);
          pointer-events: none; z-index: 0;
        }

        /* ── Navbar ── */
        .ps-nav {
          position: sticky; top: 0; z-index: 100;
          background: rgba(3,7,18,.88);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255,255,255,.06);
          padding: 0 32px; height: 60px;
          display: flex; align-items: center; justify-content: space-between;
        }

        .ps-nav-brand {
          display: flex; align-items: center; gap: 8px;
          font-size: 18px; font-weight: 700;
          letter-spacing: -0.5px; color: #f1f5f9;
          text-decoration: none;
        }

        .ps-nav-badge {
          background: rgba(22,163,74,.15); color: #34d399;
          border: 1px solid rgba(22,163,74,.3);
          border-radius: 6px; padding: 2px 10px;
          font-size: 11px;font-family: "Geist Mono", monospace;
          font-weight: 600;
        }

        .ps-login-link {
          background: linear-gradient(135deg, #16a34a, #15803d);
          border: none; border-radius: 8px; color: #fff;
          padding: 7px 16px; font-size: 13px; font-weight: 600;
          font-family: "Geist Mono", monospace;
          cursor: pointer; text-decoration: none;
          transition: opacity .2s;
        }

        .ps-login-link:hover { opacity: .88; }

        /* ── Main ── */
        .ps-main {
          position: relative; z-index: 1;
          max-width: 780px; margin: 0 auto;
          padding: 48px 24px 80px;
          width: 100%;
        }

        /* ── Loading / Not found ── */
        .ps-center {
          text-align: center; padding: 100px 0; color: #334155;
        }

        .ps-center-icon { font-size: 48px; margin-bottom: 16px; }
        .ps-center p    { font-size: 16px; margin: 0 0 24px; }

        /* ── Snippet header ── */
        .ps-header { margin-bottom: 20px; }

        .ps-title {
          font-size: 26px; font-weight: 700;
          color: #f1f5f9; margin: 0 0 12px;
          letter-spacing: -0.5px;
        }

        .ps-meta {
          display: flex; align-items: center;
          gap: 10px; flex-wrap: wrap;
        }

        .ps-lang-dot {
          width: 10px; height: 10px;
          border-radius: 50%; flex-shrink: 0;
        }

        .ps-lang-badge {
          border-radius: 6px; padding: 3px 12px;
          font-size: 12px; font-family: "Geist Mono", monospace;
          font-weight: 600; border: 1px solid;
        }

        .ps-owner {
          color: #64748b; font-size: 13px;
          font-family: "Geist Mono", monospace;
        }

        .ps-owner span { color: #34d399fd; }

        .ps-date {
          color: #334155; font-size: 12px;
          font-family: "Geist Mono", monospace;
          margin-left: auto;
        }

        /* ── Code card ── */
        .ps-code-card {
          background: linear-gradient(145deg, rgba(15, 23, 42, 0.16), rgba(17, 24, 39, 0.44));
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 16px; overflow: hidden;
          box-shadow: 0 8px 40px rgba(0,0,0,.5);
        }

        .ps-code-topbar {
          padding: 12px 18px;
          border-bottom: 1px solid rgba(255,255,255,.05);
          display: flex; align-items: center;
          justify-content: space-between;
        }

        .ps-traffic { display: flex; gap: 6px; }
        .ps-traffic span {
          width: 11px; height: 11px; border-radius: 50%;
        }

        .ps-copy-btn {
          background: rgba(52,211,153,.1);
          border: 1px solid rgba(52,211,153,.3);
          border-radius: 8px; color: #34d399;
          padding: 5px 14px; font-size: 12px;
          font-family: "Geist Mono", monospace;
          font-weight: 600; cursor: pointer;
          transition: all .18s;
        }

        .ps-copy-btn:hover { background: rgba(52,211,153,.2); }

        .ps-code-wrap { display: flex; }

        .ps-line-nums {
          padding: 16px 0; min-width: 48px;
          background: rgba(0,0,0,.25);
          border-right: 1px solid rgba(255,255,255,.04);
          text-align: right;
          font-family: "Geist Mono", monospace;
          font-size: 12px; color: rgba(255,255,255,.18);
          user-select: none; flex-shrink: 0;
        }

        .ps-line-num { padding: 0 12px; line-height: 22px; }

        .ps-code-block {
          margin: 0; padding: 16px 24px; flex: 1;
          overflow-x: auto;
          font-family: "Geist Mono", monospace;
          font-size: 13px; line-height: 22px;
          color: #cbd5e1; background: transparent;
        }

        /* ── Footer ── */
        .ps-footer {
          margin-top: 32px; text-align: center;
          color: #334155; font-size: 13px;
          font-family: "Geist Mono", monospace;
        }

        .ps-footer a { color: #34d399; text-decoration: none; font-weight: 600; }
        .ps-footer a:hover { text-decoration: underline; }

        /* ── Syntax colors ── */
        .ps-kw  { color: #60a5fa; font-weight: 600; }
        .ps-st  { color: #34d399; }
        .ps-cm  { color: #475569; font-style: italic; }
        .ps-nm  { color: #fb923c; }
        .ps-dec { color: #c084fc; }
        .ps-tg  { color: #f472b6; }

        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,.1); border-radius: 3px; }
        .cv-logo-img {
    width: 36px;
    height: 36px;
    object-fit: contain;
    
    transition: filter 0.3s ease;
    background: transparent;
}
      `}</style>

            <div className="ps-root">
                <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                    <Silk speed={15} scale={0.75} color="#2b1b28ee" noiseIntensity={0.5} rotation={0.24} />
                </div>
                {/* Navbar */}
                <nav className="ps-nav">
                    <Link to="/" className="ps-nav-brand">
                        <img src="/logo.jpg" alt="logo" className="cv-logo-img" /> Ryan's Core.!!
                    </Link>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span className="ps-nav-badge">public snippet</span>
                        <Link to="/register" className="ps-login-link">Register.!!</Link>
                    </div>
                </nav>

                <main className="ps-main">

                    {/* Loading */}
                    {loading && (
                        <div className="ps-center">
                            <div className="ps-center-icon">⌗</div>
                            <p>Loading snippet…</p>
                        </div>
                    )}

                    {/* Not found */}
                    {notFound && (
                        <div className="ps-center">
                            <div className="ps-center-icon">✕</div>
                            <p>Snippet not found or link is invalid.</p>
                            <Link to="/" className="ps-login-link">Go to Ryan's Core.!!</Link>
                        </div>
                    )}

                    {/* Snippet */}
                    {snippet && (
                        <>
                            <div className="ps-header">
                                <h1 className="ps-title">{snippet.title}</h1>
                                <div className="ps-meta">
                                    <div className="ps-lang-dot"
                                        style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
                                    <span className="ps-lang-badge"
                                        style={{ background: `${color}22`, color, borderColor: `${color}44` }}>
                                        {snippet.language}
                                    </span>
                                    <span className="ps-owner">
                                        by <span>{snippet.owner}</span>
                                    </span>
                                    <span className="ps-date">
                                        {new Date(snippet.created).toLocaleDateString('en-US', {
                                            year: 'numeric', month: 'short', day: 'numeric'
                                        })}
                                    </span>
                                </div>
                            </div>

                            {/* Code card */}
                            <div className="ps-code-card">
                                <div className="ps-code-topbar">
                                    <div className="ps-traffic">
                                        <span style={{ background: "#ef4444" }} />
                                        <span style={{ background: "#f59e0b" }} />
                                        <span style={{ background: "#22c55e" }} />
                                    </div>
                                    <button className="ps-copy-btn" onClick={handleCopy}>
                                        {copied ? "✓ Copied!" : "⎘ Copy code"}
                                    </button>
                                </div>
                                <div className="ps-code-wrap">
                                    <div className="ps-line-nums">
                                        {lines.map((_, i) => (
                                            <div key={i} className="ps-line-num">{i + 1}</div>
                                        ))}
                                    </div>
                                    <pre className="ps-code-block"
                                        dangerouslySetInnerHTML={{
                                            __html: highlight(snippet.code, snippet.language)
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Footer */}
                            <p className="ps-footer">
                                Shared via <Link to="/">Ryan's Core.!!</Link> —
                                your personal code snippet library.
                            </p>
                        </>
                    )}
                </main>
            </div>
        </>
    );
}