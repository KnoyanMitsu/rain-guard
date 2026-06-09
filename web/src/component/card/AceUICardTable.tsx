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
  itemsPerPage?: number;
  info?: string;
  renderCell?: (value: any, row: Tbody, columnIndex: number) => React.ReactNode;
};

function AceUICardTable({
  thead,
  tbody,
  title,
  buttonSave,
  onClick,
  buttonTitle,
  itemsPerPage = 5,
  info,
  renderCell,
}: Props) {
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

  const totalPages = Math.ceil(rawData.length / itemsPerPage);

  const isDisablePrev = currentPage <= 1;
  const isDisableNext = currentPage >= totalPages;

  const dataTbody = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return rawData.slice(start, end);
  }, [rawData, currentPage, itemsPerPage]);

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
        {info && (
          <p className="text-sm text-text/60 mt-1 mb-4">{info}</p>
        )}
        <div className="overflow-x-scroll md:overflow-hidden rounded-2xl border mb-3 border-secondary">
          <table className="w-full text-left border-collapse bg-background">
            <thead className="bg-secondary/20 text-text">
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
                        {renderCell ? renderCell(cellValue, row, cellIndex) : cellValue}
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
            Sebelumnya
          </AceUIButton>
          {(() => {
            const maxVisible = 5;
            let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
            let endPage = Math.min(totalPages, startPage + maxVisible - 1);

            if (endPage - startPage + 1 < maxVisible) {
              startPage = Math.max(1, endPage - maxVisible + 1);
            }

            const pages = [];
            for (let i = startPage; i <= endPage; i++) {
              pages.push(i);
            }

            return (
              <>
                {startPage > 1 && (
                  <span className="flex items-end justify-center px-1 text-text/50">...</span>
                )}
                {pages.map((pageNum) => (
                  <AceUIButton
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    types="button"
                    disable={currentPage === pageNum}
                  >
                    {pageNum}
                  </AceUIButton>
                ))}
                {endPage < totalPages && (
                  <span className="flex items-end justify-center px-1 text-text/50">...</span>
                )}
              </>
            );
          })()}
          <AceUIButton
            onClick={nextPage}
            types="button"
            disable={isDisableNext}
          >
            Selanjutnya
          </AceUIButton>
        </div>
      </AceUICardWithTitle>
    </>
  );
}

export default AceUICardTable;
