import React from "react";
import { QueueState } from "../types";
import Logo from "./Logo";
import { Monitor } from "lucide-react";

interface DisplayViewProps {
  state: QueueState;
  audioEnabled: boolean;
  onEnableAudio: () => void;
}

const DisplayView: React.FC<DisplayViewProps> = ({
  state,
  audioEnabled,
  onEnableAudio,
}) => {
  const formattedNumber = (num: number) => num.toString().padStart(3, "0");

  return (
    <div className="flex-1 flex flex-col bg-gray-50 text-gray-900">
      <header className="bg-white px-10 py-6 flex items-center justify-between border-b-4 border-[#FFD700]">
        <div className="flex items-center gap-6">
          <img
            src="/Danantara_Logo.svg"
            alt="Logo Danantara"
            width={200}
            height={200}
          />
          <div>
            <h1 className="text-4xl font-extrabold tracking-tighter text-[#0054A6]">
              SMART QUEUE
            </h1>
            <p className="text-[#00AEEF] font-bold uppercase tracking-widest text-sm">
              Customer Service Center
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-5xl font-black text-gray-800">
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <div className="text-gray-500 font-semibold uppercase text-xs">
              {new Date().toLocaleDateString([], {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
          <img src="/PLN_Logo.svg" alt="Logo PLN" width={100} height={100} />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:flex-row p-10 gap-10">
        {/* Now Serving */}
        <div className="flex-1 bg-white rounded-3xl shadow-xl border-4 border-[#00AEEF] flex flex-col items-center justify-center p-12 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-2 bg-[#00AEEF]/10"></div>
          <h2 className="text-3xl font-black text-[#0054A6] uppercase tracking-[0.2em] mb-8">
            SEDANG DILAYANI
          </h2>
          <div className="text-[20rem] leading-none font-black text-[#E31E24] transition-all duration-500 scale-100 group-hover:scale-105">
            {formattedNumber(state.currentNumber)}
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full my-8"></div>
          <p className="text-3xl font-bold text-[#E31E24] tracking-widest">
            SILAKAN KE LOKET PELAYANAN
          </p>
        </div>

        {/* Next & Secondary Info */}
        <div className="w-full md:w-1/3 flex flex-col gap-10">
          <div className="bg-[#00AEEF] text-white rounded-3xl shadow-lg flex-1 p-8 flex flex-col items-center justify-center text-center">
            <h3 className="text-xl font-bold uppercase tracking-widest mb-4 opacity-100">
              Antrian Berikutnya
            </h3>
            <div className="text-9xl font-black">
              {formattedNumber(state.nextNumber)}
            </div>
          </div>

          <div className="bg-[#FFD700] rounded-3xl shadow-lg p-10 flex flex-col items-center justify-center text-center flex-1">
            <p className="text-xl font-black text-[#0054A6] leading-tight uppercase">
              Siapkan berkas ID Pelanggan dan berkas Anda untuk mempercepat
              proses
            </p>
          </div>
        </div>
      </main>

      {/* Marquee Footer */}
      <footer className="h-24 bg-[#0054A6] border-t-8 border-[#FFD700] flex items-center overflow-hidden relative">
        <div className="absolute left-0 h-full bg-white px-8 flex items-center z-10 shadow-xl border-r-4 border-[#FFD700]">
          <span className="text-[#0054A6] font-black text-3xl italic tracking-tighter">
            INFO
          </span>
        </div>
        <div className="w-full overflow-hidden">
          <div className="animate-marquee inline-block py-2 text-white text-3xl font-bold whitespace-nowrap">
            <span className="inline-block">
              {state.marqueeText} &nbsp; &bull; &nbsp; {state.marqueeText}{" "}
              &nbsp; &bull; &nbsp; {state.marqueeText} &nbsp; &bull; &nbsp;
            </span>
            <span className="inline-block">
              {state.marqueeText} &nbsp; &bull; &nbsp; {state.marqueeText}{" "}
              &nbsp; &bull; &nbsp; {state.marqueeText} &nbsp; &bull; &nbsp;
            </span>
          </div>
        </div>
      </footer>

      {/* Audio Unlock Overlay */}
      {!audioEnabled && (
        <div
          onClick={onEnableAudio}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-100 flex flex-col items-center justify-center cursor-pointer group"
        >
          <div className="bg-white p-10 rounded-full shadow-2xl animate-bounce group-hover:scale-110 transition-transform">
            <Monitor size={80} className="text-red-600" />
          </div>
          <h2 className="text-white text-4xl font-black mt-8 uppercase tracking-widest drop-shadow-lg">
            Klik untuk Aktifkan Suara
          </h2>
          <p className="text-white/70 mt-4 font-bold">
            (Browser mewajibkan interaksi pengguna untuk memutar audio)
          </p>
        </div>
      )}
    </div>
  );
};

export default DisplayView;
