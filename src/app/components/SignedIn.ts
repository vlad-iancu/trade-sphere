import { auth } from "@/auth";
import { Session } from "next-auth";
import { redirect } from "next/navigation";

export default async function SignIn(): Promise<Session> {
    let session: Session | null = null;
    session = await auth();
    if (!session) {
        console.log("No session found");
        redirect("/login");
    }
    return session;
}
