import { AlbumInfo } from "./AlbumInfo";

export class TrackInfo {
  public trackName: string | null = null;
  public trackArtists: string[] | null = null;
  public albumInfo: AlbumInfo | null = null;
  public image: string | null = null;
  public isrc: string | null = null;
  public durationMs: number | null = null;
  public progressMs: number | null = null;
  public popularity: number | null = null;
  

  public inDB: boolean | null = null;

  constructor() {
    this.inDB = false;
  }
  /**
   * 
   * @param spotifyJSON represents the JSON object from the Spotify API
   * This method updates the track info with the data from the Spotify API
   * 
   * TODO: Handle the case where the track is not a track and it is an episode, 
   * this may be the responsibility of a different function
   */

  public updateTrackInfo(spotifyJSON: any) {

    console.log("updateTrackInfo");
    if(spotifyJSON.currentPlayingType !== "track") return;
    let item = spotifyJSON.item;
    if(item.externalID.isrc !== this.isrc) this.reset();
    console.log (spotifyJSON.progress);
    console.log(item);
    this.updateTrackArtists(item.artists);
    this.updateAlbumInfo(item.album);
    this.trackName = item.name;
    this.isrc = item.externalID.isrc;
    this.durationMs = item.duration;
    this.progressMs = spotifyJSON.progress;
    this.popularity = item.popularity;
    console.log(this);
  }
  /**
   * this method resets the track info to null for another track to be played
   */
  public reset(){
    this.trackName = null;
    this.trackArtists = null;
    this.albumInfo = null;
    this.image = null;
    this.durationMs = null;
    this.progressMs = null;
    this.inDB = false;
  }
  /**
   * This method updates the album info with the data from the Spotify API
   * @param album represents the album object from the Spotify API
   */
  private updateAlbumInfo(album: any) {
    if (this.albumInfo === null) {
      this.albumInfo = new AlbumInfo(album);

    }
    
  }
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
   */
  public createDbEntryObject() {
    this.inDB = true;
    return {
      track_name: this.trackName,
      track_artists: this.trackArtists,
      track_duration_ms: this.durationMs,
      track_album: this.albumInfo?.createDbEntryObject(),
      isrc: this.isrc,
      duration : this.durationMs,
      listened_at: new Date().toISOString(),
      popularity: this.popularity
    }
  }
  
}