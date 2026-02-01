import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Extiende la interfaz de `DefaultSession`.
   */
  interface Session {
    user: {
      id: string;
      role: 'admin' | 'editor' | 'guest' | 'reader';
    } & DefaultSession["user"];
  }

  /**
   * Extiende la interfaz de `DefaultUser`.
   */
  interface User extends DefaultUser {
    role: 'admin' | 'editor' | 'guest' | 'reader';
  }
}

declare module "next-auth/jwt" {
  /**
   * Extiende la interfaz de `JWT`.
   */
  interface JWT {
    id: string;
    role: 'admin' | 'editor' | 'guest' | 'reader';
    email?: string;
  }
}