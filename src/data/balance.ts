import supabase from "@/utils/supabase";

export async function getUserBalance(userId: string): Promise<number> {
    const { data, error } = await supabase.from('users_balance').select('balance').eq('id', userId).single();
    if(!data) {
        await setUserBalance(userId, 0);
        return 0;
    }
    return data.balance;
}

export async function setUserBalance(userId: string, balance: number): Promise<void> {
    const { data, error } = await supabase.from('users_balance').upsert([
        { id: userId, balance: balance }
    ]);
}