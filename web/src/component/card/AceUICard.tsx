import React from "react";

type AceUICardProps = {
  children: React.ReactNode;
  className?: string;
};

function AceUICard({ children, className }: AceUICardProps) {
  return (
    <div
      className={`rounded-xl border border-secondary p-4 shadow-sm bg-white text-text ${className}`}
    >
      {children}
    </div>
  );
}

export default AceUICard;
