import React from "react";
import { playSound } from "./audio";

const THEME = {
  bg: "#0d0f14",
  accent: "#e8b84b",
  accentGlow: "rgba(232,184,75,0.28)",
  textDim: "rgba(255,255,255,0.5)",
  textMuted: "rgba(255,255,255,0.3)",
};

const Overlay = ({ children }) => (
  <div className="overlay-container">
    <style>{`
      .overlay-container {
        position: fixed; inset: 0;
        background: rgba(13,15,20,0.85);
        backdrop-filter: blur(12px);
        display: flex; flex-direction: column;
        align-items: center; justify-content: center;
        z-index: 100;
        color: #fff;
        font-family: 'DM Mono', 'Fira Mono', monospace;
      }
      .menu-box {
        display: flex; flex-direction: column; gap: 20px;
        background: rgba(13,15,20,0.95);
        border: 1px solid rgba(232,184,75,0.15);
        border-radius: 16px; padding: 48px;
        text-align: center;
        width: 100%; max-width: 440px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.8);
      }
      .menu-title {
        font-size: 24px; letter-spacing: 0.3em; text-transform: uppercase;
        color: ${THEME.accent}; margin-bottom: 24px;
        text-shadow: 0 0 10px rgba(232,184,75,0.3);
      }
      .menu-btn {
        font-family: 'DM Mono', 'Fira Mono', monospace;
        font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase;
        color: rgba(255,255,255,0.8);
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 8px; padding: 14px 28px; cursor: pointer;
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        outline: none;
      }
      .menu-btn:hover {
        color: ${THEME.accent}; border-color: rgba(232,184,75,0.4);
        background: rgba(232,184,75,0.08);
        transform: translateY(-1px);
      }
      .menu-btn.accent {
        color: #0d0f14; background: ${THEME.accent}; border-color: ${THEME.accent}; font-weight: bold;
      }
      .menu-btn.accent:hover {
        background: #f0c868; box-shadow: 0 0 20px rgba(232,184,75,0.45);
        transform: translateY(-2px);
      }
      .rules-list { text-align: left; margin: 10px 0 20px 0; display: flex; flex-direction: column; gap: 16px; }
      .rules-item { display: flex; gap: 14px; font-size: 13px; line-height: 1.6; color: rgba(255,255,255,0.7); }
      .rules-bullet { color: ${THEME.accent}; font-weight: bold; flex-shrink: 0; }
      .setting-row { display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; text-align: left; }
      .setting-label { font-size: 10px; color: ${THEME.textDim}; letter-spacing: 0.2em; text-transform: uppercase; }
      input[type=range] {
        -webkit-appearance: none; width: 100%; background: transparent;
      }
      input[type=range]::-webkit-slider-runnable-track {
        width: 100%; height: 4px; cursor: pointer; background: rgba(255,255,255,0.1); border-radius: 2px;
      }
      input[type=range]::-webkit-slider-thumb {
        height: 16px; width: 16px; border-radius: 50%; background: ${THEME.accent}; cursor: pointer; -webkit-appearance: none; margin-top: -6px;
        box-shadow: 0 0 10px rgba(232,184,75,0.4);
      }
      @media (max-width: 500px) {
        .menu-box { padding: 32px 24px; max-width: 90%; }
        .menu-title { font-size: 20px; }
      }
    `}</style>
    <div className="menu-box">{children}</div>
  </div>
);

export const MainMenu = ({ onStart, onHowToPlay, onSettings, volume }) => (
  <Overlay>
    <div className="menu-title">Kyro</div>
    <button className="menu-btn accent" onClick={() => { playSound("click", volume); onStart(); }}>Start</button>
    <button className="menu-btn" onClick={() => { playSound("click", volume); onHowToPlay(); }}>How to Play</button>
    <button className="menu-btn" onClick={() => { playSound("click", volume); onSettings(); }}>Settings</button>
  </Overlay>
);

export const HowToPlay = ({ onBack, volume }) => (
  <Overlay>
    <div className="menu-title">Rules</div>
    <div className="rules-list">
      <div className="rules-item">
        <span className="rules-bullet">3x3</span>
        <span>Standard Tic-Tac-Toe. Get 3 in a row on a fixed grid to win.</span>
      </div>
      <div className="rules-item">
        <span className="rules-bullet">Inf</span>
        <span>Five-in-a-row. The board is infinite. Click and drag to pan. Connect 5 pieces to win.</span>
      </div>
    </div>
    <button className="menu-btn accent" onClick={() => { playSound("click", volume); onBack(); }}>Back to Menu</button>
  </Overlay>
);

export const Settings = ({ volume, onVolumeChange, onBack }) => (
  <Overlay>
    <div className="menu-title">Settings</div>
    <div className="setting-row">
      <div className="setting-label">Master Volume: {volume}%</div>
      <input
        type="range"
        min="0"
        max="100"
        value={volume}
        onChange={(e) => onVolumeChange(parseInt(e.target.value))}
      />
    </div>
    <button className="menu-btn accent" onClick={() => { playSound("click", volume / 100); onBack(); }}>Back to Menu</button>
  </Overlay>
);

export const ModeSelect = ({ onSelectMode, onBack, volume }) => (
  <Overlay>
    <div className="menu-title">Choose Mode</div>
    <button className="menu-btn accent" onClick={() => { playSound("click", volume); onSelectMode("3x3"); }}>Classic 3x3</button>
    <button className="menu-btn" onClick={() => { playSound("click", volume); onSelectMode("infinite"); }}>Infinite Gomoku</button>
    <button className="menu-btn" style={{marginTop: '12px', borderColor: 'transparent', color: THEME.textMuted}} onClick={() => { playSound("click", volume); onBack(); }}>Back</button>
  </Overlay>
);
