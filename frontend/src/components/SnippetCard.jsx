import { useState } from "react";
import { useToast } from "./Toast";

// ── Strip HTML tags pasted from external sites (LeetCode, GFG etc.) ──────────
function stripHTML(code) {
  return code
    .replace(/<[^>]*>/g, '')       // remove all HTML tags
    .replace(/&lt;/g, '<')       // decode entities
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}
// ─────────────────────────────────────────────────────────────────────────────

// ── Syntax highlighter — runs AFTER escaping so spans never get double-escaped ─
function highlight(code, lang) {
  const esc = (s) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  let c = esc(code);

  const rules = {
    python: [
      [/(#[^\n]*)/g, `<span style="color:#4b5563;font-style:italic">$1</span>`],
      [/\b(def|class|return|if|else|elif|import|from|for|while|in|not|and|or|is|None|True|False|try|except|with|as|pass|lambda|yield|async|await)\b/g, `<span style="color:#60a5fa;font-weight:600">$1</span>`],
      [/(@\w+)/g, `<span style="color:#c084fc">$1</span>`],
      [/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g, `<span style="color:#34d399">$1</span>`],
      [/\b(\d+)\b/g, `<span style="color:#fb923c">$1</span>`],
    ],
    javascript: [
      [/(\/\/[^\n]*)/g, `<span style="color:#4b5563;font-style:italic">$1</span>`],
      [/\b(const|let|var|function|return|if|else|for|while|import|export|default|class|new|this|async|await|try|catch|throw|typeof|null|undefined|true|false)\b/g, `<span style="color:#60a5fa;font-weight:600">$1</span>`],
      [/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g, `<span style="color:#34d399">$1</span>`],
      [/\b(\d+)\b/g, `<span style="color:#fb923c">$1</span>`],
    ],
    typescript: [
      [/(\/\/[^\n]*)/g, `<span style="color:#4b5563;font-style:italic">$1</span>`],
      [/\b(const|let|var|function|return|if|else|for|while|import|export|default|class|new|this|async|await|try|catch|interface|type|enum|extends|string|number|boolean|any|void|readonly)\b/g, `<span style="color:#60a5fa;font-weight:600">$1</span>`],
      [/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g, `<span style="color:#34d399">$1</span>`],
      [/\b(\d+)\b/g, `<span style="color:#fb923c">$1</span>`],
    ],
    html: [
      [/(&lt;\/?[a-zA-Z][^&]*?&gt;)/g, `<span style="color:#f472b6">$1</span>`],
      [/("(?:[^"\\]|\\.)*")/g, `<span style="color:#34d399">$1</span>`],
    ],
    css: [
      [/(\/\*[\s\S]*?\*\/)/g, `<span style="color:#4b5563;font-style:italic">$1</span>`],
      [/([.#]?[\w-]+\s*\{)/g, `<span style="color:#f472b6">$1</span>`],
      [/(:[\w-]+)/g, `<span style="color:#60a5fa;font-weight:600">$1</span>`],
      [/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g, `<span style="color:#34d399">$1</span>`],
    ],
    java: [
      [/(\/\/[^\n]*)/g, `<span style="color:#4b5563;font-style:italic">$1</span>`],
      [/\b(public|private|protected|class|interface|extends|implements|return|if|else|for|while|new|this|static|void|int|String|boolean|import|package|try|catch|throw|final)\b/g, `<span style="color:#60a5fa;font-weight:600">$1</span>`],
      [/("(?:[^"\\]|\\.)*")/g, `<span style="color:#34d399">$1</span>`],
      [/\b(\d+)\b/g, `<span style="color:#fb923c">$1</span>`],
    ],
  };

  (rules[lang] || []).forEach(([re, rep]) => { c = c.replace(re, rep); });
  return c;
}

const LANG_COLORS = {
  python: "#3b82f6", javascript: "#f59e0b", typescript: "#6366f1",
  html: "#ef4444", css: "#8b5cf6", bash: "#10b981", sql: "#f97316",
  go: "#06b6d4", rust: "#f97316", java: "#f97316", cpp: "#06b6d4",
};

const LANGUAGES = ["python", "javascript", "typescript", "html", "css", "bash", "sql", "go", "rust", "java", "cpp"];

export default function SnippetCard({ snippet, onDelete, onEdit }) {

  function copyCode() { navigator.clipboard.writeText(snippet.code); }

  const showToast = useToast();

  const [expanded, setExpanded] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editTitle, setEditTitle] = useState(snippet.title);
  const [editLang, setEditLang] = useState(snippet.language);
  const [editCode, setEditCode] = useState(snippet.code);
  const [saving, setSaving] = useState(false);

  const loggedInUser = localStorage.getItem("username");
  const isOwner = snippet.owner_username === loggedInUser;

  // ── Strip HTML before splitting into lines and highlighting ──────────────
  const cleanCode = stripHTML(snippet.code);
  const lines = cleanCode.split("\n");
  const preview = lines.slice(0, 7).join("\n");
  // ─────────────────────────────────────────────────────────────────────────

  const color = LANG_COLORS[snippet.language] || "#64748b";
  const highlighted = highlight(expanded ? cleanCode : preview, snippet.language);

  const handleCopy = () => {
    copyCode();
    showToast("Code copied to clipboard!", "success");
  };

  const handleShare = () => {
    const url = `${window.location.origin}/snippet/${snippet.share_token}`;
    navigator.clipboard.writeText(url);
    showToast("Share link copied!", "info");
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim() || !editCode.trim()) {
      showToast("Title and code cannot be empty.", "warning");
      return;
    }
    setSaving(true);
    await onEdit(snippet.id, { title: editTitle, language: editLang, code: editCode });
    setSaving(false);
    setShowEdit(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(snippet.title);
    setEditLang(snippet.language);
    setEditCode(snippet.code);
    setShowEdit(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap');

        .sc-card {
          position: relative;
          border-radius: 18px;
          overflow: hidden;
          transition: transform .25s ease, box-shadow .25s ease;
          background: rgba(255, 255, 255, 0);
          backdrop-filter: blur(24px) saturate(160%);
          -webkit-backdrop-filter: blur(24px) saturate(160%);
          border: 1px solid rgba(255, 255, 255, 0.04);
          box-shadow:
            0 0 0 1px rgba(255,255,255,.04) inset,
            0 8px 40px rgba(0,0,0,.5),
            0 2px 8px rgba(0,0,0,.3);
        }
        .sc-card:hover {
          transform: translateY(-3px);
          box-shadow:
            0 0 0 1px rgba(255,255,255,.07) inset,
            0 16px 60px rgba(0,0,0,.6),
            0 4px 16px rgba(0,0,0,.4);
        }
        .sc-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.18), transparent);
          z-index: 1; pointer-events: none;
        }
        .sc-topbar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 18px 10px;
          border-bottom: 1px solid rgba(255,255,255,.05);
        }
        .sc-traffic { display: flex; gap: 7px; align-items: center; }
        .sc-traffic span { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
        .sc-topbar-right { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; justify-content: flex-end; }
        .sc-lang-pill { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; padding: 3px 12px; border-radius: 100px; border: 1px solid; }
        .sc-your-badge  { background: rgba(22,163,74,.12);  color: #34d399; border: 1px solid rgba(22,163,74,.25);  border-radius: 100px; padding: 2px 10px; font-size: 11px; font-family: 'JetBrains Mono', monospace; }
        .sc-owner-badge { background: rgba(99,102,241,.1);  color: #818cf8; border: 1px solid rgba(99,102,241,.2);  border-radius: 100px; padding: 2px 10px; font-size: 11px; font-family: 'JetBrains Mono', monospace; }
        .sc-title-row { display: flex; align-items: center; gap: 10px; padding: 12px 18px 4px; flex-wrap: wrap; }
        .sc-title { color: #f1f5f9; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 15px; margin: 0; }
        .sc-actions { display: flex; gap: 6px; padding: 6px 18px 12px; flex-wrap: wrap; }
        .sc-btn { border-radius: 100px; padding: 4px 14px; font-size: 11px; font-family: 'Space Grotesk', sans-serif; font-weight: 600; cursor: pointer; transition: all .18s ease; border: 1px solid; backdrop-filter: blur(8px); }
        .sc-btn-copy    { background: rgba(52,211,153,.1);  border-color: rgba(52,211,153,.3);   color: #34d399; }
        .sc-btn-copy:hover    { background: rgba(52,211,153,.2); }
        .sc-btn-share   { background: rgba(14,165,233,.1);  border-color: rgba(14,165,233,.3);   color: #38bdf8; }
        .sc-btn-share:hover   { background: rgba(14,165,233,.2); }
        .sc-btn-edit    { background: rgba(251,191,36,.08); border-color: rgba(251,191,36,.25);  color: #fbbf24; }
        .sc-btn-edit:hover    { background: rgba(251,191,36,.18); }
        .sc-btn-edit.active   { background: rgba(251,191,36,.2);  border-color: rgba(251,191,36,.5); }
        .sc-btn-delete  { background: rgba(248,113,113,.08);border-color: rgba(248,113,113,.25); color: #f87171; }
        .sc-btn-delete:hover  { background: rgba(248,113,113,.18); }
        .sc-btn-preview { background: rgba(99,102,241,.1);  border-color: rgba(99,102,241,.3);   color: #818cf8; }
        .sc-btn-preview:hover { background: rgba(99,102,241,.2); }
        .sc-code-wrap { display: flex; background: rgba(0,0,0,.42); border-top: 1px solid rgba(255,255,255,.15); }
        .sc-line-nums { padding: 16px 0; min-width: 44px; background: rgba(0,0,0,.2); border-right: 1px solid rgba(255,255,255,.04); text-align: right; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: rgba(255,255,255,.15); user-select: none; flex-shrink: 0; }
        .sc-line-num  { padding: 0 12px; line-height: 22px; }
        .sc-code-pre  { margin: 0; padding: 16px 20px; flex: 1; overflow-x: auto; font-family: 'JetBrains Mono', monospace; font-size: 13px; line-height: 22px; color: #94a3b8; background: transparent; }
        .sc-expand { width: 100%; background: rgba(255,255,255,.02); border: none; border-top: 1px solid rgba(255,255,255,.05); color: #c9ced5; padding: 9px; cursor: pointer; font-size: 12px; font-family: 'JetBrains Mono', monospace; transition: background .2s, color .2s; }
        .sc-expand:hover { background: rgba(255,255,255,.05); color: #64748b; }
        .sc-preview-wrap { border-top: 1px solid rgba(255,255,255,.06); background: #fff; }
        .sc-preview-wrap iframe { display: block; border: none; }
        .sc-edit-form { border-top: 1px solid rgba(251,191,36,.15); background: rgba(251,191,36,.02); padding: 20px; display: flex; flex-direction: column; gap: 12px; animation: scEditIn .25s ease; }
        @keyframes scEditIn { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:none; } }
        .sc-edit-label { font-size: 11px; font-family: 'JetBrains Mono', monospace; color: #fbbf24; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 4px; }
        .sc-edit-input, .sc-edit-select, .sc-edit-textarea { width: 100%; background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.09); border-radius: 10px; color: #f1f5f9; font-family: 'JetBrains Mono', monospace; outline: none; box-sizing: border-box; transition: border-color .2s, box-shadow .2s; }
        .sc-edit-input    { padding: 10px 14px; font-size: 14px; font-family: 'Space Grotesk', sans-serif; }
        .sc-edit-select   { padding: 10px 14px; font-size: 13px; cursor: pointer; background-color: #2b1b28ee}
        .sc-edit-textarea { padding: 12px 14px; font-size: 13px; line-height: 22px; resize: vertical; min-height: 160px; }
        .sc-edit-input:focus, .sc-edit-select:focus, .sc-edit-textarea:focus { border-color: rgba(251, 190, 36, 0.75); box-shadow: 0 0 0 3px rgba(251, 190, 36, 0.15); }
        .sc-edit-actions { display: flex; gap: 10px; justify-content: flex-end; }
        .sc-edit-save { background: linear-gradient(135deg,#d97706,#b45309); border: none; border-radius: 10px; color: #150b0b; padding: 9px 20px; font-size: 13px; font-weight: 600; font-family: 'Space Grotesk', sans-serif; cursor: pointer; transition: opacity .2s, transform .15s; }
        .sc-edit-save:hover:not(:disabled) { opacity: .88; transform: translateY(-1px); }
        .sc-edit-save:disabled { opacity: .5; cursor: not-allowed; }
        .sc-edit-cancel { background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1); border-radius: 10px; color: #94a3b8; padding: 9px 20px; font-size: 13px; font-weight: 600; font-family: 'Space Grotesk', sans-serif; cursor: pointer; transition: all .18s; }
        .sc-edit-cancel:hover { background: rgba(255,255,255,.09); color: #f1f5f9; }
      `}</style>

      <div className="sc-card">

        <div className="sc-topbar">
          <div className="sc-traffic">
            <span style={{ background: "#ef4444" }} />
            <span style={{ background: "#f59e0b" }} />
            <span style={{ background: "#22c55e" }} />
          </div>
          <div className="sc-topbar-right">
            {isOwner
              ? <span className="sc-your-badge">✦ yours</span>
              : <span className="sc-owner-badge">by {snippet.owner_username}</span>
            }
            <span className="sc-lang-pill"
              style={{ background: `${color}18`, color, borderColor: `${color}40` }}>
              {snippet.language}
            </span>
          </div>
        </div>

        <div className="sc-title-row">
          <h3 className="sc-title">{snippet.title}</h3>
        </div>

        <div className="sc-actions">
          {isOwner && (
            <button className={`sc-btn sc-btn-edit ${showEdit ? "active" : ""}`}
              onClick={() => setShowEdit(!showEdit)}>
              {showEdit ? "✕ Close" : "✏ Edit"}
            </button>
          )}
          {isOwner && (
            <button className="sc-btn sc-btn-delete" onClick={() => onDelete(snippet.id)}>
              ✕ Delete
            </button>
          )}
          {snippet.language === "html" && (
            <button className="sc-btn sc-btn-preview" onClick={() => setShowPreview(!showPreview)}>
              {showPreview ? "⌗ Code" : "▶ Preview"}
            </button>
          )}
          <button className="sc-btn sc-btn-share" onClick={handleShare}>⬡ Share</button>
          <button className="sc-btn sc-btn-copy" onClick={handleCopy}>⎘ Copy</button>
        </div>

        {!showPreview && (
          <>
            <div className="sc-code-wrap">
              <div className="sc-line-nums">
                {(expanded ? lines : lines.slice(0, 7)).map((_, i) => (
                  <div key={i} className="sc-line-num">{i + 1}</div>
                ))}
              </div>
              <pre className="sc-code-pre"
                dangerouslySetInnerHTML={{ __html: highlighted }} />
            </div>
            {lines.length > 7 && (
              <button className="sc-expand" onClick={() => setExpanded(!expanded)}>
                {expanded ? "▲ collapse" : `▼ ${lines.length - 7} more lines — click to expand`}
              </button>
            )}
          </>
        )}

        {snippet.language === "html" && showPreview && (
          <div className="sc-preview-wrap">
            <iframe title="preview" srcDoc={snippet.code} style={{ width: "100%", height: "200px" }} />
          </div>
        )}

        {isOwner && showEdit && (
          <div className="sc-edit-form">
            <p className="sc-edit-label">✏ Editing Snippet</p>
            <div>
              <p className="sc-edit-label" style={{ marginBottom: 6 }}>Title</p>
              <input className="sc-edit-input" value={editTitle}
                onChange={e => setEditTitle(e.target.value)} placeholder="Snippet title" />
            </div>
            <div>
              <p className="sc-edit-label" style={{ marginBottom: 6 }}>Language</p>
              <select className="sc-edit-select" value={editLang}
                onChange={e => setEditLang(e.target.value)}>
                {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <p className="sc-edit-label" style={{ marginBottom: 6 }}>Code</p>
              <textarea className="sc-edit-textarea" value={editCode}
                onChange={e => setEditCode(e.target.value)}
                placeholder="Your code here..." spellCheck={false} />
            </div>
            <div className="sc-edit-actions">
              <button className="sc-edit-cancel" onClick={handleCancelEdit}>Cancel</button>
              <button className="sc-edit-save" onClick={handleSaveEdit} disabled={saving}>
                {saving ? "Saving…" : "✓ Save Changes"}
              </button>
            </div>
          </div>
        )}

      </div>
    </>
  );
}