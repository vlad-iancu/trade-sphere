"use server"
import { auth } from "@/auth";
import supabase from "@/utils/supabase";
import axios from "axios";
import { updateUserMetadata } from "./mgmt_api";
import { getToken } from "next-auth/jwt";
import { setPictureUrlForUser } from "@/data/user";
import { revalidatePath } from "next/cache";

const bucket = supabase.storage.from("tradesphere-storage");
// export async function saveFile(file: Buffer, location: string) {
//     const { data, error } = await bucket.upload(location, file);
//     if(error) {
//         console.log("We have an error");
//         console.log(error);
//     }
//     else {
//         console.log("We have success");
//     }
// }

//100 years in seconds
const urlDuration = 1000 * 365 * 24 * 3600;
export async function uploadProfilePhoto(formData: FormData) {
    const file = formData.get("file") as File;
    const session = await auth();
    if (!(session?.user)) {
        return
    }
    const extension = file.name.split(".").pop() ?? "";
    const filename = (session.auth0Id + "." + extension).slice(6);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    // console.log(`Buffer length is ${buffer.length}`);
    console.log(`filename: ${filename}`);
    // console.log(`is buffer null? ${buffer === null}`);
    const { data, error } = await bucket.upload(filename, buffer, { upsert: true });
    console.log(`data: ${data}`);
    console.log(`error: ${error?.message ?? "No error"}`);
    //Create a signed url for the created object
    const temp = await bucket.createSignedUrl(filename, urlDuration);
    console.log(`signedURL: ${temp.data?.signedUrl}`);
    //axios.patch(`${process.env.AUTH_AUTH0_ISSUER}/api/v2/users`)
    if (error) {
        console.log("We have an error");
        console.log(error);
    }
    else {
        console.log("We have success");
    }
    await updateUserMetadata({ picture: temp.data?.signedUrl }, session.auth0Id);
    await setPictureUrlForUser(session.auth0Id, temp.data?.signedUrl ?? "");
    //revalidatePath("/profile");
}