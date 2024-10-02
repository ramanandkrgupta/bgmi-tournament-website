import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import bcrypt from "bcryptjs";
import prisma from "../../../lib/prisma"; // Import your Prisma client instance

export default NextAuth({
  providers: [
    Providers.Credentials({
      name: "Credentials",
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (user && (await bcrypt.compare(credentials.password, user.password))) {
          return { id: user.id, email: user.email };
        }
        throw new Error("Invalid email or password");
      },
    }),
  ],
  session: {
    jwt: true,
  },
  pages: {
    signIn: "/auth/signin", // Custom sign-in page
  },
});