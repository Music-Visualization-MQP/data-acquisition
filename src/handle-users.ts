import { SupabaseClient, createClient } from "@supabase/supabase-js";
import {Client, Player} from "spotify-api.js"
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

async function gatherUsers()  {
  const { data: credsData, error: grabError } = await supabase
    .from("spotify_credentials")
    .select("*");
  
  return { credsData, grabError };
}

function convertToMap(data: any[]){
  let map = new Map();
  for (let obj of data){
    map.set(obj.id, {refresh_token: obj.refresh_token});
  }
  return map;
}

export async function gatherAndMapUsers() : Promise<void | Map<string, { refresh_token: string; }>> {
  const { credsData, grabError } = await gatherUsers();
  if (grabError){
    console.log("Error grabbing data");
    return ;
  }
  return convertToMap(credsData as JSON[]);
}

export async function updateUsers(data: Map<string, {refresh_token: string}>) : Promise<Map<string, Client>>{
  let ret = new Map();
  for (let [key, value] of data){
    const client = await Client.create({
      refreshToken: true, 
      token: {
        clientID: process.env.SP_CID as string,
        clientSecret: process.env.SP_SECRET as string,
        refreshToken: value.refresh_token,
    },
      onRefresh() {
        console.log(`Token has been refreshed. New token: ${client.token}!`);
      },
    });
    ret.set(key, client)
     
  }
  return ret;
}

export async function updateUsersPlayback(data: Map<string, Client>){
  for (let [key, value] of data){
    const player = new Player(value);
    player.getCurrentlyPlaying().then((res) => console.log(res));
  }
}

