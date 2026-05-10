import { render, screen, fireEvent } from "@testing-library/react";
import AceUIInput from "@/component/input/AceUIInput";

describe("AceUIInput", () => {
  const defaultProps = {
    label: "Email",
    value: "",
    onChange: jest.fn(),
    placeholder: "nama@email.com",
    type: "email",
  };

  it("renders label text", () => {
    render(<AceUIInput {...defaultProps} />);
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("renders input with placeholder", () => {
    render(<AceUIInput {...defaultProps} />);
    expect(screen.getByPlaceholderText("nama@email.com")).toBeInTheDocument();
  });

  it("renders input with correct type", () => {
    render(<AceUIInput {...defaultProps} />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("type", "email");
  });

  it("calls onChange when typing", () => {
    const handleChange = jest.fn();
    render(<AceUIInput {...defaultProps} onChange={handleChange} />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "test@email.com" } });
    expect(handleChange).toHaveBeenCalled();
  });

  it("displays the value prop", () => {
    render(<AceUIInput {...defaultProps} value="hello@test.com" />);
    expect(screen.getByDisplayValue("hello@test.com")).toBeInTheDocument();
  });
});
