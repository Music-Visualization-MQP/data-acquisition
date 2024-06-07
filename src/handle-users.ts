import { Client, Player } from "spotify-api.js";
import { AlbumInfo } from "./AlbumInfo";
import { TrackInfo } from "./TrackInfo";
import * as database from "./database";
import dotenv from "dotenv";
import { TimeData } from "./TimeData";
import { time } from "console";
dotenv.config();
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * This type represents the data that is being played on spotify and the users information
 */
export declare type PlayingSpotify = {
  client: Client;
  player: Player;
  trackInfo: TrackInfo;
  timeData: TimeData;
};

/**
 * This function converts the data from the spotify_credentials table to a map
 * @param data represents the data from the spotify_credentials table
 * @returns a map containing the data from the spotify_credentials table
 */
function convertToMap(data: any[]) {
  let map = new Map();
  for (let obj of data) {
    map.set(obj.id, { refresh_token: obj.refresh_token });
  }
  return map;
}
/**
 * This combines the gather users and convert to map function to create a map...
 * of users and their refresh tokens
 * @returns a map containing the data from the spotify_credentials table
 */
export async function gatherAndMapUsers(): Promise<void | Map<
  string,
  { refresh_token: string }
>> {
  const { credsData, grabError } = await database.gatherUsers();
  if (grabError) {
    console.log("Error grabbing data");
    return;
  }
  return convertToMap(credsData as JSON[]);
}

/**
 *
 * @param data represents the data from the spotify_credentials table in map form
 * @returns a map containing the user data and their spotify information including...
 * the client, player, and track info
 */
export async function updateUsers(
  data: Map<string, { refresh_token: string }>
): Promise<Map<string, PlayingSpotify>> {
  let ret = new Map();
  for (let [key, value] of data) {
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

    const player = new Player(client);
    ret.set(key, {
      client: client,
      trackInfo: new TrackInfo(),
      player: player,
      timeData: new TimeData()
    });
  }
  return ret;
}

/**
 * this function consumes the data from the spotify_credentials table and updates the...
 * user's playback information if it has been 3 seconds since the last update, if the 
 * data is already in the databse then it will not be added again
 * @param data represents the data from the spotify_credentials table in map form 
 */

export async function updateUsersPlayback(data: Map<string, PlayingSpotify>) {
  console.log(data);

  for (let [key, value] of data) {
    if(!value.timeData.isTimeToUpdate()) {
      console.log("Not time to update");
      await delay(1000)
    } else {
      value.timeData.reset()
      console.log("Getting currently playing");
      const currPlaying = await value.player.getCurrentlyPlaying();
      console.log(currPlaying);
      if(currPlaying) value.trackInfo.updateTrackInfo(currPlaying);
    } 
    if(value.trackInfo.isProgressSufficient() && !value.trackInfo.inDB) console.log("put me in the db", await database.insertPlayed({ user_id: key, ...value.trackInfo.createDbEntryObject()}))
    /* .then((res) => {
      console.log(res);
      if (res) {
        value.trackInfo.updateTrackInfo(res);
        console.log("res", res);
      } else console.log("No track playing");
    }); */
  }
  
}
