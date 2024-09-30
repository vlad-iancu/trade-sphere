"use server";
import SignedIn from "@/app/components/SignedIn";
import supabase, { SupabaseAction } from "@/utils/supabase";

export async function setPictureUrlForUser(
    userId: string,
    pictureUrl: string
): Promise<SupabaseAction> {
    //Insert the user and the picture url into a supabase table that has the "id" as primary column and "picture_url" as a string column
    await SignedIn();
    return supabase
        .from("users")
        .upsert([{ id: userId, picture_url: pictureUrl }]);
}

export async function getPictureUrlForUser(userId: string): Promise<string> {
    await SignedIn();
    const { data, error } = await supabase
        .from("users")
        .select("picture_url")
        .eq("id", userId)
        .single();
    if (error || !data) {
        return Promise.reject(error);
    }
    return data.picture_url;
}

export async function getNameForUser(userId: string): Promise<string> {
    await SignedIn();
    const { data, error } = await supabase
        .from("users")
        .select("name")
        .eq("id", userId)
        .single();
    if (error || !data) {
        return Promise.reject(error);
    }
    return data.name;
}

export async function setNameForUser(
    userId: string,
    name: string
): Promise<SupabaseAction> {
    await SignedIn();
    const result = supabase.from("users").upsert([{ id: userId, name: name }]);
    return result;
}

export async function setDbUser(
    userId: string,
    name: string,
    pictureUrl: string
): Promise<[SupabaseAction, SupabaseAction]> {
    await SignedIn();
    return Promise.all([
        setNameForUser(userId, name),
        setPictureUrlForUser(userId, pictureUrl),
    ]);
}
