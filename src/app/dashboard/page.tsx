"use client"

import { getUser } from "@/actions/getUser"

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
const sampleImgUrl = "https://cdn.pixabay.com/photo/2017/08/06/21/01/louvre-2596278_960_720.jpg"

export default function Profile() {

    return (
        <button onClick={async () => {
            const user = await getUser()
            console.log(`User is ${user}`)
        }}>Click me for Server action</button>
    )
}  