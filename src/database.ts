import { SupabaseClient, createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();


const supabase: SupabaseClient = createClient(
  process.env.SB_URL as string,
  process.env.SERVICE as string,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  }
);
/**
 * This function gathers the data from the spotify_credentials table
 * @returns a JSON array containing the data from the spotify_credentials table
 */
export async function gatherUsers() {
  const { data: credsData, error: grabError } = await supabase
    .from("spotify_credentials")
    .select("*");

  return { credsData, grabError };
}
/**
 * 
 * @param data represents the data to be inserted into the played_tracks table
 * @returns the response from the insert query 
 */
export async function insertPlayed(data: any) {
  const { data: insertData, error: insertError } = await supabase
    .from("played_tracks")
    .insert(data)
    .select();
  
  return { insertData, insertError };
}