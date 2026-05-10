import { render, screen, fireEvent } from "@testing-library/react";
import AceUICardTable from "@/component/card/AceUICardTable";

// Mock the saveCSV module
jest.mock("@/pages/dashboard/saveCSV", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("AceUICardTable", () => {
  const thead = [
    { title: "Lokasi" },
    { title: "Tinggi Air" },
    { title: "Status" },
  ];

  const tbody = [
    { id: "1", lokasi: "Sungai Ciliwung", tinggi_air: "85 cm", status: "Waspada" },
    { id: "2", lokasi: "Sungai Cisadane", tinggi_air: "45 cm", status: "Aman" },
    { id: "3", lokasi: "Bendungan Katulampa", tinggi_air: "120 cm", status: "Bahaya" },
    { id: "4", lokasi: "Kali Pesanggrahan", tinggi_air: "62 cm", status: "Aman" },
    { id: "5", lokasi: "Pintu Air Manggarai", tinggi_air: "750 cm", status: "Siaga" },
    { id: "6", lokasi: "Sungai Solo", tinggi_air: "510 cm", status: "Bahaya" },
    { id: "7", lokasi: "Kali Sunter", tinggi_air: "140 cm", status: "Aman" },
  ];

  it("renders the table title", () => {
    render(<AceUICardTable title="History" thead={thead} tbody={tbody} />);

    expect(screen.getByText("History")).toBeInTheDocument();
  });

  it("renders table headers", () => {
    render(<AceUICardTable title="History" thead={thead} tbody={tbody} />);

    expect(screen.getByText("Lokasi")).toBeInTheDocument();
    expect(screen.getByText("Tinggi Air")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("renders only 5 rows per page (default pagination)", () => {
    render(<AceUICardTable title="History" thead={thead} tbody={tbody} />);

    // Should show first 5 items
    expect(screen.getByText("Sungai Ciliwung")).toBeInTheDocument();
    expect(screen.getByText("Sungai Cisadane")).toBeInTheDocument();
    expect(screen.getByText("Bendungan Katulampa")).toBeInTheDocument();
    expect(screen.getByText("Kali Pesanggrahan")).toBeInTheDocument();
    expect(screen.getByText("Pintu Air Manggarai")).toBeInTheDocument();

    // Should NOT show 6th item
    expect(screen.queryByText("Sungai Solo")).not.toBeInTheDocument();
  });

  it("navigates to next page when Next is clicked", () => {
    render(<AceUICardTable title="History" thead={thead} tbody={tbody} />);

    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);

    // Now page 2 items should be visible
    expect(screen.getByText("Sungai Solo")).toBeInTheDocument();
    expect(screen.getByText("Kali Sunter")).toBeInTheDocument();

    // Page 1 items should be gone
    expect(screen.queryByText("Sungai Ciliwung")).not.toBeInTheDocument();
  });

  it("navigates back to prev page when Prev is clicked", () => {
    render(<AceUICardTable title="History" thead={thead} tbody={tbody} />);

    // Go to page 2
    fireEvent.click(screen.getByText("Next"));
    expect(screen.getByText("Sungai Solo")).toBeInTheDocument();

    // Go back to page 1
    fireEvent.click(screen.getByText("Prev"));
    expect(screen.getByText("Sungai Ciliwung")).toBeInTheDocument();
  });

  it("disables Prev button on first page", () => {
    render(<AceUICardTable title="History" thead={thead} tbody={tbody} />);

    const prevButton = screen.getByText("Prev");
    expect(prevButton).toBeDisabled();
  });

  it("disables Next button on last page", () => {
    render(<AceUICardTable title="History" thead={thead} tbody={tbody} />);

    // Go to last page
    fireEvent.click(screen.getByText("Next"));

    const nextButton = screen.getByText("Next");
    expect(nextButton).toBeDisabled();
  });

  it("sorts columns when header is clicked", () => {
    render(<AceUICardTable title="History" thead={thead} tbody={tbody} />);

    // Click on "Lokasi" to sort ascending
    fireEvent.click(screen.getByText("Lokasi"));

    // After ascending sort, "Bendungan Katulampa" should be first
    const rows = screen.getAllByRole("row");
    const firstDataRow = rows[1]; // skip header row
    expect(firstDataRow).toHaveTextContent("Bendungan Katulampa");
  });

  it("toggles sort direction on double-click", () => {
    render(<AceUICardTable title="History" thead={thead} tbody={tbody} />);

    const lokasiHeader = screen.getByText("Lokasi");

    // First click → ascending
    fireEvent.click(lokasiHeader);
    expect(screen.getByText("↑")).toBeInTheDocument();

    // Second click → descending
    fireEvent.click(lokasiHeader);
    expect(screen.getByText("↓")).toBeInTheDocument();
  });

  it("renders save button when buttonSave is true", () => {
    const handleSave = jest.fn();
    render(
      <AceUICardTable
        title="History"
        thead={thead}
        tbody={tbody}
        buttonSave={true}
        buttonTitle="Save as CSV"
        onClick={handleSave}
      />
    );

    expect(screen.getByText("Save as CSV")).toBeInTheDocument();
  });

  it("handles empty tbody", () => {
    render(<AceUICardTable title="History" thead={thead} tbody={[]} />);

    expect(screen.getByText("History")).toBeInTheDocument();
    // No rows besides header
    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(1); // Only header row
  });

  it("can navigate to a specific page", () => {
    render(<AceUICardTable title="History" thead={thead} tbody={tbody} />);

    // Click page 2 button
    fireEvent.click(screen.getByText("2"));
    expect(screen.getByText("Sungai Solo")).toBeInTheDocument();
  });
});
