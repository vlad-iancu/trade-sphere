//"use client"
//import { auth } from "@/auth";
import { getPictureUrlForUser } from "@/data/user";
import styles from "@/styles/UserPhoto.module.scss";
import SignedIn from "./SignedIn";
import Image, { ImageProps } from "next/image";

type UserPhotoProps = ImageProps;
export default async function UserPhoto(props: UserPhotoProps) {
    const session = await SignedIn();
    //const imgUrl = await getPictureUrlForUser(id);
    //const [imgUrl, setImgUrl] = useState<string>("");
    const imgUrl = await getPictureUrlForUser(session.auth0Id ?? "");
    const copyProps = structuredClone(props);
    copyProps.src = imgUrl;
    return <Image className={styles.photo} {...copyProps} />;
}
