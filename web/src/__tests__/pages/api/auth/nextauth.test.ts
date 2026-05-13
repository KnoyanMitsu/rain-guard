jest.mock("next-auth", () => jest.fn((config) => config));

jest.mock("next-auth/providers/credentials", () => {
  return jest.fn(() => ({ id: "credentials" }));
});

jest.mock("@/utils/db/firebase", () => ({
  __esModule: true,
  default: {},
}));

const getDocsMock = jest.fn();
const collectionMock = jest.fn();
const queryMock = jest.fn();
const whereMock = jest.fn();

jest.mock("firebase/firestore", () => ({
  collection: (...args: any[]) => collectionMock(...args),
  getDocs: (...args: any[]) => getDocsMock(...args),
  query: (...args: any[]) => queryMock(...args),
  where: (...args: any[]) => whereMock(...args),
}));

import { validateFirebaseCredentials } from "@/pages/api/auth/[...nextauth]";

describe("validateFirebaseCredentials", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns null when email or password is missing", async () => {
    await expect(validateFirebaseCredentials("", "password123")).resolves.toBeNull();
    await expect(validateFirebaseCredentials("user@example.com", "")).resolves.toBeNull();
  });

  it("returns a user when email and password match Firestore data", async () => {
    getDocsMock.mockResolvedValue({
      docs: [
        {
          id: "abc123",
          data: () => ({
            email: "user@example.com",
            fullname: "Budi Santoso",
            password: "secret123",
          }),
        },
      ],
    });

    await expect(
      validateFirebaseCredentials("User@Example.com", "secret123")
    ).resolves.toEqual({
      id: "abc123",
      email: "user@example.com",
      name: "Budi Santoso",
      fullname: "Budi Santoso",
      nama: "Budi Santoso",
    });
  });

  it("returns null when password does not match", async () => {
    getDocsMock.mockResolvedValue({
      docs: [
        {
          id: "abc123",
          data: () => ({
            email: "user@example.com",
            password: "secret123",
          }),
        },
      ],
    });

    await expect(
      validateFirebaseCredentials("user@example.com", "wrong-password")
    ).resolves.toBeNull();
  });
});