import React from "react";

type Props = {
  appname: string;
  description: string;
};

function AceUIAppname({ appname, description }: Props) {
  return (
    <div className="overflow-hidden">
      <div className="fixed top-100 justify-center left-28 w-100 h-100 bg-linear-to-r animate-move blur-3xl from-40% from-[#155dfd] via-[#eff6ff] via-10% to-[#155dfd] to-80% rounded-full"></div>
      <div className="min-h-screen backdrop-blur-md p-10 flex flex-col justify-center">
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
