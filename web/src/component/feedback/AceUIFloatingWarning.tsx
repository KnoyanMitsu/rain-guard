import { useState, useEffect } from "react";

type AceUIFloatingWarningProps = {
  show: boolean;
  title: string;
  message: string;
  type?: "warning" | "success" | "error";
};

function AceUIFloatingWarning({ show, title, message, type = "warning" }: AceUIFloatingWarningProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3000); // 30 detik = 30000 ms

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [show]);

  if (!isVisible) return null;

  const isSuccess = type === "success";
  
  const containerClass = isSuccess 
    ? "border-green-300 bg-green-600 shadow-[0_18px_45px_rgba(22,163,74,0.35)]" 
    : "border-red-300 bg-red-600 shadow-[0_18px_45px_rgba(220,38,38,0.35)]";
    
  const titleClass = isSuccess ? "text-green-100" : "text-red-100";
  const messageClass = isSuccess ? "text-green-50" : "text-red-50";
  const icon = isSuccess ? "✓" : "!";

  return (
    <div className="fixed top-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 animate-fade-in">
      <div
        role="alert"
        className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-white ${containerClass}`}
      >
        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 text-white">
          <span className="text-lg font-bold">{icon}</span>
        </div>
        <div className="min-w-0">
          <p className={`text-sm font-semibold uppercase tracking-[0.2em] ${titleClass}`}>
            {title}
          </p>
          <p className={`mt-1 text-sm leading-6 ${messageClass}`}>
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}

export default AceUIFloatingWarning;