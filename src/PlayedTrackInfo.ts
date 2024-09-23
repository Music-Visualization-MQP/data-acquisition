import { AlbumInfo } from "./AlbumInfo";
import { TrackInfo } from "./TrackInfo";

export class PlayedTrackInfo {
  private playedAt: Date;
  private trackInfo: TrackInfo;
  private albumInfo: AlbumInfo;

  constructor(playedAt: Date, trackInfo: TrackInfo, albumInfo: AlbumInfo) {
    this.playedAt = playedAt;
    this.trackInfo = trackInfo;
    this.albumInfo = albumInfo;
  }

  public createDbEntryObject() {
    return {
      played_at: this.playedAt.toDateString(),
      track_info: this.trackInfo.createDbEntryObject(),
      album_info: this.albumInfo.createDbEntryObject(),
    };
  }
}