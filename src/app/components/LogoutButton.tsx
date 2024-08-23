//"use client";
import { logout } from "@/actions/user/logout"
import { auth } from "@/auth"
import { redirect, useRouter } from "next/navigation"
import styles from "@/styles/Navbar.module.scss"
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import colors from "@/styles/colors.module.scss"

type LogoutButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { text: "Sign Out" };
export default function LogoutButton(props: LogoutButtonProps) {
    // const session = await auth()
    // if (session === null) {
    //     redirect("/login")
    // }
    // const router = useRouter()
    // const { data: session } = useSession()
    // if (!session) {
    //     router.replace("/login")
    // }

    // const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>()
    // const [isClicked, setIsClicked] = useState<boolean>(false)

    return (
        <form action={logout} className={styles.logoutForm}>
            <button
                type="submit"
                {...props}
                className={styles.logout}
                //style={isClicked ? {} : { backgroundColor: colors.darkRed }}
                // onClick={async (e) => {
                //     if (isClicked) {
                //         e.preventDefault()
                //         await logout()
                //     }
                //     else {
                //         setIsClicked(true)
                //         const timeout = setTimeout(() => {
                //             setIsClicked(false)
                //             clearTimeout(timeoutId)
                //         }, 2000)
                //         setTimeoutId(timeout)
                //         e.preventDefault()
                //     }


                // }}
            >{props.text}</button>
        </form>
    )
}