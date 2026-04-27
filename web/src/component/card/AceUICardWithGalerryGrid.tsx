"use client";
import React, { useState, useMemo } from "react";
import AceUICard from "./AceUICard";
import AceUIDropdown from "../input/AceUIDropdown";

export type ProjectContent = {
  title: string;
  image?: string;
  year?: string;
  isPublic?: boolean;
  isLive?: boolean;
  languages?: string[];
  description?: string;
  link?: {
    website?: string;
    source_code?: string;
  };
};

type AceUICardWithGalerryGridProps = {
  content?: ProjectContent[];
  title: string;
  viewoption: boolean;
  children?: React.ReactNode;
};

function AceUICardWithGalerryGrid({
  content = [],
  title,
  viewoption,
  children,
}: AceUICardWithGalerryGridProps) {
  const [sortType, setSortType] = useState<"recent" | "title">("recent");
  const [languageFilter, setLanguageFilter] = useState<string>("All");

  const availableLanguages = useMemo(() => {
    const langs = new Set<string>();
    content?.forEach((project) => {
      project.languages?.forEach((lang) => langs.add(lang));
    });
    return ["All", ...Array.from(langs)];
  }, [content]);

  const filteredAndSortedContent = useMemo(() => {
    if (!content) return [];

    // 1. Filter
    let result = [...content];
    if (languageFilter !== "All") {
      result = result.filter((project) =>
        project.languages?.includes(languageFilter),
      );
    }

    // 2. Sort
    if (sortType === "title") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortType === "recent") {
      // Reverse untuk membalik pesanan (yang terbaru ditambahkan jadi paling atas)
      result.reverse();
    }
    return result;
  }, [content, sortType, languageFilter]);

  return (
    <>
      <AceUICard>
        <div className="grid grid-cols-2 items-center mb-4">
          <h1 className="text-xl font-bold mb-2 justify-start text-text">
            {title}
          </h1>
          {viewoption && (
            <div className="justify-end flex gap-4">
              <AceUIDropdown
                title={
                  languageFilter === "All"
                    ? "Language (All)"
                    : `Language: ${languageFilter}`
                }
                actions={availableLanguages.map((lang) => ({
                  title: lang,
                  onClick: () => setLanguageFilter(lang),
                }))}
              />
              <AceUIDropdown
                title={sortType === "recent" ? "Sort: Recently" : "Sort: Title"}
                actions={[
                  {
                    title: "Recently View",
                    onClick: () => setSortType("recent"),
                  },
                  { title: "Title View", onClick: () => setSortType("title") },
                ]}
              />
            </div>
          )}
        </div>
        <div className="bg-secondary/30 p-4 rounded-md h-[600px] overflow-y-auto">
          {children}
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4">
            {filteredAndSortedContent.map((project, index) => (
              <div key={index} className="h-full">
                <div className="bg-background shadow-md hover:shadow-lg transition-shadow rounded-xl h-full flex flex-col overflow-hidden border border-secondary">
                  {project.image ? (
                    <img
                      src={project.image}
                      className="w-full h-48 object-cover"
                      alt={project.title}
                    />
                  ) : (
                    <div className="w-full h-48 bg-secondary flex items-center justify-center">
                      <span className="text-text/50">
                        No Image
                      </span>
                    </div>
                  )}
                  <div className="px-6 py-5 flex flex-col flex-grow">
                    <h1 className="text-xl font-bold text-text mb-1">
                      {project.title}
                    </h1>
                    <p className="text-text/70 font-medium text-sm mb-4">
                      {project.year}
                    </p>

                    <div className="flex gap-2 mb-4">
                      {project.isPublic ? (
                        <div className="bg-primary rounded-full px-3 py-1 flex items-center">
                          <p className="text-background font-medium text-xs">
                            Public
                          </p>
                        </div>
                      ) : (
                        <div className="bg-secondary rounded-full px-3 py-1 flex items-center">
                          <p className="text-text font-medium text-xs">
                            Private
                          </p>
                        </div>
                      )}

                      {project.isLive && (
                        <div className="bg-accent rounded-full px-3 py-1 flex items-center">
                          <p className="text-background font-medium text-xs">
                            Live
                          </p>
                        </div>
                      )}
                    </div>

                    {project.languages && project.languages.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.languages.map((lang, langIdx) => (
                          <div
                            key={langIdx}
                            className="bg-secondary border border-primary rounded-lg"
                          >
                            <p className="text-primary font-medium text-xs px-2 py-1">
                              {lang}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mb-6 flex-grow">
                      <p className="text-text/80 text-sm line-clamp-3">
                        {project.description}
                      </p>
                    </div>

                    {(project.isPublic || project.isLive) && (
                      <div
                        className={
                          project.isPublic && project.isLive
                            ? "grid grid-cols-2 gap-3 mt-auto"
                            : "grid grid-cols-1 gap-3 mt-auto"
                        }
                      >
                        {project.isLive && project.link?.website && (
                          <a
                            href={project.link.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-primary rounded-lg text-center py-2 flex items-center justify-center text-background font-medium text-sm hover:bg-accent transition-colors"
                          >
                            Website
                          </a>
                        )}
                        {project.isPublic && project.link?.source_code && (
                          <a
                            href={project.link.source_code}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-accent rounded-lg text-center py-2 flex items-center justify-center text-background font-medium text-sm hover:bg-primary transition-colors"
                          >
                            Source Code
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AceUICard>
    </>
  );
}

export default AceUICardWithGalerryGrid;
