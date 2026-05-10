import { render, screen } from "@testing-library/react";
import AceUIAppname from "@/component/aestetic/AceUIAppname";

describe("AceUIAppname", () => {
  it("renders the appname and description", () => {
    render(
      <AceUIAppname appname="Rain Guard" description="Aplikasi pemantau hujan" />
    );

    expect(screen.getByText("Rain Guard")).toBeInTheDocument();
    expect(screen.getByText("Aplikasi pemantau hujan")).toBeInTheDocument();
  });

  it("renders an h1 element with the appname", () => {
    render(
      <AceUIAppname appname="Test App" description="Deskripsi test" />
    );

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Test App");
  });

  it("renders a paragraph with the description", () => {
    render(
      <AceUIAppname appname="App" description="Ini deskripsi" />
    );

    const paragraph = screen.getByText("Ini deskripsi");
    expect(paragraph.tagName).toBe("P");
  });
});
