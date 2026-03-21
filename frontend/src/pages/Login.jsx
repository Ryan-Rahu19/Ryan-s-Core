
import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import ClickSpark from '../component/ClickSpark.jsx'
import API_BASE from "../config.js";
import { useToast } from "../components/Toast.jsx";
import PixelBlast from '../components/PixelBlast.jsx'
import TextCursor from "../components/TextCursor.jsx";


export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const showToast = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/login/`, {
        username,
        password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);
      showToast(`Welcome back, ${res.data.username}!`, "success");
      setTimeout(() => navigate("/dashboard"), 500);
    } catch (err) {
      console.log(err.response?.data || err.message);
      showToast("Invalid username or password.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
       
        * { box-sizing: border-box; }

        

 

        .cv-login-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #04060f;
          font-family: "Bebas Neue", sans-serif;
          position: relative;
          overflow: clip;
        }

        /* ── PixelBlast sits behind everything ── */
        .cv-aurora-wrap {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .cv-grain {
          position: absolute;
          inset: 0;
          z-index: 1;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          pointer-events: none;
        }

        @keyframes cv-fadeUp {
          from { opacity: 0; transform: translateY(28px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes cv-shimmer {
          0%   { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(250%) skewX(-12deg); }
        }

        .cv-login-card {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 480px;
          margin: 24px;
          padding: 44px 44px 40px;
          border-radius: 23px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(28px) saturate(160%);
          -webkit-backdrop-filter: blur(98px) saturate(160%);
          border: 1px solid rgba(255, 255, 255, 0.24);
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.04) inset,
            0 40px 80px rgb(0, 0, 0),
            0 0 60px rgba(16, 185, 129, 0.16);
          animation: cv-fadeUp 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .cv-card-shimmer {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
          border-radius: 24px 24px 0 0;
        }

        .cv-logo-wrap { text-align: center; margin-bottom: 30px; }

        .cv-logo-icon {
          display: inline-flex; align-items: center; justify-content: center;
          width: 52px; height: 52px; border-radius: 16px;
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.25);
          font-size: 24px; margin-bottom: 14px;
          position: relative; overflow: hidden;
        }

        .cv-logo-icon::after {
          content: '';
          position: absolute; top: 0; left: -60%;
          width: 40%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
          animation: cv-shimmer 3s ease-in-out infinite;
        }

        .cv-logo-name { margin: 0; font-size: 26px; font-weight: 450; color: #8165d6; letter-spacing: 2px;  font-family: "Bebas Neue", sans-serif;}
        .cv-logo-sub  { margin: 6px 0 0; font-family: "Geist Mono", monospace; font-size: 12px; color: rgba(255,255,255,0.28); letter-spacing: 1px; font-weight: 800; }

        .cv-divider { border: none; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent); margin: 0 0 28px; }

        .cv-heading    { margin: 0 0 6px; font-size: 30px; font-weight: 480; color: #7526c9e9; letter-spacing: 2.6px; }
        .cv-subheading { margin: 0 0 24px; font-family: "Bebas Neue", sans-serif; font-size: 12px; color: rgba(255,255,255,0.28); display: none; }

        .cv-field-wrap { position: relative; margin-bottom: 14px; font-family: "Geist Mono", monospace; }

        .cv-field-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); font-size: 14px; opacity: 0.35; pointer-events: none; }

        .cv-field {
          width: 100%; padding: 13px 16px 13px 40px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 12px; color: #43d612; font-size: 14px;
          font-family: "Geist Mono", monospace; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .cv-field::placeholder { color: rgba(255, 255, 255, 0.43); font-size: 13px; font-family: "Bebas Neue", sans-serif; letter-spacing: 2px }
        .cv-field:focus {
          border-color: rgba(16, 185, 129, 0.5);
          background: rgba(255, 255, 255, 0.07);
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1), 0 0 20px rgba(16, 185, 129, 0.05);
        }

        .cv-btn {
          position: relative; width: 100%; padding: 13px 20px; margin-top: 8px;
          border: none; border-radius: 12px;
          background: linear-gradient(135deg, #6365f146, #4e46e515);
          color: #ebdfed; font-size: 18px; font-weight: 900;
          font-family: "Bebas Neue", sans-serif;
          letter-spacing: 4.5px; cursor: pointer; overflow: hidden;
          transition: transform 0.15s, box-shadow 0.2s, opacity 0.2s;
          box-shadow: 0 4px 24px rgba(16, 185, 129, 0.3), 0 1px 0 rgba(255,255,255,0.15) inset;
        }
        .cv-btn::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.18), transparent 60%); border-radius: 12px; }
        .cv-btn::after  { content: ''; position: absolute; top: 0; left: -80%; width: 50%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent); transform: skewX(-12deg); transition: left 0.5s ease; }
        .cv-btn:hover::after { left: 130%; }
        .cv-btn:hover   { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(16, 185, 129, 0.4), 0 1px 0 rgba(255,255,255,0.15) inset; }
        .cv-btn:active  { transform: translateY(0); }
        .cv-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .cv-btn-inner { position: relative; z-index: 1; display: flex; align-items: center; justify-content: center; gap: 8px; }

        @keyframes cv-spin { to { transform: rotate(360deg); } }
        .cv-spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fffffff6; border-radius: 50%; animation: cv-spin 0.7s linear infinite; }

        .cv-switch { text-align: center; margin: 22px 0 0; font-size: 13px; color: #a5b4fc; font-family: 'JetBrains Mono', monospace; }
        .cv-switch a {color: #a5b4fc; text-decoration: none; font-weight: 600; transition: color 0.2s; }
        .cv-switch a:hover { color: color: #a5b4fc; text-decoration: underline; }
              .cv-logo-img {
    width: 55px;
    height: 55px;
    object-fit: contain;
    transition: filter 0.3s ease;
    // background:#c7d2fe;
    overflow: hidden;

    /* ── Force TextCursor visible above all layers ── */
[class*="text-cursor"],
[class*="TextCursor"],
.text-cursor-container {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  pointer-events: none !important;
  z-index: 99999 !important;
  overflow: visible !important;
}
      `}</style>

     
      <TextCursor
        text="hello"
        spacing={80}
        followMouseDirection
        randomFloat
        exitDuration={10.3}
        removalInterval={20}
        maxPoints={80}
      />
        <div className="cv-login-root">

          {/* ── PixelBlast background ── */}
          <div className="cv-aurora-wrap">
          <PixelBlast
            color="#5c26a7"
            quantity={20}
            staticity={100}
            ease={100}
            size={10.4}
          />
          </div>

          <div className="cv-grain" />

          <div className="cv-login-card">
            <div className="cv-card-shimmer" />

            <div className="cv-logo-wrap">
              <img src="/logo.jpg" alt="logo" className="cv-logo-img" />
              <h1 className="cv-logo-name">Ryan's Core</h1>
              <p className="cv-logo-sub">// your snippet library</p>
            </div>

            <hr className="cv-divider" />

            <h2 className="cv-heading">Welcome back</h2>
            <p className="cv-subheading">// sign in to your vault</p>

            <form onSubmit={handleLogin}>
              <div className="cv-field-wrap">
                <span className="cv-field-icon"></span>
                <input
                  className="cv-field"
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                />
              </div>

              <div className="cv-field-wrap">
                <span className="cv-field-icon"></span>
                <input
                  className="cv-field"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>

              <button className="cv-btn" type="submit" disabled={loading}>
                <span className="cv-btn-inner">
                  {loading ? (
                    <><div className="cv-spinner" /> Signing in...</>
                  ) : (
                    <>Login →</>
                  )}
                </span>
              </button>
            </form>

            <p className="cv-switch">
              New user? <Link to="/register">Register</Link>
            </p>
          </div>

        </div>
      
    </>
  );
}