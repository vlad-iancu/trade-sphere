import styles from "@/styles/Navbar.module.scss";
import { headers } from "next/headers";
import UserPhoto from "./UserPhoto";
import LogoutButton from "./LogoutButton";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "@/auth";

const navItems = [
    { label: "Home", route: "/dashboard" }, 
    { label: "Settings", route: "/profile" },];
export default async function Navbar() {
    //const headerList = headers();
    //const pathname = headerList.get("x-current-path") ?? "";
    //const pathname = usePathname();
    //const [isHidden, setIsHidden] = useState(false);
    //useEffect(() => {
    //    const hasNav = navItems.some(({ route }) => pathname.startsWith(route));
    //    setIsHidden(!hasNav);
    //},[pathname])
    const session = await auth();
    let isHidden = false;
    if(!(session?.user)) {
        isHidden = true;
        return <></>
    }
    return (
        <nav className={`${styles.navbar} ${isHidden ? styles["navbar-hidden"] : ""}`}>
            <UserPhoto width={"50%"} height={""} />
            {
                navItems.map(({ label, route }) => {
                    return (
                        <a href={route} key={route} className={/*pathname.startsWith(route) ? styles["navbar-element-active"] : */styles["navbar-element"]}>
                            {label}
                        </a>
                    )
                })
            }
            <LogoutButton text="Sign Out" />
        </nav>
    );
}