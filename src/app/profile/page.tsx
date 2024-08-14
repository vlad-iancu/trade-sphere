//Create a server component that will display some text

import { logout } from "@/actions/logout"
import { uploadProfilePhoto } from "@/actions/uploadProfilePhoto"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"

//import styles from "@/styles/profile.module.scss"

import { useEffect, useState } from "react"
import { Camera, Pencil } from "lucide-react"
import ProfilePicture from "./ProfilePicture"
import { auth } from "@/auth"
import { get } from "http"
import { getNameForUser, getPictureUrlForUser } from "@/data/user"
import Link from "next/link"
import { getUser } from "@/actions/getUser"
import styles from "@/styles/Profile.module.scss"

const sampleImgUrl = "https://cdn.pixabay.com/photo/2017/08/06/21/01/louvre-2596278_960_720.jpg"

export default async function Profile() {
    // const { data: session, status } = useSession()
    // if (status === "unauthenticated") {
    //     redirect("/login")
    // }
    // if (!(session?.user)) {
    // }
    // const [imgSrc, setImgSrc] = useState("")
    // useEffect(() => {
    //     setImgSrc(session?.auth0Picture ?? "")
    // },[session])
    const session = await auth()
    if (!session?.user) {
        redirect("/login")
    }
    const profileUrl = await getPictureUrlForUser(session.auth0Id)
    const username = (await getUser()).name
    return (
        <div>
            <ProfilePicture imgUrl={profileUrl} />
            <div className={styles["edit-name"]}>
                <div className={styles["edit-name-label"]}>
                    <Link href="/profile/editName" >{username}</Link>
                    <Pencil className={styles["icon"]} />
                </div>
                <div className={styles["underline"]} />
            </div>
        </div>
    )
}   