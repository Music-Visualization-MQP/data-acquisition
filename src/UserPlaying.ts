import { SupabaseClient } from "@supabase/supabase-js";
import { TrackInfo } from "./TrackInfo";
import { UUID } from "crypto";
import { Album, Client, User } from "spotify-api.js";
import { AlbumInfo } from "./AlbumInfo";
import { time, timeStamp } from "console";

export abstract class UserPlaying{
  userId!: string;
  supabase! : SupabaseClient;
  context!: any;
  inited!: boolean;
  albumInfo!: AlbumInfo[];
  constructor(supabase: SupabaseClient, userId: string, context: any) {
    this.supabase = supabase;
    this.userId = userId;
    this.context = context;
    this.inited = false;
  }
  public async init() : Promise<void> {
    throw new Error("Method not implemented.");
  }
  public async fire() : Promise<void> {
    throw new Error("Method not implemented.");
  };
}



export class SpotifyUserPlaying extends UserPlaying{


  constructor(supabase: SupabaseClient, userId: any, context: any) {
    super(supabase, userId, context);
  }
  public async init() : Promise<void> {
    const client = await Client.create({
      refreshToken: true,
      token: {
        clientID: process.env.SP_CID as string,
        clientSecret: process.env.SP_SECRET as string,
        refreshToken: this.context.refresh_token,
      },
      onRefresh() {
        console.log(`Token has been refreshed. New token: ${client.token}!`);
      },
    })
  }
  public async fire() : Promise<void> {
    await this.init();


  };

}

export class MockUserPlaying extends UserPlaying{
  mockData: any = 
    [ {trackName: "Test Track",
    trackArtists: ["Test Artist"],
    albumInfo: {
      albumName: "Test Album",
      albumArtists: ["Test Album Artist"],
      albumImage: "Test Image",
      albumReleaseDate: "Test Date",
    },
    image: "Test Image",
    isrc: "Test ISRC",
    durationMs: 1000,
    progressMs: 500,
    popularity: 100,
    timestamp : new Date(),},
    {trackName: "Test Track 2",
    trackArtists: ["Test Artist 2"],
    albumInfo: {
      albumName: "Test Album 2",
      albumArtists: ["Test Album Artist 2"],
      albumImage: "Test Image 2",
      albumReleaseDate: "Test Date 2",
    },
    image: "Test Image 2",
    isrc: "Test ISRC 2",
    durationMs: 2000,
    progressMs: 1000,
    popularity: 95,
    timestamp : new Date(),}]


    
  constructor(supabase: SupabaseClient, userId: any, context: any) {
    super(supabase, userId, context);
  }
  public async init() : Promise<void> {
    this.inited = true;
    console.log("Mock init");
  }
  public async fire() : Promise<void> {
    console.log("Mock fire");
    for (let track of this.mockData){
      let album = new AlbumInfo(track.albumInfo.albumName, "album", track.albumInfo.albumArtists, track.albumInfo.albumImage, new Date(track.albumInfo.albumReleaseDate), 1);
      let trackInfo = new TrackInfo(track.trackName, track.trackArtists, track.albumInfo, track.image, track.isrc, track.durationMs, track.progressMs, track.popularity, track.timestamp);

    }
    
  };
}