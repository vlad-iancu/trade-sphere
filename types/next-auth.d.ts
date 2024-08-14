import NextAuth, { type DefaultSession, type DefaultUser } from "next-auth"

declare module "next-auth" {
  interface Session {
    auth0Id: string, auth0Picture: string, auth0Username: string & DefaultSession["user"]
  }

  // interface User {
  //   auth0Id: string & DefaultUser
  // }
}