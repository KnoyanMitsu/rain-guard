import { render, screen, fireEvent } from "@testing-library/react";
import AceUITemplateWithNavbar from "@/component/template/AceUITemplateWithNavbar";

describe("AceUITemplateWithNavbar", () => {
  const defaultProps = {
    appname: "Rain Guard",
    logoutfunc: jest.fn(),
    listMenu: [
      { title: "Dashboard", link: "/dashboard/" },
      { title: "History", link: "/history" },
    ],
    account: true,
    accountName: "Admin",
    accountImage: "https://example.com/avatar.png",
    accountRole: "Admin",
    header: "Dashboard",
  };

  it("renders appname", () => {
    render(
      <AceUITemplateWithNavbar {...defaultProps}>
        <p>Content</p>
      </AceUITemplateWithNavbar>
    );
    expect(screen.getAllByText("Rain Guard").length).toBeGreaterThanOrEqual(1);
  });

  it("renders children content", () => {
    render(
      <AceUITemplateWithNavbar {...defaultProps}>
        <p>Navbar Content</p>
      </AceUITemplateWithNavbar>
    );
    expect(screen.getByText("Navbar Content")).toBeInTheDocument();
  });

  it("renders menu items as links", () => {
    render(
      <AceUITemplateWithNavbar {...defaultProps}>
        <p>Content</p>
      </AceUITemplateWithNavbar>
    );
    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThanOrEqual(2);
  });

  it("renders header text", () => {
    render(
      <AceUITemplateWithNavbar {...defaultProps}>
        <p>Content</p>
      </AceUITemplateWithNavbar>
    );
    expect(screen.getAllByText("Dashboard").length).toBeGreaterThanOrEqual(1);
  });
});
