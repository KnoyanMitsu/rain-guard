import React from "react";

type Props = {
  title: string;
  onClick?: () => void;
};

function AceUIButton({ title, onClick }: Props) {
  return (
    <>
      <button
        className="border border-primary text-primary hover:bg-primary hover:text-background dark:border-accent dark:text-accent dark:hover:bg-accent dark:hover:text-background transition-colors duration-300 rounded-md p-2"
        onClick={onClick}
      >
        {title}
      </button>
    </>
  );
}

export default AceUIButton;
