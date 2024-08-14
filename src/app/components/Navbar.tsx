"use client";
import styles from "@/styles/Navbar.module.scss";
import { headers } from "next/headers";
import UserPhoto from "./UserPhoto";
import LogoutButton from "./LogoutButton";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
    { label: "Home", route: "/dashboard" }, 
    { label: "Settings", route: "/profile" },];
export default function Navbar() {
    //const headerList = headers();
    //const pathname = headerList.get("x-current-path") ?? "";
    const pathname = usePathname();
    const [isHidden, setIsHidden] = useState(false);
    useEffect(() => {
        const hasNav = navItems.some(({ route }) => pathname.startsWith(route));
        setIsHidden(!hasNav);
    },[pathname])
    return (
        <nav className={`${styles.navbar} ${isHidden ? styles["navbar-hidden"] : ""}`}>
            <UserPhoto width={"50%"} height={""} />
            {
                navItems.map(({ label, route }) => {
                    return (
                        <Link href={route} key={route} className={pathname.startsWith(route) ? styles["navbar-element-active"] : styles["navbar-element"]}>
                            {label}
                        </Link>
                    )
                })
            }
            <LogoutButton text="Sign Out" />
        </nav>
    );
}