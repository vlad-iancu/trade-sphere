"use client"
//import { auth } from "@/auth";
import { getPictureUrlForUser } from "@/data/user";
import styles from "@/styles/UserPhoto.module.scss";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

type UserPhotoProps = React.ImgHTMLAttributes<HTMLImageElement>;
export default function UserPhoto(props: UserPhotoProps) {
    const {data: session} = useSession();
    // if (!session?.user) {
    //     return null;
    // }
    
    //const imgUrl = await getPictureUrlForUser(id);
    const [imgUrl, setImgUrl] = useState<string>("");
    useEffect(() => {
        getPictureUrlForUser(session?.auth0Id ?? "").then((url) => {
            console.log(`Url is ${url}`);
            setImgUrl(url);
        });
    },[session])
    return (
        <img src={imgUrl} className={styles.photo} {...props} />
    );
}