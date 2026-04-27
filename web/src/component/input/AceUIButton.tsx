import React from "react";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  disable?: boolean;
  types: "submit" | "reset" | "button" | undefined;
};

function AceUIButton({ children, onClick, disable, types }: Props) {
  return (
    <>
      <button
        className="border border-primary text-primary hover:bg-primary hover:text-background transition-colors duration-300 rounded-md p-2"
        onClick={onClick}
        disabled={disable}
        type={types}
      >
        {children}
      </button>
    </>
  );
}

export default AceUIButton;
