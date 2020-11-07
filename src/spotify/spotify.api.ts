import SpotifyWebApi = require("spotify-web-api-node");
import readline from "readline";
import { IlluminanceLevel } from "../light/light.enum";

class SpotifyApiWrapper {
  private spotifyApi: SpotifyWebApi;
  private illuminancePlaylistMap: { [IlluminanceLevel: number]: string };
  constructor() {
    this.spotifyApi = new SpotifyWebApi({
      clientId: "a8c4767eeca84ba38d3d8c9a86682503",
      clientSecret: "7335050c977e4251bd5709e83bbf103e",
      redirectUri: "https://www.google.com/",
    });

    this.illuminancePlaylistMap = {
      [IlluminanceLevel.CompleteDarkness]: "mbtl_Complete_Darkness",
      [IlluminanceLevel.DimLight]: "mbtl_Dim_Light",
      [IlluminanceLevel.Twilight]: "mbtl_Twilight",
      [IlluminanceLevel.BrightLight]: "mbtl_Bright_Light",
      [IlluminanceLevel.FullBrightness]: "mbtl_Full_Brightness",
    };
  }
  async registerSpotifyApi(): Promise<void> {
    try {
      const refreshToken = process.env.REFRESH_TOKEN ?? "";
      this.spotifyApi.setRefreshToken(refreshToken);
      const accessToken = await this.spotifyApi.refreshAccessToken();
      this.spotifyApi.setAccessToken(accessToken.body.access_token);
    } catch (err) {
      const url = this.spotifyApi.createAuthorizeURL(["streaming"], "my-state");
      console.log("Get the code");
      console.log(url);
      let code = await this.syncReadLine();
      const { body: authData } = await this.spotifyApi.authorizationCodeGrant(
        code
      );
      console.log(authData);
      this.spotifyApi.setAccessToken(authData.access_token);
      this.spotifyApi.setRefreshToken(authData.refresh_token);
    }
  }

  private async syncReadLine(): Promise<string> {
    return new Promise((resolve) => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      rl.question("Enter the code:", (answer) => {
        resolve(answer);
        rl.close();
      });
    });
  }

  async playPlaylist(illuminanceLevel: IlluminanceLevel) {
    const playlistName = this.illuminancePlaylistMap[illuminanceLevel];
    const playlist = await this.getPlayUserlistByName(playlistName);
    try {
      await this.spotifyApi.play({
        context_uri: `spotify:playlist:${playlist?.id}`,
        offset: {
          position: this.randomTrackNumber(playlist?.tracks.total ?? 0),
        },
      });
    } catch (err) {
      console.error(`Failed to play playlist ${playlistName}`);
      console.error(err?.body?.error?.message);
    }
  }

  private async getPlayUserlistByName(playlistName: string) {
    const { body } = await this.spotifyApi.getUserPlaylists();
    const userPlaylists = body.items;
    return userPlaylists.find((playlist) => playlist.name === playlistName);
  }

  private randomTrackNumber(numberOfTrackInPlaylist: number): number {
    return Math.floor(Math.random() * numberOfTrackInPlaylist);
  }
}

export default new SpotifyApiWrapper();
