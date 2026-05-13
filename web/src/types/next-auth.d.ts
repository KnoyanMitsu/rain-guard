import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    name?: string;
    fullname?: string;
    nama?: string;
  }

  interface Session {
    user: {
      name?: string;
      fullname?: string;
      nama?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    name?: string;
    fullname?: string;
    nama?: string;
  }
}
