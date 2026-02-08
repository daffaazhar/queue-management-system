import React, { useState, useEffect, useCallback } from "react";
import { ViewMode, QueueState } from "./types";
import DisplayView from "./components/DisplayView";
import OperatorView from "./components/OperatorView";
import { Settings, Monitor } from "lucide-react";

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("display");
  const [state, setState] = useState<QueueState>(() => {
    // Try to load from local storage to simulate persistence
    const saved = localStorage.getItem("queue_system_state");
    if (saved) return JSON.parse(saved);
    return {
      currentNumber: 1,
      nextNumber: 2,
      marqueeText:
        "Selamat Datang di Kantor Kami. Silakan ambil nomor antrian dan tunggu panggilan petugas kami. Terima kasih.",
      lastUpdated: Date.now(),
    };
  });

  // Persist state changes
  useEffect(() => {
    localStorage.setItem("queue_system_state", JSON.stringify(state));
  }, [state]);

  // Sync state across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "queue_system_state" && e.newValue) {
        setState(JSON.parse(e.newValue));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleUpdateState = useCallback((newState: Partial<QueueState>) => {
    setState((prev) => ({
      ...prev,
      ...newState,
      lastUpdated: Date.now(),
    }));
  }, []);

  const playNotification = useCallback((num: number) => {
    try {
      // Basic chime sound
      const audioCtx = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        880,
        audioCtx.currentTime + 0.5,
      );

      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioCtx.currentTime + 1,
      );

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 1);

      // System Voice (Indonesian)
      const msg = new SpeechSynthesisUtterance();
      msg.text = `Nomor antrian ${num}, silakan menuju ke loket pelayanan. Terima kasih.`;
      msg.lang = "id-ID";
      msg.rate = 0.9; // Slightly slower for clarity
      window.speechSynthesis.speak(msg);
    } catch (e) {
      console.error("Audio playback failed", e);
    }
  }, []);

  const [audioEnabled, setAudioEnabled] = useState(false);

  // Trigger voice notification when current number changes
  useEffect(() => {
    // Only play on the display view and if audio is enabled by user interaction
    if (viewMode === "display" && audioEnabled) {
      playNotification(state.currentNumber);
    }
  }, [
    state.currentNumber,
    state.lastUpdated,
    viewMode,
    playNotification,
    audioEnabled,
  ]);

  const nextQueue = useCallback(() => {
    handleUpdateState({
      currentNumber: state.currentNumber + 1,
      nextNumber: state.currentNumber + 2,
    });
  }, [state.currentNumber, handleUpdateState]);

  return (
    <div className="h-screen flex flex-col relative overflow-hidden">
      {/* View Switcher - Hidden in production display but useful for this demo */}
      <div className="fixed top-4 right-4 z-50 flex gap-2 no-print opacity-0 hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={() => setViewMode("display")}
          className={`p-2 rounded-full shadow-lg ${viewMode === "display" ? "bg-red-600 text-white" : "bg-white text-gray-700"}`}
          title="Display View"
        >
          <Monitor size={20} />
        </button>
        <button
          onClick={() => setViewMode("operator")}
          className={`p-2 rounded-full shadow-lg ${viewMode === "operator" ? "bg-red-600 text-white" : "bg-white text-gray-700"}`}
          title="Operator Panel"
        >
          <Settings size={20} />
        </button>
      </div>

      {viewMode === "display" ? (
        <DisplayView
          state={state}
          audioEnabled={audioEnabled}
          onEnableAudio={() => setAudioEnabled(true)}
        />
      ) : (
        <OperatorView
          state={state}
          onUpdate={handleUpdateState}
          onNext={nextQueue}
          onSwitchView={() => setViewMode("display")}
        />
      )}
    </div>
  );
};

export default App;
