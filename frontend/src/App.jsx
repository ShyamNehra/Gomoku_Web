import React, { useState } from "react";
import { MainMenu, HowToPlay, Settings, ModeSelect } from "./Screens";
import TicTacToe from "./TicTacToe";
import KyroBoard from "./KyroBoard";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("menu");
  const [globalVolume, setGlobalVolume] = useState(100);

  const backToMenu = () => setCurrentScreen("menu");

  const renderScreen = () => {
    switch (currentScreen) {
      case "menu":
        return (
          <MainMenu
            volume={globalVolume / 100}
            onStart={() => setCurrentScreen("modeSelect")}
            onHowToPlay={() => setCurrentScreen("howToPlay")}
            onSettings={() => setCurrentScreen("settings")}
          />
        );
      case "howToPlay":
        return <HowToPlay volume={globalVolume / 100} onBack={backToMenu} />;
      case "settings":
        return (
          <Settings
            volume={globalVolume}
            onVolumeChange={setGlobalVolume}
            onBack={backToMenu}
          />
        );
      case "modeSelect":
        return (
          <ModeSelect
            volume={globalVolume / 100}
            onSelectMode={(mode) => setCurrentScreen(mode)}
            onBack={backToMenu}
          />
        );
      case "3x3":
        return <TicTacToe volume={globalVolume} onBack={backToMenu} />;
      case "infinite":
        return <KyroBoard volume={globalVolume} onBackToMenu={backToMenu} />;
      default:
        return (
          <MainMenu
            volume={globalVolume / 100}
            onStart={() => setCurrentScreen("modeSelect")}
            onHowToPlay={() => setCurrentScreen("howToPlay")}
            onSettings={() => setCurrentScreen("settings")}
          />
        );
    }
  };

  return (
    <div className="app-container">
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body, html, #root { width: 100%; height: 100%; background: #0d0f14; overflow: hidden; }
        .app-container { width: 100%; height: 100%; }
      `}</style>
      {renderScreen()}
    </div>
  );
}
