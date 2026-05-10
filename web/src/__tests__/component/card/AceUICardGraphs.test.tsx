import { render, screen } from "@testing-library/react";
import AceUICardGraphs from "@/component/card/AceUICardGraphs";

describe("AceUICardGraphs", () => {
  const mockData = [
    { time: "10:00", tinggiAir: 25 },
    { time: "10:05", tinggiAir: 30 },
    { time: "10:10", tinggiAir: 28 },
  ];

  it("renders the graph title", () => {
    render(
      <AceUICardGraphs
        data={mockData}
        start={0}
        end={500}
        dataKey="tinggiAir"
        titlelegend="Distance (cm)"
        title="Grafik Monitoring Jarak Air"
      />
    );

    expect(screen.getByText("Grafik Monitoring Jarak Air")).toBeInTheDocument();
  });

  it("renders the chart container", () => {
    render(
      <AceUICardGraphs
        data={mockData}
        start={0}
        end={500}
        dataKey="tinggiAir"
        titlelegend="Distance (cm)"
        title="Grafik Test"
      />
    );

    expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
  });

  it("renders with empty data", () => {
    render(
      <AceUICardGraphs
        data={[]}
        start={0}
        end={100}
        dataKey="tinggiAir"
        titlelegend="Legend"
        title="Empty Graph"
      />
    );

    expect(screen.getByText("Empty Graph")).toBeInTheDocument();
  });
});
