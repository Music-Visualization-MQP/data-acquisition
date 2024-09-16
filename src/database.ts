import { SupabaseClient, createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { get } from "http";
dotenv.config();


let supabaseClient: SupabaseClient | null = null;

const getSupabaseClient : () => Promise<SupabaseClient> = async () => {
  if (supabaseClient !== null) {
    return supabaseClient;
  } else {
    supabaseClient = createClient(
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
    return supabaseClient;
  }
}

const nullifySupabaseClient = () => { 
  supabaseClient = null;
}



/**
 * This function gathers the data from the spotify_credentials table
 * @returns a JSON array containing the data from the spotify_credentials table
 */
export async function gatherUsers() {
  const supabase  = await getSupabaseClient();
  try {
    
    console.log(supabase)
    const { data: credsData, error: grabError } = await supabase
      .from("spotify_credentials")
      .select("*");
  
    return { credsData, grabError };
  } catch (grabError){
    nullifySupabaseClient();
    console.log("Error grabbing data")
    return {credsData: null, grabError}

  }
}
/**
 * 
 * @param data represents the data to be inserted into the played_tracks table
 * @returns the response from the insert query 
 */
export async function insertPlayed(data: any) {
  let supabase= await getSupabaseClient();

  try{
    data['p_user_id'] = data['user_id'];
    delete data['user_id'];
    const { data: insertData, error: insertError } = await supabase
      .rpc('add_played_track', data)
    return { insertData };

  }catch(insertError){
    nullifySupabaseClient();
    console.log("Error inserting data")
    return {insertError}
  }
  console.log("DATA!!!!!!", data)
  data['p_user_id'] = data['user_id'];
  delete data['user_id'];
  const { data: insertData, error: insertError } = await supabase
    .rpc('add_played_track', data)

 
  
  return { insertData, insertError };
}