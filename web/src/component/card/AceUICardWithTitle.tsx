import React from "react";
import AceUICard from "./AceUICard";
import AceUIButton from "../input/AceUIButton";

type AceUICardWithTitleProps = {
  children: React.ReactNode;
  title: string;
  button?: boolean;
  titleButton?: string
  onClick?: () => void
};

function AceUICardWithTitle({
  children,
  title,
  button,
  titleButton,
  onClick
}: AceUICardWithTitleProps) {
  return (
    <>
      <AceUICard>
        <div className="grid grid-cols-2 mb-2">
          <h1 className="text-xl font-bold mb-2 text-text">{title}</h1>
          <div className="flex justify-end items-end">
            {button && (
              <AceUIButton
                types="button"
                onClick={onClick}
              >
                {titleButton}
              </AceUIButton>
            )}
          </div>
        </div>
        <hr className="mb-2 border-secondary/20" />
        <div>{children}</div>
      </AceUICard>
    </>
  );
}

export default AceUICardWithTitle;
