import SpotifyWebApi from "spotify-web-api-node";
import mongoose, { mongo } from "mongoose";
import lightService from "./light/light.service";
import { IlluminanceLevel } from "./light/light.enum";
import spotifyApiWrapper from "./spotify/spotify.api";

(async () => {
  await initMongoDbConnection();
  await spotifyApiWrapper.registerSpotifyApi();
  let lastIlluminanceLevel;
  while (true) {
    const currentIlluminanceLevel: IlluminanceLevel = await lightService.getCurrentLighting();
    console.log(`Current Illuminance: ${currentIlluminanceLevel}`);
    if (currentIlluminanceLevel !== lastIlluminanceLevel) {
      await decideMusic(currentIlluminanceLevel);
    }
    await syncTimeOut(1000);
    lastIlluminanceLevel = currentIlluminanceLevel;
  }
})()
  .then(() => {})
  .catch((err) => {
    console.error(err);
  });

async function syncTimeOut(timeout: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeout);
  });
}

async function decideMusic(illuminanceLevel: IlluminanceLevel) {
  switch (illuminanceLevel) {
    case IlluminanceLevel.CompleteDarkness: {
      await spotifyApiWrapper.playPlaylist(illuminanceLevel);
      break;
    }
    case IlluminanceLevel.DimLight: {
      await spotifyApiWrapper.playPlaylist(illuminanceLevel);
      break;
    }
    case IlluminanceLevel.Twilight: {
      await spotifyApiWrapper.playPlaylist(illuminanceLevel);
      break;
    }
    case IlluminanceLevel.BrightLight: {
      await spotifyApiWrapper.playPlaylist(illuminanceLevel);
      break;
    }
    case IlluminanceLevel.FullBrightness: {
      await spotifyApiWrapper.playPlaylist(illuminanceLevel);
      break;
    }
  }
}

async function initMongoDbConnection() {
  const mongoDbUsername = process.env.MONGO_DB_USERNAME;
  const mongoDbPassword = process.env.MONGO_DB_PASSWORD;
  return mongoose.connect(
    `mongodb+srv://${mongoDbUsername}:${mongoDbPassword}@cluster0.dvazg.mongodb.net/samples?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  );
}