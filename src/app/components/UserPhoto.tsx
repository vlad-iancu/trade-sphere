//"use client"
//import { auth } from "@/auth";
import { getPictureUrlForUser } from "@/data/user";
import styles from "@/styles/UserPhoto.module.scss";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import SignedIn from "./SignedIn";

type UserPhotoProps = React.ImgHTMLAttributes<HTMLImageElement>;
export default async function UserPhoto(props: UserPhotoProps) {
    const session = await SignedIn();
    
    //const imgUrl = await getPictureUrlForUser(id);
    //const [imgUrl, setImgUrl] = useState<string>("");
    const imgUrl = await getPictureUrlForUser(session.auth0Id ?? "");
    return (
        <img src={imgUrl} className={styles.photo} {...props} />
    );
}