import "@testing-library/jest-dom";
import React from "react";

// Helper: creates a React element without JSX syntax (avoids SWC parse error in .ts files)
const h = React.createElement;

// Mock next/router
jest.mock("next/router", () => ({
  useRouter: jest.fn(() => ({
    pathname: "/",
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    query: {},
    asPath: "/",
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
  })),
}));

// Mock next/link
jest.mock("next/link", () => {
  return ({ children, href, ...rest }: any) => {
    return h("a", { href, ...rest }, children);
  };
});

// Mock next-auth/react
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(() => ({
    data: {
      user: {
        fullname: "Test User",
        email: "test@example.com",
      },
    },
    status: "authenticated",
  })),
  signIn: jest.fn(),
  signOut: jest.fn(),
  SessionProvider: ({ children }: any) => children,
}));

// Mock recharts to avoid canvas errors in tests
jest.mock("recharts", () => {
  const OriginalModule = jest.requireActual("recharts");
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: any) =>
      h("div", { "data-testid": "responsive-container" }, children),
    AreaChart: ({ children }: any) =>
      h("div", { "data-testid": "area-chart" }, children),
    Area: () => h("div", { "data-testid": "area" }),
    XAxis: () => h("div", { "data-testid": "x-axis" }),
    YAxis: () => h("div", { "data-testid": "y-axis" }),
    CartesianGrid: () => h("div", { "data-testid": "cartesian-grid" }),
    Tooltip: () => h("div", { "data-testid": "tooltip" }),
  };
});

// Mock @json2csv/plainjs
jest.mock("@json2csv/plainjs", () => ({
  Parser: jest.fn().mockImplementation(() => ({
    parse: jest.fn(() => "col1,col2\nval1,val2"),
  })),
}));

// Mock lucide-react icons
jest.mock("lucide-react", () => ({
  Bell: (props: any) => h("svg", { "data-testid": "icon-bell", ...props }),
  Cloud: (props: any) => h("svg", { "data-testid": "icon-cloud", ...props }),
  CloudRain: (props: any) => h("svg", { "data-testid": "icon-cloud-rain", ...props }),
  Droplets: (props: any) => h("svg", { "data-testid": "icon-droplets", ...props }),
  ArrowRight: (props: any) => h("svg", { "data-testid": "icon-arrow-right", ...props }),
  Menu: (props: any) => h("svg", { "data-testid": "icon-menu", ...props }),
  LogOut: (props: any) => h("svg", { "data-testid": "icon-logout", ...props }),
  ChevronDown: (props: any) => h("svg", { "data-testid": "icon-chevron-down", ...props }),
}));

// Mock firebase
jest.mock("@/utils/db/firebase", () => ({
  __esModule: true,
  default: {},
}));

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  onSnapshot: jest.fn(),
  serverTimestamp: jest.fn(),
  Timestamp: {
    fromDate: jest.fn(),
  },
  getFirestore: jest.fn(),
}));

jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(),
  getApp: jest.fn(),
  getApps: jest.fn(() => []),
}));

// Mock WebSocket
class MockWebSocket {
  url: string;
  onopen: ((ev: Event) => any) | null = null;
  onclose: ((ev: CloseEvent) => any) | null = null;
  onerror: ((ev: Event) => any) | null = null;
  onmessage: ((ev: MessageEvent) => any) | null = null;

  constructor(url: string) {
    this.url = url;
  }

  close() {}
  send() {}
}

(global as any).WebSocket = MockWebSocket;

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => "blob:http://localhost/test-blob");
global.URL.revokeObjectURL = jest.fn();
