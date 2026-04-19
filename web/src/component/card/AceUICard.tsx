import React from "react";

type AceUICardProps = {
  children: React.ReactNode;
  className?: string;
};

function AceUICard({ children, className }: AceUICardProps) {
  return (
    <div
      className={`rounded-xl p-4 shadow-sm bg-background text-text dark:bg-text dark:text-background ${className}`}
    >
      {children}
    </div>
  );
}

export default AceUICard;
