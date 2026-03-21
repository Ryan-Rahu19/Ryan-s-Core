import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import ClickSpark from '../component/ClickSpark'
import API_BASE from "../config";
import { useToast } from "../components/Toast";
import PixelBlast from '../components/PixelBlast.jsx'

export default function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const showToast = useToast();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/register/`, {
        username,
        password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);
      showToast("Registration Success..!!");
      navigate("/login");
    } catch (err) {
      console.log(err.response?.data || err.message);
      showToast("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`

          @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&display=swap');
         font-family: "Roboto", sans-serif;
        * { box-sizing: border-box; }

         @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');

         @font-face {
  font-family: 'MyFont';
  src: url('./assets/fonts/ebonys-revenge-list-font/YourFont.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}
        
        .cv-reg-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #04060f;
          font-family: "Geist Mono", monospace;
          position: relative;
          overflow: hidden;
        }

        .cv-reg-aurora-wrap {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .cv-reg-grain {
          position: absolute;
          inset: 0;
          z-index: 1;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          pointer-events: none;
        }

        @keyframes cv-reg-fadeUp {
          from { opacity: 0; transform: translateY(28px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes cv-reg-shimmer {
          0%   { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(250%) skewX(-12deg); }
        }

        @keyframes cv-reg-pulse-ring {
          0%   { transform: scale(1);   opacity: 0.6; }
          100% { transform: scale(1.6); opacity: 0; }
        }

        .cv-reg-card {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 480px;
          margin: 24px;
          padding: 44px 44px 40px;
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(28px) saturate(160%);
          -webkit-backdrop-filter: blur(28px) saturate(160%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.04) inset,
            0 40px 80px rgba(0, 0, 0, 0.77),
            0 0 60px rgba(99, 101, 241, 0.26);
          animation: cv-reg-fadeUp 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .cv-reg-card-shimmer {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
          border-radius: 24px 24px 0 0;
        }

        .cv-reg-logo-wrap {
          text-align: center;
          margin-bottom: 30px;
        }

        .cv-reg-logo-icon {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 52px;
          height: 52px;
          border-radius: 16px;
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.25);
          font-size: 24px;
          margin-bottom: 14px;
          overflow: hidden;
        }

        .cv-reg-logo-icon::after {
          content: '';
          position: absolute;
          top: 0; left: -60%;
          width: 40%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
          animation: cv-reg-shimmer 3s ease-in-out infinite;
        }

        .cv-reg-logo-name {
          margin: 0;
          font-size: 25px;
          font-weight: 800;
          color: #8165d6;
          letter-spacing: 2.6px;
          font-family: "Bebas Neue", sans-serif;
        }

        .cv-reg-logo-sub {
          margin: 6px 0 0;
          font-family: "Geist Mono", monospace;
          font-size: 18px;
          color: rgba(255, 255, 255, 0.74);
          letter-spacing: 0.3px;
          font-weight: 400;
        }

        .cv-reg-divider {
          border: none;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
          margin: 0 0 28px;
        }

        .cv-reg-heading {
          margin: 0 0 6px;
          font-size: 30px;
          font-weight: 400;
          font-family: "Bebas Neue", sans-serif;
          color: #7338c2;
          letter-spacing: 2.9px;
        }

        .cv-reg-subheading {
          margin: 0 0 8px;
          font-family: "Geist Mono", monospace;
          font-size: 12px;
          color: rgba(255,255,255,0.28);
          display: none
        }

        /* NEW VAULT badge */
        .cv-reg-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.25);
          color: #a5b4fc;
          font-family: "Geist Mono", monospace;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 1px;
          padding: 4px 10px;
          border-radius: 20px;
          margin-bottom: 22px;
        }

        /* Pulsing dot on badge */
        .cv-reg-badge-dot {
          position: relative;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #818cf8;
        }

        .cv-reg-badge-dot::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 50%;
          border: 1px solid #818cf8;
          animation: cv-reg-pulse-ring 1.5s ease-out infinite;
        }

        .cv-reg-field-wrap {
          position: relative;
          margin-bottom: 14px;
        }

        .cv-reg-field-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 14px;
          opacity: 0.35;
          pointer-events: none;
        }

        .cv-reg-field {
          width: 100%;
          padding: 13px 16px 13px 40px;
          background: rgba(255, 255, 255, 0.07);
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 12px;
          color: #0ad80a;
          font-size: 14px;
          font-family: 'Syne', sans-serif;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }

        .cv-reg-field::placeholder {
          color: rgba(255, 255, 255, 0.37);
          font-size: 12px;
           font-family: "Bebas Neue", sans-serif;
           letter-spacing: 2px;
           text-transform: lowercase
        }

        .cv-reg-field:focus {
          border-color: rgba(99, 102, 241, 0.5);
          background: rgba(255, 255, 255, 0.07);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1), 0 0 20px rgba(99, 102, 241, 0.05);
        }

        /* Submit button — indigo accent for register */
        .cv-reg-btn {
         position: relative; width: 100%; padding: 13px 20px; margin-top: 8px;
          border: none; border-radius: 12px;
          background: linear-gradient(135deg, #4a4cda5b, #4e46e515);
          color: #ffffff; font-size: 17px; font-weight: 700;
          font-family: "Bebas Neue", sans-serif;
          letter-spacing: 0.2px; cursor: pointer; overflow: hidden;
          transition: transform 0.15s, box-shadow 0.2s, opacity 0.2s;
          box-shadow: 0 4px 24px rgba(16, 185, 129, 0.3), 0 1px 0 rgba(255,255,255,0.15) inset;
          letter-spacing: 2px
        }

        .cv-reg-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), transparent 60%);
          border-radius: 12px;
        }

        .cv-reg-btn::after {
          content: '';
          position: absolute;
          top: 0; left: -80%;
          width: 50%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transform: skewX(-12deg);
          transition: left 0.5s ease;
        }

        .cv-reg-btn:hover::after { left: 130%; }
        .cv-reg-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(99, 102, 241, 0.45), 0 1px 0 rgba(255,255,255,0.15) inset;
        }
        .cv-reg-btn:active { transform: translateY(0); }
        .cv-reg-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .cv-reg-btn-inner {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        @keyframes cv-reg-spin { to { transform: rotate(360deg); } }
        .cv-reg-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: cv-reg-spin 0.7s linear infinite;
        }

        .cv-reg-switch {
          text-align: center;
          margin: 22px 0 0;
          font-size: 13px;
          color: rgba(255,255,255,0.28);
          font-family: 'JetBrains Mono', monospace;
        }

        .cv-reg-switch a {
          color: #a5b4fc;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s;
        }

        .cv-reg-switch a:hover { color: #c7d2fe; text-decoration: underline; }
        .cv-logo-img {
    width: 55px;
    height: 55px;
    object-fit: contain;
    
    transition: filter 0.3s ease;
    // background:#c7d2fe;
    overflow: hidden;
}
      `}</style>

     
        <div className="cv-reg-root">

          {/* Aurora background from React Bits */}
          <div className="cv-reg-aurora-wrap">
            <PixelBlast
              color="#5c26a7"
              quantity={20}
              staticity={100}
              ease={100}
              size={10.4}
            />
          </div>

          <div className="cv-reg-grain" />

          <div className="cv-reg-card">
            <div className="cv-reg-card-shimmer" />

            <div className="cv-reg-logo-wrap">
              <img src="/logo.jpg" alt="logo" className="cv-logo-img" />
              <h1 className="cv-reg-logo-name">Ryan's Core</h1>
              <p className="cv-reg-logo-sub">// your snippet library</p>
            </div>

            <hr className="cv-reg-divider" />

            <h2 className="cv-reg-heading">Create Account</h2>
            <p className="cv-reg-subheading">// initialize your vault</p>

            <div className="cv-reg-badge">
              <span className="cv-reg-badge-dot" />
              NEW VAULT
            </div>

            <form onSubmit={handleRegister}>
              <div className="cv-reg-field-wrap">
                <span className="cv-reg-field-icon"></span>
                <input
                  className="cv-reg-field"
                  type="text"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                />
              </div>

              <div className="cv-reg-field-wrap">
                <span className="cv-reg-field-icon"></span>
                <input
                  className="cv-reg-field"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>

              <button className="cv-reg-btn" type="submit" disabled={loading}>
                <span className="cv-reg-btn-inner">
                  {loading ? (
                    <><div className="cv-reg-spinner" /> Creating vault...</>
                  ) : (
                      <><Link to="/login">Create Account →</Link></>
                  )}
                </span>
              </button>
            </form>

            <p className="cv-reg-switch">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>

        </div>
    </>
  );
}