import React from "react";
import AceUICard from "./AceUICard";

type AceUICardWithTitleProps = {
  children: React.ReactNode;
  title: string;
};

function AceUICardWithTitle({ children, title }: AceUICardWithTitleProps) {
  return (
    <>
      <AceUICard>
        <div>
          <h1 className="text-xl font-bold mb-2 text-text">
            {title}
          </h1>
        </div>
        <hr className="mb-2 border-secondary/20" />
        <div>{children}</div>
      </AceUICard>
    </>
  );
}

export default AceUICardWithTitle;
