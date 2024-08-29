"use client";
import Modal from "@/app/components/Modal";
import { updateUserName } from "@/actions/user/updateUserName";
import React, { useEffect, useState } from "react";
import styles from "@/styles/EditName.module.scss";
import { getUser } from "@/actions/user/getUser";
import { useRouter } from "next/navigation";

export default function EditName() {
    const router = useRouter();
    const [username, setUserName] = React.useState<string | null>(null);
    const [updateUserCallback, setUpdateUserCallback] = useState(() =>
        updateUserName.bind(null, "")
    );
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
        const res = getUser();
        res.then((data) => {
            setUserName(data.name);
            setUpdateUserCallback(() => updateUserName.bind(null, data.name));
        });
    }, []);
    // if (!session) {
    //     console.log("Redirecting to login from EditName")
    //     redirect("/login")
    // }
    return (
        <Modal
            title="Edit Name"
            onClose={async () => {
                router.back();
            }}
            className={styles["edit-name-modal"]}
            onSave={async () => {
                await updateUserCallback();
                router.back();
                window.location.reload();
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
                        setUserName(event.target.value);
                        setUpdateUserCallback(() =>
                            updateUserName.bind(null, event.target.value)
                        );
                    }}
                    className={styles["username-text"]}
                />
            </form>
        </Modal>
    );
}
