import { render, screen } from "@testing-library/react";
import Dashboard from "@/views/guest/dashboard/Dashboard";

describe("Guest Dashboard View", () => {
  const defaultProps = {
    thead: [
      { title: "Distance (cm)" },
      { title: "Rain Value" },
      { title: "Status Hujan" },
      { title: "Status Buzzer" },
    ],
    tbody: [
      { distance: 25.5, rain: 100, status_rain: "Ya", buzzer: "Aktif" },
      { distance: 30.0, rain: 50, status_rain: "Tidak", buzzer: "Non Aktif" },
    ],
    graph: [
      { time: "10:00", tinggiAir: 25.5 },
      { time: "10:05", tinggiAir: 30.0 },
    ],
  };

  it("renders the graph section title", () => {
    render(<Dashboard {...defaultProps} />);
    expect(screen.getByText("Tren Ketinggian Air (Distance)")).toBeInTheDocument();
  });

  it("renders table headers", () => {
    render(<Dashboard {...defaultProps} />);
    expect(screen.getByText("Distance (cm)")).toBeInTheDocument();
    expect(screen.getByText("Rain Value")).toBeInTheDocument();
    expect(screen.getByText("Status Hujan")).toBeInTheDocument();
    expect(screen.getByText("Status Buzzer")).toBeInTheDocument();
  });

  it("renders distance with toFixed(2) for number values", () => {
    render(<Dashboard {...defaultProps} />);
    expect(screen.getByText(/25\.50/)).toBeInTheDocument();
  });

  it("renders rain status badges", () => {
    render(<Dashboard {...defaultProps} />);
    expect(screen.getByText("Ya")).toBeInTheDocument();
    expect(screen.getByText("Tidak")).toBeInTheDocument();
  });

  it("renders buzzer status badges", () => {
    render(<Dashboard {...defaultProps} />);
    expect(screen.getByText("Aktif")).toBeInTheDocument();
    expect(screen.getByText("Non Aktif")).toBeInTheDocument();
  });

  it("renders with empty tbody", () => {
    render(<Dashboard thead={defaultProps.thead} tbody={[]} graph={[]} />);
    expect(screen.getByText("Tren Ketinggian Air (Distance)")).toBeInTheDocument();
  });
});
