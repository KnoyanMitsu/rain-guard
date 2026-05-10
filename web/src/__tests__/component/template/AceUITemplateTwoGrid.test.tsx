import { render, screen } from "@testing-library/react";
import AceUITemplateTwoGrid from "@/component/template/AceUITemplateTwoGrid";

describe("AceUITemplateTwoGrid", () => {
  it("renders two children in grid layout", () => {
    render(
      <AceUITemplateTwoGrid>
        <div>Left Panel</div>
        <div>Right Panel</div>
      </AceUITemplateTwoGrid>
    );
    expect(screen.getByText("Right Panel")).toBeInTheDocument();
  });

  it("has grid classes", () => {
    const { container } = render(
      <AceUITemplateTwoGrid>
        <div>Left</div>
        <div>Right</div>
      </AceUITemplateTwoGrid>
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("grid");
  });

  it("hides left panel on mobile (hidden md:block)", () => {
    const { container } = render(
      <AceUITemplateTwoGrid>
        <div>Left</div>
        <div>Right</div>
      </AceUITemplateTwoGrid>
    );
    const leftPanel = container.querySelector(".hidden.md\\:block") as HTMLElement;
    expect(leftPanel).toBeTruthy();
  });
});
