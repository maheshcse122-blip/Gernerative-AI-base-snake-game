import React from 'react';

export const NeonBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black overflow-hidden -z-10">
      {/* SCANNER LINE */}
      <div className="absolute top-0 left-0 w-full h-1 bg-[#00ffff] opacity-10 animate-[scan_4s_linear_infinite]" />
      
      {/* STATIC FLICKERS */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none glitch-art">
        <div className="absolute top-[10%] left-0 w-full h-[1px] bg-[#ff00ff]" />
        <div className="absolute top-[45%] left-0 w-full h-[2px] bg-[#00ffff]" />
        <div className="absolute top-[80%] left-0 w-full h-[1px] bg-[#ff00ff]" />
      </div>

      <style>{`
        @keyframes scan {
          from { transform: translateY(-100vh); }
          to { transform: translateY(100vh); }
        }
      `}</style>
    </div>
  );
};
