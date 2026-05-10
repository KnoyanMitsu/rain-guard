import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

// Re-mock signIn and useRouter with specific behavior for this test
jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
  signOut: jest.fn(),
  useSession: jest.fn(() => ({ data: null, status: "unauthenticated" })),
  SessionProvider: ({ children }: any) => children,
}));

import TampilanLogin from "@/views/auth/login/index";

describe("Login View (TampilanLogin)", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      pathname: "/auth/login",
      push: mockPush,
      replace: jest.fn(),
      query: {},
      asPath: "/auth/login",
      events: { on: jest.fn(), off: jest.fn(), emit: jest.fn() },
    });
  });

  it("renders the login form", () => {
    render(<TampilanLogin />);
    expect(screen.getByText("Masuk Ke Akun")).toBeInTheDocument();
    expect(screen.getByText("Masuk ke halaman Dashboard")).toBeInTheDocument();
  });

  it("renders email and password inputs", () => {
    render(<TampilanLogin />);
    expect(screen.getByPlaceholderText("nama@email.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
  });

  it("renders the submit button", () => {
    render(<TampilanLogin />);
    expect(screen.getByText("Masuk & Simpan")).toBeInTheDocument();
  });

  it("renders appname section", () => {
    render(<TampilanLogin />);
    expect(screen.getByText("Rain Guard")).toBeInTheDocument();
  });

  it("updates email input value", () => {
    render(<TampilanLogin />);
    const emailInput = screen.getByPlaceholderText("nama@email.com");
    fireEvent.change(emailInput, { target: { value: "test@email.com" } });
    expect(emailInput).toHaveValue("test@email.com");
  });

  it("updates password input value", () => {
    render(<TampilanLogin />);
    const passwordInput = screen.getByPlaceholderText("••••••••");
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    expect(passwordInput).toHaveValue("password123");
  });

  it("calls signIn on form submit", async () => {
    (signIn as jest.Mock).mockResolvedValue({ error: null });
    render(<TampilanLogin />);

    fireEvent.change(screen.getByPlaceholderText("nama@email.com"), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "pass123" },
    });

    fireEvent.submit(screen.getByText("Masuk & Simpan").closest("form")!);

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith("credentials", {
        redirect: false,
        nama: "",
        email: "test@test.com",
        password: "pass123",
      });
    });
  });

  it("redirects to dashboard on successful login", async () => {
    (signIn as jest.Mock).mockResolvedValue({ error: null });
    render(<TampilanLogin />);

    fireEvent.change(screen.getByPlaceholderText("nama@email.com"), {
      target: { value: "test@test.com" },
    });
    fireEvent.submit(screen.getByText("Masuk & Simpan").closest("form")!);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("shows alert on login failure", async () => {
    (signIn as jest.Mock).mockResolvedValue({ error: "Invalid credentials" });
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
    render(<TampilanLogin />);

    fireEvent.submit(screen.getByText("Masuk & Simpan").closest("form")!);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith("Login gagal!");
    });

    alertSpy.mockRestore();
  });
});
