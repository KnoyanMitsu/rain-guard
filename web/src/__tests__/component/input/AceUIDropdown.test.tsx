import { render, screen, fireEvent } from "@testing-library/react";
import AceUIDropdown from "@/component/input/AceUIDropdown";

describe("AceUIDropdown", () => {
  const actions = [
    { title: "Option 1", onClick: jest.fn() },
    { title: "Option 2", onClick: jest.fn() },
  ];

  it("renders the title", () => {
    render(<AceUIDropdown title="Select" actions={actions} />);
    expect(screen.getByText("Select")).toBeInTheDocument();
  });

  it("does not show options by default", () => {
    render(<AceUIDropdown title="Select" actions={actions} />);
    expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
  });

  it("shows options when clicked", () => {
    render(<AceUIDropdown title="Select" actions={actions} />);
    fireEvent.click(screen.getByText("Select"));
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
  });

  it("calls action onClick and closes menu", () => {
    render(<AceUIDropdown title="Select" actions={actions} />);
    fireEvent.click(screen.getByText("Select"));
    fireEvent.click(screen.getByText("Option 1"));
    expect(actions[0].onClick).toHaveBeenCalled();
    expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
  });

  it("closes on outside click", () => {
    render(
      <div>
        <AceUIDropdown title="Select" actions={actions} />
        <button>Outside</button>
      </div>
    );
    fireEvent.click(screen.getByText("Select"));
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    fireEvent.mouseDown(screen.getByText("Outside"));
    expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
  });
});
