"use client";
import Modal from "@/app/components/Modal";
import { updateUserName } from "@/actions/user/updateUserName"
import { redirect } from "next/navigation";
import React, { use, useCallback, useEffect, useState } from "react";
import styles from "@/styles/EditName.module.scss"
import { getNameForUser, setNameForUser } from "@/data/user";
import { auth } from "@/auth";
import { updateUserMetadata } from "@/actions/user/mgmt_api";
import { useSession } from "next-auth/react";
import { getSampleUser, getUser } from "@/actions/user/getUser";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function EditName() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [username, setUserName] = React.useState<string | null>(null)
    const [updateUserCallback, setUpdateUserCallback] = useState(() => updateUserName.bind(null, ""))
    // const fetchUserName = useCallback(async () => {
    //     //Looks like Next.js server actions cannot return a promise
    //     //Create an api route to get the name
    //     const data = await getSampleUser()
    //     console.log(`Is data null? ${data === null}`)
    //     console.log(`Is data undefined? ${data === undefined}`)
    //     setUserName(data.name)
    //     setUpdateUserCallback(() => updateUserName.bind(null, data.name))
    // }, [])

    useEffect(() => {
        //Replaice with server action
        //const res = fetch("http://localhost:3000/api/user")
        const res = getUser()
        res.then((data) => {
            setUserName(data.name)
            setUpdateUserCallback(() => updateUserName.bind(null, data.name))
        })


    }, [])
    // if (!session) {
    //     console.log("Redirecting to login from EditName")
    //     redirect("/login")
    // }
    return (
        <Modal title="Edit Name" onClose={async () => {
            router.back()
        }} className={styles["edit-name-modal"]}
            onSave={async () => {
                await updateUserCallback()
                router.back()
                window.location.reload()
            }}
            closeText="Cancel"
        >
            <p>Your name will be visible to all Tradesphere users</p>
            <form>
                <input
                    type="text"
                    name="username"
                    value={username ?? "No placeholder"}
                    onChange={(event) => {
                        setUserName(event.target.value)
                        setUpdateUserCallback(() => updateUserName.bind(null, event.target.value))
                    }}
                    className={styles["username-text"]} />
            </form>

        </Modal>
    )
}