import { render, screen } from "@testing-library/react";
import IndexPage from "@/pages/index";

describe("Index Page (/)", () => {
  it("renders the guest dashboard view", () => {
    render(<IndexPage />);
    expect(screen.getByText("Tren Ketinggian Air (Distance)")).toBeInTheDocument();
  });

  it("renders the graph placeholder text", () => {
    render(<IndexPage />);
    expect(screen.getByText("Grafik Monitoring Real-time")).toBeInTheDocument();
  });
});
