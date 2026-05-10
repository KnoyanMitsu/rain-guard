import { render, screen, fireEvent } from "@testing-library/react";
import AceUICardWithGalerryGrid from "@/component/card/AceUICardWithGalerryGrid";

describe("AceUICardWithGalerryGrid", () => {
  const mockContent = [
    {
      title: "Project Alpha",
      year: "2024",
      isPublic: true,
      isLive: true,
      languages: ["TypeScript", "React"],
      description: "A cool project",
      link: {
        website: "https://alpha.com",
        source_code: "https://github.com/alpha",
      },
    },
    {
      title: "Project Beta",
      year: "2023",
      isPublic: false,
      isLive: false,
      languages: ["Python"],
      description: "Another project",
    },
    {
      title: "Project Gamma",
      year: "2025",
      isPublic: true,
      isLive: false,
      languages: ["TypeScript"],
      description: "Gamma project",
      link: {
        source_code: "https://github.com/gamma",
      },
    },
  ];

  it("renders the title", () => {
    render(
      <AceUICardWithGalerryGrid
        title="My Projects"
        viewoption={false}
        content={mockContent}
      />
    );

    expect(screen.getByText("My Projects")).toBeInTheDocument();
  });

  it("renders all projects", () => {
    render(
      <AceUICardWithGalerryGrid
        title="Projects"
        viewoption={false}
        content={mockContent}
      />
    );

    expect(screen.getByText("Project Alpha")).toBeInTheDocument();
    expect(screen.getByText("Project Beta")).toBeInTheDocument();
    expect(screen.getByText("Project Gamma")).toBeInTheDocument();
  });

  it("renders Public/Private badges", () => {
    render(
      <AceUICardWithGalerryGrid
        title="Projects"
        viewoption={false}
        content={mockContent}
      />
    );

    const publicBadges = screen.getAllByText("Public");
    const privateBadges = screen.getAllByText("Private");

    expect(publicBadges.length).toBe(2); // Alpha and Gamma
    expect(privateBadges.length).toBe(1); // Beta
  });

  it("renders Live badge for live projects", () => {
    render(
      <AceUICardWithGalerryGrid
        title="Projects"
        viewoption={false}
        content={mockContent}
      />
    );

    const liveBadges = screen.getAllByText("Live");
    expect(liveBadges.length).toBe(1); // Only Alpha
  });

  it("renders language tags", () => {
    render(
      <AceUICardWithGalerryGrid
        title="Projects"
        viewoption={false}
        content={mockContent}
      />
    );

    expect(screen.getAllByText("TypeScript").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Python")).toBeInTheDocument();
  });

  it("shows view options when viewoption is true", () => {
    render(
      <AceUICardWithGalerryGrid
        title="Projects"
        viewoption={true}
        content={mockContent}
      />
    );

    // Should show language filter and sort dropdowns
    expect(screen.getByText("Language (All)")).toBeInTheDocument();
    expect(screen.getByText("Sort: Recently")).toBeInTheDocument();
  });

  it("does not show view options when viewoption is false", () => {
    render(
      <AceUICardWithGalerryGrid
        title="Projects"
        viewoption={false}
        content={mockContent}
      />
    );

    expect(screen.queryByText("Language (All)")).not.toBeInTheDocument();
  });

  it("renders Website and Source Code links", () => {
    render(
      <AceUICardWithGalerryGrid
        title="Projects"
        viewoption={false}
        content={mockContent}
      />
    );

    const websiteLinks = screen.getAllByText("Website");
    const sourceCodeLinks = screen.getAllByText("Source Code");

    expect(websiteLinks.length).toBe(1); // Only Alpha has isLive + website
    expect(sourceCodeLinks.length).toBeGreaterThanOrEqual(1);
  });

  it("renders with empty content", () => {
    render(
      <AceUICardWithGalerryGrid
        title="Empty Projects"
        viewoption={false}
        content={[]}
      />
    );

    expect(screen.getByText("Empty Projects")).toBeInTheDocument();
  });

  it("renders children content", () => {
    render(
      <AceUICardWithGalerryGrid
        title="Projects"
        viewoption={false}
      >
        <p>Custom children</p>
      </AceUICardWithGalerryGrid>
    );

    expect(screen.getByText("Custom children")).toBeInTheDocument();
  });

  it("shows No Image placeholder when project has no image", () => {
    render(
      <AceUICardWithGalerryGrid
        title="Projects"
        viewoption={false}
        content={[{ title: "No Image Project" }]}
      />
    );

    expect(screen.getByText("No Image")).toBeInTheDocument();
  });
});
