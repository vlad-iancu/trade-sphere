import { auth } from "@/auth"
import { Session } from "next-auth"
import { redirect } from "next/navigation"
import React, { Children } from "react"

export default async function SignIn(): Promise<Session> {
    const session = await auth()
    if(!session) {
        redirect("/login")
    }
    return session
}