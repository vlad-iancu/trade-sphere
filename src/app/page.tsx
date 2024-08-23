//import Image from "next/image";
//import styles from "./page.module.scss";

// import { auth } from "@/auth";
// import { redirect } from "next/navigation";

export default async function Home() {
  // const sesstion = await auth()
  // if(sesstion?.user) {
  //   redirect("/profile")
  // }
  //redirect("/login");
  return (
    <main>
      Page
      <a href="/login" style={{display: "block"}}>Login</a>
      <a href="/profile" style={{display: "block"}}>User Page</a>
    </main>
  );
}
