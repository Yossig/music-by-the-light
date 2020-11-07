import SpotifyWebApi from "spotify-web-api-node";
import mongoose, { mongo } from "mongoose";
import lightService from "./light/light.service";
import { IlluminanceLevel } from "./light/light.enum";
import readline from "readline";
(async () => {
  await mongoose.connect(
    "mongodb+srv://music-by-the-light-service-user:LV1xf7YkaJavw6aU@cluster0.dvazg.mongodb.net/samples?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  );

  const spotifyApi = await registerSpotifyApi();
  let lastIlluminanceLevel;
  while (true) {
    const currentIlluminanceLevel: IlluminanceLevel = await lightService.getCurrentLighting();
    console.log(currentIlluminanceLevel);
    if (currentIlluminanceLevel !== lastIlluminanceLevel) {
      await decideMusic(currentIlluminanceLevel, spotifyApi)
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

async function syncReadLine(): Promise<string> {
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

async function registerSpotifyApi():Promise<SpotifyWebApi> {
  const spotifyApi = new SpotifyWebApi({
    clientId: "a8c4767eeca84ba38d3d8c9a86682503",
    clientSecret: "7335050c977e4251bd5709e83bbf103e",
    redirectUri: "https://www.google.com/",
  });
  const url = spotifyApi.createAuthorizeURL(["streaming"], "my-state");
  console.log("Get the code");
  console.log(url);
  let code = await syncReadLine();
  const { body: authData } = await spotifyApi.authorizationCodeGrant(code);
  spotifyApi.setAccessToken(authData.access_token);
  spotifyApi.setRefreshToken(authData.refresh_token);

  return spotifyApi;
}

async function decideMusic(illuminanceLevel:IlluminanceLevel, spotifyApi:SpotifyWebApi) {
  switch (illuminanceLevel) {
    case IlluminanceLevel.CompleteDarkness: {
      await spotifyApi.play({
        uris: ["spotify:track:078Rs12cNKn8qtt3blVDw4"],
      });
      break;
    }
    case IlluminanceLevel.DimLight: {
      await spotifyApi.play({
        uris: ["spotify:track:4VC5yXMaWBo6XN1V3V3Vpo"],
      });
      break;
    }
    case IlluminanceLevel.Twilight: {
      await spotifyApi.play({
        uris: ["spotify:track:078Rs12cNKn8qtt3blVDw4"],
      });
      break;
    }
    case IlluminanceLevel.BrightLight: {
      await spotifyApi.play({
        uris: ["spotify:track:078Rs12cNKn8qtt3blVDw4"],
      });
      break;
    }
    case IlluminanceLevel.FullBrightness: {
      await spotifyApi.play({
        uris: ["spotify:track:078Rs12cNKn8qtt3blVDw4"],
      });
      break;
    }
  }
}