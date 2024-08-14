"use server";
import supabase from "@/utils/supabase";

export async function setPictureUrlForUser(userId: string, pictureUrl: string): Promise<void> {
    //Insert the user and the picture url into a supabase table that has the "id" as primary column and "picture_url" as a string column
    const { data, error } = await supabase.from('users').upsert([
        { id: userId, picture_url: pictureUrl }
    ]);
}

export async function getPictureUrlForUser(userId: string): Promise<string> {
    const { data, error } = await supabase.from('users').select('picture_url').eq('id', userId).single();
    return data?.picture_url ?? "";
}

export async function getNameForUser(userId: string): Promise<string> {
    const { data, error } = await supabase.from('users').select('name').eq('id', userId).single();
    return data?.name ?? "";
}

export async function setNameForUser(userId: string, name: string): Promise<void> {
    const { data, error } = await supabase.from('users').upsert([
        { id: userId, name: name }
    ]);
}

export async function setDbUser(userId: string, name: string, pictureUrl: string): Promise<void> {
    await setNameForUser(userId, name);
    await setPictureUrlForUser(userId, pictureUrl);
}

