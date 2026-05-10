import { render, screen, fireEvent } from "@testing-library/react";
import AceUICardWithTitle from "@/component/card/AceUICardWithTitle";

describe("AceUICardWithTitle", () => {
  it("renders title and children", () => {
    render(
      <AceUICardWithTitle title="Test Title">
        <p>Child content</p>
      </AceUICardWithTitle>
    );

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Child content")).toBeInTheDocument();
  });

  it("renders button when button prop is true", () => {
    const handleClick = jest.fn();
    render(
      <AceUICardWithTitle
        title="Title"
        button={true}
        titleButton="Save"
        onClick={handleClick}
      >
        <p>Content</p>
      </AceUICardWithTitle>
    );

    const button = screen.getByText("Save");
    expect(button).toBeInTheDocument();
  });

  it("calls onClick when button is clicked", () => {
    const handleClick = jest.fn();
    render(
      <AceUICardWithTitle
        title="Title"
        button={true}
        titleButton="Save"
        onClick={handleClick}
      >
        <p>Content</p>
      </AceUICardWithTitle>
    );

    fireEvent.click(screen.getByText("Save"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not render button when button prop is false/undefined", () => {
    render(
      <AceUICardWithTitle title="Title">
        <p>Content</p>
      </AceUICardWithTitle>
    );

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders an h1 heading with title", () => {
    render(
      <AceUICardWithTitle title="My Heading">
        <p>Content</p>
      </AceUICardWithTitle>
    );

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("My Heading");
  });
});
