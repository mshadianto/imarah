// ═════════════════════════════════════════════════════════════════════
// Akuntansi · shared inline-style UI primitives
// All styling is inline (palet jade/brass + Fraunces/Plus Jakarta Sans).
// ═════════════════════════════════════════════════════════════════════

import { useEffect, useState } from "react";
import { PALETTE as P, FONT, KLASIFIKASI_LABEL, KLASIFIKASI_PILL } from "./constants.js";

export const ak = {
  P,
  FONT,
  bodyFont: FONT.body,
  displayFont: FONT.display,
  monoFont: FONT.mono,
};

// ── Card ──────────────────────────────────────────────────────────────
export function Card({ children, style, padding = 20 }) {
  return (
    <div
      style={{
        background: "#fff",
        border: `1px solid ${P.ink100}`,
        borderRadius: 6,
        padding,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ── Button ────────────────────────────────────────────────────────────
const BTN_BASE = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  padding: "9px 16px",
  borderRadius: 5,
  fontWeight: 600,
  fontSize: 13,
  cursor: "pointer",
  border: "1px solid transparent",
  fontFamily: FONT.body,
  transition: "background 0.15s, color 0.15s, border-color 0.15s",
};

const BTN_VARIANTS = {
  primary: { background: P.jade700, color: "#fff" },
  secondary: { background: "#fff", color: P.jade700, borderColor: P.ink200 },
  ghost: { background: "transparent", color: P.ink500 },
  brass: { background: P.brass500, color: "#fff" },
  danger: { background: "#fff", color: P.rose700, borderColor: P.rose100 },
};

export function Btn({
  children,
  variant = "primary",
  type = "button",
  onClick,
  style,
  disabled,
  title,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        ...BTN_BASE,
        ...BTN_VARIANTS[variant],
        opacity: disabled ? 0.55 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

// ── Input ─────────────────────────────────────────────────────────────
const INPUT_STYLE = {
  width: "100%",
  padding: "10px 14px",
  border: `1px solid ${P.ink200}`,
  borderRadius: 5,
  fontSize: 14,
  background: "#fff",
  fontFamily: FONT.body,
  color: P.ink900,
  boxSizing: "border-box",
  outline: "none",
};

export function Input({ mono, style, ...rest }) {
  return (
    <input
      {...rest}
      style={{
        ...INPUT_STYLE,
        fontFamily: mono ? FONT.mono : FONT.body,
        ...style,
      }}
      onFocus={(e) => {
        e.target.style.borderColor = P.jade700;
        e.target.style.boxShadow = "0 0 0 3px rgba(21,87,65,0.1)";
        rest.onFocus && rest.onFocus(e);
      }}
      onBlur={(e) => {
        e.target.style.borderColor = P.ink200;
        e.target.style.boxShadow = "none";
        rest.onBlur && rest.onBlur(e);
      }}
    />
  );
}

export function Select({ children, style, ...rest }) {
  return (
    <select
      {...rest}
      style={{ ...INPUT_STYLE, appearance: "auto", ...style }}
      onFocus={(e) => {
        e.target.style.borderColor = P.jade700;
        e.target.style.boxShadow = "0 0 0 3px rgba(21,87,65,0.1)";
        rest.onFocus && rest.onFocus(e);
      }}
      onBlur={(e) => {
        e.target.style.borderColor = P.ink200;
        e.target.style.boxShadow = "none";
        rest.onBlur && rest.onBlur(e);
      }}
    >
      {children}
    </select>
  );
}

export function Label({ children, style }) {
  return (
    <label
      style={{
        display: "block",
        fontSize: 11,
        fontWeight: 600,
        color: P.ink500,
        marginBottom: 6,
        textTransform: "uppercase",
        letterSpacing: 0.4,
        fontFamily: FONT.body,
        ...style,
      }}
    >
      {children}
    </label>
  );
}

// ── Pill ──────────────────────────────────────────────────────────────
export function Pill({ tone = "ink", children, style }) {
  const tones = {
    jade: { bg: P.jade100, fg: P.jade900 },
    brass: { bg: "#f5e8d0", fg: "#7a5a26" },
    ink: { bg: P.ink100, fg: P.ink900 },
    rose: { bg: P.rose100, fg: P.rose700 },
  };
  const t = tones[tone] || tones.ink;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 10px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: 0.2,
        background: t.bg,
        color: t.fg,
        fontFamily: FONT.body,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

export function KlasifikasiPill({ value }) {
  const tone =
    value === "UNRESTRICTED" ? "jade" : value === "TEMP_RESTRICTED" ? "brass" : "ink";
  return <Pill tone={tone}>{KLASIFIKASI_LABEL[value] || "—"}</Pill>;
}

// ── Section heading helper ────────────────────────────────────────────
export function SectionHead({ eyebrow, title, action, style }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        marginBottom: 16,
        ...style,
      }}
    >
      <div>
        {eyebrow ? (
          <div
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: 1,
              color: "rgba(28,38,32,0.5)",
              fontFamily: FONT.body,
            }}
          >
            {eyebrow}
          </div>
        ) : null}
        <div
          style={{
            fontFamily: FONT.display,
            fontSize: 22,
            color: P.ink900,
            lineHeight: 1.2,
          }}
        >
          {title}
        </div>
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────
export function AkModal({ open, onClose, title, eyebrow, children, width = 560 }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && onClose && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, fontFamily: FONT.body }}>
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(28,38,32,0.5)",
          backdropFilter: "blur(2px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "92%",
          maxWidth: width,
          maxHeight: "90vh",
          overflowY: "auto",
          background: "#fff",
          borderRadius: 8,
          padding: 24,
          boxShadow: "0 24px 64px rgba(10,51,38,0.25)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <div>
            {eyebrow ? (
              <div
                style={{
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  color: "rgba(28,38,32,0.5)",
                }}
              >
                {eyebrow}
              </div>
            ) : null}
            <div style={{ fontFamily: FONT.display, fontSize: 20, color: P.ink900 }}>{title}</div>
          </div>
          <Btn variant="ghost" onClick={onClose} style={{ padding: "4px 10px", fontSize: 16 }}>
            ✕
          </Btn>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Toast (lightweight, self-contained) ───────────────────────────────
let toastCounter = 0;
const toastSubscribers = new Set();

export function showToast(message) {
  const item = { id: ++toastCounter, message };
  toastSubscribers.forEach((cb) => cb(item));
}

export function ToastHost() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    const cb = (item) => {
      setItems((prev) => [...prev, item]);
      setTimeout(() => setItems((prev) => prev.filter((i) => i.id !== item.id)), 2200);
    };
    toastSubscribers.add(cb);
    return () => toastSubscribers.delete(cb);
  }, []);
  return (
    <div
      style={{
        position: "fixed",
        right: 24,
        bottom: 24,
        zIndex: 300,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        pointerEvents: "none",
      }}
    >
      {items.map((i) => (
        <div
          key={i.id}
          style={{
            background: P.jade900,
            color: "#fff",
            padding: "10px 18px",
            borderRadius: 6,
            fontSize: 13,
            fontFamily: FONT.body,
            boxShadow: "0 12px 32px rgba(10,51,38,0.35)",
            pointerEvents: "auto",
            animation: "akFadeIn 0.25s ease",
          }}
        >
          {i.message}
        </div>
      ))}
      <style>{`
        @keyframes akFadeIn { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>
    </div>
  );
}

// ── Table primitives ──────────────────────────────────────────────────
export const TH_STYLE = {
  fontSize: 10.5,
  textTransform: "uppercase",
  letterSpacing: 1.2,
  color: P.ink500,
  textAlign: "left",
  padding: "12px 16px",
  borderBottom: `1px solid ${P.ink100}`,
  fontWeight: 600,
  fontFamily: FONT.body,
  background: "transparent",
};

export const TD_STYLE = {
  padding: "13px 16px",
  borderBottom: `1px solid #f4f3ee`,
  fontSize: 14,
  verticalAlign: "top",
  fontFamily: FONT.body,
  color: P.ink900,
};

export { KLASIFIKASI_PILL };
