"use server";
import { signOut } from "@/auth";
//Replace localhost with an environment agnostic value
const uriEncodedReturnTo = encodeURIComponent(
    process.env.APPLICATION_URL ?? ""
);
const auth0LogoutUrl = `${process.env.AUTH_AUTH0_ISSUER}/v2/logout?client_id=${process.env.AUTH_AUTH0_ID}&returnTo=${uriEncodedReturnTo}`;

export async function logout() {
    await signOut({ redirectTo: auth0LogoutUrl });
}
