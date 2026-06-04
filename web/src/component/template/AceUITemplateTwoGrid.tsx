import React from "react";

type AceUITemplateTwoGridProps = {
  children: React.ReactNode[];
};

function AceUITemplateTwoGrid({ children }: AceUITemplateTwoGridProps) {
  const childrenArray = React.Children.toArray(children);

  if (childrenArray.length < 2) {
    throw new Error("AceUITemplateTwoGrid must have at least two children");
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 h-screen bg-background text-text">
      <div className="hidden md:block md:col-span-2">{childrenArray[0]}</div>
      <div className="md:col-span-3">{childrenArray[1]}</div>
      {childrenArray.length > 2 && (
        <div className="hidden md:block md:col-span-2">{childrenArray[2]}</div>
      )}
      {childrenArray.length > 3 && (
        <div className="md:col-span-2">{childrenArray[3]}</div>
      )}
    </div>
  );
}

export default AceUITemplateTwoGrid;

