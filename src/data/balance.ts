import supabase, { SupabaseAction } from "@/utils/supabase";

export async function getUserBalance(userId: string): Promise<number> {
    const { data, error } = await supabase
        .from("users_balance")
        .select("balance")
        .eq("id", userId)
        .single();
    if (error || !data) {
        await setUserBalance(userId, 0);
        return 0;
    }
    return data.balance;
}

export async function setUserBalance(
    userId: string,
    balance: number
): Promise<SupabaseAction> {
    return supabase
        .from("users_balance")
        .upsert([{ id: userId, balance: balance }]);
}
