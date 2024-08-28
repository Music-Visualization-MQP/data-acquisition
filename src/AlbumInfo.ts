export class AlbumInfo {
  public albumName: string
  public albumType: string
  public artists: string[]
  public image: string
  public releaseDate: Date
  public numTracks: number;

  constructor(private spotifyAlbumInfo: any) {
    this.albumName = spotifyAlbumInfo.name;
    this.albumType = spotifyAlbumInfo.albumType;
    this.artists = [];
    for (let artist of spotifyAlbumInfo.artists) {
      this.artists.push(artist.name);
    }
    this.releaseDate = new Date(spotifyAlbumInfo.releaseDate)
    this.numTracks = spotifyAlbumInfo.totalTracks;
    this.image = spotifyAlbumInfo.images[0].url;

    console.log(this)
  }
  /**
   * 
   * @returns an object that can be used to create a new entry in the database
   */
  public createDbEntryObject(){
    return {
      album_name: this.albumName,
      album_type: this.albumType,
      artists: this.artists,
      image: this.image,
      release_date: this.releaseDate.toDateString(),
      num_tracks: this.numTracks
    }
  }
}
