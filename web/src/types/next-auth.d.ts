import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    fullname?: string;
  }

  interface Session {
    user: {
      fullname?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    fullname?: string;
  }
}
