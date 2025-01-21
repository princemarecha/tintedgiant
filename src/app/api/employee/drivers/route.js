import NextAuth from "next-auth";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import connectToDatabase from "@/utils/mongo/mongoose";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  // Configure providers
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        // Connect to the database
        await connectToDatabase();

        // Use your existing User model
        const User = mongoose.model("User");

        // Find user and verify credentials
        const user = await User.findOne({ email });
        if (user && (await user.verifyPassword(password))) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
          };
        }
        return null;
      },
    }),
  ],

  // Use the MongoDB adapter with Mongoose connection
  adapter: MongoDBAdapter(
    connectToDatabase().then((mongoose) => mongoose.connection.getClient())
  ),

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async session({ session, token }) {
      session.userId = token.id;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
});
