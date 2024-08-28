"use server";
import { auth } from "@/auth";
import supabase from "@/utils/supabase";
export async function getUser(): Promise<{
    name: string;
    picture_url: string;
}> {
    const userId = (await auth())?.auth0Id ?? "";
    //Run a supabase query of the table users where the id is the userId
    //Return the name and the picture_url
    const { data, error } = await supabase
        .from("users")
        .select("name, picture_url")
        .eq("id", userId)
        .single();
    if (data && !error) {
        //console.log("Data is not null")
        //console.log("We have name: ", data.name)
        return Promise.resolve({
            name: data.name,
            picture_url: data.picture_url,
        });
    } else {
        return { name: "", picture_url: "" };
    }
}

export async function getSampleUser(): Promise<{
    name: string;
    picture_url: string;
}> {
    return { name: "Sample user", picture_url: "" };
}
