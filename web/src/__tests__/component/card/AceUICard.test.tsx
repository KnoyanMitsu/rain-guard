import { render, screen } from "@testing-library/react";
import AceUICard from "@/component/card/AceUICard";

describe("AceUICard", () => {
  it("renders children content", () => {
    render(
      <AceUICard>
        <p>Card content</p>
      </AceUICard>
    );

    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("applies default classnames", () => {
    const { container } = render(
      <AceUICard>
        <span>Test</span>
      </AceUICard>
    );

    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass("rounded-xl");
    expect(card).toHaveClass("p-4");
    expect(card).toHaveClass("shadow-sm");
  });

  it("applies additional custom className", () => {
    const { container } = render(
      <AceUICard className="custom-class">
        <span>Test</span>
      </AceUICard>
    );

    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass("custom-class");
  });

  it("renders without className prop", () => {
    const { container } = render(
      <AceUICard>
        <span>Test</span>
      </AceUICard>
    );

    const card = container.firstChild as HTMLElement;
    expect(card).toBeTruthy();
  });
});
