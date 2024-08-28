//Create a Next js server component named Login
import { redirect } from "next/navigation";
import { auth, signIn } from "@/auth";
import { AuthError } from "next-auth";
import logo from "@/assets/logo.svg";
import { Fragment } from "react";
import styles from "@/styles/login.module.scss";
import Image from "next/image";

export default async function Login({
    searchParams,
}: {
    params: { slug: string };
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const callbackUrl = searchParams.callbackUrl as string | undefined;
    const session = await auth();
    const defaultPage = "/dashboard";
    if (session?.user) {
        //Always redirected to login despite being signed in
        redirect(callbackUrl ?? defaultPage);
    }
    return (
        <Fragment>
            <Image src={logo.src} className={styles.logo} alt="logo" />
            <div className={styles.container}>
                <h1 className={styles.header}>Login</h1>
                <h2 className={styles.subheader}>Sign in to your account</h2>
                <form
                    action={async () => {
                        "use server";
                        try {
                            await signIn("auth0", {
                                redirectTo: callbackUrl ?? defaultPage,
                            });
                        } catch (error) {
                            if (error instanceof AuthError) {
                                return redirect(callbackUrl ?? defaultPage);
                            }
                            throw error;
                        }
                    }}
                >
                    <button className={styles.login} type="submit">
                        Sign in with Auth0
                    </button>
                </form>
            </div>
        </Fragment>
    );
}
