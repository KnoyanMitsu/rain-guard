import { render, screen } from "@testing-library/react";
import Dashboard from "@/views/dashboard/Dashboard";

// Mock saveCSV
jest.mock("@/pages/dashboard/saveCSV", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("Dashboard View", () => {
  const defaultProps = {
    thead: [
      { title: "Distance (cm)" },
      { title: "Rain Value" },
      { title: "Status Hujan" },
      { title: "Status Buzzer" },
      { title: "Waktu" },
    ],
    tbody: [
      {
        distance: 25.5,
        rain: 100,
        status_rain: "Ya",
        buzzer: "Aktif",
        update_terakhir: "10:00:00",
      },
      {
        distance: 30.0,
        rain: 50,
        status_rain: "Tidak",
        buzzer: "Non Aktif",
        update_terakhir: "10:05:00",
      },
    ],
    graph: [
      { time: "10:00", tinggiAir: 25.5 },
      { time: "10:05", tinggiAir: 30.0 },
    ],
  };

  it("renders status cards", () => {
    render(<Dashboard {...defaultProps} />);
    expect(screen.getByText("Distance")).toBeInTheDocument();
    expect(screen.getByText("Rain Sensor")).toBeInTheDocument();
    expect(screen.getByText("Status Hujan")).toBeInTheDocument();
    expect(screen.getByText("Buzzer")).toBeInTheDocument();
  });

  it("displays latest distance value with 2 decimal places", () => {
    render(<Dashboard {...defaultProps} />);
    expect(screen.getByText("25.50")).toBeInTheDocument();
  });

  it("displays latest rain sensor value", () => {
    render(<Dashboard {...defaultProps} />);
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("displays correct rain status", () => {
    render(<Dashboard {...defaultProps} />);
    expect(screen.getByText("Ya")).toBeInTheDocument();
  });

  it("displays correct buzzer status", () => {
    render(<Dashboard {...defaultProps} />);
    expect(screen.getByText("Aktif")).toBeInTheDocument();
  });

  it("renders graph component", () => {
    render(<Dashboard {...defaultProps} />);
    expect(screen.getByText("Grafik Monitoring Jarak Air (Real-time)")).toBeInTheDocument();
  });

  it("renders history table", () => {
    render(<Dashboard {...defaultProps} />);
    expect(screen.getByText("History Pengamatan")).toBeInTheDocument();
  });

  it("handles empty tbody", () => {
    render(<Dashboard thead={defaultProps.thead} tbody={[]} graph={[]} />);
    expect(screen.getByText("Distance")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument(); // fallback value
  });

  it("handles string distance values", () => {
    const propsWithStringDistance = {
      ...defaultProps,
      tbody: [{ distance: "25 cm", rain: 100, status_rain: "Ya", buzzer: "Aktif", update_terakhir: "10:00" }],
    };
    render(<Dashboard {...propsWithStringDistance} />);
    expect(screen.getByText("25")).toBeInTheDocument();
  });
});
