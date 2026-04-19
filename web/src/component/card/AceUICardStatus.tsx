import React, { useId } from "react";
import AceUICard from "./AceUICard";

type AceUICardStatusProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: "primary" | "secondary" | "accent" | "red" | "green" | "yellow";
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
          {color === "primary" && (
            <div
              className={`rounded-md bg-secondary text-primary dark:bg-text dark:text-accent p-2 w-fit mb-4`}
            >
              {icon}
            </div>
          )}
          {color === "secondary" && (
            <div
              className={`rounded-md bg-background text-secondary dark:bg-text dark:text-background p-2 w-fit mb-4`}
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
            <h2 className="text-xl font-medium text-text/70 dark:text-background/70 mb-1">
              {title}
            </h2>
            <div className="flex items-baseline gap-1">
              <p className="text-3xl font-bold text-text dark:text-background">
                {value}
              </p>
              {unit && (
                <span className="text-md text-text/80 dark:text-background/80">
                  {unit}
                </span>
              )}
            </div>
          </div>
        </div>
        {toggle && (
          <div className="relative inline-block w-11 h-5 justify-self-end mt-2">
            <input
              defaultChecked={false}
              id={switchId}
              type="checkbox"
              className="peer appearance-none w-11 h-6 bg-secondary dark:bg-text rounded-full checked:bg-primary dark:checked:bg-accent cursor-pointer transition-colors duration-300"
            />
            <label
              htmlFor={switchId}
              className="absolute top-0.5 left-0.5 w-5 h-5 bg-background rounded-full border border-secondary shadow-sm transition-transform duration-300 peer-checked:translate-x-5 peer-checked:border-primary dark:peer-checked:border-accent cursor-pointer"
            ></label>
          </div>
        )}
      </div>
    </AceUICard>
  );
}

export default AceUICardStatus;
