"use client";
import { useState } from "react";
import { Camera } from "lucide-react";
import styles from "@/styles/profile_picture.module.scss";
import { uploadProfilePhoto } from "@/actions/user/uploadProfilePhoto";
import { useRouter } from "next/navigation";
import Image from "next/image";
export default function ProfilePicture({ imgUrl }: { imgUrl: string }) {
    const [imgSrc, setImgSrc] = useState(imgUrl);
    // useEffect(() => {
    //     setImgSrc(session?.auth0Picture ?? "")
    // },[session])
    //const {data: session, update} = useSession()
    const router = useRouter();
    return (
        <form
            action={async (formData: FormData) => {
                await uploadProfilePhoto(formData);
                router.refresh();
            }}
            className={styles["profile-form"]}
        >
            <div className={styles["profile-pic"]}>
                <label className={styles["-label"]} htmlFor="file"></label>
                <input
                    id="file"
                    name="file"
                    type="file"
                    onChange={(event) => {
                        if (event.target.files)
                            setImgSrc(
                                URL.createObjectURL(event.target.files[0])
                            );
                    }}
                />
                <Image
                    alt="profilePhoto"
                    src={imgSrc}
                    id="output"
                    width="200"
                    height="200"
                />
                <Camera className={styles.camera} />
            </div>
            <input type="submit" className={styles.save} value="Save" />
        </form>
    );
}
