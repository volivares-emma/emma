import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";
import bcrypt from "bcryptjs";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt" as const,
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret : process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Usuario o Email", type: "text" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("MISSING_FIELDS");
        }

        // Buscar usuario por username o email
        const user = await prisma.tbl_users.findFirst({
          where: {
            OR: [
              { username: credentials.username },
              { email: credentials.username }
            ]
          },
        });

        if (!user) {
          throw new Error("USER_NOT_FOUND");
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!passwordMatch) {
          throw new Error("INVALID_PASSWORD");
        }

        if (!user.is_active) {
          throw new Error("ACCOUNT_DISABLED");
        }

        return { 
          id: String(user.id), 
          name: user.username, 
          email: user.email,
          role: user.role as 'admin' | 'editor' | 'guest' | 'reader'
        };
      },
    }),
  ],
  logger: {
    error(code: string, metadata: any) {
      // Registrar errores personalizados de autenticación
      if (["MISSING_FIELDS", "USER_NOT_FOUND", "INVALID_PASSWORD", "ACCOUNT_DISABLED"].includes(code)) {
        console.log(`[Auth Error] ${code}:`, metadata);
        return;
      }
      // Suprimir CredentialsSignin genérico
      if (code === "CredentialsSignin") {
        return;
      }
      // Registrar otros errores
      console.error(`[Auth Error] ${code}:`, metadata);
    },
    warn(message: string) {
      console.warn(`[Auth Warning] ${message}`);
    },
    debug(message: string) {
      console.debug(`[Auth Debug] ${message}`);
    },
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // Si viene de una URL específica, respétala
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (url.startsWith(baseUrl)) return url;
      
      // Redirección por defecto a la página principal
      return baseUrl;
    },
    async signIn({ user }: { user: any }) {
      // Permitir el login para todos los roles
      return true;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
