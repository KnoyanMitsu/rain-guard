import { render, screen } from "@testing-library/react";
import AceUICardStatus from "@/component/card/AceUICardStatus";

describe("AceUICardStatus", () => {
  const defaultProps = {
    title: "Distance",
    value: "25.5",
    icon: <svg data-testid="test-icon" />,
    color: "primary" as const,
  };

  it("renders the title and value", () => {
    render(<AceUICardStatus {...defaultProps} />);

    expect(screen.getByText("Distance")).toBeInTheDocument();
    expect(screen.getByText("25.5")).toBeInTheDocument();
  });

  it("renders unit when provided", () => {
    render(<AceUICardStatus {...defaultProps} unit="cm" />);

    expect(screen.getByText("cm")).toBeInTheDocument();
  });

  it("does not render unit when not provided", () => {
    render(<AceUICardStatus {...defaultProps} />);

    expect(screen.queryByText("cm")).not.toBeInTheDocument();
  });

  it("renders icon for primary color", () => {
    render(<AceUICardStatus {...defaultProps} color="primary" />);

    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
  });

  it("renders icon for red color", () => {
    render(<AceUICardStatus {...defaultProps} color="red" />);

    const iconContainer = screen.getByTestId("test-icon").parentElement;
    expect(iconContainer).toHaveClass("bg-red-100");
    expect(iconContainer).toHaveClass("text-red-500");
  });

  it("renders icon for green color", () => {
    render(<AceUICardStatus {...defaultProps} color="green" />);

    const iconContainer = screen.getByTestId("test-icon").parentElement;
    expect(iconContainer).toHaveClass("bg-green-100");
    expect(iconContainer).toHaveClass("text-green-500");
  });

  it("renders icon for yellow color", () => {
    render(<AceUICardStatus {...defaultProps} color="yellow" />);

    const iconContainer = screen.getByTestId("test-icon").parentElement;
    expect(iconContainer).toHaveClass("bg-yellow-100");
    expect(iconContainer).toHaveClass("text-yellow-500");
  });

  it("renders icon for secondary color", () => {
    render(<AceUICardStatus {...defaultProps} color="secondary" />);

    const iconContainer = screen.getByTestId("test-icon").parentElement;
    expect(iconContainer).toHaveClass("bg-background");
    expect(iconContainer).toHaveClass("text-secondary");
  });

  it("renders toggle switch when toggle is true", () => {
    render(<AceUICardStatus {...defaultProps} toggle={true} />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
  });

  it("does not render toggle switch when toggle is false/undefined", () => {
    render(<AceUICardStatus {...defaultProps} />);

    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });

  it("renders numeric value", () => {
    render(<AceUICardStatus {...defaultProps} value={100} />);

    expect(screen.getByText("100")).toBeInTheDocument();
  });
});
