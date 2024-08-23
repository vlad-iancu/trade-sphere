import "@/styles/globals.scss";
import { SessionProvider } from "next-auth/react";
import Navbar from "../components/Navbar";
import styles from "@/styles/layout.module.scss";
import { usePathname } from "next/navigation";
import { headers } from "next/headers";
import Search from "./Search";
// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    //const headerList = headers();
    //const pathname = headerList.get("x-current-path") ?? "";
    const noNavPages = ["/login"];
    // const pathname = usePathname();
    const nav = <Navbar />

    //console.log(`noNavPages contains route ${noNavPages?.includes(pathname) }`);
    //const containerClass = noNavPages?.includes(pathname) ? styles["container-no-nav"] : styles["container-nav"];
    console.log("Route group layout is rendered")
    return (
        <>
            <Search />
            {children}
        </>



    );
}