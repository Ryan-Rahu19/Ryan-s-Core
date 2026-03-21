import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SnippetCard from "../components/SnippetCard";
import AgentAvatar from "../components/AgentAvatar";
import API_BASE from "../config";
import {useToast} from '../components/Toast';
import ClickSpark from '../component/ClickSpark'
import Beams from '../components/Beams';
import Silk from '../components/Silk.jsx'



export default function Dashboard() {
  const [snippets, setSnippets] = useState([]);
  const [search, setSearch] = useState("");
  const showToast = useToast();

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username") || "dev";

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    axios
      .get(`${API_BASE}/api/snippets/`, {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => setSnippets(res.data))
      .catch((err) => {
        console.log(err.response?.data || err.message);
      });
  }, [token, navigate]);

  const deleteSnippet = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/snippets/${id}/`, {
        headers: { Authorization: `Token ${token}` },
      });
      setSnippets((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.log(err.response?.data || err.message);
      showToast("Delete failed");
    }
  };

  const filtered = snippets.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase())
  );

  const yourSnippets = snippets.filter((s) => s.owner_username === username);

  const editSnippet = async (id, updatedData) => {
    try {
      const res = await axios.patch(
        `${API_BASE}/api/snippets/${id}/`,
        updatedData,
        { headers: { Authorization: `Token ${token}` } }
      );
      // Update the snippet in local state so UI refreshes instantly
      setSnippets((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...res.data } : s))
      );
    } catch (err) {
      console.log(err.response?.data || err.message);
      showToast("Edit failed — you may not be the owner.");
    }
  };
  // ──────────────────────────────────────────────────────────────────────────

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <>
      <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        .cv-dash-root {
          min-height: 100vh;
          background: #030712;
          font-family: "Geist Mono", monospace;
          color: #f1f5f9;
        }

        .cv-dash-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse at 10% 30%, rgba(22,163,74,.05) 0%, transparent 50%),
            radial-gradient(ellipse at 90% 70%, rgba(59,130,246,.04) 0%, transparent 50%);
          pointer-events: none;
          z-index: 0;
        }

        .cv-nav {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(3, 7, 18, 0);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          padding: 0 32px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: 70px;
          // width: 90vw;
        }

        .cv-nav-brand { display: flex; align-items: center; gap: 10px; font-family: "Bebas Neue", sans-serif; letter-spacing:  }
        .cv-nav-icon  { font-size: 20px; }

        .cv-nav-title {
          font-size: 18px; font-weight: 900;
          letter-spacing: 3.5px; color: #f1f5f9;
        }

        .cv-nav-count {
          background: rgba(22,163,74,.15); color: #34d399;
          border: 1px solid rgba(22,163,74,.3);
          border-radius: 6px; padding: 1px 8px;
          font-size: 11px; font-family: "Geist Mono", monospace; font-weight: 600;
        }

        .cv-nav-right  { display: flex; align-items: center; gap: 14px; }

        .cv-nav-user {
          color: #64748b; font-size: 13px;
          font-family: "Geist Mono", monospace;
          display: flex; align-items: center; gap: 8px;
        }

        .cv-nav-user span { color: #34d399f4; }

        .cv-nav-logout {
          background: rgba(255, 255, 255, 0);
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 8px; color: #94a3b8;
          padding: 6px 14px; font-size: 13px;
          font-family: "Geist Mono", monospace;
          cursor: pointer; transition: all .18s;
        }

        .cv-nav-logout:hover { background: rgba(255,255,255,.1); color: #f1f5f9; }

        .cv-dash-main {
          position: relative; z-index: 1;
          max-width: 860px; margin: 0 auto;
          padding: 36px 24px 64px;
        }

        .cv-toolbar {
          display: flex; gap: 12px;
          margin-bottom: 28px; flex-wrap: wrap;
        }

        .cv-new-btn {
         width: 24%;
          position: relative;
          background: rgba(22, 163, 74, 0.31);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(52,211,153,.35);
          border-radius: 14px;
          color: #fff;
          padding: 13px 2px;
          font-size: 15px;
          font-weight: 200;
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

        .cv-new-btn:hover  { opacity: .9; transform: translateY(-1px); }
        .cv-new-btn:active { transform: translateY(0); }

        .cv-search-wrap { flex: 1; min-width: 200px; position: relative; }

        .cv-search-icon {
          position: absolute; left: 24px; top: 45%;
          transform: translateY(-50%);
          color: #c9d2de; font-size: 27px; pointer-events: none;
        }

        .cv-search {
          width: 100%;
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 11px;
          padding: 11px 16px 11px 40px;
          color: #f1f5f9; font-size: 14px;
         font-family: "Geist Mono", monospace;
          outline: none; transition: border-color .2s, box-shadow .2s;
           box-shadow: 10 10 10 3px rgba(13, 30, 19, 0.2);
        }

        .cv-search::placeholder { color: #dbe1eaf7; }

        .cv-search:focus {
          border-color: rgba(22,163,74,.45);
          box-shadow: 0 0 0 3px rgba(13, 30, 19, 0.56);
        }

        .cv-stats { display: flex; gap: 10px; margin-bottom: 24px; flex-wrap: wrap; }

        .cv-stat {
          background: rgba(255, 255, 255, 0.07);
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 10px; padding: 10px 16px;
          font-size: 13px; color: #bec7d4;
          font-family: "Geist Mono", monospace;
        }

        .cv-stat strong { color: #f1f5f9; font-weight: 600; margin-right: 5px; }

        .cv-snippets { display: flex; flex-direction: column; gap: 16px; }

        .cv-snippet-anim { animation: cvFadeUp .3s ease both; }

        .cv-empty { text-align: center; padding: 80px 0; color: #334155; }
        .cv-empty-icon { font-size: 48px; margin-bottom: 14px; }
        .cv-empty p    { font-size: 15px; margin: 0 0 20px; }

        .cv-empty-create {
          background: linear-gradient(135deg, #16a34a58, #15803c71);
          border: none; border-radius: 10px; color: #fff;
          padding: 10px 22px; font-size: 14px; font-weight: 600;
          font-family: "Geist Mono", monospace;
          cursor: pointer; transition: opacity .2s;
        }

        .cv-empty-create:hover { opacity: .88; }

        @keyframes cvFadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: none; }
        }

        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,.1); border-radius: 3px; }
      `}</style>
      
      
      <div className="cv-dash-root">
        <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>

          <Silk speed={15} scale={0.75} color="#2b1b28ee" noiseIntensity={0.5} rotation={0.24} />

        </div>
       
          
        
        
        <nav className="cv-nav">
          <div className="cv-nav-brand">
              <img src="/logo.jpg" alt="logo" className="cv-logo-img" />
            <span className="cv-nav-title">Ryan's Core</span>
            <span className="cv-nav-count">{snippets.length} snippets</span>
          </div>
          <div className="cv-nav-right">
            <span className="cv-nav-user">
              <AgentAvatar seed={username} size={34} />
              <span>●</span> {username}
            </span>
            <button className="cv-nav-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </nav>

        <main className="cv-dash-main">
          <div className="cv-toolbar">
            <button className="cv-new-btn" onClick={() => navigate("/create")}>
              <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> New Snippet
            </button>
            <div className="cv-search-wrap">
              <span className="cv-search-icon">⌕</span>
              <input
                className="cv-search"
                placeholder="Search snippets…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          
          <div className="cv-stats">
            <div className="cv-stat"><strong>{snippets.length}</strong> total</div>
            <div className="cv-stat"><strong>{filtered.length}</strong> shown</div>
              <div className="cv-stat"><strong>{yourSnippets.length}</strong> Yours.!</div>
            {search && (
              <div className="cv-stat">
                query: <strong style={{ color: "#34d399" }}>"{search}"</strong>
              </div>
            )}
          </div>
            
          {filtered.length === 0 ? (
            <div className="cv-empty">
              <div className="cv-empty-icon">⌗</div>
              <p>{search ? "No snippets match your search." : "Your vault is empty."}</p>
              {!search && (
                <button className="cv-empty-create" onClick={() => navigate("/create")}>
                  + Create your first snippet
                </button>
              )}
            </div>
          ) : (
            <div className="cv-snippets">
              {filtered.map((snippet, i) => (
                <div key={snippet.id} className="cv-snippet-anim"
                  style={{ animationDelay: `${i * 0.05}s` }}>
                  <SnippetCard
                    snippet={snippet}
                    onDelete={deleteSnippet}
                    onEdit={editSnippet}
                  />
                </div>
              ))}
            </div>
          
          )}
        
        </main>
        
      </div>
    
    </>
    
  );
}

// #5227ff , #453292ee