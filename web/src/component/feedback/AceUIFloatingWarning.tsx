type AceUIFloatingWarningProps = {
  show: boolean;
  title: string;
  message: string;
};

function AceUIFloatingWarning({ show, title, message }: AceUIFloatingWarningProps) {
  if (!show) return null;

  return (
    <div className="fixed top-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2">
      <div
        role="alert"
        className="flex items-start gap-3 rounded-2xl border border-red-300 bg-red-600 px-4 py-3 text-white shadow-[0_18px_45px_rgba(220,38,38,0.35)]"
      >
        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 text-white">
          <span className="text-lg font-bold">!</span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-100">
            {title}
          </p>
          <p className="mt-1 text-sm leading-6 text-red-50">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}

export default AceUIFloatingWarning;