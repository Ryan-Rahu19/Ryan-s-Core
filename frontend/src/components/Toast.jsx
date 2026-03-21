import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

export function useToast() {
    return useContext(ToastContext);
}

const ICONS = {
    success: "✓",
    error: "✕",
    info: "⌗",
    warning: "⚠",
};

const COLORS = {
    success: { bg: "rgba(22,163,74,.13)", border: "rgba(22,163,74,.35)", color: "#34d399", glow: "rgba(22,163,74,.15)" },
    error: { bg: "rgba(239,68,68,.12)", border: "rgba(239,68,68,.35)", color: "#f87171", glow: "rgba(239,68,68,.12)" },
    info: { bg: "rgba(59,130,246,.12)", border: "rgba(59,130,246,.35)", color: "#60a5fa", glow: "rgba(59,130,246,.12)" },
    warning: { bg: "rgba(251,191,36,.1)", border: "rgba(251,191,36,.35)", color: "#fbbf24", glow: "rgba(251,191,36,.1)" },
};


export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = "info") => {
        const id = Date.now() + Math.random();
        setToasts((prev) => [...prev, { id, message, type, leaving: false }]);

        // Start leave animation after 2.6s, remove at 3s
        setTimeout(() => {
            setToasts((prev) =>
                prev.map((t) => (t.id === id ? { ...t, leaving: true } : t))
            );
        }, 4600);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }, []);

    const dismiss = (id) => {
        setToasts((prev) =>
            prev.map((t) => (t.id === id ? { ...t, leaving: true } : t))
        );
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 350);
    };

    return (
        <ToastContext.Provider value={showToast}>
            {children}

            
            <div style={{
                position: "fixed",
                top: 20,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 9999,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
                pointerEvents: "none",
                width: "max-content",
                maxWidth: "90vw",
            }}>
                <style>{`
          @keyframes toastIn {
            from { opacity: 0; transform: translateY(-20px) scale(.95); }
            to   { opacity: 1; transform: translateY(0)     scale(1); }
          }
          @keyframes toastOut {
            from { opacity: 1; transform: translateY(0)     scale(1); }
            to   { opacity: 0; transform: translateY(-14px) scale(.95); }
          }
          .cv-toast {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 13px 18px;
            border-radius: 14px;
            border: 1px solid;
            font-family: 'Space Grotesk', sans-serif;
            font-size: 14px;
            font-weight: 500;
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            box-shadow: 0 8px 32px rgba(0,0,0,.4);
            pointer-events: all;
            cursor: default;
            min-width: 240px;
            max-width: 420px;
            animation: toastIn .35s cubic-bezier(.34,1.56,.64,1) both;
          }
          .cv-toast.leaving {
            animation: toastOut .35s ease forwards;
          }
          .cv-toast-icon {
            width: 26px; height: 26px;
            border-radius: 8px;
            display: flex; align-items: center; justify-content: center;
            font-size: 13px; font-weight: 700;
            flex-shrink: 0;
          }
          .cv-toast-msg { flex: 1; color: #f1f5f9; line-height: 1.4; }
          .cv-toast-close {
            background: none; border: none;
            color: rgba(255,255,255,.3);
            font-size: 16px; cursor: pointer;
            padding: 0; line-height: 1;
            transition: color .15s;
            flex-shrink: 0;
          }
          .cv-toast-close:hover { color: rgba(255,255,255,.7); }
        `}</style>

                {toasts.map((toast) => {
                    const c = COLORS[toast.type] || COLORS.info;
                    return (
                        <div
                            key={toast.id}
                            className={`cv-toast ${toast.leaving ? "leaving" : ""}`}
                            style={{
                                background: c.bg,
                                borderColor: c.border,
                                boxShadow: `0 8px 32px rgba(0,0,0,.4), 0 0 0 1px ${c.glow}`,
                            }}
                        >
                            <div className="cv-toast-icon"
                                style={{ background: `${c.color}22`, color: c.color }}>
                                {ICONS[toast.type]}
                            </div>
                            <span className="cv-toast-msg">{toast.message}</span>
                            <button className="cv-toast-close" onClick={() => dismiss(toast.id)}>✕</button>
                        </div>
                    );
                })}
            </div>
        </ToastContext.Provider>
    );
}