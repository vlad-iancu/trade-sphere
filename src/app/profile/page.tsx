import { Pencil } from "lucide-react";
import ProfilePicture from "./ProfilePicture";
import { getPictureUrlForUser } from "@/data/user";
import Link from "next/link";
import { getUser } from "@/actions/user/getUser";
import styles from "@/styles/Profile.module.scss";
import SignedIn from "../components/SignedIn";

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
    const session = await SignedIn();
    // if (!session?.user) {
    //     redirect("/login")
    // }
    const profileUrl = await getPictureUrlForUser(session?.auth0Id ?? "");
    const username = (await getUser()).name;
    return (
        <div>
            <ProfilePicture imgUrl={profileUrl} />
            <div className={styles["edit-name"]}>
                <div className={styles["edit-name-label"]}>
                    <Link href="/profile/editName">{username}</Link>
                    <Pencil className={styles["icon"]} />
                </div>
                <div className={styles["underline"]} />
            </div>
        </div>
    );
}
