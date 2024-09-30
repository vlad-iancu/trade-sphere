"use server";

import { auth } from "@/auth";
import { updateUserMetadata } from "./mgmt_api";
import { setNameForUser } from "@/data/user";
import SignedIn from "@/app/components/SignedIn";

export async function updateUserName(username: string): Promise<void> {
    await SignedIn();
    if (!username) {
        return;
    }
    const userId = (await auth())?.auth0Id ?? "";
    updateUserMetadata({ username }, userId);
    setNameForUser(userId, username);
}
