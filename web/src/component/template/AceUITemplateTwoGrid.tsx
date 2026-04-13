import React from "react";

type AceUITemplateTwoGridProps = {
  children: React.ReactNode;
};

function AceUITemplateTwoGrid({ children }: AceUITemplateTwoGridProps) {
  const childrenArray = React.Children.toArray(children);

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 h-screen">
      <div className="hidden md:block md:col-span-2 ">{childrenArray[0]}</div>
      <div className="md:col-span-3">{childrenArray[1]}</div>
    </div>
  );
}

export default AceUITemplateTwoGrid;
