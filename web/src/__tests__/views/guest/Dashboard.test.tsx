import { render, screen } from "@testing-library/react";
import Dashboard from "@/views/guest/dashboard/Dashboard";

describe("Guest Dashboard View", () => {
  const defaultProps = {
    thead: [
      { title: "Tinggi Air" },
      { title: "Curah Hujan" },
      { title: "Status" },
      { title: "Update Terakhir" },
    ],
    tbody: [
      { tinggi_air: "85 cm", curah_hujan: "12 mm", status: "Aman", update_terakhir: "2026-05-01" },
      { tinggi_air: "120 cm", curah_hujan: "25 mm", status: "Bahaya", update_terakhir: "2026-05-02" },
    ],
    graph: [
      { time: "10:00", tinggiAir: 85 },
      { time: "10:05", tinggiAir: 120 },
    ],
  };

  it("renders the graph section title", () => {
    render(<Dashboard {...defaultProps} />);
    expect(screen.getByText("Tren Ketinggian Air")).toBeInTheDocument();
  });

  it("renders table headers", () => {
    render(<Dashboard {...defaultProps} />);
    expect(screen.getByText("Tinggi Air")).toBeInTheDocument();
    expect(screen.getByText("Curah Hujan")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Update Terakhir")).toBeInTheDocument();
  });

  it("renders table row data", () => {
    render(<Dashboard {...defaultProps} />);
    expect(screen.getByText("85 cm")).toBeInTheDocument();
    expect(screen.getByText("12 mm")).toBeInTheDocument();
  });

  it("renders status badges", () => {
    render(<Dashboard {...defaultProps} />);
    expect(screen.getByText("Aman")).toBeInTheDocument();
    expect(screen.getByText("Bahaya")).toBeInTheDocument();
  });

  it("renders graph placeholder text", () => {
    render(<Dashboard {...defaultProps} />);
    expect(screen.getByText("Grafik Monitoring Ketinggian Air")).toBeInTheDocument();
  });

  it("renders with empty tbody", () => {
    render(<Dashboard thead={defaultProps.thead} tbody={[]} graph={[]} />);
    expect(screen.getByText("Tren Ketinggian Air")).toBeInTheDocument();
  });
});
