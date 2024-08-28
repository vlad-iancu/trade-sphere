import { auth } from "@/auth";
import { Session } from "next-auth";
import { redirect } from "next/navigation";

export default async function SignIn(): Promise<Session> {
    const session = await auth();
    if (!session) {
        redirect("/login");
    }
    return session;
}
