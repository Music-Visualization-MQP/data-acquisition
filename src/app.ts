import { SupabaseClient, createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import {Client, Player} from "spotify-api.js"
import {gatherAndMapUsers, updateUsers,  updateUsersPlayback, PlayingSpotify} from "./handle-users";
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
/* gatherAndMapUsers().then((ret) => {
  if(ret){
    updateUsers(ret).then((ret)=> updateUsersPlayback(ret));
  }
})
 */

/**
 * This function runs the entire program by gathering the users and their refresh tokens...
 * then updating the users and their playback information continuously for all users
 * 
 * TODO: add a way to check for new users and add them to the current map
 */
async function run() {
  let users = await gatherAndMapUsers()
  let obj : Map<string, PlayingSpotify> | undefined
  if (users){
    obj = await updateUsers(users)
  }
  while (true){
    if(obj) await updateUsersPlayback(obj)
  }
}

run()
