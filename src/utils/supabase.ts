import {
    createClient,
    PostgrestResponse,
    PostgrestSingleResponse,
} from "@supabase/supabase-js";

const supabaseUrl = "https://odwxkelpezjxsfjdwrbu.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_KEY ?? "";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
export type SupabaseAction = PostgrestSingleResponse<null>;
export type SupabaseResponse<T> = PostgrestResponse<T>;
