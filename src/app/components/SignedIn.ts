import { auth } from "@/auth";
import { Session } from "next-auth";
import { redirect } from "next/navigation";

export default async function SignIn(): Promise<Session> {
    let session: Session | null;
    try {
        session = await auth();
    } catch (e) {
        redirect("/login");
    }
    if (!session) {
        redirect("/login");
    }
    return session;
}
