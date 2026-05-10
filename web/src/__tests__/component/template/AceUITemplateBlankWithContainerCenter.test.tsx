import { render, screen } from "@testing-library/react";
import AceUITemplateBlankWithContainerCenter from "@/component/template/AceUITemplateBlankWithContainerCenter";

describe("AceUITemplateBlankWithContainerCenter", () => {
  it("renders children content", () => {
    render(
      <AceUITemplateBlankWithContainerCenter>
        <p>Center content</p>
      </AceUITemplateBlankWithContainerCenter>
    );
    expect(screen.getByText("Center content")).toBeInTheDocument();
  });

  it("has centering classes", () => {
    const { container } = render(
      <AceUITemplateBlankWithContainerCenter>
        <span>Test</span>
      </AceUITemplateBlankWithContainerCenter>
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("flex");
    expect(wrapper).toHaveClass("items-center");
    expect(wrapper).toHaveClass("justify-center");
  });
});
