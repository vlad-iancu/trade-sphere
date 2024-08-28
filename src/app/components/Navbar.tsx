import styles from "@/styles/Navbar.module.scss";
import UserPhoto from "./UserPhoto";
import LogoutButton from "./LogoutButton";
import { auth } from "@/auth";

const navItems = [
    { label: "Home", route: "/dashboard" },
    { label: "Settings", route: "/profile" },
];
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
    if (!session?.user) {
        isHidden = true;
        return <></>;
    }
    return (
        <nav
            className={`${styles.navbar} ${isHidden ? styles["navbar-hidden"] : ""}`}
        >
            <UserPhoto
                src=""
                alt=""
                width={0}
                height={0}
                style={{ width: "50%", height: "auto" }}
                unoptimized
            />
            {navItems.map(({ label, route }) => {
                return (
                    <a
                        href={route}
                        key={route}
                        className={
                            /*pathname.startsWith(route) ? styles["navbar-element-active"] : */ styles[
                                "navbar-element"
                            ]
                        }
                    >
                        {label}
                    </a>
                );
            })}
            <LogoutButton text="Sign Out" />
        </nav>
    );
}
