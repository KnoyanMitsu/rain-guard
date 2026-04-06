import React, { useId } from "react";
import AceUICard from "./AceUICard";

type AceUICardStatusProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: "red" | "green" | "blue" | "yellow";
  unit?: string;
  toggle?: boolean;
};

function AceUICardStatus({
  title,
  value,
  icon,
  color,
  unit,
  toggle,
}: AceUICardStatusProps) {
  const switchId = useId();

  return (
    <AceUICard>
      <div className="grid grid-cols-2">
        <div>
          {/* icons */}
          {color === "red" && (
            <div
              className={`rounded-md bg-red-100 text-red-500 p-2 w-fit mb-4`}
            >
              {icon}
            </div>
          )}
          {color === "green" && (
            <div
              className={`rounded-md bg-green-100 text-green-500 p-2 w-fit mb-4`}
            >
              {icon}
            </div>
          )}
          {color === "blue" && (
            <div
              className={`rounded-md bg-blue-100 text-blue-500 p-2 w-fit mb-4`}
            >
              {icon}
            </div>
          )}
          {color === "yellow" && (
            <div
              className={`rounded-md bg-yellow-100 text-yellow-500 p-2 w-fit mb-4`}
            >
              {icon}
            </div>
          )}
          {/* text */}
          <div>
            <h2 className="text-xl font-medium text-gray-500 mb-1">{title}</h2>
            <div className="flex items-baseline gap-1">
              <p className="text-3xl font-bold text-gray-700">{value}</p>
              {unit && <span className="text-md text-gray-700">{unit}</span>}
            </div>
          </div>
        </div>
        {toggle && (
          <div className="relative inline-block w-11 h-5 justify-self-end mt-2">
            <input
              defaultChecked={false}
              id={switchId}
              type="checkbox"
              className="peer appearance-none w-11 h-6 bg-slate-200 rounded-full checked:bg-cyan-700 cursor-pointer transition-colors duration-300"
            />
            <label
              htmlFor={switchId}
              className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full border border-slate-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-5 peer-checked:border-cyan-700 cursor-pointer"
            ></label>
          </div>
        )}
      </div>
    </AceUICard>
  );
}

export default AceUICardStatus;
