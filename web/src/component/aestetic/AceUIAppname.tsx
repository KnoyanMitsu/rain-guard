import React from "react";

type Props = {
  appname: string;
  description: string;
};

function AceUIAppname({ appname, description }: Props) {
  return (
    <div className="relative overflow-hidden h-full bg-background dark:bg-text text-text dark:text-background">
      <div className="absolute top-1/4 -left-10 w-96 h-96 bg-linear-to-r animate-move blur-3xl from-40% from-primary via-secondary via-10% to-accent to-80% rounded-full opacity-50 dark:opacity-30"></div>
      <div className="relative z-10 min-h-screen backdrop-blur-md p-10 flex flex-col justify-center">
        <div className="">
          <h1 className="font-bold text-5xl">{appname}</h1>
        </div>
        <div className="">
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
}

export default AceUIAppname;
