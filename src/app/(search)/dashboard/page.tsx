import SignedIn from "../../components/SignedIn";

// import { logout } from "@/actions/logout"
// import { uploadProfilePhoto } from "@/actions/uploadProfilePhoto"
// import { useSession } from "next-auth/react"
// import { redirect } from "next/navigation"

// //import styles from "@/styles/profile.module.scss"

// import { useEffect, useState } from "react"
// import { Camera } from "lucide-react"
// import { auth } from "@/auth"
// import { get } from "http"
// import { getPictureUrlForUser } from "@/data/user"
// import { getUser } from "@/actions/getUser"

export default async function Dashboard() {
    const session = await SignedIn();
    const balance = 0
    return (
        <>
            <span>User Balance is {balance}</span>
        </>
    );
}
