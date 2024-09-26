import { SupabaseClient } from "@supabase/supabase-js";
import { TrackInfo } from "./TrackInfo";
import { UUID } from "crypto";
import { Album, Client, User } from "spotify-api.js";
import { AlbumInfo } from "./AlbumInfo";
import { error, time, timeStamp } from "console";
import { PlayedTrack } from "./PlayedTrack";

export abstract class UserPlaying{
  userId!: string;
  supabase! : SupabaseClient;
  context!: any;
  inited!: boolean;
  played: PlayedTrack[] = [];
  dbEntries: any = {p_track_info: [], p_user_id: "", p_environment:""};
  constructor(supabase: SupabaseClient, userId: string, context: any) {
    this.supabase = supabase;
    this.userId = userId;
    this.context = context;
    this.inited = false;
  }
  protected async makeDBEntries() : Promise<void> {
    throw new Error("Method not implemented.");
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
      albumReleaseDate: new Date(2021, 1, 1),
    },
    image: "Test Image",
    isrc: "USRC17607830",
    durationMs: 1000,
    progressMs: 500,
    popularity: 100,
    timestamp : new Date(125666778),},
    {trackName: "Test Track 2",
    trackArtists: ["Test Artist 2"],
    albumInfo: {
      albumName: "Test Album 2",
      albumArtists: ["Test Album Artist 2"],
      albumImage: "Test Image 2",
      albumReleaseDate: new Date(2021, 1, 1),
    },
    image: "Test Image 2",
    isrc: "USRC17607839",
    durationMs: 2000,
    progressMs: 1000,
    popularity: 95,
    timestamp : new Date(13888088),}]
    constructor(supabase: SupabaseClient, userId: any, context: any) {
      super(supabase, userId, context);
    }
  protected async makeDBEntries() : Promise<void> {
    for (let track of this.mockData){
      const album = new AlbumInfo(
        track.albumInfo.albumName,
        "Album",
        track.albumInfo.albumArtists,
        track.albumInfo.albumImage,
        new Date(track.albumInfo.albumReleaseDate),
        1,
        ["Test Genre"],
        "Test UPC",
        "",
        "",
        100
      );
      const trackInfo = new TrackInfo(
        track.trackName,
        track.trackArtists,
        track.isrc,
        track.durationMs
      );
      const playedTrackInfo = new PlayedTrack(
        track.timestamp,
        trackInfo,
        album,
        
      );
      this.played.push(playedTrackInfo);
    }
    for (let track of this.played){
      this.dbEntries.p_track_info.push(track.createDbEntryObject());
    }
    this.dbEntries.p_user_id = this.userId;
    this.dbEntries.p_environment = "test";
  }

  public async init() : Promise<void> {
    this.inited = true;
    console.log("Mock init");
  }
  public async fire() : Promise<void> {
    console.log("Mock fire");
    await this.makeDBEntries();
    console.log(this.dbEntries);
    this.supabase.rpc("bulk_add_played_tracks", this.dbEntries);
    /* for (let entry of this.dbEntries.p_track_info){
      const {data: trackData, error: trackError} = await this.supabase.from("tracks").insert(entry.track).select("*");
      if(trackError && trackError?.code !== "23505") throw trackError;
      const {data: albumData, error: albumError} = await this.supabase.from("albums").insert(entry.track_album).select("*");
      if(albumError && albumError?.code !== "23505") throw albumError;
      if(trackData && albumData) {
        const {data: trackAlbumData, error: trackAlbumError} = await this.supabase.from("track_albums").insert({track_id: trackData[0].track_id, album_id: albumData[0].album_id}).select("*");
        const {data: playedData, error: playedError} = await this.supabase.rpc("add_played_track", {p_user_id: this.userId, p_listened_at: entry.p_listened_at, p_track_id: trackData[0].track_id, p_album_id: albumData[0].album_id});
      } else throw new Error("No data returned from insert");

    } */

    
  };
}