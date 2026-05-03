"use client";
import React, { useMemo, useState } from "react";
import AceUICardWithTitle from "./AceUICardWithTitle";
import AceUIButton from "../input/AceUIButton";
import saveJson from "@/pages/dashboard/saveCSV";

export type Thead = {
  title: string;
};

export type Tbody = {
  [key: string]: any;
};

type Props = {
  thead: Thead[];
  tbody: Tbody[];
  title: string;
  buttonSave?: boolean;
  onClick?: () => void;
  buttonTitle?: string;
};

function AceUICardTable({
  thead,
  tbody,
  title,
  buttonSave,
  onClick,
  buttonTitle,
}: Props) {
  const showList = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    index: number | null;
    direction: "asc" | "desc" | null;
  }>({
    index: null,
    direction: null,
  });

  const rawData = useMemo(() => {
    if (!tbody || tbody.length === 0) return [];
    if (sortConfig.index === null || !sortConfig.direction) return tbody;

    return [...tbody].sort((a, b) => {
      const keysA = Object.keys(a).filter((k) => k !== "id");
      const key = keysA[sortConfig.index!];

      if (!key) return 0;

      let valA = a[key];
      let valB = b[key];

      const isDate = (val: any) =>
        typeof val === "string" && /^\d{2}\/\d{2}\/\d{4}$/.test(val);

      if (isDate(valA) && isDate(valB)) {
        const parseDate = (str: string) => {
          const parts = str.split("/");
          return new Date(
            Number(parts[2]),
            Number(parts[1]) - 1,
            Number(parts[0]),
          ).getTime();
        };
        valA = parseDate(valA);
        valB = parseDate(valB);
      } else if (typeof valA === "string" && typeof valB === "string") {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [tbody, sortConfig]);

  const totalPages = Math.ceil(rawData.length / showList);

  const isDisablePrev = currentPage <= 1;
  const isDisableNext = currentPage >= totalPages;

  const dataTbody = useMemo(() => {
    const start = (currentPage - 1) * showList;
    const end = start + showList;
    return rawData.slice(start, end);
  }, [rawData, currentPage, showList]);

  function nextPage() {
    if (!isDisableNext) {
      setCurrentPage((prev) => prev + 1);
    }
  }

  function prevPage() {
    if (!isDisablePrev) {
      setCurrentPage((prev) => prev - 1);
    }
  }

  function requestSort(index: number) {
    let direction: "asc" | "desc" | null = "asc";
    if (sortConfig.index === index && sortConfig.direction === "asc") {
      direction = "desc";
    } else if (sortConfig.index === index && sortConfig.direction === "desc") {
      direction = null;
    }
    setSortConfig({ index, direction });
    setCurrentPage(1);
  }

  return (
    <>
      <AceUICardWithTitle
        title={title}
        button={buttonSave}
        titleButton={buttonTitle}
        onClick={onClick}
      >
        <div className="overflow-x-scroll md:overflow-hidden rounded-2xl border mb-3 border-secondary">
          <table className="w-full text-left border-collapse bg-background">
            <thead className="bg-secondary text-primary">
              <tr>
                {thead.map((item, index) => (
                  <th
                    key={index}
                    className="px-4 py-3 font-medium text-background cursor-pointer hover:opacity-80 select-none"
                    onClick={() => requestSort(index)}
                  >
                    <div className="flex items-center gap-1">
                      {item.title}
                      {sortConfig.index === index && sortConfig.direction && (
                        <span>
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-background">
              {dataTbody.map((row, rowIndex) => {
                const { id, ...dataCells } = row;
                return (
                  <tr
                    key={rowIndex}
                    className="border-b border-secondary last:border-b-0"
                  >
                    {Object.values(dataCells).map((cellValue, cellIndex) => (
                      <td key={cellIndex} className="px-4 py-3 text-text">
                        {cellValue}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end items-end gap-2">
          <AceUIButton
            onClick={prevPage}
            types="button"
            disable={isDisablePrev}
          >
            Prev
          </AceUIButton>
          {Array.from({ length: totalPages }).map((_, index) => {
            const pageNum = index + 1;
            return (
              <AceUIButton
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                types="button"
                disable={currentPage === pageNum}
              >
                {pageNum}
              </AceUIButton>
            );
          })}
          <AceUIButton
            onClick={nextPage}
            types="button"
            disable={isDisableNext}
          >
            Next
          </AceUIButton>
        </div>
      </AceUICardWithTitle>
    </>
  );
}

export default AceUICardTable;
