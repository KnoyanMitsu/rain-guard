import { render, screen, fireEvent } from "@testing-library/react";
import AceUIButton from "@/component/input/AceUIButton";

describe("AceUIButton", () => {
  it("renders children text", () => {
    render(<AceUIButton types="button">Click Me</AceUIButton>);
    expect(screen.getByText("Click Me")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const handleClick = jest.fn();
    render(<AceUIButton types="button" onClick={handleClick}>Click</AceUIButton>);
    fireEvent.click(screen.getByText("Click"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when disable prop is true", () => {
    render(<AceUIButton types="button" disable={true}>Disabled</AceUIButton>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("renders with correct type attribute", () => {
    render(<AceUIButton types="submit">Submit</AceUIButton>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("does not call onClick when disabled", () => {
    const handleClick = jest.fn();
    render(<AceUIButton types="button" disable={true} onClick={handleClick}>Click</AceUIButton>);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).not.toHaveBeenCalled();
  });
});
