import saveJson from "@/pages/dashboard/saveCSV/index";
import { Parser } from "@json2csv/plainjs";

describe("saveJson (saveCSV)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns null when data is undefined", () => {
    const result = saveJson({});
    expect(result).toBeNull();
  });

  it("returns null when data is not an array", () => {
    const result = saveJson({ data: "not-array" as any });
    expect(result).toBeNull();
  });

  it("returns null when called with no arguments", () => {
    const result = saveJson();
    expect(result).toBeNull();
  });

  it("creates a download link when data is valid", () => {
    const appendChildSpy = jest.spyOn(document.body, "appendChild").mockImplementation((node) => node);
    const removeChildSpy = jest.spyOn(document.body, "removeChild").mockImplementation((node) => node);

    const mockData = [
      { name: "Test", value: 1 },
      { name: "Test2", value: 2 },
    ];

    saveJson({ data: mockData, fileName: "test.csv" });

    expect(appendChildSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();

    appendChildSpy.mockRestore();
    removeChildSpy.mockRestore();
  });

  it("uses default fileName when not provided", () => {
    const appendChildSpy = jest.spyOn(document.body, "appendChild").mockImplementation((node) => node);
    const removeChildSpy = jest.spyOn(document.body, "removeChild").mockImplementation((node) => node);

    saveJson({ data: [{ a: 1 }] });

    const link = appendChildSpy.mock.calls[0]?.[0] as HTMLAnchorElement;
    expect(link.getAttribute("download")).toBe("data.csv");

    appendChildSpy.mockRestore();
    removeChildSpy.mockRestore();
  });

  it("sets correct download filename", () => {
    const appendChildSpy = jest.spyOn(document.body, "appendChild").mockImplementation((node) => node);
    const removeChildSpy = jest.spyOn(document.body, "removeChild").mockImplementation((node) => node);

    saveJson({ data: [{ a: 1 }], fileName: "custom.csv" });

    const link = appendChildSpy.mock.calls[0]?.[0] as HTMLAnchorElement;
    expect(link.getAttribute("download")).toBe("custom.csv");

    appendChildSpy.mockRestore();
    removeChildSpy.mockRestore();
  });

  it("returns null on parser error", () => {
    (Parser as jest.Mock).mockImplementationOnce(() => ({
      parse: jest.fn(() => { throw new Error("Parse error"); }),
    }));

    const result = saveJson({ data: [{ a: 1 }] });
    expect(result).toBeNull();
  });
});
