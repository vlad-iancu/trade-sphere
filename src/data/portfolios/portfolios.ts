"use server";
import supabase from "@/utils/supabase";
import SignedIn from "@/app/components/SignedIn";

interface Portfolio {
    id?: number;
    user_id: string;
    name: string;
    created_at?: string;
    balance: number;
}

// Create a new portfolio
export const createPortfolio = async (portfolio: Portfolio) => {
    const auth = await SignedIn();
    if (portfolio.user_id != auth.auth0Id) {
        return;
    }
    const { data, error } = await supabase
        .from("portfolios")
        .insert([portfolio]);

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

// Read a single portfolio by ID
export const getPortfolioById = async (id: number) => {
    const auth = await SignedIn();
    const { data, error } = await supabase
        .from("portfolios")
        .select("*")
        .eq("id", id)
        .eq("user_id", auth.auth0Id)
        .single();

    if (error) {
        throw new Error(error.message);
    }
    return data;
};

// Update a portfolio by ID
export const updatePortfolio = async (
    id: number,
    updates: Partial<Portfolio>
) => {
    const auth = await SignedIn();
    const { data, error } = await supabase
        .from("portfolios")
        .update(updates)
        .eq("id", id)
        .eq("user_id", auth.auth0Id);

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

// Delete a portfolio by ID
export const deletePortfolio = async (id: number) => {
    const auth = await SignedIn();
    const { data, error } = await supabase
        .from("portfolios")
        .delete()
        .eq("id", id)
        .eq("user_id", auth.auth0Id);

    if (error) {
        throw new Error(error.message);
    }

    return data;
};
