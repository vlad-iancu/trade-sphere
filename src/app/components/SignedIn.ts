import { auth } from "@/auth";
import { Session } from "next-auth";
import { redirect } from "next/navigation";

export default async function SignIn(): Promise<Session> {
    let session: Session | null = null;
    try {
        session = await auth();
    } finally {
        if (!session) {
            redirect("/login");
        }
    }
    return session;
}
