import { AlbumInfo } from "./AlbumInfo";

export class TrackInfo {
  private trackName: string;
  private trackArtists: string[];
  private albumInfo: AlbumInfo;
  private image: string;
  private isrc: string;
  private durationMs: number;
  private progressMs: number;
  private popularity: number;
  private timestamp: Date;
  

  private inDB: boolean | null = null;
  constructor(trackName : string, trackArtists : string[], albumInfo : AlbumInfo, image : string, isrc : string, durationMs : number, progressMs: number, popularity: number, timestamp : Date) {
    this.trackName = trackName;
    this.trackArtists = trackArtists;
    this.albumInfo = albumInfo;
    this.image = image;
    this.isrc = isrc;
    this.durationMs = durationMs;
    this.progressMs = progressMs;
    this.popularity = popularity;
    this.timestamp = timestamp;

    
    console.log(this);
  }

  
  public getInDB() { return this.inDB; }
  public setInDB(value: boolean) { this.inDB = value; }
  /**
   * 
   * @param data represents the JSON object from the Spotify API
   * This method updates the track info with the data from the Spotify API
   * 
   * TODO: Handle the case where the track is not a track and it is an episode, 
   * this may be the responsibility of a different function this is also ripe for inheritance/ interfaces
   */
  
  /**
   * this method updates the track artists with the data from the Spotify API
   * @param artists represents the artists object from the Spotify API
   */
  private updateTrackArtists(artists: any){
    if (this.trackArtists === null) {
      console.log("trackArtists is null");
      this.trackArtists = new Array();
      for (let artist of artists) {
        this.trackArtists.push(artist.name);
      }
    }
  }
  /**
   * this method is used to determine if the progress of the track is sufficient to be added to the database
   * @returns true if the progress of the track is greater than 66% of the duration
   */
  public isProgressSufficient(){
    if(this.durationMs === null || this.progressMs === null) return false;
    return this.progressMs/this.durationMs >= 0.66; 
  }
  /**
   * this method is used to create an object that can be used to create a new entry in the database
   * @returns an object that can be used to create a new entry in the database
   * @todo change how indb is set because this might create a state mismatch
   */
  public createDbEntryObject() {
    this.inDB = true;
    return {
      p_track_name: this.trackName,
      p_track_artists: this.trackArtists,
      p_track_album: this.albumInfo?.createDbEntryObject(),
      p_track_duration_ms: this.durationMs,
      p_isrc: this.isrc,
      p_listened_at: this.timestamp.toISOString(),
      p_popularity: this.popularity
    }
  }
  
}

