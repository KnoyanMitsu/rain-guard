import { render, screen } from "@testing-library/react";
import HalamanLogin from "@/pages/auth/login";

describe("Login Page (/auth/login)", () => {
  it("renders the login page component", () => {
    render(<HalamanLogin />);
    expect(screen.getByText("Masuk Ke Akun")).toBeInTheDocument();
  });

  it("renders email input", () => {
    render(<HalamanLogin />);
    expect(screen.getByPlaceholderText("nama@email.com")).toBeInTheDocument();
  });

  it("renders password input", () => {
    render(<HalamanLogin />);
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
  });
});
