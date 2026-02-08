import React, { useState, useEffect } from "react";
import { QueueState } from "../types";
import {
  ChevronRight,
  RefreshCw,
  Save,
  Monitor,
  Edit3,
  Check,
  X,
} from "lucide-react";
import Logo from "./Logo";

interface OperatorViewProps {
  state: QueueState;
  onUpdate: (newState: Partial<QueueState>) => void;
  onNext: () => void;
  onSwitchView: () => void;
}

const TIPS = [
  "Pastikan mikrofon dalam keadaan aktif sebelum memanggil nomor antrian berikutnya.",
  "Berikan senyum dan salam yang ramah kepada setiap nasabah yang Anda layani.",
  "Gunakan bahasa yang sopan dan jelas saat memberikan informasi atau arahan.",
  "Pastikan area kerja tetap rapi dan bersih untuk kenyamanan bersama.",
  "Jangan ragu untuk meminta bantuan supervisor jika menghadapi kendala teknis.",
];

const OperatorView: React.FC<OperatorViewProps> = ({
  state,
  onUpdate,
  onNext,
  onSwitchView,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(state.currentNumber.toString());
  const [marqueeEditValue, setMarqueeEditValue] = useState(state.marqueeText);
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % TIPS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleConfirm = () => {
    const parsed = parseInt(editValue);
    if (!isNaN(parsed)) {
      onUpdate({
        currentNumber: parsed,
        nextNumber: parsed + 1,
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(state.currentNumber.toString());
  };

  return (
    <div className="flex-1 bg-gray-100 p-8 flex flex-col items-center overflow-y-auto">
      <div className="max-w-4xl w-full flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border-l-8 border-red-600">
          <div className="flex items-center gap-4">
            <Logo className="h-12 w-10" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                Operator Dashboard
              </h1>
              <p className="text-gray-500 text-sm">Queue Control System v1.0</p>
            </div>
          </div>
          <button
            onClick={onSwitchView}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition shadow-md"
          >
            <Monitor size={18} />
            Layar Display
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Main Controls */}
          <div className="bg-white p-8 rounded-3xl shadow-xl flex flex-col gap-8">
            <div className="flex items-center gap-2 text-red-600">
              <RefreshCw size={24} />
              <h2 className="text-xl font-bold uppercase tracking-wider">
                Antrian Aktif
              </h2>
            </div>

            <div className="flex flex-col items-center py-6">
              <span className="text-gray-400 font-bold text-sm uppercase mb-2">
                Sedang Melayani
              </span>
              <div className="text-9xl font-black text-gray-900 bg-gray-50 px-10 py-4 rounded-3xl border-2 border-dashed border-gray-200">
                {isEditing ? (
                  <input
                    type="number"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-48 text-center bg-transparent border-none focus:outline-none"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleConfirm();
                      if (e.key === "Escape") handleCancel();
                    }}
                  />
                ) : (
                  state.currentNumber.toString().padStart(3, "0")
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {isEditing ? (
                <>
                  <button
                    onClick={handleConfirm}
                    className="col-span-2 py-6 bg-green-600 text-white rounded-2xl font-black text-2xl flex items-center justify-center gap-4 hover:bg-green-700 active:scale-95 transition shadow-lg shadow-green-200"
                  >
                    KONFIRMASI
                    <Check size={32} />
                  </button>

                  <button
                    onClick={handleCancel}
                    className="col-span-2 py-4 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition flex items-center justify-center gap-2"
                  >
                    <X size={18} />
                    BATAL
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={onNext}
                    className="col-span-2 py-6 bg-red-600 text-white rounded-2xl font-black text-2xl flex items-center justify-center gap-4 hover:bg-red-700 active:scale-95 transition shadow-lg shadow-red-200"
                  >
                    PANGGIL BERIKUTNYA
                    <ChevronRight size={32} />
                  </button>

                  <button
                    onClick={() =>
                      onUpdate({
                        currentNumber: Math.max(0, state.currentNumber - 1),
                        nextNumber: state.currentNumber,
                      })
                    }
                    className="py-4 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition"
                  >
                    KEMBALI (PREV)
                  </button>

                  <button
                    onClick={() => {
                      setEditValue(state.currentNumber.toString());
                      setIsEditing(true);
                    }}
                    className="py-4 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition flex items-center justify-center gap-2"
                  >
                    <Edit3 size={18} />
                    UBAH MANUAL
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Marquee & Secondary Info */}
          <div className="flex flex-col gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-xl flex flex-col gap-6">
              <div className="flex items-center gap-2 text-blue-600">
                <Edit3 size={24} />
                <h2 className="text-xl font-bold uppercase tracking-wider">
                  Teks Berjalan (Marquee)
                </h2>
              </div>

              <textarea
                className="w-full h-40 p-4 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition resize-none font-medium"
                value={marqueeEditValue}
                onChange={(e) => setMarqueeEditValue(e.target.value)}
                placeholder="Masukkan teks pengumuman di sini..."
              />

              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400 font-medium">
                  Klik simpan untuk memperbarui layar display.
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onUpdate({ marqueeText: marqueeEditValue })}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition shadow-md"
                  >
                    <Save size={16} />
                    SIMPAN
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-3xl shadow-xl text-white min-h-[220px] flex flex-col justify-between transition-all duration-500">
              <div>
                <h3 className="font-bold text-lg mb-4 opacity-80 uppercase tracking-widest flex items-center gap-2">
                  <div className="w-2 h-6 bg-yellow-400 rounded-full"></div>
                  Tips Pelayanan
                </h3>
                <div className="relative overflow-hidden h-24">
                  {TIPS.map((tip, index) => (
                    <p
                      key={index}
                      className={`text-sm leading-relaxed absolute transition-all duration-700 transform ${
                        index === currentTip
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-8"
                      }`}
                    >
                      {tip}
                    </p>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                {TIPS.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      index === currentTip ? "w-8 bg-white" : "w-2 bg-white/30"
                    }`}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperatorView;
