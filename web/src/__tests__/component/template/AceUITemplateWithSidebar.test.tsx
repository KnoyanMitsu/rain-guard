import { render, screen, fireEvent } from "@testing-library/react";
import AceUITemplateWithSidebar from "@/component/template/AceUITemplateWithSidebar";

describe("AceUITemplateWithSidebar", () => {
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
      <AceUITemplateWithSidebar {...defaultProps}>
        <p>Content</p>
      </AceUITemplateWithSidebar>
    );
    expect(screen.getAllByText("Rain Guard").length).toBeGreaterThanOrEqual(1);
  });

  it("renders menu items", () => {
    render(
      <AceUITemplateWithSidebar {...defaultProps}>
        <p>Content</p>
      </AceUITemplateWithSidebar>
    );
    expect(screen.getAllByText("Dashboard").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("History").length).toBeGreaterThanOrEqual(1);
  });

  it("renders children content", () => {
    render(
      <AceUITemplateWithSidebar {...defaultProps}>
        <p>Main Content</p>
      </AceUITemplateWithSidebar>
    );
    expect(screen.getByText("Main Content")).toBeInTheDocument();
  });

  it("renders account info when account is true", () => {
    render(
      <AceUITemplateWithSidebar {...defaultProps}>
        <p>Content</p>
      </AceUITemplateWithSidebar>
    );
    expect(screen.getAllByText("Admin").length).toBeGreaterThanOrEqual(1);
  });

  it("renders header text", () => {
    render(
      <AceUITemplateWithSidebar {...defaultProps}>
        <p>Content</p>
      </AceUITemplateWithSidebar>
    );
    expect(screen.getAllByText("Dashboard").length).toBeGreaterThanOrEqual(1);
  });
});
