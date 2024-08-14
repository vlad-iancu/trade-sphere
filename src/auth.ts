import { profile } from "console"
import { request } from "http"
import NextAuth from "next-auth"
import { AdapterUser } from "next-auth/adapters"
import { JWT } from "next-auth/jwt"
//import Auth0 from "next-auth/providers/auth0"
import Auth0, { Auth0Profile } from "next-auth/providers/auth0"
import netsuite from "next-auth/providers/netsuite"
import { NextResponse } from "next/server"
import { setDbUser, setNameForUser, setPictureUrlForUser } from "./data/user"
import { getUserMetadata } from "./actions/mgmt_api"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Auth0({
      // clientId: process.env.AUTH_AUTH0_ID,
      // clientSecret: process.env.AUTH_AUTH0_SECRET,
      // issuer : process.env.AUTH_AUTH0_ISSUER,
      profile(profile) {

        // console.log("profile picture: " + profile.picture)
        // console.log(`Is profile.user_metadata null? ${profile.user_metadata === null}`)
        // console.log(`Is metadata null? ${metadata === null}`)
        // console.log(`Metadata: ${profile.user_metadata}`)
        // const username = metadata.username
        return {
          ...profile,
          auth0Id: profile.sub,
          auth0Picture: profile.picture,
          //auth0Name: username 
        }
        // return {
        //   id: profile.sub,
        //   name: profile.name,
        //   email: profile.email,
        //   image: profile.picture,
        //   auth0Id: profile.sub
        // }
      }
    }),
  ],
  pages: {
    signIn: "/login",
    // signOut: "/login",
    // error: "/login",
    // verifyRequest: "/login",
    // newUser: "/login",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      // Allow redirects to external websites
      return url
    },
    authorized({ auth, request: { nextUrl, url } }) {
      const protectedRoutes = ["/profile", "/dashboard"]
      const isLoggedIn = !!auth?.user
      const isProtected = protectedRoutes.reduce((acc: boolean, route: string) => {
        return acc || nextUrl?.pathname.startsWith(route)
      }, false)
      if (isProtected) {
        if (isLoggedIn)
          return true
        return false
      }
      else {
        return true
      }
    },
    async jwt({ token, account, user, profile }) {

      // Add the fields of auth0Id and auth0Picture to the token
      //token = {...token, auth0Id: profile?.auth0Id, auth0Picture: profile?.auth0Picture}
      if (account) {
        if (profile) {
          //await setPictureUrlForUser(profile.sub ?? "", profile.picture)
          const metadata: any = await getUserMetadata(profile.sub ?? "")
          //console.log(`metadata username is ${metadata.username}`)
          await setNameForUser(profile.sub ?? "", metadata.username)
          await setDbUser(profile.sub ?? "", metadata.username, profile.picture)
          token = {...token, auth0Username: metadata.username}
          // await setNameForUser(profile.sub ?? "", profile.auth0Name as string)
        }
        //Set the photo url to the one contained in profile
      }
      if (profile) {
        token = { ...token, auth0Id: profile.sub, auth0Picture: profile.picture }
      }
      return token
    },
    // if(account) {
    //   token = {...token, access_token: account.access_token, exp: account.expires_at, refresh_token: account.refresh_token}
    //   if(user) {
    //     return {...token, auth0Id: profile?.sub, auth0Picture: profile?.picture}
    //   }
    //   return token
    // }
    // else {
    //   if(token.)
    //   if(user) {
    //     return {...token, auth0Id: profile?.sub, auth0Picture: profile?.picture}
    //   }
    // }
    session({ session, token }) {
      // console.log(`token email: ${token.email}`)
      // console.log(`token name: ${token.name}`)
      // console.log(`token sub ${token.sub}`)
      // console.log(`token iat ${token.iat}`)
      // //print token jti
      // console.log(`token jti ${token.jti}`)
      // //print token exp
      // console.log(`token exp ${token.exp}`)

      //session.userId = token.sub ?? ""

      return { ...session, auth0Id: token.auth0Id, auth0Picture: token.auth0Picture, auth0Username: token.auth0Username }
    },

  }
})
