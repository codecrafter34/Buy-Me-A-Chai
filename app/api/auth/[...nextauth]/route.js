
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import connectDb from '@/db/connectDb';
import User from '@/models/User';
import Payment from '@/models/Payment';
 

export const authoptions =  NextAuth({
    providers: [
      // OAuth authentication providers...
      GitHubProvider({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET
      }),
      GoogleProvider({
        clientId: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET
      }),
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          username: { label: "Username", type: "text" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          if (!credentials?.username || !credentials?.password) {
            return null
          }
          await connectDb()
          const user = await User.findOne({ username: credentials.username })
          if (!user || !user.passwordHash) {
            return null
          }
          const valid = await bcrypt.compare(credentials.password, user.passwordHash)
          if (!valid) {
            return null
          }
          return {
            id: user._id.toString(),
            name: user.username,
            email: user.email,
          }
        },
      }),
    ],
    callbacks: {
      async signIn({ user, account, profile, email, credentials }) {
         if(account?.provider == "github" || account?.provider == "google") { 
          await connectDb()
          // Check if the user already exists in the database
          const currentUser =  await User.findOne({email: user.email}) 
          if(!currentUser){
            // Create a new user
             const newUser = await User.create({
              email: user.email, 
              name: user.name || user.email.split("@")[0],
              username: user.email.split("@")[0], 
              role: "user",
            })   
          } else if (!currentUser.name && user.name) {
            await User.updateOne({ email: user.email }, { name: user.name })
          } 
          return true
         }
         if (account?.provider === "credentials") {
             return true
         }
         return true; // default true
      },
      
      async session({ session, user, token }) {
        await connectDb()
        if (session?.user?.email) {
            const dbUser = await User.findOne({email: session.user.email})
            if (dbUser) {
                session.user.name = dbUser.username
                session.user.displayName = dbUser.name
                session.user.role = dbUser.role
            }
        }
        return session
      },
    } 
  })

  export { authoptions as GET, authoptions as POST}
