import "@/styles/globals.scss";
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
    //console.log(`noNavPages contains route ${noNavPages?.includes(pathname) }`);
    //const containerClass = noNavPages?.includes(pathname) ? styles["container-no-nav"] : styles["container-nav"];
    console.log("Route group layout is rendered");
    return (
        <>
            <Search />
            <div style={{ marginTop: "64px", width: "100%", height: "100%" }}>
                {children}
            </div>
        </>
    );
}
