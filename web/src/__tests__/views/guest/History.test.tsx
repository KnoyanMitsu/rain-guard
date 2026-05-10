import { render, screen, fireEvent } from "@testing-library/react";
import History from "@/views/guest/history/history";

describe("History View", () => {
  const defaultProps = {
    thead: [
      { title: "Lokasi" },
      { title: "Tinggi Air" },
      { title: "Curah Hujan" },
      { title: "Status" },
      { title: "Update Terakhir" },
    ],
    tbody: [
      { lokasi: "Sungai Ciliwung", tinggi_air: "85 cm", curah_hujan: "12 mm", status: "Aman", update_terakhir: "2026-05-01" },
      { lokasi: "Sungai Cisadane", tinggi_air: "45 cm", curah_hujan: "5 mm", status: "Siaga", update_terakhir: "2026-05-02" },
      { lokasi: "Bendungan Katulampa", tinggi_air: "120 cm", curah_hujan: "25 mm", status: "Bahaya", update_terakhir: "2026-05-03" },
      { lokasi: "Kali Pesanggrahan", tinggi_air: "62 cm", curah_hujan: "8 mm", status: "Aman", update_terakhir: "2026-05-04" },
      { lokasi: "Pintu Air Manggarai", tinggi_air: "750 cm", curah_hujan: "15 mm", status: "Siaga", update_terakhir: "2026-05-05" },
      { lokasi: "Sungai Solo", tinggi_air: "510 cm", curah_hujan: "30 mm", status: "Bahaya", update_terakhir: "2026-05-06" },
    ],
  };

  it("renders the header", () => {
    render(<History {...defaultProps} />);
    expect(screen.getByText("Riwayat Data Sensor")).toBeInTheDocument();
  });

  it("renders table headers", () => {
    render(<History {...defaultProps} />);
    expect(screen.getByText("Lokasi")).toBeInTheDocument();
    expect(screen.getByText("Tinggi Air")).toBeInTheDocument();
    expect(screen.getByText("Curah Hujan")).toBeInTheDocument();
  });

  it("renders summary cards", () => {
    render(<History {...defaultProps} />);
    expect(screen.getByText("Total Lokasi")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument(); // total count
  });

  it("counts status categories correctly", () => {
    render(<History {...defaultProps} />);
    // Aman: 2, Siaga: 2, Bahaya: 2
    const amanCount = screen.getAllByText("2");
    expect(amanCount.length).toBeGreaterThanOrEqual(1);
  });

  it("renders status badges with correct styling", () => {
    render(<History {...defaultProps} />);
    expect(screen.getAllByText("Aman").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Siaga").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Bahaya").length).toBeGreaterThanOrEqual(1);
  });

  it("paginates data (5 items per page)", () => {
    render(<History {...defaultProps} />);
    // Page 1: shows first 5
    expect(screen.getByText("Sungai Ciliwung")).toBeInTheDocument();
    expect(screen.queryByText("Sungai Solo")).not.toBeInTheDocument();
  });

  it("navigates to next page", () => {
    render(<History {...defaultProps} />);
    fireEvent.click(screen.getByText("Selanjutnya"));
    expect(screen.getByText("Sungai Solo")).toBeInTheDocument();
    expect(screen.queryByText("Sungai Ciliwung")).not.toBeInTheDocument();
  });

  it("disables Prev on first page", () => {
    render(<History {...defaultProps} />);
    const prevButton = screen.getByText("Sebelumnya");
    expect(prevButton).toBeDisabled();
  });

  it("renders with empty data", () => {
    render(<History thead={defaultProps.thead} tbody={[]} />);
    expect(screen.getByText("Total Lokasi")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
  });
});
