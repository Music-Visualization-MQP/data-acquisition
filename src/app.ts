import { SupabaseClient, createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import {Client, Player} from "spotify-api.js"
import {gatherAndMapUsers, updateUsers,  updateUsersPlayback} from "./handle-users";
dotenv.config();

console.log(process.env.ANON);
// Create a single supabase client for interacting with your database
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
)

async function func() {
  /* */
  const { data: credsData, error: grabError } = await supabase
    .from("spotify_credentials")
    .select("*");
  
  /* const player = new Player(client);
  const currentPlayback = await player.getCurrentPlayback();
  console.log(currentPlayback); */
  return { credsData, grabError };


}
gatherAndMapUsers().then((ret) =>{
  if(ret){
    updateUsers(ret).then((ret)=> updateUsersPlayback(ret));
  }
})
func().then((ret) => console.log(ret));
