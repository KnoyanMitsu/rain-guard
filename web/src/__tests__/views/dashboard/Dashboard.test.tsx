import { render, screen } from "@testing-library/react";
import Dashboard from "@/views/dashboard/Dashboard";

describe("Dashboard View", () => {
  const defaultProps = {
    thead: [
      { title: "Tinggi Air" },
      { title: "Curah Hujan" },
      { title: "Status Alarm" },
      { title: "Update Terakhir" },
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
    expect(screen.getAllByText("Tinggi Air")[0]).toBeInTheDocument();
    expect(screen.getByText("Nilai Sensor Hujan")).toBeInTheDocument();
    expect(screen.getAllByText("Status Hujan")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Status Alarm")[0]).toBeInTheDocument();
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
    // "Ya" appears in status card and also in status badge as "Bahaya"
    expect(screen.getAllByText("Ya")[0]).toBeInTheDocument();
  });

  it("displays correct buzzer/alarm status", () => {
    render(<Dashboard {...defaultProps} />);
    expect(screen.getAllByText("Aktif")[0]).toBeInTheDocument();
  });

  it("renders graph component", () => {
    render(<Dashboard {...defaultProps} />);
    expect(screen.getByText("Grafik Monitoring Tinggi Air (Real-time)")).toBeInTheDocument();
  });

  it("renders history table", () => {
    render(<Dashboard {...defaultProps} />);
    expect(screen.getByText("Riwayat Pengamatan")).toBeInTheDocument();
  });

  it("handles empty tbody", () => {
    render(<Dashboard thead={defaultProps.thead} tbody={[]} graph={[]} />);
    expect(screen.getAllByText("Tinggi Air")[0]).toBeInTheDocument();
    expect(screen.getAllByText("0")[0]).toBeInTheDocument(); // fallback value
  });

  it("handles string distance values", () => {
    const propsWithStringDistance = {
      ...defaultProps,
      tbody: [{ distance: "25 cm", rain: 100, status_rain: "Ya", buzzer: "Aktif", update_terakhir: "10:00" }],
    };
    render(<Dashboard {...propsWithStringDistance} />);
    expect(screen.getAllByText("25")[0]).toBeInTheDocument();
  });

  it("renders pagination buttons", () => {
    render(<Dashboard {...defaultProps} />);
    expect(screen.getByText("Sebelumnya")).toBeInTheDocument();
    expect(screen.getByText("Selanjutnya")).toBeInTheDocument();
  });
});
